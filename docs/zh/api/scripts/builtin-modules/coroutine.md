
# coroutine

协程模块是lua原生自带的模块，具使用见：[lua官方手册](https://www.lua.org/manual/5.1/manual.html#5.2)

## coroutine.create

- 创建一个新的协程

#### 函数原型

::: tip API
```lua
coroutine.create(f: <function>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| f | 创建协程的函数 |

#### 用法说明

创建一个带有函数 `f` 的新协程。返回一个代表协程的线程对象。

```lua
local co = coroutine.create(function()
    print("Hello from coroutine")
end)
```

## coroutine.resume

- 恢复协程的执行

#### 函数原型

::: tip API
```lua
coroutine.resume(co: <thread>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| co | 协程线程 |
| ... | 传递给协程的参数 |

#### 用法说明

开始或继续执行协程 `co`。如果协程执行成功则返回 true，否则返回 false。

```lua
local success, result = coroutine.resume(co, "arg1", "arg2")
```

## coroutine.yield

- 将执行权让给调用者

#### 函数原型

::: tip API
```lua
coroutine.yield(...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| ... | 返回给调用者的值 |

#### 用法说明

暂停调用协程的执行并将值返回给调用者。

```lua
coroutine.yield("value1", "value2")
```

## coroutine.status

- 获取协程的状态

#### 函数原型

::: tip API
```lua
coroutine.status(co: <thread>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| co | 协程线程 |

#### 用法说明

返回协程 `co` 的状态："suspended"（挂起）、"running"（运行中）、"normal"（正常）或 "dead"（死亡）。

```lua
local status = coroutine.status(co)
```

## coroutine.wrap

- 创建协程包装函数

#### 函数原型

::: tip API
```lua
coroutine.wrap(f: <function>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| f | 创建协程的函数 |

#### 用法说明

创建一个带有函数 `f` 的新协程，并返回一个函数，每次调用该函数时都会恢复协程。

```lua
local func = coroutine.wrap(function()
    return "Hello"
end)
local result = func()
```

## coroutine.running

- 获取正在运行的协程

#### 函数原型

::: tip API
```lua
coroutine.running()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

返回正在运行的协程，如果在主线程中调用则返回 nil。

```lua
local co = coroutine.running()
```
