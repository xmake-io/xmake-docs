# 全局接口 {#global-interfaces}

全局接口影响整个工程描述，被调用后，后面被包含进来的所有子`xmake.lua`都会受影响。

## includes

### 添加子工程文件和目录 {#add-sub-project-and-configurations}

#### 引入子目录配置

我们能够使用此接口添加工程子文件 (xmake.lua) 或者带有 xmake.lua 的工程子目录。

```
projectdir
  - subdirs
    - xmake.lua
  - src
```

添加子工程目录：

```lua
includes("subdirs")

target("test")
    set_kind("binary")
    add_files("src/*.c")
```

或者添加子工程文件：

```lua
includes("subdirs/xmake.lua")

target("test")
    set_kind("binary")
    add_files("src/*.c")
```

#### 递归引入子配置 {#recursively-add-configurations}

我们也可以通过模式匹配的方式，递归添加多个工程子目录文件：

```lua
includes("**/xmake.lua")

target("test")
    set_kind("binary")
    add_files("src/*.c")
```

#### 引入内置的辅助配置 {#add-helper-configurations}

2.8.5 版本可以 includes 包含内置的一些辅助配置脚本，例如：

```lua
includes("@builtin/check")
```

会引入内置提供的一些检测辅助接口。

还有

```lua
includes("@builtin/qt")
```

会引入一些内置的 Qt 相关辅助接口。

其中 `@builtin` 是告诉 xmake 从内置的 includes 目录中引入配置脚本。

也就是这个路径下的配置文件：[includes](https://github.com/xmake-io/xmake/tree/master/xmake/includes)

我们可以向上面那样，按目录整个引入，也可以引入单个配置文件，例如：

```lua
includes("@builtin/check/check_cfuncs.lua")
```

仅仅引入 check 目录下 check_cfuncs 相关的辅助脚本。

而通过 `@builtin` 我们就能很好的区分是引入当前用户工程目录下的文件，还是 xmake 安装目录下的内置文件。

#### 作用域说明 {#scope-description}

includes 引入的配置是按树状层级结构来继承生效的，也就是当前 xmake.lua 中的全局配置，会对所有 includes 的子 xmake.lua 配置生效，例如：

```
projectdir
  - xmake.lua
  - foo/xmake.lua
  - bar/xmake.lua
```

上面的组织结构中，在 `projectdir/xmake.lua` 中的 includes 的所有配置，在 `foo/xmake.lua` 和 `bar/xmake.lua` 中都是可以访问的，但是反过来不行。

```lua
includes("foo")
includes("bar")

target("test")
    add_files("src/*.c")
```

就比如上面的情况，如果引入的 `foo/xmake.lua` 中有全局的 `add_defines` 配置，是无法对 test target 生效的，因为 foo/xmake.lua 属于子配置，无法影响到父配置。

::: tip 注意
这种作用域隔离，能规避很多隐藏的配置冲突和作用域污染，在嵌套层级过多的工程配置中，隐式的全局引入，会导致很多的问题。
:::

#### 模块化复用配置 {#modular-reusable}

那如果我想模块化复用配置，应该怎么做呢？只需要通过 function 去封装下需要复用的配置就行了，例如：

```lua [foo/xmake.lua]
function add_foo_configs()
    add_defines("FOO")
    -- ...
end
```

```lua [bar/xmake.lua]
function add_bar_configs()
    add_defines("BAR")
    -- ...
end
```

```lua [xmake.lua]
includes("foo")
includes("bar")

target("test1")
    add_files("src/*.c")
    add_foo_configs()

target("test2")
    add_files("src/*.c")
    add_bar_configs()
```

这种方式，不仅可以规避隐式的全局引入导致的配置冲突，而且还能支持按 target 粒度分别配置，不仅支持配置模块复用，而且更加地灵活。

如果想要全局生效，也只需要移到全局跟作用域就行。

```lua [xmake.lua]
includes("foo")
includes("bar")

add_foo_configs()
add_bar_configs()

target("test1")
    add_files("src/*.c")

target("test2")
    add_files("src/*.c")
```

::: tip 注意
另外，target 的域配置是可以重复进入追加配置的，很多情况下，都不需要封装 function，简简单单 includes 组织配置，重复进入 target 配置域在不同 xmake.lua 中更新 target 配置即可。
:::

## set_project

### 设置工程名

设置工程名，在doxygen自动文档生成插件、工程文件生成插件中会用到，一般设置在xmake.lua的最开头，当然放在其他地方也是可以的

```lua
-- 设置工程名
set_project("tbox")

-- 设置工程版本
set_version("1.5.1")
```

## set_version

### 设置工程版本

设置项目版本，可以放在 xmake.lua 任何地方，一般放在最开头，例如：

```lua
set_version("1.5.1")
```

2.1.7 版本支持 buildversion 的配置：

```lua
set_version("1.5.1", {build = "%Y%m%d%H%M"})
```

我们也能够添加版本宏定义到头文件，请参考：[add_configfiles](/zh/api/description/project-target#add-configfiles)

:::tip 注意
我们可以全局设置版本，但现在我们也可以在 target 域去单独设置它。
:::

2.8.2 版本新增了 soname 版本支持，用于控制 so/dylib 动态库的版本兼容性控制。

我们可以配置 soname 的版本后缀名称，xmake 会在编译、安装动态库的时候，自动生成符号链接，执行指定版本的动态库。

例如，如果我们配置：

```lua
set_version("1.0.1", {soname = true})
```

xmake 会自动解析版本号的 major 版本作为 soname 版本，生成的结构如下：

```
└── lib
    ├── libfoo.1.0.1.dylib
    ├── libfoo.1.dylib -> libfoo.1.0.1.dylib
    └── libfoo.dylib -> libfoo.1.dylib
```

当然，我们也可以指定 soname 到特定的版本命名：

```lua
set_version("1.0.1", {soname = "1.0"}) -> libfoo.so.1.0, libfoo.1.0.dylib
set_version("1.0.1", {soname = "1"}) -> libfoo.so.1, libfoo.1.dylib
set_version("1.0.1", {soname = "A"}) -> libfoo.so.A, libfoo.A.dylib
set_version("1.0.1", {soname = ""}) -> libfoo.so, libfoo.dylib
```

而如果没设置 soname，那么默认不开启 soname 版本兼容控制：

```lua
set_version("1.0.1") -> libfoo.so, libfoo.dylib
```

## set_xmakever

### 设置最小xmake版本

用于处理xmake版本兼容性问题，如果项目的`xmake.lua`，通过这个接口设置了最小xmake版本支持，那么用户环境装的xmake低于要求的版本，就会提示错误。

一般情况下，建议默认对其进行设置，这样对用户比较友好，如果`xmake.lua`中用到了高版本的api接口，用户那边至少可以知道是否因为版本不对导致的构建失败。

设置如下：

```lua
-- 设置最小版本为：2.1.0，低于此版本的xmake编译此工程将会提示版本错误信息
set_xmakever("2.1.0")
```

## add_moduledirs

### 添加模块目录

xmake内置的扩展模块都在`xmake/modules`目录下，可通过[import](/zh/api/scripts/builtin-modules/import)来导入他们，如果自己在工程里面实现了一些扩展模块，
可以放置在这个接口指定的目录下，import也就会能找到，并且优先进行导入。

## add_plugindirs

### 添加插件目录

xmake内置的插件都是放在`xmake/plugins`目录下，但是对于用户自定义的一些特定工程的插件，如果不想放置在xmake安装目录下，那么可以在`xmake.lua`中进行配置指定的其他插件路径。

```lua
-- 将当前工程下的plugins目录设置为自定义插件目录
add_plugindirs("$(projectdir)/plugins")
```

这样，xmake在编译此工程的时候，也就加载这些插件。

## get_config

### 获取给定的配置值

此接口从2.2.2版本开始引入，用于快速获取给定的配置值，可用于描述域。

```lua
if get_config("myconfig") == "xxx" then
    add_defines("HELLO")
end
```

::: tip 提示
此接口不仅能够获取通过[option](/zh/api/description/configuration-option#option)定义的自定义配置选项值，同时还能获取内置的全局配置、本地配置。
:::

## set_config

### 设置给定的默认配置值

此接口从2.2.2版本开始引入，用于快速在xmake.lua中设置一个默认配置值，仅用于描述域。

之前很多配置，包括编译工具链，构建目录等只能通过`$ xmake f --name=value`的方式来配置，如果我们想写死在xmake.lua提供一个默认值，就可以通过下面的方式来配置：

```lua
set_config("name", "value")
set_config("builddir", "other/builddir")
set_config("cc", "gcc")
set_config("ld", "g++")
```

不过，我们还是可以通过`$ xmake f --name=value`的方式，去修改xmake.lua中的默认配置。

## add_requires

### 添加需要的依赖包

xmake的依赖包管理是完全支持语义版本选择的，例如："~1.6.1"，对于语义版本的具体描述见：[https://semver.org/](https://semver.org/)

#### 语义版本

```lua
add_requires("tbox 1.6.*", "pcre 8.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

目前xmake使用的语义版本解析器是[uael](https://github.com/uael)贡献的[sv](https://github.com/uael/sv)库，里面也有对版本描述写法的详细说明，可以参考下：[版本描述说明](https://github.com/uael/sv#versions)

#### 最近版本

当然，如果我们对当前的依赖包的版本没有特殊要求，那么可以直接这么写：

```lua
add_requires("tbox", "libpng", "zlib")
```

默认，没设置版本号，xmake 会选取最近版本的包，等价于 `add_requires("zlib latest")`

#### 分支选择

这会使用已知的最新版本包，或者是master分支的源码编译的包，如果当前包有git repo地址，我们也能指定特定分支版本：

```lua
add_requires("tbox master")
add_requires("tbox dev")
```

如果指定的依赖包当前平台不支持，或者编译安装失败了，那么xmake会编译报错，这对于有些必须要依赖某些包才能工作的项目，这是合理的。
但是如果有些包是可选的依赖，即使没有也可以正常编译使用的话，可以设置为可选包：

#### Git commit 选择

2.6.5 版本，我们可以对 git 维护的包直接指定 git commit 来选择版本。

```lua
add_requires("tbox e807230557aac69e4d583c75626e3a7ebdb922f8")
```

#### 可选包

```lua
add_requires("zlib", {optional = true})
```

#### 禁用系统包

默认的设置，xmake会去优先检测系统库是否存在（如果没设置版本要求），如果用户完全不想使用系统库以及第三方包管理提供的库，那么可以设置：

```lua
add_requires("zlib", {system = false})
```

#### 禁用包校验

默认包安装，对于下载的包都是会去自动校验完整性，避免被篡改，但是如果安装一些未知新版本的包，就不行了。

用户可以通过 `{verify = false}` 强行禁用包完整性校验来临时安装他们（但通常不推荐这么做）。

```lua
add_requires("zlib", {verify = false})
```

#### 使用调试包

如果我们想同时源码调试依赖包，那么可以设置为使用debug版本的包（当然前提是这个包支持debug编译）：

```lua
add_requires("zlib", {debug = true})
```

如果当前包还不支持debug编译，可在仓库中提交修改编译规则，对debug进行支持，例如：

```lua
package("openssl")
    on_install("linux", "macosx", function (package)
        os.vrun("./config %s --prefix=\"%s\"", package:debug() and "--debug" or "", package:installdir())
        os.vrun("make -j4")
        os.vrun("make install")
    end)
```

#### 作为私有包使用

如果这个包，我们仅仅用于包定义，不想对外默认导出 links/linkdirs 信息，可以作为私有包提供。

这通常对于做包时候，很有用。

```lua
package("test")
    add_deps("zlib", {private = true})
    on_install(function (package)
        local zlib = package:dep("zlib"):fetch()
        -- TODO
    end)
```

如果自己定义的一个 test 包，私有依赖一个 zlib 包，等待 zlib 安装完成后，获取里面的包文件信息做进一步处理安装，但是 zlib 包本身不会再对外导出 links/linkdirs。

尽管，`add_requires` 也支持这个选项，但是不对外导出 links/linkdirs，所以通常不会去这么用，仅仅对于做包很有帮助。

#### 使用动态库

默认的包安装的是静态库，如果要启用动态库，可以配置如下：

```lua
add_requires("zlib", {configs = {shared = true}})
```

:::tip 注意
当然，前提是这个包的定义里面，有对 `package:config("shared")` 判断处理，官方 xmake-repo 仓库里面，通常都是严格区分支持的。
:::

#### 禁用 pic 支持

默认安装的 linux 包，都是开启 pic 编译的，这对于动态库中依赖静态库非常有用，但如果想禁用 pic，也是可以的。

```lua
add_requires("zlib", {configs = {pic = false}})
```

#### vs runtime 设置

默认安装的 windows 包是采用 msvc/MT 编译的，如果要切换到 MD，可以配置如下：

```lua
add_requires("zlib", {configs = {vs_runtime = "MD"}})
```

另外，还支持：MT, MTd, MD, MDd 四种选项。

如果依赖的包很多，每个配置切换一遍非常的麻烦，我们也可以通过 `set_runtimes` 全局设置切换，对所有依赖包生效。

```lua
set_runtimes("MD")
add_requires("zlib", "pcre2", "mbedtls")
```

#### 特定配置包

某些包在编译时候有各种编译选项，我们也可以传递进来：

```lua
add_requires("boost", {configs = {context = true, coroutine = true}})
```

比如上面，安装的 boost 包，是启用了它内部的一些子模块特性（带有协程模块支持的包）。

当然，具体支持哪些配置，每个包都是不同的，可以通过 `xmake require --info boost` 命令查看里面的 configs 部分列表。

因为，每个包定义里面，都会有自己的配置选项，并且通过 `package:config("coroutine")` 在安装时候去判断启用它们。

#### 安装第三方管理器的包

目前支持安装下面这些第三方包管理器中包。

* Conan (conan::openssl/1.1.1g)
* Conda (conda::libpng 1.3.67)
* Vcpkg (vcpkg::ffmpeg)
* Homebrew/Linuxbrew (brew::pcre2/libpcre2-8)
* Pacman on archlinux/msys2 (pacman::libcurl)
* Apt on ubuntu/debian (apt::zlib1g-dev)
* Clib (clib::clibs/bytes@0.0.4)
* Dub (dub::log 0.4.3)
* Portage on Gentoo/Linux (portage::libhandy)


例如添加conan的依赖包：

```lua
add_requires("conan::zlib/1.2.11", {alias = "zlib", debug = true})
add_requires("conan::openssl/1.1.1g", {alias = "openssl",
    configs = {options = "OpenSSL:shared=True"}})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("openssl", "zlib")
```

执行xmake进行编译后：

```sh
ruki:test_package ruki$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.14
note: try installing these packages (pass -y to skip confirm)?
  -> conan::zlib/1.2.11  (debug)
  -> conan::openssl/1.1.1g
please input: y (y/n)

  => installing conan::zlib/1.2.11 .. ok
  => installing conan::openssl/1.1.1g .. ok

[  0%]: cache compiling.release src/main.c
[100%]: linking.release test
```

关于这个的完整介绍和所有第三方包的安装使用，可以参考文档：[第三方依赖包安装](/zh/guide/package-management/using-third-party-packages)。

#### 另一种简化的配置语法

我们通常使用的常用配置语法：

```lua
add_requires("boost >=1.78.0", {configs = {iostreams = true, system = true, thread = true}})
```

对于大部分 boolean 配置，我们可以通过下面的写法，去简化配置。

```lua
add_requires("boost[iostreams,system,thread] >=1.78.0")
```

这对于 `xrepo install` 独立 cli 命令下带复杂配置的安装，会省事不少，用户可以根据自己的喜好需求，选择使用。

```sh
xrepo install boost[iostreams,system,thread]
```

另外，除了 boolean 配置，还支持 string 和 array 配置值。boolean 值，也可以设置 `=n/y` 去禁用和启用。

```lua
add_requires("boost[iostreams,system,thread,key=value] >=1.78.0")
add_requires("boost[iostreams=y,thread=n] >=1.78.0")
add_requires("ffmpeg[shared,debug,codecs=[foo,bar,zoo]]")
```

## add_requireconfs

### 设置指定依赖包的配置

这是 v2.5.1 之后的版本新增的接口，我们可以用它来对 `add_requires()` 定义的包和它的依赖包的配置进行扩充和改写，它有下面几种用法。

#### 扩充指定包的配置

这是基本用法，比如我们已经通过 `add_requires("zlib")` 声明了一个包，想要在后面对这个 zlib 的配置进行扩展，改成动态库编译，可以通过下面的方式配置。

```lua
add_requires("zlib")
add_requireconfs("zlib", {configs = {shared = true}})
```

它等价于

```lua
add_requires("zlib", {configs = {shared = true}})
```

#### 设置通用的默认配置


上面的用法，我们还看不出有什么实际用处，但如果依赖多了就能看出效果了，比如下面这样：

```lua
add_requires("zlib", {configs = {shared = true}})
add_requires("pcre", {configs = {shared = true}})
add_requires("libpng", {configs = {shared = true}})
add_requires("libwebp", {configs = {shared = true}})
add_requires("libcurl", {configs = {shared = false}})
```

是不是非常繁琐，如果我们用上 `add_requireconfs` 来设置默认配置，就可以极大的简化成下面的配置：

```lua
add_requireconfs("*", {configs = {shared = true}})
add_requires("zlib")
add_requires("pcre")
add_requires("libpng")
add_requires("libwebp")
add_requires("libcurl", {configs = {shared = false}})
```

上面的配置，我们通过 `add_requireconfs("*", {configs = {shared = true}})` 使用模式匹配的方式，设置所有的依赖包默认走动态库编译安装。

但是，我们又通过 `add_requires("libcurl", {configs = {shared = false}})` 将 libcurl 进行了特殊配置，强制走静态库编译安装。

最终的配置结果为：zlib/pcre/libpng/libwebp 是 shared 库，libcurl 是静态库。

我们通过模式匹配的方式，可以将一些每个包的常用配置都放置到统一的 `add_requireconfs` 中去预先配置好，极大简化每个 `add_requires` 的定义。

:::tip 注意
默认情况下，对于相同的配置，xmake 会优先使用 add_requires 中的配置，而不是 add_requireconfs。
:::

如果 `add_requires("zlib 1.2.11")` 中设置了版本，就会优先使用 add_requires 的配置，完全忽略 add_requireconfs 里面的版本配置，当然我们也可以通过 override 来完全重写 `add_requires` 中指定的版本。

```lua
add_requires("zlib 1.2.11")
add_requireconfs("zlib", {override = true, version = "1.2.10"})
```

#### 改写包依赖配置

其实 `add_requireconfs` 最大的用处是可以让用户改写安装包的特定依赖包的配置。

什么意思呢，比如我们项目中集成使用 libpng 这个包，并且使用了动态库版本，但是 libpng 内部依赖的 zlib 库其实还是静态库版本。

```lua
add_requires("libpng", {configs = {shared = true}})
```

那如果我们想让 libpng 依赖的 zlib 包也改成动态库编译，应该怎么配置呢？这就需要 `add_requireconfs` 了。


```lua
add_requires("libpng", {configs = {shared = true}})
add_requireconfs("libpng.zlib", {configs = {shared = true}})
```

通过 `libpng.zlib` 依赖路径的写法，指定内部某个依赖，改写内部依赖配置。

如果依赖路径很深，比如 `foo -> bar -> xyz` 的依赖链，我们可以写成：`foo.bar.xyz`

我们也可以改写 libpng 依赖的内部 zlib 库版本：


```lua
add_requires("libpng")
add_requireconfs("libpng.zlib", {override = true, version = "1.2.10"})
```

#### 级联依赖的模式匹配

如果一个包的依赖非常多，且依赖层次也很深，怎么办呢，比如 libwebp 这个包，它的依赖有：

```
libwebp
  - libpng
    - zlib
    - cmake
  - libjpeg
  - libtiff
    - zlib
  - giflib
  - cmake
```

如果我想改写 libwebp 里面的所有的依赖库都加上特定配置，那么挨个配置，就会非常繁琐，这个时候就需要 `add_requireconfs()` 的递归依赖模式匹配来支持了。

```lua
add_requires("libwebp")
add_requireconfs("libwebp.**|cmake", {configs = {cxflags = "-DTEST"}})
```

上面的配置，我们将 libwebp 中所以的库依赖就额外加上了 `-DTEST` 来编译，但是 cmake 依赖属于构建工具依赖，我们可以通过 `|xxx` 的方式排除它。

这里的模式匹配写法，与 `add_files()` 非常类似。

我们在给几个例子，比如这回我们只改写 libwebp 下单级的依赖配置，启用调试库：

```lua
add_requires("libwebp")
add_requireconfs("libwebp.*|cmake", {debug = true})
```


## add_repositories

### 添加依赖包仓库

如果需要的包不在官方仓库[xmake-repo](https://github.com/xmake-io/xmake-repo)中，我们可以提交贡献代码到仓库进行支持。
但如果有些包仅用于个人或者私有项目，我们可以建立一个私有仓库repo，仓库组织结构可参考：[xmake-repo](https://github.com/xmake-io/xmake-repo)

比如，现在我们有一个一个私有仓库repo：`git@github.com:myrepo/xmake-repo.git`

我们可以通过此接口来添加：

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git")
```

如果我们只是想添加一两个私有包，这个时候特定去建立一个git repo太小题大做了，我们可以直接把包仓库放置项目里面，例如：

```
projectdir
  - myrepo
    - packages
      - t/tbox/xmake.lua
      - z/zlib/xmake.lua
  - src
    - main.c
  - xmake.lua
```

上面myrepo目录就是自己的私有包仓库，内置在自己的项目里面，然后在xmake.lua里面添加一下这个仓库位置：

```lua
add_repositories("my-repo myrepo")
```

这个可以参考[benchbox](https://github.com/tboox/benchbox)项目，里面就内置了一个私有仓库。

注：其中 myrepo 是 xmake 命令执行目录的相对路径，它不会自动根据配置文件所在目录自动转换，如果想要设置到相对于当前 xmake.lua 文件的路径，可以通过 rootdir 参数指定。

```lua
add_repositories("my-repo myrepo", {rootdir = os.scriptdir()})
```

不过这个参数设置只有 v2.5.7 以上版本才支持。

## set_defaultplat

### 设置默认的编译平台

v2.5.6 以上版本才支持，用于设置工程默认的编译平台，如果没有设置，默认平台跟随当前系统平台，也就是 os.host()。

比如，在 macOS 上默认编译平台是 macosx，如果当前项目是 ios 项目，那么可以设置默认编译平台为 iphoneos。

```lua
set_defaultplat("iphoneos")
```

它等价于，`xmake f -p iphoneos`。

## set_defaultarchs

### 设置默认的编译架构

v2.5.6 以上版本才支持，用于设置工程默认的编译架构，如果没有设置，默认平台跟随当前系统架构，也就是 os.arch()。

```lua
set_defaultplat("iphoneos")
set_defaultarchs("arm64")
```

它等价于，`xmake f -p iphoneos -a arm64`。

我们也可以设置多个平台下的默认架构。

```lua
set_defaultarchs("iphoneos|arm64", "windows|x64")
```

在 iphoneos 上默认编译 arm64 架构，在 windows 上默认编译 x64 架构。

## set_defaultmode

### 设置默认的编译模式

v2.5.6 以上版本才支持，用于设置工程默认的编译模式，如果没有设置，默认是 release 模式编译。

```lua
set_defaultmode("releasedbg")
```

它等价于，`xmake f -m releasedbg`。

## set_allowedplats

### 设置允许编译的平台列表

v2.5.6 以上版本才支持，用于设置工程支持的编译平台列表，如果用户指定了其他平台，会提示错误，这通常用于限制用户指定错误的无效平台。

如果没有设置，那么没有任何平台限制。

```lua
set_allowedplats("windows", "mingw")
```

设置当前项目仅仅支持 windows 和 mingw 平台。

## set_allowedarchs

### 设置允许编译的平台架构

v2.5.6 以上版本才支持，用于设置工程支持的编译架构列表，如果用户指定了其他架构，会提示错误，这通常用于限制用户指定错误的无效架构。

如果没有设置，那么没有任何架构限制。

```lua
set_allowedarchs("x64", "x86")
```

当前项目，仅仅支持 x64/x86 平台。

我们也可以同时指定多个平台下允许的架构列表。

```lua
set_allowedarchs("windows|x64", "iphoneos|arm64")
```

设置当前项目在 windows 上仅仅支持 x64 架构，并且在 iphoneos 上仅仅支持 arm64 架构。

## set_allowedmodes

### 设置允许的编译模式列表

v2.5.6 以上版本才支持，用于设置工程支持的编译模式列表，如果用户指定了其他模式，会提示错误，这通常用于限制用户指定错误的无效模式。

如果没有设置，那么没有任何模式限制。

```lua
set_allowedmodes("release", "releasedbg")
```

设置当前项目仅仅支持 release/releasedbg 两个编译模式。

## namespace

进入命名空间，xmake 2.9.8 版本支持，可以用于隔离子工程的重名 target，option 等各种域名冲突。

### 隔离 target

对于命名空间内部的 target 访问，完全可以按现有的方式，不加任何命名空间，直接访问，而跨命名空间访问，则需要指定 `namespace::` 去指定。

```lua
add_rules("mode.debug", "mode.release")

namespace("ns1", function ()
    target("foo")
        set_kind("static")
        add_files("src/foo.cpp")

    namespace("ns2", function()
        target("bar")
            set_kind("static")
            add_files("src/bar.cpp")
    end)

    target("test")
        set_kind("binary")
        add_deps("foo", "ns2::bar")
        add_files("src/main.cpp")
end)
```

我们指定构建特定 target 时，也可以通过命名空间来定位。

```sh
$ xmake build -r ns1::test
[ 33%]: cache compiling.release ns1::ns2::src/bar.cpp
[ 41%]: cache compiling.release ns1::src/foo.cpp
[ 50%]: cache compiling.release ns1::src/main.cpp
[ 58%]: archiving.release ns1::ns2::libbar.a
[ 75%]: archiving.release ns1::libfoo.a
[ 91%]: linking.release ns1::test
[100%]: build ok, spent 1.325s
```

另外，命名空间也能隔离根域的配置，每个命名空间都有独立子根域，可以单独设置全局配置。

```lua
add_rules("mode.debug", "mode.release")

add_defines("ROOT")

namespace("ns1", function ()
    add_defines("NS1_ROOT")
    target("foo")
        set_kind("static")
        add_files("src/foo.cpp")
        add_defines("FOO")

    namespace("ns2", function ()
        add_defines("NS2_ROOT")
        target("bar")
            set_kind("static")
            add_files("src/bar.cpp")
            add_defines("BAR")
    end)
end)

target("test")
    set_kind("binary")
    add_deps("ns1::foo", "ns1::ns2::bar")
    add_files("src/main.cpp")
    add_defines("TEST")
```

我们还可以隔离 includes 引入的子工程。

```lua
add_rules("mode.debug", "mode.release")

add_defines("ROOT")

namespace("ns1", function ()
    add_defines("NS1_ROOT")
    target("foo")
        set_kind("static")
        add_files("src/foo.cpp")
        add_defines("FOO")

    includes("src")
end)

target("test")
    set_kind("binary")
    add_deps("ns1::foo", "ns1::ns2::bar")
    add_files("src/main.cpp")
    add_defines("TEST")
```

### 隔离 option

```sh
$ xmake f --opt0=y
$ xmake f --ns1::opt1=y
$ xmake f --ns1::ns2::opt2=y
```

```lua
add_rules("mode.debug", "mode.release")

option("opt0", {default = true, defines = "OPT0", description = "option0"})

namespace("ns1", function ()
    option("opt1", {default = true, defines = "NS1_OPT1", description = "option1"})

    target("foo")
        set_kind("static")
        add_files("src/foo.cpp")
        add_options("opt1")

    namespace("ns2", function()
        option("opt2", {default = true, defines = "NS2_OPT2", description = "option2"})
        target("bar")
            set_kind("static")
            add_files("src/bar.cpp")
            add_options("opt2")
    end)

    target("test")
        set_kind("binary")
        add_deps("foo", "ns2::bar")
        add_files("src/main.cpp")
        add_options("opt0", "opt1", "ns2::opt2")
end)
```

### 隔离 rule

```lua
add_rules("mode.debug", "mode.release")

rule("rule0")
    on_load(function (target)
        target:add("defines", "RULE0")
    end)

namespace("ns1", function ()
    rule("rule1")
        on_load(function (target)
            target:add("defines", "NS1_RULE1")
        end)

    target("foo")
        set_kind("static")
        add_files("src/foo.cpp")
        add_rules("rule1")

    namespace("ns2", function()
        rule("rule2")
            on_load(function (target)
                target:add("defines", "NS2_RULE2")
            end)

        target("bar")
            set_kind("static")
            add_files("src/bar.cpp")
            add_rules("rule2")
    end)

    target("test")
        set_kind("binary")
        add_deps("foo", "ns2::bar")
        add_files("src/main.cpp")
        add_rules("rule0", "rule1", "ns2::rule2")
end)
```

### 隔离 task

```sh
xmake task0
xmake ns1::task1
xmake ns1::ns2::task2
```

```lua
task("task0")
    set_menu {options = {}}
    on_run(function ()
        print("task0")
    end)

namespace("ns1", function ()
    task("task1")
        set_menu {options = {}}
        on_run(function ()
            print("NS1_TASK1")
        end)

    namespace("ns2", function()
        task("task2")
            set_menu {options = {}}
            on_run(function ()
                print("NS2_TASK2")
            end)
    end)
end)
```

### 隔离 toolchain

```lua

toolchain("toolchain0")
    on_load(function (toolchain)
        toolchain:add("defines", "TOOLCHAIN0")
    end)

namespace("ns1", function ()
    toolchain("toolchain1")
        on_load(function (toolchain)
            toolchain:add("defines", "NS1_TOOLCHAIN1")
        end)

    target("foo")
        set_kind("static")
        add_files("src/foo.cpp")
        set_toolchains("toolchain1")

    namespace("ns2", function()
        toolchain("toolchain2")
            on_load(function (toolchain)
                toolchain:add("defines", "NS2_TOOLCHAIN2")
            end)

        target("bar")
            set_kind("static")
            add_files("src/bar.cpp")
            set_toolchains("toolchain2")
    end)

    target("test")
        set_kind("binary")
        add_deps("foo", "ns2::bar")
        add_files("src/main.cpp")
        set_toolchains("toolchain0", "toolchain1", "ns2::toolchain2")
end)
```

### 隔离 package

```lua

add_requires("package0", {system = false})

package("package0")
    on_load(function (package)
        package:add("defines", "PACKAGE0")
    end)
    on_install(function (package) end)

namespace("ns1", function ()

    add_requires("package1", {system = false})

    package("package1")
        on_load(function (package)
            package:add("defines", "NS1_PACKAGE1")
        end)
        on_install(function (package) end)

    target("foo")
        set_kind("static")
        add_files("src/foo.cpp")
        add_packages("package1")

    namespace("ns2", function()

        add_requires("package2", {system = false})

        package("package2")
            on_load(function (package)
                package:add("defines", "NS2_PACKAGE2")
            end)
            on_install(function (package) end)

        target("bar")
            set_kind("static")
            add_files("src/bar.cpp")
            add_packages("package2")
    end)

    target("test")
        set_kind("binary")
        add_deps("foo", "ns2::bar")
        add_files("src/main.cpp")
        add_packages("package0", "package1", "ns2::package2")
end)
```

## namespace_end

结束当前的命名空间。

```lua
namespace("test")
  target("hello")
    add_files("src/*.c")
namespace_end()
```

除了使用 namespace_end，我们也可以使用下面的语法，来结束命名空间，并且对 LSP 更加友好，具体使用哪种方式，根据用户自己的需求和喜好决定。

```lua
namespace("test", function ()
  target("hello")
    add_files("src/*.c")
end)
```
