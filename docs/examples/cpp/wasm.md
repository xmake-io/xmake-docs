
All c/c++ programs can be compiled to Wasm without any xmake.lua configuration changes, just switch to the wasm compilation platform and compile.

```bash
$ xmake f -p wasm
$ xmake
```

For detailed wasm compilation configuration see: [wasm configuration](/guide/configuration?id=wasm)

Alternatively, when compiling a file with the `-preload-file assets/xxx.md` setting, we can also simplify its setup by configuring

```lua
target("test5")
    set_kind("binary")
    add_files("src/*.cpp")
    add_values("wasm.preloadfiles", "src/xxx.md")
    add_values("wasm.preloadfiles", "src/xxx2.md")
```
