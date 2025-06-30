## Console 程序 {#console}

创建空工程：

```sh
$ xmake create -l objc -t console test
```

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.m")
```

更多例子见：[Objc Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/objc++)

## App 应用程序 {#application}

用于生成*.app/*.ipa应用程序，同时支持iOS/MacOS。

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
```

::: tip 注意
2.5.7 之后，可以支持直接添加 `*.metal` 文件，xmake 会自动生成 default.metallib 提供给应用程序加载使用。
:::

### 创建工程 {#create-project}

我们也可以通过模板工程快速创建：

```sh
$ xmake create -t xcode.macapp -l objc test
$ xmake create -t xcode.iosapp -l objc test
```

### 编译 {#build}

```sh
$ xmake f -p [iphoneos|macosx]
$ xmake
[ 18%]: compiling.xcode.release src/Assets.xcassets
[ 27%]: processing.xcode.release src/Info.plist
[ 72%]: compiling.xcode.release src/Base.lproj/Main.storyboard
[ 81%]: compiling.xcode.release src/Base.lproj/LaunchScreen.storyboard
[ 45%]: cache compiling.release src/ViewController.m
[ 63%]: cache compiling.release src/AppDelegate.m
[ 54%]: cache compiling.release src/SceneDelegate.m
[ 36%]: cache compiling.release src/main.m
[ 90%]: linking.release test
[100%]: generating.xcode.release test.app
[100%]: build ok!
```

### 配置签名 {#configure-sign}

对于iOS程序，默认会检测系统先用可用签名来签名app，当然我们也可以手动指定其他签名证书：

```sh
$ xmake f -p iphoneos --xcode_codesign_identity='Apple Development: xxx@gmail.com (T3NA4MRVPU)' --xcode_mobile_provision='iOS Team Provisioning Profile: org.tboox.test --xcode_bundle_identifier=org.tboox.test'
$ xmake
```

如果每次这么配置签名觉得繁琐的话，可以设置到`xmake global`全局配置中，也可以在xmake.lua中对每个target单独设置：

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
    add_values("xcode.bundle_identifier", "org.tboox.test")
    add_values("xcode.codesign_identity", "Apple Development: xxx@gmail.com (T3NA4MRVPU)")
    add_values("xcode.mobile_provision", "iOS Team Provisioning Profile: org.tboox.test")
```

那如何知道我们需要的签名配置呢？一种就是在xcode里面查看，另外xmake也提供了一些辅助工具可以dump出当前可用的所有签名配置：

```sh
$ xmake l private.tools.codesign.dump
==================================== codesign identities ====================================
{
  "Apple Development: waruqi@gmail.com (T3NA4MRVPU)" = "AF73C231A0C35335B72761BD3759694739D34EB1"
}

===================================== mobile provisions =====================================
{
  "iOS Team Provisioning Profile: org.tboox.test" = "<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>AppIDName</key>
	<string>XC org tboox test5</string>
	<key>ApplicationIdentifierPrefix</key>
	<array>
	<string>43AAQM58X3</string>
...
```

我们也提供了其他辅助工具来对已有的ipa/app程序进行重签名，例如：

```sh
$ xmake l utils.ipa.resign test.ipa|test.app [codesign_identity] [mobile_provision] [bundle_identifier]
```

其中，后面的签名参数都是可选的，如果没设置，那么默认会探测使用一个有效的签名：

```sh
$ xmake l utils.ipa.resign test.ipa
$ xmake l utils.ipa.resign test.app "Apple Development: waruqi@gmail.com (T3NA4MRVPU)"
$ xmake l utils.ipa.resign test.ipa "Apple Development: waruqi@gmail.com (T3NA4MRVPU)" iOS Team Provisioning Profile: org.tboox.test" org.tboox.test
```

### 运行应用程序 {#run-program}

目前仅支持运行 macOS 程序：

```sh
$ xmake run
```

效果如下：

![](/assets/img/guide/macapp.png)

### 生成程序包 {#package}

如果是 iOS 程序会生成ipa安装包，如果是macos会生成dmg包（dmg包生成暂时还在开发中）。

```sh
$ xmake package
output: build/iphoneos/release/arm64/test.ipa
package ok!
```

我们也提供了辅助工具，来对指定app程序进行打包：

```sh
$ xmake l utils.ipa.package test.app output.ipa [iconfile.png]
```

### 安装 {#install}

如果是iOS程序会安装ipa到设备，如果是macos会安装app到/Applications目录。

```sh
$ xmake install
```

我们也提供了辅助工具，来对指定ipa/app程序安装到设备：

```sh
$ xmake l utils.ipa.install test.app
$ xmake l utils.ipa.install test.ipa
```

### 卸载 {#uninstall}

::: tip 注意
目前仅支持macos程序卸载
:::

```sh
$ xmake uninstall
```

## Framework 库程序 {#Framework}

```lua
target("test")
    add_rules("xcode.framework")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

我们也可以通过模板工程快速创建：

```sh
$ xmake create -t xcode.framework -l objc test
```

另外，xmake v2.3.9 以上版本，xmake 还提供了带有 framework 库使用的完整 iosapp/macapp 空工程模板，可以完整体验 framework 的编译，依赖使用以及集成到 app 应用程序中。

同时，如果我们开启了模拟器，xmake 可以支持直接 `xmake install` 和 `xmake run` 将 app 安装到模拟器并加载运行。

```sh
$ xmake create -t xcode.iosapp_with_framework -l objc testapp
$ cd testapp
$ xmake f -p iphoneos -a x86_64
$ xmake
$ xmake install
$ xmake run
```

## Bundle 程序 {#bundle}

```lua
target("test")
    add_rules("xcode.bundle")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

我们也可以通过模板工程快速创建：

```sh
$ xmake create -t xcode.bundle -l objc test
```
