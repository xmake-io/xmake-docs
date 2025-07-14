---
title: xmake v2.5.7 发布，包依赖锁定和 Vala/Metal 语言编译支持
tags: [xmake, lua, C/C++, lock, package, vala]
date: 2021-08-29
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具，使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

这个版本，我们新增了很多新特性，不仅增加了对 Vala 和 Metal 语言的编译支持，另外我们还改进了包依赖管理，能够像 npm/package.lock 那样支持对依赖包的锁定和更新，使得用户的项目不会受到上游包仓库的更新变动影响。

此外，我们还提供了一些比较实用的规则， 比如 `utils.bin2c` 可以让用户方便快速的内嵌一些二进制资源文件到代码中去，以头文件的方式获取相关数据。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](https://xmake.io/zh/)

## 新特性介绍

### 新增 Vala 语言支持

这个版本，我们已经可以初步支持构建 Vala 程序，只需要应用 `add_rules("vala")` 规则。

同时，我们需要添加一些依赖包，其中 glib 包是必须的，因为 vala 自身也会用到它。

`add_values("vala.packages")` 用于告诉 valac，项目需要哪些包，它会引入相关包的 vala api，但是包的依赖集成，还是需要通过 `add_requires("lua")` 下载集成。

例如：

```lua
add_rules("mode.release", "mode.debug")

add_requires("lua", "glib")

target("test")
    set_kind("binary")
    add_rules("vala")
    add_files("src/*.vala")
    add_packages("lua", "glib")
    add_values("vala.packages", "lua")
```

更多例子：[Vala examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/vala)

### 新增包依赖锁定支持

这个特性类似 npm 的 package.lock, cargo 的 cargo.lock。








比如，我们引用一些包，默认情况下，如果不指定版本，那么 xmake 每次都会自动拉取最新版本的包来集成使用，例如：

```lua
add_requires("zlib")
```

但如果上游的包仓库更新改动，比如 zlib 新增了一个 1.2.11 版本，或者安装脚本有了变动，都会导致用户的依赖包发生改变。

这容易导致原本编译通过的一些项目，由于依赖包的变动出现一些不稳定因素，有可能编译失败等等。

为了确保用户的项目每次使用的包都是固定的，我们可以通过下面的配置去启用包依赖锁定。

```lua
set_policy("package.requires_lock", true)
```

这是一个全局设置，必须设置到全局根作用域，如果启用后，xmake 执行完包拉取，就会自动生成一个 `xmake-requires.lock` 的配置文件。

它包含了项目依赖的所有包，以及当前包的版本等信息。

```lua
{
    __meta__ = {
        version = "1.0"
    },
    ["macosx|x86_64"] = {
        ["cmake#31fecfc4"] = {
            repo = {
                branch = "master",
                commit = "4498f11267de5112199152ab030ed139c985ad5a",
                url = "https://github.com/xmake-io/xmake-repo.git"
            },
            version = "3.21.0"
        },
        ["glfw#31fecfc4"] = {
            repo = {
                branch = "master",
                commit = "eda7adee81bac151f87c507030cc0dd8ab299462",
                url = "https://github.com/xmake-io/xmake-repo.git"
            },
            version = "3.3.4"
        },
        ["opengl#31fecfc4"] = {
            repo = {
                branch = "master",
                commit = "94d2eee1f466092e04c5cf1e4ecc8c8883c1d0eb",
                url = "https://github.com/xmake-io/xmake-repo.git"
            }
        }
    }
}
```

当然，我们也可以执行下面的命令，强制升级包到最新版本。

```console
$ xmake require --upgrade
upgrading packages ..
  zlib: 1.2.10 -> 1.2.11
1 package is upgraded!
```

### option 支持代码片段的运行时检测

option 本身有提供 `add_csnippets/add_cxxsnippets` 两个接口，用于快速检测特定一段 c/c++ 代码是否通过编译，如果编译通过就会启用对应 option 选项。

但之前的版本仅仅只能提供编译期检测，而新版本中，我们还新增了运行时检测支持。

我们可以通过设置 `{tryrun = true}` 和 `{output = true}` 两个参数，用于尝试运行检测和捕获输出。

#### 尝试运行检测

设置 tryrun 可以尝试运行来检测

```lua
option("test")
    add_cxxsnippets("HAS_INT_4", "return (sizeof(int) == 4)? 0 : -1;", {tryrun = true})
```

如果编译运行通过，test 选项就会被启用。

#### 运行时检测并捕获输出

设置 output 也会尝试去检测，并且额外捕获运行的输出内容。

```lua
option("test")
    add_cxxsnippets("INT_SIZE", 'printf("%d", sizeof(int)); return 0;', {output = true, number = true})
```

如果编译运行通过，test 选项就会被启用，同时能获取到对应的输出内容作为 option 的值。

注：设置为捕获输出，当前 option 不能再设置其他 snippets

我们也可以通过 `is_config` 获取绑定到option的输出。

```lua
if is_config("test", "8") tben
    -- xxx
end
```

另外，我们也对 `includes("check_csnippets")` 的辅助检测接口，也做了改进来支持运行时检测。

```lua
includes("check_csnippets.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")

    check_csnippets("HAS_INT_4", "return (sizeof(int) == 4)? 0 : -1;", {tryrun = true})
    check_csnippets("INT_SIZE", 'printf("%d", sizeof(int)); return 0;', {output = true, number = true})
    configvar_check_csnippets("HAS_LONG_8", "return (sizeof(long) == 8)? 0 : -1;", {tryrun = true})
    configvar_check_csnippets("PTR_SIZE", 'printf("%d", sizeof(void*)); return 0;', {output = true, number = true})
```

如果启用捕获输出，`config.h.in` 的 `${define PTR_SIZE}` 会自动生成 `#define PTR_SIZE 4`。

其中，`number = true` 设置，可以强制作为 number 而不是字符串值，否则默认会定义为 `#define PTR_SIZE "4"`

### 快速内嵌二进制资源文件到代码

我们可以通过 `utils.bin2c` 规则，在项目中引入一些二进制文件，并见他们作为 c/c++ 头文件的方式提供开发者使用，获取这些文件的数据。

比如，我们可以在项目中，内嵌一些 png/jpg 资源文件到代码中。

```lua
target("console")
    set_kind("binart")
    add_rules("utils.bin2c", {extensions = {".png", ".jpg"}})
    add_files("src/*.c")
    add_files("res/*.png", "res/*.jpg")
```

注：extensions 的设置是可选的，默认后缀名是 .bin

然后，我们就可以通过 `#include "filename.png.h"` 的方式引入进来使用，xmake 会自动帮你生成对应的头文件，并且添加对应的搜索目录。

```c
static unsigned char g_png_data[] = {
    #include "image.png.h"
};

int main(int argc, char** argv)
{
    printf("image.png: %s, size: %d\n", g_png_data, sizeof(g_png_data));
    return 0;
}
```

生成头文件内容类似：

```console
cat build/.gens/test/macosx/x86_64/release/rules/c++/bin2c/image.png.h
  0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x78, 0x6D, 0x61, 0x6B, 0x65, 0x21, 0x0A, 0x00
```

### 新增 iOS/macOS 应用 Metal 编译支持

我们知道 `xcode.application` 规则可以编译 iOS/macOS 应用程序，生成 .app/.ipa 程序包，并同时完成签名操作。

不过之前它不支持对带有 .metal 代码的编译，而新版本中，我们新增了 `xcode.metal` 规则，并默认关联到 `xcode.application` 规则中去来默认支持 metal 编译。

xmake 会自动编译 .metal 然后打包生成 default.metallib 文件，并且自动内置到 .app/.ipa 里面。

如果用户的 metal 是通过 `[_device newDefaultLibrary]` 来访问的，那么就能自动支持，就跟使用 xcode 编译一样。

这里是我们提供的一个完整的：[项目例子](https://github.com/xmake-io/xmake/blob/master/tests/projects/objc/metal_app/xmake.lua)。

```lua
add_rules("mode.debug", "mode.release")

target("HelloTriangle")
    add_rules("xcode.application")
    add_includedirs("Renderer")
    add_frameworks("MetalKit")
    add_mflags("-fmodules")
    add_files("Renderer/*.m", "Renderer/*.metal") ------- 添加 metal 文件
    if is_plat("macosx") then
        add_files("Application/main.m")
        add_files("Application/AAPLViewController.m")
        add_files("Application/macOS/Info.plist")
        add_files("Application/macOS/Base.lproj/*.storyboard")
        add_defines("TARGET_MACOS")
        add_frameworks("AppKit")
    elseif is_plat("iphoneos") then
        add_files("Application/*.m")
        add_files("Application/iOS/Info.plist")
        add_files("Application/iOS/Base.lproj/*.storyboard")
        add_frameworks("UIKit")
        add_defines("TARGET_IOS")
```

比如，在 macOS 上，编译运行后，就会通过 metal 渲染出需要的效果。

![](/assets/img/posts/xmake/xmake-metal.png)

如果，我们的项目没有使用默认的 metal library，我们也可以通过上面提到的 `utils.bin2c` 规则，作为源文件的方式内嵌到代码库中，例如：

```lua
add_rules("utils.bin2c", {extensions = ".metal"})
add_files("Renderer/*.metal")
```

然后代码中，我们就能访问了：

```c
static unsigned char g_metal_data[] = {
    #include "xxx.metal.h"
};

id<MTLLibrary> library = [_device newLibraryWithSource:[[NSString stringWithUTF8String:g_metal_data]] options:nil error:&error];
```

### 改进 add_repositories

如果我们通过内置在项目中的本地仓库，我们之前是通过 `add_repositories("myrepo repodir")` 的方式来引入。

但是，它并不像 `add_files()` 那样是基于当前 xmake.lua 文件目录的相对目录，也没有路径的自动转换，因此容易遇到找不到 repo 的问题。

因此，我么你改进了下它，可以通过额外的 rootdir 参数指定对应的根目录位置，比如相对当前 xmake.lua 的脚本目录。

```lua
add_repositories("myrepo repodir", {rootdir = os.scriptdir()})
```

### os.cp 支持符号链接

之前的版本，`os.cp` 接口不能很好的处理符号链接的复制，他会自动展开链接，复制实际的文件内容，只会导致复制后，符号链接丢失。

如果想要复制后，原样保留符号链接，只需要设置下参数：`{symlink = true}`

```lua
os.cp("/xxx/symlink", "/xxx/dstlink", {symlink = true})
```

### 更方便地编译自动生成的代码

有时候，我们会有这样一个需求，在编译前，自动生成一些源文件参与后期的代码编译。但是由于 `add_files` 添加的文件在执行编译时候，就已经确定，无法在编译过程中动态添加它们（因为需要并行编译）。

因此，要实现这个需求，我们通常需要自定义一个 rule，然后里面主动调用编译器模块去处理生成代码的编译，对象文件的注入，依赖更新等一系列问题。

这对于 xmake 开发者本身没什么大问题，但是对于用户来说，这还是比较繁琐了，不好上手。

新版本中，我们改进了对 `add_files` 的支持，并添加了 `{always_added = true}` 配置来告诉 xmake 我们始终需要添加指定的源文件，即使它还不存在。

这样我们就可以依靠xmake的默认编译过程来编译自动生成的代码了，像这样：

```lua
add_rules("mode.debug", "mode.release")

target("autogen_code")
    set_kind("binary")
    add_files("$(buildir)/autogen.cpp", {always_added = true})
    before_build(function (target)
        io.writefile("$(buildir)/autogen.cpp", [[
#include <iostream>

using namespace std;

int main(int argc, char** argv)
{
    cout << "hello world!" << endl;
    return 0;
}
        ]])
    end)
```

都不需要额外的 rule 定义，只需要保证编译顺序，在正确的阶段生成代码文件就可以了。

但是，我们也需要注意，由于当前自动生成的源文件可能还不存在，我们不能在 `add_files` 里面使用模式匹配，只能显式添加每个源文件路径。

## 更新内容

### 新特性

* [#1534](https://github.com/xmake-io/xmake/issues/1534): 新增对 Vala 语言的支持
* [#1544](https://github.com/xmake-io/xmake/issues/1544): 添加 utils.bin2c 规则去自动从二进制资源文件产生 .h 头文件并引入到 C/C++ 代码中
* [#1547](https://github.com/xmake-io/xmake/issues/1547): option/snippets 支持运行检测模式，并且可以获取输出
* [#1567](https://github.com/xmake-io/xmake/issues/1567): 新增 xmake-requires.lock 包依赖锁定支持
* [#1597](https://github.com/xmake-io/xmake/issues/1597): 支持编译 metal 文件到 metallib，并改进 xcode.application 规则去生成内置的 default.metallib 到 app

### 改进

* [#1540](https://github.com/xmake-io/xmake/issues/1540): 更好更方便地编译自动生成的代码
* [#1578](https://github.com/xmake-io/xmake/issues/1578): 改进 add_repositories 去更好地支持相对路径
* [#1582](https://github.com/xmake-io/xmake/issues/1582): 改进安装和 os.cp 支持符号链接

### Bugs 修复

* [#1531](https://github.com/xmake-io/xmake/issues/1531): 修复 targets 加载失败的错误信息提示错误
