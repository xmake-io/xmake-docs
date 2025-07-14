---
title: xmake编译配置过程详解
tags: [xmake, 配置, android, vs, 自动检测]
date: 2016-07-19
author: Ruki
---

xmake 在构建程序的时候，会去自动检测系统环境，工程描述等来创建最合适的编译配置来进行编译。。

一般情况下，我们只需要执行：

```bash
$ xmake
```

就行了，并且如果工程描述没有改变，就不会去重新检测和生成配置。。

但是有时候，我们的编译需求千奇百怪，不可能一行`xmake`就能完全满足我们的需求，例如：我要在macosx上编译android程序了，怎么办

这个时候就需要手动修改配置：

```bash
$ xmake f -p android --ndk=~/file/android-ndk
```

上面是简写，这样会少敲些字符，如果要可读性更好些，可以写全：

```bash
$ xmake config --plat=android --ndk=~/file/android-ndk
```

然后我们继续执行编译即可：

```bash
$ xmake
```

如果每次编译都是相同配置的话，就不需要重新配置了

当然有时候系统环境发生改变，例如之前用的是 gcc， 现在gcc被卸载了，装了clang，那么缓存配置就无效了，这种情况下，xmake还没有那么智能，能够检测到进行重配，只能手动加上 `-c` 参数，强制清楚配置缓存，进行重新检测：

```bash
$ xmake f -c
```

如果有时候遇到些配置上的问题，都可以尝试加上这个参数，重试下，一般都能解决。。




上述讲的都是相对于工程的局部配置，只对当前工程有效，配置的缓存数据都被放置在了当前工程目录下：

```
projectdir/.xmake
```

如果有些配置参数，每次都不变，那就不需要每次都手动输入一遍了，只需要放置到全局配置中区就行了，例如参数：`--ndk=~/file/android-ndk`

我们可以通过全局配置命令：

```bash
$ xmake global --ndk=~/file/android-ndk
```

或者简写方式：


```bash
$ xmake g --ndk=~/file/android-ndk
```

之后每次编译android的版本，就可以简化为：

```bash
$ xmake f -p android
$ xmake
```

是不是更方便了哈。。嘿嘿。。

在比如，我要每次强行都使用vs2008这个特定版本，而不使用自动检测出来的v2015，（如果你装了两个vs的话），就可以通过全局配置，设置到vs2008上去：

```hash
$ xmake g --vs=2008
```

然后编译的时候执行(注：这里加上`-c`，是因为全局配置改了，最好强行重新检测下)：

```bash
$ xmake f -c
$ xmake
```

最后，如果需要了解配置的详细参数，可以执行`--help`来了解：

```bash
$ xmake f -h
$ xmake g -h
```