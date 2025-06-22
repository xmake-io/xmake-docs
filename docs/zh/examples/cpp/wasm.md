所有 c/c++ 程序，我们都可以编译成 Wasm，无需任何 xmake.lua 配置改动，只需要切换到 wasm 编译平台进行编译。

```bash
$ xmake f -p wasm
$ xmake
```

详细的 Wasm 编译配置见：[Wasm 配置](https://xmake.io/#/zh-cn/guide/configuration?id=wasm)

另外，在编译带有 `--preload-file assets/xxx.md` 设置的文件时候，我们也可以通过配置，简化对它的设置。

```lua
target("test5")
    set_kind("binary")
    add_files("src/*.cpp")
    add_values("wasm.preloadfiles", "src/xxx.md")
    add_values("wasm.preloadfiles", "src/xxx2.md")
```
