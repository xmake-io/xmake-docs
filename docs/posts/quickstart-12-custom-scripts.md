---
title: Xmake Getting Started Tutorial 12, More Flexible Configuration Through Custom Scripts
tags: [xmake, lua, subproject, submodule, custom script]
date: 2020-07-18
author: Ruki
---

xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance, 
and a consistent build experience across platforms.

This article mainly explains in detail how to achieve more complex and flexible customization in the script domain by adding custom scripts.

* [Project Source](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io)

### Configuration Separation

xmake.lua uses the 80/20 principle to achieve two-layer separated configuration: description domain and script domain.

What is the 80/20 principle? Simply put, for most project configurations, 80% of the time, they are basic常规配置, such as: `add_cxflags`, `add_links`, etc.
Only the remaining less than 20% of places need additional complexity to meet some special configuration requirements.

And this remaining 20% of configurations are usually more complex. If they are directly filled throughout xmake.lua, it will make the entire project configuration very messy and unreadable.

Therefore, xmake uses two different configuration methods, description domain and script domain, to isolate 80% of simple configurations and 20% of complex configurations, making the entire xmake.lua look very clear and intuitive, with optimal readability and maintainability.

### Description Domain

For novice users who are just getting started, or for maintaining some simple small projects, using only description configuration is already sufficient. So what is the description domain? It looks like this:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("DEBUG")
    add_syslinks("pthread")
```

At first glance, it's actually just a collection of `set_xxx`/`add_xxx` configurations. For novices, you can completely not treat it as a lua script, just as an ordinary configuration file with some basic rules.

Doesn't this look more like a configuration file? Actually, the description domain is a configuration file, similar to key/value configurations like json, so even novices who don't know lua at all can get started quickly.

Moreover, for usual projects, configuring various project settings only through `set_xxx/add_xxx` is already sufficient.

This is what was said at the beginning: 80% of the time, you can use the simplest configuration rules to simplify project configuration, improve readability and maintainability, which is very friendly to both users and developers, and more intuitive.

What if we want to do conditional judgments for different platforms and architectures? No problem, the description domain supports conditional judgments and for loops in addition to basic configuration:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("DEBUG")
    if is_plat("linux", "macosx") then
        add_links("pthread", "m", "dl")
    end
```

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("DEBUG")
    for _, name in ipairs({"pthread", "m", "dl"}) do
        add_links(name)
    end
```

Doesn't this look a bit like lua? Although you can usually treat it as an ordinary configuration problem, xmake is after all based on lua, so the description domain still supports basic lua language features.

:::note
However, it should be noted that although the description domain supports lua script syntax, try not to write too complex lua scripts in the description domain, such as some time-consuming function calls and for loops.
:::

And in the description domain, the main purpose is to set configuration items, so xmake does not fully open all module interfaces. Many interfaces are prohibited from being called in the description domain.
Even some of the callable interfaces that are opened are completely read-only, non-time-consuming safe interfaces, such as: `os.getenv()` to read some常规系统信息, used for configuration logic control.

:::note
Also note that xmake.lua will be parsed multiple times, used to parse different configuration domains at different stages: such as: `option()`, `target()` and other domains.
:::

Therefore, don't think about writing complex lua scripts in the description domain of xmake.lua, and don't call print in the description domain to display information, because it will be executed multiple times. Remember: it will be executed multiple times!!!

### Script Domain

Restricting the description domain from writing complex lua, and various lua modules and interfaces can't be used? What to do? This is when the script domain comes into play.

If users are already fully familiar with xmake's description domain configuration and feel that some special configuration maintenance for the project cannot be satisfied, then we can do more complex configuration logic in the script domain:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load(function (target)
        if is_plat("linux", "macosx") then
            target:add("links", "pthread", "m", "dl")
        end
    end)
    after_build(function (target)
        import("core.project.config")
        local targetfile = target:targetfile()
        os.cp(targetfile, path.join(config.buildir(), path.filename(targetfile)))
        print("build %s", targetfile)
    end)
```

Any script inside a function body like: `on_xxx`, `after_xxx`, `before_xxx`, etc., belongs to the script domain.

In the script domain, users can do anything. xmake provides the import interface to import various built-in lua modules of xmake, and can also import user-provided lua scripts.

We can implement any function you want in the script domain, and even write an independent project.

For some script fragments, if they're not too bloated, writing them inline like above is sufficient. If you need to implement more complex scripts and don't want to fill up one xmake.lua, you can separate the scripts into independent lua files for maintenance.

For example:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load("modules.test.load")
    on_install("modules.test.install")
```

We can place custom scripts in the directory corresponding to xmake.lua, `modules/test/load.lua` and `modules/test/install.lua`, for independent maintenance.

A separate lua script file uses main as the main entry point, for example:

```lua
-- We can also import some built-in modules or our own extension modules here for use
import("core.project.config")
import("mymodule")

function main(target)
    if is_plat("linux", "macosx") then
        target:add("links", "pthread", "m", "dl")
    end
end
```

In these independent lua scripts, we can also import various built-in modules and custom modules through [import](https://xmake.io) for use, just like writing lua or java normally.

For different stages of the script domain, `on_load` is mainly used when the target is loaded to do some dynamic configuration. Unlike the description domain, this will only be executed once!!!

There are many other stages, such as: `on/after/before`_`build/install/package/run`, etc. We will describe them in detail below.

### import

#### Importing Extension Modules

Before explaining each script domain, let's briefly introduce xmake's module import and usage. xmake uses import to introduce other extension modules, as well as user-defined modules. It can be used in the following places:

* Custom scripts ([on_build](https://xmake.io), [on_run](https://xmake.io) ..)
* Plugin development
* Template development
* Platform extensions
* Custom tasks

The import mechanism is as follows:

1. First import from the current script directory
2. Then import from extension libraries

The syntax rules for import:

Based on `.` library path rules, for example:

```lua
import("core.base.option")
import("core.base.task")

function main()
    
    -- Get parameter options
    print(option.get("version"))

    -- Run tasks and plugins
    task.run("hello")
end
```

Import custom modules from the current directory:

Directory structure:

```
plugin
  - xmake.lua
  - main.lua
  - modules
    - hello1.lua
    - hello2.lua
```

Import modules in main.lua

```lua
import("modules.hello1")
import("modules.hello2")
```

After importing, you can directly use all public interfaces inside. Private interfaces are marked with the `_` prefix, indicating that they will not be exported and will not be called externally.

In addition to the current directory, we can also import libraries from other specified directories, for example:

```lua
import("hello3", {rootdir = "/home/xxx/modules"})
```

To prevent naming conflicts, you can also specify an alias after import:

```lua
import("core.platform.platform", {alias = "p"})

function main()
    -- This way we can use p to call the platform module's plats interface to get a list of all platforms supported by xmake
    print(p.plats())
end
```

Version 2.1.5 added two new properties: `import("xxx.xxx", {try = true, anonymous = true})`

If try is true, if the imported module does not exist, it will only return nil and will not throw an exception to interrupt xmake.
If anonymous is true, the imported module will not be introduced into the current scope, and the import interface will only return the imported object reference.

### Testing Extension Modules

One way is that we can directly call print in scripts like on_load to print the call result information of modules for testing and verification.

However, xmake also provides the `xmake lua` plugin for more flexible and convenient script testing.

#### Running Specified Script Files

For example, we can directly specify a lua script to load and run. This is a good way to quickly test some interface modules and verify some of your ideas.

Let's write a simple lua script first:

```lua
function main()
    print("hello xmake!")
end
```

Then just run it directly:

```console
$ xmake lua /tmp/test.lua
```

#### Directly Calling Extension Modules

All built-in module and extension module interfaces can be directly called through `xmake lua`, for example:

```console
$ xmake lua lib.detect.find_tool gcc
```

The above command directly calls the `import("lib.detect.find_tool")` module interface for quick execution.

#### Running Interactive Commands (REPL)

Sometimes in interactive mode, running commands is more convenient for testing and verifying some modules and APIs, and is more flexible, without needing to write an additional script file to load.

Let's first see how to enter interactive mode:

```console
# Execute without any parameters to enter
$ xmake lua
>

# Expression calculation
> 1 + 2
3

# Assignment and printing variable values
> a = 1
> a
1

# Multi-line input and execution
> for _, v in pairs({1, 2, 3}) do
>> print(v)
>> end
1
2
3
```

We can also import extension modules through `import`:

```console
> task = import("core.project.task")
> task.run("hello")
hello xmake!
```

If you want to cancel multi-line input midway, just enter the character: `q`

```console
> for _, v in ipairs({1, 2}) do
>> print(v)
>> q             <--  Cancel multi-line input, clear previous input data
> 1 + 2
3
```

### target:on_load

#### Custom Target Loading Script

When the target is initialized and loaded, this script will be executed. You can do some dynamic target configuration inside to achieve more flexible target description definitions, for example:

```lua
target("test")
    on_load(function (target)
        target:add("defines", "DEBUG", "TEST=\"hello\"")
        target:add("linkdirs", "/usr/lib", "/usr/local/lib")
        target:add({includedirs = "/usr/include", "links" = "pthread"})
    end)
```

In `on_load`, you can dynamically add various target properties through `target:set`, `target:add`. All `set_`, `add_` configurations in the description domain can be dynamically configured this way.

In addition, we can call some interfaces of target to get and set some basic information, for example:

| target Interface                          | Description                                                             |
| ----------------------------------- | ---------------------------------------------------------------- |
| target:name()                       | Get target name                                                       |
| target:targetfile()                 | Get target file path                                                 |
| target:targetkind()                 | Get target build type                                               |
| target:get("defines")               | Get target macro definitions                                                 |
| target:get("xxx")                   | Other target information set through `set_/add_` interfaces can be obtained through this interface |
| target:add("links", "pthread")      | Add target settings                                                     |
| target:set("links", "pthread", "z") | Overwrite target settings                                                     |
| target:deps()                       | Get all dependent targets of the target                                           |
| target:dep("depname")               | Get specified dependent target                                               |
| target:opts()                       | Get all associated options of the target                                           |
| target:opt("optname")               | Get specified associated option                                               |
| target:pkgs()                       | Get all associated dependency packages of the target                                         |
| target:pkg("pkgname")               | Get specified associated dependency package                                             |
| target:sourcebatches()              | Get all source file lists of the target                                         |

### target:on_link

#### Custom Link Script

This is a new interface added after v2.2.7, used for customized processing of the target's linking process.

```lua
target("test")
    on_link(function (target) 
        print("link it")
    end)
```

### target:on_build

#### Custom Build Script

Override the target's default build behavior to implement a custom compilation process. Generally, this is not needed unless you really need to do some compilation operations that xmake doesn't provide by default.

You can override it in the following way to customize compilation operations:

```lua
target("test")

    -- Set custom build script
    on_build(function (target) 
        print("build it")
    end)
```

Note: After version 2.1.5, all target custom scripts can be processed separately for different platforms and architectures, for example:

```lua
target("test")
    on_build("iphoneos|arm*", function (target)
        print("build for iphoneos and arm")
    end)
```

If the first parameter is a string, it specifies which `platform|architecture` this script needs to be executed under, and supports pattern matching, such as `arm*` matching all arm architectures.

Of course, you can also only set the platform without setting the architecture, which means matching the specified platform and executing the script:

```lua
target("test")
    on_build("windows", function (target)
        print("build for windows")
    end)
```

Note: Once you set your own build process for this target, xmake's default build process will no longer be executed.

### target:on_build_file

#### Custom Build Script, Implementing Single File Build

Through this interface, you can hook the specified target's built-in build process and re-implement the compilation process for each source file:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_build_file(function (target, sourcefile, opt)
    end)
```

### target:on_build_files

#### Custom Build Script, Implementing Multi-file Build

Through this interface, you can hook the specified target's built-in build process and replace the compilation process for a batch of source files of the same type:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_build_files(function (target, sourcebatch, opt)
    end)
```

After setting this interface, the files in the corresponding source file list will not appear in the custom target.on_build_file, because this is an inclusion relationship.

Where sourcebatch describes this batch of source files of the same type:

* `sourcebatch.sourcekind`: Get the type of this batch of source files, such as: cc, as, ..
* `sourcebatch.sourcefiles()`: Get source file list
* `sourcebatch.objectfiles()`: Get object file list
* `sourcebatch.dependfiles()`: Get corresponding dependency file list, containing compilation dependency information in source files, such as: xxx.d

### target:on_clean

#### Custom Clean Script

Override the target's `xmake [c|clean]` clean operation to implement a custom clean process.

```lua
target("test")

    -- Set custom clean script
    on_clean(function (target) 

        -- Only delete target file
        os.rm(target:targetfile())
    end)
```

### target:on_package

#### Custom Package Script

Override the target's `xmake [p|package]` package operation to implement a custom package process. If you want to package a specified target into your desired format, you can customize it through this interface.

```lua
target("demo")
    set_kind("shared")
    add_files("jni/*.c")
    on_package(function (target) 
        os.exec("./gradlew app:assembleDebug") 
    end)
```

Of course, this example is a bit old. It's just used here to illustrate the usage. Now xmake provides a dedicated [xmake-gradle](https://github.com/xmake-io/xmake-gradle) plugin for better integration with gradle.

### target:on_install

#### Custom Install Script

Override the target's `xmake [i|install]` install operation to implement a custom install process.

For example, install the generated apk package.

```lua
target("test")

    -- Set custom install script, automatically install apk file
    on_install(function (target) 

        -- Use adb to install the packaged apk file
        os.run("adb install -r ./bin/Demo-debug.apk")
    end)
```

### target:on_uninstall

#### Custom Uninstall Script

Override the target's `xmake [u|uninstall]` uninstall operation to implement a custom uninstall process.

```lua
target("test")
    on_uninstall(function (target) 
        ...
    end)
```

### target:on_run

#### Custom Run Script

Override the target's `xmake [r|run]` run operation to implement a custom run process.

For example, run the installed apk program:

```lua
target("test")

    -- Set custom run script, automatically run the installed app program and automatically get device output information
    on_run(function (target) 
        os.run("adb shell am start -n com.demo/com.demo.DemoTest")
        os.run("adb logcat")
    end)
```

### before_xxx and after_xxx

It should be noted that all interfaces of target:on_xxx override the internal default implementation. Usually we don't need to completely rewrite it, just hook some of our own logic. In that case, we can use the `target:before_xxx` and `target:after_xxx` series scripts.

All on_xxx have corresponding before_ and after_xx versions, with exactly the same parameters, for example:

```lua
target("test")
    before_build(function (target)
        print("")
    end)
```

### Built-in Modules

In custom scripts, in addition to using the import interface to import various extension modules for use, xmake also provides many basic built-in modules, such as: os, io and other basic operations, to achieve more cross-platform processing of system interfaces.

#### os.cp

os.cp behaves similarly to the `cp` command in shell, but is more powerful. It not only supports pattern matching (using lua pattern matching), but also ensures recursive directory creation of the destination path and supports xmake's built-in variables.

For example:

```lua
os.cp("$(scriptdir)/*.h", "$(buildir)/inc")
os.cp("$(projectdir)/src/test/**.h", "$(buildir)/inc")
```

The above code will: copy all header files under the current `xmake.lua` directory and all header files under the project source test directory to the `$(buildir)` output directory.

Among them, `$(scriptdir)`, `$(projectdir)` and other variables are xmake's built-in variables. For specific details, see the relevant documentation: [Built-in Variables](https://xmake.io/mirror/zh-cn/manual/builtin_variables.html).

The matching patterns in `*.h` and `**.h` are similar to those in [add_files](https://xmake.io). The former is single-level directory matching, and the latter is recursive multi-level directory matching.

The above copy will expand all files and copy them to the specified directory, losing the source directory hierarchy. If you want to maintain the original directory structure when copying, you can set the rootdir parameter:

```lua
os.cp("src/**.h", "/tmp/", {rootdir = "src"})
```

The above script can copy all sub-files under src while maintaining the directory structure according to the `src` root directory.

Note: Try to use the `os.cp` interface instead of `os.run("cp ..")`, which can better ensure platform consistency and achieve cross-platform build descriptions.

#### os.run

This interface will quietly run native shell commands, used to execute third-party shell commands, but will not echo output, only highlight error information after errors.

This interface supports parameter formatting and built-in variables, for example:

```lua
-- Format parameters
os.run("echo hello %s!", "xmake")

-- List build directory files
os.run("ls -l $(buildir)")
```

#### os.execv

This interface, compared to os.run, will also echo output during execution, and parameters are passed in as a list, which is more flexible.

```lua
os.execv("echo", {"hello", "xmake!"})
```

In addition, this interface also supports an optional parameter for passing settings: redirect output, execution environment variable settings, for example:

```lua
os.execv("echo", {"hello", "xmake!"}, {stdout = outfile, stderr = errfile, envs = {PATH = "xxx;xx", CFLAGS = "xx", curdir = "/tmp"}}
```

Among them, stdout and stderr parameters are used to pass redirected output and error output. You can directly pass file paths, or pass file objects opened by io.open.

In addition, if you want to temporarily set and modify some environment variables during this execution, you can pass the envs parameter. The environment variable settings inside will replace the existing settings, but will not affect the outer execution environment, only the current command.

We can also get all current environment variables through the `os.getenvs()` interface, then modify part of them and pass them into the envs parameter.

In addition, you can also set the curdir parameter to modify the working directory of the child process during execution.

Related similar interfaces include os.runv, os.exec, os.execv, os.iorun, os.iorunv, etc. For example, os.iorun can get the output content of the run.

For specific details and differences of this, and more os interfaces, please see: [os Interface Documentation](https://xmake.io) for details.

#### io.readfile

This interface reads all content from the specified path file. We can directly read the entire file content without opening the file, which is more convenient, for example:

```lua
local data = io.readfile("xxx.txt")
```

#### io.writefile

This interface writes all content to the specified path file. We can directly write the entire file content without opening the file, which is more convenient, for example:

```lua
io.writefile("xxx.txt", "all data")
```

#### path.join

This interface implements cross-platform path concatenation operations, appending multiple path items. Due to the path differences between `windows/unix` styles, using APIs to append paths is more cross-platform, for example:

```lua
print(path.join("$(tmpdir)", "dir1", "dir2", "file.txt"))
```

The above concatenation is equivalent to: `$(tmpdir)/dir1/dir2/file.txt` on unix, and equivalent to: `$(tmpdir)\\dir1\\dir2\\file.txt` on windows.

For more built-in module details, see: [Built-in Module Documentation](https://xmake.io)

