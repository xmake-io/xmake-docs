---
title: xmake v2.1.5版本新特性介绍
tags: [xmake, lua, cmake, 包查找, 编译器特性检测, 预编译头文件, 扩展模块]
date: 2017-07-29
author: Ruki
---

2.1.5版本现已进入收尾阶段，此版本加入了一大波新特性，目前正在进行稳定性测试和修复，在这里，先来介绍下新版本中引入了哪些些新特性和改进。

```
1. 提供类似cmake的find_*系列接口，实现各种查找，例如：find_package, find_library, find_file, ...
2. 提供模块接口，实现编译器的各种检测，例如：has_features, has_flags, has_cincludes, has_cfuncs, ...
3. 实现大量扩展模块，提供文件下载、解压缩、git操作等接口
4. 支持预编译头文件支持，改进c++编译效率
5. 支持在工程中自定义模块进行扩展
6. 提供代码片段检测接口，实现更加灵活定制化的检测需求
7. 改进option和target，提供更加动态化的配置
8. 通过find_package实现包依赖管理2.0版本
9. 改进root权限问题，实现更加安全的root下运行
10. 提供compile_commands.json导出插件
11. 改进vs201x工程生成插件，支持多模式、多架构同时构建和自由切换不干扰
```

#### 利用find_package查找依赖包

此接口参考了cmake对于`find_*`系列接口的设计，实现在项目中动态的查找和添加包依赖。

```lua
target("test")
    set_kind("binary")
    add_files("*.c")
    on_load(function (target)
        import("lib.detect.find_package")
        target:add(find_package("zlib"))
    end)
```

上述描述代码，通过[lib.detect.find_package](/zh/manual#detect-find_package)来查找包，如果找到`zlib`包，则将`links`, `includedirs`和`linkdirs`等信息添加到target中去。

#### 实现包管理2.0

2.1.4版本之前，xmake对于包管理，是通过在项目内置`pkg/zlib.pkg`方式，来检测链接的，虽然也支持自动检测，但是查找功能有限，并且内置的各个架构的二进制库到项目，对git并不是很友好。

现在通过`find_package`和`option`，我们可以实现更好的包管理：

```lua
option("zlib")
    set_showmenu(true)
    before_check(function (option)
        import("lib.detect.find_package")
        option:add(find_package("zlib"))
    end)

target("test")
    add_options("zlib")
```

通过定义一个名为zlib的选项作为包，关联到target，在选项被检测之前，先从系统中查找zlib包，如果存在，则添加对应的`links`, `linkdirs`等配置信息，然后进行选项检测，如果选项检测通过，这个target在编译的时候就会启用zlib。

如果要手动禁用这个zlib包，使其不参与自动检测和链接，只需要：

```bash
$ xmake f --zlib=n 
$ xmake
```

注：2.2.1版本将会实现包管理3.0，更加自动化的依赖包管理和使用，具体详情见：[Remote package management](https://github.com/xmake-io/xmake/issues/69)。

例如：

```lua
add_requires("mbedtls master optional")
add_requires("pcre2 >=1.2.0", "zlib >= 1.2.11")
add_requires("git@github.com:glennrp/libpng.git@libpng >=1.6.28")
target("test")
    add_packages("pcre2", "zlib", "libpng", "mbedtls")
```

目前正在努力开发中，尽情期待。。






#### 模块的自定义扩展

我们可以通过在工程的`xmake.lua`文件的开头指定下扩展modules的目录：

```lua
add_moduledirs("$(projectdir)/xmake/modules")
```

这样xmake就能找到自定义的扩展模块了，例如：

```
projectdir
 - xmake
   - modules
     - detect/package/find_openssl.lua
```

通过在自定义的工程模块目录，添加一个`find_openssl.lua`的脚本，就可以扩展`find_package`，使得包查找更加精准。

这里顺便总结下，`find_package`的查找顺序：

1. 如果指定`{packagedirs = ""}`参数，优先从这个参数指定的路径中查找本地包`*.pkg`
2. 如果在`xmake/modules`下面存在`detect.packages.find_xxx`脚本，那么尝试调用此脚本来改进查找结果
3. 如果系统存在`pkg-config`，并且查找的是系统环境的库，则尝试使用`pkg-config`提供的路径和链接信息进行查找
4. 如果系统存在`homebrew`，并且查找的是系统环境的库，则尝试使用`brew --prefix xxx`提供的信息进行查找
5. 从参数中指定的pathes路径和一些已知的系统路径`/usr/lib`, `/usr/include`中进行查找

#### 快速判断编译器特性检测支持

通过`core.tool.compiler`模块的[compiler.has_features](/zh/manual#compiler-has_features)接口，在`xmake.lua`中预先判断当前编译期支持的语言特性，实现条件编译。

此处也是参考了cmake的设计，具体详情见：[issues#83](https://github.com/xmake-io/xmake/issues/83)。

```lua
target("test")
    on_load(function (target)
        import("core.tool.compiler")
        if compiler.has_features("cxx_constexpr") then
            target:add("defines", "HAS_CXX_CONSTEXPR=1")
        end
    end)
```

上述代码，在加载target的时候，判断当前编译器是否支持c++的常量表达式语法特性，如果支持则添加宏定义：`HAS_CXX_CONSTEXPR=1`。

我们也可以在判断时候，追加一些参数控制编译选项，例如上述特性需要`c++11`支持，我们可以启用它：

```lua
if compiler.has_features({"c_static_assert", "cxx_constexpr"}, {languages = "cxx11"}) then
    -- ok
end
```

如果之前对这个target已经设置了`c++11`，那么我们也可以传入target对象，继承target的所有设置：

```lua
if compiler.has_features("cxx_constexpr", {target = target, defines = "..", includedirs = ".."}) then
    -- ok
end
```

所有的c/c++编译器特性列表，见：[compiler.features](/zh/manual#compiler-features)


#### 判断指定c/c++头文件是否存在

通过[lib.detect.has_cincludes](/zh/manual#detect-has_cincludes)来检测c头文件是否存在。

```lua
import("lib.detect.has_cincludes")

local ok = has_cincludes("stdio.h")
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {target = target})
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {defines = "_GNU_SOURCE=1", languages = "cxx11"})
```

c++头文件的检测，见：[lib.detect.has_cxxincludes](/zh/manual#detect-has_cxxincludes)

#### 判断指定c/c++函数是否存在

通过[lib.detect.has_cfuncs](/zh/manual#detect-has_cfuncs)来检测c函数是否存在。

```lua
import("lib.detect.has_cfuncs")

local ok = has_cfuncs("setjmp")
local ok = has_cfuncs({"sigsetjmp((void*)0, 0)", "setjmp"}, {includes = "setjmp.h"})
```

c++函数的检测，见：[lib.detect.has_cxxfuncs](/zh/manual#detect-has_cxxfuncs)。

#### 判断指定c/c++类型是否存在

通过[lib.detect.has_ctypes](/zh/manual#detect-has_ctypes)来检测c函数是否存在。

```lua
import("lib.detect.has_ctypes")

local ok = has_ctypes("wchar_t")
local ok = has_ctypes({"char", "wchar_t"}, {includes = "stdio.h"})
local ok = has_ctypes("wchar_t", {includes = {"stdio.h", "stdlib.h"}, "defines = "_GNU_SOURCE=1", languages = "cxx11"})
```

c++类型的检测，见：[lib.detect.has_cxxtypes](/zh/manual#detect-has_cxxtypes)。

#### 检测c/c++代码片段是否能够编译通过

通用的c/c++代码片段检测接口，通过传入多个代码片段列表，它会自动生成一个编译文件，然后常识对它进行编译，如果编译通过返回true。

对于一些复杂的编译器特性，连[compiler.has_features](/zh/manual#compiler-has_features)都无法检测到的时候，可以通过此接口通过尝试编译来检测它。

```lua
import("lib.detect.check_cxsnippets")

local ok = check_cxsnippets("void test() {}")
local ok = check_cxsnippets({"void test(){}", "#define TEST 1"}, {types = "wchar_t", includes = "stdio.h"})
```

此接口是[detect.has_cfuncs](/zh/manual#detect-has_cfuncs), [detect.has_cincludes](/zh/manual#detect-has_cincludes)和[detect.has_ctypes](/zh/manual#detect-has_ctypes)等接口的通用版本，也更加底层。

因此我们可以用它来检测：types, functions, includes 还有 links，或者是组合起来一起检测。

第一个参数为代码片段列表，一般用于一些自定义特性的检测，如果为空，则可以仅仅检测可选参数中条件，例如：

```lua
local ok = check_cxsnippets({}, {types = {"wchar_t", "char*"}, includes = "stdio.h", funcs = {"sigsetjmp", "sigsetjmp((void*)0, 0)"}})
```

上面那个调用，会去同时检测types, includes和funcs是否都满足，如果通过返回true。

#### 更加强大的xmake lua插件

2.1.4版本的时候，此插件就已经支持REPL(read-eval-print)，实现交互式运行来方便测试模块：

```bash
$ xmake lua
> 1 + 2
3

> a = 1
> a
1

> for _, v in pairs({1, 2, 3}) do
>> print(v)
>> end
1
2
3
```

现在可以通过一行命令，更加快速地测试模块接口：

```bash
$ xmake lua lib.detect.find_package openssl
```

返回结果如下：`{links = {"ssl", "crypto", "z"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}}`

#### 预编译头文件支持

xmake新增通过预编译头文件去加速`c/c++`程序编译，目前支持的编译器有：gcc, clang和msvc。

使用方式如下：

```lua
target("test")
    set_precompiled_header("header.h")
```

通常情况下，设置c头文件的预编译，这需要加上这个配置即可，如果是对c++头文件的预编译，改成：

```lua
target("test")
    set_precompiled_header("header.hpp")
```

其中的参数指定的是需要预编译的头文件路径，相对于当前`xmake.lua`所在的目录。

如果只是调用xmake命令行进行直接编译，那么上面的设置足够了，并且已经对各个编译器进行支持，但是有些情况下，上面的设置还不能满足需求：

1. 如果要使用`xmake project`工程插件生成vs工程文件，那么还缺少一个类似`stdafx.cpp`的文件（上面的设置在msvc编译的时候会自动生成一个临时的，但是对IDE工程不友好）。
2. 如果gcc/clang下，`header.h`想作为c++的预编译头文件就不支持了，除非改成`header.hpp`（默认会当做c头文件进行预编译）。

因此为了更加地通用跨平台，可以在工程里面创建一个类似vc中`stdafx.cpp`的源文件：`header.cpp`。

```lua
target("test")
    set_precompiled_header("header.h", "header.cpp")
```

`header.cpp`的内容如下：

```cpp
#include "header.h"
```

上面的设置，就可以很好地处理各种情况下的预编译处理，追加的`header.cpp`也告诉了xmake：`header.h`是作为c++来预编译的。

相对于经典的vc工程中的`stdafx.cpp`和`stdafx.h`，也能完美支持：

```lua
target("test")
    set_precompiled_header("stdafx.h", "stdafx.cpp")
```

#### 生成compiler_commands插件

扩展`xmake project`工程生成插件，支持`compiler_commands.json`文件输出，用于导出每个源文件的编译信息，生成基于clang的编译数据库文件，json格式，可用于跟ide，编辑器，静态分析工具进行交互。

```console
$ xmake project -k compile_commands
```

输出的内容格式如下：

```
[
  { "directory": "/home/user/llvm/build",
    "command": "/usr/bin/clang++ -Irelative -DSOMEDEF=\"With spaces, quotes and \\-es.\" -c -o file.o file.cc",
    "file": "file.cc" },
  ...
]

```

一般用于跟IDE、编辑器插件、静态分析工具进行集成，对于`compile_commands`的详细说明见：[JSONCompilationDatabase](#https://clang.llvm.org/docs/JSONCompilationDatabase.html)

#### 自定义选项检测脚本

在选项检测之前，动态增加一些配置条件：

```lua
option("zlib")
    before_check(function (option)
        import("lib.detect.find_package")
        option:add(find_package("zlib"))
    end)
```

通过覆写检测脚本，控制选项的检测结果：

```lua
option("test")
    add_deps("small")
    set_default(true)
    on_check(function (option)
        if option:dep("small"):enabled() then
            option:enable(false)
        end
    end)
```

如果test依赖的选项通过，则禁用test选项。

在选项检测完成后，执行此脚本做一些后期处理，也可以在此时重新禁用选项：

```lua
option("test")
    add_deps("small")
    add_links("pthread")
    after_check(function (option)
        option:enable(false)
    end)
```

#### 自定义目标加载脚本

在target初始化加载的时候，将会执行[on_load](/zh/manual#targeton_load)，在里面可以做一些动态的目标配置，实现更灵活的目标描述定义，例如：

```lua
target("test")
    on_load(function (target)
        target:add("defines", "DEBUG", "TEST=\"hello\"")
        target:add("linkdirs", "/usr/lib", "/usr/local/lib")
        target:add({includedirs = "/usr/include", "links" = "pthread"})
    end)
```

可以在`on_load`里面，通过`target:set`, `target:add` 来动态添加各种target属性。

#### 目标自定义构建脚本支持分平台架构

通过设置`平台|架构`参数，控制自定义脚本的执行条件，实现在不同平台、架构下，调用不同的脚本进行构建：

```lua
target("test")
    on_build("iphoneos|arm*", function (target) 
        -- TODO
    end)
```

或者对所有macosx平台，执行脚本：

```lua
target("test")
    after_build("macosx", function (target) 
        -- TODO
    end)
```

其他脚本，例如：`on_clean`, `before_package`等也都是支持的哦，而在2.1.4之前，只支持：

```lua
target("test")
    on_package(function (target) 
        -- TODO
    end)
```

并不能对不同架构、平台分别处理。

#### 获取内置变量的值

[内置变量](/zh/manual#%E5%86%85%E7%BD%AE%E5%8F%98%E9%87%8F)可以通过此接口直接获取，而不需要再加`$()`的包裹，使用更加简单，例如：

```lua
print(val("host"))
print(val("env PATH"))
local s = val("shell echo hello")
```

而用[vformat](/zh/manual#vformat)就比较繁琐了：

```lua
local s = vformat("$(shell echo hello)")
```

不过`vformat`支持字符串参数格式化，更加强大，所以应用场景不同。

#### 目标依赖实现属性继承

2.1.4之前的版本，[target.add_deps](/zh/manual#add-deps)仅用于添加依赖，修改编译顺序：

```lua
target("test1")
    set_kind("static")
    set_files("*.c")

target("test2")
    set_kind("static")
    set_files("*.c")

target("demo")
    add_deps("test1", "test2")
    add_links("test1", "test2")
    add_linkdirs("test1dir", "test2dir")
```

2.1.5版本后，target还会自动继承依赖目标中的配置和属性，不再需要额外调用`add_links`, `add_includedirs`和`add_linkdirs`等接口去关联依赖目标了，上述代码可简化为：

```lua
target("test1")
    set_kind("static")
    set_files("*.c")

target("test2")
    set_kind("static")
    set_files("*.c")

target("demo")
    add_deps("test1", "test2") -- 会自动链接依赖目标
```

并且继承关系是支持级联的，例如：

```lua
target("library1")
    set_kind("static")
    add_files("*.c")
    add_headers("inc1/*.h")

target("library2")
    set_kind("static")
    add_deps("library1")
    add_files("*.c")
    add_headers("inc2/*.h")

target("test")
    set_kind("binary")
    add_deps("library2")
```

#### 新增查找工具接口

[lib.detect.find_tool](/zh/manual#detect-find_tool)接口用于查找可执行程序，比[lib.detect.find_program](/zh/manual#detect-find_program)更加的高级，功能也更加强大，它对可执行程序进行了封装，提供了工具这个概念：

* toolname: 工具名，可执行程序的简称，用于标示某个工具，例如：`gcc`, `clang`等
* program: 可执行程序命令，例如：`xcrun -sdk macosx clang`

`lib.detect.find_program`只能通过传入的原始program命令或路径，去判断该程序是否存在。
而`find_tool`则可以通过更加一致的toolname去查找工具，并且返回对应的program完整命令路径，例如：

```lua
import("lib.detect.find_tool")

local tool = find_tool("clang")
```

我们也可以指定`{version = true}`参数去获取工具的版本，并且指定一个自定义的搜索路径，也支持内建变量和自定义脚本哦： 

```lua
local tool = find_tool("clang", {check = "--help"}) 
local tool = find_tool("clang", {check = function (tool) os.run("%s -h", tool) end})
local tool = find_tool("clang", {version = true, {pathes = {"/usr/bin", "/usr/local/bin", "$(env PATH)", function () return "/usr/xxx/bin" end}})
```

最后总结下，`find_tool`的查找流程：

1. 优先通过`{program = "xxx"}`的参数来尝试运行和检测。
2. 如果在`xmake/modules/detect/tools`下存在`detect.tools.find_xxx`脚本，则调用此脚本进行更加精准的检测。
3. 尝试从`/usr/bin`，`/usr/local/bin`等系统目录进行检测。

我们也可以在工程`xmake.lua`中`add_moduledirs`指定的模块目录中，添加自定义查找脚本，来改进检测机制：

```
projectdir
  - xmake/modules
    - detect/tools/find_xxx.lua
```

#### 更加安全的root权限编译

由于xmake提供强大的自定义模块和脚本支持，并且内置安装、卸载等action，如果`xmake.lua`里面的脚本描述不当，容易导致覆写系统文件，因此新版本对此作了改进：

1. 在root下编译工程，先判断工程目录的用户权限属性，尝试降权到非root用户进行编译。
2. 如果需要写一些系统文件，会提示用户当前权限不安全，禁止继续运行，除非加`--root`参数强制root运行。
3. 如果当期工程目录是root用户权限，则同2。

具体详情见：[pull#113](https://github.com/xmake-io/xmake/pull/113)

#### API接口改进

使用[includes](/zh/manual#includes)替代老的[add_subdirs](/zh/manual#add-subdirs)和[add_subfiles](/zh/manual#add-subfiles)接口。
使用[set_config_header](/zh/manual#set-config-header)替代老的[set_config_h](/zh/manual#set-config-h)和[set_config_h_prefix](/zh/manual#set-config-h-prefix)接口。

#### 新增大量扩展模块

* 文件下载
* 解压缩
* git操作等接口

具体详情见文档：[扩展模块](/zh/manual#%E6%89%A9%E5%B1%95%E6%A8%A1%E5%9D%97)
