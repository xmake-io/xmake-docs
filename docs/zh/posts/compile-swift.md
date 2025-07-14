---
title: 使用xmake编译swift代码
tags: [xmake, swift]
date: 2016-08-06
author: Ruki
---

xmake不仅可以支持 c/c++文件，同时也支持 objc/c++，甚至swift代码的编译。

我们先看一下如何创建Swift工程，首先执行--help，看下帮助文档：

```bash
xmake create --help 
```




显示如下：

```
Usage: xmake create [options] [target]

Create a new project.

Options: 
    -n NAME, --name=NAME                   The project name.
    -f FILE, --file=FILE                   Create a given xmake.lua file. (default: xmake.lua)
    -P PROJECT, --project=PROJECT          Create from the given project directory.
                                           Search priority:
                                               1. The Given Command Argument
                                               2. The Envirnoment Variable: XMAKE_PROJECT_DIR
                                               3. The Current Directory
    -l LANGUAGE, --language=LANGUAGE       The project language (default: c)
                                               - c
                                               - c++
                                               - objc
                                               - objc++
                                               - swift
    -t TEMPLATE, --template=TEMPLATE       Select the project template id of the given language. (default: 1)
                                               - language: c
                                                 1. The Console Program
                                                 2. The Console Program (tbox)
                                                 3. The Shared Library
                                                 4. The Shared Library (tbox)
                                                 5. The Static Library
                                                 6. The Static Library (tbox)
                                               - language: c++
                                                 1. The Console Program
                                                 2. The Console Program (tbox)
                                                 3. The Shared Library
                                                 4. The Shared Library (tbox)
                                                 5. The Static Library
                                                 6. The Static Library (tbox)
                                               - language: objc
                                                 1. The Console Program
                                               - language: objc++
                                                 1. The Console Program
                                               - language: swift
                                                 1. The Console Program
                                           
    -v, --verbose                          Print lots of verbose information.
        --version                          Print the version number and exit.
    -h, --help                             Print this help message and exit.
                                           
    target                                 Create the given target.
                                           Uses the project name as target if not exists.
```

可以看到 只要指定 语言为swift，工程模板选择1，就能创建一个基于swift的控制台项目，具体操作如下：

```bash
xmake create -l swift -t 1 -P /tmp/test -n swift_test
```

执行完成后，就会在/tmp/test目录下自动生成一个名为swift_test的工程

我们看下生成好的xmake.lua

```lua
-- the debug mode
if modes("debug") then
    
    -- enable the debug symbols
    set_symbols("debug")

    -- disable optimization
    set_optimize("none")
end

-- the release mode
if modes("release") then

    -- set the symbols visibility: hidden
    set_symbols("hidden")

    -- enable fastest optimization
    set_optimize("fastest")

    -- strip all symbols
    set_strip("all")
end

-- add target
add_target("swift_test")

    -- set kind
    set_kind("binary")

    -- add files
    add_files("src/*.swift") 

```

可以看到，和平常的xmake.lua描述没什么区别，唯一的改动就是：`add_files("src/*.swift") ` 

而生成的main.swift代码，也很简单：

```swift
import Foundation

print("hello world!")
```

现在我们进入/tmp/test目录编译下：

```bash
cd /tmp/test
xmake 
```

编译完后，就可以运行了：

```
xmake r swift_test
```

显示效果：

```
hello world!
```

搞定。

