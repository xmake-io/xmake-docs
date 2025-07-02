---
outline: deep
---

# Using Official Packages

This has been initially supported after version 2.2.2. The usage is much simpler; just set the corresponding dependency package, for example:

```lua
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libpng", "zlib")
```

The above `add_requires` is used to describe the dependencies required by the current project, and `add_packages` is used to apply dependencies to the test target. Only these settings will automatically add links, linkdirs, includedirs, etc.

Then directly compile:

```sh
$ xmake
```

xmake will remotely pull the relevant source package, then automatically compile and install, finally compile the project, and link the dependency package. The specific effect is shown in the following figure:

<img src="/assets/img/index/package_manage.png" width="80%" />

For more information and progress on package dependency management see the related issues: [Remote package management](https://github.com/xmake-io/xmake/issues/69)

## Currently Supported Features

* Semantic version support, for example: ">= 1.1.0 < 1.2", "~1.6", "1.2.x", "1.*"
* Provide multi-repository management support such as official package repository, self-built private repository, project built-in repository, etc.
* Cross-platform package compilation integration support (packages of different platforms and different architectures can be installed at the same time, fast switching and use)
* Debug dependency package support, source code debugging

## Dependency Package Processing Mechanism

Here we briefly introduce the processing mechanism of the entire dependency package:

<div align="center">
<img src="/assets/img/index/package_arch.png" width="80%" />
</div>

1. Priority check for the current system directory, whether there is a specified package under the third-party package management. If there is a matching package, then you do not need to download and install (of course you can also set the system package)
2. Retrieve the package matching the corresponding version, then download, compile, and install (Note: installed in a specific xmake directory, will not interfere with the system library environment)
3. Compile the project, and finally automatically link the enabled dependencies

## Semantic Version Settings

Xmake's dependency package management fully supports semantic version selection, for example: "~1.6.1". For a detailed description of the semantic version, see: [https://semver.org/](https://semver.org/)

Some semantic versions are written:

```lua
add_requires("tbox 1.6.*", "pcre 1.3.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

The semantic version parser currently used by xmake is the [sv](https://github.com/uael/sv) library contributed by [uael](https://github.com/uael), which also has a description of the version. For detailed instructions, please refer to the following: [Version Description](https://github.com/uael/sv#versions)

Of course, if we have no special requirements for the current version of the dependency package, then we can write directly:

```lua
add_requires("tbox", "libpng", "zlib")
```

This will use the latest version of the package known, or the source code compiled by the master branch. If the current package has a git repo address, we can also specify a specific branch version:

```lua
add_requires("tbox master")
add_requires("tbox dev")
```

## Extra Package Information Settings

### Optional Package Settings

If the specified dependency package is not supported by the current platform, or if the compilation and installation fails, then xmake will compile the error, which is reasonable for some projects that must rely on certain packages to work.
However, if some packages are optional dependencies, they can be set to optional packages even if they are not compiled properly.

```lua
add_requires("tbox", {optional = true})
```

### Disable System Library

With the default settings, xmake will first check to see if the system library exists (if no version is required). If the user does not want to use the system library or the library provided by third-party package management, then you can set:

```lua
add_requires("tbox", {system = false})
```

### Using the debug version of the package

If we want to debug the dependencies at the same time, we can set them to use the debug version of the package (provided that this package supports debug compilation):

```lua
add_requires("tbox", {debug = true})
```

If the current package does not support debug compilation, you can submit the modified compilation rules in the repository to support debug, for example:

```lua
package("openssl")
    on_install("linux", "macosx", function (package)
        os.vrun("./config %s --prefix=\"%s\"", package:debug() and "--debug" or "", package:installdir())
        os.vrun("make -j4")
        os.vrun("make install")
    end)
```

### Passing additional compilation information to the package

Some packages have various compile options at compile time, and we can pass them in, provided the package itself supports it:

```lua
add_requires("tbox", {configs = {small=true}})
```

Pass `--small=true` to the tbox package so that compiling the installed tbox package is enabled.

We can get a list of all configurable parameters and descriptions of the specified package by executing `xmake require --info tbox` in the project directory.

such as:

```sh
xmake require --info spdlog
    require(spdlog):
      -> requires:
          -> plat: macosx
          -> arch: x86_64
          -> configs:
             -> header_only: true
             -> shared: false
             -> vs_runtime: MT
             -> debug: false
             -> fmt_external: true
             -> noexcept: false
      -> configs:
          -> header_only: Use header only (default: true)
          -> fmt_external: Use external fmt library instead of bundled (default: false)
          -> noexcept: Compile with -fno-exceptions. Call abort() on any spdlog exceptions (default: false)
      -> configs (builtin):
          -> debug: Enable debug symbols. (default: false)
          -> shared: Enable shared library. (default: false)
          -> cflags: Set the C compiler flags.
          -> cxflags: Set the C/C++ compiler flags.
          -> cxxflags: Set the C++ compiler flags.
          -> asflags: Set the assembler flags.
          -> vs_runtime: Set vs compiler runtime. (default: MT)
             -> values: {"MT","MD"}
```

Among them, configs is the configurable parameters provided by the spdlog package itself, and the configs part with builtin below is the built-in configuration parameters that all packages will have.
The top required section is the current configuration value of the project.

::: tip NOTE
`vs_runtime` is the setting for vs runtime under msvc. In v2.2.9, it also supports automatic inheritance of all static dependencies. That is to say, if spdlog is set to MD, then the fmt package it depends on will also inherit automatically. Set the MD.
:::

It can be seen that we have been able to customize the required packages very conveniently, but each package may have a lot of dependencies. If these dependencies are also customized, what should I do?

### Install any version of the package

By default, `add_requires("zlib >1.2.x")` can only select the package version that exists in the `xmake-repo` repository, because each version of the package will have a sha256 check value. Use To check the integrity of the package.

Therefore, there is no check value for packages of unknown version, and xmake will not let you choose to use it by default, which is not safe.

What if the package version we need cannot be selected for use? There are two ways, one is to submit a pr to [xmake-repo](https://github.com/xmake-io/xmake-repo), add the new version of the specified package and the corresponding sha256, for example:

```lua
package("zlib")
    add_versions("1.2.10", "8d7e9f698ce48787b6e1c67e6bff79e487303e66077e25cb9784ac8835978017")
    add_versions("1.2.11", "c3e5e9fdd5004dcb542feda5ee4f0ff0744628baf8ed2dd5d66f8ca1197cb1a1")
```

In addition, there is another way that the user passes `{verify = false}` configuration to `add_requires` to force the file integrity check of the package to be ignored, so that the sha256 value is not needed, so any version of the package can be installed.

Of course, there will be a certain degree of security risk and the risk of incomplete packages, which requires users to choose and evaluate.

```lua
add_requires("zlib 1.2.11", {verify = false})
```

### Disable external header file search path

By default, packages installed through `add_requires` will use `-isystem` or `/external:I` to refer to the header file path inside, which can usually avoid the unmodifiable warning messages introduced by some package header files.
However, we can still disable external header files by setting `{external = false}` and switch back to the use of `-I`.

The compilation flags for external header files are enabled by default as follows:

```sh
-isystem /Users/ruki/.xmake/packages/z/zlib/1.2.11/d639b7d6e3244216b403b39df5101abf/include
```

Manually turn off the compilation flags of external header files as follows:

```lua
add_requires("zlib 1.x", {external = false})
```

```sh
-I /Users/ruki/.xmake/packages/z/zlib/1.2.11/d639b7d6e3244216b403b39df5101abf/include
```

## Using self-built private package repository

If the required package is not in the official repository [xmake-repo](https://github.com/xmake-io/xmake-repo), we can submit the contribution code to the repository for support.
But if some packages are only for personal or private projects, we can create a private repository repo. The repository organization structure can be found at: [xmake-repo](https://github.com/xmake-io/xmake-repo)

For example, now we have a private repository repo:`git@github.com:myrepo/xmake-repo.git`

We can add the repository with the following command:

```sh
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

Starting with v2.2.3, support for adding repos for specified branches, for example:

```sh
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git dev
```

Or we write directly in xmake.lua:

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git")
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git dev")
```

If we just want to add one or two private packages, this time to build a git repo is too big, we can directly put the package repository into the project, for example:

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

The above myrepo directory is your own private package repository, built into your own project, and then add this repository location in xmake.lua:

```lua
add_repositories("my-repo myrepo")
```

This can be referred to [benchbox](https://github.com/tboox/benchbox) project, which has a built-in private repository.

We can even build a package without directly building a package description into the project xmake.lua, which is useful for relying on one or two packages, for example:

```lua
package("libjpeg")

    set_urls("http://www.ijg.org/files/jpegsrc.$(version).tar.gz")

    add_versions("v9c", "650250979303a649e21f87b5ccd02672af1ea6954b911342ea491f351ceb7122")

    on_install("windows", function (package)
        os.mv("jconfig.vc", "jconfig.h")
        os.vrun("nmake -f makefile.vc")
        os.cp("*.h", package:installdir("include"))
        os.cp("libjpeg.lib", package:installdir("lib"))
    end)

    on_install("macosx", "linux", function (package)
        import("package.tools.autoconf").install(package)
    end)

package_end()

add_requires("libjpeg")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libjpeg")
```

## Dependent package lock and upgrade

After v2.5.7, version locks of dependent packages have been added, similar to npm's package.lock and cargo's cargo.lock.

For example, if we quote some packages, by default, if the version is not specified, xmake will automatically pull the latest version of the package for integrated use each time, for example:

```lua
add_requires("zlib")
```

However, if the upstream package warehouse is updated and changed, for example, zlib adds a new version 1.2.11, or the installation script is changed, the user's dependent packages will change.

This can easily lead to some projects that were originally compiled and passed, and there may be some unstable factors due to changes in dependent packages, and the compilation may fail, etc.

In order to ensure that the package used by the user's project is fixed each time, we can enable the package dependency lock through the following configuration.

```lua
set_policy("package.requires_lock", true)
```

This is a global setting and must be set to the global root scope. If enabled, xmake will automatically generate a `xmake-requires.lock` configuration file after executing package pull.

It contains all the packages that the project depends on, as well as the current package version and other information.

```lua
{
    __meta__ = {
        version = "1.0"
    },
    ["macosx|x86_64"] = {
        ["cmake#31fecfc4"] = {
            repo = {
                branch = "master",
                commit = "4498f11267de5112199152ab030ed139c985ad5a",
                url = "https://github.com/xmake-io/xmake-repo.git"
            },
            version = "3.21.0"
        },
        ["glfw#31fecfc4"] = {
            repo = {
                branch = "master",
                commit = "eda7adee81bac151f87c507030cc0dd8ab299462",
                url = "https://github.com/xmake-io/xmake-repo.git"
            },
            version = "3.3.4"
        },
        ["opengl#31fecfc4"] = {
            repo = {
                branch = "master",
                commit = "94d2eee1f466092e04c5cf1e4ecc8c8883c1d0eb",
                url = "https://github.com/xmake-io/xmake-repo.git"
            }
        }
    }
}
```

Of course, we can also execute the following command to force the upgrade package to the latest version.

```sh
$ xmake require --upgrade
upgrading packages ..
  zlib: 1.2.10 -> 1.2.11
1 package is upgraded!
```

