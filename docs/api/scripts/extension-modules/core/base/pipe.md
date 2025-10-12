
# pipe

The pipe module provides pipe communication functionality, supporting both anonymous pipes and named pipes, which can be used for inter-process communication. This is an extension module of xmake.

::: tip TIP
To use this module, you need to import it first: `import("core.base.pipe")`
:::

## pipe.openpair

- Create an anonymous pipe pair

```lua
import("core.base.pipe")

local rpipe, wpipe = pipe.openpair()
```

Creates a pair of anonymous pipes, returning read and write pipe objects.

Anonymous pipes are mainly used for communication between related processes (such as parent-child processes). A common scenario is redirecting subprocess input/output.

Parameters:
- `mode` (optional): Pipe mode, default is `"AA"`
  - `"BB"`: Both read and write in blocking mode
  - `"BA"`: Read blocking, write non-blocking
  - `"AB"`: Read non-blocking, write blocking
  - `"AA"`: Both read and write in non-blocking mode (default)
- `buffsize` (optional): Buffer size, default is 0 (system default)

Basic usage example:

```lua
import("core.base.pipe")
import("core.base.bytes")

-- Create pipe pair
local rpipe, wpipe = pipe.openpair()
local buff = bytes(8192)

-- Write data
wpipe:write("hello xmake!", {block = true})

-- Read data
local read, data = rpipe:read(buff, 13)
if read > 0 and data then
    print(data:str())  -- Output: hello xmake!
end

rpipe:close()
wpipe:close()
```

Used with `os.execv` to redirect subprocess output:

```lua
import("core.base.pipe")
import("core.base.bytes")

-- Create pipe pair
local rpipe, wpipe = pipe.openpair()

-- Redirect subprocess stdout to pipe write end
os.execv("echo", {"hello from subprocess"}, {stdout = wpipe})

-- Close write end, read subprocess output
wpipe:close()
local buff = bytes(8192)
local read, data = rpipe:read(buff, 8192)
if read > 0 then
    print("Subprocess output:", data:str())
end
rpipe:close()
```

## pipe.open

- Open a named pipe

```lua
import("core.base.pipe")

local pipefile = pipe.open(name, mode, buffsize)
```

Opens or creates a named pipe.

Named pipes can be used for communication between completely independent processes without any relationship. Similar to local sockets but more lightweight. Suitable for scenarios where data needs to be passed between different applications.

Parameters:
- `name`: Pipe name
- `mode`: Open mode
  - `"r"` or `"rA"`: Read-only, non-blocking (client-side)
  - `"w"` or `"wA"`: Write-only, non-blocking (server-side)
  - `"rB"`: Read-only, blocking
  - `"wB"`: Write-only, blocking
- `buffsize` (optional): Buffer size, default is 0

### Server-side Example

```lua
import("core.base.pipe")

-- Open named pipe (server-side)
local pipefile = pipe.open("test", 'w')

local count = 0
while count < 10000 do
    local write = pipefile:write("hello world..", {block = true})
    if write <= 0 then
        break
    end
    count = count + 1
end
print("Write successful, count:", count)
pipefile:close()
```

### Client-side Example

```lua
import("core.base.pipe")
import("core.base.bytes")

-- Open named pipe (client-side)
local pipefile = pipe.open("test", 'r')
local buff = bytes(8192)

-- Connect to server
if pipefile:connect() > 0 then
    print("Connected")
    local count = 0
    while count < 10000 do
        local read, data = pipefile:read(buff, 13, {block = true})
        if read > 0 then
            count = count + 1
        else
            break
        end
    end
    print("Read successful, count:", count)
end
pipefile:close()
```

## pipe:read

- Read data from pipe

```lua
local read, data = pipefile:read(buff, size, opt)
```

Reads data from the pipe into the specified buffer.

Parameters:
- `buff`: bytes buffer object to store the read data
- `size`: Number of bytes to read
- `opt` (optional): Option parameters
  - `block`: Whether to block reading, default false
  - `start`: Buffer start position, default 1
  - `timeout`: Timeout in milliseconds, default -1 (infinite wait)

Return values:
- `read`: Actual number of bytes read, returns -1 on failure
- `data`: Read data (bytes object), returns error message on failure

Non-blocking mode (default) returns immediately, may return 0 indicating no data available. Blocking mode waits until the specified amount of data is read or an error occurs:

```lua
import("core.base.bytes")

local buff = bytes(8192)
-- Blocking read 100 bytes, timeout 5 seconds
local read, data = rpipe:read(buff, 100, {block = true, timeout = 5000})
if read > 0 then
    print("Read:", data:str())
end
```

## pipe:write

- Write data to pipe

```lua
local write = pipefile:write(data, opt)
```

Writes data to the pipe.

Parameters:
- `data`: Data to write, can be string or bytes object
- `opt` (optional): Option parameters
  - `block`: Whether to block writing, default false
  - `start`: Data start position, default 1
  - `last`: Data end position, default is data size
  - `timeout`: Timeout in milliseconds, default -1

Return values:
- `write`: Actual number of bytes written, returns -1 on failure

Non-blocking mode (default) may only write partial data. Blocking mode waits until all data is successfully written:

```lua
-- Blocking write data
local write = wpipe:write("hello world", {block = true})
if write > 0 then
    print("Wrote", write, "bytes")
end
```

## pipe:connect

- Connect to named pipe (server-side)

```lua
local ok = pipefile:connect(opt)
```

Connects to a named pipe, only used on the server-side of named pipes. After creating a named pipe on the server, call this method to wait for client connection.

Parameters:
- `opt` (optional): Option parameters
  - `timeout`: Timeout in milliseconds, default -1

Return values:
- Returns a positive number on success, -1 on failure

```lua
import("core.base.pipe")

local pipefile = pipe.open("test", 'r')
if pipefile:connect() > 0 then
    print("Client connected")
    -- Can start reading/writing data
end
```

## pipe:wait

- Wait for pipe events

```lua
local events = pipefile:wait(events, timeout)
```

Waits for specified pipe events to occur. In non-blocking mode, this method can be used to implement event-driven I/O.

Parameters:
- `events`: Events to wait for, supports the following event constants:
  - `pipe.EV_READ` (1): Readable event, indicates pipe has data to read
  - `pipe.EV_WRITE` (2): Writable event, indicates pipe can accept data
  - `pipe.EV_CONN` (2): Connection event, used for named pipes to wait for client connection
- `timeout`: Timeout in milliseconds, -1 means wait indefinitely

Return values:
- Returns the actual event constant value that occurred

In non-blocking mode, wait can be used to implement efficient event loops:

```lua
-- Wait for pipe to be readable, timeout 1 second
local events = rpipe:wait(pipe.EV_READ, 1000)
if events == pipe.EV_READ then
    -- Pipe is readable, can read data
    local read, data = rpipe:read(buff, 100)
end

-- Wait for pipe to be writable
local events = wpipe:wait(pipe.EV_WRITE, 1000)
if events == pipe.EV_WRITE then
    -- Pipe is writable, can write data
    wpipe:write("data")
end
```

## pipe:close

- Close the pipe

```lua
pipefile:close()
```

Closes the pipe and releases resources. Pipes should be closed promptly after use.

## pipe:name

- Get pipe name

```lua
local name = pipefile:name()
```

Gets the name of a named pipe. Returns nil for anonymous pipes.

::: tip TIP
Pipes are unidirectional, one end can only read, the other can only write. For bidirectional communication, two pipes are needed.
:::

::: warning WARNING
Remember to call `close()` after using the pipe to release resources. A bytes buffer must be created using `bytes()` before reading data.
:::

