---
outline: deep
---

# Addons Introduction

An addon extends **xmake itself**. Where a package provides libraries for your program, an
addon provides new abilities for the build tool: commands, build rules, toolchains, project
templates and lua modules.

::: tip NOTE
Addons require xmake from the dev branch for now. Before them, only plugins could be
distributed, through the older `xmake plugin --install`.
:::

## What an addon can carry

An addon ships one or more *payloads*, and every one of them is optional:

| Payload | What it becomes | Used as |
| --- | --- | --- |
| `plugins/` | a new xmake command | `xmake monitor` |
| `rules/` | a build rule | `add_rules("@addon/esp32-devel/app")` |
| `toolchains/` | a toolchain | `set_toolchains("@addon/esp32-devel/esp32")` |
| `templates/` | a project template | `xmake create -t esp32.blink` |
| `modules/` | importable lua modules | `import("@addon.serial-tools.serial")` |
| `includes/` | includable configuration | `includes("@addon/esp32-devel/board")` |

So one addon can be a complete development kit: the esp32-devel addon carries the cross
toolchain, the build rules, the flashing logic and a blink template — installing it turns
xmake into an ESP32 SDK.

## Architecture

```
                       xmake-repo                     github / local dir
                     addons/e/esp32-devel/xmake.lua   github:user/my-addon
                                    │
                     xmake addon --install <name>
                                    ↓
     ~/.xmake/addons/<name>/<version>/{plugins,rules,toolchains,templates,modules,includes}
     ~/.xmake/addons/addons.conf     ← the registry xmake reads on startup
                                    ↓
                    a project references the payloads it needs
             add_addons("esp32-devel")  +  @addon/esp32-devel/app
```

Three properties follow from this layout:

**Installed once, per user.** An addon lives in `~/.xmake/addons`, not in the project. Several
projects share the same installation, and the registry file means xmake does not scan the
directory on every run.

**Payloads are namespaced.** Rules, toolchains, includes and modules are always referenced
through `@addon/<name>/...`, so two addons never collide. Plugins and templates are the
exception — a command name is global, so xmake rejects an install which would shadow another
addon's command.

**An addon names itself.** The `addon.lua` manifest in the addon repository declares its name,
description and payload root, so the name never depends on the repository or on the package
that distributes it.

```lua
-- addon.lua
addon("esp32-devel")
    set_homepage("https://github.com/xmake-addons/esp32-devel")
    set_description("The ESP32 development addon.")
    set_license("Apache-2.0")
    set_sourcedir("src")
    add_deps("serial-tools")
```

## Addons vs plugins vs packages

| | Installed with | Lives in | Extends |
| --- | --- | --- | --- |
| Package | `add_requires` / `xrepo install` | `~/.xmake/packages` | your **program** (libs, headers, tools) |
| Plugin (legacy) | `xmake plugin --install` | `~/.xmake/plugins` | xmake, commands only |
| Addon | `xmake addon --install` / `add_addons` | `~/.xmake/addons` | xmake, all payload kinds |

An addon is distributed as a package with `set_kind("addon")`, so it reuses the whole
package infrastructure: repositories, versions, sha256 verification, dependencies and the
`xrepo` download logic.

## Next

- [Installation and Usage](/guide/extensions/addons/installation) — the `xmake addon` subcommands and `add_addons`
- [Writing an Addon](/guide/extensions/addons/development) — the manifest, the payloads and publishing to xmake-repo
- [xmake-harness](/guide/extensions/addons/official/xmake-harness) — the AI agent addon, `xmake ai`
