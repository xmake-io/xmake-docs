# Build Targets {#build-targets}

We briefly mentioned before that we can use the `xmake build` command to build a project.

Here we will explain it in detail. First, let's take a look at its complete command format.

## Command format

```sh
$ xmake build [options] [target]
```

Here, `[target]` specifies the target to be built. This is optional. If it is not set, all target programs will be built by default (except those marked as default = false).

The execution results are as follows:

```sh
$ xmake build
[ 17%]: cache compiling.release src/main.cpp
[ 23%]: cache compiling.release src/foo.cpp
[ 35%]: linking.release libfoo.a
[ 71%]: linking.release test
[100%]: build ok, spent 1.173s
```

Usually, we can omit the `build` subcommand, because the default behavior of the xmake command is to perform the build.

```sh
$ xmake
[ 17%]: cache compiling.release src/main.cpp
[ 23%]: cache compiling.release src/foo.cpp
[ 35%]: linking.release libfoo.a
[ 71%]: linking.release test
[100%]: build ok, spent 1.173s
```

## Build a specific target

If you want to build a specific target program, you can run:

```sh
$ xmake build foo
```

At this time, you need to write the full build subcommand, otherwise the target name may conflict with other subcommands.

## Rebuild the target

```sh
$ xmake -r
```

Or

```sh
$ xmake --rebuild
```

Both can achieve forced recompilation of the target program.

## Build all target programs

If a target is configured as `default = false`, it will not be compiled by default.

```lua
target("test")
    set_default(false)
    add_files("src/*.c")
```

If you want to build all targets, including those with `default = false`, you can pass the `-a/--all` parameter.

```sh
$ xmake build -a
```

Or

```sh
$ xmake build --all
```

## Find detailed compilation commands

If we want to view the complete compiler command parameters to troubleshoot flag configuration and other issues, we can use `xmake -v`.

```sh
$ xmake -v
[23%]: cache compiling.release src/main.cpp
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.2 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.2.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -DNDEBUG -o build/.objs/test/macosx/x86_64/release/src/main.cpp.o src/main.cpp
[47%]: linking.release test
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang++ -o build/macosx/x86_64/release/test build/.objs/test/macosx/x86_64/release/src/main.cpp.o -target x86_64-apple-macos15.2 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.2.sdk -lz -Wl,-x -Wl,-dead_strip
[100%]: build ok, spent 0.585s
```

## View error log and stack

If you encounter a problem during the compilation process and the build fails, the compilation error will be displayed by default, but if there is a syntax error in the configuration, the complete stack will not be displayed.

If you want to further locate the problem, you can use the following command to view the complete build log, including the configuration stack.

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("static")
    add_files("src/foo.cpp")

target("test")
    set_kind("binary")
    dd_deps("foo") --------------- Incorrect interface
    add_files("src/main.cpp")
```

```sh
$ xmake -vD
error: @programdir/core/main.lua:329: @programdir/core/sandbox/modules/import/core/base/task.lua:65: @progr
amdir/core/project/project.lua:1050: ./xmake.lua:9: attempt to call a nil value (global 'dd_deps')
stack traceback:
    [./xmake.lua:9]: in main chunk  ----------------- here

stack traceback:
        [C]: in function 'error'
        @programdir/core/base/os.lua:1075: in function 'os.raiselevel'
        (...tail calls...)
        @programdir/core/main.lua:329: in upvalue 'cotask'
        @programdir/core/base/scheduler.lua:406: in function <@programdir/core/base/scheduler.lua:399>
```

