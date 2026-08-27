---
outline: deep
---

# format-plugin

[format-plugin](https://github.com/xmake-addons/format-plugin) 提供 `xmake format` 命令，基于 clang-format 格式化工程的源码。

| 目录 | 提供什么 |
| --- | --- |
| `plugins/format` | `xmake format` 命令 |

它格式化的是目标真正拥有的那些文件，所以生成的代码和目标之外的第三方源码不会被误伤。主机上没有 `clang-format` 时，会自动从 xmake-repo 安装一个。

::: tip 注意
这个命令原本内置在 xmake 中，现在改为 addon 分发。内置版本仍然可用，但已经废弃，执行时会提示改用 addon，装了 addon 之后命令由 addon 接管。
:::

## 安装

```sh
$ xmake addon --install format-plugin
```

## 使用

```sh
$ xmake format                          # 格式化所有默认目标
$ xmake format target1 target2          # 只格式化指定目标
$ xmake format -a                       # 所有目标
$ xmake format -g test                  # 某个分组，支持 test_* 这种模式
$ xmake format --files='src/**.c|excluded.c'
$ xmake format --create --style=Google  # 生成一份 .clang-format
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `-s, --style` | | `.clang-format` 的路径，或内置风格 `LLVM`、`Google`、`Chromium`、`Mozilla`、`WebKit` |
| `--create` | | 按指定风格生成 `.clang-format` |
| `-n, --dry-run` | | 不修改文件，只列出会被格式化的文件 |
| `-e, --error` | | 把格式化告警变成错误 |
| `-j, --jobs` | CPU 核数 | 并行格式化的任务数 |
| `-a, --all` | | 格式化所有目标 |
| `-g, --group` | | 格式化指定分组的目标 |
| `-f, --files` | | 指定源文件，支持 `**` 通配和 `|` 排除 |

## 在 CI 里做格式检查

`--dry-run` 不改动文件，配合 `--error` 就能在有文件不符合风格时直接返回失败：

```sh
$ xmake format --dry-run --error
```
