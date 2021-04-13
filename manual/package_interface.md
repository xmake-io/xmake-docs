
This page describes the interface for `package` of functions like `on_load()`, `on_install()` or `on_test()` of the [Package Dependencies](manual/package_dependencies.md)

| Interface                    | Description                   | Supported Versions |
| ---------------------------- | ----------------------------- | ------------------ |
| [package:name](#packagename) | Get the name of the package   | >= 2.2.5           |
| [package:get](#packageget)   | Get the values of the package | >= 2.1.6           |

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