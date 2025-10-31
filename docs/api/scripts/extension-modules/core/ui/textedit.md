# core.ui.textedit

This module provides a text editor component for the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.textedit")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `textedit` module extends `textarea` and provides a text editor with editable text. It supports multi-line editing, cursor display, and keyboard input.

## textedit:new

- Create a new text editor instance

#### Function Prototype

::: tip API
```lua
textedit:new(name: <string>, bounds: <rect>, text?: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Text editor name string |
| bounds | Required. Text editor bounds rectangle |
| text | Optional. Initial text content |

#### Return Value

| Type | Description |
|------|-------------|
| textedit | Returns a text editor instance |

#### Usage

Create a text editor:

```lua
import("core.ui.textedit")
import("core.ui.rect")

local textedit = textedit:new("editor", rect{10, 5, 50, 10}, "Initial text")
```

## textedit:text_set

- Set text content

#### Function Prototype

::: tip API
```lua
textedit:text_set(text: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| text | Required. Text content to set |

#### Return Value

| Type | Description |
|------|-------------|
| textedit | Returns the text editor instance (for chaining) |

#### Usage

Set or update text content:

```lua
textedit:text_set("New text content")
```

After setting text, it automatically scrolls to the bottom and displays the cursor.

## textedit:on_event

- Handle keyboard events

#### Function Prototype

::: tip API
```lua
textedit:on_event(e: <event>)
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

The text editor automatically handles the following keyboard events:
- Regular characters: Insert characters
- `Enter`: Insert newline (when multi-line mode is enabled)
- `Backspace`: Delete character before cursor (supports UTF-8 characters)
- `Ctrl+V`: Paste clipboard content
- `Up/Down`: Scroll text

Here is a complete text editor usage example:

```lua
import("core.ui.textedit")
import("core.ui.window")
import("core.ui.rect")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- Create window
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "Text Editor Demo")
    
    -- Create text editor
    local editor = textedit:new("editor", rect{2, 2, 50, 15}, "Enter text here...")
    
    -- Set text attribute
    editor:textattr_set("white on blue")
    
    -- Add text editor to window panel
    local panel = win:panel()
    panel:insert(editor)
    
    -- Select text editor
    panel:select(editor)
    
    self:insert(win)
    self._win = win
end

function demo:on_resize()
    self._win:bounds_set(rect{1, 1, self:width() - 1, self:height() - 1})
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

