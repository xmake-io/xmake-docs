
# inherit

- 导入并继承基类模块

这个等价于[import](/zh/api/scripts/builtin-modules/import)接口的 `inherit` 模式，也就是：

```lua
import("xxx.xxx", {inherit = true})
```

用`inherit`接口的话，会更简洁些：

```lu
inherit("xxx.xxx")
```

使用实例，可以参看xmake的tools目录下的脚本：[clang.lua]( https://github.com/xmake-io/xmake/blob/master/xmake/tools/clang.lua)

这个就是clang工具模块继承了gcc的部分实现。
