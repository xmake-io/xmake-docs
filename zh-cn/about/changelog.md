
## v2.8.7

### 新特性

* [#4544](https://github.com/xmake-io/xmake/issues/4544): 改进 `xmake test`，支持等待进程超时
* [#4606](https://github.com/xmake-io/xmake/pull/4606): 为 package 添加 `add_versionfiles` 接口
* [#4709](https://github.com/xmake-io/xmake/issues/4709): 添加 cosmocc 工具链支持
* [#4715](https://github.com/xmake-io/xmake/issues/4715): 在描述域添加 is_cross() 接口
* [#4747](https://github.com/xmake-io/xmake/issues/4747): 添加 `build.always_update_configfiles` 策略

### 改进

* [#4575](https://github.com/xmake-io/xmake/issues/4575): 检测无效的域参数
* 添加更多的 loong64 支持
* 改进 dlang/dmd 对 frameworks 的支持
* [#4571](https://github.com/xmake-io/xmake/issues/4571): 改进 `xmake test` 的输出支持
* [#4609](https://github.com/xmake-io/xmake/issues/4609): 改进探测 vs 构建工具环境
* [#4614](https://github.com/xmake-io/xmake/issues/4614): 改进支持 android ndk 26b
* [#4473](https://github.com/xmake-io/xmake/issues/4473): 默认启用警告输出
* [#4477](https://github.com/xmake-io/xmake/issues/4477): 改进 runtimes 去支持 libc++/libstdc++
* [#4657](https://github.com/xmake-io/xmake/issues/4657): 改进脚本的模式匹配
* [#4673](https://github.com/xmake-io/xmake/pull/4673): 重构模块支持
* [#4746](https://github.com/xmake-io/xmake/pull/4746): 为 cmake generator 添加原生 c++ modules 支持

### Bugs 修复

* [#4596](https://github.com/xmake-io/xmake/issues/4596): 修复远程构建缓存
* [#4689](https://github.com/xmake-io/xmake/issues/4689): 修复目标依赖继承

## v2.8.6

### 新特性

* 添加 `network.mode` 策略
* [#1433](https://github.com/xmake-io/xmake/issues/1433): 添加 `xmake pack` 命令去生成 NSIS/zip/tar.gz/rpm/srpm/runself 安装包
* [#4435](https://github.com/xmake-io/xmake/issues/4435): 为 UnityBuild 的组模式增加 batchsize 支持
* [#4485](https://github.com/xmake-io/xmake/pull/4485): 新增 package.install_locally 策略支持
* 新增 NetBSD 支持

### Changes

* [#4484](https://github.com/xmake-io/xmake/pull/4484): 改进 swig 规则
* 改进 Haiku 支持

### Bugs 修复

* [#4372](https://github.com/xmake-io/xmake/issues/4372): 修复 protobuf 规则
* [#4439](https://github.com/xmake-io/xmake/issues/4439): 修复 asn1c 规则

## v2.8.5

### 新特性

* [#1452](https://github.com/xmake-io/xmake/issues/1452): 支持链接顺序调整，链接组
* [#1438](https://github.com/xmake-io/xmake/issues/1438): 支持代码 amalgamation
* [#3381](https://github.com/xmake-io/xmake/issues/3381): 添加 `xmake test` 支持
* [#4276](https://github.com/xmake-io/xmake/issues/4276): 支持自定义域 API
* [#4286](https://github.com/xmake-io/xmake/pull/4286): 添加 Apple XROS 支持
* [#4345](https://github.com/xmake-io/xmake/issues/4345): 支持检测类型大小 sizeof
* [#4369](https://github.com/xmake-io/xmake/pull/4369): 添加 windows.manifest.uac 策略

### 改进

* [#4284](https://github.com/xmake-io/xmake/issues/4284): 改进内置 includes 模块

### Bugs 修复

* [#4256](https://github.com/xmake-io/xmake/issues/4256): 为 vsxmake 生成器修复 c++ modules intellisense

## v2.8.3

### 新特性

* [#4122](https://github.com/xmake-io/xmake/issues/4122): 支持 Lua 调试 (EmmyLua)
* [#4132](https://github.com/xmake-io/xmake/pull/4132): 支持 cppfront
* [#4147](https://github.com/xmake-io/xmake/issues/4147): 添加 hlsl2spv 规则
* 添加 lib.lua.package 模块
* [#4226](https://github.com/xmake-io/xmake/issues/4226): 新增 asan 相关策略和对包的支持
* 添加 `run.autobuild` 策略开启运行前自动构建
* 添加全局策略 `xmake g --policies=`

### 改进

* [#4119](https://github.com/xmake-io/xmake/issues/4119): 改进支持 emcc 工具链和 emscripten 包的整合
* [#4154](https://github.com/xmake-io/xmake/issues/4154): 添加 `xmake -r --shallow target` 去改进重建目标，避免重建所有依赖目标
* 添加全局 ccache 存储目录
* [#4137](https://github.com/xmake-io/xmake/issues/4137): 改进 Qt，支持 Qt6 for Wasm
* [#4173](https://github.com/xmake-io/xmake/issues/4173): 添加 recheck 参数到 on_config
* [#4200](https://github.com/xmake-io/xmake/pull/4200): 改进远程构建，支持调试本地 xmake 源码
* [#4209](https://github.com/xmake-io/xmake/issues/4209): 添加 extra 和 pedantic 警告

### Bugs 修复

* [#4110](https://github.com/xmake-io/xmake/issues/4110): 修复 extrafiles
* [#4115](https://github.com/xmake-io/xmake/issues/4115): 修复 compile_commands 生成器
* [#4199](https://github.com/xmake-io/xmake/pull/4199): 修复 compile_commands 生成器对 c++ modules 的支持
* 修复 os.mv 在 windows 上跨驱动盘失败问题
* [#4214](https://github.com/xmake-io/xmake/issues/4214): 修复 rust workspace 构建问题

## v2.8.2

### 新特性

* [#4002](https://github.com/xmake-io/xmake/issues/4002): 增加 soname 支持
* [#1613](https://github.com/xmake-io/xmake/issues/1613): 为 add_vectorexts 增加 avx512 和 sse4.2 支持
* [#2471](https://github.com/xmake-io/xmake/issues/2471): 添加 set_encodings API 去设置源文件和目标文件的编码
* [#4071](https://github.com/xmake-io/xmake/pull/4071): 支持 sdcc 的 stm8 汇编器
* [#4101](https://github.com/xmake-io/xmake/issues/4101): 为 c/c++ 添加 force includes
* [#2384](https://github.com/xmake-io/xmake/issues/2384): 为 vs/vsxmake 生成器添加 add_extrafiles 接口

### 改进

* [#3960](https://github.com/xmake-io/xmake/issues/3960): 改进 msys2/crt64 支持
* [#4032](https://github.com/xmake-io/xmake/pull/4032): 移除一些非常老的废弃接口
* 改进 tools.msbuild 升级 vcproj 文件
* 支持 add_requires("xmake::xxx") 包
* [#4049](https://github.com/xmake-io/xmake/issues/4049): 改进 Rust 支持交叉编译
* 改进 clang 下 c++ modules 支持

### Bugs 修复

* 修复 macOS/Linux 上子子进程无法快速退出问题

## v2.8.1

### 新特性

* [#3821](https://github.com/xmake-io/xmake/pull/3821): windows 安装器添加长路径支持选项
* [#3828](https://github.com/xmake-io/xmake/pull/3828): 添加 zypper 包管理器支持
* [#3871](https://github.com/xmake-io/xmake/issues/3871): 改进 tools.msbuild 支持对 vsproj 进行自动升级
* [#3148](https://github.com/xmake-io/xmake/issues/3148): 改进 protobuf 支持 grpc
* [#3889](https://github.com/xmake-io/xmake/issues/3889): add_links 支持库路径添加
* [#3912](https://github.com/orgs/xmake-io/issues/3912): 添加 set_pmxxheader 去支持 objc 预编译头
* add_links 支持库文件路径

### 改进

* [#3752](https://github.com/xmake-io/xmake/issues/3752): 改进 windows 上 os.getenvs 的获取
* [#3371](https://github.com/xmake-io/xmake/issues/3371): 改进 tools.cmake 支持使用 ninja 去构建 wasm 包
* [#3777](https://github.com/xmake-io/xmake/issues/3777): 改进从 pkg-config 中查找包
* [#3815](https://github.com/xmake-io/xmake/pull/3815): 改进 tools.xmake 支持为 windows 平台传递工具链
* [#3857](https://github.com/xmake-io/xmake/issues/3857): 改进生成 compile_commands.json
* [#3892](https://github.com/xmake-io/xmake/issues/3892): 改进包搜索，支持从描述中找包
* [#3916](https://github.com/xmake-io/xmake/issues/3916): 改进构建 swift 程序，支持模块间符号调用
* 更新 lua 运行时到 5.4.6

### Bugs 修复

* [#3755](https://github.com/xmake-io/xmake/pull/3755): 修复 find_tool 从 xmake/packages 中查找程序
* [#3787](https://github.com/xmake-io/xmake/issues/3787): 修复从 conan 2.x 中使用包
* [#3839](https://github.com/orgs/xmake-io/discussions/3839): 修复 conan 2.x 包的 vs_runtime 设置

## v2.7.9

### 新特性

* [#3613](https://github.com/xmake-io/xmake/issues/3613): 添加 `wasm.preloadfiles` 扩展配置
* [#3703](https://github.com/xmake-io/xmake/pull/3703): 支持 conan >=2.0.5

### 改进

* [#3669](https://github.com/xmake-io/xmake/issues/3669): 改进 cmake 生成器支持特定工具的 cxflags
* [#3679](https://github.com/xmake-io/xmake/issues/3679): 改进 `xrepo clean`
* [#3662](https://github.com/xmake-io/xmake/issues/3662): 改进 cmake/make 生成器去更好的支持 lex/yacc 工程
* [#3697](https://github.com/xmake-io/xmake/issues/3662): 改进 trybuild/cmake
* [#3730](https://github.com/xmake-io/xmake/issues/3730): 改进 c++modules 包安装，解决不同目录同名文件分发冲突问题

### Bugs 修复

* [#3596](https://github.com/xmake-io/xmake/issues/3596): 修复 check_cxxfuncs 和 check_cxxsnippets
* [#3603](https://github.com/xmake-io/xmake/issues/3603): 修复 xmake update 的无效 url
* [#3614](https://github.com/xmake-io/xmake/issues/3614): 修复 xmake run 对 Qt 环境的加载
* [#3628](https://github.com/xmake-io/xmake/issues/3628): 修复 msys2/mingw 下 os.exec 总是优先查找错误的可执行程序
* 修复 msys/mingw 下环境变量设置问题

## v2.7.8

### 新特性

* [#3518](https://github.com/xmake-io/xmake/issues/3518): 分析编译和链接性能
* [#3522](https://github.com/xmake-io/xmake/issues/3522): 为 target 添加 has_cflags, has_xxx 等辅助接口
* [#3537](https://github.com/xmake-io/xmake/issues/3537): 为 clang.tidy 检测器添加 `--fix` 自动修复

### 改进

* [#3433](https://github.com/xmake-io/xmake/issues/3433): 改进 QT 在 msys2/mingw64 和 wasm 上的构建支持
* [#3419](https://github.com/xmake-io/xmake/issues/3419): 支持 fish shell 环境
* [#3455](https://github.com/xmake-io/xmake/issues/3455): Dlang 增量编译支持
* [#3498](https://github.com/xmake-io/xmake/issues/3498): 改进绑定包虚拟环境
* [#3504](https://github.com/xmake-io/xmake/pull/3504): 添加 swig java 支持
* [#3508](https://github.com/xmake-io/xmake/issues/3508): 改进 trybuild/cmake 去支持工具链切换
* 为 msvc 禁用 build cache 加速，因为 msvc 的预处理器太慢，反而极大影响构建性能。

### Bugs 修复

* [#3436](https://github.com/xmake-io/xmake/issues/3436): 修复自动补全和 menuconf
* [#3463](https://github.com/xmake-io/xmake/issues/3463): 修复 c++modules 缓存问题
* [#3545](https://github.com/xmake-io/xmake/issues/3545): 修复 armcc 的头文件依赖解析

## v2.7.7

### 新特性

* 添加 Haiku 支持
* [#3326](https://github.com/xmake-io/xmake/issues/3326): 添加 `xmake check` 去检测工程代码 (clang-tidy) 和 API 参数配置
* [#3332](https://github.com/xmake-io/xmake/pull/3332): 在包中配置添加自定义 http headers

### 改进

* [#3318](https://github.com/xmake-io/xmake/pull/3318): 改进 dlang 工具链
* [#2591](https://github.com/xmake-io/xmake/issues/2591): 改进 target 配置来源分析
* 为 dmd/ldc2 改进 strip/optimization
* [#3342](https://github.com/xmake-io/xmake/issues/3342): 改进配置构建目录，支持外置目录构建，保持远吗目录更加干净
* [#3373](https://github.com/xmake-io/xmake/issues/3373): 为 clang-17 改进 std 模块支持

### Bugs 修复

* [#3317](https://github.com/xmake-io/xmake/pull/3317): 针对 Qt 工程，修复 lanuages 设置
* [#3321](https://github.com/xmake-io/xmake/issues/3321): 修复隔天 configfiles 重新生成导致重编问题
* [#3296](https://github.com/xmake-io/xmake/issues/3296): 修复 macOS arm64 上构建失败

## v2.7.6

### 新特性

* [#3228](https://github.com/xmake-io/xmake/pull/3228): C++ modules 的安装发布，以及从包中导入 C++ modules 支持
* [#3257](https://github.com/xmake-io/xmake/issues/3257): 增加对 iverilog 和 verilator 的支持
* 支持 xp 和 vc6.0
* [#3214](https://github.com/xmake-io/xmake/pull/3214): xrepo install 的自动补全支持

### 改进

* [#3255](https://github.com/xmake-io/xmake/pull/3225): 改进 clang libc++ 模块支持
* 支持使用 mingw 编译 xmake
* 改进 xmake 在 win xp 上的兼容性
* 如果外部依赖被启用，切换 json 模块到纯 lua 实现，移除对 lua-cjson 的依赖

### Bugs 修复

* [#3229](https://github.com/xmake-io/xmake/issues/3229): 修复 vs2015 下找不到 rc.exe 问题
* [#3271](https://github.com/xmake-io/xmake/issues/3271): 修复支持带有空格的宏定义
* [#3273](https://github.com/xmake-io/xmake/issues/3273): 修复 nim 链接错误
* [#3286](https://github.com/xmake-io/xmake/issues/3286): 修复 compile_commands 对 clangd 的支持

## v2.7.5

### 新特性

* [#3201](https://github.com/xmake-io/xmake/pull/3201): 为 xrepo 添加命令自动补全
* [#3233](https://github.com/xmake-io/xmake/issues/3233): 添加 MASM32 sdk 工具链

### 改进

* [#3216](https://github.com/xmake-io/xmake/pull/3216): 改进 intel one api toolkits 探测
* [#3020](https://github.com/xmake-io/xmake/issues/3020): 添加 `--lsp=clangd` 去改进 compile_commands.json 的生成
* [#3215](https://github.com/xmake-io/xmake/issues/3215): 添加 includedirs 和 defines 到 c51 编译器
* [#3251](https://github.com/xmake-io/xmake/issues/3251): 改进 zig and c 混合编译

### Bugs 修复

* [#3203](https://github.com/xmake-io/xmake/issues/3203): 修复 compile_commands
* [#3222](https://github.com/xmake-io/xmake/issues/3222): 修复 objc 的预编译头支持
* [#3240](https://github.com/xmake-io/xmake/pull/3240): 修复 `xmake run` 处理单个参数不正确问题
* [#3238](https://github.com/xmake-io/xmake/pull/3238): 修复 clang 构建 module 时候，并行写入 mapper 冲突问题

## v2.7.4

### 新特性

* [#3049](https://github.com/xmake-io/xmake/pull/3049): 添加 `xmake format` 插件
* 添加 `plugin.compile_commands.autoupdate` 规则
* [#3172](https://github.com/xmake-io/xmake/pull/3172): 添加 xmake.sh
* [#3168](https://github.com/xmake-io/xmake/pull/3168): 为 msvc 添加 C++23 标准模块支持

### 改进

* [#3056](https://github.com/xmake-io/xmake/issues/3056): 改进 Zig 支持
* [#3060](https://github.com/xmake-io/xmake/issues/3060): 改进支持 msys2 的环境探测
* [#3071](https://github.com/xmake-io/xmake/issues/3071): 为 llvm/clang 工具链支持 rc 编译
* [#3122](https://github.com/xmake-io/xmake/pull/3122): 改进 c++20 模块依赖图的源码分析，支持预处理
* [#3125](https://github.com/xmake-io/xmake/pull/3125): 增加私有 C++20 模块的编译支持
* [#3133](https://github.com/xmake-io/xmake/pull/3133): 增加 internal partitions 模块支持
* [#3146](https://github.com/xmake-io/xmake/issues/3146): 添加默认包组件支持
* [#3192](https://github.com/xmake-io/xmake/issues/3192): 为 auto complete 增加 json 输出支持

### Bugs 修复

* 修复 requires-lock 问题
* [#3065](https://github.com/xmake-io/xmake/issues/3065): 修复部分依赖包没有被安装的问题
* [#3082](https://github.com/xmake-io/xmake/issues/3082): 修复 build.ninja 生成器
* [#3092](https://github.com/xmake-io/xmake/issues/3092): 修复 xrepo add-repo 添加失败逻辑
* [#3013](https://github.com/xmake-io/xmake/issues/3013): 修复支持 windows UNC 路径
* [#2902](https://github.com/xmake-io/xmake/issues/2902): 修复文件被其他子进程占用问题
* [#3074](https://github.com/xmake-io/xmake/issues/3074): 修复 CMakelists 生成器链接参数设置不对问题
* [#3141](https://github.com/xmake-io/xmake/pull/3141): 修复 C++ 模块的导入顺序
* 修复 tools/xmake 包安装构建目录
* [#3159](https://github.com/xmake-io/xmake/issues/3159): 为 CLion 修复 compile_commands

## v2.7.3

### 新特性

* 一种新的可选域配置语法，对 LSP 友好，并且支持域隔离。
* [#2944](https://github.com/xmake-io/xmake/issues/2944): 为嵌入式工程添加 `gnu-rm.binary` 和 `gnu-rm.static` 规则和测试工程
* [#2636](https://github.com/xmake-io/xmake/issues/2636): 支持包组件
* 支持 msvc 的 armasm/armasm64
* [#3023](https://github.com/xmake-io/xmake/pull/3023): 改进 xmake run -d，添加 renderdoc 调试器支持
* [#3022](https://github.com/xmake-io/xmake/issues/3022): 为特定编译器添加 flags
* [#3025](https://github.com/xmake-io/xmake/pull/3025): 新增 C++ 异常接口配置
* [#3017](https://github.com/xmake-io/xmake/pull/3017): 支持 ispc 编译器规则

### 改进

* [#2925](https://github.com/xmake-io/xmake/issues/2925): 改进 doxygen 插件
* [#2948](https://github.com/xmake-io/xmake/issues/2948): 支持 OpenBSD
* 添加 `xmake g --insecure-ssl=y` 配置选项去禁用 ssl 证书检测
* [#2971](https://github.com/xmake-io/xmake/pull/2971): 使 vs/vsxmake 工程生成的结果每次保持一致
* [#3000](https://github.com/xmake-io/xmake/issues/3000): 改进 C++ 模块构建支持，实现增量编译支持
* [#3016](https://github.com/xmake-io/xmake/pull/3016): 改进 clang/msvc 去更好地支持 std 模块

### Bugs 修复

* [#2949](https://github.com/xmake-io/xmake/issues/2949): 修复 vs 分组
* [#2952](https://github.com/xmake-io/xmake/issues/2952): 修复 armlink 处理长命令失败问题
* [#2954](https://github.com/xmake-io/xmake/issues/2954): 修复 c++ module partitions 路径无效问题
* [#3033](https://github.com/xmake-io/xmake/issues/3033): 探测循环模块依赖

## v2.7.2

### 新特性

* [#2140](https://github.com/xmake-io/xmake/issues/2140): 支持 Windows Arm64
* [#2719](https://github.com/xmake-io/xmake/issues/2719): 添加 `package.librarydeps.strict_compatibility` 策略严格限制包依赖兼容性
* [#2810](https://github.com/xmake-io/xmake/pull/2810): 支持 os.execv 去执行 shell 脚本文件
* [#2817](https://github.com/xmake-io/xmake/pull/2817): 改进规则支持依赖顺序执行
* [#2824](https://github.com/xmake-io/xmake/pull/2824): 传递 cross-file 交叉编译环境给 meson.install 和 trybuild
* [#2856](https://github.com/xmake-io/xmake/pull/2856): xrepo 支持从当前指定源码目录调试程序
* [#2859](https://github.com/xmake-io/xmake/issues/2859): 改进对三方库的 trybuild 构建，利用 xmake-repo 仓库脚本更加智能化地构建三方库
* [#2879](https://github.com/xmake-io/xmake/issues/2879): 更好的动态创建和配置 target 和 rule
* [#2374](https://github.com/xmake-io/xmake/issues/2374): 允许 xmake 包中引入自定义规则
* 添加 clang-cl 工具链

### 改进

* [#2745](https://github.com/xmake-io/xmake/pull/2745): 改进 os.cp 支持符号链接复制
* [#2773](https://github.com/xmake-io/xmake/pull/2773): 改进 vcpkg 包安装，支持 freebsd 平台
* [#2778](https://github.com/xmake-io/xmake/pull/2778): 改进 xrepo.env 支持 target 的运行环境加载
* [#2783](https://github.com/xmake-io/xmake/issues/2783): 添加摘要算法选项到 WDK 的 signtool 签名工具
* [#2787](https://github.com/xmake-io/xmake/pull/2787): 改进 json 支持空数组
* [#2782](https://github.com/xmake-io/xmake/pull/2782): 改进查找 matlib sdk 和运行时
* [#2793](https://github.com/xmake-io/xmake/issues/2793): 改进 mconfdialog 配置操作体验
* [#2804](https://github.com/xmake-io/xmake/issues/2804): 安装依赖包支持 macOS arm64/x86_64 交叉编译
* [#2809](https://github.com/xmake-io/xmake/issues/2809): 改进 msvc 的编译优化选项
* 改进 trybuild 模式，为 meson/autoconf/cmake 提供更好的交叉编译支持
* [#2846](https://github.com/xmake-io/xmake/discussions/2846): 改进对 configfiles 的生成
* [#2866](https://github.com/xmake-io/xmake/issues/2866): 更好地控制 rule 规则执行顺序

### Bugs 修复

* [#2740](https://github.com/xmake-io/xmake/issues/2740): 修复 msvc 构建 C++ modules 卡死问题
* [#2875](https://github.com/xmake-io/xmake/issues/2875): 修复构建 linux 驱动错误
* [#2885](https://github.com/xmake-io/xmake/issues/2885): 修复 ccache 下，msvc 编译 pch 失败问题

## v2.7.1

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

## v2.6.9

### 新特性

* [#2474](https://github.com/xmake-io/xmake/issues/2474): 添加 icx 和 dpcpp 工具链
* [#2523](https://github.com/xmake-io/xmake/issues/2523): 改进对 LTO 的支持
* [#2527](https://github.com/xmake-io/xmake/issues/2527): 添加 set_runargs 接口

### 改进

* 改进 tools.cmake 支持 wasm 库构建
* [#2491](https://github.com/xmake-io/xmake/issues/2491): 如果服务器不可访问，自动回退到本地编译和缓存
* [#2514](https://github.com/xmake-io/xmake/issues/2514): 为工程生成器禁用 Unity Build
* [#2473](https://github.com/xmake-io/xmake/issues/2473): 改进 apt::find_package，支持从 pc 文件中查找
* [#2512](https://github.com/xmake-io/xmake/issues/2512): 改进远程服务支持超时配置

### Bugs 修复

* [#2488](https://github.com/xmake-io/xmake/issues/2488): 修复从 windows 到 linux 的远程编译路径问题
* [#2504](https://github.com/xmake-io/xmake/issues/2504): 修复在 msys2 上远程编译失败问题
* [#2525](https://github.com/xmake-io/xmake/issues/2525): 修复安装依赖包时候卡死问题
* [#2557](https://github.com/xmake-io/xmake/issues/2557): 修复 cmake.find_package 查找 links 错误
* 修复缓存导致的预处理文件路径冲突问题

## v2.6.8

### 新特性

* [#2447](https://github.com/xmake-io/xmake/pull/2447): 添加 qt.qmlplugin 规则和 qmltypesregistrar 支持
* [#2446](https://github.com/xmake-io/xmake/issues/2446): 支持 target 分组安装
* [#2469](https://github.com/xmake-io/xmake/issues/2469): 产生 vcpkg-configuration.json

### 改进

* 添加 `preprocessor.linemarkers` 策略去禁用 linemarkers 去加速 ccache/distcc
* [#2389](https://github.com/xmake-io/xmake/issues/2389): 改进 `xmake run` 支持并行运行目标程序
* [#2417](https://github.com/xmake-io/xmake/issues/2417): 切换 option/showmenu 的默认值，默认开启
* [#2440](https://github.com/xmake-io/xmake/pull/2440): 改进安装包的失败错误信息
* [#2438](https://github.com/xmake-io/xmake/pull/2438): 确保生成的 vsxmake 工程不会随机变动
* [#2434](https://github.com/xmake-io/xmake/issues/2434): 改进插件管理器，允许多插件管理
* [#2421](https://github.com/xmake-io/xmake/issues/2421): 改进配置选项菜单
* [#2425](https://github.com/xmake-io/xmake/issues/2425): 添加 `preprocessor.gcc.directives_only` 策略
* [#2455](https://github.com/xmake-io/xmake/issues/2455): 改进 emcc 的优化选项
* [#2467](https://github.com/xmake-io/xmake/issues/2467): 支持回退到原始文件编译，兼容 msvc 预处理器的一些问题
* [#2452](https://github.com/xmake-io/xmake/issues/2452): 添加 build.warning 策略

### Bugs 修复

* [#2435](https://github.com/xmake-io/xmake/pull/2435): 修复无法搜索带有 `.` 的包名
* [#2445](https://github.com/xmake-io/xmake/issues/2445): 修复 windows 上 ccache 构建失败问题
* [#2452](https://github.com/xmake-io/xmake/issues/2452): 修复 ccache 下，警告无法输出的问题

## v2.6.7

### 新特性

* [#2318](https://github.com/xmake-io/xmake/issues/2318): 添加 `xmake f --policies=` 配置参数去修改默认策略

### 改进

* 如果预编译包构建失败，自动回退到源码包构建
* [#2387](https://github.com/xmake-io/xmake/issues/2387): 改进 pkgconfig 和 find_package
* 添加 `build.ccache` 策略，用于在工程中配置编译缓存

### Bugs 修复

* [#2382](https://github.com/xmake-io/xmake/issues/2382): 修改 headeronly 包配置
* [#2388](https://github.com/xmake-io/xmake/issues/2388): 修复路径问题
* [#2385](https://github.com/xmake-io/xmake/issues/2385): 修复 cmake/find_package
* [#2395](https://github.com/xmake-io/xmake/issues/2395): 修复 c++ modules
* 修复 find_qt 问题

## v2.6.6

### 新特性

* [#2327](https://github.com/xmake-io/xmake/issues/2327): 支持 nvidia-hpc-sdk 工具链中的 nvc/nvc++/nvfortran 编译器
* 添加 path 实例接口
* [#2344](https://github.com/xmake-io/xmake/pull/2344): 添加 lz4 压缩模块
* [#2349](https://github.com/xmake-io/xmake/pull/2349): 添加 keil/c51 工程支持
* [#274](https://github.com/xmake-io/xmake/issues/274): 跨平台分布式编译支持
* 使用内置的本地缓存替代 ccache

### 改进

* [#2309](https://github.com/xmake-io/xmake/issues/2309): 远程编译支持用户授权验证
* 改进远程编译，增加对 lz4 压缩支持

### Bugs 修复

* 修复选择包版本时候 lua 栈不平衡导致的崩溃问题

## v2.6.5

### 新特性

* [#2138](https://github.com/xmake-io/xmake/issues/2138): 支持模板包
* [#2185](https://github.com/xmake-io/xmake/issues/2185): 添加 `--appledev=simulator` 去改进 Apple 模拟器目标编译支持
* [#2227](https://github.com/xmake-io/xmake/issues/2227): 改进 cargo 包，支持指定 Cargo.toml 文件
* 改进 `add_requires` 支持 git command 作为版本
* [#622](https://github.com/xmake-io/xmake/issues/622): 支持远程编译
* [#2282](https://github.com/xmake-io/xmake/issues/2282): 添加 `add_filegroups` 接口为 vs/vsxmake/cmake generator 增加文件组支持

### 改进

* [#2137](https://github.com/xmake-io/xmake/pull/2137): 改进 path 模块
* macOS 下，减少 50% 的 Xmake 二进制文件大小
* 改进 tools/autoconf,cmake 去更好地支持工具链切换
* [#2221](https://github.com/xmake-io/xmake/pull/2221): 改进注册表 api 去支持 unicode
* [#2225](https://github.com/xmake-io/xmake/issues/2225): 增加对 protobuf 的依赖分析和构建支持
* [#2265](https://github.com/xmake-io/xmake/issues/2265): 排序 CMakeLists.txt
* 改进 os.files 的文件遍历速度

### Bugs 修复

* [#2233](https://github.com/xmake-io/xmake/issues/2233): 修复 c++ modules 依赖

## v2.6.4

### 新特性

* [#2011](https://github.com/xmake-io/xmake/issues/2011): 支持继承和局部修改官方包，例如对现有的包更换 urls 和 versions
* 支持在 sparc, alpha, powerpc, s390x 和 sh4 上编译运行 xmake
* 为 package() 添加 on_download 自定义下载
* [#2021](https://github.com/xmake-io/xmake/issues/2021): 支持 Linux/Windows 下构建 Swift 程序
* [#2024](https://github.com/xmake-io/xmake/issues/2024): 添加 asn1c 支持
* [#2031](https://github.com/xmake-io/xmake/issues/2031): 为 add_files 增加 linker scripts 和 version scripts 支持
* [#2033](https://github.com/xmake-io/xmake/issues/2033): 捕获 ctrl-c 去打印当前运行栈，用于调试分析卡死问题
* [#2059](https://github.com/xmake-io/xmake/pull/2059): 添加 `xmake update --integrate` 命令去整合 shell
* [#2070](https://github.com/xmake-io/xmake/issues/2070): 添加一些内置的 xrepo env 环境配置
* [#2117](https://github.com/xmake-io/xmake/pull/2117): 支持为任意平台传递工具链到包
* [#2121](https://github.com/xmake-io/xmake/issues/2121): 支持导出指定的符号列表，可用于减少动态库的大小

### 改进

* [#2036](https://github.com/xmake-io/xmake/issues/2036): 改进 xrepo 支持从配置文件批量安装包，例如：`xrepo install xxx.lua`
* [#2039](https://github.com/xmake-io/xmake/issues/2039): 改进 vs generator 的 filter 目录展示
* [#2025](https://github.com/xmake-io/xmake/issues/2025): 支持为 phony 和 headeronly 目标生成 vs 工程
* 优化 vs 和 codesign 的探测速度
* [#2077](https://github.com/xmake-io/xmake/issues/2077): 改进 vs 工程生成器去支持 cuda

### Bugs 修复

* [#2005](https://github.com/xmake-io/xmake/issues/2005): 修复 path.extension
* [#2008](https://github.com/xmake-io/xmake/issues/2008): 修复 windows manifest 文件编译
* [#2016](https://github.com/xmake-io/xmake/issues/2016): 修复 vs project generator 里，对象文件名冲突导致的编译失败

## v2.6.3

### 新特性

* [#1298](https://github.com/xmake-io/xmake/issues/1928): 支持 vcpkg 清单模式安装包，实现安装包的版本选择
* [#1896](https://github.com/xmake-io/xmake/issues/1896): 添加 `python.library` 规则去构建 pybind 模块，并且支持 soabi
* [#1939](https://github.com/xmake-io/xmake/issues/1939): 添加 `remove_files`, `remove_headerfiles` 并且标记 `del_files` 作为废弃接口
* 将 on_config 作为正式的公开接口，用于 target 和 rule
* 添加 riscv32/64 支持
* [#1970](https://github.com/xmake-io/xmake/issues/1970): 添加 CMake wrapper 支持在 CMakelists 中去调用 xrepo 集成 C/C++ 包
* 添加内置的 github 镜像加速 pac 代理文件, `xmake g --proxy_pac=github_mirror.lua`

### 改进

* [#1923](https://github.com/xmake-io/xmake/issues/1923): 改进构建 linux 驱动，支持设置自定义 linux-headers 路径
* [#1962](https://github.com/xmake-io/xmake/issues/1962): 改进 armclang 工具链去支持构建 asm
* [#1959](https://github.com/xmake-io/xmake/pull/1959): 改进 vstudio 工程生成器
* [#1969](https://github.com/xmake-io/xmake/issues/1969): 添加默认的 option 描述

### Bugs 修复

* [#1875](https://github.com/xmake-io/xmake/issues/1875): 修复部署生成 Android Qt 程序包失败问题
* [#1973](https://github.com/xmake-io/xmake/issues/1973): 修复合并静态库
* [#1982](https://github.com/xmake-io/xmake/pull/1982): 修复 clang 下对 c++20 子模块的依赖构建

## v2.6.2

### 新特性

* [#1902](https://github.com/xmake-io/xmake/issues/1902): 支持构建 linux 内核驱动模块
* [#1913](https://github.com/xmake-io/xmake/issues/1913): 通过 group 模式匹配，指定构建和运行一批目标程序

### 改进

* [#1872](https://github.com/xmake-io/xmake/issues/1872): 支持转义 set_configvar 中字符串值
* [#1888](https://github.com/xmake-io/xmake/issues/1888): 改进 windows 安装器，避免错误删除其他安装目录下的文件
* [#1895](https://github.com/xmake-io/xmake/issues/1895): 改进 `plugin.vsxmake.autoupdate` 规则
* [#1893](https://github.com/xmake-io/xmake/issues/1893): 改进探测 icc 和 ifort 工具链
* [#1905](https://github.com/xmake-io/xmake/pull/1905): 改进 msvc 对 external 头文件搜索探测支持
* [#1904](https://github.com/xmake-io/xmake/pull/1904): 改进 vs201x 工程生成器
* 添加 `XMAKE_THEME` 环境变量去切换主题配置
* [#1907](https://github.com/xmake-io/xmake/issues/1907): 添加 `-f/--force` 参数使得 `xmake create` 可以在费控目录被强制创建
* [#1917](https://github.com/xmake-io/xmake/pull/1917): 改进 find_package 和配置

### Bugs 修复

* [#1885](https://github.com/xmake-io/xmake/issues/1885): 修复 package:fetch_linkdeps 链接顺序问题
* [#1903](https://github.com/xmake-io/xmake/issues/1903): 修复包链接顺序

## v2.6.1

### 新特性

* [#1799](https://github.com/xmake-io/xmake/issues/1799): 支持混合 Rust 和 C++ 程序，以及集成 Cargo 依赖库
* 添加 `utils.glsl2spv` 规则去编译 *.vert/*.frag shader 文件生成 spirv 文件和二进制 C 头文件

### 改进

* 默认切换到 Lua5.4 运行时
* [#1776](https://github.com/xmake-io/xmake/issues/1776): 改进 system::find_package，支持从环境变量中查找系统库
* [#1786](https://github.com/xmake-io/xmake/issues/1786): 改进 apt:find_package，支持查找 alias 包
* [#1819](https://github.com/xmake-io/xmake/issues/1819): 添加预编译头到 cmake 生成器
* 改进 C++20 Modules 为 msvc 支持 std 标准库
* [#1792](https://github.com/xmake-io/xmake/issues/1792): 添加自定义命令到 vs 工程生成器
* [#1835](https://github.com/xmake-io/xmake/issues/1835): 改进 MDK 程序构建支持，增加 `set_runtimes("microlib")`
* [#1858](https://github.com/xmake-io/xmake/issues/1858): 改进构建 c++20 modules，修复跨 target 构建问题
* 添加 $XMAKE_BINARY_REPO 和 $XMAKE_MAIN_REPO 仓库设置环境变量
* [#1865](https://github.com/xmake-io/xmake/issues/1865): 改进 openmp 工程
* [#1845](https://github.com/xmake-io/xmake/issues/1845): 为静态库安装 pdb 文件

### Bugs 修复

* 修复语义版本中解析带有 0 前缀的 build 字符串问题
* [#50](https://github.com/libbpf/libbpf-bootstrap/issues/50): 修复 rule 和构建 bpf 程序 bug
* [#1610](https://github.com/xmake-io/xmake/issues/1610): 修复 `xmake f --menu` 在 vscode 终端下按键无响应，并且支持 ConPTY 终端虚拟按键

## v2.5.9

### 新特性

* [#1736](https://github.com/xmake-io/xmake/issues/1736): 支持 wasi-sdk 工具链
* 支持 Lua 5.4 运行时
* 添加 gcc-8, gcc-9, gcc-10, gcc-11 工具链
* [#1623](https://github.com/xmake-io/xmake/issues/1632): 支持 find_package 从 cmake 查找包
* [#1747](https://github.com/xmake-io/xmake/issues/1747): 添加 `set_kind("headeronly")` 更好的处理 headeronly 库的安装
* [#1019](https://github.com/xmake-io/xmake/issues/1019): 支持 Unity build
* [#1438](https://github.com/xmake-io/xmake/issues/1438): 增加 `xmake l cli.amalgamate` 命令支持代码合并
* [#1765](https://github.com/xmake-io/xmake/issues/1756): 支持 nim 语言
* [#1762](https://github.com/xmake-io/xmake/issues/1762): 为 `xrepo env` 管理和切换指定的环境配置
* [#1767](https://github.com/xmake-io/xmake/issues/1767): 支持 Circle 编译器
* [#1753](https://github.com/xmake-io/xmake/issues/1753): 支持 Keil/MDK 的 armcc/armclang 工具链
* [#1774](https://github.com/xmake-io/xmake/issues/1774): 添加 table.contains api
* [#1735](https://github.com/xmake-io/xmake/issues/1735): 添加自定义命令到 cmake 生成器
* [#1781](https://github.com/xmake-io/xmake/issues/1781): 改进 get.sh 安装脚本支持 nixos

### 改进

* [#1528](https://github.com/xmake-io/xmake/issues/1528): 检测 c++17/20 特性
* [#1729](https://github.com/xmake-io/xmake/issues/1729): 改进 C++20 modules 对 clang/gcc/msvc 的支持，支持模块间依赖编译和并行优化
* [#1779](https://github.com/xmake-io/xmake/issues/1779): 改进 ml.exe/x86，移除内置的 `-Gd` 选项

## v2.5.8

### 新特性

* [#388](https://github.com/xmake-io/xmake/issues/388): Pascal 语言支持，可以使用 fpc 来编译 free pascal
* [#1682](https://github.com/xmake-io/xmake/issues/1682): 添加可选的额lua5.3 运行时替代 luajit，提供更好的平台兼容性。
* [#1622](https://github.com/xmake-io/xmake/issues/1622): 支持 Swig
* [#1714](https://github.com/xmake-io/xmake/issues/1714): 支持内置 cmake 等第三方项目的混合编译
* [#1715](https://github.com/xmake-io/xmake/issues/1715): 支持探测编译器语言标准特性，并且新增 `check_macros` 检测接口
* xmake 支持在 Loongarch 架构上运行

### 改进

* [#1618](https://github.com/xmake-io/xmake/issues/1618): 改进 vala 支持构建动态库和静态库程序
* 改进 Qt 规则去支持 Qt 4.x
* 改进 `set_symbols("debug")` 支持 clang/windows 生成 pdb 文件
* [#1638](https://github.com/xmake-io/xmake/issues/1638): 改进合并静态库
* 改进 on_load/after_load 去支持动态的添加 target deps
* [#1675](https://github.com/xmake-io/xmake/pull/1675): 针对 mingw 平台，重命名动态库和导入库文件名后缀
* [#1694](https://github.com/xmake-io/xmake/issues/1694): 支持在 set_configvar 中定义一个不带引号的字符串变量
* 改进对 Android NDK r23 的支持
* 为 `set_languages` 新增 `c++latest` 和 `clatest` 配置值
* [#1720](https://github.com/xmake-io/xmake/issues/1720): 添加 `save_scope` 和 `restore_scope` 去修复 `check_xxx` 相关接口
* [#1726](https://github.com/xmake-io/xmake/issues/1726): 改进 compile_commands 生成器去支持 nvcc

### Bugs 修复

* [#1671](https://github.com/xmake-io/xmake/issues/1671): 修复安装预编译包后，*.cmake 里面的一些不正确的绝对路径
* [#1689](https://github.com/xmake-io/xmake/issues/1689): 修复 vsxmake 插件的 unicode 字符显示和加载问题

## v2.5.7

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

## v2.5.6

### 新特性

* [#1483](https://github.com/xmake-io/xmake/issues/1483): 添加 `os.joinenvs()` 和改进包工具环境
* [#1523](https://github.com/xmake-io/xmake/issues/1523): 添加 `set_allowedmodes`, `set_allowedplats` 和 `set_allowedarchs`
* [#1523](https://github.com/xmake-io/xmake/issues/1523): 添加 `set_defaultmode`, `set_defaultplat` 和 `set_defaultarchs`

### 改进

* 改进 vs/vsxmake 工程插件支持 vs2022
* [#1513](https://github.com/xmake-io/xmake/issues/1513): 改进 windows 预编译包的兼容性问题
* 改进 vcpkg 包在 windows 上的查找
* 改进对 Qt6 的支持

### Bugs 修复

* [#489](https://github.com/xmake-io/xmake-repo/pull/489): 修复 run os.execv 带有过长环境变量值出现的一些问题

## v2.5.5

### 新特性

* [#1421](https://github.com/xmake-io/xmake/issues/1421): 针对 target 目标，增加目标文件名的前缀，后缀和扩展名设置接口。
* [#1422](https://github.com/xmake-io/xmake/issues/1422): 支持从 vcpkg, conan 中搜索包
* [#1424](https://github.com/xmake-io/xmake/issues/1424): 设置 binary 作为默认的 target 目标类型
* [#1140](https://github.com/xmake-io/xmake/issues/1140): 支持安装时候，手动选择从第三包包管理器安装包
* [#1339](https://github.com/xmake-io/xmake/issues/1339): 改进 `xmake package` 去产生新的本地包格式，无缝集成 `add_requires`，并且新增生成远程包支持
* 添加 `appletvos` 编译平台支持, `xmake f -p appletvos`
* [#1437](https://github.com/xmake-io/xmake/issues/1437): 为包添加 headeronly 库类型去忽略 `vs_runtime`
* [#1351](https://github.com/xmake-io/xmake/issues/1351): 支持导入导出当前配置
* [#1454](https://github.com/xmake-io/xmake/issues/1454): 支持下载安装 windows 预编译包

### 改进

* [#1425](https://github.com/xmake-io/xmake/issues/1425): 改进 tools/meson 去加载 msvc 环境，并且增加一些内置配置。
* [#1442](https://github.com/xmake-io/xmake/issues/1442): 支持从 git url 去下载包资源文件
* [#1389](https://github.com/xmake-io/xmake/issues/1389): 支持添加工具链环境到 `xrepo env`
* [#1453](https://github.com/xmake-io/xmake/issues/1453): 支持 protobuf 规则导出头文件搜索目录
* 新增对 vs2022 的支持

### Bugs 修复

* [#1413](https://github.com/xmake-io/xmake/issues/1413): 修复查找包过程中出现的挂起卡死问题
* [#1420](https://github.com/xmake-io/xmake/issues/1420): 修复包检测和配置缓存
* [#1445](https://github.com/xmake-io/xmake/issues/1445): 修复 WDK 驱动签名错误
* [#1465](https://github.com/xmake-io/xmake/issues/1465): 修复缺失的链接目录

## v2.5.4

### 新特性

* [#1323](https://github.com/xmake-io/xmake/issues/1323): 支持从 apt 查找安装包，`add_requires("apt::zlib1g-dev")`
* [#1337](https://github.com/xmake-io/xmake/issues/1337): 添加环境变量去改进包安装和缓存目录
* [#1338](https://github.com/xmake-io/xmake/issues/1338): 支持导入导出已安装的包
* [#1087](https://github.com/xmake-io/xmake/issues/1087): 添加 `xrepo env shell` 并且支持从 `add_requires/xmake.lua` 加载包环境
* [#1313](https://github.com/xmake-io/xmake/issues/1313): 为 `add_requires/add_deps` 添加私有包支持
* [#1358](https://github.com/xmake-io/xmake/issues/1358): 支持设置镜像 url 站点加速包下载
* [#1369](https://github.com/xmake-io/xmake/pull/1369): 为 vcpkg 增加 arm/arm64 包集成支持，感谢 @fallending
* [#1405](https://github.com/xmake-io/xmake/pull/1405): 添加 portage 包管理器支持，感谢 @Phate6660

### 改进

* 改进 `find_package` 并且添加 `package:find_package` 接口在包定义中方便查找包
* 移除废弃的 `set_config_h` 和 `set_config_h_prefix` 接口
* [#1343](https://github.com/xmake-io/xmake/issues/1343): 改进搜索本地包文件
* [#1347](https://github.com/xmake-io/xmake/issues/1347): 针对 binary 包改进 vs_runtime 配置
* [#1353](https://github.com/xmake-io/xmake/issues/1353): 改进 del_files() 去加速匹配文件
* [#1349](https://github.com/xmake-io/xmake/issues/1349): 改进 xrepo env shell 支持，更好的支持 powershell

### Bugs 修复

* [#1380](https://github.com/xmake-io/xmake/issues/1380): 修复 `add_packages()` 失败问题
* [#1381](https://github.com/xmake-io/xmake/issues/1381): 修复添加本地 git 包源问题
* [#1391](https://github.com/xmake-io/xmake/issues/1391): 修复 cuda/nvcc 工具链

## v2.5.3

### 新特性

* [#1259](https://github.com/xmake-io/xmake/issues/1259): 支持 `add_files("*.def")` 添加 def 文件去导出 windows/dll 符号
* [#1267](https://github.com/xmake-io/xmake/issues/1267): 添加 `find_package("nvtx")`
* [#1274](https://github.com/xmake-io/xmake/issues/1274): 添加 `platform.linux.bpf` 规则去构建 linux/bpf 程序
* [#1280](https://github.com/xmake-io/xmake/issues/1280): 支持 fetchonly 包去扩展改进 find_package
* 支持自动拉取远程 ndk 工具链包和集成
* [#1268](https://github.com/xmake-io/xmake/issues/1268): 添加 `utils.install.pkgconfig_importfiles` 规则去安装 `*.pc` 文件
* [#1268](https://github.com/xmake-io/xmake/issues/1268): 添加 `utils.install.cmake_importfiles` 规则去安装 `*.cmake` 导入文件
* [#348](https://github.com/xmake-io/xmake-repo/pull/348): 添加 `platform.longpaths` 策略去支持 git longpaths
* [#1314](https://github.com/xmake-io/xmake/issues/1314): 支持安装使用 conda 包
* [#1120](https://github.com/xmake-io/xmake/issues/1120): 添加 `core.base.cpu` 模块并且改进 `os.cpuinfo()`
* [#1325](https://github.com/xmake-io/xmake/issues/1325): 为 `add_configfiles` 添加内建的 git 变量

## 改进

* [#1275](https://github.com/xmake-io/xmake/issues/1275): 改进 vsxmake 生成器，支持条件化编译 targets
* [#1290](https://github.com/xmake-io/xmake/pull/1290): 增加对 Android ndk r22 以上版本支持
* [#1311](https://github.com/xmake-io/xmake/issues/1311): 为 vsxmake 工程添加包 dll 路径，确保调试运行加载正常

## Bugs 修复

* [#1266](https://github.com/xmake-io/xmake/issues/1266): 修复在 `add_repositories` 中的 repo 相对路径
* [#1288](https://github.com/xmake-io/xmake/issues/1288): 修复 vsxmake 插件处理 option 配置问题

## v2.5.2

### 新特性

* [#955](https://github.com/xmake-io/xmake/issues/955#issuecomment-766481512): 支持 `zig cc` 和 `zig c++` 作为 c/c++ 编译器
* [#955](https://github.com/xmake-io/xmake/issues/955#issuecomment-768193083): 支持使用 zig 进行交叉编译
* [#1177](https://github.com/xmake-io/xmake/issues/1177): 改进终端和 color codes 探测
* [#1216](https://github.com/xmake-io/xmake/issues/1216): 传递自定义 includes 脚本给 xrepo
* 添加 linuxos 内置模块获取 linux 系统信息
* [#1217](https://github.com/xmake-io/xmake/issues/1217): 支持当编译项目时自动拉取工具链
* [#1123](https://github.com/xmake-io/xmake/issues/1123): 添加 `rule("utils.symbols.export_all")` 自动导出所有 windows/dll 中的符号
* [#1181](https://github.com/xmake-io/xmake/issues/1181): 添加 `utils.platform.gnu2mslib(mslib, gnulib)` 模块接口去转换 mingw/xxx.dll.a 到 msvc xxx.lib
* [#1246](https://github.com/xmake-io/xmake/issues/1246): 改进规则支持新的批处理命令去简化自定义规则实现
* [#1239](https://github.com/xmake-io/xmake/issues/1239): 添加 `add_extsources` 去改进外部包的查找
* [#1241](https://github.com/xmake-io/xmake/issues/1241): 支持为 windows 程序添加 .manifest 文件参与链接
* 支持使用 `xrepo remove --all` 命令去移除所有的包，并且支持模式匹配
* [#1254](https://github.com/xmake-io/xmake/issues/1254): 支持导出包配置给父 target，实现包配置的依赖继承

### 改进

* [#1226](https://github.com/xmake-io/xmake/issues/1226): 添加缺失的 Qt 头文件搜索路径
* [#1183](https://github.com/xmake-io/xmake/issues/1183): 改进 C++ 语言标准，以便支持 Qt6
* [#1237](https://github.com/xmake-io/xmake/issues/1237): 为 vsxmake 插件添加 qt.ui 文件
* 改进 vs/vsxmake 插件去支持预编译头文件和智能提示
* [#1090](https://github.com/xmake-io/xmake/issues/1090): 简化自定义规则
* [#1065](https://github.com/xmake-io/xmake/issues/1065): 改进 protobuf 规则，支持 compile_commands 生成器
* [#1249](https://github.com/xmake-io/xmake/issues/1249): 改进 vs/vsxmake 生成器去支持启动工程设置
* [#605](https://github.com/xmake-io/xmake/issues/605): 改进 add_deps 和 add_packages 直接的导出 links 顺序
* 移除废弃的 `add_defines_h_if_ok` and `add_defines_h` 接口

### Bugs 修复

* [#1219](https://github.com/xmake-io/xmake/issues/1219): 修复版本检测和更新
* [#1235](https://github.com/xmake-io/xmake/issues/1235): 修复 includes 搜索路径中带有空格编译不过问题

## v2.5.1

### 新特性

* [#1035](https://github.com/xmake-io/xmake/issues/1035): 图形配置菜单完整支持鼠标事件，并且新增滚动栏
* [#1098](https://github.com/xmake-io/xmake/issues/1098): 支持传递 stdin 到 os.execv 进行输入重定向
* [#1079](https://github.com/xmake-io/xmake/issues/1079): 为 vsxmake 插件添加工程自动更新插件，`add_rules("plugin.vsxmake.autoupdate")`
* 添加 `xmake f --vs_runtime='MT'` 和 `set_runtimes("MT")` 去更方便的对 target 和 package 进行设置
* [#1032](https://github.com/xmake-io/xmake/issues/1032): 支持枚举注册表 keys 和 values
* [#1026](https://github.com/xmake-io/xmake/issues/1026): 支持对 vs/vsmake 工程增加分组设置
* [#1178](https://github.com/xmake-io/xmake/issues/1178): 添加 `add_requireconfs()` 接口去重写依赖包的配置
* [#1043](https://github.com/xmake-io/xmake/issues/1043): 为 luarocks 模块添加 `luarocks.module` 构建规则
* [#1190](https://github.com/xmake-io/xmake/issues/1190): 添加对 Apple Silicon (macOS ARM) 设备的支持
* [#1145](https://github.com/xmake-io/xmake/pull/1145): 支持在 windows 上安装部署 Qt 程序, 感谢 @SirLynix

### 改进

* [#1072](https://github.com/xmake-io/xmake/issues/1072): 修复并改进 cl 编译器头文件依赖信息
* 针对 ui 模块和 `xmake f --menu` 增加 utf8 支持
* 改进 zig 语言在 macOS 上的支持
* [#1135](https://github.com/xmake-io/xmake/issues/1135): 针对特定 target 改进多平台多工具链同时配置支持
* [#1153](https://github.com/xmake-io/xmake/issues/1153): 改进 llvm 工具链，针对 macos 上编译增加 isysroot 支持
* [#1071](https://github.com/xmake-io/xmake/issues/1071): 改进 vs/vsxmake 生成插件去支持远程依赖包
* 改进 vs/vsxmake 工程生成插件去支持全局的 `set_arch()` 设置
* [#1164](https://github.com/xmake-io/xmake/issues/1164): 改进 vsxmake 插件调试加载 console 程序
* [#1179](https://github.com/xmake-io/xmake/issues/1179): 改进 llvm 工具链，添加 isysroot

### Bugs 修复

* [#1091](https://github.com/xmake-io/xmake/issues/1091): 修复不正确的继承链接依赖
* [#1105](https://github.com/xmake-io/xmake/issues/1105): 修复 vsxmake 插件 c++ 语言标准智能提示错误
* [#1132](https://github.com/xmake-io/xmake/issues/1132): 修复 vsxmake 插件中配置路径被截断问题
* [#1142](https://github.com/xmake-io/xmake/issues/1142): 修复安装包的时候，出现git找不到问题
* 修复在 macOS Big Sur 上 macos.version 问题
* [#1084](https://github.com/xmake-io/xmake/issues/1084): 修复 `add_defines()` 中带有双引号和空格导致无法正确处理宏定义的问题
* [#1195](https://github.com/xmake-io/xmake/pull/1195): 修复 unicode 编码问题，改进 vs 环境查找和进程执行

## v2.3.9

### 新特性

* 添加新的 [xrepo](https://github.com/xmake-io/xrepo) 命令去管理安装 C/C++ 包
* 支持安装交叉编译的依赖包
* 新增musl.cc上的工具链支持
* [#1009](https://github.com/xmake-io/xmake/issues/1009): 支持忽略校验去安装任意版本的包，`add_requires("libcurl 7.73.0", {verify = false})`
* [#1016](https://github.com/xmake-io/xmake/issues/1016): 针对依赖包增加license兼容性检测
* [#1017](https://github.com/xmake-io/xmake/issues/1017): 支持外部/系统头文件支持 `add_sysincludedirs`，依赖包默认使用`-isystem`
* [#1020](https://github.com/xmake-io/xmake/issues/1020): 支持在 archlinux 和 msys2 上查找安装 pacman 包
* 改进 `xmake f --menu` 菜单配置，支持鼠标操作

### 改进

* [#997](https://github.com/xmake-io/xmake/issues/997): `xmake project -k cmake` 插件增加对 `set_languages` 的支持
* [#998](https://github.com/xmake-io/xmake/issues/998): 支持安装 windows-static-md 类型的 vcpkg 包
* [#996](https://github.com/xmake-io/xmake/issues/996): 改进 vcpkg 目录查找
* [#1008](https://github.com/xmake-io/xmake/issues/1008): 改进交叉编译工具链
* [#1030](https://github.com/xmake-io/xmake/issues/1030): 改进 xcode.framework and xcode.application 规则
* [#1051](https://github.com/xmake-io/xmake/issues/1051): 为 msvc 编译器添加 `edit` 和 `embed` 调试信息格式类型到 `set_symbols()`
* [#1062](https://github.com/xmake-io/xmake/issues/1062): 改进 `xmake project -k vs` 插件

## v2.3.8

### 新特性

* [#955](https://github.com/xmake-io/xmake/issues/955): 添加 Zig 空工程模板
* [#956](https://github.com/xmake-io/xmake/issues/956): 添加 Wasm 编译平台，并且支持 Qt/Wasm SDK
* 升级luajit到v2.1最新分支版本，并且支持mips64上运行xmake
* [#972](https://github.com/xmake-io/xmake/issues/972): 添加`depend.on_changed()`去简化依赖文件的处理
* [#981](https://github.com/xmake-io/xmake/issues/981): 添加`set_fpmodels()`去抽象化设置math/float-point编译优化模式
* [#980](https://github.com/xmake-io/xmake/issues/980): 添加对 Intel C/C++ 和 Fortran 编译器的全平台支持
* [#986](https://github.com/xmake-io/xmake/issues/986): 对16.8以上msvc编译器增加 `c11`/`c17` 支持
* [#979](https://github.com/xmake-io/xmake/issues/979): 添加对OpenMP的跨平台抽象配置。`add_rules("c++.openmp")`

### 改进

* [#958](https://github.com/xmake-io/xmake/issues/958): 改进mingw平台，增加对 llvm-mingw 工具链的支持，以及 arm64/arm 架构的支持
* 增加 `add_requires("zlib~xxx")` 模式使得能够支持同时安装带有多种配置的同一个包，作为独立包存在
* [#977](https://github.com/xmake-io/xmake/issues/977): 改进 find_mingw 在 windows 上的探测
* [#978](https://github.com/xmake-io/xmake/issues/978): 改进工具链的flags顺序
* 改进XCode工具链，支持macOS/arm64

### Bugs修复

* [#951](https://github.com/xmake-io/xmake/issues/951): 修复 emcc (WebAssembly) 工具链在windows上的支持
* [#992](https://github.com/xmake-io/xmake/issues/992): 修复文件锁偶尔打开失败问题

## v2.3.7

### 新特性

* [#2941](https://github.com/microsoft/winget-pkgs/pull/2941): 支持通过 winget 来安装 xmake
* 添加 xmake-tinyc 安装包，内置tinyc编译器，支持windows上无msvc环境也可直接编译c代码
* 添加 tinyc 编译工具链
* 添加 emcc (emscripten) 编译工具链去编译 asm.js 和 WebAssembly
* [#947](https://github.com/xmake-io/xmake/issues/947): 通过 `xmake g --network=private` 配置设置私有网络模式，避免远程依赖包下载访问外网导致编译失败

### 改进

* [#907](https://github.com/xmake-io/xmake/issues/907): 改进msvc的链接器优化选项，生成更小的可执行程序
* 改进ubuntu下Qt环境的支持
* [#918](https://github.com/xmake-io/xmake/pull/918): 改进cuda11工具链的支持
* 改进Qt支持，对通过 ubuntu/apt 安装的Qt sdk也进行了探测支持，并且检测效率也优化了下
* 改进 CMake 工程文件生成器
* [#931](https://github.com/xmake-io/xmake/issues/931): 改进导出包，支持导出所有依赖包
* [#930](https://github.com/xmake-io/xmake/issues/930): 如果私有包定义没有版本定义，支持直接尝试下载包
* [#927](https://github.com/xmake-io/xmake/issues/927): 改进android ndk，支持arm/thumb指令模式切换
* 改进 trybuild/cmake 支持 Android/Mingw/iPhoneOS/WatchOS 工具链

### Bugs修复

* [#903](https://github.com/xmake-io/xmake/issues/903): 修复vcpkg包安装失败问题
* [#912](https://github.com/xmake-io/xmake/issues/912): 修复自定义工具链
* [#914](https://github.com/xmake-io/xmake/issues/914): 修复部分aarch64设备上运行lua出现bad light userdata pointer问题

## v2.3.6

### 新特性

* 添加xcode工程生成器插件，`xmake project -k cmake` （当前采用cmake生成）
* [#870](https://github.com/xmake-io/xmake/issues/870): 支持gfortran编译器
* [#887](https://github.com/xmake-io/xmake/pull/887): 支持zig编译器
* [#893](https://github.com/xmake-io/xmake/issues/893): 添加json模块
* [#898](https://github.com/xmake-io/xmake/issues/898): 改进golang项目构建，支持交叉编译
* [#275](https://github.com/xmake-io/xmake/issues/275): 支持go包管理器去集成第三方go依赖包
* [#581](https://github.com/xmake-io/xmake/issues/581): 支持dub包管理器去集成第三方dlang依赖包

### 改进

* [#868](https://github.com/xmake-io/xmake/issues/868): 支持新的cl.exe的头文件依赖输出文件格式，`/sourceDependencies xxx.json`
* [#902](https://github.com/xmake-io/xmake/issues/902): 改进交叉编译工具链

## v2.3.5

### 新特性

* 添加`xmake show -l envs`去显示xmake内置的环境变量列表
* [#861](https://github.com/xmake-io/xmake/issues/861): 支持从指定目录搜索本地包去直接安装远程依赖包
* [#854](https://github.com/xmake-io/xmake/issues/854): 针对wget, curl和git支持全局代理设置

### 改进

* [#828](https://github.com/xmake-io/xmake/issues/828): 针对protobuf规则增加导入子目录proto文件支持
* [#835](https://github.com/xmake-io/xmake/issues/835): 改进mode.minsizerel模式，针对msvc增加/GL支持，进一步优化目标程序大小
* [#828](https://github.com/xmake-io/xmake/issues/828): protobuf规则支持import多级子目录
* [#838](https://github.com/xmake-io/xmake/issues/838#issuecomment-643570920): 支持完全重写内置的构建规则，`add_files("src/*.c", {rules = {"xx", override = true}})`
* [#847](https://github.com/xmake-io/xmake/issues/847): 支持rc文件的头文件依赖解析
* 改进msvc工具链，去除全局环境变量的依赖
* [#857](https://github.com/xmake-io/xmake/pull/857): 改进`set_toolchains()`支持交叉编译的时候，特定target可以切换到host工具链同时编译

### Bugs修复

* 修复进度字符显示
* [#829](https://github.com/xmake-io/xmake/issues/829): 修复由于macOS大小写不敏感系统导致的sysroot无效路径问题
* [#832](https://github.com/xmake-io/xmake/issues/832): 修复find_packages在debug模式下找不到的问题

## v2.3.4

### 新特性

* [#630](https://github.com/xmake-io/xmake/issues/630): 支持*BSD系统，例如：FreeBSD, ..
* 添加wprint接口去显示警告信息
* [#784](https://github.com/xmake-io/xmake/issues/784): 添加`set_policy()`去设置修改一些内置的策略，比如：禁用自动flags检测和映射
* [#780](https://github.com/xmake-io/xmake/issues/780): 针对target添加set_toolchains/set_toolsets实现更完善的工具链设置，并且实现platform和toolchains分离
* [#798](https://github.com/xmake-io/xmake/issues/798): 添加`xmake show`插件去显示xmake内置的各种信息
* [#797](https://github.com/xmake-io/xmake/issues/797): 添加ninja主题风格，显示ninja风格的构建进度条，`xmake g --theme=ninja`
* [#816](https://github.com/xmake-io/xmake/issues/816): 添加mode.releasedbg和mode.minsizerel编译模式规则
* [#819](https://github.com/xmake-io/xmake/issues/819): 支持ansi/vt100终端字符控制

### 改进

* [#771](https://github.com/xmake-io/xmake/issues/771): 检测includedirs,linkdirs和frameworkdirs的输入有效性
* [#774](https://github.com/xmake-io/xmake/issues/774): `xmake f --menu`可视化配置菜单支持窗口大小Resize调整
* [#782](https://github.com/xmake-io/xmake/issues/782): 添加add_cxflags等配置flags自动检测失败提示
* [#808](https://github.com/xmake-io/xmake/issues/808): 生成cmakelists插件增加对add_frameworks的支持
* [#820](https://github.com/xmake-io/xmake/issues/820): 支持独立的工作目录和构建目录，保持项目目录完全干净

### Bugs修复

* [#786](https://github.com/xmake-io/xmake/issues/786): 修复头文件依赖检测
* [#810](https://github.com/xmake-io/xmake/issues/810): 修复linux下gcc strip debug符号问题

## v2.3.3

### 新特性

* [#727](https://github.com/xmake-io/xmake/issues/727): 支持为android, ios程序生成.so/.dSYM符号文件
* [#687](https://github.com/xmake-io/xmake/issues/687): 支持编译生成objc/bundle程序
* [#743](https://github.com/xmake-io/xmake/issues/743): 支持编译生成objc/framework程序
* 支持编译bundle, framework程序，以及mac, ios应用程序，并新增一些工程模板
* 支持对ios应用程序打包生成ipa文件，以及代码签名支持
* 增加一些ipa打包、安装、重签名等辅助工具
* 添加xmake.cli规则来支持开发带有xmake/core引擎的lua扩展程序

### 改进

* [#750](https://github.com/xmake-io/xmake/issues/750): 改进qt.widgetapp规则，支持qt私有槽

## v2.3.2

### 新特性

* 添加powershell色彩主题用于powershell终端下背景色显示
* 添加`xmake --dry-run -v`命令去空运行构建，仅仅为了查看详细的构建命令
* [#712](https://github.com/xmake-io/xmake/issues/712): 添加sdcc平台，并且支持sdcc编译器

### 改进

* [#589](https://github.com/xmake-io/xmake/issues/589): 改进优化构建速度，支持跨目标间并行编译和link，编译速度和ninja基本持平
* 改进ninja/cmake工程文件生成器插件
* [#728](https://github.com/xmake-io/xmake/issues/728): 改进os.cp支持保留源目录结构层级的递归复制
* [#732](https://github.com/xmake-io/xmake/issues/732): 改进find_package支持查找homebrew/cmake安装的包
* [#695](https://github.com/xmake-io/xmake/issues/695): 改进采用android ndk最新的abi命名

### Bugs修复

* 修复windows下link error显示问题
* [#718](https://github.com/xmake-io/xmake/issues/718): 修复依赖包下载在多镜像时一定概率缓存失效问题
* [#722](https://github.com/xmake-io/xmake/issues/722): 修复无效的包依赖导致安装死循环问题
* [#719](https://github.com/xmake-io/xmake/issues/719): 修复windows下主进程收到ctrlc后，.bat子进程没能立即退出的问题
* [#720](https://github.com/xmake-io/xmake/issues/720): 修复compile_commands生成器的路径转义问题

## v2.3.1

### 新特性

* [#675](https://github.com/xmake-io/xmake/issues/675): 支持通过设置强制将`*.c`作为c++代码编译, `add_files("*.c", {sourcekind = "cxx"})`。
* [#681](https://github.com/xmake-io/xmake/issues/681): 支持在msys/cygwin上编译xmake，以及添加msys/cygwin编译平台
* 添加socket/pipe模块，并且支持在协程中同时调度process/socket/pipe
* [#192](https://github.com/xmake-io/xmake/issues/192): 尝试构建带有第三方构建系统的项目，还支持autotools项目的交叉编译
* 启用gcc/clang的编译错误色彩高亮输出
* [#588](https://github.com/xmake-io/xmake/issues/588): 改进工程生成插件`xmake project -k ninja`，增加对build.ninja生成支持

### 改进

* [#665](https://github.com/xmake-io/xmake/issues/665): 支持 *nix style 的参数输入，感谢[@OpportunityLiu](https://github.com/OpportunityLiu)的贡献
* [#673](https://github.com/xmake-io/xmake/pull/673): 改进tab命令补全，增加对参数values的补全支持
* [#680](https://github.com/xmake-io/xmake/issues/680): 优化get.sh安装脚本，添加国内镜像源，加速下载
* 改进process调度器
* [#651](https://github.com/xmake-io/xmake/issues/651): 改进os/io模块系统操作错误提示

### Bugs修复

* 修复增量编译检测依赖文件的一些问题
* 修复log输出导致xmake-vscode插件解析编译错误信息失败问题
* [#684](https://github.com/xmake-io/xmake/issues/684): 修复windows下android ndk的一些linker错误

## v2.2.9

### 新特性

* [#569](https://github.com/xmake-io/xmake/pull/569): 增加对c++模块的实验性支持
* 添加`xmake project -k xmakefile`生成器
* [620](https://github.com/xmake-io/xmake/issues/620): 添加全局`~/.xmakerc.lua`配置文件，对所有本地工程生效.
* [593](https://github.com/xmake-io/xmake/pull/593): 添加`core.base.socket`模块，为下一步远程编译和分布式编译做准备。

### 改进

* [#563](https://github.com/xmake-io/xmake/pull/563): 重构构建逻辑，将特定语言的构建抽离到独立的rules中去 
* [#570](https://github.com/xmake-io/xmake/issues/570): 改进Qt构建，将`qt.application`拆分成`qt.widgetapp`和`qt.quickapp`两个构建规则
* [#576](https://github.com/xmake-io/xmake/issues/576): 使用`set_toolchain`替代`add_tools`和`set_tools`，解决老接口使用歧义，提供更加易理解的设置方式
* 改进`xmake create`创建模板工程
* [#589](https://github.com/xmake-io/xmake/issues/589): 改进默认的构建任务数，充分利用cpu core来提速整体编译速度
* [#598](https://github.com/xmake-io/xmake/issues/598): 改进`find_package`支持在macOS上对.tbd系统库文件的查找
* [#615](https://github.com/xmake-io/xmake/issues/615): 支持安装和使用其他arch和ios的conan包
* [#629](https://github.com/xmake-io/xmake/issues/629): 改进hash.uuid并且实现uuid v4
* [#639](https://github.com/xmake-io/xmake/issues/639): 改进参数解析器支持`-jN`风格传参

### Bugs修复

* [#567](https://github.com/xmake-io/xmake/issues/567): 修复序列化对象时候出现的内存溢出问题 
* [#566](https://github.com/xmake-io/xmake/issues/566): 修复安装远程依赖的链接顺序问题
* [#565](https://github.com/xmake-io/xmake/issues/565): 修复vcpkg包的运行PATH设置问题
* [#597](https://github.com/xmake-io/xmake/issues/597): 修复xmake require安装包时间过长问题
* [#634](https://github.com/xmake-io/xmake/issues/634): 修复mode.coverage构建规则，并且改进flags检测

## v2.2.8

### 新特性

* 添加protobuf c/c++构建规则
* [#468](https://github.com/xmake-io/xmake/pull/468): 添加对 Windows 的 UTF-8 支持
* [#472](https://github.com/xmake-io/xmake/pull/472): 添加`xmake project -k vsxmake`去更好的支持vs工程的生成，内部直接调用xmake来编译
* [#487](https://github.com/xmake-io/xmake/issues/487): 通过`xmake --files="src/*.c"`支持指定一批文件进行编译。
* 针对io模块增加文件锁接口
* [#513](https://github.com/xmake-io/xmake/issues/513): 增加对android/termux终端的支持，可在android设备上执行xmake来构建项目
* [#517](https://github.com/xmake-io/xmake/issues/517): 为target增加`add_cleanfiles`接口，实现快速定制化清理文件
* [#537](https://github.com/xmake-io/xmake/pull/537): 添加`set_runenv`接口去覆盖写入系统envs

### 改进

* [#257](https://github.com/xmake-io/xmake/issues/257): 锁定当前正在构建的工程，避免其他xmake进程同时对其操作
* 尝试采用/dev/shm作为os.tmpdir去改善构建过程中临时文件的读写效率
* [#542](https://github.com/xmake-io/xmake/pull/542): 改进vs系列工具链的unicode输出问题
* 对于安装的lua脚本，启用lua字节码存储，减少安装包大小（<2.4M），提高运行加载效率。

### Bugs修复

* [#549](https://github.com/xmake-io/xmake/issues/549): 修复新版vs2019下检测环境会卡死的问题

## v2.2.7

### 新特性

* [#455](https://github.com/xmake-io/xmake/pull/455): 支持使用 clang 作为 cuda 编译器，`xmake f --cu=clang`
* [#440](https://github.com/xmake-io/xmake/issues/440): 为target/run添加`set_rundir()`和`add_runenvs()`接口设置
* [#443](https://github.com/xmake-io/xmake/pull/443): 添加命令行tab自动完成支持
* 为rule/target添加`on_link`,`before_link`和`after_link`阶段自定义脚本支持
* [#190](https://github.com/xmake-io/xmake/issues/190): 添加`add_rules("lex", "yacc")`规则去支持lex/yacc项目

### 改进

* [#430](https://github.com/xmake-io/xmake/pull/430): 添加`add_cucodegens()`api为cuda改进设置codegen
* [#432](https://github.com/xmake-io/xmake/pull/432): 针对cuda编译支持依赖分析检测（仅支持 CUDA 10.1+）
* [#437](https://github.com/xmake-io/xmake/issues/437): 支持指定更新源，`xmake update github:xmake-io/xmake#dev`
* [#438](https://github.com/xmake-io/xmake/pull/438): 支持仅更新脚本，`xmake update --scriptonly dev`
* [#433](https://github.com/xmake-io/xmake/issues/433): 改进cuda构建支持device-link设备代码链接
* [#442](https://github.com/xmake-io/xmake/issues/442): 改进tests测试框架

## v2.2.6

### 新特性

* [#380](https://github.com/xmake-io/xmake/pull/380): 添加导出compile_flags.txt 
* [#382](https://github.com/xmake-io/xmake/issues/382): 简化域设置语法
* [#397](https://github.com/xmake-io/xmake/issues/397): 添加clib包集成支持
* [#404](https://github.com/xmake-io/xmake/issues/404): 增加Qt/Android编译支持，并且支持android apk生成和部署
* 添加一些Qt空工程模板，例如：`widgetapp_qt`, `quickapp_qt_static` and `widgetapp_qt_static`
* [#415](https://github.com/xmake-io/xmake/issues/415): 添加`--cu-cxx`配置参数到`nvcc/-ccbin`
* 为Android NDK添加`--ndk_stdcxx=y`和`--ndk_cxxstl=gnustl_static`参数选项

### 改进

* 改进远程依赖包管理，丰富包仓库
* 改进`target:on_xxx`自定义脚本，去支持匹配`android|armv7-a@macosx,linux|x86_64`模式
* 改进loadfile，优化启动速度，windows上启动xmake时间提速98%

### Bugs修复

* [#400](https://github.com/xmake-io/xmake/issues/400): 修复qt项目c++语言标准设置无效问题

## v2.2.5

### 新特性

* 添加`string.serialize`和`string.deserialize`去序列化，反序列化对象，函数以及其他类型
* 添加`xmake g --menu`去图形化配置全局选项
* [#283](https://github.com/xmake-io/xmake/issues/283): 添加`target:installdir()`和`set_installdir()`接口
* [#260](https://github.com/xmake-io/xmake/issues/260): 添加`add_platformdirs`接口，用户现在可以自定义扩展编译平台
* [#310](https://github.com/xmake-io/xmake/issues/310): 新增主题设置支持，用户可随意切换和扩展主题样式
* [#318](https://github.com/xmake-io/xmake/issues/318): 添加`add_installfiles`接口到target去自定义安装文件
* [#339](https://github.com/xmake-io/xmake/issues/339): 改进`add_requires`和`find_package`使其支持对第三方包管理的集成支持
* [#327](https://github.com/xmake-io/xmake/issues/327): 实现对conan包管理的集成支持
* 添加内置API `find_packages("pcre2", "zlib")`去同时查找多个依赖包，不需要通过import导入即可直接调用
* [#320](https://github.com/xmake-io/xmake/issues/320): 添加模板配置文件相关接口，`add_configfiles`和`set_configvar`
* [#179](https://github.com/xmake-io/xmake/issues/179): 扩展`xmake project`插件，新增CMakelist.txt生成支持
* [#361](https://github.com/xmake-io/xmake/issues/361): 增加对vs2019 preview的支持
* [#368](https://github.com/xmake-io/xmake/issues/368): 支持`private, public, interface`属性设置去继承target配置
* [#284](https://github.com/xmake-io/xmake/issues/284): 通过`add_configs()`添加和传递用户自定义配置到`package()`
* [#319](https://github.com/xmake-io/xmake/issues/319): 添加`add_headerfiles`接口去改进头文件的设置
* [#342](https://github.com/xmake-io/xmake/issues/342): 为`includes()`添加一些内置的辅助函数，例如：`check_cfuncs`

### 改进

* 针对远程依赖包，改进版本和调试模式切换
* [#264](https://github.com/xmake-io/xmake/issues/264): 支持在windows上更新dev/master版本，`xmake update dev`
* [#293](https://github.com/xmake-io/xmake/issues/293): 添加`xmake f/g --mingw=xxx` 配置选线，并且改进find_mingw检测
* [#301](https://github.com/xmake-io/xmake/issues/301): 改进编译预处理头文件以及依赖头文件生成，编译速度提升30%
* [#322](https://github.com/xmake-io/xmake/issues/322): 添加`option.add_features`, `option.add_cxxsnippets` 和 `option.add_csnippets`
* 移除xmake 1.x的一些废弃接口, 例如：`add_option_xxx`
* [#327](https://github.com/xmake-io/xmake/issues/327): 改进`lib.detect.find_package`增加对conan包管理器的支持
* 改进`lib.detect.find_package`并且添加内建的`find_packages("zlib 1.x", "openssl", {xxx = ...})`接口
* 标记`set_modes()`作为废弃接口， 我们使用`add_rules("mode.debug", "mode.release")`来替代它
* [#353](https://github.com/xmake-io/xmake/issues/353): 改进`target:set`, `target:add` 并且添加`target:del`去动态修改target配置
* [#356](https://github.com/xmake-io/xmake/issues/356): 添加`qt_add_static_plugins()`接口去支持静态Qt sdk
* [#351](https://github.com/xmake-io/xmake/issues/351): 生成vs201x插件增加对yasm的支持
* 重构改进整个远程依赖包管理器，更加快速、稳定、可靠，并提供更多的常用包

### Bugs修复

* 修复无法通过 `set_optimize()` 设置优化选项，如果存在`add_rules("mode.release")`的情况下
* [#289](https://github.com/xmake-io/xmake/issues/289): 修复在windows下解压gzip文件失败
* [#296](https://github.com/xmake-io/xmake/issues/296): 修复`option.add_includedirs`对cuda编译不生效
* [#321](https://github.com/xmake-io/xmake/issues/321): 修复PATH环境改动后查找工具不对问题

## v2.2.3

### 新特性

* [#233](https://github.com/xmake-io/xmake/issues/233): 对mingw平台增加windres的支持
* [#239](https://github.com/xmake-io/xmake/issues/239): 添加cparser编译器支持
* 添加插件管理器，`xmake plugin --help`
* 添加`add_syslinks`接口去设置系统库依赖，分离与`add_links`添加的库依赖之间的链接顺序
* 添加 `xmake l time xmake [--rebuild]` 去记录编译耗时
* [#250](https://github.com/xmake-io/xmake/issues/250): 添加`xmake f --vs_sdkver=10.0.15063.0`去改变windows sdk版本
* 添加`lib.luajit.ffi`和`lib.luajit.jit`扩展模块
* [#263](https://github.com/xmake-io/xmake/issues/263): 添加object目标类型，仅仅用于编译生成object对象文件
* [#269](https://github.com/xmake-io/xmake/issues/269): 每天第一次构建时候后台进程自动清理最近30天的临时文件

### 改进

* [#229](https://github.com/xmake-io/xmake/issues/229): 改进vs toolset选择已经vcproj工程文件生成
* 改进编译依赖，对源文件列表的改动进行依赖判断
* 支持解压*.xz文件
* [#249](https://github.com/xmake-io/xmake/pull/249): 改进编译进度信息显示格式
* [#247](https://github.com/xmake-io/xmake/pull/247): 添加`-D`和`--diagnosis`去替换`--backtrace`，改进诊断信息显示
* [#259](https://github.com/xmake-io/xmake/issues/259): 改进 on_build, on_build_file 和 on_xxx 等接口
* 改进远程包管理器，更加方便的包依赖配置切换
* 支持only头文件依赖包的安装
* 支持对包内置links的手动调整，`add_packages("xxx", {links = {}})`

### Bugs修复

* 修复安装依赖包失败中断后的状态不一致性问题

## v2.2.2

### 新特性

* 新增fasm汇编器支持
* 添加`has_config`, `get_config`和`is_config`接口去快速判断option和配置值
* 添加`set_config`接口去设置默认配置
* 添加`$xmake --try`去尝试构建工程
* 添加`set_enabled(false)`去显示的禁用target
* [#69](https://github.com/xmake-io/xmake/issues/69): 添加远程依赖包管理, `add_requires("tbox ~1.6.1")`
* [#216](https://github.com/xmake-io/xmake/pull/216): 添加windows mfc编译规则

### 改进

* 改进Qt编译编译环境探测，增加对mingw sdk的支持
* 在自动扫描生成的xmake.lua中增加默认debug/release规则
* [#178](https://github.com/xmake-io/xmake/issues/178): 修改mingw平台下的目标名
* 对于`add_files()`在windows上支持大小写不敏感路径模式匹配
* 改进`detect.sdks.find_qt`对于Qt根目录的探测
* [#184](https://github.com/xmake-io/xmake/issues/184): 改进`lib.detect.find_package`支持vcpkg
* [#208](https://github.com/xmake-io/xmake/issues/208): 改进rpath对动态库的支持
* [#225](https://github.com/xmake-io/xmake/issues/225): 改进vs环境探测

### Bugs修复

* [#177](https://github.com/xmake-io/xmake/issues/177): 修复被依赖的动态库target，如果设置了basename后链接失败问题
* 修复`$ xmake f --menu`中Exit问题以及cpu过高问题
* [#197](https://github.com/xmake-io/xmake/issues/197): 修复生成的vs201x工程文件带有中文路径乱码问题
* 修复WDK规则编译生成的驱动在Win7下运行蓝屏问题
* [#205](https://github.com/xmake-io/xmake/pull/205): 修复vcproj工程生成targetdir, objectdir路径设置不匹配问题 

## v2.2.1

### 新特性

* [#158](https://github.com/xmake-io/xmake/issues/158): 增加对Cuda编译环境的支持
* 添加`set_tools`和`add_tools`接口为指定target目标设置编译工具链
* 添加内建规则：`mode.debug`, `mode.release`, `mode.profile`和`mode.check`
* 添加`is_mode`, `is_arch` 和`is_plat`内置接口到自定义脚本域
* 添加color256代码
* [#160](https://github.com/xmake-io/xmake/issues/160): 增加对Qt SDK编译环境的跨平台支持，并且增加`qt.console`, `qt.application`等规则
* 添加一些Qt工程模板
* [#169](https://github.com/xmake-io/xmake/issues/169): 支持yasm汇编器
* [#159](https://github.com/xmake-io/xmake/issues/159): 增加对WDK驱动编译环境支持

### 改进

* 添加FAQ到自动生成的xmake.lua文件，方便用户快速上手
* 支持Android NDK >= r14的版本
* 改进swiftc对warning flags的支持
* [#167](https://github.com/xmake-io/xmake/issues/167): 改进自定义规则：`rule()`
* 改进`os.files`和`os.dirs`接口，加速文件模式匹配
* [#171](https://github.com/xmake-io/xmake/issues/171): 改进Qt环境的构建依赖
* 在makefile生成插件中实现`make clean`

### Bugs修复

* 修复无法通过`add_ldflags("xx", "xx", {force = true})`强制设置多个flags的问题
* [#157](https://github.com/xmake-io/xmake/issues/157): 修复pdb符号输出目录不存在情况下编译失败问题
* 修复对macho格式目标strip all符号失效问题
* [#168](https://github.com/xmake-io/xmake/issues/168): 修复生成vs201x工程插件，在x64下失败的问题

## v2.1.9

### 新特性

* 添加`del_files()`接口去从已添加的文件列表中移除一些文件
* 添加`rule()`, `add_rules()`接口实现自定义构建规则，并且改进`add_files("src/*.md", {rule = "markdown"})`
* 添加`os.filesize()`接口
* 添加`core.ui.xxx`等cui组件模块，实现终端可视化界面，用于实现跟用户进行短暂的交互
* 通过`xmake f --menu`实现可视化菜单交互配置，简化工程的编译配置
* 添加`set_values`接口到option
* 改进option，支持根据工程中用户自定义的option，自动生成可视化配置菜单
* 在调用api设置工程配置时以及在配置菜单中添加源文件位置信息

### 改进

* 改进交叉工具链配置，通过指定工具别名定向到已知的工具链来支持未知编译工具名配置, 例如: `xmake f --cc=gcc@ccmips.exe`
* [#151](https://github.com/xmake-io/xmake/issues/151): 改进mingw平台下动态库生成
* 改进生成makefile插件
* 改进检测错误提示
* 改进`add_cxflags`等flags api的设置，添加force参数，来禁用自动检测和映射，强制设置选项：`add_cxflags("-DTEST", {force = true})`
* 改进`add_files`的flags设置，添加force域，用于设置不带自动检测和映射的原始flags：`add_files("src/*.c", {force = {cxflags = "-DTEST"}})`
* 改进搜索工程根目录策略
* 改进vs环境探测，支持加密文件系统下vs环境的探测
* 升级luajit到最新2.1.0-beta3
* 增加对linux/arm, arm64的支持，可以在arm linux上运行xmake
* 改进vs201x工程生成插件，更好的includedirs设置支持

### Bugs修复

* 修复依赖修改编译和链接问题
* [#151](https://github.com/xmake-io/xmake/issues/151): 修复`os.nuldev()`在mingw上传入gcc时出现问题
* [#150](https://github.com/xmake-io/xmake/issues/150): 修复windows下ar.exe打包过长obj列表参数，导致失败问题
* 修复`xmake f --cross`无法配置问题
* 修复`os.cd`到windows根路径问题

## v2.1.8

### 新特性

* 添加`XMAKE_LOGFILE`环境变量，启用输出到日志文件
* 添加对tinyc编译器的支持

### 改进

* 改进对IDE和编辑器插件的集成支持，例如：Visual Studio Code, Sublime Text 以及 IntelliJ IDEA
* 当生成新工程的时候，自动生成一个`.gitignore`文件，忽略一些xmake的临时文件和目录
* 改进创建模板工程，使用模板名代替模板id作为参数
* 改进macOS编译平台的探测，如果没有安装xcode也能够进行编译构建，如果有编译器的话
* 改进`set_config_header`接口，支持局部版本号设置，优先于全局`set_version`，例如：`set_config_header("config", {version = "2.1.8", build = "%Y%m%d%H%M"})`

### Bugs修复

* [#145](https://github.com/xmake-io/xmake/issues/145): 修复运行target的当前目录环境

## v2.1.7

### 新特性

* 添加`add_imports`去为target，option和package的自定义脚本批量导入模块，简化自定义脚本
* 添加`xmake -y/--yes`去确认用户输入
* 添加`xmake l package.manager.install xxx`模块，进行跨平台一致性安装软件包
* 添加vscode编辑器插件支持，更加方便的使用xmake，[xmake-vscode](https://marketplace.visualstudio.com/items?itemName=tboox.xmake-vscode#overview)
* 添加`xmake macro ..`快速运行最近一次命令

### 改进

* 改进`cprint()`，支持24位真彩色输出
* 对`add_rpathdirs()`增加对`@loader_path`和`$ORIGIN`的内置变量支持，提供可迁移动态库加载
* 改进`set_version("x.x.x", {build = "%Y%m%d%H%M"})` 支持buildversion设置
* 移除docs目录，将其放置到独立xmake-docs仓库中，减少xmake.zip的大小，优化下载安装的效率
* 改进安装和卸载脚本，支持DESTDIR和PREFIX环境变量设置
* 通过缓存优化flags探测，加速编译效率
* 添加`COLORTERM=nocolor`环境变量开关，禁用彩色输出
* 移除`add_rbindings`和`add_bindings`接口
* 禁止在重定向的时候进行彩色输出，避免输出文件中带有色彩代码干扰
* 更新tbox工程模板
* 改进`lib.detect.find_program`模块接口
* 为windows cmd终端增加彩色输出
* 增加`-w|--warning`参数来启用实时警告输出

### Bugs修复

* 修复`set_pcxxheader`编译没有继承flags配置问题
* [#140](https://github.com/xmake-io/xmake/issues/140): 修复`os.tmpdir()`在fakeroot下的冲突问题
* [#142](https://github.com/xmake-io/xmake/issues/142): 修复`os.getenv` 在windows上的中文编码问题
* 修复在带有空格路径的情况下，编译错误问题
* 修复setenv空值的崩溃问题

## v2.1.6

### 改进

* 改进`add_files`，支持对files粒度进行编译选项的各种配置，更加灵活。
* 从依赖的target和option中继承links和linkdirs。
* 改进`target.add_deps`接口，添加继承配置，允许手动禁止依赖继承，例如：`add_deps("test", {inherit = false})`
* 移除`tbox.pkg`二进制依赖，直接集成tbox源码进行编译

### Bugs修复

* 修复目标级联依赖问题
* 修复`target:add`和`option:add`问题
* 修复在archlinux上的编译和安装问题
* 修复`/ZI`的兼容性问题，用`/Zi`替代

## v2.1.5

### 新特性

* [#83](https://github.com/xmake-io/xmake/issues/83): 添加 `add_csnippet`，`add_cxxsnippet`到`option`来检测一些编译器特性
* [#83](https://github.com/xmake-io/xmake/issues/83): 添加用户扩展模块去探测程序，库文件以及其他主机环境
* 添加`find_program`, `find_file`, `find_library`, `find_tool`和`find_package` 等模块接口
* 添加`net.*`和`devel.*`扩展模块
* 添加`val()`接口去获取内置变量，例如：`val("host")`, `val("env PATH")`, `val("shell echo hello")` and `val("reg HKEY_LOCAL_MACHINE\\XX;Value")`
* 增加对微软.rc资源文件的编译支持，当在windows上编译时，可以增加资源文件了
* 增加`has_flags`, `features`和`has_features`等探测模块接口
* 添加`option.on_check`, `option.after_check` 和 `option.before_check` 接口
* 添加`target.on_load`接口
* [#132](https://github.com/xmake-io/xmake/issues/132): 添加`add_frameworkdirs`接口
* 添加`lib.detect.has_xxx`和`lib.detect.find_xxx`接口
* 添加`add_moduledirs`接口在工程中定义和加载扩展模块
* 添加`includes`接口替换`add_subdirs`和`add_subfiles`
* [#133](https://github.com/xmake-io/xmake/issues/133): 改进工程插件，通过运行`xmake project -k compile_commands`来导出`compile_commands.json`
* 添加`set_pcheader`和`set_pcxxheader`去支持跨编译器预编译头文件，支持`gcc`, `clang`和`msvc`
* 添加`xmake f -p cross`平台用于交叉编译，并且支持自定义平台名

### 改进

* [#87](https://github.com/xmake-io/xmake/issues/87): 为依赖库目标自动添加：`includes` 和 `links`
* 改进`import`接口，去加载用户扩展模块
* [#93](https://github.com/xmake-io/xmake/pull/93): 改进 `xmake lua`，支持运行单行命令和模块
* 改进编译错误提示信息输出
* 改进`print`接口去更好些显示table数据
* [#111](https://github.com/xmake-io/xmake/issues/111): 添加`--root`通用选项去临时支持作为root运行
* [#113](https://github.com/xmake-io/xmake/pull/113): 改进权限管理，现在作为root运行也是非常安全的
* 改进`xxx_script`工程描述api，支持多平台模式选择, 例如：`on_build("iphoneos|arm*", function (target) end)`
* 改进内置变量，支持环境变量和注册表数据的获取
* 改进vstudio环境和交叉工具链的探测
* [#71](https://github.com/xmake-io/xmake/issues/71): 改进从环境变量中探测链接器和编译器
* 改进option选项检测，通过多任务检测，提升70%的检测速度
* [#129](https://github.com/xmake-io/xmake/issues/129): 检测链接依赖，如果源文件没有改变，就不必重新链接目标文件了
* 在vs201x工程插件中增加对`*.asm`文件的支持
* 标记`add_bindings`和`add_rbindings`为废弃接口
* 优化`xmake rebuild`在windows上的构建速度
* 将`core.project.task`模块迁移至`core.base.task`
* 将`echo` 和 `app2ipa` 插件迁移到 [xmake-plugins](https://github.com/xmake-io/xmake-plugins) 仓库
* 添加`set_config_header("config.h", {prefix = ""})` 代替 `set_config_h` 和 `set_config_h_prefix`

### Bugs修复

* 修复`try-catch-finally`
* 修复解释器bug，解决当加载多级子目录时，根域属性设置不对
* [#115](https://github.com/xmake-io/xmake/pull/115): 修复安装脚本`get.sh`的路径问题
* 修复`import()`导入接口的缓存问题

## v2.1.4

### 新特性

* [#68](https://github.com/xmake-io/xmake/issues/68): 增加`$(programdir)`和`$(xmake)`内建变量
* 添加`is_host`接口去判断当前的主机环境
* [#79](https://github.com/xmake-io/xmake/issues/79): 增强`xmake lua`，支持交互式解释执行

### 改进

* 修改菜单选项颜色
* [#71](https://github.com/xmake-io/xmake/issues/71): 针对widows编译器改进优化选项映射
* [#73](https://github.com/xmake-io/xmake/issues/73): 尝试获取可执行文件路径来作为xmake的脚本目录 
* 在`add_subdirs`中的子`xmake.lua`中，使用独立子作用域，避免作用域污染导致的干扰问题
* [#78](https://github.com/xmake-io/xmake/pull/78): 美化非全屏终端窗口下的`xmake --help`输出
* 避免产生不必要的`.xmake`目录，如果不在工程中的时候

### Bugs修复

* [#67](https://github.com/xmake-io/xmake/issues/67): 修复 `sudo make install` 命令权限问题
* [#70](https://github.com/xmake-io/xmake/issues/70): 修复检测android编译器错误
* 修复临时文件路径冲突问题
* 修复`os.host`, `os.arch`等接口
* 修复根域api加载干扰其他子作用域问题
* [#77](https://github.com/xmake-io/xmake/pull/77): 修复`cprint`色彩打印中断问题

## v2.1.3

### 新特性

* [#65](https://github.com/xmake-io/xmake/pull/65): 为target添加`set_default`接口用于修改默认的构建所有targets行为
* 允许在工程子目录执行`xmake`命令进行构建，xmake会自动检测所在的工程根目录
* 添加`add_rpathdirs` api到target和option，支持动态库的自动加载运行

### 改进

* [#61](https://github.com/xmake-io/xmake/pull/61): 提供更加安全的`xmake install` and `xmake uninstall`任务，更友好的处理root安装问题
* 提供`rpm`, `deb`和`osxpkg`安装包
* [#63](https://github.com/xmake-io/xmake/pull/63): 改进安装脚本，实现更加安全的构建和安装xmake
* [#61](https://github.com/xmake-io/xmake/pull/61): 禁止在root权限下运行xmake命令，增强安全性
* 改进工具链检测，通过延迟延迟检测提升整体检测效率
* 当自动扫面生成`xmake.lua`时，添加更友好的用户提示，避免用户无操作

### Bugs修复

* 修复版本检测的错误提示信息
* [#60](https://github.com/xmake-io/xmake/issues/60): 修复macosx和windows平台的xmake自举编译
* [#64](https://github.com/xmake-io/xmake/issues/64): 修复构建android `armv8-a`架构失败问题
* [#50](https://github.com/xmake-io/xmake/issues/50): 修复构建android可执行程序，无法运行问题

## v2.1.2

### 新特性

* 添加aur打包脚本，并支持用`yaourt`包管理器进行安装。
* 添加[set_basename](#http://xmake.io/#/zh/manual?id=targetset_basename)接口，便于定制化修改生成后的目标文件名

### 改进

* 支持vs2017编译环境
* 支持编译android版本的rust程序
* 增强vs201x工程生成插件，支持同时多模式、架构编译

### Bugs修复

* 修复编译android程序，找不到系统头文件问题
* 修复检测选项行为不正确问题
* [#57](https://github.com/xmake-io/xmake/issues/57): 修复代码文件权限到0644

## v2.1.1

### 新特性

* 添加`--links`, `--linkdirs` and `--includedirs` 配置参数
* 添加app2ipa插件
* 为`xmake.lua`工程描述增加dictionay语法风格
* 提供智能扫描编译模式，在无任何`xmake.lua`等工程描述文件的情况下，也能直接快速编译
* 为`xmake.lua`工程描述添加`set_xmakever`接口，更加友好的处理版本兼容性问题 
* 为`objc`和`swift`程序添加`add_frameworks`接口
* 更加快速方便的多语言扩展支持，增加`golang`, `dlang`和`rust`程序构建的支持
* 添加`target_end`, `option_end` 和`task_end`等可选api，用于显示结束描述域，进入根域设置，提高可读性
* 添加`golang`, `dlang`和`rust`工程模板

### 改进

* 工程生成插件支持vs2017
* 改进gcc/clang编译器警告和错误提示
* 重构代码架构，改进多语言支持，更加方便灵活的扩展语言支持
* 改进print接口，同时支持原生lua print以及格式化打印
* 如果xmake.lua不存在，自动扫描工程代码文件，并且生成xmake.lua进行编译
* 修改license，使用更加宽松的Apache License 2.0
* 移除一些二进制工具文件
* 移除install.bat脚本，提供windows nsis安装包支持
* 使用[docute](https://github.com/egoist/docute)重写[文档](http://www.xmake.io/#/zh/)，提供更加完善的文档支持
* 增强`os.run`, `os.exec`, `os.cp`, `os.mv` 和 `os.rm` 等接口，支持通配符模式匹配和批量文件操作
* 精简和优化构建输出信息，添加`-q|--quiet`选项实现静默构建
* 改进`makefile`生成插件，抽取编译工具和编译选项到全局变量

### Bugs修复

* [#41](https://github.com/waruqi/xmake/issues/41): 修复在windows下自动检测x64失败问题
* [#43](https://github.com/waruqi/xmake/issues/43): 避免创建不必要的.xmake工程缓存目录
* 针对android版本添加c++ stl搜索目录，解决编译c++失败问题
* 修复在rhel 5.10上编译失败问题
* 修复`os.iorun`返回数据不对问题

## v2.0.5

### 新特性

* 为解释器作用域增加一些内建模块支持
* 针对windows x64平台，支持ml64汇编器

### 改进

* 增强ipairs和pairs接口，支持过滤器模式，简化脚本代码
* 为vs201x工程生成增加文件filter
* 移除`core/tools`目录以及msys工具链，在windows上使用xmake自编译core源码进行安装，优化xmake源码磁盘空间
* 移除`xmake/packages`，默认模板安装不再内置二进制packages，暂时需要手动放置，以后再做成自动包依赖下载编译

### Bugs修复

* 修复msvc的编译选项不支持问题：`-def:xxx.def`
* 修复ml.exe汇编器脚本
* 修复选项链接顺序问题

## v2.0.4

### 新特性

* 在`xmake.lua`中添加原生shell支持，例如：`add_ldflags("$(shell pkg-config --libs sqlite3)")`
* 编译windows目标程序，默认默认启用pdb符号文件
* 在windows上添加调试器支持（vsjitdebugger, ollydbg, windbg ... ）
* 添加`getenv`接口到`xmake.lua`的全局作用域中
* 添加生成vstudio工程插件(支持：vs2002 - vs2015)
* 为option添加`set_default`接口

### 改进

* 增强内建变量的处理
* 支持字符串类型的选项option设置

### Bugs修复

* 修复在linux下检测ld连接器失败，如果没装g++的话
* 修复`*.cxx`编译失败问题

## v2.0.3

### 新特性

* 增加头文件依赖自动检测和增量编译，提高编译速度
* 在终端中进行颜色高亮提示
* 添加调试器支持，`xmake run -d program ...`

### 改进

* 增强运行shell的系列接口
* 更新luajit到v2.0.4版本
* 改进makefile生成插件，移除对xmake的依赖，并且支持`windows/linux/macosx`等大部分pc平台
* 优化多任务编译速度，在windows下编译提升较为明显

### Bugs修复

* 修复安装目录错误问题
* 修复`import`根目录错误问题
* 修复在多版本vs同时存在的情况下，检测vs环境失败问题

## v2.0.2

### 改进

* 修改安装和卸载的action处理
* 更新工程模板
* 增强函数检测

### Bugs修复

* [#7](https://github.com/waruqi/xmake/issues/7): 修复用模板创建工程后，target名不对问题：'[targetname]'
* [#9](https://github.com/waruqi/xmake/issues/9): 修复clang不支持c++11的问题
* 修复api作用域泄露问题
* 修复在windows上的一些路径问题
* 修复检测宏函数失败问题
* 修复检测工具链失败问题
* 修复windows上编译android版本失败

## v2.0.1

### 新特性

* 增加task任务机制，可运行自定义任务脚本
* 实现plugin扩展机制，可以很方便扩展实现自定义插件，目前已实现的一些内置插件
* 增加project文件导出插件(目前已支持makefile的生成，后续会支持：vs, xcode等工程的生成)
* 增加hello xmake插件（插件demo）
* 增加doxygen文档生成插件
* 增加自定义宏脚本插件（支持动态宏记录、宏回放、匿名宏、批量导入、导出等功能）
* 增加更多的类库用于插件化开发
* 实现异常捕获机制，简化上层调用逻辑
* 增加多个option进行宏绑定，实现配置一个参数，就可以同时对多个配置进行生效
* 增加显示全局构建进度

### 改进

* 重构整个xmake.lua描述文件的解释器，更加的灵活可扩展
* 更加严格的语法检测机制
* 更加严格的作用域管理，实现沙盒引擎，对xmake.lua中脚本进行沙盒化处理，使得xmake.lua更加的安全
* 简化模板的开发，简单几行描述就可以扩展一个新的自定义工程模板
* 完全模块化platforms、tools、templates、actions，以及通过自注册机制，只需把自定义的脚本放入对应目录，就可实现快速扩展
* 针对所有可扩展脚本所需api进行大量简化，并实现大量类库，通过import机制进行导入使用
* 移除对gnu make/nmake等make工具的依赖，不再需要makefile，实现自己的make算法，
* 优化构建速度，支持多任务编译(支持vs编译器)（实测：比v1.0.4提升x4倍的构建性能）
* 优化自动检测机制，更加的稳定和准确
* 修改部分工程描述api，增强扩展性，减少一些命名歧义（对低版本向下兼容）
* 优化静态库合并：`add_files("*.a")`，修复一些bug
* 优化交叉编译，通过`--sdk=xxx`参数实现更加方便智能的进行交叉编译配置，简化mingw平台的编译配置
* 简化命令行配置开关, 支持`xmake config --xxx=[y|n|yes|no|true|false]`等开关值
* 合并iphoneos和iphonesimulator平台，以及watchos和watchsimulator平台，通过arch来区分，使得打包更加方便，能够支持一次性打包iphoneos的所有arch到一个包中

### Bugs修复

* [#3](https://github.com/waruqi/xmake/issues/3): 修复ArchLinux 编译失败问题
* [#4](https://github.com/waruqi/xmake/issues/4): 修复windows上安装失败问题
* 修复windows上环境变量设置问题

## v1.0.4

### 新特性

* 增加对windows汇编器的支持
* 为xmake create增加一些新的工程模板，支持tbox版本
* 支持swift代码
* 针对-v参数，增加错误输出信息
* 增加apple编译平台：watchos, watchsimulator的编译支持
* 增加对windows: x64, amd64, x86_amd64架构的编译支持
* 实现动态库和静态库的快速切换
* 添加-j/--jobs参数，手动指定是否多任务编译，默认改为单任务编译

### 改进

* 增强`add_files`接口，支持直接添加`*.o/obj/a/lib`文件，并且支持静态库的合并
* 裁剪xmake的安装过程，移除一些预编译的二进制程序

### Bugs修复

* [#1](https://github.com/waruqi/xmake/issues/4): 修复win7上安装失败问题
* 修复和增强工具链检测
* 修复一些安装脚本的bug, 改成外置sudo进行安装
* 修复linux x86_64下安装失败问题

## v1.0.3

### 新特性

* 添加set_runscript接口，支持自定义运行脚本扩展
* 添加import接口，使得在xmake.lua中可以导入一些扩展模块，例如：os，path，utils等等，使得脚本更灵活
* 添加android平台arm64-v8a支持

### Bugs修复

* 修复set_installscript接口的一些bug
* 修复在windows x86_64下，安装失败的问题
* 修复相对路径的一些bug
