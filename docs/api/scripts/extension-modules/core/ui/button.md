# core.ui.button

This module provides a clickable button component for the terminal UI.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.button")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `button` module extends `label` and provides a clickable button with:
- Selectable and focusable support
- Mouse click handling
- Enter key activation
- Visual feedback (reverse video when selected and focused)

## button:new

- Create a new button instance

#### Function Prototype

::: tip API
```lua
button:new(name: <string>, bounds: <rect>, text: <string>, on_action?: <function>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Button name string |
| bounds | Required. Button bounds rectangle |
| text | Required. Button text to display |
| on_action | Optional. Function to call when button is activated |

#### Return Value

| Type | Description |
|------|-------------|
| button | Returns a button instance |

#### Usage

Create a button with action handler:

```lua
import("core.ui.button")
import("core.ui.rect")

local btn = button:new("ok", rect{10, 5, 20, 1}, "Ok", function (v)
    print("Button clicked!")
    v:parent():quit()
end)
```

## button:text

- Get the button text

#### Function Prototype

::: tip API
```lua
button:text()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the button text |

#### Usage

Get the button text:

```lua
local text = btn:text()
print(text)  -- Output: Ok
```

## button:text_set

- Set the button text

#### Function Prototype

::: tip API
```lua
button:text_set(text: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| text | Required. Button text to display |

#### Return Value

| Type | Description |
|------|-------------|
| button | Returns the button instance (for method chaining) |

#### Usage

Set or update the button text:

```lua
btn:text_set("Cancel")
btn:text_set("< OK >")  -- Can use brackets for visual styling
```

## button:textattr

- Get the text attribute

#### Function Prototype

::: tip API
```lua
button:textattr()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the text attribute string |

#### Usage

Get the current text attribute:

```lua
local attr = btn:textattr()
```

## button:textattr_set

- Set the text attribute (color, style)

#### Function Prototype

::: tip API
```lua
button:textattr_set(attr: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| attr | Required. Text attribute string (e.g., "red bold") |

#### Return Value

| Type | Description |
|------|-------------|
| button | Returns the button instance (for method chaining) |

#### Usage

Set button text color and style:

```lua
btn:textattr_set("green")           -- Green text
btn:textattr_set("yellow bold")     -- Yellow bold text
btn:textattr_set("cyan onblack")    -- Cyan text on black background
```

## button:action_set

- Set the button action handler

#### Function Prototype

::: tip API
```lua
button:action_set(action_type: <string>, handler: <function>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| action_type | Required. Action type (e.g., `action.ac_on_enter`) |
| handler | Required. Function to call when action is triggered |

#### Return Value

| Type | Description |
|------|-------------|
| button | Returns the button instance (for method chaining) |

#### Usage

Set custom action handler:

```lua
import("core.ui.action")

btn:action_set(action.ac_on_enter, function (v)
    print("Button activated!")
end)
```

## button:on_event

- Handle keyboard events

#### Function Prototype

::: tip API
```lua
button:on_event(e: <event>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| e | Required. Event object |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns `true` if Enter key was handled, `nil` otherwise |

#### Usage

This is automatically called when the button receives keyboard events. When selected and Enter is pressed, it triggers the button's action.

## button:on_draw

- Draw the button view

#### Function Prototype

::: tip API
```lua
button:on_draw(transparent: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| transparent | Optional. Draw with transparency |

#### Return Value

No return value

#### Usage

This is automatically called when the button needs to be drawn. The button is displayed with reverse video (inverted colors) when selected and focused. Here's a complete example:

```lua
import("core.ui.button")
import("core.ui.rect")
import("core.ui.application")
import("core.ui.window")
import("core.ui.action")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- Create window
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "Button Demo")
    
    -- Create buttons
    local ok_btn = button:new("ok", rect{5, 5, 15, 1}, "< OK >", function (v)
        print("OK button clicked!")
    end)
    
    local cancel_btn = button:new("cancel", rect{25, 5, 20, 1}, "< Cancel >", function (v)
        print("Cancel button clicked!")
        self:quit()
    end)
    
    local apply_btn = button:new("apply", rect{50, 5, 18, 1}, "< Apply >", function (v)
        print("Apply button clicked!")
    end)
    
    -- Set different text attributes
    ok_btn:textattr_set("green")
    cancel_btn:textattr_set("red")
    apply_btn:textattr_set("cyan")
    
    -- Add buttons to window panel
    local panel = win:panel()
    panel:insert(ok_btn)
    panel:insert(cancel_btn)
    panel:insert(apply_btn)
    
    -- Select first button
    panel:select(ok_btn)
    
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

