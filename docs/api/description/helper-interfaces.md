# Helper interfaces

In addition, the version of this interface after 2.2.5 provides some built-in helper functions, which can be imported directly using includes. See the specific built-in functions: [Helper functions](https://github.com/xmake- io/xmake/tree/master/xmake/includes)

We can use these interfaces to detect links, c/c++ type, includes and compiler features, and write macro definitions to config.h

Among them, we provide two types of interfaces, `check_xxx` and `configvar_check_xxx`. The interfaces prefixed with `configvar_` will be written into the config.h.in template file specified by `add_configfiles` after passing the test.

And `check_xxx` only defines related macros to participate in compilation, but it will not be persisted in `config.h.in`.

For related issues, see:

-[#342](https://github.com/xmake-io/xmake/issues/342)
-[#1715](https://github.com/xmake-io/xmake/issues/1715)


Note: Instead of introducing these interfaces separately via `includes("check_links.lua")`,
for versions 2.8.5 and above, you can use the more convenient

```lua
includes("@builtin/check")
```

to bring in all the checking interfaces at once, but of course we can also bring in individual scripts on an as-needed basis:

```lua
includes("@builtin/check/check_links.lua")
```

The original introduction path, which does not distinguish whether it is a user path or not, is not easy to manage and maintain,
and is easily interfered by user configurations, so it will be gradually deprecated later.

## Check links

We can check whether the specified links pass or not by trying to link.

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

## Detect c/c++ type

We can also detect the existence of c/c++ types.

`configvar_check_ctypes` is used to detect c code types, and `configvar_check_cxxtypes` is used to detect c++ code types.

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

## Detect c/c++ functions

`configvar_check_cfuncs` is used to detect c code functions, and `configvar_check_cxxfuncs` is used to detect c++ code functions.

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

## Detect c/c++ header files

`configvar_check_cincludes` is used to detect c code header files, and `configvar_check_cxxincludes` is used to detect c++ code header files.

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

## Detect c/c++ code snippets

`configvar_check_csnippets` is used to detect c code snippets, and `configvar_check_cxxsnippets` is used to detect c++ code snippets.

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

After v2.5.7, check_csnippets has been improved, adding `tryrun` and `output` parameters to try to run and capture output.

```lua
includes("check_csnippets.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")

    check_csnippets("HAS_INT_4", "return (sizeof(int) == 4)? 0: -1;", {tryrun = true})
    check_csnippets("INT_SIZE",'printf("%d", sizeof(int)); return 0;', {output = true, number = true})
    configvar_check_csnippets("HAS_LONG_8", "return (sizeof(long) == 8)? 0: -1;", {tryrun = true})
    configvar_check_csnippets("PTR_SIZE",'printf("%d", sizeof(void*)); return 0;', {output = true, number = true})
```

If capture output is enabled, `${define PTR_SIZE}` in `config.h.in` will automatically generate `#define PTR_SIZE 4`.

Among them, the `number = true` setting can be forced as a number instead of a string value, otherwise it will be defined as `#define PTR_SIZE "4"` by default

## Detecting compiler features

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

List of all c compiler features:

| Feature name          |
| --------------------- |
| c_static_assert       |
| c_restrict            |
| c_variadic_macros     |
| c_function_prototypes |

List of all c++ compiler features:

| Feature name                         |
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

v2.5.9 adds c++17 feature detection:

| Feature name |
| ------------------------------------ |
| cxx_aggregate_bases |
| cxx_aligned_new |
| cxx_capture_star_this |
| cxx_constexpr |
| cxx_deduction_guides |
| cxx_enumerator_attributes |
| cxx_fold_expressions |
| cxx_guaranteed_copy_elision |
| cxx_hex_float |
| cxx_if_constexpr |
| cxx_inheriting_constructors |
| cxx_inline_variables |
| cxx_namespace_attributes |
| cxx_noexcept_function_type |
| cxx_nontype_template_args |
| cxx_nontype_template_parameter_auto |
| cxx_range_based_for |
| cxx_static_assert |
| cxx_structured_bindings |
| cxx_template_template_args |
| cxx_variadic_using |

v2.5.9 adds c++20 feature detection:

| Feature name |
| ------------------------------------ |
| cxx_aggregate_paren_init |
| cxx_char8_t |
| cxx_concepts |
| cxx_conditional_explicit |
| cxx_consteval |
| cxx_constexpr |
| cxx_constexpr_dynamic_alloc |
| cxx_constexpr_in_decltype |
| cxx_constinit |
| cxx_deduction_guides |
| cxx_designated_initializers |
| cxx_generic_lambdas |
| cxx_impl_coroutine |
| cxx_impl_destroying_delete |
| cxx_impl_three_way_comparison |
| cxx_init_captures |
| cxx_modules |
| cxx_nontype_template_args |
| cxx_using_enum |

After 2.5.8, support for cstd and c++ std versions are added, related issues: [#1715](https://github.com/xmake-io/xmake/issues/1715)

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

## Detect built-in macro definitions

There are some built-in macro definitions in the compiler, such as `__GNUC__`, etc. We can use the `check_macros` and `configvar_check_macros` auxiliary scripts to detect their existence.

Related issues: [#1715](https://github.com/xmake-io/xmake/issues/1715)

```lua
- Check whether the macro is defined
configvar_check_macros("HAS_GCC", "__GNUC__")
- The detection macro is not defined
configvar_check_macros("NO_GCC", "__GNUC__", {defined = false})
- Detect macro conditions
configvar_check_macros("HAS_CXX20", "__cplusplus >= 202002L", {languages = "c++20"})
```

## Detect type size

In previous versions, type detection was possible with ``check_csnippets`` and ``output = true``.

```lua
check_csnippets("INT_SIZE", 'printf("%d", sizeof(int)); return 0;', {output = true, number = true})
```

This way, however, extracts the type size information by trying to run the test code and then getting the run output.

This doesn't work for cross-compilation.

In version 2.8.5, we added the ``check_sizeof`` helper interface, which allows you to extract type size information by parsing the binary file of the test program directly.

Since there is no need to run tests, this approach not only supports cross-compilation, but also greatly improves the efficiency of testing and is much easier to use.

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

Alternatively, I can check for it in the script field with `target:check_sizeof`.

## Detecting big-endian

After version 2.8.9, we added the ``check_bigendian`` interface to determine if the current compilation target is in bigendian mode.

```lua
includes("@builtin/check")

target("test")
    set_kind("static")
    add_files("*.cpp")
    check_bigendian("IS_BIG_ENDIAN")
```

If the test passes and it is currently in big endian mode, then `IS_BIG_ENDIAN=1` is defined.
