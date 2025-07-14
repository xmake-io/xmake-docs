---
title: xmake v2.1.6 released, fix some bugs
tags: [xmake, lua, released]
date: 2017-08-16
author: Ruki
---

This release fixed some bugs and improve some compilation problem.

If you want to known more usage, please see [online documents](https://xmake.io)。

Source code: [Github](https://github.com/xmake-io/xmake), [Gitee](https://gitee.com/tboox/xmake).

### Changes

* Improve `add_files` to configure the compile option of the given files
* Inherit links and linkdirs from the dependent targets and options
* Improve `target.add_deps` and add inherit config, .e.g `add_deps("test", {inherit = false})`
* Remove the binary files of `tbox.pkg`
* Use `/Zi` instead of `/ZI` for msvc

### Bugs fixed

* Fix target deps
* Fix `target:add` and `option:add` bug
* Fix compilation and installation bug on archlinux

### Usage Video

<script type="text/javascript" src="https://asciinema.org/a/133693.js" id="asciicast-133693" async></script>
