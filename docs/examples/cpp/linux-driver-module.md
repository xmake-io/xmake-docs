
In version v2.6.2, xmake fully supports the construction of Linux kernel driver modules. This may be the first and only third-party build tool that supports compiling Linux kernel drivers.

## Hello world module

Full example: [Linux Kernel Driver Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/linux/driver/hello)

Its configuration is very simple. You only need to configure the linux-headers package that supports the module, and then apply the `platform.linux.module` build rule.

```lua
add_requires("linux-headers", {configs = {driver_modules = true}})

target("hello")
    add_rules("platform.linux.module")
    add_files("src/*.c")
    add_packages("linux-headers")
    set_license("GPL-2.0")
```

Then directly execute the xmake command, compile with one key, and generate the kernel driver module hello.ko.

```bash
$ xmake
[20%]: cache compiling.release src/add.c
[20%]: cache compiling.release src/hello.c
[60%]: linking.release build/linux/x86_64/release/hello.ko
[100%]: build ok!
```

We can also look at the complete build command parameters.

```bash
$ xmake -v
[20%]: cache compiling.release src/add.c
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr /src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux -headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr /src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\ "hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno -80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect -branch-re gister -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops= 1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone- fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"add\ "-o build/.objs/hello/linux/x86_64/release/src/add.co src/add.c
[20%]: cache compiling.release src/hello.c
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr /src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux -headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr /src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\ "hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno -80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect -branch-re gister -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops= 1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone- fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"hello\ "-o build/.objs/hello/linux/x86_64/release/src/hello.co src/hello.c
[60%]: linking.release build/linux/x86_64/release/hello.ko
/usr/bin/ld -m elf_x86_64 -r -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.o build/.objs/hello/linux/x86_64/ release/src/add.co build/.objs/hello/linux/x86_64/release/src/hello.co
/usr/src/linux-headers-5.11.0-41-generic/scripts/mod/modpost -m -a -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/Module .symvers -e -N -T-
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr /src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux -headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr /src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers- 5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno- mmx -mno-sse2 -mno-3dnow -mno-avx -mno-80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red- zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect-branch-register -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno- PIE -fcf-protection=none -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store- data-races -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict- overflow -fno-stack-check -fconserve-stack -o build/.o bjs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod.o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko. mod.c
/usr/bin/ld -m elf_x86_64 -r --build-id=sha1 -T /usr/src/linux-headers-5.11.0-41-generic/scripts/module.lds -o build/linux/x86_64/ release/hello.ko build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/ release/hello.ko.mod.o

```

Through the `add_requires("linux-headers", {configs = {driver_modules = true}})` configuration package, xmake will automatically find the corresponding linux-headers package from the system first.

If it is not found, xmake will also automatically download it, and then automatically configure and build the kernel source code with driver modules, and use it to continue building the kernel module.

## Custom linux-headers path

Since the release of v2.6.2, there have been many feedbacks from users. In most cases, the linux kernel driver is built based on a customized version of the linux kernel, so it is necessary to be able to customize the configuration of the linux-headers path instead of using the remote dependency package mode.

In fact, we can do this by rewriting the linux-headers package ourselves.

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

But this may be a bit cumbersome, so in v2.6.3, we support more convenient setting of the linux-headers path.

```lua
target("hello")
    add_rules("platform.linux.module")
    add_files("src/*.c")
    set_values("linux.driver.linux-headers", "/usr/src/linux-headers-5.11.0-41-generic")
```

We can also pass in the linux-headers path as `xmake f --linux-headers=/usr/src/linux-headers` by defining option options.

```lua
option("linux-headers", {showmenu = true, description = "Set linux-headers path."})
target("hello")
    add_rules("platform.linux.module")
    add_files("src/*.c")
    set_values("linux.driver.linux-headers", "$(linux-headers)")
```

For more details, please see: [#1923](https://github.com/xmake-io/xmake/issues/1923)

## Cross compilation

We also support cross-compilation of kernel driver modules, such as using cross-compilation tool chain on Linux x86_64 to build Linux Arm/Arm64 driver modules.

We only need to prepare our own cross-compilation tool chain, specify its root directory through `--sdk=`, then switch to the `-p cross` platform configuration, and finally specify the architecture arm/arm64 to be built.

The cross toolchain used here can be downloaded from here: [Download toolchains](https://releases.linaro.org/components/toolchain/binaries/latest-7/aarch64-linux-gnu/)

For more, cross-compilation configuration documents, see: [Configure cross-compilation](https://xmake.io/#/guide/configuration?id=common-cross-compilation-configuration)

::: tip NOTE
Currently only supports arm/arm64 cross-compilation architecture, and more platform architectures will be supported in the future.
:::

### Build Arm driver module

```bash
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
[20%]: cache compiling.release src/add.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc -c -O2 -std=gnu89 -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include /generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805 /arch/arm/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated/uapi -I/home/ruki/.xmake /packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/generated/uapi -D__KERNEL__ DMODULE -DKBUILD_MODNAME=\"hello\" -D__LINUX_ARM_ARCH__=6 -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf /bin/../lib/gcc/arm-linux-gnueabihf/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/kconfig .h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar- fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa- cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -mbig- endian -mabi=aapcs-linux -mfpu=vfp -marm -march=armv6k -mtune=arm1136j-s -msoft-float -Uarm -DKBUILD_BASENAME=\"add\" -o build/.objs/hello/cross/arm/ release/src/add.co src/add.c
[20%]: cache compiling.release src/hello.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc -c -O2 -std=gnu89 -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/ 7695a30b7add4d3aa4685cbac6815805/arch/arm/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated/uapi -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -D__LINUX_ARM_ARCH__=6 -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/../lib/gcc/arm-linux-gnueabihf/ 7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/ linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/compiler_types.h -nostdinc -fno-strict-alia sing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks- fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno- stack-check -fconserve-stack -mbig-endian -mabi=aapcs-linux -mfpu=vfp -marm -march=armv6k -mtune=arm1136j-s -msoft-float -Uarm -DKBUILD_BASENAME=\"hello\" -o build /.objs/hello/cross/arm/release/src/hello.co src/hello.c
checking for flags (-MMD -MF) ... ok
checking for flags (-fdiagnostics-color=always) ... ok
[60%]: linking.release build/cross/arm/release/hello.ko
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-ld -EB -r -o build/.objs/hello/cross/arm/release/build/cross /arm/release/hello.ko.o build/.objs/hello/cross/arm/release/src/add.co build/.objs/hello/cross/arm/release/src/hello.co
/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/scripts/mod/modpost -m -a -o build/.objs/hello/cross/arm/release/build/cross/ arm/release/Module.symvers -e -N -T-
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc -c -O2 -std=gnu89 -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include /generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805 /arch/arm/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated/uapi -I/home/ruki/.xmake /packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/generated/uapi -D__KERNEL__ DMODULE -DKBUILD_MODNAME=\"hello\" -D__LINUX_ARM_ARCH__=6 -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf /bin/../lib/gcc/arm-linux-gnueabihf/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/kconfig .h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar- fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa- cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -mbig- endian -mabi=aapcs-linux -mfpu=vfp -marm -march=armv6k -mtune=arm1136j-s -msoft-float -Uarm -o build/.objs/hello/cross/arm/release/build/cross/arm/ release/hello.ko.mod.o build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.mod.c
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-ld -EB --be8 -r --build-id=sha1 -T /home/ruki/. xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/scripts/module.lds -o build/cross/arm/release/hello.ko build/.objs/hello/cross/arm/release/build/cross /arm/release/hello.ko.o build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.mod.o
[100%]: build ok!

```

### Build Arm64 driver module

```bash
$ xmake f -p cross -a arm64 --sdk=/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu -c
checking for aarch64-linux-gnu-g++ ... /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++
checking for the linker (ld) ... aarch64-linux-gnu-g++
checking for /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++ ... ok
checking for flags (-fPIC) ... ok
checking for /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc ... ok
checking for flags (-fPIC) ... ok
checking for flags (-O2) ... ok
checking for ccache ... /usr/bin/ccache
[20%]: cache compiling.release src/add.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc -c -O2 -std=gnu89 -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include /generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de /arch/arm64/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated/uapi -I/home/ruki/.xmake /packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/generated/uapi -D__KERNEL__- DMODULE -DKBUILD_MODNAME=\"hello\" -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/../lib/gcc/aarch 64-linux-gnu/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/kconfig.h -include /home/ruki/. xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1- falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining- fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"add\" -o build/. objs/hello/cross/arm64/release/src/add.co src/add.c
[20%]: cache compiling.release src/hello.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc -c -O2 -std=gnu89 -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include /generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de /arch/arm64/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated/uapi -I/home/ruki/.xmake /packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/generated/uapi -D__KERNEL__- DMODULE -DKBUILD_MODNAME=\"hello\" -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/../lib/gcc/aarch 64-linux-gnu/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/kconfig.h -include /home/ruki/. xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1- falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining- fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"hello\" -o build/. objs/hello/cross/arm64/release/src/hello.co src/hello.c
checking for flags (-MMD -MF) ... ok
checking for flags (-fdiagnostics-color=always) ... ok
[60%]: linking.release build/cross/arm64/release/hello.ko
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-ld -EL -maarch64elf -r -o build/.objs/hello/cross/arm64/release/build /cross/arm64/release/hello.ko.o build/.objs/hello/cross/arm64/release/src/add.co build/.objs/hello/cross/arm64/release/src/hello.co
/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/scripts/mod/modpost -m -a -o build/.objs/hello/cross/arm64/release/build/cross/ arm64/release/Module.symvers -e -N -T-
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc -c -O2 -std=gnu89 -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include /generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated/uapi -I /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include /generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/../lib/gcc/aarch64-linux- gnu/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/kconfig.h -include /home/ruki/.xmake/packages/ l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops= 1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno- ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack- o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.mod.o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/ hello.ko.mod.c
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-ld -EL -maarch64elf -r --build-id=sha1 -T /home/ruki/.xmake /packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/scripts/module.lds -o build/cross/arm64/release/hello.ko build/.objs/hello/cross/arm64/release/build/cross/ arm64/release/hello.ko.o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.mod.o
[100%]: build ok!
```
