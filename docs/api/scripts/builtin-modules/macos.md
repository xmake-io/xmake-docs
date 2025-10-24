# macos

The macOS system operation module is a built-in module, no need to use [import](/api/scripts/builtin-modules/import) to import, you can directly call its interface in the script scope.

## macos.version

- Get macOS system version

#### Function Prototype

::: tip API
```lua
macos.version()
```
:::


#### Parameter Description

No parameters required for this function.

#### Usage

The version returned is the semver semantic version object

```lua
if macos.version():ge("10.0") then
    - ...
end
```
