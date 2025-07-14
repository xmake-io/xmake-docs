---
title: 制作和上传C/C++包到xmake的官方仓库
tags: [xmake, lua, C/C++, 包仓库]
date: 2019-08-09
author: Ruki
---

xmake集成了内置的远程包依赖管理，用户只需要简单地在项目中添加自己所需要的包和版本，即可自动下载和集成对应的包到项目中，并且实现编译和链接。

例如：

```lua
add_requires("libuv master", "ffmpeg", "zlib 1.20.*")
add_requires("tbox >1.6.1", {optional = true, debug = true})
add_requires("boost", {alias = "boost_context", configs = {context = true}})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libuv", "ffmpeg", "tbox", "boost_context", "zlib")
```

xmake的包仓库设计之初，就考虑到了语义版本支持，以及依赖包的跨平台支持，只要包自身能支持的平台，都可以集成进来，比如zlib包，在xmake中使用，iphoneos, android以及mingw平台下都是完全可用的。

用户只需要简单的切下构建平台：

```bash
xmake f -p iphoneos -a arm64
xmake
note: try installing these packages (pass -y to skip confirm)?
in xmake-repo:
  -> zlib 1.2.11 
please input: y (y/n)
  => download https://downloads.sourceforge.net/project/libpng/zlib/1.2.11/zlib-1.2.11.tar.gz .. ok                                                                               
  => install zlib 1.2.11 .. ok   
```

就可以对iphoneos平台下载集成`add_requires`中对应的包，xmake的最终目标，是打造一个跨平台的包仓库，用户不再需要满地找c/c++库，然后研究各种平台的移植，只需要简单的添加上包依赖，即可在各个平台都能方便使用。

当然了，目前xmake的官方仓库还在发展初期，里面的包还很少，支持的平台也不是很完善，因此，这里我简单介绍下用户如何去自己制作和上传自己需要的c/c++包，并如何提交到我们的仓库中（也可以自建私有仓库），
希望有兴趣的小伙伴可以帮忙贡献一份微薄之力，一起共同打造和建立c/c++依赖包生态。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

## 添加包到仓库

### 仓库包结构

在制作自己的包之前，我们需要先了解下一个包仓库的结构，不管是官方包仓库，还是自建私有包仓库，结构都是相同的：

```
xmake-repo
  - packages
    - t/tbox/xmake.lua
    - z/zlib/xmake.lua
```

通过上面的结构，可以看到每个包都会有个xmake.lua用于描述它的安装规则，并且根据`z/zlib`两级子目录分类存储，方便快速检索。

### 包描述说明

关于包的描述规则，基本上都是在它的xmake.lua里面完成的，这跟项目工程里面的xmake.lua描述很类似，不同的是描述域仅支持`package()`，

不过，在项目xmake.lua里面，也是可以直接添加`package()`来内置包描述的，连包仓库都省了，有时候这样会更加方便。

首先，我们先拿zlib的描述规则，来直观感受下，这个规则可以在[xmake-repo/z/zlib/xmake.lua](https://github.com/xmake-io/xmake-repo/blob/master/packages/z/zlib/xmake.lua)下找到。

```
package("zlib")

    set_homepage("http://www.zlib.net")
    set_description("A Massively Spiffy Yet Delicately Unobtrusive Compression Library")

    set_urls("http://zlib.net/zlib-$(version).tar.gz",
             "https://downloads.sourceforge.net/project/libpng/zlib/$(version)/zlib-$(version).tar.gz")

    add_versions("1.2.10", "8d7e9f698ce48787b6e1c67e6bff79e487303e66077e25cb9784ac8835978017")
    add_versions("1.2.11", "c3e5e9fdd5004dcb542feda5ee4f0ff0744628baf8ed2dd5d66f8ca1197cb1a1")

    on_install("windows", function (package)
        io.gsub("win32/Makefile.msc", "%-MD", "-" .. package:config("vs_runtime"))
        os.vrun("nmake -f win32\\Makefile.msc zlib.lib")
        os.cp("zlib.lib", package:installdir("lib"))
        os.cp("*.h", package:installdir("include"))
    end)

    on_install("linux", "macosx", function (package)
        import("package.tools.autoconf").install(package, {"--static"})
    end)
 
    on_install("iphoneos", "android@linux,macosx", "mingw@linux,macosx", function (package)
        import("package.tools.autoconf").configure(package, {host = "", "--static"})
        io.gsub("Makefile", "\nAR=.-\n",      "\nAR=" .. (package:build_getenv("ar") or "") .. "\n")
        io.gsub("Makefile", "\nARFLAGS=.-\n", "\nARFLAGS=cr\n")
        io.gsub("Makefile", "\nRANLIB=.-\n",  "\nRANLIB=\n")
        os.vrun("make install -j4")
    end)

    on_test(function (package)
        assert(package:has_cfuncs("inflate", {includes = "zlib.h"}))
    end)
```

这个包规则对windows, linux, macosx, iphoneos，mingw等平台都添加了安装规则，基本上已经做到了全平台覆盖，甚至一些交叉编译平台，算是一个比较典型的例子了。

当然，有些包依赖源码实现力度，并不能完全跨平台，那么只需对它支持的平台设置安装规则即可。









#### set_homepage

设置包所在项目的官方页面地址。

#### set_description

设置包的相关描述信息，一般通过`xmake require --info zlib`查看相关包信息时候，会看到。

#### set_kind

设置包类型，对于依赖库，则不用设置，如果是可执行包，需要设置为binary。

```
package("cmake")

    set_kind("binary")
    set_homepage("https://cmake.org")
    set_description("A cross-platform family of tool designed to build, test and package software")
```

#### set_urls

设置包的源码包或者git仓库地址，跟add_urls不同的是，此接口是覆盖性设置，而add_urls是追加设置，其他使用方式类似，这个根据不同需要来选择。

#### add_urls

添加包的源码包或者git仓库地址，此接口一般跟add_version配对使用，用于设置每个源码包的版本和对应的sha256值。

!> 可以通过添加多个urls作为镜像源，xmake会自动检测优先选用最快的url进行下载，如果下载失败则会尝试其他urls。

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

#### add_versions

用于设置每个源码包的版本和对应的sha256值，具体描述见：[add_urls](/zh/package/remote_package#add-urls)

#### add_patches

此接口用于针对源码包，在编译安装前，先打对应设置的补丁包，再对其进行编译，并且可支持同时打多个补丁。

```lua
if is_plat("macosx") then
    add_patches("1.15", "https://raw.githubusercontent.com/Homebrew/patches/9be2793af/libiconv/patch-utf8mac.diff",
                        "e8128732f22f63b5c656659786d2cf76f1450008f36bcf541285268c66cabeab")
end
```

例如，上面的代码，就是针对macosx下编译的时候，打上对应的patch-utf8mac.diff补丁，并且每个补丁后面也是要设置sha256值的，确保完整性。

#### add_links

默认情况下，xmake会去自动检测安装后的库，设置链接关系，但是有时候并不是很准，如果要自己手动调整链接顺序，以及链接名，则可以通过这个接口来设置。

```lua
add_links("mbedtls", "mbedx509", "mbedcrypto")
```

#### add_syslinks

添加一些系统库链接，有些包集成链接的时候，还需要依赖一些系统库，才能链接通过，这个时候可以在包描述里面都附加上去。

```
if is_plat("macosx") then
    add_frameworks("CoreGraphics", "CoreFoundation", "Foundation")
elseif is_plat("windows") then
    add_defines("CAIRO_WIN32_STATIC_BUILD=1")
    add_syslinks("gdi32", "msimg32", "user32")
else
    add_syslinks("pthread")
end
```

#### add_frameworks

添加依赖的系统frameworks链接。

示例见：[add_syslinks](/zh/package/remote_package#add-syslink)

#### add_linkdirs

包的链接库搜索目录也是可以调整的，不过通常都不需要，除非一些库安装完不在prefix/lib下面，而在lib的子目录下，默认搜索不到的话。

#### add_includedirs

添加其他头文件搜索目录。

#### add_defines

可以对集成的包对外输出一些特定的定义选项。

#### add_configs

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

```bash
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

#### on_load

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

#### on_install

这个接口主要用于添加安装脚本，前面的字符串参数用于设置支持的平台，像`on_load`, `on_test`等其他脚本域也是同样支持的。

##### 平台过滤

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
-- `android|armv7-a@macosx,linux`
-- `android|armv7-a@macosx,linux|x86_64`
-- `android|armv7-a@linux|x86_64`
```

##### 编译工具

我们内置了一些安装常用编译工具脚本，用于针对不同源码依赖的构建工具链，进行方便的构架支持，例如：autoconf, cmake, meson等，

###### xmake

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

###### cmake

如果是基于cmake的包，集成起来也很简答，通常也只需要设置一些配置参数即可，不过还需要先添加上cmake的依赖才行：

```lua
add_deps("cmake")
on_install(function (package)
    import("package.tools.cmake").install(package, {"-Dxxx=ON"})
end)
```

###### autoconf

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

###### meson

如果是meson，还需要加上ninja的依赖来执行构建才行。

```lua
add_deps("meson", "ninja")
on_install(function (package)
    import("package.tools.meson").install(package, {"-Dxxx=ON"})
end)
```

#### on_test

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

### 扩展配置参数

详情见：[add_configs](/zh/package/remote_package#add-configs)

### 内置配置参数

除了可以通过[add_configs](/zh/package/remote_package#add-configs)设置一些扩展的配置参数以外，xmake还提供了一些内置的配置参数，可以使用

#### 启用调试包

```lua
add_requires("xxx", {debug = true})
```

包描述里面必须有相关处理才能支持：

```lua
on_install(function (package)
    local configs = {}
    if package:debug() then
        table.insert(configs, "--enable-debug")
    end
    import("package.tools.autoconf").install(package)
end)
```

#### 设置msvc运行时库

```lua
add_requires("xxx", {configs = {vs_runtime = "MT"}})
```

通常情况下，通过`import("package.tools.autoconf").install`等内置工具脚本安装的包，内部都对vs_runtime自动处理过了。

但是如果是一些特殊的源码包，构建规则比较特殊，那么需要自己处理了：

```lua
on_install(function (package)
    io.gsub("build/Makefile.win32.common", "%-MD", "-" .. package:config("vs_runtime"))
end)
```

### 添加环境变量

对于一些库，里面也带了可执行的工具，如果需要在集成包的时候，使用上这些工具，那么也可以设置上对应PATH环境变量：

```lua
package("luajit")
    on_load(function (package)
        if is_plat("windows") then
            package:addenv("PATH", "lib")
        end
        package:addenv("PATH", "bin")
    end)
```

而在项目工程中，只有通过`add_packages`集成对应的包后，对应的环境变量才会生效。

```lua
add_requires("luajit")
target("test")
    set_kind("binary")
    add_packages("luajit")
    after_run(function (package)
        os.exec("luajit --version")
    end)
```

### 安装二进制包

xmake也是支持直接引用二进制版本包，直接安装使用，例如：

```lua
if is_plat("windows") then
    set_urls("https://www.libsdl.org/release/SDL2-devel-$(version)-VC.zip")
    add_versions("2.0.8", "68505e1f7c16d8538e116405411205355a029dcf2df738dbbc768b2fe95d20fd")
end

on_install("windows", function (package)
    os.cp("include", package:installdir())
    os.cp("lib/$(arch)/*.lib", package:installdir("lib"))
    os.cp("lib/$(arch)/*.dll", package:installdir("lib"))
end)
```

### 本地测试

如果在本地xmake-repo仓库中，已经添加和制作好了新的包，可以在本地运行测试下，是否通过，如果测试通过，即可提交pr到官方仓库，请求merge。

我们可以执行下面的脚本进行测试指定包：

```bash
cd xmake-repo
xmake l scripts/test.lua -v -D zlib
```

上面的命令，会强制重新下载和安装zlib包，测试整个安装流程是否ok，加上`-v -D`是为了可以看到完整详细的日志信息和出错信息，方便调试分析。

如果网络环境不好，不想每次测试都去重新下载所有依赖，可以加上`--shallow`参数来执行，这个参数告诉脚本，仅仅重新解压本地缓存的zlib源码包，重新执行安装命令，但不会下载各种依赖。

```bash
cd xmake-repo
xmake l scripts/test.lua -v -D --shallow zlib
```

如果我们想测试其他平台的包规则是否正常，比如: android, iphoneos等平台，可以通过`-p/--plat`或者`-a/--arch`来指定。

```bash
cd xmake-repo
xmake l scripts/test.lua -v -D --shallow -p iphoneos -a arm64 zlib
xmake l scripts/test.lua -v -D --shallow -p android --ndk=/xxxx zlib
```

## 提交包到官方仓库

目前这个特性刚完成不久，目前官方仓库的包还不是很多，有些包也许还不支持部分平台，不过这并不是太大问题，后期迭代几个版本后，我会不断扩充完善包仓库。

如果你需要的包，当前的官方仓库还没有收录，可以提交issues或者自己可以在本地调通后，贡献提交到官方仓库：[xmake-repo](https://github.com/xmake-io/xmake-repo)

详细的贡献说明，见：[CONTRIBUTING.md](https://github.com/xmake-io/xmake-repo/blob/master/CONTRIBUTING.md)

关于如何制作自己的包，可以看下上文：[添加包到仓库](/zh/package/remote_package#%e6%b7%bb%e5%8a%a0%e5%8c%85%e5%88%b0%e4%bb%93%e5%ba%93)。
