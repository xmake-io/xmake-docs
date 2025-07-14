---
title: xmake v2.3.4 发布, 更加完善的工具链支持
tags: [xmake, lua, C/C++, toolchains, 交叉编译]
date: 2020-06-05
author: Ruki
---

为了让xmake更好得支持交叉编译，这个版本我重构了整个工具链，使得工具链的切换更加的方便快捷，并且现在用户可以很方便地在xmake.lua中扩展自己的工具链。

关于平台的支持上，我们新增了对*BSD系统的支持，另外，此版本还新增了一个ninja主题风格，实现类似ninja的编译进度显示，例如：

<img src="/assets/img/theme/ninja.png" width="60%" />

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)





## 新特性介绍

### 工具链改进

#### 工具链和平台完全分离

之前的版本，平台和工具链绑定的过于紧密，例如`xmake f -p windows` 平台，默认只能使用msvc的编译，想要切到clang或者其他编译器，就只能走交叉编译平台：`xmake f -p cross`。

但是这样的话，一些windows平台特有的设置就丢失了，而且用户也没法使用`if is_plat("windows") then`来判断windows平台做特定的设置。

其实平台和工具链是完全可以独立开来的，新版本经过重构后，即使是windows平台以及其他任何平台，也可以方便快速的切换到clang, llvm等其他工具链。

```bash
$ xmake f -p windows --toolchain=clang
```

#### 内置工具链

虽然xmake的交叉编译配置支持所有工具链，也提供一定程度的智能分析和工具链探测，但通用方案多少对特定工具链支持需要追加各种额外的配置，例如额外传递一些`--ldflags=`, `--cxflags=`参数什么的。

而新版本xmake内置了一些常用工具链，可以省去交叉编译工具链复杂的配置过程，只需要传递工具链名到`--toolchain=xxx`即可。

切换到llvm工具链：

```bash
$ xmake f -p cross --toolchain=llvm --sdk="C:\Program Files\LLVM"
$ xmake
```

切换到GNU-RM工具链：

```bash
$ xmake f -p cross --toolchain=gnu-rm --sdk=/xxx/cc-arm-none-eabi-9-2019-q4-major
$ xmake
```

就可以快速切换的指定的交叉编译工具链，对于内置的工具链，可以省去大部分配置，通常只需要`--toolchain=`和`--sdk=`即可，其他的配置都会自动设置好，确保编译正常。

那xmake还支持哪些内置工具链呢？我们可以通过下面的命令查看：

```bash
$ xmake show -l toolchains
xcode         Xcode IDE
vs            VisualStudio IDE
yasm          The Yasm Modular Assembler
clang         A C language family frontend for LLVM
go            Go Programming Language Compiler
dlang         D Programming Language Compiler
sdcc          Small Device C Compiler
cuda          CUDA Toolkit
ndk           Android NDK
rust          Rust Programming Language Compiler
llvm          A collection of modular and reusable compiler and toolchain technologies
cross         Common cross compilation toolchain
nasm          NASM Assembler
gcc           GNU Compiler Collection
mingw         Minimalist GNU for Windows
gnu-rm        GNU Arm Embedded Toolchain
envs          Environment variables toolchain
fasm          Flat Assembler
```

#### 工具链的同步切换

新版本xmake还支持工具链的完整同步切换，这个是什么意思呢？

比如，我们要从默认的gcc切换到clang编译，可能需要切一些工具集，`xmake f --cc=clang --cxx=clang --ld=clang++ --sh=clang++`，因为编译器切了，对应的链接器，静态库归档器什么的都得同时切才行。

这么挨个切一边，确实很蛋疼，作者本人也是受不了了，所以重构工具链的时候，这块也重点改进了下，现在只需要：

```bash
$ xmake f --toolchain=clang
$ xmake
```

就可以完全把所有clang工具集整体切过去，那如何重新切回gcc呢，也很方便：

或者

```bash
$ xmake f --toolchain=gcc
$ xmake
```


#### 自定义工具链

另外，我们现在也可以在xmake.lua中自定义toolchain，然后通过`xmake f --toolchain=myclang`指定切换，例如：

```lua
toolchain("myclang")
    set_kind("standalone")
    set_toolset("cc", "clang")
    set_toolset("cxx", "clang", "clang++")
    set_toolset("ld", "clang++", "clang")
    set_toolset("sh", "clang++", "clang")
    set_toolset("ar", "ar")
    set_toolset("ex", "ar")
    set_toolset("strip", "strip")
    set_toolset("mm", "clang")
    set_toolset("mxx", "clang", "clang++")
    set_toolset("as", "clang")

    -- ...
```

其中`set_toolset`用于挨个设置不同的工具集，比如编译器、链接器、汇编器等。

xmake默认会从`xmake f --sdk=xx`的sdk参数中去探测工具，当然我们也可以在xmake.lua中对每个自定义工具链调用`set_sdk("/xxx/llvm")`来写死工具链sdk地址。

关于这块的详情介绍，可以到[自定义工具链](https://xmake.io/zh-cn/manual/custom_toolchain)章节查看

更多详情见：[#780](https://github.com/xmake-io/xmake/issues/780)

#### 针对特定target设置工具链

除了自定义工具链，我们也可以对某个特定的target单独切换设置不同的工具链，和set_toolset不同的是，此接口是对完整工具链的整体切换，比如cc/ld/sh等一系列工具集。

这也是推荐做法，因为像gcc/clang等大部分编译工具链，编译器和链接器都是配套使用的，要切就得整体切，单独零散的切换设置会很繁琐。

比如我们切换test目标到clang+yasm两个工具链：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("clang", "yasm")
```

或者可以通过`set_toolset`来对每个target的工具链中的特定工具单独设置。

```lua
target("test")
    set_kind("binary")
    set_toolset("cxx", "clang")
    set_toolset("ld", "clang++")
```


### ninja构建主题

构建进度风格类似ninja，采用单行进度条，不再回滚进度，用户可以根据自己的喜好设置。

除了进度展示不同外，其他都跟默认主题的配置相同。

```bash
$ xmake g --theme=ninja
```

<img src="/assets/img/theme/ninja.png" width="60%" />

### 设置构建行为策略

xmake有很多的默认行为，比如：自动检测和映射flags、跨target并行构建等，虽然提供了一定的智能化处理，但重口难调，不一定满足所有的用户的使用习惯和需求。

因此，从v2.3.4开始，xmake提供默认构建策略的修改设置，开放给用户一定程度上的可配置性。

使用方式如下：

```lua
set_policy("check.auto_ignore_flags", false)
```

只需要在项目根域设置这个配置，就可以禁用flags的自动检测和忽略机制，另外`set_policy`也可以针对某个特定的target局部生效。

```lua
target("test")
    set_policy("check.auto_ignore_flags", false)
```

!> 另外，如果设置的策略名是无效的，xmake也会有警告提示。

如果要获取当前xmake支持的所有策略配置列表和描述，可以执行下面的命令：

```bash
$ xmake l core.project.policy.policies
{ 
  "check.auto_map_flags" = { 
    type = "boolean",
    description = "Enable map gcc flags to the current compiler and linker automatically.",
    default = true 
  },
  "build.across_targets_in_parallel" = { 
    type = "boolean",
    description = "Enable compile the source files for each target in parallel.",
    default = true 
  },
  "check.auto_ignore_flags" = { 
    type = "boolean",
    description = "Enable check and ignore unsupported flags automatically.",
    default = true 
  } 
}
```

#### check.auto_ignore_flags

xmake默认会对所有`add_cxflags`, `add_ldflags`接口设置的原始flags进行自动检测，如果检测当前编译器和链接器不支持它们，就会自动忽略。

这通常是很有用的，像一些可选的编译flags，即使不支持也能正常编译，但是强行设置上去，其他用户在编译的时候，有可能会因为编译器的支持力度不同，出现一定程度的编译失败。

但，由于自动检测并不保证100%可靠，有时候会有一定程度的误判，所以某些用户并不喜欢这个设定（尤其是针对交叉编译工具链，更容易出现失败）。

目前，v2.3.4版本如果检测失败，会有警告提示避免用户莫名躺坑，例如：

```bash
warning: add_ldflags("-static") is ignored, please pass `{force = true}` or call `set_policy("check.auto_ignore_flags", false)` if you want to set it.
```

根据提示，我们可以自己分析判断，是否需要强制设置这个flags，一种就是通过：

```lua
add_ldflags("-static", {force = true})
```

来显示的强制设置上它，跳过自动检测，这对于偶尔的flags失败，是很有效快捷的处理方式，但是对于交叉编译时候，一堆的flags设置检测不过的情况下，每个都设置force太过于繁琐。

这个时候，我们就可以通过`set_policy`来对某个target或者整个project直接禁用默认的自动检测行为：

```lua
set_policy("check.auto_ignore_flags", false)
target("test")
    add_ldflags("-static")
```

然后我们就可以随意设置各种原始flags，xmake不会去自动检测和忽略他们了。

#### check.auto_map_flags

这是xmake的另外一个对flags的智能分析处理，通常像`add_links`, `add_defines`这种xmake内置的api去设置的配置，是具有跨平台特性的，不同编译器平台会自动处理成对应的原始flags。

但是，有些情况，用户还是需要自己通过add_cxflags, add_ldflags设置原始的编译链接flags，这些flags并不能很好的跨编译器

就拿`-O0`的编译优化flags来说，虽然有`set_optimize`来实现跨编译器配置，但如果用户直接设置`add_cxflags("-O0")`呢？gcc/clang下可以正常处理，但是msvc下就不支持了

也许我们能通过`if is_plat() then`来分平台处理，但很繁琐，因此xmake内置了flags的自动映射功能。

基于gcc flags的普及性，xmake采用gcc的flags命名规范，对其根据不同的编译实现自动映射，例如：

```lua
add_cxflags("-O0")
```

这一行设置，在gcc/clang下还是`-O0`，但如果当前是msvc编译器，那边会自动映射为msvc对应`-Od`编译选项来禁用优化。

整个过程，用户是完全无感知的，直接执行xmake就可以跨编译器完成编译。

!> 当然，目前的自动映射实现还不是很成熟，没有100%覆盖所有gcc的flags，所以还是有不少flags是没去映射的。

也有部分用户并不喜欢这种自动映射行为，那么我们可以通过下面的设置完全禁用这个默认的行为：

```bash
set_policy("check.auto_map_flags", false)
```

#### build.across_targets_in_parallel

这个策略也是默认开启的，主要用于跨target间执行并行构建，v2.3.3之前的版本，并行构建只能针对单个target内部的所有源文件，
跨target的编译，必须要要等先前的target完全link成功，才能执行下一个target的编译，这在一定程度上会影响编译速度。

然而每个target的源文件是可以完全并行化处理的，最终在一起执行link过程，v2.3.3之后的版本通过这个优化，构建速度提升了30%。

当然，如果有些特殊的target里面的构建源文件要依赖先前的target（尤其是一些自定义rules的情况，虽然很少遇到），我们也可以通过下面的设置禁用这个优化行为：

```bash
set_policy("build.across_targets_in_parallel", false)
```

### 新增编译模式

#### mode.releasedbg

为当前工程xmake.lua添加releasedbg编译模式的配置规则，例如：

```lua
add_rules("mode.releasedbg")
```

!> 与release模式相比，此模式还会额外开启调试符号，这通常是非常有用的。

相当于：

```lua
if is_mode("releasedbg") then
    set_symbols("debug")
    set_optimize("fastest")
    set_strip("all")
end
```

我们可以通过：`xmake f -m releasedbg`来切换到此编译模式。

#### mode.minsizerel

为当前工程xmake.lua添加minsizerel编译模式的配置规则，例如：

```lua
add_rules("mode.minsizerel")
```

!> 与release模式相比，此模式更加倾向于最小代码编译优化，而不是速度优先。

相当于：

```lua
if is_mode("minsizerel") then
    set_symbols("hidden")
    set_optimize("smallest")
    set_strip("all")
end
```

我们可以通过：`xmake f -m minsizerel`来切换到此编译模式。

### 显示指定信息和列表

#### 显示xmake自身和当前项目的基础信息

```bash
$ xmake show
The information of xmake:
    version: 2.3.3+202006011009
    host: macosx/x86_64
    programdir: /Users/ruki/.local/share/xmake
    programfile: /Users/ruki/.local/bin/xmake
    globaldir: /Users/ruki/.xmake
    tmpdir: /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/200603
    workingdir: /Users/ruki/projects/personal/tbox
    packagedir: /Users/ruki/.xmake/packages
    packagedir(cache): /Users/ruki/.xmake/cache/packages/2006

The information of project: tbox
    version: 1.6.5
    plat: macosx
    arch: x86_64
    mode: release
    buildir: build
    configdir: /Users/ruki/projects/personal/tbox/.xmake/macosx/x86_64
    projectdir: /Users/ruki/projects/personal/tbox
    projectfile: /Users/ruki/projects/personal/tbox/xmake.lua
```

#### 显示工具链列表

```bash
$ xmake show -l toolchains
xcode         Xcode IDE
vs            VisualStudio IDE
yasm          The Yasm Modular Assembler
clang         A C language family frontend for LLVM
...
```

#### 显示指定target配置信息

```bash
$ xmake show --target=tbox
The information of target(tbox):
    kind: static
    targetfile: build/macosx/x86_64/release/libtbox.a
    rules: mode.release, mode.debug, mode.profile, mode.coverage
    options: info, float, wchar, exception, force-utf8, deprecated, xml, zip, hash, regex, coroutine, object, charset, database
    packages: mbedtls, polarssl, openssl, pcre2, pcre, zlib, mysql, sqlite3
    links: pthread
    syslinks: pthread, dl, m, c
    cxflags: -Wno-error=deprecated-declarations, -fno-strict-aliasing, -Wno-error=expansion-to-defined, -fno-stack-protector
    defines: __tb_small__, __tb_prefix__="tbox"
    mxflags: -Wno-error=deprecated-declarations, -fno-strict-aliasing, -Wno-error=expansion-to-defined
    headerfiles: src/(tbox/**.h)|**/impl/**.h, src/(tbox/prefix/**/prefix.S), src/(tbox/math/impl/*.h), src/(tbox/utils/impl/*.h), build/macosx/x86_64/release/tbox.config.h
    includedirs: src, build/macosx/x86_64/release
    at: /Users/ruki/projects/personal/tbox/src/tbox/xmake.lua
    sourcebatch(cc): with rule(c.build)
      -> src/tbox/string/static_string.c
         -> build/.objs/tbox/macosx/x86_64/release/src/tbox/string/static_string.c.o
         -> build/.deps/tbox/macosx/x86_64/release/src/tbox/string/static_string.c.o.d
      -> src/tbox/platform/sched.c
         -> build/.objs/tbox/macosx/x86_64/release/src/tbox/platform/sched.c.o
         -> build/.deps/tbox/macosx/x86_64/release/src/tbox/platform/sched.c.o.d
      -> src/tbox/stream/stream.c
         -> build/.objs/tbox/macosx/x86_64/release/src/tbox/stream/stream.c.o
         -> build/.deps/tbox/macosx/x86_64/release/src/tbox/stream/stream.c.o.d
      -> src/tbox/utils/base32.c
         -> build/.objs/tbox/macosx/x86_64/release/src/tbox/utils/base32.c.o
         -> build/.deps/tbox/macosx/x86_64/release/src/tbox/utils/base32.c.o.d
```

#### 显示内置编译模式列表

```bash
$ xmake show -l modes
```

#### 显示内置编译规则列表

```bash
$ xmake show -l rules
```

#### 显示其他信息

还在完善中，详情见：https://github.com/xmake-io/xmake/issues/798

或者运行：

```bash
$ xmake show --help
```

## 更新内容

### 新特性

* [#630](https://github.com/xmake-io/xmake/issues/630): 支持*BSD系统，例如：FreeBSD, ..
* 添加wprint接口去显示警告信息
* [#784](https://github.com/xmake-io/xmake/issues/784): 添加`set_policy()`去设置修改一些内置的策略，比如：禁用自动flags检测和映射
* [#780](https://github.com/xmake-io/xmake/issues/780): 针对target添加set_toolchains/set_toolsets实现更完善的工具链设置，并且实现platform和toolchains分离
* [#798](https://github.com/xmake-io/xmake/issues/798): 添加`xmake show`插件去显示xmake内置的各种信息
* [#797](https://github.com/xmake-io/xmake/issues/797): 添加ninja主题风格，显示ninja风格的构建进度条，`xmake g --theme=ninja`
* [#816](https://github.com/xmake-io/xmake/issues/816): 添加mode.releasedbg和mode.minsizerel编译模式规则
* [#819](https://github.com/xmake-io/xmake/issues/819): 支持ansi/vt100终端字符控制

### 改进

* [#771](https://github.com/xmake-io/xmake/issues/771): 检测includedirs,linkdirs和frameworkdirs的输入有效性
* [#774](https://github.com/xmake-io/xmake/issues/774): `xmake f --menu`可视化配置菜单支持窗口大小Resize调整
* [#782](https://github.com/xmake-io/xmake/issues/782): 添加add_cxflags等配置flags自动检测失败提示
* [#808](https://github.com/xmake-io/xmake/issues/808): 生成cmakelists插件增加对add_frameworks的支持
* [#820](https://github.com/xmake-io/xmake/issues/820): 支持独立的工作目录和构建目录，保持项目目录完全干净

### Bugs修复

* [#786](https://github.com/xmake-io/xmake/issues/786): 修复头文件依赖检测
* [#810](https://github.com/xmake-io/xmake/issues/810): 修复linux下gcc strip debug符号问题
