---
title: xmake v2.3.2 发布, 带来和ninja一样快的构建速度
tags: [xmake, lua, C/C++, ninja, 并行构建]
date: 2020-03-28
author: Ruki
---

这个版本重点重构优化了下内部并行构建机制，实现多个target间源文件的并行编译，以及并行link的支持，同时优化了xmake的一些内部损耗，修复影响编译速度的一些bug。
通过测试对比，目前的整体构建速度基本跟ninja持平，相比cmake/make, meson/ninja都快了不少，因为它们还额外多了一步生成makefile/build.ninja的过程。

另外，xmake还增加了对sdcc编译工具链的支持，用于编译51/stm8等嵌入式程序。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

## 一些优化点

1. 多个target间所有源文件同时并行构建（之前不能跨target，中途会被link给堵住串行化）
2. 多个无依赖的target的link可以并行执行（之前只能挨个执行link）
3. 修复之前的任务调度bug，更加细粒度化调度，充分利用cpu core资源
4. 优化xmake内部api上的一些损耗，这块效果也很明显

更多优化细节可以看下：[issue #589](https://github.com/xmake-io/xmake/issues/589)

## 构建速度对比

我们在termux和macOS上做了一些对比测试，测试工程在: [xmake-core](https://github.com/xmake-io/xmake/tree/master/core)

对于相对比较多的target的项目，新版xmake对其构建速度的提升更加明显。

### 多任务并行编译测试

| 构建系统        | Termux (8core/-j12) | 构建系统         | MacOS (8core/-j12) |
|-----            | ----                | ---              | ---                |
|xmake            | 24.890s             | xmake            | 12.264s            |
|ninja            | 25.682s             | ninja            | 11.327s            |
|cmake(gen+make)  | 5.416s+28.473s      | cmake(gen+make)  | 1.203s+14.030s     |
|cmake(gen+ninja) | 4.458s+24.842s      | cmake(gen+ninja) | 0.988s+11.644s     |

### 单任务编译测试

| 构建系统        | Termux (-j1)     | 构建系统         | MacOS (-j1)    |
|-----            | ----             | ---              | ---            |
|xmake            | 1m57.707s        | xmake            | 39.937s        |
|ninja            | 1m52.845s        | ninja            | 38.995s        |
|cmake(gen+make)  | 5.416s+2m10.539s | cmake(gen+make)  | 1.203s+41.737s |
|cmake(gen+ninja) | 4.458s+1m54.868s | cmake(gen+ninja) | 0.988s+38.022s |







## 更新内容

### 新特性

* 添加powershell色彩主题用于powershell终端下背景色显示
* 添加`xmake --dry-run -v`命令去空运行构建，仅仅为了查看详细的构建命令
* [#712](https://github.com/xmake-io/xmake/issues/712): 添加sdcc平台，并且支持sdcc编译器

### 改进

* [#589](https://github.com/xmake-io/xmake/issues/589): 改进优化构建速度，支持跨目标间并行编译和link，编译速度和ninja基本持平
* 改进ninja/cmake工程文件生成器插件
* [#728](https://github.com/xmake-io/xmake/issues/728): 改进os.cp支持保留源目录结构层级的递归复制
* [#732](https://github.com/xmake-io/xmake/issues/732): 改进find_package支持查找homebrew/cmake安装的包
* [#695](https://github.com/xmake-io/xmake/issues/695): 改进采用android ndk最新的abi命名

### Bugs修复

* 修复windows下link error显示问题
* [#718](https://github.com/xmake-io/xmake/issues/718): 修复依赖包下载在多镜像时一定概率缓存失效问题
* [#722](https://github.com/xmake-io/xmake/issues/722): 修复无效的包依赖导致安装死循环问题
* [#719](https://github.com/xmake-io/xmake/issues/719): 修复windows下主进程收到ctrlc后，.bat子进程没能立即退出的问题
* [#720](https://github.com/xmake-io/xmake/issues/720): 修复compile_commands生成器的路径转义问题