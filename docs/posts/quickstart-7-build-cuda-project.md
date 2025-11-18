---
title: Xmake Getting Started Tutorial 7, Developing and Building CUDA Programs
tags: [xmake, lua, cuda]
date: 2019-11-30
author: Ruki
---

xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance, 
and a consistent build experience across platforms.

In this article, we will explain in detail how to build CUDA programs and mixed compilation with c/c++ programs through xmake.

* [Project Source](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io)

### Preparing the Environment

First, we need to install the CUDA Toolkit SDK tool provided by NVIDIA. For related instructions and installation documentation, please refer to the official documentation: [CUDA Toolkit Documentation](http://docs.nvidia.com/cuda/index.html).

After downloading and installing the CUDA SDK, on macOS it will be installed to the `/Developer/NVIDIA/CUDA-x.x` directory by default. On Windows, you can find the corresponding SDK directory through the `CUDA_PATH` environment variable, and on Linux it will be installed to the `/usr/local/cuda` directory by default.

Usually, xmake can automatically detect the default CUDA installation environment without any operation. You just need to execute the `xmake` command to automatically complete the compilation. Of course, if the SDK cannot be found, we can also manually specify the CUDA SDK environment directory:

```console
$ xmake f --cuda=/usr/local/cuda-9.1/ 
```

Or use the `xmake g/global` command to switch to global settings to avoid having to reconfigure every time you switch compilation modes.

```console
$ xmake g --cuda=/usr/local/cuda-9.1/ 
```

If you want to test xmake's detection support for the current CUDA environment, you can directly run:

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

You can also help contribute related detection code [find_cuda.lua](https://github.com/xmake-io/xmake/blob/master/xmake/modules/detect/sdks/find_cuda.lua) to improve xmake's detection mechanism.

### Creating a Project

Next, we can create an empty project to quickly experience it. xmake comes with a CUDA project template. Just specify the corresponding language to create a CUDA project:

```bash
$ xmake create -l cuda test
create test ...
  [+]: xmake.lua
  [+]: src/main.cu
  [+]: .gitignore
create ok!
```

The default created CUDA project is the simplest CUDA-based hello world project. Its source code structure is as follows:

```
├── src
│   └── main.cu
└── xmake.lua
```

We can also take a brief look at the content in xmake.lua:

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

As you can see, except for the most basic .cu source file addition, the only difference from other c/c++ projects is the addition of `add_cugencodes()` to set the gencodes required by CUDA. We will explain this in detail below.

### Compiling the Project

After the project is created, you just need to simply execute xmake to complete the compilation.

```bash
$ xmake
[00%]: ccache compiling.release src/main.cu
[99%]: devlinking.release test_gpucode.cu.o
[100%]: linking.release test
```

Note: Starting from v2.2.7, xmake enables device-link build behavior by default. That is to say, an additional device-link step will be added during the compilation process:

```bash
[100%]: devlinking.release test_gpucode.cu.o
```

According to the official statement, the main advantage of enabling device-link device code linking is that it can provide a more traditional code structure for your application, especially in C++, allowing you to control each build and link step under the premise of keeping the existing project structure unchanged, quickly enable GPU code, and achieve mixed compilation.

For this, please refer to NVIDIA's official description: [Separate Compilation and Linking of CUDA C++ Device Code](https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/)
If you want to disable the device-link build logic, you can set it to disable via `add_values("cuda.devlink", false)`.

Of course, we can also try to run this CUDA program directly:

```bash
$ xmake run
```

### Project Settings

And if the value inside is set to native, xmake will automatically detect the gencode corresponding to the CUDA device on the current host.

#### add_cuflags

This interface is mainly used to add compilation options related to cu code. If we need some more customized flag settings, we can call `add_cuflags` to directly set more raw compilation options, just like `add_cxflags` in c/c++.

For example:

```lua
add_cuflags("-gencode arch=compute_30,code=sm_30")
```

#### add_culdflags

This interface is mainly used to add CUDA device link options. As mentioned above, after 2.2.7, xmake's default build behavior for CUDA programs will use device-link. If you need to set some link flags at this stage, you can set them through this interface.
Because the final program linking will use ldflags and will not call nvcc, it will be linked directly through gcc/clang and other c/c++ linkers. So the flag settings for the device-link independent link stage are completed through this interface.

```lua
add_culdflags("-gencode arch=compute_30,code=sm_30")
```

#### add_cugencodes

The `add_cugencodes()` interface is actually a simplified encapsulation of the `add_cuflags("-gencode arch=compute_xx,code=compute_xx")` compilation flag settings. The mapping relationship between its internal parameter values and the actual flags is as follows:

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

For example:

```lua
add_cugencodes("sm_30")
```

is equivalent to

```lua
add_cuflags("-gencode arch=compute_30,code=sm_30")
add_culdflags("-gencode arch=compute_30,code=sm_30")
```

Isn't the above more concise? This is actually an auxiliary interface for simplified settings.

And if we set the native value, xmake will automatically detect the CUDA device on the current host, then quickly match its corresponding gencode settings, and automatically append them to the entire build process.

For example, if our host's current GPU is a Tesla P100 and can be automatically detected by xmake, then the following setting:

```lua
add_cugencodes("native")
```

is equivalent to:

```lua
add_cugencodes("sm_60")
```

### CUDA/C/C++ Mixed Compilation

For mixed compilation, we just need to continue adding the corresponding c/c++ code files through the `add_files` interface. Isn't it simple?

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cu")
    add_files("src/*.c", "src/*.cpp")
    add_cugencodes("native")
```

### Compilation Settings

When nvcc compiles internal c/c++ code, it actually calls the c/c++ compiler of the host environment to compile. For example, it defaults to using gcc/g++ on Linux, clang/clang++ on macOS, and cl.exe on Windows.
If you want nvcc to use other compilers, such as using clang as the default c/c++ compiler on Linux, you need to specify the `--ccbin=` parameter setting. For this, please see: [compiler-ccbin](https://docs.nvidia.com/cuda/cuda-compiler-driver-nvcc/index.html#file-and-path-specifications-compiler-bindir)

In xmake, this is also supported. Just set `xmake f --cu-ccbin=clang` to switch to other compilers.

There are two other compilation parameters related to CUDA. Let me briefly introduce them:

```bash
xmake f --cu=nvcc --cu-ld=nvcc
```

Among them, `--cu` is used to set the compiler for .cu code. The default is nvcc. However, clang now also supports compilation of .cu code, so you can switch the setting to try it. `--cu-ld` is used to set the device-link linker, while the final overall program link process still uses `--ld` for linking.

