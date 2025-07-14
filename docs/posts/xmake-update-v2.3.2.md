---
title: xmake v2.3.2, Build as fast as ninja
tags: [xmake, lua, C/C++, ninja]
date: 2020-03-28
author: Ruki
---

This version focuses on refactoring and optimization of the internal parallel build mechanism, enabling parallel compilation of source files between multiple targets, and support for parallel links. It also optimizes some internal losses of xmake and fixes some bugs that affect compilation speed.
Through testing and comparison, the current overall build speed is basically the same as ninja. Compared to cmake/make, meson/ninja is much faster, because they have an extra step to generate makefile / build.ninja.

In addition, xmake also adds support for the sdcc compilation toolchain for compiling embedded programs such as 51/stm8.

* [Github](https://github.com/xmake-io/xmake)
* [Documents](https://xmake.io)

## Some optimizations

1. All source files between multiple targets are built in parallel at the same time (previously, they cannot cross targets, and will be blocked by links in the middle of serialization)
2. Multiple independent target links can be executed in parallel (previously only one link could be executed)
3. Fix previous task scheduling bug, more fine-grained scheduling, make full use of CPU core resources
4. Optimize some losses on xmake's internal api, this effect is also obvious

For more optimization details, please see: [issue #589](https://github.com/xmake-io/xmake/issues/589)

## Build speed comparison

We did some comparison tests on termux and macOS. The test project is at: [xmake-core](https://github.com/xmake-io/xmake/tree/master/core)

For a relatively large number of target projects, the new version of xmake improves its build speed even more.

### Multi-task parallel compilation

| buildsystem     | Termux (8core/-j12) | buildsystem      | MacOS (8core/-j12) |
|-----            | ----                | ---              | ---                |
|xmake            | 24.890s             | xmake            | 12.264s            |
|ninja            | 25.682s             | ninja            | 11.327s            |
|cmake(gen+make)  | 5.416s+28.473s      | cmake(gen+make)  | 1.203s+14.030s     |
|cmake(gen+ninja) | 4.458s+24.842s      | cmake(gen+ninja) | 0.988s+11.644s     |

### Single task compilation

| buildsystem     | Termux (-j1)     | buildsystem      | MacOS (-j1)    |
|-----            | ----             | ---              | ---            |
|xmake            | 1m57.707s        | xmake            | 39.937s        |
|ninja            | 1m52.845s        | ninja            | 38.995s        |
|cmake(gen+make)  | 5.416s+2m10.539s | cmake(gen+make)  | 1.203s+41.737s |
|cmake(gen+ninja) | 4.458s+1m54.868s | cmake(gen+ninja) | 0.988s+38.022s |








### New features

* Add powershell theme for powershell terminal
* Add `xmake --dry-run -v` to dry run building target and only show verbose build command.
* [#712](https://github.com/xmake-io/xmake/issues/712): Add sdcc platform and support sdcc compiler

### Change

* [#589](https://github.com/xmake-io/xmake/issues/589): Improve and optimize build speed, supports parallel compilation and linking across targets
* Improve the ninja/cmake generator
* [#728](https://github.com/xmake-io/xmake/issues/728): Improve os.cp to support reserve source directory structure
* [#732](https://github.com/xmake-io/xmake/issues/732): Improve find_package to support `homebrew/cmake` pacakges
* [#695](https://github.com/xmake-io/xmake/issues/695): Improve android abi

### Bugs fixed

* Fix the link errors output issues for msvc
* [#718](https://github.com/xmake-io/xmake/issues/718): Fix download cache bug for package
* [#722](https://github.com/xmake-io/xmake/issues/722): Fix invalid package deps
* [#719](https://github.com/xmake-io/xmake/issues/719): Fix process exit bug
* [#720](https://github.com/xmake-io/xmake/issues/720): Fix compile_commands generator
