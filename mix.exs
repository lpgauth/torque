defmodule Torque.MixProject do
  use Mix.Project

  @version "0.1.8"
  @source_url "https://github.com/lpgauth/torque"

  def project do
    [
      app: :torque,
      version: @version,
      elixir: "~> 1.15",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      package: package(),
      description: "High-performance JSON library for Elixir via Rustler NIFs (sonic-rs)",
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
      extras: ["README.md": [title: "Overview"], LICENSE: [title: "License"]],
      groups_for_docs: [
        Decoding: &(&1[:group] == :decode),
        Encoding: &(&1[:group] == :encode),
        "Parse + Get": &(&1[:group] == :parse_get)
      ]
    ]
  end

  defp deps do
    [
      {:rustler_precompiled, "~> 0.8"},
      {:rustler, ">= 0.0.0", optional: true},
      {:ex_doc, "~> 0.35", only: :dev, runtime: false},
      {:dialyxir, "~> 1.4", only: :dev, runtime: false},
      {:jason, "~> 1.4"},
      {:stream_data, "~> 1.1", only: :test},
      {:simdjsone, "~> 0.5.0", only: :bench},
      {:jiffy, "~> 1.1", only: :bench},
      {:benchee, "~> 1.3", only: [:bench, :dev]}
    ]
  end

  defp package do
    [
      licenses: ["MIT"],
      links: %{"GitHub" => @source_url},
      files: ~w(
        lib
        native/torque_nif/src
        native/torque_nif/Cargo.toml
        native/torque_nif/.cargo
        Cargo.toml
        Cargo.lock
        Cross.toml
        checksum-*.exs
        mix.exs
        README.md
        LICENSE
        .formatter.exs
      )
    ]
  end
end
