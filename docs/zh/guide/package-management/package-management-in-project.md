
# 工程内包管理命令 {#package-management-in-project}

包管理命令`$ xmake require` 可用于手动显示的下载编译安装、卸载、检索、查看包信息。

`xmake require` 仅用于当前工程，我们也提供了更加方便的独立 `xrepo` 包管理器命令，来全局对包进行安装，卸载和查找管理。

详细文档见：[Xrepo 命令使用入门](/zh/guide/package-management/xrepo-cli)。

## 安装指定包

```sh
$ xmake require tbox
```

安装指定版本包：

```sh
$ xmake require tbox "~1.6"
```

强制重新下载安装，并且显示详细安装信息：

```sh
$ xmake require -f -v tbox "1.5.x"
```

传递额外的设置信息：

```sh
$ xmake require --extra="{debug=true,config={small=true}}" tbox
```

安装debug包，并且传递`small=true`的编译配置信息到包中去。

## 卸载指定包

```sh
$ xmake require --uninstall tbox
```

这会完全卸载删除包文件。

## 查看包详细信息

```sh
$ xmake require --info tbox
```

## 在当前仓库中搜索包

```sh
$ xmake require --search tbox
```

这个是支持模糊搜素以及lua模式匹配搜索的：

```sh
$ xmake require --search pcr
```

会同时搜索到pcre, pcre2等包。

## 列举当前已安装的包

```sh
$ xmake require --list
```

