
# core.base.global

Used to get the configuration information of xmake global, that is, the value of the parameter option passed in `xmake g|global --xxx=val`.

## global.get

- Get the specified configuration value

#### Function Prototype

::: tip API
```lua
global.get(key: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key | Configuration key name |

#### Usage

Similar to [config.get](/api/scripts/extension-modules/core/project/config#config-get), the only difference is that this is obtained from the global configuration.

## global.load

- Load configuration

#### Function Prototype

::: tip API
```lua
global.load()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Similar to [global.get](#global-get), the only difference is that this is loaded from the global configuration.

## global.directory

- Get the global configuration information directory

#### Function Prototype

::: tip API
```lua
global.directory()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

The default is the `~/.config` directory.

## global.dump

- Print out all global configuration information

#### Function Prototype

::: tip API
```lua
global.dump()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

The output is as follows:

```lua
{
    clean = true,
    ccache = "ccache",
    xcode_dir = "/Applications/Xcode.app"
}
```
