
# core.base.option

Commonly used to get the value of the xmake command parameter option, often used for plugin development.

## option.get

- Get parameter option values

#### Function Prototype

::: tip API
```lua
option.get(name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Option name |

#### Usage

Used to get parameter option values in plugin development, for example:

```lua
-- import option module
import("core.base.option")

-- plugin entry function
function main(...)
    print(option.get("info"))
end
```

The above code gets the hello plugin and executes: `xmake hello --info=xxxx` The value of the `--info=` option passed in the command, and shows: `xxxx`

For task tasks or plugins that are not a main entry, you can use this:

```lua
task("hello")
    on_run(function ()
        import("core.base.option")
        print(option.get("info"))
    end)
```