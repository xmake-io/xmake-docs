# import

- 导入扩展模块

#### 函数原型

::: tip API
```lua
import(modulename: <string>, options: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| modulename | 模块名称字符串 |
| options | 导入选项表（可选） |

#### 用法说明

在自定义脚本、插件脚本、任务脚本、平台扩展、模板扩展等脚本代码中使用，也就是在类似下面的代码块中，可以使用这些模块接口：

```lua
on_run(function (target)
    print("hello xmake!")
end)
```

::: tip 注意
为了保证外层的描述域尽可能简洁、安全，一般不建议在这个域使用接口和模块操作api，因此大部分模块接口只能脚本域使用，来实现复杂功能
:::

当然少部分只读的内置接口还是可以在描述域使用的，具体见下表：

在描述域使用接口调用的实例如下，一般仅用于条件控制：

```lua
-- 扫描当前xmake.lua目录下的所有子目录，以每个目录的名字定义一个task任务
for _, taskname in ipairs(os.dirs("*"), path.basename) do
    task(taskname)
        on_run(function ()
        end)
end
```

上面所说的脚本域、描述域主要是指：

```lua
-- 描述域
target("test")

    -- 描述域
    set_kind("static")
    add_files("src/*.c")

    on_run(function (target)
        -- 脚本域
    end)

-- 描述域
```

## 导入扩展摸块

import 的主要用于导入xmake的扩展类库以及一些自定义的类库模块，一般用于：

* 自定义脚本 ([on_build](/zh/api/description/project-target#on-build), [on_run](/zh/api/description/project-target#on-run) ..)
* 插件开发
* 模板开发
* 平台扩展
* 自定义任务task

导入机制如下：

1. 优先从当前脚本目录下导入
2. 再从扩展类库中导入

导入的语法规则：

基于`.`的类库路径规则，例如：

```lua
import("core.base.option")
import("core.base.task")

function main()

    -- 获取参数选项
    print(option.get("version"))

    -- 运行任务和插件
    task.run("hello")
end
```

导入当前目录下的自定义模块：

目录结构：

```
plugin
  - xmake.lua
  - main.lua
  - modules
    - hello1.lua
    - hello2.lua
```

在main.lua中导入modules

```lua
import("modules.hello1")
import("modules.hello2")
```

导入后就可以直接使用里面的所有公有接口，私有接口用`_`前缀标示，表明不会被导出，不会被外部调用到。。

除了当前目录，我们还可以导入其他指定目录里面的类库，例如：

```lua
import("hello3", {rootdir = "/home/xxx/modules"})
```

为了防止命名冲突，导入后还可以指定的别名：

```lua
import("core.platform.platform", {alias = "p"})

function main()

    -- 这样我们就可以使用p来调用platform模块的plats接口，获取所有xmake支持的平台列表了
    utils.dump(p.plats())
end
```

import不仅可以导入类库，还支持导入的同时作为继承导入，实现模块间的继承关系

```lua
import("xxx.xxx", {inherit = true})
```

这样导入的不是这个模块的引用，而是导入的这个模块的所有公有接口本身，这样就会跟当前模块的接口进行合并，实现模块间的继承。

2.1.5版本新增两个新属性：`import("xxx.xxx", {try = true, anonymous = true})`

try为true，则导入的模块不存在的话，仅仅返回nil，并不会抛异常后中断xmake.
anonymous为true，则导入的模块不会引入当前作用域，仅仅在import接口返回导入的对象引用。

## 自定义扩展模块

通过 import 我们除了可以导入 xmake 内置的很多扩展模块，还可以导入用户自己定义的扩展模块。

只需要将自己的模块放到工程目录下，按照上文介绍的导入方式进行导入即可。

那么，如果去定义模块呢？xmake 对模块的编写规范是有一套约定规则的，并没有沿用 lua 原生的 require 导入机制，并不需要在模块中使用 return 来全局返回它。

假如我们有一个模块文件 foo.lua，它的内容如下：

```lua
function _foo(a, b)
    return a + b
end

function add(a, b)
    _foo(a, b)
end

function main(a, b)
    add(a, b)
end
```

其中 main 为入口函数，可选，如果设置，模块 foo 可以直接被调用，例如：

```lua
import("foo")
foo(1, 2)
```

或者直接这样：

```lua
import("foo")(1, 2)
```


其他不带下划线的为 public 模块接口函数，例如 add。

```lua
import("foo")
foo.add(1, 2)
```

而里面带下划线前缀的 `_foo` 是私有函数，模块内部使用，不对外导出，所以在外面用户是不能够调用它的。
