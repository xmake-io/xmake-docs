# 目标实例 {#target-instance}

此页面描述了 [工程目标](https://xmake/.io#zh-cn/manual/project_target.md) 的 `on_load()`、`before_build()` 或 `after_install()` 等函数的 `target` 接口

## target:name

- 获取目标的名字

## target:get

- 获取目标在描述域的配置值

任何在描述域的 `set_xxx` 和 `add_xxx` 配置值都可以通过这个接口获取到。

```lua
-- get the links
target:get("links")
-- get the defined macros
target:get("defines")
```

## target:set

- 设置目标的配置值，（如果你想添加值可以用 [target:add](#target-add)）。

```lua
-- set the links
target:set("links", "sdl2")
-- set the defined macros
target:set("defines", "SDL_MAIN_HANDLED")
```

## target:add

- 按名称添加到目标的值

```lua
-- add links
target:add("links", "sdl2")
-- add defined macros
target:add("defines", "SDL_MAIN_HANDLED")
```

## target:kind

- 获取目标程序类型

对应 `set_kind` 描述域接口设置。目标类型主要有：binary, static, shared, phony, object, headeronly。

## target:is_plat

- 当前平台是否是给定平台之一

尽管，我们也可以用 `is_plat` 全局接口直接判断平台，但是 xmake 支持使用 `set_plat` 针对特定 target 单独设置编译平台。

这个时候，使用全局接口，就不适用了，所以通常我们推荐使用 target 提供的接口，来直接对当前 target 判断编译平台，更加可靠。

```lua
-- Is the current platform android?
target:is_plat("android")
-- Is the current platform windows, linux or macosx?
target:is_plat("windows", "linux", "macosx")
```

## target:is_arch

- 当前架构是否是给定架构之一

尽管，我们也可以用 `is_arch` 全局接口直接判断架构，但是 xmake 支持使用 `set_arch` 针对特定 target 单独设置编译架构。

这个时候，使用全局接口，就不适用了，所以通常我们推荐使用 target 提供的接口，来直接对当前 target 判断编译架构，更加可靠。

```lua
-- Is the current architecture x86
target:is_arch("x86")
-- Is the current architecture x64 or x86_64
target:is_arch("x64", "x86_64")
```

## target:targetfile

- 获取目标文件路径

主要用于获取 static, shared, binary 目标程序文件的输出路径。

```lua
os.cp(target:targetfile(), "/tmp/")
```

## target:artifactfile

- 获取目标的产物文件

目前只能获取 windows DLL 的 implib 文件输出路径。

```lua
target:artifactfile("implib")
```

不过，后期有可能会扩展到其他类型的产物文件路径获取。

## target:targetdir

- 获取目标文件的输出目录

也就是 target:targetfile() 对应的存储目录。

## target:basename

- 获取目标文件的 base 名

也就是 libfoo.a，foo.dll, foo.exe 中的 `foo`。

## target:filename

- 获取目标文件名

目标文件的完整文件名，等价于 `path.filename(target:targetfile())`。

## target:installdir

- 获取目标文件的安装目录

通常用于 `xmake install/uninstall` 的 after_install 等脚本中获取对应的安装目录路径，可以用于用户自定义安装脚本。

## target:autogendir

- 获取自动生成目录

这个通常用于一些自定义规则脚本中，存放一些特定于 target 的自动生成文件，路径通常在 `build/.gens/target` 下面。

比如，我们在处理 lex/yacc 自动生成一些源码文件，就可以存放在这个目录下，方便之后去处理它。

## target:objectfile

- 获取对象文件路径

通常用于自定义脚本中，获取源文件对应的目标文件路径，例如

```lua
local objectfile = target:objectfile(sourcefile)
```

## target:sourcebatches

- 获取所有源文件

它可以获取到 `add_files` 添加的所有源文件，并且根据不同源文件类型，分别存储。

大概结构如下：

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

我们可以通过遍历去获取处理每种类型的源文件。

```lua
for _, sourcebatch in pairs(target:sourcebatches()) do
    local sourcekind = sourcebatch.sourcekind
    if sourcekind == "cc" or sourcekind == "cxx" or sourcekind == "as" then
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            -- TODO
        end
    end
end
```

其中 sourcekind 是每种源文件的类型，cc 是 c 文件类型，cxx 是 c++ 源文件，as 是 asm 源文件。

sourcebatch 对应每种类型的源文件 batch，对应一批同类型源文件。

sourcebatch.sourcefiles 是源文件列表，sourcebatch.objectfiles 是对象文件列表，sourcebatch.rulename 是对应的规则名。

## target:objectfiles

- 获取所有对象文件列表

尽管 `target:sourcebatches()` 也可以获取所有对象文件，但是它们是根据源文件类型分类过的，且不直接参与最终链接。

如果我们想动态修改最终链接的对象文件列表，可以修改 `target:objectfiles()`，它是一个数组列表。

## target:headerfiles

- 获取所有的头文件列表

可以获取到 `add_headerfiles()` 接口设置的所有头文件列表。

```lua
for _, headerfile in ipairs(target:headerfiles()) do
    -- TODO
end
```

## target:scriptdir

- 获取目标定义所在的 xmake.lua 目录

这通常在自定义规则中使用的比较多，想获取当前 target 实际被定义在哪个 xmake.lua 所在目录下，方便引用一些资源文件，可以用这个接口。

## target:has_cfuncs

- 检测目标编译配置能否获取给定的 C 函数

这应该在 `on_config` 中使用，比如可以用它来判断当前目标能否获取到 zlib 依赖包的一些函数接口，然后自动定义 `HAVE_INFLATE`：

```lua
add_requires("zlib")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
    on_config(function (target)
        if target:has_cfuncs("inflate", {includes = "zlib.h"}) then
            target:add("defines", "HAVE_INFLATE")
        end
    end)
```

尽管 option 也提供了类似的检测功能，但 option 的检测使用的是全局的平台工具链，它无法附带上 target 相关的一些编译配置，
也无法根据 target 设置不同编译工具链来适配检测，并且无法检测包里面的一些接口。

如果我们仅仅是想粗粒度的检测函数接口，并且 target 没有额外设置不同的工具链，那么 option 提供的检测功能已经足够使用了。

如果想要更细粒度控制检测，可以使用 target 实例接口提供的检测特性。

## target:has_cxxfuncs

- 检测目标编译配置能否获取给定的 C++ 函数

用法跟 [target:has_cfuncs](#target-has_cfuncs) 类似，只是这里主要用于检测 C++ 的函数。

不过，在检测函数的同时，我们还可以额外配置 std languages，来辅助检测。

```
target:has_cxxfuncs("foo", {includes = "foo.h", configs = {languages = "cxx17"}})
```

## target:has_ctypes

- 检测目标编译配置能否获取给定的 C 类型

这应该在 `on_config` 中使用，如下所示：

```lua
add_requires("zlib")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
    on_config(function (target)
        if target:has_ctypes("z_stream", {includes = "zlib.h"}) then
            target:add("defines", "HAVE_ZSTEAM_T")
        end
    end)
```

## target:has_cxxtypes

- 检测目标编译配置能否获取给定的 C++ 类型

用法跟 [target:has_ctypes](#target-has_ctypes) 类似，只是这里主要用于检测 C++ 的类型。

## target:has_cflags

- 检测目标编译配置能否获取给定的 C 编译 flags

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    on_config(function (target)
        if target:has_cxxflags("-fPIC") then
            target:add("defines", "HAS_PIC")
        end
    end)
```

## target:has_cxxflags

- 检测目标编译配置能否获取给定的 C++ 编译 flags

用法跟 [target:has_cflags](#target-has_cflags) 类似，只是这里主要用于检测 C++ 的编译 flags。


## target:has_cincludes

- 检测目标编译配置能否获取给定的 C 头文件

这应该在 `on_config` 中使用，比如可以用它来判断当前目标能否获取到 zlib 依赖包的 zlib.h 头文件，然后自动定义 `HAVE_INFLATE`：

```lua
add_requires("zlib")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
    on_config(function (target)
        if target:has_cincludes("zlib.h") then
            target:add("defines", "HAVE_ZLIB_H")
        end
    end)
```

## target:has_cxxincludes

- 检测目标编译配置能否获取给定的 C++ 头文件

用法跟 [target:has_cincludes](#target-has_cincludes) 类似，只是这里主要用于检测 C++ 的头文件。

## target:check_csnippets

- 检测是否可以编译和链接给定的 C 代码片段

用法跟 [target:check_cxxsnippets](#target-check_cxxsnippets) 类似，只是这里主要用于检测 C 的代码片段。

## target:check_cxxsnippets

- 检测是否可以编译和链接给定的 C++ 代码片段

这应该在 `on_config` 中使用，如下所示：

```lua
add_requires("libtins")
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("libtins")
    on_config(function (target)
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

默认仅仅检测编译链接是否通过，如果想要尝试运行时检测，可以再设置 `tryrun = true`。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    on_config(function (target)
        local has_int_4 = target:check_cxxsnippets({test = [[
            return (sizeof(int) == 4)? 0 : -1;
        ]]}, {configs = {languages = "c++11"}, tryrun = true}))
        if has_int_4 then
            target:add("defines", "HAS_INT4")
        end
    end)
```

我们也可以继续通过设置 `output = true` 来捕获检测的运行输出，并且加上自定义的 `main` 入口，实现完整的测试代码，而不仅仅是代码片段。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    on_config(function (target)
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

- 检测类型大小

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

- 检测是否指定的 C/C++ 编译特性

它相比使用 `check_cxxsnippets` 来检测，会更加快一些，因为它仅仅执行一次预处理就能检测所有的编译器特性，而不是每次都去调用编译器尝试编译。

```
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    on_config(function (target)
        if target:has_features("c_static_assert") then
            target:add("defines", "HAS_STATIC_ASSERT")
        end
        if target:has_features("cxx_constexpr") then
            target:add("defines", "HAS_CXX_CONSTEXPR")
        end
    end)
```
