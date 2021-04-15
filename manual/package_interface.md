
This page describes the interface for `package` of functions like `on_load()`, `on_install()` or `on_test()` of the [Package Dependencies](manual/package_dependencies.md)

| Interface                                      | Description                                                                  | Supported Versions |
| ---------------------------------------------- | ---------------------------------------------------------------------------- | ------------------ |
| [package:name](#packagename)                   | Get the name of the package                                                  | >= 2.2.5           |
| [package:get](#packageget)                     | Get the values of the package                                                | >= 2.1.6           |
| [package:set](#packageset)                     | Set the values of the package                                                | >= 2.1.6           |
| [package:add](#packageadd)                     | Add to the values of the package                                             | >= 2.2.5           |
| [package:license](#packagelicense)             | Get the license of the package                                               | >= 2.3.9           |
| [package:description](#packagedescription)     | Get the description of the package                                           | >= 2.2.3           |
| [package:plat](#packageplat)                   | Get the platform of the package                                              | >= 2.2.2           |
| [package:arch](#packagearch)                   | Get the architecture of the package                                          | >= 2.2.2           |
| [package:targetos](#packagetargetos)           | Get the targeted OS of the package                                           | >= 2.5.2           |
| [package:targetarch](#packagetargetarch)       | Get the targeted architecture of the package                                 | >= 2.5.2           |
| [package:mode](#packagemode)                   | Get the build mode of the package                                            | >= 2.2.5           |
| [package:is_plat](#packageis_plat)             | Wether the current platform is one of the given platforms                    | >= 2.2.6           |
| [package:is_arch](#packageis_arch)             | Wether the current architecture is one of the given platforms                | >= 2.2.6           |
| [package:is_targetos](#packageis_targetos)     | Wether the currently targeted OS is one of the given OS                      | >= 2.5.2           |
| [package:is_targetarch](#packageis_targetarch) | Wether the currently targeted architecture is one of the given architectures | >= 2.5.2           |
| [package:alias](#packagealias)                 | Get the alias of the package                                                 | >= 2.1.7           |
| [package:urls](#packageurls)                   | Get the URLs of the package                                                  | >= 2.1.6           |
| [package:urls_set](#packageurls_set)           | Set the URLs of the package                                                  | >= 2.1.6           |
| [package:url_alias](#packageurl_alias)         | Get the alias of an URL                                                      | >= 2.1.6           |
| [package:url_version](#packageurl_version)     | Get the version filter of an URL                                             | >= 2.1.6           |
| [package:dep](#packagedep)                     | Get a dependency of the package                                              | >= 2.2.3           |
| [package:deps](#packagedeps)                   | Get all dependencies of the package                                          | >= 2.1.7           |
| [package:sourcehash](#packagesourcehash)       | Get the sha256 checksum of an URL alias                                      | >= 2.3.2           |
| [package:kind](#packagekind)                   | Get the kind of the package                                                  | >= 2.1.7           |
| [package:is_binary](#packageis_binary)         | Wether the package is of kind binary                                         | >= 2.5.2           |
| [package:is_toolchain](#packageis_toolchain)   | Wether the package is of kind toolchain                                      | >= 2.5.2           |
| [package:is_library](#packageis_library)       | Wether the package is of kind library                                        | >= 2.5.2           |
| [package:is_toplevel](#packageis_toplevel)     | Wether the package is directly required by the user                          | >= 2.5.2           |
| [package:is_thirdparty](#packageis_thirdparty) | Wether the package is provided by a third party package manager              | >= 2.5.3           |
| [package:is_debug](#packageis_debug)           | Wether the the package gets built with debug mode                            | >= 2.5.3           |
| [package:is_supported](#packageis_supported)   | Wether the package is supported by the current platform and architecture     | >= 2.5.3           |
| [package:debug](#packagedebug)                 | Wether the the package gets built with debug mode (deprecated)               | >= 2.2.3           |
| [package:is_cross](#packageis_cross)           | Wether the package is getting cross-compiled                                 | >= 2.5.3           |
| [package:cachedir](#packagecachedir)           | Get the cache directory of the package                                       | >= 2.1.6           |
| [package:installdir](#packageinstalldir)       | Get the installation directory of the package                                | >= 2.2.2           |
| [package:scriptdir](#packagescriptdir)         | Get the directory where the xmake.lua of the package lies                    | >= 2.2.5           |
| [package:envs](#packageenvs)                   | Get the exported environment variables of the package                        | >= 2.2.5           |
| [package:getenv](#packagegetenv)               | Get the given environment variable                                           | >= 2.2.2           |
| [package:setenv](#packagesetenv)               | Set the given environment variable                                           | >= 2.2.2           |
| [package:addenv](#packageaddenv)               | Add the given values to the environment variable                             | >= 2.2.2           |
| [package:versions](#packageversions)           | Get all version strings of the package                                       | >= 2.1.9           |
| [package:version](#packageversion)             | Get the version of the package                                               | >= 2.1.6           |
| [package:version_str](#packageversion_str)     | Get the version of the package as string                                     | >= 2.1.6           |
| [package:version_set](#packageversion_set)     | Set the version of the package                                               | >= 2.1.6           |
| [package:config](#packageconfig)               | Get the given configuration value of the package                             | >= 2.2.5           |
| [package:config_set](#packageconfig_set)       | Set the given configuration value of the package                             | >= 2.5.1           |
| [package:configs](#packageconfigs)             | Get all configurations of the package                                        | >= 2.2.2           |
| [package:buildhash](#packagebuildhash)         | Get the build hash of the package                                            | >= 2.2.5           |
| [package:group](#packagegroup)                 | Get the group name of the package                                            | >= 2.2.3           |
| [package:patches](#packagepatches)             | Get all patches of the current version                                       | >= 2.2.5           |

#### package:name

- Get the name of the package

#### package:get

- Get the values of the package by name

```lua
-- get the dependencies
package:get("deps")
-- get the links
package:get("links")
-- get the defined macros
package:get("defines")
```

#### package:set

- Set the values of the package by name (If you just want to add values use [package:add](#packageadd))

```lua
-- set the dependencies
package:set("deps", {"python"})
-- set the links
package:set("links", {"sdl2"})
-- set the defined macros
package:set("defines", {"SDL_MAIN_HANDLED"})
```

#### package:add

- Add to the values of the package by name

```lua
-- add dependencies
package:add("deps", "python")
-- add links
package:add("links", "sdl2")
-- add defined macros
package:add("defines", "SDL_MAIN_HANDLED")
```

#### package:license

- Get the license of the package (Same as `package:get("license")`)

#### package:description

- Get the description of the package (Same as `package:get("description")`)

#### package:plat

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

If the package is binary [`os.host`](manual/builtin_modules.md#oshost) is returned

#### package:arch

- Get the architecture of the package (e.g. x86, x64, x86_64)

If the package is binary [`os.arch`](manual/builtin_modules.md#osarch) is returned

#### package:targetos

- Get the targeted OS of the package. Can have the same values as [package:plat](#packageplat)

#### package:targetarch

- Get the targeted architecture of the package. Can have the same values as [package:arch](#packagearch)

#### package:mode

- Get the build mode. Can be any of:
  + debug
  + release

#### package:is_plat

- Wether the current platform is one of the given platforms

```lua
-- Is the current platform android?
package:is_plat("android")
-- Is the current platform windows, linux or macosx?
package:is_plat("windows", "linux", "macosx")
```

#### package:is_arch

- Wether the current platform is one of the given platforms

```lua
-- Is the current architecture x86
package:is_arch("x86")
-- Is the current architecture x64 or x86_64
package:is_arch("x64", "x86_64")
```

#### package:is_targetos

- Wether the currently targeted OS is one of the given OS

```lua
-- Is the currently targeted OS windows?
package:is_targetos("windows")
-- Is the currently targeted OS android or iphoneos?
package:is_targetos("android", "iphoneos")
```

#### package:is_targetarch

- Wether the currently targeted architecture is one of the given architectures

```lua
-- Is the currently targeted architecture x86
package:is_targetarch("x86")
-- Is the currently targeted architecture x64 or x86_64
package:is_targetarch("x64", "x86_64")
```

#### package:alias

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

#### package:urls

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

#### package:urls_set

- Set the URLs of the package. Overwrites all URLs of the package.

```lua
package:urls_set({"https://example.com/library-$(version).zip"})
```

#### package:url_alias

- Get the alias of an URL

If the alias is set like so:
```lua
add_urls("https://example.com/library-$(version).zip", {alias = example})
```
It can be retrieved like so:
```lua
-- both return "example"
-- the URL needs to be provided
package:url_alias("https://example.com/library-$(version).zip")
-- this is also possible
package:url_alias(package:urls()[1])
```

#### package:url_version

- Returns the version filter of the given URL

This returns the function provided by `version`:
```lua
add_urls("https://example.com/library-$(version).zip", {version = function (version) return "example_version" end})
```
It can be used like so:
```lua
-- the URL needs to be provided
local version_func = package:url_version(package:urls()[1])
-- returns "example_version"
version_func()
```

#### package:dep

- Get a dependency of the package by name. The name needs to be a dependency of the package.

```lua
local python = package:dep("python")
-- returns "python"
python:name()
```

#### package:deps

- Get all dependencies of the package

```lua
-- prints the names of all dependencies
for _,dep in pairs(package:deps()) do
    print(dep:name())
end
```

#### package:sourcehash

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

#### package:kind

- Get the kind of the package. Can be any of:
  + binary
  + toolchain (is also binary)
  + library (default)


#### package:is_binary

- Wether the package is of kind binary


#### package:is_toolchain

- Wether the package is of kind toolchain


#### package:is_library

- Wether the package is of kind library

#### package:is_toplevel

- Wether the package is directly required by the user (e.g. xmake.lua)


#### package:is_thirdparty

- Wether the package is provided by a thirdparty package manager (e.g. brew, conan, vcpkg)


#### package:is_debug

- Wether the package is build with debug mode (Same as `package:config("debug")`)


#### package:is_supported

- Wether the package is supported by the current platform and architecture


#### package:debug

- Wether the the package gets built with debug mode (deprecated: use [`package:is_debug`](#packageis_debug) instead)


#### package:is_cross

- Wether the package is getting cross-compiled


#### package:cachedir

- Get the cache directory of the package


#### package:installdir

- Get the installation directory of the package. Can also be used to get a subdirectory. If the given directory tree does not exist it will be created.

```lua
-- returns the installation directory
package:installdir()
-- returns the subdirectory include inside the installation directory
package:installdir("include")
-- returns the subdirectory include/files
package:installdir("include", "files")
```

#### package:scriptdir

- Get the directory where the xmake.lua of the package lies


#### package:envs

- Get the exported environment variables of the package


#### package:getenv

- Get the given environment variable

```lua
-- returns a table
package:getenv("PATH")
```

#### package:setenv

- Set the given environment variable. Overwrites the variable

```lua
-- sets PATH to {"bin", "lib"}
package:setenv("PATH", "bin", "lib")
```

#### package:addenv

- Add the given values to the environment variable

```lua
-- adds "bin" and "lib" to PATH
package:addenv("PATH", "bin", "lib")
```

#### package:versions

- Get all version strings of the package. Returns a table containing all versions as strings


#### package:version

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

#### package:version_str

- Get the version of the package as string


#### package:version_set

- Set the version of the package

```lua
-- normal semantic version
package:version_set("2.4.1", "versions")
-- branch for git repo
package:version_set("dev", "branches")
-- tag of git repo
package:version_set("v2.4.1", "tags")
```

#### package:config

- Get the given configuration value of the package

```lua
-- if configurations are set like so
add_require("example", {config = {enable_x = true, value_y = 6}})
-- these values can be retrieved like so
-- returns true
package:config("enable_x")
-- returns 6
package:config("value_y")
```

#### package:config_set

- Set the given configuration value of the package

```lua
package:config_set("enable_x", true)
package:config_set("value_y", 6)
```

#### package:configs

- Get all configurations of the package

```lua
-- returns a table with the configuration names as keys and their values as values
local configs = package:configs()
local enable_x = configs["enable_x"]
local value_y = configs["value_y"]
```

#### package:buildhash

- Get the build hash of the package


#### package:group

- Get the group name of the package


#### package:patches

- Get all patches of the current version

```lua
-- returns a table with all patches
local patches = package:patches()
-- each element contains the keys "url" and "sha256"
local url = patches[1]["url"]
local sha256 = patches[1]["sha256"]
```