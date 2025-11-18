---
title: xmake默认启用pdb符号文件
tags: [xmake, 编译, 符号文件, 调试符号]
date: 2016-07-24
author: Ruki
outline: deep
---


之前xmake默认编译windows目标，debug模式下采用的是`-Z7`编译选项，内置的调试符号信息到obj文件里面

但是这种方式按msdn的文档上说，是属于旧式的调试符号文件格式，所以为了考虑后续的兼容性，xmake修改了默认的调试符号生成规则，

改为默认启用pdb符号文件，并且pdb的方式更为常用。。

这个行为的修改，并不会影响到`xmake.lua`的设置，如果在这个文件中，设置了启用调试符号：

```lua
set_symbols("debug")
```

那么，编译debug版本的目标时，就会自动生成pdb文件，以tbox为例：

```bash
$ xmake f -m debug
$ xmake
```

编译完成后，会自动在build目录下生成两个pdb文件：

```
build\tbox.pdb
build\demo.pdb
```




一个是静态库的pdb文件，一个是demo程序的pdb文件，并且如果我们执行打包命令：

```bash
$ xmake package
```

的话，也会在包目录里面，将pdb文件也给自动打包进去。。。