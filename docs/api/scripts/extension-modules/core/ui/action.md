# core.ui.action

This module defines action enumeration constants for the UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.action")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `action` module provides type constants for UI event callback actions, used to set and handle various UI events.

## Predefined Action Types

The `action` module defines the following predefined action types:

| Action | Description |
|--------|-------------|
| `action.ac_on_text_changed` | Triggered when text content changes |
| `action.ac_on_selected` | Triggered when an item is selected |
| `action.ac_on_clicked` | Triggered when clicked |
| `action.ac_on_resized` | Triggered when resized |
| `action.ac_on_scrolled` | Triggered when scrolled |
| `action.ac_on_enter` | Triggered when confirmed/entered |
| `action.ac_on_load` | Triggered when loaded |
| `action.ac_on_save` | Triggered when saved |
| `action.ac_on_exit` | Triggered when exiting |

## Usage

These action constants are used to set event callback handlers:

```lua
import("core.ui.action")
import("core.ui.button")

-- Create button
local btn = button:new("ok", rect{10, 5, 20, 1}, "OK")

-- Set click event
btn:action_set(action.ac_on_enter, function (v)
    print("Button clicked!")
end)
```

## action:register

- Register custom action types

#### Function Prototype

::: tip API
```lua
action:register(tag: <string>, ...)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tag | Required. Tag name for accumulating count |
| ... | Variable arguments. Action constant names |

#### Return Value

No return value

#### Usage

Register custom action types:

```lua
import("core.ui.action")

-- Register custom actions
action:register("ac_max",
    "ac_on_custom1",
    "ac_on_custom2",
    "ac_on_custom3"
)

-- Now can use these custom actions
some_view:action_set(action.ac_on_custom1, function (v)
    print("Custom action 1 triggered")
end)
```

Here is a complete usage example:

```lua
import("core.ui.action")
import("core.ui.button")
import("core.ui.rect")
import("core.ui.application")
import("core.ui.window")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- Create window
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "Action Demo")
    
    -- Create buttons and set different events
    local btn1 = button:new("btn1", rect{5, 5, 20, 1}, "< Button1 >")
    local btn2 = button:new("btn2", rect{30, 5, 20, 1}, "< Button2 >")
    
    -- Set different event handlers
    btn1:action_set(action.ac_on_enter, function (v)
        print("Button 1 confirmed clicked")
    end)
    
    btn2:action_set(action.ac_on_enter, function (v)
        print("Button 2 confirmed clicked")
    end)
    
    -- Add buttons to window panel
    local panel = win:panel()
    panel:insert(btn1)
    panel:insert(btn2)
    
    -- Select first button
    panel:select(btn1)
    
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

