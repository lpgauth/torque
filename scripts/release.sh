#!/usr/bin/env bash
set -euo pipefail

VERSION=$(sed -n 's/^  @version "\(.*\)"/\1/p' mix.exs | head -n1)
TAG="v${VERSION}"

if [ -z "$VERSION" ]; then
  echo "error: could not extract version from mix.exs"
  exit 1
fi

echo "==> Releasing torque ${TAG}"

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "error: uncommitted changes, commit or stash first"
  exit 1
fi

# Check tag doesn't already exist
if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "error: tag ${TAG} already exists"
  exit 1
fi

# Check gh CLI is available
if ! command -v gh >/dev/null 2>&1; then
  echo "error: gh CLI not found (brew install gh)"
  exit 1
fi

# Create and push tag
echo "==> Creating tag ${TAG}"
git tag "$TAG"
git push origin "$TAG"

# Wait for release workflow
echo "==> Waiting for release workflow to start..."
sleep 5

RUN_ID=""
for i in $(seq 1 10); do
  RUN_ID=$(gh run list --workflow=release.yml --branch="$TAG" --json databaseId --jq '.[0].databaseId' 2>/dev/null || true)
  if [ -n "$RUN_ID" ]; then
    break
  fi
  echo "    waiting for workflow to appear... (${i}/10)"
  sleep 5
done

if [ -z "$RUN_ID" ]; then
  echo "error: could not find release workflow run"
  echo "check: https://github.com/lpgauth/torque/actions"
  exit 1
fi

echo "==> Watching workflow run ${RUN_ID}..."
echo "    https://github.com/lpgauth/torque/actions/runs/${RUN_ID}"
gh run watch "$RUN_ID" --exit-status

# Publish draft release
echo "==> Publishing release ${TAG}..."
gh release edit "$TAG" --draft=false

# Generate checksums
echo "==> Generating checksums..."
TORQUE_BUILD=true mix rustler_precompiled.download Torque.Native --all --print

echo "==> Checksums written to checksum-Elixir.Torque.Native.exs"
echo ""
echo "Next steps:"
echo "  1. git add checksum-Elixir.Torque.Native.exs"
echo "  2. git commit -m 'Add checksums for ${TAG}'"
echo "  3. git push origin main"
echo "  4. mix hex.publish"
