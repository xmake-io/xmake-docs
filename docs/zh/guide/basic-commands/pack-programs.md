# 打包程序 {#pack-programs}

Xmake 主要提供下面三种打包方式，用于将目标程序进行对外分发。

## 生成本地包 {#local-package}

通过 `xmake package` 命令，我们可以生成一个带有 xmake.lua 配置文件的本地包，它里面包含了所有的目标程序二进制文件，并且可以通过 `add_requires` 包管理接口引入和使用。

包目录结构如下：

```sh
tree build/packages/f/foo/
build/packages/f/foo/
├── macosx
│   └── x86_64
│       └── release
│           ├── include
│           │   └── foo.h
│           └── lib
│               └── libfoo.a
└── xmake.lua
```

一般用于分发二进制的库，以及本地集成使用，更多详细介绍，可以看下文档：[使用本地包](/zh/guide/package-management/using-local-packages)。

此外，这种方式在配合 [内置的宏插件](/zh/guide/extensions/builtin-plugins#builtin-macro-scripts) 可以实现 ios 的 universal 二进制打包。

```sh
$ xmake macro package -p iphoneos -a "arm64,x86_64"
$ tree ./build/foo.pkg/
./build/foo.pkg/
├── iphoneos
│   ├── arm64
│   │   └── lib
│   │       └── release
│   │           └── libfoo.a
│   ├── universal
│   │   └── lib
│   │       └── release
│   │           └── libfoo.a
│   └── x86_64
│       └── lib
│           └── release
│               └── libfoo.a
└── xmake.lua
```

## 生成远程包 {#remote-package}

我们也可以通过 `xmake package -f` 命令去生成远程包，用于提交到仓库分发，这种包类似本地包，也有一个 xmake.lua 配置文件，不过区别在于，它不直接存储二进制库，仅仅只有一个配置文件。

我们可以将这个包配置文件，提交到 [xmake-repo](https://github.com/xmake-io/xmake-repo) 官方仓库进行分发，也可以提交到自建的私有仓库中。

::: tip 注意
不过生成的配置文件，也许不能直接可用，它只是生成一个大概的模板，具体还是需要用户自己编辑修改，调整对应的安装和测试逻辑。
:::

具体详情，我们可以查看文档：[生成远程包](/zh/guide/package-management/package-distribution#generate-remote-package)。

## 生成安装包 (XPack) {#xpack}

最后这种打包方式最为强大，通过 `xmake pack` 插件命令实现，它对标 CMake 的 CPack 打包，可以提供各种系统安装包的打包，来实现对目标程序的分发。

- Windows NSIS 二进制安装包
- Windows WIX 二进制安装包
- runself (shell) 自编译安装包
- zip/tar.gz 二进制包
- zip/tar.gz 源码包
- RPM 二进制安装包
- SRPM 源码安装包
- DEB 二进制安装包

它提供的完善的打包配置机制，可以编写灵活的配置脚本，进行更加定制化的生成安装包，不仅仅是二进制包，还有源码包，自编译安装包，归档包都能同时支持。

例如生成 Windows NSIS 安装包。

```sh
$ xmake pack -f nsis
```

![](/assets/img/manual/nsis_3.png)

更多详情，请查看文档：[XPack 打包](/zh/guide/extensions/builtin-plugins#xpack)。
