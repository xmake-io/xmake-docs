# Environment variables

We can execute the following command to get all the environment variables used by xmake and the currently set values.

```sh
$ xmake show -l envs
XMAKE_RAMDIR Set the ramdisk directory.
                        <empty>
XMAKE_GLOBALDIR Set the global config directory of xmake.
                        /Users/ruki
XMAKE_ROOT Allow xmake to run under root.
                        <empty>
XMAKE_COLORTERM Set the color terminal environment.
                        <empty>
XMAKE_PKG_INSTALLDIR Set the install directory of packages.
                        <empty>
XMAKE_TMPDIR Set the temporary directory.
                        /var/folders/vn/ppcrrcm911v8b4510klg9xw80000gn/T/.xmake501/211104
XMAKE_PKG_CACHEDIR Set the cache directory of packages.
                        <empty>
XMAKE_PROGRAM_DIR Set the program scripts directory of xmake.
                        /Users/ruki/.local/share/xmake
XMAKE_PROFILE Start profiler, e.g. perf, trace.
                        <empty>
XMAKE_RCFILES Set the runtime configuration files.

XMAKE_CONFIGDIR Set the local config directory of project.
                        /Users/ruki/projects/personal/xmake-docs/.xmake/macosx/x86_64
XMAKE_LOGFILE Set the log output file path.
                        <empty>
```

## XMAKE_RAMDIR

- Set the ramdisk directory path

The ramdisk directory is the directory location of the memory file system. Usually the `os.tmpdir()` interface will use the temporary files used by xmake. If the user sets the ramdisk path, it will be stored in this first to improve the overall compilation speed.

## XMAKE_TMPDIR

- Set the user's temporary directory

By default, xmake will use `/tmp/.xmake` and `%TEMP%/.xmake`. Of course, users can modify the default path through this variable.

## XMAKE_CONFIGDIR

- Set local project configuration directory

The local compilation configuration of each project will be stored in the `.xmake` path in the root directory of the current project by default, and then differentiated according to different platforms and architectures, for example:

```sh
.xmake/macosx/x86_64
```

If we don't want to store it in the root directory of the project, we can also set it to other paths ourselves, such as the build directory and so on.

## XMAKE_GLOBALDIR

- Set the root directory of the global configuration file

A `.xmake` directory, which serves as the storage directory of the global configuration of `xmake g/global` configuration, will be created under this path. Other global files such as installation packages, caches, etc., will be stored in this directory by default.

The default path is: `~`.

## XMAKE_ROOT

-Allow users to run in root mode

Usually xmake is forbidden to run under root by default, which is very insecure. But if the user has to run under root, he can also set this variable to force it on.

```sh
export XMAKE_ROOT=y
```

## XMAKE_COLORTERM

- Set the color output of Terminal

Currently, these values ​​can be set:

| Value | Description |
| --- | --- |
| nocolor | Disable color output |
| color8 | 8-color output support |
| color256 | 256 color output support |
| truecolor | True color output support |

Generally, users don't need to set them, Xmake will automatically detect the color range supported by the user terminal. If the user doesn't want to output colors, they can set nocolor to disable them globally.

Or use `xmake g --theme=plain` to disable it globally.

## XMAKE_PKG_INSTALLDIR

- Set the installation root directory of the dependent package

The default global directory for xmake's remote package installation is `$XMAKE_GLOBALDIR/.xmake/packages`, but users can also set this variable to modify it individually.

We can also use `xmake g --pkg_installdir=/xxx` to set it, the effect is the same. However, the environment variable takes precedence over this configuration.

## XMAKE_PKG_CACHEDIR

- Set the cache directory of dependent packages

The default path is in the `$XMAKE_GLOBALDIR/.xmake/cache` directory, which stores various cache files during the package installation process, which takes up more storage space, and the user can also set it separately.

Of course, Xmake will automatically clean up all cache files of the previous month every month.

## XMAKE_PROGRAM_DIR

- Set the script directory of Xmake

All lua scripts of Xmake are installed with the installer. By default, they are in the installation directory. However, if you want to switch to the script directory you downloaded to facilitate local modification and debugging, you can set the this variable.

If you want to view the script directory currently used by Xmake, you can execute:

```sh
$ xmake l os.programdir
/Users/ruki/.local/share/xmake
```

## XMAKE_PROFILE

- Enable performance analysis

This is only available to xmake developers, and is used to analyze the time spent in running xmake and track the calling process.

### Analyze the time taken to call functions

```sh
$ XMAKE_PROFILE=perf:call xmake
[ 25%]: cache compiling.release src/main.cpp
[ 50%]: linking.release test
[100%]: build ok!
0.238, 97.93%, 1, runloop : @programdir/core/base/scheduler.lua: 805
0.180, 74.04%, 25, _resume : [C]: -1
0.015, 6.34%, 50, _co_groups_resume : @programdir/core/base/scheduler.lua: 299
0.011, 4.37%, 48, wait : @programdir/core/base/poller.lua: 111
0.004, 1.70%, 62, status : @programdir/core/base/scheduler.lua: 71
0.004, 1.53%, 38, is_dead : @programdir/core/base/scheduler.lua: 76
0.003, 1.44%, 50, next : @programdir/core/base/timer.lua: 74
0.003, 1.33%, 48, delay : @programdir/core/base/timer.lua: 60
0.002, 1.02%, 24, is_suspended : @programdir/core/base/scheduler.lua: 86
```

### Analysis of process time consumption

It can be used to analyze the compilation time of each file and some operation bottlenecks.

```sh
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

### Tracking the running process of xmake

```sh
$ XMAKE_PROFILE=trace xmake
func                          : @programdir/core/base/scheduler.lua: 457
is_suspended                  : @programdir/core/base/scheduler.lua: 86
status                        : @programdir/core/base/scheduler.lua: 71
thread                        : @programdir/core/base/scheduler.lua: 66
thread                        : @programdir/core/base/scheduler.lua: 66
length                        : @programdir/core/base/heap.lua: 120
```

### Analysis and operation stuck problem

It can be used to get the stack when xmake is stuck. After enabling this feature, you can get the stack after interrupting by pressing Ctrl+C.

```sh
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

- Set up a global configuration file

We can set up some `xmakerc.lua` global configuration files, and introduce them globally when users compile the project, such as global introduction of some user-defined help scripts, tool chains and so on.

```sh
$ export XMAKE_RCFILES=xmakerc.lua
$ xmake
```

If this environment variable is not set, users can set the global configuration file in `/etc/xmakerc.lua`, `~/xmakerc.lua`, and `$XMAKE_GLOBALDIR/.xmake/xmakerc.lua`. The search priority is listed from highest to lowest.

## XMAKE_LOGFILE

- Set the log file path

By default, Xmake will echo the output to the terminal. We can turn on the automatic log storage to the specified file by setting this path, but it will not affect the normal echo output of the terminal.

## XMAKE_MAIN_REPO

- Set the official package master warehouse address

Xmake has built-in three main warehouse addresses by default, they are exactly the same, Xmake will choose the best address to use according to the current network status.

1. https://github.com/xmake-io/xmake-repo.git
2. https://gitlab.com/tboox/xmake-repo.git
3. https://gitee.com/tboox/xmake-repo.git

However, if Xmake chooses the wrong one, it may cause the warehouse download to fail. Through this environment variable, we can set and use the specified warehouse address by ourselves instead of automatically selecting it.

```sh
$ export XMAKE_MAIN_REPO=https://github.com/xmake-io/xmake-repo.git
```

## XMAKE_BINARY_REPO

- Set the official package pre-compiled warehouse address

Similar to `XMAKE_MAIN_REPO`, the only difference is that this is used to switch the address of the pre-compiled warehouse.

```sh
$ export XMAKE_BINARY_REPO=https://github.com/xmake-mirror/build-artifacts.git
```

## XMAKE_THEME

- Set theme

Usually we can set the color theme through `xmake g --theme=plain`, but it is global. If we want to set the current terminal session individually, we can use this environment variable to set it.

```sh
$ export XMAKE_THEME=plain
```

## XMAKE_STATS

- Enable or disable user statistics

Since Xmake is still in the early stages of development, we need to know the approximate user growth in order to provide us with the motivation to continue to update Xmake. Therefore, Xmake defaults to the first project build every day, and it will automatically git clone an empty warehouse in the background process: https://github.com/xmake-io/xmake-stats

Then borrow the Traffic statistics chart provided by github itself to get the approximate number of users.

For each project, we will only count once a day, and will not disclose any user privacy, because there is only one additional git clone operation. In addition, we cloned an empty warehouse, which will not consume much user traffic. Of course, not every user wants to do this, user has right to disable this behavior, we only need to set:

```sh
export XMAKE_STATS=false
```

It can be completely disabled, and we will also automatically disable this behavior on ci.

When will it be removed?

This behavior will not exist forever. When Xmake has enough users, or there are other better statistical methods, we will consider removing the relevant statistical code. Of course, if a lot of user feedback is unwilling to accept it, we will also consider removing it.

For related issues about this, see [#1795](https://github.com/xmake-io/xmake/issues/1795) and [#1803](https://github.com/xmake-io/xmake/discussions/1802).
