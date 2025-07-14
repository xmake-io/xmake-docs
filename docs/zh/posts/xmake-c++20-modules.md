---
title: 使用xmake构建c++20 modules
tags: [xmake, lua, c++20, modules-ts]
date: 2019-09-22
author: Ruki
---

c++ modules已经正式纳入了c++20草案，msvc和clang也已经基本实现了对[modules-ts](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p1103r3.pdf)的支持，随着c++20的脚步离我们越来越近，xmake也开始对c++modules提前做好了支持。

目前xmake已经完全支持了msvc/clang的modules-ts构建实现，而对于gcc，由于它的cxx-modules分支还在开发中，还没有正式进入master，我看了下里面的changelog，相关flags还在不断变动，感觉还没稳定下来，因此这里暂时还没对其进行支持。

关于xmake对c++modules的相关进展见：[https://github.com/xmake-io/xmake/pull/569](https://github.com/xmake-io/xmake/pull/569)

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

### Hello Module

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

### 模块接口文件

上文所述的`*.mpp`是xmake推荐的模块接口文件命名，其实各家编译器对于模块文件的默认后缀名都是不统一的，clang下是`*.cppm`，而msvc下是`*.ixx`，这对于编写跨编译器统一的模块项目是非常不友好的，
因此这里参考了[build2](https://build2.org/doc/modules-cppcon2017.pdf)里面的推荐方式，采用统一的`*.mpp`后缀，来规范xmake下模块项目接口的命令。

当然，这也支持xmake推荐命名方式，而对于`*.ixx`, `*.cppm`等后缀名，xmake也是完全兼容支持的，也可以直接添加到`add_files`中去。

### 编译参数处理

#### clang

我们先来看下clang下，是如何处理modules构建的，我们只需要加上-v来执行xmake构建，就能看到所有的细节参数：

```console
ruki:hello ruki$ xmake -v
[  0%]: ccache compiling.release src/hello.mpp
/usr/local/bin/ccache /usr/bin/xcrun -sdk macosx clang -c -fmodules-ts --precompile -x c++-module -Qunused-arguments -arch x86_64 -fpascal-strings -fmessage-length=0 -mmacosx-version-min=10.14 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk -o build/.objs/hello/macosx/x86_64/release/src/hello.mpp.o.pcm src/hello.mpp
/usr/local/bin/ccache /usr/bin/xcrun -sdk macosx clang -c -fmodules-ts -Qunused-arguments -arch x86_64 -fpascal-strings -fmessage-length=0 -mmacosx-version-min=10.14 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk -o build/.objs/hello/macosx/x86_64/release/src/hello.mpp.o build/.objs/hello/macosx/x86_64/release/src/hello.mpp.o.pcm
[ 50%]: ccache compiling.release src/main.cpp
/usr/local/bin/ccache /usr/bin/xcrun -sdk macosx clang -c -fmodules-ts -fmodule-file=build/.objs/hello/macosx/x86_64/release/src/hello.mpp.o.pcm -Qunused-arguments -arch x86_64 -fpascal-strings -fmessage-length=0 -mmacosx-version-min=10.14 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk -o build/.objs/hello/macosx/x86_64/release/src/main.cpp.o src/main.cpp
[100%]: linking.release hello
"/usr/bin/xcrun -sdk macosx clang++" -o build/macosx/x86_64/release/hello build/.objs/hello/macosx/x86_64/release/src/hello.mpp.o build/.objs/hello/macosx/x86_64/release/src/main.cpp.o -arch x86_64 -mmacosx-version-min=10.14 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk -stdlib=libc++ -lz
build ok!
```

我们简化下就是：

```console
clang -c -fmodules-ts --precompile -x c++-module -o hello.mpp.o.pcm src/hello.mpp
clang -c -fmodules-ts -o hello.mpp.o hello.mpp.o.pcm
clang -c -fmodules-ts -fmodule-file=hello.mpp.o.pcm -o main.cpp.o src/main.cpp
clang++ -o hello hello.mpp.o main.cpp.o 
```

`-fmodules-ts`用于启用c++-modules模块标准，`--precompile`用于预编译模块接口文件，这里由于`*.mpp`不是编译器默认的模块接口文件名，因此xmake加上了`-x c++-module`来强制作为模块接口文件来编译。

编译`*.mpp`模块接口文件，最后会生成`*.pcm`模块文件最终通过`-fmodule-file`来告诉clang编译器，我们编译的main.cpp里面hello模块定义在哪里，避免编译main.cpp时候出现hello module未定义的编译器错误。

最终，clang++将所有对象文件，包括hello.mpp生成的对象文件，全部link进来生成目标程序。

#### msvc

对于msvc下的处理，我就不细说了，其实整个逻辑是差不多的，我就直接贴下执行的命令过程吧：

```console
cl.exe -c /experimental:module /module:interface /module:output hello.mpp.obj.pcm /TP -nologo -Fohello.mpp.obj src\\hello.mpp
cl.exe -c /experimental:module /module:reference hello.mpp.obj.pcm -nologo -Fomain.cpp.obj src\\main.cpp
link.exe -nologo -dynamicbase -nxcompat -machine:x64 -out:hello.exe hello.mpp.obj main.cpp.obj
```

#### gcc

原本是想把gcc也支持进来着的，后来发现gcc对于c++modules的支持，还在独立的分支维护，都还没有进入master，如果要使用，还得单独为此checkout cxx-modules分支代码来编译一份支持c++modules的gcc toolchains才行。

而且里面的flags使用经常在变动，感觉还没有完全稳定下来，因此这里我懒的去折腾了，等什么时候gcc正式版支持了再说吧。

如果要进一步了解gcc的modules-ts实现进展，请参考：https://gcc.gnu.org/wiki/cxx-modules

### 其他例子

xmake项目下还内置了不少跟c++modules相关的工程examples，有兴趣的同学可以参考下：[c++module examples](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules)