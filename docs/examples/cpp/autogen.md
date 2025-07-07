# Automatic Code Generation {#autogen}

In many cases, we need to preprocess and automatically generate code before compilation, and then include the generated code in the subsequent build process.

As Xmake continues to evolve, its support for code generation features is also being updated and improved. Currently, the following approaches are supported:

## The Simplest Approach

This is the most straightforward method: simply generate the code before building and forcibly add it using `add_files`.

By default, `add_files` will not add files that do not exist, so you need to set `always_added = true` to force the addition, even if the file does not exist yet.

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("$(builddir)/autogen.cpp", {always_added = true})
    before_build(function (target)
        io.writefile("$(builddir)/autogen.cpp", [[
#include <iostream>
using namespace std;
int main(int argc, char** argv) {
    cout << "hello world!" << endl;
    return 0;
}
        ]])
    end)
```

This approach has many limitations and is not commonly used in real-world scenarios, but it is simple and easy to understand.

## Generation via Dependent Target

Sometimes, code generation requires running a target program within the project. This can be achieved as follows:

```lua
add_rules("mode.debug", "mode.release")

rule("autogen")
    set_extensions(".in")
    before_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        local sourcefile_cx = path.join(target:autogendir(), "rules", "autogen", path.basename(sourcefile) .. ".cpp")
        local objectfile = target:objectfile(sourcefile_cx)
        table.insert(target:objectfiles(), objectfile)

        batchcmds:show_progress(opt.progress, "${color.build.object}compiling.autogen %s", sourcefile)
        batchcmds:mkdir(path.directory(sourcefile_cx))
        batchcmds:vrunv(target:dep("autogen"):targetfile(), {sourcefile, sourcefile_cx})
        batchcmds:compile(sourcefile_cx, objectfile)

        batchcmds:add_depfiles(sourcefile, target:dep("autogen"):targetfile())
        batchcmds:set_depmtime(os.mtime(objectfile))
        batchcmds:set_depcache(target:dependfile(objectfile))
    end)

target("autogen")
    set_default(false)
    set_kind("binary")
    set_plat(os.host()) -- Build for the host platform
    set_arch(os.arch())
    add_files("src/autogen.cpp")
    set_languages("c++11")
    set_policy("build.fence", true) -- Disable parallel compilation between source files

target("test")
    set_kind("binary")
    add_deps("autogen")
    add_rules("autogen")
    add_files("src/main.cpp")
    add_files("src/*.in")
```

First, configure an `autogen` target program that must be runnable on the current build platform, so use `set_plat(os.host())` to force building for the host platform.

Also, set the `build.fence` policy to disable parallel compilation between source files, ensuring the `autogen` target is built first and its executable is available in advance.

Then, define a custom rule to invoke the `autogen` target program before building, generate the source code, and compile the generated code into object files for linking.

See the full example: [autogen_codedep](https://github.com/xmake-io/xmake/blob/dev/tests/projects/other/autogen/autogen_codedep/xmake.lua)

## Generation via Native Module

Xmake introduces native module development, allowing code generation via native modules without defining an extra `autogen` target program.

For details on native module development, see: [Native Module Development](/api/scripts/native-modules).

```lua
add_rules("mode.debug", "mode.release")

add_moduledirs("modules")

rule("autogen")
    set_extensions(".in")
    before_build_file(function (target, sourcefile, opt)
        import("utils.progress")
        import("core.project.depend")
        import("core.tool.compiler")
        import("autogen.foo", {always_build = true})

        local sourcefile_cx = path.join(target:autogendir(), "rules", "autogen", path.basename(sourcefile) .. ".cpp")
        local objectfile = target:objectfile(sourcefile_cx)
        table.insert(target:objectfiles(), objectfile)

        depend.on_changed(function ()
            progress.show(opt.progress, "${color.build.object}compiling.autogen %s", sourcefile)
            os.mkdir(path.directory(sourcefile_cx))
            foo.generate(sourcefile, sourcefile_cx)
            compiler.compile(sourcefile_cx, objectfile, {target = target})
        end, {dependfile = target:dependfile(objectfile),
              files = sourcefile,
              changed = target:is_rebuilt()})
    end)

target("test")
    set_kind("binary")
    add_rules("autogen")
    add_files("src/main.cpp")
    add_files("src/*.in")
```

See the full example: [Native Module Autogen](https://github.com/xmake-io/xmake/blob/dev/tests/projects/other/autogen/autogen_shared_module/xmake.lua).

## Generation in the Prepare Phase

Since Xmake 3.x, the `on_prepare` and `on_prepare_files` interfaces have been introduced to enable two-phase builds. The Prepare phase can be used specifically for source code generation and preprocessing.

The Prepare phase is executed before all `on_build` and `on_build_files` interfaces.

For details, see: [Prepare Interface Manual](/api/description/project-target.html#on-prepare).
