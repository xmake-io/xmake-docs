---
title: xmake v2.3.5 released, Multi-toolchain flexible switching support
tags: [xmake, lua, C/C++, toolchains, cross-compilation]
date: 2020-06-28
author: Ruki
---

The main work of this version is to continue to improve the support of the tool chain. Although the previous version achieved modular tool chain extension through refactoring, for one compilation, I want to flexibly switch the compilation on the cross tool chain/Host tool chain. Not very good support, so this version focuses on improving the support of this piece.

In addition, this version also improves the problem of slow downloading of remote dependent packages integrated using `add_requires`, adding proxy settings and local package retrieval multiplexing support to improve this problem. Of course, the best way is to get a domestic CDN to speed up the download, but this cost is too high, for the time being not toss.

There are some minor changes and bug fixes, you can see the updated content at the bottom of the article.

* [Github](https://github.com/xmake-io/xmake)
* [Documents](https://xmake.io)

## Introduction of New Features

### Multi-toolchain flexible switching

For an example of this, please refer to the luajit project. The compilation process needs to first compile the two targets minilua/buildvm under the host platform, and then generate the jit code corresponding to the target platform through minilua/buildvm to participate in the compilation of the overall luajit library.

Therefore, the entire compilation process needs to use the host tool chain for a specific target, and then use the cross tool chain to complete the compilation for other targets.

So how should we configure xmake.lua to achieve this way, one is to set the specified host toolchain for a specific target through the `set_toolchains` interface, for example:


```lua
target("buildvm")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("xcode", {plat = os.host(), arch = os.arch()})

target("luajit")
    set_kind("static")
    add_deps("buildvm")
    add_files("src/*.c")
```

If you are currently in cross-compilation mode, even if you execute the following command to configure the android compilation platform, its buildvm is still using xcode to compile the macOS target program, only the luajit library is compiled using the ndk toolchain:

```console
$ xmake f -p android --ndk=/xxxx
```


However, this is not particularly convenient, especially when cross-platform compilation, pc tool chains of different platforms are different, there are msvc, xcode, clang, etc., you need to judge the platform to specify.

We can also continue to generalize and let xmake automatically select the currently available Host toolchain for different platforms, instead of explicitly specifying a specific toolchain, and improve it to the following version:

```lua
target("buildvm")
    set_kind("binary")
    add_files("src/*.c")
    set_plat(os.host())
    set_host(os.arch())

target("luajit")
    set_kind("static")
    add_deps("buildvm")
    add_files("src/*.c")
```

By using [set_plat](https://xmake.io/#/manual/project_target#targetset_plat) and [set_arch](https://xmake.io/#/manual/project_target#targetset_arch) interface, directly set a specific target to the host platform, you can automatically select the host tool chain internally.

For a complete configuration example of this piece, you can refer to: https://github.com/xmake-io/xmake-repo/blob/master/packages/l/luajit/port/xmake.lua










## Remote package download optimization

If the download package is slow or fails due to an unstable network, we can use the following methods to resolve it.

### Manual download

By default, xmake will call curl, wget and other tools to download, users can also manually download with their own downloader (you can also use an agent), and put the downloaded package in their own directory, for example: `/download/packages/zlib -v1.0.tar.gz`

Then use the following command to set the search directory for package download:

```console
$ xmake g --pkg_searchdirs="/download/packages"
```

Then re-execute xmake to compile, xmake will first look for the source package from `/download/packages`, and then use it directly, no longer download it yourself.

As for the package name you are looking for, you can check it by the following command:

```console
$ xmake require --info zlib
-> searchdirs: /download/packages
-> searchnames: zlib-1.2.11.tar.gz
```

We can see the corresponding search directory and the searched package name.

### Proxy download

If manual downloading is still troublesome, we can also let xmake go directly to the agent.

```console
$ xmake g --proxy="socks5://127.0.0.1:1086"
$ xmake g --help
    -x PROXY, --proxy=PROXY Use proxy on given port. [PROTOCOL://]HOST[:PORT]
                                 e.g.
                                 -xmake g --proxy='http://host:port'
                                 -xmake g --proxy='https://host:port'
                                 -xmake g --proxy='socks5://host:port'
```

The `--proxy` parameter specifies the proxy protocol and address. The specific syntax can refer to curl. Usually, it can support http, https, socks5 and other protocols, but the actual support depends on curl, wget and git. For example, wget does not support the socks5 protocol.

We can use the following parameters to specify which hosts go to the proxy. If not set, the default is to go global.

```console
--proxy_hosts=PROXY_HOSTS Only enable proxy for the given hosts list, it will enable all if be unset,
                             and we can pass match pattern to list:
                                 e.g.
                                 -xmake g --proxy_hosts='github.com,gitlab.*,*.xmake.io'
```

If the hosts list is set, then the matching hosts in this list will go to the proxy. .

`--proxy_host` supports multiple hosts settings, separated by commas, and supports basic pattern matching *.github.com, and other lua pattern matching rules are also supported

If we feel that the above hosts mode configuration is not flexible enough, we can also follow pac's automatic proxy configuration rules:

```console
--proxy_pac=PROXY_PAC Set the auto proxy configuration file. (default: pac.lua)
                                     e.g.
                                     -xmake g --proxy_pac=pac.lua (in /Users/ruki/.xmake or absolute path)
                                     -function main(url, host)
                                           if host =='github.com' then
                                                return true
                                           end
                                       end
```

!> If there are proxy_hosts, host configuration is preferred, otherwise, pac configuration is used.

The default path of pac: ~/.xmake/pac.lua, if --proxy is set, and this file exists, it will automatically go to pac. If it does not exist, and there are no hosts, then the proxy will take effect globally.

You can also manually specify the pac full path

```console
$ xmake g --proxy_pac=/xxxx/xxxxx_pac.lua
```

Configuration rule description:

```lua
function main(url, host)
    if host:find("bintray.com") then
        return true
    end
end
```

If it returns true, then the url and host are the proxy to go, not to return or return false, it is not to proxy.

For specific details of this section, please see: [https://github.com/xmake-io/xmake/issues/854](https://github.com/xmake-io/xmake/issues/854)

!> In addition, in addition to relying on package downloads, other commands related to network downloads also support proxies, such as: `xmake update`

## Other small changes

### rc header file depends on compilation support

Although the rc compiler in msvc does not natively support the export of the `#include <xxx.h>` header file list in the .rc file, xmake still directly extracts the .rc source file by parsing it in a disguised way. The list is also extracted to achieve header file dependent compilation support.

Although it may not be accurate enough (the macro cannot be processed yet), it is basically usable.

### Improve mode.minsizerel compilation mode

The new version has the minimum compilation under msvc, and the `/GL` compilation option is turned on by default. The size of the target file is further optimized, and the optimization effect is relatively obvious.

For details about this, please refer to: [https://github.com/xmake-io/xmake/issues/835](https://github.com/xmake-io/xmake/issues/835)

### Improve protobuf rule support

The built-in `protobuf.cpp` compilation rule of xmake also supports the case of importing multi-level subdirectories in `*.proto`. Previously, only proto files at the same level could be used.

This is the case for `import common-files/b.proto`:

```
proto-files
    a.proto
    common-files
        b.proto
```

The corresponding xmake.lua configuration is as follows:


```lua
add_requires("protobuf-cpp")

target("test")
    set_kind("binary")
    set_languages("c++11")
    add_packages("protobuf-cpp")
    add_files("*.cpp")
    add_files("proto/**.proto", {rules = "protobuf.cpp", proto_rootdir = "proto"})
```

Compared to before, an additional `{proto_rootdir = ""}` configuration needs to be passed to specify the root directory of all protos relative to the import.

For details about this, see: [https://github.com/xmake-io/xmake/issues/828](https://github.com/xmake-io/xmake/issues/828)

## Changlog

### New features

* Add `xmake show -l envs` to show all builtin envirnoment variables
* [#861](https://github.com/xmake-io/xmake/issues/861): Support search local package file to install remote package
* [#854](https://github.com/xmake-io/xmake/issues/854): Support global proxy settings for curl, wget and git

### Change

* [#828](https://github.com/xmake-io/xmake/issues/828): Support to import sub-directory files for protobuf rules
* [#835](https://github.com/xmake-io/xmake/issues/835): Improve mode.minsizerel to add /GL flags for msvc
* [#828](https://github.com/xmake-io/xmake/issues/828): Support multi-level directories for protobuf/import
* [#838](https://github.com/xmake-io/xmake/issues/838#issuecomment-643570920): Support to override builtin-rules for `add_files("src/*.c", {rules = {"xx", override = true}})`
* [#847](https://github.com/xmake-io/xmake/issues/847): Support to parse include deps for rc file
* Improve msvc tool chain, remove the dependence of global environment variables
* [#857](https://github.com/xmake-io/xmake/pull/857): Improved `set_toolchains()` when cross-compilation is supported, specific target can be switched to host toolchain and compiled at the same time

### Bugs fixed

* Fix the progress bug for theme
* [#829](https://github.com/xmake-io/xmake/issues/829): Fix invalid sysroot path for macOS
* [#832](https://github.com/xmake-io/xmake/issues/832): Fix find_packages bug for the debug mode
