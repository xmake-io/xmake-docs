# cli.amalgamate

- 合并成单源码文件

这是一个小工具模块，主要用于快速合并指定 target 里面的所有 c/c++ 和 头文件源码到单个源文件。

合并会将内部 includes 头文件全部展开，并生成 DAG，通过拓扑排序引入。

默认它会处理所有 target 的合并，例如：

```sh
$ xmake l cli.amalgamate
build/tbox.c generated!
build/tbox.h generated!
```

我们也可以指定合并需要的目标：

```sh
$ xmake l cli.amalgamate tbox
build/tbox.c generated!
build/tbox.h generated!
```

也可以在合并每个源文件时候，指定一个自定义的 unique ID 的宏定义，来处理符号冲突问题。

```sh
$ xmake l cli.amalgamate -u MY_UNIQUEU_ID
build/tbox.c generated!
build/tbox.h generated!
```

如果多个源文件内部有重名符号，就可以判断这个 `MY_UNIQUEU_ID` 宏是否被定义，如果定义了，说明是在单文件中，就自己在源码中处理下重名符号。

```c
#ifdef MY_UNIQUEU_ID
    // do some thing
#endif
```


我们也可以指定输出位置：

```sh
$ xmake l cli.amalgamate -o /xxx
/xxx/tbox.c generated!
/xxx/tbox.h generated!
```
