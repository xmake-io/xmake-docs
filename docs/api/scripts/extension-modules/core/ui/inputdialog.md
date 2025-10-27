# core.ui.inputdialog

This module provides an input dialog for text input in the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.inputdialog")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `inputdialog` module extends textdialog and provides a text input field for user input. It includes a prompt label and a text edit component.

## inputdialog:new

- Create a new input dialog instance

#### Function Prototype

::: tip API
```lua
inputdialog:new(name: <string>, bounds: <rect>, title: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Input dialog name string |
| bounds | Required. Input dialog bounds rectangle |
| title | Required. Input dialog title string |

#### Return Value

| Type | Description |
|------|-------------|
| inputdialog | Returns an input dialog instance |

#### Usage

Create an input dialog with name, bounds, and title:

```lua
import("core.ui.inputdialog")
import("core.ui.rect")

local dialog = inputdialog:new("input", rect{10, 5, 50, 10}, "Input")
```

## inputdialog:textedit

- Get the text edit component

#### Function Prototype

::: tip API
```lua
inputdialog:textedit()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| textedit | Returns the text edit instance |

#### Usage

Access the text edit component to get or set input value:

```lua
local textedit = dialog:textedit()
local input_value = textedit:text()
```

## inputdialog:text

- Get the prompt label

#### Function Prototype

::: tip API
```lua
inputdialog:text()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| label | Returns the prompt label instance |

#### Usage

Get and customize the prompt label:

```lua
local label = dialog:text()
label:text_set("Please enter your name:")
label:textattr_set("red")
```

## inputdialog:button_add

- Add a button to the dialog

#### Function Prototype

::: tip API
```lua
inputdialog:button_add(name: <string>, text: <string>, command: <string|function>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Button name string |
| text | Required. Button display text |
| command | Required. Command string or function to execute |

#### Return Value

| Type | Description |
|------|-------------|
| button | Returns the button instance |

#### Usage

Add buttons to handle user input:

```lua
-- Yes button - get input and process
dialog:button_add("yes", "< Yes >", function (v)
    local input = dialog:textedit():text()
    print("User entered:", input)
    dialog:quit()
end)

-- No/Cancel button
dialog:button_add("no", "< No >", function (v)
    dialog:quit()
end)
```

## inputdialog:show

- Show or hide the dialog

#### Function Prototype

::: tip API
```lua
inputdialog:show(visible: <boolean>, opt?: <table>)
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

Show or hide the input dialog:

```lua
dialog:show(true)  -- Show the dialog

-- Show with focus
dialog:show(true, {focused = true})
```

## inputdialog:background_set

- Set dialog background color

#### Function Prototype

::: tip API
```lua
inputdialog:background_set(color: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| color | Required. Color name (e.g., "blue", "cyan") |

#### Return Value

No return value

#### Usage

Set the background color for the dialog and its frame:

```lua
dialog:background_set("blue")
dialog:frame():background_set("cyan")
```

## inputdialog:quit

- Close the input dialog

#### Function Prototype

::: tip API
```lua
inputdialog:quit()
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

