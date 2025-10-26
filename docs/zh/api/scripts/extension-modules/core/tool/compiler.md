
# core.tool.compiler

编译器相关操作，常用于插件开发。

## compiler.compile

- 执行编译

#### 函数原型

::: tip API
```lua
compiler.compile(sourcefile: <string>, objectfile: <string>, depfile: <string>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| sourcefile | 必需。源文件路径 |
| objectfile | 必需。目标文件路径 |
| depfile | 可选。依赖文件路径 |
| opt | 可选。选项参数，支持 `target` |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 编译成功返回 true，失败返回 false |

#### 用法说明

针对target，链接指定对象文件列表，生成对应的目标文件，例如：

```lua
compiler.compile("xxx.c", "xxx.o", "xxx.h.d", {target = target})
```

其中[target](/zh/api/description/project-target)，为工程目标，这里传入，主要用于获取target特定的编译选项，
具体如果获取工程目标对象，见：[core.project.project](/zh/api/scripts/extension-modules/core/project/project)。

而`xxx.h.d`文件用于存储为此源文件的头文件依赖文件列表，最后这两个参数都是可选的，编译的时候可以不传他们：

```lua
compiler.compile("xxx.c", "xxx.o")
```

来单纯编译一个源文件。

## compiler.compcmd

- 获取编译命令行

#### 函数原型

::: tip API
```lua
compiler.compcmd(sourcefile: <string>, objectfile: <string>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| sourcefile | 必需。源文件路径 |
| objectfile | 必需。目标文件路径 |
| opt | 可选。选项参数，支持 `target` 和 `configs` |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回编译命令字符串 |

#### 用法说明

直接获取[compiler.compile](#compiler-compile)中执行的命令行字符串，相当于：

```lua
local cmdstr = compiler.compcmd("xxx.c", "xxx.o", {target = target})
```

注：后面`{target = target}`扩展参数部分是可选的，如果传递了target对象，那么生成的编译命令，会加上这个target配置对应的链接选项。

并且还可以自己传递各种配置，例如：

```lua
local cmdstr = compiler.compcmd("xxx.c", "xxx.o", {configs = {includedirs = "/usr/include", defines = "DEBUG"}})
```

通过target，我们可以导出指定目标的所有源文件编译命令：

```lua
import("core.project.project")

for _, target in pairs(project.targets()) do
    for sourcekind, sourcebatch in pairs(target:sourcebatches()) do
        for index, objectfile in ipairs(sourcebatch.objectfiles) do
            local cmdstr = compiler.compcmd(sourcebatch.sourcefiles[index], objectfile, {target = target})
        end
    end
end
```

## compiler.compargv

- 获取编译命令行列表

#### 函数原型

::: tip API
```lua
compiler.compargv(sourcefile: <string>, objectfile: <string>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| sourcefile | 必需。源文件路径 |
| objectfile | 必需。目标文件路径 |
| opt | 可选。选项参数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 编译器程序路径 |
| table | 编译参数列表 |

#### 用法说明

跟[compiler.compcmd](#compiler-compcmd)稍微有点区别的是，此接口返回的是参数列表，table表示，更加方便操作：

```lua
local program, argv = compiler.compargv("xxx.c", "xxx.o")
```

## compiler.compflags

- 获取编译选项

#### 函数原型

::: tip API
```lua
compiler.compflags(sourcefile: <string>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| sourcefile | 必需。源文件路径 |
| opt | 可选。选项参数，支持 `target` |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回编译选项列表数组 |

#### 用法说明

获取[compiler.compcmd](#compiler-compcmd)中的编译选项字符串部分，不带shellname和文件列表，例如：

```lua
local flags = compiler.compflags(sourcefile, {target = target})
for _, flag in ipairs(flags) do
    print(flag)
end
```

返回的是flags的列表数组。

## compiler.has_flags

- 判断指定编译选项是否支持

#### 函数原型

::: tip API
```lua
compiler.has_flags(sourcekind: <string>, flag: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| sourcekind | 必需。源文件类型，例如 "c", "cxx" |
| flag | 必需。要判断的编译选项 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 支持返回 true，不支持返回 false |

#### 用法说明

虽然通过[lib.detect.has_flags](/zh/api/scripts/extension-modules/lib/detect#detect-has_flags)也能判断，但是那个接口更加底层，需要指定编译器名称。
而此接口只需要指定语言类型，它会自动切换选择当前支持的编译器。

```lua
-- 判断c语言编译器是否支持选项: -g
if compiler.has_flags("c", "-g") then
    -- ok
end

-- 判断c++语言编译器是否支持选项: -g
if compiler.has_flags("cxx", "-g") then
    -- ok
end
```

## compiler.features

- 获取所有编译器特性

#### 函数原型

::: tip API
```lua
compiler.features(sourcekind: <string>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| sourcekind | 必需。源文件类型，例如 "c", "cxx" |
| opt | 可选。选项参数，支持 `target` 和 `configs` |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回特性列表数组 |

#### 用法说明

虽然通过[lib.detect.features](/zh/api/scripts/extension-modules/lib/detect#detect-features)也能获取，但是那个接口更加底层，需要指定编译器名称。
而此接口只需要指定语言类型，它会自动切换选择当前支持的编译器，然后获取当前的编译器特性列表。

```lua
-- 获取当前c语言编译器的所有特性
local features = compiler.features("c")

-- 获取当前c++语言编译器的所有特性，启用c++11标准，否则获取不到新标准的特性
local features = compiler.features("cxx", {configs = {cxxflags = "-std=c++11"}})

-- 获取当前c++语言编译器的所有特性，传递工程target的所有配置信息
local features = compiler.features("cxx", {target = target, configs = {defines = "..", includedirs = ".."}})
```

所有c编译器特性列表：

| 特性名                |
| --------------------- |
| c_static_assert       |
| c_restrict            |
| c_variadic_macros     |
| c_function_prototypes |

所有c++编译器特性列表：

| 特性名                               |
| ------------------------------------ |
| cxx_variable_templates               |
| cxx_relaxed_constexpr                |
| cxx_aggregate_default_initializers   |
| cxx_contextual_conversions           |
| cxx_attribute_deprecated             |
| cxx_decltype_auto                    |
| cxx_digit_separators                 |
| cxx_generic_lambdas                  |
| cxx_lambda_init_captures             |
| cxx_binary_literals                  |
| cxx_return_type_deduction            |
| cxx_decltype_incomplete_return_types |
| cxx_reference_qualified_functions    |
| cxx_alignof                          |
| cxx_attributes                       |
| cxx_inheriting_constructors          |
| cxx_thread_local                     |
| cxx_alias_templates                  |
| cxx_delegating_constructors          |
| cxx_extended_friend_declarations     |
| cxx_final                            |
| cxx_nonstatic_member_init            |
| cxx_override                         |
| cxx_user_literals                    |
| cxx_constexpr                        |
| cxx_defaulted_move_initializers      |
| cxx_enum_forward_declarations        |
| cxx_noexcept                         |
| cxx_nullptr                          |
| cxx_range_for                        |
| cxx_unrestricted_unions              |
| cxx_explicit_conversions             |
| cxx_lambdas                          |
| cxx_local_type_template_args         |
| cxx_raw_string_literals              |
| cxx_auto_type                        |
| cxx_defaulted_functions              |
| cxx_deleted_functions                |
| cxx_generalized_initializers         |
| cxx_inline_namespaces                |
| cxx_sizeof_member                    |
| cxx_strong_enums                     |
| cxx_trailing_return_types            |
| cxx_unicode_literals                 |
| cxx_uniform_initialization           |
| cxx_variadic_templates               |
| cxx_decltype                         |
| cxx_default_function_template_args   |
| cxx_long_long_type                   |
| cxx_right_angle_brackets             |
| cxx_rvalue_references                |
| cxx_static_assert                    |
| cxx_extern_templates                 |
| cxx_func_identifier                  |
| cxx_variadic_macros                  |
| cxx_template_template_parameters     |

## compiler.has_features

- 判断指定的编译器特性是否支持

#### 函数原型

::: tip API
```lua
compiler.has_features(features: <string|table>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| features | 必需。特性名称或特性名称列表 |
| opt | 可选。选项参数，支持 `languages`, `target`, `configs` 等 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 支持返回 true，不支持返回 false |

#### 用法说明

虽然通过[lib.detect.has_features](/zh/api/scripts/extension-modules/lib/detect#detect-has_features)也能获取，但是那个接口更加底层，需要指定编译器名称。
而此接口只需要指定需要检测的特姓名称列表，就能自动切换选择当前支持的编译器，然后判断指定特性在当前的编译器中是否支持。

```lua
if compiler.has_features("c_static_assert") then
    -- ok
end

if compiler.has_features({"c_static_assert", "cxx_constexpr"}, {languages = "cxx11"}) then
    -- ok
end

if compiler.has_features("cxx_constexpr", {target = target, defines = "..", includedirs = ".."}) then
    -- ok
end
```

具体特性名有哪些，可以参考：[compiler.features](#compiler-features)。
