---
title: xmake 大版本发布：v2.1.1，新增golang, rust, dlang构建支持
tags: [xmake, lua, 版本, golang, rust, dlang]
date: 2017-03-04
author: Ruki
---

## 概述

此版本重构了整个xmake，使得xmake更加方便地进行多语言扩展，并且在之前原有的构建语言支持上，新增了对`golang`, `dlang` 和 `rust` 程序构建支持。

并且重写了所有文档，提供更加详细完整的接口手册和文档支持：[新版文档](http://www.xmake.io/#zh/)

License也从之前的LGPLv2.1改为Apache License 2.0，更加详细的改进请看下面详细描述：

### 新特性

* 添加`--links`, `--linkdirs` and `--includedirs` 配置参数
* 添加app2ipa插件
* 为`xmake.lua`工程描述增加dictionay语法风格
* 提供智能扫描编译模式，在无任何`xmake.lua`等工程描述文件的情况下，也能直接快速编译
* 为`xmake.lua`工程描述添加`set_xmakever`接口，更加友好的处理版本兼容性问题 
* 为`objc`和`swift`程序添加`add_frameworks`接口
* 更加快速方便的多语言扩展支持，增加`golang`, `dlang`和`rust`程序构建的支持
* 添加`target_end`, `option_end` 和`task_end`等可选api，用于显示结束描述域，进入根域设置，提高可读性
* 添加`golang`, `dlang`和`rust`工程模板

### 改进

* 工程生成插件支持vs2017
* 改进gcc/clang编译器警告和错误提示
* 重构代码架构，改进多语言支持，更加方便灵活的扩展语言支持
* 改进print接口，同时支持原生lua print以及格式化打印
* 如果xmake.lua不存在，自动扫描工程代码文件，并且生成xmake.lua进行编译
* 修改license，使用更加宽松的Apache License 2.0
* 移除一些二进制工具文件
* 移除install.bat脚本，提供windows nsis安装包支持
* 使用[docute](https://github.com/egoist/docute)重写[文档](http://www.xmake.io/#/zh/)，提供更加完善的文档支持
* 增强`os.run`, `os.exec`, `os.cp`, `os.mv` 和 `os.rm` 等接口，支持通配符模式匹配和批量文件操作
* 精简和优化构建输出信息，添加`-q|--quiet`选项实现静默构建
* 改进`makefile`生成插件，抽取编译工具和编译选项到全局变量

### Bugs修复

* [#41](https://github.com/waruqi/xmake/issues/41): 修复在windows下自动检测x64失败问题
* [#43](https://github.com/waruqi/xmake/issues/43): 避免创建不必要的.xmake工程缓存目录
* 针对android版本添加c++ stl搜索目录，解决编译c++失败问题
* 修复在rhel 5.10上编译失败问题
* 修复`os.iorun`返回数据不对问题