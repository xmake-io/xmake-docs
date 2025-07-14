---
title: xmake v2.1.8 released, improve IDE/Editor plugin integration
tags: [xmake, lua, update]
date: 2017-11-08
author: Ruki
---

This release improve IDE/Editor plugin integration, we provide the following plugins now:

- Vim Editor Plugin
  - [xmake.vim](https://github.com/luzhlon/xmake.vim) (third-party, thanks [@luzhlon](https://github.com/luzhlon))
- Visual Studio Code Editor Plugin ([xmake-vscode](https://github.com/xmake-io/xmake-vscode))
- Sublime Text Editor Plugin ([xmake-sublime](https://github.com/xmake-io/xmake-sublime))
- IntelliJ-based IDE Plugin ([xmake-idea](https://github.com/xmake-io/xmake-idea))
  - IntelliJ-IDEA 
  - CLion 
  - Android Studio 

If you want to known more usage, please see [online documents](https://xmake.io/)。

Source code: [Github](https://github.com/xmake-io/xmake), [Gitee](https://gitee.com/tboox/xmake).

### New features

* Add `XMAKE_LOGFILE` environment variable to dump the output info to file
* Support tinyc compiler

### Changes

* Improve support for IDE/editor plugins (.e.g vscode, sublime, intellij-idea)
* Add `.gitignore` file when creating new projects
* Improve to create template project
* Improve to detect toolchains on macosx without xcode
* Improve `set_config_header` to support `set_config_header("config", {version = "2.1.8", build = "%Y%m%d%H%M"})`

### Bugs fixed

* [#145](https://github.com/xmake-io/xmake/issues/145): Fix the current directory when running target