---
title: Xmake v2.7.1 发布，更好的 C++ Modules 支持
tags: [xmake, lua, C/C++, remote, ccache, C++20, Modules, headerunits, fs-watcher]
date: 2022-08-25
author: Ruki
---

[Xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具。

它非常的轻量，没有任何依赖，因为它内置了 Lua 运行时。

它使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

我们能够使用它像 Make/Ninja 那样可以直接编译项目，也可以像 CMake/Meson 那样生成工程文件，另外它还有内置的包管理系统来帮助用户解决 C/C++ 依赖库的集成使用问题。

目前，Xmake 主要用于 C/C++ 项目的构建，但是同时也支持其他 native 语言的构建，可以实现跟 C/C++ 进行混合编译，同时编译速度也是非常的快，可以跟 Ninja 持平。

```
Xmake = Build backend + Project Generator + Package Manager + [Remote|Distributed] Build + Cache
```

尽管不是很准确，但我们还是可以把 Xmake 按下面的方式来理解：

```
Xmake ~= Make/Ninja + CMake/Meson + Vcpkg/Conan + distcc + ccache/sccache
```

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](/zh/about/course)

## 新特性介绍

这个版本我们对 C++20 Modules 的实现进行了重构和改进，改进了模块文件的依赖图解析，新增了对 STL 和 User HeaderUnits 的支持，同时让 CMakelists/compile_commands 生成器也支持了 C++ Modules。

另外，我们新增了一个 `xmake watch` 插件，可以实时监控当前工程文件更新，自动触发增量构建，或者运行一些自定义的命令。

<img src="/assets/img/posts/xmake/xmake-watch.gif">






### C++ Modules 改进

Xmake 很早就已经支持 C++ Modules 的构建支持，并且能够自动分析模块间的依赖关系，实现最大化的并行编译。
另外，Xmake 采用 `.mpp` 作为默认的模块扩展名，但是也同时支持 `.ixx`, `.cppm`, `.mxx` 等扩展名。

例如：

```lua
set_languages("c++20")
target("class")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

更多例子见：[C++ Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules)

但是之前的实现还存在很多不足之处：

1. 不支持 HeaderUnits，因此也无法使用 stl 等模块
2. 自己扫描源码实现模块依赖图解析，不支持编译器提供的依赖扫描，因此不完全可靠
3. 不支持 CMakelists 生成
4. 不支持 compile_commands.json 生成

而在新版中，我们对 C++20 模块的实现进行了重构和升级，上面提到的几点，我们都做了支持，新增了对 Headerunits 的支持，因此我们可以在模块中引入 STL 和 用户头文件模块。

同时，由于 msvc 和 gcc 高版本 都已经内置对模块依赖图的扫描分析，Xmake 会优先借助编译器实现模块依赖图分析，如果编译器不支持（clang），那么 Xmake 也会退化到自己的源码扫描实现上去。

相关的补丁见：[#2641](https://github.com/xmake-io/xmake/pull/2641)，非常感谢 [@Arthapz](https://github.com/Arthapz) 的贡献。

下面是一个使用了 STL HeaderUnits 的模块例子，例如：

```bash
stl_headerunit$ xmake
[  0%]: generating.cxx.module.deps src/main.cpp
[  0%]: generating.cxx.module.deps src/hello.mpp
[ 20%]: generating.cxx.headerunit.bmi iostream
[ 60%]: generating.cxx.module.bmi hello
[ 70%]: cache compiling.release src/main.cpp
[ 80%]: linking.release stl_headerunit
[100%]: build ok!
```

对于首次编译，我们会扫描模块代码之间的依赖关系，然后预编译 iostream 等 stl 库作为 headerunit。

之后的重新编译，都会直接复用它们，实现编译加速。

注：通常我们至少需要添加一个 `.mpp` 文件，才能开启 C++20 modules 编译，如果只有 cpp 文件，默认是不会开启模块编译的。

但是，如果我们仅仅只是想在 cpp 文件中使用模块的 Headerunits 特性，比如引入一些 STL Headerunits 在 cpp 中使用，
那么我们也可以通过设置 `set_policy("build.c++.modules", true)` 来强行开启 C++ Modules 编译，例如：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    set_languages("c++20")
    set_policy("build.c++.modules", true)
```


### 工程文件监视和自动构建

这个版本中，我们新增了 `xmake watch` 插件命令，可以自动监视项目文件更新，然后触发自动构建，或者运行一些自定义命令。

这通常用于个人开发时候，实现快速的实时增量编译，而不需要每次手动执行编译命令，提高开发效率。

#### 项目更新后自动构建

默认行为就是监视整个项目根目录，任何文件改动都会触发项目的增量编译。

```bash
$ xmake watch
watching /private/tmp/test/src/** ..
watching /private/tmp/test/* ..
/private/tmp/test/src/main.cpp modified
[ 25%]: ccache compiling.release src/main.cpp
[ 50%]: linking.release test
[100%]: build ok!
```

#### 监视指定目录

我们也可以监视指定的代码目录，缩小监视范围，提升监视性能。

```bash
$ xmake watch -d src
$ xmake watch -d "src;tests/*"
```

上面的命令，会去递归监视所有子目录，如果想要仅仅监视当前目录下的文件，不进行递归监视，可以使用下面的命令。

```bash
$ xmake watch -p src
$ xmake watch -p "src;tests/*"
```

#### 监视并运行指定命令

如果想在自动构建后，还想自动运行构建的程序，我们可以使用自定义的命令集。

```bash
$ xmake watch -c "xmake; xmake run"
```

上面的命令列表是作为字符串传递，这对于复杂命令参数，需要转义比较繁琐不够灵活，那么我们可以使用下面的方式进行任意命令的设置。

```bash
$ xmake watch -- echo hello xmake!
$ xmake watch -- xmake run --help
```

#### 监视并运行目标程序

尽管我们可以通过自定义命令来实现目标程序的自动运行，但是我们也提供了更加方便的参数来实现这个行为。

```bash
$ xmake watch -r
$ xmake watch --run
[100%]: build ok!
hello world!
```

<img src="/assets/img/posts/xmake/xmake-watch.gif">

#### 监视并运行 lua 脚本

我们还可以监视文件更新后，运行指定的 lua 脚本，实现更加灵活复杂的命令定制。

```bash
$ xmake watch -s /tmp/test.lua
```

我们还可以再脚本中获取所有更新的文件路径列表和事件。

```lua
function main(events)
    -- TODO handle events
end
```

### Mac Catalyst 支持

MAc Catalyst 是苹果后来新推的一项让 iPad App 带入 Mac 的方案，通过 Mac Catalyst 构建的 Mac App 与您的 iPad App 共享代码，而且您可以单独为 Mac 添加更多功能。

新版本中，我们新增了 Mac Catalyst 目标的构建支持，在 macOS 平台上，我们只需要添加 `--appledev=catalyst` 配置选项，就可以支持编译现有的 iOS 代码，并让它在 macOS 上运行起来，而无需做任何改动。

```bash
$ xmake f --appledev=catalyst
$ xmake
```

我们可以在 [iosapp_with_framework](https://github.com/xmake-io/xmake/tree/master/tests/projects/objc/iosapp_with_framework) 这个测试项目中体验 Mac Catalyst 程序的编译运行。

```bash
$ xmake
[ 36%]: processing.xcode.release src/framework/Info.plist
[ 40%]: cache compiling.release src/framework/test.m
[ 44%]: linking.release test
[ 48%]: generating.xcode.release test.framework
[ 56%]: compiling.xcode.release src/app/Assets.xcassets
[ 56%]: processing.xcode.release src/app/Info.plist
[ 60%]: cache compiling.release src/app/ViewController.m
[ 60%]: cache compiling.release src/app/SceneDelegate.m
[ 60%]: cache compiling.release src/app/main.m
[ 60%]: cache compiling.release src/app/AppDelegate.m
[ 60%]: compiling.xcode.release src/app/Base.lproj/LaunchScreen.storyboard
[ 60%]: compiling.xcode.release src/app/Base.lproj/Main.storyboard
[ 88%]: linking.release demo
[ 92%]: generating.xcode.release demo.app
[100%]: build ok!
$ xmake run
2022-08-26 15:11:03.581 demo[86248:9087199] add(1, 2): 3
2022-08-26 15:11:03.581 demo[86248:9087199] hello xmake!
```

<img src="/assets/img/posts/xmake/mac-catalyst.png">

### 改进远程编译

#### 拉取远程构建文件

对于远程编译，我们新增加了一个拉取远程文件的命令，通常可用于远程编译完成后，下载远程的目标生成文件，库文件到本地。

```bash
$ xmake service --pull 'build/**' outputdir
```

我们可以通过 `--pull 'build/**'` 模式匹配需要下载的文件，可以是构建文件，也可以是其他文件。

注：文件是按项目隔离的，只能指定下载当前项目下的文件，并不会让用户下载服务器上其他目录下的文件，避免一些安全隐患。

#### 实时回显输出

先前的版本在使用远程编译的时候，客户端是无法实时输出服务端的编译信息的，由于缓存的存在，本地看到的编译进度信息都是一块一块刷新出来，体验不是很好。

因此我们加上了行缓冲刷新支持，提高了输出回显的实时性，使得用户在远程编译时，更接近本地编译的体验。

### 改进分布式编译调度算法

我们对 xmake 的分布式编译的服务器节点调度也做了进一步改进，加上了 cpu 负载和内存资源的权重，而不仅仅通过 cpu core 数量来分配任务。

因此，如果某些节点负载过高，我们会优先将编译任务调度到相当比较空闲的节点上去，充分利用所有编译资源。

### 更灵活的 cmake 包查找

#### 指定链接

对于 cmake 包，我们新增了 `link_libraries` 配置选项，让用户在查找使用 cmake 包的时候，可以自定义配置包依赖的链接库，甚至对 target 链接的支持。

```lua
add_requires("cmake::xxx", {configs = {link_libraries = {"abc::lib1", "abc::lib2"}}})
```

xmake 在查找 cmake 包的时候，会自动追加下面的配置，改进对 links 库的提取。

```cmake
target_link_libraries(test PRIVATE ABC::lib1 ABC::lib2)
```

#### 指定搜索模式

另外，我们增加的搜索模式配置：

```lua
add_requires("cmake::xxx", {configs = {search_mode = "config"}})
add_requires("cmake::xxx", {configs = {search_mode = "module"}})
add_requires("cmake::xxx") -- both
```

比如指定 config 搜索模式，告诉 cmake 从 `XXXConfig.cmake` 中查找包。

xmake 在查找 cmake 包的时候，内部会自动追加下面的配置。

```cmake
find_package(ABC CONFIG REQUIRED)
```

### armcc/armclang/rc 增量编译支持

在新版本中，我们对 keil 的 armcc/armclang 编译器也进行头文件依赖分析，来支持增量编译。

另外，msvc 的 rc.exe 资源编译器本身是无法提供头文件依赖分析的，但是 cl.exe 的预处理器却是可以处理资源文件的。
因此我们可以通过 `cl.exe /E test.rc` 去预处理资源文件，从中提取依赖信息，来实现资源文件的增量编译支持。

目前测试下来，效果还不错，同时我们也对内部 ICON/BITMAP 的资源引用依赖也做了支持。

### 其他问题修复

我们对构建缓存也做了很多修复，它将比之前的版本更加的稳定。另外我们也精简了 CMakelists 的生成。

更多细节改进见下面的更新日志：

## 更新内容

### 新特性

* [#2555](https://github.com/xmake-io/xmake/issues/2555): 添加 fwatcher 模块和 `xmake watch` 插件命令
* 添加 `xmake service --pull 'build/**' outputdir` 命令去拉取远程构建服务器上的文件
* [#2641](https://github.com/xmake-io/xmake/pull/2641): 改进 C++20 模块, 支持 headerunits 和 project 生成
* [#2679](https://github.com/xmake-io/xmake/issues/2679): 支持 Mac Catalyst 构建

### 改进

* [#2576](https://github.com/xmake-io/xmake/issues/2576): 改进从 cmake 中查找包，提供更过灵活的可选配置
* [#2577](https://github.com/xmake-io/xmake/issues/2577): 改进 add_headerfiles()，增加 `{install = false}` 支持
* [#2603](https://github.com/xmake-io/xmake/issues/2603): 为 ccache 默认禁用 `-fdirectives-only`
* [#2580](https://github.com/xmake-io/xmake/issues/2580): 设置 stdout 到 line 缓冲输出
* [#2571](https://github.com/xmake-io/xmake/issues/2571): 改进分布式编译的调度算法，增加 cpu/memory 状态权重
* [#2410](https://github.com/xmake-io/xmake/issues/2410): 改进 cmakelists 生成
* [#2690](https://github.com/xmake-io/xmake/issues/2690): 改机传递 toolchains 到包
* [#2686](https://github.com/xmake-io/xmake/issues/2686): 改进 armcc/armclang 支持增量编译
* [#2562](https://github.com/xmake-io/xmake/issues/2562): 改进 rc.exe 对引用文件依赖的解析和增量编译支持
* 改进默认的并行构建任务数

### Bugs 修复

* [#2614](https://github.com/xmake-io/xmake/issues/2614): 为 msvc 修复构建 submodules2 测试工程
* [#2620](https://github.com/xmake-io/xmake/issues/2620): 修复构建缓存导致的增量编译问题
* [#2177](https://github.com/xmake-io/xmake/issues/2177): 修复 python.library 在 macOS 上段错误崩溃
* [#2708](https://github.com/xmake-io/xmake/issues/2708): 修复 mode.coverage 规则的链接错误
* 修复 ios/macOS framework 和 application 的 rpath 加载路径
