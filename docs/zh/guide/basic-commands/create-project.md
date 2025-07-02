# 创建工程 {#create-project}

## 简介

Xmake 提供了一些常用命令，让用户方便快速地创建工程，以及配置，编译和运行。

所有的命令，可以通过 `xmake -h` 去查看，命令格式如下：

```sh
xmake [action] [arguments] ...
```

其中，action 就是 xmake cli 提供的子命令，而对于创建工程，它就是 `xmake create`。

## 创建一个 C++ 空工程

首先，我们可以尝试创建一个名叫 `hello` 的 `c++` 控制台空工程。

```sh
$ xmake create hello
create hello ...
  [+]: xmake.lua
  [+]: src/main.cpp
  [+]: .gitignore
create ok!
```

执行完后，将会生成一个简单工程结构。

```
hello
├── src
│   └─main.cpp
└── xmake.lua
```

这是一个最简单的工程，它会生成一个最基础的 xmake.lua 工程配置文件，通常它位于工程根目录，Xmake 会自动加载它。

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

target("hello")
    set_kind("binary")
    add_files("src/*.cpp")

-- FAQ
-- ...
```

此外，文件结尾还提供了一些注释，里面有提供常用的配置示例，方便快速查看。

然后，我们只需要进入刚刚创建的 hello 工程根目录，执行 xmake 命令，即可完成编译。

```sh
$ xmake
[ 23%]: cache compiling.release src/main.cpp
[ 47%]: linking.release hello
[100%]: build ok, spent 2.696s
```

## 指定语言

我们可以通过 `-l [languages]` 参数，去指定创建其他语言的工程，比如创建一个 C 语言工程。

```sh
$ xmake create -l c hello
create hello ...
  [+]: xmake.lua
  [+]: src/main.c
  [+]: .gitignore
create ok!
```

或者创建一个 Rust 空工程。

```sh
$ xmake create -l rust hello
create hello ...
  [+]: xmake.lua
  [+]: src/main.rs
  [+]: .gitignore
create ok!
```

完整语言可以通过 `xmake create -h` 查看。

```sh
    -l LANGUAGE, --language=LANGUAGE    The project language (default: c++)
                                            - pascal
                                            - c++
                                            - zig
                                            - go
                                            - nim
                                            - dlang
                                            - cuda
                                            - rust
                                            - kotlin
                                            - vala
                                            - swift
                                            - fortran
                                            - objc
                                            - c
                                            - objc++
```

## 指定工程模板

另外，我们也可以通过 `-t [template]` 参数，去指定需要创建的工程模板类型。

例如，创建一个静态库工程：

```sh
$ xmake create -t static test
create test ...
  [+]: xmake.lua
  [+]: src/foo.cpp
  [+]: src/foo.h
  [+]: src/main.cpp
  [+]: .gitignore
create ok!
```

```sh
$ xmake
[ 23%]: cache compiling.release src/main.cpp
[ 23%]: cache compiling.release src/foo.cpp
[ 35%]: linking.release libfoo.a
[ 71%]: linking.release test
[100%]: build ok, spent 1.795s
```

完整模板列表，也可以通过 `xmake create -h` 来查看。

```sh
    -t TEMPLATE, --template=TEMPLATE    Select the project template id or name of the given language.
                                        (default: console)
                                            - console: pascal, c++, zig, go, nim, dlang, cuda, rust,
                                        kotlin, vala, swift, fortran, objc, c, objc++
                                            - module.binary: c++, c
                                            - module.shared: c++, c
                                            - qt.console: c++
                                            - qt.quickapp: c++
                                            - qt.quickapp_static: c++
                                            - qt.shared: c++
                                            - qt.static: c++
                                            - qt.widgetapp: c++
                                            - qt.widgetapp_static: c++
                                            - shared: pascal, c++, zig, nim, dlang, cuda, kotlin, vala,
                                        fortran, c
                                            - static: c++, zig, go, nim, dlang, cuda, rust, kotlin, vala,
                                        fortran, c
                                            - tbox.console: c++, c
                                            - tbox.shared: c++, c
                                            - tbox.static: c++, c
                                            - wxwidgets: c++
                                            - xcode.bundle: objc, objc++
                                            - xcode.framework: objc, objc++
                                            - xcode.iosapp: objc
                                            - xcode.iosapp_with_framework: objc
                                            - xcode.macapp: objc
                                            - xcode.macapp_with_framework: objc
                                            - xmake.cli: c++, c
```

其中，最常用的就是创建控制台（console）、静态库（static）和动态库（shared）等程序。

