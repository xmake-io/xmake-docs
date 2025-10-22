# 条件判断

条件判断的 API，一般用于必须要处理特定平台的编译逻辑的场合，他们通常跟 lua 的 if 语句配合使用。

## is_os

### 判断当前构建目标的操作系统

#### 函数原型

```lua
is_os(os: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| os | 操作系统名称字符串或数组 |
| ... | 可变参数，可传递多个操作系统名称 |

```lua
-- 如果当前操作系统是ios
if is_os("ios") then
    add_files("src/xxx/*.m")
end
```

目前支持的操作系统有：

* windows
* linux
* android
* macosx
* ios

## is_arch

### 判断当前编译架构

#### 函数原型

```lua
is_arch(arch: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| arch | 架构名称字符串或数组 |
| ... | 可变参数，可传递多个架构名称 |

用于检测编译配置：`xmake f -a armv7`

```lua
-- 如果当前架构是x86_64或者i386
if is_arch("x86_64", "i386") then
    add_files("src/xxx/*.c")
end

-- 如果当前平台是armv7, arm64, armv7s, armv7-a
if is_arch("armv7", "arm64", "armv7s", "armv7-a") then
    -- ...
end
```

如果像上面那样一个个去判断所有arm架构，也许会很繁琐，毕竟每个平台的架构类型很多，xmake提供了比[add_files](#targetadd_files)更强的lua正则表达式匹配模式，来更加简洁的进行判断：

```lua
--如果当前平台是arm平台
if is_arch("arm.*") then
    -- ...
end
```

用`.*`就可以匹配所有了。

## is_plat

### 判断当前编译平台

#### 函数原型

```lua
is_plat(plat: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| plat | 平台名称字符串或数组 |
| ... | 可变参数，可传递多个平台名称 |

用于检测编译配置：`xmake f -p iphoneos`

```lua
-- 如果当前平台是android
if is_plat("android") then
    add_files("src/xxx/*.c")
end

-- 如果当前平台是macosx或者iphoneos
if is_plat("macosx", "iphoneos") then
    add_frameworks("Foundation")
end
```

目前支持的平台有：

* windows
* cross
* linux
* macosx
* android
* iphoneos
* watchos

当然你也可以自己扩展添加自己的平台，甚至直接指定自己的平台名：

```sh
$ xmake f -p other --sdk=...
```

如果指定的平台名不存在，就会自动切到`cross`平台进行交叉编译，但是却可以通过`is_plat("other")`来判断自己的平台逻辑。

## is_host

### 判断当前主机环境的操作系统

#### 函数原型

```lua
is_host(host: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| host | 主机系统名称字符串或数组 |
| ... | 可变参数，可传递多个主机名称 |

有些编译平台是可以在多个不同的操作系统进行构建的，例如：android的ndk就支持linux,macOS还有windows环境。

这个时候就可以通过这个接口，区分当前是在哪个系统环境下进行的构建。

```lua
-- 如果当前主机环境是windows
if is_host("windows") then
    add_includedirs("C:\\includes")
else
    add_includedirs("/usr/includess")
end
```

目前支持的主机环境有：

* windows
* linux
* macosx

你也可以通过[$(host)](/zh/api/description/builtin-variables#var-host)内置变量或者[os.host](/zh/api/scripts/builtin-modules/os#os-host)接口，来进行获取

## is_subhost

### 判断当前主机的子系统环境

#### 函数原型

```lua
is_subhost(subhost: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| subhost | 子系统名称字符串或数组 |
| ... | 可变参数，可传递多个子系统名称 |

目前主要用于 windows 系统上 cygwin, msys2 等子系统环境的探测，如果在 msys2 shell 环境下运行 xmake，那么 `is_subhost("windows")` 想将会返回 false，而 `is_host("windows")` 依旧会返回 true。

目前支持的子系统：

* msys
* cygwin

配置例子：

```lua
if is_subhost("msys", "cygwin") then
    -- 当前在 msys2/cygwin 的 shell 环境下
end
```

我们也可以通过执行 `xmake l os.subhost` 来快速查看当前的子系统平台。

::: tip 提示
后期也有可能会支持 linux 和 macos 系统下的其他子系统环境，如果存在话。
:::

## is_subarch

### 判断当前主机子系统环境下的架构

#### 函数原型

```lua
is_subarch(subarch: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| subarch | 子系统架构名称字符串或数组 |
| ... | 可变参数，可传递多个子系统架构名称 |

目前主要用于 windows 系统上 cygwin, msys2 等子系统环境下架构的探测，通常在 windows 编译平台采用 msvc 工具链，那边编译架构时 x64，x86。
而在 msys/cygwin 子系统环境下，编译架构默认为 x86_64/i386，是有差异的。

我们也可以通过执行 `xmake l os.subarch` 来快速查看当前的子系统架构。

## is_cross

### 判断当前平台是否为交叉编译

#### 函数原型

```lua
is_cross()
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| - | 无参数 |

如果当前的目标架构和平台，不是当前的主机平台，属于交叉编译，这个接口就会返回 true。

## is_mode

### 判断当前编译模式

#### 函数原型

```lua
is_mode(mode: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| mode | 编译模式名称字符串或数组 |
| ... | 可变参数，可传递多个模式名称 |

用于检测编译配置：`xmake f -m debug`

编译模式的类型并不是内置的，可以自由指定，一般指定：`debug`, `release`, `profile` 这些就够用了，当然你也可以在xmake.lua使用其他模式名来判断。

```lua
-- 如果当前编译模式是debug
if is_mode("debug") then

    -- 添加DEBUG编译宏
    add_defines("DEBUG")

    -- 启用调试符号
    set_symbols("debug")

    -- 禁用优化
    set_optimize("none")

end

-- 如果是release或者profile模式
if is_mode("release", "profile") then

    -- 如果是release模式
    if is_mode("release") then

        -- 隐藏符号
        set_symbols("hidden")

        -- strip所有符号
        set_strip("all")

        -- 忽略帧指针
        add_cxflags("-fomit-frame-pointer")
        add_mxflags("-fomit-frame-pointer")

    -- 如果是profile模式
    else

        -- 启用调试符号
        set_symbols("debug")

    end

    -- 添加扩展指令集
    add_vectorexts("sse2", "sse3", "ssse3", "mmx")
end
```

## is_kind

### 判断当前编译类型

#### 函数原型

```lua
is_kind(kind: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| kind | 目标类型名称字符串或数组 |
| ... | 可变参数，可传递多个类型名称 |

判断当前是否编译的是动态库还是静态库，用于检测编译配置：`xmake f -k [static|shared]`

一般用于如下场景：

```lua
target("test")

    -- 通过配置设置目标的kind
    set_kind("$(kind)")
    add_files("src/*c")

    -- 如果当前编译的是静态库，那么添加指定文件
    if is_kind("static") then
        add_files("src/xxx.c")
    end
```

编译配置的时候，可手动切换，编译类型：

```sh
# 编译静态库
$ xmake f -k static
$ xmake
```

```sh
# 编译动态库
$ xmake f -k shared
$ xmake
```

## is_config

### 判断指定配置是否为给定的值

#### 函数原型

```lua
is_config(name: <string>, values: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 配置选项名称字符串 |
| values | 配置值字符串或数组 |
| ... | 可变参数，可传递多个值 |

此接口从2.2.2版本开始引入，用于判断指定配置是否为给定的值，可用于描述域。

例如：

```sh
$ xmake f --test=hello1
```

```lua
-- 自定义一个配置选项到命令行菜单
option("test")
    set_showmenu(true)
    set_description("The test config option")
option_end()

-- 如果自定义的test配置值是hello1或者hello2
if is_config("test", "hello1", "hello2") then
    add_defines("HELLO")
end
```

可以用来根据配置值增加对应的依赖包，例如：

```lua
-- 根据lua_flavor的配置值，选择依赖lua还是luajit
option("lua_flavor")
    set_showmenu(true)
    set_values("luajit", "lua")
option_end()
if is_config("lua_flavor", "luajit") then
    add_requires("luajit")
elseif is_config("lua_flavor", "lua") then
    add_requires("lua")
end
```

不仅如此，我们还可以设置模式匹配规则去判断值，例如：

```lua
-- 如果自定义的test配置值带有hello前缀
if is_config("test", "hello.*") then
    add_defines("HELLO")
end
```

::: tip 提示
此接口不仅能够判断通过[option](/zh/api/description/configuration-option#option)定义的自定义配置选项，同时还能判断内置的全局配置、本地配置。
:::

## has_config

### 判断配置是否启用或者存在

#### 函数原型

```lua
has_config(configs: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| configs | 配置名称字符串或数组 |
| ... | 可变参数，可传递多个配置名称 |

此接口从2.2.2版本开始引入，用于检测自定义或者内置的编译配置是否存在或启用，可用于描述域。

例如以下配置情况，都会返回true:

```sh
# 启用某个配置选项（如果是boolean类型配置）
$ xmake f --test1=y
$ xmake f --test1=yes
$ xmake f --test1=true

# 设置某个配置选项的值
$ xmake f --test2=value
```

```lua
-- 如果test1或者test2被设置或者启用
if has_config("test1", "test2") then
    add_defines("TEST")
end
```

而下面的情况则会禁用配置，返回false：

```sh
# 禁用配置（如果是boolean类型配置）
$ xmake f --test1=n
$ xmake f --test1=no
$ xmake f --test1=false
```

::: tip 提示
此接口不仅能够判断内置的全局配置、本地配置，同时还可以判断通过[option](/zh/api/description/configuration-option#option)定义的自定义配置选项。

此接口与[get_config](/zh/api/description/global-interfaces#get-config)接口配合使用，可以完整地获取和判断用户通过`xmake f --option1=xxx`设置的选项状态。
:::

## has_package

### 判断依赖包是否启用或者存在

#### 函数原型

```lua
has_package(packages: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| packages | 包名称字符串或数组 |
| ... | 可变参数，可传递多个包名称 |

此接口从2.2.3版本开始引入，用于检测远程依赖包是否存在或启用，可用于描述域。

一般配合[add_requires](/zh/api/description/global-interfaces#add-requires)一起使用，例如：

```lua
add_requires("tbox", {optional = true})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox")

    if has_package("tbox") then
        add_defines("HAVE_TBOX")
    end
```

如果通过`add_requires`添加的可选依赖包，远程下载安装失败，或者当前平台不支持导致实际上没有被正常安装上，那么`has_package`就会返回false，
表示不存在，然后对其他flags定义甚至源文件编译控制做一些特殊处理。

::: tip 注意
此接口跟[has_config](#has_config)的区别在于，[has_config](#has_config)用于[option](/zh/api/description/configuration-option#option)，而它用于[add_requires](/zh/api/description/global-interfaces#add-requires)。
:::
