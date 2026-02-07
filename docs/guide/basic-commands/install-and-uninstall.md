# Install and Uninstall {#install-and-uninstall}

When the compilation is complete, we can also use the `xmake install` command to install the target program and libraries to the system environment.

This is usually used for installation in Linux, Unix, BSD, and other system environments.

::: tip NOTE
Although it is also supported under Windows, it is not commonly used because there is no default installation directory on Windows. It is more recommended to generate the installation package directly. For details, see: [XPack packaging](/api/description/xpack-interfaces)
:::

## Command format

::: code-group

```sh [install]
$ xmake install [options] [target]
```

```sh [uninstall]
$ xmake uninstall [options] [target]
```
:::

## Install to the system directory

Usually, we only need to execute the following command to complete the installation. The default installation directory is `/usr/local`.

```sh
$ xmake install
```

## Install to a specified directory

We can also specify the root directory for installation, which is more useful when there is no default installation directory on Windows.

```sh
$ xmake install -o /tmp/usr
installing foo ..
installing foo to /tmp/usr ..
installing test ..
installing test to /tmp/usr ..
install ok!
ruki:test ruki$ tree /tmp/usr
/tmp/usr
├── bin
│   └── test
└── lib
└── libfoo.a

2 directories, 2 files
```

Since v3.0.7, we can also configure the installation directories for different types of files through `--bindir`, `--libdir`, `--includedir`, etc.

```sh
$ xmake install -o /tmp/usr --bindir=mybin --libdir=mylib
```

In addition, we can also configure the default installation path in the configuration file through the [set_installdir](/api/description/project-target#set-installdir) interface. For details, please refer to the API manual.

## Uninstaller

We can also perform the reverse uninstallation operation through `xmake uninstall`, and specify the installation directory to be uninstalled.

```sh
$ xmake uninstall
$ xmake uninstall --installdir=/tmp/usr
```
