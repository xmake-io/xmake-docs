# core.ui.menubar

This module provides a menu bar component for the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.menubar")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `menubar` module extends `panel` and provides menu bar display functionality.

## menubar:new

- Create a new menu bar instance

#### Function Prototype

::: tip API
```lua
menubar:new(name: <string>, bounds: <rect>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Menu bar name string |
| bounds | Required. Menu bar bounds rectangle |

#### Return Value

| Type | Description |
|------|-------------|
| menubar | Returns a menu bar instance |

#### Usage

Create a menu bar:

```lua
import("core.ui.menubar")
import("core.ui.rect")

local menubar = menubar:new("menubar", rect{1, 1, 80, 1})
```

## menubar:title

- Get the title label

#### Function Prototype

::: tip API
```lua
menubar:title()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| label | Returns the title label instance |

#### Usage

Access and customize the title label:

```lua
local title = menubar:title()
title:text_set("My Application")
title:textattr_set("red bold")
```

Here is a complete menu bar usage example:

```lua
import("core.ui.menubar")
import("core.ui.window")
import("core.ui.rect")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- Create menu bar
    local menubar = menubar:new("menubar", rect{1, 1, self:width() - 1, 1})
    menubar:title():text_set("Xmake Demo Application")
    menubar:title():textattr_set("red bold")
    
    -- Create main window
    local win = window:new("main", rect{1, 2, self:width() - 1, self:height() - 2}, "Main Window")
    
    -- Add to application
    self:insert(menubar)
    self:insert(win)
    
    self._menubar = menubar
    self._win = win
end

function demo:on_resize()
    self._menubar:bounds_set(rect{1, 1, self:width() - 1, 1})
    self._win:bounds_set(rect{1, 2, self:width() - 1, self:height() - 2})
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

