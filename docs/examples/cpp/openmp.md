
After v2.6.1, the configuration of openmp has been improved, which is more simplified and unified. We no longer need to configure additional rules. The same effect can be achieved only through a common openmp package.

```lua
add_requires("openmp")
target("loop")
     set_kind("binary")
     add_files("src/*.cpp")
     add_packages("openmp")
```

Before v2.5.9

```lua
add_requires("libomp", {optional = true})
target("loop")
    set_kind("binary")
    add_files("src/*.cpp")
    add_rules("c++.openmp")
    add_packages("libomp")
```

If it is c code, you need to enable ʻadd_rules("c.openmp")`. If it is c/c++ mixed compilation, then these two rules must be set.
