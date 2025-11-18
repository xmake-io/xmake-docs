# 仓库管理命令 {#repository-management}

::: warning 重要提示
**`xmake repo` 仅用于当前工程下的本地包仓库管理**，作用域限制在当前项目内。

如果需要**全局管理仓库**（添加、删除、查看仓库），应该使用 **`xrepo` CLI** 命令，例如：
- `xrepo add-repo myrepo https://github.com/mygroup/myrepo` - 全局添加仓库
- `xrepo rm-repo myrepo` - 全局删除仓库
- `xrepo list-repo` - 查看所有全局仓库

详细文档见：[Xrepo 命令使用入门](/zh/guide/package-management/xrepo-cli)。
:::

我们可以使用 `xmake repo` 来管理**当前工程**的仓库，同时也提供了更为便捷的独立 `xrepo` 包管理器命令，用于**全局**安装、卸载和查找包。

```sh
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

从 v2.2.3 开始，支持添加指定分支的 repo，例如：

```sh
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git dev
```

::: tip 注意
我们也可以添加本地仓库路径，即使没有 git 也可以支持，用于在本地快速调试 repo 中的包。
:::

我们也可以移除已安装的某个仓库：

```sh
$ xmake repo --remove myrepo
```

或者查看所有已添加的仓库：

```sh
$ xmake repo --list
```

如果远程仓库有更新，可以手动执行仓库更新，以获取更多、最新的包：

```sh
$ xmake repo -u
```

