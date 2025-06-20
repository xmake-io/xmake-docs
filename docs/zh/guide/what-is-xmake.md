# 什么是 Xmake?

xmake 是一个基于 Lua 的轻量级跨平台构建工具，使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

虽然，简单易用是 xmake 的一大特色，但 xmake 的功能也是非常强大的，既能够像 Make/Ninja 那样可以直接编译项目，也可以像 CMake/Meson 那样生成工程文件，还有内置的包管理系统来帮助用户解决 C/C++依赖库的集成使用问题。

目前，xmake主要用于C/C++项目的构建，但是同时也支持其他native语言的构建，可以实现跟C/C++进行混合编译，同时编译速度也是非常的快，可以跟Ninja持平。

如果你想要了解更多，请参考：[在线文档](https://xmake.io/zh/guide/getting-started.html), [Github](https://github.com/xmake-io/xmake)以及[Gitee](https://gitee.com/tboox/xmake)，同时也欢迎加入我们的 [社区](https://xmake.io/zh/about/contact.html).

![](https://xmake.io/assets/img/index/xmake-basic-render.gif)
