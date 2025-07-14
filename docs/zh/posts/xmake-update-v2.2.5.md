---
title: xmake v2.2.5, 更加完善的包依赖管理
tags: [xmake, lua, C/C++, 版本更新, 远程包管理, 包依赖, 自动构建]
date: 2019-03-29
author: Ruki
---

此版本耗时四个多月，对包依赖管理进行了重构改进，官方仓库新增了mysql，ffmpeg等常用依赖包，并且新增了大量新特性。

关于新特性的详细说明，可以看下下面的官方文档，或者看下相关文章介绍：[xmake v2.2.5新特性详解](https://tboox.org/cn/2019/04/01/v2.2.5-new-features/)

关于新特性的详细说明见文章下文。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

## 更新内容

### 新特性

* 添加`string.serialize`和`string.deserialize`去序列化，反序列化对象，函数以及其他类型
* 添加`xmake g --menu`去图形化配置全局选项
* [#283](https://github.com/xmake-io/xmake/issues/283): 添加`target:installdir()`和`set_installdir()`接口
* [#260](https://github.com/xmake-io/xmake/issues/260): 添加`add_platformdirs`接口，用户现在可以自定义扩展编译平台
* [#310](https://github.com/xmake-io/xmake/issues/310): 新增主题设置支持，用户可随意切换和扩展主题样式
* [#318](https://github.com/xmake-io/xmake/issues/318): 添加`add_installfiles`接口到target去自定义安装文件
* [#339](https://github.com/xmake-io/xmake/issues/339): 改进`add_requires`和`find_package`使其支持对第三方包管理的集成支持
* [#327](https://github.com/xmake-io/xmake/issues/327): 实现对conan包管理的集成支持
* 添加内置API `find_packages("pcre2", "zlib")`去同时查找多个依赖包，不需要通过import导入即可直接调用
* [#320](https://github.com/xmake-io/xmake/issues/320): 添加模板配置文件相关接口，`add_configfiles`和`set_configvar`
* [#179](https://github.com/xmake-io/xmake/issues/179): 扩展`xmake project`插件，新增CMakelist.txt生成支持
* [#361](https://github.com/xmake-io/xmake/issues/361): 增加对vs2019 preview的支持
* [#368](https://github.com/xmake-io/xmake/issues/368): 支持`private, public, interface`属性设置去继承target配置
* [#284](https://github.com/xmake-io/xmake/issues/284): 通过`add_configs()`添加和传递用户自定义配置到`package()`
* [#319](https://github.com/xmake-io/xmake/issues/319): 添加`add_headerfiles`接口去改进头文件的设置
* [#342](https://github.com/xmake-io/xmake/issues/342): 为`includes()`添加一些内置的辅助函数，例如：`check_cfuncs`

### 改进

* 针对远程依赖包，改进版本和调试模式切换
* [#264](https://github.com/xmake-io/xmake/issues/264): 支持在windows上更新dev/master版本，`xmake update dev`
* [#293](https://github.com/xmake-io/xmake/issues/293): 添加`xmake f/g --mingw=xxx` 配置选线，并且改进find_mingw检测
* [#301](https://github.com/xmake-io/xmake/issues/301): 改进编译预处理头文件以及依赖头文件生成，编译速度提升30%
* [#322](https://github.com/xmake-io/xmake/issues/322): 添加`option.add_features`, `option.add_cxxsnippets` 和 `option.add_csnippets`
* 移除xmake 1.x的一些废弃接口, 例如：`add_option_xxx`
* [#327](https://github.com/xmake-io/xmake/issues/327): 改进`lib.detect.find_package`增加对conan包管理器的支持
* 改进`lib.detect.find_package`并且添加内建的`find_packages("zlib 1.x", "openssl", {xxx = ...})`接口
* 标记`set_modes()`作为废弃接口， 我们使用`add_rules("mode.debug", "mode.release")`来替代它
* [#353](https://github.com/xmake-io/xmake/issues/353): 改进`target:set`, `target:add` 并且添加`target:del`去动态修改target配置
* [#356](https://github.com/xmake-io/xmake/issues/356): 添加`qt_add_static_plugins()`接口去支持静态Qt sdk
* [#351](https://github.com/xmake-io/xmake/issues/351): 生成vs201x插件增加对yasm的支持
* 重构改进整个远程依赖包管理器，更加快速、稳定、可靠，并提供更多的常用包

### Bugs修复

* 修复无法通过 `set_optimize()` 设置优化选项，如果存在`add_rules("mode.release")`的情况下
* [#289](https://github.com/xmake-io/xmake/issues/289): 修复在windows下解压gzip文件失败
* [#296](https://github.com/xmake-io/xmake/issues/296): 修复`option.add_includedirs`对cuda编译不生效
* [#321](https://github.com/xmake-io/xmake/issues/321): 修复PATH环境改动后查找工具不对问题