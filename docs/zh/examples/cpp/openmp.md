
v2.6.1 以后，改进了 openmp 的配置，更加简化和统一，我们不再需要额外配置 rules，仅仅通过一个通用的 openmp 包就可以实现相同的效果。

```lua
add_requires("openmp")
target("loop")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("openmp")
```

v2.5.9 之前的版本

```lua
add_requires("libomp", {optional = true})
target("loop")
    set_kind("binary")
    add_files("src/*.cpp")
    add_rules("c++.openmp")
    add_packages("libomp")
```

如果是c代码，需要启用 `add_rules("c.openmp")`，如果是 c/c++ 混合编译，那么这两个规则都要设置。
