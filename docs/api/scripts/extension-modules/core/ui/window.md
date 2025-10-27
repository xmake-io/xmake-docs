# core.ui.window

This module provides a window with border, title, and panel support.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.window")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `window` module extends `panel` and provides a complete window container with:
- Border and shadow support
- Title bar (centered)
- Content panel for child views
- Tab key navigation between focusable views

## window:new

- Create a new window instance

#### Function Prototype

::: tip API
```lua
window:new(name: <string>, bounds: <rect>, title?: <string>, shadow?: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Window name string |
| bounds | Required. Window bounds rectangle |
| title | Optional. Window title string (centered at top) |
| shadow | Optional. Show shadow effect (`true` or `false`, default `false`) |

#### Return Value

| Type | Description |
|------|-------------|
| window | Returns a window instance |

#### Usage

Create a window with title and shadow:

```lua
import("core.ui.window")
import("core.ui.rect")

local win = window:new("main", rect{10, 5, 60, 20}, "Main Window", true)
```

## window:frame

- Get the frame panel

#### Function Prototype

::: tip API
```lua
window:frame()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| panel | Returns the frame panel instance |

#### Usage

Access the frame panel to customize its appearance:

```lua
local frame = win:frame()
frame:background_set("cyan")
```

## window:panel

- Get the content panel

#### Function Prototype

::: tip API
```lua
window:panel()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| panel | Returns the content panel instance |

#### Usage

Access the content panel to add child views:

```lua
local panel = win:panel()
panel:insert(label:new("label1", rect{1, 1, 20, 1}, "Hello"))
```

## window:title

- Get the title label

#### Function Prototype

::: tip API
```lua
window:title()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| label | Returns the title label instance or `nil` if no title was set |

#### Usage

Access and customize the title label:

```lua
local title = win:title()
if title then
    title:text_set("New Title")
    title:textattr_set("red bold")
end
```

## window:shadow

- Get the shadow view

#### Function Prototype

::: tip API
```lua
window:shadow()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| view | Returns the shadow view instance or `nil` if shadow was not enabled |

#### Usage

Access the shadow view:

```lua
local shadow = win:shadow()
if shadow then
    shadow:background_set("gray")
end
```

## window:border

- Get the border component

#### Function Prototype

::: tip API
```lua
window:border()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| border | Returns the border instance |

#### Usage

Access the border component:

```lua
local border = win:border()
```

## window:on_event

- Handle keyboard events for tab navigation

#### Function Prototype

::: tip API
```lua
window:on_event(e: <event>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| e | Required. Event object |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns `true` if Tab key was handled, `nil` otherwise |

#### Usage

The window automatically handles Tab key navigation between focusable views in the panel:

```lua
-- Tab key is automatically handled to navigate focus
```

## window:on_resize

- Handle window resize

#### Function Prototype

::: tip API
```lua
window:on_resize()
```
:::

#### Parameter Description

No parameters

#### Return Value

No return value

#### Usage

This is automatically called when the window is resized. It adjusts:
- Frame bounds
- Shadow bounds (if enabled)
- Border bounds
- Title position (centered)
- Panel bounds (adjusted with 1 unit inset)

