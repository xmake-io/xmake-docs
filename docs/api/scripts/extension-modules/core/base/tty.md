# core.base.tty

This module provides terminal control and detection capabilities for terminal operations.

::: tip TIP
To use this module, you need to import it first: `import("core.base.tty")`
:::

This module provides functions for terminal control sequences, color support detection, and terminal information querying. It supports VT-ANSI sequences for advanced terminal manipulation.

## tty.erase_line_to_end

- Erase from current cursor position to the end of the current line

#### Function Prototype

::: tip API
```lua
tty.erase_line_to_end()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| tty | Returns the tty module for method chaining |

#### Usage

```lua
import("core.base.tty")

tty.erase_line_to_end()
```

## tty.erase_line_to_start

- Erase from current cursor position to the start of the current line

#### Function Prototype

::: tip API
```lua
tty.erase_line_to_start()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| tty | Returns the tty module for method chaining |

#### Usage

```lua
import("core.base.tty")

tty.erase_line_to_start()
```

## tty.erase_line

- Erase the entire current line

#### Function Prototype

::: tip API
```lua
tty.erase_line()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| tty | Returns the tty module for method chaining |

#### Usage

```lua
import("core.base.tty")

tty.erase_line()
```

## tty.erase_down

- Erase from current line down to the bottom of the screen

#### Function Prototype

::: tip API
```lua
tty.erase_down()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| tty | Returns the tty module for method chaining |

#### Usage

```lua
import("core.base.tty")

tty.erase_down()
```

## tty.erase_up

- Erase from current line up to the top of the screen

#### Function Prototype

::: tip API
```lua
tty.erase_up()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| tty | Returns the tty module for method chaining |

#### Usage

```lua
import("core.base.tty")

tty.erase_up()
```

## tty.erase_screen

- Erase the entire screen and move cursor to home position

#### Function Prototype

::: tip API
```lua
tty.erase_screen()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| tty | Returns the tty module for method chaining |

#### Usage

```lua
import("core.base.tty")

tty.erase_screen()
```

## tty.cursor_save

- Save current cursor position

#### Function Prototype

::: tip API
```lua
tty.cursor_save()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| tty | Returns the tty module for method chaining |

#### Usage

```lua
import("core.base.tty")

tty.cursor_save()
```

## tty.cursor_restore

- Restore saved cursor position

#### Function Prototype

::: tip API
```lua
tty.cursor_restore()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| tty | Returns the tty module for method chaining |

#### Usage

```lua
import("core.base.tty")

-- Save cursor position
tty.cursor_save()

-- ... do something ...

-- Restore cursor position
tty.cursor_restore()
```

## tty.cursor_and_attrs_save

- Save current cursor position and color attributes

#### Function Prototype

::: tip API
```lua
tty.cursor_and_attrs_save()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| tty | Returns the tty module for method chaining |

#### Usage

```lua
import("core.base.tty")

tty.cursor_and_attrs_save()
```

## tty.cursor_and_attrs_restore

- Restore saved cursor position and color attributes

#### Function Prototype

::: tip API
```lua
tty.cursor_and_attrs_restore()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| tty | Returns the tty module for method chaining |

#### Usage

```lua
import("core.base.tty")

-- Save cursor and attributes
tty.cursor_and_attrs_save()

-- ... change colors, do something ...

-- Restore cursor position and colors
tty.cursor_and_attrs_restore()
```

## tty.cr

- Carriage return

#### Function Prototype

::: tip API
```lua
tty.cr()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| tty | Returns the tty module for method chaining |

#### Usage

```lua
import("core.base.tty")

tty.cr()
```

## tty.flush

- Flush terminal output

#### Function Prototype

::: tip API
```lua
tty.flush()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| tty | Returns the tty module for method chaining |

#### Usage

```lua
import("core.base.tty")

tty.flush()
```

## tty.shell

- Get shell name

#### Function Prototype

::: tip API
```lua
tty.shell()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the shell name (e.g., "bash", "zsh", "pwsh", "powershell", "cmd") |

#### Usage

```lua
import("core.base.tty")

local shell = tty.shell()
print("Current shell:", shell)  -- Output: "bash", "zsh", etc.
```

## tty.term

- Get terminal name

#### Function Prototype

::: tip API
```lua
tty.term()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the terminal name (e.g., "xterm", "vscode", "windows-terminal", "mintty") |

#### Usage

```lua
import("core.base.tty")

local term = tty.term()
print("Terminal:", term)  -- Output: "xterm", "vscode", etc.
```

## tty.has_emoji

- Check if terminal supports emoji

#### Function Prototype

::: tip API
```lua
tty.has_emoji()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if emoji is supported, false otherwise |

#### Usage

```lua
import("core.base.tty")

if tty.has_emoji() then
    print("Emoji supported!")
else
    print("No emoji support")
end
```

## tty.has_vtansi

- Check if terminal supports VT-ANSI sequences

#### Function Prototype

::: tip API
```lua
tty.has_vtansi()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if VT-ANSI is supported, false otherwise |

#### Usage

```lua
import("core.base.tty")

if tty.has_vtansi() then
    -- Use advanced terminal features
    tty.erase_screen()
end
```

## tty.has_color8

- Check if terminal supports 8 colors

#### Function Prototype

::: tip API
```lua
tty.has_color8()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if 8 colors are supported, false otherwise |

#### Usage

```lua
import("core.base.tty")

if tty.has_color8() then
    -- Use 8-color escape sequences
end
```

## tty.has_color256

- Check if terminal supports 256 colors

#### Function Prototype

::: tip API
```lua
tty.has_color256()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if 256 colors are supported, false otherwise |

#### Usage

```lua
import("core.base.tty")

if tty.has_color256() then
    -- Use 256-color escape sequences
end
```

## tty.has_color24

- Check if terminal supports 24-bit true color

#### Function Prototype

::: tip API
```lua
tty.has_color24()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if 24-bit color is supported, false otherwise |

#### Usage

```lua
import("core.base.tty")

if tty.has_color24() then
    -- Use 24-bit true color escape sequences
end
```

## tty.term_mode

- Get or set terminal mode

#### Function Prototype

::: tip API
```lua
tty.term_mode(stdtype: <string>, newmode?: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| stdtype | Required. Standard stream type ("stdin", "stdout", "stderr") |
| newmode | Optional. New terminal mode to set |

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the old terminal mode |

#### Usage

```lua
import("core.base.tty")

-- Get current mode
local oldmode = tty.term_mode("stdout")

-- Set new mode
tty.term_mode("stdout", newmode)
```

