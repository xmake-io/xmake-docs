# Configuration Optimization {#configuration-optimization}

The configuration syntax of `xmake.lua` in xmake is very flexible. Although the standard configuration scope syntax is very clear, using multi-line definitions for some simple configuration items may appear redundant.

Therefore, xmake provides some simplified syntax to optimize the readability of the configuration.

## Simplified Option Definition

For `option` definitions, our usual standard writing style is like this:

```lua
option("test1")
    set_default(true)
    set_description("test1 option")

option("test2")
    set_default(true)

option("test3")
    set_default("hello")
```

If there are many options, this writing style will occupy a large number of lines, causing the configuration to appear not compact enough. We can use the single-line definition syntax to simplify it:

```lua
option("test1", {default = true, description = "test1 option"})
option("test2", {default = true})
option("test3", {default = "hello"})
```

This writing style not only reduces the number of code lines but also makes the definition of each option more centralized and clear at a glance, greatly improving the readability of the configuration.


