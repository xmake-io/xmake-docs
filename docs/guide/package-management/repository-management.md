
# Repository Management

We can use `xmake repo` to manage repositories, and we also provide a more convenient independent `xrepo` package manager command to install, uninstall, find and manage packages globally.

For detailed documentation, see: [Getting Started with Xrepo Commands](/guide/package-management/xrepo-cli)

```sh
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

We can also remove a repository that has already been installed:

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

