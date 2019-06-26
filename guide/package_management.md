
## Local Package Mode

By including a dependency package directory and some binary library files in the project, it is convenient to integrate some third-party dependency libraries. This method is relatively simple and straightforward, but the disadvantages are also obvious and inconvenient to manage.

Take the tbox project as an example. The dependency package is as follows:

```
- base.pkg
- zlib.pkg
- polarssl.pkg
- openssl.pkg
- mysql.pkg
- pcre.pkg
- ...
```

If you want the current project to recognize loading these packages, you first need to specify the package directory path, for example:

```lua
add_packagedirs("packages")
```

Once specified, you can add integration package dependencies in the target scope via the [add_packages](/manual/project_target?id=targetadd_packages) interface, for example:

```lua
target("tbox")
    add_packages("zlib", "polarssl", "pcre", "mysql")
```

So how to generate a *.pkg package, if it is based on xmake project, the generation method is very simple, only need:

```console
$ cd tbox
$ xmake package
```

You can generate a tbox.pkg cross-platform package in the build directory for use by third-party projects. I can also directly set the output directory and compile and generate it into the other project, for example:

```console
$ cd tbox
$ xmake package -o ../test/packages
```

In this way, the test project can pass [add_packages](/manual/project_target?id=targetadd_packages) and [add_packagedirs](/manual/global_interfaces?id=add_packagedirs) to configure and use the tbox.pkg package.

For a detailed description of the built-in package, you can also refer to the following related article, which is described in detail: [Dependency package addition and automatic detection mechanism](https://tboox.org/cn/2016/08/06/add-package-and-autocheck/)

## System Search Mode

If you feel that the above built-in package management method is very inconvenient, you can use the extension interface [lib.detect.find_package](/manual/extension_modules?id=detectfind_package) to find the system. Existing dependencies.

Currently this interface supports the following package management support:

* vcpkg
* homebrew
* pkg-config

And through the system and third-party package management tools for the installation of the dependency package, and then integrated with xmake, for example, we look for an openssl package:

```lua
local packages = find_packages("openssl", "zlib")
```

The returned results are as follows:

```lua
{
    {links = {"ssl", "crypto"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}},
    {links = {"z"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}}
}
```

If the search is successful, return a table containing all the package information, if it fails, return nil

The return result here can be directly passed as the parameter of `target:add`, `option:add`, which is used to dynamically increase the configuration of `target/option`:

```lua
option("zlib")
    set_showmenu(true)
    before_check(function (option)
        option:add(find_packages("openssl", "zlib"))
    end)
```

```lua
target("test")
    on_load(function (target)
        target:add(find_packages("openssl", "zlib"))
    end)
```

If third-party tools such as `homebrew`, `pkg-config` are installed on the system, then this interface will try to use them to improve the search results.

Another, we can also find packages from the given package manager. For example:

```lua
find_packages("brew::pcre2/libpcre2-8", "vcpkg::zlib")
```

For a more complete description of the usage, please refer to the [find_packages](/manual/builtin_modules?id=find_packages) interface documentation.

### Homebrew Integration Support

Since homebrew is generally installed directly into the system, users do not need to do any integration work, `lib.detect.find_package` has been natively seamlessly supported.

### Vcpkg Integration Support

Currently xmake v2.2.2 version already supports vcpkg, users only need to install vcpkg, execute `$ vcpkg integrate install`, xmake will automatically detect the root path of vcpkg from the system, and then automatically adapt the bread.

Of course, we can also manually specify the root path of vcpkg to support:

```console
$ xmake f --vcpkg=f:\vcpkg
```

Or we can set it to the global configuration to avoid repeating the settings each time we switch configurations:

```console
$ xmake g --vcpkg=f:\vcpkg
```

## Remote dependency mode

This has been initially supported after the 2.2.2 version, the usage is much simpler, just set the corresponding dependency package, for example:

```lua
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libpng", "zlib")
```

The above `add_requires` is used to describe the dependencies required by the current project, and `add_packages` is used to apply dependencies to the test target. Only settings will automatically add links, linkdirs, includedirs, etc.

Then directly compile:

```console
$ xmake
```

xmake will remotely pull the relevant source package, then automatically compile and install, finally compile the project, and link the dependency package. The specific effect is shown in the following figure:

<img src="/assets/img/index/package_manage.png" width="80%" />

For more information and progress on package dependency management see the related issues: [Remote package management](https://github.com/xmake-io/xmake/issues/69)

### Currently Supported Features

* Semantic version support, for example: ">= 1.1.0 < 1.2", "~1.6", "1.2.x", "1.*"
* Provide multi-repository management support such as official package repository, self-built private repository, project built-in repository, etc.
* Cross-platform package compilation integration support (packages of different platforms and different architectures can be installed at the same time, fast switching use)
* Debug dependency package support, source code debugging

### Dependency Package Processing Mechanism

Here we briefly introduce the processing mechanism of the entire dependency package:

<div align="center">
<img src="/assets/img/index/package_arch.png" width="80%" />
</div>

1. Priority check for the current system directory, whether there is a specified package under the third-party package management, if there is a matching package, then you do not need to download and install (of course you can also set the system package)
2. Retrieve the package matching the corresponding version, then download, compile, and install (Note: installed in a specific xmake directory, will not interfere with the system library environment)
3. Compile the project, and finally automatically link the enabled dependencies

### Semantic Version Settings

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

### Extra Package Information Settings

#### Optional Package Settings

If the specified dependency package is not supported by the current platform, or if the compilation and installation fails, then xmake will compile the error, which is reasonable for some projects that must rely on certain packages to work.
However, if some packages are optional dependencies, they can be set to optional packages even if they are not compiled properly.

```lua
add_requires("tbox", {optional = true})
```

#### Disable System Library

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
add_requires("tbox", {configs = {small=true}})
```

Pass `--small=true` to the tbox package so that compiling the installed tbox package is enabled.

### Install third-party packages

After version 2.2.5, xmake supports support for dependency libraries in third-party package managers, such as: conan, brew, vcpkg, clib and etc.

#### Add a homebrew dependency package

```lua
add_requires("brew::zlib", {alias = "zlib"}})
add_requires("brew::pcre2/libpcre2-8", {alias = "pcre2"}})

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("pcre2", "zlib")
```

#### Add a vcpkg dependency package

```lua
add_requires("vcpkg::zlib", "vcpkg::pcre2")

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("vcpkg::zlib", "vcpkg::pcre2")
```

#### Add a conan dependency package

```lua
add_requires("CONAN::zlib/1.2.11@conan/stable", {alias = "zlib", debug = true})
add_requires("CONAN::OpenSSL/1.0.2n@conan/stable", {alias = "openssl", 
    configs = {options = "OpenSSL:shared=True"}})

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("openssl", "zlib")
```

After executing xmake to compile:

```console
ruki:test_package ruki$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.14
note: try installing these packages (pass -y to skip confirm)?
  -> CONAN::zlib/1.2.11@conan/stable  (debug)
  -> CONAN::OpenSSL/1.0.2n@conan/stable  
please input: y (y/n)

  => installing CONAN::zlib/1.2.11@conan/stable .. ok
  => installing CONAN::OpenSSL/1.0.2n@conan/stable .. ok

[  0%]: ccache compiling.release src/main.c
[100%]: linking.release test
```

#### Add a clib dependency package

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

### Using self-built private package repository

If the required package is not in the official repository [xmake-repo](https://github.com/xmake-io/xmake-repo), we can submit the contribution code to the repository for support.
But if some packages are only for personal or private projects, we can create a private repository repo. The repository organization structure can be found at: [xmake-repo](https://github.com/xmake-io/xmake-repo)

For example, now we have a private repository repo:`git@github.com:myrepo/xmake-repo.git`

We can add the repository with the following command:

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

Starting with v2.2.3, support for adding repos for specified branches, for example:

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git dev
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

### Package Management Command 

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

#### Uninstall the specified package

```console
$ xmake require --uninstall tbox
```

This will completely uninstall the removal package file.

#### Show package information

```console
$ xmake require --info tbox
```

#### Search for packages in the current repository

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

### Repository Management Command 

As mentioned above, adding a private repository is available (supporting local path addition):

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

We can also remove a repository that has already been installed:

```console
$ xmake repo --remove myrepo
```

Or view all the added repositories:

```console
$ xmake repo --list
```

If the remote repository has updates, you can manually perform a repository update to get more and the latest packages:

```console
$ xmake repo -u
```

### Submit package to the official repository

If you need a package that is not supported by the current official repository, you can commit it to the official repository after local tuning: [xmake-repo](https://github.com/xmake-io/xmake-repo)

For detailed contribution descriptions, see: [CONTRIBUTING.md](https://github.com/xmake-io/xmake-repo/blob/master/CONTRIBUTING.md)


