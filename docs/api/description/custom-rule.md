# Custom Rule

After the 2.2.1 release, xmake not only natively supports the construction of multi-language files, but also allows users to implement complex unknown file builds by custom building rules.

Custom build rules can have a set of file extensions associated to them using `set_extensions`.
Once these extensions are associated to the rule a later call to `add_files` will automatically use this custom rule.
Here is an example rule that will use Pandoc to convert markdown files added to a build target in to HTML files:

```lua
-- Define a build rule for a markdown file
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        import("core.project.depend")
        import("utils.progress") -- it only for v2.5.9, we need use print to show progress below v2.5.8

        -- make sure build directory exists
        os.mkdir(target:targetdir())

        -- replace .md with .html
        local targetfile = path.join(target:targetdir(), path.basename(sourcefile) .. ".html")

        -- only rebuild the file if its changed since last run
        depend.on_changed(function ()
            -- call pandoc to make a standalone html file from a markdown file
            os.vrunv('pandoc', {"-s", "-f", "markdown", "-t", "html", "-o", targetfile, sourcefile})
            progress.show(opt.progress, "${color.build.object}markdown %s", sourcefile)
        end, {files = sourcefile})
    end)

target("test")
    set_kind("object")

    -- make the test target support the construction rules of the markdown file
    add_rules("markdown")

    -- adding a markdown file to build
    add_files("src/*.md")
    add_files("src/*.markdown")
```

::: tip NOTE
Note that in xmake a rule is responsible for checking when targets are out of date and informing the user of ongoing progress.
:::

There is also an alternative to `on_build_file` in the form of `on_build_files` which allows you to process the entire set of files in one function call.

A second form called `on_buildcmd_file` and `on_buildcmd_files` is instead declarative; rather than running arbitrary Lua to build a target it runs Lua to learn how those targets are built.
The advantage to `buildcmd` is that those rules can be exported to makefiles which do not require xmake at all in order to run.

We can use buildcmd to simplify it further, like this:

```lua
-- Define a build rule for a markdown file
rule("markdown")
    set_extensions(".md", ".markdown")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)

        -- make sure build directory exists
        batchcmds:mkdir(target:targetdir())

        -- replace .md with .html
        local targetfile = path.join(target:targetdir(), path.basename(sourcefile) .. ".html")

        -- call pandoc to make a standalone html file from a markdown file
        batchcmds:vrunv('pandoc', {"-s", "-f", "markdown", "-t", "html", "-o", targetfile, sourcefile})
        batchcmds:show_progress(opt.progress, "${color.build.object}markdown %s", sourcefile)

        -- only rebuild the file if its changed since last run
        batchcmds:add_depfiles(sourcefile)
    end)

target("test")
    set_kind("object")

    -- make the test target support the construction rules of the markdown file
    add_rules("markdown")

    -- adding a markdown file to build
    add_files("src/*.md")
    add_files("src/*.markdown")
```

Files can be assigned to a specific rule regardless of their file extension. You do this by setting the `rule` custom property when adding the file like in the following example:

```lua
target("test")
    add_files("src/test/*.md.in", {rules = "markdown"})
```

A target can be superimposed to apply multiple rules to more customize its own build behavior, and even support different build environments.

::: tip NOTE
Rules specified by `add_files("*.md", {rules = "markdown"})`, with a higher priority than the rule set by `add_rules("markdown")`.
:::

## rule

- Defining rules

#### Function Prototype

::: tip API
```lua
rule(name: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Rule name string |

#### Usage

```lua
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)
```

## add_deps

- Adding rule dependencies

#### Function Prototype

::: tip API
```lua
add_deps(deps: <string|array>, ..., {
    order = <boolean>
})
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| deps | Dependency rule name string or array |
| ... | Variable parameters, can pass multiple dependency names |
| order | Whether to execute dependencies in order |

#### Usage

Associated dependencies can bind a batch of rules, i.e. instead of adding rules one by one to a target using `add_rules()`, just apply a rule that will take effect for it and all its dependencies.

For example

```lua
rule("foo")
    add_deps("bar")

rule("bar")
   ...
```

We only need `add_rules("foo")` to apply both foo and bar rules.

However, by default there is no order of execution between dependencies, and scripts such as `on_build_file` for foo and bar are executed in parallel, in an undefined order.

To strictly control the order of execution, you can configure `add_deps("bar", {order = true})` to tell xmake that we need to execute scripts at the same level according to the order of dependencies.

Example.

```lua
rule("foo")
    add_deps("bar", {order = true})
    on_build_file(function (target, sourcefile)
    end)

rule("bar")
    on_build_file(function (target, sourcefile)
    end)
```

bar's `on_build_file` will be executed first.

::: tip NOTE
To control the order of dependencies, we need xmake 2.7.2 or above to support this.
:::

However, this way of controlling dependencies only works if both foo and bar rules are custom rules, and this does not work if you want to insert your own rules to be executed before xmake's built-in rules.

In this case, we need to use a more flexible dynamic rule creation and injection approach to modify the built-in rules.

For example, if we want to execute the `on_build_file` script for a custom cppfront rule before the built-in `c++.build` rule, we can do this in the following way.

```lua
rule("cppfront")
    set_extensions(".cpp2")
    on_load(function (target)
        local rule = target:rule("c++.build"):clone()
        rule:add("deps", "cppfront", {order = true})
        target:rule_add(rule)
    end)
    on_build_file(function (target, sourcefile, opt)
        print("build cppfront file")
    end)

target("test")
    set_kind("binary")
    add_rules("cppfront")
    add_files("src/*.cpp")
    add_files("src/*.cpp2")
```

## add_imports

- Add imported modules for all custom scripts

#### Function Prototype

::: tip API
```lua
add_imports(modules: <string|array>, ...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| modules | Module name string or array |
| ... | Variable parameters, can pass multiple module names |

#### Usage

For usage and description, please see: [target:add_imports](/api/description/project-target#add-imports), the usage is the same.

## set_extensions

- Setting the file extension type supported by the rule

#### Function Prototype

::: tip API
```lua
set_extensions(extensions: <string|array>, ...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| extensions | File extension string or array |
| ... | Variable parameters, can pass multiple extensions |

#### Usage

Apply rules to files with these suffixes by setting the supported extension file types, for example:

```lua
-- Define a build rule for a markdown file
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)

target("test")
    set_kind("binary")

    -- Make the test target support the construction rules of the markdown file
    add_rules("markdown")

    -- Adding a markdown file to build
    add_files("src/*.md")
    add_files("src/*.markdown")
```

## on_load

- Custom load script

#### Function Prototype

::: tip API
```lua
on_load(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Load script function with target parameter |

#### Usage

The load script used to implement the custom rules will be executed when the target is loaded. You can customize some target configurations in it, for example:

```lua
rule("test")
    on_load(function (target)
        target:add("defines", "TEST")
    end)
```

## on_config

- custom configuration script

#### Function Prototype

::: tip API
```lua
on_config(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Configuration script function with target parameter |

#### Usage

After `xmake config` is executed, this script is executed before Build, which is usually used for configuration work before compilation. It differs from on_load in that on_load is executed as soon as the target is loaded, and the execution timing is earlier.

If some configuration cannot be configured prematurely in on_load, it can be configured in on_config.

In addition, its execution time is earlier than before_build, and the approximate execution flow is as follows:

```
on_load -> after_load -> on_config -> before_build -> on_build -> after_build
```

## on_link

- Custom link script

#### Function Prototype

::: tip API
```lua
on_link(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Link script function with target parameter |

#### Usage

The link script used to implement the custom rules overrides the default link behavior of the applied target, for example:

```lua
rule("test")
    on_link(function (target)
    end)
```

## on_build

- Custom compilation script

#### Function Prototype

::: tip API
```lua
on_build(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Build script function with target parameter |

#### Usage

The build script used to implement the custom rules overrides the default build behavior of the target being applied, for example:

```lua
rule("markdown")
    on_build(function (target)
    end)
```

## on_clean

- Custom cleanup script

#### Function Prototype

::: tip API
```lua
on_clean(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Clean script function with target parameter |

#### Usage

The cleanup script used to implement the custom rules will override the default cleanup behavior of the applied target, for example:

```lua
rule("markdown")
    on_clean(function (target)
        -- remove sourcefile.html
    end)
```

## on_package

- Custom packaging script

#### Function Prototype

::: tip API
```lua
on_package(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Package script function with target parameter |

#### Usage

A packaging script for implementing custom rules that overrides the default packaging behavior of the target being applied, for example:

```lua
rule("markdown")
    on_package(function (target)
        -- package sourcefile.html
    end)
```

## on_install

- Custom installation script

#### Function Prototype

::: tip API
```lua
on_install(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Install script function with target parameter |

#### Usage

An installation script for implementing custom rules that overrides the default installation behavior of the target being applied, for example:

```lua
rule("markdown")
    on_install(function (target)
    end)
```

## on_uninstall

- Custom Uninstall Script

#### Function Prototype

::: tip API
```lua
on_uninstall(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Uninstall script function with target parameter |

#### Usage

An uninstall script for implementing custom rules that overrides the default uninstall behavior of the target being applied, for example:

```lua
rule("markdown")
    on_uninstall(function (target)
    end)
```

## on_build_file

- Customizing the build script to process one source file at a time

#### Function Prototype

::: tip API
```lua
on_build_file(script: <function (target, sourcefile, opt)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Build file script function with target, sourcefile and opt parameters |

#### Usage

```lua
rule("markdown")
    on_build_file(function (target, sourcefile, opt)
        print("%%%d: %s", opt.progress, sourcefile)
    end)
```

The third parameter opt is an optional parameter, which is used to obtain some information state during the compilation process. For example, opt.progress is the compilation progress of the current period.

## on_buildcmd_file

- Custom batch compile script, process one source file at a time

#### Function Prototype

::: tip API
```lua
on_buildcmd_file(script: <function (target, batchcmds, sourcefile, opt)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Build command file script function with target, batchcmds, sourcefile and opt parameters |

#### Usage

This is a new interface added in version 2.5.2. The script inside will not directly construct the source file, but will construct a batch command line task through the batchcmds object.
When xmake actually executes the build, it executes these commands once.

This is very useful for project generator plugins such as `xmake project`, because third-party project files generated by the generator do not support the execution of built-in scripts such as `on_build_files`.

But the final result of `on_buildcmd_files` construction is a batch of original cmd command lines, which can be directly executed as custom commands for other project files.

In addition, compared to `on_build_files`, it also simplifies the implementation of compiling extension files, is more readable and easy to configure, and is more user-friendly.

```lua
rule("foo")
    set_extensions(".xxx")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile})
        batchcmds:add_depfiles("/xxxxx/dependfile.h", ...)
        -- batchcmds:add_depvalues(...)
        -- batchcmds:set_depmtime(os.mtime(...))
        -- batchcmds:set_depcache("xxxx.d")
    end)
```

In addition to `batchcmds:vrunv`, we also support some other batch commands, such as:

```lua
batchcmds:show("hello %s", "xmake")
batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile}, {envs = {LD_LIBRARY_PATH="/xxx"}})
batchcmds:mkdir("/xxx") - and cp, mv, rm, ln ..
batchcmds:compile(sourcefile_cx, objectfile, {configs = {includedirs = sourcefile_dir, languages = (sourcekind == "cxx" and "c++11")}})
batchcmds:link(objectfiles, targetfile, {configs = {linkdirs = ""}})
```

At the same time, we also simplify the configuration of dependency execution in it. The following is a complete example:

```lua
rule("lex")
    set_extensions(".l", ".ll")
    on_buildcmd_file(function (target, batchcmds, sourcefile_lex, opt)

        - imports
        import("lib.detect.find_tool")

        - get lex
        local lex = assert(find_tool("flex") or find_tool("lex"), "lex not found!")

        - get c/c++ source file for lex
        local extension = path.extension(sourcefile_lex)
        local sourcefile_cx = path.join(target:autogendir(), "rules", "lex_yacc", path.basename(sourcefile_lex) .. (extension == ".ll" and ".cpp" or ".c"))

        - add objectfile
        local objectfile = target:objectfile(sourcefile_cx)
        table.insert(target:objectfiles(), objectfile)

        - add commands
        batchcmds:show_progress(opt.progress, "${color.build.object}compiling.lex %s", sourcefile_lex)
        batchcmds:mkdir(path.directory(sourcefile_cx))
        batchcmds:vrunv(lex.program, {"-o", sourcefile_cx, sourcefile_lex})
        batchcmds:compile(sourcefile_cx, objectfile)

        - add deps
        batchcmds:add_depfiles(sourcefile_lex)
        batchcmds:set_depmtime(os.mtime(objectfile))
        batchcmds:set_depcache(target:dependfile(objectfile))
    end)
```

For a detailed description and background of this, see: [issue 1246](https://github.com/xmake-io/xmake/issues/1246)

## on_build_files

- Customizing the build script to process multiple source files at once

#### Function Prototype

::: tip API
```lua
on_build_files(script: <function (target, sourcebatch, opt)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Build files script function with target, sourcebatch and opt parameters |

#### Usage

Most of the custom build rules, each time processing a single file, output a target file, for example: a.c => a.o

However, in some cases, we need to enter multiple source files together to build an object file, for example: a.c b.c d.c => x.o

For this situation, we can achieve this by customizing this script:

```lua
rule("markdown")
    on_build_files(function (target, sourcebatch, opt)
        -- build some source files
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            -- ...
        end
    end)
```

## on_buildcmd_files

- Customize batch compiling script, process multiple source files at once

#### Function Prototype

::: tip API
```lua
on_buildcmd_files(script: <function (target, batchcmds, sourcebatch, opt)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Build command files script function with target, batchcmds, sourcebatch and opt parameters |

#### Usage

For a detailed description of this, see: [on_buildcmd_file](#on_buildcmd_file)

```lua
rule("foo")
     set_extensions(".xxx")
     on_buildcmd_files(function (target, batchcmds, sourcebatch, opt)
         for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
             batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile})
         end
     end)
```

## before_config

- Custom pre-configuration script

#### Function Prototype

::: tip API
```lua
before_config(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before config script function with target parameter |

#### Usage

Used to implement the execution script before custom target configuration, for example:

```lua
rule("test")
before_config(function (target)
end)
```

It will be executed before on_config.

## before_link

- Custom pre-link script

#### Function Prototype

::: tip API
```lua
before_link(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before link script function with target parameter |

#### Usage

Execution scripts used to implement custom target links, for example:

```lua
rule("test")
    before_link(function (target)
    end)
```

## before_build

- Custom pre-compilation script

#### Function Prototype

::: tip API
```lua
before_build(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before build script function with target parameter |

#### Usage

Used to implement the execution script before the custom target is built, for example:

```lua
rule("markdown")
    before_build(function (target)
    end)
```

## before_clean

- Custom pre-cleanup script

#### Function Prototype

::: tip API
```lua
before_clean(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before clean script function with target parameter |

#### Usage

Used to implement the execution script before the custom target cleanup, for example:

```lua
rule("markdown")
    before_clean(function (target)
    end)
```

## before_package

- Custom the pre-package script

#### Function Prototype

::: tip API
```lua
before_package(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before package script function with target parameter |

#### Usage

Used to implement the execution script before the custom target is packaged, for example:

```lua
rule("markdown")
    before_package(function (target)
    end)
```

## before_install

- Custom pre-installation script

#### Function Prototype

::: tip API
```lua
before_install(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before install script function with target parameter |

#### Usage

Used to implement the execution script before the custom target installation, for example:

```lua
rule("markdown")
    before_install(function (target)
    end)
```

## before_uninstall

- Custom pre-uninstall script

#### Function Prototype

::: tip API
```lua
before_uninstall(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before uninstall script function with target parameter |

#### Usage

Used to implement the execution script before the custom target is uninstalled, for example:

```lua
rule("markdown")
    before_uninstall(function (target)
    end)
```

## before_build_file

- Custom pre-compilation script to process one source file at a time

#### Function Prototype

::: tip API
```lua
before_build_file(script: <function (target, sourcefile, opt)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before build file script function with target, sourcefile and opt parameters |

#### Usage

Similar to [on_build_file](#on_build_file), but the timing of this interface is called before compiling a source file.
Generally used to preprocess some source files before compiling.

## before_buildcmd_file

- Customize the pre-compilation batch script, process one source file at a time

#### Function Prototype

::: tip API
```lua
before_buildcmd_file(script: <function (target, batchcmds, sourcefile, opt)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before build command file script function with target, batchcmds, sourcefile and opt parameters |

#### Usage

Similar to the usage of [on_buildcmd_file](#on_buildcmd_file), but the time when this interface is called is before compiling a certain source file.
It is generally used to pre-process certain source files before compilation.

## before_build_files

- Customize pre-compilation scripts to process multiple source files at once

#### Function Prototype

::: tip API
```lua
before_build_files(script: <function (target, sourcebatch, opt)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before build files script function with target, sourcebatch and opt parameters |

#### Usage

Similar to the usage of [on_build_files](#on_build_files), but the time when this interface is called is before compiling some source files,
It is generally used to pre-process certain source files before compilation.

## before_buildcmd_files

- Customize the pre-compilation batch script to process multiple source files at once

#### Function Prototype

::: tip API
```lua
before_buildcmd_files(script: <function (target, batchcmds, sourcebatch, opt)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before build command files script function with target, batchcmds, sourcebatch and opt parameters |

#### Usage

Similar to the usage of [on_buildcmd_files](#on_buildcmd_files), but the time when this interface is called is before compiling some source files,
It is generally used to pre-process certain source files before compilation.

## after_config

- Custom post-configuration script

#### Function Prototype

::: tip API
```lua
after_config(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After config script function with target parameter |

#### Usage

Used to implement the execution script after custom target configuration, for example:

```lua
rule("test")
after_config(function (target)
end)
```

It will be executed after on_config.

## after_link

- Custom post-linking script

#### Function Prototype

::: tip API
```lua
after_link(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After link script function with target parameter |

#### Usage

The execution script used to implement the custom target link is similar to [after_link](#after_link).

## after_build

- Custom post-compilation script

#### Function Prototype

::: tip API
```lua
after_build(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After build script function with target parameter |

#### Usage

The execution script used to implement the custom target build is similar to [before_build](#before_build).

## after_clean

- Custom post-cleaning script

#### Function Prototype

::: tip API
```lua
after_clean(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After clean script function with target parameter |

#### Usage

The execution script used to implement the custom target cleanup is similar to [before_clean](#before_clean).

## after_package

- Custom post-packaging script

#### Function Prototype

::: tip API
```lua
after_package(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After package script function with target parameter |

#### Usage

The execution script used to implement the custom target package is similar to [before_package](#before_package).

## after_install

- Custom post-installation script

#### Function Prototype

::: tip API
```lua
after_install(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After install script function with target parameter |

#### Usage

The execution script used to implement the custom target installation is similar to [before_install](#before_install).

## after_uninstall

- Custom post-uninstallation Script

#### Function Prototype

::: tip API
```lua
after_uninstall(script: <function (target)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After uninstall script function with target parameter |

#### Usage

The execution script used to implement the custom target uninstallation is similar to [before_uninstall](#before_uninstall).

## after_build_file

- Custom post-compilation scripts to process one source file at a time

#### Function Prototype

::: tip API
```lua
after_build_file(script: <function (target, sourcefile, opt)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After build file script function with target, sourcefile and opt parameters |

#### Usage

Similar to [on_build_file](#on_build_file), but the timing of this interface is called after compiling a source file.
Generally used to post-process some compiled object files.

## after_buildcmd_file

- Customize the compiled batch script, process one source file at a time

#### Function Prototype

::: tip API
```lua
after_buildcmd_file(script: <function (target, batchcmds, sourcefile, opt)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After build command file script function with target, batchcmds, sourcefile and opt parameters |

#### Usage

Similar to the usage of [on_buildcmd_file](#on_buildcmd_file), but the time when this interface is called is after compiling a certain source file,
Generally used for post-processing some compiled object files.

## after_build_files

- Customize the compiled script to process multiple source files at once

#### Function Prototype

::: tip API
```lua
after_build_files(script: <function (target, sourcebatch, opt)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After build files script function with target, sourcebatch and opt parameters |

#### Usage

The usage is similar to [on_build_files](#on_build_files), but the time when this interface is called is after some source files are compiled,
Generally used for post-processing some compiled object files.

## after_buildcmd_files

- Customize the compiled batch script to process multiple source files at once

#### Function Prototype

::: tip API
```lua
after_buildcmd_files(script: <function (target, batchcmds, sourcebatch, opt)>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After build command files script function with target, batchcmds, sourcebatch and opt parameters |

#### Usage

The usage is similar to [on_buildcmd_files](#on_buildcmd_files), but the time when this interface is called is after compiling some source files,
Generally used for post-processing some compiled object files.

## rule_end

- End definition rules

#### Function Prototype

::: tip API
```lua
rule_end()
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| - | No parameters |

#### Usage

This is optional. If you want to manually end the rule definition, you can call it:

```lua
rule("test")
    -- ..
rule_end()
```
