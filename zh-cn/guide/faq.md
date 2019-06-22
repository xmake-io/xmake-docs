
## 怎样获取更多参数选项信息？

获取主菜单的帮助信息，里面有所有action和plugin的列表描述。

```bash
$ xmake [-h|--help]
``` 

获取配置菜单的帮助信息，里面有所有配置选项的描述信息，以及支持平台、架构列表。

```bash
$ xmake f [-h|--help]
``` 

获取action和plugin命令菜单的帮助信息，里面有所有内置命令和插件任务的参数使用信息。

```bash
$ xmake [action|plugin] [-h|--help]
``` 

例如，获取`run`命令的参数信息:

```bash
$ xmake run --help
``` 

## 怎样实现静默构建，不输出任何信息？

```bash
$ xmake [-q|--quiet]
```

## 如果xmake运行失败了怎么办？

可以先尝试清除下配置，重新构建下：

```bash
$ xmake f -c
$ xmake
```

如果还是失败了，请加上 `-v` 或者 `--verbose` 选项重新执行xmake后，获取更加详细的输出信息

例如：

```hash
$ xmake [-v|--verbose] 
```

并且可以加上 `--backtrace` 选项获取出错时的xmake的调试栈信息, 然后你可以提交这些信息到[issues](https://github.com/xmake-io/xmake/issues).

```bash
$ xmake -v --backtrace
```

## 怎样看实时编译警告信息?

为了避免刷屏，在构建时候，默认是不实时输出警告信息的，如果想要看的话可以加上`-w`选项启用编译警告输出就行了。

```bash
$ xmake [-w|--warning] 
```

## 怎样基于源码自动生成xmake.lua

如果你想临时写一两个测试代码、或者手上有一些移植过来的零散源码想要快速编译运行，可以不用专门xmake.lua，直接运行：

```bash
$ xmake
```

xmake会自动扫描分析当前的源码目录，识别程序结构和类型，生成一个xmake.lua，并且会尝试直接构建它。

如果编译成功，可以直接运行：

```bash
$ xmake run
```

当然，如果仅仅只是想要生成xmake.lua，默认不去构建，可以执行：

```bash
$ xmake f -y
```

更多相关介绍，请参考文章：[xmake新增智能代码扫描编译模式，无需手写任何make文件](https://tboox.org/cn/2017/01/07/build-without-makefile/)

