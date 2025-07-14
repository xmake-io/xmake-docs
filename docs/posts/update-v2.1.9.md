---
title: xmake v2.1.9 released, provide user custom menu config
tags: [xmake, lua, update]
date: 2018-02-03
author: Ruki
---

This release provide user custom menu config, like `make menuconfig` for linux:

<img src="/assets/img/posts/xmake/menuconf.gif">

If you want to known more usage, please see [online documents](https://xmake.io/)。

Source code: [Github](https://github.com/xmake-io/xmake), [Gitee](https://gitee.com/tboox/xmake).

### New features

* Add `del_files()` api to delete files in the files list
* Add `rule()`, `add_rules()` api to implement the custom build rule and improve `add_files("src/*.md", {rule = "markdown"})`
* Add `os.filesize()` api
* Add `core.ui.xxx` cui components
* Add `xmake f --menu` to configure project with a menu configuration interface
* Add `set_values` api to `option()`
* Support to generate a menu configuration interface from user custom project options
* Add source file position to interpreter and search results in menu

### Changes

* Improve to configure cross-toolchains, add tool alias to support unknown tool name, .e.g `xmake f --cc=gcc@ccmips.exe`
* [#151](https://github.com/xmake-io/xmake/issues/151): Improve to build the share library for the mingw platform
* Improve to generate makefile plugin
* Improve the checking errors tips
* Improve `add_cxflags` .., force to set flags without auto checking: `add_cxflags("-DTEST", {force = true})`
* Improve `add_files`, add force block to force to set flags without auto checking: `add_files("src/*.c", {force = {cxflags = "-DTEST"}})`
* Improve to search the root project directory
* Improve to detect vs environment
* Upgrade luajit to 2.1.0-beta3
* Support to run xmake on linux (arm, arm64)
* Improve to generate vs201x project plugin

### Bugs fixed

* Fix complation dependence
* [#151](https://github.com/xmake-io/xmake/issues/151): Fix `os.nuldev()` for gcc on mingw
* [#150](https://github.com/xmake-io/xmake/issues/150): Fix the command line string limitation for `ar.exe`
* Fix `xmake f --cross` error
* Fix `os.cd` to the windows root path bug

### New features introduction

#### Add config options in menu 

configuration menu:

- root menu
  - test1
  - test2
  - test3
    - test3
  - test4


<img src="/assets/img/posts/xmake/option_set_category.gif">





```lua
-- 'boolean' option
option("test1")
    set_default(true)
    set_showmenu(true)
    set_category("root menu/test1")

-- 'choice' option with values: "a", "b", "c"
option("test2")
    set_default("a")
    set_values("a", "b", "c")
    set_showmenu(true)
    set_category("root menu/test2")

-- 'string' option
option("test3")
    set_default("xx")
    set_showmenu(true)
    set_category("root menu/test3/test3")

-- 'number' option
option("test4")
    set_default(6)
    set_showmenu(true)
    set_category("root menu/test4")
```



#### Search configuration

<img src="/assets/img/posts/xmake/searchconf.gif">
