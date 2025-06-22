创建一个空工程：

```bash
$ xmake create -t qt.console test
$ xmake create -t qt.static test
$ xmake create -t qt.shared test
$ xmake create -t qt.quickapp test
$ xmake create -t qt.widgetapp test
```

更多工程模板见：`xmake create --help`

默认会自动探测Qt环境，当然也可以指定Qt SDK环境目录：

```bash
$ xmake f --qt=~/Qt/Qt5.9.1
```

如果想要使用 windows 下 MingW 的 Qt 环境，可以切到mingw的平台配置，并且指定下mingw编译环境的sdk路径即可，例如：

```bash
$ xmake f -p mingw --sdk=C:\Qt\Qt5.10.1\Tools\mingw530_32
```

上述指定的 MingW SDK 用的是Qt下Tools目录自带的环境，当然如果有其他第三方 MingW 编译环境，也可以手动指定, 具体可以参考：[MingW 编译配置](https://xmake.io/#/zh-cn/guide/configuration?id=mingw)。

更多详情可以参考：[#160](https://github.com/xmake-io/xmake/issues/160)

另外，当前xmake也支持Qt/Wasm，详情见：[Wasm 配置](https://xmake.io/#/zh-cn/guide/configuration?id=wasm)

```bash
$ xmake f -p wasm
```

## 静态库程序 {#static-library}

```lua
target("qt_static_library")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

## 动态库程序 {#shared-library}

```lua
target("qt_shared_library")
    add_rules("qt.shared")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

## 控制台程序 {#console}

```lua
target("qt_console")
    add_rules("qt.console")
    add_files("src/*.cpp")
```

## Quick 应用程序 {#quickapp}

```lua
target("qt_quickapp")
    add_rules("qt.quickapp")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
```

::: tip NOTE
如果使用的自己编译的static版本QT SDK，那么需要切换到`add_rules("qt.quickapp_static")`静态规则才行，因为链接的库是不同的，需要做静态链接。
:::

接下来，我们尝试编译下，通常，如果是使用Qt的安装包默认安装，也没有修改安装路径，那么大部分情况下都是可以自动检测到QT SDK的根路径，例如：

```bash
$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.15
checking for the Qt SDK directory ... /Users/ruki/Qt5.13.2/5.13.2/clang_64
checking for the Qt SDK version ... 5.13.2
[  0%]: cache compiling.release src/main.cpp
[ 49%]: compiling.qt.qrc src/qml.qrc
[100%]: linking.release test
build ok!
```

然后我们继续运行下它：

```bash
$ xmake run
```

效果如下：

![](/assets/img/guide/qt_quickapp.png)

## Quick Plugin 程序 {#quick-plugin}

完整例子见：[quickplugin example](https://github.com/xmake-io/xmake/tree/master/tests/projects/qt/quickplugin)

```lua
add_rules("mode.debug", "mode.release")

target("demo")
    add_rules("qt.qmlplugin")
    add_headerfiles("src/*.h")
    add_files("src/*.cpp")

    set_values("qt.qmlplugin.import_name", "My.Plugin")
```

## Widgets 应用程序 {#widgetapp}

```lua
target("qt_widgetapp")
    add_rules("qt.widgetapp")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- 添加带有 Q_OBJECT 的meta头文件
```

::: tip NOTE
如果使用的自己编译的static版本QT SDK，那么需要切换到`add_rules("qt.widgetapp_static")`静态规则才行，因为链接的库是不同的，需要做静态链接。
:::

运行效果如下：

![](/assets/img/guide/qt_widgetapp.png)

