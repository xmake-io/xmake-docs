---
outline: deep
---

# macro-plugin

[macro-plugin](https://github.com/xmake-addons/macro-plugin) provides the `xmake macro`
command, which records a sequence of xmake commands as a macro and replays it later.

| Payload | What it provides |
| --- | --- |
| `plugins/macro` | the `xmake macro` command and the builtin `package` macro |

A macro is a lua script which replays xmake commands, and you record it instead of writing it.

::: tip NOTE
This command used to be built into xmake and now ships as an addon. The builtin one still
works but is deprecated: it prints a notice pointing at the addon, and an installed addon
takes over the command.
:::

## Installation

```sh
$ xmake addon --install macro-plugin
```

## Recording and replaying

```sh
$ xmake macro --begin
$ xmake config --plat=macosx
$ xmake -r
$ xmake macro --end test
```

Then replay the whole sequence, `xmake macro` also has the short name `xmake m`:

```sh
$ xmake macro test
$ xmake m test
```

Two macro names are special:

```sh
$ xmake macro .                    # the anonymous macro, recorded without a name
$ xmake macro ..                   # the last command
```

## Managing macros

```sh
$ xmake macro --list               # list all macros
$ xmake macro --show test          # show the content of a macro
$ xmake macro --delete test
$ xmake macro --clear              # clear all macros
```

Macros can also be exported and imported, which is how you share them with your team:

```sh
$ xmake macro --export=/xxx/macro.lua test
$ xmake macro --export=/xxx/macrodir
$ xmake macro --import=/xxx/macro.lua test
$ xmake macro --import=/xxx/macrodir
```

## The builtin package macro

It comes with a `package` macro, which packages the project for several architectures at once:

```sh
$ xmake macro package -p iphoneos -f "-m debug"
```
