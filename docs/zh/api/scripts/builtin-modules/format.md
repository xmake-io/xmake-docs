
# format

- 格式化字符串

#### 函数原型

```lua
format(formatstring: <string>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| formatstring | 格式字符串 |
| ... | 格式化的可变参数 |

#### 用法说明

如果只是想格式化字符串，不进行输出，可以使用这个接口，此接口跟`string.format`接口等价，只是个接口名简化版。

```lua
local s = format("hello %s", xmake)
```
