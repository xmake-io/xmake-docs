---
outline: deep
---

# Addon Examples

These eight independent projects show how an addon can extend project configuration,
description-domain APIs and functions, build rules, modules, plugins, templates, and toolchains. Each example
contains **both the user project and the addon**, together with a local repository recipe.
Download an example using the file explorer's **Download Zip** button, extract it, and
run the commands from the directory containing the top-level `xmake.lua`.

::: tip Requirements
Use a current **Xmake dev build with addon support**, Git, and a native C compiler
(Clang, GCC, or MSVC). The module and plugin bootstrap projects do not compile application
sources. No example requires a third-party SDK or library.
:::

## How the examples bootstrap

Every project has this layout; the addon's payload directories vary between examples:

```text
example/
├── xmake.lua                         # the user project
├── src/main.c                       # C application, when used
├── addon/
│   ├── addon.lua                    # the addon manifest
│   └── ...                          # includes, rules, modules, plugins, templates, toolchains
└── repo/addons/e/<addon-name>/
    └── xmake.lua                    # the addon package recipe
```

The root `xmake.lua` declares the repository **before** the addon and its references:

```lua
add_repositories("example-includes-repo ./repo", {rootdir = os.scriptdir()})
add_addons("example-includes")
includes("@addon/example-includes/options")
```

The repository recipe uses `set_kind("addon")` and points at the bundled `addon/`
with `set_sourcedir`. Consequently, the first build automatically **installs from local
sources**; it does not download an archive or require a manual installation command.
All paths are relative to their declaring scripts, so the entire example can be moved.

```sh
xmake -y
```

Then use the payload-specific commands shown in each section below.

Xmake installs the addon before fully loading its includes and APIs, then writes
`xmake-addons.lock`. Subsequent builds reuse that installation and lock. These source
recipes have version `latest`; real release recipes use `add_urls` and `add_versions`
with a release version and archive checksum. See [publishing an addon](/guide/extensions/addons/development#publish-to-xmake-repo).

::: tip Offline use and isolation
All example addon sources are local. To prevent initialization of Xmake's default remote
repositories on a fresh environment, run `xmake global --network=private` first.
An addon installation is normally shared by the user. For an isolated experiment, set
`XMAKE_GLOBALDIR` to an empty temporary directory **for all commands** before configuring
private network mode.
:::

## Share configuration through includes

<FileExplorer rootFilesDir="examples/addons/includes" />

The addon provides `includes/options/xmake.lua`, which declares the `example_verbose`
option. The user project imports it with `includes("@addon/example-includes/options")`.
Its `on_config` callback reads the resolved option and adds a compiler definition;
`src/main.c` checks that definition.

```sh
xmake -y
xmake run hello
# includes: verbose

xmake f -y --example_verbose=n
xmake -y
xmake run hello
# includes: quiet
```

The addon does not become an include directory for C headers: here, `includes()` loads
**Xmake configuration scripts**. The included option ends with `option_end()` to avoid
leaking its description scope.

## Add description-domain APIs and a custom scope

<FileExplorer rootFilesDir="examples/addons/description_api" />

The addon's `includes/apis/xmake.lua` registers the new scope and target setter:

```lua
interp_add_scopeapis("example_profile.set_message", "example_profile.add_tags", {kind = "values"})
interp_add_scopeapis("target.set_example_profile", {kind = "values"})
```

The user project calls those APIs directly after including the extension:

```lua
includes("@addon/example-description-api/apis")

if example_profile then
    example_profile("demo")
        set_message("hello from a custom scope")
        add_tags("portable", "reusable")

    target("hello")
        set_kind("binary")
        add_files("src/main.c")
        set_example_profile("demo")
        add_rules("@addon/example-description-api/message")
end
```

The guard supports the first build on a machine without this addon. Xmake initially
scans the project to discover `add_addons`; an unavailable addon includes file is skipped
during that scan. `example_profile` is then nil, so the extension-dependent declarations
are skipped too. Xmake installs the declared addon and reloads the project: the includes
file now registers the API, the condition becomes true, and the declarations execute.
Keep `add_repositories`, `add_addons`, and `includes` **outside** the condition.
The addon registers its APIs only; it never invokes a user-defined configuration callback.

```sh
xmake -y
xmake run hello
# hello from a custom scope (2 tags)
```

Registration stores configuration. The addon's `message` rule consumes it in `on_config`,
reads `project.scope("example_profile")` and `target:get("example_profile")`, and produces
the compiler definitions used by the application. Change `set_message` in the user project
and build again to update the output and trigger the necessary recompilation.

Use a distinctive scope/property prefix to avoid collisions. APIs registered by an includes
file enter the project's interpreter; the payload namespace does not namespace them automatically.
An availability guard supports bootstrapping; it does not validate a misspelled API name.

## Provide reusable description-domain functions

<FileExplorer rootFilesDir="examples/addons/functions" />

The addon includes file defines `example_console`, a Lua helper that composes standard
description APIs. The user calls it directly, guarding it during the initial scan:

```lua
includes("@addon/example-functions/targets")

if example_console then
    example_console("hello", "src/main.c")

    target("hello")
        add_defines("EXAMPLE_NUMBER=42")
end
```

As with the custom API example, keep the repository/addon declarations and includes call
outside the condition. The first build skips the helper while it is undefined, automatically
installs the addon, and reloads the project to execute this block. No manual installation
or callback from the addon into the user project is needed.

`example_console` creates a binary target, adds its sources, and sets its warning level.
It saves/restores the interpreter scope so it does not accidentally configure a previously
selected target. The project can reopen the generated target and customize it.

```sh
xmake -y
xmake run hello
# description function: 42
```

The helper belongs to the **description domain**: it calls `target`, `set_kind`, and
`add_files`. Use it while declaring the project, rather than inside `on_build` or a sandbox
module. Reusable code executed by script callbacks belongs in a sandbox module instead.

## Compose a rule and sandbox module

<FileExplorer rootFilesDir="examples/addons/rules_modules" />

The rule imports a module from the same addon with `import("@self.greeting")` and
adds a compiler definition. The user's `on_run` callback imports that module through
`import("@addon.example-rules-modules.greeting")`, prints a greeting, and runs the program.

```sh
xmake -y
xmake run hello
# addon module: hello hello
# addon rule: 42
```

The reference syntax depends on the payload:

| Payload | Reference |
| --- | --- |
| Includes | `includes("@addon/example-includes/options")` |
| Rule | `add_rules("@addon/example-rules-modules/message")` |
| Module in a project callback | `import("@addon.example-rules-modules.greeting")` |
| Module inside its own addon | `import("@self.greeting")` |
| Plugin command | `xmake example_greet --name=xmake` |
| Template | `xmake create -l c -t @addon/example-templates/example-addon.console -P generated` |
| Auxiliary toolchain | `add_toolchains("@addon/example-toolchains/settings")` |

The module exports ordinary top-level functions; it needs neither a `return`ed module
table nor `add_globalmodules`. `@self` keeps the rule independent of the addon's installed name.

## Distribute a standalone module

<FileExplorer rootFilesDir="examples/addons/modules" />

This addon contains only `modules/greeting.lua`. Its `main` function makes the imported
module callable. The user project's `on_run` imports it by its addon-qualified name:

```lua
import("@addon.example-modules.greeting")
print(greeting("xmake"))
```

```sh
xmake -y
xmake run hello
# addon module: hello xmake
```

The target is `phony`, so this example does not compile C sources. The import runs in a script
callback after automatic addon installation. No `add_globalmodules` declaration is needed
for an explicit namespaced import.

## Distribute a command plugin

<FileExplorer rootFilesDir="examples/addons/plugins" />

The addon provides `plugins/example_greet/xmake.lua` and `main.lua`. The task definition
registers the command and its `--name` option; the implementation reads it with `core.base.option`.

```sh
xmake -y
xmake example_greet --name=xmake
# addon plugin: hello xmake
```

Run the bootstrap build **before** the plugin command on the first use. The build discovers
`add_addons` and installs the plugin; an unknown command cannot bootstrap itself. The
bootstrap target is `phony` and does not compile sources. Command names are global, so choose a
distinctive name even though the command is distributed inside a named addon.

## Distribute a project template

<FileExplorer rootFilesDir="examples/addons/templates" />

The addon carries `templates/c/example-addon/console/`, including its `xmake.lua` and
`src/main.c`. Xmake expands `${TARGET_NAME}` when creating the new project.

```sh
xmake -y
xmake create -l c -t @addon/example-templates/example-addon.console -P generated
xmake -y -P generated
xmake run -P generated
# hello from the addon template
```

The first build installs the addon through a `phony` bootstrap target. The create command
then selects its template explicitly and writes a separate project to `generated/`.
Use a fresh destination for each creation. The generated project is ordinary C and can
build independently of the addon once created. Template IDs must also avoid global collisions.

## Distribute an auxiliary toolchain

<FileExplorer rootFilesDir="examples/addons/toolchains" />

The addon provides `toolchains/settings/xmake.lua`. Its `binary` kind makes it an auxiliary
toolchain, and the project adds it with:

```lua
add_toolchains("@addon/example-toolchains/settings")
```

The auxiliary toolchain contributes `EXAMPLE_TOOLCHAIN=42` while Xmake retains the platform's
normal compiler/linker toolchain. The application's compile-time check ensures that the
setting actually reached compilation.

```sh
xmake -y
xmake run hello
# addon toolchain: 42
```

This sample distributes a toolchain definition, not a compiler executable or cross SDK.
A complete independent compiler toolchain would use `set_kind("standalone")`, select its
tools with `set_toolset`, and implement any required checking and loading. See
[custom toolchains](/api/description/custom-toolchain).

## Editing, cleanup, and verification

Changing a user project's configuration needs another `xmake` invocation. Changing the
bundled addon's payload requires reinstalling it, because Xmake builds with the installed
copy rather than loading `addon/` in place. From the corresponding example project, run:

```sh
# Substitute the addon name used by that example.
xmake addon --install -y --force example-includes
xmake -y
xmake addon --remove example-includes
```

Do not expect editing a locked addon's source directory to update an existing installation
automatically. The eight addon names are distinct so the examples can coexist.

The [Xmake source repository](https://github.com/xmake-io/xmake/tree/dev/tests/projects/addons)
contains the same eight standalone projects. With the source environment loaded, enter
an example directory and run Xmake directly:

```sh
cd tests/projects/addons/includes
xmake -y
xmake run hello
```

Follow each section's commands for the other example directories. Repeat `xmake` to observe
a no-op build; change the project's options or configuration and rebuild to check the
new output. These examples extend the DSL through existing extension APIs; they do not
add new built-in Xmake APIs.
