Version 2.5.8 supports the construction of Swig modules. We provide `swig.c` and `swig.cpp` rules, which respectively support the generation of c/c++ module interface code, and cooperate with xmake's package management system to realize fully automated modules and dependent packages. Integration.

Related issues: [#1622](https://github.com/xmake-io/xmake/issues/1622)

## Lua/C module

```lua
add_rules("mode.release", "mode.debug")
add_requires("lua")

target("example")
    add_rules("swig.c", {moduletype = "lua"})
    add_files("src/example.i", {swigflags = "-no-old-metatable-bindings"})
    add_files("src/example.c")
    add_packages("lua")
```

## Python/C module

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.c", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.c")
    add_packages("python")
```

## Python/C++ module

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.cpp", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.cpp")
    add_packages("python")
```

## Java/C module

[Example project](https://github.com/xmake-io/xmake/blob/dev/tests/projects/swig/java_c)

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

We can also configure `buildjar = true` to build jar file.

```lua
add_rules("swig.c", {moduletype = "java", buildjar = true})
```
