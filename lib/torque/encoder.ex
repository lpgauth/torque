defprotocol Torque.Encoder do
  @moduledoc """
  Optional protocol for encoding Elixir structs as JSON.

  Torque's NIF encoder rejects structs (maps carrying an atom
  `__struct__` key) with `{:error, :unhandled_struct}`. When a struct
  implements this protocol, `encode/1` runs it first and encodes the
  returned term instead, recursively.

  The protocol is deliberately opt-in: a struct without an
  implementation is an error, never silently dropped fields.

  Torque ships implementations for `Date`, `Time`, `NaiveDateTime`, and
  `DateTime`, each encoding as its ISO 8601 string.

  ## Deriving

  Structs can derive the implementation, encoding all fields or a
  subset via `:only` / `:except`:

      @derive {Torque.Encoder, only: [:id, :name]}
      defstruct [:id, :name, :secret]

      @derive {Torque.Encoder, except: [:secret]}
      defstruct [:id, :name, :secret]

  > Prefer `:only` to avoid accidentally leaking private information
  > when new fields are added later.

  ## Example

      defimpl Torque.Encoder, for: Decimal do
        def encode(decimal), do: Decimal.to_string(decimal)
      end

      Torque.encode!(%{price: Decimal.new("37.50")})
      #=> ~s({"price":"37.50"})

  ## Implementation contract

  `encode/1` must return a term that can be encoded without expanding the
  same struct again. Returning the struct itself, or a term containing it,
  would expand forever; expansion is bounded at 128 levels and encoding
  fails with `:encoder_expansion_too_deep` beyond that bound.
  """

  @fallback_to_any true

  @spec encode(term()) :: term()
  def encode(term)
end

defimpl Torque.Encoder, for: Any do
  # The deriving macro lives in the Any implementation, not in the protocol
  # body, and takes the `__deriving__/3` shape. Both are forced by Elixir 1.17:
  # it rejects `defmacro` inside `defprotocol`, and Protocol.derive/5 there
  # resolves `__deriving__/3` through `Module.concat(protocol, Any)` only. The
  # `/2`-in-the-protocol form that 1.18+ prefers cannot compile on 1.17.
  #
  # `struct` is the struct's default value, so field names come from it rather
  # than Macro.struct_info!/2, which does not exist before 1.18.
  defmacro __deriving__(module, struct, opts) do
    fields = fields_to_encode(Map.keys(struct), opts)

    quote do
      defimpl Torque.Encoder, for: unquote(module) do
        def encode(struct) do
          Map.take(struct, unquote(fields))
        end
      end
    end
  end

  defp fields_to_encode(fields, opts) do
    # `:__struct__` is never encodable: taking it would rebuild a map the NIF
    # re-reads as a struct, which then expands through this same
    # implementation until the expansion bound stops it.
    encodable = fields -- [:__struct__]

    only = Keyword.get(opts, :only)
    except = Keyword.get(opts, :except)

    if only && except do
      raise ArgumentError, ":only and :except are mutually exclusive, pass one or the other"
    end

    cond do
      only -> validate!(only, encodable, :only)
      except -> encodable -- validate!(except, encodable, :except)
      true -> encodable
    end
  end

  defp validate!(requested, encodable, opt) do
    case requested -- encodable do
      [] ->
        requested

      unknown ->
        raise ArgumentError,
              "unknown struct fields #{inspect(unknown)} specified in #{inspect(opt)}. " <>
                "Expected one of: #{inspect(encodable)}"
    end
  end

  # The Any fallback passes structs through untouched, so a struct without an
  # explicit implementation still fails in the NIF with `:unhandled_struct`
  # after the retry — it is never silently dropped.
  @impl true
  def encode(term), do: term
end

defimpl Torque.Encoder, for: Date do
  def encode(date), do: Date.to_iso8601(date)
end

defimpl Torque.Encoder, for: Time do
  def encode(time), do: Time.to_iso8601(time)
end

defimpl Torque.Encoder, for: NaiveDateTime do
  def encode(naive), do: NaiveDateTime.to_iso8601(naive)
end

defimpl Torque.Encoder, for: DateTime do
  def encode(datetime), do: DateTime.to_iso8601(datetime)
end
