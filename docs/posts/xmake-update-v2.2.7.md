---
title: xmake v2.2.7 released, Improve to build Cuda project
tags: [xmake, lua, C/C++, Cuda]
date: 2019-06-17
author: Ruki
---

This version mainly makes a lot of improvements to the Cuda project, and adds support for lex/yacc compilation. 
It also adds custom support for link phases such as `on_link`, `before_link` and `after_link` to the target. 

Here, I would also like to thank @[OpportunityLiu](https://github.com/OpportunityLiu) for support for xmake. In this version [OpportunityLiu](https://github.com/OpportunityLiu) contributed a lot of code to Improve Cuda support.
In addition, he helped improve xmake's entire unit testing framework, self-updating programs, command line tab completions, and ci scripts to make xmake's update iterations more efficient and stable.

* [project source](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io)

## Introduction of new features

### Improve to build Cuda project 

#### Header file dependency detection and incremental compilation

Prior to 2.2.6, the compiler support for cuda was not perfect. At least the header file dependency detection was not provided. Therefore, if there is more cuda code, every change will compile all, not like c/c++ code. Do it to detect changes and perform incremental compilation.

In the new version, xmake has supported it, and now it is very good to handle dependencies on different platforms, which will improve the efficiency of daily compilation and development.

#### Add gencodes api

In the previous version, adding gencodes configuration was very cumbersome and not concise. You can look at the previous configuration:

```lua
target("cuda_console")
    set_kind("binary")
    add_files("src/*.cu")

    add_cuflags("-gencode arch=compute_30,code=sm_30", "-gencode arch=compute_35,code=sm_35")
    add_cuflags("-gencode arch=compute_37,code=sm_37", "-gencode arch=compute_50,code=sm_50")
    add_cuflags("-gencode arch=compute_52,code=sm_52", "-gencode arch=compute_60,code=sm_60")
    add_cuflags("-gencode arch=compute_61,code=sm_61", "-gencode arch=compute_70,code=sm_70")
    add_cuflags("-gencode arch=compute_70,code=compute_70")

    add_ldflags("-gencode arch=compute_30,code=sm_30", "-gencode arch=compute_35,code=sm_35")
    add_ldflags("-gencode arch=compute_37,code=sm_37", "-gencode arch=compute_50,code=sm_50")
    add_ldflags("-gencode arch=compute_52,code=sm_52", "-gencode arch=compute_60,code=sm_60")
    add_ldflags("-gencode arch=compute_61,code=sm_61", "-gencode arch=compute_70,code=sm_70")
    add_ldflags("-gencode arch=compute_70,code=compute_70")
```

Therefore, in order to streamline the configuration of xmake.lua, the `add_cugencodes`api added to the cuda project is used to simplify the configuration. The improvements are as follows:

```lua
target("cuda_console")
    set_kind("binary")
    add_files("src/*.cu")

    -- generate SASS code for each SM architecture
    add_cugencodes("sm_30", "sm_35", "sm_37", "sm_50", "sm_52", "sm_60", "sm_61", "sm_70")

    -- generate PTX code from the highest SM architecture to guarantee forward-compatibility
    add_cugencodes("compute_70")
```

In addition, when configured as `add_cugencodes("native")`, xmake will automatically detect the gencodes supported by the current device, which will be added automatically, which is more convenient and efficient.

This, thanks to the probe code provided by [OpportunityLiu] (https://github.com/OpportunityLiu) and the implementation of `add_cugencodes`.













#### Support device link for cuda

In the new version, xmake basically refactors the entire cuda build process, extracting the cuda-related builds to a separate cuda build rule for maintenance, and by default uses the device-link link.

For the description and benefits of device-link, please refer to the relevant official introduction: https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/

We also need devlink when compiling calls that contain `__global__` or `__device__` functions that cross compiler units, so in xmake, devlink is currently enabled by default.

For the user, there is no need to make any changes to xmake.lua. Of course, if the user wants to disable devlink manually, it is also possible:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cu")
    add_values("cuda.devlink", false) -- explicitly disable the default device-link behavior
```

#### Support for compiling cuda projects with clang

Clang currently supports compilation of *.cu files, but clan versions supported by different versions of clang have certain limitations. Clang7 can only support cuda7-9.2, 8 supports up to 10, and clan9 is required to support 10.1.

In addition to supporting nvcc to compile cuda projects, xmake can also be compiled directly into clang, for example:

```console
xmake f --cu=clang
xmake
```

However, regarding devlink, it seems that you still need to rely on nvcc, clang does not support it.

#### Switch c++ compiler for nvcc

xmake added the `--cu-ccbin=` parameter to configure the switch. The nvcc defaults to the c++ compiler and linker. The usage is as follows:

```console
xmake f --cu-ccbin=clang++
xmake
```

Let nvcc call the clang++ compiler internally when compiling cuda code.

### Custom the linking process

In the new version, we have added customization processing related to the link link phase. Users can extend their own link process by implementing `on_link`, `before_link` and `after_link` in target/rule.

For example, we want to pre-process some other things before the link phase of normal c/c++ code, such as doing something about *.o files, then we can write our own lua script in the before_link stage:

```lua
target("test")
    before_link(function (target)
        print("process objects", target:objectfiles())
    end)
```

Or we want to rewrite the built-in link process, you can use `on_link`:

```lua
target("test")
    on_link(function (target)
        print("link objects", target:objectfiles())
    end)
```

And `after_link` is to do some customization tasks after the link is completed.

### support Lex/Yacc Compilation 

Currently xmake can natively support lex/flex, yacc/bison, etc. to compile and process *.l/*.y files to quickly develop some compiler-related projects.

We only need to add lex, yacc two rules to the target, so that it can handle *.l/*.y files normally, of course *.ll/*.yy is also supported.

```lua
target("calc")
    set_kind("binary")
    add_rules("lex", "yacc")
    add_files("src/*.l", "src/*.y")
```

Here is an example code for reference: [lex_yacc_example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/lex_yacc)

### Improve to set run environments

#### Setting the running directory

We can use the `set_rundir` interface to set the current running directory of the default running target program. If not set, by default, the target is loaded and run in the directory where the executable file is located.

If the user wants to modify the load directory, one is to customize the run logic by `on_run()`, and to do the switch inside, but just to cut the directory, this is too cumbersome.

Therefore, you can quickly switch settings to the default directory environment through this interface.

```lua
target("test")
     set_kind("binary")
     add_files("src/*.c")
     set_rundir("$(projectdir)/xxx")
```

#### Adding the environment variables

Another new interface, `add_runenvs`, can be used to add environment variables that set the default run target program.

```lua
target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_runenvs("PATH", "/tmp/bin", "xxx/bin")
     add_runenvs("NAME", "value")
```

### Support Command line tab completion 

In order to improve the user experience, the new version also supports the xmake command parameter tab completion under the command line. The user can conveniently and quickly tab out all the command parameters of xmake.

Currently supports zsh/bash/sh and powershell.


### More convenient self-updating commands

In previous versions, xmake had provided a convenient self-updating command `xmake update` to update xmake's own version, or even to update the specified branch version, for example: `xmake update dev/master`

However, there are still some shortcomings:

1. Every time you update: you need to recompile the core, so the update is very slow. However, in many cases, the new version only has script changes, and the core does not change.
2. Update the specified dev/master branch, which is not perfect on Windows, a little lagging, and can't be instantly synced to the online dev/master version.

Therefore, this [OpportunityLiu](https://github.com/OpportunityLiu) has helped a lot of improvements:

1. Provide the `xmake update -s/--scriptonly` parameter, just update the lua script, do not compile the core extra, and implement a fast iterative update.
2. Improve ci script, implement ci automation build on windows, `xmake update dev` automatically pulls pre-built installation package to download update on ci
3. You can specify to update xmake from other github repos, so that contributors can update their fork version, and also switch users to repo, `xmake update gitee:tboox/xmake`

## Changelogs

### New features

* [#440](https://github.com/xmake-io/xmake/issues/440): Add `set_rundir()` and `add_runenvs()` api for target/run
* [#443](https://github.com/xmake-io/xmake/pull/443): Add tab completion support
* Add `on_link`, `before_link` and `after_link` for rule and target
* [#190](https://github.com/xmake-io/xmake/issues/190): Add `add_rules("lex", "yacc")` rules to support lex/yacc projects

### Changes

* [#430](https://github.com/xmake-io/xmake/pull/430): Add `add_cucodegens()` api to improve set codegen for cuda
* [#432](https://github.com/xmake-io/xmake/pull/432): support deps analyze for cu file 
* [#437](https://github.com/xmake-io/xmake/issues/437): Support explict git source for xmake update: `xmake update github:xmake-io/xmake#dev`
* [#438](https://github.com/xmake-io/xmake/pull/438): Support to only update scripts, `xmake update --scriptonly dev`
* [#433](https://github.com/xmake-io/xmake/issues/433): Improve cuda to support device-link
* [#442](https://github.com/xmake-io/xmake/issues/442): Improve test library

