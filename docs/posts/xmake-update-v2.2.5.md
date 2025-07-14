---
title: xmake v2.2.5, More complete package dependency management
tags: [xmake, lua, C/C++, Package]
date: 2019-03-29
author: Ruki
---

This version took more than four months to refactor and improve the package dependency management. 
The official repository added common packages such as mysql and ffmpeg, and added a lot of features.

* [Github](https://github.com/xmake-io/xmake)
* [Documents](https://xmake.io)

### New features

* Add `string.serialize` and `string.deserialize` to serialize and deserialize object, function and others.
* Add `xmake g --menu`
* [#283](https://github.com/xmake-io/xmake/issues/283): Add `target:installdir()` and `set_installdir()` api for target
* [#260](https://github.com/xmake-io/xmake/issues/260): Add `add_platformdirs` api, we can define custom platforms
* [#310](https://github.com/xmake-io/xmake/issues/310): Add theme feature
* [#318](https://github.com/xmake-io/xmake/issues/318): Add `add_installfiles` api to target
* [#339](https://github.com/xmake-io/xmake/issues/339): Improve `add_requires` and `find_package` to integrate the 3rd package manager
* [#327](https://github.com/xmake-io/xmake/issues/327): Integrate with Conan package manager 
* Add the builtin api `find_packages("pcre2", "zlib")` to find multiple packages
* [#320](https://github.com/xmake-io/xmake/issues/320): Add template configuration files and replace all variables before building
* [#179](https://github.com/xmake-io/xmake/issues/179): Generate CMakelist.txt file for `xmake project` plugin
* [#361](https://github.com/xmake-io/xmake/issues/361): Support vs2019 preview
* [#368](https://github.com/xmake-io/xmake/issues/368): Support `private, public, interface` to improve dependency inheritance like cmake
* [#284](https://github.com/xmake-io/xmake/issues/284): Add passing user configs description for `package()`
* [#319](https://github.com/xmake-io/xmake/issues/319): Add `add_headerfiles` to improve to set header files and directories
* [#342](https://github.com/xmake-io/xmake/issues/342): Add some builtin help functions for `includes()`, e.g. `check_cfuncs`

### Changes

* Improve to switch version and debug mode for the dependent packages
* [#264](https://github.com/xmake-io/xmake/issues/264): Support `xmake update dev` on windows
* [#293](https://github.com/xmake-io/xmake/issues/293): Add `xmake f/g --mingw=xxx` configuration option and improve to find_mingw
* [#301](https://github.com/xmake-io/xmake/issues/301): Improve precompiled header file
* [#322](https://github.com/xmake-io/xmake/issues/322): Add `option.add_features`, `option.add_cxxsnippets` and `option.add_csnippets`
* Remove some deprecated interfaces of xmake 1.x, e.g. `add_option_xxx`
* [#327](https://github.com/xmake-io/xmake/issues/327): Support conan package manager for `lib.detect.find_package` 
* Improve `lib.detect.find_package` and add builtin `find_packages("zlib 1.x", "openssl", {xxx = ...})` api
* Mark `set_modes()` as deprecated, we use `add_rules("mode.debug", "mode.release")` instead of it
* [#353](https://github.com/xmake-io/xmake/issues/353): Improve `target:set`, `target:add` and add `target:del` to modify target configuration
* [#356](https://github.com/xmake-io/xmake/issues/356): Add `qt_add_static_plugins()` api to support static Qt sdk
* [#351](https://github.com/xmake-io/xmake/issues/351): Support yasm for generating vs201x project
* Improve the remote package manager.

### Bugs fixed

* Fix cannot call `set_optimize()` to set optimization flags when exists `add_rules("mode.release")`
* [#289](https://github.com/xmake-io/xmake/issues/289): Fix unarchive gzip file failed on windows
* [#296](https://github.com/xmake-io/xmake/issues/296): Fix `option.add_includedirs` for cuda
* [#321](https://github.com/xmake-io/xmake/issues/321): Fix find program bug with $PATH envirnoment
