---
title: xmake v2.1.6版本正式发布，稳定性修复
tags: [xmake, lua, 版本更新]
date: 2017-08-17
author: Ruki
---

此版本主要修复一些稳定性问题。

更多使用说明，请阅读：[文档手册](https://xmake.io/zh/)。

项目源码：[Github](https://github.com/xmake-io/xmake), [Gitee](https://gitee.com/tboox/xmake).

### 改进

* 改进`add_files`，支持对files粒度进行编译选项的各种配置，更加灵活。
* 从依赖的target和option中继承links和linkdirs。
* 改进`target.add_deps`接口，添加继承配置，允许手动禁止依赖继承，例如：`add_deps("test", {inherit = false})`
* 移除`tbox.pkg`二进制依赖，直接集成tbox源码进行编译

### Bugs修复

* 修复目标级联依赖问题
* 修复`target:add`和`option:add`问题
* 修复在archlinux上的编译和安装问题
* 修复`/ZI`的兼容性问题，用`/Zi`替代

### 演示视频

<script type="text/javascript" src="https://asciinema.org/a/133693.js" id="asciicast-133693" async></script>
