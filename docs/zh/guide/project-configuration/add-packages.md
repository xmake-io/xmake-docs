# 添加包 {#add-packages}

Xmake 内置支持包依赖集成，可以通过 [add_requires](/zh/api/description/global-interfaces.html#add-requires) 接口声明需要的依赖包。

然后通过 [add_packages](/zh/api/description/project-target.html#add-packages) 接口，将声明的包绑定到需要的编译目标中去，例如：

```lua [xmake.lua]
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")

target("foo")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libpng")

target("bar")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

其中 `add_requires` 是全局接口，用于包的配置声明，Xmake 会根据声明的包来触发查找安装。

由于一个工程，可能存在多个目标程序，每个目标程序可能需要的依赖包是不同的，因此我们还需要通过 `add_packages` 来将绑定目标。

上面的配置示例中，foo 目标绑定了 tbox 和 libpng 两个包，而 bar 目标绑定了 zlib 包。

更多关于依赖包的使用，请参考完整文档：[包依赖管理](/zh/guide/package-management/using-official-packages)。

