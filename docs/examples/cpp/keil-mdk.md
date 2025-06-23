Related example project: [Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/embed/mdk/hello)

xmake will automatically detect the compiler installed by Keil/MDK, related issues [#1753](https://github.com/xmake-io/xmake/issues/1753).

Compile with armcc

```bash
$ xmake f -p cross -a cortex-m3 --toolchain=armcc -c
$ xmake
```

Compile with armclang

```bash
$ xmake f -p cross -a cortex-m3 --toolchain=armclang -c
$ xmake
```

### Executable program

```lua
target("hello")
     add_deps("foo")
     add_rules("mdk.console")
     add_files("src/*.c", "src/*.s")
     add_includedirs("src/lib/cmsis")
     set_runtimes("microlib")
```

It should be noted that when some mdk programs all use the microlib library to run, it requires the compiler to add the `__MICROLIB` macro definition, and the linker to add various configurations such as `--library_type=microlib`.

We can set directly to the microlib runtime library through `set_runtimes("microlib")`, and all relevant options can be set automatically.

### Static library program

```lua
add_rules("mode.debug", "mode.release")

target("foo")
     add_rules("mdk.static")
     add_files("src/foo/*.c")
     set_runtimes("microlib")
```

