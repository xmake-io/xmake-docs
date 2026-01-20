# 包依赖 {#package-dependencies}

## package

- 仓库依赖包定义描述

#### 函数原型

::: tip API
```lua
package(name: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 包名称字符串 |

#### 用法说明

可先参考官方仓库中现有包描述：[xmake-repo](https://github.com/xmake-io/xmake-repo)

这里给个比较具有代表性的实例供参考：

```lua
package("libxml2")

    set_homepage("http://xmlsoft.org/")
    set_description("The XML C parser and toolkit of Gnome.")

    set_urls("https://github.com/GNOME/libxml2/archive/$(version).zip", {excludes = {"*/result/*", "*/test/*"}})

    add_versions("v2.9.8", "c87793e45e66a7aa19200f861873f75195065de786a21c1b469bdb7bfc1230fb")
    add_versions("v2.9.7", "31dd4c0e10fa625b47e27fd6a5295d246c883f214da947b9a4a9e13733905ed9")

    if is_plat("macosx", "linux") then
        add_deps("autoconf", "automake", "libtool", "pkg-config")
    end

    on_load(function (package)
        package:add("includedirs", "include/libxml2")
        package:add("links", "xml2")
    end)

    if is_plat("windows") and winos.version():gt("winxp") then
        on_install("windows", function (package)
            os.cd("win32")
            os.vrun("cscript configure.js iso8859x=yes iconv=no compiler=msvc cruntime=/MT debug=%s prefix=\"%s\"", package:debug() and "yes" or "no", package:installdir())
            os.vrun("nmake /f Makefile.msvc")
            os.vrun("nmake /f Makefile.msvc install")
        end)
    end

    on_install("macosx", "linux", function (package)
        import("package.tools.autoconf").install(package, {"--disable-dependency-tracking", "--without-python", "--without-lzma"})
    end)
```

## set_homepage

- 设置包所在项目的官方页面地址

#### 函数原型

::: tip API
```lua
set_homepage(url: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| url | 包主页URL字符串 |

#### 用法说明

设置包所在项目的官方页面地址。

## set_description

- 设置包的相关描述信息

#### 函数原型

::: tip API
```lua
set_description(description: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| description | 包描述字符串 |

#### 用法说明

一般通过`xmake require --info zlib`查看相关包信息时候，会看到。

## set_kind

- 设置包类型

#### 函数原型

::: tip API
```lua
set_kind(kind: <string>, {
    headeronly = <boolean>
})
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| kind | 包类型："library", "binary", "toolchain" |
| headeronly | 对于library类型，是否为仅头文件库 |

用于设置包的类型，xmake 包目前支持以下几种类型：

### library

这是默认的包类型，通常不需要显式配置。用于普通的库包，包括静态库和动态库。

```lua
package("zlib")
    -- library 类型，不需要显式设置
    set_homepage("http://www.zlib.net")
    set_description("A Massively Spiffy Yet Delicately Unobtrusive Compression Library")
```

对于 header-only 库（仅包含头文件的库），需要显式配置：

```lua
package("fmt")
    set_kind("library", {headeronly = true})
    set_homepage("https://fmt.dev")
    set_description("A modern formatting library")
```

### binary

用于可执行程序包，这类包安装后会提供可执行文件，一般运行于当前编译主机的系统。

```lua
package("cmake")
    set_kind("binary")
    set_homepage("https://cmake.org")
    set_description("A cross-platform family of tool designed to build, test and package software")
```

### toolchain

用于完整的编译工具链包，这类包包含完整的编译工具链（如编译器、链接器等），可以与 `set_toolchains` + `add_requires` 配合使用，实现工具链的自动下载和绑定。

```lua
package("llvm")
    set_kind("toolchain")
    set_homepage("https://llvm.org/")
    set_description("The LLVM Compiler Infrastructure")
```

使用工具链包的示例：

```lua
add_rules("mode.debug", "mode.release")
add_requires("llvm 14.0.0", {alias = "llvm-14"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("llvm@llvm-14")
```

## set_urls

- 设置包源地址

#### 函数原型

::: tip API
```lua
set_urls(urls: <string|array>, ..., {
    excludes = <array>,
    version = <function>,
    http_headers = <array>
})
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| urls | 包源URL字符串或数组 |
| ... | 可变参数，可传入多个URL |
| excludes | 解压时要排除的文件 |
| version | 版本转换函数 |
| http_headers | 下载时的HTTP头 |

设置包的源码包或者git仓库地址，跟add_urls不同的是，此接口是覆盖性设置，而add_urls是追加设置，其他使用方式类似，这个根据不同需要来选择。

## add_urls

- 添加包源地址

#### 函数原型

::: tip API
```lua
add_urls(urls: <string|array>, ..., {
    alias = <string>,
    excludes = <array>,
    version = <function>,
    http_headers = <array>
})
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| urls | 包源URL字符串或数组 |
| ... | 可变参数，可传入多个URL |
| alias | 不同源的URL别名 |
| excludes | 解压时要排除的文件 |
| version | 版本转换函数 |
| http_headers | 下载时的HTTP头 |

#### 用法说明

添加包的源码包或者git仓库地址，此接口一般跟add_version配对使用，用于设置每个源码包的版本和对应的sha256值或者git的commit或者tag或者branch。

::: tip 注意
可以通过添加多个urls作为镜像源，xmake会自动检测优先选用最快的url进行下载，如果下载失败则会尝试其他urls。
:::

```lua
add_urls("https://github.com/protobuf-c/protobuf-c/releases/download/v$(version)/protobuf-c-$(version).tar.gz")
add_versions("1.3.1", "51472d3a191d6d7b425e32b612e477c06f73fe23e07f6a6a839b11808e9d2267")
```

urls里面的`$(version)`内置变量，会根据实际安装时候选择的版本适配进去，而版本号都是从`add_versions`中指定的版本列表中选择的。

如果对于urls里面带有比较复杂的版本串，没有跟add_versions有直接对应关系，则需要通过下面的方式定制化转换下：

```lua
add_urls("https://sqlite.org/2018/sqlite-autoconf-$(version)000.tar.gz",
         {version = function (version) return version:gsub("%.", "") end})

add_versions("3.24.0", "d9d14e88c6fb6d68de9ca0d1f9797477d82fc3aed613558f87ffbdbbc5ceb74a")
add_versions("3.23.0", "b7711a1800a071674c2bf76898ae8584fc6c9643cfe933cfc1bc54361e3a6e49")
```

当然，我们也只可以添加git源码地址：

```lua
add_urls("https://gitlab.gnome.org/GNOME/libxml2.git")
```

如果设置的多个镜像地址对应的源码包sha256是不同的，我们可以通过alias的方式来分别设置

```lua
add_urls("https://ffmpeg.org/releases/ffmpeg-$(version).tar.bz2", {alias = "home"})
add_urls("https://github.com/FFmpeg/FFmpeg/archive/n$(version).zip", {alias = "github"})
add_versions("home:4.0.2", "346c51735f42c37e0712e0b3d2f6476c86ac15863e4445d9e823fe396420d056")
add_versions("github:4.0.2", "4df1ef0bf73b7148caea1270539ef7bd06607e0ea8aa2fbf1bb34062a097f026")
```

我们也可以设置指定的 urls 的 http headers：

```lua
add_urls("https://github.com/madler/zlib/archive/$(version).tar.gz", {
    http_headers = {"TEST1: foo", "TEST2: bar"}
})
```

## add_versions

- 设置每个源码包的版本

#### 函数原型

::: tip API
```lua
add_versions(version: <string>, hash: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| version | 包版本字符串 |
| hash | 用于验证的SHA256哈希值 |

#### 用法说明

它也会设置对应的sha256值，具体描述见：[add_urls](#add_urls)

## add_versionfiles

- 添加包版本列表

#### 函数原型

::: tip API
```lua
add_versionfiles(file: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| file | 包含版本和哈希值对的文件路径 |

#### 用法说明

通常我们可以通过 `add_versions` 接口添加包版本，但是如果版本越来越多，就会导致包配置太过臃肿，这个时候，我们可以使用 `add_versionfiles` 接口将所有的版本列表，存储到单独的文件中去维护。

例如：

```lua
package("libcurl")
    add_versionfiles("versions.txt")
```

```sh
8.5.0 ce4b6a6655431147624aaf582632a36fe1ade262d5fab385c60f78942dd8d87b
8.4.0 e5250581a9c032b1b6ed3cf2f9c114c811fc41881069e9892d115cc73f9e88c6
8.0.1 9b6b1e96b748d04b968786b6bdf407aa5c75ab53a3d37c1c8c81cdb736555ccf
7.87.0 5d6e128761b7110946d1276aff6f0f266f2b726f5e619f7e0a057a474155f307
7.31.0 a73b118eececff5de25111f35d1d0aafe1e71afdbb83082a8e44d847267e3e08
...
```

## add_patches

- 设置包补丁

#### 函数原型

::: tip API
```lua
add_patches(version: <string>, url: <string>, hash: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| version | 补丁适用的包版本 |
| url | 补丁文件URL |
| hash | 补丁验证的SHA256哈希值 |

#### 用法说明

此接口用于针对源码包，在编译安装前，先打对应设置的补丁包，再对其进行编译，并且可支持同时打多个补丁。

```lua
if is_plat("macosx") then
    add_patches("1.15", "https://raw.githubusercontent.com/Homebrew/patches/9be2793af/libiconv/patch-utf8mac.diff",
                        "e8128732f22f63b5c656659786d2cf76f1450008f36bcf541285268c66cabeab")
end
```

例如，上面的代码，就是针对macosx下编译的时候，打上对应的patch-utf8mac.diff补丁，并且每个补丁后面也是要设置sha256值的，确保完整性。

## add_links

- 设置库链接

#### 函数原型

::: tip API
```lua
add_links(links: <string|array>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| links | 库链接名称字符串或数组 |
| ... | 可变参数，可传入多个链接名称 |

#### 用法说明

默认情况下，xmake会去自动检测安装后的库，设置链接关系，但是有时候并不是很准，如果要自己手动调整链接顺序，以及链接名，则可以通过这个接口来设置。

```lua
add_links("mbedtls", "mbedx509", "mbedcrypto")
```

## add_syslinks

- 设置系统库链接

#### 函数原型

::: tip API
```lua
add_syslinks(syslinks: <string|array>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| syslinks | 系统库名称字符串或数组 |
| ... | 可变参数，可传入多个系统库名称 |

#### 用法说明

添加一些系统库链接，有些包集成链接的时候，还需要依赖一些系统库，才能链接通过，这个时候可以在包描述里面都附加上去。

```lua
if is_plat("macosx") then
    add_frameworks("CoreGraphics", "CoreFoundation", "Foundation")
elseif is_plat("windows") then
    add_defines("CAIRO_WIN32_STATIC_BUILD=1")
    add_syslinks("gdi32", "msimg32", "user32")
else
    add_syslinks("pthread")
end
```

## add_linkorders

- 调整包内部的链接顺序

#### 函数原型

::: tip API
```lua
add_linkorders(orders: <string|array>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| orders | 链接顺序字符串或数组 |
| ... | 可变参数，可传入多个顺序规格 |

#### 用法说明

具体详情可以看下 target 内部对 `add_linkorders` 的文档说明，[target:add_linkorders](/zh/api/description/project-target#add_linkorders)。

```lua
package("libpng")
    add_linkorders("png16", "png", "linkgroup::foo")
    add_linkgroups("dl", {name = "foo", group = true})
```

## add_linkgroups

- 配置包的链接组

#### 函数原型

::: tip API
```lua
add_linkgroups(groups: <string|array>, ..., {
    name = <string>,
    group = <boolean>
})
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| groups | 链接组名称字符串或数组 |
| ... | 可变参数，可传入多个组名称 |
| name | 用于链接的组名称 |
| group | 是否作为组处理 |

#### 用法说明

具体详情可以看下 target 内部对 `add_linkgroups` 的文档说明，[target:add_linkgroups](/zh/api/description/project-target#add-linkgroups)。

```lua
package("libpng")
    add_linkorders("png16", "png", "linkgroup::foo")
    add_linkgroups("dl", {name = "foo", group = true})
```

## add_frameworks

- 添加依赖的系统 frameworks 链接

#### 函数原型

::: tip API
```lua
add_frameworks(frameworks: <string|array>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| frameworks | 框架名称字符串或数组 |
| ... | 可变参数，可传入多个框架名称 |

#### 用法说明

示例见：[add_syslinks](#add_syslinks)

## add_linkdirs

- 添加链接目录

#### 函数原型

::: tip API
```lua
add_linkdirs(dirs: <string|array>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| dirs | 链接目录路径字符串或数组 |
| ... | 可变参数，可传入多个目录路径 |

#### 用法说明

包的链接库搜索目录也是可以调整的，不过通常都不需要，除非一些库安装完不在prefix/lib下面，而在lib的子目录下，默认搜索不到的话。

## add_includedirs

- 添加其他头文件搜索目录

#### 函数原型

::: tip API
```lua
add_includedirs(dirs: <string|array>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| dirs | 头文件目录路径字符串或数组 |
| ... | 可变参数，可传入多个目录路径 |

#### 用法说明

添加其他头文件搜索目录，用于指定包的头文件位置。

## add_bindirs

- 添加可执行文件目录

#### 函数原型

::: tip API
```lua
add_bindirs(dirs: <string|array>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| dirs | 可执行文件目录路径字符串或数组 |
| ... | 可变参数，可传入多个目录路径 |

#### 用法说明

默认情况下，如果配置了 `set_kind("binary")` 或者 `set_kind("toolchain")` 作为可执行的包。

那么，它默认会将 bin 目录作为可执行目录，并且自动将它加入到 PATH 环境变量中去。

而如果对应 library 包，想要将里面附带编译的一些可执行工具开放给用户执行，那么需要在包中配置 `package:addenv("PATH", "bin")` 中才行。

而通过这个接口去配置 `add_bindirs("bin")` ，那么将会自动将 bin 添加到 PATH，不再需要单独配置 PATH，另外，这也提供了一种可以修改可执行目录的方式。

## add_defines

- 添加宏定义

#### 函数原型

::: tip API
```lua
add_defines(defines: <string|array>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| defines | 宏定义字符串或数组 |
| ... | 可变参数，可传入多个定义 |

#### 用法说明

可以对集成的包对外输出一些特定的定义选项。

## add_configs

- 添加包配置

#### 函数原型

::: tip API
```lua
add_configs(name: <string>, {
    description = <string>,
    default = <string|boolean|number>,
    values = <array>,
    type = <string>,
    readonly = <boolean>
})
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 配置参数名称 |
| description | 配置描述字符串 |
| default | 配置的默认值 |
| values | 允许的值数组 |
| type | 配置类型："string", "boolean", "number" |
| readonly | 阻止对配置值的修改 |

#### 用法说明

我们可以通过此接口添加每个包的对外输出配置参数：

```lua
package("pcre2")

    set_homepage("https://www.pcre.org/")
    set_description("A Perl Compatible Regular Expressions Library")

    add_configs("bitwidth", {description = "Set the code unit width.", default = "8", values = {"8", "16", "32"}})

    on_load(function (package)
        local bitwidth = package:config("bitwidth") or "8"
        package:add("links", "pcre2-" .. bitwidth)
        package:add("defines", "PCRE2_CODE_UNIT_WIDTH=" .. bitwidth)
    end)
```

在工程项目里面，我们也可以查看特定包的可配置参数和值列表：

```sh
$ xmake require --info pcre2
The package info of project:
    require(pcre2):
      -> description: A Perl Compatible Regular Expressions Library
      -> version: 10.31
      ...
      -> configs:
         -> bitwidth:
            -> description: Set the code unit width.
            -> values: {"8","16","32"}
            -> default: 8
```

然后在项目里面，启用这些配置，编译集成带有特定配置的包：

```lua
add_requires("pcre2", {configs = {bitwidth = 16}})
```

可以覆盖标准配置，例如强制使用某个值：

```lua
package("my-package")
    add_configs("shared", {description = "Build shared library.", default = false, type = "boolean", readonly = true})
```

`my-package` 只能构建为 `shared`，如果将 `shared` 的值设置为 `false`，则会发出警告。

```
warning: configs.shared is readonly in package(my-package), it's always true
```

## add_extsources

- 添加扩展的包源

#### 函数原型

::: tip API
```lua
add_extsources(sources: <string|array>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| sources | 外部源字符串或数组，格式："pkgconfig::name" 或 "brew::name" |

#### 用法说明

添加扩展的包源，用于指定包的外部源。

2.5.2 版本开始，我们也新增了 `add_extsources` 和 `on_fetch` 两个配置接口，可以更好的配置 xmake 在安装 C/C++ 包的过程中，对系统库的查找过程。

至于具体背景，我们可以举个例子，比如我们在 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库新增了一个 `package("libusb")` 的包。

那么用户就可以通过下面的方式，直接集成使用它：

```lua
add_requires("libusb")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libusb")
```

如果用户系统上确实没有安装 libusb，那么 xmake 会自动下载 libusb 库源码，自动编译安装集成，没啥问题。

但如果用户通过 `apt install libusb-1.0` 安装了 libusb 库到系统，那么按理 xmake 应该会自动优先查找用户安装到系统环境的 libusb 包，直接使用，避免额外的下载编译安装。

但是问题来了，xmake 内部通过 `find_package("libusb")` 并没有找到它，这是为什么呢？因为通过 apt 安装的 libusb 包名是 `libusb-1.0`, 而不是 libusb。

我们只能通过 `pkg-config --cflags libusb-1.0` 才能找到它，但是 xmake 内部的默认 find_package 逻辑并不知道 `libusb-1.0` 的存在，所以找不到。

因此为了更好地适配不同系统环境下，系统库的查找，我们可以通过 `add_extsources("pkgconfig::libusb-1.0")` 去让 xmake 改进查找逻辑，例如：

```lua
package("libusb")
    add_extsources("pkgconfig::libusb-1.0")
    on_install(function (package)
        -- ...
    end)
```

另外，我们也可以通过这个方式，改进查找 homebrew/pacman 等其他包管理器安装的包，例如：`add_extsources("pacman::libusb-1.0")`。

## add_deps

- 添加包依赖

#### 函数原型

::: tip API
```lua
add_deps(deps: <string|array>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| deps | 依赖包名称字符串或数组 |
| ... | 可变参数，可传入多个依赖名称 |

#### 用法说明

添加包依赖，用于指定包之间的依赖关系。

添加包依赖接口，通过配置包之间的依赖关系，我们能够在安装包的同时，自动安装它的所有依赖包。

另外，默认情况下，我们只要配置了依赖关系，cmake/autoconf 就能够自动找到所有依赖包的库和头文件。

当然，如果由于一些特殊原因，导致当前包的 cmake 脚本没能够正常找到依赖包，那么我们也可以通过 `{packagedeps = "xxx"}` 来强行打入依赖包信息。

例如：

```lua
package("foo")
    add_deps("cmake", "bar")
    on_install(function (package)
        local configs = {}
        import("package.tools.cmake").install(package, configs)
    end)
```

foo 包是使用 CMakeLists.txt 维护的，它在安装过程中，依赖 bar 包，因此，xmake 会优先安装 bar，并且让 cmake.install 在调用 cmake 时候，自动找到 bar 安装后的库。

但是，如果 foo 的 CMakeLists.txt 还是无法自动找到 bar，那么我们可以修改成下面的配置，强制将 bar 的 includedirs/links 等信息通过 flags 的方式，传入 foo。

```lua
package("foo")
    add_deps("cmake", "bar")
    on_install(function (package)
        local configs = {}
        import("package.tools.cmake").install(package, configs, {packagedeps = "bar"})
    end)
```

## add_components

- 添加包组件

#### 函数原型

::: tip API
```lua
add_components(components: <string|array>, ..., {
    deps = <array>
})
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| components | 组件名称字符串或数组 |
| ... | 可变参数，可传入多个组件名称 |
| deps | 组件依赖数组 |

#### 用法说明

添加包组件，用于指定包的组件结构。

这是 2.7.3 新加的接口，用于支持包的组件化配置，详情见：[#2636](https://github.com/xmake-io/xmake/issues/2636)。

通过这个接口，我们可以配置当前包实际可以提供的组件列表。

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")
```

在用户端，我们可以通过下面的方式来使用包的特定组件。

```lua
add_requires("sfml")

target("test")
    add_packages("sfml", {components = "graphics")
```

::: tip 注意
除了配置可用的组件列表，我们还需要对每个组件进行详细配置，才能正常使用，因此，它通常和 `on_component` 接口配合使用。
:::

一个关于包组件的配置和使用的完整例子见：[components example](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/components/xmake.lua)

## set_base

- 继承包配置

#### 函数原型

::: tip API
```lua
set_base(package: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| package | 要继承的基础包名称 |

#### 用法说明

这是 2.6.4 新加的接口，我们可以通过它去继承一个已有的包的全部配置，然后在此基础上重写部分配置。

这通常在用户自己的项目中，修改 xmake-repo 官方仓库的内置包比较有用，比如：修复改 urls，修改版本列表，安装逻辑等等。

例如，修改内置 zlib 包的 url，切到自己的 zlib 源码地址。

```lua
package("myzlib")
    set_base("zlib")
    set_urls("https://github.com/madler/zlib.git")
package_end()

add_requires("myzlib", {system = false, alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

我们也可以用来单纯添加一个别名包。

```lua
package("onetbb")
    set_base("tbb")
```

我们可以通过 `add_requires("onetbb")` 集成安装 tbb 包，只是包名不同而已。

## on_load

- 加载包配置

#### 函数原型

::: tip API
```lua
on_load(script: <function (package)>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 包加载脚本函数，参数为package |

#### 用法说明

这是个可选的接口，如果要更加灵活的动态判断各种平台架构，针对性做设置，可以在这个里面完成，例如：

```lua
on_load(function (package)
    local bitwidth = package:config("bitwidth") or "8"
    package:add("links", "pcre" .. (bitwidth ~= "8" and bitwidth or ""))
    if not package:config("shared") then
        package:add("defines", "PCRE_STATIC")
    end
end)
```

pcre包需要做一些针对bitwidth的判断，才能确定对外输出的链接库名字，还需要针对动态库增加一些defines导出，这个时候在on_load里面设置，就更加灵活了。

## on_fetch

- 从系统中查找库

#### 函数原型

::: tip API
```lua
on_fetch(platforms: <string|array>, ..., script: <function (package, opt)>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| platforms | 平台过滤字符串或数组，可选 |
| ... | 可变参数，可传入多个平台过滤器 |
| script | 查找脚本函数，参数为package和opt |

#### 用法说明

这是个可选配置，2.5.2 之后，如果不同系统下安装的系统库，仅仅只是包名不同，那么使用 `add_extsources` 改进系统库查找已经足够，简单方便。

但是如果有些安装到系统的包，位置更加复杂，想要找到它们，也许需要一些额外的脚本才能实现，例如：windows 下注册表的访问去查找包等等，这个时候，我们就可以通过 `on_fetch` 完全定制化查找系统库逻辑。

还是以 libusb 为例，我们不用 `add_extsources`，可以使用下面的方式，实现相同的效果，当然，我们可以在里面做更多的事情。

```
package("libusb")
    on_fetch("linux", function(package, opt)
        if opt.system then
            return find_package("pkgconfig::libusb-1.0")
        end
    end)
```

## on_check

- 检测包是否支持当前平台

#### 函数原型

::: tip API
```lua
on_check(platforms: <string|array>, ..., script: <function (package)>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| platforms | 平台过滤字符串或数组，可选 |
| ... | 可变参数，可传入多个平台过滤器 |
| script | 检测脚本函数，参数为package |

#### 用法说明

有时候，单纯用 `on_install("windows", "android", function () end)` 无法很好的限制包对当前平台的支持力度。

例如，同样都是在 windows 上使用 msvc 编译，但是它仅仅只支持使用 vs2022 工具链。那么我们无法简单的去通过禁用 windows 平台，来限制包的安装。

因为每个用户的编译工具链环境都可能是不同的。这个时候，我们可以通过配置 `on_check` 去做更细致的检测，来判断包是否支持当前的工具链环境。

如果包不被支持，那么它会在包被下载安装前，更早的提示用户，也可以在 xmake-repo 的 ci 上，规避掉一些不支持的 ci job 测试。

例如，下面的配置，就可以判断当前的 msvc 是否提供了对应的 vs sdk 版本，如果版本不满足，那么这个包就无法被编译安装，用户会看到更加可读的不支持的错误提示。

```lua
package("test")
    on_check("windows", function (package)
        import("core.tool.toolchain")
        import("core.base.semver")
        local msvc = toolchain.load("msvc", {plat = package:plat(), arch = package:arch()})
        if msvc then
            local vs_sdkver = msvc:config("vs_sdkver")
            assert(vs_sdkver and semver.match(vs_sdkver):gt("10.0.19041"), "package(cglm): need vs_sdkver > 10.0.19041.0")
        end
    end)
```

例如，我们也可以用它来判断，当前编译器对 c++20 的支持力度，如果不支持 c++20 才有的 std::input_iterator。那么这个包就没必要继续下载编译安装。

用户会看到 `Require at least C++20.` 的错误，来提示用户取升级自己的编译器。

```lua
package("test")
    on_check(function (package)
        assert(package:check_cxxsnippets({test = [[
            #include <cstddef>
            #include <iterator>
            struct SimpleInputIterator {
                using difference_type = std::ptrdiff_t;
                using value_type = int;
                int operator*() const;
                SimpleInputIterator& operator++();
                void operator++(int) { ++*this; }
            };
            static_assert(std::input_iterator<SimpleInputIterator>);
        ]]}, {configs = {languages = "c++20"}}), "Require at least C++20.")
    end)
```

## on_install

- 安装包

#### 函数原型

::: tip API
```lua
on_install(platforms: <string|array>, ..., script: <function (package)>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| platforms | 平台过滤字符串或数组，可选 |
| ... | 可变参数，可传入多个平台过滤器 |
| script | 安装脚本函数，参数为package |

#### 用法说明

这个接口主要用于添加安装脚本，前面的字符串参数用于设置支持的平台，像`on_load`, `on_test`等其他脚本域也是同样支持的。

### 平台过滤

完整的过滤语法如下：`plat|arch1,arch2@host|arch1,arch2`

看上去非常的复杂，其实很简单，其中每个阶段都是可选的，可部分省略，对应：`编译平台|编译架构@主机平台|主机架构`

如果不设置任何平台过滤条件，那么默认全平台支持，里面的脚本对所有平台生效，例如：

```lua
on_install(function (package)
    -- TODO
end)
```

如果安装脚本对特定平台生效，那么直接指定对应的编译平台，可以同时指定多个：

```lua
on_install("linux", "macosx", function (package)
    -- TODO
end)
```

如果还要细分到指定架构才能生效，可以这么写：


```lua
on_install("linux|x86_64", "iphoneos|arm64", function (package)
    -- TODO
end)
```

如果还要限制执行的主机环境平台和架构，可以在后面追加`@host|arch`，例如：

```lua
on_install("mingw@windows", function (package)
    -- TODO
end)
```

意思就是仅对windows下编译mingw平台生效。

我们也可以不指定比那一平台和架构，仅设置主机平台和架构，这通常用于描述一些跟编译工具相关的依赖包，只能在主机环境运行。

例如，我们编译的包，依赖了cmake，需要添加cmake的包描述，那么里面编译安装环境，只能是主机平台：

```lua
on_install("@windows", "@linux", "@macosx", function (package)
    -- TODO
end)
```

其他一些例子：

```lua
-- `@linux`
-- `@linux|x86_64`
-- `@macosx,linux`
-- `android@macosx,linux`
-- `android|armeabi-v7a@macosx,linux`
-- `android|armeabi-v7a@macosx,linux|x86_64`
-- `android|armeabi-v7a@linux|x86_64`
```

在 2.8.7 中，我们改进了模式匹配支持，新增排除指定平台和架构，例如：

```
!plat|!arch@!subhost|!subarch
```

```lua
@!linux
@!linux|x86_64
@!macosx,!linux
!android@macosx,!linux
android|!armeabi-v7a@macosx,!linux
android|armeabi-v7a,!iphoneos@macosx,!linux|x86_64
!android|armeabi-v7a@!linux|!x86_64
!linux|*
```

同时，还提供了一个内置的 `native` 架构，用于匹配当前平台的本地架构，主要用于指定或者排除交叉编译平台。

```lua
on_install("macosx|native", ...)
```

上面的配置，如果在 macOS x86_64 的设备上，它仅仅只会匹配 `xmake f -a x86_64` 的本地架构编译。

如果是 `xmake f -a arm64` 交叉编译，就不会被匹配到。

同理，如果只想匹配交叉编译，可以使用 `macosx|!native` 进行取反排除就行了。

2.9.1 版本，我们继续对它做了改进，增加了条件逻辑判断的支持：

例如：

```lua
on_install("!wasm|!arm* and !cross|!arm*", function (package)
end)
```

来表述排除 wasm 和 cross 平台之外的 arm 架构。

并且，它也支持通过 `()` 描述的嵌套逻辑，`a and b or (a and (c or d))`。

### 编译工具

我们内置了一些安装常用编译工具脚本，用于针对不同源码依赖的构建工具链，进行方便的构架支持，例如：autoconf, cmake, meson等，

### xmake

如果是基于xmake的依赖包，那么集成起来就非常简单了，xmake对其做了非常好的内置集成支持，可以直接对其进行跨平台编译支持，一般情况下只需要：

```lua
on_install(function (package)
    import("package.tools.xmake").install(package)
end)
```

如果要传递一些特有的编译配置参数：

```lua
on_install(function (package)
    import("package.tools.xmake").install(package, {"--xxx=y"})
end)
```

### cmake

如果是基于cmake的包，集成起来也很简答，通常也只需要设置一些配置参数即可，不过还需要先添加上cmake的依赖才行：

```lua
add_deps("cmake")
on_install(function (package)
    import("package.tools.cmake").install(package, {"-Dxxx=ON"})
end)
```

### autoconf

如果是基于autoconf的包，集成方式跟cmake类似，只是传递的配置参数不同而已，不过通常情况下，unix系统都内置了autoconf系列工具，所以不加相关依赖也没事。

```lua
on_install(function (package)
    import("package.tools.autoconf").install(package, {"--enable-shared=no"})
end)
```

不过，有些源码包用系统内置的autoconf可能不能完全满足，那么可以加上autoconf系列依赖，对其进行构建：

```lua
add_deps("autoconf", "automake", "libtool", "pkg-config")
on_install(function (package)
    import("package.tools.autoconf").install(package, {"--enable-shared=no"})
end)
```

### meson

如果是meson，还需要加上ninja的依赖来执行构建才行。

```lua
add_deps("meson", "ninja")
on_install(function (package)
    import("package.tools.meson").install(package, {"-Dxxx=ON"})
end)
```

## on_test

- 测试包

#### 函数原型

::: tip API
```lua
on_test(script: <function (package)>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 测试脚本函数，参数为package |

#### 用法说明

安装后，需要设置对应的测试脚本，执行一些测试，确保安装包的可靠性，如果测试不通过，则会撤销整个安装包。

```lua
on_test(function (package)
    assert(package:has_cfuncs("inflate", {includes = "zlib.h"}))
end)
```

上面的脚本调用包内置的`has_cfuncs`接口，检测安装后的包是否存在zlib.h头文件，以及库和头文件里面是否存在`inflate`这个接口函数。

xmake会去尝试编译链接来做测试，`has_cfuncs`用于检测c函数，而`has_cxxfuncs`则可以检测c++库函数。

而includes里面可以设置多个头文件，例如：`includes = {"xxx.h", "yyy.h"}`

我们还可以传递一些自己的编译参数进去检测，例如：

```lua
on_test(function (package)
    assert(package:has_cxxfuncs("func1", {includes = "xxx.h", configs = {defines = "c++14", cxflags = "-Dxxx"}}))
end)
```

我们也可以通过`check_csnippets`和`check_cxxsnippets`检测一个代码片段：

```lua
on_test(function (package)
    assert(package:check_cxxsnippets({test = [[
        #include <boost/algorithm/string.hpp>
        #include <string>
        #include <vector>
        #include <assert.h>
        using namespace boost::algorithm;
        using namespace std;
        static void test() {
            string str("a,b");
            vector<string> strVec;
            split(strVec, str, is_any_of(","));
            assert(strVec.size()==2);
            assert(strVec[0]=="a");
            assert(strVec[1]=="b");
        }
    ]]}, {configs = {languages = "c++14"}}))
end)
```

如果是可执行包，也可以通过尝试运行来检测：

```lua
on_test(function (package)
    os.run("xxx --help")
end)
```

如果运行失败，那么测试不会通过。

## on_download

- 自定义下载包

#### 函数原型

::: tip API
```lua
on_download(script: <function (package, opt)>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 下载脚本函数，参数为package和opt |

#### 用法说明

自定义下载包，用于指定包的下载方式。

自定义包的下载逻辑，这是 2.6.4 新加的接口，通常用不到，使用 Xmake 的内置下载就足够了。

如果用户自建私有仓库，对包的下载有更复杂的鉴权机制，特殊处理逻辑，那么可以重写内部的下载逻辑来实现。

```lua
on_download(function (package, opt)
    local url = opt.url
    local sourcedir = opt.sourcedir

    -- download url to the current directory
    -- and extract it's source code to sourcedir
    -- ...
end)
```

opt 参数里面，可以获取到下载包的目的源码目录 `opt.sourcedir`，我们只需要从 `opt.url` 获取到包地址，下载下来就可以了。

然后，根据需要，添加一些自定义的处理逻辑。另外，自己可以添加下载缓存处理等等。

下面是一个自定义下载 tar.gz 文件，并且实现缓存和源文件目录解压的例子，可以参考下：

```lua
package("zlib")
    add_urls("https://github.com/madler/zlib/archive/$(version).tar.gz")
    add_versions("v1.2.10", "42cd7b2bdaf1c4570e0877e61f2fdc0bce8019492431d054d3d86925e5058dc5")

    on_download(function (package, opt)
        import("net.http")
        import("utils.archive")

        local url = opt.url
        local sourcedir = opt.sourcedir
        local packagefile = path.filename(url)
        local sourcehash = package:sourcehash(opt.url_alias)

        local cached = true
        if not os.isfile(packagefile) or sourcehash ~= hash.sha256(packagefile) then
            cached = false

            -- attempt to remove package file first
            os.tryrm(packagefile)
            http.download(url, packagefile)

            -- check hash
            if sourcehash and sourcehash ~= hash.sha256(packagefile) then
                raise("unmatched checksum, current hash(%s) != original hash(%s)", hash.sha256(packagefile):sub(1, 8), sourcehash:sub(1, 8))
            end
        end

        -- extract package file
        local sourcedir_tmp = sourcedir .. ".tmp"
        os.rm(sourcedir_tmp)
        if archive.extract(packagefile, sourcedir_tmp) then
            os.rm(sourcedir)
            os.mv(sourcedir_tmp, sourcedir)
        else
            -- if it is not archive file, we need only create empty source file and use package:originfile()
            os.tryrm(sourcedir)
            os.mkdir(sourcedir)
        end

        -- save original file path
        package:originfile_set(path.absolute(packagefile))
    end)
```

自定义下载需要用户完全自己控制下载逻辑，会比较复杂，除非必要，不推荐这么做。

如果仅仅只是想增加自定义 http headers 去获取下载授权，可以使用 [设置包下载的 http headers](/zh/api/description/builtin-policies#package-download-http-headers)。

## on_component

- 配置包组件

#### 函数原型

::: tip API
```lua
on_component(component: <string>, script: <function (package, component)>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| component | 组件名称字符串，可选（如果不提供，则应用于所有组件） |
| script | 组件配置脚本函数，参数为package和component |

#### 用法说明

这是 2.7.3 新加的接口，用于支持包的组件化配置，详情见：[#2636](https://github.com/xmake-io/xmake/issues/2636)。

通过这个接口，我们可以配置当前包，指定组件的详细信息，比如组件的链接，依赖等等。

### 配置组件链接信息

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")

    on_component("graphics", function (package, component)
        local e = package:config("shared") and "" or "-s"
        component:add("links", "sfml-graphics" .. e)
        if package:is_plat("windows", "mingw") and not package:config("shared") then
            component:add("links", "freetype")
            component:add("syslinks", "opengl32", "gdi32", "user32", "advapi32")
        end
    end)

    on_component("window", function (package, component)
        local e = package:config("shared") and "" or "-s"
        component:add("links", "sfml-window" .. e)
        if package:is_plat("windows", "mingw") and not package:config("shared") then
            component:add("syslinks", "opengl32", "gdi32", "user32", "advapi32")
        end
    end)

    ...
```

在用户端，我们可以通过下面的方式来使用包的特定组件。

```lua
add_requires("sfml")

target("test")
    add_packages("sfml", {components = "graphics")
```

::: tip 注意
除了配置组件信息，我们还需要配置可用的组件列表，才能正常使用，因此，它通常和 `add_components` 接口配合使用。
:::

一个关于包组件的配置和使用的完整例子见：[components example](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/components/xmake.lua)

### 配置组件的编译信息

我们不仅可以配置每个组件的链接信息，还有 includedirs, defines 等等编译信息，我们也可以对每个组件单独配置。

```lua
package("sfml")
    on_component("graphics", function (package, component)
        package:add("defines", "TEST")
    end)
```

### 配置组件依赖

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")

    on_component("graphics", function (package, component)
          component:add("deps", "window", "system")
    end)
```

上面的配置，告诉包，我们的 graphics 组件还会额外依赖 `window` 和 `system` 两个组件。

因此，在用户端，我们对 graphics 的组件使用，可以从

```lua
    add_packages("sfml", {components = {"graphics", "window", "system"})
```

简化为：

```lua
    add_packages("sfml", {components = "graphics")
```

因为，只要我们开启了 graphics 组件，它也会自动启用依赖的 window 和 system 组件。

另外，我们也可以通过 `add_components("graphics", {deps = {"window", "system"}})` 来配置组件依赖关系。

### 从系统库中查找组件

我们知道，在包配置中，配置 `add_extsources` 可以改进包在系统中的查找，比如从 apt/pacman 等系统包管理器中找库。

当然，我们也可以让每个组件也能通过 `extsources` 配置，去优先从系统库中找到它们。

例如，sfml 包，它在 homebrew 中其实也是组件化的，我们完全可以让包从系统库中，找到对应的每个组件，而不需要每次源码安装它们。

```sh
$ ls -l /usr/local/opt/sfml/lib/pkgconfig
-r--r--r--  1 ruki  admin  317 10 19 17:52 sfml-all.pc
-r--r--r--  1 ruki  admin  534 10 19 17:52 sfml-audio.pc
-r--r--r--  1 ruki  admin  609 10 19 17:52 sfml-graphics.pc
-r--r--r--  1 ruki  admin  327 10 19 17:52 sfml-network.pc
-r--r--r--  1 ruki  admin  302 10 19 17:52 sfml-system.pc
-r--r--r--  1 ruki  admin  562 10 19 17:52 sfml-window.pc
```

我们只需要，对每个组件配置它的 extsources：

```lua
    if is_plat("macosx") then
        add_extsources("brew::sfml/sfml-all")
    end

    on_component("graphics", function (package, component)
        -- ...
        component:add("extsources", "brew::sfml/sfml-graphics")
    end)
```

### 默认的全局组件配置

除了通过指定组件名的方式，配置特定组件，如果我们没有指定组件名，默认就是全局配置所有组件。

```lua
package("sfml")
    on_component(function (package, component)
        -- configure all components
    end)
```

当然，我们也可以通过下面的方式，指定配置 graphics 组件，剩下的组件通过默认的全局配置接口进行配置：

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")

    on_component("graphics", function (package, component)
        -- configure graphics
    end)

    on_component(function (package, component)
        -- component audio, network, window, system
    end)
```
