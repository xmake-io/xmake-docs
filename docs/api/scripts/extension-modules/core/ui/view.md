# core.ui.view

This module provides the base view component for the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.view")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `view` module is the base class for all UI components. It extends `object` and provides core view functionality including drawing, event handling, state management, option management, and attribute management.

## view:new

- Create a new view instance

#### Function Prototype

::: tip API
```lua
view:new(name: <string>, bounds: <rect>, ...)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. View name string |
| bounds | Required. View bounds rectangle |
| ... | Variable arguments |

#### Return Value

| Type | Description |
|------|-------------|
| view | Returns a view instance |

#### Usage

Create a view instance:

```lua
import("core.ui.view")
import("core.ui.rect")

local v = view:new("myview", rect{1, 1, 80, 25})
```

## view:name

- Get the view name

#### Function Prototype

::: tip API
```lua
view:name()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the view name |

#### Usage

Get the view name:

```lua
local name = v:name()
print(name)  -- Output: myview
```

## view:bounds

- Get the view bounds rectangle

#### Function Prototype

::: tip API
```lua
view:bounds()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| rect | Returns the view bounds rectangle |

#### Usage

Get the view bounds:

```lua
local bounds = v:bounds()
print(bounds:sx(), bounds:sy(), bounds:ex(), bounds:ey())
```

## view:bounds_set

- Set the view bounds rectangle

#### Function Prototype

::: tip API
```lua
view:bounds_set(bounds: <rect>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| bounds | Required. New bounds rectangle |

#### Return Value

No return value

#### Usage

Set the view bounds:

```lua
v:bounds_set(rect{10, 5, 50, 20})
```

## view:width

- Get the view width

#### Function Prototype

::: tip API
```lua
view:width()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the view width |

#### Usage

Get the view width:

```lua
local w = v:width()
```

## view:height

- Get the view height

#### Function Prototype

::: tip API
```lua
view:height()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the view height |

#### Usage

Get the view height:

```lua
local h = v:height()
```

## view:parent

- Get the parent view

#### Function Prototype

::: tip API
```lua
view:parent()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| view | Returns the parent view instance or `nil` |

#### Usage

Get the parent view:

```lua
local parent = v:parent()
```

## view:application

- Get the application instance

#### Function Prototype

::: tip API
```lua
view:application()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| application | Returns the application instance |

#### Usage

Get the application instance:

```lua
local app = v:application()
app:quit()
```

## view:canvas

- Get the view canvas

#### Function Prototype

::: tip API
```lua
view:canvas()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| canvas | Returns the canvas instance |

#### Usage

Get the canvas for drawing operations:

```lua
local canvas = v:canvas()
canvas:move(0, 0):putstr("Hello")
```

## view:state

- Get the view state

#### Function Prototype

::: tip API
```lua
view:state(name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. State name |

#### Return Value

| Type | Description |
|------|-------------|
| any | Returns the state value |

#### Usage

Get the view state. Common states include:
- `visible`: Whether visible
- `cursor_visible`: Whether cursor is visible
- `selected`: Whether selected
- `focused`: Whether focused

```lua
local is_visible = v:state("visible")
```

## view:state_set

- Set the view state

#### Function Prototype

::: tip API
```lua
view:state_set(name: <string>, enable: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. State name |
| enable | Required. Whether to enable |

#### Return Value

| Type | Description |
|------|-------------|
| view | Returns the view instance (for chaining) |

#### Usage

Set the view state:

```lua
v:state_set("visible", true)
```

## view:option

- Get the view option

#### Function Prototype

::: tip API
```lua
view:option(name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Option name |

#### Return Value

| Type | Description |
|------|-------------|
| any | Returns the option value |

#### Usage

Get the view option. Common options include:
- `selectable`: Whether selectable
- `mouseable`: Whether mouse support

```lua
local is_selectable = v:option("selectable")
```

## view:option_set

- Set the view option

#### Function Prototype

::: tip API
```lua
view:option_set(name: <string>, enable: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Option name |
| enable | Required. Whether to enable |

#### Return Value

No return value

#### Usage

Set the view option:

```lua
v:option_set("selectable", true)
```

## view:attr

- Get the view attribute

#### Function Prototype

::: tip API
```lua
view:attr(name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Attribute name |

#### Return Value

| Type | Description |
|------|-------------|
| any | Returns the attribute value |

#### Usage

Get the view attribute:

```lua
local bg = v:attr("background")
```

## view:attr_set

- Set the view attribute

#### Function Prototype

::: tip API
```lua
view:attr_set(name: <string>, value: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Attribute name |
| value | Required. Attribute value |

#### Return Value

| Type | Description |
|------|-------------|
| view | Returns the view instance (for chaining) |

#### Usage

Set the view attribute:

```lua
v:attr_set("background", "blue")
```

## view:background

- Get the background color

#### Function Prototype

::: tip API
```lua
view:background()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the background color name |

#### Usage

Get the background color:

```lua
local bg = v:background()
```

## view:background_set

- Set the background color

#### Function Prototype

::: tip API
```lua
view:background_set(color: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| color | Required. Color name |

#### Return Value

| Type | Description |
|------|-------------|
| view | Returns the view instance (for chaining) |

#### Usage

Set the background color:

```lua
v:background_set("blue")
```

## view:action_set

- Set the action handler

#### Function Prototype

::: tip API
```lua
view:action_set(name: <string>, on_action: <function>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Action name |
| on_action | Required. Action handler function |

#### Return Value

| Type | Description |
|------|-------------|
| view | Returns the view instance (for chaining) |

#### Usage

Set the action handler:

```lua
import("core.ui.action")

v:action_set(action.ac_on_clicked, function (view)
    print("View clicked")
end)
```

## view:action_on

- Trigger an action

#### Function Prototype

::: tip API
```lua
view:action_on(name: <string>, ...)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Action name |
| ... | Variable arguments, passed to action handler |

#### Return Value

| Type | Description |
|------|-------------|
| any | Returns the action handler's return value |

#### Usage

Trigger an action:

```lua
import("core.ui.action")

v:action_on(action.ac_on_clicked)
```

## view:invalidate

- Invalidate the view (needs redraw)

#### Function Prototype

::: tip API
```lua
view:invalidate(bounds?: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| bounds | Optional. Whether resize is needed |

#### Return Value

No return value

#### Usage

Invalidate the view to trigger redraw:

```lua
v:invalidate()        -- Mark as needing redraw
v:invalidate(true)    -- Mark as needing resize
```

## view:show

- Show or hide the view

#### Function Prototype

::: tip API
```lua
view:show(visible: <boolean>, opt?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| visible | Required. Whether to show |
| opt | Optional. Option table, supports: `{focused = true}` |

#### Return Value

No return value

#### Usage

Show or hide the view:

```lua
v:show(true)                          -- Show
v:show(false)                         -- Hide
v:show(true, {focused = true})        -- Show and focus
```

## view:cursor_move

- Move cursor position

#### Function Prototype

::: tip API
```lua
view:cursor_move(x: <number>, y: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| x | Required. Cursor X coordinate |
| y | Required. Cursor Y coordinate |

#### Return Value

| Type | Description |
|------|-------------|
| view | Returns the view instance (for chaining) |

#### Usage

Move cursor position:

```lua
v:cursor_move(10, 5)
```

## view:cursor_show

- Show or hide cursor

#### Function Prototype

::: tip API
```lua
view:cursor_show(visible: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| visible | Required. Whether to show cursor |

#### Return Value

| Type | Description |
|------|-------------|
| view | Returns the view instance (for chaining) |

#### Usage

Show or hide cursor:

```lua
v:cursor_show(true)   -- Show cursor
v:cursor_show(false)  -- Hide cursor
```

## view:on_draw

- Draw the view

#### Function Prototype

::: tip API
```lua
view:on_draw(transparent: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| transparent | Optional. Whether to draw transparently |

#### Return Value

No return value

#### Usage

This method is automatically called when drawing the view. Override in subclasses to implement custom drawing:

```lua
function my_view:on_draw(transparent)
    -- Call parent method to draw background
    view.on_draw(self, transparent)
    
    -- Custom drawing content
    local canvas = self:canvas()
    canvas:move(0, 0):putstr("My View")
end
```

## view:on_event

- Handle events

#### Function Prototype

::: tip API
```lua
view:on_event(e: <event>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| e | Required. Event object |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns `true` if event was handled, otherwise returns `false` |

#### Usage

This method is automatically called when handling events. Override in subclasses to implement custom event handling:

```lua
function my_view:on_event(e)
    if e.type == event.ev_keyboard and e.key_name == "Enter" then
        -- Handle Enter key
        return true
    end
    return view.on_event(self, e)
end
```

Here is a complete custom view example:

```lua
import("core.ui.view")
import("core.ui.window")
import("core.ui.rect")
import("core.ui.application")
import("core.ui.event")
import("core.ui.action")

-- Define custom view
local myview = myview or view()

function myview:init(name, bounds)
    view.init(self, name, bounds)
    self:background_set("cyan")
    self:option_set("selectable", true)
end

function myview:on_draw(transparent)
    view.on_draw(self, transparent)
    
    local canvas = self:canvas()
    local textattr = curses.calc_attr({"yellow", "bold"})
    canvas:attr(textattr):move(0, 0):putstr("Custom View")
end

function myview:on_event(e)
    if e.type == event.ev_keyboard and e.key_name == "Enter" then
        print("Custom view activated")
        return true
    end
    return view.on_event(self, e)
end

-- Use custom view
local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- Create window
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "Custom View Demo")
    
    -- Create custom view
    local custom = myview:new("custom", rect{10, 5, 40, 10})
    
    -- Add view to window panel
    local panel = win:panel()
    panel:insert(custom)
    panel:select(custom)
    
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

