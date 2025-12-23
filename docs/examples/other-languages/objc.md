## Console

Create an empty project:

```sh
$ xmake create -l objc -t console test
```

<FileExplorer rootFilesDir="examples/other-languages/objc/console" />

For more examples, see: [Objc Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/objc++)

## Application

Generate *.app/*.ipa application and supports iOS/MacOS.

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
```

::: tip NOTE
After 2.5.7, you can directly add `*.metal` files, xmake will automatically generate default.metallib for the application to load and use.
:::

### Create Project

We can also quickly create project through template:

```sh
$ xmake create -t xcode.macapp -l objc test
$ xmake create -t xcode.iosapp -l objc test
```

### Build Program

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

### Codesign

For iOS programs, it will detect that the system first signs the app with available signatures. Of course, we can also manually specify other signature certificates:

```sh
$ xmake f -p iphoneos --xcode_codesign_identity='Apple Development: xxx@gmail.com (T3NA4MRVPU)' --xcode_mobile_provision='iOS Team Provisioning Profile: org.tboox.test --xcode_bundle_identifier=org.tboox.test'
$ xmake
```

If it is cumbersome to configure the signature every time, you can set it to the `xmake global` global configuration, or you can set it separately for each target in xmake.lua:

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
    add_values("xcode.bundle_identifier", "org.tboox.test")
    add_values("xcode.codesign_identity", "Apple Development: xxx@gmail.com (T3NA4MRVPU)")
    add_values("xcode.mobile_provision", "iOS Team Provisioning Profile: org.tboox.test")
```

How do we know the signature configuration we need? One is to view it in xcode. In addition, xmake also provides some auxiliary tools to dump all currently available signature configurations:

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
	<string>XC org tboox test</string>
	<key>ApplicationIdentifierPrefix</key>
	<array>
	<string>43AAQM58X3</string>
...
```

We also provide other auxiliary tools to re-sign existing ipa / app programs, for example:

```sh
$ xmake l utils.ipa.resign test.ipa | test.app [codesign_identity] [mobile_provision] [bundle_identifier]
```

Among them, the following signature parameters are optional, if not set, then a valid signature will be detected by default:

```sh
$ xmake l utils.ipa.resign test.ipa
$ xmake l utils.ipa.resign test.app "Apple Development: waruqi@gmail.com (T3NA4MRVPU)"
$ xmake l utils.ipa.resign test.ipa "Apple Development: waruqi@gmail.com (T3NA4MRVPU)" iOS Team Provisioning Profile: org.tboox.test" org.tboox.test
```

### Run the application

Currently only supports running macos program:

```sh
$ xmake run
```

The effect is as follows:

![](/assets/img/guide/macapp.png)

### Package program

If it is an iOS program, it will generate an ipa installation package, if it is macOS, it will generate a dmg package (dmg package generation is still under development for the time being).

```sh
$ xmake package
output: build/iphoneos/release/arm64/test.ipa
package ok!
```

We also provide auxiliary tools to package the specified app program:

```sh
$ xmake l utils.ipa.package test.app output.ipa [iconfile.png]
```

### Install

If it is an iOS program, it will install ipa to the device, if it is macos, it will install the app to the `/Applications` directory.

```sh
$ xmake install
```

We also provide auxiliary tools to install the specified ipa/app program to the device:

```sh
$ xmake l utils.ipa.install test.app
$ xmake l utils.ipa.install test.ipa
```

### Uninstall

::: tip NOTE
Currently only the macos program is supported
:::

```sh
$ xmake uninstall
```

## Framework Program

<FileExplorer rootFilesDir="examples/other-languages/objc/framework" />

We can also quickly create project through template:

```sh
$ xmake create -t xcode.framework -l objc test
```

In addition, xmake v2.3.9 and above, xmake also provides a complete iosapp/macapp empty project template with framework library usage, you can fully experience framework compilation, dependent use and integration into app applications.

At the same time, if we turn on the emulator, xmake can support directly `xmake install` and `xmake run` to install the app to the emulator and load and run it.

```sh
$ xmake create -t xcode.iosapp_with_framework -l objc testapp
$ cd testapp
$ xmake f -p iphoneos -a x86_64
$ xmake
$ xmake install
$ xmake run
```

## Bundle Program

```lua
target("test")
    add_rules("xcode.bundle")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

We can also quickly create project through template:

```sh
$ xmake create -t xcode.bundle -l objc test
```
