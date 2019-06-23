
全局接口影响整个工程描述，被调用后，后面被包含进来的所有子`xmake.lua`都会受影响。

| 接口                                  | 描述                          | 支持版本 |
| ------------------------------------- | ----------------------------- | -------- |
| [includes](#includes)                 | 添加子工程文件和目录          | >= 2.1.5 |
| [set_modes](#set_modes)               | 设置支持的编译模式            | >= 2.1.2 |
| [set_project](#set_project)           | 设置工程名                    | >= 2.0.1 |
| [set_version](#set_version)           | 设置工程版本                  | >= 2.0.1 |
| [set_xmakever](#set_xmakever)         | 设置最小xmake版本             | >= 2.1.1 |
| [add_subdirs](#add_subdirs)           | 添加子工程目录                | >= 1.0.1 |
| [add_subfiles](#add_subfiles)         | 添加子工程文件                | >= 1.0.1 |
| [add_moduledirs](#add_moduledirs)     | 添加模块目录                  | >= 2.1.5 |
| [add_plugindirs](#add_plugindirs)     | 添加插件目录                  | >= 2.0.1 | 
| [add_packagedirs](#add_packagedirs)   | 添加包目录                    | >= 2.0.1 |
| [get_config](#get_config)             | 获取给的配置值                | >= 2.2.2 |
| [set_config](#set_config)             | 设置默认的配置值              | >= 2.2.2 |
| [add_requires](#add_requires)         | 添加需要的依赖包              | >= 2.2.2 |
| [add_repositories](#add_repositories) | 添加依赖包仓库                | >= 2.2.2 |

### includes

#### 添加子工程文件和目录

同时支持子工程文件和目录的添加，用于替代[add_subdirs](#add_subdirs)和[add_subfiles](#add_subfiles)接口。

另外，此接口在2.2.5之后的版本，提供了一些内置的辅助函数，可以直接includes后使用，具体有哪些内置函数可以看下：https://github.com/xmake-io/xmake/tree/master/xmake/includes

关于这块的更加完整的说明，可以看下：[https://github.com/xmake-io/xmake/issues/342](https://github.com/xmake-io/xmake/issues/342)

例子：

检测links, c/c++ type, includes和编译器特性，并且写入宏定义到config.h

```lua
includes("check_links.lua")
includes("check_ctypes.lua")
includes("check_cfuncs.lua")
includes("check_features.lua")
includes("check_csnippets.lua")
includes("check_cincludes.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")

    configvar_check_ctypes("HAS_WCHAR", "wchar_t")
    configvar_check_cincludes("HAS_STRING_H", "string.h")
    configvar_check_cincludes("HAS_STRING_AND_STDIO_H", {"string.h", "stdio.h"})
    configvar_check_ctypes("HAS_WCHAR_AND_FLOAT", {"wchar_t", "float"})
    configvar_check_links("HAS_PTHREAD", {"pthread", "m", "dl"})
    configvar_check_csnippets("HAS_STATIC_ASSERT", "_Static_assert(1, \"\");")
    configvar_check_cfuncs("HAS_SETJMP", "setjmp", {includes = {"signal.h", "setjmp.h"}})
    configvar_check_features("HAS_CONSTEXPR", "cxx_constexpr")
    configvar_check_features("HAS_CONSEXPR_AND_STATIC_ASSERT", {"cxx_constexpr", "c_static_assert"}, {languages = "c++11"})
```
    
config.h.in

```c
${define HAS_STRING_H}
${define HAS_STRING_AND_STDIO_H}
${define HAS_WCHAR}
${define HAS_WCHAR_AND_FLOAT}
${define HAS_PTHREAD}
${define HAS_STATIC_ASSERT}
${define HAS_SETJMP}
${define HAS_CONSTEXPR}
${define HAS_CONSEXPR_AND_STATIC_ASSERT}
```

config.h

```c
/* #undef HAS_STRING_H */
#define HAS_STRING_AND_STDIO_H 1
/* #undef HAS_WCHAR */
/* #undef HAS_WCHAR_AND_FLOAT */
#define HAS_PTHREAD 1
#define HAS_STATIC_ASSERT 1
#define HAS_SETJMP 1
/* #undef HAS_CONSTEXPR */
#define HAS_CONSEXPR_AND_STATIC_ASSERT 1
```

### set_modes

#### 设置支持的编译模式

这个是可选接口，一般情况下不需要设置，目前仅用于对工程增加更加细致的描述信息，方便vs工程的多模式生成，以及其他xmake插件中获取模式信息。

例如：

```lua
set_modes("debug", "release")
```

如果设置了这个，xmake就知道当前工程支持哪些编译模式，这样生成vs工程文件的时候，只需要：

```bash
$ xmake project -k vs2017
```

不再需要额外手动指定需要的编译模式了，此外其他一些想要获取工程信息的插件，也许也会需要这些设置信息。

<p class="tip">
当然，对于[is_mode](#is_mode)接口，`set_modes`不是必须的，就算不设置，也是可以通过`is_mode`正常判断当前的编译模式。
</p>

### set_project

#### 设置工程名

设置工程名，在doxygen自动文档生成插件、工程文件生成插件中会用到，一般设置在xmake.lua的最开头，当然放在其他地方也是可以的

```lua
-- 设置工程名
set_project("tbox")

-- 设置工程版本
set_version("1.5.1")
```

### set_version

#### 设置工程版本

设置项目版本，可以放在xmake.lua任何地方，一般放在最开头，例如：

```lua
set_version("1.5.1")
```

2.1.7版本支持buildversion的配置：

```lua
set_version("1.5.1", {build = "%Y%m%d%H%M"})
```

我们也能够添加版本宏定义到头文件，请参考：[add_configfiles](/manual/project_target?id=add-template-configuration-files)

### set_xmakever

#### 设置最小xmake版本

用于处理xmake版本兼容性问题，如果项目的`xmake.lua`，通过这个接口设置了最小xmake版本支持，那么用户环境装的xmake低于要求的版本，就会提示错误。

一般情况下，建议默认对其进行设置，这样对用户比较友好，如果`xmake.lua`中用到了高版本的api接口，用户那边至少可以知道是否因为版本不对导致的构建失败。

设置如下：

```lua
-- 设置最小版本为：2.1.0，低于此版本的xmake编译此工程将会提示版本错误信息
set_xmakever("2.1.0")
```

### add_subdirs

#### 添加子工程目录

<p class="tip">
xmake 2.x以上版本，请尽量使用[includes](#includes)这个接口，这个是add_subdirs和add_subfiles的通用版本，并且支持一些内建扩展模块。
</p>

每个子工程对应一个`xmake.lua`的工程描述文件。

虽然一个`xmake.lua`也可以描述多个子工程模块，但是如果工程越来越大，越来越复杂，适当的模块化是很有必要的。。

这就需要`add_subdirs`了，将每个子模块放到不同目录中，并为其建立一个新的`xmake.lua`独立去维护它，例如：

```
./tbox
├── src
│   ├── demo
│   │   └── xmake.lua (用来描述测试模块)
│   └── tbox
│       └── xmake.lua（用来描述libtbox库模块）
└── xmake.lua（用该描述通用配置信息，以及对子模块的维护）
````

在`tbox/xmake.lua`中通过`add_subdirs`将拥有`xmale.lua`的子模块的目录，添加进来，就可以了，例如：

```lua
-- 添加libtbox库模块目录
add_subdirs("src/tbox") 

-- 如果xmake f --demo=y，启用了demo模块，那么包含demo目录
if is_option("demo") then 
    add_subdirs("src/demo") 
end
```

默认情况下，xmake会去编译在所有xmake.lua中描述的所有target目标，如果只想编译指定目标，可以执行：

```bash
# 仅仅编译tbox库模块
$ xmake build tbox
```

需要注意的是，每个子`xmake.lua`中所有的路径设置都是相对于当前这个子`xmake.lua`所在的目录的，都是相对路径，这样方便维护

### add_subfiles

#### 添加子工程文件

<p class="tip">
xmake 2.x以上版本，请尽量使用[includes](#includes)这个接口，这个是add_subdirs和add_subfiles的通用版本，并且支持一些内建扩展模块。
</p>

`add_subfiles`的作用与[add_subdirs](#add_subdirs)类似，唯一的区别就是：这个接口直接指定`xmake.lua`文件所在的路径，而不是目录，例如：

```lua
add_subfiles("src/tbox/xmake.lua")
```

### add_moduledirs

#### 添加模块目录

xmake内置的扩展模块都在`xmake/modules`目录下，可通过[import](#import)来导入他们，如果自己在工程里面实现了一些扩展模块，
可以放置在这个接口指定的目录下，import也就会能找到，并且优先进行导入。

例如定义一个`find_openssl.lua`的扩展模块，用于扩展内置的[lib.detect.find_package](#detect-find_package)接口，则只需要将它放置在：

```
projectdir/xmake/modules/detect/packages/find_openssl.lua
```

然后在工程`xmake.lua`下指定这个模块目录，`find_package`就可以自动找到了：

```lua
add_moduledirs("projectdir/xmake/modules")
```

### add_plugindirs

#### 添加插件目录

xmake内置的插件都是放在`xmake/plugins`目录下，但是对于用户自定义的一些特定工程的插件，如果不想放置在xmake安装目录下，那么可以在`xmake.lua`中进行配置指定的其他插件路径。

```lua
-- 将当前工程下的plugins目录设置为自定义插件目录
add_plugindirs("$(projectdir)/plugins")
```

这样，xmake在编译此工程的时候，也就加载这些插件。

### add_packagedirs

#### 添加包目录

通过设置依赖包目录，可以方便的集成一些第三方的依赖库，以tbox工程为例，其依赖包如下：

```
- base.pkg
- zlib.pkg
- polarssl.pkg
- openssl.pkg
- mysql.pkg
- pcre.pkg
- ...
```

如果要让当前工程识别加载这些包，首先要指定包目录路径，例如：

```lua
add_packagedirs("packages")
```

指定好后，就可以在target作用域中，通过[add_packages](#add_packages)接口，来添加集成包依赖了，例如：

```lua
target("tbox")
    add_packages("zlib", "polarssl", "pcre", "mysql")
```

### get_config

#### 获取给定的配置值

此接口从2.2.2版本开始引入，用于快速获取给定的配置值，可用于描述域。

```lua
if get_config("myconfig") == "xxx" then
    add_defines("HELLO")
end
```

### set_config

#### 设置给定的默认配置值

此接口从2.2.2版本开始引入，用于快速在xmake.lua中设置一个默认配置值，仅用于描述域。

之前很多配置，包括编译工具链，构建目录等只能通过`$ xmake f --name=value`的方式来配置，如果我们想写死在xmake.lua提供一个默认值，就可以通过下面的方式来配置：

```lua
set_config("name", "value")
set_config("buildir", "other/buildir")
set_config("cc", "gcc")
set_config("ld", "g++")
```

不过，我们还是可以通过`$ xmake f --name=value`的方式，去修改xmake.lua中的默认配置。

### add_requires

#### 添加需要的依赖包

xmake的依赖包管理是完全支持语义版本选择的，例如："~1.6.1"，对于语义版本的具体描述见：[https://semver.org/](https://semver.org/)

一些语义版本写法：

```lua
add_requires("tbox 1.6.*", "pcre 1.3.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

目前xmake使用的语义版本解析器是[uael](https://github.com/uael)贡献的[sv](https://github.com/uael/sv)库，里面也有对版本描述写法的详细说明，可以参考下：[版本描述说明](https://github.com/uael/sv#versions)

当然，如果我们对当前的依赖包的版本没有特殊要求，那么可以直接这么写：

```lua
add_requires("tbox", "libpng", "zlib")
```

这会使用已知的最新版本包，或者是master分支的源码编译的包，如果当前包有git repo地址，我们也能指定特定分支版本：

```lua
add_requires("tbox master")
add_requires("tbox dev")
```

如果指定的依赖包当前平台不支持，或者编译安装失败了，那么xmake会编译报错，这对于有些必须要依赖某些包才能工作的项目，这是合理的。
但是如果有些包是可选的依赖，即使没有也可以正常编译使用的话，可以设置为可选包：

```lua
add_requires("tbox", {optional = true})
```

默认的设置，xmake会去优先检测系统库是否存在（如果没设置版本要求），如果用户完全不想使用系统库以及第三方包管理提供的库，那么可以设置：

```lua
add_requires("tbox", {system = false})
```

如果我们想同时源码调试依赖包，那么可以设置为使用debug版本的包（当然前提是这个包支持debug编译）：

```lua
add_requires("tbox", {debug = true})
```

如果当前包还不支持debug编译，可在仓库中提交修改编译规则，对debug进行支持，例如：

```lua
package("openssl")
    on_install("linux", "macosx", function (package)
        os.vrun("./config %s --prefix=\"%s\"", package:debug() and "--debug" or "", package:installdir())
        os.vrun("make -j4")
        os.vrun("make install")
    end)
```

某些包在编译时候有各种编译选项，我们也可以传递进来，当然包本身得支持：

```lua
add_requires("tbox", {config = {small=true}})
```

传递`--small=true`给tbox包，使得编译安装的tbox包是启用此选项的。

v2.2.3之后，可以通过[option](#option)和[has_config](#has_config)配合，在自己定义配置选项参数中控制是否需要添加某个依赖包：

```lua
option("luajit")
    set_default(false)
    set_showmenu(true)
    set_category("option")
    set_description("Enable the luajit runtime engine.")
option_end()

if has_config("luajit") then
    add_requires("luajit")
else
    add_requires("lua")
end
```

我们可以通过`$xmake f --luajit=y`去切换依赖包。

并且我们也新增了group参数，来分组依赖包，同一个组下的所有依赖包，只能有一个生效启用，启用顺序依赖`add_requires`添加的顺序:

```lua
add_requires("openssl", {group = "ssl", optional = true})
add_requires("mbedtls", {group = "ssl", optional = true})

target("test")
    add_packages("openssl", "mbedtls")
```

例如上面，所以同时依赖两个ssl包，实际上只会启用生效实际安装成功的那一个ssl包，并不会同时链接两个依赖包。

2.2.5版本之后，xmake支持对对第三方包管理器里面的依赖库安装支持，例如：conan，brew, vcpkg等

添加homebrew的依赖包：

```lua
add_requires("brew::zlib", {alias = "zlib"}})
add_requires("brew::pcre2/libpcre2-8", {alias = "pcre2"}})

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("pcre2", "zlib")
```

添加vcpkg的依赖包：

```lua
add_requires("vcpkg::zlib", "vcpkg::pcre2")

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("vcpkg::zlib", "vcpkg::pcre2")
```

添加conan的依赖包：

```lua
add_requires("CONAN::zlib/1.2.11@conan/stable", {alias = "zlib", debug = true})
add_requires("CONAN::OpenSSL/1.0.2n@conan/stable", {alias = "openssl", 
    configs = {options = "OpenSSL:shared=True"}})

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("openssl", "zlib")
```

执行xmake进行编译后：

```console
ruki:test_package ruki$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.14
note: try installing these packages (pass -y to skip confirm)?
  -> CONAN::zlib/1.2.11@conan/stable  (debug)
  -> CONAN::OpenSSL/1.0.2n@conan/stable  
please input: y (y/n)

  => installing CONAN::zlib/1.2.11@conan/stable .. ok
  => installing CONAN::OpenSSL/1.0.2n@conan/stable .. ok

[  0%]: ccache compiling.release src/main.c
[100%]: linking.release test
```

关于这块的更多详情见：https://github.com/xmake-io/xmake/issues/339

添加clib的依赖包：

clib是一款基于源码的依赖包管理器，拉取的依赖包是直接下载对应的库源码，集成到项目中编译，而不是二进制库依赖。

其在xmake中集成也很方便，唯一需要注意的是，还需要自己添加上对应库的源码到xmake.lua，例如：

```lua
add_requires("clib::clibs/bytes@0.0.4", {alias = "bytes"})

target("xmake-test")
    set_kind("binary")
    add_files("clib/bytes/*.c")
    add_files("src/*.c") 
    add_packages("bytes")
```

### add_repositories

#### 添加依赖包仓库

如果需要的包不在官方仓库[xmake-repo](https://github.com/xmake-io/xmake-repo)中，我们可以提交贡献代码到仓库进行支持。
但如果有些包仅用于个人或者私有项目，我们可以建立一个私有仓库repo，仓库组织结构可参考：[xmake-repo](https://github.com/xmake-io/xmake-repo)

比如，现在我们有一个一个私有仓库repo：`git@github.com:myrepo/xmake-repo.git`

我们可以通过此接口来添加：

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git")
```

如果我们只是想添加一两个私有包，这个时候特定去建立一个git repo太小题大做了，我们可以直接把包仓库放置项目里面，例如：

```
projectdir
  - myrepo
    - packages
      - t/tbox/xmake.lua
      - z/zlib/xmake.lua
  - src
    - main.c
  - xmake.lua
```

上面myrepo目录就是自己的私有包仓库，内置在自己的项目里面，然后在xmake.lua里面添加一下这个仓库位置：

```lua
add_repositories("my-repo myrepo")
```

这个可以参考[benchbox](https://github.com/tboox/benchbox)项目，里面就内置了一个私有仓库。

