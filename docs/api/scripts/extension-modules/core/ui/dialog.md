# core.ui.dialog

This module provides the base dialog class for all dialog components in the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.dialog")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `dialog` module is the base class for all dialog components. It extends the window class and provides button management functionality for creating interactive dialogs.

## dialog:new

- Create a new dialog instance

#### Function Prototype

::: tip API
```lua
dialog:new(name: <string>, bounds: <rect>, title: <string>)
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
| dialog | Returns a dialog instance |

#### Usage

Create a dialog with name, bounds, and title:

```lua
import("core.ui.dialog")
import("core.ui.rect")

local dialog = dialog:new("mydialog", rect{1, 1, 50, 20}, "My Dialog")
```

## dialog:buttons

- Get the buttons panel

#### Function Prototype

::: tip API
```lua
dialog:buttons()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| panel | Returns the buttons panel |

#### Usage

Access the buttons panel for managing dialog buttons:

```lua
local buttons = dialog:buttons()
```

## dialog:button

- Get a specific button by name

#### Function Prototype

::: tip API
```lua
dialog:button(name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Button name string |

#### Return Value

| Type | Description |
|------|-------------|
| button | Returns the button instance, nil if not found |

#### Usage

Get a specific button from the dialog:

```lua
local quit_btn = dialog:button("quit")
```

## dialog:button_add

- Add a button to the dialog

#### Function Prototype

::: tip API
```lua
dialog:button_add(name: <string>, text: <string>, command: <string|function>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Button name string |
| text | Required. Button display text |
| command | Required. Command string or function to execute when clicked |

#### Return Value

| Type | Description |
|------|-------------|
| button | Returns the created button instance |

#### Usage

Add buttons to the dialog:

```lua
-- Add button with string command
dialog:button_add("quit", "< Quit >", "cm_quit")

-- Add button with function callback
dialog:button_add("save", "< Save >", function (v) 
    print("Save clicked")
    dialog:show(false)
end)
```

## dialog:button_select

- Select a button by name

#### Function Prototype

::: tip API
```lua
dialog:button_select(name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Button name to select |

#### Return Value

| Type | Description |
|------|-------------|
| dialog | Returns the dialog instance |

#### Usage

Select a button programmatically:

```lua
dialog:button_select("quit")
```

## dialog:show

- Show or hide the dialog

#### Function Prototype

::: tip API
```lua
dialog:show(visible: <boolean>, opt?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| visible | Required. Show or hide the dialog |
| opt | Optional. Options table, supports: `{focused = true}` |

#### Return Value

No return value

#### Usage

Show or hide the dialog:

```lua
dialog:show(true)  -- Show the dialog
dialog:show(false)  -- Hide the dialog

-- Show with focus
dialog:show(true, {focused = true})
```

## dialog:quit

- Close the dialog

#### Function Prototype

::: tip API
```lua
dialog:quit()
```
:::

#### Parameter Description

No parameters

#### Return Value

No return value

#### Usage

Close and remove the dialog from its parent:

```lua
dialog:quit()
```

## dialog:on_event

- Handle dialog events

#### Function Prototype

::: tip API
```lua
dialog:on_event(e: <event>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| e | Required. Event object |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if event was handled, false otherwise |

#### Usage

The dialog automatically handles Esc key to close. Override this method for custom event handling:

```lua
function my_dialog:on_event(e)
    if e.type == event.ev_keyboard and e.key_name == "Enter" then
        self:quit()
        return true
    end
    return dialog.on_event(self, e)
end
```

## dialog:background_set

- Set dialog background color

#### Function Prototype

::: tip API
```lua
dialog:background_set(color: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| color | Required. Color name (e.g., "blue", "red") |

#### Return Value

No return value

#### Usage

Set the background color:

```lua
dialog:background_set("blue")
```

