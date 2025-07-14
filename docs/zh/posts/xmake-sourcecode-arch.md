---
title: xmake 源码架构剖析
tags: [xmake, lua, 源码, 架构设计]
date: 2017-09-28
author: Ruki
---

title: xmake 源码架构剖析
tags: [xmake, lua, 源码, 架构设计]
date: 2017-09-28
author: Ruki

---
本文主要介绍下[xmake](https://github.com/xmake-io/xmake)的整体架构设计，以及源码结构的布局和模块划分。
如果你想深度使用xmake，开发xmake插件、工程自定义脚本或者想为xmake贡献一些代码和特性，可以通过此本的介绍，对xmake项目整体有个大概的了解。，

源码地址：[Github](https://github.com/xmake-io/xmake)

## 顶层目录结构

```bash
./xmake/
├── actions    # 内建的一些基础task，用于基本的构建安装等操作
├── core       # xmake的核心模块，提供最底层的实现支持
├── languages  # 所有的语言相关特性支持和扩展，都在此目录下
├── modules    # 内置的扩展模块，可用`import`导入使用
├── packages   # 内置包目录，提供xmake所需的一些必须依赖包支持，例如：git等，其他第三方包放在独立xmake-repo下
├── platforms  # 平台支持目录，提供各个构建平台的配置信息和脚本
├── plugins    # 插件目录，提供一些内置的插件支持，例如：生成IDE工程，宏脚本等。。
├── scripts    # 放置一些杂七杂八的shell、perl等其他语言脚本，例如：gas-preprocessor.pl
└── templates  # 工程模板目录，提供一些`xmake create`创建工程所需的内置模板
```

## 沙盒模式

为了简化`xmake.lua`中自己定义脚本、插件脚本以及扩展模块的开发，提供更高的安全性，xmake采用了沙盒的方式去加载他们，每个脚本都独立在一个单独的沙盒中，并且有独立的作用域支持。

在xmake的整个目录结构中，除了`xmake/core`底层核心模块，其他的顶层目录全部放置在沙盒中加载运行，来简化代码开发，提高易用性和安全性。

这样有什么好处呢？

* 上层模块的开发跟xmake的core代码完全隔离，不会干扰到xmake的底层核心模块，更加安全
* 作用域只提供当前模块所需api的最小子集支持
* 提供内置异常处理机制，以及api调用的返回值、传参有效性检测，代码出错后，会及时报出异常信息，并提供详细栈来定位问题
* 可通过`import("core.base.task")`的模块导入方式，提供更加方便高效的模块加载支持
* 通过异常机制，简化代码的编写，可以简化30%的代码量，以及错误判断
* 常用接口字符串参数，支持`$(val)`等内置变量的自动转换

下面我们可以直观感受下`原生代码`和`沙盒代码`的区别：






#### 导入和返回值判断的改进

原生代码：

```lua
local test = require("modules/test")

local ok, errors = test.run("arg1", "arg2")
if not ok then
    os.raise(errors)
end
```

沙盒代码：

```lua
import("modules.test")

test.run("arg1", "arg2")
```

如果`test.run`运行出错，会自动中断，并显示出错信息。

import的导入比lua原生的require更加的强大易用，支持很多高级特性：

* 多级多目录导入支持，模块的搜索目录可以有多个，也可以在`xmake.lua`中自己指定
* 通过指定父目录，批量加载所有模块，例如：`import("core")`会加载core目录下的所有模块，并且通过`core.xxx`来访问
* 支持模块继承导入
* 支持匿名导入和缓存优化
* 支持别名设置
* 通过下划线区分，仅导入公有接口
* 自动识别main函数，可直接调用，例如：`import("test")(args)`，会自动调用test模块中的main函数
* 支持`xmake lua`直接加载测试，例如：`xmake l lib.detect.find_package zlib`

#### 内置api的改进

原生代码：

```lua
print("hello xmake")
print("hello", "xmake")
```

沙盒代码：

```lua
print("hello xmake")
print("hello", "xmake")
print("hello %s", "xmake")
print("hello $(var)")
```

#### 空参数的判断改进

原生代码：

```lua
function test(array)
    if array ~= nil then
        for _, item in ipairs(array) do 
            -- ...
        end
    end
end
```

沙盒代码：

```lua
function test(array)
    for _, item in ipairs(array) do 
        -- ...
    end
end
```

#### 简化模块定义

原生代码：

```lua
local module = module or {}

function module.test(arg)
    -- ...
end

return module
```

沙盒代码：

```lua
function test(arg)
    -- ...
end
```

## Actions目录

这个目录下提供xmake日常所需的最基础命令，提供配置、编译、打包、安装、运行、调试、卸载等功能。

```bash
./xmake/actions/
├── build       # 构建工程
├── clean       # 清理构建产生的文件
├── config      # 构建前的工程配置
├── create      # 根据模板创建工程
├── global      # 全局配置
├── install     # 安装构建好的目标文件到系统
├── package     # 打包当前平台下的构建文件
├── require     # 获取依赖包
├── run         # 运行、调试目标程序
└── uninstall   # 卸载安装到系统的目标文件
```

## Modules目录

这个是扩展模块目录，提供了一些常用的模块，来扩展`xmake.lua`的自定义脚本，提供更多高级特性，例如：编译器特性检测、依赖包检测等。

```bash
./xmake/modules/
├── core
│   └── tools # 这个下面的模块，主要用于扩展xmake的编译工具链
│       ├── ar.lua
│       ├── cl.lua
│       ├── clang.lua
│       ├── clangxx.lua
│       ├── dmd.lua
│       ├── gcc.lua
│       ├── gccgo.lua
│       ├── gdc.lua
│       ├── go.lua
│       ├── gxx.lua
│       ├── ldc.lua
│       ├── lib.lua
│       ├── link.lua
│       ├── ml.lua
│       ├── ml64.lua
│       ├── rc.lua
│       ├── rustc.lua
│       └── swiftc.lua
├── detect
│   ├── packages # 用于增强find_package接口的探测
│   │   ├── find_mbedtls.lua
│   │   ├── find_mysql.lua
│   │   ├── find_openssl.lua
│   │   ├── find_pcre.lua
│   │   ├── find_pcre2.lua
│   │   └── find_zlib.lua
│   ├── sdks # 用于查找一些编译sdk环境
│   │   ├── find_cross_toolchains.lua
│   │   ├── find_ndk_sdkvers.lua
│   │   ├── find_ndk_toolchains.lua
│   │   ├── find_vstudio.lua
│   │   ├── find_xcode_dir.lua
│   │   └── find_xcode_sdkvers.lua
│   └── tools # 用于增强可执行工具的查找、特性检测
│       ├── find_7z.lua
│       ├── find_apt.lua
│       ├── find_ar.lua
│       ├── find_brew.lua
│       ├── find_ccache.lua
│       ├── find_cl.lua
│       ├── find_clang.lua
│       ├── find_clangxx.lua
│       ├── find_curl.lua
│       ├── find_dmd.lua
│       ├── find_doxygen.lua
│       ├── find_gcc.lua
│       ├── find_gccgo.lua
│       ├── find_gdb.lua
│       ├── find_gdc.lua
│       ├── find_git.lua
│       ├── find_go.lua
│       ├── find_gxx.lua
│       ├── find_gzip.lua
│       ├── find_ldc2.lua
│       ├── find_lib.lua
│       ├── find_link.lua
│       ├── find_lipo.lua
│       ├── find_lldb.lua
│       ├── find_ml.lua
│       ├── find_ml64.lua
│       ├── find_ollydbg.lua
│       ├── find_pacman.lua
│       ├── find_ping.lua
│       ├── find_pkg_config.lua
│       ├── find_rc.lua
│       ├── find_rustc.lua
│       ├── find_sudo.lua
│       ├── find_swiftc.lua
│       ├── find_tar.lua
│       ├── find_unzip.lua
│       ├── find_vsjitdebugger.lua
│       ├── find_wget.lua
│       ├── find_windbg.lua
│       ├── find_x64dbg.lua
│       ├── find_yum.lua
│       ├── find_zip.lua
├── devel
│   ├── debugger # 调试器支持
│   │   └── run.lua
│   └── git # git模块的扩展封装
│       ├── branches.lua
│       ├── checkout.lua
│       ├── checkurl.lua
│       ├── clean.lua
│       ├── clone.lua
│       ├── ls_remote.lua
│       ├── pull.lua
│       ├── refs.lua
│       └── tags.lua
├── lib
│   └── detect # 这个模块，比较实用，用于各种编译器特性探测、语言类型和函数检测
│       ├── check_cxsnippets.lua
│       ├── features.lua
│       ├── find_tool.lua
│       ├── find_toolname.lua
│       ├── has_cfuncs.lua
│       ├── has_cincludes.lua
│       ├── has_ctypes.lua
│       ├── has_cxxfuncs.lua
│       ├── has_cxxincludes.lua
│       ├── has_cxxtypes.lua
│       ├── has_features.lua
│       ├── has_flags.lua
│       └── pkg_config.lua
├── net # 网络模块
│   ├── fasturl.lua
│   ├── http 
│   │   └── download.lua # http下载模块，自动检测curl/wget并调用
│   └── ping.lua
├── package
│   └── manager # 系统第三方包管理工具的封装，提供一致性包安装
│       ├── apt
│       │   └── install.lua
│       ├── brew
│       │   └── install.lua
│       ├── install.lua
│       ├── pacman
│       │   └── install.lua
│       └── yum
│           └── install.lua
├── privilege # 权限管理
│   └── sudo.lua
└── utils
    └── archive # 归档文件的压缩和解压，支持系统常用归档格式：zip/7z/gz/tar/bz2等，自动检测和适配解压工具
        └── extract.lua
```

## Plugins目录

放置内置插件的目录，里面内置了一些常用插件，我们也可以自己扩展插件，或者从[xmake-plugins](https://github.com/xmake-io/xmake-plugins)上面下载一些扩展插件。

```bash
./xmake/plugins/
├── doxygen         # doxygen文档生成插件
├── hello           # xmake插件的一个demo
├── lua             # 加载和测试lua脚本、xmake的模块，例如：xmake l lib.detect.find_tool git
│   └── scripts 
├── macro           # 宏记录插件，记录和回放所有执行过的xmake命令，一般用于批量构建和打包
│   └── macros
├── project         # IDE工程文件生成插件，支持：vs200x, vs201x, makefile等工程文件
│   ├── clang
│   ├── makefile
│   └── vstudio
└── repo            # 依赖包仓库管理
```

## Platforms目录

提供一些构建平台的配置和脚本处理，也可自行扩展自己的平台。

```bash
./xmake/platforms/
├── android   # 基于android ndk的编译
├── cross     # 主要用于交叉编译 
├── iphoneos  # ios平台的编译，支持模拟器架构
├── linux     # linux平台，也支持linux环境的交叉编译工具链
├── macosx    # macosx的环境编译
├── mingw     # 基于mingw工具链的编译，支持windows/macosx/linux下的mingw
├── watchos   # apple watch 平台的编译
└── windows   # windows平台的编译，可直接在cmd终端下进行，不需要cygwin/msys支持
```

## Languages目录

这个目录提供xmake编译指定的代码语言所需的一些配置信息和脚本处理，我们可以自己扩展这个目录，来提供其他语言编译的支持。

```bash
./xmake/languages/
├── asm
├── c++
├── dlang
├── golang
├── msrc
├── objc++
├── rust
└── swift
```

## Templates目录

这个目录主要提供`xmake create`创建空工程所需的一些内置工程模板。

```bash
./xmake/templates/
├── c
│   ├── console
│   ├── console_tbox
│   ├── shared_library
│   ├── shared_library_tbox
│   ├── static_library
│   └── static_library_tbox
├── c++
│   ├── console
│   ├── console_tbox
│   ├── shared_library
│   ├── shared_library_tbox
│   ├── static_library
│   └── static_library_tbox
├── dlang
│   ├── console
│   ├── shared_library
│   └── static_library
├── go
│   ├── console
│   └── static_library
├── objc
│   └── console
├── objc++
│   └── console
├── rust
│   ├── console
│   └── static_library
└── swift
    └── console
```

## Core目录

core比较复杂，它是xmake最底层的支撑，提供了沙盒机制、解释器、工程处理、基础模块、插件加载的核心实现，里面的所有模块都不在沙盒里面，所以跟其他目录里面的模块是完全隔离的。

```bash
./xmake/core/
├── _xmake_main.lua # xmake的脚本起始入口
├── base # 基础模块
│   ├── colors.lua # ${red}等色彩输出的基础支持
│   ├── coroutine.lua # 协程封装
│   ├── deprecated.lua
│   ├── emoji.lua
│   ├── filter.lua # $(val)变量的处理器
│   ├── global.lua
│   ├── interpreter.lua # xmake.lua的解释器
│   ├── io.lua
│   ├── option.lua # 命令行输入参数的解析和获取
│   ├── os.lua
│   ├── path.lua
│   ├── privilege.lua
│   ├── process.lua
│   ├── profiler.lua # 性能分析器
│   ├── string.lua
│   ├── table.lua
│   ├── task.lua # task任务、插件处理模块
│   └── utils.lua
├── language # 代码语言模块，会去加载languages目录下的指定语言配置
│   ├── language.lua
│   └── menu.lua
├── main.lua # xmake的主入口
├── package # 包依赖支持
│   ├── package.lua
│   └── repository.lua
├── platform # 平台管理
│   ├── environment.lua
│   ├── menu.lua
│   └── platform.lua
├── project # 工程管理相关的一些模块
│   ├── cache.lua # 工程缓存维护
│   ├── config.lua # 工程配置文件维护
│   ├── history.lua
│   ├── option.lua # option对象的封装
│   ├── project.lua # 工程xmake.lua加载和解析
│   ├── target.lua # target对象的封装
│   └── template.lua # 工程模板的加载
├── sandbox # 沙盒模块
│   ├── modules # 这里面也提供了一些内置沙盒模块，跟modules目录下的模块的区别就是，这里的模块实现代码本身不基于沙盒，纯原生底层代码实现，可直接调用底层接口
│   │   ├── _g.lua # 这里的模块不需要import，可直接在沙盒脚本中使用
│   │   ├── assert.lua
│   │   ├── catch.lua
│   │   ├── coroutine.lua
│   │   ├── cprint.lua
│   │   ├── cprintf.lua
│   │   ├── debug.lua
│   │   ├── finally.lua
│   │   ├── format.lua
│   │   ├── hash.lua
│   │   ├── ifelse.lua
│   │   ├── import # 这里面也提供了一些import所需的内置沙盒模块，里面的实现代码，可直接调用core里面底层接口，并且做了异常捕获和返回值检测
│   │   │   ├── core
│   │   │   │   ├── base
│   │   │   │   │   ├── colors.lua
│   │   │   │   │   ├── filter.lua
│   │   │   │   │   ├── global.lua
│   │   │   │   │   ├── option.lua
│   │   │   │   │   ├── privilege.lua
│   │   │   │   │   ├── semver.lua
│   │   │   │   │   └── task.lua
│   │   │   │   ├── language
│   │   │   │   │   ├── language.lua
│   │   │   │   │   └── menu.lua
│   │   │   │   ├── package
│   │   │   │   │   ├── package.lua
│   │   │   │   │   └── repository.lua
│   │   │   │   ├── platform
│   │   │   │   │   ├── environment.lua
│   │   │   │   │   ├── menu.lua
│   │   │   │   │   └── platform.lua
│   │   │   │   ├── project
│   │   │   │   │   ├── cache.lua
│   │   │   │   │   ├── config.lua
│   │   │   │   │   ├── history.lua
│   │   │   │   │   ├── menu.lua
│   │   │   │   │   ├── project.lua
│   │   │   │   │   ├── target.lua
│   │   │   │   │   ├── task.lua
│   │   │   │   │   └── template.lua
│   │   │   │   ├── sandbox
│   │   │   │   │   ├── module.lua
│   │   │   │   │   └── sandbox.lua
│   │   │   │   └── tool
│   │   │   │       ├── compiler.lua
│   │   │   │       ├── extractor.lua
│   │   │   │       └── linker.lua
│   │   │   └── lib
│   │   │       └── detect # lib.detect.* 下的部分探测接口，跟modules下的那些类似
│   │   │           ├── cache.lua
│   │   │           ├── find_directory.lua
│   │   │           ├── find_file.lua
│   │   │           ├── find_library.lua
│   │   │           ├── find_package.lua
│   │   │           ├── find_path.lua
│   │   │           ├── find_program.lua
│   │   │           └── find_programver.lua
│   │   ├── import.lua # import接口实现
│   │   ├── inherit.lua
│   │   ├── insert.lua
│   │   ├── interpreter # xmake.lua上层描述域可直接调用的一些内置模块
│   │   │   ├── format.lua
│   │   │   ├── getenv.lua
│   │   │   ├── ifelse.lua
│   │   │   ├── ipairs.lua
│   │   │   ├── os.lua
│   │   │   ├── pairs.lua
│   │   │   ├── path.lua
│   │   │   ├── print.lua
│   │   │   ├── printf.lua
│   │   │   ├── string.lua
│   │   │   ├── table.lua
│   │   │   ├── tonumber.lua
│   │   │   ├── tostring.lua
│   │   │   └── type.lua
│   │   ├── io.lua # 这下面是一些不需要import的内置接口，部分接口做了些改进
│   │   ├── ipairs.lua
│   │   ├── math.lua
│   │   ├── os.lua
│   │   ├── pairs.lua
│   │   ├── path.lua
│   │   ├── print.lua
│   │   ├── printf.lua
│   │   ├── process.lua
│   │   ├── raise.lua
│   │   ├── string.lua
│   │   ├── table.lua
│   │   ├── tonumber.lua
│   │   ├── tostring.lua
│   │   ├── try.lua
│   │   ├── type.lua
│   │   ├── unpack.lua
│   │   ├── utils.lua
│   │   ├── val.lua
│   │   ├── vformat.lua
│   │   ├── vprint.lua
│   │   └── vprintf.lua
│   └── sandbox.lua
└── tool # 编译器、链接器等相关工具的封装模块，可通过`import("core.tool.compiler")`来使用
    ├── builder.lua
    ├── compiler.lua
    ├── extractor.lua
    ├── linker.lua
    └── tool.lua
```