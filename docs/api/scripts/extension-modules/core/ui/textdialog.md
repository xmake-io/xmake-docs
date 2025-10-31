# core.ui.textdialog

This module provides a dialog with a text area for the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.textdialog")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `textdialog` module extends `dialog` and provides a dialog with a text area. It contains a text area (textarea) and optional scrollbar support, and serves as the base for dialogs like `inputdialog` and `boxdialog`.

## textdialog:new

- Create a new text dialog instance

#### Function Prototype

::: tip API
```lua
textdialog:new(name: <string>, bounds: <rect>, title?: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Dialog name string |
| bounds | Required. Dialog bounds rectangle |
| title | Optional. Dialog title string |

#### Return Value

| Type | Description |
|------|-------------|
| textdialog | Returns a text dialog instance |

#### Usage

Create a text dialog:

```lua
import("core.ui.textdialog")
import("core.ui.rect")

local dialog = textdialog:new("text", rect{10, 5, 50, 20}, "Text Dialog")
```

## textdialog:text

- Get the text area component

#### Function Prototype

::: tip API
```lua
textdialog:text()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| textarea | Returns the text area instance |

#### Usage

Access the text area to set or get text content:

```lua
local textarea = dialog:text()
textarea:text_set("This is text content")
```

## textdialog:scrollbar

- Get the scrollbar component

#### Function Prototype

::: tip API
```lua
textdialog:scrollbar()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| scrollbar | Returns the scrollbar instance |

#### Usage

Access the scrollbar component:

```lua
local scrollbar = dialog:scrollbar()
scrollbar:show(true)
```

## textdialog:option_set

- Set dialog options

#### Function Prototype

::: tip API
```lua
textdialog:option_set(name: <string>, value: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Option name, supports: `"scrollable"` |
| value | Required. Option value |

#### Return Value

No return value

#### Usage

Enable or disable scrollbar:

```lua
-- Enable scrollbar
dialog:option_set("scrollable", true)

-- Disable scrollbar
dialog:option_set("scrollable", false)
```

## textdialog:on_event

- Handle dialog events

#### Function Prototype

::: tip API
```lua
textdialog:on_event(e: <event>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| e | Required. Event object |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns `true` if the event was handled, otherwise returns `false` |

#### Usage

The dialog automatically passes keyboard events to the text area to support scrolling.

Here is a complete text dialog example:

```lua
import("core.ui.textdialog")
import("core.ui.rect")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- Create text dialog
    local dialog = textdialog:new("text", rect{10, 5, 60, 20}, "Text Dialog")
    
    -- Set text content
    dialog:text():text_set("This is a text dialog example.\nYou can display multi-line text content.\nWhen text content exceeds the display area, you can enable scrolling.")
    
    -- Enable scrollbar
    dialog:option_set("scrollable", true)
    
    -- Add buttons
    dialog:button_add("ok", "< OK >", function (v) self:quit() end)
    
    self:insert(dialog)
    self._dialog = dialog
end

function demo:on_resize()
    if self._dialog then
        self._dialog:bounds_set(rect{10, 5, self:width() - 20, self:height() - 10})
    end
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

