---
title: xmake v2.2.7 发布, 改进Cuda项目构建
tags: [xmake, lua, C/C++, 版本更新, Cuda]
date: 2019-06-17
author: Ruki
---

这个版本主要对Cuda项目的构建做了很多的改进，并且新增了对lex/yacc编译支持，同时也对target新增了`on_link`, `before_link`和`after_link`等链接阶段的定制化支持。

这里，我还要感谢下@[OpportunityLiu](https://github.com/OpportunityLiu)对xmake的支持，这个版本中[OpportunityLiu](https://github.com/OpportunityLiu)贡献了大量的代码去改进Cuda的支持。
此外，他还帮忙改进了xmake的整个单元测试框架，自更新程序，命令行tab补全以及ci脚本，使得xmake的更新迭代更加高效和稳定。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

## 新特性介绍

### Cuda项目构建改进

#### 头文件依赖检测和增量编译

2.2.6之前的版本，对cuda的编译支持并不是很完善，至少连头文件依赖检测也是没有提供的，因此如果cuda代码一多，每次改动都会编译所有，并不能像c/c++代码那样做到检测改动，进行增量编译。

而在新版本中，xmake对其进行了支持，现在已经可以很好的在不同平台下，处理依赖关系了，这对日常编译和开发效率也会有不少的提升。

#### 新增gencodes设置相关api 

之前的版本，添加gencodes配置非常的繁琐，并不简洁，可以看下之前的配置：

```lua
target("cuda_console")
    set_kind("binary")
    add_files("src/*.cu")

    add_cuflags("-gencode arch=compute_30,code=sm_30", "-gencode arch=compute_35,code=sm_35")
    add_cuflags("-gencode arch=compute_37,code=sm_37", "-gencode arch=compute_50,code=sm_50")
    add_cuflags("-gencode arch=compute_52,code=sm_52", "-gencode arch=compute_60,code=sm_60")
    add_cuflags("-gencode arch=compute_61,code=sm_61", "-gencode arch=compute_70,code=sm_70")
    add_cuflags("-gencode arch=compute_70,code=compute_70")

    add_ldflags("-gencode arch=compute_30,code=sm_30", "-gencode arch=compute_35,code=sm_35")
    add_ldflags("-gencode arch=compute_37,code=sm_37", "-gencode arch=compute_50,code=sm_50")
    add_ldflags("-gencode arch=compute_52,code=sm_52", "-gencode arch=compute_60,code=sm_60")
    add_ldflags("-gencode arch=compute_61,code=sm_61", "-gencode arch=compute_70,code=sm_70")
    add_ldflags("-gencode arch=compute_70,code=compute_70")
```

因此为了精简xmake.lua的配置，针对cuda项目增加的`add_cugencodes`api来简化配置，改进后如下：

```lua
target("cuda_console")
    set_kind("binary")
    add_files("src/*.cu")

    -- generate SASS code for each SM architecture
    add_cugencodes("sm_30", "sm_35", "sm_37", "sm_50", "sm_52", "sm_60", "sm_61", "sm_70")

    -- generate PTX code from the highest SM architecture to guarantee forward-compatibility
    add_cugencodes("compute_70")
```

另外当配置成`add_cugencodes("native")`的时候，xmake会自动探测当前设备支持的gencodes，自动添加进来，会更加的方便高效。

这个，也要感谢下[OpportunityLiu](https://github.com/OpportunityLiu)提供的探测代码以及对`add_cugencodes`的实现。













#### device-link设备链接支持

新版本中，xmake基本上重构了整个cuda的构建过程，将cuda相关构建抽离到独立的cuda构建rule中去维护，并且默认采用了device-link的链接方式。

关于device-link的描述和好处，可以参考相关官方介绍：https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/

我们在编译包含跨编译单元的 `__global__` 或 `__device__`函数的调用的时候也是需要devlink的，因此在xmake中，目前默认就是开启了devlink。

对于用户来讲，并不需要对xmake.lua做任何改动，当然如果用户想要手动禁用devlink，也是可以的：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cu")
    add_values("cuda.devlink", false) -- 显式禁用默认的device-link行为
```

#### 支持用clang编译cuda项目

clang目前也支持对*.cu文件的编译，不过不同版本的clang支持的cuda版本是有一定限制的，clang7只能支持cuda7-9.2，8支持到10，要支持10.1得需要clang9。

而xmake除了支持调用nvcc来编译cuda项目，也可以直接切到clang来编译，例如：

```console
xmake f --cu=clang
xmake
```

不过关于devlink，似乎还是需要依赖nvcc，clang并不支持。

#### 可配置切换nvcc使用的c++编译器

xmake新增了`--cu-ccbin=`参数可以配置切换，nvcc默认使用的c++编译器和链接器，用法如下：

```console
xmake f --cu-ccbin=clang++
xmake
```

即可让nvcc在编译cuda代码的时候，内部调用clang++编译器。

### 定制化链接过程

在新版本中，我们加入了跟link链接阶段相关的定制化处理，用户可以通过在target/rule中实现`on_link`, `before_link`和`after_link`来扩展定制自己的链接过程。

比如，我们想在正常c/c++代码的链接阶段前，预处理一些其他的事情，比如对*.o文件做些处理什么的，那么就可以在before_link阶段写点自己的lua脚本就行了：

```lua
target("test")
    before_link(function (target) 
        print("process objects", target:objectfiles())
    end)
```

或者我们想改写内置的链接过程，可以用`on_link`:

```lua
target("test")
    on_link(function (target) 
        print("link objects", target:objectfiles())
    end)
```

还有`after_link`则是在链接完成之后，做一些定制化任务。

### Lex/Yacc编译支持

当前xmake已经可以原生支持lex/flex, yacc/bison等对*.l/*.y文件的编译处理，来快速开发一些跟编译器相关的项目。

我们只需要添加lex,yacc两个规则到target中，使其可以正常处理*.l/*.y文件，当然*.ll/*.yy也是支持的。

```lua
target("calc")
    set_kind("binary")
    add_rules("lex", "yacc")
    add_files("src/*.l", "src/*.y")
```

这里有个例子代码，可供参考：[lex_yacc_example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/lex_yacc)

### 运行环境设置改进

#### 设置运行目录

我们可以通过`set_rundir`接口用于设置默认运行target程序的当前运行目录，如果不设置，默认情况下，target是在可执行文件所在目录加载运行。

如果用户想要修改加载目录，一种是通过`on_run()`的方式自定义运行逻辑，里面去做切换，但仅仅为了切个目录就这么做，太过繁琐。

因此可以通过这个接口快速的对默认执行的目录环境做设置切换。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_rundir("$(projectdir)/xxx")
```

#### 添加运行环境变量

另外一个新接口`add_runenvs`可用于添加设置默认运行target程序的环境变量。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_runenvs("PATH", "/tmp/bin", "xxx/bin")
    add_runenvs("NAME", "value")
```

### 命令行tab补全支持

为了改善用户体验，新版本中对命令行下xmake命令参数tab补全也做了支持，用户可以很方便快速的tab出xmake的所有命令参数。

当前支持zsh/bash/sh以及powershell。


### 更加方便的自更新命令

之前的版本，xmake已经提供了方便的自更新命令`xmake update`来更新xmake自身版本，甚至是更新指定分支版本，例如：`xmake update dev/master`

但是，还有些不足的地方：

1. 每次更新都需要重新编译core，所以更新很慢，然而很多情况下，新版本仅仅只有脚本变动，core并不会变
2. 更新指定dev/master分支，在windows上实现的并不完美，有点滞后，并不能即时同步到线上dev/master版本。

因此，这块[OpportunityLiu](https://github.com/OpportunityLiu)帮忙做了很多的改进工作：

1. 提供`xmake update -s/--scriptonly`参数，仅仅更新lua脚本，不去额外编译core，实现快速的迭代更新
2. 改进ci脚本，在windows上实现ci自动化构建，`xmake update dev`自动拉取ci上预构建好的安装包下载更新
3. 可以指定从其他github repo上更新xmake，方便贡献者更新自己的fork版本，也方便用户切换镜像repo，`xmake update gitee:tboox/xmake`

## 更新内容

### 新特性

* [#440](https://github.com/xmake-io/xmake/issues/440): 为target/run添加`set_rundir()`和`add_runenvs()`接口设置
* [#443](https://github.com/xmake-io/xmake/pull/443): 添加命令行tab自动完成支持
* 为rule/target添加`on_link`,`before_link`和`after_link`阶段自定义脚本支持
* [#190](https://github.com/xmake-io/xmake/issues/190): 添加`add_rules("lex", "yacc")`规则去支持lex/yacc项目

### 改进

* [#430](https://github.com/xmake-io/xmake/pull/430): 添加`add_cucodegens()`api为cuda改进设置codegen
* [#432](https://github.com/xmake-io/xmake/pull/432): 针对cuda编译支持依赖分析检测
* [#437](https://github.com/xmake-io/xmake/issues/437): 支持指定更新源，`xmake update github:xmake-io/xmake#dev`
* [#438](https://github.com/xmake-io/xmake/pull/438): 支持仅更新脚本，`xmake update --scriptonly dev`
* [#433](https://github.com/xmake-io/xmake/issues/433): 改进cuda构建支持device-link设备代码链接
* [#442](https://github.com/xmake-io/xmake/issues/442): 改进tests测试框架
