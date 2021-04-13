
This page describes the interface for `package` of functions like `on_load()`, `on_install()` or `on_test()` of the [Package Dependencies](manual/package_dependencies.md)

| Interface                                  | Description                                               | Supported Versions |
| ------------------------------------------ | --------------------------------------------------------- | ------------------ |
| [package:name](#packagename)               | Get the name of the package                               | >= 2.2.5           |
| [package:get](#packageget)                 | Get the values of the package                             | >= 2.1.6           |
| [package:set](#packageset)                 | Set the values of the package                             | >= 2.1.6           |
| [package:add](#packageadd)                 | Add to the values of the package                          | >= 2.2.5           |
| [package:license](#packagelicense)         | Get the license of the package                            | >= 2.3.9           |
| [package:description](#packagedescription) | Get the description of the package                        | >= 2.2.3           |
| [package:plat](#packageplat)               | Get the platform of the package                           | >= 2.2.2           |
| [package:arch](#packagearch)               | Get the architecture of the package                       | >= 2.2.2           |
| [package:targetos](#packagetargetos)       | Get the targeted OS of the package                        | >= 2.5.2           |
| [package:targetarch](#packagetargetarch)   | Get the targeted architecture of the package              | >= 2.5.2           |
| [package:mode](#packagemode)               | Get the build mode of the package                         | >= 2.2.5           |
| [package:is_plat](#packageis_plat)         | Wether the current platform is one of the given platforms | >= 2.2.6           |

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