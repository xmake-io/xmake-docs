---
title: xmake v2.5.3 Released, Support to build Linux bpf program and integrate Conda packages
tags: [xmake, lua, C/C++, toolchains, bpf, conda, linux]
date: 2021-04-08
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) is a lightweight cross-platform build tool based on Lua. It uses xmake.lua to maintain project builds. Compared with makefile/CMakeLists.txt, the configuration syntax is more Concise and intuitive, it is very friendly to novices, and you can get started quickly in a short time, allowing users to focus more on actual project development.

In version 2.5.3, we have been able to build linux and android bpf programs.

Although bpf has certain requirements for the compilation toolchain, such as the newer llvm/clang and android ndk toolchains, xmake can automatically pull a specific version of llvm/ndk for compilation, and it can also automatically pull libbpf dependencies. Library.

In addition, in the new version we have added support for the integration of C/C++ packages from Conda.

* [Github](https://github.com/xmake-io/xmake)
* [Document](https://xmake.io/)







## New feature introduction

### Build a Linux Bpf program

In the new version, we started to support the compilation of bpf programs, as well as linux and android platforms, and can automatically pull the llvm and android ndk toolchains.

For more details, please see: [#1274](https://github.com/xmake-io/xmake/issues/1274)

The build configuration is as follows, it's very simple.

If we do not need to build the android version, we can remove some configuration about android.

```lua
add_rules("mode.release", "mode.debug")
add_rules("platform.linux.bpf")

add_requires("linux-tools", {configs = {bpftool = true}})
add_requires("libbpf")
if is_plat("android") then
    add_requires("ndk >=22.x")
    set_toolchains("@ndk", {sdkver = "23"})
else
    add_requires("llvm >=10.x")
    set_toolchains("@llvm")
    add_requires("linux-headers")
end

target("minimal")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("linux-tools", "linux-headers", "libbpf")
    set_license("GPL-2.0")
```

Through the above configuration, we can probably see that we have integrated and configured specific versions of llvm and NDK toolchains,
as well as packages such as libbpf, linux-headers, linux-tools, etc..

xmake will automatically pull them, and then use the corresponding toolchain to integrate and compile these dependent packages, and finally generate the bpf program.

The linux-tools package mainly uses the libtool program inside to generate the bpf skeleton header file, and xmake will automatically run this tool to generate it.

#### Compile linux bpf program

We only need to execute the xmake command to complete the compilation, even if you have not installed llvm/clang.

Of course, if you have already installed them, if it's version is matched, xmake will also be used first.

```bash
$ xmake
```

We can also use `xmake -v` to compile and view the complete and detailed compilation commands:

```bash
$ xmake -v
[20%]: compiling.bpf src/minimal.bpf.c
/usr/bin/ccache /usr/bin/clang -c -Qunused-arguments -m64 -fvisibility=hidden -O3 -Ibuild/.gens/minimal/linux/x86_64/release/rules/bpf -isystem /home/ruki/ .xmake/packages/l/linux-tools/5.9.16/0c52e491268946fe9a4bc91d4906d66b/include -isystem /home/ruki/.xmake/packages/z/zlib/1.2.11/3a7e4427eda94fc69fad0009a1629fd8/include -isystem /home/ruki/.xmake /packages/l/libelf/0.8.13/ced4fdd8151a475dafc5f51e2a031997/include -isystem /home/ruki/.xmake/packages/l/libelf/0.8.13/ced4fdd8151a475dafc5f51e2a031997/include/libelf -isystem /home/ruki/.xmake /l/libcap/2.27/c55b28aa3b3745489b93895d0d606ed1/include -isystem /home/ruki/.xmake/packages/l/linux-headers/5.9.16/8e3a440cbe1f42249aef3d89f1528ecb/include -DNDEBUG -target bpf -g -o build/.gens/.gens /linux/x86_64/release/rules/bpf/minimal.bpf.o src/minimal.bpf.c
llvm-strip -g build/.gens/minimal/linux/x86_64/release/rules/bpf/minimal.bpf.o
bpftool gen skeleton build/.gens/minimal/linux/x86_64/release/rules/bpf/minimal.bpf.o
[40%]: ccache compiling.release src/minimal.c
/usr/bin/ccache /usr/bin/clang -c -Qunused-arguments -m64 -fvisibility=hidden -O3 -Ibuild/.gens/minimal/linux/x86_64/release/rules/bpf -isystem /home/ruki/ .xmake/packages/l/linux-tools/5.9.16/0c52e491268946fe9a4bc91d4906d66b/include -isystem /home/ruki/.xmake/packages/z/zlib/1.2.11/3a7e4427eda94fc69fad0009a1629fd8/include -isystem /home/ruki/.xmake /packages/l/libelf/0.8.13/ced4fdd8151a475dafc5f51e2a031997/include -isystem /home/ruki/.xmake/packages/l/libelf/0.8.13/ced4fdd8151a475dafc5f51e2a031997/include/libelf -isystem /home/ruki/.xmake /l/libcap/2.27/c55b28aa3b3745489b93895d0d606ed1/include -isystem /home/ruki/.xmake/packages/l/linux-headers/5.9.16/8e3a440cbe1f42249aef3d89f1528ecb/include -DNDEBUG -o build/.objs/minimal/linux/x86_64/ release/src/minimal.co src/minimal.c
[60%]: linking.release minimal
/usr/bin/clang++ -o build/linux/x86_64/release/minimal build/.objs/minimal/linux/x86_64/release/src/minimal.co -m64 -L/home/ruki/.xmake/packages/l /linux-tools/5.9.16/0c52e491268946fe9a4bc91d4906d66b/lib64 -L/home/ruki/.xmake/packages/z/zlib/1.2.11/3a7e4427eda94fc69fad0009a1629fd8/lib -L/home/ruki/.xmake/packages/l/libelf /0.8.13/ced4fdd8151a475dafc5f51e2a031997/lib -L/home/ruki/.xmake/packages/l/libcap/2.27/c55b28aa3b3745489b93895d0d606ed1/lib -s -lbpf -lz -lelf -lcap
[100%]: build ok!
```

#### Compile Android bpf program

If we compile the Android version, we only need to switch to the android platform, which is also very convenient

```bash
$ xmake f -p android
$ xmake
```

xmake will automatically download the ndk tool chain and the corresponding android version libbpf and other libraries to use.

```bash
$ xmake f -p android -c
checking for architecture ... armeabi-v7a
checking for Android SDK directory ... no
checking for NDK directory ... no
note: try installing these packages (pass -y to skip confirm)?
in local-repo:
  -> libcap 2.27 [linux, x86_64, from:linux-tools]
  -> libelf 0.8.13 [linux, x86_64, from:linux-tools]
  -> zlib 1.2.11 [linux, x86_64, from:linux-tools]
  -> linux-tools 5.9.16 [bpftool:y]
  -> ndk 22.0
  -> libelf#1 0.8.13 [toolchains:@ndk, from:libbpf]
  -> zlib#1 1.2.11 [toolchains:@ndk, from:libbpf]
  -> libbpf v0.3 [toolchains:@ndk]
please input: y (y/n)

  => install libcap 2.27 .. ok
  => install zlib 1.2.11 .. ok
  => install libelf 0.8.13 .. ok
  => install ndk 22.0 .. ok
  => install linux-tools 5.9.16 .. ok
  => install libelf#1 0.8.13 .. ok
  => install zlib#1 1.2.11 .. ok
  => install libbpf v0.3 .. ok
ruki@010689392c4d:/mnt/bpf_minimal$ xmake
[20%]: compiling.bpf src/minimal.bpf.c
[40%]: ccache compiling.release src/minimal.c
[60%]: linking.release minimal
[100%]: build ok!
```

Of course, if you have manually downloaded the corresponding version of the ndk toolchain, we can also specify it to use it instead of automatically pulling it.


```bash
$ xmake f -p android --ndk=/xxx/android-ndk-r22
$ xmake
```

However, if you download it yourself, remember to download at least the version above ndk r22, because clang in the lower version of ndk does not support the compilation and generation of bpf programs.

Finally, here is a complete bpf scaffolding project based on xmake, you can refer to: [https://github.com/hack0z/libbpf-bootstrap](https://github.com/hack0z/libbpf-bootstrap)

In addition, there is also a minimal bpf example program: https://github.com/xmake-io/xmake/tree/master/tests/projects/bpf/minimal

### Integrate and use Conda package

Conda is a very powerful third-party package manager that supports binary package pull in various languages. Here we only use the C/C++ package inside.

Its integrated usage is similar to conan/vcpkg, except that the package namespace is changed to `conda::`

```lua
add_requires("conda::libpng 1.6.37", {alias = "libpng"})
add_requires("conda::openssl")
target("testco")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("libpng", "conda::openssl")
```

Note: Although we support many third-party package managers, such as conan/conda/vcpkg/brew, etc., xmake also has its own package repository management.

There are currently nearly 300 commonly used packages that support different platforms, some of which are The package also supports android/ios/mingw and even cross-compilation environment.

Therefore, if the official [xmake-repo](https://github.com/xmake-io/xmake-repo) repository already provides the required package, you can use it directly without specifying the package namespace.

### Get host cpu information

In the current version, we have added a new `core.base.cpu` module and `os.cpuinfo` interface to obtain various information about the cpu, such as: cpu family/model, microarchitecture, core number, features and other information.

This is usually very useful in projects that pursue performance. These projects usually need to be optimized according to the CPU's memory model and extended instruction set. At the same time, if you want to cross-platform, you need to specify the corresponding code according to the current cpu information, (for example, after intel haswell) One set, one set after amd zen, the older ones default to no optimization). This information is also used in many high-performance computing libraries.

Therefore, through this module interface, you can obtain the current host cpu information and feature support when compiling and configuring, so as to enable relevant optimized compilation.

We can quickly obtain all information through `os.cpuinfo()`, or specify `os.cpuinfo("march")` to obtain specific information, such as march, which is microarchitecture

We can also use the `xmake l` command to quickly view the obtained results.

```bash
$ xmake l os.cpuinfo
{
  features = "fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clfsh ds acpi mmx fxsr sse sse2 ss htt tm pbe sse3 pclmulqdq dtes64 mon dscpl vmx tse64 mon dscpl vmx tse tm2 s
sse4_1 sse4_2 x2apic movbe popcnt aes pcid xsave osxsave seglim64 tsctmr avx1_0 rdrand f16c",
  vendor = "GenuineIntel",
  model_name = "Intel(R) Core(TM) i7-8569U CPU @ 2.80GHz",
  family = 6,
  march = "Kaby Lake",
  model = 142,
  ncpu = 8
}

$ xmake l os.cpuinfo march
"Kaby Lake"

$ xmake l os.cpuinfo ncpu
8
```

If you want to determine the support of extended features such as `sse`, you need to import the `core.base.cpu` module to get it.

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load(function (target)
        import("core.base.cpu")
        local ncpu = os.cpuinfo("ncpu")
        - local ncpu = cpu.number()
        if cpu.has_feature("sse") then
            target:add("defines", "HAS_SSE")
        end
    end)
```

### Added cmake import file rules

If we are developing a library program, after executing `xmake install` to install to the system, only the library file is installed, and there is no import file information such as .cmake/.pc, so the cmake project wants to be integrated and used through find_package, usually by looking for Not in our library.

In order to allow the third-party cmake project to find it normally and use the integration, then we can use the `utils.install.cmake_importfiles` rule to export the .cmake file when installing the target target library file for the library import and search of other cmake projects .

We only need to apply this rule to the specified target library target through the `add_rules` interface.

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_rules("utils.install.cmake_importfiles")
```

After configuration, the `xmake install` installation command can automatically export the .cmake import file.

### Added pkgconfig import file rules

Similar to the `cmake_importfiles` above, but we can also install the pkgconfig/.pc import file through the `utils.install.pkgconfig_importfiles` rule, which is very useful for library detection by tools such as autotools.

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_rules("utils.install.pkgconfig_importfiles")
```

### Added Git related built-in configuration variables

xmake has always provided the automatic generation feature of config.h, which can be configured through the [add_configfiles](https://xmake.io/api/description/project-target.html#add-configfiles) interface, and it also supports the replacement of template variables. You can define some variables yourself.

However, xmake also provides some commonly used built-in variable substitutions, such as version information, platform architecture, etc. For details, see: [https://xmake.io/api/description/project-target.html#add-configfiles](https://xmake.io/api/description/project-target.html#add-configfiles)

The template configuration is very simple, just need:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_configfiles("src/config.h.in")
```

The config.h file can be automatically generated according to config.h.in.

But the new feature we are going to talk about here is the newly provided Git-related built-in variables to allow users to quickly and conveniently compile the project or the latest tag/branch/commit information of the current git project.

This is very useful for troubleshooting and locating problems in the later stage.

We can use commit to pinpoint the problem library based on which commit submission caused the problem. In this way, we can checkout but the corresponding version to troubleshoot the problem.

We only need to configure and define the following variables in config.h.in.

```c
#define GIT_COMMIT "${GIT_COMMIT}"
#define GIT_COMMIT_LONG "${GIT_COMMIT_LONG}"
#define GIT_COMMIT_DATE "${GIT_COMMIT_DATE}"
#define GIT_BRANCH "${GIT_BRANCH}"
#define GIT_TAG "${GIT_TAG}"
#define GIT_TAG_LONG "${GIT_TAG_LONG}"
#define GIT_CUSTOM "${GIT_TAG}-${GIT_COMMIT}"
```

Execute xmake to compile, it will automatically generate the following config.h file.

```c
#define GIT_COMMIT "8c42b2c2"
#define GIT_COMMIT_LONG "8c42b2c251793861eb85ffdf7e7c2307b129c7ae"
#define GIT_COMMIT_DATE "20210121225744"
#define GIT_BRANCH "dev"
#define GIT_TAG "v1.6.6"
#define GIT_TAG_LONG "v1.6.6-0-g8c42b2c2"
#define GIT_CUSTOM "v1.6.6-8c42b2c2"
```

We can use them in the program by means of macro definitions.

### Android NDK r22 support and remote pull

The Android NDK has made very big structural changes since r22, removing some obsolete directories, such as the top-level sysroot directory and platforms directory,
causing the previous detection method of xmake to fail.

Therefore, in the new version, we have made improvements to xmake to better support the full version of the NDK toolchain, including the new version above r22.

At the same time, the official repository of xmae-repo has also added the inclusion of ndk packages, enabling xmake to pull the ndk tool chain remotely for use.

```lua
add_requires("ndk >=22.x")
set_toolchains("@ndk", {sdkver = "23"})
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

## Changelog

### New features

* [#1259](https://github.com/xmake-io/xmake/issues/1259): Support `add_files("*.def")` to export symbols for windows/dll
* [#1267](https://github.com/xmake-io/xmake/issues/1267): add `find_package("nvtx")`
* [#1274](https://github.com/xmake-io/xmake/issues/1274): add `platform.linux.bpf` rule to build linux/bpf program
* [#1280](https://github.com/xmake-io/xmake/issues/1280): Support fetchonly package to improve find_package
* Support to fetch remote ndk toolchain package
* [#1268](https://github.com/xmake-io/xmake/issues/1268): Add `utils.install.pkgconfig_importfiles` rule to install `*.pc` import file
* [#1268](https://github.com/xmake-io/xmake/issues/1268): Add `utils.install.cmake_importfiles` rule to install `*.cmake` import files
* [#348](https://github.com/xmake-io/xmake-repo/pull/348): Add `platform.longpaths` policy to support git longpaths
* [#1314](https://github.com/xmake-io/xmake/issues/1314): Support to install and use conda packages
* [#1120](https://github.com/xmake-io/xmake/issues/1120): Add `core.base.cpu` module and improve `os.cpuinfo()`
* [#1325](https://github.com/xmake-io/xmake/issues/1325): Add builtin git variables for `add_configfiles`

### Change

* [#1275](https://github.com/xmake-io/xmake/issues/1275): Support conditionnal targets for vsxmake plugin
* [#1290](https://github.com/xmake-io/xmake/pull/1290): Improve android ndk to support >= r22
* [#1311](https://github.com/xmake-io/xmake/issues/1311): Add packages lib folder to PATH for vsxmake project

### Bugs fixed

* [#1266](https://github.com/xmake-io/xmake/issues/1266): Fix relative repo path in `add_repositories`
* [#1288](https://github.com/xmake-io/xmake/issues/1288): Fix vsxmake generator with option configs
