条件判断的api，一般用于必须要处理特定平台的编译逻辑的场合。。通常跟 lua 的 if 语句配合使用。

## is_os

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

## is_arch

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

如果像上面那样一个个去判断所有arm架构，也许会很繁琐，毕竟每个平台的架构类型很多，xmake提供了比[add_files](#targetadd_files)更强的lua正则表达式匹配模式，来更加简洁的进行判断：

```lua
--如果当前平台是arm平台
if is_arch("arm.*") then
    -- ...
end
```

用`.*`就可以匹配所有了。

## is_plat

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

如果指定的平台名不存在，就会自动切到`cross`平台进行交叉编译，但是却可以通过`is_plat("other")`来判断自己的平台逻辑。

## is_host

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

你也可以通过[$(host)](/zh-cn/manual/builtin_variables?id=varhost)内置变量或者[os.host](/zh-cn/manual/builtin_modules?id=oshost)接口，来进行获取

## is_subhost

#### 判断当前主机的子系统环境

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

!> 后期也有可能会支持 linux 和 macos 系统下的其他子系统环境，如果存在话。

## is_subarch

#### 判断当前主机子系统环境下的架构

目前主要用于 windows 系统上 cygwin, msys2 等子系统环境下架构的探测，通常在 windows 编译平台采用 msvc 工具链，那边编译架构时 x64，x86。
而在 msys/cygwin 子系统环境下，编译架构默认为 x86_64/i386，是有差异的。

我们也可以通过执行 `xmake l os.subarch` 来快速查看当前的子系统架构。

## is_cross

#### 判断当前平台是否为交叉编译

如果当前的目标架构和平台，不是当前的主机平台，属于交叉编译，这个接口就会返回 true。

## is_mode

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

## is_kind

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

## is_config

#### 判断指定配置是否为给定的值

此接口从2.2.2版本开始引入，用于判断指定配置是否为给定的值，可用于描述域。

例如：

```console
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

<p class="tip">
此接口不仅能够判断通过[option](#option)定义的自定义配置选项，同时还能判断内置的全局配置、本地配置。
</p>

## has_config

#### 判断指定配置是否被启用

此接口从2.2.2版本开始引入，用于判断指定配置是否被启用，可用于描述域。

例如：

```console
$ xmake f --test=true
$ xmake f --test=y
$ xmake f --test
```

```lua
-- 如果启用test选项
if has_config("test") then
    add_defines("TEST")
end
```

如果`--test`选项没有设置，或者被设置为`false`、`n`，那么`has_config("test")`将会返回`false`。

## has_package

#### 判断依赖包是否被启用

此接口从2.2.3版本开始引入，用于判断指定的依赖包是否被启用，可用于描述域，通常用于可选依赖包的处理上。

例如，我们有一个`foo`目标，他有一个可选依赖包`zlib`和必须依赖包`libpng`。

```lua
add_requires("libpng")
add_requires("zlib", {optional = true})

target("foo")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libpng")
    if has_package("zlib") then
        add_packages("zlib")
    end
```

如果用户禁用了`zlib`包：`xmake f --zlib=false`，那么`has_package("zlib")`就会返回`false`，也就不会走`add_packages("zlib")`的逻辑了。

