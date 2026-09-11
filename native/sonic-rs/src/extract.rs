//! Prepared multi-path extraction for Torque.
//!
//! Plans are reused across documents. Selected values are parsed; unselected
//! regions are parsed or structurally skipped according to [`Validate`].
//! Repeatable keys are last-wins; [`Keys::Unique`] permits first-match early exit.
//!
//! This Torque-owned module opts back into lints disabled by the vendored crate.
#![deny(warnings)]
#![deny(clippy::all)]

use std::sync::Arc;

use ahash::AHashMap;

use sonic_number::ParserNumber;

use crate::{
    error::{ErrorCode, Result},
    parser::Reference,
    parser::{restore_neg_zero, Parser, MAX_PARSE_DEPTH},
    reader::{Read, Reader},
    util::utf8::from_utf8,
    value::shared::Shared,
    JsonInput, JsonValueTrait, Value,
};

/// Compiled pointer segment. Numeric tokens retain object-key and array-index
/// forms. Keys borrow from the compiled path; the plan copies only new keys.
#[derive(Debug, Clone, Copy)]
pub enum Seg<'a> {
    /// Matches an object key only.
    Key(&'a str),
    /// Matches an array index, or the same digits used as an object key.
    Index { idx: usize, key: &'a str },
}

/// Whether the regions no path selects are validated while being skipped.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Validate {
    /// Parses skipped regions, matching full-document validation.
    Yes,
    /// Uses structural SIMD skipping. Syntax errors inside unselected regions
    /// are not reported, but consumed UTF-8 and literals remain validated.
    No,
}

/// Whether object keys are promised to be unique.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Keys {
    /// A key may repeat, and the last occurrence wins.
    Repeatable,
    /// No key repeats, so the first match stands.
    Unique,
}

#[derive(Debug, Default)]
struct Node {
    /// Parent in the key-edge tree; numeric edges alias those same children.
    parent: u32,
    /// Object-key edges in insertion order.
    keys: Vec<(String, u32)>,
    /// Array-index edges, sorted by `finish`; unfinished plans use `array_index`.
    indices: Vec<(usize, u32)>,
    indices_sorted: bool,
    /// Wide numeric nodes deduplicate during construction and support lookup
    /// before `finish`, or after more paths have been added.
    #[allow(clippy::box_collection)]
    array_index: Option<Box<AHashMap<usize, u32>>>,
    /// First result slot ending at this node; duplicates alias it in the plan.
    slot: Option<u32>,
    /// Wide-node key-to-position index, retained for extraction as well as
    /// construction.
    #[allow(clippy::box_collection)]
    index: Option<Box<AHashMap<String, u32>>>,
}

/// Immutable extraction plan built from an ordered path set.
#[derive(Debug)]
pub struct ExtractPlan {
    nodes: Vec<Node>,
    result_slots: Vec<usize>,
}

/// Child count above which a node indexes its children instead of scanning
/// them. Below roughly sixteen the scan still wins, so this stays clear of it.
const INDEX_KEYS_ABOVE: usize = 32;

impl Default for ExtractPlan {
    fn default() -> Self {
        Self::new()
    }
}

impl ExtractPlan {
    pub fn new() -> Self {
        Self {
            nodes: vec![Node::default()],
            result_slots: Vec::new(),
        }
    }

    /// Adds a path and assigns its result slot. Empty and duplicate paths keep
    /// distinct slots; paths beyond the parser nesting limit are not walked.
    pub fn add_path<'s>(&mut self, segs: impl ExactSizeIterator<Item = Seg<'s>>) {
        let slot = self.result_slots.len();
        self.result_slots.push(slot);
        if segs.len() > MAX_PARSE_DEPTH {
            return;
        }

        let mut cur = 0usize;
        for seg in segs {
            cur = match seg {
                Seg::Key(k) => self.child_for_key(cur, k),
                Seg::Index { idx, key } => {
                    // Share one child between the key and index interpretations.
                    let child = self.child_for_key(cur, key);
                    self.add_index(cur, idx, child as u32);
                    child
                }
            };
        }
        let terminal = self.nodes[cur].slot.get_or_insert(slot as u32);
        self.result_slots[slot] = *terminal as usize;
    }

    /// Prepares forward array walks and releases construction slack. Extraction
    /// also accepts unfinished plans, and paths may still be added afterwards.
    pub fn finish(&mut self) {
        for node in &mut self.nodes {
            node.indices.sort_unstable_by_key(|&(idx, _)| idx);
            node.indices_sorted = true;
        }
        self.nodes.shrink_to_fit();
    }

    fn add_index(&mut self, at: usize, idx: usize, child: u32) {
        let node = &mut self.nodes[at];
        if node.array_index.is_none() && node.indices.len() == INDEX_KEYS_ABOVE {
            node.array_index = Some(Box::new(node.indices.iter().copied().collect()));
        }
        if let Some(map) = node.array_index.as_mut() {
            match map.entry(idx) {
                std::collections::hash_map::Entry::Occupied(_) => return,
                std::collections::hash_map::Entry::Vacant(entry) => {
                    entry.insert(child);
                }
            }
        } else if node.indices.iter().any(|&(i, _)| i == idx) {
            // This scan is bounded by INDEX_KEYS_ABOVE, regardless of plan size.
            return;
        }
        if node.indices.last().is_some_and(|&(last, _)| last > idx) {
            node.indices_sorted = false;
        }
        node.indices.push((idx, child));
    }

    /// Returns the matching child and its position in `keys`; callers mark the
    /// position in their seen-set.
    #[inline]
    pub(crate) fn lookup(&self, at: usize, key: &str) -> Option<(usize, u32)> {
        let node = &self.nodes[at];
        if let Some(map) = node.index.as_ref() {
            let i = *map.get(key)? as usize;
            return Some((i, node.keys[i].1));
        }
        // One pass, returning the child directly: re-indexing `keys` after a
        // `position` cost the narrow nodes this scan exists to serve.
        for (i, (k, child)) in node.keys.iter().enumerate() {
            if k == key {
                return Some((i, *child));
            }
        }
        None
    }

    fn child_for_key(&mut self, at: usize, key: &str) -> usize {
        if let Some((_, child)) = self.lookup(at, key) {
            return child as usize;
        }
        if self.nodes[at].index.is_none() && self.nodes[at].keys.len() == INDEX_KEYS_ABOVE {
            // Index existing children once, then hash subsequent additions.
            let map: AHashMap<String, u32> = self.nodes[at]
                .keys
                .iter()
                .enumerate()
                .map(|(i, (k, _))| (k.clone(), i as u32))
                .collect();
            self.nodes[at].index = Some(Box::new(map));
        }

        self.nodes.push(Node {
            parent: at as u32,
            ..Node::default()
        });
        let child = self.nodes.len() - 1;
        let owned = key.to_string();
        let position = self.nodes[at].keys.len() as u32;
        if let Some(map) = self.nodes[at].index.as_mut() {
            map.insert(owned.clone(), position);
        }
        self.nodes[at].keys.push((owned, child as u32));
        child
    }
}

/// Extracted value. Unescaped strings may borrow the input; all other values
/// own their storage through `Value`.
#[derive(Debug, Clone)]
pub enum Extracted<'de> {
    /// Bytes inside the input, valid UTF-8, no escapes.
    Str(&'de str),
    /// Anything else: containers, numbers, literals, and strings that had to be
    /// unescaped into scratch space.
    Value(Value),
}

/// Extracts every planned path in insertion order. Missing paths return `None`.
pub fn extract<'de, Input: JsonInput<'de>>(
    json: Input,
    plan: &ExtractPlan,
    validate: Validate,
    keys: Keys,
) -> Result<Vec<Option<Extracted<'de>>>> {
    let mut out = extract_unique(json, plan, validate, keys)?;
    for (slot, &canonical) in plan.result_slots.iter().enumerate() {
        if slot != canonical {
            out[slot] = out[canonical].clone();
        }
    }
    Ok(out)
}

/// Extracts each plan terminal once. Duplicate paths share a terminal, so only
/// the canonical slot of each is populated; [`extract`] expands the rest.
fn extract_unique<'de, Input: JsonInput<'de>>(
    json: Input,
    plan: &ExtractPlan,
    validate: Validate,
    keys: Keys,
) -> Result<Vec<Option<Extracted<'de>>>> {
    let slice = json.to_u8_slice();
    // `Value` stores offsets in `u32`, so enforce the same bound as full parsing.
    if slice.len() > u32::MAX as usize {
        return Err(crate::error::make_error(format!(
            "Only support JSON less than 4 GB, the input JSON is too large here, len is {}",
            slice.len()
        )));
    }
    let reader = Read::new(slice, false);
    let mut parser = Parser::new(reader);

    let mut out: Vec<Option<Extracted<'de>>> = vec![None; plan.result_slots.len()];
    // Escaped strings share this scratch buffer. Documents without escapes do
    // not allocate it.
    let mut strbuf = Vec::new();
    let mut ex = Extractor {
        plan,
        out: &mut out,
        checked: validate == Validate::Yes,
        first_wins: keys == Keys::Unique,
        stamps: Vec::new(),
        generation: 0,
        live: Vec::new(),
    };
    ex.value(&mut parser, &mut strbuf, 0, 0)?;

    if validate == Validate::Yes {
        // Match full parsing's trailing-content check.
        parser.parse_trailing()?;
    }

    let index = parser.read.index();
    if json.need_utf8_valid() {
        from_utf8(&slice[..index])?;
    }
    Ok(out)
}

/// Plan keys a single object can track in one word.
const INLINE_SEEN: usize = 64;

/// Records which of a plan node's keys the object being walked has already
/// supplied, so a repeated key is recognised at any plan width.
enum Seen {
    /// Bit per plan key, for nodes up to `INLINE_SEEN` keys wide.
    Inline(u64),
    /// Stamp written into `Extractor::stamps` at each child's node index.
    /// Wider nodes cost one scratch allocation for the whole extraction
    /// rather than a bitset per object.
    Stamped(u32),
}

const UNLINKED: u32 = u32::MAX;

/// Intrusive lists of result-bearing branches. Zero ends a child list because
/// the root is never a child; UNLINKED distinguishes its last entry from a node
/// not in a list. Cleared branches can remain linked until their parent clears.
#[derive(Clone, Copy)]
struct Live {
    child: u32,
    next: u32,
}

struct Extractor<'p, 'o, 'de> {
    plan: &'p ExtractPlan,
    out: &'o mut Vec<Option<Extracted<'de>>>,
    checked: bool,
    first_wins: bool,
    /// Stamp per plan node, indexed by node id. Empty until a node wider than
    /// `INLINE_SEEN` is entered, so narrow plans never allocate it.
    stamps: Vec<u32>,
    /// Stamp handed to the most recently entered wide object.
    generation: u32,
    /// Initialized from existing results only on the first repeated key. The
    /// duplicate-free request path never allocates or maintains these lists.
    live: Vec<Live>,
}

impl<'de> Extractor<'_, '_, 'de> {
    /// Prepares duplicate tracking for an object whose plan node has `keys`
    /// planned keys.
    #[inline]
    fn new_seen(&mut self, keys: usize) -> Seen {
        if keys <= INLINE_SEEN {
            return Seen::Inline(0);
        }
        if self.stamps.is_empty() {
            let nodes = self.plan.nodes.len();
            self.stamps = vec![0; nodes];
        }
        // One stamp per wide object entered, so this is bounded by the
        // document's `{` count and the 4 GB input cap keeps it under u32::MAX.
        self.generation += 1;
        Seen::Stamped(self.generation)
    }

    /// Records plan key `i`, whose child node is `child`, as supplied by the
    /// object being walked. Reports whether it had already been supplied.
    #[inline]
    fn mark(&mut self, seen: &mut Seen, i: usize, child: u32) -> bool {
        match seen {
            Seen::Inline(bits) => {
                let bit = 1u64 << i;
                let already = *bits & bit != 0;
                *bits |= bit;
                already
            }
            Seen::Stamped(generation) => {
                let slot = &mut self.stamps[child as usize];
                let already = *slot == *generation;
                *slot = *generation;
                already
            }
        }
    }

    /// Handles the current parser value for one plan node. `depth` is shared by
    /// planned descent, skipped regions, and selected subtrees so extraction
    /// enforces the full parser's single nesting budget.
    fn value<R: Reader<'de>>(
        &mut self,
        parser: &mut Parser<R>,
        strbuf: &mut Vec<u8>,
        node: u32,
        depth: usize,
    ) -> Result<()> {
        let n = &self.plan.nodes[node as usize];

        // A terminal node needs the whole value. Resolve any longer paths from
        // that value when one requested path prefixes another.
        if let Some(slot) = n.slot {
            let value = parse_value_in_place(parser, strbuf, depth)?;
            if !self.live.is_empty() {
                self.activate(node);
            }
            // Only owned container values can have planned descendants.
            if !n.keys.is_empty() {
                if let Extracted::Value(v) = &value {
                    self.descend_value(v, node);
                }
            }
            self.out[slot as usize] = Some(value);
            return Ok(());
        }

        match parser.skip_space_peek() {
            Some(b'{') if !n.keys.is_empty() => self.object(parser, strbuf, node, depth),
            Some(b'[') if !n.indices.is_empty() => self.array(parser, strbuf, node, depth),
            Some(_) => {
                parser.skip_one_value_at(self.checked, depth)?;
                Ok(())
            }
            None => Err(parser.error(ErrorCode::EofWhileParsing)),
        }
    }

    fn object<R: Reader<'de>>(
        &mut self,
        parser: &mut Parser<R>,
        strbuf: &mut Vec<u8>,
        node: u32,
        depth: usize,
    ) -> Result<()> {
        if depth >= MAX_PARSE_DEPTH {
            return Err(parser.error(ErrorCode::RecursionLimitExceeded));
        }
        parser.read.eat(1);
        match parser.skip_space() {
            Some(b'"') => {}
            Some(b'}') => return Ok(()),
            _ => return Err(parser.error(ErrorCode::ExpectObjectKeyOrEnd)),
        }

        // Resolve once: the plan is immutable, and checking the index per key
        // measurably penalizes narrow nodes.

        let plan_node = &self.plan.nodes[node as usize];
        let keys = plan_node.keys.as_slice();
        let index = plan_node.index.as_deref();

        let wanted = keys.len();
        let mut seen = self.new_seen(wanted);
        let mut found = 0usize;
        loop {
            let matched = {
                let key = parser.parse_str(strbuf)?;
                let key: &str = &key;
                match index {
                    Some(map) => map.get(key).map(|&i| (i as usize, keys[i as usize].1)),
                    None => keys
                        .iter()
                        .position(|(k, _)| k == key)
                        .map(|i| (i, keys[i].1)),
                }
            };
            parser.parse_object_clo()?;

            match matched {
                Some((i, child)) => {
                    let already = self.mark(&mut seen, i, child);
                    if self.first_wins && already {
                        // Under the uniqueness promise, the first value already stands.
                        parser.skip_one_value_at(self.checked, depth + 1)?;
                    } else {
                        if already {
                            // Invalidate only branches that supplied results,
                            // not every descendant the plan could have selected.
                            self.clear(child);
                        } else {
                            found += 1;
                        }
                        self.value(parser, strbuf, child, depth + 1)?;
                    }
                }
                None => {
                    parser.skip_one_value_at(self.checked, depth + 1)?;
                }
            }

            // With no validation or keys left to find, skip the object remainder.
            if self.first_wins && !self.checked && found == wanted {
                return parser.skip_container(b'{', b'}');
            }

            match parser.skip_space() {
                Some(b',') => match parser.skip_space() {
                    Some(b'"') => continue,
                    _ => return Err(parser.error(ErrorCode::ExpectObjectKeyOrEnd)),
                },
                Some(b'}') => return Ok(()),
                Some(_) => return Err(parser.error(ErrorCode::ExpectedObjectCommaOrEnd)),
                None => return Err(parser.error(ErrorCode::EofWhileParsing)),
            }
        }
    }

    fn array<R: Reader<'de>>(
        &mut self,
        parser: &mut Parser<R>,
        strbuf: &mut Vec<u8>,
        node: u32,
        depth: usize,
    ) -> Result<()> {
        if depth >= MAX_PARSE_DEPTH {
            return Err(parser.error(ErrorCode::RecursionLimitExceeded));
        }
        parser.read.eat(1);
        if let Some(b']') = parser.skip_space_peek() {
            parser.read.eat(1);
            return Ok(());
        }

        let plan_node = &self.plan.nodes[node as usize];
        let mut indices = plan_node.indices.iter().peekable();
        let mut left = plan_node.indices.len();
        let mut at = 0usize;
        loop {
            let child = if plan_node.indices_sorted {
                if indices.peek().is_some_and(|&&(idx, _)| idx == at) {
                    indices.next().map(|&(_, child)| child)
                } else {
                    None
                }
            } else if let Some(index) = &plan_node.array_index {
                index.get(&at).copied()
            } else {
                // Unfinished narrow plans retain the bounded scan.
                plan_node
                    .indices
                    .iter()
                    .find(|&&(idx, _)| idx == at)
                    .map(|&(_, child)| child)
            };
            match child {
                Some(child) => {
                    left -= 1;
                    self.value(parser, strbuf, child, depth + 1)?
                }
                None => {
                    parser.skip_one_value_at(self.checked, depth + 1)?;
                }
            }
            at += 1;

            // No index repeats, so with no validation or indices left to find,
            // skip the array remainder. Unlike an object this needs no
            // uniqueness promise: a later element cannot replace an earlier one.
            if !self.checked && left == 0 {
                return parser.skip_container(b'[', b']');
            }

            match parser.skip_space() {
                Some(b',') => continue,
                Some(b']') => return Ok(()),
                Some(_) => return Err(parser.error(ErrorCode::ExpectedArrayCommaOrEnd)),
                None => return Err(parser.error(ErrorCode::EofWhileParsing)),
            }
        }
    }

    /// Links a result's ancestors once, stopping at a branch already represented.
    fn activate(&mut self, mut node: u32) {
        while node != 0 && self.live[node as usize].next == UNLINKED {
            let parent = self.plan.nodes[node as usize].parent as usize;
            self.live[node as usize].next = self.live[parent].child;
            self.live[parent].child = node;
            node = parent as u32;
        }
    }

    /// The first repeat pays one plan scan to discover existing results. Later
    /// invalidations walk only branches populated since their ancestor last
    /// cleared, so missing descendants cannot multiply the document's work.
    fn clear(&mut self, node: u32) {
        if self.live.is_empty() {
            self.live = vec![
                Live {
                    child: 0,
                    next: UNLINKED,
                };
                self.plan.nodes.len()
            ];
            for (id, n) in self.plan.nodes.iter().enumerate() {
                if n.slot.is_some_and(|slot| self.out[slot as usize].is_some()) {
                    self.activate(id as u32);
                }
            }
        }
        self.clear_live(node);
    }

    fn clear_live(&mut self, node: u32) {
        if let Some(slot) = self.plan.nodes[node as usize].slot {
            self.out[slot as usize] = None;
        }
        let mut child = self.live[node as usize].child;
        self.live[node as usize].child = 0;
        while child != 0 {
            self.clear_live(child);
            let next = self.live[child as usize].next;
            self.live[child as usize].next = UNLINKED;
            child = next;
        }
    }

    /// Resolves descendants from an already-built value when one path prefixes another.
    fn descend_value(&mut self, value: &Value, node: u32) {
        let n = &self.plan.nodes[node as usize];
        if value.is_object() {
            for (key, child) in n.keys.iter() {
                let hit = if self.first_wins {
                    value.get(key.as_str())
                } else {
                    last_key(value, key)
                };
                if let Some(v) = hit {
                    self.fill(v, *child);
                }
            }
        } else if value.is_array() {
            for (idx, child) in n.indices.iter() {
                if let Some(v) = value.get(*idx) {
                    self.fill(v, *child);
                }
            }
        }
    }

    fn fill(&mut self, value: &Value, node: u32) {
        let n = &self.plan.nodes[node as usize];
        if let Some(slot) = n.slot {
            self.out[slot as usize] = Some(Extracted::Value(value.clone()));
        }
        if n.slot.is_some() && !self.live.is_empty() {
            self.activate(node);
        }
        if !n.keys.is_empty() {
            self.descend_value(value, node);
        }
    }
}

/// Last matching object value, preserving the document walk's duplicate rule.
fn last_key<'v>(value: &'v Value, key: &str) -> Option<&'v Value> {
    match value.as_pair_slice() {
        Some(pairs) => pairs
            .iter()
            .rfind(|(k, _)| k.as_node_str() == Some(key))
            .map(|(_, v)| v),
        // Hash-map-backed values cannot contain duplicate keys.
        None => value.get(key),
    }
}

/// Parses the current value in place. Scalars are built directly, unescaped
/// strings borrow the input, and only containers need an arena.
fn parse_value_in_place<'de, R: Reader<'de>>(
    parser: &mut Parser<R>,
    strbuf: &mut Vec<u8>,
    depth: usize,
) -> Result<Extracted<'de>> {
    match parser.skip_space_peek() {
        Some(b'{') | Some(b'[') => {
            let mut shared = Arc::new(Shared::default());
            let ptr = Arc::as_ptr(&shared);
            // Expose the original Arc allocation, including its header, before
            // narrowing to &mut Shared. pack_shared reconstructs that header
            // through with_exposed_provenance to increment the strong count.
            ptr.expose_provenance();
            let smut: &mut Shared = unsafe { &mut *(ptr as *mut _) };
            let mut parsed = Value::new();
            parsed.parse_without_padding(smut, strbuf, parser, depth)?;
            let _ = Arc::get_mut(&mut shared);
            Ok(Extracted::Value(parsed))
        }
        Some(b'"') => {
            parser.read.eat(1);
            match parser.parse_str(strbuf)? {
                // Borrow unescaped input; copy parser scratch before it is reused.
                Reference::Borrowed(s) => Ok(Extracted::Str(s)),
                Reference::Copied(s) => Ok(Extracted::Value(Value::copy_str(s))),
            }
        }
        Some(c @ b'-') | Some(c @ b'0'..=b'9') => {
            let start = parser.read.index();
            parser.read.eat(1);
            match parser.parse_number(c)? {
                ParserNumber::Unsigned(u) => Ok(Extracted::Value(Value::new_u64(u))),
                ParserNumber::Signed(i) => Ok(Extracted::Value(Value::new_i64(i))),
                ParserNumber::Float(f) => {
                    // Preserve negative zero across every decode path.
                    let token = parser.read.slice_unchecked(start, parser.read.index());
                    Value::new_f64(restore_neg_zero(f, token))
                        .map(Extracted::Value)
                        .ok_or_else(|| parser.error(ErrorCode::InvalidNumber))
                }
            }
        }
        Some(_) => {
            let (slice, _) = parser.skip_one(true)?;
            match slice {
                b"true" => Ok(Extracted::Value(Value::new_bool(true))),
                b"false" => Ok(Extracted::Value(Value::new_bool(false))),
                b"null" => Ok(Extracted::Value(Value::new_null())),
                _ => Err(parser.error(ErrorCode::InvalidJsonValue)),
            }
        }
        None => Err(parser.error(ErrorCode::EofWhileParsing)),
    }
}
