---
title: 插件使用之宏脚本记录
tags: [xmake, 插件, 宏脚本]
date: 2016-06-09
author: Ruki
outline: deep
---

xmake 提供了一些内置的比较实用的插件，其中宏脚本插件是最具有代表性和实用性的，也是xmake比较推荐的一款插件，那它有哪些使用功能呢？



我们先来看下：`xmake macro --help`

```
    Usage: xmake macro|m [options] [name] [arguments]

    Run the given macro.

    Options: 
            --backtrace                        Print backtrace information for debugging.
            --version                          Print the version number and exit.
        -h, --help                             Print this help message and exit.
                                               
        -F FILE, --file=FILE                   Read a given xmake.lua file.
        -P PROJECT, --project=PROJECT          Change to the given project directory.
                                               Search priority:
                                                   1. The Given Command Argument
                                                   2. The Envirnoment Variable: XMAKE_PROJECT_DIR
                                                   3. The Current Directory
                                               
        -v, --verbose                          Print lots of verbose information.
        -b, --begin                            Start to record macro.
                                               .e.g
                                               Record macro with name: test
                                                   xmake macro --begin
                                                   xmake config --plat=macosx
                                                   xmake clean
                                                   xmake -r
                                                   xmake package
                                                   xmake macro --end test
        -e, --end                              Stop to record macro.
                                               
            --show                             Show the content of the given macro.
        -l, --list                             List all macros.
        -d, --delete                           Delete the given macro.
        -c, --clear                            Clear the all macros.
                                               
            --import=IMPORT                    Import the given macro file or directory.
                                               .e.g
                                                   xmake macro --import=/xxx/macro.lua test
                                                   xmake macro --import=/xxx/macrodir
            --export=EXPORT                    Export the given macro to file or directory.
                                               .e.g
                                                   xmake macro --export=/xxx/macro.lua test
                                                   xmake macro --export=/xxx/macrodir
                                               
        name                                   Set the macro name. (default: .)
                                               .e.g
                                                  Run the given macro:     xmake macro test
                                                  Run the anonymous macro: xmake macro .
        arguments ...                          Set the macro arguments.
```

看帮助菜单描述，它提供了一些功能：

1. 手动记录和回放多条执行过的xmake命令
2. 支持快速的匿名宏创建和回放
3. 支持命名宏的长久记录和重用
4. 支持宏脚本的批量导入和导出
5. 支持宏脚本的删除、显示等管理功能
6. 支持自定义高级宏脚本，以及参数配置

看功能还是蛮多的，那这个宏脚本主要用于哪些场景呢，比如：

我们需要编译打包各个平台的所有架构的库，如果按照每次：

```bash
    xmake f -p android --ndk=/xxx/ndk -a armv7-a
    xmake p
    xmake f -p mingw --sdk=/mingwsdk
    xmake p
    xmake f -p linux --sdk=/toolsdk --toolchains=/xxxx/bin
    xmake p
    xmake f -p iphoneos -a armv7
    xmake p
    xmake f -p iphoneos -a arm64
    xmake p
    xmake f -p iphoneos -a armv7s
    xmake p
    xmake f -p iphoneos -a i386
    xmake p
    xmake f -p iphoneos -a x86_64
    xmake p
```

那还是相当累人的，而且这些命令有可能需要重复执行，每次都这么敲一遍多累啊，如果像交叉编译这种，配置参数更多更复杂的情况，那么会更累

这个时候就需要宏脚本出场了，而且这些宏记录下来后，你可以导出它们，提供给其他人使用，而不需要每次叫他们如何去配置，如何去编译打包了

闲话少说，我们先来看下如何记录一个简单宏脚本。。


```bash
    # 开始记录宏
    xmake macro --begin

    # 执行一些xmake命令
    xmake f -p android --ndk=/xxx/ndk -a armv7-a
    xmake p
    xmake f -p mingw --sdk=/mingwsdk
    xmake p
    xmake f -p linux --sdk=/toolsdk --toolchains=/xxxx/bin
    xmake p
    xmake f -p iphoneos -a armv7
    xmake p
    xmake f -p iphoneos -a arm64
    xmake p
    xmake f -p iphoneos -a armv7s
    xmake p
    xmake f -p iphoneos -a i386
    xmake p
    xmake f -p iphoneos -a x86_64
    xmake p

    # 结束宏记录，这里不设置宏名字，所以记录的是一个匿名宏
    xmake macro --end 
```

好了，接下来我们就开始回放执行这个宏了。。

```bash
    # 之前最近记录的一次匿名宏
    xmake macro .
```

匿名宏的好处就是快速记录，快速回放，如果需要长久保存，就需要给宏去个名字，也很简单：

```bash
    # 结束记录，并且命名为test宏
    xmake macro --end test

    # 回放这个test宏
    xmake macro test
```

宏的管理：删除、导入、导出这些比较简单，可以敲：`xmake macro --help` 自行看下

我们来看下宏脚本记录下来的内容：`xmake macro --show test`

```lua
    function main()
        
        os.exec("xmake f -p android --ndk=/xxx/ndk -a armv7-a")
        os.exec("xmake p")
        os.exec("xmake f -p mingw --sdk=/mingwsdk")
        os.exec("xmake p")
        os.exec("xmake f -p linux --sdk=/toolsdk --toolchains=/xxxx/bin")
        os.exec("xmake p")
        os.exec("xmake f -p iphoneos -a armv7")
        os.exec("xmake p")
        os.exec("xmake f -p iphoneos -a arm64")
        os.exec("xmake p")
        os.exec("xmake f -p iphoneos -a armv7s")
        os.exec("xmake p")
        os.exec("xmake f -p iphoneos -a i386")
        os.exec("xmake p")
        os.exec("xmake f -p iphoneos -a x86_64")
        os.exec("xmake p")  
    end
```

其实就是个lua的脚本，里面你可以使用一切插件开发中使用的类库和内建api，你可以通过import导入他们来使用，并编写一些高级的宏脚本。。

更加高级的宏脚本写法可以参考：[插件使用之批量打包](https://xmake.io/zh/)