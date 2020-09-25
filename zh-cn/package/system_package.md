
## 查找系统包

如果觉得上述内置包的管理方式非常不方便，可以通过xmake提供的内置接口`find_packages`。

并且通过系统和第三方包管理工具进行依赖包的安装，然后与xmake进行集成使用，例如我们查找一个openssl包：

```lua
local packages = find_packages("openssl", "zlib")
```

返回的结果如下：

```lua
{
    {links = {"ssl", "crypto"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}},
    {links = {"z"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}}
}
```

如果查找成功，则返回一个包含所有包信息的table，如果失败返回nil

这里的返回结果可以直接作为`target:add`, `option:add`的参数传入，用于动态增加`target/option`的配置：

```lua
option("zlib")
    set_showmenu(true)
    before_check(function (option)
        option:add(find_packages("openssl", "zlib"))
    end)
```

```lua
target("test")
    on_load(function (target)
        target:add(find_packages("openssl", "zlib"))
    end)
```

目前此接口支持以下一些包管理支持：

* conan
* vcpkg
* homebrew
* pkg-config

如果系统上装有`homebrew`, `pkg-config`等第三方工具，那么此接口会尝试使用它们去改进查找结果。

更完整的使用描述，请参考：[find_packages](/zh-cn/manual/builtin_modules?id=find_packages)接口文档。

当然，如果觉得通过查找包的方式来集成第三方依赖包还不能满足需求，也可以通过`add_requires`来直接集成远程依赖包，具体请查看文档：[使用远程依赖包](https://xmake.io/#/zh-cn/package/remote_package)

## 查找homebrew包

另外，我们也可以从手动指定的包管理器查找包：

```lua
find_packages("brew::pcre2/libpcre2-8", "brew::x264")
```

我们只需要添加`brew::`前缀，就可以显式指定从homebrew的包源来查找包，如果`brew::pcre2`存在多个pkgconfig文件，例如：libpcre2-8.pc, libpcre2-16.pc, libpcre2-32.pc

那么我们可以通过`brew::pcre2/libpcre2-16`来选择对应的pkgconfig文件指定的链接库信息。

由于homebrew一般都是把包直接装到的系统中去了，因此用户不需要做任何集成工作，`find_packages`就已经原生无缝支持。

## 查找vcpkg包

目前xmake v2.2.2版本已经支持了vcpkg，用户只需要装完vcpkg后，执行`$ vcpkg integrate install`，xmake就能自动从系统中检测到vcpkg的根路径，然后自动适配里面包。

当然，我们也可以手动指定vcpkg的根路径来支持：

```console
$ xmake f --vcpkg=f:\vcpkg
```

或者我们可以设置到全局配置中去，避免每次切换配置的时候，重复设置：

```console
$ xmake g --vcpkg=f:\vcpkg
```

然后，我们就可以通过`vcpkg::`前缀，来指定查找vcpkg中的依赖包了：

```lua
find_packages("vcpkg::zlib", "vcpkg::openssl")
```

## 查找conan包

xmake v2.2.6以后的版本，也支持从conan中查找指定的包：

```lua
find_packages("conan::openssl/1.1.1g")
```

## 查找包快速测试

我们可以使用下面的命令，快速检测系统上指定的包信息：

```console
$ xmake l find_packages x264
{ 
  { 
    links = { 
      "x264" 
    },
    linkdirs = { 
      "/usr/local/Cellar/x264/r2699/lib" 
    },
    version = "0.148.2699 a5e06b9",
    includedirs = { 
      "/usr/local/Cellar/x264/r2699/include" 
    } 
  } 
}
```

我们也可以追加第三方包管理器前缀来测试：

```console
xmake l find_packages conan::OpenSSL/1.0.2n@conan/stable
```

!> 需要注意的是，find_package命令如果在带有xmake.lua的工程目录下执行，是会有缓存的，如果查找失败，下次查找也会使用缓存的结果，如果要每次强制重新检测，请切换到非工程目录下执行上面的命令。

