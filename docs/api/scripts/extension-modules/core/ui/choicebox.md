# core.ui.choicebox

This module provides a single-choice list box component for the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.choicebox")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `choicebox` module extends `panel` and provides a single-choice list box with:
- Single selection support (uses `(X)` to mark selected item, `( )` for unselected items)
- Keyboard navigation (Up/Down, PageUp/PageDown)
- Scroll support (when the number of options exceeds the visible area)
- Automatic resize handling
- Event callbacks (on_load, on_scrolled, on_selected)

## choicebox:new

- Create a new single-choice list box instance

#### Function Prototype

::: tip API
```lua
choicebox:new(name: <string>, bounds: <rect>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. List box name string |
| bounds | Required. List box bounds rectangle |

#### Return Value

| Type | Description |
|------|-------------|
| choicebox | Returns a single-choice list box instance |

#### Usage

Create a single-choice list box:

```lua
import("core.ui.choicebox")
import("core.ui.rect")

local choicebox = choicebox:new("my_choice", rect{10, 5, 30, 10})
```

## choicebox:load

- Load option values into the list box

#### Function Prototype

::: tip API
```lua
choicebox:load(values: <table>, selected?: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| values | Required. Array of option values |
| selected | Optional. Index of the default selected item (1-based), defaults to 1 |

#### Return Value

No return value

#### Usage

Load options and set the default selected item:

```lua
local values = {"Option 1", "Option 2", "Option 3", "Option 4"}
choicebox:load(values, 2)  -- Default to the second item
```

After loading, the `action.ac_on_load` event is triggered.

## choicebox:scrollable

- Check if the list box is scrollable

#### Function Prototype

::: tip API
```lua
choicebox:scrollable()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns `true` when the number of options exceeds the visible height, otherwise returns `false` |

#### Usage

Check if scrolling is needed:

```lua
if choicebox:scrollable() then
    print("Many options available, can scroll to view")
end
```

## choicebox:scroll

- Scroll the list box content

#### Function Prototype

::: tip API
```lua
choicebox:scroll(count: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| count | Required. Number of lines to scroll, positive for down, negative for up |

#### Return Value

No return value

#### Usage

Scroll the list box content:

```lua
choicebox:scroll(1)   -- Scroll down one line
choicebox:scroll(-1)  -- Scroll up one line
choicebox:scroll(choicebox:height())  -- Scroll down one page
```

When scrolling, the `action.ac_on_scrolled` event is triggered, passing the current scroll position ratio (0.0-1.0).

## choicebox:on_event

- Handle keyboard events

#### Function Prototype

::: tip API
```lua
choicebox:on_event(e: <event>)
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

The list box automatically handles the following keyboard events:
- `Up`: Navigate up, automatically scrolls up one page when reaching the top
- `Down`: Navigate down, automatically scrolls down one page when reaching the bottom
- `PageUp`: Scroll up one page
- `PageDown`: Scroll down one page
- `Enter` or `Space`: Select the current item

When an item is selected, the `action.ac_on_selected` event is triggered, passing the selected item's index and value.

Override this method to add custom event handling:

```lua
function my_choicebox:on_event(e)
    if e.type == event.ev_keyboard and e.key_name == "Tab" then
        -- Custom handling for Tab key
        return true
    end
    return choicebox.on_event(self, e)
end
```

## choicebox:on_resize

- Handle list box resize

#### Function Prototype

::: tip API
```lua
choicebox:on_resize()
```
:::

#### Parameter Description

No parameters

#### Return Value

No return value

#### Usage

This method is automatically called when the list box size changes. It relayouts the option items, only showing items within the currently visible range.

Here is a complete usage example:

```lua
import("core.ui.choicebox")
import("core.ui.rect")
import("core.ui.window")
import("core.ui.application")
import("core.ui.action")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- Create window
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "Choice Box Demo")
    
    -- Create single-choice list box
    local choice = choicebox:new("choices", rect{5, 5, 40, 15})
    
    -- Load option values
    local options = {"gcc", "clang", "msvc", "mingw", "icc"}
    choice:load(options, 1)  -- Default to first item
    
    -- Set selection event handler
    choice:action_set(action.ac_on_selected, function (v, index, value)
        print("Selected:", value, "(index:", index, ")")
    end)
    
    -- Set scroll event handler
    choice:action_set(action.ac_on_scrolled, function (v, ratio)
        print("Scroll position:", string.format("%.2f%%", ratio * 100))
    end)
    
    -- Add list box to window panel
    local panel = win:panel()
    panel:insert(choice)
    
    -- Select the list box
    panel:select(choice)
    
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

