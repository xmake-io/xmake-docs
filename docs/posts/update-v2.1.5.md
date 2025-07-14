---
title: xmake v2.1.5 released, lots of new feature updates
tags: [xmake, lua, version, precompiled_header, compiler, cmake]
date: 2017-08-05
author: Ruki
---

This release introduces a number of new feature updates, as detailed in [Some new features of xmake v2.1.5](http://tboox.org/2017/07/29/new-features-v2.1.5/).

If you want to known more usage, please see [online documents](https://xmake.io)。

Source code: [Github](https://github.com/xmake-io/xmake), [Gitee](https://gitee.com/tboox/xmake).

### New features

* [#83](https://github.com/xmake-io/xmake/issues/83): Add `add_csnippet` and `add_cxxsnippet` into `option` for detecting some compiler features.
* [#83](https://github.com/xmake-io/xmake/issues/83): Add user extension modules to detect program, libraries and files.
* Add `find_program`, `find_file`, `find_library`, `find_tool` and `find_package` module interfaces.
* Add `net.*` and `devel.*` extension modules
* Add `val()` api to get the value of builtin-variable, .e.g `val("host")`, `val("env PATH")`, `val("shell echo hello")` and `val("reg HKEY_LOCAL_MACHINE\\XX;Value")`
* Support to compile the microsoft resource file (.rc)
* Add `has_flags`, `features` and `has_features` for detect module interfaces.
* Add `option.on_check`, `option.after_check` and `option.before_check` api
* Add `target.on_load` api
* [#132](https://github.com/xmake-io/xmake/issues/132): Add `add_frameworkdirs` api
* Add `lib.detect.has_xxx` and `lib.detect.find_xxx` apis.
* Add `add_moduledirs` api
* Add `includes` api instead of `add_subdirs` and `add_subfiles`
* [#133](https://github.com/xmake-io/xmake/issues/133): Improve the project plugin to generate `compile_commands.json` by run  `xmake project -k compile_commands`
* Add `set_pcheader` and `set_pcxxheader` to support the precompiled header, support gcc, clang, msvc
* Add `xmake f -p cross` platform and support the custom platform

### Changes

* [#87](https://github.com/xmake-io/xmake/issues/87): Add includes and links from target deps automatically 
* Improve `import` to load user extension and global modules
* [#93](https://github.com/xmake-io/xmake/pull/93): Improve `xmake lua` to run a single line command
* Improve to print gcc error and warning info
* Improve `print` interface to dump table
* [#111](https://github.com/xmake-io/xmake/issues/111): Add `--root` common option to allow run xmake command as root
* [#113](https://github.com/xmake-io/xmake/pull/113): Privilege manage when running as root, store the root privilege and degrade.
* Improve `xxx_script` in `xmake.lua` to support pattern match, .e.g `on_build("iphoneos|arm*", function (target) end)`
* improve builtin-variables to support to get the value envirnoment and registry
* Improve to detect vstudio sdk and cross toolchains envirnoment
* [#71](https://github.com/xmake-io/xmake/issues/71): Improve to detect compiler and linker from env vars
* Improve the option detection (cache and multi-jobs) and increase 70% speed
* [#129](https://github.com/xmake-io/xmake/issues/129): Check link deps and cache the target file
* Support `*.asm` source files for vs201x project plugin
* Mark `add_bindings` and `add_rbindings` as deprecated
* Optimize `xmake rebuild` speed on windows
* Move `core.project.task` to `core.base.task`
* Move `echo` and `app2ipa` plugins to [xmake-plugins](https://github.com/xmake-io/xmake-plugins) repo.
* Add new api `set_config_header("config.h", {prefix = ""})` instead of `set_config_h` and `set_config_h_prefix`

### Bugs fixed

* Fix `try-catch-finally`
* Fix interpreter bug when parsing multi-level subdirs
* [#115](https://github.com/xmake-io/xmake/pull/115): Fix the path problem of the install script `get.sh`
* Fix cache bug for import()