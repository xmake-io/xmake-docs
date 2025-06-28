# Create a project {#create-project}

## Introduction

Xmake provides some common commands to allow users to easily and quickly create projects, as well as configure, compile and run.

All commands can be viewed through `xmake -h`, the command format is as follows:

```bash
xmake [action] [arguments] ...
```

Among them, action is the subcommand provided by xmake cli, and for creating a project, it is `xmake create`.

## Create a C++ empty project

First, we can try to create a `c++` console empty project named `hello`.

```bash
$ xmake create hello
create hello ...
[+]: xmake.lua
[+]: src/main.cpp
[+]: .gitignore
create ok!
```

After execution, a simple project structure will be generated.

```
hello
├── src
│   └─main.cpp
└── xmake.lua
```

This is the simplest project. It will generate a basic xmake.lua project configuration file, which is usually located in the project root directory and Xmake will automatically load it.

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

target("hello")
set_kind("binary")
add_files("src/*.cpp")

-- FAQ
-- ...
```

In addition, some comments are provided at the end of the file, which provide common configuration examples for quick viewing.

Then, we only need to enter the root directory of the hello project just created and execute the xmake command to complete the compilation.

```console
$ xmake
[ 23%]: cache compiling.release src/main.cpp
[ 47%]: linking.release hello
[100%]: build ok, spent 2.696s
```

## Specify language

We can use the `-l [languages]` parameter to specify the creation of projects in other languages, such as creating a C language project.

```console
$ xmake create -l c hello
create hello ...
[+]: xmake.lua
[+]: src/main.c
[+]: .gitignore
create ok!
```

Or create an empty Rust project.

```console
$ xmake create -l rust hello
create hello ...
[+]: xmake.lua
[+]: src/main.rs
[+]: .gitignore
create ok!
```

The complete language can be viewed through `xmake create -h`.

```bash
-l LANGUAGE, --language=LANGUAGE The project language (default: c++)
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

## Specify the project template

In addition, we can also use the `-t [template]` parameter to specify the type of project module to be created.

For example, create a static library project:

```console
$ xmake create -t ​​static test
create test ...
[+]: xmake.lua
[+]: src/foo.cpp
[+]: src/foo.h
[+]: src/main.cpp
[+]: .gitignore
create ok!
```

```console
$ xmake
[ 23%]: cache compiling.release src/main.cpp
[ 23%]: cache compiling.release src/foo.cpp
[ 35%]: linking.release libfoo.a
[ 71%]: linking.release test
[100%]: build ok, spent 1.795s
```

The complete template list can also be viewed through `xmake create -h`.

```console 
-t TEMPLATE, --template=TEMPLATE Select the project template id or name of the given language. 
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

Among them, the most commonly used are programs such as creating consoles (console), static libraries (static) and dynamic libraries (shared).
