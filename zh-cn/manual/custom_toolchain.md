
在2.3.4版本之后，xmake已经支持在用户的项目xmake.lua中自定义工具链，例如：

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

然后通过下面的命令切到自己定义的工具链就行了：

```bash
$ xmake f --toolchain=myclang
```

当然，我们也可以通过`set_toolchains`接口直接对指定target切换设置到自定义工具链。

在自定义工具前，我们可以通过先运行以下命令，查看完整的内置工具链列表，确保xmake没有提供，如果有的话，直接使用就行了，没必要自己定义：

```bash
$ xmake show -l toolchains
```

下面是自定义toolchain目前支持的接口列表：

| 接口                                                                         | 描述                                         | 支持版本 |
| -----------------------------------------------                              | -------------------------------------------- | -------- |
| [toolchain](#toolchain)                                                      | 定义工具链                                   | >= 2.3.4 |
| [set_kind](#toolchainset_kind)                                               | 设置工具链类型                               | >= 2.3.4 |
| [set_toolset](#toolchainset_toolset)                                       | 设置工具集                                   | >= 2.3.4 |
| [set_sdkdir](#toolchainset_sdkdir)                                           | 设置工具链sdk目录路径                        | >= 2.3.4 |
| [set_bindir](#toolchainset_bindir)                                           | 设置工具链bin目录路径                        | >= 2.3.4 |
| [on_check](#toolchainon_check)                                               | 检测工具链                                   | >= 2.3.4 |
| [on_load](#toolchainonon_load)                                               | 加载工具链                                   | >= 2.3.4 |
| [toolchain_end](#toolchain_end)                                              | 结束定义工具链                               | >= 2.3.4 |
| [add_includedirs](/zh-cn/manual/project_target?id=targetadd_includedirs)     | 添加头文件搜索目录                           | >= 2.3.4 |
| [add_defines](/zh-cn/manual/project_target?id=targetadd_defines)             | 添加宏定义                                   | >= 2.3.4 |
| [add_undefines](/zh-cn/manual/project_target?id=targetadd_undefines)         | 取消宏定义                                   | >= 2.3.4 |
| [add_cflags](/zh-cn/manual/project_target?id=targetadd_cflags)               | 添加c编译选项                                | >= 2.3.4 |
| [add_cxflags](/zh-cn/manual/project_target?id=targetadd_cxflags)             | 添加c/c++编译选项                            | >= 2.3.4 |
| [add_cxxflags](/zh-cn/manual/project_target?id=targetadd_cxxflags)           | 添加c++编译选项                              | >= 2.3.4 |
| [add_mflags](/zh-cn/manual/project_target?id=targetadd_mflags)               | 添加objc编译选项                             | >= 2.3.4 |
| [add_mxflags](/zh-cn/manual/project_target?id=targetadd_mxflags)             | 添加objc/objc++编译选项                      | >= 2.3.4 |
| [add_mxxflags](/zh-cn/manual/project_target?id=targetadd_mxxflags)           | 添加objc++编译选项                           | >= 2.3.4 |
| [add_scflags](/zh-cn/manual/project_target?id=targetadd_scflags)             | 添加swift编译选项                            | >= 2.3.4 |
| [add_asflags](/zh-cn/manual/project_target?id=targetadd_asflags)             | 添加汇编编译选项                             | >= 2.3.4 |
| [add_gcflags](/zh-cn/manual/project_target?id=targetadd_gcflags)             | 添加go编译选项                               | >= 2.3.4 |
| [add_dcflags](/zh-cn/manual/project_target?id=targetadd_dcflags)             | 添加dlang编译选项                            | >= 2.3.4 |
| [add_rcflags](/zh-cn/manual/project_target?id=targetadd_rcflags)             | 添加rust编译选项                             | >= 2.3.4 |
| [add_cuflags](/zh-cn/manual/project_target?id=targetadd_cuflags)             | 添加cuda编译选项                             | >= 2.3.4 |
| [add_culdflags](/zh-cn/manual/project_target?id=targetadd_culdflags)         | 添加cuda设备链接选项                         | >= 2.3.4 |
| [add_ldflags](/zh-cn/manual/project_target?id=targetadd_ldflags)             | 添加链接选项                                 | >= 2.3.4 |
| [add_arflags](/zh-cn/manual/project_target?id=targetadd_arflags)             | 添加静态库归档选项                           | >= 2.3.4 |
| [add_shflags](/zh-cn/manual/project_target?id=targetadd_shflags)             | 添加动态库链接选项                           | >= 2.3.4 |
| [add_languages](/zh-cn/manual/project_target?id=targetadd_languages)         | 添加语言标准                                 | >= 2.3.4 |
| [add_frameworks](/zh-cn/manual/project_target?id=targetadd_frameworks)       | 添加链接框架                                 | >= 2.3.4 |
| [add_frameworkdirs](/zh-cn/manual/project_target?id=targetadd_frameworkdirs) | 添加链接框架                                 | >= 2.3.4 |

### toolchain

#### 定义工具链

可以在用户项目xmake.lua中定义，也可以通过includes独立到单独的xmake.lua去专门定义各种工具链

```lua
toolchain("myclang")
    set_toolset("cc", "clang")
    set_toolset("cxx", "clang", "clang++")
toolchain_end()
```

### toolchain:set_kind

#### 设置工具链类型

目前仅支持设置为`standalone`类型，表示当前工具链是独立完整的工具链，包括cc/cxx/ld/sh/ar等编译器、归档器、链接器等一整套工具集的配置。

通常用于某个target被同时设置了多个工具链的情况，但同时只能生效一个独立工具链，通过此配置可以保证生效的工具链存在互斥关系，比如gcc/clang工具链不会同时生效。

而像yasm/nasm这种局部工具链，属于附加的局部工具链扩展，不用设置standalone，因为clang/yasm两个工具链有可能同时存在。

!> 只要记住，存在完整编译环境的工具链，都设置为standalone就行了

### toolchain:set_toolset

#### 设置工具集

用于设置每个单独工具名和路径，例如：

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

关于这个接口的详情，可以看下：[target.set_toolset](/zh-cn/manual/project_target?id=targetset_toolset)

### toolchain:set_sdkdir

#### 设置工具链sdk目录路径

通常我们可以通过`xmake f --toolchain=myclang --sdk=xxx`来配置sdk目录，但是每次配置比较繁琐，我们也可以通过此接口预先配置到xmake.lua中去，方便快速切换使用。

```lua
toolchain("myclang")
    set_kind("standalone")
    set_sdkdir("/tmp/sdkdir")
    set_toolset("cc", "clang")
```

### toolchain:set_bindir

#### 设置工具链bin目录路径

通常我们可以通过`xmake f --toolchain=myclang --bin=xxx`来配置sdk目录，但是每次配置比较繁琐，我们也可以通过此接口预先配置到xmake.lua中去，方便快速切换使用。

```lua
toolchain("myclang")
    set_kind("standalone")
    set_bindir("/tmp/sdkdir/bin")
    set_toolset("cc", "clang")
```

### toolchain:on_check

#### 检测工具链

用于检测指定工具链所在sdk或者程序在当前系统上是否存在，通常用于多个standalone工具链的情况，进行自动探测和选择有效工具链。

而对于`xmake f --toolchain=myclang`手动指定的场景，此检测配置不是必须的，可以省略。

```lua
toolchain("myclang")
    on_check(function (toolchain)
        return import("lib.detect.find_tool")("clang")
    end)
```

### toolchain:on_load

#### 加载工具链

对于一些复杂的场景，我们可以在on_load中动态灵活的设置各种工具链配置，比在描述域设置更加灵活，更加强大：

```lua
toolchain("myclang")
    set_kind("standalone")
    on_load(function (toolchain)
        
        -- set toolset
        toolchain:set("toolset", "cc", "clang")
        toolchain:set("toolset", "ld", "clang++")
        -- ..

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

### toolchain_end

#### 结束定义工具链

这个是可选的，如果想要手动结束toolchain的定义，可以调用它：

```lua
toolchain("myclang")
    -- ..
toolchain_end()
```
