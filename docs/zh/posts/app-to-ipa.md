---
title: xmake 新增ios app2ipa插件
tags: [xmake, 插件, ios]
date: 2016-11-09
author: Ruki
outline: deep
---

最近在做ios app的企业测试包，需要频繁打包分发给测试，因此将编译完的.app打包成ipa单独分发出去，这里调研下几种打包方案：

1. 直接通过iTunes来打包
2. 调用zip写个打包脚本
3. 使用第三方脚本和工具

为了方便日常ios app打包程ipa，觉得可以把这个脚本放到xmake中去，作为一个小插件提供，也是个不错的方式。

因此顺手在xmake里面加了这么一个ipa to app的小插件，进行快速打包，使用方式如下：

```bash
$ xmake app2ipa --icon=Icon.png /xxx/xxx.app
```

icon参数指定的是app的主图标，用作iTunesArtwork，目前还不能自动设置，需要手动指定哦。。

后面只需要传入需要打包的xxx.app的路径就可以了，默认ipa会载同目录下生成/xxx/xxx.ipa，也可以通过`--ipa/-o`指定输出路径。

注：这只是个小工具，目前还不支持自动修改签名，有兴趣的同学，可以提pr上来，加上这个功能哦。