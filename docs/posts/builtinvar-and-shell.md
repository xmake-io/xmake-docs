---
title: Builtin variables and shell
tags: [xmake, shell, builtin-variables, pkg-config]
date: 2016-07-18
author: Ruki
---

xmake provides the grammar: `$(varname)` for supporting builtin variable.

.e.g

```lua
add_cxflags("-I$(buildir)")
```

It will translate this variable to the real value when building.

```
-I$(buildir) => -I./build
```

We can also use these variables in the custom scripts.

```lua
target("test")
    after_build(target)
        print("build ok for $(plat)!")
    end
```

And the output result is

```lua
build ok for macosx!
```



xmake will get values of these valriables from the cached configure after running `xmake config --plat=macosx ...` 

Also we have some variables which are not in the configure file.

.e.g

```lua
print("$(os)")
print("$(host)")
print("$(tmpdir)")
print("$(curdir)")
```

we can uses these variable for writing `xmake.lua` more easily.

.e.g

```lua
os.cp("$(projectdir)/file", "$(tmpdir)")
```

vs 

```lua
-- import project module
import("core.project.project")

-- copy file
os.cp(path.join(project.directory(), "file"), os.tmpdir())
```

xmake can also run native shell for calling some third-party tools.

.e.g 

```lua
target("test")
    set_kind("binary")
    if is_plat("linux") then
        add_ldflags("$(shell pkg-config --libs sqlite3)")
    end
```

Or

```lua
target("test")
    set_kind("binary")
    if is_plat("linux") then
        add_linkdir("$(shell find ./ -name lib)")
    end
```

But often, we do not need to do this. The Lua srcipt has been very powerful : )

