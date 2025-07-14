---
title: xmake支持vs2002-vs2015工程文件生成
tags: [xmake, VisualStudio, vs2008]
date: 2016-08-29
author: Ruki
---

xmake master上最新版本已经支持vs2002-vs2015工程文件的生成，通过`project`插件的方式提供，例如：

创建vs2013工程文件：

```bash
$ xmake project -k vs2013
```

默认输出目录是在当前工程的下面，会生成一个vs2008的工程文件夹，打开解决方案编译后，默认的输出文件路径跟xmake.lua描述的是完全一致的，一般都是在build目录下

除非你手动指定其他的构建目录，例如：`xmake f -o /tmp/build`

创建vs2008工程文件，并且创建工程文件到指定目录：

```bash
$ xmake project -k vs2008 f:\vsproject
```





需要注意的是，xmake只会生成当前配置模式下的工程文件，如果当前配置的是debug版本：

```bash
$ xmake f -m debug
$ xmake project -k vs2015
```

那么生成的工程文件，也是用来编译debug版本，如果想要编译release或者其他模式版本，需要重新配置下：

```bash
$ xmake f -m release
$ xmake project -k vs2015
```

以tbox为例，生成后的 vs2013 目录结构如下：

```
vs2013
├── demo
│   └── demo.vcxproj
├── tbox
│   └── tbox.vcxproj
└── tbox.sln
```

其实大部分情况下，我们并不需要生成vs的工程文件来编译，大部分情况下，使用xmake的直接编译，已经对vs的编译器进行原生支持。

我们可以直接在cmd的终端下面，直接执行`xmake`来快速编译windows程序哦。。：）
