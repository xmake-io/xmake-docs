---
title: xmake v2.1.5版本正式发布，大量新特性更新
tags: [xmake, lua, 版本更新, 包查找, 编译器特性检测, 预编译头文件, 扩展模块]
date: 2017-08-05
author: Ruki
---

此版本带来了大量新特性更新，具体详见：[xmake v2.1.5版本新特性介绍](http://tboox.org/cn/2017/07/29/new-features-v2.1.5/)。

更多使用说明，请阅读：[文档手册](https://xmake.io/zh/)。

项目源码：[Github](https://github.com/xmake-io/xmake), [Gitee](https://gitee.com/tboox/xmake).

### 新特性

* [#83](https://github.com/xmake-io/xmake/issues/83): 添加 `add_csnippet`，`add_cxxsnippet`到`option`来检测一些编译器特性
* [#83](https://github.com/xmake-io/xmake/issues/83): 添加用户扩展模块去探测程序，库文件以及其他主机环境
* 添加`find_program`, `find_file`, `find_library`, `find_tool`和`find_package` 等模块接口
* 添加`net.*`和`devel.*`扩展模块
* 添加`val()`接口去获取内置变量，例如：`val("host")`, `val("env PATH")`, `val("shell echo hello")` and `val("reg HKEY_LOCAL_MACHINE\\XX;Value")`
* 增加对微软.rc资源文件的编译支持，当在windows上编译时，可以增加资源文件了
* 增加`has_flags`, `features`和`has_features`等探测模块接口
* 添加`option.on_check`, `option.after_check` 和 `option.before_check` 接口
* 添加`target.on_load`接口
* [#132](https://github.com/xmake-io/xmake/issues/132): 添加`add_frameworkdirs`接口
* 添加`lib.detect.has_xxx`和`lib.detect.find_xxx`接口
* 添加`add_moduledirs`接口在工程中定义和加载扩展模块
* 添加`includes`接口替换`add_subdirs`和`add_subfiles`
* [#133](https://github.com/xmake-io/xmake/issues/133): 改进工程插件，通过运行`xmake project -k compile_commands`来导出`compile_commands.json`
* 添加`set_pcheader`和`set_pcxxheader`去支持跨编译器预编译头文件，支持`gcc`, `clang`和`msvc`
* 添加`xmake f -p cross`平台用于交叉编译，并且支持自定义平台名

### 改进

* [#87](https://github.com/xmake-io/xmake/issues/87): 为依赖库目标自动添加：`includes` 和 `links`
* 改进`import`接口，去加载用户扩展模块
* [#93](https://github.com/xmake-io/xmake/pull/93): 改进 `xmake lua`，支持运行单行命令和模块
* 改进编译错误提示信息输出
* 改进`print`接口去更好些显示table数据
* [#111](https://github.com/xmake-io/xmake/issues/111): 添加`--root`通用选项去临时支持作为root运行
* [#113](https://github.com/xmake-io/xmake/pull/113): 改进权限管理，现在作为root运行也是非常安全的
* 改进`xxx_script`工程描述api，支持多平台模式选择, 例如：`on_build("iphoneos|arm*", function (target) end)`
* 改进内置变量，支持环境变量和注册表数据的获取
* 改进vstudio环境和交叉工具链的探测
* [#71](https://github.com/xmake-io/xmake/issues/71): 改进从环境变量中探测链接器和编译器
* 改进option选项检测，通过多任务检测，提升70%的检测速度
* [#129](https://github.com/xmake-io/xmake/issues/129): 检测链接依赖，如果源文件没有改变，就不必重新链接目标文件了
* 在vs201x工程插件中增加对`*.asm`文件的支持
* 标记`add_bindings`和`add_rbindings`为废弃接口
* 优化`xmake rebuild`在windows上的构建速度
* 将`core.project.task`模块迁移至`core.base.task`
* 将`echo` 和 `app2ipa` 插件迁移到 [xmake-plugins](https://github.com/xmake-io/xmake-plugins) 仓库
* 添加`set_config_header("config.h", {prefix = ""})` 代替 `set_config_h` 和 `set_config_h_prefix`

### Bugs修复

* 修复`try-catch-finally`
* 修复解释器bug，解决当加载多级子目录时，根域属性设置不对
* [#115](https://github.com/xmake-io/xmake/pull/115): 修复安装脚本`get.sh`的路径问题
* 修复`import()`导入接口的缓存问题