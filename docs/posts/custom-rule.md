---
title: Using Custom Build Rules in xmake
tags: [xmake, lua, custom rules]
date: 2017-11-13
author: Ruki
outline: deep
---

After version 2.1.9, xmake not only natively supports building multiple language files, but also allows users to implement complex unknown file builds through custom build rules.

For specific usage instructions, please refer to the relevant documentation: [Rule Usage Manual](https://xmake.io/)

#### General Rules

We can extend build support for other files by pre-setting the file extensions supported by rules:

```lua
-- Define a build rule for markdown files
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build(function (target, sourcefile)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)

target("test")
    set_kind("binary")
    
    -- Make test target support markdown file build rules
    add_rules("markdown")

    -- Add markdown file builds
    add_files("src/*.md")
    add_files("src/*.markdown")
```

We can also specify some scattered other files to be processed as markdown rules:

```lua
target("test")
    -- ...
    add_files("src/test/*.md.in", {rule = "markdown"})
```

Note: Rules specified through `add_files("*.md", {rule = "markdown"})` have higher priority than rules set by `add_rules("markdown")`.

#### Dependent Builds

We can also implement cascading builds of rules. For example, after building the man rule, continue to call the markdown rule to implement cascading builds:

```lua
rule("man")
    add_imports("core.project.rule")
    on_build(function (target, sourcefile)
        rule.build("markdown", target, sourcefile)
    end)
```

Among them, `add_imports` is used to pre-import extension modules, which can be directly used in multiple custom scripts. For specific instructions, see: [add_imports Documentation](https://xmake.io/)

#### Multi-file Builds

For some files, you need to support multi-file builds to generate a single object mode, which can be implemented through `on_build_all`:

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

#### Clean and Install

We can use `on_clean`, `on_install` to implement custom rule cleanup and installation logic, processing one source file at a time, for example:

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

Finally, here's a complete example for reference: [Rule Usage Example](https://github.com/xmake-io/xmake/issues/149)

