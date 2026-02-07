所有 c/c++ 程序，我们都可以编译成 Wasm，无需任何 xmake.lua 配置改动，只需要切换到 wasm 编译平台进行编译。

```sh
$ xmake f -p wasm
$ xmake
```

详细的 Wasm 编译配置见：[Wasm 配置](/zh/guide/basic-commands/build-configuration.html#wasm-webassembly)。

另外，在编译带有 `--preload-file assets/xxx.md` 设置的文件时候，我们也可以通过配置，简化对它的设置。

<FileExplorer rootFilesDir="examples/wasm/preload" />

## 浏览器中运行

`xmake run` 现在支持直接在浏览器中运行 WebAssembly (Wasm) 目标。这对于基于 Emscripten 的项目特别有用。

如果 `emrun` 可用，Xmake 将使用它。否则，它会回退到使用 Python HTTP 服务器来服务目录。

你只需执行以下命令即可运行 Wasm 应用程序：

```bash
$ xmake run
```

然后，根据输出提示，在浏览器中访问 `http://localhost:8000` 即可运行 Wasm 程序。
