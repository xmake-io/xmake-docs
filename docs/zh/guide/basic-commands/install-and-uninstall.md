# 安装卸载 {#install-and-uninstall}

当编译完成，我们也可以通过 `xmake install` 命令，将构建目标程序和库安装到系统环境。

这通常用于 linux, unix, bsd 等系统环境下的安装。

::: tip 注意
尽管 Windows 下也支持，但是不常用，因为 Windows 上没有默认的安装目录，因此更推荐直接生成安装包。具体见：[XPack 打包](/zh/api/description/xpack-interfaces)
:::

## 命令格式

::: code-group

```sh [安装]
$ xmake install [options] [target]
```

```sh [卸载]
$ xmake uninstall [options] [target]
```
:::

## 安装到系统目录

通常我们只需要执行下面的命令，即可完成安装，默认的安装目录在 `/usr/local` 下。

```sh
$ xmake install
```

## 安装到指定目录

我们也可以指定需要安装的根目录，尤其是对于 Windows 上没有默认安装目录的情况下，会更有用些。

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

另外，我们也可以通过 [set_installdir](/zh/api/description/project-target#set-installdir) 接口，在配置文件中进行默认安装路径的配置，具体可以看 API 手册里面的详细说明。

## 卸载程序

我们也可以通过 `xmake uninstall` 执行反向的卸载操作，同样也可以指定需要卸载的安装目录。

```sh
$ xmake uninstall
$ xmake uninstall --installdir=/tmp/usr
```

