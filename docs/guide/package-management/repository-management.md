# Repository Management

::: warning Important Note
**`xmake repo` is only used for local package repository management within the current project**, scoped to the current project.

If you need to **manage repositories globally** (add, remove, view repositories), you should use the **`xrepo` CLI** command, for example:
- `xrepo add-repo myrepo https://github.com/mygroup/myrepo` - Add repository globally
- `xrepo rm-repo myrepo` - Remove repository globally
- `xrepo list-repo` - View all global repositories

For detailed documentation, see: [Getting Started with Xrepo Commands](/guide/package-management/xrepo-cli)
:::

We can use `xmake repo` to manage repositories for the **current project**, and we also provide a more convenient, independent `xrepo` package manager command to install, uninstall, find, and manage packages **globally**.

```sh
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

We can also remove a repository that has already been added:

```sh
$ xmake repo --remove myrepo
```

Or view all the added repositories:

```sh
$ xmake repo --list
```

If the remote repository has updates, you can manually perform a repository update to get more and the latest packages:

```sh
$ xmake repo -u
```

