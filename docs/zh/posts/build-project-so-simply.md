---
title: xmake入门，构建项目原来可以如此简单
tags: [xmake, lua, build, project]
date: 2018-03-26
author: Ruki
---

## 前言

在开发[xmake](https://github.com/xmake-io/xmake)之前，我一直在使用gnumake/makefile来维护个人C/C++项目，一开始还好，然而等项目越来越庞大后，维护起来就非常吃力了，后续也用过一阵子automake系列工具，并不是很好用。

由于C/C++程序的构建过程比较繁琐，如果不借助IDE工具，很难快速构建一个新的C/C++程序，想要跨平台构建就更加麻烦了。

虽然IDE很好用，也很强大，但是还是有很多不足的地方，例如:

- 跨平台开发支持不完善 
- 自身环境不一定跨平台
- 过于臃肿
- 不利于服务端自动化部署构建
- 不够灵活，定制化配置构建过程有局限性

当然如果你熟悉makefile的话，也可以手敲makefile，不过不同平台用的make也不相同，比如: gnumake, nmake等，导致makefile语法存在差异性，无法做到一致性编译，而且对开发者有一定的使用门槛。

在win上使用gnumake还得装cygwin，mingw-msys等环境，也非常麻烦，折腾完环境就得半天时间。

目前已经有了很多现代化的构建工具，方便开发者构建和维护C/C++项目，例如:cmake, scons, premake, bazel, gn, gyp等等。

其中很多只能生成对应的IDE工程，然后再通过对应IDE来维护和构建，这种只是解决了C/C++项目的一致性维护问题，但是构建方式不一致，因此还是没解决之前列举的大部分不足点，也无法直接快速构建。

而cmake, scons虽然很强大，但是cmake语法怪异不直观，本人实在是不习惯，scons使用还需要依赖python，py2/py3的问题折腾起来也比较蛋疼。

鉴于此，我采用了lua来描述工程，利用lua的轻量，简洁，灵活，跨平台等特性，来解决上述遇到的各种问题，使用xmake将会带来不一样的构建体验:

- 轻量，跨平台，无依赖，无需额外安装python等第三方环境，直接内置lua运行时，一个安装包(或者命令)直接搞定
- 工程描述直观简洁，更符合用户正常的思维习惯
- 支持直接构建，强大的命令行工具，终端用户的福音，装逼用户必备
- vscode, idea, clion, sublime, vim等编辑器插件支持
- 智能检测支持，简化用户编译配置过程
- 插件支持，灵活的用户可扩展性
- vcproj等IDE项目文件生成也支持的哦
- 更多隐藏特性等你来体验

![xmake-compilation](/assets/img/posts/xmake/xmake-compilation.png)

## 快速上手

不会写makefile？没关系，直接在源码目录运行以下命令即可直接编译:

```bash
xmake
```

xmake会自动扫描在当前目录下的源码结构，生成一个`xmake.lua`工程描述文件，然后尝试直接编译。

想要直接运行编译后的可执行程序，简单，直接敲:

```bash
$ xmake run
```







更多相关信息，请参考文章: [xmake新增智能代码扫描编译模式，无需手写任何make文件](http://tboox.org/cn/2017/01/07/build-without-makefile/)

## 快速入门

如果想要更进一步描述工程，调整源码结构，添加一些编译选项什么的，还是需要维护一个名叫xmake.lua的工程描述文件，类似makefile, cmakelist.txt，但是其语法和api经过不断地改进简化，已经相当易用。

最简单的描述例子只需要三行:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

就可以构建一个可执行程序，编译所有在src目录下的c源文件。

然后直接执行xmake即可编译。

`add_files()`支持通配符文件模式匹配，并且支持`.c, .cpp, .go, .d, .m, .mm, .S, .swift, .rc, .rs`等各种native语言的代码文件，大部分都能支持混编。

我们甚至可以添加.a和.o, .obj文件到`add_files()`，例如:

```lua
target("test")
    set_kind("static")
    add_files("src/*.c")
    add_files("lib/libxxx.a", "obj/bbb.o")
```

上述描述会编译生成一个libtest.a库，在编译归档的时候，会自动将libxxx.a库反解出来，合并到libtest.a中去，并且同时将bbb.o也加进去。

xmake提供的`add_files`是非常强大的，我们还可以再添加一批文件的同时，指定排除某些文件，例如:

```lua
add_files("src/**.cpp|test.cpp|arm/*.cpp")
```

上述描述，在递归添加源文件的同时，排除掉了test.cpp以及arm目录下的源文件。

更多`add_files`用法，请参考文档:[add_files接口使用文档](https://xmake.io/zh/) 

## 使用演示

命令行下的使用过程，大家可以通过一个视频直观的体验下：

<a href="https://asciinema.org/a/133693">
<img src="https://asciinema.org/a/133693.png" width="60%" />
</a>

## 创建工程

更加省事的方式就是通过上节所说傻瓜式操作方式，自动生成一个xmake.lua，然后在这基础下修修改改就行了。

当然如果没有现成源码，想从新工程创建开始编译，那么可以使用xmake提供的工程模板进行创建:

```bash
$ xmake create test
```

默认创建一个名为test的c可执行项目，源码结构如下:

```
.
├── src
│   └── main.c
└── xmake.lua
```

当然你也可以选择语言和模板类型:

```bash
$ xmake create -l c++ -t shared test
```

上述命令创建了一个c++动态库项目，就这么简单。

## 运行和调试

编译完的可执行程序，直接敲`xmake run`就能运行，xmake会自动找到对应的target目标文件，你也可以传递参数给程序。

如果有多个target目标，你可以指定需要运行的target名，例如:

```bash
$ xmake run test
```

想要快速调试程序？加上`-d`参数即可

```bash
$ xmake run -d test
```

xmake默认会去找系统自带的调试器，然后加载运行，windows上使用vsjitdebugger，linux上gdb，macos上lldb，当然你也可以随意切换到其他调试器。

配合debug模式编译，就能做到使用xmake进行源码调试。

## 可视化配置和构建

xmake提倡使用命令行的方式来操作，用习惯后效率非常高，而且在windows上，即使没有cygwin，也可以直接在cmd下正常运行。

当然，并不是所有用户习惯命令行，因此xmake也提供了编辑器插件，与各大编辑器进行集成，例如:

#### xmake-vscode插件

<img src="https://raw.githubusercontent.com/tboox/xmake-vscode/master/res/problem.gif" width="60%" />

#### xmake-idea插件

<img src="https://raw.githubusercontent.com/tboox/xmake-idea/master/res/problem.gif" width="60%" />

#### xmake-sublime插件

<img src="https://raw.githubusercontent.com/tboox/xmake-sublime/master/res/problem.gif" width="60%" />

#### xmake-tui界面

除了编辑器插件，xmake甚至自己封装实现了一整套跨平台tui字符界面库，然后仿kconfig/menuconf的界面风格，实现了一个类似的可视化字符界面菜单配置。

这个不需要额外的插件，只需要在终端下执行:


```bash
$ xmake f --menu
```

就可以显示菜单配置界面进行编译配置，配置完即可根据当前配置进行编译，效果如下:

<img src="/assets/img/index/menuconf.gif" width="60%" />


## 定制化编译

想要更加灵活的编译配置？那就得要修改xmake.lua啦，不过还是很简单的。

#### 添加编译选项

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    if is_mode("debug") then
       add_cxflags("-DDEBUG")
    end
```

上面代码中，`add_cxflags`接口就是同时配置C/C++代码的编译选项，并且只在debug模式下生效，也就是执行下面命令的时候: 

```bash
$ xmake f -m debug
$ xmake
```

#### 使用内置选项

像添加宏定义，设置警告级别，优化级别，头文件搜索目录什么的，完全没必要使用原始的`add_cxflags`接口，xmake有提供更加方便的接口，更加智能化的处理来简化配置，也更加通用跨平台，例如:

```lua
add_defines("DEBUG")
set_optimize("fast")
set_warnings("all", "error")

target("test")
    set_kind("binary")
    add_files("src/*.c")

target("test2")
    set_kind("binary")
    add_files("src2/*.c")
```

跟刚才的配置不同的是，此处设置放在了target的上面，此处不属于target域，是root全局设置，会影响下面的所有target目标程序的编译设置，这样可以简化配置，避免冗余。

## 灵活的脚本控制

对于高端用户，构建需求复杂多变，xmake也提供了对应解决方案，各个构建阶段都可以灵活定制:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")

    after_build(function (target)
        os.exec("file %s", target:targetfile())
    end)
```

上述代码在编译程序结束后，执行file命令查看目标程序相关信息，目前xmake可以在build, clean, run, install, uninstall等各个阶段的前后插入自定义的脚本，也可以直接内置action，例如: on_install会覆盖内置的安装逻辑，提供给用户足够的灵活性。

## 方便的多目标依赖

很多时候，一个项目会有多个target目标程序，之间存在依赖关系，例如: 一个可执行程序hello，依赖一个静态库libtest.a，我们只需要通过add_deps将两个target做个关联就行了，libtest.a的搜索目录，头文件目录设置什么的都不需要关心，xmake会自动处理:

```lua
target("test")
    set_kind("static")
    add_files("src/test/*.c")

target("hello")
    add_deps("test")  --添加依赖
    set_kind("binary")
    add_files("src/hello/*.c")
```

## 预编译头文件支持

xmake支持通过预编译头文件去加速c/c++程序编译，目前支持的编译器有：gcc, clang和msvc。

```lua
target("test")
    -- ...
    set_pcxxheader("header.h")
```

各大编译器对预编译头的处理方式存在很大差异，而xmake将其差异性隐藏了起来，提供一致性的描述设置，简化用户在跨平台编译时候的处理，
具体关于编译器对预编译头文件的处理，可参考相关文章：[不同编译器对预编译头文件的处理](http://tboox.org/cn/2017/07/31/precompiled-header/)

## 自定义编译规则

xmake不仅原生内置支持多种语言文件的构建，而且还可以通过自定义构建规则，让用户自己来实现复杂的未知文件构建。

我们可以通过预先设置规则支持的文件后缀，来扩展其他文件的构建支持：

```lua
-- 定义一个markdown文件的构建规则
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build(function (target, sourcefile)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)

target("test")
    set_kind("binary")
    
    -- 使test目标支持markdown文件的构建规则
    add_rules("markdown")

    -- 添加markdown文件的构建
    add_files("src/*.md")
    add_files("src/*.markdown")
```

我们也可以指定某些零散的其他文件作为markdown规则来处理：

```lua
target("test")
    -- ...
    add_files("src/test/*.md.in", {rule = "markdown"})
```

注：通过`add_files("*.md", {rule = "markdown"})`方式指定的规则，优先级高于`add_rules("markdown")`设置的规则。

## IDE工程文件生成

xmake提供了丰富的插件扩展，其中vcproj, makefile等工程文件的生成就是作为插件提供，使用起来也非常简单:

```bash
$ xmake project -k vs2017 -m "debug,release"
```

即可生成带有debug, release两种编译模式的vc工程，同时支持x86和x64。

生成的工程目录结构会根据添加的所有源文件的目录结构，自动分析生成直观的文件树，方便vs去浏览查看。

makefile的生成如下:

```bash
$ xmake project -k makefile
```

后续会陆续更多其他工程文件，也欢迎大家来贡献哦。

## 灵活简单的插件扩展

上节的IDE工程文件生成，在xmake中就是作为插件来提供，这样更加方便扩展，也能让用户快速定制自己的插件，只需要定义个task插件任务就行了：


```lua
-- 定义一个名叫hello的插件任务
task("hello")

    -- 设置类型为插件
    set_category("plugin")

    -- 插件运行的入口
    on_run(function ()
        print("hello xmake!")
    end)

    -- 设置插件的命令行选项，这里没有任何参数选项，仅仅显示插件描述
    set_menu {
                -- usage
                usage = "xmake hello [options]"

                -- description
            ,   description = "Hello xmake!"

                -- options
            ,   options = {}
            } 
```

上述代码就是一个最为简单的`hello xmake!`插件，运行`$xmake hello`就可看到执行输出，`set_menu`用于配置插件命令行选项，这个不设置就是内部task，无法在命令行下调用。

更加详细的插件说明以及内置插件列表可参考文档：[插件手册](https://xmake.io/zh/)

## 查找依赖包

xmake参考了cmake对于`find_*`系列接口的设计，实现在项目中动态的查找和添加包依赖。

```lua
target("test")
    set_kind("binary")
    add_files("*.c")
    on_load(function (target)
        import("lib.detect.find_package")
        target:add(find_package("zlib"))
    end)
```

上述描述代码，通过`lib.detect.find_package`来查找包，如果找到zlib包，则将links, includedirs和linkdirs等信息添加到target中去。

## 交互式命令执行(REPL)

有时候在交互模式下，运行命令更加的方便测试和验证一些模块和api，也更加的灵活，不需要再去额外写一个脚本文件来加载，不过我一般用来做计算器用用（好吧。。）

```bash
# 不带任何参数执行，就可以进入
$ xmake lua
>

# 进行表达式计算
> 1 + 2
3

# 赋值和打印变量值
> a = 1
> a
1

# 多行输入和执行
> for _, v in pairs({1, 2, 3}) do
>> print(v)
>> end
1
2
3
```

我们也能够通过 import 来导入扩展模块：

```bash
> task = import("core.project.task")
> task.run("hello")
hello xmake!
```

## 编译环境支持

当前xmake的最新版本已经支持很多sdk环境的集成编译，例如: 

- [x] Visual Studio编译环境
- [x] mingw编译环境
- [x] cygwin编译环境
- [x] Android NDK编译环境
- [x] Xcode编译环境(支持iPhoneos/Macosx构建)
- [x] 系统gcc/clang编译环境
- [x] 交叉工具链编译环境
- [x] Cuda编译环境
- [ ] Qt编译环境(正在支持中)
- [ ] Windows WDK编译环境(正在支持中)

## FAQ

#### xmake有哪些用途?

1. 跨平台维护和编译C/C++项目
2. CI上部署自动化构建
3. 开源代码的快速移植
4. 临时的测试代码编写和快速运行
5. 与自己喜欢的编辑器集成，打造属于自己的C/C++开发环境
6. 与其他native语言的混合编译
7. 嵌入式开发下的交叉编译
8. 提升逼格

对于第三点的用途，我平常用的最多，因为我经常需要移植第三方的开源项目，它们使用的构建工具各不相同，有automake，cmake等等，其支持的构建平台力度也都不相同，经常会遇到需要的平台不支持的问题。

没办法，只好自己敲makefile来移植代码，然后适配自己需要支持的那些平台，还有交叉工具链，很蛋疼，自从写了xmake后，我现在平常移植代码方便了很多，效率提升非常明显。

#### 怎样看实时编译警告信息?

为了避免刷屏，在构建时候，默认是不实时输出警告信息的，如果想要看的话可以加上`-w`选项启用编译警告输出就行了。

```bash
$ xmake [-w|--warning] 
```

#### 怎样看详细的编译参数信息？

请加上 `-v` 或者 `--verbose` 选项重新执行xmake后，获取更加详细的输出信息

例如：

```sh
$ xmake [-v|--verbose] 
```

如果加上 `--backtrace` 选项也可以获取出错时的xmake的调试栈信息

```bash
$ xmake -v --backtrace
```

![xmake-verbose](/assets/img/posts/xmake/xmake-verbose.png)

## 快速安装

最后我们讲下，如何安装xmake，通常只需要一个脚本命令就能搞定。

#### 一键安装脚本

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh)
```

#### windows安装包

对于windows用户，提供了安装包来快速安装，可到[Github Releases](https://github.com/xmake-io/xmake/releases)上下载对应版本。

更加详细的安装过程，见相关文档: [安装说明](https://xmake.io/zh/)

## 结语

xmake还有很多非常有用的特性，例如：编译器特性检测、丰富的模块库、依赖包管理、自定义选项等等，一篇文章讲不完这么多，大家有兴趣的话，可以去[官方文档](https://xmake.io/zh/)里面看看，还有很多隐藏特性等着你哦。

