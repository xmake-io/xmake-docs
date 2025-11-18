---
title: Summer2022：暑期来 Xmake 社区做项目吧，还有奖金领取哦
tags: [xmake, lua, C/C++, summer, 开源之夏]
date: 2022-05-01
author: Ruki
outline: deep
---

### "开源之夏" 简介

开源之夏是开源软件供应链点亮计划下的暑期活动，由中国科学院软件研究所与openEuler社区联合主办，旨在鼓励在校学生积极参与开源软件的开发维护，促进优秀开源软件社区的蓬勃发展。作为每年暑期最火热的开源活动，开源之夏如今已进入第三届。

2022年，开源之夏联合124家开源社区，针对开源项目的开发与维护提供mini任务，学生可自主选择感兴趣的项目进行申请，并在中选后获得社区资深开发者亲自指导的机会。项目成功结项并贡献给社区后，参与者将获得开源之夏活动奖金和结项证书。

开源之夏网站：[https://summer.iscas.ac.cn/](https://summer.iscas.ac.cn/)

### 来 Xmake 社区一起做项目

Xmake 社区今年继续参加了开源之夏 2022 活动，欢迎年满 18 周岁的在校学生踊跃参与我们的项目，还有奖金拿哦。

![xmake_summer](https://tboox.org/static/img/xmake/xmake_summer.jpeg)

## Xmake 社区项目

学生可以申请参加以下三个项目之一，完整项目详情见：[Xmake 项目详情](https://summer-ospp.ac.cn/#/org/orgdetail/090748c6-6504-4d2d-9a11-f9f3e1876f7b/)

* [Xmake 官网](https://xmake.io/zh/)





### Xmake 仓库包制作

完成制作下面 12 个 C/C++ 包进入 Xmake 官方包仓库

- https://github.com/wolfSSL/wolfssl
- https://github.com/apache/apr
- https://github.com/wmcbrine/PDCurses
- https://github.com/grpc/grpc
- https://github.com/zyantific/zydis
- https://github.com/modm-io/modm
- https://gitlab.gnome.org/GNOME/gdk-pixbuf
- https://github.com/xtensor-stack/xtensor-io
- https://github.com/AGWA/git-crypt
- https://github.com/NVIDIA/thrust
- v8 for windows
- quickjs port for windows

导师：waruqi@gmail.com

### xmake-idea 插件改进

由于 Idea 更新迭代频繁，现有 xmake-idea 插件编译存在很多的废弃 API 使用警告，并且最新 CLion 版本也不再支持，因此需要做一些更新支持

并且需要新增一些配置选项用于支持最新版本的 Xmake 的配置

- 兼容最新版本的 CLion
- 移除所有废弃的 API 使用，并且在不影响功能的前提下，使用新的 API 进行替代
- 配置面板增加一个工具链切换的配置选项
- 更新现有配置中，平台，架构的选项列表
- 检测 xmake.lua 改动自动更新生成 CMakeLists.txt 和 compile_commands.json 文件

导师：dinophp@gmail.com

### 基于 Xmake 的面向 RT-Thread Smart 操作系统的系统构建工具

用于 RT-Thread Smart 开源操作系统的，基于 Xmake 的类 buildroot 的交叉构建系统：smart-build，它可以编译基础的软件包（调用xmake & xrepo的方式），构建出基本的应用程序，并输出相关文件到根文件系统文件夹下。

希望可以做到：
- 针对系列的软件包，构建类似buildroot的menuconfig选择软件包及配置；
- 支持两种以上架构的编译工具链，如arm、aarch64、risc-v等中的两种，并可选择；
- 支持软件包的不同版本，并处理好依赖关系，并从网络上下载下来到本地；
- 支持release模式编译，支持debug模式编译；
- 支持按静态库模式编译，支持按动态库模式编译；
- 支持在最终输出到根文件系统时strip掉多余的符号信息；

欢迎有更多自己的想法，或从用户端对这个事情的理解和考虑。

产出标准：
- 能够基于RT-Thread Smart应用程序构建的方式，构建一个个的程序，并输出到 rt-smart/userapps/root 目录下，并可以使用已有脚本转成rootfs的映像文件；
- 最终代码可以更新到git仓库中，代码符合xmake的规范；

技术要求： 
- 熟悉构建系统，熟悉基于GNU GCC & ld 的编译过程；
- 熟悉lua语言，对 xmake、xrepo 有一定的了解；
- 熟悉git操作；

## 中选学生可以获得什么

 - 结识开源界小伙伴和技术大牛
 - 获得社区导师的专业指导
 - 获得开源项目的经验、经历，丰富个人简历
 - 获得纪念品、奖金和证书:

如果想了解更多详情，见开源之夏官方网站。

 - [Xmake 官网](https://xmake.io/zh/)
 - [Xmake 项目](https://github.com/xmake-io/xmake)
 - 开源之夏官网：https://summer-ospp.ac.cn/
 - 学生参加指南：https://summer-ospp.ac.cn/help/student/
 - Xmake 项目详情：https://summer-ospp.ac.cn/#/org/orgdetail/090748c6-6504-4d2d-9a11-f9f3e1876f7b/
