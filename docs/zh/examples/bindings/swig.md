
2.5.8 版本支持构建 Swig 模块，我们提供了 `swig.c` 和 `swig.cpp` 规则，分别对应支持生成 c/c++ 模块接口代码，配合 xmake 的包管理系统实现完全自动化的模块和依赖包整合。

相关 issues: [#1622](https://github.com/xmake-io/xmake/issues/1622)

## Lua/C 模块 {#lua-c-module}

<FileExplorer rootFilesDir="examples/bindings/swig/lua" />

## Python/C 模块 {#python-c-module}

<FileExplorer rootFilesDir="examples/bindings/swig/python_c" />

## Python/C++ 模块 {#python-cpp-module}

<FileExplorer rootFilesDir="examples/bindings/swig/python_cpp" />

## Java/C 模块 {#java-c-module}

[完整例子](https://github.com/xmake-io/xmake/blob/dev/tests/projects/swig/java_c)

<FileExplorer rootFilesDir="examples/bindings/swig/java" />

我们也可以配置

```lua
add_rules("swig.c", {moduletype = "java", buildjar = true})
```

去同时构建 jar 包，方便直接使用。
