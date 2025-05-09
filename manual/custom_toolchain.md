
After version 2.3.4, xmake has supported custom toolchain in user's project xmake.lua, for example:

```lua
-- define toolchain
toolchain("myclang")

    -- mark as standalone toolchain
    set_kind("standalone")
        
    -- set toolset
    set_toolset("cc", "clang")
    set_toolset("cxx", "clang", "clang++")
    set_toolset("ld", "clang++", "clang")
    set_toolset("sh", "clang++", "clang")
    set_toolset("ar", "ar")
    set_toolset("ex", "ar")
    set_toolset("strip", "strip")
    set_toolset("mm", "clang")
    set_toolset("mxx", "clang", "clang++")
    set_toolset("as", "clang")

    add_defines("MYCLANG")

    -- check toolchain
    on_check(function (toolchain)
        return import("lib.detect.find_tool")("clang")
    end)

    -- on load
    on_load(function (toolchain)

        -- get march
        local march = is_arch("x86_64", "x64") and "-m64" or "-m32"

        -- init flags for c/c++
        toolchain:add("cxflags", march)
        toolchain:add("ldflags", march)
        toolchain:add("shflags", march)
        if not is_plat("windows") and os.isdir("/usr") then
            for _, includedir in ipairs({"/usr/local/include", "/usr/include"}) do
                if os.isdir(includedir) then
                    toolchain:add("includedirs", includedir)
                end
            end
            for _, linkdir in ipairs({"/usr/local/lib", "/usr/lib"}) do
                if os.isdir(linkdir) then
                    toolchain:add("linkdirs", linkdir)
                end
            end
        end

        -- init flags for objc/c++  (with ldflags and shflags)
        toolchain:add("mxflags", march)

        -- init flags for asm
        toolchain:add("asflags", march)
    end)
```

Then use the following command to cut to the toolchain you defined:

```bash
$ xmake f --toolchain=myclang
```

Of course, we can also switch to the specified target directly to the custom toolchain through the `set_toolchains` interface.

Before customizing the tool, we can run the following command to view the complete list of built-in toolchains to ensure that xmake does not provide it. If so, just use it directly. There is no need to define it yourself:

```bash
$ xmake show -l toolchains
```

The following is a list of interfaces currently supported by the custom toolchain:

| Interface                                                              | Description                                   | Supported Version |
| -----------------------------------------------                        | - ------------------------------------------- | ------ -          |
| [toolchain](#toolchain)                                                | Define Toolchain                              | >= 2.3.4          |
| [set_kind](#toolchainset_kind)                                         | Set toolchain type                            | >= 2.3.4          |
| [set_toolset](#toolchainset_toolset)                                 | Set toolset                                   | >= 2.3.4          |
| [set_sdkdir](#toolchainset_sdkdir)                                     | Set toolchain sdk directory path              | >= 2.3.4          |
| [set_bindir](#toolchainset_bindir)                                     | Set toolchain bin directory path              | >= 2.3.4          |
| [on_check](#toolchainon_check)                                         | Check toolchain                               | >= 2.3.4          |
| [on_load](#toolchainonon_load)                                         | Load Toolchain                                | >= 2.3.4          |
| [toolchain_end](#toolchain_end)                                        | End defining toolchain                        | >= 2.3.4          |
| [add_includedirs](/manual/project_target?id=targetadd_includedirs)     | Add header file search directory              | >= 2.3.4          |
| [add_defines](/manual/project_target?id=targetadd_defines)             | Add Macro Definition                          | >= 2.3.4          |
| [add_undefines](/manual/project_target?id=targetadd_undefines)         | Cancel macro definition                       | >= 2.3.4          |
| [add_cflags](/manual/project_target?id=targetadd_cflags)               | Add c compilation option                      | >= 2.3.4          |
| [add_cxflags](/manual/project_target?id=targetadd_cxflags)             | Add c/c++ compilation options                 | >= 2.3.4          |
| [add_cxxflags](/manual/project_target?id=targetadd_cxxflags)           | Add c++ compilation options                   | >= 2.3.4          |
| [add_mflags](/manual/project_target?id=targetadd_mflags)               | Add objc compilation option                   | >= 2.3.4          |
| [add_mxflags](/manual/project_target?id=targetadd_mxflags)             | Add objc/objc++ compilation options           | >= 2.3.4          |
| [add_mxxflags](/manual/project_target?id=targetadd_mxxflags)           | Add objc++ compilation options                | >= 2.3.4          |
| [add_scflags](/manual/project_target?id=targetadd_scflags)             | Add swift compilation options                 | >= 2.3.4          |
| [add_asflags](/manual/project_target?id=targetadd_asflags)             | Add assembly compilation options              | >= 2.3.4          |
| [add_gcflags](/manual/project_target?id=targetadd_gcflags)             | Add go compilation options                    | >= 2.3.4          |
| [add_dcflags](/manual/project_target?id=targetadd_dcflags)             | Add dlang compilation options                 | >= 2.3.4          |
| [add_rcflags](/manual/project_target?id=targetadd_rcflags)             | Add rust compilation option                   | >= 2.3.4          |
| [add_cuflags](/manual/project_target?id=targetadd_cuflags)             | Add cuda compilation options                  | >= 2.3.4          |
| [add_culdflags](/manual/project_target?id=targetadd_culdflags)         | Add cuda device link option                   | >= 2.3.4          |
| [add_ldflags](/manual/project_target?id=targetadd_ldflags)             | Add link options                              | >= 2.3.4          |
| [add_arflags](/manual/project_target?id=targetadd_arflags)             | Add static library archive option             | >= 2.3.4          |
| [add_shflags](/manual/project_target?id=targetadd_shflags)             | Add dynamic library link option               | >= 2.3.4          |
| [add_languages](/manual/project_target?id=targetadd_languages)         | Add language standards                        | >= 2.3.4          |
| [add_frameworks](/manual/project_target?id=targetadd_frameworks)       | Add Link Frame                                | >= 2.3.4          |
| [add_frameworkdirs](/manual/project_target?id=targetadd_frameworkdirs) | Add Link Framework                            | >= 2.3.4          |

### toolchain

#### Define toolchain

It can be defined in the user project xmake.lua, or it can be independently defined by a separate xmake.lua to specifically define various toolchains

```lua
toolchain("myclang")
    set_toolset("cc", "clang")
    set_toolset("cxx", "clang", "clang++")
toolchain_end()
```

#### Define cross toolchain

We can also customize the configuration for different cross toolchain sdk in xmake.lua. Usually only need to specify sdkdir, xmake can automatically detect other configurations, such as cross and other information, for example:

```lua
toolchain("my_toolchain")
    set_kind("standalone")
    set_sdkdir("/tmp/arm-linux-musleabi-cross")
toolchain_end()

target("hello")
    set_kind("binary")
    add_files("apps/hello/*.c")
```

This is the most streamlined cross-toolchain configuration. It only sets the corresponding SDK path, and then marks it as a complete and independent toolchain by `set_kind("standalone")`.

At this time, we can use the command line `--toolchain=my_toolchain` to manually switch to this toolchain.

```console
xmake f --toolchain=my_toolchain
xmake
```

In addition, we can also directly bind it to the corresponding target through `set_toolchains` in xmake.lua, then only when this target is compiled, will we switch to our custom toolchain.


```lua
toolchain("my_toolchain")
    set_kind("standalone")
    set_sdkdir("/tmp/arm-linux-musleabi-cross")
toolchain_end()

target("hello")
    set_kind("binary")
    add_files("apps/hello/*.c")
    set_toolchains("my_toolchain")
```

In this way, we no longer need to switch the toolchain manually, just execute xmake, and it will automatically switch to the my_toolchain toolchain by default.

This is especially useful for embedded development, because there are many cross-compilation tool chains for embedded platforms, and we often need various switches to complete the compilation of different platforms.

Therefore, we can place all toolchain definitions in a separate lua file to define, for example:

```
projectdir
    -xmake.lua
    -toolchains
      -my_toolchain1.lua
      -my_toolchain2.lua
      -...
```

Then, we only need to introduce them through includes in xmake.lua, and bind different tool chains according to different custom platforms:

```lua
includes("toolchains/*.lua")
target("hello")
    set_kind("binary")
    add_files("apps/hello/*.c")
    if is_plat("myplat1") then
        set_toolchains("my_toolchain1")
    elseif is_plat("myplat2") then
        set_toolchains("my_toolchain2")
    end
```

In this way, we can quickly switch the designated platform directly when compiling to automatically switch the corresponding tool chain.

```console
xmake f -p myplat1
xmake
```

If some cross-compilation toolchains are complex in structure and automatic detection is not enough, you can use `set_toolset`, `set_cross` and `set_bindir` interfaces according to the actual situation to configure other settings in a targeted manner.

For example, in the following example, we also added some cxflags/ldflags and the built-in system library links.

```lua
toolchain("my_toolchain")
    set_kind("standalone")
    set_sdkdir("/tmp/arm-linux-musleabi-cross")
    on_load(function (toolchain)
        - add flags for arch
        if toolchain:is_arch("arm") then
            toolchain:add("cxflags", "-march=armv7-a", "-msoft-float", {force = true})
            toolchain:add("ldflags", "-march=armv7-a", "-msoft-float", {force = true})
        end
        toolchain:add("ldflags", "--static", {force = true})
        toolchain:add("syslinks", "gcc", "c")
    end)
```

For more examples of custom toolchains, we can see the following interface documents, or refer to the built-in toolchain definition in the directory of xmake source code: [Internal Toolchain List](https://github.com/xmake-io /xmake/blob/master/xmake/toolchains/)

### toolchain:set_kind

#### Set toolchain type

Currently only supports the setting of `standalone` type, which means that the current toolchain is an independent and complete toolchain, including a complete set of tool set configurations such as cc/cxx/ld/sh/ar and other compilers, archivers, and linkers.

Usually used when a target is set with multiple toolchains at the same time, but only one independent toolchain can be effective at the same time. This configuration can ensure that the toolchains in effect are mutually exclusive. For example, the gcc/clang toolchain will not be simultaneously. Take effect.

However, local toolchains such as yasm/nasm belong to the extension of additional local toolchains, and there is no need to set up standalone because two toolchains of clang/yasm may exist at the same time.

!> Just remember that the toolchain with a complete compilation environment is set to standalone

### toolchain:set_toolset

#### Set Tool Set

Used to set the name and path of each individual tool, for example:

```lua
toolchain("myclang")
    set_kind("standalone")
    set_toolset("cc", "clang")
    set_toolset("cxx", "clang", "clang++")
    set_toolset("ld", "clang++", "clang")
    set_toolset("sh", "clang++", "clang")
    set_toolset("ar", "ar")
    set_toolset("ex", "ar")
    set_toolset("strip", "strip")
    set_toolset("mm", "clang")
    set_toolset("mxx", "clang", "clang++")
    set_toolset("as", "clang")
```

If you provide multiple tool options, they will be searched in order.
For example, the following will attempt to find `clang` and will then try to use `gcc` if `clang` cannot be found:

```lua
    set_toolset("cc", "clang", "gcc")
```

If your tool has the same name as a supported tool but a different name, you can specify this as `{generic tool name}@{tool name}`.
For example the following will look for a C compiler called `clang-mytarget` suffix but will then assume that the tool behaves like clang:

```lua
    set_toolset("cc", "clang@clang-mytarget")
```

For details about this interface, you can see: [target.set_toolset](/manual/project_target?id=targetset_toolset)

### toolchain:set_sdkdir

#### Set toolchain sdk directory path

Usually we can configure the sdk directory through `xmake f --toolchain=myclang --sdk=xxx`, but each time the configuration is more cumbersome, we can also pre-configure to xmake.lua through this interface to facilitate quick switching.

```lua
toolchain("myclang")
    set_kind("standalone")
    set_sdkdir("/tmp/sdkdir")
    set_toolset("cc", "clang")
```

### toolchain:set_bindir

#### Set toolchain bin directory path

Normally, we can configure the SDK directory through `xmake f --toolchain=myclang --bin=xxx`, but each time the configuration is more cumbersome, we can also pre-configure to xmake.lua through this interface, which is convenient for quick switching.

```lua
toolchain("myclang")
    set_kind("standalone")
    set_bindir("/tmp/sdkdir/bin")
    set_toolset("cc", "clang")
```

### toolchain:on_check

#### Detection toolchain

It is used to detect whether the sdk or program where the specified toolchain exists exists on the current system. It is usually used in the case of multiple standalone toolchains to automatically detect and select an effective toolchain.

For scenes specified manually by `xmake f --toolchain=myclang`, this detection configuration is not necessary and can be omitted.

```lua
toolchain("myclang")
    on_check(function (toolchain)
        return import("lib.detect.find_tool")("clang")
    end)
```

### toolchain:on_load

#### Load toolchain

For some complex scenarios, we can dynamically and flexibly set various toolchain configurations in on_load, which is more flexible and powerful than setting in the description field:

```lua
toolchain("myclang")
    set_kind("standalone")
    on_load(function (toolchain)
        
        -- set toolset
        toolchain:set("toolset", "cc", "clang")
        toolchain:set("toolset", "ld", "clang++")

        -- init flags 
        local march = toolchain:is_arch("x86_64", "x64") and "-m64" or "-m32"
        toolchain:add("cxflags", march)
        toolchain:add("ldflags", march)
        toolchain:add("shflags", march)
    end)
```

### toolchain_end

#### End definition toolchain

This is optional, if you want to manually end the definition of toolchain, you can call it:

```lua
toolchain("myclang")
    - ..
toolchain_end()
```
