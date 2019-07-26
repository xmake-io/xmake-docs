
如果觉得上述内置包的管理方式非常不方便，可以通过xmake提供的内置接口`find_packages`。

目前此接口支持以下一些包管理支持：

* vcpkg
* homebrew
* pkg-config

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
        target:add(find_package("openssl", "zlib"))
    end)
```

如果系统上装有`homebrew`, `pkg-config`等第三方工具，那么此接口会尝试使用它们去改进查找结果。

另外，我们也可以从指定的包管理器查找包：

```lua
find_packages("brew::pcre2/libpcre2-8", "vcpkg::zlib")
```

更完整的使用描述，请参考：[find_packages](/zh-cn/manual/builtin_modules?id=find_packages)接口文档。

## homebrew集成支持

由于homebrew一般都是把包直接装到的系统中去了，因此用户不需要做任何集成工作，`find_packages`就已经原生无缝支持。

## vcpkg集成支持

目前xmake v2.2.2版本已经支持了vcpkg，用户只需要装完vcpkg后，执行`$ vcpkg integrate install`，xmake就能自动从系统中检测到vcpkg的根路径，然后自动适配里面包。

当然，我们也可以手动指定vcpkg的根路径来支持：

```console
$ xmake f --vcpkg=f:\vcpkg
```

或者我们可以设置到全局配置中去，避免每次切换配置的时候，重复设置：

```console
$ xmake g --vcpkg=f:\vcpkg
```

