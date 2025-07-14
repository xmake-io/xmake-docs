---
title: xmake改进权限问题，提升操作安全性
tags: [xmake, lua, root权限, 安装, 卸载]
date: 2017-03-30
author: Ruki
---

最近对xmake的操作权限进行了升级，提供更加安全的命令操作，例如：

1. 改进`xmake install`和`xmake uninstall`命令，提供更加安全地安装和卸载支持
2. 参考homebrew，禁止在root下运行xmake命令
3. 改进xmake自身的编译安装脚本，不在root下进行build

##### 安全问题1

之前的`xmake install`和`xmake uninstall`行为，是自动`build`后进行安装，而大部分情况下安装目录是在`/usr/local`目录下。

因此，需要root权限才能写入，那么之前的方式只能暴力地直接加上`sudo xmake install`来执行。

可想而知，虽然安装确实成功了，但是由于默认的自动构建行为，导致生成的临时`*.o`, `*.a`等各种文件都具备了root权限，而且一个不小心就会覆盖系统的一些库文件。

因此，为了避免这个问题，xmake改进了安装逻辑，将`build`和`install`分离成两个独立的阶段，分别使用不同的权限，并且提供更加友好的提示信息，例如：

![safer_installation](/assets/img/posts/xmake/safer_installation.png)






##### 安全问题2

这个主要参考了homebrew对`sudo brew`的处理，为了提高安全性，它禁止在root下运行命令，其实很多其他工具都有这个特性，`CocoaPods`也是如此。

那它是怎么实现的呢，我翻了下homebrew的源码，在`brew.sh`中有这么一段脚本：

```ruby
check-run-command-as-root() {
  [[ "$(id -u)" = 0 ]] || return

  # Homebrew Services may need `sudo` for system-wide daemons.
  [[ "$HOMEBREW_COMMAND" = "services" ]] && return

  # It's fine to run this as root as it's not changing anything.
  [[ "$HOMEBREW_COMMAND" = "--prefix" ]] && return

  odie <<EOS
Running Homebrew as root is extremely dangerous and no longer supported.
As Homebrew does not drop privileges on installation you would be giving all
build scripts full access to your system.
EOS
}
```

原来是用了`id -u`命令，来判断当前命令是否在root下运行，如果是root用户，那么这个命令返回：'0'

因此，xmake参考这个实现，也实现了个类似的检测和提示：

![check_root](/assets/img/posts/xmake/check_root.png)


##### 安全问题3

之前的xmake源码安装，是直接运行的`sudo ./install`，这个跟问题一类似，build和install同时在root执行，因此只需要把他们分离开来就行了，现在的安装步骤：

```bash
make build; sudo make install
```

如果要指定安装目录，那么只需要：

```bash
make build; sudo make install prefix=/usr/local
```