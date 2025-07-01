# Namespace isolation {#namespace-isolation}

If the user maintains two independent sub-projects, and there are some targets, options, and rule names with the same name, when they are integrated into one project through includes, there may be a naming conflict that causes compilation errors.

To avoid this problem, Xmake provides the namespace feature to isolate different projects into independent namespaces, so that they can be built independently and merged without conflict, for example:

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

add_defines("ROOT")

namespace("ns1", function ()
    includes("foo")
end)

target("foo")
    set_kind("binary")
    add_deps("ns1::foo")
    add_files("src/main.cpp")
    add_defines("TEST")
```

```lua [foo/xmake.lua]
add_defines("NS1_ROOT")
target("foo")
    set_kind("static")
    add_files("src/foo.cpp")
    add_defines("FOO")
```

In the above configuration, foo is an independent project directory and can be built separately. It is a library project.

However, we can use `includes("foo")` to introduce it into another project for use. That project also has a foo target with the same name.

Due to the isolation of namespaces, there will be no conflict between them. We can use `ns1::foo` to access the target in the foo subproject.
In addition, the root scope configurations in the namespace will not affect each other.

For more information on the use of namespaces, please refer to the full document: [Namespace API Manual](/api/description/global-interfaces#namespace).
