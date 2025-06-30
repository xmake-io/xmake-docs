Create an empty project:

```sh
$ xmake create -t qt.console test
$ xmake create -t qt.static test
$ xmake create -t qt.shared test
$ xmake create -t qt.quickapp test
$ xmake create -t qt.widgetapp test
```

For more project templates see: `xmake create --help`

xmake will detect Qt SDK automatically and we can also set the SDK directory manually.

```sh
$ xmake f --qt=~/Qt/Qt5.9.1
```

The MingW SDK specified above uses the environment that comes with the Tools directory under Qt. Of course, if there are other third-party MingW compilation environments, they can also be specified manually. 
For details, please refer to: [MingW Configuration](https://xmake.io/#/guide/configuration?id=mingw).

For more details, please refer to: [#160](https://github.com/xmake-io/xmake/issues/160)

In addition, currently xmake also supports Qt/Wasm. For details, see: [Wasm Configuration](https://xmake.io/#/guide/configuration?id=wasm)

```sh
$ xmake f -p wasm
```

## Static Library

```lua
target("qt_static_library")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

## Shared Library

```lua
target("qt_shared_library")
    add_rules("qt.shared")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

## Console Program

```lua
target("qt_console")
    add_rules("qt.console")
    add_files("src/*.cpp")
```

## Quick Application

```lua
target("qt_quickapp")
    add_rules("qt.quickapp")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
```

::: tip NOTE
If you are using your own compiled static version of the QT SDK, you need to switch to the `add_rules("qt.quickapp_static")` static rule,
because the linked libraries are different and need to be statically linked.
:::

Next, we try to compile, usually, if you use the Qt installation package to install by default, and do not modify the installation path, then in most cases you can automatically detect the root path of the QT SDK, for example:

```sh
$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.15
checking for the Qt SDK directory ... /Users/ruki/Qt5.13.2/5.13.2/clang_64
checking for the Qt SDK version ... 5.13.2
[0%]: cache compiling.release src/main.cpp
[49%]: compiling.qt.qrc src/qml.qrc
[100%]: linking.release test
Build ok!
```

Then we continue to run it:

```sh
$ xmake run
```

The effect is as follows:

![](/assets/img/guide/qt_quickapp.png)

## Quick Plugin

For a full example see: [quickplugin example](https://github.com/xmake-io/xmake/tree/master/tests/projects/qt/quickplugin)

```lua
add_rules("mode.debug", "mode.release")

target("demo")
    add_rules("qt.qmlplugin")
    add_headerfiles("src/*.h")
    add_files("src/*.cpp")

    set_values("qt.qmlplugin.import_name", "My.Plugin")
```

## Widgets Application

```lua
target("qt_widgetapp")
    add_rules("qt.widgetapp")
    add_headerfiles("src/*.h")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    -- add files with Q_OBJECT meta (only for qt.moc)
    add_files("src/mainwindow.h")
```

::: tip NOTE
If you are using your own compiled static version of the QT SDK, you need to switch to the `add_rules("qt.widgetapp_static")` static rule,
because the linked libraries are different and need to be statically linked.
:::

The effect is as follows:

![](/assets/img/guide/qt_widgetapp.png)


## Android Application

After the 2.2.6 version, you can directly switch to the android platform to compile the Quick/Widgets application, generate the apk package, and install it to the device via the `xmake install` command.

```sh
$ xmake create -t quickapp_qt -l c ++ appdemo
$ cd appdemo
$ xmake f -p android --ndk=~/Downloads/android-ndk-r19c/ --android_sdk=~/Library/Android/sdk/ -c
$ xmake
[0%]: compiling.qt.qrc src/qml.qrc
[ 50%]: cache compiling.release src/main.cpp
[100%]: linking.release libappdemo.so
[100%]: generating.qt.app appdemo.apk
```

Then install to the device:

```sh
$ xmake install
installing appdemo ...
installing build/android/release/appdemo.apk ..
success
install ok!👌
```

## Supported Qt SDKs

### The official Qt SDK installation package

This is usually detected automatically on macos/windows, but it is possible to specify the Qt SDK path manually.

```sh
$ xmake f --qt=[qt sdk path]
```

### The Ubuntu Apt package

After installing the Qt SDK using apt, xmake will also be able to detect it automatically.

```sh
$ sudo apt install -y qtcreator qtbase5-dev
$ xmake
```

### Qt Mingw SDK from msys2/pacman

xmake also supports the Qt Mingw SDK installed from pacman

```sh
$ pacman -S mingw-w64-x86_64-qt5 mingw-w64-x86_64-qt-creator
$ xmake
```

### Qt SDK package from aqtinstall script

The Qt SDK installed by [aqtinstall](https://github.com/miurahr/aqtinstall) is based entirely on the official SDK structure and is therefore fully supported by xmake.

However, it is usually necessary to specify the SDK path yourself.

```sh
$ xmake f --qt=[Qt SDK]
```

### Cross-Platform Qt Builds

For cross-platform Qt development, xmake supports using separate SDKs for host tools and the target platform. This is particularly useful when building Qt applications for a different platform than your development machine.

The `--qt_host` option allows you to specify the location of Qt tools that are compatible with your build machine, while `--qt` points to the SDK for the target platform:

```sh
$ xmake f --qt=[target Qt sdk] --qt_host=[host Qt sdk]
```

::: tip NOTE
- Make sure the host and target Qt versions match, or it may cause build issues.
- Native deployment tools like `windeployqt` and `macdeployqt` must run on their respective platforms, so cross-platform tasks such as `xmake install` may fail.
:::

### Qt packages from the xmake-repo repository

xmake now officially provides a variety of modules for the Qt5 SDK that can be integrated automatically without any manual installation.

Just configure the integration packages and xmake will automatically handle the Qt installation and integration and compile the project automatically.

```lua
add_rules("mode.debug", "mode.release")

add_requires("qt5widgets")

target("test")
    add_rules("qt.widgetapp")
    add_packages("qt5widgets")

    add_headerfiles("src/*.h")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    -- add files with Q_OBJECT meta (only for qt.moc)
    add_files("src/mainwindow.h")
```

In addition to the `qt5widgets` package, the repository also provides `qt5gui`, `qt5network` and other packages that can be used.

Once configured, simply execute:

```sh
$ xmake
```

::: tip NOTE
The Qt6 package is still under development and only supports Qt5 for now
:::

### Qt packages from vcpkg/conan

There is no time to support it yet, so please try to integrate the Qt SDK in the same way as above.
