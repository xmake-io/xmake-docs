---
outline: deep
---

# Installation and Usage

All addon management goes through one command: `xmake addon`.

## Install

```sh
$ xmake addon --install esp32-devel                      # from the repository index
$ xmake addon --install github:xmake-addons/esp32-devel  # from github
$ xmake addon --install github:xmake-addons/esp32-devel#dev
$ xmake addon --install https://github.com/user/repo.git # from any git url
$ xmake addon --install /path/to/my-addon                # from a local directory
$ xmake addon --install myrepo@serial-tools              # from a specific repository
```

Add `-y` to skip the confirmations, which is what you want in a CI script.

## List, search, remove, upgrade

```sh
$ xmake addon --list          # installed addons, then the available ones
$ xmake addon --search esp32  # search the repositories
$ xmake addon --remove esp32-devel
$ xmake addon --remove --all
$ xmake addon --upgrade       # upgrade the addons the current project declares
```

`--force` removes an addon even if another addon depends on it.

```sh
$ xmake addon --list
the installed addons:
  -> esp32-devel v1.0.5: The ESP32 development addon ... (toolchains, rules, modules, includes, templates)
  -> serial-tools v1.0.3: The serial port toolkit ... (plugins, modules)
the available addons: (run `xmake addon --install <name>` to install)
  -> avr-devel v1.0.0: The AVR development addon ... (in xmake-repo)
```

## Use it in a project

A project declares what it needs, so a fresh clone does not have to install anything by
hand — xmake installs the missing addons when the project is loaded:

```lua
add_addons("esp32-devel")           -- any version
add_addons("esp32-devel 1.0.x")     -- a version range
```

The resolved versions are written next to `xmake.lua` in `xmake-addons.lock`, so everyone
who builds the project gets the same addon versions. Commit that file.

Then reference the payloads:

```lua
add_addons("esp32-devel")

includes("@addon/esp32-devel/board")             -- an includes file of the addon

target("blink")
    add_rules("@addon/esp32-devel/app")          -- a rule of the addon
    add_files("src/*.c")
```

```lua
import("@addon.serial-tools.serial")             -- a module (dots, not slashes)
```

| Reference | Points at |
| --- | --- |
| `@addon/<name>/<payload>` | a rule, toolchain or includes file, used by the project apis |
| `@addon.<name>.<module>` | a lua module, used by `import()` |
| `@self.<module>` | a module of the addon which owns the running script |

## Where things live

```
~/.xmake/addons/<name>/<version>/    the installed payloads
~/.xmake/addons/addons.conf          the registry xmake reads on startup
<project>/xmake-addons.lock          the versions this project resolved
```

## Configuration

Addons are configured like any other part of xmake — through the options their payloads
declare. An addon which ships an includes file usually exposes them there:

```sh
$ xmake f --board=esp32c3 --port=/dev/ttyUSB0
$ xmake f --help                  # the addon options show up in the menu
```

## Troubleshooting

**The command of an addon is not found.** `xmake addon --list` first: if the addon is
installed but its command does not run, another addon or a builtin plugin provides the same
name — xmake warns about the conflict and keeps the first one.

**A project keeps reinstalling an addon.** The lock file is missing or the declared version
range does not match what is installed. `xmake addon --upgrade` re-resolves it.

**An install fails with a conflict.** Two addons cannot provide the same command name,
template id or global module name. Remove one of them, or ask the author to rename.
