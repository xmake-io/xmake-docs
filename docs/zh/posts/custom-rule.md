---
title: xmake 自定义构建规则的使用
tags: [xmake, lua, 自定义规则]
date: 2017-11-13
author: Ruki
outline: deep
---

在2.1.9版本之后，xmake不仅原生内置支持多种语言文件的构建，而且还可以通过自定义构建规则，让用户自己来实现复杂的未知文件构建。

具体使用介绍，可参考相关文档：[rule规则使用手册](https://xmake.io/zh/)

#### 通用规则

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

注：通过`add_files("*.md", {rule = "markdown"})`方式指定的规则，优先级高于`add_rules("markdown")`设置的规则。






#### 依赖构建

我们还可以实现规则的级联构建，例如在构建man规则后，继续调用markdown规则，实现级联构建：

```lua
rule("man")
    add_imports("core.project.rule")
    on_build(function (target, sourcefile)
        rule.build("markdown", target, sourcefile)
    end)
```

其中`add_imports`用于预先导入扩展模块，可在多个自定义脚本中直接使用，具体说明见：[add_imports文档](https://xmake.io/zh/)

#### 多文件构建

对于有些文件，需要支持多文件构建生成单一对象的模式，可以通过`on_build_all`来实现：

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

#### 清理和安装

我们可以通过`on_clean`, `on_install`用于实现自定义规则的清理和安装逻辑，每次处理一个源文件，例如：

```lua
rule("markdown")
    on_build(function (target, sourcefile)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)
    on_clean(function (target, sourcefile)
        os.rm(path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)
    on_install(function (target, sourcefile)
        import("core.base.option")
        os.cp(path.join(target:targetdir(), path.basename(sourcefile) .. ".html"), option.get("outputdir"))
    end)
```

最后附上一个完整例子，请供参考：[rule使用例子](https://github.com/xmake-io/xmake/issues/149)