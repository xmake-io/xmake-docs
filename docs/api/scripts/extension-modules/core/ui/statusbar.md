# core.ui.statusbar

This module provides a status bar component for the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.statusbar")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `statusbar` module extends `panel` and provides status bar display functionality.

## statusbar:new

- Create a new status bar instance

#### Function Prototype

::: tip API
```lua
statusbar:new(name: <string>, bounds: <rect>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Status bar name string |
| bounds | Required. Status bar bounds rectangle |

#### Return Value

| Type | Description |
|------|-------------|
| statusbar | Returns a status bar instance |

#### Usage

Create a status bar:

```lua
import("core.ui.statusbar")
import("core.ui.rect")

local statusbar = statusbar:new("status", rect{1, 25, 80, 1})
```

## statusbar:info

- Get the info label

#### Function Prototype

::: tip API
```lua
statusbar:info()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| label | Returns the info label instance |

#### Usage

Access and customize the info label:

```lua
local info = statusbar:info()
info:text_set("Ready")
info:textattr_set("blue bold")
```

Here is a complete status bar usage example:

```lua
import("core.ui.statusbar")
import("core.ui.window")
import("core.ui.rect")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- Create status bar
    local statusbar = statusbar:new("status", rect{1, self:height() - 1, self:width() - 1, 1})
    statusbar:info():text_set("Ready")
    statusbar:info():textattr_set("blue bold")
    
    -- Create main window
    local win = window:new("main", rect{1, 2, self:width() - 1, self:height() - 3}, "Main Window")
    
    -- Add to application
    self:insert(win)
    self:insert(statusbar)
    
    self._statusbar = statusbar
    self._win = win
end

function demo:on_resize()
    self._win:bounds_set(rect{1, 2, self:width() - 1, self:height() - 3})
    self._statusbar:bounds_set(rect{1, self:height() - 1, self:width() - 1, 1})
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

