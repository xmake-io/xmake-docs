---
title: How to build a simple project quickly
tags: [xmake, build, project, hello]
date: 2016-07-16
author: Ruki
outline: deep
---

We create an empty console project first:

```bash
$ xmake create -P ./hello

create hello ...
create ok!👌
```

And xmake will generate some files:

```bash
$ cd ./hello
$ tree .

.
├── src
│   └── main.c
└── xmake.lua
```

It is a simple console program only for printing `hello xmake!`

```bash
$ cat ./src/main.c 

#include <stdio.h>
int main(int argc, char** argv)
{
    printf("hello xmake!\n");
    return 0;
}
```

The content of `xmake.lua` is very simple:

```lua
$ cat xmake.lua 

target("hello")
    set_kind("binary")
    add_files("src/*.c") 

```



We build it now.

```bash
$ xmake

checking for the architecture ... x86_64
checking for the Xcode SDK version for macosx ... 10.11
checking for the target minimal version ... 10.11
checking for the c compiler (cc) ... xcrun -sdk macosx clang
checking for the c++ compiler (cxx) ... xcrun -sdk macosx clang
checking for the objc compiler (mm) ... xcrun -sdk macosx clang
checking for the objc++ compiler (mxx) ... xcrun -sdk macosx clang++
checking for the assember (as) ... xcrun -sdk macosx clang
checking for the linker (ld) ... xcrun -sdk macosx clang++
checking for the static library archiver (ar) ... xcrun -sdk macosx ar
checking for the static library extractor (ex) ... xcrun -sdk macosx ar
checking for the shared library linker (sh) ... xcrun -sdk macosx clang++
checking for the swift compiler (sc) ... xcrun -sdk macosx swiftc
checking for the debugger (dd) ... xcrun -sdk macosx lldb
configure
{
    ex = "xcrun -sdk macosx ar"
,   ccache = "ccache"
,   plat = "macosx"
,   ar = "xcrun -sdk macosx ar"
,   buildir = "build"
,   as = "xcrun -sdk macosx clang"
,   sh = "xcrun -sdk macosx clang++"
,   arch = "x86_64"
,   mxx = "xcrun -sdk macosx clang++"
,   xcode_dir = "/Applications/Xcode.app"
,   target_minver = "10.11"
,   sc = "xcrun -sdk macosx swiftc"
,   mode = "release"
,   make = "make"
,   cc = "xcrun -sdk macosx clang"
,   host = "macosx"
,   dd = "xcrun -sdk macosx lldb"
,   kind = "static"
,   ld = "xcrun -sdk macosx clang++"
,   xcode_sdkver = "10.11"
,   cxx = "xcrun -sdk macosx clang"
,   mm = "xcrun -sdk macosx clang"
}
configure ok!
clean ok!
[00%]: ccache compiling.release src/main.c
[100%]: linking.release hello
build ok!👌
```

And we run this program:

```bash
$ xmake run hello

hello world!
```

Or we can debug it.

```bash
$ xmake run -d hello 

[lldb]$target create "build/hello"
Current executable set to 'build/hello' (x86_64).
[lldb]$b main
Breakpoint 1: where = hello`main, address = 0x0000000100000f50
[lldb]$r
Process 7509 launched: '/private/tmp/hello/build/hello' (x86_64)
Process 7509 stopped
* thread #1: tid = 0x435a2, 0x0000000100000f50 hello`main, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x0000000100000f50 hello`main
hello`main:
->  0x100000f50 <+0>:  pushq  %rbp
    0x100000f51 <+1>:  movq   %rsp, %rbp
    0x100000f54 <+4>:  leaq   0x2b(%rip), %rdi          ; "hello world!"
    0x100000f5b <+11>: callq  0x100000f64               ; symbol stub for: puts
[lldb]$
```

Next we build it for android.

```bash
$ xmake f -p android --ndk=~/files/android-ndk-r10e/

checking for the architecture ... armv7-a
checking for the SDK version of NDK ... android-21
checking for the c compiler (cc) ... arm-linux-androideabi-gcc
checking for the c++ compiler (cxx) ... arm-linux-androideabi-g++
checking for the assember (as) ... arm-linux-androideabi-gcc
checking for the linker (ld) ... arm-linux-androideabi-g++
checking for the static library archiver (ar) ... arm-linux-androideabi-ar
checking for the static library extractor (ex) ... arm-linux-androideabi-ar
checking for the shared library linker (sh) ... arm-linux-androideabi-g++
configure
{
    ex = "/Users/ruki/files/android-ndk-r10e/toolchains/arm-linux-androideabi-4.9/prebuilt/darwin-x86_64/bin/arm-linux-androideabi-ar"
,   ccache = "ccache"
,   ndk = "~/files/android-ndk-r10e/"
,   sc = "xcrun -sdk macosx swiftc"
,   ar = "/Users/ruki/files/android-ndk-r10e/toolchains/arm-linux-androideabi-4.9/prebuilt/darwin-x86_64/bin/arm-linux-androideabi-ar"
,   ld = "/Users/ruki/files/android-ndk-r10e/toolchains/arm-linux-androideabi-4.9/prebuilt/darwin-x86_64/bin/arm-linux-androideabi-g++"
,   buildir = "build"
,   host = "macosx"
,   as = "/Users/ruki/files/android-ndk-r10e/toolchains/arm-linux-androideabi-4.9/prebuilt/darwin-x86_64/bin/arm-linux-androideabi-gcc"
,   toolchains = "/Users/ruki/files/android-ndk-r10e/toolchains/arm-linux-androideabi-4.9/prebuilt/darwin-x86_64/bin"
,   arch = "armv7-a"
,   mxx = "xcrun -sdk macosx clang++"
,   xcode_dir = "/Applications/Xcode.app"
,   target_minver = "10.11"
,   ndk_sdkver = 21
,   mode = "release"
,   cc = "/Users/ruki/files/android-ndk-r10e/toolchains/arm-linux-androideabi-4.9/prebuilt/darwin-x86_64/bin/arm-linux-androideabi-gcc"
,   cxx = "/Users/ruki/files/android-ndk-r10e/toolchains/arm-linux-androideabi-4.9/prebuilt/darwin-x86_64/bin/arm-linux-androideabi-g++"
,   make = "make"
,   dd = "xcrun -sdk macosx lldb"
,   kind = "static"
,   sh = "/Users/ruki/files/android-ndk-r10e/toolchains/arm-linux-androideabi-4.9/prebuilt/darwin-x86_64/bin/arm-linux-androideabi-g++"
,   xcode_sdkver = "10.11"
,   plat = "android"
,   mm = "xcrun -sdk macosx clang"
}
configure ok!

$ xmake

clean ok!
[00%]: ccache compiling.release src/main.c
[100%]: linking.release hello
build ok!👌
```

Or we build it for iphoneos.

```bash
$ xmake f -p iphoneos

checking for the architecture ... armv7
checking for the Xcode SDK version for iphoneos ... 9.2
checking for the target minimal version ... 9.2
checking for the c compiler (cc) ... xcrun -sdk iphoneos clang
checking for the c++ compiler (cxx) ... xcrun -sdk iphoneos clang
checking for the objc compiler (mm) ... xcrun -sdk iphoneos clang
checking for the objc++ compiler (mxx) ... xcrun -sdk iphoneos clang++
checking for the assember (as) ... gas-preprocessor.pl xcrun -sdk iphoneos clang
checking for the linker (ld) ... xcrun -sdk iphoneos clang++
checking for the static library archiver (ar) ... xcrun -sdk iphoneos ar
checking for the static library extractor (ex) ... xcrun -sdk iphoneos ar
checking for the shared library linker (sh) ... xcrun -sdk iphoneos clang++
checking for the swift compiler (sc) ... xcrun -sdk iphoneos swiftc
configure
{
    ex = "xcrun -sdk iphoneos ar"
,   ccache = "ccache"
,   ndk = "~/files/android-ndk-r10e/"
,   sc = "xcrun -sdk iphoneos swiftc"
,   ar = "xcrun -sdk iphoneos ar"
,   sh = "xcrun -sdk iphoneos clang++"
,   buildir = "build"
,   xcode_dir = "/Applications/Xcode.app"
,   as = "/usr/local/share/xmake/tools/utils/gas-preprocessor.pl xcrun -sdk iphoneos clang"
,   toolchains = "/Users/ruki/files/android-ndk-r10e/toolchains/arm-linux-androideabi-4.9/prebuilt/darwin-x86_64/bin"
,   arch = "armv7"
,   mxx = "xcrun -sdk iphoneos clang++"
,   ndk_sdkver = 21
,   target_minver = "9.2"
,   cc = "xcrun -sdk iphoneos clang"
,   mode = "release"
,   host = "macosx"
,   cxx = "xcrun -sdk iphoneos clang"
,   make = "make"
,   dd = "xcrun -sdk macosx lldb"
,   kind = "static"
,   ld = "xcrun -sdk iphoneos clang++"
,   xcode_sdkver = "9.2"
,   plat = "iphoneos"
,   mm = "xcrun -sdk iphoneos clang"
}
configure ok!

$ xmake
 
[00%]: ccache compiling.release src/main.c
[100%]: linking.release hello
build ok!👌
```

Last, we attempt to build it for mingw.

```bash
$ xmake f -p mingw --sdk=/usr/local/i386-mingw32-4.3.0/

checking for the architecture ... i386
checking for the c compiler (cc) ... i386-mingw32-gcc
checking for the c++ compiler (cxx) ... i386-mingw32-g++
checking for the assember (as) ... i386-mingw32-gcc
checking for the linker (ld) ... i386-mingw32-g++
checking for the static library archiver (ar) ... i386-mingw32-ar
checking for the static library extractor (ex) ... i386-mingw32-ar
checking for the shared library linker (sh) ... i386-mingw32-g++
checking for the swift compiler (sc) ... no
configure
{
    ex = "/usr/local/i386-mingw32-4.3.0/bin/i386-mingw32-ar"
,   ccache = "ccache"
,   ndk = "~/files/android-ndk-r10e/"
,   sc = "xcrun -sdk iphoneos swiftc"
,   sdk = "/usr/local/i386-mingw32-4.3.0/"
,   cc = "/usr/local/i386-mingw32-4.3.0/bin/i386-mingw32-gcc"
,   ndk_sdkver = 21
,   buildir = "build"
,   plat = "mingw"
,   as = "/usr/local/i386-mingw32-4.3.0/bin/i386-mingw32-gcc"
,   toolchains = "/Users/ruki/files/android-ndk-r10e/toolchains/arm-linux-androideabi-4.9/prebuilt/darwin-x86_64/bin"
,   arch = "i386"
,   mxx = "xcrun -sdk iphoneos clang++"
,   xcode_dir = "/Applications/Xcode.app"
,   target_minver = "9.2"
,   sh = "/usr/local/i386-mingw32-4.3.0/bin/i386-mingw32-g++"
,   mode = "release"
,   host = "macosx"
,   cxx = "/usr/local/i386-mingw32-4.3.0/bin/i386-mingw32-g++"
,   make = "make"
,   dd = "xcrun -sdk macosx lldb"
,   kind = "static"
,   ar = "/usr/local/i386-mingw32-4.3.0/bin/i386-mingw32-ar"
,   xcode_sdkver = "9.2"
,   ld = "/usr/local/i386-mingw32-4.3.0/bin/i386-mingw32-g++"
,   mm = "xcrun -sdk iphoneos clang"
}
configure ok!

$ xmake

[00%]: ccache compiling.release src/main.c
[100%]: linking.release hello.exe
build ok!👌
``` 

xmake can build project directly on cmd if your system is windows and it will check your vs tools automatically.

.e.g

```bash
$ xmake

checking for the architecture ... x86
checking for the Microsoft Visual Studio version ... 2008
checking for the c compiler (cc) ... cl.exe
checking for the c++ compiler (cxx) ... cl.exe
checking for the assember (as) ... ml.exe
checking for the linker (ld) ... link.exe
checking for the static library archiver (ar) ... link.exe -lib
checking for the shared library linker (sh) ... link.exe -dll
checking for the static library extractor (ex) ... lib.exe
configure
{
    ex = "lib.exe"
,   sh = "link.exe -dll"
,   host = "windows"
,   ar = "link.exe -lib"
,   as = "ml.exe"
,   plat = "windows"
,   buildir = "build"
,   arch = "x86"
,   cc = "cl.exe"
,   cxx = "cl.exe"
,   mode = "release"
,   clean = true
,   kind = "static"
,   ld = "link.exe"
,   vs = "2008"
}
configure ok!
[00%]: compiling.release src\main.c
[100%]: linking.release hello.exe
build ok!
```