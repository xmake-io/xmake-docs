# core.ui.application

This module provides the main application container for the terminal UI system. You can inherit from `application` to implement your own terminal UI applications.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.application")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The application module uses inheritance. You create your own application instance and customize its behavior:

```lua
import("core.ui.application")

local app = application()

function app:init()
    -- Your initialization code
end
```

## application:new

- Create a new application instance

#### Function Prototype

::: tip API
```lua
local app = application()
```
:::

#### Parameter Description

No parameters for constructor

#### Return Value

| Type | Description |
|------|-------------|
| application | Returns a new application instance |

#### Usage

Create an application instance that you can customize:

```lua
import("core.ui.application")

local demo = application()
```

## application:init

- Initialize the application

#### Function Prototype

::: tip API
```lua
application:init(name: <string>, argv?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Application name string |
| argv | Optional. Command line arguments table |

#### Return Value

No return value

#### Usage

Initialize your custom application. This is called automatically by `run()`:

```lua
function demo:init()
    application.init(self, "myapp")
    self:background_set("blue")
    
    -- Add your UI components here
    self:insert(self:main_dialog())
end
```

## application:run

- Run the application and start the event loop

#### Function Prototype

::: tip API
```lua
application:run(...)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| ... | Optional. Additional arguments |

#### Return Value

No return value

#### Usage

Start your application. This initializes the UI, calls `init()`, and starts the event loop:

```lua
local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    self:insert(self:main_dialog())
end

-- Start the application
demo:run()
```

## application:background_set

- Set the application background color

#### Function Prototype

::: tip API
```lua
application:background_set(color: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| color | Required. Color name (e.g., "blue", "red") |

#### Return Value

No return value

#### Usage

Set the background color for your application:

```lua
self:background_set("blue")
```

## application:insert

- Insert a view into the application

#### Function Prototype

::: tip API
```lua
application:insert(view: <view>, opt?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| view | Required. View to insert |
| opt | Optional. Options table, supports: `{centerx = true, centery = true}` |

#### Return Value

No return value

#### Usage

Add views to your application with optional positioning:

```lua
-- Add a dialog
self:insert(self:main_dialog())

-- Add a centered dialog
self:insert(self:input_dialog(), {centerx = true, centery = true})
```

## application:on_resize

- Handle window resize events

#### Function Prototype

::: tip API
```lua
application:on_resize()
```
:::

#### Parameter Description

No parameters

#### Return Value

No return value

#### Usage

Override this method to handle resize events and update your UI layout:

```lua
function demo:on_resize()
    self:main_dialog():bounds_set(rect{1, 1, self:width() - 1, self:height() - 1})
    self:center(self:input_dialog(), {centerx = true, centery = true})
    application.on_resize(self)
end
```

## application:menubar

- Get the application's menu bar

#### Function Prototype

::: tip API
```lua
application:menubar()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| menubar | Returns the menu bar instance |

#### Usage

Access the menu bar component:

```lua
local menubar = app:menubar()
```

## application:desktop

- Get the application's desktop area

#### Function Prototype

::: tip API
```lua
application:desktop()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| desktop | Returns the desktop instance |

#### Usage

Access the desktop area for placing views:

```lua
local desktop = app:desktop()
```

## application:statusbar

- Get the application's status bar

#### Function Prototype

::: tip API
```lua
application:statusbar()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| statusbar | Returns the status bar instance |

#### Usage

Access the status bar component:

```lua
local statusbar = app:statusbar()
statusbar:text_set("Ready")
```

