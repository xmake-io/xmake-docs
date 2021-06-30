### 注意事项

这是很早期的打包方案，跟 `add_requires()` 和 `add_packages()` 不兼容，正在逐步被废弃。

2.5.5 开始采用新的本地包方案，具体见：[新版本地包方案](/zh-cn/package/local_package)。

如果还想使用老的打包方式，可以执行下面的命令，指定下包格式：`oldpkg`

```console
$ xmake package -f oldpkg
```

来代替之前的

```console
$ xmake package
```

### 打包说明

通过在项目中内置依赖包目录以及二进制包文件，可以方便的集成一些第三方的依赖库，这种方式比较简单直接，但是缺点也很明显，不方便管理。

以tbox工程为例，其依赖包如下：

```
- base.pkg
- zlib.pkg
- polarssl.pkg
- openssl.pkg
- mysql.pkg
- pcre.pkg
- ...
```

如果要让当前工程识别加载这些包，首先要指定包目录路径，例如：

```lua
add_packagedirs("packages")
```

指定好后，就可以在target作用域中，通过[add_packages](/zh-cn/manual/project_target?id=targetadd_packages)接口，来添加集成包依赖了，例如：

```lua
target("tbox")
    add_packages("zlib", "polarssl", "pcre", "mysql")
```

那么如何去生成一个*.pkg的包呢，如果是基于xmake的工程，生成方式很简单，只需要：

```console
$ cd tbox
$ xmake package
```

即可在build目录下生成一个tbox.pkg的跨平台包，给第三方项目使用，我也可以直接设置输出目录，编译生成到对方项目中去，例如：

```console
$ cd tbox
$ xmake package -o ../test/packages
```

这样，test工程就可以通过[add_packages]((/zh-cn/manual/project_target?id=targetadd_packages)和[add_packagedirs](/zh-cn/manual/global_interfaces?id=add_packagedirs)去配置和使用tbox.pkg包了。

关于内置包的详细描述，还可以参考下相关文章，这里面有详细介绍：[依赖包的添加和自动检测机制](https://tboox.org/cn/2016/08/06/add-package-and-autocheck/)

