
2.5.8 版本支持构建 Swig 模块，我们提供了 `swig.c` 和 `swig.cpp` 规则，分别对应支持生成 c/c++ 模块接口代码，配合 xmake 的包管理系统实现完全自动化的模块和依赖包整合。

相关 issues: [#1622](https://github.com/xmake-io/xmake/issues/1622)

## Lua/C 模块 {#lua-c-module}

```lua
add_rules("mode.release", "mode.debug")
add_requires("lua")

target("example")
    add_rules("swig.c", {moduletype = "lua"})
    add_files("src/example.i", {swigflags = "-no-old-metatable-bindings"})
    add_files("src/example.c")
    add_packages("lua")
```

## Python/C 模块 {#python-c-module}

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.c", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.c")
    add_packages("python")
```

## Python/C++ 模块 {#python-cpp-module}

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.cpp", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.cpp")
    add_packages("python")
```

## Java/C 模块 {#java-c-module}

[完整例子](https://github.com/xmake-io/xmake/blob/dev/tests/projects/swig/java_c)

```lua
-- make sure you config to an enviroment with jni.h
-- for example: xmake f -c -p android

target("example")
    set_kind('shared')
    -- set moduletype to java
    add_rules("swig.c", {moduletype = "java"})
    -- test jar build
    -- add_rules("swig.c", {moduletype = "java" , buildjar = true})
    -- use swigflags to provider package name and output path of java files
    add_files("src/example.i", {swigflags = {
        "-package",
        "com.example",
        "-outdir",
        "build/java/com/example/"
    }})
    add_files("src/example.c")
    add_includedirs("src")
    before_build(function()
        -- ensure output path exists before running swig
        os.mkdir("build/java/com/example/")
    end)
```

我们也可以配置

```lua
add_rules("swig.c", {moduletype = "java", buildjar = true})
```

去同时构建 jar 包，方便直接使用。
