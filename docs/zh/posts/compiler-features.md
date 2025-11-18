---
title: 使用xmake检测编译器特性支持
tags: [xmake, lua, cmake, 编译器特性检测]
date: 2017-08-08
author: Ruki
outline: deep
---

如果我们要写跨平台的c/c++代码，很多时候需要处理由于不同编译器对c/c++各个标准支持力度不同导致的兼容性问题，一般通常的解决办法是：自己在代码中通过宏去判断各个编译器的版本、内置宏、标准库宏、`__has_feature`等来检测处理。

自己如果在代码中按上述的方式检测，会很繁琐，尤其是像c++这种存在大量语法特性，如果一一检测过来，工作量是非常大的。

#### 通过构建工具预先检测编译特性

另外比较省事的方式，就是依赖构建工具提前做好检测，然后把检测结果作为宏添加到编译中去，这样代码只需要判断对应的特性宏是否存在，就可以进行处理了。

在cmake中就有类似的检测机制，非常强大，因此xmake也对其进行了支持，提供更加灵活强大的编译器特性预先检测支持:

```lua
target("test")
    on_load(function (target)
        import("core.tool.compiler")
        if compiler.has_features("cxx_constexpr") then
            target:add("defines", "HAS_CXX_CONSTEXPR=1")
        end
    end)
```

通过`core.tool.compiler`模块的[compiler.has_features](https://xmake.io/zh/)接口，在`xmake.lua`中预先判断当前编译期支持的语言特性，实现条件编译。

此处也是参考了cmake的设计，具体详情见：[issues#83](https://github.com/xmake-io/xmake/issues/83)。

上述代码，在加载target的时候，判断当前编译器是否支持c++的常量表达式语法特性，如果支持则添加宏定义：`HAS_CXX_CONSTEXPR=1`。

我们也可以在判断时候，追加一些参数控制编译选项，例如上述特性需要`c++11`支持，我们可以启用它：

```lua
if compiler.has_features({"c_static_assert", "cxx_constexpr"}, {languages = "cxx11"}) then
    -- ok
end
```

通过上面的代码可以看到，此接口是可以同时检测多个特性的，返回值为实际支持的特性列表。






如果之前对这个target已经设置了`c++11`，那么我们也可以传入target对象，继承target的所有设置，甚至指定一些其他扩展编译配置：

```lua
if compiler.has_features("cxx_constexpr", {target = target, defines = "..", includedirs = ".."}) then
    -- ok
end
```

#### 批量编译器特性检测

c++的语言特性非常多，这个时候我们可以通过脚本实现快速的批量检测：

```lua
target("test")

    on_load(function (target)
        import("core.tool.compiler")
        for feature, _ in pairs(compiler.features("cxx", {target = target})) do -- 传入target在检测特性时继承target的所有编译配置
            target:add("defines", "has_feature_" .. feature)
        end
    end)
```

上述代码，会在加载target的时候，把当前编译器对c++的所有支持特性，都添加到target的宏定义中进行编译，例如：`-Dhas_feature_cxx_constexpr`。
我们只需要在代码中，通过判断对应的特性宏是否存在就行了:

```c
#ifdef has_feature_cxx_constexpr
    // TODO
#endif
```

目前支持的所有c/c++编译器特性列表，见：[compiler.features](https://xmake.io/zh/)

#### 更加底层的检测接口

如果我们要指定获取具体哪个编译器的特性支持，则需要更加底层的接口支持了，例如：

```lua
import("lib.detect.has_features")

local features = has_features("clang", "cxx_constexpr")
local features = has_features("clang", {"cxx_constexpr", "c_static_assert"}, {flags = {"-g", "-O0"}, program = "xcrun -sdk macosx clang"})
local features = has_features("clang", {"cxx_constexpr", "c_static_assert"}, {flags = "-g"})
```

[lib.detect.has_features](https://xmake.io/zh/)属于探测模块的接口，可以指定需要检测的工具名，例如这里通过传入clang，只对clang编译器进行检测。

当然此接口，还可以检测其他非编译器的工具特性，更加的通用。


#### 通过自定义c/c++代码片段来检测特性

对于一些复杂的编译器特性，连[compiler.has_features](https://xmake.io/zh/)都无法检测到的时候，可以通过自定义代码片段尝试编译来检测它。

```lua
import("lib.detect.check_cxsnippets")

local ok = check_cxsnippets("constexpr int f(int x) { return x ? x+f(x-1) : 0; } constexpr int x = f(5); static_assert(x == 15);", {sourcekind = "cxx", languages = "cxx11"})
```

上述代码通过自定义一个constexpr的测试代码，去检测c++11的constexpr支持。

此接口是[detect.has_cfuncs](https://xmake.io/zh/), [detect.has_cincludes](https://xmake.io/zh/)和[detect.has_ctypes](https://xmake.io/zh/)等接口的通用版本，也更加底层。

因此我们可以用它来检测：types, functions, includes 还有 links，或者是组合起来一起检测。

第一个参数为代码片段列表，一般用于一些自定义特性的检测，如果为空，则可以仅仅检测可选参数中条件，例如：

```lua
local ok = check_cxsnippets({"void test() {}", "void test2() {}"}, {types = {"wchar_t", "char*"}, includes = "stdio.h", funcs = {"sigsetjmp", "sigsetjmp((void*)0, 0)"}})
```

上面那个调用，会去同时检测types, includes和funcs是否都满足，如果通过返回true。
