---
outline: deep
---

# Plugin Addons

Three commands which used to be built into xmake now ship as addons. The builtin ones still
work but are deprecated: they print a notice pointing at the addon, and an installed addon
takes over the command.

| Addon | Command | What it does |
| --- | --- | --- |
| [format-plugin](https://github.com/xmake-addons/format-plugin) | `xmake format` | format the sources of your targets with clang-format |
| [doxygen-plugin](https://github.com/xmake-addons/doxygen-plugin) | `xmake doxygen` | generate the doxygen document of the project |
| [macro-plugin](https://github.com/xmake-addons/macro-plugin) | `xmake macro` | record and replay a sequence of xmake commands |

```sh
$ xmake addon --install format-plugin
$ xmake addon --install doxygen-plugin
$ xmake addon --install macro-plugin
```

## format-plugin

It formats exactly the files your targets own, so generated code and third-party sources
outside of the targets are never touched. `clang-format` is installed from xmake-repo when
it is not on the host.

```sh
$ xmake format                          # all default targets
$ xmake format target1 target2
$ xmake format -a                       # all targets
$ xmake format -g test                  # a target group
$ xmake format --files='src/**.c|excluded.c'
$ xmake format --dry-run --error        # check only, for the ci
$ xmake format --create --style=Google  # write a .clang-format
```

## doxygen-plugin

It generates a `doxyfile` from the project when there is none — the project name, version,
source directory and output directory are filled in for you — and installs `doxygen` when
it is missing.

```sh
$ xmake doxygen
$ xmake doxygen -o /tmp/docs mysrc
```

## macro-plugin

A macro is a lua script which replays xmake commands, and you record it instead of writing it.

```sh
$ xmake macro --begin
$ xmake config --plat=macosx
$ xmake -r
$ xmake macro --end test

$ xmake macro test                      # replay it, `xmake m test` for short
$ xmake macro .                         # the anonymous macro
$ xmake macro ..                        # the last command
$ xmake macro --list / --show / --delete / --clear
$ xmake macro --export=/xxx/macro.lua test
$ xmake macro --import=/xxx/macrodir
```

The builtin `package` macro comes with it: `xmake macro package -p iphoneos -f "-m debug"`
packages the project for several architectures at once.
