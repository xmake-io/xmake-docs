
条件判断的api，一般用于必须要处理特定平台的编译逻辑的场合。。通常跟lua的if语句配合使用。

| 接口                        | 描述                          | 支持版本                |
| -------------------------   | ----------------------------- | ----------------------- |
| [is_os](#is_os)             | 判断当前构建目标的操作系统    | >= 2.0.1                |
| [is_arch](#is_arch)         | 判断当前编译架构              | >= 2.0.1                |
| [is_plat](#is_plat)         | 判断当前编译平台              | >= 2.0.1                |
| [is_host](#is_host)         | 判断当前主机环境操作系统      | >= 2.1.4                |
| [is_mode](#is_mode)         | 判断当前编译模式              | >= 2.0.1                |
| [is_kind](#is_kind)         | 判断当前编译类型              | >= 2.0.1                |
| [is_option](#is_option)     | 判断选项是否启用              | >= 2.0.1 < 2.2.2 已废弃 |
| [is_config](#is_config)     | 判断指定配置是否为给定的值    | >= 2.2.2                |
| [has_config](#has_config)   | 判断配置是否启用或者存在      | >= 2.2.2                |
| [has_package](#has_package) | 判断依赖包是否被启用或者存在  | >= 2.2.3                |

### is_os 

#### 判断当前构建目标的操作系统

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

### is_arch

#### 判断当前编译架构

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

如果像上面那样一个个去判断所有arm架构，也许会很繁琐，毕竟每个平台的架构类型很多，xmake提供了类似[add_files](#targetadd_files)中的通配符匹配模式，来更加简洁的进行判断：

```lua
--如果当前平台是arm平台
if is_arch("arm*") then
    -- ...
end
```

用`*`就可以匹配所有了。。

### is_plat

#### 判断当前编译平台

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

```bash
$ xmake f -p other --sdk=...
```

如果指定的平台名不存在，就会自动切到`cross`平台进行交叉编译，但是缺可以通过`is_plat("other")`来判断自己的平台逻辑。

### is_host

#### 判断当前主机环境的操作系统

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

你也可以通过[$(host)](#var-host)内置变量或者[os.host](#os-host)接口，来进行获取

### is_mode

#### 判断当前编译模式

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

### is_kind

#### 判断当前编译类型

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

```bash
# 编译静态库
$ xmake f -k static
$ xmake
```

```bash
# 编译动态库
$ xmake f -k shared
$ xmake
```

### is_option

#### 判断选项是否启用

<p class="tip">
此接口在2.2.2版本之后已经弃用，请使用[has_config](#has_config)来代替。
</p>

用于检测自定义的编译配置选型：`xmake f --xxxx=y`

如果某个自动检测选项、手动设置选项被启用，那么可以通过`is_option`接口来判断，例如：

```lua
-- 如果手动启用了xmake f --demo=y 选项
if is_option("demo") then

    -- 编译demo目录下的代码
    add_subdirs("src/demo")
end
```

### is_config

#### 判断指定配置是否为给定的值

此接口从2.2.2版本开始引入，用于判断指定配置是否为给定的值，可用于描述域。

例如：

```console
$ xmake f --test=hello1
```

```lua
-- 自定义一个配置选项到命令行菜单
option("test")
    set_showmenu("true")
    set_description("The test config option")
option_end()

-- 如果自定义的test配置值是hello1或者hello2
if is_config("test", "hello1", "hello2") then
    add_defines("HELLO")
end
```

不仅如此，我们还可以设置模式匹配规则去判断值，例如：

```lua
-- 如果自定义的test配置值带有hello前缀
if is_config("test", "hello.*") then
    add_defines("HELLO")
end
```

<p class="tip">
此接口不仅能够判断通过[option](#option)定义的自定义配置选项，同时还能判断内置的全局配置、本地配置。
</p>

### has_config

#### 判断配置是否启用或者存在

此接口从2.2.2版本开始引入，用于检测自定义或者内置的编译配置是否存在或启用，可用于描述域。

例如以下配置情况，都会返回true:

```console
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

```console
# 禁用配置（如果是boolean类型配置）
$ xmake f --test1=n
$ xmake f --test1=no
$ xmake f --test1=false
```

<p class="tip">
此接口不仅能够判断内置的全局配置、本地配置，同时还可以判断通过[option](#option)定义的自定义配置选项。
</p>


### has_package

#### 判断依赖包是否启用或者存在

此接口从2.2.3版本开始引入，用于检测远程依赖包是否存在或启用，可用于描述域。

一般配合[add_requires](#add_requires)一起使用，例如：

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

<p class="tip">
此接口跟[has_config](#has_config)的区别在于，[has_config](#has_config)用于[option](#option)，而它用于[add_requires](#add_requires)。
</p>

