---
title: 高级特性之自定义脚本使用
tags: [xmake, 自定义脚本, 安装, 打包, android, apk, jni]
date: 2016-06-09
author: Ruki
---

xmake提供了自定义打包、安装、运行脚本，可以更加灵活的针对个人实际需求来操作xmake

这里用一个例子详细说明下，比如有个需求，我需要自动编译、安装、运行android app工程，并且能够支持jni
可以进行如下操作

首先创建个基于ant的android app工程，目录结构如下：



```
    app
    └── android
        ├── AndroidManifest.xml
        ├── ant.properties
        ├── bin
        │   └── Demo-debug.apk
        ├── build.xml
        ├── jni
        │   └── demo.c
        ├── libs
        │   └── armeabi
        │       └── libdemo.so
        ├── local.properties
        ├── proguard-project.txt
        ├── project.properties
        ├── res
        │   ├── drawable-hdpi
        │   │   └── ic_launcher.png
        │   ├── drawable-ldpi
        │   │   └── ic_launcher.png
        │   ├── drawable-mdpi
        │   │   └── ic_launcher.png
        │   ├── drawable-xhdpi
        │   │   └── ic_launcher.png
        │   ├── layout
        │   │   └── main.xml
        │   └── values
        │       └── strings.xml
        ├── src
        │   └── com
        │       └── demo
        │           └── DemoTest.java
        └── xmake.lua
```

新版本中对自定义脚本进行了重大升级，支持了task机制，以及类库import机制，写法上也更加的精简可读

我们可以对比下新老版本的自定义脚本写法，当然新版的xmake对这些老的api也是向下兼容的，如果还在使用老版本api，也是不影响使用的。。

我们重点讲解下新版的写法：

```lua
    -- 定义一个android app的测试demo
    target("demo")

        -- 生成动态库：libdemo.so
        set_kind("shared")

        -- 设置对象的输出目录，可选
        set_objectdir("$(buildir)/.objs")

        -- 每次编译完的libdemo.so的生成目录，设置为app/libs/armeabi
        set_targetdir("libs/armeabi")

        -- 添加jni的代码文件
        add_files("jni/*.c")

        -- 设置自定义打包脚本，在使用xmake编译完libdemo.so后，执行xmake p进行打包
        -- 会自动使用ant将app编译成apk文件
        --
        on_package(function (target) 
                
                        -- trace
                        print("buiding app")

                        -- 使用ant编译app成apk文件，输出信息重定向到日志文件
                        os.run("ant debug") 
                    end)


        -- 设置自定义安装脚本，自动安装apk文件
        on_install(function (target) 

                        -- trace
                        print("installing app")

                        -- 使用adb安装打包生成的apk文件
                        os.run("adb install -r ./bin/Demo-debug.apk")
                    end)


        -- 设置自定义运行脚本，自动运行安装好的app程序，并且自动获取设备输出信息
        on_run(function (target) 

                    -- run it
                    os.run("adb shell am start -n com.demo/com.demo.DemoTest")
                    os.run("adb logcat")
                end)
```

修改完xmake.lua后，就可以很方便的使用了：

```bash
    # 重新编译工程，生成libdemo.so到app/libs/armeabi
    xmake -r

    # 打包app为apk
    xmake p

    # 安装apk到设备上
    xmake i

    # 运行app，并获取日志信息
    xmake r demo
```

如果觉得上面的步骤有点繁琐，可以简化成：

```bash
    # 安装的时候，会先去自动打包，所以可以省略xmake p
    xmake -r; xmake i; xmake r demo
```

如果是增量编译，不需要重建，可以继续简化：

```bash
    xmake i; xmake r demo
```

当然，由于是根据自己的实际需求自定义的脚本，可能跨平台性有点弱，像这里只能支持android的编译平台，

我们继续重点说下新版本中这些的api的使用，xmake针对 构建、打包、清除、安装、卸载、运行都提供了对应的自定义脚本入口

下面的on_xxx接口会直接替换内置的实现

- on_build: 自定义构建脚本
- on_clean: 自定义清除脚本
- on_package: 自定义打包脚本
- on_install: 自定义安装脚本
- on_uninstall: 自定义卸载脚本
- on_run: 自定义运行脚本

下面的 before_xxx接口，会在on_xxx之前执行

- before_build: 在构建之前执行一些自定义脚本
- before_clean: 在清除之前执行一些自定义脚本
- before_package: 在打包之前执行一些自定义脚本
- before_install: 在安装之前执行一些自定义脚本
- before_uninstall: 在卸载之前执行一些自定义脚本
- before_run: 在运行之前执行一些自定义脚本

下面的 after_xxx接口，会在on_xxx之后执行

- after_build: 在构建之后执行一些自定义脚本
- after_clean: 在清除之后执行一些自定义脚本
- after_package: 在打包之后执行一些自定义脚本
- after_install: 在安装之后执行一些自定义脚本
- after_uninstall: 在卸载之后执行一些自定义脚本
- after_run: 在运行之后执行一些自定义脚本

这些api的原型都是：

```lua
    function (target) 
    end
```

其中的参数就是当前的target，你可以从中获取一些基本信息，例如：

```lua
    on_run(function (target)

         -- 显示目标名
         print(target:name())

         -- 显示目标文件路径
         print(target:targetfile())

         -- 显示目标的构建类型
         print(target:get("kind"))

         -- 显示目标的宏定义
         print(target:get("defines"))

         -- 其他通过 set_/add_接口设置的target信息，都可以通过 target:get("xxx") 来获取
    end)
```

自定义脚本中，其作用域和xmake.lua上层的描述域是不同的，xmake里面有严格的沙盒管理，不会导致互相冲突

而且自定义脚本内部提供了大量内建类库和扩展类库，以供使用，扩展类库可以通过 [import](/cn/2016/06/09/api-import/) 进行导入， 例如

```lua
    on_run(function (target)
       
        -- 导入工程类
        import("core.project.project")

        -- 获取当前工程目录
        print(project.directory())
    end)
```

详细的扩展类库使用，见 [import](/cn/2016/06/09/api-import/)

一些内建类库有：

- os: 系统类库
- string: 字符串类库
- path: 路径类库
- table: table和array处理
- io: 文件io处理
- coroutine: 协程类库

一些内建的api有：

- raise：引发异常
- try/catch/finally: 异常捕获处理
- print/printf：打印
- format: 格式化字符串

更多详细类库和内建api介绍，见后续介绍。。。