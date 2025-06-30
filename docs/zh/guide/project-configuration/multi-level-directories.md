
# 多级配置 {#multi-level-directories}

在脚本域我们可以通过 import 导入各种丰富的扩展模块来使用，而在描述域我们可以通过[includes](/zh/api/description/global-interfaces.html#includes)接口，来引入项目子目录下的xmake.lua配置。

记住：xmake的includes是按照tree结构来处理配置关系的，子目录下的xmake.lua里面的target配置会继承父xmake.lua中的根域配置，例如：

目前有如下项目结构：

```
projectdir
    - xmake.lua
    - src
      - xmake.lua
```

`projectdir/xmake.lua`是项目的根xmake.lua配置，而`src/xmake.lua`是项目的子配置。

`projectdir/xmake.lua`内容：

```lua
add_defines("ROOT")

target("test1")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("TEST1")

target("test2")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("TEST2")

includes("src")
```

里面全局根域配置了`add_defines("ROOT")`，会影响下面的所有target配置，包括includes里面子xmake.lua中的所有target配置，所以这个是全局总配置。

而在test1/test2里面的`add_defines("TEST1")`和`add_defines("TEST2")`属于局部配置，只对当前target生效。

`src/xmake.lua`内容：

```lua
add_defines("ROOT2")

target("test3")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("TEST3")
```

在`src/xmake.lua`子配置中，也有个全局根域，配置了`add_defines("ROOT2")`，这个属于子配置根域，只对当前子xmake.lua里面所有target生效，也会对下级includes里面的子xmake.lua中target生效，因为之前说了，xmake是tree状结构的配置继承关系。

所以，这几个target的最终配置结果依次是：

```
target("test1"): -DROOT -DTEST1
target("test2"): -DROOT -DTEST2
target("test3"): -DROOT -DROOT2 -DTEST3
```

