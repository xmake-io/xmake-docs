# 配置优化 {#configuration-optimization}

xmake 的 `xmake.lua` 配置语法非常灵活，虽然标准的配置域语法已经非常清晰，但是对于一些简单的配置项，使用多行定义可能会显得有些冗余。

因此，xmake 提供了一些简化的语法来优化配置的可读性。

## 简化的选项定义

对于 `option` 定义，我们通常的标准写法是这样的：

```lua
option("test1")
    set_default(true)
    set_description("test1 option")

option("test2")
    set_default(true)

option("test3")
    set_default("hello")
```

如果选项很多，这种写法会占据大量的行数，导致配置显得不够紧凑。我们可以使用单行定义的语法来进行简化：

```lua
option("test1", {default = true, description = "test1 option"})
option("test2", {default = true})
option("test3", {default = "hello"})
```

这种写法不仅减少了代码行数，而且让每个选项的定义更加集中，一目了然，极大地提升了配置的可读性。


