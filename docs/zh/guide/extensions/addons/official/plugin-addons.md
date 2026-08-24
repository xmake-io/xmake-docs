---
outline: deep
---

# 插件类 Addon

有三个原本内置在 xmake 里的命令，现在以 addon 形式分发。内置版本仍然可用，但已经废弃：执行时会提示改用 addon，而且装了 addon 之后，命令会由 addon 接管。

| Addon | 命令 | 作用 |
| --- | --- | --- |
| [format-plugin](https://github.com/xmake-addons/format-plugin) | `xmake format` | 基于 clang-format 格式化目标的源码 |
| [doxygen-plugin](https://github.com/xmake-addons/doxygen-plugin) | `xmake doxygen` | 生成工程的 doxygen 文档 |
| [macro-plugin](https://github.com/xmake-addons/macro-plugin) | `xmake macro` | 录制和重放一串 xmake 命令 |

```sh
$ xmake addon --install format-plugin
$ xmake addon --install doxygen-plugin
$ xmake addon --install macro-plugin
```

## format-plugin

它精确地格式化目标真正拥有的那些文件，所以生成的代码和目标之外的第三方源码不会被误伤。主机上没有 `clang-format` 时会自动从 xmake-repo 安装。

```sh
$ xmake format                          # 所有默认目标
$ xmake format target1 target2
$ xmake format -a                       # 所有目标
$ xmake format -g test                  # 某个分组
$ xmake format --files='src/**.c|excluded.c'
$ xmake format --dry-run --error        # 只检查不修改，适合 CI
$ xmake format --create --style=Google  # 生成 .clang-format
```

## doxygen-plugin

工程里没有 `doxyfile` 时它会自动生成一份 —— 工程名、版本号、源码目录和输出目录都自动填好 —— 主机上没有 `doxygen` 也会自动安装。

```sh
$ xmake doxygen
$ xmake doxygen -o /tmp/docs mysrc
```

## macro-plugin

宏本质上是一个执行 xmake 命令串的 lua 脚本，但不用手写，把敲过的命令录下来即可。

```sh
$ xmake macro --begin
$ xmake config --plat=macosx
$ xmake -r
$ xmake macro --end test

$ xmake macro test                      # 重放，简写 xmake m test
$ xmake macro .                         # 匿名宏
$ xmake macro ..                        # 上一条命令
$ xmake macro --list / --show / --delete / --clear
$ xmake macro --export=/xxx/macro.lua test
$ xmake macro --import=/xxx/macrodir
```

它自带 `package` 宏：`xmake macro package -p iphoneos -f "-m debug"` 可以一次性为多个架构打包。
