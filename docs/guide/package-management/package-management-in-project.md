
# Package Management in Project

The package management command `$ xmake require` can be used to manually display the download, install, uninstall, retrieve, and view package information.

`xmake require` is only used for the current project. We also provide a more convenient independent `xrepo` package manager command to install, uninstall, find and manage packages globally.

For detailed documentation, see: [Getting Started with Xrepo Commands](/guide/package-management/xrepo-cli)

## Install the specified package

```sh
$ xmake require tbox
```

Install the specified version package:

```sh
$ xmake require tbox "~1.6"
```

Force a re-download of the installation and display detailed installation information:

```sh
$ xmake require -f -v tbox "1.5.x"
```

Pass additional setup information:

```sh
$ xmake require --extra="{debug=true,config={small=true}}" tbox
```

Install the debug package and pass the compilation configuration information of `small=true` to the package.

## Uninstall the specified package

```sh
$ xmake require --uninstall tbox
```

This will completely uninstall the removal package file.

## Show package information

```sh
$ xmake require --info tbox
```

## Search for packages in the current repository

```sh
$ xmake require --search tbox
```

This is to support fuzzy search and lua pattern matching search:

```sh
$ xmake require --search pcr
```

Will also search for pcre, pcre2 and other packages.

## List the currently installed packages

```sh
$ xmake require --list
```

