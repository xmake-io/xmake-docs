# core.ui.choicedialog

This module provides a single-choice selection dialog for the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.choicedialog")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `choicedialog` module extends `boxdialog` and provides a single-choice selection dialog. It contains a `choicebox` for displaying options and a scrollbar for long lists.

## choicedialog:new

- Create a new choice dialog instance

#### Function Prototype

::: tip API
```lua
choicedialog:new(name: <string>, bounds: <rect>, title: <string>)
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
| choicedialog | Returns a choice dialog instance |

#### Usage

Create a choice dialog:

```lua
import("core.ui.choicedialog")
import("core.ui.rect")

local dialog = choicedialog:new("choice", rect{10, 5, 50, 20}, "Select Option")
```

## choicedialog:choicebox

- Get the choice list box

#### Function Prototype

::: tip API
```lua
choicedialog:choicebox()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| choicebox | Returns the choice list box instance |

#### Usage

Access the choice list box to load options:

```lua
local choicebox = dialog:choicebox()
choicebox:load({"Option 1", "Option 2", "Option 3"}, 1)
```

## choicedialog:scrollbar_box

- Get the scrollbar component

#### Function Prototype

::: tip API
```lua
choicedialog:scrollbar_box()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| scrollbar | Returns the scrollbar instance |

#### Usage

Access the scrollbar component for customization:

```lua
local scrollbar = dialog:scrollbar_box()
scrollbar:show(true)
```

## choicedialog:on_event

- Handle dialog events

#### Function Prototype

::: tip API
```lua
choicedialog:on_event(e: <event>)
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

The dialog automatically handles the following events:
- `Up/Down`: Navigate options
- `Space`: Confirm selection

Here is a complete choice dialog example:

```lua
import("core.ui.choicedialog")
import("core.ui.rect")
import("core.ui.event")
import("core.ui.application")
import("core.ui.action")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- Create choice dialog
    local dialog = choicedialog:new("choice", rect{1, 1, self:width() - 1, self:height() - 1}, "Select Compiler")
    
    -- Load options
    local options = {"gcc", "clang", "msvc"}
    dialog:choicebox():load(options, 1)
    
    -- Set selection event
    dialog:choicebox():action_set(action.ac_on_selected, function (v, index, value)
        print("Selected:", value, "(index:", index, ")")
    end)
    
    -- Handle select button
    dialog:button("select"):action_set(action.ac_on_enter, function (v, e)
        local current = dialog:choicebox():current()
        if current then
            local value = current:extra("value")
            local index = current:extra("index")
            print("Final choice:", value, "(index:", index, ")")
        end
        self:quit()
    end)
    
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

