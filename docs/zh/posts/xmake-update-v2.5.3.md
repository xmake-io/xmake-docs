---
title: xmake v2.5.3 发布，支持构建 linux bpf 程序和 Conda 包集成
tags: [xmake, lua, C/C++, toolchains, bpf, conda, linux]
date: 2021-04-08
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具，使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

在 2.5.3 版本，我们新增了对 linux bpf 程序的构建支持，并且同时支持 android bpf 程序的构建。

尽管 bpf 对 编译工具链有一定的要求，比如需要较新的 llvm/clang 和 android ndk 工具链，但是 xmake 能够自动拉取特定版本的 llvm/ndk 来用于编译，并且还能自动拉取 libbpf 等依赖库，完全省去了用户折腾编译环境和 libbpf 库集成的问题。

另外，在新版本中我们还新增了对 Conda 包仓库的集成支持，现在除了能够从 Conan/Vcpkg/brew/pacman/clib/dub 等包仓库集成使用包，还能从 Conda 包仓库中集成各种二进制 C/C++ 包。




* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](https://xmake.io/zh/)









## 新特性介绍

### 构建 Linux Bpf 程序

新版本，我们开始支持 bpf 程序构建，同时支持 linux 以及 android 平台，能够自动拉取 llvm 和 android ndk 工具链。

更多详情见：[#1274](https://github.com/xmake-io/xmake/issues/1274)

支持 linux 和 android 两端构建的配置大概如下，如果我们不需要构建 android 版本，可以做一些删减，配置会更加精简：

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

通过上面的配置，大概可以看出，我们集成配置了特定版本的 llvm 和 NDK 工具链，以及 libbpf, linux-headers, linux-tools 等包，xmake 都会去自动拉取它们，然后使用对应的工具链集成编译这些依赖包，最后生成 bpf 程序。

其中 linux-tools 包主要使用了里面的 libtool 程序，用于生成 bpf skeleton 头文件，xmake 也会自动调用这个工具去生成它。

#### 编译 linux bpf 程序

我们只需要执行 xmake 命令即可完成编译，即使你还没安装 llvm/clang，当然，如果你已经安装了它们，如果版本匹配，xmake 也会去优先使用。

```bash
$ xmake
```

我们也可以通过 `xmake -v` 来编译并且查看完整详细的编译命令：

```bash
$ xmake -v
[ 20%]: compiling.bpf src/minimal.bpf.c
/usr/bin/ccache /usr/bin/clang -c -Qunused-arguments -m64 -fvisibility=hidden -O3 -Ibuild/.gens/minimal/linux/x86_64/release/rules/bpf -isystem /home/ruki/.xmake/packages/l/linux-tools/5.9.16/0c52e491268946fe9a4bc91d4906d66b/include -isystem /home/ruki/.xmake/packages/z/zlib/1.2.11/3a7e4427eda94fc69fad0009a1629fd8/include -isystem /home/ruki/.xmake/packages/l/libelf/0.8.13/ced4fdd8151a475dafc5f51e2a031997/include -isystem /home/ruki/.xmake/packages/l/libelf/0.8.13/ced4fdd8151a475dafc5f51e2a031997/include/libelf -isystem /home/ruki/.xmake/packages/l/libcap/2.27/c55b28aa3b3745489b93895d0d606ed1/include -isystem /home/ruki/.xmake/packages/l/linux-headers/5.9.16/8e3a440cbe1f42249aef3d89f1528ecb/include -DNDEBUG -target bpf -g -o build/.gens/minimal/linux/x86_64/release/rules/bpf/minimal.bpf.o src/minimal.bpf.c
llvm-strip -g build/.gens/minimal/linux/x86_64/release/rules/bpf/minimal.bpf.o
bpftool gen skeleton build/.gens/minimal/linux/x86_64/release/rules/bpf/minimal.bpf.o
[ 40%]: ccache compiling.release src/minimal.c
/usr/bin/ccache /usr/bin/clang -c -Qunused-arguments -m64 -fvisibility=hidden -O3 -Ibuild/.gens/minimal/linux/x86_64/release/rules/bpf -isystem /home/ruki/.xmake/packages/l/linux-tools/5.9.16/0c52e491268946fe9a4bc91d4906d66b/include -isystem /home/ruki/.xmake/packages/z/zlib/1.2.11/3a7e4427eda94fc69fad0009a1629fd8/include -isystem /home/ruki/.xmake/packages/l/libelf/0.8.13/ced4fdd8151a475dafc5f51e2a031997/include -isystem /home/ruki/.xmake/packages/l/libelf/0.8.13/ced4fdd8151a475dafc5f51e2a031997/include/libelf -isystem /home/ruki/.xmake/packages/l/libcap/2.27/c55b28aa3b3745489b93895d0d606ed1/include -isystem /home/ruki/.xmake/packages/l/linux-headers/5.9.16/8e3a440cbe1f42249aef3d89f1528ecb/include -DNDEBUG -o build/.objs/minimal/linux/x86_64/release/src/minimal.c.o src/minimal.c
[ 60%]: linking.release minimal
/usr/bin/clang++ -o build/linux/x86_64/release/minimal build/.objs/minimal/linux/x86_64/release/src/minimal.c.o -m64 -L/home/ruki/.xmake/packages/l/linux-tools/5.9.16/0c52e491268946fe9a4bc91d4906d66b/lib64 -L/home/ruki/.xmake/packages/z/zlib/1.2.11/3a7e4427eda94fc69fad0009a1629fd8/lib -L/home/ruki/.xmake/packages/l/libelf/0.8.13/ced4fdd8151a475dafc5f51e2a031997/lib -L/home/ruki/.xmake/packages/l/libcap/2.27/c55b28aa3b3745489b93895d0d606ed1/lib -s -lbpf -lz -lelf -lcap
[100%]: build ok!
```

#### 编译 Android bpf 程序

如果编译 Android 版本，我们也只需要切换到 android 平台即可，一样很方便

```bash
$ xmake f -p android
$ xmake
```

xmake 会去自动下来 ndk 工具链和对应 android 版本 libbpf 等库来使用。

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
[ 20%]: compiling.bpf src/minimal.bpf.c
[ 40%]: ccache compiling.release src/minimal.c
[ 60%]: linking.release minimal
[100%]: build ok!
```

当然，如果你已经手动下载了对应版本的 ndk 工具链，我们也可以指定使用，不再走自动拉取。


```bash
$ xmake f -p android --ndk=/xxx/android-ndk-r22
$ xmake
```

不过，如果自己下载的话，记得至少要下载 ndk r22 以上版本的，因为低版本 ndk 里面的 clang 不支持编译生成 bpf 程序。

最后，这里有个完整的基于 xmake 的 bpf 脚手架工程，大家可以参考下：[https://github.com/hack0z/libbpf-bootstrap](https://github.com/hack0z/libbpf-bootstrap)

另外这里也有个最小 bpf 例子程序：https://github.com/xmake-io/xmake/tree/master/tests/projects/bpf/minimal

### 集成使用 Conda 包

Conda 是一个很强大的第三方包管理器，支持各种语言的二进制包拉取，这里我们仅仅使用里面的 C/C++ 包。

它的集成使用方式跟 conan/vcpkg 类似，仅仅只是包命名空间改成了 `conda::`

```lua
add_requires("conda::libpng 1.6.37", {alias = "libpng"})
add_requires("conda::openssl")
target("testco")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("libpng", "conda::openssl")
```

注：虽然我们支持很多的第三方包管理器，比如 conan/conda/vcpkg/brew 等等，但是 xmake 也有自建的包仓库管理，目前已有将近 300 个常用包，支持不同的平台，其中部分包还支持 android/ios/mingw 甚至交叉编译环境。

因此，如果官方 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库已经提供了需要的包，可以直接使用，不需要指定包命名空间。xmake 对第三方包管理的支持仅仅是作为补充，尽可能复用已有 c/c++ 生态，避免生态碎片化。

### 获取主机 cpu 信息

当前版本，我们新增了一个 `core.base.cpu` 模块和 `os.cpuinfo` 接口，用于获取 cpu 的各种信息，比如：cpu family/model, microarchitecture，core number, features 等信息。

这通常在追求性能的项目中非常有用，这些项目通常需要根据CPU的内存模型和扩展指令集来优化，同时想要跨平台的话，就需要根据当前cpu信息指定对应的代码，（例如intel haswell之后一套，amd zen之后一套，更老的默认到没有优化）。很多高性能计算库里面也会用到这些信息。

因此，通过这个模块接口就可以在编译配置的时候获取当前主机 cpu 的信息和特性支持力度，来针对性开启相关优化编译。

我们可以通过 `os.cpuinfo()` 快速获取所有信息，也可以指定 `os.cpuinfo("march")` 获取特定信息，比如 march，也就是 microarchitecture

我们也可以通过 `xmake l` 命令来快速查看获取结果。

```bash
$ xmake l os.cpuinfo
{
  features = "fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clfsh ds acpi mmx fxsr sse sse2 ss htt tm pbe sse3 pclmulqdq dtes64 mon dscpl vmx est tm2 ssse3 fma cx16 tpr pdcm
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

如果要判断 sse 等扩展特性支持，就得需要 import 导入 `core.base.cpu` 模块来获取了。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load(function (target)
        import("core.base.cpu")
        local ncpu = os.cpuinfo("ncpu")
        -- local ncpu = cpu.number()
        if cpu.has_feature("sse") then
            target:add("defines", "HAS_SSE")
        end
    end)
```

### 新增 cmake 导入文件规则

如果，我们开发的是库程序，在执行 `xmake install` 安装到系统后，仅仅只安装了库文件，没有 .cmake/.pc 等导入文件信息，因此 cmake 工程想通过 find_package 集成使用，通常是找不到我们的库。

为了能够让第三方 cmake 工程正常找到它并使用集成，那么我们可以使用 `utils.install.cmake_importfiles` 规则在安装 target 目标库文件的时候，导出 .cmake 文件，用于其他 cmake 项目的库导入和查找。

我们只需要通过 add_rules 接口应用此规则到指定的 target 库目标即可。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_rules("utils.install.cmake_importfiles")
```

配置之后，`xmake install` 安装命令就能够自动导出 .cmake 导入文件。

### 新增 pkgconfig 导入文件规则

跟上面的 cmake 导入类似，只不过我们这也可以通过 `utils.install.pkgconfig_importfiles` 规则安装 pkgconfig/.pc 导入文件，这对 autotools 等工具的库探测非常有用。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_rules("utils.install.pkgconfig_importfiles")
```

### 新增 Git 相关内置配置变量

xmake 一直有提供 config.h 的自动生成特性，可以通过 [add_configfiles](https://xmake.io/zh/) 接口来配置，并且它还支持模板变量的替换，用户可以自己定义一些变量。

不过，xmake 也提供了一些常用的内置变量替换，比如 版本信息，平台架构等。具体详情见：[/zh/api/description/project-target#add-configfiles](https://xmake.io/zh/)

模板配置使用方式很简单，只需要：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_configfiles("src/config.h.in")
```

就能根据 config.h.in 自动生成 config.h 文件。

不过我们这里要讲的新特性是最近新提供的 Git 相关内置变量，来让用户在项目编译时候，快速方便的或者当前 git 项目最近的 tag/branch/commit 信息。

这对于后期排查定位问题非常有用，我们可以通过 commit 精确定位问题库是基于哪次 commit 提交导致的，这样，我们就能 checkout 但对应版本来排查问题。

我们只需要在 config.h.in 中配置定义以下变量。

```c
#define GIT_COMMIT      "${GIT_COMMIT}"
#define GIT_COMMIT_LONG "${GIT_COMMIT_LONG}"
#define GIT_COMMIT_DATE "${GIT_COMMIT_DATE}"
#define GIT_BRANCH      "${GIT_BRANCH}"
#define GIT_TAG         "${GIT_TAG}"
#define GIT_TAG_LONG    "${GIT_TAG_LONG}"
#define GIT_CUSTOM      "${GIT_TAG}-${GIT_COMMIT}"
```

执行 xmake 编译，就会自动生成如下 config.h 文件。

```c
#define GIT_COMMIT      "8c42b2c2"
#define GIT_COMMIT_LONG "8c42b2c251793861eb85ffdf7e7c2307b129c7ae"
#define GIT_COMMIT_DATE "20210121225744"
#define GIT_BRANCH      "dev"
#define GIT_TAG         "v1.6.6"
#define GIT_TAG_LONG    "v1.6.6-0-g8c42b2c2"
#define GIT_CUSTOM      "v1.6.6-8c42b2c2"
```

我们就可以在程序用通过宏定义的方式使用它们。

### Android NDK r22 支持和远程拉取

Android NDK 从 r22 之后，结构上做了非常大的改动，移除了一些被废弃的目录，比如 顶层的 sysroot 目录 和 platforms 目录，导致 xmake 之前的探测方式失效。

因此在新版本中，我们对 xmake 做了改进来更好的支持全版本 NDK 工具链，包括 r22 以上的新版本。

同时 xmae-repo 官方仓库也增加了对 ndk 包的收录，使得 xmake 能够远程拉取 ndk 工具链来使用。

```lua
add_requires("ndk >=22.x")
set_toolchains("@ndk", {sdkver = "23"})
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

## 更新内容

### 新特性

* [#1259](https://github.com/xmake-io/xmake/issues/1259): 支持 `add_files("*.def")` 添加 def 文件去导出 windows/dll 符号
* [#1267](https://github.com/xmake-io/xmake/issues/1267): 添加 `find_package("nvtx")`
* [#1274](https://github.com/xmake-io/xmake/issues/1274): 添加 `platform.linux.bpf` 规则去构建 linux/bpf 程序
* [#1280](https://github.com/xmake-io/xmake/issues/1280): 支持 fetchonly 包去扩展改进 find_package
* 支持自动拉取远程 ndk 工具链包和集成
* [#1268](https://github.com/xmake-io/xmake/issues/1268): 添加 `utils.install.pkgconfig_importfiles` 规则去安装 `*.pc` 文件
* [#1268](https://github.com/xmake-io/xmake/issues/1268): 添加 `utils.install.cmake_importfiles` 规则去安装 `*.cmake` 导入文件
* [#348](https://github.com/xmake-io/xmake-repo/pull/348): 添加 `platform.longpaths` 策略去支持 git longpaths
* [#1314](https://github.com/xmake-io/xmake/issues/1314): 支持安装使用 conda 包
* [#1120](https://github.com/xmake-io/xmake/issues/1120): 添加 `core.base.cpu` 模块并且改进 `os.cpuinfo()`
* [#1325](https://github.com/xmake-io/xmake/issues/1325): 为 `add_configfiles` 添加内建的 git 变量

### 改进

* [#1275](https://github.com/xmake-io/xmake/issues/1275): 改进 vsxmake 生成器，支持条件化编译 targets
* [#1290](https://github.com/xmake-io/xmake/pull/1290): 增加对 Android ndk r22 以上版本支持
* [#1311](https://github.com/xmake-io/xmake/issues/1311): 为 vsxmake 工程添加包 dll 路径，确保调试运行加载正常

### Bugs 修复

* [#1266](https://github.com/xmake-io/xmake/issues/1266): 修复在 `add_repositories` 中的 repo 相对路径
* [#1288](https://github.com/xmake-io/xmake/issues/1288): 修复 vsxmake 插件处理 option 配置问题
