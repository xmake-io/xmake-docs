
# utils.platform

此模块用于一些平台相关的辅助操作接口

## utils.platform.gnu2mslib

- 将 mingw 的 libxxxdll.a 转换成 msvc 的 xxx.lib 库

这个功能对 Fortran & C++ 混合项目特别有帮助，因为 VS 不提供fortran编译器，只能用MinGW的gfortran来编译fortran部分，然后和VS的项目链接。
往往这样的项目同时有一些其他的库以vs格式提供，因此纯用MinGW编译也不行，只能使用这个功能来混合编译。

而 cmake 也有个类似的 [GNUtoMS](https://cmake.org/cmake/help/latest/prop_tgt/GNUtoMS.html)。

相关 issues 见：[#1181](https://github.com/xmake-io/xmake/issues/1181)

```lua
import("utils.platform.gnu2mslib")

gnu2mslib("xxx.lib", "xxx.dll.a")
gnu2mslib("xxx.lib", "xxx.def")
gnu2mslib("xxx.lib", "xxx.dll.a", {dllname = "xxx.dll", arch = "x64"})
```

支持从 def 生成 xxx.lib ，也支持从 xxx.dll.a 自动导出 .def ，然后再生成 xxx.lib

如果不想自动从dll.a生成 def，想借用 gnu linker 生成的 def，那就自己通过 add_shflags("-Wl,--output-def,xxx.def") 配置，生成 def，然后传入 def 到这个接口。。

`{dllname = xxx, arch = "xxx"}` 这些是可选的，根据自己的需求而定。。

也可以直接 xmake l utils.platform.gnu2mslib xxx.lib xxx.dll.a 快速测试验证
