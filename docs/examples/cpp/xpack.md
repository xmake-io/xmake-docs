---
outline: deep
---

# XPack Packaging

Xmake provides a powerful packaging command `xmake pack` and `includes("@builtin/xpack")` module to support generating installation packages in various formats (NSIS, Zip, Tar, Deb, Rpm, etc.).

For packaging commands, see [Pack Programs](/guide/basic-commands/pack-programs). For the complete XPack API, see [XPack API](/api/description/xpack-interfaces).

## Basic Usage

<FileExplorer rootFilesDir="examples/packaging/xpack_basic" />

### Generate Package

```bash
$ xmake pack
```

### Generate Specific Format

```bash
$ xmake pack -f nsis
$ xmake pack -f zip
```
