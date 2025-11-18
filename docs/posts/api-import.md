---
title: Plugin Development: Import Libraries
tags: [xmake, plugin, import, library, custom script]
date: 2016-06-09
author: Ruki
outline: deep
---

`import` is mainly used to import xmake's extension libraries and some custom library modules. It is generally used in custom scripts (`on_build`, `on_run` ..), plugin development, template development, platform extensions, custom tasks, etc.

The import mechanism is as follows:

1. First import from the current script directory
2. Then import from extension libraries

Import syntax rules:

Based on `.` library path rules, for example:

Import core extension modules:

```lua
    import("core.base.option")
    import("core.project")
    import("core.project.task")
    import("core")

    function main()
        
        -- Get argument options
        print(option.get("version"))

        -- Run tasks and plugins
        task.run("hello")
        project.task.run("hello")
        core.project.task.run("hello")
    end
```

Import custom modules from current directory:

Directory structure:

```lua
    plugin
      - xmake.lua
      - main.lua
      - modules
        - hello1.lua
        - hello2.lua
```

Import modules in `main.lua`:

```lua
    import("modules.hello1")
    import("modules.hello2")
```

After importing, you can directly use all public interfaces. Private interfaces are prefixed with `_` to indicate they will not be exported and will not be called externally.

In addition to the current directory, we can also import libraries from other specified directories, for example:

```lua
    import("hello3", {rootdir = "/home/xxx/modules"})
```

To prevent naming conflicts, you can also specify an alias after importing:

```lua
    import("core.platform.platform", {alias = "p"})

    function main()
     
        -- This way we can use p to call the plats interface of the platform module to get all platforms supported by xmake
        table.dump(p.plats())
    end
```

`import` can not only import libraries, but also support inheritance import at the same time, implementing inheritance relationships between modules:

```lua
    import("xxx.xxx", {inherit = true})
```

This way, what is imported is not a reference to this module, but all public interfaces of the imported module itself, which will be merged with the current module's interfaces to implement inheritance between modules.

