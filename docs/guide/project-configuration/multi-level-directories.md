# Multi-level Directories

In the script field we can import various rich extension modules by import,
and in the description field we can introduce the project subdirectory through the [includes](/api/description/global-interfaces.html#includes) interface.

Remember: Xmake's includes handles the configuration relationship according to the tree structure. The target configuration in `xmake.lua` in the subdirectory inherits the root domain configuration in the parent `xmake.lua`, for example:

Currently, there is the following project structure:

```
Projectdir
    - xmake.lua
    - src
      - xmake.lua
```

`projectdir/xmake.lua` is the project's root `xmake.lua` configuration, and `src/xmake.lua` is a sub-configuration of the project.

`projectdir/xmake.lua` content:

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

Includes("src")
```

The global root domain is configured with `add_defines("ROOT")`, which affects all target configurations below, including all target configurations in the `sub-xmake.lua` of includes, so this is the global total configuration.

The `add_defines("TEST1")` and `add_defines("TEST2")` in test1/test2 belong to the local configuration and only take effect on the current target.

`src/xmake.lua` content:

```lua
add_defines("ROOT2")

target("test3")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("TEST3")
```

In the `src/xmake.lua` sub-configuration, there is also a global root domain, configured with `add_defines("ROOT2")`, which belongs to the sub-configuration root domain and only takes effect on all targets in the current `sub-xmake.lua`. For the target `xmake.lua` in the lower level includes the target, because as previously said, Xmake is the configuration inheritance relationship of the tree structure.

Therefore, the final configuration results of these targets are:

```
target("test1"): -DROOT -DTEST1
target("test2"): -DROOT -DTEST2
target("test3"): -DROOT -DROOT2 -DTEST3
```

