---
title: xmake v2.1.7版本发布，稳定性修复和细节改进
tags: [xmake, lua, 版本更新]
date: 2017-10-13
author: Ruki
---

此版本主要修复一些稳定性问题，并且对一些细节进行改进优化，并且提供[xmake-vscode](https://marketplace.visualstudio.com/items?itemName=tboox.xmake-vscode#overview)插件深度集成vscode编辑器环境。

更多使用说明，请阅读：[文档手册](https://xmake.io/zh/)。

项目源码：[Github](https://github.com/xmake-io/xmake), [Gitee](https://gitee.com/tboox/xmake).

### 新特性

* 添加`add_imports`去为target，option和package的自定义脚本批量导入模块，简化自定义脚本
* 添加`xmake -y/--yes`去确认用户输入
* 添加`xmake l package.manager.install xxx`模块，进行跨平台一致性安装软件包
* 添加vscode编辑器插件支持，更加方便的使用xmake，[xmake-vscode](https://marketplace.visualstudio.com/items?itemName=tboox.xmake-vscode#overview)
* 添加`xmake macro ..`快速运行最近一次命令

### 改进

* 改进`cprint()`，支持24位真彩色输出
* 对`add_rpathdirs()`增加对`@loader_path`和`$ORIGIN`的内置变量支持，提供可迁移动态库加载
* 改进`set_version("x.x.x", {build = "%Y%m%d%H%M"})` 支持buildversion设置
* 移除docs目录，将其放置到独立xmake-docs仓库中，减少xmake.zip的大小，优化下载安装的效率
* 改进安装和卸载脚本，支持DESTDIR和PREFIX环境变量设置
* 通过缓存优化flags探测，加速编译效率
* 添加`COLORTERM=nocolor`环境变量开关，禁用彩色输出
* 移除`add_rbindings`和`add_bindings`接口
* 禁止在重定向的时候进行彩色输出，避免输出文件中带有色彩代码干扰
* 更新tbox工程模板
* 改进`lib.detect.find_program`模块接口
* 为windows cmd终端增加彩色输出
* 增加`-w|--warning`参数来启用实时警告输出

### Bugs修复

* 修复`set_pcxxheader`编译没有继承flags配置问题
* [#140](https://github.com/xmake-io/xmake/issues/140): 修复`os.tmpdir()`在fakeroot下的冲突问题
* [#142](https://github.com/xmake-io/xmake/issues/142): 修复`os.getenv` 在windows上的中文编码问题
* 修复在带有空格路径的情况下，编译错误问题
* 修复setenv空值的崩溃问题