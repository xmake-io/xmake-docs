---
title: xmake v2.2.9 发布, 新增c++20 modules的实验性支持
tags: [xmake, lua, C/C++, c++20, ts-modules]
date: 2019-12-21
author: Ruki
---

这个版本没啥太大新特性，主要对c++20 modules进行了实验性支持，目前支持clang/msvc编译器，除此之外改进了不少使用体验，并且提高了一些稳定性。

另外，这个版本新增了socket.io支持以及对应协程io的调度支持，为下个版本的远程编译，以及后续的分布式编译做准备。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

## 新特性介绍

### c++20 modules

c++ modules已经正式纳入了c++20草案，msvc和clang也已经基本实现了对[modules-ts](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p1103r3.pdf)的支持，随着c++20的脚步离我们越来越近，xmake也开始对c++modules提前做好了支持。

目前xmake已经完全支持了msvc/clang的modules-ts构建实现，而对于gcc，由于它的cxx-modules分支还在开发中，还没有正式进入master，我看了下里面的changelog，相关flags还在不断变动，感觉还没稳定下来，因此这里暂时还没对其进行支持。

关于xmake对c++modules的相关进展见：[https://github.com/xmake-io/xmake/pull/569](https://github.com/xmake-io/xmake/pull/569)

#### Hello Module

关于c++modules的相关介绍我就不多说了，这边主要还是介绍下xmake下如何去构建c++modules项目，我们先来看一个简单的例子：

```lua
target("hello")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp") 
```

上面是一个支持构建c++modules文件的xmake.lua描述，其中`hello.mpp`就是模块文件：

```c
#include <cstdio>
export module hello;
using namespace std;

export namespace hello {
    void say(const char* str) {
        printf("%s\n", str);
    }
}
```

而main.cpp是使用了hello模块的主程序：

```c
import hello;

int main() {
    hello::say("hello module!");
    return 0;
}
```

接下来我们执行xmake来构建下这个程序吧：

```console
ruki:hello ruki$ xmake 
[  0%]: ccache compiling.release src/hello.mpp
[ 50%]: ccache compiling.release src/main.cpp
[100%]: linking.release hello
build ok!
```








是不是非常简单，xmake内部会去处理所有细节逻辑，对于开发者而言，仅仅是添加了模块文件`*.mpp`作为源文件而已。

#### 模块接口文件

上文所述的`*.mpp`是xmake推荐的模块接口文件命名，其实各家编译器对于模块文件的默认后缀名都是不统一的，clang下是`*.cppm`，而msvc下是`*.ixx`，这对于编写跨编译器统一的模块项目是非常不友好的，
因此这里参考了[build2](https://build2.org/doc/modules-cppcon2017.pdf)里面的推荐方式，采用统一的`*.mpp`后缀，来规范xmake下模块项目接口的命令。

当然，这也支持xmake推荐命名方式，而对于`*.ixx`, `*.cppm`等后缀名，xmake也是完全兼容支持的，也可以直接添加到`add_files`中去。

#### 其他例子

xmake项目下还内置了不少跟c++modules相关的工程examples，有兴趣的同学可以参考下：[c++module examples](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules)

### set_toolchain接口改动

set_toolchain这个接口主要用于针对target设置不同的编译工具链，2.2.9之前的版本其实有`add_tools`和`set_tools`两个接口来处理相同的事情，不过这两接口命名和使用上和规范不是很一致，因此做了些调整改动，用这个set_toolchain新接口更好的设置工具链。

对于`add_files("*.c")`添加的源码文件，默认都是会调用系统最匹配的编译工具去编译，或者通过`xmake f --cc=clang`命令手动去修改，不过这些都是全局影响所有target目标的。

如果有些特殊需求，需要对当前工程下某个特定的target目标单独指定不同的编译器、链接器或者特定版本的编译器，这个时候此接口就可以排上用途了，例如：

```lua
target("test1")
    add_files("*.c")

target("test2")
    add_files("*.c")
    set_toolchain("cc", "$(projectdir)/tools/bin/clang-5.0")
```

上述描述仅对test2目标的编译器进行特殊设置，使用特定的clang-5.0编译器来编译test2，而test1还是使用默认设置。

对于一些编译器文件名不规则，导致xmake无法正常识别处理为已知的编译器名的情况下，我们也可以加一个工具名提示，例如：

```lua
set_toolchain("cc", "gcc@$(projectdir)/tools/bin/mipscc.exe")
```

上述描述设置mipscc.exe作为c编译器，并且提示xmake作为gcc的传参处理方式进行编译。

### socket io

这块的接口初步已经实现，支持lua协程的io调度，实现高并发的io读写（后期还会同时支持进程、pipe的调度支持），目前主要用于xmake自身的使用，用于为后续的远程编译和分布式编译做准备，所以暂时不开放用户自己使用，不过等后续完善后，会开放出来，用户也可以在自己的插件里面通过socket io做一些服务程序。

不过可能用户用到的场景不是很多，毕竟xmake只是个构建工具，很少会让用户自己去做io通信。


## 更新内容

### 新特性

* [#569](https://github.com/xmake-io/xmake/pull/569): 增加对c++模块的实验性支持
* 添加`xmake project -k xmakefile`生成器
* [620](https://github.com/xmake-io/xmake/issues/620): 添加全局`~/.xmakerc.lua`配置文件，对所有本地工程生效.
* [593](https://github.com/xmake-io/xmake/pull/593): 添加`core.base.socket`模块，为下一步远程编译和分布式编译做准备。

### 改进

* [#563](https://github.com/xmake-io/xmake/pull/563): 重构构建逻辑，将特定语言的构建抽离到独立的rules中去 
* [#570](https://github.com/xmake-io/xmake/issues/570): 改进Qt构建，将`qt.application`拆分成`qt.widgetapp`和`qt.quickapp`两个构建规则
* [#576](https://github.com/xmake-io/xmake/issues/576): 使用`set_toolchain`替代`add_tools`和`set_tools`，解决老接口使用歧义，提供更加易理解的设置方式
* 改进`xmake create`创建模板工程
* [#589](https://github.com/xmake-io/xmake/issues/589): 改进默认的构建任务数，充分利用cpu core来提速整体编译速度
* [#598](https://github.com/xmake-io/xmake/issues/598): 改进`find_package`支持在macOS上对.tbd系统库文件的查找
* [#615](https://github.com/xmake-io/xmake/issues/615): 支持安装和使用其他arch和ios的conan包
* [#629](https://github.com/xmake-io/xmake/issues/629): 改进hash.uuid并且实现uuid v4
* [#639](https://github.com/xmake-io/xmake/issues/639): 改进参数解析器支持`-jN`风格传参

### Bugs修复

* [#567](https://github.com/xmake-io/xmake/issues/567): 修复序列化对象时候出现的内存溢出问题 
* [#566](https://github.com/xmake-io/xmake/issues/566): 修复安装远程依赖的链接顺序问题
* [#565](https://github.com/xmake-io/xmake/issues/565): 修复vcpkg包的运行PATH设置问题
* [#597](https://github.com/xmake-io/xmake/issues/597): 修复xmake require安装包时间过长问题
* [#634](https://github.com/xmake-io/xmake/issues/634): 修复mode.coverage构建规则，并且改进flags检测
