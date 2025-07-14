---
title: xmake v2.0.1 update!
tags: [xmake, plugin, task, macro, update]
date: 2016-06-09
author: Ruki
---

[Sources](https://github.com/waruqi/xmake)

# Changelog

### New features

* Add task api for running custom tasks
* Add plugin expansion and provide some builtin plugins
* Add export ide project plugin(.e.g makefile and will support to export other projects for vs, xcode in feature)
* Add demo plugin for printing 'hello xmake'
* Add make doxygen documents plugin
* Add macro script plugin
* Add more modules for developing plugin
* Add exception using try/catch and simplify grammar for plugin script
* Add option bindings
* Show progress when building

### Changes

* Rewrite interpreter for xmake.lua
* More strict syntax detection mechanism
* More strict api scope for xmake.lua 
* Simplify template development
* Extend platforms, tools, templates and actions fastly
* Simplify api and support import modules
* Remove dependence for gnu make/nmake, no longer need makefile
* Optimize speed for building and faster x4 than v1.0.4
* Optimize automatic detection 
* Modify some api name, but be compatible with the old version
* Optimize merging static library
* Simplify cross compilation using argument `--sdk=xxx`
* Simplify boolean option for command line, .e.g `xmake config --xxx=[y|n|yes|no|true|false]`
* Merge iphoneos and iphonesimulator platforms
* Merge watchos and watchsimulator platformss

### Bugs fixed

* [#3](https://github.com/waruqi/xmake/issues/3): ArchLinux compilation failed
* [#4](https://github.com/waruqi/xmake/issues/4): Install failed for windows
* Fix envirnoment variable bug for windows
