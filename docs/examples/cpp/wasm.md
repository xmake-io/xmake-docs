
All c/c++ programs can be compiled to Wasm without any xmake.lua configuration changes, just switch to the wasm compilation platform and compile.

```sh
$ xmake f -p wasm
$ xmake
```

For detailed wasm compilation configuration see: [wasm configuration](/guide/basic-commands/build-configuration#wasm-webassembly)

Alternatively, when compiling a file with the `-preload-file assets/xxx.md` setting, we can also simplify its setup by configuring

<FileExplorer rootFilesDir="examples/wasm/preload" />

## Run in Browser

`xmake run` now supports running WebAssembly (Wasm) targets directly in the browser. This is particularly useful for Emscripten-based projects.

If `emrun` is available, Xmake uses it. Otherwise, it falls back to a simple Python HTTP server to serve the directory.

You can run your Wasm application simply by executing:

```bash
$ xmake run
```

Then, follow the output instructions to access `http://localhost:8000` in your browser to run the Wasm program.
