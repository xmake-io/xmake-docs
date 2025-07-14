---
title: xmake从入门到精通6：开发和构建Qt程序
tags: [xmake, lua, qt]
date: 2019-11-21
author: Ruki
---

xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。

xmake完全支持对Qt5项目的维护和构建，通过本文将会带你了解如何通过xmake来维护各种类型的Qt项目。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

### 前言

Qt是一个1991年由Qt Company开发的跨平台C++图形用户界面应用程序开发框架。它有自己的IDE程序：qt creator，也有自己的构建程序：qmake，似乎新版本开始打算全面切到cmake来维护了。

尽管如此，xmake还是对Qt的开发做了支持，搭配上xmake-vscode/xmake-idea等插件，使用户可以在自己熟悉的编辑器和IDE上集成和开发Qt程序，并且在不同平台上提供一致的开发体验。

### 准备构建环境

首先，我们得准备好Qt开发环境，如果还没安装Qt SDK，那么到qt的官网登录下载安装包：https://www.qt.io/，或者自己拉取qt源码，编译静态版本sdk和工具链。

通常情况，如果是采用官方提供的QT SDK安装包，并且安装目录采用的默认路径，那么即使不配置QT SDK路径，xmake也会尝试去检测它，一般都是能检测到的，如果检测不到，我们可以尝试手动配置下它：


```bash
$ xmake f --qt=/home/xxx/qtsdk
```

或者设置到全局路径，避免每次编译切换都要配置一遍：

```bash
$ xmake g --qt=/home/xxx/qtsdk
```

### 创建模板工程

xmake内置了各种Qt项目的空工程模板，我们可以通过`xmake create`命令来快速创建它们。

注：由于xmake的master最新版本，也就是还未发布的v2.2.9版本对Qt的模板和构建规则进行了升级，因此本文主要讲解的都是基于最新版本来讲解，
而之前的老模版和规则也是向下兼容的，如果想要继续了解，可以查看相关文档：[Qt项目开发文档](/zh/examples/cpp/qt)

#### 创建QuickApp应用程序

我们先来创建一个带qml的quickapp空工程，只需要敲如下命令：

```bash
$ xmake create -t qt.quickapp test
create test ...
  [+]: xmake.lua
  [+]: src/main.qml
  [+]: src/main.cpp
  [+]: src/qml.qrc
  [+]: .gitignore
create ok!
```





xmake会生成带有xmake.lua的Qt项目，xmake.lua内容也很简单：

```lua
target("test")
    add_rules("qt.quickapp")
    add_headerfiles("src/*.h")
    add_files("src/*.cpp") 
    add_files("src/qml.qrc")
```

除了源文件的添加，其他基本上都跟之前的可执行程序项目没什么不同，唯一的区别就是通过`add_rules("qt.quickapp")`这个内置的Qt构建规则来代替`set_kind("binary")`。

其实`qt.quickapp`规则内部最终还是设置了binary类型，只不过在此基础上额外增加了一些只有Qt才需要的构建规则，比如：特定links，flags还有includedirs等。

接下来，我们尝试编译下这个项目：

```bash
$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.15
checking for the Qt SDK directory ... /Users/ruki/Qt5.13.2/5.13.2/clang_64
checking for the Qt SDK version ... 5.13.2
[  0%]: ccache compiling.release src/main.cpp
[ 49%]: compiling.qt.qrc src/qml.qrc
[100%]: linking.release test
```

其中`*.qrc`文件的构建规则也是在`qt.quickapp`的构建规则里面维护的，所以只有设置了这个rule，才能正常编译qrc文件。

最后，我们尝试运行下看看：

```bash
$ xmake run
```

运行效果如下：

![](/assets/img/guide/qt_quickapp.png)

#### 创建WidgetApp应用程序

创建一个widgetapp工程跟上文的quickapp方式基本一致，只需要改下模板名即可：


```bash
$ xmake create -t qt.widgetapp test
```

里面xmake.lua的内容看起来，也仅仅就是把`qt.quickapp`规则改成了`qt.widgetapp`规则，另外，ui描述文件从`.qrc`变成了`.ui`，其他并无区别。

```lua
target("qt_widgetapp")
    add_rules("qt.widgetapp")
    add_files("src/*.cpp") 
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- 添加带有 Q_OBJECT 的meta头文件
```

运行效果如下：

![](/assets/img/guide/qt_widgetapp.png)

#### 创建静态链接版本应用程序

默认通过qt官网下载的sdk，都是基于动态库的，如果用户用的是自己拉取qt源码然后编译的static版本qt sdk，那么创建的qt工程类型也必须对应static版本，因为两者来处理链接上会有不同的逻辑。

对于模板名，后面追加下`_static`来创建：

```bash
$ xmake create -t qt.widgetapp_static test
```

创建的就是基于静态QtSdk的WidgetApp工程，其里面的构建规则，也会改成`add_rules("qt.widgetapp_static")`，其他并无不同，QuickApp项目也是如此。

#### 创建其他Qt项目

除了QuickApp和WidgetApp项目，xmake还支持其他Qt项目的创建和编译，比如：终端程序，基于Qt的静态库和动态库等。

具体的工程模板，我们可以进入help菜单查看里面的模板列表：

```bash
$ xmake create --help
Usage: $xmake create [options] [target]

Create a new project.

Options: 
    -t TEMPLATE, --template=TEMPLATE       Select the project template id or 
                                           name of the given language. 
                                           (default: console)
                                               - console: c++, go, dlang, cuda, 
                                           rust, swift, objc, c, objc++
                                               - qt.console: c++
                                               - qt.quickapp: c++
                                               - qt.quickapp_static: c++
                                               - qt.shared: c++
                                               - qt.static: c++
                                               - qt.widgetapp: c++
                                               - qt.widgetapp_static: c++
```

更多其他Qt项目的使用说明，可以查看xmake的官方文档：[Qt项目构建文档](/zh/examples/cpp/qt)

### 运行和断点调试

我们可以通过`xmake run -d`命令来加载gdb/lldb调试程序，或者搭配xmake-vscode插件的断点调试支持，来开发和调试Qt程序。
这块可以阅读前文：[xmake从入门到精通3：运行和调试目标程序](https://tboox.org/cn/2019/11/09/quickstart-3-run-and-debug/)

另外，如果是win平台，我们也可以通过生成vs proj，然后通过vs自带的调试功能，进行断点调试，更加方便：

```bash
$ xmake project -k vsxmake
```

生成基于xmake的vs工程后，打开vs工程，点击调试运行即可：

![](/assets/img/manual/qt_vs.png)

### 开发Android程序

xmake目前是完全支持编译Android版本的Qt项目，整个Qt项目包括xmake.lua完全跟前面的例子一致，并不需要做特别的设置。

我们需要做的仅仅是，切换到android的编译平台去编译它，不过由于要生成apk包，在执行xmake编译后，qt构建规则会自动对android程序做一个部署deploy步骤，也就是调用qt内部的androiddeployqt程序去生成apk包。

因此除了需要android ndk，我们还需要额外依赖android sdk，通过设置`--android_sdk`参数对其指定下：

```bash
$ xmake f -p android --ndk=~/Downloads/android-ndk-r19c/ --android_sdk=~/Library/Android/sdk/ -c 
$ xmake
[  0%]: compiling.qt.qrc src/qml.qrc
[ 50%]: ccache compiling.release src/main.cpp
[100%]: linking.release libappdemo.so
[100%]: generating.qt.app appdemo.apk
```

上面的配置和构建过程就可以很方便的将之前的QuickApp和WidgetApp项目编译成Android App，另外qt规则内部还对android版本定制了install程序，可以很方便的安装qt apk到设备。

```bash
$ xmake install
installing appdemo ...
installing build/android/armv7-a/release/appdemo.apk ..
success
install ok!
```

安装和运行后的效果如下：

![](https://user-images.githubusercontent.com/151335/57430932-c7261000-7263-11e9-8886-eff07208d0d8.jpeg)

关于如何配置Android编译环境，可阅读前文：[xmake从入门到精通5：Android平台编译详解](https://tboox.org/cn/2019/11/15/quickstart-5-build-android/)

### 编辑器和IDE集成

xmake也提供了对各大常用编辑器的插件集成支持，配合这些插件，就可以在自己最熟悉的编辑器上开发和构建Qt程序。

#### 在vscode上开发和调试Qt程序

插件地址：[xmake-vscode](https://github.com/xmake-io/xmake-vscode)

<img src="https://raw.githubusercontent.com/tboox/xmake-vscode/master/res/problem.gif" width="650px" />

#### 在Sublime Text上开发Qt程序

插件地址：[xmake-sublime](https://github.com/xmake-io/xmake-sublime)

<img src="https://raw.githubusercontent.com/tboox/xmake-sublime/master/res/problem.gif" width="650px" />

#### 在Idea/CLion/Android Studio上开发Qt程序

插件地址：[xmake-idea](https://github.com/xmake-io/xmake-idea)

<img src="https://raw.githubusercontent.com/tboox/xmake-idea/master/res/problem.gif" width="650px" />

#### 在VisualStudio里面开发和调试Qt程序

也就是刚上面提到的通过生成vs proj方式来集成xmake：

```bash
$ xmake project -k vsxmake
```

生成基于xmake的vs工程后，打开vs工程，点击调试运行即可：

![](/assets/img/manual/qt_vs.png)

这块，具体详情，可以查看插件文档：[使用xmake生成vs工程](/zh/guide/extensions/builtin-plugins#visualstudio)