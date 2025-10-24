
# print

- Wrapping print terminal log

#### Function Prototype

::: tip API
```lua
print(...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| ... | Variable arguments, can pass multiple values |

#### Usage

This interface is also the native interface of lua. xmake is also extended based on the original behavior, and supports: formatted output, multivariable output.

First look at the way native support:

```lua
print("hello xmake!")
print("hello", "xmake!", 123)
```

And also supports extended formatting:

```lua
print("hello %s!", "xmake")
print("hello xmake! %d", 123)
```

Xmake will support both types of writing at the same time, and the internal will automatically detect and select the output behavior.
