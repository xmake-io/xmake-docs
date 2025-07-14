---
title: 插件使用之加载自定义lua脚本
tags: [xmake, plugin, scripts]
date: 2016-07-07
author: Ruki
---

xmake里面的lua脚本加载插件，可以让你方便调试和编写一些自定义的lua脚本，这个时候xmake就是一个纯lua的加载引擎。。

例如，我想写个简单的`hello xmake!`的lua脚本，可以自己建个 `hello.lua` 文件，编写如下脚本：

```lua
    function main()
        print("hello xmake!")
    end
```

`main`是入口函数，就跟平常写c类似，然后加载执行下这个lua脚本就行了：

```bash
        xmake lua /home/xxx/hello.lua
    or  xmake l /tmp/hello.lua
```

下面在来个稍微高级点的，我要传递参数进来，可以这么写：

```lua
    function main(argv)
        -- 打印所有参数值
        for _, value in ipairs(argv) do
            print(value)
        end

        -- 或者可以直接dump所有
        table.dump(argv)
    end
```

然后我们执行下，试试：

```bash
    xmake lua /tmp/hello.lua hello xmake
```


简单吧，当然除了lua内置的大部分模块，例如：`os, string, table, ...` 等等，xmake的lua加载器还提供其他更丰富的模块类库
可以通过 `import` 导入后使用，所有导入的模块支持跟插件开发中使用的类库是一样的，具体类库的使用，请参考：[插件开发之类库使用](https://xmake.io/zh/)

下面我主要介绍下，`xmake lua`插件提供的一些内置shell脚本，这些脚本是linux下的一些shell工具子集，用于实现跨平台执行，例如：

```bash
    xmake lua cat
    xmake lua cp
    xmake lua echo
    xmake lua mv
    xmake lua rm
    xmake lua rmdir
    xmake lua mkdir
```

现在提供的工具不是很多，但是以后可以慢慢扩充，扩展起来还是很方便的，只需要把对应脚本：`cat.lua` 放到 `xmake lua`插件目录的 scripts 目录下就行了。。

例如我想要跨平台运行 cat 命令，可以这么执行：

```bash
        xmake lua cat /tmp/a
    or  xmake l cat c:\\a.txt
```

等以后工具扩充的越来越多，相当于在各个平台下，有了一套完善的linux的shell工具，方便日常开发使用

如果你想要看下xmake当前版本支持了哪些内置的shell工具，可以执行：

```bash
        xmake lua -l
    or  xmake lua --list
```
