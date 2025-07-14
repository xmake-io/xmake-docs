---
title: Uses xmake to build c++20 modules
tags: [xmake, lua, c++20, modules-ts]
date: 2019-09-22
author: Ruki
---

c++ modules have been officially included in the c++20 draft, and msvc and clang have been basically implemented on [modules-ts](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019 /p1103r3.pdf) Support, as c++20's footsteps are getting closer and closer to us, xmake has also begun to support c++modules in advance.

At present xmake has fully supported the implementation of the modules-ts of msvc/clang. For gcc, since its cxx-modules branch is still under development, it has not officially entered the master. I have read the changelog inside, and the related flags are still in the process. Constantly changing, I feel that it has not stabilized, so I have not supported it yet.

For more information about xmake's progress on c++modules: [https://github.com/xmake-io/xmake/pull/569](https://github.com/xmake-io/xmake/pull/569)

* [Github Source](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io/)

### Hello Module

I will not talk about the introduction of c++modules. This is mainly about how to build a c++modules project under xmake. Let's look at a simple example:

```lua
target("hello")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

The above is a description of the xmake.lua that supports building c++modules files, where `hello.mpp` is the module file:

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

Main.cpp is the main program that uses the hello module:

```c
import hello;

int main() {
    hello::say("hello module!");
    return 0;
}
```

Next we execute xmake to build this program:

```console
ruki:hello ruki$ xmake
[0%]: ccache compiling.release src/hello.mpp
[50%]: ccache compiling.release src/main.cpp
[100%]: linking.release hello
build ok!
```








xmake will handle all the details logic internally, for developers, just add the module file `*.mpp` as the source file.

### Module Interface File

The above mentioned `*.mpp` is the module interface file name recommended by xmake. In fact, the default suffix names of the compiler files are not uniform. clang is `*.cppm`, while msvc is `*.ixx`, which is very unfriendly for writing a unified module project across compilers.
Therefore, reference is made to the recommendation method in [build2](https://build2.org/doc/modules-cppcon2017.pdf), and the unified `*.mpp` suffix is used to standardize the command of the module project interface under xmake.

Of course, this also supports xmake's recommended naming scheme. For suffixes such as `*.ixx` and `*.cppm`, xmake is also fully compatible and can be added directly to `add_files`.

### Compile parameter processing

#### clang

Let's first look at how to handle module construction under clang. We only need to add -v to execute xmake build, we can see all the details parameters:

```console
ruki:hello ruki$ xmake -v
[0%]: ccache compiling.release src/hello.mpp
/usr/local/bin/ccache /usr/bin/xcrun -sdk macosx clang -c -fmodules-ts --precompile -x c++-module -Qunused-arguments -arch x86_64 -fpascal-strings -fmessage-length=0 - Mmacosx-version-min=10.14 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk -o build/.objs/hello/macosx/x86_64/release/ Src/hello.mpp.o.pcm src/hello.mpp
/usr/local/bin/ccache /usr/bin/xcrun -sdk macosx clang -c -fmodules-ts -Qunused-arguments -arch x86_64 -fpascal-strings -fmessage-length=0 -mmacosx-version-min=10.14 - Isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk -o build/.objs/hello/macosx/x86_64/release/src/hello.mpp.o build /.objs/hello/macosx/x86_64/release/src/hello.mpp.o.pcm
[ 50%]: ccache compiling.release src/main.cpp
/usr/local/bin/ccache /usr/bin/xcrun -sdk macosx clang -c -fmodules-ts -fmodule-file=build/.objs/hello/macosx/x86_64/release/src/hello.mpp.o. Pcm -Qunused-arguments -arch x86_64 -fpascal-strings -fmessage-length=0 -mmacosx-version-min=10.14 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10 .14.sdk -o build/.objs/hello/macosx/x86_64/release/src/main.cpp.o src/main.cpp
[100%]: linking.release hello
"/usr/bin/xcrun -sdk macosx clang++" -o build/macosx/x86_64/release/hello build/.objs/hello/macosx/x86_64/release/src/hello.mpp.o build/.objs/hello/ Macosx/x86_64/release/src/main.cpp.o -arch x86_64 -mmacosx-version-min=10.14 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14 .sdk -stdlib=libc++ -lz
build ok!
```

We simplify it as follows:

```console
clang -c -fmodules-ts --precompile -x c++-module -o hello.mpp.o.pcm src/hello.mpp
clang -c -fmodules-ts -o hello.mpp.o hello.mpp.o.pcm
clang -c -fmodules-ts -fmodule-file=hello.mpp.o.pcm -o main.cpp.o src/main.cpp
clang++ -o hello hello.mpp.o main.cpp.o
```

`-fmodules-ts` is used to enable the c++-modules module standard, `--precompile` is used to precompile the module interface file. Since `*.mpp` is not the default module interface file name of the compiler, xmake is added. `-x c++-module` to force compilation as a module interface file.

Compile the `*.mpp` module interface file, and finally generate the `*.pcm` module file and finally tell the clang compiler by `-fmodule-file`. We define the hello module in main.cpp where we compile, avoid compiling main. A compiler error undefined by the hello module occurs at .cpp.

Finally, clang++ links all object files, including the object files generated by hello.mpp, into the target program.

#### msvc

For the processing under msvc, I will not elaborate, in fact, the whole logic is similar, I will directly paste the execution of the command process:

```console
Cl.exe -c /experimental:module /module:interface /module:output hello.mpp.obj.pcm /TP -nologo -Fohello.mpp.obj src\\hello.mpp
Cl.exe -c /experimental:module /module:reference hello.mpp.obj.pcm -nologo -Fomain.cpp.obj src\\main.cpp
Link.exe -nologo -dynamicbase -nxcompat -machine:x64 -out:hello.exe hello.mpp.obj main.cpp.obj
```

#### gcc

Originally, I wanted to add gcc to it. Later, I found that gcc support for c++modules is still maintained in an independent branch. I have not yet entered the master. If I want to use it, I have to check the cxx-modules branch code separately. To compile a gcc toolchains that supports c++modules.

And the use of flags inside is often changing, I feel that it has not been completely stabilized, so I am lazy to toss here, when to support the official version of gcc.

For more information on the implementation of gcc's modules-ts implementation, please refer to: https://gcc.gnu.org/wiki/cxx-modules

### Other examples

There are also a lot of engineering examples related to c++modules built into the xmake project. Interested students can refer to the following: [c++module examples](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules)
