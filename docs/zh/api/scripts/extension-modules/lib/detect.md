
# lib.detect

此模块提供了非常强大的探测功能，用于探测程序、编译器、语言特性、依赖包等。

::: tip 注意
此模块的接口分散在多个模块目录中，尽量通过导入单个接口来使用，这样效率更高。
:::

## detect.find_file

- 查找文件

这个接口提供了比[os.files](/zh/api/scripts/builtin-modules/os#os-files)更加强大的工程， 可以同时指定多个搜索目录，并且还能对每个目录指定附加的子目录，
来模式匹配查找，相当于是[os.files](/zh/api/scripts/builtin-modules/os#os-files)的增强版。

例如：

```lua
import("lib.detect.find_file")

local file = find_file("ccache", { "/usr/bin", "/usr/local/bin"})
```

如果找到，返回的结果是：`/usr/bin/ccache`

它同时也支持模式匹配路径，进行递归查找，类似`os.files`：

```lua
local file = find_file("test.h", { "/usr/include", "/usr/local/include/**"})
```

不仅如此，里面的路径也支持内建变量，来从环境变量和注册表中获取路径进行查找：

```lua
local file = find_file("xxx.h", { "$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name)"})
```

如果路径规则比较复杂多变，还可以通过自定义脚本来动态生成路径传入：

```lua
local file = find_file("xxx.h", { "$(env PATH)", function () return val("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name"):match("\"(.-)\"") end})
```

大部分场合下，上面的使用已经满足各种需求了，如果还需要一些扩展功能，可以通过传入第三个参数，自定义一些可选配置，例如：

```lua
local file = find_file("test.h", { "/usr", "/usr/local"}, {suffixes = {"/include", "/lib"}})
```

通过指定suffixes子目录列表，可以扩展路径列表（第二个参数），使得实际的搜索目录扩展为：

```
/usr/include
/usr/lib
/usr/local/include
/usr/local/lib
```

并且不用改变路径列表，就能动态切换子目录来搜索文件。

::: tip 注意
我们也可以通过`xmake lua`插件来快速调用和测试此接口：`xmake lua lib.detect.find_file test.h /usr/local`
:::

## detect.find_path

- 查找路径

这个接口的用法跟[lib.detect.find_file](#detect-find_file)类似，唯一的区别是返回的结果不同。
此接口查找到传入的文件路径后，返回的是对应的搜索路径，而不是文件路径本身，一般用于查找文件对应的父目录位置。

```lua
import("lib.detect.find_path")

local p = find_path("include/test.h", { "/usr", "/usr/local"})
```

上述代码如果查找成功，则返回：`/usr/local`，如果`test.h`在`/usr/local/include/test.h`的话。

还有一个区别就是，这个接口传入不只是文件路径，还可以传入目录路径来查找：

```lua
local p = find_path("lib/xxx", { "$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name)"})
```

同样，此接口也支持模式匹配和后缀子目录：

```lua
local p = find_path("include/*.h", { "/usr", "/usr/local/**"}, {suffixes = "/subdir"})
```

## detect.find_library

- 查找库文件

此接口用于指定的搜索目录中查找库文件（静态库，动态库），例如：

```lua
import("lib.detect.find_library")

local library = find_library("crypto", {"/usr/lib", "/usr/local/lib"})
```

在macosx上运行，返回的结果如下：

```lua
{
    filename = libcrypto.dylib
,   linkdir = /usr/lib
,   link = crypto
,   kind = shared
}
```

如果不指定是否需要静态库还是动态库，那么此接口会自动选择一个存在的库（有可能是静态库、也有可能是动态库）进行返回。

如果需要强制指定需要查找的库类型，可以指定kind参数为（`static/shared`）：

```lua
local library = find_library("crypto", {"/usr/lib", "/usr/local/lib"}, {kind = "static"})
```

此接口也支持suffixes后缀子目录搜索和模式匹配操作：

```lua
local library = find_library("cryp*", {"/usr", "/usr/local"}, {suffixes = "/lib"})
```

## detect.find_program

- 查找可执行程序

这个接口比[lib.detect.find_tool](#detect-find_tool)较为原始底层，通过指定的参数目录来查找可执行程序。

```lua
import("lib.detect.find_program")

local program = find_program("ccache")
```

上述代码犹如没有传递搜索目录，所以它会尝试直接执行指定程序，如果运行ok，那么直接返回：`ccache`，表示查找成功。

指定搜索目录，修改尝试运行的检测命令参数（默认是：`ccache --version`）：

```lua
local program = find_program("ccache", {paths = {"/usr/bin", "/usr/local/bin"}, check = "--help"})
```

上述代码会尝试运行：`/usr/bin/ccache --help`，如果运行成功，则返回：`/usr/bin/ccache`。

如果`--help`也没法满足需求，有些程序没有`--version/--help`参数，那么可以自定义运行脚本，来运行检测：

```lua
local program = find_program("ccache", {paths = {"/usr/bin", "/usr/local/bin"}, check = function (program) os.run("%s -h", program) end})
```

同样，搜索路径列表支持内建变量和自定义脚本：

```lua
local program = find_program("ccache", {paths = {"$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug;Debugger)"}})
local program = find_program("ccache", {paths = {"$(env PATH)", function () return "/usr/local/bin" end}})
```

::: tip 注意
为了加速频发查找的效率，此接口是默认自带cache的，所以就算频繁查找相同的程序，也不会花太多时间。
如果要禁用cache，可以在工程目录执行`xmake f -c`清除本地cache。
:::

我们也可以通过`xmake lua lib.detect.find_program ccache` 来快速测试。

## detect.find_programver

- 查找可执行程序版本号


```lua
import("lib.detect.find_programver")

local programver = find_programver("ccache")
```

返回结果为：3.2.2

默认它会通过`ccache --version`尝试获取版本，如果不存在此参数，可以自己指定其他参数：

```lua
local version = find_programver("ccache", {command = "-v"})
```

甚至自定义版本获取脚本：

```lua
local version = find_programver("ccache", {command = function () return os.iorun("ccache --version") end})
```

对于版本号的提取规则，如果内置的匹配模式不满足要求，也可以自定义：

```lua
local version = find_programver("ccache", {command = "--version", parse = "(%d+%.?%d*%.?%d*.-)%s"})
local version = find_programver("ccache", {command = "--version", parse = function (output) return output:match("(%d+%.?%d*%.?%d*.-)%s") end})
```

::: tip 注意
为了加速频发查找的效率，此接口是默认自带cache的，如果要禁用cache，可以在工程目录执行`xmake f -c`清除本地cache。
:::

我们也可以通过`xmake lua lib.detect.find_programver ccache` 来快速测试。

## detect.find_package

- 查找包文件

2.6.x 之后，这个接口不推荐直接使用（仅供内部使用），库集成，请尽量使用 `add_requires()` 和 `add_packages()`。

## detect.find_tool

- 查找工具

此接口也是用于查找可执行程序，不过比[lib.detect.find_program](#detect-find_program)更加的高级，功能也更加强大，它对可执行程序进行了封装，提供了工具这个概念：

* toolname: 工具名，可执行程序的简称，用于标示某个工具，例如：`gcc`, `clang`等
* program: 可执行程序命令，例如：`xcrun -sdk macosx clang`

其对应关系如下：

| toolname  | program                             |
| --------- | ----------------------------------- |
| clang     | `xcrun -sdk macosx clang`           |
| gcc       | `/usr/toolchains/bin/arm-linux-gcc` |
| link      | `link.exe -lib`                     |

[lib.detect.find_program](#detect-find_program)只能通过传入的原始program命令或路径，去判断该程序是否存在。
而`find_tool`则可以通过更加一致的toolname去查找工具，并且返回对应的program完整命令路径，例如：

```lua
import("lib.detect.find_tool")

local tool = find_tool("clang")
```

返回的结果为：`{name = "clang", program = "clang"}`，这个时候还看不出区别，我们可以手动指定可执行的命令：

```lua
local tool = find_tool("clang", {program = "xcrun -sdk macosx clang"})
```

返回的结果为：`{name = "clang", program = "xcrun -sdk macosx clang"}`

而在macosx下，gcc就是clang，如果我们执行`gcc --version`可以看到就是clang的一个马甲，我们可以通过`find_tool`接口进行智能识别：

```lua
local tool = find_tool("gcc")
```

返回的结果为：`{name = "clang", program = "gcc"}`

通过这个结果就可以看的区别来了，工具名实际会被标示为clang，但是可执行的命令用的是gcc。

我们也可以指定`{version = true}`参数去获取工具的版本，并且指定一个自定义的搜索路径，也支持内建变量和自定义脚本哦：

```lua
local tool = find_tool("clang", {version = true, paths = {"/usr/bin", "/usr/local/bin", "$(env PATH)", function () return "/usr/xxx/bin" end}})
```

返回的结果为：`{name = "clang", program = "/usr/bin/clang", version = "4.0"}`

这个接口是对`find_program`的上层封装，因此也支持自定义脚本检测：

```lua
local tool = find_tool("clang", {check = "--help"})
local tool = find_tool("clang", {check = function (tool) os.run("%s -h", tool) end})
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

例如我们自定义一个`find_7z.lua`的查找脚本：

```lua
import("lib.detect.find_program")
import("lib.detect.find_programver")

function main(opt)

    -- init options
    opt = opt or {}

    -- find program
    local program = find_program(opt.program or "7z", opt.pathes, opt.check or "--help")

    -- find program version
    local version = nil
    if program and opt and opt.version then
        version = find_programver(program, "--help", "(%d+%.?%d*)%s")
    end

    -- ok?
    return program, version
end
```

将它放置到工程的模块目录下后，执行：`xmake l lib.detect.find_tool 7z`就可以查找到了。

::: tip 注意
为了加速频发查找的效率，此接口是默认自带cache的，如果要禁用cache，可以在工程目录执行`xmake f -c`清除本地cache。
:::

我们也可以通过`xmake lua lib.detect.find_tool clang` 来快速测试。

## detect.find_toolname

- 查找工具名

通过program命令匹配对应的工具名，例如：

| program                   | toolname   |
| ------------------------- | ---------- |
| `xcrun -sdk macosx clang` | clang      |
| `/usr/bin/arm-linux-gcc`  | gcc        |
| `link.exe -lib`           | link       |
| `gcc-5`                   | gcc        |
| `arm-android-clang++`     | clangxx    |
| `pkg-config`              | pkg_config |

toolname相比program，更能唯一标示某个工具，也方便查找和加载对应的脚本`find_xxx.lua`。

## detect.find_cudadevices

- 查找本机的 CUDA 设备

通过 CUDA Runtime API 枚举本机的 CUDA 设备，并查询其属性。

```lua
import("lib.detect.find_cudadevices")

local devices = find_cudadevices({ skip_compute_mode_prohibited = true })
local devices = find_cudadevices({ min_sm_arch = 35, order_by_flops = true })
```

返回的结果为：`{ { ['$id'] = 0, name = "GeForce GTX 960M", major = 5, minor = 0, ... }, ... }`

包含的属性依据当前 CUDA 版本会有所不同，可以参考 [CUDA 官方文档](https://docs.nvidia.com/cuda/cuda-runtime-api/structcudaDeviceProp.html#structcudaDeviceProp)及其历史版本。

## detect.features

- 获取指定工具的所有特性

此接口跟[compiler.features](/zh/api/scripts/extension-modules/core/tool/compiler#compiler-features)类似，区别就是此接口更加的原始，传入的参数是实际的工具名toolname。

并且此接口不仅能够获取编译器的特性，任何工具的特性都可以获取，因此更加通用。

```lua
import("lib.detect.features")

local features = features("clang")
local features = features("clang", {flags = "-O0", program = "xcrun -sdk macosx clang"})
local features = features("clang", {flags = {"-g", "-O0", "-std=c++11"}})
```

通过传入flags，可以改变特性的获取结果，例如一些c++11的特性，默认情况下获取不到，通过启用`-std=c++11`后，就可以获取到了。

所有编译器的特性列表，可以见：[compiler.features](/zh/api/scripts/extension-modules/core/tool/compiler#compiler-features)。

## detect.has_features

- 判断指定特性是否支持

此接口跟[compiler.has_features](/zh/api/scripts/extension-modules/core/tool/compiler#compiler-has_features)类似，但是更加原始，传入的参数是实际的工具名toolname。

并且此接口不仅能够判断编译器的特性，任何工具的特性都可以判断，因此更加通用。

```lua
import("lib.detect.has_features")

local features = has_features("clang", "cxx_constexpr")
local features = has_features("clang", {"cxx_constexpr", "c_static_assert"}, {flags = {"-g", "-O0"}, program = "xcrun -sdk macosx clang"})
local features = has_features("clang", {"cxx_constexpr", "c_static_assert"}, {flags = "-g"})
```

如果指定的特性列表存在，则返回实际支持的特性子列表，如果都不支持，则返回nil，我们也可以通过指定flags去改变特性的获取规则。

所有编译器的特性列表，可以见：[compiler.features](/zh/api/scripts/extension-modules/core/tool/compiler#compiler-features)。

## detect.has_flags

- 判断指定参数选项是否支持

此接口跟[compiler.has_flags](/zh/api/scripts/extension-modules/core/tool/compiler#compiler-has_flags)类似，但是更加原始，传入的参数是实际的工具名toolname。

```lua
import("lib.detect.has_flags")

local ok = has_flags("clang", "-g")
local ok = has_flags("clang", {"-g", "-O0"}, {program = "xcrun -sdk macosx clang"})
local ok = has_flags("clang", "-g -O0", {toolkind = "cxx"})
```

如果检测通过，则返回true。

此接口的检测做了一些优化，除了cache机制外，大部分场合下，会去拉取工具的选项列表（`--help`）直接判断，如果选项列表里获取不到的话，才会通过尝试运行的方式来检测。

## detect.has_cfuncs

- 判断指定c函数是否存在

此接口是[lib.detect.check_cxsnippets](#detect-check_cxsnippets)的简化版本，仅用于检测函数。

```lua
import("lib.detect.has_cfuncs")

local ok = has_cfuncs("setjmp")
local ok = has_cfuncs({"sigsetjmp((void*)0, 0)", "setjmp"}, {includes = "setjmp.h"})
```

对于函数的描述规则如下：

| 函数描述                                        | 说明          |
| ----------------------------------------------- | ------------- |
| `sigsetjmp`                                     | 纯函数名      |
| `sigsetjmp((void*)0, 0)`                        | 函数调用      |
| `sigsetjmp{int a = 0; sigsetjmp((void*)a, a);}` | 函数名 + {}块 |

在最后的可选参数中，除了可以指定`includes`外，还可以指定其他的一些参数用于控制编译检测的选项条件：

```lua
{ verbose = false, target = [target|option], includes = .., configs = {linkdirs = .., links = .., defines = ..}}
```

其中verbose用于回显检测信息，target用于在检测前追加target中的配置信息, 而config用于自定义配置跟target相关的编译选项。

## detect.has_cxxfuncs

- 判断指定c++函数是否存在

此接口跟[lib.detect.has_cfuncs](#detect-has_cfuncs)类似，请直接参考它的使用说明，唯一区别是这个接口用于检测c++函数。

## detect.has_cincludes

- 判断指定c头文件是否存在

此接口是[lib.detect.check_cxsnippets](#detect-check_cxsnippets)的简化版本，仅用于检测头文件。

```lua
import("lib.detect.has_cincludes")

local ok = has_cincludes("stdio.h")
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {target = target})
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {configs = {defines = "_GNU_SOURCE=1", languages = "cxx11"}})
```

## detect.has_cxxincludes

- 判断指定c++头文件是否存在

此接口跟[lib.detect.has_cincludess](#detect-has_cincludes)类似，请直接参考它的使用说明，唯一区别是这个接口用于检测c++头文件。

## detect.has_ctypes

- 判断指定c类型是否存在

此接口是[lib.detect.check_cxsnippets](#detect-check_cxsnippets)的简化版本，仅用于检测函数。

```lua
import("lib.detect.has_ctypes")

local ok = has_ctypes("wchar_t")
local ok = has_ctypes({"char", "wchar_t"}, {includes = "stdio.h"})
local ok = has_ctypes("wchar_t", {includes = {"stdio.h", "stdlib.h"}, configs = {"defines = "_GNU_SOURCE=1", languages = "cxx11"}})
```

## detect.has_cxxtypes

- 判断指定c++类型是否存在

此接口跟[lib.detect.has_ctypess](#detect-has_ctypes)类似，请直接参考它的使用说明，唯一区别是这个接口用于检测c++类型。

## detect.check_cxsnippets

- 检测c/c++代码片段是否能够编译通过

通用的c/c++代码片段检测接口，通过传入多个代码片段列表，它会自动生成一个编译文件，然后常识对它进行编译，如果编译通过返回true。

对于一些复杂的编译器特性，连[compiler.has_features](/zh/api/scripts/extension-modules/core/tool/compiler#compiler-has_features)都无法检测到的时候，可以通过此接口通过尝试编译来检测它。

```lua
import("lib.detect.check_cxsnippets")

local ok = check_cxsnippets("void test() {}")
local ok = check_cxsnippets({"void test(){}", "#define TEST 1"}, {types = "wchar_t", includes = "stdio.h"})
```

此接口是[detect.has_cfuncs](#detect-has_cfuncs), [detect.has_cincludes](#detect-has_cincludes)和[detect.has_ctypes](#detect-has_ctypes)等接口的通用版本，也更加底层。

因此我们可以用它来检测：types, functions, includes 还有 links，或者是组合起来一起检测。

第一个参数为代码片段列表，一般用于一些自定义特性的检测，如果为空，则可以仅仅检测可选参数中条件，例如：

```lua
local ok = check_cxsnippets({}, {types = {"wchar_t", "char*"}, includes = "stdio.h", funcs = {"sigsetjmp", "sigsetjmp((void*)0, 0)"}})
```

上面那个调用，会去同时检测types, includes和funcs是否都满足，如果通过返回true。

还有其他一些可选参数：

```lua
{ verbose = false, target = [target|option], sourcekind = "[cc|cxx]"}
```

其中verbose用于回显检测信息，target用于在检测前追加target中的配置信息, sourcekind 用于指定编译器等工具类型，例如传入`cxx`强制作为c++代码来检测。
