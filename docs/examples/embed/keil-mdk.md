Related example project: [Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/embed/mdk/hello)

xmake will automatically detect the compiler installed by Keil/MDK, related issues [#1753](https://github.com/xmake-io/xmake/issues/1753).

Compile with armcc

```sh
$ xmake f -p cross -a cortex-m3 --toolchain=armcc -c
$ xmake
```

Compile with armclang

```sh
$ xmake f -p cross -a cortex-m3 --toolchain=armclang -c
$ xmake
```

### Executable program

<FileExplorer rootFilesDir="examples/embed/keil_mdk/binary" />

It should be noted that when some mdk programs all use the microlib library to run, it requires the compiler to add the `__MICROLIB` macro definition, and the linker to add various configurations such as `--library_type=microlib`.

We can set directly to the microlib runtime library through `set_runtimes("microlib")`, and all relevant options can be set automatically.

### Static library program

<FileExplorer rootFilesDir="examples/embed/keil_mdk/static_library" />
