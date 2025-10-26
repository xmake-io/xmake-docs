
# core.project.config

用于获取工程编译时候的配置信息，也就是`xmake f|config --xxx=val` 传入的参数选项值。

## config.get

- 获取指定配置值

#### 函数原型

::: tip API
```lua
config.get(name: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。配置项名称 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| any | 返回配置值，如果不存在则返回 nil |

#### 用法说明

用于获取`xmake f|config --xxx=val`的配置值，例如：

```lua
target("test")
    on_run(function (target)

        -- 导入配置模块
        import("core.project.config")

        -- 获取配置值
        print(config.get("xxx"))
    end)
```

## config.load

- 加载配置

#### 函数原型

::: tip API
```lua
config.load()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

此函数无返回值。

#### 用法说明

一般用于插件开发中，插件任务中不像工程的自定义脚本，环境需要自己初始化加载，默认工程配置是没有被加载的，如果要用[config.get](#config-get)接口获取工程配置，那么需要先：

```lua

-- 导入配置模块
import("core.project.config")

function main(...)

    -- 先加载工程配置
    config.load()

    -- 获取配置值
    print(config.get("xxx"))
end
```

## config.arch

- 获取当前工程的架构配置

#### 函数原型

::: tip API
```lua
config.arch()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回架构名称，例如 "x86_64", "armv7" |

#### 用法说明

也就是获取`xmake f|config --arch=armv7`的平台配置，相当于`config.get("arch")`。

## config.plat

- 获取当前工程的平台配置

#### 函数原型

::: tip API
```lua
config.plat()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回平台名称，例如 "macosx", "linux" |

#### 用法说明

也就是获取`xmake f|config --plat=iphoneos`的平台配置，相当于`config.get("plat")`。

## config.mode

- 获取当前工程的编译模式配置

#### 函数原型

::: tip API
```lua
config.mode()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回编译模式，例如 "debug", "release" |

#### 用法说明

也就是获取`xmake f|config --mode=debug`的平台配置，相当于`config.get("mode")`。

## config.builddir

- 获取当前工程的输出目录配置

#### 函数原型

::: tip API
```lua
config.builddir()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回构建输出目录路径 |

#### 用法说明

也就是获取`xmake f|config -o /tmp/output`的平台配置，相当于`config.get("builddir")`。

## config.directory

- 获取当前工程的配置信息目录

#### 函数原型

::: tip API
```lua
config.directory()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回配置信息目录路径 |

#### 用法说明

获取工程配置的存储目录，默认为：`projectdir/.config`

## config.dump

- 打印输出当前工程的所有配置信息

#### 函数原型

::: tip API
```lua
config.dump()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回包含所有配置信息的表 |

#### 用法说明

打印输出当前工程的所有配置信息，输出结果例如：

```lua
{
    sh = "xcrun -sdk macosx clang++",
    xcode_dir = "/Applications/Xcode.app",
    ar = "xcrun -sdk macosx ar",
    small = true,
    object = false,
    arch = "x86_64",
    xcode_sdkver = "10.12",
    ex = "xcrun -sdk macosx ar",
    cc = "xcrun -sdk macosx clang",
    rc = "rustc",
    plat = "macosx",
    micro = false,
    host = "macosx",
    as = "xcrun -sdk macosx clang",
    dc = "dmd",
    gc = "go",
    openssl = false,
    ccache = "ccache",
    cxx = "xcrun -sdk macosx clang",
    sc = "xcrun -sdk macosx swiftc",
    mm = "xcrun -sdk macosx clang",
    builddir = "build",
    mxx = "xcrun -sdk macosx clang++",
    ld = "xcrun -sdk macosx clang++",
    mode = "release",
    kind = "static"
}
```
