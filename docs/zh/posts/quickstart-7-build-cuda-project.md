---
title: xmake从入门到精通7：开发和构建Cuda程序
tags: [xmake, lua, cuda]
date: 2019-11-30
author: Ruki
outline: deep
---

xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。

本文我们会详细介绍下如何通过xmake来构建cuda程序以及与c/c++程序混合编译。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

### 准备环境

首先，我们需要安装NVIDIA提供的Cuda Toolkit SDK工具，其相关说明以及安装文档，可参考官方文档：[CUDA Toolkit Documentation](http://docs.nvidia.com/cuda/index.html)。

下载安装好Cuda SDK后，在macosx上会默认安装到`/Developer/NVIDIA/CUDA-x.x`目录下，Windows上可以通过`CUDA_PATH`的环境变量找到对应的SDK目录，而
Linux下默认会安装到`/usr/local/cuda`目录下。

通常，xmake都能自动检测到默认的cuda安装环境，并不需要做任何操作，只需要执行`xmake`命令就可以自动完成编译，当然如果找不到SDK，我们也可以手动指定Cuda SDK环境目录：

```console
$ xmake f --cuda=/usr/local/cuda-9.1/ 
```

或者通过`xmake g/global`命令切到全局设置，避免每次切换编译模式都要重新配置一遍。

```console
$ xmake g --cuda=/usr/local/cuda-9.1/ 
```

如果想要测试xmake对当前cuda环境的探测支持，可以直接运行：

```bash
$ xmake l detect.sdks.find_cuda
{ 
  linkdirs = { 
    "/Developer/NVIDIA/CUDA-10.2/lib/stubs",
    "/Developer/NVIDIA/CUDA-10.2/lib" 
  },
  bindir = "/Developer/NVIDIA/CUDA-10.2/bin",
  sdkdir = "/Developer/NVIDIA/CUDA-10.2",
  includedirs = { 
    "/Developer/NVIDIA/CUDA-10.2/include" 
  } 
}
```

大家也可以帮忙贡献相关检测代码[find_cuda.lua](https://github.com/xmake-io/xmake/blob/master/xmake/modules/detect/sdks/find_cuda.lua)来改进xmake的检测机制。

### 创建工程

接下来，我们就可以创建一个空工程来快速体验下了，xmake自带了cuda的工程模板，只需要指定对应的语言即可创建cuda项目：

```bash
$ xmake create -l cuda test
create test ...
  [+]: xmake.lua
  [+]: src/main.cu
  [+]: .gitignore
create ok!
```






默认创建的cuda工程，就是一个最简单的基于Cuda的hello world工程，其源码结构如下：

```
├── src
│   └── main.cu
└── ke.lua
```

而xmake.lua里面的内容我们也可以简单看下：

```lua
-- define target
target("test")
    set_kind("binary")
    add_files("src/*.cu")
    -- generate SASS code for SM architecture of current host
    add_cugencodes("native")
    -- generate PTX code for the virtual architecture to guarantee compatibility
    add_cugencodes("compute_30")
```

可以看到，除了最基本的.cu源文件添加，跟其他c/c++项目唯一的区别就是多了个`add_cugencodes()`用来设置cuda需要的gencodes，关于这块，下面会详细讲解。

### 编译项目

工程创建好后，只需要简单的执行xmake即可完成编译。

```bash
$ xmake
[00%]: ccache compiling.release src/main.cu
[99%]: devlinking.release test_gpucode.cu.o
[100%]: linking.release test
```

需要注意的是：从v2.2.7版本开始，xmake默认构建会启用device-link的构建行为，也就是说，现在编译过程中，会额外增加一步device-link过程：

```bash
[100%]: devlinking.release test_gpucode.cu.o
```

按照官方的说法，启用device-link设备代码链接的主要优点是可以为您的应用程序提供更传统的代码结构，尤其是在C++中，在现有项目结构不变的前提下，控制每个构建和链接步骤，方便快速的启用GPU代码，实现混合编译。

关于这块可参看NVIDIA的官方描述：[Separate Compilation and Linking of CUDA C++ Device Code](https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/)）
如果要禁用device-link的构建逻辑，可以通过`add_values("cuda.devlink", false)` 来设置禁用它。

当然，我们也可以尝试直接运行这个cuda程序：

```bash
$ xmake run
```

### 项目设置

并且如果设置了里面值为native，那么xmake会自动探测当前主机的cuda设备对应的gencode。

#### add_cuflags

这个接口主要用于添加cu代码相关的编译选项，我们如果还需要一些更加定制化的设置flags，那么就可以调用`add_cuflags`来直接设置更加原始的编译选项，就好比c/c++中的`add_cxflags`。

例如：

```lua
add_cuflags("-gencode arch=compute_30,code=sm_30")
```

#### add_culdflags

这个接口主要用于添加cuda设备链接选项，由于上文所说，2.2.7之后，xmake对于cuda程序的默认构建行为会使用device-link，这个阶段如果要设置一些链接flags，则可以通过这个接口来设置。
因为最终的程序链接，会使用ldflags，不会调用nvcc，直接通过gcc/clang等c/c++链接器来链接，所以device-link这个独立的链接阶段的flags设置，通过这个接口来完成。

```lua
add_culdflags("-gencode arch=compute_30,code=sm_30")
```

#### add_cugencodes

`add_cugencodes()`接口其实就是对`add_cuflags("-gencode arch=compute_xx,code=compute_xx")`编译flags设置的简化封装，其内部参数值对应的实际flags映射关系如下：

```lua
- compute_xx                   --> `-gencode arch=compute_xx,code=compute_xx`
- sm_xx                        --> `-gencode arch=compute_xx,code=sm_xx`
- sm_xx,sm_yy                  --> `-gencode arch=compute_xx,code=[sm_xx,sm_yy]`
- compute_xx,sm_yy             --> `-gencode arch=compute_xx,code=sm_yy`
- compute_xx,sm_yy,sm_zz       --> `-gencode arch=compute_xx,code=[sm_yy,sm_zz]`
- native                       --> match the fastest cuda device on current host,
                                   eg. for a Tesla P100, `-gencode arch=compute_60,code=sm_60` will be added,
                                   if no available device is found, no `-gencode` flags will be added
```

例如：

```lua
add_cugencodes("sm_30")
```

就等价为

```lua
add_cuflags("-gencode arch=compute_30,code=sm_30")
add_culdflags("-gencode arch=compute_30,code=sm_30")
```

是不是上面的更加精简些，这其实就是个用于简化设置的辅助接口。

而如果我们设置了native值，那么xmake会自动探测当前主机的cuda设备，然后快速匹配到它对应的gencode设置，自动追加到整个构建过程中。

例如，如果我们主机目前的GPU是Tesla P100，并且能够被xmake自动检测到，那么下面的设置：

```lua
add_cugencodes("native")
```

等价于：


```lua
add_cugencodes("sm_60")
```

### Cuda/C/C++的混合编译

对于混合编译，我们只需要通过`add_files`接口继续加上对应的c/c++代码文件就行了，是不是很简单？

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cu")
    add_files("src/*.c", "src/*.cpp")
    add_cugencodes("native")
```

### 编译设置

nvcc在编译内部的c/c++代码时候，其实会调用主机环境的c/c++编译器来编译，比如linux下会默认使用gcc/g++，macos下默认使用clang/clang++，windows上默认使用cl.exe。
如果想要让nvcc采用其他的编译器，比如在linux下改用clang作为默认的c/c++编译器，则需要指定`--ccbin=`参数设置，这块可以看下：[compiler-ccbin](https://docs.nvidia.com/cuda/cuda-compiler-driver-nvcc/index.html#file-and-path-specifications-compiler-bindir)

而在xmake中，也对其进行了支持，只需要设置`xmake f --cu-ccbin=clang` 就可以切换到其他编译器。

还有两个跟cuda相关的编译参数，我就简单介绍下：

```bash
xmake f --cu=nvcc --cu-ld=nvcc
```

其中`--cu`用来设置.cu代码的编译器，默认就是nvcc，不过clang现在也支持对.cu代码的编译，可以切换设置来尝试，`--cu-ld`是设置device-link的链接器，而最终的整体程序link过程，还是用的`--ld`来链接的。