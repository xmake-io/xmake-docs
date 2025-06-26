# 尝试构建第三方源码 {#trybuild-3rd-sourcecode}

Xmake v2.3.1 以上版本直接对接了其他第三方构建系统，即使其他项目中没有使用 xmake.lua 来维护，Xmake 也可以直接调用其他构建工具来完成编译。

那用户直接调用使用第三方构建工具来编译不就行了，为啥还要用xmake去调用呢？主要有以下好处：

1. 完全的行为一致，简化编译流程，不管用了哪个其他构建系统，都只需要执行xmake这个命令就可以编译，用户不再需要去研究其他工具的不同的编译流程
2. 完全对接`xmake config`的配置环境，复用xmake的平台探测和sdk环境检测，简化平台配置
3. 对接交叉编译环境，即使是用autotools维护的项目，也能通过xmake快速实现交叉编译

目前已支持的构建系统：

* autotools（已完全对接xmake的交叉编译环境）
* xcodebuild
* cmake（已完全对接xmake的交叉编译环境）
* make
* msbuild
* scons
* meson
* bazel
* ndkbuild
* ninja

## 自动探测构建系统并编译

例如，对于一个使用cmake维护的项目，直接在项目根目录执行xmake，就会自动触发探测机制，检测到CMakeLists.txt，然后提示用户是否需要使用cmake来继续完成编译。

```bash
$ xmake
note: CMakeLists.txt found, try building it (pass -y or --confirm=y/n/d to skip confirm)?
please input: y (y/n)
-- Symbol prefix:
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/ruki/Downloads/libpng-1.6.35/build
[  7%] Built target png-fix-itxt
[ 21%] Built target genfiles
[ 81%] Built target png
[ 83%] Built target png_static
...
output to /Users/ruki/Downloads/libpng-1.6.35/build/artifacts
build ok!
```

## 无缝对接xmake命令

目前支持`xmake clean`, `xmake --rebuild`和`xmake config`等常用命令与第三方系统的无缝对接。

我们可以直接清理cmake维护项目的编译输出文件

```bash
$ xmake clean
$ xmake clean --all
```

如果带上`--all`执行清理，会清除autotools/cmake生成的所有文件，不仅仅只清理对象文件。

默认`xmake`对接的是增量构建行为，不过我们也可以强制快速重建：

```bash
$ xmake --rebuild
```

## 手动切换指定构建系统

如果一个项目下有多个构建系统同时在维护，比如 libpng 项目，自带autotools/cmake/makefile等构建系统维护，xmake 默认优先探测使用了autotools，如果想要强制切换其他构建系统，可以执行：

```bash
$ xmake f --trybuild=[autotools|cmake|make|msbuild| ..]
$ xmake
```

另外，配置了`--trybuild=`参数手动指定了默认的构建系统，后续的build过程就不会额外提示用户选择了。

## 实现快速交叉编译

众所周知，cmake/autotools维护的项目虽然很多都支持交叉编译，但是交叉编译的配置过程很复杂，不同的工具链处理方式还有很多的差异，中途会踩到很多的坑。

即使跑通了一个工具链的交叉编译，如果切到另外一个工具链环境，可能又要折腾好久，而如果使用xmake，通常只需要两条简单的命令即可：

::: tip 注意
目前cmake/autotools都已对接支持了xmake的交叉编译。
:::

### 交叉编译android平台

```bash
$ xmake f -p android --trybuild=autotools [--ndk=xxx]
$ xmake
```

::: tip 注意
其中，--ndk参数配置是可选的，如果用户设置了ANDROID_NDK_HOME环境变量，或者ndk放置在~/Library/Android/sdk/ndk-bundle，xmake都能自动检测到。
:::

是不是很简单？如果你觉得这没啥，那么可以对比下直接操作`./configure`去配置交叉编译，可以看下这篇文档对比下：[将NDK 与其他编译系统配合使用](https://developer.android.com/ndk/guides/other_build_systems#autoconf)

说白了，你大概得这样，还不一定一次就能搞定：

```bash
$ export TOOLCHAIN=$NDK/toolchains/llvm/prebuilt/$HOST_TAG
$ export AR=$TOOLCHAIN/bin/aarch64-linux-android-ar
$ export AS=$TOOLCHAIN/bin/aarch64-linux-android-as
$ export CC=$TOOLCHAIN/bin/aarch64-linux-android21-clang
$ export CXX=$TOOLCHAIN/bin/aarch64-linux-android21-clang++
$ export LD=$TOOLCHAIN/bin/aarch64-linux-android-ld
$ export RANLIB=$TOOLCHAIN/bin/aarch64-linux-android-ranlib
$ export STRIP=$TOOLCHAIN/bin/aarch64-linux-android-strip
$ ./configure --host aarch64-linux-android
$ make
```

如果是cmake呢，交叉编译也不省事，对于android平台，得这么配置。

```bash
$ cmake \
    -DCMAKE_TOOLCHAIN_FILE=$NDK/build/cmake/android.toolchain.cmake \
    -DANDROID_ABI=$ABI \
    -DANDROID_NATIVE_API_LEVEL=$MINSDKVERSION \
    $OTHER_ARGS
```

而对于 ios 平台，没找到简单的配置方式，就找到个第三方的 ios 工具链配置，很复杂：https://github.com/leetal/ios-cmake/blob/master/ios.toolchain.cmake

对于 mingw 又是另外一种方式，我又折腾了半天环境，很是折腾。

而对接了xmake后，不管是cmake还是autotools，交叉编译都是非常简单的，而且配置方式也完全一样，精简一致。

### 交叉编译iphoneos平台

```bash
$ xmake f -p iphoneos --trybuild=[cmake|autotools]
$ xmake
```

### 交叉编译mingw平台

```bash
$ xmake f -p mingw --trybuild=[cmake|autotools] [--mingw=xxx]
$ xmake
```

### 使用其他交叉编译工具链

```bash
$ xmake f -p cross --trybuild=[cmake|autotools] --sdk=/xxxx
$ xmake
```

关于更多交叉编译的配置细节，请参考文档：[交叉编译](https://xmake.io/#/zh-cn/guide/configuration?id=%e4%ba%a4%e5%8f%89%e7%bc%96%e8%af%91)，除了多了一个`--trybuild=`参数，其他交叉编译配置参数都是完全通用的。

## 传递用户配置参数

我们可以通过`--tryconfigs=`来传递用户额外的配置参数到对应的第三方构建系统，比如：autotools会传递给`./configure`，cmake会传递给`cmake`命令。

```bash
$ xmake f --trybuild=autotools --tryconfigs="--enable-shared=no"
$ xmake
```

比如上述命令，传递`--enable-shared=no`给`./configure`，来禁用动态库编译。

另外，对于`--cflags`, `--includedirs`和`--ldflags`等参数，不需要通过`--tryconfigs`，通过`xmake config --cflags=`等内置参数就可透传过去。

## 编译其他构建系统过程示例

### 通用编译方式

大多数情况下，每个构建系统对接后的编译方式都是一致的，除了`--trybuild=`配置参数除外。

```bash
$ xmake f --trybuild=[autotools|cmake|meson|ninja|bazel|make|msbuild|xcodebuild]
$ xmake
```

::: tip 注意
我们还需要确保--trybuild指定的构建工具已经安装能够正常使用。
:::

### 构建Android jni程序

如果当前项目下存在`jni/Android.mk`，那么xmake可以直接调用ndk-build来构建jni库。

```bash
$ xmake f -p android --trybuild=ndkbuild [--ndk=]
$ xmake
```

如果觉得命令行编译jni比较麻烦，xmake也提供了相关的gradle集成插件[xmake-gradle](https://github.com/xmake-io/xmake-gradle)，可以无缝集成xmake进行jni库的编译集成，具体详情见：[使用xmake-gradle插件构建JNI程序](https://xmake.io/#/zh-cn/plugin/more_plugins?id=gradle%e6%8f%92%e4%bb%b6%ef%bc%88jni%ef%bc%89)
