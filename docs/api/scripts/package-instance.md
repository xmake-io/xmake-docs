# Package Instance

This page describes the interface for `package` of functions like `on_load()`, `on_install()` or `on_test()` of the [Package Dependencies](/api/description/package-dependencies)

## package:name

- Get the name of the package

## package:get

- Get the values of the package by name

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

If you just want to add values use [package:add](#package-add)

```lua
-- set the dependencies
package:set("deps", "python")
-- set the links
package:set("links", "sdl2")
-- set the defined macros
package:set("defines", "SDL_MAIN_HANDLED")
```

## package:add

- Add to the values of the package by name

```lua
-- add dependencies
package:add("deps", "python")
-- add links
package:add("links", "sdl2")
-- add defined macros
package:add("defines", "SDL_MAIN_HANDLED")
```

## package:license

- Get the license of the package

Same as `package:get("license")`

## package:description

- Get the description of the package

Same as `package:get("description")`

## package:plat

- Get the platform of the package. Can be any of:
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

If the package is binary [`os.arch`](/api/scripts/builtin-modules/os#os-arch) is returned

## package:targetos

- Get the targeted OS of the package.

There are the same values as [package:plat](#package-plat)

## package:targetarch

- Get the targeted architecture of the package.

There are the same values as [package:arch](#package-arch)

## package:is_plat

- Wether the current platform is one of the given platforms

```lua
-- Is the current platform android?
package:is_plat("android")
-- Is the current platform windows, linux or macosx?
package:is_plat("windows", "linux", "macosx")
```

## package:is_arch

- Wether the current platform is one of the given platforms

```lua
-- Is the current architecture x86
package:is_arch("x86")
-- Is the current architecture x64 or x86_64
package:is_arch("x64", "x86_64")
```

## package:is_targetos

- Wether the currently targeted OS is one of the given OS

```lua
-- Is the currently targeted OS windows?
package:is_targetos("windows")
-- Is the currently targeted OS android or iphoneos?
package:is_targetos("android", "iphoneos")
```

## package:is_targetarch

- Wether the currently targeted architecture is one of the given architectures

```lua
-- Is the currently targeted architecture x86
package:is_targetarch("x86")
-- Is the currently targeted architecture x64 or x86_64
package:is_targetarch("x64", "x86_64")
```

## package:alias

- Get the alias of the package

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

```lua
local python = package:dep("python")
-- returns "python"
python:name()
```

## package:deps

- Get all dependencies of the package

```lua
-- prints the names of all dependencies
for _,dep in pairs(package:deps()) do
    print(dep:name())
end
```

## package:sourcehash

- Get the sha256 checksum of an URL alias

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
  + binary
  + toolchain (is also binary)
  + library (default)
  + template [#2138](https://github.com/xmake-io/xmake/issues/2138)
  + headeronly

## package:is_binary

- Wether the package is of kind binary


## package:is_toolchain

- Wether the package is of kind toolchain


## package:is_library

- Wether the package is of kind library

## package:is_toplevel

- Wether the package is directly required by the user (e.g. xmake.lua)

## package:is_thirdparty

- Wether the package is provided by a thirdparty package manager (e.g. brew, conan, vcpkg)


## package:is_debug

- Wether the package is build with debug mode (Same as `package:config("debug")`)


## package:is_supported

- Wether the package is supported by the current platform and architecture


## package:debug

- Wether the the package gets built with debug mode

It's deprecated, please use [`package:is_debug`](#package-is_debug) instead

## package:is_cross

- Wether the package is getting cross-compiled


## package:cachedir

- Get the cache directory of the package


## package:installdir

- Get the installation directory of the package. Can also be used to get a subdirectory. If the given directory tree does not exist it will be created.

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


## package:envs

- Get the exported environment variables of the package


## package:getenv

- Get the given environment variable

```lua
-- returns a table
package:getenv("PATH")
```

## package:setenv

- Set the given environment variable. Overwrites the variable

```lua
-- sets PATH to {"bin", "lib"}
package:setenv("PATH", "bin", "lib")
```

## package:addenv

- Add the given values to the environment variable

```lua
-- adds "bin" and "lib" to PATH
package:addenv("PATH", "bin", "lib")
```

## package:versions

- Get all version strings of the package. Returns a table containing all versions as strings


## package:version

- Get the version of the package

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


## package:config

- Get the given configuration value of the package

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

```lua
package:config_set("enable_x", true)
package:config_set("value_y", 6)
```

## package:configs

- Get all configurations of the package

```lua
-- returns a table with the configuration names as keys and their values as values
local configs = package:configs()
local enable_x = configs["enable_x"]
local value_y = configs["value_y"]
```

## package:buildhash

- Get the build hash of the package


## package:patches

- Get all patches of the current version

```lua
-- returns a table with all patches
local patches = package:patches()
-- each element contains the keys "url" and "sha256"
local url = patches[1]["url"]
local sha256 = patches[1]["sha256"]
```

## package:has_cfuncs

- Wether the package has the given C functions

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

This should be used in `on_test` like so:
```lua
on_test(function (package)
  assert(package:has_cincludes("foo.h"))
end)
```

## package:has_cxxincludes

- Wether the package has the given C++ header files

This should be used in `on_test` like so:
```lua
on_test(function (package)
  assert(package:has_cxxincludes("foo.hpp"))
end)
```

## package:check_csnippets

- Wether the given C snippet can be compiled and linked

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

see above
