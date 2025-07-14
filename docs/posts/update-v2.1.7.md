---
title: xmake v2.1.7 released, fix some bugs and improve some details
tags: [xmake, lua, update]
date: 2017-10-13
author: Ruki
---

This release fix some bugs and improve some details. And provide [xmake-vscode](https://marketplace.visualstudio.com/items?itemName=tboox.xmake-vscode#overview) plugins to integrate vscode editor and xmake.

If you want to known more usage, please see [online documents](https://xmake.io)。

Source code: [Github](https://github.com/xmake-io/xmake), [Gitee](https://gitee.com/tboox/xmake).

### New features

* Add `add_imports` to bulk import modules for the target, option and package script
* Add `xmake -y/--yes` to confirm the user input by default
* Add `xmake l package.manager.install xxx` to install software package
* Add xmake plugin for vscode editor, [xmake-vscode](https://marketplace.visualstudio.com/items?itemName=tboox.xmake-vscode#overview)
* Add `xmake macro ..` to run the last command

### Changes

* Support 24bits truecolors for `cprint()`
* Support `@loader_path` and `$ORIGIN` for `add_rpathdirs()`
* Improve `set_version("x.x.x", {build = "%Y%m%d%H%M"})` and add build version
* Move docs directory to xmake-docs repo
* Improve install and uninstall actions and support DESTDIR and PREFIX envirnoment variables
* Optimize to detect flags
* Add `COLORTERM=nocolor` to disable color output
* Remove `and_bindings` and `add_rbindings` api
* Disable to output colors code to file
* Update project templates with tbox
* Improve `lib.detect.find_program` interface
* Enable colors output for windows cmd
* Add `-w|--warning` arguments to enable the warnings output

### Bugs fixed

* Fix `set_pcxxheader` bug
* [#140](https://github.com/xmake-io/xmake/issues/140): Fix `os.tmpdir()` in fakeroot
* [#142](https://github.com/xmake-io/xmake/issues/142): Fix `os.getenv` charset bug on windows
* Fix compile error with spaces path
* Fix setenv empty value bug