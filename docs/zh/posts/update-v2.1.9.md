---
title: xmake v2.1.9版本发布，增加可视化图形菜单配置
tags: [xmake, lua, 版本更新]
date: 2018-02-03
author: Ruki
---

此版本主要增加`xmake f --menu`实现用户自定义图形菜单配置，界面风格类似linux的`make menuconfig`：

<img src="/assets/img/posts/xmake/menuconf.gif">

更多使用说明，请阅读：[文档手册](https://xmake.io/zh/)。

项目源码：[Github](https://github.com/xmake-io/xmake), [Gitee](https://gitee.com/tboox/xmake).

### 新特性

* 添加`del_files()`接口去从已添加的文件列表中移除一些文件
* 添加`rule()`, `add_rules()`接口实现自定义构建规则，并且改进`add_files("src/*.md", {rule = "markdown"})`
* 添加`os.filesize()`接口
* 添加`core.ui.xxx`等cui组件模块，实现终端可视化界面，用于实现跟用户进行短暂的交互
* 通过`xmake f --menu`实现可视化菜单交互配置，简化工程的编译配置
* 添加`set_values`接口到option
* 改进option，支持根据工程中用户自定义的option，自动生成可视化配置菜单
* 在调用api设置工程配置时以及在配置菜单中添加源文件位置信息

### 改进

* 改进交叉工具链配置，通过指定工具别名定向到已知的工具链来支持未知编译工具名配置, 例如: `xmake f --cc=gcc@ccmips.exe`
* [#151](https://github.com/xmake-io/xmake/issues/151): 改进mingw平台下动态库生成
* 改进生成makefile插件
* 改进检测错误提示
* 改进`add_cxflags`等flags api的设置，添加force参数，来禁用自动检测和映射，强制设置选项：`add_cxflags("-DTEST", {force = true})`
* 改进`add_files`的flags设置，添加force域，用于设置不带自动检测和映射的原始flags：`add_files("src/*.c", {force = {cxflags = "-DTEST"}})`
* 改进搜索工程根目录策略
* 改进vs环境探测，支持加密文件系统下vs环境的探测
* 升级luajit到最新2.1.0-beta3
* 增加对linux/arm, arm64的支持，可以在arm linux上运行xmake
* 改进vs201x工程生成插件，更好的includedirs设置支持

### Bugs修复

* 修复依赖修改编译和链接问题
* [#151](https://github.com/xmake-io/xmake/issues/151): 修复`os.nuldev()`在mingw上传入gcc时出现问题
* [#150](https://github.com/xmake-io/xmake/issues/150): 修复windows下ar.exe打包过长obj列表参数，导致失败问题
* 修复`xmake f --cross`无法配置问题
* 修复`os.cd`到windows根路径问题

### 新特性介绍

#### 新增`del_files`接口实现从源文件列表中删除指定文件

通过此接口，可以从前面[add_files](/zh/manual#add-files)接口添加的文件列表中，删除指定的文件，例如：

```lua
target("test")
    add_files("src/*.c")
    del_files("src/test.c")
```





上面的例子，可以从`src`目录下添加除`test.c`以外的所有文件，当然这个也可以通过`add_files("src/*.c|test.c")`来达到相同的目的，但是这种方式更加灵活。

例如，我们可以条件判断来控制删除哪些文件，并且此接口也支持[add_files](/zh/manual#add-files)的匹配模式，过滤模式，进行批量移除。

```lua
target("test")
    add_files("src/**.c")
    del_files("src/test*.c")
    del_files("src/subdir/*.c|xxx.c")
    if is_plat("iphoneos") then
        add_files("xxx.m")
    end
```

通过上面的例子，我们可以看出`add_files`和`del_files`是根据调用顺序，进行顺序添加和删除的，并且通过`del_files("src/subdir/*.c|xxx.c")`删除一批文件，
并且排除`src/subdir/xxx.c`（就是说，不删除这个文件）。

#### 通过`rule()`接口实现用户自定义编译规则

在2.1.9版本之后，xmake不仅原生内置支持多种语言文件的构建，而且还可以通过自定义构建规则，让用户自己来实现复杂的未知文件构建。

我们可以通过预先设置规则支持的文件后缀，来扩展其他文件的构建支持：

```lua
-- 定义一个markdown文件的构建规则
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build(function (target, sourcefile)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)

target("test")
    set_kind("binary")
    
    -- 使test目标支持markdown文件的构建规则
    add_rules("markdown")

    -- 添加markdown文件的构建
    add_files("src/*.md")
    add_files("src/*.markdown")
```

我们也可以指定某些零散的其他文件作为markdown规则来处理：

```lua
target("test")
    -- ...
    add_files("src/test/*.md.in", {rule = "markdown"})
```

<p class="tips">
通过`add_files("*.md", {rule = "markdown"})`方式指定的规则，优先级高于`add_rules("markdown")`设置的规则。
</p>

我们还可以实现规则的级联构建，例如在构建man规则后，继续调用markdown规则，实现级联构建：

```lua
rule("man")
    add_imports("core.project.rule")
    on_build(function (target, sourcefile)
        rule.build("markdown", target, sourcefile)
    end)
```

对于有些文件，需要支持多文件构建生成单一对象的模式，可以通过[on_build_all](/zh/manual#ruleon_build_all)来实现：

```lua
rule("man")
    on_build_all(function (target, sourcefiles)
        -- build some source files
        for _, sourcefile in ipairs(sourcefiles) do
            -- ...
        end
    end)

target("test")
    -- ...
    add_files("src/test/*.doc.in", {rule = "man"})
```

#### 通过`xmake f --menu`实现可视化菜单配置

之前的版本，使用[option](/zh/manual#option)可实现命令行菜单选项的用户自定义，当工程配置相当多的情况下，采用这种命令行配置的方式就不是很灵活了。

因此在2.1.9版本中，我们扩展了option，使其原生支持`xmake f --menu`的图形化配置界面，实现复杂的分级配置，并且支持配置的模糊查找和定位，配置项目更加灵活方便。

我们可以通过[set_category](/zh/manual#set-category)设置option的分级路径名`set_category("root/submenu/submenu2")`，例如：

```lua
-- 'boolean' option
option("test1")
    set_default(true)
    set_showmenu(true)
    set_category("root menu/test1")

-- 'choice' option with values: "a", "b", "c"
option("test2")
    set_default("a")
    set_values("a", "b", "c")
    set_showmenu(true)
    set_category("root menu/test2")

-- 'string' option
option("test3")
    set_default("xx")
    set_showmenu(true)
    set_category("root menu/test3/test3")

-- 'number' option
option("test4")
    set_default(6)
    set_showmenu(true)
    set_category("root menu/test4")
```

上述配置最后显示的菜单界面路径结构：

- root menu
  - test1
  - test2
  - test3
    - test3
  - test4

效果图如下：

<img src="/assets/img/posts/xmake/option_set_category.gif">

并且我们还可以通过[set_values](/zh/manual#set-values)，提供选项值列表供用户快速选择使用，例如：

```lua
option("test")
    set_default("b")
    set_showmenu(true)
    set_values("a", "b", "c")
```

效果图如下：

<img src="/assets/img/posts/xmake/option_set_values.png">

#### 搜索用户配置

<img src="/assets/img/posts/xmake/searchconf.gif">