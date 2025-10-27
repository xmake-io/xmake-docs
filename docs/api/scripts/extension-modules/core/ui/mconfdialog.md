# core.ui.mconfdialog

This module provides a menu-driven configuration dialog for the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.mconfdialog")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `mconfdialog` module extends `boxdialog` and provides a comprehensive menu-based configuration interface. It allows users to configure settings through a hierarchical menu, with support for boolean, number, string, choice, and menu configurations. It also includes features like help dialogs, search functionality, and scrollbar support for long menus.

## mconfdialog:new

- Create a new menu configuration dialog instance

#### Function Prototype

::: tip API
```lua
mconfdialog:new(name: <string>, bounds: <rect>, title: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Dialog name string |
| bounds | Required. Dialog bounds rectangle |
| title | Required. Dialog title string |

#### Return Value

| Type | Description |
|------|-------------|
| mconfdialog | Returns a menu configuration dialog instance |

#### Usage

Create a menu configuration dialog:

```lua
import("core.ui.mconfdialog")
import("core.ui.rect")

local dialog = mconfdialog:new("config", rect{1, 1, 80, 25}, "Configuration")
```

## mconfdialog:load

- Load configuration items into the dialog

#### Function Prototype

::: tip API
```lua
mconfdialog:load(configs: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| configs | Required. Array of configuration items (created with `menuconf.*` functions) |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns `true` on success |

#### Usage

Load configurations into the dialog:

```lua
local configs = {
    menuconf.boolean{description = "Enable debug"},
    menuconf.string{value = "x86_64", description = "Target architecture"},
    menuconf.number{value = 10, default = 10, description = "Thread count"},
    menuconf.choice{
        value = 2,
        values = {"gcc", "clang", "msvc"},
        description = "Compiler"
    }
}

dialog:load(configs)
```

## mconfdialog:configs

- Get all loaded configurations

#### Function Prototype

::: tip API
```lua
mconfdialog:configs()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| table | Returns array of configuration items |

#### Usage

Access loaded configurations:

```lua
local configs = dialog:configs()
for _, config in ipairs(configs) do
    print("Config:", config:prompt())
    print("Value:", config.value)
end
```

## mconfdialog:menuconf

- Get the menu config component

#### Function Prototype

::: tip API
```lua
mconfdialog:menuconf()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| menuconf | Returns the menu configuration instance |

#### Usage

Access the underlying menuconf component:

```lua
local menu = dialog:menuconf()
```

## mconfdialog:show_help

- Show help dialog for the current configuration item

#### Function Prototype

::: tip API
```lua
mconfdialog:show_help()
```
:::

#### Parameter Description

No parameters

#### Return Value

No return value

#### Usage

Display help information for the currently selected configuration item:

```lua
-- This is typically triggered by pressing '?' key
dialog:show_help()
```

## mconfdialog:show_search

- Show search dialog to search configurations

#### Function Prototype

::: tip API
```lua
mconfdialog:show_search()
```
:::

#### Parameter Description

No parameters

#### Return Value

No return value

#### Usage

Show search dialog to find configuration items:

```lua
-- This is typically triggered by pressing '/' key
dialog:show_search()
```

## mconfdialog:show_exit

- Show exit confirmation dialog

#### Function Prototype

::: tip API
```lua
mconfdialog:show_exit(message: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| message | Required. Confirmation message to display |

#### Return Value

No return value

#### Usage

Show exit confirmation dialog:

```lua
dialog:show_exit("Did you wish to save your new configuration?")
```

## mconfdialog:on_event

- Handle keyboard events

#### Function Prototype

::: tip API
```lua
mconfdialog:on_event(e: <event>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| e | Required. Event object |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns `true` if event was handled, `false` otherwise |

#### Usage

Handle keyboard events for configuration navigation:

```lua
function dialog:on_event(e)
    if e.type == event.ev_keyboard then
        if e.key_name == "?" then
            self:show_help()
            return true
        elseif e.key_name == "/" then
            self:show_search()
            return true
        end
    end
    return mconfdialog.on_event(self, e)
end
```

The following keys are supported:
- `Up/Down`: Navigate menu items
- `Space`: Toggle boolean values
- `Y`: Enable boolean
- `N`: Disable boolean
- `Esc/Back`: Go back
- `?`: Show help
- `/`: Search

