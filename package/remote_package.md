
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

## Currently Supported Features

* Semantic version support, for example: ">= 1.1.0 < 1.2", "~1.6", "1.2.x", "1.*"
* Provide multi-repository management support such as official package repository, self-built private repository, project built-in repository, etc.
* Cross-platform package compilation integration support (packages of different platforms and different architectures can be installed at the same time, fast switching use)
* Debug dependency package support, source code debugging

## Dependency Package Processing Mechanism

Here we briefly introduce the processing mechanism of the entire dependency package:

<div align="center">
<img src="/assets/img/index/package_arch.png" width="80%" />
</div>

1. Priority check for the current system directory, whether there is a specified package under the third-party package management, if there is a matching package, then you do not need to download and install (of course you can also set the system package)
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

With the default settings, xmake will first check to see if the system library exists (if no version is required). If the user does not want to use the system library and the library provided by the third-party package management, then you can set:

```lua
add_requires("tbox", {system = false})
```

### Using the debug version of the package

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

### Passing additional compilation information to the package

Some packages have various compile options at compile time, and we can pass them in. Of course, the package itself supports:

```lua
add_requires("tbox", {configs = {small=true}})
```

Pass `--small=true` to the tbox package so that compiling the installed tbox package is enabled.

We can get a list of all configurable parameters and descriptions of the specified package by executing `xmake require --info tbox` in the project directory.

such as:

```console
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

!> `vs_runtime` is the setting for vs runtime under msvc. In v2.2.9, it also supports automatic inheritance of all static dependencies. That is to say, if spdlog is set to MD, then the fmt package it depends on will also inherit automatically. Set the MD.

It can be seen that we have been able to customize the required packages very conveniently, but each package may have a lot of dependencies. If these dependencies are also customized, what should I do?

Or take `spdlog->fmt` as an example. For `vs_runtime` this can automatically inherit the configuration, because it is a built-in configuration item, many private configurations can not be processed.

At this time, we can add the fmt package by `add_requires` in advance in the outer project xmake.lua (this time you can set various configuration of your own).
Make sure that spdlog has been installed by `add_requires` before installation. If spdlog is installed, it will be detected automatically and used directly. It will not continue to install fmt dependencies internally.

e.g:

```lua
add_requires("fmt", {system = false, configs = {cxflags = "-fPIC"}})
add_requires("spdlog", {system = false, configs = {fmt_external = true, cxflags = "-fPIC"}})
```

Our project requires spdlog to enable fPIC compilation, then its fmt dependency package also needs to be enabled, then we can add the fmt package first on the spdlog, and also set the fPIC to install it in advance.

In this way, spdlog corresponds to the internal fmt dependency package, we can also flexibly set various complex custom configurations in the upper layer through `add_requires`.

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

Of course, there will be a certain degree of security and the risk of incomplete packages, which requires users to choose and evaluate.

```lua
add_requires("zlib 1.2.11", {verify = false})
```

### Disable external header file search path

By default, packages installed through `add_requires` will use `-isystem` or `/external:I` to refer to the header file path inside, which can usually avoid the unmodifiable warning messages introduced by some package header files.
However, we can still disable external header files by setting `{external = false}` and switch back to the use of `-I`.

The compilation flags for external header files are enabled by default as follows:

```console
-isystem /Users/ruki/.xmake/packages/z/zlib/1.2.11/d639b7d6e3244216b403b39df5101abf/include
```

Manually turn off the compilation flags of external external header files as follows:

```lua
add_requires("zlib 1.x", {external = false})
```

```console
-I /Users/ruki/.xmake/packages/z/zlib/1.2.11/d639b7d6e3244216b403b39df5101abf/include
```

## Install third-party packages

After version 2.2.5, xmake supports support for dependency libraries in third-party package managers, such as: conan, brew, vcpkg, clib and etc.

### Add homebrew dependency package

```lua
add_requires("brew::zlib", {alias = "zlib"})
add_requires("brew::pcre2/libpcre2-8", {alias = "pcre2"})

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("pcre2", "zlib")
```

### Add vcpkg dependency package

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

### Add conan dependency package

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

```console
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

[  0%]: ccache compiling.release src/main.c
[100%]: linking.release test
```

Custom conan/settings:

```lua
add_requires("conan::poco/1.10.0", {alias = "poco",
    configs = {settings = {"compiler=gcc", "compiler.libcxx=libstdc++11"}}})
```

Some other conan related configuration items:

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

### Add conda dependency package

```lua
add_requires("conda::zlib 1.2.11", {alias = "zlib"})

target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib")
```

### Add pacman dependency package

We support not only the installation and integration of the pacman package on archlinux, but also the installation and integration of the mingw x86_64/i386 package of pacman on msys2.

```lua
add_requires("pacman::zlib", {alias = "zlib"})
add_requires("pacman::libpng", {alias = "libpng"})

target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib", "libpng")
```

On archlinux:

```console
xmake
```

To install the mingw package on msys2, you need to specify the mingw platform:

```console
xmake f -p mingw -a [x86_64|i386]
xmake
```

### Add clib dependency package

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

### Add dub/dlang dependency package

xmake also supports dlang's dub package manager and integrates dlang's dependent packages to use.

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

### Add dependency package of ubuntu/apt

After v2.5.4 support the use of apt to integrate dependent packages, and will also automatically find packages that have been installed on the ubuntu system.

```lua
add_requires("apt::zlib1g-dev", {alias = "zlib"})

target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib")
```

### Add gentoo/portage dependency package

After v2.5.4 support the use of Portage integrated dependency packages, and will also automatically find packages already installed on the Gentoo system.

```lua
add_requires("portage::libhandy", {alias = "libhandy"})

target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("libhandy")
```

## Using self-built private package repository

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

## Package Management Command 

The package management command `$ xmake require` can be used to manually display the download, install, uninstall, retrieve, and view package information.

### xrepo command

`xmake require` is only used for the current project. We also provide a more convenient independent `xrepo` package manager command to install, uninstall, find and manage packages globally.

For detailed documentation, see: [Getting Started with Xrepo Commands](https://xrepo.xmake.io/#/getting_started)

### Install the specified package

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
$ xmake require --extra="{debug=true,config={small=true}}" tbox
```

Install the debug package and pass the compilation configuration information of `small=true` to the package.

### Uninstall the specified package

```console
$ xmake require --uninstall tbox
```

This will completely uninstall the removal package file.

### Show package information

```console
$ xmake require --info tbox
```

### Search for packages in the current repository

```console
$ xmake require --search tbox
```

This is to support fuzzy search and lua pattern matching search:

```console
$ xmake require --search pcr
```

Will also search for pcre, pcre2 and other packages.

### List the currently installed packages

```console
$ xmake require --list
```

## Repository Management Command 

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

## Remote package download optimization

If the download package is slow or fails due to an unstable network, we can use the following methods to resolve it.

### Manual download

By default, xmake will call curl, wget and other tools to download, users can also manually download with their own downloader (you can also use an agent), put the downloaded package in their own directory, for example: `/download/packages/zlib -v1.0.tar.gz`

Then use the following command to set the search directory for package download:

```console
$ xmake g --pkg_searchdirs="/download/packages"
```

Then re-execute xmake to compile, xmake will first look for the source package from `/download/packages`, and then use it directly, no longer download it yourself.

As for the package name you are looking for, you can check it by the following command:

```console
$ xmake require --info zlib
-> searchdirs: /download/packages
-> searchnames: zlib-1.2.11.tar.gz
```

We can see the corresponding search directory and the searched package name.

### Proxy download

If manual downloading is still troublesome, we can also let xmake go directly to the agent.

```console
$ xmake g --proxy="socks5://127.0.0.1:1086"
$ xmake g --help
    -x PROXY, --proxy=PROXY Use proxy on given port. [PROTOCOL://]HOST[:PORT]
                                 e.g.
                                 -xmake g --proxy='http://host:port'
                                 -xmake g --proxy='https://host:port'
                                 -xmake g --proxy='socks5://host:port'
```

The `--proxy` parameter specifies the proxy protocol and address. The specific syntax can refer to curl. Usually, it can support http, https, socks5 and other protocols, but the actual support depends on curl, wget and git. For example, wget does not support the socks5 protocol.

We can use the following parameters to specify which hosts go to the proxy. If not set, the default is to go global.

```console
--proxy_hosts=PROXY_HOSTS Only enable proxy for the given hosts list, it will enable all if be unset,
                             and we can pass match pattern to list:
                                 e.g.
                                 -xmake g --proxy_hosts='github.com,gitlab.*,*.xmake.io'
```

If the hosts list is set, then the matching hosts in this list will go to the proxy. .

`--proxy_host` supports multiple hosts settings, separated by commas, and supports basic pattern matching *.github.com, and other lua pattern matching rules are also supported

If we feel that the above hosts mode configuration is not flexible enough, we can also follow pac's automatic proxy configuration rules:

```console
--proxy_pac=PROXY_PAC Set the auto proxy configuration file. (default: pac.lua)
                                     e.g.
                                     -xmake g --proxy_pac=pac.lua (in /Users/ruki/.xmake or absolute path)
                                     -function main(url, host)
                                           if host =='github.com' then
                                                return true
                                           end
                                       end
```

!> If there are proxy_hosts, the host configuration is preferred, otherwise, the pac configuration can be used.

The default path of pac: ~/.xmake/pac.lua, if --proxy is set, and this file exists, it will automatically go to pac. If it does not exist, and there are no hosts, then the proxy will take effect globally.

You can also manually specify the pac full path

```console
$ xmake g --proxy_pac=/xxxx/xxxxx_pac.lua
```

Configuration rule description:

```lua
function main(url, host)
    if host:find("bintray.com") then
        return true
    end
end
```

If it returns true, then the url and host are the proxy to go, not to return or return false, it is not to proxy.

For specific details of this piece, see: https://github.com/xmake-io/xmake/issues/854

#### Mirror Agent

After v2.5.4, mirroring proxy rules can also be configured in the pac.lua configuration. For example, access to all github.com domain names is switched to the hub.fastgit.org domain name to achieve accelerated downloading of packages.

```lua
function mirror(url)
      return url:gsub("github.com", "hub.fastgit.org")
end
```

```console
$ xrepo install libpng
> curl https://hub.fastgit.org/glennrp/libpng/archive/v1.6.37.zip -o v1.6.37.zip
```

## Submit packages to the official repository

### Package structure in repository

Before making our own package, we need to understand the structure of the next package repository, whether it is the official package repository or the self-built private package repository, the structure is the same:

```
xmake-repo
   - packages
     - t/tbox/xmake.lua
     - z/zlib/xmake.lua
```

Through the above structure, you can see that each package will have a xmake.lua to describe its installation rules, and according to the `z/zlib` two-level sub-category storage, convenient for quick retrieval.

### Package Description

The description rules for the package are basically done in its xmake.lua, which is similar to the xmake.lua description in the project project. The difference is that the description field only supports `package()`.

However, in the project xmake.lua, you can also directly add `package()` to the built-in package description, and even the package warehouse is saved, sometimes it will be more convenient.

First, let's take a look at zlib's description rules first. This rule can be found at [xmake-repo/z/zlib/xmake.lua](https://github.com/xmake-io/xmake-repo/blob Found under /master/packages/z/zlib/xmake.lua).

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

This package rule adds installation rules to windows, linux, macosx, iphoneos, mingw and other platforms. Basically, it has achieved full platform coverage, and even some cross-compilation platforms, which is a typical example.

Of course, some packages rely on source code implementation and are not completely cross-platform, so you only need to set the installation rules for the platforms it supports.

#### set_homepage

Set the official page address of the project where the package is located.

#### set_description

Set the package description information, generally see the relevant package information through `xmake require --info zlib`.

#### set_kind

Set the package type. For the dependent library, you don't need to set it. If it is an executable package, you need to set it to binary.

```
package("cmake")

    set_kind("binary")
    set_homepage("https://cmake.org")
    set_description("A cross-platform family of tool designed to build, test and package software")
```

#### set_urls

Set the source package or git repository address of the package. Unlike add_urls, this interface is the override setting, and add_urls is the additional setting. Other usage methods are similar. This is chosen according to different needs.

#### add_urls

Add the source package of the package or the git repository address. This interface is generally paired with add_version to set the version of each source package and the corresponding sha256 value.

!> You can add multiple urls as the mirror source, xmake will automatically detect the fastest url for download, and if the download fails, try other urls.

```lua
add_urls("https://github.com/protobuf-c/protobuf-c/releases/download/v$(version)/protobuf-c-$(version).tar.gz")
add_versions("1.3.1", "51472d3a191d6d7b425e32b612e477c06f73fe23e07f6a6a839b11808e9d2267")
```

The `$(version)` built-in variable in urls will be adapted according to the version selected during the actual installation, and the version number is selected from the list of versions specified in `add_versions`.

If there is a more complicated version string for urls and there is no direct correspondence with add_versions, you need to customize the conversion in the following way:

```lua
add_urls("https://sqlite.org/2018/sqlite-autoconf-$(version)000.tar.gz",
         {version = function (version) return version:gsub("%.", "") end})

add_versions("3.24.0", "d9d14e88c6fb6d68de9ca0d1f9797477d82fc3aed613558f87ffbdbbc5ceb74a")
add_versions("3.23.0", "b7711a1800a071674c2bf76898ae8584fc6c9643cfe933cfc1bc54361e3a6e49")
```

Of course, we can only add the git source address:

```lua
add_urls("https://gitlab.gnome.org/GNOME/libxml2.git")
```

If the source code package sha256 corresponding to multiple mirror addresses is different, we can set them separately by means of alias:

```lua
add_urls("https://ffmpeg.org/releases/ffmpeg-$(version).tar.bz2", {alias = "home"})
add_urls("https://github.com/FFmpeg/FFmpeg/archive/n$(version).zip", {alias = "github"})
add_versions("home:4.0.2", "346c51735f42c37e0712e0b3d2f6476c86ac15863e4445d9e823fe396420d056")
add_versions("github:4.0.2", "4df1ef0bf73b7148caea1270539ef7bd06607e0ea8aa2fbf1bb34062a097f026")
```

#### add_versions

Used to set the version of each source package and the corresponding sha256 value, as described in [add_urls](#add_urls)

#### add_patches

This interface is used for the source code package. Before compiling and installing, firstly set the corresponding patch package, compile it, and support multiple patches at the same time.

```lua
if is_plat("macosx") then
    add_patches("1.15", "https://raw.githubusercontent.com/Homebrew/patches/9be2793af/libiconv/patch-utf8mac.diff",
                        "e8128732f22f63b5c656659786d2cf76f1450008f36bcf541285268c66cabeab")
end
```

For example, the above code, when compiled for macosx, is marked with the corresponding patch-utf8mac.diff patch, and each patch is also set to the value of sha256 to ensure integrity.

#### add_links

By default, xmake will automatically detect the installed libraries and set the link relationship, but sometimes it is not very accurate. If you want to manually adjust the link order and the link name, you can set it through this interface.

```lua
add_links("mbedtls", "mbedx509", "mbedcrypto")
```

#### add_syslinks

Add some system library links. When some packages integrate links, you also need to rely on some system libraries to link them. This time you can attach them to the package description.

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

Add a dependent system frameworks link.

See for example: [add_syslinks](#add_syslinks)

#### add_linkdirs

The package's link library search directory can also be adjusted, but it is usually not needed, unless some libraries are not installed under prefix/lib, but in the lib subdirectory, the default search is not available.

#### add_includedirs

Add another header file search directory.

#### add_defines

Some specific definition options can be exported to the integrated package.

#### add_configs

We can add the external output configuration parameters of each package through this interface:

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

In the engineering project, we can also view a list of configurable parameters and values for a particular package:

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

Then in the project, enable these configurations and compile the package with the specific configuration:

```lua
add_requires("pcre2", {configs = {bitwidth = 16}})
```

#### add_extsources

Starting from version 2.5.2, we have also added two configuration interfaces `add_extsources` and `on_fetch`, which can better configure xmake to search for system libraries during the process of installing C/C++ packages.

As for the specific background, we can give an example. For example, we added a package of `package("libusb")` to the [xmake-repo](https://github.com/xmake-io/xmake-repo) repository .

Then users can directly integrate and use it in the following ways:

```lua
add_requires("libusb")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libusb")
```

If libusb is not installed on the user's system, xmake will automatically download the libusb library source code, automatically compile, install and integrate, and there is no problem.

But if the user installs the libusb library to the system through `apt install libusb-1.0`, then xmake should automatically search for the libusb package installed by the user in the system environment first, and use it directly, avoiding additional download, compilation and installation.

But here comes the problem, xmake internally passes `find_package("libusb")` and fails to find it. Why is that? Because the package name of libusb installed via apt is `libusb-1.0`, not libusb.

We can only find it through `pkg-config --cflags libusb-1.0`, but the default find_package logic inside xmake doesn't know the existence of `libusb-1.0`, so it can't be found.

Therefore, in order to better adapt to the search of system libraries in different system environments, we can use `add_extsources("pkgconfig::libusb-1.0")` to let xmake improve the search logic, for example:

```lua
package("libusb")
    add_extsources("pkgconfig::libusb-1.0")
    on_install(function (package)
        - ...
    end)
```

In addition, we can also use this method to improve the search for packages installed by other package managers such as homebrew/pacman, for example: `add_extsources("pacman::libusb-1.0")`.

#### on_load

This is an optional interface. If you want to be more flexible and dynamically judge various platform architectures, you can do it in this way, for example:

```lua
on_load(function (package)
    Local bitwidth = package:config("bitwidth") or "8"
    package:add("links", "pcre" .. (bitwidth ~= "8" and bitwidth or ""))
    If not package:config("shared") then
        package:add("defines", "PCRE_STATIC")
    end
end)
```

The pcre package needs to do some judgment on the bitwidth to determine the name of the link library for external output. It also needs to add some defines to the dynamic library. This time, it is more flexible when set in on_load. To find out what methods are available to `package` look [here](manual/package_interface.md).

#### on_fetch

This is an optional configuration. After 2.5.2, if the system libraries installed under different systems only have different package names, then using `add_extsources` to improve the system library search is sufficient, simple and convenient.

However, if some packages are installed in the system, the location is more complicated. To find them, some additional scripts may be needed. For example: access to the registry under windows to find packages, etc. At this time, we can use `on_fetch `Fully customized search system library logic.

Let's take libusb as an example. Instead of `add_extsources`, we can use the following method to achieve the same effect. Of course, we can do more things in it.

```lua
package("libusb")
     on_fetch("linux", function(package, opt)
         if opt.system then
             return find_package("pkgconfig::libusb-1.0")
         end
     end)
```

To find out what methods are available to `package` look [here](manual/package_interface.md).

#### on_install

This interface is mainly used to add installation scripts. The preceding string parameters are used to set up supported platforms. Other script fields like `on_load`, `on_test` are also supported.

##### Platform Filtering

The complete filtering syntax is as follows: `plat|arch1,arch2@host|arch1,arch2`

It looks very complicated, but it is very simple. Each stage is optional and can be partially omitted. Corresponding: `Compile Platform|Compile Architecture@Host Platform|Host Architecture

If you do not set any platform filtering conditions, then the default full platform support, the script inside is effective for all platforms, for example:

```lua
on_install(function (package)
    -- TODO
end)
```

If the installation script is valid for a specific platform, then directly specify the corresponding compilation platform, you can specify more than one at the same time:

```lua
on_install("linux", "macosx", function (package)
    -- TODO
end)
```

If you want to break down to the specified architecture to take effect, you can write:


```lua
on_install("linux|x86_64", "iphoneos|arm64", function (package)
    -- TODO
end)
```

If you want to limit the execution of the host environment platform and architecture, you can append `@host|arch` to the end, for example:

```lua
on_install("mingw@windows", function (package)
    -- TODO
end)
```

This means that only the mingw platform is valid for Windows.

We can also specify the host platform and architecture without specifying a platform and architecture. This is usually used to describe some dependencies related to the build tool and can only be run in the host environment.

For example, the package we compiled depends on cmake, we need to add the package description of cmake, then the compiler installation environment can only be the host platform:

```lua
on_install("@windows", "@linux", "@macosx", function (package)
    -- TODO
end)
```

Some other examples:

```lua
-- `@linux`
-- `@linux|x86_64`
-- `@macosx,linux`
-- `android@macosx, linux`
-- `android|armeabi-v7a@macosx,linux`
-- `android|armeabi-v7a@macosx,linux|x86_64`
-- `android|armeabi-v7a@linux|x86_64`
```

##### Compilation Tools

We have built-in scripts for installing common build tools for convenient build support for different source code-dependent build toolchains, such as autoconf, cmake, meson, etc.

###### xmake

If it is a xmake-based dependency package, then the integration is very simple, xmake has very good built-in integration support, you can directly support it for cross-platform compilation, generally only need to:

```lua
on_install(function (package)
    import("package.tools.xmake").install(package)
end)
```

If you want to pass some unique build configuration parameters:

```lua
on_install(function (package)
    import("package.tools.xmake").install(package, {"--xxx=y"})
end)
```

###### cmake

If it is a cmake-based package, the integration is also very short-answered. Usually you only need to set some configuration parameters, but you need to add the cmake dependency first:

```lua
add_deps("cmake")
on_install(function (package)
    import("package.tools.cmake").install(package, {"-Dxxx=ON"})
end)
```

###### autoconf

If it is based on autoconf package, the integration method is similar to cmake, but the configuration parameters are different. However, under normal circumstances, the Unix system has built-in autoconf series tools, so it is fine without any dependencies.

```lua
on_install(function (package)
    import("package.tools.autoconf").install(package, {"--enable-shared=no"})
end)
```

However, some source packages may not be fully satisfied with the system's built-in autoconf, so you can add autoconf family dependencies and build them:

```lua
add_deps("autoconf", "automake", "libtool", "pkg-config")
on_install(function (package)
    import("package.tools.autoconf").install(package, {"--enable-shared=no"})
end)
```

###### meson

If it is meson, you need to add ninja's dependencies to perform the build.

```lua
add_deps("meson", "ninja")
on_install(function (package)
    import("package.tools.meson").install(package, {"-Dxxx=ON"})
end)
```

###### gn

If it is a GN project, you can build and install it using the following methods. Make sure to also add ninja as a dependency.

```lua
add_deps("gn", "ninja")
on_install(function (package)
    import("package.tools.gn").install(package)
end)
```

###### make

You can also build and install projects using makefiles.

```lua
add_deps("make")
on_install(function (package)
    import("package.tools.make").install(package)
end)
```

###### msbuild

If the package uses Visual Studio projects you can build them using msbuild.

```lua
on_install(function (package)
    import("package.tools.msbuild").build(package)
    -- you then have to copy the built binaries manually
end)
```

###### ninja

You can also build and install packages with ninja.

```lua
add_deps("ninja")
on_install(function (package)
    import("package.tools.ninja").install(package)
end)
```

###### nmake

You can build and install packages with nmake

```lua
on_install(function (package)
    import("package.tools.nmake").install(package)
end)
```

###### scons

You can build packages using scons.

```lua
add_deps("scons")
on_install(function (package)
    import("package.tools.scons").build(package)
    -- you then need to manually copy the built binaries
end)
```

#### on_test

After installation, you need to set the corresponding test script, perform some tests to ensure the reliability of the installation package, if the test does not pass, the entire installation package will be revoked.

```lua
on_test(function (package)
    assert(package:has_cfuncs("inflate", {includes = "zlib.h"}))
end)
```

The above script calls the built-in `has_cfuncs` interface to detect whether the zlib.h header file exists in the installed package, and whether the interface function `inflate` exists in the library and header files.

Xmake will try to compile the link for testing, `has_cfuncs` for detecting c functions, and `has_cxxfuncs` for detecting c++ library functions.

And include multiple header files in include, for example: `includes = {"xxx.h", "yyy.h"}`

We can also pass some of our own compilation parameters into the detection, for example:

```lua
on_test(function (package)
    assert(package:has_cxxfuncs("func1", {includes = "xxx.h", configs = {defines = "c++14", cxflags = "-Dxxx"}}))
end)
```

We can also detect a code snippet with `check_csnippets` and `check_cxxsnippets`:

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

if it is an executable package, it can also be detected by trying to run:

```lua
on_test(function (package)
    os.run("xxx --help")
end)
```

if the run fails, the test will not pass.

### Extended configuration parameters

See: [add_configs](#add_configs) for details.

### Built-in configuration parameters

In addition to setting some extended configuration parameters via [add_configs](#add_configs), xmake also provides some built-in configuration parameters that can be used.

#### Enable debug package

```lua
add_requires("xxx", {debug = true})
```

There must be relevant processing in the package description to support:

```lua
on_install(function (package)
    Local configs = {}
    if package:debug() then
        Table.insert(configs, "--enable-debug")
    end
    import("package.tools.autoconf").install(package)
end)
```

#### Setting up the msvc runtime library

```lua
add_requires("xxx", {configs = {vs_runtime = "MT"}})
```

Normally, packages installed by built-in tool scripts such as `import("package.tools.autoconf").install` are automatically processed internally by vs_runtime.

But if it is a special source package, the build rules are special, then you need to handle it yourself:

```lua
on_install(function (package)
    io.gsub("build/Makefile.win32.common", "%-MD", "-" .. package:config("vs_runtime"))
end)
```

### Adding environment variables

For some libraries, there are also executable tools. if you need to use these tools in the integration package, you can also set the corresponding PATH environment variable:

```lua
package("luajit")
    on_load(function (package)
        if is_plat("windows") then
            Package:addenv("PATH", "lib")
        end
        Package:addenv("PATH", "bin")
    end)
```

In the project project, the corresponding environment variables will only take effect after the corresponding package is integrated by `add_packages`.

```lua
add_requires("luajit")
target("test")
    set_kind("binary")
    add_packages("luajit")
    after_run(function (package)
        os.exec("luajit --version")
    end)
```

### Installing binary packages

Xmake also supports direct reference to the binary version package, which is used directly for installation, for example:

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

### Local test

If you have added and created a new package in the local xmake-repo repository, you can run the test locally and pass it. If the test passes, you can submit the pr to the official repository and request the merge.

We can execute the following script to test the specified package:

```bash
cd xmake-repo
xmake l scripts/test.lua -v -D zlib
```

The above command will force the download and installation of the zlib package to test whether the entire installation process is ok, plus `-v -D` is to see the complete detailed log information and error information, which is convenient for debugging analysis.

If the network environment is not good, do not want to re-download all dependencies every time, you can add the `--shallow` parameter to execute, this parameter tells the script, just re-decompress the local cached zlib source package, re-execute the installation command, but Will not download various dependencies.

```bash
cd xmake-repo
xmake l scripts/test.lua -v -D --shallow zlib
```

If we want to test the package rules of other platforms, such as: android, iphoneos and other platforms, you can specify by `-p/--plat` or `-a/--arch`.

```bash
cd xmake-repo
xmake l scripts/test.lua -v -D --shallow -p iphoneos -a arm64 zlib
xmake l scripts/test.lua -v -D --shallow -p android --ndk=/xxxx zlib
```

## Submit package to the official repository

If you need a package that is not supported by the current official repository, you can commit it to the official repository after local tuning: [xmake-repo](https://github.com/xmake-io/xmake-repo)

For detailed contribution descriptions, see: [CONTRIBUTING.md](https://github.com/xmake-io/xmake-repo/blob/master/CONTRIBUTING.md)

For how to make your own package, you can look at the above: [Adding packages to the official repository](#Adding-packages-to-the-official-repository).

## Automatically pull remote toolchain

Starting from version 2.5.2, we can pull the specified toolchain to integrate the compilation project, and we also support switching the dependent package to the corresponding remote toolchain to participate in the compilation and integration.

For related example codes, see: [Toolchain/Packages Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/package)

Related issue [#1217](https://github.com/xmake-io/xmake/issues/1217)

### Pull the specified version of the llvm toolchain

We use clang in llvm-10 to compile the project.

```lua
add_requires("llvm 10.x", {alias = "llvm-10"})
target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("llvm@llvm-10")
````

### Pull cross compilation tool chain

We can also pull the specified cross-compilation tool chain to compile the project.

```lua
add_requires("muslcc")
target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("@muslcc")
```

### Pull the toolchain and integrate the dependency packages compiled by the corresponding toolchain

We can also use the specified muslcc cross-compilation tool chain to compile and integrate all dependent packages.

```lua
add_requires("muslcc")
add_requires("zlib", "libogg", {system = false})

set_toolchains("@muslcc")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "libogg")
```

For a complete example, see: [Examples (muslcc)](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/toolchain_muslcc/xmake.lua)

### Pull zig toolchain

```lua
add_rules("mode.debug", "mode.release")
add_requires("zig 0.7.x")

target("test")
    set_kind("binary")
    add_files("src/*.zig")
    set_toolchains("@zig")
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

```console
$ xmake require --upgrade
upgrading packages ..
  zlib: 1.2.10 -> 1.2.11
1 package is upgraded!
```
