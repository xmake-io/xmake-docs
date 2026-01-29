# Target Instance

This page describes the interface for `target` of functions like `on_load()`, `before_build()` or `after_install()` of the [Project target](/api/description/project-target).

## target:name

- Get the name of the target

#### Function Prototype

::: tip API
```lua
target:name()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


## target:get

- Get the values of the target by name

#### Function Prototype

::: tip API
```lua
target:get(key: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key | Configuration key name |

#### Usage


```lua
-- get the links
target:get("links")
-- get the defined macros
target:get("defines")
```

## target:set

- Set the values of the target by name

#### Function Prototype

::: tip API
```lua
target:set(key: <string>, value: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key | Configuration key name |
| value | Configuration value |

#### Usage


If you just want to add values use [target:add](#target-add).

```lua
-- set the links
target:set("links", "sdl2")
-- set the defined macros
target:set("defines", "SDL_MAIN_HANDLED")
```

::: tip NOTE
Any script scope configuration using `target:set("xxx", ...)` is completely consistent with the corresponding `set_xxx` interface in the description scope. For specific parameter descriptions, you can directly refer to the corresponding `set_xxx` interface documentation in the description scope.

For example:
- Description scope: `set_kind("binary")`
- Script scope: `target:set("kind", "binary")`
:::

## target:add

- Add to the values of the target by name

#### Function Prototype

::: tip API
```lua
target:add(key: <string>, value: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key | Configuration key name |
| value | Value to add |

#### Usage


```lua
-- add links
target:add("links", "sdl2")
-- add defined macros
target:add("defines", "SDL_MAIN_HANDLED")
```

::: tip NOTE
Any script scope configuration using `target:add("xxx", ...)` is completely consistent with the corresponding `add_xxx` interface in the description scope. For specific parameter descriptions, you can directly refer to the corresponding `add_xxx` interface documentation in the description scope.

For example:
- Description scope: `add_files("src/*.c", {defines = "PRIVATE"})`
- Script scope: `target:add("files", "src/*.c", {defines = "PRIVATE"})`
:::

## target:kind

- Get the target program type

#### Function Prototype

::: tip API
```lua
target:kind()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


Corresponding to `set_kind` description domain interface settings. The main target types are: binary, static, shared, phony, object, headeronly.

## target:is_plat

- Whether the current platform is one of the given platforms

#### Function Prototype

::: tip API
```lua
target:is_plat(plat: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| plat | Platform name |

#### Usage


Although we can also use the `is_plat` global interface to directly determine the platform, xmake supports the use of `set_plat` to set the compilation platform separately for a specific target.

At this time, using the global interface is not applicable, so we usually recommend using the interface provided by the target to directly determine the compilation platform for the current target, which is more reliable.

```lua
- Is the current platform android?
target:is_plat("android")
- Is the current platform windows, linux or macosx?
target:is_plat("windows", "linux", "macosx")
```

## target:is_arch

- Is the current architecture one of the given architectures

#### Function Prototype

::: tip API
```lua
target:is_arch(arch: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| arch | Architecture name |

#### Usage


Although we can also use the `is_arch` global interface to directly determine the architecture, xmake supports the use of `set_arch` to set the compilation architecture separately for a specific target.

At this time, using the global interface is not applicable, so we usually recommend using the interface provided by the target to directly judge the compilation architecture of the current target, which is more reliable.

```lua
- Is the current architecture x86
target:is_arch("x86")
- Is the current architecture x64 or x86_64
target:is_arch("x64", "x86_64")
```

## target:is_arch64

- Is the current architecture a 64-bit one

#### Function Prototype

::: tip API
```lua
target:is_arch64()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
- Is the current architecture 64-bit?
target:is_arch64()
```

## target:targetfile

- Get the target file path

#### Function Prototype

::: tip API
```lua
target:targetfile()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


It is mainly used to obtain the output path of static, shared, and binary object program files.

```lua
os.cp(target:targetfile(), "/tmp/")
```

## target:artifactfile

- Get the artifact file of the target

#### Function Prototype

::: tip API
```lua
target:artifactfile(kind: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
|   kind    | Target kind |

#### Usage


Currently, only the implib file output path of Windows DLL can be obtained.

```lua
target:artifactfile("implib")
```

However, it may be extended to other types of artifact file path acquisition in the future.

## target:targetdir

- Get the output directory of the target file

#### Function Prototype

::: tip API
```lua
target:targetdir()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


That is, the storage directory corresponding to target:targetfile().

## target:basename

- Get the base name of the target file

#### Function Prototype

::: tip API
```lua
target:basename()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


That is, `foo` in libfoo.a, foo.dll, foo.exe.

## target:filename

- Get the target file name

#### Function Prototype

::: tip API
```lua
target:filename()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


The full file name of the target file, equivalent to `path.filename(target:targetfile())`.

## target:symbolfile

- Get the symbol file path of the target

#### Function Prototype

::: tip API
```lua
target:symbolfile()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


This interface is used to obtain the symbol file path generated by the target in releasedbg mode. The symbol file format varies by platform:

- **Windows**: .pdb file
- **macOS**: .dSYM directory
- **Linux**: .sym file

```lua
-- Get the symbol file path
local symbolfile = target:symbolfile()
if symbolfile and os.isfile(symbolfile) then
    print("Symbol file: %s", symbolfile)
end
```

This is particularly useful in custom scripts for post-processing symbol files or for debugging purposes.

## target:installdir

- Get the installation directory of the target file

#### Function Prototype

::: tip API
```lua
target:installdir()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


It is usually used to obtain the corresponding installation directory path in scripts such as after_install of `xmake install/uninstall`, which can be used for user-defined installation scripts.

## target:autogendir

- Get auto-generated catalog

#### Function Prototype

::: tip API
```lua
target:autogendir()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


This is usually used in some custom rule scripts to store some target-specific automatically generated files, and the path is usually under `build/.gens/target`.

For example, when we are processing lex/yacc, some source code files are automatically generated, and they can be stored in this directory so that they can be processed later.

## target:objectfile

- Get the object file path

#### Function Prototype

::: tip API
```lua
target:objectfile(sourcefile: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| sourcefile | Source file path |

#### Usage


Usually used in custom scripts to obtain the target file path corresponding to the source file, for example

```lua
local objectfile = target:objectfile(sourcefile)
```

## target:sourcebatches

- Get all source files

#### Function Prototype

::: tip API
```lua
target:sourcebatches()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


It can get all the source files added by `add_files` and store them separately according to different source file types.

The approximate structure is as follows:

```lua
{
  "c++.build" = {
    objectfiles = {
      "build/.objs/test/macosx/x86_64/release/src/main.cpp.o"
    },
    rulename = "c++.build",
    sourcekind = "cxx",
    sourcefiles = {
      "src/main.cpp"
    },
    dependfiles = {
      "build/.deps/test/macosx/x86_64/release/src/main.cpp.o.d"
    }
  },
  "asm.build" = {
    objectfiles = {
      "build/.objs/test/macosx/x86_64/release/src/test.S.o"
    },
    rulename = "asm.build",
    sourcekind = "as",
    sourcefiles = {
      "src/test.S"
    },
    dependfiles = {
      "build/.deps/test/macosx/x86_64/release/src/test.S.o.d"
    }
  }
}
```

We can traverse to obtain and process each type of source file.

```lua
for _, sourcebatch in pairs(target:sourcebatches()) do
    local sourcekind = sourcebatch.sourcekind
    if sourcekind == "cc" or sourcekind == "cxx" or sourcekind == "as" then
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            - TODO
        end
    end
end
```

Where sourcekind is the type of each source file, cc is the c file type, cxx is the c++ source file, and as is the asm source file.

sourcebatch corresponds to each type of source file batch, corresponding to a batch of source files of the same type.

sourcebatch.sourcefiles is a list of source files, sourcebatch.objectfiles is a list of object files, and sourcebatch.rulename is the name of the corresponding rule.

## target:objectfiles

- Get a list of all object files

#### Function Prototype

::: tip API
```lua
target:objectfiles()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


Although `target:sourcebatches()` can also obtain all object files, they are classified according to the source file type and do not directly participate in the final link.

If we want to dynamically modify the final linked object file list, we can modify `target:objectfiles()`, which is an array list.

## target:headerfiles

- Get a list of all header files

#### Function Prototype

::: tip API
```lua
target:headerfiles()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


You can get a list of all header files set by the `add_headerfiles()` interface.

```lua
for _, headerfile in ipairs(target:headerfiles()) do
    - TODO
end
```

## target:scriptdir

- Get the xmake.lua directory where the target definition is located

#### Function Prototype

::: tip API
```lua
target:scriptdir()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


This is usually used in custom rules. If you want to get the directory where the current target is actually defined in xmake.lua, it is convenient to reference some resource files. You can use this interface.

## target:has_cxxfuncs

- Check whether the target compilation configuration can obtain the given C++ function

#### Function Prototype

::: tip API
```lua
target:has_cxxfuncs(funcs: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| funcs | Function name or function name list |

#### Usage


The usage is similar to [target:has_cfuncs](#target-has_cfuncs), except that it is mainly used to detect C++ functions.

However, while detecting functions, we can also additionally configure std languages to assist detection.

```
target:has_cxxfuncs("foo", {includes = "foo.h", configs = {languages = "cxx17"}})
```

## target:has_ctypes

- Check whether the target compilation configuration can obtain the given C type

#### Function Prototype

::: tip API
```lua
target:has_ctypes(types: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| types | Type name or type name list |

#### Usage


This should be used in `on_config` like this:

```lua
add_requires("zlib")
target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib")
     on_config(function(target)
         if target:has_ctypes("z_stream", {includes = "zlib.h"}) then
             target:add("defines", "HAVE_ZSTEAM_T")
         end
     end)
```

## target:has_cxxtypes

- Check whether the target compilation configuration can get the given C++ type

#### Function Prototype

::: tip API
```lua
target:has_cxxtypes(types: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| types | Type name or type name list |

#### Usage


The usage is similar to [target:has_ctypes](#target-has_ctypes), except that it is mainly used to detect the type of C++.

## target:has_cflags

- Check whether the target compilation configuration can obtain the given C compilation flags

#### Function Prototype

::: tip API
```lua
target:has_cflags(flags: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| flags | Compilation flags or flag list |

#### Usage


```lua
target("test")
     set_kind("binary")
     add_files("src/*.cpp")
     on_config(function(target)
         if target:has_cxxflags("-fPIC") then
             target:add("defines", "HAS_PIC")
         end
     end)
```

## target:has_cxxflags

- Check whether the target compilation configuration can obtain the given C++ compilation flags

#### Function Prototype

::: tip API
```lua
target:has_cxxflags(flags: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| flags | Compilation flags or flag list |

#### Usage


The usage is similar to [target:has_cflags](#target-has_cflags), except that it is mainly used to detect the compilation flags of C++.

## target:has_cincludes

- Check whether the target compilation configuration can obtain the given C header file

#### Function Prototype

::: tip API
```lua
target:has_cincludes(includes: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| includes | Include file or include file list |

#### Usage


This should be used in `on_config`, for example, it can be used to determine whether the current target can obtain the zlib.h header file of the zlib dependency package, and then automatically define `HAVE_INFLATE`:

```lua
add_requires("zlib")
target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib")
     on_config(function(target)
         if target:has_cincludes("zlib.h") then
             target:add("defines", "HAVE_ZLIB_H")
         end
     end)
```

## target:has_cxxincludes

- Check whether the target compilation configuration can obtain the given C++ header file

#### Function Prototype

::: tip API
```lua
target:has_cxxincludes(includes: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| includes | Include file or include file list |

#### Usage


The usage is similar to [target:has_cincludes](#target-has_cincludes), except that it is mainly used to detect C++ header files.

## target:check_csnippets

- Detect whether a given piece of C code can be compiled and linked

#### Function Prototype

::: tip API
```lua
target:check_csnippets(snippets: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| snippets | Code snippet or code snippet list |

#### Usage


The usage is similar to [target:check_cxxsnippets](#target-check_cxxsnippets), except that it is mainly used to detect C code snippets.

## target:check_cxxsnippets

- Detect if a given piece of C++ code can be compiled and linked

#### Function Prototype

::: tip API
```lua
target:check_cxxsnippets(snippets: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| snippets | Code snippet or code snippet list |

#### Usage


This should be used in `on_config` like this:

```lua
add_requires("libtins")
target("test")
     set_kind("binary")
     add_files("src/*.cpp")
     add_packages("libtins")
     on_config(function(target)
         local has_snippet = target:check_cxxsnippets({test = [[
             #include <string>
             using namespace Tins;
             void test() {
                 std::string name = NetworkInterface::default_interface().name();
                 printf("%s\n", name.c_str());
             }
         ]]}, {configs = {languages = "c++11"}, includes = {"tins/tins.h"}}))
         if has_snippet then
             target:add("defines", "HAS_XXX")
         end
     end)
```

By default, it only checks whether the compilation link is passed. If you want to try the runtime check, you can set `tryrun = true`.

```lua
target("test")
     set_kind("binary")
     add_files("src/*.cpp")
     on_config(function(target)
         local has_int_4 = target:check_cxxsnippets({test = [[
             return (sizeof(int) == 4)? 0 : -1;
         ]]}, {configs = {languages = "c++11"}, tryrun = true}))
         if has_int_4 then
             target:add("defines", "HAS_INT4")
         end
     end)
```

We can also continue to capture the running output of the detection by setting `output = true`, and add a custom `main` entry to achieve a complete test code, not just a code snippet.

```lua
target("test")
     set_kind("binary")
     add_files("src/*.cpp")
     on_config(function(target)
         local int_size = target:check_cxxsnippets({test = [[
             #include <stdio.h>
             int main(int argc, char** argv) {
                 printf("%d", sizeof(int)); return 0;
                 return 0;
             }
         ]]}, {configs = {languages = "c++11"}, tryrun = true, output = true}))
     end)
```

## target:check_sizeof

- Detect type size

#### Function Prototype

::: tip API
```lua
target:check_sizeof(types: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| types | Type name or type name list |

#### Usage


```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    on_config(function (target)
        print("sizeof(long) = %s", target:check_sizeof("long"))
        print("sizeof(string) = %s", target:check_sizeof("std::string", {includes = "string"}))
        if target:check_size("long") == 8 then
            target:add("defines", "LONG64")
        end
    end)
```

```sh
$ xmake
sizeof(long) = 8
sizeof(string) = 24
```

## target:has_features

- Detect if specified C/C++ compiler feature

#### Function Prototype

::: tip API
```lua
target:has_features(features: <string|table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| features | Feature name or feature name list |

#### Usage


It is faster than using `check_cxxsnippets`, because it only performs preprocessing once to check all compiler features, instead of calling the compiler every time to try to compile.

```
target("test")
     set_kind("binary")
     add_files("src/*.cpp")
     on_config(function(target)
         if target:has_features("c_static_assert") then
             target:add("defines", "HAS_STATIC_ASSERT")
         end
         if target:has_features("cxx_constexpr") then
             target:add("defines", "HAS_CXX_CONSTEXPR")
         end
     end)
```
