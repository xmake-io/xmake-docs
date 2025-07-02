# 工程内包管理命令 {#package-management-in-project}

包管理命令 `$ xmake require` 可用于手动显式地下载、编译、安装、卸载、检索和查看包信息。

`xmake require` 仅用于当前工程，我们也提供了更为便捷的独立 `xrepo` 包管理器命令，用于全局安装、卸载和查找包。

详细文档见：[Xrepo 命令使用入门](/zh/guide/package-management/xrepo-cli)。

## 安装指定包

```sh
$ xmake require tbox
```

安装指定版本包：

```sh
$ xmake require tbox "~1.6"
```

强制重新下载安装，并显示详细安装信息：

```sh
$ xmake require -f -v tbox "1.5.x"
```

传递额外的设置信息：

```sh
$ xmake require --extra="{debug=true,config={small=true}}" tbox
```

安装 debug 包，并传递 `small=true` 的编译配置信息到包中。

## 卸载指定包

```sh
$ xmake require --uninstall tbox
```

这会完全卸载并删除包文件。

## 查看包详细信息

```sh
$ xmake require --info tbox
```

## 在当前仓库中搜索包

```sh
$ xmake require --search tbox
```

该命令支持模糊搜索以及 alua 模式匹配搜索：

```sh
$ xmake require --search pcr
```

会同时搜索到 pcre、pcre2 等包。

## 列举当前已安装的包

```sh
$ xmake require --list
```

