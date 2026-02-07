# Package Instance

This page describes the interface for `package` of functions like `on_load()`, `on_install()` or `on_test()` of the [Package Dependencies](/api/description/package-dependencies)

## package:name

- Get the name of the package

#### Function Prototype

::: tip API
```lua
package:name()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


## package:get

- Get the values of the package by name

#### Function Prototype

::: tip API
```lua
package:get(key: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key | Configuration key name |

#### Usage


```lua
-- get the dependencies
package:get("deps")
-- get the links
package:get("links")
-- get the defined macros
package:get("defines")
```

## package:set

- Set the values of the package by name

#### Function Prototype

::: tip API
```lua
package:set(key: <string>, value: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key | Configuration key name |
| value | Configuration value |

#### Usage


If you just want to add values use [package:add](#package-add)

```lua
-- set the dependencies
package:set("deps", "python")
-- set the links
package:set("links", "sdl2")
-- set the defined macros
package:set("defines", "SDL_MAIN_HANDLED")
```

::: tip NOTE
Any script scope configuration using `package:set("xxx", ...)` is completely consistent with the corresponding `set_xxx` interface in the description scope. For specific parameter descriptions, you can directly refer to the corresponding `set_xxx` interface documentation in the description scope.

For example:
- Description scope: `set_urls("https://github.com/madler/zlib/archive/$(version).tar.gz")`
- Script scope: `package:set("urls", "https://github.com/madler/zlib/archive/$(version).tar.gz")`
:::

## package:add

- Add to the values of the package by name

#### Function Prototype

::: tip API
```lua
package:add(key: <string>, value: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key | Configuration key name |
| value | Value to add |

#### Usage


```lua
-- add dependencies
package:add("deps", "python")
-- add links
package:add("links", "sdl2")
-- add defined macros
package:add("defines", "SDL_MAIN_HANDLED")
```

::: tip NOTE
Any script scope configuration using `package:add("xxx", ...)` is completely consistent with the corresponding `add_xxx` interface in the description scope. For specific parameter descriptions, you can directly refer to the corresponding `add_xxx` interface documentation in the description scope.

For example:
- Description scope: `add_deps("zlib", {configs = {shared = true}})`
- Script scope: `package:add("deps", "zlib", {configs = {shared = true}})`
:::

## package:license

- Get the license of the package

#### Function Prototype

::: tip API
```lua
package:license()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


Same as `package:get("license")`

## package:description

- Get the description of the package

#### Function Prototype

::: tip API
```lua
package:description()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


Same as `package:get("description")`

## package:plat

- Get the platform of the package. Can be any of:

#### Function Prototype

::: tip API
```lua
package:plat()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

  + windows
  + linux
  + macosx
  + android
  + iphoneos
  + watchos
  + mingw
  + cygwin
  + bsd

If the package is binary [`os.host`](/api/scripts/builtin-modules/os#os-host) is returned

## package:arch

- Get the architecture of the package (e.g. x86, x64, x86_64)

#### Function Prototype

::: tip API
```lua
package:arch()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


If the package is binary [`os.arch`](/api/scripts/builtin-modules/os#os-arch) is returned

## package:targetos

- Get the targeted OS of the package.

#### Function Prototype

::: tip API
```lua
package:targetos()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


There are the same values as [package:plat](#package-plat)

## package:targetarch

- Get the targeted architecture of the package.

#### Function Prototype

::: tip API
```lua
package:targetarch()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


There are the same values as [package:arch](#package-arch)

## package:is_plat

- Wether the current platform is one of the given platforms

#### Function Prototype

::: tip API
```lua
package:is_plat(plat: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| plat | Platform name |

#### Usage


```lua
-- Is the current platform android?
package:is_plat("android")
-- Is the current platform windows, linux or macosx?
package:is_plat("windows", "linux", "macosx")
```

## package:is_arch

- Wether the current platform is one of the given platforms

#### Function Prototype

::: tip API
```lua
package:is_arch(arch: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| arch | Architecture name |

#### Usage


```lua
-- Is the current architecture x86
package:is_arch("x86")
-- Is the current architecture x64 or x86_64
package:is_arch("x64", "x86_64")
```

## package:is_targetos

- Wether the currently targeted OS is one of the given OS

#### Function Prototype

::: tip API
```lua
package:is_targetos()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
-- Is the currently targeted OS windows?
package:is_targetos("windows")
-- Is the currently targeted OS android or iphoneos?
package:is_targetos("android", "iphoneos")
```

## package:is_targetarch

- Wether the currently targeted architecture is one of the given architectures

#### Function Prototype

::: tip API
```lua
package:is_targetarch()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
-- Is the currently targeted architecture x86
package:is_targetarch("x86")
-- Is the currently targeted architecture x64 or x86_64
package:is_targetarch("x64", "x86_64")
```

## package:alias

- Get the alias of the package

#### Function Prototype

::: tip API
```lua
package:alias()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


If the user sets an alias like so:
```lua
add_requires("libsdl", {alias = "sdl"})
```
This alias can be retrieved by
```lua
-- returns "sdl"
package:alias()
```

## package:urls

- Get the URLs of the package

#### Function Prototype

::: tip API
```lua
package:urls()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


Retrieve the URLs set by:
```lua
add_urls("https://example.com/library-$(version).zip")
-- or so
set_urls("https://example.com/library-$(version).zip")
```
Then write this:
```lua
-- returns the table {"https://example.com/library-$(version).zip"}
package:urls()
```

## package:dep

- Get a dependency of the package by name. The name needs to be a dependency of the package.

#### Function Prototype

::: tip API
```lua
package:dep(name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Dependency name |

#### Usage


```lua
local python = package:dep("python")
-- returns "python"
python:name()
```

## package:deps

- Get all dependencies of the package

#### Function Prototype

::: tip API
```lua
package:deps()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
-- prints the names of all dependencies
for _,dep in pairs(package:deps()) do
    print(dep:name())
end
```

## package:sourcehash

- Get the sha256 checksum of an URL alias

#### Function Prototype

::: tip API
```lua
package:sourcehash()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


If the checksum is provided like so:
```lua
add_urls("https://example.com/library-$(version).zip", {alias = "example"})
add_versions("example:2.4.1", "29f9983cc7196e882c4bc3d23d7492f9c47574c7cf658afafe7d00c185429941")
```
You can retrieve the checksum like so:
```lua
-- returns "29f9983cc7196e882c4bc3d23d7492f9c47574c7cf658afafe7d00c185429941"
package:sourcehash("example")
-- or so
package:sourcehash(package:url_alias(package:urls()[1]))
```

## package:kind

- Get the kind of the package. Can be any of:

#### Function Prototype

::: tip API
```lua
package:kind()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

  + binary
  + toolchain (is also binary)
  + library (default)
  + template [#2138](https://github.com/xmake-io/xmake/issues/2138)
  + headeronly

## package:is_binary

- Wether the package is of kind binary

#### Function Prototype

::: tip API
```lua
package:is_binary()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage



## package:is_toolchain

- Wether the package is of kind toolchain

#### Function Prototype

::: tip API
```lua
package:is_toolchain()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage



## package:is_library

- Wether the package is of kind library

#### Function Prototype

::: tip API
```lua
package:is_library()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


## package:is_toplevel

- Wether the package is directly required by the user (e.g. xmake.lua)

#### Function Prototype

::: tip API
```lua
package:is_toplevel()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


## package:is_thirdparty

- Wether the package is provided by a thirdparty package manager (e.g. brew, conan, vcpkg)

#### Function Prototype

::: tip API
```lua
package:is_thirdparty()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage



## package:is_debug

- Wether the package is build with debug mode (Same as `package:config("debug")`)

#### Function Prototype

::: tip API
```lua
package:is_debug()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage



## package:is_supported

- Wether the package is supported by the current platform and architecture

#### Function Prototype

::: tip API
```lua
package:is_supported()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage



## package:debug

- Wether the the package gets built with debug mode

#### Function Prototype

::: tip API
```lua
package:debug()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


It's deprecated, please use [`package:is_debug`](#package-is_debug) instead

## package:is_cross

- Wether the package is getting cross-compiled

#### Function Prototype

::: tip API
```lua
package:is_cross()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage



## package:cachedir

- Get the cache directory of the package

#### Function Prototype

::: tip API
```lua
package:cachedir()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage



## package:installdir

- Get the installation directory of the package. Can also be used to get a subdirectory. If the given directory tree does not exist it will be created.

#### Function Prototype

::: tip API
```lua
package:installdir()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
-- returns the installation directory
package:installdir()
-- returns the subdirectory include inside the installation directory
package:installdir("include")
-- returns the subdirectory include/files
package:installdir("include", "files")
```

## package:scriptdir

- Get the directory where the xmake.lua of the package lies

#### Function Prototype

::: tip API
```lua
package:scriptdir()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage



## package:envs

- Get the exported environment variables of the package

#### Function Prototype

::: tip API
```lua
package:envs()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage



## package:getenv

- Get the given environment variable

#### Function Prototype

::: tip API
```lua
package:getenv()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
-- returns a table
package:getenv("PATH")
```

## package:setenv

- Set the given environment variable. Overwrites the variable

#### Function Prototype

::: tip API
```lua
package:setenv()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
-- sets PATH to {"bin", "lib"}
package:setenv("PATH", "bin", "lib")
```

## package:addenv

- Add the given values to the environment variable

#### Function Prototype

::: tip API
```lua
package:addenv()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
-- adds "bin" and "lib" to PATH
package:addenv("PATH", "bin", "lib")
```


## package:scheme

- Get the scheme instance by name

#### Function Prototype

::: tip API
```lua
package:scheme(name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Scheme name |

#### Usage

Retrieves the scheme instance by name. This is used to configure scheme-specific settings (URLs, versions, hashes, etc.), typically inside `on_source` or `on_load`.

```lua
on_source(function (package)
    -- Configure the 'binary' scheme
    local binary = package:scheme("binary")
    binary:add("urls", "https://example.com/mypkg-v$(version)-bin.zip")
    binary:add("versions", "1.0.0", "<sha256_of_binary>")
end)
```

## package:current_scheme

- Get the currently selected scheme

#### Function Prototype

::: tip API
```lua
package:current_scheme()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Retrieves the currently selected scheme. This is useful in `on_install` to determine which build logic to execute.

```lua
on_install(function (package)
    local scheme = package:current_scheme()
    if scheme and scheme:name() == "binary" then
        -- Install logic for precompiled binary
    else
        -- Build logic for source
    end
end)
```

## package:versions


- Get all version strings of the package. Returns a table containing all versions as strings

#### Function Prototype

::: tip API
```lua
package:versions()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage



## package:version

- Get the version of the package

#### Function Prototype

::: tip API
```lua
package:version()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
local version = package:version()
-- get the major version
version:major()
-- get the minor version
version:minor()
-- get the patch version
version:patch()
```

## package:version_str

- Get the version of the package as string

#### Function Prototype

::: tip API
```lua
package:version_str()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage



## package:config

- Get the given configuration value of the package

#### Function Prototype

::: tip API
```lua
package:config()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
-- if configurations are set like so
add_require("example", {configs = {enable_x = true, value_y = 6}})
-- these values can be retrieved like so
-- returns true
package:config("enable_x")
-- returns 6
package:config("value_y")
```

## package:config_set

- Set the given configuration value of the package

#### Function Prototype

::: tip API
```lua
package:config_set()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
package:config_set("enable_x", true)
package:config_set("value_y", 6)
```

## package:configs

- Get all configurations of the package

#### Function Prototype

::: tip API
```lua
package:configs()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
-- returns a table with the configuration names as keys and their values as values
local configs = package:configs()
local enable_x = configs["enable_x"]
local value_y = configs["value_y"]
```

## package:buildhash

- Get the build hash of the package

#### Function Prototype

::: tip API
```lua
package:buildhash()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage



## package:patches

- Get all patches of the current version

#### Function Prototype

::: tip API
```lua
package:patches()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
-- returns a table with all patches
local patches = package:patches()
-- each element contains the keys "url" and "sha256"
local url = patches[1]["url"]
local sha256 = patches[1]["sha256"]
```

## package:has_cfuncs

- Wether the package has the given C functions

#### Function Prototype

::: tip API
```lua
package:has_cfuncs()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


This should be used inside `on_test` like so:
```lua
on_test(function (package)
  assert(package:has_cfuncs("foo"))
  -- you can also add configs
  assert(package:has_cfuncs("bar", {includes = "foo_bar.h"}))
  assert(package:has_cfuncs("blob", {includes = "blob.h", configs = {defines = "USE_BLOB"}}))
  -- you can even set the language
  assert(package:has_cfuncs("bla", {configs = {languages = "c99"}}))
end)
```

## package:has_cxxfuncs

- Wether the package has the given C++ functions

#### Function Prototype

::: tip API
```lua
package:has_cxxfuncs(funcs: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| funcs | Function name or function name list |

#### Usage


This should be used inside `on_test` like so:
```lua
on_test(function (package)
  assert(package:has_cxxfuncs("foo"))
  -- you can also add configs
  assert(package:has_cxxfuncs("bar", {includes = "foo_bar.hpp"}))
  assert(package:has_cxxfuncs("blob", {includes = "blob.hpp", configs = {defines = "USE_BLOB"}}))
  -- you can even set the language
  assert(package:has_cxxfuncs("bla", {configs = {languages = "cxx17"}}))
end)
```

## package:has_ctypes

- Wether the package has the given C types

#### Function Prototype

::: tip API
```lua
package:has_ctypes(types: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| types | Type name or type name list |

#### Usage


This should be used inside `on_test` like so:
```lua
on_test(function (package)
  assert(package:has_ctypes("foo"))
  -- you can also add configs
  assert(package:has_ctypes("bar", {includes = "foo_bar.h"}))
  assert(package:has_ctypes("blob", {includes = "blob.h", configs = {defines = "USE_BLOB"}}))
  -- you can even set the language
  assert(package:has_ctypes("bla", {configs = {languages = "c99"}}))
end)
```

## package:has_cxxtypes

- Wether the package has the given C++ types

#### Function Prototype

::: tip API
```lua
package:has_cxxtypes(types: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| types | Type name or type name list |

#### Usage


This should be used inside `on_test` like so:
```lua
on_test(function (package)
  assert(package:has_cxxtypes("foo"))
  -- you can also add configs
  assert(package:has_cxxtypes("bar", {includes = "foo_bar.hpp"}))
  assert(package:has_cxxtypes("blob", {includes = "blob.hpp", configs = {defines = "USE_BLOB"}}))
  -- you can even set the language
  assert(package:has_cxxtypes("bla", {configs = {languages = "cxx17"}}))
end)
```

## package:has_cincludes

- Wether the package has the given C header files

#### Function Prototype

::: tip API
```lua
package:has_cincludes(includes: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| includes | Include file or include file list |

#### Usage


This should be used in `on_test` like so:
```lua
on_test(function (package)
  assert(package:has_cincludes("foo.h"))
end)
```

## package:has_cxxincludes

- Wether the package has the given C++ header files

#### Function Prototype

::: tip API
```lua
package:has_cxxincludes(includes: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| includes | Include file or include file list |

#### Usage


This should be used in `on_test` like so:
```lua
on_test(function (package)
  assert(package:has_cxxincludes("foo.hpp"))
end)
```

## package:check_csnippets

- Wether the given C snippet can be compiled and linked

#### Function Prototype

::: tip API
```lua
package:check_csnippets(snippets: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| snippets | Code snippet or code snippet list |

#### Usage


This should be used in `on_test` like so:
```lua
on_test(function (package)
  assert(package:check_csnippets({test = [[
    #define USE_BLOB
    #include <blob.h>
    void test(int argc, char** argv) {
      foo bar;
      printf("%s", bar.blob);
    }
  ]]}, {configs = {languages = "c99"}, includes = "foo.h"}))
end)
```

## package:check_cxxsnippets

- Wether the given C++ snippet can be compiled and linked

#### Function Prototype

::: tip API
```lua
package:check_cxxsnippets(snippets: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| snippets | Code snippet or code snippet list |

#### Usage


This should be used in `on_test` like so:
```lua
on_test(function (package)
  assert(package:check_cxxsnippets({test = [[
    #define USE_BLOB
    #include <blob.hpp>
    void test(int argc, char** argv) {
      foo bar();
      std::cout << bar.blob;
    }
  ]]}, {configs = {languages = "cxx11"}, includes = "foo.hpp"}))
end)
```

## package:check_fcsnippets

- Wether the given Fortran snippet can be compiled and linked

#### Function Prototype

::: tip API
```lua
package:check_fcsnippets()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


see above
