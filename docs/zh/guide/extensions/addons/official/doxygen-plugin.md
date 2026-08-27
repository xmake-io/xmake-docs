---
outline: deep
---

# doxygen-plugin

[doxygen-plugin](https://github.com/xmake-addons/doxygen-plugin) 提供 `xmake doxygen` 命令，为工程生成 doxygen 文档。

| 目录 | 提供什么 |
| --- | --- |
| `plugins/doxygen` | `xmake doxygen` 命令 |

工程里没有 `doxyfile` 时，它会自动生成一份，工程名、版本号、源码目录和输出目录都会自动填好。主机上没有 `doxygen` 时，也会自动安装一个。

::: tip 注意
这个命令原本内置在 xmake 中，现在改为 addon 分发。内置版本仍然可用，但已经废弃，执行时会提示改用 addon，装了 addon 之后命令由 addon 接管。
:::

## 安装

```sh
$ xmake addon --install doxygen-plugin
```

## 使用

```sh
$ xmake doxygen                    # 生成文档，源码目录默认 src
$ xmake doxygen -o /tmp/docs mysrc # 指定输出目录和源码目录
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `-o, --outputdir` | 工程的构建目录 | 文档的输出目录 |
| `srcdir` | `src` | 源码目录 |

生成完成后会打印结果页面的路径，即 `<outputdir>/html/index.html`。
