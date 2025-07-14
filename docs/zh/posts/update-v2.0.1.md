---
title: xmake v2.0.1 更新!
tags: [xmake, 版本更新, doxygen, 插件]
date: 2016-06-09
author: Ruki
---

[源码](https://github.com/waruqi/xmake)

# 更新内容

此版本重构了90%的代码

### 新特性

* 增加task任务机制，可运行自定义任务脚本
* 实现plugin扩展机制，可以很方便扩展实现自定义插件，目前已实现的一些内置插件
* 增加project文件导出插件(目前已支持makefile的生成，后续会支持：vs, xcode等工程的生成)
* 增加hello xmake插件（插件demo）
* 增加doxygen文档生成插件
* 增加自定义宏脚本插件（支持动态宏记录、宏回放、匿名宏、批量导入、导出等功能）
* 增加更多的类库用于插件化开发
* 实现异常捕获机制，简化上层调用逻辑
* 增加多个option进行宏绑定，实现配置一个参数，就可以同时对多个配置进行生效
* 增加显示全局构建进度



### 改进

* 重构整个xmake.lua描述文件的解释器，更加的灵活可扩展
* 更加严格的语法检测机制
* 更加严格的作用域管理，实现沙盒引擎，对xmake.lua中脚本进行沙盒化处理，使得xmake.lua更加的安全
* 简化模板的开发，简单几行描述就可以扩展一个新的自定义工程模板
* 完全模块化platforms、tools、templates、actions，以及通过自注册机制，只需把自定义的脚本放入对应目录，就可实现快速扩展
* 针对所有可扩展脚本所需api进行大量简化，并实现大量类库，通过import机制进行导入使用
* 移除对gnu make/nmake等make工具的依赖，不再需要makefile，实现自己的make算法，
* 优化构建速度，支持多任务编译(支持vs编译器)（实测：比v1.0.4提升x4倍的构建性能）
* 优化自动检测机制，更加的稳定和准确
* 修改部分工程描述api，增强扩展性，减少一些命名歧义（对低版本向下兼容）
* 优化静态库合并：`add_files("*.a")`，修复一些bug
* 优化交叉编译，通过`--sdk=xxx`参数实现更加方便智能的进行交叉编译配置，简化mingw平台的编译配置
* 简化命令行配置开关, 支持`xmake config --xxx=[y|n|yes|no|true|false]`等开关值
* 合并iphoneos和iphonesimulator平台，以及watchos和watchsimulator平台，通过arch来区分，使得打包更加方便，能够支持一次性打包iphoneos的所有arch到一个包中

### Bugs修复

* [#3](https://github.com/waruqi/xmake/issues/3): 修复ArchLinux 编译失败问题
* [#4](https://github.com/waruqi/xmake/issues/4): 修复windows上安装失败问题
* 修复windows上环境变量设置问题
