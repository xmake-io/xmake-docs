# pairs

- 用于遍历字典

#### 函数原型

::: tip API
```lua
pairs(t: <table>, f: <function>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| t | 要遍历的表 |
| f | 处理值的函数（可选） |
| ... | 函数的可变参数（可选） |

#### 用法说明

这个是lua原生的内置api，在xmake中，在原有的行为上对其进行了一些扩展，来简化一些日常的lua遍历代码。

先看下默认的原生写法：

```lua
local t = {a = "a", b = "b", c = "c", d = "d", e = "e", f = "f"}

for key, val in pairs(t) do
    print("%s: %s", key, val)
end
```

这对于通常的遍历操作就足够了，但是如果我们相对其中每个遍历出来的元素，获取其大写，我们可以这么写：

```lua
for key, val in pairs(t, function (v) return v:upper() end) do
     print("%s: %s", key, val)
end
```

甚至传入一些参数到第二个`function`中，例如：

```lua
for key, val in pairs(t, function (v, a, b) return v:upper() .. a .. b end, "a", "b") do
     print("%s: %s", key, val)
end
```

::: tip 注意
自 v3.0.9 起，xmake 的内置 Lua 运行时升级到 5.5。为了保留循环体里可以重新赋值循环 key 的语义，沙箱的 `pairs` 把迭代状态保存在一个内部闭包中，因此下面这种写法在升级后依然能正常工作：

```lua
for k, v in pairs(t) do
    k = k:gsub("_", "-")
    do_something(k, v)
end
```
:::
