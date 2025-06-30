# 辅助接口

另外，此接口在 2.2.5 之后的版本，提供了一些内置的辅助函数，可以直接使用 includes 导入，具体有哪些内置函数可以看下：[Helper functions](https://github.com/xmake-io/xmake/tree/master/xmake/includes)

我们可以使用这些接口，检测links, c/c++ type, includes 和 编译器特性，并且写入宏定义到config.h

其中，我们提供了两类接口，`check_xxx` 和 `configvar_check_xxx`，带有 `configvar_` 前缀的接口会在检测通过后，写入 `add_configfiles` 指定的 config.h.in 模板文件。

而 `check_xxx` 仅仅只是定义相关 macros 参与编译，但不会持久化到 `config.h.in` 中去。

相关 issues 见：

- [#342](https://github.com/xmake-io/xmake/issues/342)
- [#1715](https://github.com/xmake-io/xmake/issues/1715)

:::tip 注意
注：如果是 2.8.5 以上版本，就不需要通过 `includes("check_links.lua")` 分别引入这些接口了，而是使用更加方便的
:::

```lua
includes("@builtin/check")
```

一次性引入所有检测接口，当然我们也可以按需引入单个脚本：

```lua
includes("@builtin/check/check_links.lua")
```

而原有的引入路径，没有区分是否为用户路径，不方便管理维护，且容易被用户配置干扰，后面会逐步废弃。

## 检测 links

我们可以通过尝试链接来检测指定的 links 是否通过。


```lua
includes("check_links.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")
    configvar_check_links("HAS_PTHREAD", {"pthread", "m", "dl"})
```



```c [config.h.in]
${define HAS_PTHREAD}
```



```c [config.h]
define HAS_PTHREAD 1
/* #undef HAS_PTHREAD */
```

## 检测 c/c++ 类型

我们也能够检测 c/c++ 类型是否存在。

`configvar_check_ctypes` 用于检测 c 代码类型，`configvar_check_cxxtypes` 用于检测 c++ 代码类型。

```lua
includes("check_ctypes.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")
    configvar_check_ctypes("HAS_WCHAR", "wchar_t")
    configvar_check_ctypes("HAS_WCHAR_AND_FLOAT", {"wchar_t", "float"})
```



```c [config.h.in]
${define HAS_WCHAR}
${define HAS_WCHAR_AND_FLOAT}
```



```c [config.h]
/* #undef HAS_WCHAR */
/* #undef HAS_WCHAR_AND_FLOAT */
```

## 检测 c/c++ 函数

`configvar_check_cfuncs` 用于检测 c 代码函数，`configvar_check_cxxfuncs` 用于检测 c++ 代码函数。

```lua
includes("check_cfuncs.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")
    configvar_check_cfuncs("HAS_SETJMP", "setjmp", {includes = {"signal.h", "setjmp.h"}})
```



```c [config.h.in]
${define HAS_SETJMP}
```


```c [config.h]
define HAS_SETJMP 1
/* #undef HAS_SETJMP */
```

## 检测 c/c++ 头文件

`configvar_check_cincludes` 用于检测 c 代码头文件，`configvar_check_cxxincludes` 用于检测 c++ 代码头文件。

```lua
includes("check_cincludes.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")
    configvar_check_cincludes("HAS_STRING_H", "string.h")
    configvar_check_cincludes("HAS_STRING_AND_STDIO_H", {"string.h", "stdio.h"})
```



```c [config.h.in]
${define HAS_STRING_H}
${define HAS_STRING_AND_STDIO_H}
```



```c [config.h]
/* #undef HAS_STRING_H */
define HAS_STRING_AND_STDIO_H 1
```

## 检测 c/c++ 代码片段

`configvar_check_csnippets` 用于检测 c 代码片段，`configvar_check_cxxsnippets` 用于检测 c++ 代码片段。

```lua
includes("check_csnippets.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")
    configvar_check_csnippets("HAS_STATIC_ASSERT", "_Static_assert(1, \"\");")
```



```c [config.h.in]
${define HAS_STATIC_ASSERT}
```



```c [config.h]
define HAS_STATIC_ASSERT 1
```

v2.5.7 之后对 check_csnippets 做了改进，新增 `tryrun` 和 `output` 参数去尝试运行和捕获输出。

```lua
includes("check_csnippets.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")

    check_csnippets("HAS_INT_4", "return (sizeof(int) == 4)? 0 : -1;", {tryrun = true})
    check_csnippets("INT_SIZE", 'printf("%d", sizeof(int)); return 0;', {output = true, number = true})
    configvar_check_csnippets("HAS_LONG_8", "return (sizeof(long) == 8)? 0 : -1;", {tryrun = true})
    configvar_check_csnippets("PTR_SIZE", 'printf("%d", sizeof(void*)); return 0;', {output = true, number = true})
```

如果启用捕获输出，`config.h.in` 的 `${define PTR_SIZE}` 会自动生成 `#define PTR_SIZE 4`。

其中，`number = true` 设置，可以强制作为 number 而不是字符串值，否则默认会定义为 `#define PTR_SIZE "4"`

## 检测编译器特性

```lua
includes("check_features.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")
    configvar_check_features("HAS_CONSTEXPR", "cxx_constexpr")
    configvar_check_features("HAS_CONSEXPR_AND_STATIC_ASSERT", {"cxx_constexpr", "c_static_assert"}, {languages = "c++11"})
```



```c [config.h.in]
${define HAS_CONSTEXPR}
${define HAS_CONSEXPR_AND_STATIC_ASSERT}
```



```c [config.h]
/* #undef HAS_CONSTEXPR */
define HAS_CONSEXPR_AND_STATIC_ASSERT 1
```

所有 c 编译器特性列表：

| 特性名                |
| --------------------- |
| c_static_assert       |
| c_restrict            |
| c_variadic_macros     |
| c_function_prototypes |

所有 c++ 编译器特性列表：

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

v2.5.9 新增 c++17 特性检测：

| 特性名                               |
| ------------------------------------ |
| cxx_aggregate_bases                  |
| cxx_aligned_new                      |
| cxx_capture_star_this                |
| cxx_constexpr                        |
| cxx_deduction_guides                 |
| cxx_enumerator_attributes            |
| cxx_fold_expressions                 |
| cxx_guaranteed_copy_elision          |
| cxx_hex_float                        |
| cxx_if_constexpr                     |
| cxx_inheriting_constructors          |
| cxx_inline_variables                 |
| cxx_namespace_attributes             |
| cxx_noexcept_function_type           |
| cxx_nontype_template_args            |
| cxx_nontype_template_parameter_auto  |
| cxx_range_based_for                  |
| cxx_static_assert                    |
| cxx_structured_bindings              |
| cxx_template_template_args           |
| cxx_variadic_using                   |

v2.5.9 新增 c++20 特性检测：

| 特性名                               |
| ------------------------------------ |
| cxx_aggregate_paren_init             |
| cxx_char8_t                          |
| cxx_concepts                         |
| cxx_conditional_explicit             |
| cxx_consteval                        |
| cxx_constexpr                        |
| cxx_constexpr_dynamic_alloc          |
| cxx_constexpr_in_decltype            |
| cxx_constinit                        |
| cxx_deduction_guides                 |
| cxx_designated_initializers          |
| cxx_generic_lambdas                  |
| cxx_impl_coroutine                   |
| cxx_impl_destroying_delete           |
| cxx_impl_three_way_comparison        |
| cxx_init_captures                    |
| cxx_modules                          |
| cxx_nontype_template_args            |
| cxx_using_enum                       |

2.5.8 之后，新增对 cstd 和 c++ std 版本支持，相关 issues: [#1715](https://github.com/xmake-io/xmake/issues/1715)

```lua
configvar_check_features("HAS_CXX_STD_98", "cxx_std_98")
configvar_check_features("HAS_CXX_STD_11", "cxx_std_11", {languages = "c++11"})
configvar_check_features("HAS_CXX_STD_14", "cxx_std_14", {languages = "c++14"})
configvar_check_features("HAS_CXX_STD_17", "cxx_std_17", {languages = "c++17"})
configvar_check_features("HAS_CXX_STD_20", "cxx_std_20", {languages = "c++20"})
configvar_check_features("HAS_C_STD_89", "c_std_89")
configvar_check_features("HAS_C_STD_99", "c_std_99")
configvar_check_features("HAS_C_STD_11", "c_std_11", {languages = "c11"})
configvar_check_features("HAS_C_STD_17", "c_std_17", {languages = "c17"})
```

## 检测内置宏定义

编译器存在一些内置的宏定义，比如：`__GNUC__` 等，我们可以通过 `check_macros` 和 `configvar_check_macros` 辅助脚本来检测它们是否存在。

相关 issues: [#1715](https://github.com/xmake-io/xmake/issues/1715)

```lua
-- 检测宏是否定义
configvar_check_macros("HAS_GCC", "__GNUC__")
-- 检测宏没有被定义
configvar_check_macros("NO_GCC", "__GNUC__", {defined = false})
-- 检测宏条件
configvar_check_macros("HAS_CXX20", "__cplusplus >= 202002L", {languages = "c++20"})
```

## 检测类型大小

在先前的版本中，我们可以通过 `check_csnippets` 和 `output = true` 的方式，来实现类型检测。

```lua
check_csnippets("INT_SIZE", 'printf("%d", sizeof(int)); return 0;', {output = true, number = true})
```

但是这种方式，是通过尝试运行测试代码，然后获取运行输出结果，提取类型大小信息。

这对于交叉编译，就不适用了。

在 2.8.5 版本中，我们新增了 `check_sizeof` 辅助接口，可以通过直接解析测试程序的二进制文件，提取类型大小信息。

由于不需要运行测试，这种方式不仅可以支持交叉编译，而且对检测效率也有极大的提升，使用也更加的简单。

```lua
includes("@builtin/check")

target("test")
    set_kind("static")
    add_files("*.cpp")
    check_sizeof("LONG_SIZE", "long")
    check_sizeof("STRING_SIZE", "std::string", {includes = "string"})
```

```sh
$ xmake f -c
checking for LONG_SIZE ... 8
checking for STRING_SIZE ... 24
```

另外，我也可以通过 `target:check_sizeof` 在脚本域进行检测。

## 检测大小端

在 2.8.9 版本之后，我们新增了 `check_bigendian` 接口，来判断当前编译目标是否为大端模式。

```lua
includes("@builtin/check")

target("test")
    set_kind("static")
    add_files("*.cpp")
    check_bigendian("IS_BIG_ENDIAN")
```

如果检测通过，当前是大端模式，那么会定义 `IS_BIG_ENDIAN=1`。
