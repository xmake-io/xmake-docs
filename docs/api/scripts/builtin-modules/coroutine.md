
# coroutine

The coroutine module is a native module of lua. For use, see: [lua official manual](https://www.lua.org/manual/5.1/manual.html#5.2)

## coroutine.create

- Create a new coroutine

#### Function Prototype

```lua
coroutine.create(f: <function>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| f | Function to create coroutine |

#### Usage

Creates a new coroutine with function `f`. Returns a thread object that represents the coroutine.

```lua
local co = coroutine.create(function()
    print("Hello from coroutine")
end)
```

## coroutine.resume

- Resume execution of a coroutine

#### Function Prototype

```lua
coroutine.resume(co: <thread>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| co | Coroutine thread |
| ... | Arguments to pass to the coroutine |

#### Usage

Starts or continues the execution of coroutine `co`. Returns true if the coroutine execution is successful, false otherwise.

```lua
local success, result = coroutine.resume(co, "arg1", "arg2")
```

## coroutine.yield

- Yield execution to the caller

#### Function Prototype

```lua
coroutine.yield(...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| ... | Values to return to the caller |

#### Usage

Suspends the execution of the calling coroutine and returns values to the caller.

```lua
coroutine.yield("value1", "value2")
```

## coroutine.status

- Get the status of a coroutine

#### Function Prototype

```lua
coroutine.status(co: <thread>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| co | Coroutine thread |

#### Usage

Returns the status of coroutine `co`: "suspended", "running", "normal", or "dead".

```lua
local status = coroutine.status(co)
```

## coroutine.wrap

- Create a coroutine wrapper function

#### Function Prototype

```lua
coroutine.wrap(f: <function>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| f | Function to create coroutine |

#### Usage

Creates a new coroutine with function `f` and returns a function that resumes the coroutine each time it is called.

```lua
local func = coroutine.wrap(function()
    return "Hello"
end)
local result = func()
```

## coroutine.running

- Get the running coroutine

#### Function Prototype

```lua
coroutine.running()
```

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the running coroutine, or nil when called by the main thread.

```lua
local co = coroutine.running()
```
