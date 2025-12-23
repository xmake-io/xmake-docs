
v2.6.2 版本，xmake 完整支持了 Linux 内核驱动模块的构建，这也许首个也是唯一一个支持编译 Linux 内核驱动的第三方构建工具了。

## Hello world 模块 {#hellow-world}

完整例子：[Linux Kernel Driver Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/linux/driver/hello)

它的配置非常简单，只需要配置上支持模块的 linux-headers 包，然后应用 `platform.linux.module` 构建规则就行了。

<FileExplorer rootFilesDir="examples/linux/driver/hello" />

然后直接执行 xmake 命令，一键编译，生成内核驱动模块 hello.ko。

```sh
$ xmake
[ 20%]: cache compiling.release src/add.c
[ 20%]: cache compiling.release src/hello.c
[ 60%]: linking.release build/linux/x86_64/release/hello.ko
[100%]: build ok!
```

我们也可以看完整构建命令参数。

```sh
$ xmake -v
[ 20%]: cache compiling.release src/add.c
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno-80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect-branch-register -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"add\" -o build/.objs/hello/linux/x86_64/release/src/add.c.o src/add.c
[ 20%]: cache compiling.release src/hello.c
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno-80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect-branch-register -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"hello\" -o build/.objs/hello/linux/x86_64/release/src/hello.c.o src/hello.c
[ 60%]: linking.release build/linux/x86_64/release/hello.ko
/usr/bin/ld -m elf_x86_64 -r -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.o build/.objs/hello/linux/x86_64/release/src/add.c.o build/.objs/hello/linux/x86_64/release/src/hello.c.o
/usr/src/linux-headers-5.11.0-41-generic/scripts/mod/modpost -m -a -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/Module.symvers -e -N -T -
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno-80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect-branch-register -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod.o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod.c
/usr/bin/ld -m elf_x86_64 -r --build-id=sha1 -T /usr/src/linux-headers-5.11.0-41-generic/scripts/module.lds -o build/linux/x86_64/release/hello.ko build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod.o

```

通过 `add_requires("linux-headers", {configs = {driver_modules = true}})` 配置包，xmake 会自动优先从系统中查找对应的 linux-headers 包。

如果没找到，xmake 也会自动下载它，然后自动配置构建带有 driver modules 的内核源码后，使用它继续构建内核模块。

## 自定义 linux-headers 路径 {#custom-linux-headers-path}

自从 v2.6.2 版本发布，有很多用户反馈，大多数情况下，linux 内核驱动构建都是基于定制版的 linux kernel，因此需要能够自定义配置 linux-headers 路径，而不是走远程依赖包模式。

其实，我们通过自己重写 linux-headers 包，也是可以做到这一点的。

```lua
package("linux-headers")
    on_fetch(function (package, opt)
        return {includedirs = "/usr/src/linux-headers-5.0/include"}
    end)
package_end()

add_requires("linux-headers")

target("test")
    add_rules("platform.linux.module")
    add_files("src/*.c")
    add_packages("linux-headers")
```

不过这样，也许还有点繁琐，因此在 v2.6.3 版本，我们支持更加方便的设置 linux-headers 路径。

```lua
target("hello")
    add_rules("platform.linux.module")
    add_files("src/*.c")
    set_values("linux.driver.linux-headers", "/usr/src/linux-headers-5.11.0-41-generic")
```

我们也可以通过定义 option 选项，将 linux-headers 路径作为 `xmake f --linux-headers=/usr/src/linux-headers` 的方式传入。

```lua
option("linux-headers", {showmenu = true, description = "Set linux-headers path."})
target("hello")
    add_rules("platform.linux.module")
    add_files("src/*.c")
    set_values("linux.driver.linux-headers", "$(linux-headers)")
```

更多详情见：[#1923](https://github.com/xmake-io/xmake/issues/1923)

## 交叉编译 {#cross-compilation}

我们也支持内核驱动模块的交叉编译，比如在 Linux x86_64 上使用交叉编译工具链来构建 Linux Arm/Arm64 的驱动模块。

我们只需要准备好自己的交叉编译工具链，通过 `--sdk=` 指定它的根目录，然后配置切换到 `-p cross` 平台， 最后指定需要构建的架构 arm/arm64 即可。

这里用到的交叉工具链，可以从这里下载: [Download toolchains](https://releases.linaro.org/components/toolchain/binaries/latest-7/aarch64-linux-gnu/)

更多，交叉编译配置文档，见：[配置交叉编译](/zh/guide/basic-commands/cross-compilation)。

::: tip 注意
目前仅仅支持 arm/arm64 交叉编译架构，后续会支持更多的平台架构。
:::

### 构建 Arm 驱动模块 {#build-arm-module}

```sh
$ xmake f -p cross -a arm --sdk=/mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf -c
$ xmake -v
checking for arm-linux-gnueabihf-g++ ... /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-g++
checking for the linker (ld) ... arm-linux-gnueabihf-g++
checking for /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-g++ ... ok
checking for flags (-fPIC) ... ok
checking for /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc ... ok
checking for flags (-fPIC) ... ok
checking for flags (-O2) ... ok
checking for ccache ... /usr/bin/ccache
[ 20%]: cache compiling.release src/add.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc -c -O2 -std=gnu89 -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -D__LINUX_ARM_ARCH__=6 -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/../lib/gcc/arm-linux-gnueabihf/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -mbig-endian -mabi=aapcs-linux -mfpu=vfp -marm -march=armv6k -mtune=arm1136j-s -msoft-float -Uarm -DKBUILD_BASENAME=\"add\" -o build/.objs/hello/cross/arm/release/src/add.c.o src/add.c
[ 20%]: cache compiling.release src/hello.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc -c -O2 -std=gnu89 -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -D__LINUX_ARM_ARCH__=6 -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/../lib/gcc/arm-linux-gnueabihf/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -mbig-endian -mabi=aapcs-linux -mfpu=vfp -marm -march=armv6k -mtune=arm1136j-s -msoft-float -Uarm -DKBUILD_BASENAME=\"hello\" -o build/.objs/hello/cross/arm/release/src/hello.c.o src/hello.c
checking for flags (-MMD -MF) ... ok
checking for flags (-fdiagnostics-color=always) ... ok
[ 60%]: linking.release build/cross/arm/release/hello.ko
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-ld -EB -r -o build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.o build/.objs/hello/cross/arm/release/src/add.c.o build/.objs/hello/cross/arm/release/src/hello.c.o
/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/scripts/mod/modpost -m -a -o build/.objs/hello/cross/arm/release/build/cross/arm/release/Module.symvers -e -N -T -
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc -c -O2 -std=gnu89 -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -D__LINUX_ARM_ARCH__=6 -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/../lib/gcc/arm-linux-gnueabihf/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -mbig-endian -mabi=aapcs-linux -mfpu=vfp -marm -march=armv6k -mtune=arm1136j-s -msoft-float -Uarm -o build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.mod.o build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.mod.c
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-ld -EB --be8 -r --build-id=sha1 -T /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/scripts/module.lds -o build/cross/arm/release/hello.ko build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.o build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.mod.o
[100%]: build ok!

```

### 构建 Arm64 驱动模块 {#build-arm64-module}

```sh
$ xmake f -p cross -a arm64 --sdk=/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu -c
checking for aarch64-linux-gnu-g++ ... /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++
checking for the linker (ld) ... aarch64-linux-gnu-g++
checking for /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++ ... ok
checking for flags (-fPIC) ... ok
checking for /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc ... ok
checking for flags (-fPIC) ... ok
checking for flags (-O2) ... ok
checking for ccache ... /usr/bin/ccache
[ 20%]: cache compiling.release src/add.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc -c -O2 -std=gnu89 -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/../lib/gcc/aarch64-linux-gnu/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"add\" -o build/.objs/hello/cross/arm64/release/src/add.c.o src/add.c
[ 20%]: cache compiling.release src/hello.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc -c -O2 -std=gnu89 -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/../lib/gcc/aarch64-linux-gnu/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"hello\" -o build/.objs/hello/cross/arm64/release/src/hello.c.o src/hello.c
checking for flags (-MMD -MF) ... ok
checking for flags (-fdiagnostics-color=always) ... ok
[ 60%]: linking.release build/cross/arm64/release/hello.ko
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-ld -EL -maarch64elf -r -o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.o build/.objs/hello/cross/arm64/release/src/add.c.o build/.objs/hello/cross/arm64/release/src/hello.c.o
/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/scripts/mod/modpost -m -a -o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/Module.symvers -e -N -T -
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc -c -O2 -std=gnu89 -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/../lib/gcc/aarch64-linux-gnu/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.mod.o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.mod.c
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-ld -EL -maarch64elf -r --build-id=sha1 -T /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/scripts/module.lds -o build/cross/arm64/release/hello.ko build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.mod.o
[100%]: build ok!
```
