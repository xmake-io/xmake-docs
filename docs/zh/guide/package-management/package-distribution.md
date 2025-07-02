---
outline: deep
---

# 分发包 {#package-distribution}

## 定义包配置 {#define-package-configuration}

### 仓库包结构

在制作自己的包之前，我们需要先了解包仓库的结构，无论是官方包仓库还是自建私有包仓库，结构都是相同的：

```
xmake-repo
  - packages
    - t/tbox/xmake.lua
    - z/zlib/xmake.lua
```

通过上面的结构，可以看到每个包都会有个 xmake.lua 用于描述它的安装规则，并且根据 `z/zlib` 两级子目录分类存储，方便快速检索。

### 包描述说明

关于包的描述规则，基本上都是在它的 xmake.lua 里面完成的，这跟项目工程里的 xmake.lua 描述很类似，不同的是描述域仅支持 `package()`，

不过，在项目 xmake.lua 里面，也可以直接添加 `package()` 来内置包描述的，连包仓库都省了，有时候这样会更加方便。

首先，我们先拿 zlib 的描述规则，来直观感受下，这个规则可以在 [xmake-repo/z/zlib/xmake.lua](https://github.com/xmake-repo/z/zlib/xmake.lua) 下找到。

```
package("zlib")

    set_homepage("http://www.zlib.net")
    set_description("A Massively Spiffy Yet Delicately Unobtrusive Compression Library")

    set_urls("http://zlib.net/zlib-$(version).tar.gz",
             "https://downloads.sourceforge.net/project/libpng/zlib/$(version)/zlib-$(version).tar.gz")

    add_versions("1.2.10", "8d7e9f698ce48787b6e1c67e6bff79e487303e66077e25cb9784ac8835978017")
    add_versions("1.2.11", "c3e5e9fdd5004dcb542feda5ee4f0ff0744628baf8ed2dd5d66f8ca1197cb1a1")

    on_install("windows", function (package)
        io.gsub("win32/Makefile.msc", "%-MD", "-" .. package:config("vs_runtime"))
        os.vrun("nmake -f win32\\Makefile.msc zlib.lib")
        os.cp("zlib.lib", package:installdir("lib"))
        os.cp("*.h", package:installdir("include"))
    end)

    on_install("linux", "macosx", function (package)
        import("package.tools.autoconf").install(package, {"--static"})
    end)

    on_install("iphoneos", "android@linux,macosx", "mingw@linux,macosx", function (package)
        import("package.tools.autoconf").configure(package, {host = "", "--static"})
        io.gsub("Makefile", "\nAR=.-\n",      "\nAR=" .. (package:build_getenv("ar") or "") .. "\n")
        io.gsub("Makefile", "\nARFLAGS=.-\n", "\nARFLAGS=cr\n")
        io.gsub("Makefile", "\nRANLIB=.-\n",  "\nRANLIB=\n")
        os.vrun("make install -j4")
    end)

    on_test(function (package)
        assert(package:has_cfuncs("inflate", {includes = "zlib.h"}))
    end)
```

这个包规则对 windows、linux、macosx、iphoneos、mingw 等平台都添加了安装规则，基本上已经做到了全平台覆盖，甚至一些交叉编译平台，算是一个比较典型的例子了。

当然，有些包依赖源码实现力度，并不能完全跨平台，那么只需对它支持的平台设置安装规则即可。

更多详细的包配置 API 说明见：[包接口文档](/zh/api/description/package-dependencies)

### 扩展配置参数

详细见：[add_configs](/zh/api/description/package-dependencies#add-configs)

### 内置配置参数

除了可以通过 [add_configs](/zh/api/description/package-dependencies#add-configs) 设置一些扩展的配置参数以外，xmake 还提供了一些内置的配置参数，可以使用

#### 启用调试包

```lua
add_requires("xxx", {debug = true})
```

包描述里面必须有相关处理才能支持：

```lua
on_install(function (package)
    local configs = {}
    if package:is_debug() then
        table.insert(configs, "--enable-debug")
    end
    import("package.tools.autoconf").install(package)
end)
```

#### 设置msvc运行时库

```lua
add_requires("xxx", {configs = {vs_runtime = "MT"}})
```

通常情况下，通过 `import("package.tools.autoconf").install` 等内置工具脚本安装的包，内部都对 vs_runtime 自动处理过了。

但是如果是一些特殊的源码包，构建规则比较特殊，那么需要自己处理了：

```lua
on_install(function (package)
    io.gsub("build/Makefile.win32.common", "%-MD", "-" .. package:config("vs_runtime"))
end)
```

### 添加环境变量

对于一些库，里面也带了可执行的工具，如果需要在集成包的时候使用这些工具，也可以设置上对应 PATH 环境变量：

```lua
package("luajit")
    on_load(function (package)
        if is_plat("windows") then
            package:addenv("PATH", "lib")
        end
        package:addenv("PATH", "bin")
    end)
```

而在项目工程中，只有通过 `add_packages` 集成对应的包后，对应的环境变量才会生效。

```lua
add_requires("luajit")
target("test")
    set_kind("binary")
    add_packages("luajit")
    after_run(function (package)
        os.exec("luajit --version")
    end)
```

### 安装二进制包

xmake 也支持直接引用二进制版本包，直接安装使用，例如：

```lua
if is_plat("windows") then
    set_urls("https://www.libsdl.org/release/SDL2-devel-$(version)-VC.zip")
    add_versions("2.0.8", "68505e1f7c16d8538e116405411205355a029dcf2df738dbbc768b2fe95d20fd")
end

on_install("windows", function (package)
    os.cp("include", package:installdir())
    os.cp("lib/$(arch)/*.lib", package:installdir("lib"))
    os.cp("lib/$(arch)/*.dll", package:installdir("lib"))
end)
```

### 本地测试

如果在本地 xmake-repo 仓库中，已经添加和制作好了新的包，可以在本地运行测试下是否通过，如果测试通过，即可提交 PR 到官方仓库，请求 merge。

我们可以执行下面的脚本进行测试指定包：

```sh
cd xmake-repo
xmake l scripts/test.lua -v -D zlib
```

上面的命令会强制重新下载和安装 zlib 包，测试整个安装流程是否 ok，加上 `-v -D` 是为了可以看到完整详细的日志信息和出错信息，方便调试分析。

如果网络环境不好，不想每次测试都去重新下载所有依赖，可以加上 `--shallow` 参数来执行，这个参数告诉脚本，仅仅重新解压本地缓存的 zlib 源码包，重新执行安装命令，但不会下载各种依赖。

```sh
cd xmake-repo
xmake l scripts/test.lua -v -D --shallow zlib
```

如果我们想测试其他平台的包规则是否正常，比如 android、iphoneos 等平台，可以通过 `-p/--plat` 或者 `-a/--arch` 来指定。

```sh
cd xmake-repo
xmake l scripts/test.lua -v -D --shallow -p iphoneos -a arm64 zlib
xmake l scripts/test.lua -v -D --shallow -p android --ndk=/xxxx zlib
```

## 生成远程包 {#generate-remote-package}

除了本地包格式，`xmake package` 现在也支持生成远程包，便于用户将其快速提交到远程仓库。

我们只需要在打包的时候，修改包格式。

```sh
$ xmake package -f remote
```

```lua [packages/f/foo/xmake.lua]
package("foo")
    set_description("The foo package")
    set_license("Apache-2.0")
    add_deps("add", "sub")

    add_urls("https://github.com/myrepo/foo.git")
    add_versions("1.0", "<shasum256 or gitcommit>")

    on_install(function (package)
        local configs = {}
        if package:config("shared") then
            configs.kind = "shared"
        end
        import("package.tools.xmake").install(package, configs)
    end)

    on_test(function (package)
        -- TODO check includes and interfaces
        -- assert(package:has_cfuncs("foo", {includes = "foo.h"})
    end)
```

包定义配置相比本地包，多了实际的安装逻辑，以及 urls 和 versions 的设置，

我们也能够通过附加参数，去修改 urls、versions 等配置值，例如：

```sh
$ xmake package -f remote --url=https://xxxx/xxx.tar.gz --shasum=xxxxx --homepage=xxxxx`
```

xmake 也会从 target 的 `set_license` 和 `set_version` 等配置中读取相关配置信息。

## 提交包到官方仓库 {#submit-package-to-official-repository}

目前这个特性刚完成不久，目前官方仓库的包还不是很多，有些包也许还不支持部分平台，不过这并不是太大问题，后期迭代几个版本后，我会不断扩充完善包仓库。

如果你需要的包，目前的官方仓库还没有收录，可以提交 issues 或者自己可以在本地调通后，贡献提交到官方仓库：[xmake-repo](https://github.com/xmake-io/xmake-repo)

详细的贡献说明，见：[CONTRIBUTING.md](https://github.com/xmake-io/xmake-repo/blob/master/CONTRIBUTING.md)

关于如何制作自己的包，可以看下上文：[添加包到仓库](#添加包到仓库)。

## 分发和使用自定义包规则 {#custom-rule-distribution}

2.7.2 版本之后，我们可以在包管理仓库中，添加自定义构建规则脚本，实现跟随包进行动态下发和安装。

我们需要将自定义规则放到仓库的 `packages/x/xxx/rules` 目录中，它会跟随包一起被安装。

但是，它也存在一些限制：

- 在包中规则，我们不能添加 `on_load`、`after_load` 脚本，但是通常可以使用 `on_config` 来代替。

### 添加包规则

我们需要将规则脚本添加到 rules 固定目录下，例如：packages/z/zlib/rules/foo.lua

```lua
rule("foo")
    on_config(function (target)
        print("foo: on_config %s", target:name())
    end)
```

### 应用包规则

使用规则的方式跟之前类似，唯一的区别就是，我们需要通过 `@packagename/` 前缀去指定访问哪个包里面的规则。

具体格式：`add_rules("@packagename/rulename")`，例如：`add_rules("@zlib/foo")`。

```lua
add_requires("zlib", {system = false})
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("zlib")
    add_rules("@zlib/foo")
```

### 通过包别名引用规则

如果存在一个包的别名，xmake 将优先考虑包的别名来获得规则。

```lua
add_requires("zlib", {alias = "zlib2", system = false})
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("zlib2")
    add_rules("@zlib2/foo")
```

### 添加包规则依赖

我们可以使用`add_deps("@bar")`来添加相对于当前包目录的其他规则。

然而，我们不能添加来自其他包的规则依赖，它们是完全隔离的，我们只能参考用户项目中由`add_requires`导入的其他包的规则。

packages/z/zlib/rules/foo.lua

```lua
rule("foo")
    add_deps("@bar")
    on_config(function (target)
        print("foo: on_config %s", target:name())
    end)
```

packages/z/zlib/rules/bar.lua

```lua
rule("bar")
    on_config(function (target)
        print("bar: on_config %s", target:name())
    end)
```
