# core.ui.label

This module provides a text label view for displaying text in the terminal UI.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.label")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `label` module extends `view` and provides a simple text display component with:
- Text content management
- Text attribute (color, bold, etc.) support
- Automatic text wrapping based on width
- UTF-8 character width calculation

## label:new

- Create a new label instance

#### Function Prototype

::: tip API
```lua
label:new(name: <string>, bounds: <rect>, text: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Label name string |
| bounds | Required. Label bounds rectangle |
| text | Required. Text content to display |

#### Return Value

| Type | Description |
|------|-------------|
| label | Returns a label instance |

#### Usage

Create a label with text:

```lua
import("core.ui.label")
import("core.ui.rect")

local lbl = label:new("hello", rect{1, 1, 20, 1}, "Hello, World!")
```

## label:text

- Get the current text content

#### Function Prototype

::: tip API
```lua
label:text()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the text content |

#### Usage

Get the text content of a label:

```lua
local text = lbl:text()
print(text)  -- Output: Hello, World!
```

## label:text_set

- Set the text content

#### Function Prototype

::: tip API
```lua
label:text_set(text: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| text | Required. Text content to display |

#### Return Value

| Type | Description |
|------|-------------|
| label | Returns the label instance (for method chaining) |

#### Usage

Set or update the text content:

```lua
lbl:text_set("New Text")
lbl:text_set("Line 1\nLine 2")  -- Multi-line text
```

## label:textattr

- Get the text attribute string

#### Function Prototype

::: tip API
```lua
label:textattr()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the text attribute string (e.g., "red bold") |

#### Usage

Get the current text attribute:

```lua
local attr = lbl:textattr()
print(attr)  -- Output: black
```

## label:textattr_set

- Set the text attribute (color, style)

#### Function Prototype

::: tip API
```lua
label:textattr_set(attr: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| attr | Required. Text attribute string (e.g., "red bold", "yellow onblue") |

#### Return Value

| Type | Description |
|------|-------------|
| label | Returns the label instance (for method chaining) |

#### Usage

Set text color and style:

```lua
lbl:textattr_set("red")                    -- Red text
lbl:textattr_set("yellow bold")           -- Yellow bold text
lbl:textattr_set("cyan onblue")           -- Cyan text on blue background
lbl:textattr_set("green bold onblack")    -- Green bold text on black background
```

## label:textattr_val

- Get the compiled text attribute value

#### Function Prototype

::: tip API
```lua
label:textattr_val()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the numeric attribute value (for curses) |

#### Usage

This is typically used internally by the drawing system. The returned value combines the text attribute with the view's background color.

## label:splitext

- Split text into lines based on width

#### Function Prototype

::: tip API
```lua
label:splitext(text: <string>, width?: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| text | Required. Text to split |
| width | Optional. Maximum line width (defaults to label width) |

#### Return Value

| Type | Description |
|------|-------------|
| table | Returns array of text lines |

#### Usage

Split text into multiple lines:

```lua
local lines = lbl:splitext("This is a long text that needs to be wrapped", 10)
-- Returns: {"This is a ", "long text ", "that needs ", "to be ", "wrapped"}
```

## label:on_draw

- Draw the label view

#### Function Prototype

::: tip API
```lua
label:on_draw(transparent: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| transparent | Optional. Draw with transparency |

#### Return Value

No return value

#### Usage

This is automatically called by the UI framework when the label needs to be drawn.

