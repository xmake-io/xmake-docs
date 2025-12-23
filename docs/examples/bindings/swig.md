Version 2.5.8 supports the construction of Swig modules. We provide `swig.c` and `swig.cpp` rules, which respectively support the generation of c/c++ module interface code, and cooperate with xmake's package management system to realize fully automated modules and dependent packages. Integration.

Related issues: [#1622](https://github.com/xmake-io/xmake/issues/1622)

## Lua/C module

<FileExplorer rootFilesDir="examples/bindings/swig/lua" />

## Python/C module

<FileExplorer rootFilesDir="examples/bindings/swig/python_c" />

## Python/C++ module

<FileExplorer rootFilesDir="examples/bindings/swig/python_cpp" />

## Java/C module

[Example project](https://github.com/xmake-io/xmake/blob/dev/tests/projects/swig/java_c)

<FileExplorer rootFilesDir="examples/bindings/swig/java" />

We can also configure `buildjar = true` to build jar file.

```lua
add_rules("swig.c", {moduletype = "java", buildjar = true})
```
