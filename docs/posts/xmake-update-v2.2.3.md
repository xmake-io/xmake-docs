---
title: xmake v2.2.3, A lot of new features support
tags: [xmake, lua, C/C++, Package]
date: 2018-11-30
author: Ruki
---

This version is mainly to improve the remote dependency package management, fix a lot of details, and this version can already support the upgrade from my upgrade through `xmake update`, it will be more convenient to upgrade xmake later.

* [Github](https://github.com/xmake-io/xmake)
* [Documents](https://xmake.io)

### New features

* [#233](https://github.com/xmake-io/xmake/issues/233): Support windres for mingw platform
* [#239](https://github.com/xmake-io/xmake/issues/239): Add cparser compiler support
* Add plugin manager `xmake plugin --help`
* Add `add_syslinks` api to add system libraries dependence
* Add `xmake l time xmake [--rebuild]` to record compilation time
* [#250](https://github.com/xmake-io/xmake/issues/250): Add `xmake f --vs_sdkver=10.0.15063.0` to change windows sdk version
* Add `lib.luajit.ffi` and `lib.luajit.jit` extension modules
* [#263](https://github.com/xmake-io/xmake/issues/263): Add new target kind: object to only compile object files

### Changes

* [#229](https://github.com/xmake-io/xmake/issues/229): Improve to select toolset for vcproj plugin
* Improve compilation dependences
* Support *.xz for extractor
* [#249](https://github.com/xmake-io/xmake/pull/249): revise progress formatting to space-leading three digit percentages 
* [#247](https://github.com/xmake-io/xmake/pull/247): Add `-D` and `--diagnosis` instead of `--backtrace`
* [#259](https://github.com/xmake-io/xmake/issues/259): Improve on_build, on_build_file and on_xxx for target and rule
* [#269](https://github.com/xmake-io/xmake/issues/269): Clean up the temporary files at last 30 days
* Improve remote package manager
* Support to add packages with only header file
* Support to modify builtin package links, e.g. `add_packages("xxx", {links = {}})`

### Bugs fixed

* Fix state inconsistency after failed outage of installation dependency package