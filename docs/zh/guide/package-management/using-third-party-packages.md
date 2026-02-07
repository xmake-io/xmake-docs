# 使用第三方依赖包 {#using-third-party-packages}

2.2.5 版本之后，xmake 支持对第三方包管理器中的依赖库进行安装，例如：conan、brew、vcpkg 等。

## 使用 homebrew 的依赖包

```lua
add_requires("brew::zlib", {alias = "zlib"})
add_requires("brew::pcre2/libpcre2-8", {alias = "pcre2"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("pcre2", "zlib")
```

## 使用 vcpkg 的依赖包

```lua
add_requires("vcpkg::zlib", "vcpkg::pcre2")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("vcpkg::zlib", "vcpkg::pcre2")
```

我们也可以为包添加别名，简化 `add_packages` 的使用：

```lua
add_requires("vcpkg::zlib", {alias = "zlib"})
add_requires("vcpkg::pcre2", {alias = "pcre2"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "pcre2")
```

如果 vcpkg 包带有可选特性，我们也可以直接使用 vcpkg 的语法格式 `packagename[feature1,feature2]` 来安装包。

例如：

```lua
add_requires("vcpkg::boost[core]")
```

v2.6.3 之后，xmake 支持 vcpkg 的新清单模式，通过它可以支持 vcpkg 包的版本选择，例如：

```lua
add_requires("vcpkg::zlib 1.2.11")
add_requires("vcpkg::fmt >=8.0.1", {configs = {baseline = "50fd3d9957195575849a49fa591e645f1d8e7156"}})
add_requires("vcpkg::libpng", {configs = {features = {"apng"}}})

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("vcpkg::zlib", "vcpkg::fmt", "vcpkg::libpng")
```

v2.6.8 之后，还可以额外配置私有仓库，仅在清单模式下有效。

```lua
local registries = {
    {
        kind = "git",
        repository = "https://github.com/SakuraEngine/vcpkg-registry",
        baseline = "e0e1e83ec66e3c9b36066f79d133b01eb68049f7",
        packages = {
            "skrgamenetworkingsockets"
        }
    }
}
add_requires("vcpkg::skrgamenetworkingsockets >=1.4.0+1", {configs = {registries = registries}})
```

## 使用 conan 的依赖包

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
  -> conan::zlib/1.2.11 (debug)
  -> conan::openssl/1.1.1g
please input: y (y/n)

  => installing conan::zlib/1.2.11 .. ok
  => installing conan::openssl/1.1.1g .. ok

[  0%]: cache compiling.release src/main.c
[100%]: linking.release test
```

自定义 conan/settings 配置：

```lua
add_requires("conan::poco/1.10.0", {alias = "poco",
    configs = {settings = {"compiler=gcc", "compiler.libcxx=libstdc++11"}}})
```

其他一些 conan 相关配置项：

```
{
    build          = {description = "use it to choose if you want to build from sources.", default = "missing", values = {"all", "never", "missing", "outdated"}},
    remote         = {description = "Set the conan remote server."},
    options        = {description = "Set the options values, e.g. OpenSSL:shared=True"},
    imports        = {description = "Set the imports for conan."},
    settings       = {description = "Set the build settings for conan."},
    build_requires = {description = "Set the build requires for conan.", default = "xmake_generator/0.1.0@bincrafters/testing"}
}
```

## 使用 conda 的依赖包

```lua
add_requires("conda::zlib 1.2.11", {alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

## 使用 Nix 的依赖包

我们也可以使用 Nix 包管理器来集成依赖包。

```lua
add_requires("nix::zlib", {alias = "zlib"})
add_requires("nix::pcre2", {alias = "pcre2"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("pcre2", "zlib")
```

### 语义版本支持

从 v3.0.7 开始，我们支持对 Nix 包的语义版本选择。

```lua
add_requires("nix::zlib 1.2.x")
```
## 使用 pacman 的依赖包

我们既支持 archlinux 上的 pacman 包安装和集成，也支持 msys2 上 pacman 的 mingw x86_64/i386 包安装和集成。

```lua
add_requires("pacman::zlib", {alias = "zlib"})
add_requires("pacman::libpng", {alias = "libpng"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "libpng")
```

archlinux 上只需要：

```sh
xmake
```

msys2 上安装 mingw 包，需要指定到 mingw 平台：

```sh
xmake f -p mingw -a [x86_64|i386]
xmake
```

## 使用 clib 的依赖包

clib是一款基于源码的依赖包管理器，拉取的依赖包是直接下载对应的库源码，集成到项目中编译，而不是二进制库依赖。

其在 xmake 中集成也很方便，唯一需要注意的是，还需要自己在 xmake.lua 中引用对应库的源码，例如：

```lua
add_requires("clib::clibs/bytes@0.0.4", {alias = "bytes"})

target("test")
    set_kind("binary")
    add_files("clib/bytes/*.c")
    add_files("src/*.c")
    add_packages("bytes")
```

## 使用 dub/dlang 的依赖包

xmake 也支持 dlang 的 dub 包管理器，可集成 dlang 的依赖包来使用。

```lua
add_rules("mode.debug", "mode.release")

add_requires("dub::log 0.4.3", {alias = "log"})
add_requires("dub::dateparser", {alias = "dateparser"})
add_requires("dub::emsi_containers", {alias = "emsi_containers"})
add_requires("dub::stdx-allocator", {alias = "stdx-allocator"})
add_requires("dub::mir-core", {alias = "mir-core"})

target("test")
    set_kind("binary")
    add_files("src/*.d")
    add_packages("log", "dateparser", "emsi_containers", "stdx-allocator", "mir-core")
```

## 使用 ubuntu/apt 的依赖包

v2.5.4 之后的版本支持使用 apt 集成依赖包，也会自动查找 Ubuntu 系统上已安装的包。

```lua
add_requires("apt::zlib1g-dev", {alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

## 使用 gentoo/portage 的依赖包

v2.5.4 之后的版本支持使用 Portage 集成依赖包，也会自动查找 Gentoo 系统上已安装的包。

```lua
add_requires("portage::libhandy", {alias = "libhandy"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libhandy")
```

## 使用 nimble 的依赖包

v2.5.8 之后支持集成 nimble 包管理器中的包，但目前仅用于 nim 项目，因为它并没有提供二进制包，而是直接安装的 nim 代码包。

```lua
add_requires("nimble::zip >1.3")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
    add_packages("nimble::zip")
```

## 使用 cargo 的依赖包

Cargo 依赖包主要用于 rust 项目的集成，例如：

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::base64 0.13.0")
add_requires("cargo::flate2 1.0.17", {configs = {features = "zlib"}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::base64", "cargo::flate2")
```

不过，我们也可以在 C++ 中通过 cxxbridge 的方式，调用 Rust 库接口，来变相复用所有的 Rust 包。

完整例子见：[Call Rust in C++](https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cxx_call_rust_library)

## 使用 NuGet 的依赖包

2.9.7 之后，我们也支持从 dotnet/nuget 中，获取 native 库并快速集成。

```lua
add_requires("nuget::zlib_static", {alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("zlib")
```
