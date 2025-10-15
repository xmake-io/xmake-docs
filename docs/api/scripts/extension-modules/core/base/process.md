
# process

The process module provides subprocess management functionality for creating, controlling, and communicating with external processes. This is the underlying module for `os.exec` and `os.execv` functions. This is an extension module of xmake.

::: tip TIP
To use this module, you need to import it first: `import("core.base.process")`
:::

## process.open

- Open a subprocess with command string

```lua
import("core.base.process")

local proc = process.open(command, opt)
```

Creates a new subprocess by executing a command string. Returns a subprocess object that can be used to control and communicate with the process.

Parameters:
- `command` - Required. The command string to execute
- `opt` - Optional. Process options table

Options in `opt`:
- `stdin` - Input source (file path, file object, or pipe object)
- `stdout` - Output destination (file path, file object, or pipe object)
- `stderr` - Error output destination (file path, file object, or pipe object)
- `envs` - Environment variables array (e.g., `{"PATH=xxx", "XXX=yyy"}`)

```lua
-- Basic process execution
local proc = process.open("echo hello world")
local ok, status = proc:wait()
proc:close()

-- Process with file redirection
local stdout = os.tmpfile()
local stderr = os.tmpfile()
local proc = process.open("xmake lua print 'hello'", {
    stdout = stdout,
    stderr = stderr
})
proc:wait()
proc:close()

-- Read output from file
local output = io.readfile(stdout):trim()
print(output)  -- Output: hello
```

Process with environment variables:

```lua
local proc = process.open("echo $MY_VAR", {
    envs = {"MY_VAR=hello from xmake"}
})
proc:wait()
proc:close()
```

## process.openv

- Open a subprocess with program and arguments list

```lua
import("core.base.process")

local proc = process.openv(program, argv, opt)
```

Creates a new subprocess by executing a program with a list of arguments. This is safer than `process.open` as it avoids shell interpretation issues.

Parameters:
- `program` - Required. The program to execute
- `argv` - Required. Array of arguments to pass to the program
- `opt` - Optional. Process options table (same as `process.open`)

```lua
-- Execute program with arguments
local proc = process.openv("xmake", {"lua", "print", "hello world"})
local ok, status = proc:wait()
proc:close()

-- Execute with file redirection
local stdout = os.tmpfile()
local proc = process.openv("xmake", {"lua", "print", "xmake"}, {
    stdout = stdout,
    stderr = stderr
})
proc:wait()
proc:close()

-- Read the output
local output = io.readfile(stdout):trim()
print(output)  -- Output: xmake
```

Execute with environment variables:

```lua
local proc = process.openv("env", {"MY_VAR=test"}, {
    envs = {"MY_VAR=hello from xmake"}
})
proc:wait()
proc:close()
```

## process:wait

- Wait for subprocess to complete

```lua
local ok, status = process:wait(timeout)
```

Waits for the subprocess to complete and returns the exit status. Can be used with or without timeout.

Parameters:
- `timeout` - Optional. Timeout in milliseconds. Use -1 for infinite wait, 0 for non-blocking

Returns:
- `ok` - Exit code (0 for success, negative for error)
- `status` - Process status or error message

```lua
local proc = process.open("echo hello")
local ok, status = proc:wait()
print("Exit code:", ok)  -- Output: 0 (success)
print("Status:", status)  -- Output: nil or error message
proc:close()
```

Wait with timeout:

```lua
local proc = process.open("sleep 10")
local ok, status = proc:wait(1000)  -- Wait max 1 second
if ok < 0 then
    print("Process timed out or failed:", status)
end
proc:close()
```

Non-blocking wait:

```lua
local proc = process.open("echo hello")
local ok, status = proc:wait(0)  -- Non-blocking
if ok < 0 then
    print("Process not ready yet")
else
    print("Process completed with code:", ok)
end
proc:close()
```

## process:kill

- Kill the subprocess

```lua
local success, error = process:kill()
```

Terminates the subprocess immediately. Returns true if successful, false with error message if failed.

```lua
local proc = process.open("sleep 60")
-- ... do something ...

-- Kill the process
local success, error = proc:kill()
if success then
    print("Process killed successfully")
else
    print("Failed to kill process:", error)
end
proc:close()
```

Kill long-running process:

```lua
local proc = process.open("xmake l os.sleep 60000")
print("Process started:", proc)

-- Kill after 2 seconds
os.sleep(2000)
local success = proc:kill()
print("Kill result:", success)
proc:close()
```

## process:close

- Close the subprocess

```lua
local success = process:close()
```

Closes the subprocess and releases associated resources. Should be called when done with the process.

```lua
local proc = process.open("echo hello")
proc:wait()
local success = proc:close()
print("Close result:", success)
```

Always close processes:

```lua
local proc = process.open("some command")
local ok, status = proc:wait()
-- Always close, even if process failed
proc:close()
```

## process:name

- Get the process name

```lua
local name = process:name()
```

Returns the name of the process (filename without path).

```lua
local proc = process.open("xmake lua print 'hello'")
print("Process name:", proc:name())  -- Output: xmake
proc:close()
```

## process:program

- Get the process program path

```lua
local program = process:program()
```

Returns the full program path that was used to start the process.

```lua
local proc = process.openv("xmake", {"lua", "print", "hello"})
print("Program:", proc:program())  -- Output: xmake
proc:close()
```

## process:cdata

- Get the process cdata

```lua
local cdata = process:cdata()
```

Returns the underlying cdata object for the process. Used internally by the scheduler and other low-level operations.

```lua
local proc = process.open("echo hello")
local cdata = proc:cdata()
print("CData type:", type(cdata))
proc:close()
```

## process:otype

- Get the object type

```lua
local type = process:otype()
```

Returns the object type identifier. For subprocess objects, this returns 3 (poller.OT_PROC).

```lua
local proc = process.open("echo hello")
print("Object type:", proc:otype())  -- Output: 3
proc:close()
```

::: tip TIP
The process module is the underlying implementation for `os.exec` and `os.execv` functions. It provides more control and flexibility for process management, including timeout handling, pipe integration, and scheduler support. Use `process.open` for simple command execution and `process.openv` for safer argument handling.
:::

