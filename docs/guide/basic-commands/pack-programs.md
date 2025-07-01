# Packing Programs {#pack-programs}

Xmake mainly provides the following three packaging methods for distributing the target program externally.

## Generate local package {#local-package}

Through the `xmake package` command, we can generate a local package with an xmake.lua configuration file, which contains all the target program binaries and can be introduced and used through the `add_requires` package management interface.

The package directory structure is as follows:

```sh
tree build/packages/f/foo/
build/packages/f/foo/
├── macosx
│   └── x86_64
│   └── release
│   ├── include
│   │   └── foo.h
│   └── lib
│   └── libfoo.a
└── xmake.lua
```

Generally used to distribute binary libraries and local integration. For more detailed introduction, please refer to the document: [Using Local Packages](/guide/package-management/using-local-packages).

In addition, this method can be used with [built-in macro plugins](/guide/extensions/builtin-plugins#builtin-macros) to achieve universal binary packaging for ios.

```sh
$ xmake macro package -p iphoneos -a "arm64,x86_64"
$ tree ./build/foo.pkg/
./build/foo.pkg/
├── iphoneos
│   ├── arm64
│   │   └── lib
│   │   └── release
│   │   └── libfoo.a
│   ├── universal
│   │   └── lib
│   │   └── release
│   │   └── libfoo.a
│   └── x86_64
│   └── lib
│   └── release
│   └── libfoo.a
└── xmake.lua
```

## Generate remote package {#remote-package}

We can also use `xmake package -f` Command to generate a remote package for submission to the warehouse for distribution. This package is similar to a local package and also has an xmake.lua configuration file, but the difference is that it does not directly store binary libraries, but only has a configuration file.

We can submit this package configuration file to the [xmake-repo](https://github.com/xmake-io/xmake-repo) official warehouse for distribution, or submit it to a self-built private warehouse.

::: tip NOTE
However, the generated configuration file may not be directly usable. It only generates a rough template. The user still needs to edit and modify it by himself to adjust the corresponding installation and test logic.
:::

For specific details, we can view the document: [Generate Remote Package](/guide/package-management/package-distribution#generate-package-configuration).

## Generate installation package (XPack) {#xpack}

The last packaging method is the most powerful, implemented through the `xmake pack` plug-in command. It is comparable to CMake's CPack packaging and can provide packaging for various system installation packages to achieve the distribution of target programs.

- Windows NSIS binary installation package
- Windows WIX binary installation package
- runself (shell) self-compiled installation package
- zip/tar.gz binary package
- zip/tar.gz source package
- RPM binary installation package
- SRPM source installation package
- DEB binary installation package

It provides a complete packaging configuration mechanism, which can write flexible configuration scripts and generate more customized installation packages, not only binary packages, but also source packages, self-compiled installation packages, and archive packages.

For example, generate Windows NSIS installation packages.

```sh
$ xmake pack -f nsis
```

![](/assets/img/manual/nsis_3.png)

For more details, please refer to the document: [XPack Packaging](/guide/extensions/builtin-plugins#generate-installation-package-xpack).
