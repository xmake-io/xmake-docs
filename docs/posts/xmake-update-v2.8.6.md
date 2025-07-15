---
title: Xmake v2.8.6 released, New Packaging Plugin, XPack
tags: [xmake, lua, C/C++, package, performance, API, rust]
date: 2023-12-15
author: Ruki
---

## Introduction of new features

Before introducing new features, there is good news to tell you that the previous version of Xmake was included in the debian repository, and recently Xmake has entered the Fedora official repository. You can install Xmake directly on Fedora 39 through the following command.

```bash
$ sudo dnf install xmake
```

Many thanks to @topazus @mochaaP for their contribution to Xmake. For related information, see: [#941](https://github.com/xmake-io/xmake/issues/941).

Next, let’s introduce the heavyweight feature brought by the new version: XPack.

It is similar to CMake's CPack command, which can quickly package user projects to generate installation packages in various formats.

Currently Xmake's XPack already supports packaging in the following formats:

- nsis: executable installation package under Windows
- runself: shell self-compiled installation package
- targz: binary file tar.gz package (green version)
- zip: Binary file zip package (green version)
- srctargz: source file tar.gz package
- srczip: source file zip package
- srpm: rpm source code installation package
- rpm: rpm binary installation package

In addition to the above-mentioned supported packaging formats, package formats such as deb are also being gradually supported, and users can also configure and generate custom package format files.







### XPack packaging

Here is a complete example, we can take a brief look at it first:

```lua
set_version("1.0.0")
add_rules("mode.debug", "mode.release")

includes("@builtin/xpack")

target("test")
     set_kind("binary")
     add_files("src/*.cpp")

xpack("test")
     set_formats("nsis", "zip", "targz", "runself")
     set_title("hello")
     set_author("ruki")
     set_description("A test installer.")
     set_homepage("https://xmake.io")
     set_licensefile("LICENSE.md")
     add_targets("test")
     add_installfiles("src/(assets/*.png)", {prefixdir = "images"})
     add_sourcefiles("(src/**)")
     set_iconfile("src/assets/xmake.ico")

     after_installcmd(function (package, batchcmds)
         batchcmds:mkdir(package:installdir("resources"))
         batchcmds:cp("src/assets/*.txt", package:installdir("resources"), {rootdir = "src"})
         batchcmds:mkdir(package:installdir("stub"))
     end)

     after_uninstallcmd(function (package, batchcmds)
         batchcmds:rmdir(package:installdir("resources"))
         batchcmds:rmdir(package:installdir("stub"))
     end)
```

We introduce all configuration interfaces of xpack through `includes("@builtin/xpack")`, including the xpack configuration domain and all its domain interfaces.

Then we execute:

```bash
$xmakepack
```

All installation packages will be generated.

### Generate NSIS installation package

As long as you configure the `set_formats("nsis")` format and then execute the `xmake pack` command, you can generate an installation package in NSIS format.

In addition, xmake will also automatically install the tools required to generate NSIS packages to achieve true one-click packaging.

```bash
$xmakepack
note: install or modify (m) these packages (pass -y to skip confirm)?
in xmake-repo:
   -> nsis 3.09
please input: y (y/n/m)

   => install nsis 3.09 .. ok

[25%]: compiling.release src\main.cpp
[37%]: compiling.release src\main.cpp
[50%]: linking.release foo.dll
[62%]: linking.release test.exe
packing build\xpack\test\test-windows-x64-v1.0.0.exe
pack ok
```

`test-windows-x64-v1.0.0.exe` is the installation package we generated. Double-click to run it to install our binary files to the specified directory.

![](/assets/img/manual/nsis_1.png)
![](/assets/img/manual/nsis_2.png)
![](/assets/img/manual/nsis_3.png)

#### Add component installation

We can also add component installation commands to NSIS. Only when the user selects the specified component, its installation command will be executed.

```lua
xpack("test")
     add_components("LongPath")

xpack_component("LongPath")
     set_default(false)
     set_title("Enable Long Path")
     set_description("Increases the maximum path length limit, up to 32,767 characters (before 256).")
     on_installcmd(function (component, batchcmds)
         batchcmds:rawcmd("nsis", [[
   ${If} $NoAdmin == "false"
     ; Enable long path
     WriteRegDWORD ${HKLM} "SYSTEM\CurrentControlSet\Control\FileSystem" "LongPathsEnabled" 1
   ${EndIf}]])
     end)
```

In this example, we added an NSIS-specific custom command to support long paths.

![](/assets/img/manual/nsis_4.png)

### Generate self-installation package

We can also generate self-compiled installation packages based on shell scripts. We need to configure the runself packaging format, and then add the source files that need to participate in compilation and installation through `add_sourcefiles`.

Next, we need to customize the on_installcmd installation script to configure if we compile the source code package, we can simply call a built-in compilation and installation script file, or directly configure compilation and installation commands such as `make install`.

For example:

```lua
xpack("test")
     set_formats("runself")
     add_sourcefiles("(src/**)")
     on_installcmd(function (package, batchcmds)
         batchcmds:runv("make", {"install"})
     end)
```

Then, we execute the `xmake pack` command to generate a self-installed xxx.gz.run package, which uses gzip compression by default.

```bash
$xmakepack
packing build/xpack/test/test-macosx-src-v1.0.0.gz.run
pack ok
```

We can use sh to load and run it to install our program.

```bash
$ sh ./build/xpack/test/test-macosx-src-v1.0.0.gz.run
```

We can also look at a more complete example:

```lua
xpack("xmakesrc")
     set_formats("runself")
     set_basename("xmake-v$(version)")
     set_prefixdir("xmake-$(version)")
     before_package(function (package)
         import("devel.git")

         local rootdir = path.join(os.tmpfile(package:basename()) .. ".dir", "repo")
         if not os.isdir(rootdir) then
             os.tryrm(rootdir)
             os.cp(path.directory(os.projectdir()), rootdir)

             git.clean({repodir = rootdir, force = true, all = true})
             git.reset({repodir = rootdir, hard = true})
             if os.isfile(path.join(rootdir, ".gitmodules")) then
                 git.submodule.clean({repodir = rootdir, force = true, all = true})
                 git.submodule.reset({repodir = rootdir, hard = true})
             end
         end

         local extraconf = {rootdir = rootdir}
         package:add("sourcefiles", path.join(rootdir, "core/**|src/pdcurses/**|src/luajit/**|src/tbox/tbox/src/demo/**"), extraconf )
         package:add("sourcefiles", path.join(rootdir, "xmake/**"), extraconf)
         package:add("sourcefiles", path.join(rootdir, "*.md"), extraconf)
         package:add("sourcefiles", path.join(rootdir, "configure"), extraconf)
         package:add("sourcefiles", path.join(rootdir, "scripts/*.sh"), extraconf)
         package:add("sourcefiles", path.join(rootdir, "scripts/man/**"), extraconf)
         package:add("sourcefiles", path.join(rootdir, "scripts/debian/**"), extraconf)
         package:add("sourcefiles", path.join(rootdir, "scripts/msys/**"), extraconf)
     end)

     on_installcmd(function (package, batchcmds)
         batchcmds:runv("./scripts/get.sh", {"__local__"})
     end)
```

It is the installation package configuration script of xmake's own source code. For more complete configuration, please refer to: [xpack.lua](https://github.com/xmake-io/xmake/blob/master/core/xpack.lua)

Here, it performs compilation and installation by calling the `./scripts/get.sh` installation script built into the source package.

### Generate source code archive package

In addition, we can also configure the `srczip` and `srctargz` formats to generate source code compression packages. It is not a complete installation package and has no installation commands. It is only used for source code package distribution.

```lua
xpack("test")
     set_formats("srczip", "srctargz")
     add_sourcefiles("(src/**)")
```

```bash
$xmakepack
packing build/xpack/test/test-macosx-src-v1.0.0.zip ..
packing build/xpack/test/test-macosx-src-v1.0.0.tar.gz ..
pack ok
```

### Generate binary archive package

We can also configure `zip` and `targz` to generate binary compressed packages. It will automatically compile all bound target target programs and package all required binary programs and library files into zip/tar.gz format.

This is usually used to create a green version of the installation package. There is no automatic installation script inside. Users need to set environment variables such as PATH themselves.

```lua
xpack("test")
     set_formats("zip", "targz")
     add_installfiles("(src/**)")
```

```bash
$xmakepack
packing build/xpack/test/test-macosx-v1.0.0.zip ..
packing build/xpack/test/test-macosx-v1.0.0.tar.gz ..
pack ok
```

:::NOTE
It should be noted that to add binary files to the package, use `add_installfiles` instead of `add_sourcefiles`.
:::

We can also use `add_targets` to bind the target target programs and libraries that need to be installed. See the interface description for `add_targets` below for more details.

### Generate SRPM source code installation package

It can generate source code installation packages in `.src.rpm` format.

We can configure add_targets to associate the targets that need to be built. In the generated srpm package, it will automatically call `xmake build` and `xmake install` to build and install the package.

```lua
xpack("test")
     set_homepage("https://xmake.io")
     set_license("Apache-2.0")
     set_description("A cross-platform build utility based on Lua.")

     set_formats("srpm")
     add_sourcefiles("(src/**)")
     add_sourcefiles("./xmake.lua")

     add_targets("demo")
```

It will generate a spec file similar to the following, and then automatically call rpmbuild to generate the `.src.rpm` package.

```
Name: test
Version: 1.0.0
Release: 1%{?dist}
Summary: hello

License: Apache-2.0
URL: https://xmake.io
Source0: test-linux-src-v1.0.0.tar.gz

BuildRequires: xmake
BuildRequires: gcc
BuildRequires: gcc-c++

%description
A test installer.

%prep
%autosetup -n test-1.0.0 -p1

%build
xmake build -y test

%install
xmake install -o %{buildroot}/%{_exec_prefix} test
cd %{buildroot}
find . -type f | sed 's!^\./!/!' > %{_builddir}/_installedfiles.txt

%check

%files -f %{_builddir}/_installedfiles.txt

%changelog
* Fri Dec 22 2023 ruki - 1.0.0-1
- Update to 1.0.0
```

We can also customize build and installation scripts through `on_buildcmd` and `on_installcmd`.

```lua
xpack("test")
     set_homepage("https://xmake.io")
     set_license("Apache-2.0")
     set_description("A cross-platform build utility based on Lua.")

     set_formats("srpm")
     add_sourcefiles("(src/**)")
     add_sourcefiles("./configure")

     on_buildcmd(function (package, batchcmds)
         batchcmds:runv("./configure")
         batchcmds:runv("make")
     end)

     on_installcmd(function (package, batchcmds)
         batchcmds:runv("make", {"install", "PREFIX=%{buildroot}"})
     end)
```

### Generate RPM binary installation package

The RPM package will directly generate a compiled binary installation package. xmake will automatically call the `rpmbuild --rebuild` command to build the SRPM package and generate it.

In XPack, we only need to configure `set_formats("rpm")` to support rpm package generation, and other configurations are exactly the same as srpm packages.

```lua
xpack("test")
     set_formats("rpm")
     -- TODO
```

### Packaging command parameters

#### Specify packaging format

If we have configured multiple packaging formats using `set_formats` in the configuration file, then `xmake pack` will automatically generate packages for all these formats by default.

Of course, we can also use `xmake pack --formats=nsis,targz` to selectively specify which formats of packages currently need to be packaged.

#### Modify the package file name

We can modify the package name through `set_basename()` in the configuration file, or we can modify it through the command line.

```bash
$ xmake pack --basename="foo"
packing build/xpack/test/foo.zip ..
pack ok
```

#### Specify output directory

The default output directory is in the build directory, but we can also modify the output path.

```bash
$ xmake pack -o /tmp/output
```

#### Disable automatic build

If you are building a binary package such as NSIS, `xmake pack` will automatically compile all bound target files first, and then execute the packaging logic.

But if we have already compiled it and don't want to compile it every time, but package it directly, we can disable automatic building through the following parameters.

```bash
$ xmake pack --autobuild=n
```

### Interface description

For more descriptions of the XPack packaging interface, see: [XPack Packaging Interface Document](https://xmake.io).

### Install the package locally

By default, packages configured through `add_requires("xxx")` will be installed in the global directory, and different projects share these packages.

In the new version, we have added a `package.install_locally` strategy, which can be configured to let xmake install the package to the current local project directory.

```lua
set_policy("package.install_locally", true)
```

## Changelog

### New features

* Add `network.mode` policy
* [#1433](https://github.com/xmake-io/xmake/issues/1433): Add `xmake pack` command to generate NSIS/zip/tar.gz/rpm/srpm/runself packages like cmake/cpack
* [#4435](https://github.com/xmake-io/xmake/issues/4435): Support batchsize for UnityBuild in Group Mode
* [#4485](https://github.com/xmake-io/xmake/pull/4485): Support package.install_locally
* Support NetBSD

### Changes

* [#4484](https://github.com/xmake-io/xmake/pull/4484): Improve swig rule
* Improve Haiku support

### Bugs fixed

* [#4372](https://github.com/xmake-io/xmake/issues/4372): Fix protobuf rules
* [#4439](https://github.com/xmake-io/xmake/issues/4439): Fix asn1c rules
