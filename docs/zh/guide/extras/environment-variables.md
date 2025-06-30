# 环境变量

我们可以执行下面的命令，获取所有 xmake 用到的环境变量，以及当前被设置的值。

```bash
$ xmake show -l envs
XMAKE_RAMDIR            Set the ramdisk directory.
                        <empty>
XMAKE_GLOBALDIR         Set the global config directory of xmake.
                        /Users/ruki
XMAKE_ROOT              Allow xmake to run under root.
                        <empty>
XMAKE_COLORTERM         Set the color terminal environment.
                        <empty>
XMAKE_PKG_INSTALLDIR    Set the install directory of packages.
                        <empty>
XMAKE_TMPDIR            Set the temporary directory.
                        /var/folders/vn/ppcrrcm911v8b4510klg9xw80000gn/T/.xmake501/211104
XMAKE_PKG_CACHEDIR      Set the cache directory of packages.
                        <empty>
XMAKE_PROGRAM_DIR       Set the program scripts directory of xmake.
                        /Users/ruki/.local/share/xmake
XMAKE_PROFILE           Start profiler, e.g. perf, trace.
                        <empty>
XMAKE_RCFILES           Set the runtime configuration files.

XMAKE_CONFIGDIR         Set the local config directory of project.
                        /Users/ruki/projects/personal/xmake-docs/.xmake/macosx/x86_64
XMAKE_LOGFILE           Set the log output file path.
                        <empty>
```

## XMAKE_RAMDIR

- 设置 ramdisk 目录路径

ramdisk 目录是内存文件系统的目录位置，通常 `os.tmpdir()` 接口会用到，xmake 内部使用的临时文件，如果用户设置 ramdisk 路径，则会优先存储在这个上面，提升整体编译速度。

## XMAKE_TMPDIR

- 设置用户的临时目录

默认 xmake 会使用 `/tmp/.xmake` 和 `%TEMP%/.xmake`，当然用户可以通过这个变量去修改默认路径。

## XMAKE_CONFIGDIR

- 设置本地工程配置目录

每个项目的本地编译配置，默认会存储在当前项目根目录的 `.xmake` 路径下，然后根据不同的平台，架构区分，例如：

```bash
.xmake/macosx/x86_64
```

我们如果不想存储在项目根目录，也可以自己设置到其他路径，比如 build 目录下等等。

## XMAKE_GLOBALDIR

- 设置全局配置文件根目录

xmake将在该目录下创建 `.xmake`，作为 `xmake g/global` 全局配置的存储目录，还有安装包，缓存等其他全局文件，默认都会存储在这个目录下。

默认路径为：`~`。

## XMAKE_ROOT

- 允许用户在 root 模式下运行

通常 xmake 是默认禁止在 root 下运行，这非常不安全。但是如果用户非要在 root 下运行，也可以设置这个变量，强制开启。

```bash
export XMAKE_ROOT=y
```

## XMAKE_COLORTERM

- 设置 Terminal 的色彩输出

目前可以设置这几个值：

| 值        | 描述           |
| ---       | ---            |
| nocolor   | 禁用彩色输出   |
| color8    | 8 色输出支持   |
| color256  | 256 色输出支持 |
| truecolor | 真彩色输出支持 |

通常，用户不需要设置它们，xmake 会自动探测用户终端支持的色彩范围，如果用户不想输出色彩，可以设置 nocolor 来全局禁用。

或者用 `xmake g --theme=plain` 也可以全局禁用。

## XMAKE_PKG_INSTALLDIR

- 设置依赖包的安装根目录

xmake 的远程包安装的全局目录默认是 `$XMAKE_GLOBALDIR/.xmake/packages`，但是用户也可以设置这个变量，去单独修改它。

我们也可以使用 `xmake g --pkg_installdir=/xxx` 去设置它，效果是一样的。但环境变量的优先级高于此配置。

## XMAKE_PKG_CACHEDIR

- 设置依赖包的缓存目录

默认路径在 `$XMAKE_GLOBALDIR/.xmake/cache` 目录，存储包安装过程中的各种缓存文件，比较占存储空间，用户也可以单独设置它。

当然，xmake 在每个月都会自动清理上个月的所有缓存文件。

## XMAKE_PROGRAM_DIR

- 设置 xmake 的脚本目录

xmake 的所有 lua 脚本随安装程序一起安装，默认都在安装目录下，但是如果想要切到自己下载的脚本目录下，方便本地修改调试，可以设置此变量。

如果要查看当前 xmake 在使用的脚本目录，可以执行：

```bash
$ xmake l os.programdir
/Users/ruki/.local/share/xmake
```

## XMAKE_PROFILE

- 开启性能分析

这仅仅对 xmake 的开发者开放，用于分析 xmake 运行过程中的耗时情况，追踪调用过程。

### 分析函数调用耗时

```bash
$ XMAKE_PROFILE=perf:call xmake
[ 25%]: cache compiling.release src/main.cpp
[ 50%]: linking.release test
[100%]: build ok!
 0.238,  97.93%,       1, runloop                       : @programdir/core/base/scheduler.lua: 805
 0.180,  74.04%,      25, _resume                       : [C]: -1
 0.015,   6.34%,      50, _co_groups_resume             : @programdir/core/base/scheduler.lua: 299
 0.011,   4.37%,      48, wait                          : @programdir/core/base/poller.lua: 111
 0.004,   1.70%,      62, status                        : @programdir/core/base/scheduler.lua: 71
 0.004,   1.53%,      38, is_dead                       : @programdir/core/base/scheduler.lua: 76
 0.003,   1.44%,      50, next                          : @programdir/core/base/timer.lua: 74
 0.003,   1.33%,      48, delay                         : @programdir/core/base/timer.lua: 60
 0.002,   1.02%,      24, is_suspended                  : @programdir/core/base/scheduler.lua: 86
```

### 分析进程耗时

可以用于分析每个文件的编译耗时，以及一些运行瓶颈。

```bash
$ XMAKE_PROFILE=perf:process xmake -r
[  7%]: compiling.release src/header.h
[ 23%]: compiling.release src/test.cpp
[ 30%]: compiling.release src/test8.cpp
[ 38%]: compiling.release src/test4.cpp
[ 46%]: compiling.release src/test5.cpp
[ 53%]: compiling.release src/test7.cpp
[ 61%]: compiling.release src/test6.cpp
[ 69%]: compiling.release src/test2.cpp
[ 76%]: compiling.release src/main.cpp
[ 84%]: compiling.release test3.cpp
[ 84%]: compiling.release src/test.c
[ 92%]: linking.release main
[100%]: build ok, spent 2.754s
1411.000,  22.19%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -std=c++11 -DNDEBUG -MMD -MF /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_37317EEDB62F4F3088AF6A2E2A649460 -fdiagnostics-color=always -x c++-header -o build/.objs/main/macosx/x86_64/release/src/cxx/header.h.pch src/header.h
508.000,   7.99%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -std=c++11 -include src/header.h -include-pch build/.objs/main/macosx/x86_64/release/src/cxx/header.h.pch -DNDEBUG -MMD -MF /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_1ABAE1FAD68D45008DC76A3A00697820 -fdiagnostics-color=always -o build/.objs/main/macosx/x86_64/release/src/main.cpp.o src/main.cpp
473.000,   7.44%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -std=c++11 -include src/header.h -include-pch build/.objs/main/macosx/x86_64/release/src/cxx/header.h.pch -DNDEBUG -MMD -MF /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_1C0BE5280C6F4E208F919577A48AAA40 -fdiagnostics-color=always -o build/.objs/main/macosx/x86_64/release/test3.cpp.o test3.cpp
451.000,   7.09%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -std=c++11 -include src/header.h -include-pch build/.objs/main/macosx/x86_64/release/src/cxx/header.h.pch -DNDEBUG -MMD -MF /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_877D3D9B6BBA4D308BFB5E4EBD751340 -fdiagnostics-color=always -o build/.objs/main/macosx/x86_64/release/src/test6.cpp.o src/test6.cpp
404.000,   6.35%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -std=c++11 -include src/header.h -include-pch build/.objs/main/macosx/x86_64/release/src/cxx/header.h.pch -DNDEBUG -MMD -MF /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_C9968E2873B648208A8C3F2BA7573640 -fdiagnostics-color=always -o build/.objs/main/macosx/x86_64/release/src/test7.cpp.o src/test7.cpp
402.000,   6.32%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -std=c++11 -include src/header.h -include-pch build/.objs/main/macosx/x86_64/release/src/cxx/header.h.pch -DNDEBUG -MMD -MF /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_7F6DFA37FF494D208EADF9737484EC40 -fdiagnostics-color=always -o build/.objs/main/macosx/x86_64/release/src/test2.cpp.o src/test2.cpp
383.000,   6.02%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -std=c++11 -include src/header.h -include-pch build/.objs/main/macosx/x86_64/release/src/cxx/header.h.pch -DNDEBUG -MMD -MF /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_63C9E23AE7E047308F762C7C02A56B50 -fdiagnostics-color=always -o build/.objs/main/macosx/x86_64/release/src/test4.cpp.o src/test4.cpp
374.000,   5.88%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -std=c++11 -include src/header.h -include-pch build/.objs/main/macosx/x86_64/release/src/cxx/header.h.pch -DNDEBUG -MMD -MF /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_C3A0EF96A7C14D00879BFAEFD26E9D20 -fdiagnostics-color=always -o build/.objs/main/macosx/x86_64/release/src/test8.cpp.o src/test8.cpp
368.000,   5.79%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -std=c++11 -include src/header.h -include-pch build/.objs/main/macosx/x86_64/release/src/cxx/header.h.pch -DNDEBUG -MMD -MF /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_BADB46AF75CB4610857EF5083BD54D30 -fdiagnostics-color=always -o build/.objs/main/macosx/x86_64/release/src/test.cpp.o src/test.cpp
363.000,   5.71%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -std=c++11 -include src/header.h -include-pch build/.objs/main/macosx/x86_64/release/src/cxx/header.h.pch -DNDEBUG -MMD -MF /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_0247BDB87DD14500816471184D4E8140 -fdiagnostics-color=always -o build/.objs/main/macosx/x86_64/release/src/test5.cpp.o src/test5.cpp
156.000,   2.45%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -fPIC -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -S -o /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_F0FF8220B33B46208D39A98937D55E50 /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_F3443E45635A466AA3BEAE9DE99B4339.c
133.000,   2.09%,       3, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang --version
107.000,   1.68%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -O3 -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -S -o /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_C8A96266E0034C20898C147FC52F3A40 /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_F3443E45635A466AA3BEAE9DE99B4339.c
105.000,   1.65%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -fdiagnostics-color=always -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -S -o /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_48A2FA7BE7AB44008B60558E412A9D30 /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_F3443E45635A466AA3BEAE9DE99B4339.c
105.000,   1.65%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang++ -fPIC -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -lz -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -lz -o /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_F510FB15C9A647108111A7010EFED240 /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_F3443E45635A466AA3BEAE9DE99B4339.cpp
91.000,   1.43%,       3, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang++ --version
74.000,   1.16%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -fvisibility=hidden -O3 -DNDEBUG -MMD -MF /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_BF6B4B6DACB843008E822CEFDC711230 -fdiagnostics-color=always -o build/.objs/main/macosx/x86_64/release/src/test.c.o src/test.c
73.000,   1.15%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang++ -o build/macosx/x86_64/release/main build/.objs/main/macosx/x86_64/release/src/test.cpp.o build/.objs/main/macosx/x86_64/release/src/test8.cpp.o build/.objs/main/macosx/x86_64/release/src/test4.cpp.o build/.objs/main/macosx/x86_64/release/src/test5.cpp.o build/.objs/main/macosx/x86_64/release/src/test7.cpp.o build/.objs/main/macosx/x86_64/release/src/test6.cpp.o build/.objs/main/macosx/x86_64/release/src/test2.cpp.o build/.objs/main/macosx/x86_64/release/src/main.cpp.o build/.objs/main/macosx/x86_64/release/test3.cpp.o build/.objs/main/macosx/x86_64/release/src/test.c.o -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -lz -Wl,-x -Wl,-dead_strip
70.000,   1.10%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -fPIC -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -S -o /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_6D0B6327841A47208939EEF194F38B50 /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_F3443E45635A466AA3BEAE9DE99B4339.cpp
68.000,   1.07%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -O3 -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -S -o /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_8AB279F8450D4D108E92951CC9C1C650 /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_F3443E45635A466AA3BEAE9DE99B4339.cpp
65.000,   1.02%,       1, /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -fdiagnostics-color=always -Qunused-arguments -target x86_64-apple-macos15.1 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.1.sdk -S -o /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_D25F0DB04D6D430084C098F1E1F76C00 /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/241220/_F3443E45635A466AA3BEAE9DE99B4339.cpp
```

### 追踪 xmake 的运行过程

```bash
$ XMAKE_PROFILE=trace xmake
func                          : @programdir/core/base/scheduler.lua: 457
is_suspended                  : @programdir/core/base/scheduler.lua: 86
status                        : @programdir/core/base/scheduler.lua: 71
thread                        : @programdir/core/base/scheduler.lua: 66
thread                        : @programdir/core/base/scheduler.lua: 66
length                        : @programdir/core/base/heap.lua: 120
```

### 分析运行卡死问题

可以用于获取 xmake 运行卡死时的栈。启用此特性后，通过 Ctrl+C 中断后就能获取栈。

```bash
$ XMAKE_PROFILE=stuck xmake l test.lua
<Ctrl+C>
stack traceback:
        [C]: in function 'base/io.file_read'
        @programdir/core/base/io.lua:177: in method '_read'
        @programdir/core/sandbox/modules/io.lua:90: in function <@programdir/core/sandbox/module
s/io.lua:89>
        (...tail calls...)
        /Users/ruki/share/test.lua:2: in function </Users/ruki/share/test.lua:1>
        (...tail calls...)
        @programdir/plugins/lua/main.lua:123: in function <@programdir/plugins/lua/main.lua:79>
        (...tail calls...)
        [C]: in function 'xpcall'
        @programdir/core/base/utils.lua:280: in function 'sandbox/modules/utils.trycall'
        (...tail calls...)
        @programdir/core/base/task.lua:519: in function 'base/task.run'
        @programdir/core/main.lua:278: in upvalue 'cotask'
        @programdir/core/base/scheduler.lua:371: in function <@programdir/core/base/scheduler.lu
a:368>
```

## XMAKE_RCFILES

- 设置全局配置文件

我们可以设置一些 xmakerc.lua 全局配置文件，在用户编译项目的时候，全局引入它们，比如全局引入一些用户自定义的帮助脚本，工具链什么的。

```bash
$ export XMAKE_RCFILES=xmakerc.lua
$ xmake
```

如果不设置此环境变量，用户可以在`/etc/xmakerc.lua`、`~/xmakerc.lua`与`$XMAKE_GLOBALDIR/.xmake/xmakerc.lua`设置全局配置文件，搜索优先级从高至低排列。

## XMAKE_LOGFILE

- 设置日志文件路径

默认 xmake 会回显输出到终端，我们在可以通过设置这个路径，开启日志自动存储到指定文件，但它不会影响终端的正常回显输出。

## XMAKE_MAIN_REPO

- 设置官方包主仓库地址

xmake 默认内置了三个主仓库地址，它们是完全相同的，xmake 会根据当前网络状态选择最优的地址来使用。

```
https://github.com/xmake-io/xmake-repo.git
https://gitlab.com/tboox/xmake-repo.git
https://gitee.com/tboox/xmake-repo.git
```

但如果 xmake 选择错误，可能会导致仓库下载失败，而通过这个环境变量，我们可以自己设置固定使用指定的仓库地址，不再进行自动选择。

```bash
$ export XMAKE_MAIN_REPO = https://github.com/xmake-io/xmake-repo.git
```

## XMAKE_BINARY_REPO

- 设置官方包预编译仓库地址

类似 `XMAKE_MAIN_REPO`，唯一的区别是，这个用于切换预编译仓库的地址。

```bash
$ export XMAKE_BINARY_REPO = https://github.com/xmake-mirror/build-artifacts.git
```

## XMAKE_THEME

- 设置主题

通常我们可以通过 `xmake g --theme=plain` 来设置颜色主题，但是它是全局的，如果想单独对当前终端会话设置，我们就可以使用这个环境变量来设置。

```bash
$ export XMAKE_THEME=plain
```

## XMAKE_STATS

- 开启或禁用用户量统计

由于目前 xmake 还在发展初期，我们需要知道大概的用户量增长情况，以便于提供我们持续更新 xmake 的动力。

因此 xmake 默认每天的第一次项目构建，会在后台进程自动 git clone 一个空仓库：https://github.com/xmake-io/xmake-stats

然后借用 github 自身提供的 Traffic 统计图表来获取大概的用户量。

对于每个项目，每天只会统计一次，并且不会泄露任何用户隐私，因为仅仅只是多了一次额外的 git clone 操作，另外我们 clone 的是一个空仓库，不会耗费用户多少流量。

当然，并不是每个用户都希望这么做，用户完全有权利去禁用这个行为，我们只需要设置：

```bash
export XMAKE_STATS=n
```

就可以完全禁用它，另外我们也会在 ci 上自动禁用这个行为。

什么时候移除它？

这个行为并不会永久存在，等到 xmake 有了足够多的用户量，或者有了其他更好的统计方式，我们会考虑移除相关统计代码。

当然，如果有非常多的用户反馈不愿意接受它，我们也会考虑移除它。

关于这个的相关 issues 见：[#1795](https://github.com/xmake-io/xmake/issues/1795)
