# Using third-party packages

After version 2.2.5, xmake supports dependency libraries in third-party package managers, such as: conan, brew, vcpkg, clib, etc.

## Using Homebrew dependency package

```lua
add_requires("brew::zlib", {alias = "zlib"})
add_requires("brew::pcre2/libpcre2-8", {alias = "pcre2"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("pcre2", "zlib")
```

## Using Vcpkg dependency package

```lua
add_requires("vcpkg::zlib", "vcpkg::pcre2")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("vcpkg::zlib", "vcpkg::pcre2")
```

We can also add a package alias name to simplify the use of `add_packages`:

```lua
add_requires("vcpkg::zlib", {alias = "zlib"})
add_requires("vcpkg::pcre2", {alias = "pcre2"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "pcre2")
```

If the vcpkg package has optional features, we can also directly use the vcpkg syntax format `packagename[feature1,feature2]` to install the package.

e.g:

```lua
add_requires("vcpkg::boost[core]")
```

After v2.6.3, xmake supports the new manifest mode of vcpkg, through which we can support version selection of vcpkg packages, for example:

```lua
add_requires("vcpkg::zlib 1.2.11")
add_requires("vcpkg::fmt >=8.0.1", {configs = {baseline = "50fd3d9957195575849a49fa591e645f1d8e7156"}})
add_requires("vcpkg::libpng", {configs = {features = {"apng"}}})

target("test")
     set_kind("binary")
     add_files("src/*.cpp")
     add_packages("vcpkg::zlib", "vcpkg::fmt", "vcpkg::libpng")
```

After v2.6.8, it is also possible to additionally configure private repositories, which is only available in manifest mode.

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

## Using Conan dependency package

```lua
add_requires("conan::zlib/1.2.11", {alias = "zlib", debug = true})
add_requires("conan::openssl/1.1.1g", {alias = "openssl",
    configs = {options = "OpenSSL:shared=True"}})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("openssl", "zlib")
```

After executing xmake to compile:

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

Custom Conan/settings:

```lua
add_requires("conan::poco/1.10.0", {alias = "poco",
    configs = {settings = {"compiler=gcc", "compiler.libcxx=libstdc++11"}}})
```

Some other Conan related configuration items:

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

## Using Conda dependency package

```lua
add_requires("conda::zlib 1.2.11", {alias = "zlib"})

target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib")
```

## Using Nix dependency package

We can also use the Nix package manager to integrate dependencies.

```lua
add_requires("nix::zlib", {alias = "zlib"})
add_requires("nix::pcre2", {alias = "pcre2"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("pcre2", "zlib")
```

### Semantic Versioning

Starting from v3.0.7, we support semantic versioning for Nix packages.

```lua
add_requires("nix::zlib 1.2.x")
```

## Using Pacman dependency package

We support not only the installation and integration of the pacman package on archlinux, but also the installation and integration of the mingw x86_64/i386 package of pacman on msys2.

```lua
add_requires("pacman::zlib", {alias = "zlib"})
add_requires("pacman::libpng", {alias = "libpng"})

target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib", "libpng")
```

On Arch Linux:

```sh
xmake
```

To install the mingw package on msys2, you need to specify the mingw platform:

```sh
xmake f -p mingw -a [x86_64|i386]
xmake
```

## Using Clib dependency package

Clib is a source-based dependency package manager. The dependent package is downloaded directly to the corresponding library source code, integrated into the project to compile, rather than binary library dependencies.

It is also very convenient to integrate in xmake. The only thing to note is that you need to add the source code of the corresponding library to xmake.lua, for example:

```lua
add_requires("clib::clibs/bytes@0.0.4", {alias = "bytes"})

target("test")
    set_kind("binary")
    add_files("clib/bytes/*.c")
    add_files("src/*.c")
    add_packages("bytes")
```

## Using Dub/Dlang dependency package

xmake also supports Dlang's dub package manager and integrates Dlang's dependent packages to use.

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

## Using dependency package of ubuntu/apt

After v2.5.4 support the use of apt to integrate dependent packages, and will also automatically find packages that have been installed on the ubuntu system.

```lua
add_requires("apt::zlib1g-dev", {alias = "zlib"})

target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib")
```

## Using gentoo/portage dependency package

After v2.5.4 support the use of Portage integrated dependency packages, and will also automatically find packages already installed on the Gentoo system.

```lua
add_requires("portage::libhandy", {alias = "libhandy"})

target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("libhandy")
```

## Using nimble's dependency package

After v2.5.8, it supports the integration of packages in the nimble package manager, but it is currently only used for nim projects, because it does not provide binary packages, but directly installed nim code packages.

```lua
add_requires("nimble::zip >1.3")

target("test")
     set_kind("binary")
     add_files("src/main.nim")
     add_packages("nimble::zip")
```

## Using cargo's dependency package

Cargo dependency packages are mainly used for rust project integration, for example:

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::base64 0.13.0")
add_requires("cargo::flate2 1.0.17", {configs = {features = "zlib"}})

target("test")
     set_kind("binary")
     add_files("src/main.rs")
     add_packages("cargo::base64", "cargo::flate2")
```

However, we can also use cxxbridge in C++ to call the Rust library interface to reuse all Rust packages in disguise.

For a complete example, see: [Call Rust in C++](https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cxx_call_rust_library)

## Using NuGet dependency packages

After 2.9.7, we also support getting native libraries from dotnet/nuget and quickly integrating them.

```lua
add_requires("nuget::zlib_static", {alias = "zlib"})

target("test")
set_kind("binary")
add_files("src/*.cpp")
add_packages("zlib")
```
