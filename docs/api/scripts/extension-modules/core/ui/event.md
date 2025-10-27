# core.ui.event

This module provides event types and classes for the terminal UI system.

::: tip TIP
To use this module, you need to import it first: `import("core.ui.event")`
:::

::: tip NOTE
The UI module is primarily used for xmake's internal `xmake f --menu` menu-based visual configuration. It provides basic UI components that can also be used by users to implement their own terminal UIs.
:::

The `event` module provides a unified way to handle different types of events in the terminal UI, including keyboard events, mouse events, command events, text events, and idle events.

## Event Types

The module defines the following event types:

| Event Type | Value | Description |
|-----------|-------|-------------|
| event.ev_keyboard | 1 | Keyboard key press/release event |
| event.ev_mouse | 2 | Mouse button/movement event |
| event.ev_command | 3 | Command event |
| event.ev_text | 4 | Text input event |
| event.ev_idle | 5 | Idle event (no user input) |
| event.ev_max | 5 | Maximum event type value |

## Command Event Types

The module defines the following command event types:

| Command Type | Value | Description |
|-------------|-------|-------------|
| event.cm_quit | 1 | Quit application |
| event.cm_exit | 2 | Exit current view |
| event.cm_enter | 3 | Enter/confirm action |
| event.cm_max | 3 | Maximum command type value |

## event:is_key

- Check if event is a keyboard event with specific key

#### Function Prototype

::: tip API
```lua
event:is_key(key_name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key_name | Required. Name of the key to check (e.g., "Enter", "Esc", "Tab") |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns `true` if event is keyboard event for specified key, `false` otherwise |

#### Usage

Check if the event is a specific keyboard event:

```lua
import("core.ui.event")

function view:on_event(e)
    if e:is_key("Enter") then
        print("Enter key pressed")
        return true  -- Event handled
    elseif e:is_key("Esc") then
        self:quit()
        return true
    end
    return false
end
```

## event:is_command

- Check if event is a command event with specific command

#### Function Prototype

::: tip API
```lua
event:is_command(command: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| command | Required. Command name to check (e.g., "cm_quit", "cm_enter") |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns `true` if event is command event for specified command, `false` otherwise |

#### Usage

Check if the event is a specific command event:

```lua
import("core.ui.event")

function view:on_event(e)
    if e:is_command("cm_quit") then
        self:quit()
        return true
    elseif e:is_command("cm_enter") then
        self:on_confirm()
        return true
    end
    return false
end
```

## event:dump

- Dump event information for debugging

#### Function Prototype

::: tip API
```lua
event:dump()
```
:::

#### Parameter Description

No parameters

#### Return Value

No return value

#### Usage

Print event information for debugging:

```lua
import("core.ui.event")

function view:on_event(e)
    e:dump()  -- Output: event(key): Enter 10 .. or event(cmd): cm_quit ..
end
```

## Event Objects

### event.keyboard

- Create a keyboard event object

#### Function Prototype

::: tip API
```lua
event.keyboard(key_code: <number>, key_name: <string>, key_meta: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key_code | Required. Numeric key code |
| key_name | Required. Key name string (e.g., "Enter", "Esc", "Tab") |
| key_meta | Required. `true` if ALT key was pressed, `false` otherwise |

#### Return Value

| Type | Description |
|------|-------------|
| event | Returns a keyboard event object with `type = event.ev_keyboard` |

#### Usage

Create a keyboard event (typically done internally):

```lua
import("core.ui.event")

-- This is typically created by the UI framework
-- when a key is pressed, but you can create one manually:
local e = event.keyboard(10, "Enter", false)
```

### event.mouse

- Create a mouse event object

#### Function Prototype

::: tip API
```lua
event.mouse(btn_code: <number>, x: <number>, y: <number>, btn_name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| btn_code | Required. Mouse button event code |
| x | Required. X coordinate |
| y | Required. Y coordinate |
| btn_name | Required. Button name string |

#### Return Value

| Type | Description |
|------|-------------|
| event | Returns a mouse event object with `type = event.ev_mouse` |

#### Usage

Create a mouse event (typically done internally):

```lua
import("core.ui.event")

-- This is typically created by the UI framework
-- when mouse is used, but you can create one manually:
local e = event.mouse(1, 10, 20, "btn_left")
```

### event.command

- Create a command event object

#### Function Prototype

::: tip API
```lua
event.command(command: <string>, extra?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| command | Required. Command name string |
| extra | Optional. Additional data table |

#### Return Value

| Type | Description |
|------|-------------|
| event | Returns a command event object with `type = event.ev_command` |

#### Usage

Create and send a command event:

```lua
import("core.ui.event")
import("core.ui.action")

-- Create a quit command event
local e = event.command("cm_quit")

-- Send the event to the view
view:on_event(e)
```

### event.idle

- Create an idle event object

#### Function Prototype

::: tip API
```lua
event.idle()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| event | Returns an idle event object with `type = event.ev_idle` |

#### Usage

Create an idle event (typically done internally):

```lua
import("core.ui.event")

-- This is typically created by the UI framework
-- when there's no user input:
local e = event.idle()
```

