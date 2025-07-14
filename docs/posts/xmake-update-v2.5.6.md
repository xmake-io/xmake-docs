---
title: xmake v2.5.6 released, Improve compatibility of pre-compiled binary package
tags: [xmake, lua, C/C++, mirror, package]
date: 2021-07-26
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) is a lightweight cross-platform build tool based on Lua. It uses xmake.lua to maintain project builds. Compared with makefile/CMakeLists.txt, the configuration syntax is more Concise and intuitive, it is very friendly to novices, and you can get started quickly in a short time, allowing users to focus more on actual project development.

This is a stability fix version, which mainly fixes and improves some compatibility issues related to pre-compiled binary packages. In addition, some useful interfaces have been added to set the default compilation platform, architecture and mode, as well as the allowed compilation platform, architecture list, and so on.

* [Github](https://github.com/xmake-io/xmake)
* [Document](https://xmake.io/)

## New feature introduction

### Fix windows precompiled package compatibility

The previous version provided preliminary support for the installation of pre-compiled packages under Windows, but because the compatibility of the toolset version was not considered, if the user's VS version is too low, link problems will occur when the package is integrated.

According to the official description of ms, the binary library of msvc is backward compatible with the version of toolset. [https://docs.microsoft.com/en-us/cpp/porting/binary-compat-2015-2017?view=msvc-160](https://xmake.io)

> You can mix binaries built by different versions of the v140, v141, and v142 toolsets. However, you must link by using a toolset at least as recent as the most recent binary in your app. Here's an example: you can link an app compiled using any 2017 toolset (v141, versions 15.0 through 15.9) to a static library compiled using, say, Visual Studio 2019 version 16.2 (v142), if they're linked using a version 16.2 or later toolset. You can link a version 16.2 library to a version 16.4 app as long as you use a 16.4 or later toolset.

In other words, the cloud uses the library compiled by v141, and the user's msvc toolset can be compatible and supported as long as it is >=141.

Therefore, we have improved the pre-compilation logic of the cloud, and pre-compiled the two toolsets of vs2015/14.16 and vs2019/14.29 respectively, and then xmake will select the best compatible version library to download and integrate according to the user's msvc version of toolset.








### set_defaultplat

#### Set the default compilation platform

Only supported by v2.5.6 and above, it is used to set the default compilation platform of the project. If it is not set, the default platform follows the current system platform, which is os.host().

For example, the default compilation platform on macOS is macosx, if the current project is an ios project, you can set the default compilation platform to iphoneos.

```lua
set_defaultplat("iphoneos")
```

It is equivalent to `xmake f -p iphoneos`.

### set_defaultarch

#### Set the default compilation architecture

Only supported by v2.5.6 and above, it is used to set the default compilation architecture of the project. If it is not set, the default platform follows the current system architecture, which is os.arch().

```lua
set_defaultplat("iphoneos")
set_defaultarch("arm64")
```

It is equivalent to `xmake f -p iphoneos -a arm64`.

We can also set the default architecture under multiple platforms.

```lua
set_defaultarch("iphoneos|arm64", "windows|x64")
```

The arm64 architecture is compiled by default on iphoneos, and the x64 architecture is compiled by default on windows.

### set_defaultmode

#### Set the default compilation mode

Only supported by v2.5.6 and above, it is used to set the default compilation mode of the project. If it is not set, the default is to compile in release mode.

```lua
set_defaultmode("releasedbg")
```

It is equivalent to `xmake f -m releasedbg`.

### set_allowedplats

#### Set the list of platforms allowed to compile

It is only supported by v2.5.6 and above. It is used to set the list of compilation platforms supported by the project. If the user specifies other platforms, an error will be prompted. This is usually used to restrict the user from specifying the wrong invalid platform.

If it is not set, then there are no platform restrictions.

```lua
set_allowedplats("windows", "mingw")
```

Set the current project to only support windows and mingw platforms.

### set_allowedarchs

#### Set the platform architecture that allows compilation

Only supported by v2.5.6 and above. It is used to set the list of compiled architectures supported by the project. If the user specifies other architectures, an error will be prompted. This is usually used to restrict users from specifying incorrect invalid architectures.

If it is not set, then there are no architectural restrictions.

```lua
set_allowedarchs("x64", "x86")
```

The current project only supports x64/x86 platforms.

We can also specify the list of architectures allowed under multiple platforms at the same time.

```lua
set_allowedarchs("windows|x64", "iphoneos|arm64")
```

Set the current project to only support x64 architecture on windows, and only support arm64 architecture on iphoneos.

### set_allowedmodes

#### Set the list of allowed compilation modes

It is only supported by v2.5.6 and above. It is used to set the list of compilation modes supported by the project. If the user specifies other modes, an error will be prompted. This is usually used to restrict the user from specifying incorrect invalid modes.

If it is not set, then there is no mode restriction.

```lua
set_allowedmodes("release", "releasedbg")
```

Set the current project to only support the two compilation modes release/releasedbg.

## Changelog

### New features

* [#1483](https://github.com/xmake-io/xmake/issues/1483): Add `os.joinenvs()` and improve package tools envirnoments
* [#1523](https://github.com/xmake-io/xmake/issues/1523): Add `set_allowedmodes`, `set_allowedplats` and `set_allowedarchs`
* [#1523](https://github.com/xmake-io/xmake/issues/1523): Add `set_defaultmode`, `set_defaultplat` and `set_defaultarch`

### Change

* Improve vs/vsxmake project generator to support vs2022
* [#1513](https://github.com/xmake-io/xmake/issues/1513): Improve precompiled binary package compatibility on windows/msvc
* Improve to find vcpkg root directory on windows
* Improve to support Qt6

### Bugs fixed

* [#489](https://github.com/xmake-io/xmake-repo/pull/489): Fix run os.execv with too long envirnoment value on windows
