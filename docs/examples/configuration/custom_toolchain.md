---
outline: deep
---

# Custom Toolchain

We can use `toolchain()` to define custom toolchains to support special compilers or cross-compilation environments.

For details on custom toolchain configuration, see: [Custom Toolchain API](/api/description/custom-toolchain).

## Basic Example

<FileExplorer rootFilesDir="examples/configuration/custom_toolchain/basic" />

### Build and Run

```bash
$ xmake
$ xmake run
```

## Unknown Toolchain

If we need to support a completely unknown compiler toolchain, we need to implement the detection script of the toolchain, as well as the script configuration of all tool sets such as compilation, linking, archiving, etc.

<FileExplorer rootFilesDir="examples/configuration/custom_toolchain/unknown_toolchain" />

