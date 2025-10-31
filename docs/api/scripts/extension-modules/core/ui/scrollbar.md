# core.ui.scrollbar

This module provides a scrollbar component for the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.scrollbar")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `scrollbar` module extends `view` and provides horizontal and vertical scrollbar functionality.

## scrollbar:new

- Create a new scrollbar instance

#### Function Prototype

::: tip API
```lua
scrollbar:new(name: <string>, bounds: <rect>, vertical?: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Scrollbar name string |
| bounds | Required. Scrollbar bounds rectangle |
| vertical | Optional. Whether it's a vertical scrollbar, defaults to `true` |

#### Return Value

| Type | Description |
|------|-------------|
| scrollbar | Returns a scrollbar instance |

#### Usage

Create vertical and horizontal scrollbars:

```lua
import("core.ui.scrollbar")
import("core.ui.rect")

local vscrollbar = scrollbar:new("vbar", rect{50, 1, 1, 20}, true)  -- Vertical scrollbar
local hscrollbar = scrollbar:new("hbar", rect{1, 20, 50, 1}, false) -- Horizontal scrollbar
```

## scrollbar:progress

- Get current scroll progress

#### Function Prototype

::: tip API
```lua
scrollbar:progress()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns progress value, range 0.0 to 1.0 |

#### Usage

Get current scroll progress:

```lua
local progress = scrollbar:progress()
print("Scroll progress:", progress)
```

## scrollbar:progress_set

- Set scroll progress

#### Function Prototype

::: tip API
```lua
scrollbar:progress_set(progress: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| progress | Required. Progress value, range 0.0 to 1.0 |

#### Return Value

| Type | Description |
|------|-------------|
| scrollbar | Returns the scrollbar instance (for chaining) |

#### Usage

Set scroll progress:

```lua
scrollbar:progress_set(0.5)  -- Set to middle position
scrollbar:progress_set(0)    -- Set to top
scrollbar:progress_set(1)    -- Set to bottom
```

## scrollbar:stepwidth

- Get step width

#### Function Prototype

::: tip API
```lua
scrollbar:stepwidth()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns step width, range 0.0 to 1.0 |

#### Usage

Get step width:

```lua
local stepwidth = scrollbar:stepwidth()
```

## scrollbar:stepwidth_set

- Set step width

#### Function Prototype

::: tip API
```lua
scrollbar:stepwidth_set(stepwidth: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| stepwidth | Required. Step width, range 0.0 to 1.0 |

#### Return Value

| Type | Description |
|------|-------------|
| scrollbar | Returns the scrollbar instance (for chaining) |

#### Usage

Set step width:

```lua
scrollbar:stepwidth_set(0.1)  -- Scroll 10% each time
```

## scrollbar:vertical

- Check if it's a vertical scrollbar

#### Function Prototype

::: tip API
```lua
scrollbar:vertical()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns `true` if vertical, otherwise returns `false` |

#### Usage

Check scrollbar direction:

```lua
if scrollbar:vertical() then
    print("This is a vertical scrollbar")
else
    print("This is a horizontal scrollbar")
end
```

## scrollbar:vertical_set

- Set scrollbar direction

#### Function Prototype

::: tip API
```lua
scrollbar:vertical_set(vertical: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| vertical | Required. Set direction, `true` for vertical, `false` for horizontal |

#### Return Value

| Type | Description |
|------|-------------|
| scrollbar | Returns the scrollbar instance (for chaining) |

#### Usage

Set scrollbar direction:

```lua
scrollbar:vertical_set(true)   -- Set to vertical
scrollbar:vertical_set(false)  -- Set to horizontal
```

## scrollbar:char

- Get scrollbar character

#### Function Prototype

::: tip API
```lua
scrollbar:char()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the character displayed in the scrollbar |

#### Usage

Get scrollbar character:

```lua
local char = scrollbar:char()
```

## scrollbar:char_set

- Set scrollbar character

#### Function Prototype

::: tip API
```lua
scrollbar:char_set(char: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| char | Required. Character displayed in the scrollbar |

#### Return Value

| Type | Description |
|------|-------------|
| scrollbar | Returns the scrollbar instance (for chaining) |

#### Usage

Set scrollbar character:

```lua
scrollbar:char_set('#')      -- Use # character
scrollbar:char_set('\u2588') -- Use block character
```

## scrollbar:charattr

- Get scrollbar character attribute

#### Function Prototype

::: tip API
```lua
scrollbar:charattr()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns character attribute string |

#### Usage

Get character attribute:

```lua
local attr = scrollbar:charattr()
```

## scrollbar:charattr_set

- Set scrollbar character attribute

#### Function Prototype

::: tip API
```lua
scrollbar:charattr_set(attr: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| attr | Required. Character attribute string |

#### Return Value

| Type | Description |
|------|-------------|
| scrollbar | Returns the scrollbar instance (for chaining) |

#### Usage

Set character attribute:

```lua
scrollbar:charattr_set("yellow on blue bold")  -- Yellow bold text on blue background
```

## scrollbar:scroll

- Scroll the scrollbar

#### Function Prototype

::: tip API
```lua
scrollbar:scroll(steps?: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| steps | Optional. Number of steps, positive for down/right, negative for up/left, defaults to 1 |

#### Return Value

No return value

#### Usage

Scroll the scrollbar:

```lua
scrollbar:scroll(1)   -- Scroll down/right one step
scrollbar:scroll(-1)  -- Scroll up/left one step
scrollbar:scroll(5)   -- Scroll 5 steps
```

## scrollbar:on_event

- Handle keyboard events

#### Function Prototype

::: tip API
```lua
scrollbar:on_event(e: <event>)
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

The scrollbar automatically handles the following keyboard events:
- Vertical scrollbar: `Up` (scroll up), `Down` (scroll down)
- Horizontal scrollbar: `Left` (scroll left), `Right` (scroll right)

Here is a complete scrollbar usage example:

```lua
import("core.ui.scrollbar")
import("core.ui.rect")
import("core.ui.label")
import("core.ui.window")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- Create window
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "Scrollbar Demo")
    
    -- Create scrollbar
    local scrollbar = scrollbar:new("scroll", rect{self:width() - 2, 1, 1, self:height() - 2}, true)
    scrollbar:char_set('#')
    scrollbar:charattr_set("yellow on blue")
    scrollbar:stepwidth_set(0.1)
    
    -- Create label to display current progress
    local label = label:new("progress", rect{1, 1, 30, 1}, "Progress: 0%")
    
    -- Set scroll event
    scrollbar:action_set(action.ac_on_scrolled, function (v, progress)
        local text = string.format("Progress: %.1f%%", progress * 100)
        label:text_set(text)
    end)
    
    -- Add components to window panel
    local panel = win:panel()
    panel:insert(label)
    panel:insert(scrollbar)
    
    self:insert(win)
    self._win = win
    self._scrollbar = scrollbar
end

function demo:on_resize()
    self._win:bounds_set(rect{1, 1, self:width() - 1, self:height() - 1})
    self._scrollbar:bounds_set(rect{self:width() - 2, 1, 1, self:height() - 2})
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

