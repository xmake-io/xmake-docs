
相关例子工程：[Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/embed/mdk/hello)

xmake 会自动探测 Keil/MDK 安装的编译器，相关 issues [#1753](https://github.com/xmake-io/xmake/issues/1753)。

使用 armcc 编译

```sh
$ xmake f -p cross -a cortex-m3 --toolchain=armcc -c
$ xmake
```

使用 armclang 编译

```sh
$ xmake f -p cross -a cortex-m3 --toolchain=armclang -c
$ xmake
```

## 可执行程序 {#executable}

```lua
target("hello")
    add_deps("foo")
    add_rules("mdk.binary")
    add_files("src/*.c", "src/*.s")
    add_includedirs("src/lib/cmsis")
    set_runtimes("microlib")
```

需要注意的是，目前一些 mdk 程序都使用了 microlib 库运行时，它需要编译器加上 `__MICROLIB` 宏定义，链接器加上 `--library_type=microlib` 等各种配置。

我们可以通过 `set_runtimes("microlib")` 直接设置到 microlib 运行时库，可以自动设置上所有相关选项。

## 静态库程序 {#static-library}

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    add_rules("mdk.static")
    add_files("src/foo/*.c")
    set_runtimes("microlib")
```
