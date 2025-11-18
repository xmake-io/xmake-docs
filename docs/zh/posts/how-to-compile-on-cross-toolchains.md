---
title: 如何通过xmake进行交叉编译
tags: [xmake, 交叉编译]
date: 2016-07-22
author: Ruki
outline: deep
---

xmake 提供了方便灵活的交叉编译支持，大部分情况下，都不需要配置很复杂的toolchains前缀，例如：`arm-linux-` 什么的

只要这个toolchains目录满足如下结构（大部分的交叉工具链都是这个结构）：

```
/home/toolchains_sdkdir
   - bin
       - arm-linux-gcc
       - arm-linux-ld
       - ...
   - lib
       - libxxx.a
   - include
       - xxx.h
```

那么，使用xmake进行交叉编译的时候，只需要进行如下配置和编译：

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir
$ xmake
```




xmake会去自动探测，gcc等编译器的前缀名：`arm-linux-`，并且编译的时候，也会自动加上 链接库 和 头文件 的搜索选项：

```
-I/home/toolchains_sdkdir/include -L/home/toolchains_sdkdir/lib
```

这些都是xmake自动处理的，不需要手动配置他们。。

但是，也有些例外的情况，比如一些特殊的交叉工具链的，编译器bin目录，并不在 `/home/toolchains_sdkdir/bin` 这个位置，而是独立到了 `/usr/opt/bin` ， 那怎么办呢，其实也不麻烦，配置的时候，再指定下bin目录的位置就好：

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --toolchains=/usr/opt/bin
$ xmake
```

如果这个工具链非常奇葩，就是不按规则出牌，路径规则很乱的话，那么xmake也没办法那么智能，只能手动配置全所有参数了：

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --toolchains=/usr/opt/bin --cxflags="-I/usr/xxx/include" --ldflags="-L/usr/zzz/lib"
$ xmake
```

另外，如果交叉工具链的前缀，例如：`arm-linux-`  xmake 没有检测成功，你也可以通过`--cross=`参数手动配置上它：

```bash
$ xmake f -p linux --cross=arm-linux- --sdk=/home/toolchains_sdkdir ...
```