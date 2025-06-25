
# ipairs

- 用于遍历数组

这个是lua原生的内置api，在xmake中，在原有的行为上对其进行了一些扩展，来简化一些日常的lua遍历代码。

先看下默认的原生写法：

```lua
for idx, val in ipairs({"a", "b", "c", "d", "e", "f"}) do
     print("%d %s", idx, val)
end
```

扩展写法类似[pairs](/zh/api/scripts/builtin-modules/pairs)接口，例如：

```lua
for idx, val in ipairs({"a", "b", "c", "d", "e", "f"}, function (v) return v:upper() end) do
     print("%d %s", idx, val)
end

for idx, val in ipairs({"a", "b", "c", "d", "e", "f"}, function (v, a, b) return v:upper() .. a .. b end, "a", "b") do
     print("%d %s", idx, val)
end
```

这样可以简化`for`块代码的逻辑，例如我要遍历指定目录，获取其中的文件名，但不包括路径，就可以通过这种扩展方式，简化写法：

```lua
for _, filename in ipairs(os.dirs("*"), path.filename) do
    -- ...
end
```
