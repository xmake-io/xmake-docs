---
outline: deep
---

# XPack 打包

Xmake 提供了强大的打包命令 `xmake pack` 和 `includes("@builtin/xpack")` 模块，支持生成各种格式的安装包（NSIS, Zip, Tar, Deb, Rpm 等）。

## 基础用法

<FileExplorer rootFilesDir="examples/packaging/xpack_basic" />

### 生成包

```bash
$ xmake pack
```

### 生成指定格式

```bash
$ xmake pack -f nsis
$ xmake pack -f zip
```
