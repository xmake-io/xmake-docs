---
title: xmake v2.1.8版本发布，改进对IDE和编辑器插件的支持
tags: [xmake, lua, 版本更新]
date: 2017-11-08
author: Ruki
---

此版本主要改进对IDE和编辑器插件的支持，目前xmake提供以下编辑器和IDE插件：

- Vim 编辑器插件
  - [xmake.vim](https://github.com/luzhlon/xmake.vim) (第三方插件，感谢[@luzhlon](https://github.com/luzhlon)提供)
- Visual Studio Code 编辑器插件 ([xmake-vscode](https://github.com/xmake-io/xmake-vscode))
- Sublime Text 编辑器插件 ([xmake-sublime](https://github.com/xmake-io/xmake-sublime))
- IntelliJ 系列IDE插件 ([xmake-idea](https://github.com/xmake-io/xmake-idea))
  - IntelliJ-IDEA 
  - CLion 
  - Android Studio 

更多使用说明，请阅读：[文档手册](https://xmake.io/zh/)。

项目源码：[Github](https://github.com/xmake-io/xmake), [Gitee](https://gitee.com/tboox/xmake).

### 新特性

* 添加`XMAKE_LOGFILE`环境变量，启用输出到日志文件
* 添加对tinyc编译器的支持

### 改进

* 改进对IDE和编辑器插件的集成支持，例如：Visual Studio Code, Sublime Text 以及 IntelliJ IDEA
  - 增加对vscode的编译错误解析支持
  - 改进Sublime Text下的色彩代码干扰
  - 增加对Intellij IDEA的工程模板支持
* 当生成新工程的时候，自动生成一个`.gitignore`文件，忽略一些xmake的临时文件和目录
* 改进创建模板工程，使用模板名代替模板id作为参数
* 改进macOS编译平台的探测，如果没有安装xcode也能够进行编译构建，如果有编译器的话
* 改进`set_config_header`接口，支持局部版本号设置，优先于全局`set_version`，例如：`set_config_header("config", {version = "2.1.8", build = "%Y%m%d%H%M"})`

### Bugs修复

* [#145](https://github.com/xmake-io/xmake/issues/145): 修复运行target的当前目录环境