---
title: Xmake v2.6.5 released, Support remote compilation
tags: [xmake, lua, C/C++, cargo, rust, remote-compilation]
date: 2022-04-24
author: Ruki
outline: deep
---
## Introduction of new features

### Remote Compilation Support

The new version provides remote compilation support, which allows us to compile code on a remote server, run and debug remotely.

The server can be deployed on Linux/MacOS/Windows to enable cross-platform compilation, e.g. compile and run Windows programs on Linux and macOS/Linux programs on Windows.

It is more stable and smoother to use than ssh remote login compilation, no lagging of ssh terminal input due to network instability, and allows for quick local editing of code files.

We can even seamlessly implement remote compilation in editors and IDEs such as vs/sublime/vscode/idea without relying on the IDE's own support for remote compilation.

#### Start service

```console
$ xmake service
<remote_build_server>: listening 0.0.0.0:9096 ...
```

We can also turn on the service while displaying back detailed log messages.

```console
$ xmake service -vD
<remote_build_server>: listening 0.0.0.0:9096 ...
```

#### Start the service in Daemon mode

```console
$ xmake service --start
$ xmake service --restart
$ xmake service --stop
```

#### Configure the server

We start by running the `xmake service` command, which automatically generates a default `service.conf` configuration file, stored in `~/.xmake/service.conf`.

Then, we edit it to fix the server's listening port (optional).

```lua
{
    logfile = "/Users/ruki/.xmake/service/logs.txt",
    remote_build = {
        server = {
            listen = "0.0.0.0:9096"
        }
    }
}
```

#### Configure the client

We still edit this file `~/.xmake/service.conf` to configure the address of the server to which the client needs to connect.

```lua
{
    logfile = "/Users/ruki/.xmake/service/logs.txt",
    remote_build = {
        client = {
            connect = "192.168.56.101:9096",
        }
    }
}
```

#### Import the given configuration file

We can also import the given configuration file by using the following command.

```console
$ xmake service --config=/tmp/service.conf
```

#### Connect to the remote server

Next, we just need to go into the root directory of the project we need to compile remotely and execute the ``xmake service --connect`` command to make the connection.

```console
$ xmake create test
$ cd test
$ xmake service --connect 
<remote_build_client>: connect 192.168.56.110:9096 ...
<remote_build_client>: connected!
<remote_build_client>: sync files in 192.168.56.110:9096 ...
Scanning files ...
Comparing 3 files ...
    [+]: src/main.cpp
    [+]: .gitignore
    [+]: xmake.lua
3 files has been changed!
Archiving files .
Uploading files with 1372 bytes ...
<remote_build_client>: sync files ok!
```

#### Remote build project

Once the connection is successful, we can build remotely as if we were building locally as normal.

```console
$ xmake
<remote_build_client>: run xmake in 192.168.56.110:9096 ...
checking for platform ... macosx
checking for architecture ... ... x86_64
... checking for Xcode directory ... /Applications/Xcode.app
checking for Codesign Identity of Xcode ... Apple Development: waruqi@gmail.com (T3NA4MRVPU)
... checking for SDK version of Xcode for macosx (x86_64) ... 11.3
... checking for Minimal target version of Xcode for macosx (x86_64) ... 11.4
[ 25%]: ccache compiling.release src/main.cpp
[ 50%]: linking.release test
[ 100%]: build ok!
<remote_build_client>: run command ok!
```''








#### Running the target program remotely

We can also run a debug-compiled target program remotely, just as we can run a debug locally.

```console
$ xmake run
<remote_build_client>: run xmake run in 192.168.56.110:9096 ...
hello world!
<remote_build_client>: run command ok!
````

#### Rebuild project remotely

```console
$ xmake -rv
<remote_build_client>: run xmake -rv in 192.168.56.110:9096 ...
[ 25% ]: ccache compiling.release src/main.cpp
/usr/local/bin/ccache /usr/bin/xcrun -sdk macosx clang -c -Qunused-arguments -arch x86_64 -mmacosx-version-min=11.4 -isysroot /Applications/ Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX11.3.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -DNDEBUG -o build/.objs/test/macosx/x86_64/release/src/main.cpp.o src/main.cpp
[ 50%]: linking.release test
"/usr/bin/xcrun -sdk macosx clang++" -o build/macosx/x86_64/release/test build/.objs/test/macosx/x86_64/release/src/main.cpp.o -arch x86_ 64 -mmacosx-version-min=11.4 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX11.3 .sdk -stdlib=libc++ -Wl,-x -lz
[100%]: build ok!
<remote_build_client>: run command ok!
```''

#### Remote configuration of build parameters

```console
$ xmake f --xxx --yy
```

#### Manually synchronise project files

When you connect, the code is automatically synchronised once, and you can execute this command to manually synchronise the changed files if the code changes later.

```console
$ xmake service --sync
<remote_build_client>: sync files in 192.168.56.110:9096 ...
Scanning files ...
Comparing 3 files ...
    [+]: src/main.cpp
    [+]: .gitignore
    [+]: xmake.lua
3 files has been changed!
Archiving files .
Uploading files with 1372 bytes ...
<remote_build_client>: sync files ok!
```

#### Disconnect from a remote

This only affects the current project, other projects can still connect and build at the same time.

```console
$ xmake service --disconnect
<remote_build_client>: disconnect 192.168.56.110:9096 ...
<remote_build_client>: disconnected!
```

#### View server logs

```console
$ xmake service --logs
```

#### Clear the remote service cache and build files

We can also manually clean up any cache and build generated files for the remote.

```console
$ cd projectdir
$ xmake service --clean
```

### Improve Cargo package dependencies

In previous versions we have been able to integrate each cargo package individually via ``add_requires("cargo::base64")` for compiling rust projects, and for mixed compilation with C/C++, e.g.

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::base64 0.13.0")
add_requires("cargo::flate2 1.0.17", {configs = {features = "zlib"}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::base64", "cargo::flate2")
```


But there is a problem with the above approach.

If there are many dependencies and several dependencies all share a dependency on the same child dependency, then there will be a redefinition problem, so if we use the full Cargo.toml to manage the dependencies we won't have this problem.

For example

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::test", {configs = {cargo_toml = path.join(os.projectdir(), "Cargo.toml")}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::test")
```

We can then integrate all the required dependencies in Cargo.toml, leaving Rust to analyse the dependencies itself and avoid duplicate child dependency conflicts.

For a full example see: [cargo_deps_with_toml](https://github.com/xmake-io/xmake/blob/dev/tests/projects/rust/cargo_deps_with_toml/xmake.lua)

Of course, if the user has a single dependency, then the previous integration approach is still perfectly usable.

#### Why use Xmake to compile Rust?

At this point, one might ask why we need to configure xmake.lua when we are already using Cargo.toml and Cargo, and why not just compile Cargo?

If we are developing a C/C++ project in Xmake, but need to introduce some Rust submodules for use in the C/C++ project, this is a quick and easy way to call Rust libraries and code in C/C++.

For more instructions on calling Rust code libraries in C/C++, see: [Calling Rust in C/C++ using cxxbridge](https://xmake.io)

### Support for source file grouping

In this new version, we provide a new interface `add_filegroups` for grouping source files for presentation of project files generated by the vs/vsxmake/cmakelists generator.

If you don't set up grouping, Xmake will also display them in a tree-like pattern by default, but there are some extreme cases where the directory hierarchy doesn't display very well, e.g.

```lua
target("test")
    set_kind("binary")
    add_files("... /... /... /... /src/**.cpp")
```

![](/assets/img/manual/filegroup1.png)

Two main presentation modes are currently supported.

- plain: flat mode
- tree: tree display, this is also the default mode

It also supports the grouping of files added by `add_headerfiles`.

#### Set the file group and specifies the root directory

```lua
target("test")
    set_kind("binary")
    add_files(". /... /... /... /src/**.cpp")
    add_filegroups("group1/group2", {rootdir = "... /... /... /... /"})
```

![](/assets/img/manual/filegroup2.png)

#### Set the file group and specifies the file matching pattern

```lua
target("test")
    set_kind("binary")
    add_files("... /... /... /... /src/**.cpp")
    add_filegroups("group1/group2", {rootdir = "... /... /... /... /", files = {"src/**.cpp"}})
```

#### Show files as flat mode

In this mode, all source files ignore the nested directory hierarchy and are displayed at the same level under the grouping.

```lua
target("test")
    set_kind("binary")
    add_files(". /... /... /... /src/**.cpp")
    add_filegroups("group1/group2", {rootdir = "... /... /... /... /", mode = "plain"})
```

![](/assets/img/manual/filegroup3.png)

### Package versioning support for Git Commit

Xmake's package dependency management interface ``add_requires`` supports versioning semantics, branch selection, e.g.

```lua
add_requires("tbox 1.6.1")
add_requires("tbox >= 1.6.1")
add_requires("tbox master")
```

However, in previous versions, we didn't support selecting versions from Git Commit, and now we do.

```lua
add_requires("tbox e807230557aac69e4d583c75626e3a7ebdb922f8")
```

As long as, this package is configured with a Git url, you can select the version from Commit.

### Better support for iOS simulator compilation

If you want to compile a target application for the iOS platform, you can previously use the following configuration to compile the real and emulator versions of the application separately, simply by switching arch.

```bash
$ xmake f -p iphoneos [-a armv7|armv7s|arm64|i386|x86_64]
$ xmake
```

However, since the emulator on M1 devices also supports the arm64 architecture, it was no longer possible to distinguish an emulator from an arch.
Therefore, in this new version, we have added a new parameter to distinguish between emulator and emulator targets.

```bash
$ xmake f -p iphoneos --appledev=simulator
$ xmake f -p watchos --appledev=simulator
$ xmake f -p appletvos --appledev=simulator
```

And if you don't specify the `--appledev=` argument, the default is to compile the real program, but of course the previous modes are fully compatible.

## Changelog

### New features

* [#2138](https://github.com/xmake-io/xmake/issues/2138): Support template package
* [#2185](https://github.com/xmake-io/xmake/issues/2185): Add `--appledev=simulator` to improve apple simulator support
* [#2227](https://github.com/xmake-io/xmake/issues/2227): Improve cargo package with Cargo.toml file
* Improve `add_requires` to support git commit as version
* [#622](https://github.com/xmake-io/xmake/issues/622): Support remote compilation
* [#2282](https://github.com/xmake-io/xmake/issues/2282): Add `add_filegroups` to support file group for vs/vsxmake/cmake generator

### Changes

* [#2137](https://github.com/xmake-io/xmake/pull/2137): Improve path module
* Reduce 50% xmake binary size on macOS
* Improve tools/autoconf,cmake to support toolchain switching.
* [#2221](https://github.com/xmake-io/xmake/pull/2221): Improve registry api to support unicode
* [#2225](https://github.com/xmake-io/xmake/issues/2225): Support to parse import dependencies for protobuf
* [#2265](https://github.com/xmake-io/xmake/issues/2265): Sort CMakeLists.txt
* Speed up `os.files`

### Bugs fixed

* [#2233](https://github.com/xmake-io/xmake/issues/2233): Fix c++ modules deps
