defmodule Torque.CPU do
  @moduledoc false

  def avx2? do
    case System.get_env("TORQUE_CPU_VARIANT") do
      "v3" -> true
      nil -> detect("avx2", "hw.optional.avx2_0")
      _ -> false
    end
  end

  def sse42? do
    case System.get_env("TORQUE_CPU_VARIANT") do
      "v2" -> true
      nil -> detect("sse4_2", "hw.optional.sse4_2")
      _ -> false
    end
  end

  defp detect(linux_flag, darwin_sysctl) do
    case :os.type() do
      {:unix, :linux} -> linux_has_flag?(linux_flag)
      {:unix, :darwin} -> darwin_has_feature?(darwin_sysctl)
      _ -> false
    end
  end

  defp linux_has_flag?(flag) do
    case File.read("/proc/cpuinfo") do
      {:ok, content} ->
        content
        |> String.split("\n")
        |> Enum.any?(&(String.starts_with?(&1, "flags") and String.contains?(&1, flag)))

      _ ->
        false
    end
  end

  defp darwin_has_feature?(name) do
    case System.cmd("sysctl", ["-n", name], stderr_to_stdout: true) do
      {"1\n", 0} -> true
      _ -> false
    end
  end
end
