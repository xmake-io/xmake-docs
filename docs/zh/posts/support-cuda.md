---
title: xmake新增对Cuda代码编译支持
tags: [xmake, lua, cuda, NVIDIA, GPU]
date: 2018-03-09
author: Ruki
outline: deep
---

最近研究了下NVIDIA Cuda Toolkit的编译环境，并且在xmake 2.1.10开发版中，新增了对cuda编译环境的支持，可以直接编译`*.cu`代码。

关于Cuda Toolkit相关说明以及安装文档，可参考官方文档：[CUDA Toolkit Documentation](http://docs.nvidia.com/cuda/index.html)。

下载安装好Cuda SDK后，在macosx上回默认安装到`/Developer/NVIDIA/CUDA-x.x`目录下，Windows上可以通过`CUDA_PATH`的环境变量找到对应的SDK目录，而
Linux下默认会安装到`/usr/local/cuda`目录下。

xmake在执行`$ xmake` 命令编译`*.cu`代码的时候，会尝试探测这些默认的安装目录，然后尝试调用nvcc编译器直接编译cuda程序，大部分情况下只需要执行：

```bash
$ xmake
```

#### 创建和编译Cuda工程

我之前编译之前，我们可以通过xmake创建一个空的cuda工程，例如：

```bash
$ xmake create -l cuda test
$ cd test
$ xmake
```

通过`-l`参数指定创建一个cuda代码工程，工程名为test，执行输出如下：

```
[00%]: ccache compiling.release src/main.cu
[100%]: linking.release test
```

我们也可以尝试直接运行这个cuda程序：

```bash
$ xmake run
```




接着我们来看下，这个cuda工程的`xmake.lua`文件：

```lua
-- define target
target("test")

    -- set kind
    set_kind("binary")

    -- add include directories
    add_includedirs("inc")

    -- add files
    add_files("src/*.cu")

    -- generate SASS code for each SM architecture
    for _, sm in ipairs({"30", "35", "37", "50", "52", "60", "61", "70"}) do
        add_cuflags("-gencode arch=compute_" .. sm .. ",code=sm_" .. sm)
        add_ldflags("-gencode arch=compute_" .. sm .. ",code=sm_" .. sm)
    end

    -- generate PTX code from the highest SM architecture to guarantee forward-compatibility
    sm = "70"
    add_cuflags("-gencode arch=compute_" .. sm .. ",code=compute_" .. sm)
    add_ldflags("-gencode arch=compute_" .. sm .. ",code=compute_" .. sm)
```

里面大部分跟C/C++的工程描述类似，唯一的区别就是通过`add_cuflags`设置了一些cuda代码特有的编译选项，这部分配置根据用户的需求，可自己调整。

关于`add_cuflags`的更多说明，可阅读[xmake的官方文档](https://xmake.io/zh/)。

#### Cuda编译环境的配置

默认情况下，xmake都能成功检测到系统中安装的Cuda SDK环境，用户不需要做额外的配置操作，当然如果遇到检测不到的情况，用户也可以手动指定Cuda SDK的路径：

```bash
$ xmake f --cuda_dir=/usr/local/cuda
$ xmake
```

来告诉xmake，你当前的Cuda SDK的安装目录在哪里。

如果想要测试xmake对当前cuda环境的探测支持，可以直接运行：

```bash
$ xmake l detect.sdks.find_cuda
```

```js
{
    linkdirs =
    {
        /Developer/NVIDIA/CUDA-9.1/lib
    }

,   bindir = /Developer/NVIDIA/CUDA-9.1/bin
,   includedirs =
    {
        /Developer/NVIDIA/CUDA-9.1/include
    }

,   cudadir = /Developer/NVIDIA/CUDA-9.1
}
```

来测试检测情况，甚至可以帮忙贡献相关检测代码[find_cuda.lua](https://github.com/xmake-io/xmake/blob/master/xmake/modules/detect/sdks/find_cuda.lua)来改进xmake的检测过程。


#### 其他说明

注：目前对cuda的支持刚刚完成，还没正式发版，更多关于xmake对cuda的支持情况和进展，见：[issues #158](https://github.com/xmake-io/xmake/issues/158)。

如果要试用此特性，可下载安装最新[master版本](https://github.com/xmake-io/xmake.git)，或者下载[windows 2.1.10-dev安装包](https://github.com/xmake-io/xmake/releases/download/v2.1.9/xmake-v2.1.10-dev.exe)。

<img src="/assets/img/posts/xmake/cuda_test.gif">