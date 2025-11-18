---
title: Xmake Getting Started Tutorial 11, How to Organize and Build Large Projects
tags: [xmake, lua, subproject, submodule]
date: 2020-04-11
author: Ruki
---

xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance, 
and a consistent build experience across platforms.

This article mainly explains in detail how to organize and build a large-scale project by configuring sub-project modules.

* [Project Source](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io)

### Maintaining Simple Project Structure

For some lightweight small projects, usually only a single xmake.lua file is needed. The general structure is as follows:

```
projectdir
  - xmake.lua
  - src
    - test
      - *.c
    - demo
      - *.c
```

The source code hierarchy is simple. Usually, you only need to maintain one xmake.lua in the project root directory to define all targets to complete the build. It doesn't look very complicated and is very clear.

```lua
-- Set common configuration in root scope, all current targets will take effect
add_defines("COMMON")

target("test")
    set_kind("static")
    add_files("src/test/*.c")
    add_defines("TEST")

target("demo")
    set_kind("static")
    add_files("src/demo/*.c")
    add_defines("DEMO")
```

### Maintaining Complex Project Structure

But for some large projects, the organizational structure is usually very hierarchical and deep, and the number of target targets that need to be compiled may be dozens or even hundreds. At this time, if they are all maintained in the root xmake.lua file, it becomes a bit overwhelming.

At this time, we need to create separate xmake.lua files in each sub-project module to maintain them, and then use the includes interface provided by xmake to include them according to the hierarchical relationship, eventually forming a tree structure:

```
projectdir
  - xmake.lua
  - src
    - test
      - xmake.lua
      - test1
        - xmake.lua
      - test2
        - xmake.lua
      - test3
        - xmake.lua
    - demo
      - xmake.lua
      - demo1
        - xmake.lua
      - demo2
        - xmake.lua
    ...
```

Then, the root xmake.lua will include all sub-project xmake.lua files through hierarchical includes, so all target configurations defined in sub-projects will also be fully included. When compiling, we never need to switch to a sub-project directory to operate separately. We just need to:

```bash
$ xmake build test1
$ xmake run test3
$ xmake install demo1
```

This can compile, run, package, and install the specified sub-project targets. So unless there are special circumstances, it is not recommended to switch back and forth between directories to compile sub-projects separately, as it is very tedious.

### Root xmake.lua File Configuration

The recommended approach is to configure only some common settings for all targets in the root xmake.lua, as well as includes references to sub-projects, without placing target definitions, for example:

```lua
-- define project
set_project("tbox")
set_xmakever("2.3.2")
set_version("1.6.5", {build = "%Y%m%d%H%M"})

-- set common flags
set_warnings("all", "error")
set_languages("c99")
add_cxflags("-Wno-error=deprecated-declarations", "-fno-strict-aliasing", "-Wno-error=expansion-to-defined")
add_mxflags("-Wno-error=deprecated-declarations", "-fno-strict-aliasing", "-Wno-error=expansion-to-defined")

-- add build modes
add_rules("mode.release", "mode.debug")

-- includes sub-projects
includes("test", "demo")
```

All settings in xmake are inherited in a tree-like manner. The root scope settings in the root xmake.lua will take effect for all targets in the included sub-xmake.lua files,
but not the other way around. The root scope settings in sub-xmake.lua files only take effect for their sub-xmake.lua files below them, and will not affect the targets defined in the parent xmake.lua.

### Sub-xmake.lua File Configuration

So, we can configure xmake.lua separately in each sub-project directory. All configurations inside will not interfere with the parent xmake.lua, and will only take effect for more granular sub-projects below it. This works layer by layer in a tree-like manner.

Since most common configurations have already been configured in the root xmake.lua, we can focus on configuring settings that are only useful for test in the test sub-project, for example, for `projectdir/test/xmake.lua`:

```lua
add_defines("TEST")

target("test1")
    set_kind("static")
    add_files("test1/*.c")
    add_defines("TEST1")

target("test2")
    set_kind("static")
    add_files("test2/*.c")
    add_defines("TEST2")
```

We can define all targets for test here. Of course, we can also continue to layer, maintaining xmake.lua separately in each test1, test2 directory. This depends on the scale of your project.

For example:

```lua
add_defines("TEST")
includes("test1", "test2")
```

test1/xmake.lua

```lua
target("test1")
    set_kind("static")
    add_files("test1/*.c")
    add_defines("TEST1")
```

test2/xmake.lua

```lua
target("test2")
    set_kind("static")
    add_files("test2/*.c")
    add_defines("TEST2")
```

The `add_defines("TEST")` in the root scope here will take effect for both test1/test2 targets, but will not take effect for targets in the demo directory, because they are at the same level and have no tree-like inheritance relationship.

### Cross-xmake.lua Target Dependencies

Although `projectdir/test/xmake.lua` and `projectdir/demo/xmake.lua` are two sub-project directories at the same level, and configurations cannot interfere with each other, targets can be accessed across xmake.lua files to achieve dependencies between targets.

For example, if demo needs to depend on the test static library for linking, the xmake.lua under demo can be written like this:

```lua
target("demo1")
    set_kind("binary")
    add_files("demo1/*.c")
    add_deps("test1")
```

As long as you associate the corresponding other sub-project target as a dependency through `add_deps("test1")`, the test1 static library will be compiled first, and the demo executable program will automatically link to the libtest1.a library it generates.

### File Path Hierarchy

We need to remember that all path-related configuration interfaces, such as `add_files`, `add_includedirs`, etc., are relative to the directory where the current sub-project xmake.lua is located. So as long as the added files don't cross modules, you only need to consider the current relative path when setting them.

```
projectdir
  - test
    - xmake.lua
    - test1/*.c
    - test2/*.c
```

For example, the source file paths added here are all relative to the test sub-project directory. We don't need to set absolute paths, which simplifies things a lot.

```lua
target("test1")
    add_files("test1/*.c")
target("test2")
    add_files("test2/*.c")
```

Of course, if we have special needs and must set file paths under other sub-modules of the project? There are two methods: go out layer by layer through `../../`, or use the `$(projectdir)` built-in variable, which represents the global root directory of the project.

For example, in the demo sub-project:

```lua
target("demo1")
    set_kind("binary")
    add_files("demo1/*.c")
    add_files("../../test/test1/*.c")
```

Or:

```lua
target("demo1")
    set_kind("binary")
    add_files("demo1/*.c")
    add_files("$(projectdir)/test/test1/*.c")
```

### Advanced Usage of includes Interface

#### Incorrect Usage

The includes interface is a global interface and does not belong to any target, so please do not call it inside a target. The following is incorrect usage:

```lua
target("test")
    set_kind("static")
    includes("test1", "test2")
    add_files("test/*.c")
```

The correct usage is:

```lua
includes("test1", "test2")
target("test")
    set_kind("static")
    add_files("test/*.c")
```

Or:

```lua
target("test")
    set_kind("static")
    add_files("test/*.c")
target_end()

-- Call below, need to explicitly exit target scope first
includes("test1", "test2")
```

#### Referencing Directories or Files

In addition, includes can reference both directories and files directly. If an xmake.lua exists in the test1 directory, you can directly reference the directory with `includes("test1")`.

If the test1 directory contains other project files named xxxx.lua, you can reference them by specifying the file: `includes("test1/xxxx.lua")`, with the same effect.

#### Pattern Matching for Batch Import

includes also supports batch importing multiple sub-projects through pattern matching, for example:

```lua
includes("test/*/xmake.lua")
```

This can import configurations from all sub-project directories like test1, test2 under the test directory. If it's `**`, it also supports recursive multi-level matching:

```lua
includes("test/**/xmake.lua")
```

Through pattern matching, we only need to do includes in one place in test/xmake.lua. In the future, when users add other sub-project xmake.lua files, they will be automatically imported, which is very convenient.

#### Notes

In addition, when using includes, one thing to note is that it is not C's `#include`. Therefore, when you includes sub-configurations in the current configuration, the current configuration will not be affected, for example:

```lua
includes("xxx")

target("test")
  -- ...
```

The above includes some sub-projects, but the configurations of these sub-projects will not interfere with the current test target program.

