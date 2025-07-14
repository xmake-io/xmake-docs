---
title: 在windows下支持调试运行
tags: [xmake, 编译, 符号文件, 调试器, windows]
date: 2016-07-25
author: Ruki
---

现在xmake在windows下，也已经支持调试运行了，可以在编译完debug版本的程序后，直接进行调试开发。。

我们继续以tbox工程为例：

```bash
$ xmake f -m debug
$ xmake r -d demo
```

上述命令，先配置了debug模式编译，为了启用pdb调试符号文件的生成，然后自动编译后，调试运行demo程序。。

xmake会在配置的时候，自动检测windows上注册表里面的默认调试器，然后加载我们的目标程序并运行。

一般情况下，加载的是vs自带的vsjitdebugger调试器，当然xmake也支持windbg和ollydbg（做逆向的，这个用的比较多哈。。）

我们试着运行demo中的exception测试用例，进行人为中断，然后调试运行：

```bash
$ xmake r -d demo platform_exception
```

可以看到如下效果：

![vsjitdebugger](/assets/img/posts/xmake/vsjitdebugger.png)




接着我们再来看下ollydbg的加载效果：

![ollydbg](/assets/img/posts/xmake/ollydbg.png)

除了通过检测的内置调试器来进行调试，我们也可以针对特定项目，手动配置指定第三方调试进行加载运行

例如指定windbg的调试器路径进行调试：

```bash
$ xmake f --dd="C:\Program Files\Debugging Tools for Windows (x86)\windbg.exe"
$ xmake r -d demo platform_exception
```

或者可以配置到全局配置中，这样不用每次都去重新配置了：

```bash
$ xmake g --dd="C:\Program Files\Debugging Tools for Windows (x86)\windbg.exe"
```

