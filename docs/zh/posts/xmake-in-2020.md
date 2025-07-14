---
title: Xmake 2020 年终总结
tags: [xmake, lua, C/C++]
date: 2020-12-30
author: Ruki
---

title: Xmake 2020 年终总结
tags: [xmake, lua, C/C++]
date: 2020-12-30
author: Ruki

---
2020 年，[xmake](https://github.com/xmake-io/xmake) 总共迭代发布了9个版本，新增了 1871 commits，1k+ stars，新增处理了 500+ 的 issues/pr。

![](/assets/img/posts/xmake/star-history-2020.png)

### 简介

还不知道 xmake 是什么的同学，这里先做个简单的介绍：

xmake 是一个基于 Lua 的轻量级跨平台构建工具，使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

虽然，简单易用是 xmake 的一大特色，但 xmake 的功能也是非常强大的，既能够像 Make/Ninja 那样可以直接编译项目，也可以像 CMake/Meson 那样生成工程文件，还有内置的包管理系统来帮助用户解决 C/C++依赖库的集成使用问题。

目前，xmake主要用于C/C++项目的构建，但是同时也支持其他native语言的构建，可以实现跟C/C++进行混合编译，同时编译速度也是非常的快，可以跟Ninja持平。

### 日活破 100

5年了，终于破100了（好悲催~），但相比去年已经算是有了很大的增长，每天最多有 113 人，304 个工程在使用 xmake 进行构建。

![](/assets/img/posts/xmake/build-stats-2020.png)

### 上线官方课程

今年还上线了一门 xmake 相关的入门课程：[Xmake 带你轻松构建 C/C++ 项目](/zh/about/course)







### 发布独立的 C/C++ 包管理器 (Xrepo)

今年，xmake 对包管理的集成使用做了很大的改进和完善，为了方便日常管理维护依赖包，我们新增了独立的 C/C++ 包管理工具 [Xrepo](https://github.com/xmake-io/xrepo) 可以快速安装 C/C++ 依赖包

![](https://xrepo.xmake.io/assets/img/xrepo.gif)

### 上线 xrepo 包文档站

同时，我们还上线了 xrepo 包的 [文档站](https://xrepo.xmake.io/#/zh-cn/), 我们可以在上面快速检索每个包的使用和集成方式，以及查看当前支持的平台列表和安装方式。

### 官方 xmake-repo 仓库新增 200+ 常用包

非常感谢各位 xmake 的贡献者，使得 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库在今年新增了 200+ 的常用 C/C++ 包，我们可以很方便的在项目中快速集成使用它们。

虽然里面的包还是很少，但是没有关系，xmake 也支持直接集成 vcpkg/conan/clib/homebrew/dub/pacman 等其他的管理仓库中的 C/C++ 包。

```
add_requires("tbox >1.6.1", "libuv master")
add_requires("vcpkg::ffmpeg", {alias = "ffmpeg"})
add_requires("brew::pcre2/libpcre2-8", {alias = "pcre2"})
add_requires("conan::openssl/1.1.1g", {alias = "openssl"})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libuv", "ffmpeg", "pcre2", "openssl")
```

### 今年 xmake 的一些新增特性

今年，我们也对 xmake 做了很多的迭代改进，新增了不少实用的新特性，例如：

- 改进依赖包集成体验，并新增依赖包的 license 自动检测机制
- 增加对 Intel 编译工具链的支持
- 增加对 Zig，Fortran 等其他语言项目的编译支持
- 增加对 Wasm 工具链以及 Qt for wasm 项目的编译支持
- 重构了整个工具链模块，实现更加方便的自定义工具链，更加快速灵活的工具链切换
- 新增 iOS/MacOS App 应用程序，Frameworks 和 bundle 程序的编译支持，可以完全脱离 xcodebuild，也能从源码编译生成 ipa 包
- 对 xmake 的整体构建速度进行了大提速，编译速度完全媲美 ninja
- 新增了 build.ninja 工程文件生成，并对现有 vs/vsxmake 工程进行了很多的改进
- 新增 try-build 构建模式，可以使用 xmake 直接编译第三方构建系统的项目，例如直接编译 cmake, ninja, gn, autotools, android.mk 等维护的项目，同时还能支持交叉编译环境的自动配置
- 重构支持了 socket/pipe/process + 协程 进行统一调度，为下一步跨平台分布式编译做准备

其他细节特性和改进还有很多，我就不一一列举了。

### Xmake Discord 社区频道上线

Discord (discord.com) 是一个非常不错的全端即时交流平台，为了更好地和国内外用户进行即时交流，我们在上面创建了中文和英文两个不同的频道，界面大概长这样。

![](https://tboox.org/static/img/xmake/discord.png)

对 xmake 感兴趣的朋友可以点击 [服务器邀请链接](https://discord.gg/XXRp26A4Gr) 加入我们的频道，当然话题仅限于 xmake 相关项目。

### 新一年的目标

- 改进和完善现有C/C++包管理集成
- xmake-repo 仓库新增收录1000+ 的常用包
- 实现跨平台的分布式编译
- 重写 xmake-idea 插件

最后，再晒张我个人今年在开源上的总体贡献图，明年继续~

有对 xmake 感兴趣的朋友，欢迎关注我们，请戳这： [https://github.com/xmake-io/xmake](https://github.com/xmake-io/xmake)

![](/assets/img/posts/xmake/commits-2020.png)