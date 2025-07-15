---
title: xmake v2.5.5 released, Support to download and install precompiled image packages
tags: [xmake, lua, C/C++, mirror, package]
date: 2021-06-30
author: Ruki
---
### Download and install the pre-compiled package

Each time you install a package by the built-in package manager of xmake, you must download the corresponding package source code, and then perform local compilation and installation integration. This is for some large packages that compile very slowly, and some packages that rely on a lot of compilation tools. It will be very slow.

Especially on windows, not only the dependence of the third party package on the compilation environment is more complicated, but also many packages and compilation are very slow, such as boost, openssl and so on.

To this end, we implement cloud pre-compilation of packages based on github action, and pre-compile all commonly used packages, and then store them in [build-artifacts](https://github.com/xmake-mirror/build- artifacts) under Releases of the repository.

Then, when we install the package, we will automatically download it from the binary image package source to achieve rapid integration (currently only pre-compiled windows packages are supported, and will be gradually released to other platforms in the future).

We will pre-compile various configuration combinations such as plat/arch/MT/MD/static/shared of each package, and accurately pull the packages that users actually need according to the unique buildhash. All compiled products will be compressed and packaged with 7zip, as follows Picture:

![](/assets/img/posts/xmake/build-artifacts.png)






#### Configure mirror source to accelerate download

Since our pre-compiled products are all placed on github, for Chinese users, considering that access to github is not very stable, we can also use the xmake mirror proxy function to automatically switch the actual download to fastgit and other mirror sites to speed up the download.


We can configure mirror proxy rules through a pac.lua file, for example, access to all github.com domain names is switched to the hub.fastgit.org domain name to speed up downloading packages.

pac.lua configuration:

```lua
function mirror(url)
     return url:gsub("github.com", "hub.fastgit.org")
end
```

Then we set this pac.lua file, the default path is `~/.xmake/pac.lua`, or you can manually configure pac.lua using the specified location.

```console
$ xmake g --proxy_pac=/tmp/pac.lua
```

Then, when we install the package, if we encounter the package source under the github.com domain name, it will automatically switch to the fastgit mirror to accelerate the download when downloading.

```console
$ xrepo install libpng
> curl https://hub.fastgit.org/glennrp/libpng/archive/v1.6.37.zip -o v1.6.37.zip
```

Therefore, all downloads of pre-compiled products will also be speeded up. Of course, more than Fastgit provides github mirror acceleration in China, and users can also switch to other mirror sources, such as cnpmjs.org and so on.

#### How to trigger cloud pre-compilation

By default, xmake will not actively perform cloud pre-compilation and caching of all packages, which is too time-consuming and labor-intensive. Currently, only the pr is submitted to [xmake-repo](https://github.com/xmake-io/xmake- repo) The official package repository, when a new package is included or the package version is updated, the cloud pre-compilation behavior of the corresponding package will be automatically triggered.

Therefore, if users want to contribute packages to our warehouse, they can basically be precompiled and cached (except for headeronly libraries), and if users do not want to contribute packages, but also want to get the precompilation acceleration of the corresponding package, it is also possible.

Just submit pr to the build branch of the [build-artifacts](https://github.com/xmake-mirror/build-artifacts) repository, edit [build.txt](https://github.com/xmake-mirror /build-artifacts/blob/build/build.txt) file, just modify the package name and version list that needs to trigger pre-compilation, for example:

build.txt

```lua
{
    name = "asmjit",
    versions = {
        "2021.06.27"
    }
}
```

As long as pr is merged, it will automatically trigger the pre-compilation behavior, and then generate the final compilation product to releases.

#### Mandatory source code compilation and installation

Although we provide a pre-compilation, download and installation method, if users still want to compile and install from source code, we can also manually pass in the `--build` parameter to the xrepo command to force switch to source code compilation and installation mode.

```console
$ xrepo install --build openssl
```

In xmake.lua, we can also support source code compilation and installation.

```lua
add_requires("openssl", {build = true})
```

If it is not specified, then xmake will automatically try to download and install the precompiled package first.

#### Add a private pre-compiled package warehouse

Our official pre-compiled package repository is at: [build-artifacts](https://github.com/xmake-mirror/build-artifacts).

Similarly, we can also configure and add our own pre-compiled warehouse, the way to add is similar:

```console
$ xmake repo --add local-repo git@github.com:xmake-mirror/myrepo-artifacts.git
```

You can also add in xmake.lua:

```lua
add_repositories("local-repo git@github.com:xmake-mirror/myrepo-artifacts.git")
```

### New version of the land package plan

#### Default packaging format

In the new version, we provide a new local package packaging solution that will seamlessly connect `add_requires` and `add_packages`.

We can execute the `xmake package` command to generate the default new version of the packaging format.

```console
$ xmake package
package(foo): build/packages/f/foo generated
```

It will generate the file `build/packages/f/foo/xmake.lua` with the following content:

```lua
package("foo")
    set_description("The foo package")
    set_license("Apache-2.0")
    add_deps("add", "sub")

    on_load(function (package)
        package:set("installdir", path.join(os.scriptdir(), package:plat(), package:arch(), package:mode()))
    end)

    on_fetch(function (package)
        local result = {}
        result.links = "foo"
        result.linkdirs = package:installdir("lib")
        result.includedirs = package:installdir("include")
        return result
    end)
```

In fact, it uses `package()` to define and describe local packages, just like remote packages.

The generated directory structure is as follows:

```console
$ tree build/packages/f/foo/
build/packages/f/foo/
├── macosx
│ └── x86_64
│ └── release
│ ├── include
│ │ └── foo.h
│ └── lib
│ └── libfoo.a
└── xmake.lua
```

We can also use the `add_requires`/`add_repositories` interface to seamlessly integrate this package.

```lua
add_rules("mode.debug", "mode.release")

add_repositories("local-repo build")
add_requires("foo")

target("bar")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("foo")
```

Among them, the `add_repositories` configuration specifies the warehouse root directory of the local package, and then this package can be referenced through `add_requires`.

In addition, the generated local package has another feature, which is to support `target/add_deps`, which automatically associates the dependencies of multiple packages, and automatically connects all dependency links during integration.

Here is the complete [test example](https://github.com/xmake-io/xmake/blob/dev/tests/actions/package/localpkg/test.lua).

```console
"/usr/bin/xcrun -sdk macosx clang++" -o build/macosx/x86_64/release/bar build/.objs/bar/macosx/x86_64/release/src/main.cpp.o -arch x86_64 -mmacosx-version -min=10.15 -isysroot
/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX11.0.sdk -stdlib=libc++
 -L/Users/ruki/projects/personal/xmake/tests/actions/package/localpkg/bar/build/packages/f/foo/macosx/x86_64/release/lib
 -L/Users/ruki/projects/personal/xmake/tests/actions/package/localpkg/bar/build/packages/s/sub/macosx/x86_64/release/lib
 -L/Users/ruki/projects/personal/xmake/tests/actions/package/localpkg/bar/build/packages/a/add/macosx/x86_64/release/lib
 -Wl,-x -lfoo -lsub -ladd -lz
```

Note: The previous old version of the local packaging format is an early product and will still be retained, but it is not recommended to continue to use. If you want to continue to use it, you can execute the following command to package:

```console
$ xmake package -f oldpkg
```

#### Generate remote package

In addition to the local package format, `xmake package` now also supports generating remote packages, so that users can quickly submit them to remote warehouses.

We only need to modify the package format when packaging.

```console
$ xmake package -f remote
```

He will also generate packages/f/foo/xmake.lua file.

```lua
package("foo")
    set_description("The foo package")
    set_license("Apache-2.0")
    add_deps("add", "sub")

    add_urls("https://github.com/myrepo/foo.git")
    add_versions("1.0", "<shasum256 or gitcommit>")

    on_install(function (package)
        local configs = {}
        if package:config("shared") then
            configs.kind = "shared"
        end
        import("package.tools.xmake").install(package, configs)
    end)

    on_test(function (package)
        - TODO check includes and interfaces
        - assert(package:has_cfuncs("foo", {includes = "foo.h"})
    end)
```

Compared with the local package, the package definition configuration has more actual installation logic, as well as the settings of urls and versions,

We can also modify urls, versions and other configuration values through additional parameters, for example:

```console
$ xmake package -f remote --url=https://xxxx/xxx.tar.gz --shasum=xxxxx --homepage=xxxxx`
```

xmake will also read the relevant configuration information from the target's `set_license` and `set_version` configurations.

### Search for packages from third-party warehouses

The built-in xrepo package manager command of xmake previously supported searching the built-in packages in the xmake-repo repository.

```console
$ xrepo search zlib "pcr*"
    zlib:
      -> zlib: A Massively Spiffy Yet Delicately Unobtrusive Compression Library (in xmake-repo)
    pcr*:
      -> pcre2: A Perl Compatible Regular Expressions Library (in xmake-repo)
      -> pcre: A Perl Compatible Regular Expressions Library (in xmake-repo)
```

And now, we can also search for their packages from third-party package managers such as vcpkg, conan, conda and apt, just add the corresponding package namespace, for example:

```console
$ xrepo search vcpkg::pcre
The package names:
    vcpkg::pcre:
      -> vcpkg::pcre-8.44#8: Perl Compatible Regular Expressions
      -> vcpkg::pcre2-10.35#2: PCRE2 is a re-working of the original Perl Compatible Regular Expressions library
```

```console
$ xrepo search conan::openssl
The package names:
    conan::openssl:
      -> conan::openssl/1.1.1g:
      -> conan::openssl/1.1.1h:
```

### Modify the target file name

We know that for the modification of the target file name, we can use `set_basename` or use the `set_filename` interface to configure the implementation. The former modifies the name of the `xxx` part of `libxxx.so` and the latter can modify the complete file name.

But in some cases, we just want to modify: extension `.so`, prefix name `lib`, or adding suffix name such as: `libxxx-d.so` will be very troublesome, or use `set_filename` for complete modification.

Now, we newly provide three independent interfaces `set_prefixname`, `set_suffixname` and `set_extension` to configure them more flexibly.

#### Set the leading name of the target file

For example, change the default: `libtest.so` to `test.so`

```lua
target("test")
    set_prefixname("")
```

#### Set the postname of the target file

For example, change the default: `libtest.so` to `libtest-d.so`

```lua
target("test")
    set_suffixname("-d")
```

#### Set the extension of the target file

For example, change the default: `libtest.so` to `test.dll`

```lua
target("test")
    set_prefixname("")
    set_extension(".dll")
```

### Default target type

In the new version, if the user does not specify the target type in the target setting `set_kind`, then the default is the binary program.

Therefore, we can achieve smaller configurations, such as:

```lua
target("test")
    add_files("src/*.c")
```

Compilation of some small projects can be completed in just two lines, or even shorter:

```lua
target("test", {files = "src/*.c"})
```

### New appletvos compilation platform

We have also added a new appletvos compilation platform to support the compilation of programs on Apple's TVOS system. All you need is:

```console
$ xmake f -p appletvos
$ xmake
```

### Import and export compile configuration

We can also import and export the configured configuration set to facilitate the rapid migration of the configuration.

#### Export configuration

```console
$ xmake f --export=/tmp/config.txt
$ xmake f -m debug --xxx=y --export=/tmp/config.txt
```

#### Import configuration

```console
$ xmake f --import=/tmp/config.txt
$ xmake f -m debug --xxx=y --import=/tmp/config.txt
```

#### Export configuration (with menu)

```console
$ xmake f --menu --export=/tmp/config.txt
$ xmake f --menu -m debug --xxx=y --export=/tmp/config.txt
```


#### Import configuration (with menu)

```console
$ xmake f --menu --import=/tmp/config.txt
$ xmake f --menu -m debug --xxx=y --import=/tmp/config.txt
```

### vs2022 support

In addition, in the new version, we have also added support for the preview version of vs2020.

### Improve xrepo shell environment

In the last version, we supported customizing some package configurations by adding the xmake.lua file in the current directory, and then entering a specific package shell environment.

```lua
add_requires("zlib 1.2.11")
add_requires("python 3.x", "luajit")
```

```console
$ xrepo env shell
> python --version
> luajit --version
```

And now, we can also configure and load the corresponding toolchain environment in xmake.lua, for example, load the VS compilation environment.

```lua
set_toolchains("msvc")
```

## Changelog

### New features

* [#1421](https://github.com/xmake-io/xmake/issues/1421): Add prefix, suffix and extension options for target names
* [#1422](https://github.com/xmake-io/xmake/issues/1422): Support search packages from vcpkg, conan
* [#1424](https://github.com/xmake-io/xmake/issues/1424): Set binary as default target kind
* [#1140](https://github.com/xmake-io/xmake/issues/1140): Add a way to ask xmake to try to download dependencies from a certain package manager
* [#1339](https://github.com/xmake-io/xmake/issues/1339): Improve `xmake package` to generate new local/remote packages
* Add `appletvos` platform support for AppleTV, `xmake f -p appletvos`
* [#1437](https://github.com/xmake-io/xmake/issues/1437): Add headeronly library type for package to ignore `vs_runtime`
* [#1351](https://github.com/xmake-io/xmake/issues/1351): Support export/import current configs
* [#1454](https://github.com/xmake-io/xmake/issues/1454): Support to download and install precompiled image packages from xmake-mirror

### Change

* [#1425](https://github.com/xmake-io/xmake/issues/1425): Improve tools/meson to load msvc envirnoments
* [#1442](https://github.com/xmake-io/xmake/issues/1442): Support to clone package resources from git url
* [#1389](https://github.com/xmake-io/xmake/issues/1389): Support to add toolchain envs to `xrepo env`
* [#1453](https://github.com/xmake-io/xmake/issues/1453): Support to export protobuf includedirs
* Support vs2022

### Bugs fixed

* [#1413](https://github.com/xmake-io/xmake/issues/1413): Fix hangs on fetching packages
* [#1420](https://github.com/xmake-io/xmake/issues/1420): Fix config and packages cache
* [#1445](https://github.com/xmake-io/xmake/issues/1445): Fix WDK driver sign error
* [#1465](https://github.com/xmake-io/xmake/issues/1465): Fix missing link directory
