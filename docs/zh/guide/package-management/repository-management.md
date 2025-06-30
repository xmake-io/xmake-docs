
# 仓库管理命令 {#repository-management}

我们可以使用 `xmake repo` 去管理仓库，并且我们也提供了更加方便的独立 `xrepo` 包管理器命令，来全局对包进行安装，卸载和查找管理。

详细文档见：[Xrepo 命令使用入门](/zh/guide/package-management/xrepo-cli)。

```sh
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

v2.2.3开始，支持添加指定分支的repo，例如：

```sh
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git dev
```

:::tip 注意
我们也可以添加本地仓库路径，即使没有git也是可以支持的，用于在本地快速的调试repo中的包。
:::

我们也可以移除已安装的某个仓库：

```sh
$ xmake repo --remove myrepo
```

或者查看所有已添加的仓库：

```sh
$ xmake repo --list
```

如果远程仓库有更新，可以手动执行仓库更新，来获取更多、最新的包：

```sh
$ xmake repo -u
```

