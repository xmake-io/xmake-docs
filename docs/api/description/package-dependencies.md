# Package Dependencies

## package

- Define package configuration

#### Function Prototype

```lua
package(name: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Package name string |

#### Usage

The repository depends on the package definition description, the `package()` related interface definition, etc. There will be time to elaborate, so stay tuned. .

Please refer to the existing package description in the official repository: [xmake-repo](https://github.com/xmake-io/xmake-repo)

Here is a more representative example for reference:

```lua
package("libxml2")

    set_homepage("http://xmlsoft.org/")
    set_description("The XML C parser and toolkit of Gnome.")

    set_urls("https://github.com/GNOME/libxml2/archive/$(version).zip", {excludes = {"*/result/*", "*/test/*"}})

    add_versions("v2.9.8", "c87793e45e66a7aa19200f861873f75195065de786a21c1b469bdb7bfc1230fb")
    add_versions("v2.9.7", "31dd4c0e10fa625b47e27fd6a5295d246c883f214da947b9a4a9e13733905ed9")

    if is_plat("macosx", "linux") then
        add_deps("autoconf", "automake", "libtool", "pkg-config")
    end

    on_load(function (package)
        package:add("includedirs", "include/libxml2")
        package:add("links", "xml2")
    end)

    if is_plat("windows") and winos.version():gt("winxp") then
        on_install("windows", function (package)
            os.cd("win32")
            os.vrun("cscript configure.js iso8859x=yes iconv=no compiler=msvc cruntime=/MT debug=%s prefix=\"%s\"", package:debug() and "yes" or "no", Package:installdir())
            os.vrun("nmake /f Makefile.msvc")
            os.vrun("nmake /f Makefile.msvc install")
        end)
    end

    on_install("macosx", "linux", function (package)
        import("package.tools.autoconf").install(package, {"--disable-dependency-tracking", "--without-python", "--without-lzma"})
    end)
```

## set_homepage

- Set package homepage

#### Function Prototype

```lua
set_homepage(url: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| url | Package homepage URL string |

#### Usage

Set the official page address of the project where the package is located.

## set_description

- Set package description

#### Function Prototype

```lua
set_description(description: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| description | Package description string |

#### Usage

Set the package description information, generally see the relevant package information through `xmake require --info zlib`.

## set_kind

- Set package kind

#### Function Prototype

```lua
set_kind(kind: <string>, {
    headeronly = <boolean>
})
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| kind | Package type: "library", "binary", "toolchain" |
| headeronly | For library type, whether it's header-only library |

#### Usage

Used to set the package type. xmake packages currently support the following types:

### library

This is the default package type and usually does not need to be explicitly configured. Used for regular library packages, including static and dynamic libraries.

```lua
package("zlib")
    -- library type, no need to set explicitly
    set_homepage("http://www.zlib.net")
    set_description("A Massively Spiffy Yet Delicately Unobtrusive Compression Library")
```

For header-only libraries (libraries that contain only header files), explicit configuration is required:

```lua
package("fmt")
    set_kind("library", {headeronly = true})
    set_homepage("https://fmt.dev")
    set_description("A modern formatting library")
```

### binary

Used for executable program packages. These packages provide executable files after installation and generally run on the current compilation host system.

```lua
package("cmake")
    set_kind("binary")
    set_homepage("https://cmake.org")
    set_description("A cross-platform family of tool designed to build, test and package software")
```

### toolchain

Used for complete compilation toolchain packages. These packages contain complete compilation toolchains (such as compilers, linkers, etc.) and can be used with `set_toolchains` + `add_requires` to achieve automatic toolchain download and binding.

```lua
package("llvm")
    set_kind("toolchain")
    set_homepage("https://llvm.org/")
    set_description("The LLVM Compiler Infrastructure")
```

Example of using a toolchain package:

```lua
add_rules("mode.debug", "mode.release")
add_requires("llvm 14.0.0", {alias = "llvm-14"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("llvm@llvm-14")
```

## set_urls

- Set package urls

#### Function Prototype

```lua
set_urls(urls: <string|array>, ..., {
    excludes = <array>,
    version = <function>,
    http_headers = <array>
})
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| urls | Package source URL string or array |
| ... | Variable parameters, can pass multiple URLs |
| excludes | Files to exclude from extraction |
| version | Version transformation function |
| http_headers | HTTP headers for download |

#### Usage

Set the source package or git repository address of the package. Unlike add_urls, this interface is the override setting, and add_urls is the additional setting. Other usage methods are similar. This is chosen according to different needs.

## add_urls

- Add package urls

#### Function Prototype

```lua
add_urls(urls: <string|array>, ..., {
    alias = <string>,
    excludes = <array>,
    version = <function>,
    http_headers = <array>
})
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| urls | Package source URL string or array |
| ... | Variable parameters, can pass multiple URLs |
| alias | URL alias for different sources |
| excludes | Files to exclude from extraction |
| version | Version transformation function |
| http_headers | HTTP headers for download |

#### Usage

Add the source package of the package or the git repository address. This interface is generally paired with add_version to set the version of each source package and the corresponding sha256 value.

::: tip NOTE
You can add multiple urls as the mirror source, xmake will automatically detect the fastest url for download, and if the download fails, try other urls.
:::

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

We can also set the http headers for the specified urls:

```lua
add_urls("https://github.com/madler/zlib/archive/$(version).tar.gz", {
    http_headers = {"TEST1: foo", "TEST2: bar"}
})
```

## add_versions

- Add package versions

#### Function Prototype

```lua
add_versions(version: <string>, hash: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| version | Package version string |
| hash | SHA256 hash value for verification |

#### Usage

Used to set the version of each source package and the corresponding sha256 value, as described in [add_urls](#add_urls)

## add_versionfiles

- Adding a list of package versions

#### Function Prototype

```lua
add_versionfiles(file: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| file | Version file path containing version and hash pairs |

#### Usage

Normally we can add package versions through the `add_versions` interface, but if there are more and more versions, the package configuration will be too bloated, at this time, we can use the `add_versionfiles` interface to store a list of all the versions in a separate file to maintain.

For example:

```lua
package("libcurl")
    add_versionfiles("versions.txt")
```

```sh
8.5.0 ce4b6a6655431147624aaf582632a36fe1ade262d5fab385c60f78942dd8d87b
8.4.0 e5250581a9c032b1b6ed3cf2f9c114c811fc41881069e9892d115cc73f9e88c6
8.0.1 9b6b1e96b748d04b968786b6bdf407aa5c75ab53a3d37c1c8c81cdb736555ccf
7.87.0 5d6e128761b7110946d1276aff6f0f266f2b726f5e619f7e0a057a474155f307
7.31.0 a73b118eececff5de25111f35d1d0aafe1e71afdbb83082a8e44d847267e3e08
...
```

## add_patches

- Add package patches

#### Function Prototype

```lua
add_patches(version: <string>, url: <string>, hash: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| version | Package version for which patch applies |
| url | Patch file URL |
| hash | SHA256 hash value for patch verification |

#### Usage

This interface is used for the source code package. Before compiling and installing, firstly set the corresponding patch package, compile it, and support multiple patches at the same time.

```lua
if is_plat("macosx") then
    add_patches("1.15", "https://raw.githubusercontent.com/Homebrew/patches/9be2793af/libiconv/patch-utf8mac.diff",
                        "e8128732f22f63b5c656659786d2cf76f1450008f36bcf541285268c66cabeab")
end
```

For example, the above code, when compiled for macosx, is marked with the corresponding patch-utf8mac.diff patch, and each patch is also set to the value of sha256 to ensure integrity.

## add_links

- Add package links

#### Function Prototype

```lua
add_links(links: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| links | Library link name string or array |
| ... | Variable parameters, can pass multiple link names |

#### Usage

By default, xmake will automatically detect the installed libraries and set the link relationship, but sometimes it is not very accurate. If you want to manually adjust the link order and the link name, you can set it through this interface.

```lua
add_links("mbedtls", "mbedx509", "mbedcrypto")
```

## add_syslinks

- Add system library links

#### Function Prototype

```lua
add_syslinks(syslinks: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| syslinks | System library name string or array |
| ... | Variable parameters, can pass multiple system library names |

#### Usage

Add some system library links. When some packages integrate links, you also need to rely on some system libraries to link them. This time you can attach them to the package description.

```lua
if is_plat("macosx") then
    add_frameworks("CoreGraphics", "CoreFoundation", "Foundation")
elseif is_plat("windows") then
    add_defines("CAIRO_WIN32_STATIC_BUILD=1")
    add_syslinks("gdi32", "msimg32", "user32")
else
    add_syslinks("pthread")
end
```

## add_linkorders

- Adjust the link order within the package

#### Function Prototype

```lua
add_linkorders(orders: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| orders | Link order string or array |
| ... | Variable parameters, can pass multiple order specifications |

#### Usage

For specific details, please see the target's internal documentation for `add_linkorders`, [target:add_linkorders](/api/description/project-target#add-linkorders).

```lua
package("libpng")
     add_linkorders("png16", "png", "linkgroup::foo")
     add_linkgroups("dl", {name = "foo", group = true})
```

## add_linkgroups

- Configure the link group of the package

#### Function Prototype

```lua
add_linkgroups(groups: <string|array>, ..., {
    name = <string>,
    group = <boolean>
})
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| groups | Link group name string or array |
| ... | Variable parameters, can pass multiple group names |
| name | Group name for linking |
| group | Whether to treat as a group |

#### Usage

For specific details, please see the target's internal documentation for `add_linkgroups`, [target:add_linkgroups](/api/description/project-target#add-linkgroups).

```lua
package("libpng")
     add_linkorders("png16", "png", "linkgroup::foo")
     add_linkgroups("dl", {name = "foo", group = true})
```

## add_frameworks

- Add frameworks

#### Function Prototype

```lua
add_frameworks(frameworks: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| frameworks | Framework name string or array |
| ... | Variable parameters, can pass multiple framework names |

#### Usage

Add a dependent system frameworks link.

See for example: [add_syslinks](#add_syslinks)

## add_linkdirs

- Add link directories

#### Function Prototype

```lua
add_linkdirs(dirs: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| dirs | Link directory path string or array |
| ... | Variable parameters, can pass multiple directory paths |

#### Usage

The package's link library search directory can also be adjusted, but it is usually not needed, unless some libraries are not installed under prefix/lib, but in the lib subdirectory, the default search is not available.

## add_includedirs

- Add include directories

#### Function Prototype

```lua
add_includedirs(dirs: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| dirs | Include directory path string or array |
| ... | Variable parameters, can pass multiple directory paths |

#### Usage

Add another header file search directory.

## add_bindirs

- Add executable file directory

#### Function Prototype

```lua
add_bindirs(dirs: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| dirs | Executable directory path string or array |
| ... | Variable parameters, can pass multiple directory paths |

#### Usage

By default, if `set_kind("binary")` or `set_kind("toolchain")` is configured as an executable package.

Then, it will use the bin directory as an executable directory by default and automatically add it to the PATH environment variable.

If you want to open some of the compiled executable tools in the library package to users, you need to configure `package:addenv("PATH", "bin")` in the package.

If you use this interface to configure `add_bindirs("bin")`, bin will be automatically added to PATH, and you no longer need to configure PATH separately. In addition, this also provides a way to modify the executable directory.

## add_defines

- Add definition

#### Function Prototype

```lua
add_defines(defines: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| defines | Macro definition string or array |
| ... | Variable parameters, can pass multiple definitions |

#### Usage

Some specific definition options can be exported to the integrated package.

## add_configs

- Add package configs

#### Function Prototype

```lua
add_configs(name: <string>, {
    description = <string>,
    default = <string|boolean|number>,
    values = <array>,
    type = <string>
})
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Configuration parameter name |
| description | Configuration description string |
| default | Default value for the configuration |
| values | Allowed values array |
| type | Configuration type: "string", "boolean", "number" |

#### Usage

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

```sh
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

## add_extsources

- Add external package sources

#### Function Prototype

```lua
add_extsources(sources: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| sources | External source string or array, format: "pkgconfig::name" or "brew::name" |
| ... | Variable parameters, can pass multiple external sources |

#### Usage

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

## add_deps

- Add package dependencies

#### Function Prototype

```lua
add_deps(deps: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| deps | Dependency package name string or array |
| ... | Variable parameters, can pass multiple dependency names |

#### Usage

This interface allows us to automatically install all dependencies of a package when we install it by configuring the dependencies between packages.

Also, by default, cmake/autoconf will automatically find the libraries and headers of all dependent packages as soon as we have configured the dependencies.

Of course, if for some special reason the cmake script for the current package does not find the dependencies properly, then we can also force the dependencies to be typed in with `{packagedeps = "xxx"}`.

Example.

```lua
package("foo")
    add_deps("cmake", "bar")
    on_install(function (package)
        local configs = {}
        import("package.tools.cmake").install(package, configs)
    end)
```

The foo package is maintained using CMakeLists.txt and it relies on the bar package during installation, so xmake will install bar first and have cmake.install automatically find the bar installed library when it calls cmake.

However, if foo's CMakeLists.txt still does not automatically find bar, then we can change it to the following configuration to force bar's includedirs/links etc. to be passed into foo by way of flags.

```lua
package("foo")
    add_deps("cmake", "bar")
    on_install(function (package)
        local configs = {}
        import("package.tools.cmake").install(package, configs, {packagedeps = "bar"})
    end)
```

## add_components

- Add package components

#### Function Prototype

```lua
add_components(components: <string|array>, ..., {
    deps = <array>
})
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| components | Component name string or array |
| ... | Variable parameters, can pass multiple component names |
| deps | Component dependencies array |

#### Usage

This is a new interface added in 2.7.3 to support componentized configuration of packages, see: [#2636](https://github.com/xmake-io/xmake/issues/2636) for details.

With this interface we can configure the list of components that are actually available for the current package.

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")
```

On the user side, we can use package specific components in the following way.

```lua
add_requires("sfml")

target("test")
    add_packages("sfml", {components = "graphics")
```

::: tip NOTE
In addition to configuring the list of available components, we also need to configure each component in detail for it to work properly, so it is usually used in conjunction with the `on_component` interface.
:::

A full example of the configuration and use of package components can be found at: [components example](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/components/xmake.lua)

## set_base

- Inherit package configuration

#### Function Prototype

```lua
set_base(package: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| package | Base package name to inherit from |

#### Usage

This is a newly added interface in 2.6.4, through which we can inherit all the configuration of an existing package, and then rewrite some of the configuration on this basis.

This is usually in the user's own project, it is more useful to modify the built-in package of the xmake-repo official repository, such as: repairing and changing urls, modifying the version list, installation logic, etc.

For example, modify the url of the built-in zlib package to switch to your own zlib source address.

```lua
package("myzlib")
     set_base("zlib")
     set_urls("https://github.com/madler/zlib.git")
package_end()

add_requires("myzlib", {system = false, alias = "zlib"})

target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib")
```

We can also use it to simply add an alias package.

```lua
package("onetbb")
     set_base("tbb")
```

We can install the tbb package through `add_requires("onetbb")` integration, but the package name is different.

## on_load

- Load package configuration

#### Function Prototype

```lua
on_load(script: <function (package)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Package load script function with package parameter |

#### Usage

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

The pcre package needs to do some judgment on the bitwidth to determine the name of the link library for external output.
It also needs to add some defines to the dynamic library. This time, it is more flexible when set in on_load.
To find out what methods are available to `package` look [here](/api/scripts/package-instance).

## on_fetch

- Fetch package libraries

#### Function Prototype

```lua
on_fetch(platforms: <string|array>, ..., script: <function (package, opt)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| platforms | Platform filter string or array, optional |
| ... | Variable parameters, can pass multiple platform filters |
| script | Fetch script function with package and opt parameters |

#### Usage

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

To find out what methods are available to `package` look [here](/api/scripts/package-instance).

## on_check

- Check whether the package supports the current platform

#### Function Prototype

```lua
on_check(platforms: <string|array>, ..., script: <function (package)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| platforms | Platform filter string or array, optional |
| ... | Variable parameters, can pass multiple platform filters |
| script | Check script function with package parameter |

#### Usage

Sometimes, simply using `on_install("windows", "android", function () end)` cannot properly limit the package's support for the current platform.

For example, it is also compiled using msvc on windows, but it only supports using the vs2022 tool chain. Then we cannot simply restrict the installation of packages by disabling the windows platform.

Because each user's compilation tool chain environment may be different. At this time, we can configure `on_check` to do more detailed detection to determine whether the package supports the current tool chain environment.

If the package is not supported, it will prompt the user earlier before the package is downloaded and installed. It can also avoid some unsupported ci job tests on the ci of xmake-repo.

For example, the following configuration can determine whether the current msvc provides the corresponding vs sdk version. If the version is not satisfied, the package cannot be compiled and installed, and the user will see a more readable unsupported error message.

```lua
package("test")
     on_check("windows", function (package)
         import("core.tool.toolchain")
         import("core.base.semver")
         local msvc = toolchain.load("msvc", {plat = package:plat(), arch = package:arch()})
         if msvc then
             local vs_sdkver = msvc:config("vs_sdkver")
             assert(vs_sdkver and semver.match(vs_sdkver):gt("10.0.19041"), "package(cglm): need vs_sdkver > 10.0.19041.0")
         end
     end)
```

For example, we can also use it to determine the current compiler's support for c++20, if it does not support std::input_iterator, which is only available in c++20. Then there is no need to continue downloading, compiling and installing this package.

Users will see a `Require at least C++20.` error to prompt them to upgrade their compiler.

```lua
package("test")
     on_check(function (package)
         assert(package:check_cxxsnippets({test = [[
             #include <cstddef>
             #include <iterator>
             struct SimpleInputIterator {
                 using difference_type = std::ptrdiff_t;
                 using value_type = int;
                 int operator*() const;
                 SimpleInputIterator& operator++();
                 void operator++(int) { ++*this; }
             };
             static_assert(std::input_iterator<SimpleInputIterator>);
         ]]}, {configs = {languages = "c++20"}}), "Require at least C++20.")
     end)
```

## on_install

- Installation package

#### Function Prototype

```lua
on_install(platforms: <string|array>, ..., script: <function (package)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| platforms | Platform filter string or array, optional |
| ... | Variable parameters, can pass multiple platform filters |
| script | Install script function with package parameter |

#### Usage

This interface is mainly used to add installation scripts. The previous string parameters are used to set supported platforms. Other script fields such as `on_load`, `on_test` are also supported.

### Platform filtering

The complete filtering syntax is as follows: `plat|arch1,arch2@host|arch1,arch2`

It looks very complicated, but it is actually very simple. Each stage is optional and can be partially omitted, corresponding to: `Compilation platform|Compilation architecture@Host platform|Host architecture`

If you do not set any platform filter conditions, all platforms will be supported by default, and the scripts inside will take effect on all platforms, for example:

```lua
on_install(function (package)
     -- TODO
end)
```

If the installation script is effective for a specific platform, then directly specify the corresponding compilation platform. You can specify multiple ones at the same time:

```lua
on_install("linux", "macosx", function (package)
     -- TODO
end)
```

If you need to subdivide it into a specific architecture to take effect, you can write like this:


```lua
on_install("linux|x86_64", "iphoneos|arm64", function (package)
     -- TODO
end)
```

If you also want to limit the execution host environment platform and architecture, you can append `@host|arch` behind, for example:

```lua
on_install("mingw@windows", function (package)
     -- TODO
end)
```

This means that it only takes effect when compiling the mingw platform under windows.

We can also not specify which platform and architecture, but only set the host platform and architecture. This is usually used to describe some dependency packages related to compilation tools, which can only be run in the host environment.

For example, the package we compile depends on cmake and needs to add the cmake package description. Then the compilation and installation environment can only be the host platform:

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
-- `android@macosx,linux`
-- `android|armeabi-v7a@macosx,linux`
-- `android|armeabi-v7a@macosx,linux|x86_64`
-- `android|armeabi-v7a@linux|x86_64`
```

In 2.8.7, we have improved pattern matching support and added the ability to exclude specific platforms and architectures, such as:

```
!plat|!arch@!subhost|!subarch
```

```lua
@!linux
@!linux|x86_64
@!macosx,!linux
!android@macosx,!linux
android|!armeabi-v7a@macosx,!linux
android|armeabi-v7a,!iphoneos@macosx,!linux|x86_64
!android|armeabi-v7a@!linux|!x86_64
!linux|*
```

At the same time, a built-in `native` architecture is also provided to match the local architecture of the current platform, mainly used to specify or exclude cross-compilation platforms.

```lua
on_install("macosx|native", ...)
```

The above configuration, if used on a macOS x86_64 device, will only match the local architecture compilation of `xmake f -a x86_64`.

If it is cross-compiled with `xmake f -a arm64`, it will not be matched.

In the same way, if you only want to match cross-compilation, you can use `macosx|!native` to negate and exclude.

In version 2.9.1, we have continued to improve it and added support for conditional logic judgments:

For example:

```lua
on_install("!wasm|!arm* and !cross|!arm*", function (package)
end)
```

To describe the arm architecture excluding the wasm and cross platforms.

Moreover, it also supports nested logic described by `()`, `a and b or (a and (c or d))`.

### Compilation tools

We have built-in scripts for installing common compilation tools to provide convenient architecture support for build tool chains with different source code dependencies, such as: autoconf, cmake, meson, etc.

### xmake

If it is a dependency package based on xmake, it is very simple to integrate it. xmake has very good built-in integration support for it, and can directly support cross-platform compilation. Generally, you only need:

```lua
on_install(function (package)
     import("package.tools.xmake").install(package)
end)
```

If you want to pass some unique compilation configuration parameters:

```lua
on_install(function (package)
     import("package.tools.xmake").install(package, {"--xxx=y"})
end)
```

### cmake

If it is a package based on cmake, it is very simple to integrate. Usually you only need to set some configuration parameters, but you also need to add the cmake dependency first:

```lua
add_deps("cmake")
on_install(function (package)
     import("package.tools.cmake").install(package, {"-Dxxx=ON"})
end)
```

### autoconf

If it is an autoconf-based package, the integration method is similar to cmake, except that the configuration parameters passed are different. However, usually, Unix systems have built-in autoconf series tools, so it is fine without adding related dependencies.

```lua
on_install(function (package)
     import("package.tools.autoconf").install(package, {"--enable-shared=no"})
end)
```

However, some source code packages may not be fully satisfied by the system's built-in autoconf, so you can add the autoconf series dependencies to build them:

```lua
add_deps("autoconf", "automake", "libtool", "pkg-config")
on_install(function (package)
     import("package.tools.autoconf").install(package, {"--enable-shared=no"})
end)
```

### meson

If it is meson, you also need to add ninja dependencies to execute the build.

```lua
add_deps("meson", "ninja")
on_install(function (package)
     import("package.tools.meson").install(package, {"-Dxxx=ON"})
end)
```

## on_download

- Custom download package

#### Function Prototype

```lua
on_download(script: <function (package, opt)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Download script function with package and opt parameters |

#### Usage

The download logic of the custom package, which is a new interface added in 2.6.4, is usually not used, and it is enough to use the built-in download of Xmake.

If the user builds a private repository and has a more complex authentication mechanism and special processing logic for the download of the package, the internal download logic can be rewritten to achieve this.

```lua
on_download(function (package, opt)
    local url = opt.url
    local sourcedir = opt.sourcedir

    -- download url to the current directory
    -- and extract it's source code to sourcedir
    -- ...
end)
```

In the opt parameter, you can get the destination source directory `opt.sourcedir` of the downloaded package. We only need to get the package address from `opt.url` and download it.

Then, add some custom processing logic as needed. In addition, you can add download cache processing and so on.

The following is an example of custom downloading a tar.gz file, and implementing caching and decompression of source file directories, you can refer to the following:

```lua
package("zlib")
     add_urls("https://github.com/madler/zlib/archive/$(version).tar.gz")
     add_versions("v1.2.10", "42cd7b2bdaf1c4570e0877e61f2fdc0bce8019492431d054d3d86925e5058dc5")

     on_download(function (package, opt)
         import("net.http")
         import("utils.archive")

         local url = opt.url
         local sourcedir = opt.sourcedir
         local packagefile = path.filename(url)
         local sourcehash = package:sourcehash(opt.url_alias)

         local cached = true
         if not os.isfile(packagefile) or sourcehash ~= hash.sha256(packagefile) then
             cached = false

             -- attempt to remove package file first
             os.tryrm(packagefile)
             http.download(url, packagefile)

             -- check hash
             if sourcehash and sourcehash ~= hash.sha256(packagefile) then
                 raise("unmatched checksum, current hash(%s) != original hash(%s)", hash.sha256(packagefile):sub(1, 8), sourcehash:sub(1, 8))
             end
         end

         -- extract package file
         local sourcedir_tmp = sourcedir .. ".tmp"
         os.rm(sourcedir_tmp)
         if archive.extract(packagefile, sourcedir_tmp) then
             os.rm(sourcedir)
             os.mv(sourcedir_tmp, sourcedir)
         else
             -- if it is not archive file, we need only create empty source file and use package:originfile()
             os.tryrm(sourcedir)
             os.mkdir(sourcedir)
         end

         -- save original file path
         package:originfile_set(path.absolute(packagefile))
     end)
```

Custom download requires the user to fully control the download logic, which will be more complicated, and is not recommended unless necessary.

If you just want to add custom http headers to obtain download authorization,
you can see [Set http headers when downloading package](/api/description/builtin-policies#package-download-http-headers).

### Platform Filtering

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

### Compilation Tools

We have built-in scripts for installing common build tools for convenient build support for different source code-dependent build toolchains, such as autoconf, cmake, meson, etc.

### xmake

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

### cmake

If it is a cmake-based package, the integration is also very short-answered. Usually you only need to set some configuration parameters, but you need to add the cmake dependency first:

```lua
add_deps("cmake")
on_install(function (package)
    import("package.tools.cmake").install(package, {"-Dxxx=ON"})
end)
```

### autoconf

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

### meson

If it is meson, you need to add ninja's dependencies to perform the build.

```lua
add_deps("meson", "ninja")
on_install(function (package)
    import("package.tools.meson").install(package, {"-Dxxx=ON"})
end)
```

### gn

If it is a GN project, you can build and install it using the following methods. Make sure to also add ninja as a dependency.

```lua
add_deps("gn", "ninja")
on_install(function (package)
    import("package.tools.gn").install(package)
end)
```

### make

You can also build and install projects using makefiles.

```lua
add_deps("make")
on_install(function (package)
    import("package.tools.make").install(package)
end)
```

### msbuild

If the package uses Visual Studio projects you can build them using msbuild.

```lua
on_install(function (package)
    import("package.tools.msbuild").build(package)
    -- you then have to copy the built binaries manually
end)
```

### ninja

You can also build and install packages with ninja.

```lua
add_deps("ninja")
on_install(function (package)
    import("package.tools.ninja").install(package)
end)
```

### nmake

You can build and install packages with nmake

```lua
on_install(function (package)
    import("package.tools.nmake").install(package)
end)
```

### scons

You can build packages using scons.

```lua
add_deps("scons")
on_install(function (package)
    import("package.tools.scons").build(package)
    -- you then need to manually copy the built binaries
end)
```

## on_test

- Test package

#### Function Prototype

```lua
on_test(script: <function (package)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Test script function with package parameter |

#### Usage

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

## on_component

- Define package component

#### Function Prototype

```lua
on_component(component: <string>, script: <function (package, component)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| component | Component name string, optional (if not provided, applies to all components) |
| script | Component configuration script function with package and component parameters |

#### Usage

This is a new interface added in 2.7.3 to support component-based configuration of packages, see: [#2636](https://github.com/xmake-io/xmake/issues/2636) for details.

Through this interface we can configure the current package, specifying component details such as links to components, dependencies etc.

### Configuring component link information

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")

    on_component("graphics", function (package, component)
        local e = package:config("shared") and "" or "-s"
        component:add("links", "sfml-graphics" ... e)
        if package:is_plat("windows", "mingw") and not package:config("shared") then
            component:add("links", "freetype")
            component:add("syslinks", "opengl32", "gdi32", "user32", "advapi32")
        end
    end)

    on_component("window", function (package, component)
        local e = package:config("shared") and "" or "-s"
        component:add("links", "sfml-window" ... e)
        if package:is_plat("windows", "mingw") and not package:config("shared") then
            component:add("syslinks", "opengl32", "gdi32", "user32", "advapi32")
        end
    end)

    ...
```

On the user side, we can use package specific components in the following way.

```lua
add_requires("sfml")

target("test")
    add_packages("sfml", {components = "graphics")
```

::: tip NOTE
In addition to configuring the component information, we also need to configure the list of available components in order to use it properly, so it is usually used in conjunction with the `add_components` interface.
:::

A full example of the configuration and use of package components can be found at: [components example](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/components/xmake.lua)

### Configuring compilation information for components

We can configure not only the linking information for each component, but also the compilation information for includedirs, defines etc. We can also configure each component individually.

```lua
package("sfml")
    on_component("graphics", function (package, component)
        package:add("defines", "TEST")
    end)
```

### Configuring component dependencies

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")

    on_component("graphics", function (package, component)
          component:add("deps", "window", "system")
    end)
```

The above configuration tells the package that our graphics component will have additional dependencies on the `window` and `system` components.

So, on the user side, our use of the graphics component can be done from the

```lua
    add_packages("sfml", {components = {"graphics", "window", "system"})
```

Simplified to.

```lua
    add_packages("sfml", {components = "graphics")
```

Because, as soon as we turn on the graphics component, it will also automatically enable the dependent window and system components.

Alternatively, we can configure component dependencies with `add_components("graphics", {deps = {"window", "system"}})`.

### Finding components from the system library

We know that configuring `add_extsources` in the package configuration can improve package discovery on the system, for example by finding libraries from system package managers such as apt/pacman.

Of course, we can also make it possible for each component to prioritise finding them from the system repositories via the `extsources` configuration as well.

For example, the sfml package, which is actually also componentized in homebrew, can be made to find each component from the system repository without having to install them in source each time.

```sh
$ ls -l /usr/local/opt/sfml/lib/pkgconfig
-r--r--r-- 1 ruki admin 317 10 19 17:52 sfml-all.pc
-r--r--r-- 1 ruki admin 534 10 19 17:52 sfml-audio.pc
-r--r--r-- 1 ruki admin 609 10 19 17:52 sfml-graphics.pc
-r--r--r-- 1 ruki admin 327 10 19 17:52 sfml-network.pc
-r--r--r-- 1 ruki admin 302 10 19 17:52 sfml-system.pc
-r--r--r-- 1 ruki admin 562 10 19 17:52 sfml-window.pc
````

We just need, for each component, to configure its extsources: the

```lua
    if is_plat("macosx") then
        add_extsources("brew::sfml/sfml-all")
    end

    on_component("graphics", function (package, component)
        -- ...
        component:add("extsources", "brew::sfml/sfml-graphics")
    end)
```

### Default global component configuration

In addition to configuring specific components by specifying component names, if we don't specify a component name, the default is to globally configure all components.

```lua
package("sfml")
    on_component(function (package, component)
        -- configure all components
    end)
```

Of course, we could also specify the configuration of the graphics component and the rest of the components would be configured via the default global configuration interface in the following way.

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")

    on_component("graphics", function (package, component)
        -- configure graphics
    end)

    on_component(function (package, component)
        -- component audio, network, window, system
    end)
```
