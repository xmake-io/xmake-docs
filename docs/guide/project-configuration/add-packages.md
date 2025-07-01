# Add Packages {#add-packages}

Xmake has built-in support for package dependency integration. You can declare the required dependency packages through the [add_requires](/api/description/global-interfaces#add-requires) interface.

Then, through the [add_packages](/api/description/project-target#add-packages) interface, bind the declared package to the required compilation target, for example:

```lua [xmake.lua]
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")

target("foo")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libpng")

target("bar")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

Among them, `add_requires` is a global interface, used for package configuration declaration, and Xmake will trigger search and installation based on the declared package.

Since a project may have multiple target programs, each target program may require different dependency packages, so we also need to bind the target through `add_packages`.

In the above configuration example, the foo target binds the tbox and libpng packages, while the bar target binds the zlib package.

For more information about the use of dependency packages, please refer to the full document: [Package Dependency Management](/guide/package-management/using-official-packages).
