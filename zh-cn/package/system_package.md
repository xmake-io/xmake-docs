## 查找使用系统包

Xmake 对远程包和系统包的使用进行了统一，全部使用 `add_requires("zlib")` 接口来描述集成，而默认的配置方式，它会优先从系统上查找库，如果没有，会自动下载安装集成。

而如果我们仅仅想查找使用系统库，不想远程下载，可以这么配置：

```lua
add_requires("zlib", {system = true})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

通过 `{system = true}` 就可以强制禁用远程下载，这时候，他就等价于 Xmake/CMake 的 `find_package`，但是更加简单易用，并且和远程包使用方式完全一致。

默认情况下，如果找不到系统库，就是提示失败，如果这个包是可选的，那么可以额外配置 `{optional = true}` 选项。

```lua
add_requires("zlib", {system = true, optional = true})
```

## 查找包快速测试

我们可以使用下面的命令，快速检测系统上指定的包信息：

```console
$ xmake l find_package x264
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
```

我们也可以追加第三方包管理器前缀来测试：

```console
xmake l find_package conan::OpenSSL/1.0.2g
```

!> 需要注意的是，find_package命令如果在带有xmake.lua的工程目录下执行，是会有缓存的，如果查找失败，下次查找也会使用缓存的结果，如果要每次强制重新检测，请切换到非工程目录下执行上面的命令。

