---
title: 插件开发之import类库
tags: [xmake, 插件, import, 类库, 自定义脚本]
date: 2016-06-09
author: Ruki
outline: deep
---

import的主要用于导入xmake的扩展类库以及一些自定义的类库模块，一般用于 自定义脚本(on_build, on_run ..)、插件开发、模板开发、平台扩展、自定义任务task等地方。

导入机制如下：

1. 优先从当前脚本目录下导入
2. 再从扩展类库中导入

导入的语法规则：

基于.的类库路径规则，例如：

导入core核心扩展模块

```lua
    import("core.base.option")
    import("core.project")
    import("core.project.task")
    import("core")

    function main()
        
        -- 获取参数选项
        print(option.get("version"))

        -- 运行任务和插件
        task.run("hello")
        project.task.run("hello")
        core.project.task.run("hello")
    end
```



导入当前目录下的自定义模块：

目录结构：

```lua
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

导入后就可以直接使用里面的所有公有接口，私有接口用_前缀标示，表明不会被导出，不会被外部调用到。。

除了当前目录，我们还可以导入其他指定目录里面的类库，例如：

```lua
    import("hello3", {rootdir = "/home/xxx/modules"})
```

为了防止命名冲突，导入后还可以指定的别名：

```lua
    import("core.platform.platform", {alias = "p"})

    function main()
     
        -- 这样我们就可以使用p来调用platform模块的plats接口，获取所有xmake支持的平台列表了
        table.dump(p.plats())
    end
```

import不仅可以导入类库，还支持导入的同时作为继承导入，实现模块间的继承关系

```lua
    import("xxx.xxx", {inherit = true})
```

这样导入的不是这个模块的引用，而是导入的这个模块的所有公有接口本身，这样就会跟当前模块的接口进行合并，实现模块间的继承