# Target instance

This page describes the interface for `target` of functions like `on_load()`, `before_build()` or `after_install()` of the [Project target](/api/description/project-target).

## target:name

- Get the name of the target

## target:get

- Get the values of the target by name

```lua
-- get the links
target:get("links")
-- get the defined macros
target:get("defines")
```

## target:set

- Set the values of the target by name

If you just want to add values use [target:add](#target-add).

```lua
-- set the links
target:set("links", "sdl2")
-- set the defined macros
target:set("defines", "SDL_MAIN_HANDLED")
```

## target:add

- Add to the values of the target by name

```lua
-- add links
target:add("links", "sdl2")
-- add defined macros
target:add("defines", "SDL_MAIN_HANDLED")
```

## target:kind

- Get the target program type

Corresponding to `set_kind` description domain interface settings. The main target types are: binary, static, shared, phony, object, headeronly.

## target:is_plat

- Whether the current platform is one of the given platforms

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

Although we can also use the `is_arch` global interface to directly determine the architecture, xmake supports the use of `set_arch` to set the compilation architecture separately for a specific target.

At this time, using the global interface is not applicable, so we usually recommend using the interface provided by the target to directly judge the compilation architecture of the current target, which is more reliable.

```lua
- Is the current architecture x86
target:is_arch("x86")
- Is the current architecture x64 or x86_64
target:is_arch("x64", "x86_64")
```

## target:targetfile

- Get the target file path

It is mainly used to obtain the output path of static, shared, and binary object program files.

```lua
os.cp(target:targetfile(), "/tmp/")
```

## target:artifactfile

- Get the artifact file of the target

Currently, only the implib file output path of Windows DLL can be obtained.

```lua
target:artifactfile("implib")
```

However, it may be extended to other types of artifact file path acquisition in the future.

## target:targetdir

- Get the output directory of the target file

That is, the storage directory corresponding to target:targetfile().

## target:basename

- Get the base name of the target file

That is, `foo` in libfoo.a, foo.dll, foo.exe.

## target:filename

- Get the target file name

The full file name of the target file, equivalent to `path.filename(target:targetfile())`.

## target:installdir

- Get the installation directory of the target file

It is usually used to obtain the corresponding installation directory path in scripts such as after_install of `xmake install/uninstall`, which can be used for user-defined installation scripts.

## target:autogendir

- Get auto-generated catalog

This is usually used in some custom rule scripts to store some target-specific automatically generated files, and the path is usually under `build/.gens/target`.

For example, when we are processing lex/yacc, some source code files are automatically generated, and they can be stored in this directory so that they can be processed later.

## target:objectfile

- Get the object file path

Usually used in custom scripts to obtain the target file path corresponding to the source file, for example

```lua
local objectfile = target:objectfile(sourcefile)
```

## target:sourcebatches

- Get all source files

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

Although `target:sourcebatches()` can also obtain all object files, they are classified according to the source file type and do not directly participate in the final link.

If we want to dynamically modify the final linked object file list, we can modify `target:objectfiles()`, which is an array list.

## target:headerfiles

- Get a list of all header files

You can get a list of all header files set by the `add_headerfiles()` interface.

```lua
for _, headerfile in ipairs(target:headerfiles()) do
    - TODO
end
```

## target:scriptdir

- Get the xmake.lua directory where the target definition is located

This is usually used in custom rules. If you want to get the directory where the current target is actually defined in xmake.lua, it is convenient to reference some resource files. You can use this interface.

## target:has_cxxfuncs

- Check whether the target compilation configuration can obtain the given C++ function

The usage is similar to [target:has_cfuncs](#target-has_cfuncs), except that it is mainly used to detect C++ functions.

However, while detecting functions, we can also additionally configure std languages to assist detection.

```
target:has_cxxfuncs("foo", {includes = "foo.h", configs = {languages = "cxx17"}})
```

## target:has_ctypes

- Check whether the target compilation configuration can obtain the given C type

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

The usage is similar to [target:has_ctypes](#target-has_ctypes), except that it is mainly used to detect the type of C++.

## target:has_cflags

- Check whether the target compilation configuration can obtain the given C compilation flags

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

The usage is similar to [target:has_cflags](#target-has_cflags), except that it is mainly used to detect the compilation flags of C++.

## target:has_cincludes

- Check whether the target compilation configuration can obtain the given C header file

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

The usage is similar to [target:has_cincludes](#target-has_cincludes), except that it is mainly used to detect C++ header files.

## target:check_csnippets

- Detect whether a given piece of C code can be compiled and linked

The usage is similar to [target:check_cxxsnippets](#target-check_cxxsnippets), except that it is mainly used to detect C code snippets.

## target:check_cxxsnippets

- Detect if a given piece of C++ code can be compiled and linked

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

```bash
$ xmake
sizeof(long) = 8
sizeof(string) = 24
```

## target:has_features

- Detect if specified C/C++ compiler feature

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
