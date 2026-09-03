defmodule Torque.Build do
  @moduledoc false

  # Capture TORQUE_BUILD so changing it invalidates this module and, through
  # `force_build?/0`, Torque.Native. Otherwise an existing `_build` tree can
  # keep loading a released NIF while local Rust changes appear to pass tests.
  # This cannot live in Torque.Native because a failed on-load makes that
  # module unavailable to Mix's staleness check.
  @captured System.get_env("TORQUE_BUILD")
  @force_build @captured in ["1", "true"]

  def force_build?, do: @force_build

  @doc false
  def __mix_recompile__?, do: System.get_env("TORQUE_BUILD") != @captured
end
