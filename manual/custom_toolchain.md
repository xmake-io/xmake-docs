
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

#### Loading toolchain

For some complex scenarios, we can dynamically and flexibly set various toolchain configurations in on_load, which is more flexible and powerful than setting in the description field:

```lua
toolchain("myclang")
    set_kind("standalone")
    on_load(function (toolchain)
        
        - set toolset
        toolchain:set("toolset", "cc", "clang")
        toolchain:set("toolset", "ld", "clang++")
        - ..

        - get march
        local march = is_arch("x86_64", "x64") and "-m64" or "-m32"

        - init flags for c/c++
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

        - init flags for objc/c++ (with ldflags and shflags)
        toolchain:add("mxflags", march)

        - init flags for asm
        toolchain:add("asflags", march)
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
