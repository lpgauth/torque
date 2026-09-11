defprotocol Torque.Encoder do
  @moduledoc """
  Optional protocol for encoding Elixir structs as JSON.

  Torque's NIF encoder rejects structs (maps carrying an atom
  `__struct__` key) with `{:error, :unhandled_struct}`. When a struct
  implements this protocol, `encode/1` runs it first and encodes the
  returned term instead, recursively.

  The protocol is deliberately opt-in: a struct without an
  implementation is an error, never silently dropped fields.

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
  expands forever; expansion is bounded and raises `ArgumentError` beyond
  that bound.
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
    cond do
      only = Keyword.get(opts, :only) ->
        case only -- fields do
          [] ->
            only

          error_keys ->
            raise ArgumentError,
                  "unknown struct fields #{inspect(error_keys)} specified in :only. " <>
                    "Expected one of: #{inspect(fields -- [:__struct__])}"
        end

      except = Keyword.get(opts, :except) ->
        case except -- fields do
          [] ->
            fields -- [:__struct__ | except]

          error_keys ->
            raise ArgumentError,
                  "unknown struct fields #{inspect(error_keys)} specified in :except. " <>
                    "Expected one of: #{inspect(fields -- [:__struct__])}"
        end

      true ->
        fields -- [:__struct__]
    end
  end

  # The Any fallback passes structs through untouched, so a struct without an
  # explicit implementation still fails in the NIF with `:unhandled_struct`
  # after the retry — it is never silently dropped.
  @impl true
  def encode(term), do: term
end
