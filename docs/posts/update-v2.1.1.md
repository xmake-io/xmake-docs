---
title: xmake v2.1.1 released, support golang, dlang and rust languages
tags: [xmake, lua, version, golang, rust, dlang]
date: 2017-03-04
author: Ruki
---

### New features

* Add `--links`, `--linkdirs` and `--includedirs` configure arguments
* Add app2ipa plugin
* Add dictionary syntax style for `xmake.lua`
* Provide smart scanning and building mode without `xmake.lua`
* Add `set_xmakever` api for `xmake.lua`
* Add `add_frameworks` api for `objc` and `swift`
* Support multi-languages extension and add `golang`, `dlang` and `rust` language
* Add optional `target_end`, `option_end`, `task_end` apis for scope
* Add `golang`, `dlang` and `rust` project templates

### Changes

* Support vs2017 for the project plugin
* Improve gcc error and warning tips
* Improve lanuage module
* Improve print interface, support lua print and format output
* Automatically scan project files and generate it for building if xmake.lua not exists
* Modify license to Apache License 2.0
* Remove some binary tools
* Remove install.bat script and provide nsis install package
* Rewrite [documents](https://xmake.io/) using [docute](https://github.com/egoist/docute)
* Improve `os.run`, `os.exec`, `os.cp`, `os.mv` and `os.rm` interfaces and support wildcard pattern
* Optimize the output info and add `-q|--quiet` option
* Improve makefile generator, uses $(XX) variables for tools and flags

### Bugs fixed

* [#41](https://github.com/waruqi/xmake/issues/41): Fix checker bug for windows 
* [#43](https://github.com/waruqi/xmake/issues/43): Avoid to generate unnecessary .xmake directory  
* Add c++ stl search directories for android
* Fix compile error for rhel 5.10
* Fix `os.iorun` bug