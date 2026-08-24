---
outline: deep
---

# Writing an Addon

An addon is a directory with a manifest and one or more payload directories. Nothing else
is required — no build step, no registration.

## Layout

```
my-addon/
├── addon.lua              # the manifest, the only required file
├── README.md
├── tests/test.lua         # not installed
└── src/                   # the payload root, @see set_sourcedir
    ├── plugins/hello/     # xmake hello           (a new command)
    ├── rules/app/         # add_rules("@addon/my-addon/app")
    ├── toolchains/mycc/   # set_toolchains("@addon/my-addon/mycc")
    ├── modules/           # import("@addon.my-addon.foo")
    ├── includes/board/    # includes("@addon/my-addon/board")
    └── templates/c/foo/   # xmake create -t foo
```

Only the payload directories are installed, so tests, CI files and the README never land in
the user's `~/.xmake/addons/<name>/<version>/`.

## The manifest

```lua
-- addon.lua
addon("my-addon")
    set_homepage("https://github.com/me/my-addon")
    set_description("What this addon provides, one line.")
    set_license("Apache-2.0")
    set_sourcedir("src")            -- omit if the payloads sit at the repo root
    add_deps("serial-tools")        -- other addons this one needs
```

| Api | Description |
| --- | --- |
| `addon("name")` | the addon name, it never depends on the repository name |
| `set_description` / `set_homepage` / `set_license` | the metadata shown by `xmake addon --list` |
| `set_sourcedir` | the payload root inside the repository |
| `add_deps` | the other addons this one needs |
| `add_globalmodules` | expose a module under its plain name, @see below |

## Reference yourself with `@self`

An addon must never hardcode its own name — it can always ask for itself:

```lua
-- in a rule, a toolchain or a plugin of this addon
import("@self.private.board")
```

```lua
-- when you need the name, e.g. to bind your own toolchain to a target
import("core.package.addon")
local addonname = assert(addon.owner(), "not in an addon!")
target:set("toolchains", "@addon/" .. addonname .. "/mycc")
```

## Ship package definitions

A toolchain addon usually needs binaries. Carry the package recipes in an includes file and
let the project pull them in:

```lua
-- src/includes/packages/xmake.lua
package("my-toolchain")
    set_kind("toolchain")
    add_urls("https://.../$(version).tar.gz")
    add_versions("1.0.0", "<sha256>")
    on_install(function (package)
        os.cp("*", package:installdir())
    end)
package_end()
```

```lua
-- src/includes/board/xmake.lua
includes("../packages")
option("board", {default = "uno", description = "Set the target board."})
add_requires("my-toolchain")
```

The project then writes a single line: `includes("@addon/my-addon/board")`.

## Global modules

`add_globalmodules(...)` makes a module visible under its plain name. It is needed only
where **xmake itself** looks a module up by a computed name:

```lua
addon("avr-devel")
    add_globalmodules("detect.tools.find_avrdude",  -- find_tool("avrdude")
                      "core.tools.avr_gcc")         -- the tool module of a compiler
```

```lua
-- src/modules/core/tools/avr_gcc.lua
inherit("core.tools.gcc")   -- avr-gcc is a gcc cross compiler
```

Everything else stays namespaced. A global module which collides with a module of xmake or
of another addon is rejected at install time.

## Test it locally

```sh
$ xmake addon --install .           # install from the working copy
$ xmake addon --list
$ xmake hello                       # exercise the payloads
$ xmake addon --remove my-addon
```

A `tests/test.lua` which installs the addon, exercises it and removes it again is the
standard shape — it is what a user does, and it runs unchanged in CI.

## Publish to xmake-repo

Addons live in `addons/<first-letter>/<name>/xmake.lua`, beside the C/C++ packages:

```lua
package("my-addon")
    set_kind("addon")
    set_homepage("https://github.com/me/my-addon")
    set_description("What this addon provides, one line.")
    set_license("Apache-2.0")

    add_urls("https://github.com/me/my-addon/archive/refs/tags/$(version).tar.gz",
             "https://github.com/me/my-addon.git")
    add_versions("v1.0.0", "<sha256>")

    add_deps("serial-tools", {kind = "addon"})

    on_test(function (package)
        assert(package:has_addon({rules = "app", toolchains = "mycc",
                                  plugins = "hello", templates = "c/foo"}))
    end)
```

1. Tag a release in your addon repository.
2. Compute the sha256 of the archive: `xmake l hash.sha256 <file>`.
3. Add the recipe and test it the way the repo CI does:

```sh
$ xmake l scripts/test_addons.lua --addon my-addon
```

That installs it from your local xmake-repo checkout, runs `on_test` and removes it again.

4. Send the pull request to [xmake-repo](https://github.com/xmake-io/xmake-repo).

`add_deps` appears in both files on purpose: the recipe is what xmake reads *before*
downloading the sources, the manifest is what a local directory install reads. The repo test
script checks that the two agree.

## Gotchas

- Command names and template ids are global — pick something unlikely to collide.
- The version comes from the package recipe, so bump the tag, not `addon.lua`.
- `set_sourcedir` is what keeps `tests/` out of the install.
