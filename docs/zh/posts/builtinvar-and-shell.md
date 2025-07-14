---
title: 内置变量与原生shell脚本运行
tags: [xmake, shell, 内置变量, pkg-config]
date: 2016-07-18
author: Ruki
---

xmake在xmake.lua中提供了 `$(varname)` 的语法，来支持内置变量的获取，例如：

```lua
add_cxflags("-I$(buildir)")
```

它将会在在实际编译的时候，将内置的 `buildir` 变量转换为实际的构建输出目录：`-I./build`

并且这些变量在自定义脚本中，也是可以支持的，例如：

```lua
target("test")
    after_build(target)
        print("build ok for $(plat)!")
    end
```

这将会在编译完后，输出：

```lua
build ok for macosx!
```

这些内置变量，大部分都是通过配置的时候，缓存的配置参数中获取，例如：

```bash
$ xmake config --plat=macosx
```

也有些内置变量，不需要通过配置中获取到，例如：

```lua
print("$(os)")
print("$(host)")
print("$(tmpdir)")
print("$(curdir)")
```



等等，这些都是为了让xmake的语法更加简洁，例如操作文件复制的时候，只需要：

```lua
os.cp("$(projectdir)/file", "$(tmpdir)")
```

而不需要：

```lua
-- 导入工程模块
import("core.project.project")

-- 复制文件
os.cp(path.join(project.directory(), "file"), os.tmpdir())
```

这样比较繁琐下，但是有些复杂功能，可能还是得这么处理比较灵活，这就得看具体需求了。。

除了内置的变量处理，xmake还支持原生shell的运行，来处理一些xmake内置不支持的功能

例如，现在有个需求，我想用在编译linux程序时，调用`pkg-config`获取到实际的第三方链接库名，可以这么做：

```lua
target("test")
    set_kind("binary")
    if is_plat("linux") then
        add_ldflags("$(shell pkg-config --libs sqlite3)")
    end
```

当然，xmake有自己的自动化第三库检测机制，一般情况下不需要这么麻烦，而且lua自身的脚本化已经很不错了。。

但是这个例子可以说明，xmake是完全可以通过原生shell，来与一些第三方的工具进行配合使用。。


