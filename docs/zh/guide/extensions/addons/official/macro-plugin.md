---
outline: deep
---

# macro-plugin

[macro-plugin](https://github.com/xmake-addons/macro-plugin) 提供 `xmake macro` 命令，把一串 xmake 命令录制成宏，之后一条命令重放。

| 目录 | 提供什么 |
| --- | --- |
| `plugins/macro` | `xmake macro` 命令，以及内置的 `package` 宏 |

宏本质上就是一个执行 xmake 命令的 lua 脚本，但不用手写，把敲过的命令录下来即可。

::: tip 注意
这个命令原本内置在 xmake 中，现在改为 addon 分发。内置版本仍然可用，但已经废弃，执行时会提示改用 addon，装了 addon 之后命令由 addon 接管。
:::

## 安装

```sh
$ xmake addon --install macro-plugin
```

## 录制和重放

```sh
$ xmake macro --begin
$ xmake config --plat=macosx
$ xmake -r
$ xmake macro --end test
```

之后就可以直接重放这串命令，`xmake macro` 有个简写 `xmake m`：

```sh
$ xmake macro test
$ xmake m test
```

还有两个特殊的宏名：

```sh
$ xmake macro .                    # 匿名宏，录制时不指定名字
$ xmake macro ..                   # 上一条执行过的命令
```

## 管理宏

```sh
$ xmake macro --list               # 列出所有宏
$ xmake macro --show test          # 查看宏的内容
$ xmake macro --delete test
$ xmake macro --clear              # 清空所有宏
```

宏也可以导入导出，方便在团队之间共享：

```sh
$ xmake macro --export=/xxx/macro.lua test
$ xmake macro --export=/xxx/macrodir
$ xmake macro --import=/xxx/macro.lua test
$ xmake macro --import=/xxx/macrodir
```

## 内置的 package 宏

它自带了一个 `package` 宏，可以一次性为多个架构打包：

```sh
$ xmake macro package -p iphoneos -f "-m debug"
```
