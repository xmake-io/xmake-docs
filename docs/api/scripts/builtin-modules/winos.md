# winos

The windows system operation module is a built-in module, no need to use [import](/api/scripts/builtin-modules/import) to import,
you can directly call its interface in the script scope.

## winos.version

- Get windows system version

#### Function Prototype

::: tip API
```lua
winos.version()
```
:::


#### Parameter Description

No parameters required for this function.

#### Usage

The version returned is the semver semantic version object

```lua
if winos.version():ge("win7") then
    - ...
end

if winos.version():ge("6.1") then
    - ...
end
```

In addition, it can also support the direct judgment of the windows version name. The mapping rules are as follows:

```
nt4 = "4.0"
win2k = "5.0"
winxp = "5.1"
ws03 = "5.2"
win6 = "6.0"
vista = "6.0"
ws08 = "6.0"
longhorn = "6.0"
win7 = "6.1"
win8 = "6.2"
winblue = "6.3"
win81 = "6.3"
win10 = "10.0"
```

## winos.registry_keys

- Get the list of registry builds

#### Function Prototype

::: tip API
```lua
winos.registry_keys(pattern: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| pattern | Pattern string for matching registry keys |

#### Usage

Support through pattern matching, traverse to obtain the registry key path list, `*` is single-level path matching, `**` is recursive path matching.

```lua
local keypaths = winos.registry_keys("HKEY_LOCAL_MACHINE\\SOFTWARE\\*\\Windows NT\\*\\CurrentVersion\\AeDebug")
for _, keypath in ipairs(keypaths) do
    print(winos.registry_query(keypath .. ";Debugger"))
end
```

## winos.registry_values

- Get a list of registry value names

#### Function Prototype

::: tip API
```lua
winos.registry_values(pattern: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| pattern | Pattern string for matching registry values |

#### Usage

Support to obtain the value name list of the specified key path through pattern matching, and the string after the `;` is the specified key name pattern matching string.

```lua
local valuepaths = winos.registry_values("HKEY_LOCAL_MACHINE\\SOFTWARE\\xx\\AeDebug;Debug*")
for _, valuepath in ipairs(valuepaths) do
    print(winos.registry_query(valuepath))
end
```

## winos.registry_query

- Get the registry value

#### Function Prototype

::: tip API
```lua
winos.registry_query(keypath: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| keypath | Registry key path |

#### Usage

Get the value under the specified registry path, if the value name is not specified, then get the default value of the key path

```lua
local value, errors = winos.registry_query("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug")
local value, errors = winos.registry_query("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug;Debugger")
```
