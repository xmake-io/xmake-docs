
全局接口影响整个工程描述，被调用后，后面被包含进来的所有子`xmake.lua`都会受影响。

### includes

#### 添加子工程文件和目录

我们能够使用此接口添加工程子文件(xmake.lua)或者带有xmake.lua的工程子目录。

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

我们也可以通过模式匹配的方式，递归添加多个工程子目录文件：

```lua
includes("**/xmake.lua")

target("test")
    set_kind("binary")
    add_files("src/*.c")
```

### set_project

#### 设置工程名

设置工程名，在doxygen自动文档生成插件、工程文件生成插件中会用到，一般设置在xmake.lua的最开头，当然放在其他地方也是可以的

```lua
-- 设置工程名
set_project("tbox")

-- 设置工程版本
set_version("1.5.1")
```

### set_version

#### 设置工程版本

设置项目版本，可以放在xmake.lua任何地方，一般放在最开头，例如：

```lua
set_version("1.5.1")
```

2.1.7版本支持buildversion的配置：

```lua
set_version("1.5.1", {build = "%Y%m%d%H%M"})
```

我们也能够添加版本宏定义到头文件，请参考：[add_configfiles](/manual/project_target?id=add-template-configuration-files)

### set_xmakever

#### 设置最小xmake版本

用于处理xmake版本兼容性问题，如果项目的`xmake.lua`，通过这个接口设置了最小xmake版本支持，那么用户环境装的xmake低于要求的版本，就会提示错误。

一般情况下，建议默认对其进行设置，这样对用户比较友好，如果`xmake.lua`中用到了高版本的api接口，用户那边至少可以知道是否因为版本不对导致的构建失败。

设置如下：

```lua
-- 设置最小版本为：2.1.0，低于此版本的xmake编译此工程将会提示版本错误信息
set_xmakever("2.1.0")
```

### add_moduledirs

#### 添加模块目录

xmake内置的扩展模块都在`xmake/modules`目录下，可通过[import](#import)来导入他们，如果自己在工程里面实现了一些扩展模块，
可以放置在这个接口指定的目录下，import也就会能找到，并且优先进行导入。

### add_plugindirs

#### 添加插件目录

xmake内置的插件都是放在`xmake/plugins`目录下，但是对于用户自定义的一些特定工程的插件，如果不想放置在xmake安装目录下，那么可以在`xmake.lua`中进行配置指定的其他插件路径。

```lua
-- 将当前工程下的plugins目录设置为自定义插件目录
add_plugindirs("$(projectdir)/plugins")
```

这样，xmake在编译此工程的时候，也就加载这些插件。

### get_config

#### 获取给定的配置值

此接口从2.2.2版本开始引入，用于快速获取给定的配置值，可用于描述域。

```lua
if get_config("myconfig") == "xxx" then
    add_defines("HELLO")
end
```

### set_config

#### 设置给定的默认配置值

此接口从2.2.2版本开始引入，用于快速在xmake.lua中设置一个默认配置值，仅用于描述域。

之前很多配置，包括编译工具链，构建目录等只能通过`$ xmake f --name=value`的方式来配置，如果我们想写死在xmake.lua提供一个默认值，就可以通过下面的方式来配置：

```lua
set_config("name", "value")
set_config("buildir", "other/buildir")
set_config("cc", "gcc")
set_config("ld", "g++")
```

不过，我们还是可以通过`$ xmake f --name=value`的方式，去修改xmake.lua中的默认配置。

### add_requires

#### 添加需要的依赖包

xmake的依赖包管理是完全支持语义版本选择的，例如："~1.6.1"，对于语义版本的具体描述见：[https://semver.org/](https://semver.org/)

##### 语义版本

```lua
add_requires("tbox 1.6.*", "pcre 8.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

目前xmake使用的语义版本解析器是[uael](https://github.com/uael)贡献的[sv](https://github.com/uael/sv)库，里面也有对版本描述写法的详细说明，可以参考下：[版本描述说明](https://github.com/uael/sv#versions)

##### 最近版本

当然，如果我们对当前的依赖包的版本没有特殊要求，那么可以直接这么写：

```lua
add_requires("tbox", "libpng", "zlib")
```

默认，没设置版本号，xmake 会选取最近版本的包，等价于 `add_requires("zlib latest")`

##### 分支选择

这会使用已知的最新版本包，或者是master分支的源码编译的包，如果当前包有git repo地址，我们也能指定特定分支版本：

```lua
add_requires("tbox master")
add_requires("tbox dev")
```

如果指定的依赖包当前平台不支持，或者编译安装失败了，那么xmake会编译报错，这对于有些必须要依赖某些包才能工作的项目，这是合理的。
但是如果有些包是可选的依赖，即使没有也可以正常编译使用的话，可以设置为可选包：

##### Git commit 选择

2.6.5 版本，我们可以对 git 维护的包直接指定 git commit 来选择版本。

```lua
add_requires("tbox e807230557aac69e4d583c75626e3a7ebdb922f8")
```

##### 可选包

```lua
add_requires("zlib", {optional = true})
```

##### 禁用系统包

默认的设置，xmake会去优先检测系统库是否存在（如果没设置版本要求），如果用户完全不想使用系统库以及第三方包管理提供的库，那么可以设置：

```lua
add_requires("zlib", {system = false})
```

##### 禁用包校验

默认包安装，对于下载的包都是会去自动校验完整性，避免被篡改，但是如果安装一些未知新版本的包，就不行了。

用户可以通过 `{verify = false}` 强行禁用包完整性校验来临时安装他们（但通常不推荐这么做）。

```lua
add_requires("zlib", {verify = false})
```

##### 使用调试包

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

##### 作为私有包使用

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

##### 使用动态库

默认的包安装的是静态库，如果要启用动态库，可以配置如下：

```lua
add_requires("zlib", {configs = {shared = true}})
```

!> 当然，前提是这个包的定义里面，有对 `package:config("shared")` 判断处理，官方 xmake-repo 仓库里面，通常都是严格区分支持的。

##### 禁用 pic 支持

默认安装的 linux 包，都是开启 pic 编译的，这对于动态库中依赖静态库非常有用，但如果想禁用 pic，也是可以的。

```lua
add_requires("zlib", {configs = {pic = false}})
```

##### vs runtime 设置

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

##### 特定配置包

某些包在编译时候有各种编译选项，我们也可以传递进来：

```lua
add_requires("boost", {configs = {context = true, coroutine = true}})
```

比如上面，安装的 boost 包，是启用了它内部的一些子模块特性（带有协程模块支持的包）。

当然，具体支持哪些配置，每个包都是不同的，可以通过 `xmake require --info boost` 命令查看里面的 configs 部分列表。

因为，每个包定义里面，都会有自己的配置选项，并且通过 `package:config("coroutine")` 在安装时候去判断启用它们。

##### 安装第三方管理器的包

目前支持安装下面这些第三方包管理器中包。

* Conan (conan::openssl/1.1.1g)
* Conda (conda::libpng 1.3.67)
* Vcpkg (vcpkg:ffmpeg)
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

```console
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

[  0%]: ccache compiling.release src/main.c
[100%]: linking.release test
```

关于这个的完整介绍和所有第三方包的安装使用，可以参考文档：[第三方依赖包安装](https://xmake.io/#/zh-cn/package/remote_package?id=%e7%ac%ac%e4%b8%89%e6%96%b9%e4%be%9d%e8%b5%96%e5%8c%85%e5%ae%89%e8%a3%85)


### add_requireconfs

#### 设置指定依赖包的配置

这是 v2.5.1 之后的版本新增的接口，我们可以用它来对 `add_requires()` 定义的包和它的依赖包的配置进行扩充和改写，它有下面几种用法。

##### 扩充指定包的配置

这是基本用法，比如我们已经通过 `add_requires("zlib")` 声明了一个包，想要在后面对这个 zlib 的配置进行扩展，改成动态库编译，可以通过下面的方式配置。

```lua
add_requires("zlib")
add_requireconfs("zlib", {configs = {shared = true}})
```

它等价于

```lua
add_requires("zlib", {configs = {shared = true}})
```

##### 设置通用的默认配置


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

!> 默认情况下，对于相同的配置，xmake 会优先使用 add_requires 中的配置，而不是 add_requireconfs。

如果 `add_requires("zlib 1.2.11")` 中设置了版本，就会优先使用 add_requires 的配置，完全忽略 add_requireconfs 里面的版本配置，当然我们也可以通过 override 来完全重写 `add_requires` 中指定的版本。

```lua
add_requires("zlib 1.2.11")
add_requireconfs("zlib", {override = true, version = "1.2.10"})
```

##### 改写包依赖配置

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
add_requireconfs("libpng.zlib", {version = "1.2.10"})
```

##### 级联依赖的模式匹配

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


### add_repositories

#### 添加依赖包仓库

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

### set_defaultplat

#### 设置默认的编译平台

v2.5.6 以上版本才支持，用于设置工程默认的编译平台，如果没有设置，默认平台跟随当前系统平台，也就是 os.host()。

比如，在 macOS 上默认编译平台是 macosx，如果当前项目是 ios 项目，那么可以设置默认编译平台为 iphoneos。

```lua
set_defaultplat("iphoneos")
```

它等价于，`xmake f -p iphoneos`。

### set_defaultarchs

#### 设置默认的编译架构

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

### set_defaultmode

#### 设置默认的编译模式

v2.5.6 以上版本才支持，用于设置工程默认的编译模式，如果没有设置，默认是 release 模式编译。

```lua
set_defaultmode("releasedbg")
```

它等价于，`xmake f -m releasedbg`。

### set_allowedplats

#### 设置允许编译的平台列表

v2.5.6 以上版本才支持，用于设置工程支持的编译平台列表，如果用户指定了其他平台，会提示错误，这通常用于限制用户指定错误的无效平台。

如果没有设置，那么没有任何平台限制。

```lua
set_allowedplats("windows", "mingw")
```

设置当前项目仅仅支持 windows 和 mingw 平台。

### set_allowedarchs

#### 设置允许编译的平台架构

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

### set_allowedmodes

#### 设置允许的编译模式列表

v2.5.6 以上版本才支持，用于设置工程支持的编译模式列表，如果用户指定了其他模式，会提示错误，这通常用于限制用户指定错误的无效模式。

如果没有设置，那么没有任何模式限制。

```lua
set_allowedmodes("release", "releasedbg")
```

设置当前项目仅仅支持 release/releasedbg 两个编译模式。
