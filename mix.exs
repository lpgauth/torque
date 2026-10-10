defmodule Mix.Tasks.Compile.TorqueNif do
  @moduledoc false
  use Mix.Task.Compiler

  # Puts the NIF in priv/native with the same script rebar3 builds run
  # (rebar/fetch_nif.escript), so the package needs no Mix-only dependencies.
  # The published package has no priv/, so it may not exist when Mix links
  # the app's build directory; link it once the script has made it.
  @impl true
  def run(_args) do
    root = Path.dirname(Mix.Project.project_file())

    case System.cmd("escript", ["rebar/fetch_nif.escript"], cd: root, stderr_to_stdout: true) do
      {output, 0} ->
        IO.write(output)

        Mix.Utils.symlink_or_copy(
          Path.join(root, "priv"),
          Path.join(Mix.Project.app_path(), "priv")
        )

        {:ok, []}

      {output, status} ->
        Mix.raise("torque: rebar/fetch_nif.escript exited with #{status}\n" <> output)
    end
  end
end

defmodule Torque.MixProject do
  use Mix.Project

  @version "0.5.1"
  @source_url "https://github.com/lpgauth/torque"

  def project do
    [
      app: :torque,
      version: @version,
      elixir: "~> 1.15",
      start_permanent: Mix.env() == :prod,
      # Test fixtures define Torque.Encoder implementations at load time,
      # after consolidation would have run, so the protocol has to stay open
      # in test. Every other env consolidates it.
      consolidate_protocols: Mix.env() != :test,
      compilers: [:torque_nif | Mix.compilers()],
      deps: deps(),
      package: package(),
      description:
        "High-performance JSON library for Elixir and Erlang via Rustler NIFs (sonic-rs)",
      docs: docs(),
      source_url: @source_url,
      homepage_url: @source_url
    ]
  end

  def application do
    [extra_applications: [:logger]]
  end

  defp docs do
    [
      main: "Torque",
      source_ref: "v#{@version}",
      extras: [
        "README.md": [title: "Overview"],
        "guides/erlang.md": [title: "Erlang API"],
        LICENSE: [title: "License"]
      ],
      # The Erlang `torque` module is documented by guides/erlang.md: its page
      # would be torque.html, which overwrites Torque.html on the
      # case-insensitive filesystem releases build docs on.
      filter_modules: fn module, _meta -> module != :torque end,
      groups_for_docs: [
        Decoding: &(&1[:group] == :decode),
        Encoding: &(&1[:group] == :encode),
        "Parse + Get": &(&1[:group] == :parse_get)
      ]
    ]
  end

  defp deps do
    [
      {:benchee, "~> 1.3", only: :bench},
      {:dialyxir, "~> 1.4", only: :dev, runtime: false},
      {:ex_doc, "~> 0.35", only: :dev, runtime: false},
      {:glazer, "~> 1.1", only: :bench},
      {:jason, "~> 1.4", only: [:test, :bench]},
      {:jiffy, "~> 2.0", only: :bench},
      {:stream_data, "~> 1.1", only: :test}
    ]
  end

  defp package do
    [
      licenses: ["MIT"],
      links: %{"GitHub" => @source_url, "Docs" => "https://hexdocs.pm/torque"},
      build_tools: ["mix", "rebar3"],
      files: ~w(
        lib
        src
        rebar
        rebar.config
        native/torque_nif/src
        native/torque_nif/Cargo.toml
        native/sonic-rs/src
        native/sonic-rs/Cargo.toml
        native/sonic-rs/LICENSE
        Cargo.toml
        Cargo.lock
        Cross.toml
        checksums.txt
        mix.exs
        README.md
        LICENSE
        .formatter.exs
      )
    ]
  end
end
