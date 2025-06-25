
# core.tool.compiler

Compiler related operations, often used for plugin development.

## compiler.compile

- Perform compilation

For the target, link the specified object file list to generate the corresponding target file, for example:

```lua
compiler.compile("xxx.c", "xxx.o", "xxx.h.d", {target = target})
```

Where [target](/api/description/project-target) is the project target, here is the specific compile option that is mainly used to get the target.
For the project target object, see: [core.project.project](/api/scripts/extension-modules/core/project/project)

The `xxx.h.d` file is used to store the header file dependency file list for this source file. Finally, these two parameters are optional.
You can not pass them when compiling:

```lua
compiler.compile("xxx.c", "xxx.o")
```

To simply compile a source file.

## compiler.compcmd

- Get the compile command line

Get the command line string executed directly in [compiler.compile](#compiler-compile), which is equivalent to:

```lua
local cmdstr = compiler.compcmd("xxx.c", "xxx.o", {target = target})
```

Note: The extension part of ``target = target}` is optional. If the target object is passed, the generated compile command will add the link option corresponding to this target configuration.

And you can also pass various configurations yourself, for example:

```lua
local cmdstr = compiler.compcmd("xxx.c", "xxx.o", {configs = {includedirs = "/usr/include", defines = "DEBUG"}})
```

With target, we can export all source file compilation commands for the specified target:

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

- Get compiled command line list

A little different from [compiler.compcmd](#compiler-compcmd) is that this interface returns a list of parameters, table representation, more convenient to operate:

```lua
local program, argv = compiler.compargv("xxx.c", "xxx.o")
```

## compiler.compflags

- Get compilation options

Get the compile option string part of [compiler.compcmd](#compiler-compcmd) without shList of ellnames and files, for example:

```lua
local flags = compiler.compflags(sourcefile, {target = target})
for _, flag in ipairs(flags) do
    print(flag)
end
```

The returned array of flags is an array.

## compiler.has_flags

- Determine if the specified compilation option is supported

Although it can be judged by [lib.detect.has_flags](/api/scripts/extension-modules/lib/detect#detect-has_flags), but the interface is more low-level, you need to specify the compiler name.
This interface only needs to specify the language type, it will automatically switch to select the currently supported compiler.

```lua
-- Determine if the c language compiler supports the option: -g
if compiler.has_flags("c", "-g") then
    -- ok
end

-- Determine if the C++ language compiler supports the option: -g
if compiler.has_flags("cxx", "-g") then
    -- ok
end
```

## compiler.features

- Get all compiler features

Although it can be obtained by [lib.detect.features](/api/scripts/extension-modules/lib/detect#detect-features), but the interface is more low-level, you need to specify the compiler name.
This interface only needs to specify the language type, it will automatically switch to select the currently supported compiler, and then get the current list of compiler features.

```lua
-- Get all the features of the current c compiler
local features = compiler.features("c")

-- Get all the features of the current C++ language compiler, enable the C++11 standard, otherwise you will not get the new standard features.
local features = compiler.features("cxx", {cofnig = {cxxflags = "-std=c++11"}})

-- Get all the features of the current C++ language compiler, pass all configuration information of the project target
local features = compiler.features("cxx", {target = target, configs = {defines = "..", includedirs = ".."}})
```

A list of all c compiler features:

| Feature Name |
| --------------------- |
| c_static_assert |
| c_restrict |
| c_variadic_macros |
| c_function_prototypes |

A list of all C++ compiler features:

| Feature Name |
| ------------------------------------ |
| cxx_variable_templates |
| cxx_relaxed_constexpr |
| cxx_aggregate_default_initializers |
| cxx_contextual_conversions |
| cxx_attribute_deprecated |
| cxx_decltype_auto |
| cxx_digit_separators |
| cxx_generic_lambdas |
| cxx_lambda_init_captures |
| cxx_binary_literals |
| cxx_return_type_deduction |
| cxx_decltype_incomplete_return_types |
| cxx_reference_qualified_functions |
| cxx_alignof |
| cxx_attributes |
| cxx_inheriting_constructors |
| cxx_thread_local |
| cxx_alias_templates |
| cxx_delegating_constructors |
| cxx_extended_friend_declarations |
| cxx_final |
| cxx_nonstatic_member_init |
| cxx_override |
| cxx_user_literals |
| cxx_constexpr |
| cxx_defaulted_move_initializers |
| cxx_enum_forward_declarations |
| cxx_noexcept |
| cxx_nullptr |
| cxx_range_for |
| cxx_unrestricted_unions |
| cxx_explicit_conversions |
| cxx_lambdas |
| cxx_local_type_template_args |
| cxx_raw_string_literals |
| cxx_auto_type |
| cxx_defaulted_functions |
| cxx_deleted_functions |
| cxx_generalized_initializers |
| cxx_inline_namespaces |
| cxx_sizeof_member |
| cxx_strong_enums |
| cxx_trailing_return_types |
| cxx_unicode_literals |
| cxx_uniform_initialization |
| cxx_variadic_templates |
| cxx_decltype |
| cxx_default_function_template_args |
| cxx_long_long_type |
| cxx_right_angle_brackets |
| cxx_rvalue_references |
| cxx_static_assert |
| cxx_extern_templates |
| cxx_func_identifier |
| cxx_variadic_macros |
| cxx_template_template_parameters |

## compiler.has_features

- Determine if the specified compiler feature is supported

Although it can be obtained by [lib.detect.has_features](/api/scripts/extension-modules/lib/detect#detect-has_features), but the interface is more low-level, you need to specify the compiler name.
And this interface only needs to specify the special name list that needs to be detected, it can automatically switch to select the currently supported compiler, and then determine whether the specified feature is supported in the current compiler.

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

For specific feature names, refer to [compiler.features](#compiler-features).
