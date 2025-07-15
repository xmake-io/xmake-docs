---
title: xmake v2.5.4 Released, Support apt/portage package manager and improve xrepo shell
tags: [xmake, lua, C/C++, apt, portage, shell, package]
date: 2021-05-15
author: Ruki
---
### New package manager support

#### Add dependency package of ubuntu/apt

Now we support the use of apt to integrate dependent packages, and will also automatically find packages that have been installed on the ubuntu system.

```lua
add_requires("apt::zlib1g-dev", {alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

#### Add gentoo/portage dependency package

We also support the use of Portage to integrate dependency packages, and will automatically find packages already installed on the Gentoo system.

```lua
add_requires("portage::libhandy", {alias = "libhandy"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libhandy")
```










#### Integrate arm/arm64 architecture package from Vcpkg

```lua
add_requires("vcpkg::zlib", {alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

The configuration method is still the same as before. You only need to switch to the arm/arm64 architecture to compile to automatically pull the arm/arm64 package from Vcpkg.

```console
$ xmake f -a arm64
$ xmake
```

#### Support import and export installation packages

Usually, after we use the xrepo command or xmake to install the package, if the same project is migrated to other machines for compilation, then the installation package must be downloaded again.

In order to improve development efficiency, xrepo can now quickly export installed packages, including corresponding library files, header files, and so on.

```console
$ xrepo export -o /tmp/output zlib
```

Then we can also import the previously exported installation package on other machines to implement package migration.

```console
$ xrepo import -i /xxx/packagedir zlib
```

After importing, the corresponding project compilation will use them directly, no additional reinstallation of packages is required.

#### Specific package shell environment support

xrepo has a `xrepo env` command, which can specify the environment to load a specific package, and then run a specific program, for example, load the installation environment of the luajit package, and then run luajit:

```console
$ xrepo env luajit
```

Or bind a specific luajit version package environment, after loading bash, you can directly run the corresponding lujit.
```console
$ xrepo env -b "luajit 5.1" bash
> luajit --version
```

However, there is a problem with this. If we install a lot of packages, different package configurations and versions are still different. If we want to load a bash environment with multiple packages at the same time.

Then, the previous method cannot be supported. Therefore, in the new version, we will further improve it. Yes, we can customize some package configurations by adding the xmake.lua file in the current directory, and then enter the specific package shell environment .

xmake.lua

```lua
add_requires("zlib 1.2.11")
add_requires("python 3.x", "luajit")
```

For example, as above, we have configured three packages in xmake.lua and want to use them in the shell at the same time, then just run the following command in the current directory.

```console
$ xrepo env shell
> python --version
> luajit --version
```

It should be noted that here we used `xrepo env shell` instead of `xrepo env bash`, because bash can only be used on specific platforms, and `xrepo env shell` is a built-in command.

It can automatically detect the current terminal environment, load the corresponding bash, sh, zsh, and cmd or powershell environments under windows, all of which are automatic.

In addition, we also added some auxiliary features, such as prompt prompt, `xrepo env quit` environment exit command, historical input command switching and so on.

#### Set up image acceleration package download

In order to improve the problem of slow downloading of packages in the domestic network environment, xmake supports proxy settings, as well as pac.lua proxy configuration strategies.

In the new version, we have improved the configuration of pac.lua and further support the configuration of mirror proxy rules. For example, access to all github.com domain names is switched to the hub.fastgit.org domain name to achieve accelerated downloading of packages.

pac.lua configuration:

```lua
function mirror(url)
     return url:gsub("github.com", "hub.fastgit.org")
end
```

Then we set the second pac.lua file, the default path is `~/.xmake/pac.lua`.

```console
$ xmake g --proxy_pac=/tmp/pac.lua
```

Then, when we install the package, if we encounter the package source under the github.com domain name, it will automatically switch to the fastgit mirror to accelerate the download when downloading.

```console
$ xrepo install libpng
> curl https://hub.fastgit.org/glennrp/libpng/archive/v1.6.37.zip -o v1.6.37.zip
```

#### Custom switch package storage directory

Before, we could only configure and modify the default package installation directory through `xmake g --pkg_installdir=/tmp/xx`.

Now, we can also modify it through the `XMAKE_PKG_INSTALLDIR` environment variable. The default path is: `~/.xmake/packages`.

In addition, we also added the `XMAKE_PKG_CACHEDIR` environment variable to modify the package cache directory. The default path is: `~/.xmake/cache/packages`.


## Changelog

### New features

* [#1323](https://github.com/xmake-io/xmake/issues/1323): Support find and install package from `apt`, `add_requires("apt::zlib1g-dev")`
* [#1337](https://github.com/xmake-io/xmake/issues/1337): Add environment vars to change package directories
* [#1338](https://github.com/xmake-io/xmake/issues/1338): Support import and export installed packages
* [#1087](https://github.com/xmake-io/xmake/issues/1087): Add `xrepo env shell` and support load envs from `add_requires/xmake.lua`
* [#1313](https://github.com/xmake-io/xmake/issues/1313): Support private package for `add_requires/add_deps`
* [#1358](https://github.com/xmake-io/xmake/issues/1358): Support to set mirror url to speedup download package
* [#1369](https://github.com/xmake-io/xmake/pull/1369): Support arm/arm64 packages for vcpkg, thanks @fallending
* [#1405](https://github.com/xmake-io/xmake/pull/1405): Add portage package manager support, thanks @Phate6660

### Change

* Improve `find_package` and add `package:find_package` for xmake package
* Remove deprecated `set_config_h` and `set_config_h_prefix` apis
* [#1343](https://github.com/xmake-io/xmake/issues/1343): Improve to search local package files
* [#1347](https://github.com/xmake-io/xmake/issues/1347): Improve to vs_runtime configs for binary package
* [#1353](https://github.com/xmake-io/xmake/issues/1353): Improve del_files() to speedup matching files
* [#1349](https://github.com/xmake-io/xmake/issues/1349): Improve `xrepo env shell` to support powershell

### Bugs fixed

* [#1380](https://github.com/xmake-io/xmake/issues/1380): Fix add packages errors
* [#1381](https://github.com/xmake-io/xmake/issues/1381): Fix add local git source for package
* [#1391](https://github.com/xmake-io/xmake/issues/1391): Fix cuda/nvcc toolchain
