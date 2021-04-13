
This page describes the interface for `package` of functions like `on_load()`, `on_install()` or `on_test()` of the [Package Dependencies](manual/package_dependencies.md)

| Interface                    | Description                      | Supported Versions |
| ---------------------------- | -------------------------------- | ------------------ |
| [package:name](#packagename) | Get the name of the package      | >= 2.2.5           |
| [package:get](#packageget)   | Get the values of the package    | >= 2.1.6           |
| [package:set](#packageset)   | Set the values of the package    | >= 2.1.6           |
| [package:add](#packageadd)   | Add to the values of the package | >= 2.2.5           |

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