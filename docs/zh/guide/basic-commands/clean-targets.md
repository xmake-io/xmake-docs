# 清理构建 {#clean-targets}

我们可以通过 `xmake clean` 命令来清理构建过程中生成的临时文件。

## 命令格式

```sh
$ xmake clean [options] [target]
```

## 清理目标

如果不指定目标名，默认清理所有目标。

```sh
$ xmake clean
```

我们也可以指定清理特定的目标。

```sh
$ xmake clean test
```

## 清理所有文件

默认情况下，`xmake clean` 仅仅清理当前构建模式（例如：debug/release）和架构下生成的对象文件和目标文件。

如果想要清理所有编译模式、所有架构生成的文件，可以执行：

```sh
$ xmake clean -a
```

或者

```sh
$ xmake clean --all
```

## 清理配置

如果想要清理配置缓存（重新执行检测和配置），可以执行：

```sh
$ xmake f -c
```
