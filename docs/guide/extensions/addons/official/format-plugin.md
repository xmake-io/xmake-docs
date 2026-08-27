---
outline: deep
---

# format-plugin

[format-plugin](https://github.com/xmake-addons/format-plugin) provides the `xmake format`
command, which formats the sources of your project with clang-format.

| Payload | What it provides |
| --- | --- |
| `plugins/format` | the `xmake format` command |

It formats exactly the files your targets own, so generated code and third-party sources
outside of the targets are never touched. `clang-format` is installed from xmake-repo when it
is not on the host.

::: tip NOTE
This command used to be built into xmake and now ships as an addon. The builtin one still
works but is deprecated: it prints a notice pointing at the addon, and an installed addon
takes over the command.
:::

## Installation

```sh
$ xmake addon --install format-plugin
```

## Usage

```sh
$ xmake format                          # all default targets
$ xmake format target1 target2          # only the given targets
$ xmake format -a                       # all targets
$ xmake format -g test                  # a target group, `test_*` patterns work too
$ xmake format --files='src/**.c|excluded.c'
$ xmake format --create --style=Google  # write a .clang-format
```

| Option | Default | Description |
| --- | --- | --- |
| `-s, --style` | | the path of a `.clang-format` file, or a builtin style: `LLVM`, `Google`, `Chromium`, `Mozilla`, `WebKit` |
| `--create` | | create a `.clang-format` from the given style |
| `-n, --dry-run` | | do not change anything, just list the files which would be formatted |
| `-e, --error` | | turn the formatting warnings into errors |
| `-j, --jobs` | cpu cores | the number of parallel format jobs |
| `-a, --all` | | format all targets |
| `-g, --group` | | format the targets of the given group |
| `-f, --files` | | the given source files, `**` and `|` exclusion are supported |

## Checking the format in the ci

`--dry-run` changes nothing, and with `--error` the command fails when a file does not match
the style:

```sh
$ xmake format --dry-run --error
```
