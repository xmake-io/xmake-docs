---
title: xmake v2.2.2, We can also manage package dependencies for C/C++
tags: [xmake, lua, C/C++, Package]
date: 2018-10-13
author: Ruki
---

### Introduction

Since my English is not very good, the article uses google translation, if you can't understand, please understand.

After more than four months, [xmake](https://github.com/xmake-io/xmake) finally updated the new version v2.2.2 and launched the heavyweight feature: Natively Supported Remote Dependency Package Management.

This feature, in fact, I have been writing for almost a year, before the initial completion, for the development of this feature and history, interested students can look at the relevant issues: [#69](https://github.com/xmake-io/xmake/issues/69).

The current implementation is as follows, a fully consistent semantic version dependency description:

<img src="/assets/img/index/add_require.png" width="70%" />

Fully consistent cross-platform build behavior, one-click xmake compilation:

<img src="/assets/img/index/package_manage.png" width="80%" />

Complete project description:

```lua
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libpng", "zlib")
```

Let me briefly introduce the background of my function:

When we write C/C++ programs, the use of third-party dependencies has always been a big problem. Because each build library has different build systems and different code platform support, it can't be like other high-level languages. Convenient and easy to use package management support.

Although there are package management tools such as homebrew, vcpkg and so on to solve this problem, there are some limitations, such as:

1. homebrew does not support iphoneos, android, windows platform
2. vcpkg does not support semantic version selection, multi-version management
3. Does not support project management and build

For the existing cross-platform build tools, there is no built-in package management support. For example, cmake only provides `find_package` to find system packages. Although it can be used with third-party package management such as vcpkg, I personally feel that it is not very Convenience.
This will make other users of the project need to install vcpkg or install the dependent library to the system when compiling. For the pc platform, it is better to use it. For the iphoneos, android and other platforms, the user will toss on the library. It will be a while.

And xmake's philosophy is: `Consistent maintenance, One-click compilation`

* Consistency of build behavior: Regardless of whether your project has library dependencies or tool dependencies, you only need to execute a `xmake` command to compile.
* Consistency of project maintenance: Regardless of whether your project is used on Windows or for Linux, iPhone, or Android, you only need a xmake.lua maintenance project.

Cmake also needs to generate additional third-party IDE project files, even if cmakelist.txt is the same, but the build and maintenance experience is not guaranteed to be completely consistent for the user. After all, it is limited to such tools as vc/make.





### Currently supported features

* Semantic version support, for example: ">= 1.1.0 < 1.2", "~1.6", "1.2.x", "1.*"
* Provide multi-warehouse management support such as official package warehouse, self-built private warehouse, project built-in warehouse, etc.
* Cross-platform package compilation integration support (packages of different platforms and different architectures can be installed at the same time, fast switching use)
* Debug dependency package support, source code debugging

### Dependency package processing mechanism

Here we briefly introduce the processing mechanism of the entire dependency package:

<div align="center">
<img src="/assets/img/index/package_arch.png" width="80%" />
</div>

1. Priority check for the current system directory, whether there is a specified package under the third-party package management, if there is a matching package, then you do not need to download and install (of course you can also set the system package)
2. Retrieve the package matching the corresponding version, then download, compile, and install (Note: installed in a specific xmake directory, will not interfere with the system library environment)
3. Compile the project, and finally automatically link the enabled dependencies

### Quickly get started

Create a new empty project that depends on the tbox library:

```console
$ xmake create -t console_tbox test
$ cd test
```

Execute the compilation. If the tbox library is not currently installed, it will be downloaded and installed automatically:

```console
$ xmake
```

Switching to the iphoneos platform for compilation will reinstall the iphoneos version of the tbox library for linking:

```console
$ xmake f -p iphoneos
$ xmake
```

Switch to the android platform arm64-v8a architecture compilation:

```console
$ xmake f -p android [--ndk=~/android-ndk-r16b]
$ xmake
```

### Semantic version settings

Xmake's dependency package management fully supports semantic version selection, for example: "~1.6.1". For a detailed description of the semantic version, see: [http://semver.org/] (http://semver.org/)

Some semantic versions are written:

```lua
add_requires("tbox 1.6.*", "pcre 1.3.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

The semantic version parser currently used by xmake is the [sv](https://github.com/uael/sv) library contributed by [uael](https://github.com/uael), which also has a description of the version. For detailed instructions, please refer to the following: [Version Description] (https://github.com/uael/sv#versions)

Of course, if we have no special requirements for the current version of the dependency package, then we can write directly:

```lua
add_requires("tbox", "libpng", "zlib")
```

This will use the latest version of the package known, or the source code compiled by the master branch. If the current package has a git repo address, we can also specify a specific branch version:

```lua
add_requires("tbox master")
add_requires("tbox dev")
```

### Additional package information settings

#### Optional package settings

If the specified dependency package is not supported by the current platform, or if the compilation and installation fails, then xmake will compile the error, which is reasonable for some projects that must rely on certain packages to work.
However, if some packages are optional dependencies, they can be set to optional packages even if they are not compiled properly.

```lua
add_requires("tbox", {optional = true})
```

#### Disable system library

With the default settings, xmake will first check to see if the system library exists (if no version is required). If the user does not want to use the system library and the library provided by the third-party package management, then you can set:

```lua
add_requires("tbox", {system = false})
```

#### Using the debug version of the package

If we want to debug the dependencies at the same time, we can set them to use the debug version of the package (provided that this package supports debug compilation):

```lua
add_requires("tbox", {debug = true})
```

If the current package does not support debug compilation, you can submit the modified compilation rules in the repository to support the debug, for example:

```lua
package("openssl")
    on_install("linux", "macosx", function (package)
        os.vrun("./config %s --prefix=\"%s\"", package:debug() and "--debug" or "", package:installdir())
        os.vrun("make -j4")
        os.vrun("make install")
    end)
```

#### Passing additional compilation information to the package

Some packages have various compile options at compile time, and we can pass them in. Of course, the package itself supports:

```lua
add_requires("tbox", {config = {small=true}})
```

Pass `--small=true` to the tbox package so that compiling the installed tbox package is enabled.

### Using a self-built private package repository

If the required package is not in the official repository [xmake-repo](https://github.com/xmake-io/xmake-repo), we can submit the contribution code to the repository for support.
But if some packages are only for personal or private projects, we can create a private repository repo. The repository organization structure can be found at: [xmake-repo](https://github.com/xmake-io/xmake-repo)

For example, now we have a private repository repo:`git@github.com:myrepo/xmake-repo.git`

We can add the repository with the following command:

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

Or we write directly in xmake.lua:

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git")
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

### Package Management Command Use

The package management command `$ xmake require` can be used to manually display the download, install, uninstall, retrieve, and view package information.

#### Install the specified package

```console
$ xmake require tbox
```

Install the specified version package:

```console
$ xmake require tbox "~1.6"
```

Force a re-download of the installation and display detailed installation information:

```console
$ xmake require -f -v tbox "1.5.x"
```

Pass additional setup information:

```console
$ xmake require --extra="debug=true,config={small=true}" tbox
```

Install the debug package and pass the compilation configuration information of `small=true` to the package.

#### Uninstalling the specified package

```console
$ xmake require --uninstall tbox
```

This will completely uninstall the removal package file.

#### Remove the specified package

Only unlink specifies the package, it is not detected by the current project, but the package still exists locally. If it is reinstalled, it will be completed very quickly.

```console
$ xmake require --unlink tbox
```

#### View package details

```console
$ xmake require --info tbox
```

#### Search for packages in the current warehouse

```console
$ xmake require --search tbox
```

This is to support fuzzy search and lua pattern matching search:

```console
$ xmake require --search pcr
```

Will also search for pcre, pcre2 and other packages.

#### List the currently installed packages

```console
$ xmake require --list
```

### Warehouse Management Command Use

As mentioned above, adding a private repository is available (supporting local path addition):

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

We can also remove a repository that has already been installed:

```console
$ xmake repo --remove myrepo
```

Or view all the added warehouses:

```console
$ xmake repo --list
```

If the remote repository has updates, you can manually perform a warehouse update to get more and the latest packages:

```console
$ xmake repo -u
```

### Submit the package to the official warehouse

At present, this feature has just been completed. At present, there are not many packages in the official warehouse. Some packages may not support some platforms, but this is not a big problem. After several iterations, I will continue to expand and improve the package warehouse.

If you need a package, the current official repository is not yet included, you can submit an issue or you can submit it to the official repository after you have localized it: [xmake-repo](https://github.com/xmake-io/xmake-repo)

For detailed contribution descriptions, see: [CONTRIBUTING.md](https://github.com/xmake-io/xmake-repo/blob/master/CONTRIBUTING.md)

For more instructions on remote dependencies, see the official documentation: [Remote Dependency Mode](/#remote-dependency-mode)

In fact, xmake package management has gone through three generations, the first two versions of v1.0, v2.0 are local package management mode, system library search mode, these two are still very useful in some cases.
For the introduction of the two, here is not much to say, you can see the documentation: [Dependency Package Management](/#dependency-package-management)

### Conclusion

Having said that, let's finally look at some of the other new features and updates provided by the new version:

#### New features

* Support fasm assembler
* Add `has_config`, `get_config`, and `is_config` apis
* Add `set_config` to set the default configuration
* Add `$xmake --try` to try building project using third-party buildsystem
* Add `set_enabled(false)` to disable target 
* [#69](https://github.com/xmake-io/xmake/issues/69): Add remote package management, `add_requires("tbox ~1.6.1")`
* [#216](https://github.com/xmake-io/xmake/pull/216): Add windows mfc rules

#### Changes

* Improve to detect Qt envirnoment and support mingw
* Add debug and release rules to the auto-generated xmake.lua
* [#178](https://github.com/xmake-io/xmake/issues/178): Modify the shared library name for mingw.
* Support case-insensitive path pattern-matching for `add_files()` on windows
* Improve to detect Qt sdk directory for `detect.sdks.find_qt`
* [#184](https://github.com/xmake-io/xmake/issues/184): Improve `lib.detect.find_package` to support vcpkg
* [#208](https://github.com/xmake-io/xmake/issues/208): Improve rpath for shared library
* [#225](https://github.com/xmake-io/xmake/issues/225): Improve to detect vs envirnoment

#### Bug fixed

* [#177](https://github.com/xmake-io/xmake/issues/177): Fix the dependent target link bug
* Fix high cpu usage bug and Exit issues for `$ xmake f --menu`
* [#197](https://github.com/xmake-io/xmake/issues/197): Fix Chinese path for generating vs201x project
* Fix wdk rules bug
* [#205](https://github.com/xmake-io/xmake/pull/205): Fix targetdir,objectdir not used in vsproject 


