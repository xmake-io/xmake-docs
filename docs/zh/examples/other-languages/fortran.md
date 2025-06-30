v2.3.6之后版本开始支持gfortran编译器来编译fortran项目，我们可以通过下面的命令，快速创建一个基于fortran的空工程：

v2.3.8之后，xmake 还支持 Intel Fortran Compiler，只需要切换下工具链即可：`xmake f --toolchain=ifort`

```sh
$ xmake create -l fortran -t console test
```

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.f90")
```

更多代码例子可以到这里查看：[Fortran Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/fortran)
