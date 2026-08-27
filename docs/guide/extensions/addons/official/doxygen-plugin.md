---
outline: deep
---

# doxygen-plugin

[doxygen-plugin](https://github.com/xmake-addons/doxygen-plugin) provides the `xmake doxygen`
command, which generates the doxygen document of your project.

| Payload | What it provides |
| --- | --- |
| `plugins/doxygen` | the `xmake doxygen` command |

It generates a `doxyfile` from the project when there is none — the project name, version,
source directory and output directory are filled in for you — and installs `doxygen` when it
is missing.

::: tip NOTE
This command used to be built into xmake and now ships as an addon. The builtin one still
works but is deprecated: it prints a notice pointing at the addon, and an installed addon
takes over the command.
:::

## Installation

```sh
$ xmake addon --install doxygen-plugin
```

## Usage

```sh
$ xmake doxygen                    # generate it, the source directory defaults to src
$ xmake doxygen -o /tmp/docs mysrc # a custom output and source directory
```

| Option | Default | Description |
| --- | --- | --- |
| `-o, --outputdir` | the build directory | the output directory of the document |
| `srcdir` | `src` | the source code directory |

When it is done, it prints the path of the result page, i.e. `<outputdir>/html/index.html`.
