
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
