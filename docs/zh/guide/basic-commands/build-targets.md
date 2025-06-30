# 构建目标 {#build-targets}

之前我们已经简单讲过，可以通过 `xmake build` 命令来构建工程。

这里我们再来详细讲解下，首先，我们先看下它的完整命令格式。

## 命令格式

```console
$ xmake build [target] [args]
```

其中，`[target]` 指定需要构建的 target 目标，这是可选的，如果没有设置，那么默认会构建所有的目标程序（被标记为 default = false 的除外）。

执行效果如下：

```console
$ xmake build
[ 17%]: cache compiling.release src/main.cpp
[ 23%]: cache compiling.release src/foo.cpp
[ 35%]: linking.release libfoo.a
[ 71%]: linking.release test
[100%]: build ok, spent 1.173s
```

通常我们可以省略后面的 `build` 子命令，因为 xmake 命令的默认行为就是执行构建。

```console
$ xmake
[ 17%]: cache compiling.release src/main.cpp
[ 23%]: cache compiling.release src/foo.cpp
[ 35%]: linking.release libfoo.a
[ 71%]: linking.release test
[100%]: build ok, spent 1.173s
```

## 构建特定目标

如果要指定构建特定的目标程序，可以执行：

```console
$ xmake build foo
```

:::tip 注意
这个时候，需要写全 build 子命令，否则目标名可能会跟其他子命令冲突。
:::

## 重新构建目标

```console
$ xmake -r
```

或者

```console
$ xmake --rebuild
```

都可以实现强制重新编译目标程序。

## 构建全部目标程序

如果 target 被配置为 `default = false`，那么默认是不会编译它的。

```lua
target("test")
    set_default(false)
    add_files("src/*.c")
```

如果想要构建所有目标， 包括这些 `default = false` 的目标程序，那么可以传递 `-a/--all` 参数。

```console
$ xmake build -a
```

或者

```console
$ xmake build --all
```

## 查找详细编译命令

如果我们想查看完整的编译器命令参数，来排查 flags 配置等问题，可以使用 `xmake -v`。

```console
$ xmake -v
[ 23%]: cache compiling.release src/main.cpp
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Qunused-arguments -target x86_64-apple-macos15.2 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.2.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -DNDEBUG -o build/.objs/test/macosx/x86_64/release/src/main.cpp.o src/main.cpp
[ 47%]: linking.release test
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang++ -o build/macosx/x86_64/release/test build/.objs/test/macosx/x86_64/release/src/main.cpp.o -target x86_64-apple-macos15.2 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.2.sdk -lz -Wl,-x -Wl,-dead_strip
[100%]: build ok, spent 0.585s
```

## 查看错误日志和堆栈

如果在编译过程中遇到问题，构建失败了，会默认显示编译错误，但如果配置上有语法错误，并不会显示完整的堆栈。

如果想要进一步定位问题，可以通过下面的命令，查看完整的构建日志，包括配置堆栈。

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("static")
    add_files("src/foo.cpp")

target("test")
    set_kind("binary")
    dd_deps("foo")   --------------- 不正确的接口
    add_files("src/main.cpp")
```

```console
$ xmake -vD
error: @programdir/core/main.lua:329: @programdir/core/sandbox/modules/import/core/base/task.lua:65: @progr
amdir/core/project/project.lua:1050: ./xmake.lua:9: attempt to call a nil value (global 'dd_deps')
stack traceback:
    [./xmake.lua:9]: in main chunk  ----------------- 实际配置错误的地方

stack traceback:
        [C]: in function 'error'
        @programdir/core/base/os.lua:1075: in function 'os.raiselevel'
        (...tail calls...)
        @programdir/core/main.lua:329: in upvalue 'cotask'
        @programdir/core/base/scheduler.lua:406: in function <@programdir/core/base/scheduler.lua:399>
```

