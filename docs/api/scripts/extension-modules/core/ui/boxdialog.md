# core.ui.boxdialog

This module provides a box dialog with a content area for the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.boxdialog")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `boxdialog` module extends `textdialog` and provides a box dialog with a content area. It contains a text area with adjustable height and a content box (for placing child views), and serves as the base for complex dialogs like `choicedialog` and `mconfdialog`.

## boxdialog:new

- Create a new box dialog instance

#### Function Prototype

::: tip API
```lua
boxdialog:new(name: <string>, bounds: <rect>, title: <string>)
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
| boxdialog | Returns a box dialog instance |

#### Usage

Create a box dialog:

```lua
import("core.ui.boxdialog")
import("core.ui.rect")

local dialog = boxdialog:new("dialog", rect{1, 1, 80, 25}, "Main Dialog")
```

## boxdialog:box

- Get the content box window

#### Function Prototype

::: tip API
```lua
boxdialog:box()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| window | Returns the content box window instance |

#### Usage

Access the content box to add child views:

```lua
local box = dialog:box()
local panel = box:panel()
-- Add child views in panel
```

## boxdialog:on_resize

- Handle dialog resize

#### Function Prototype

::: tip API
```lua
boxdialog:on_resize()
```
:::

#### Parameter Description

No parameters

#### Return Value

No return value

#### Usage

This method is automatically called when the dialog size changes. It relayouts the text area and content box.

Here is a complete box dialog example:

```lua
import("core.ui.boxdialog")
import("core.ui.rect")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- Create box dialog
    local dialog = boxdialog:new("dialog.main", rect{1, 1, self:width() - 1, self:height() - 1}, "Main Dialog")
    
    -- Set instruction text
    dialog:text():text_set("Use the arrow keys to navigate this window or press the hotkey of the item you wish to select followed by the <SPACEBAR>")
    
    -- Add buttons
    dialog:button_add("ok", "< OK >", function (v) self:quit() end)
    dialog:button_add("cancel", "< Cancel >", "cm_quit")
    
    self:insert(dialog)
    self._dialog = dialog
end

function demo:on_resize()
    self._dialog:bounds_set(rect{1, 1, self:width() - 1, self:height() - 1})
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

