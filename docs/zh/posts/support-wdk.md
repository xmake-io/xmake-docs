---
title: xmake新增对WDK驱动编译环境支持
tags: [xmake, lua, WDK, kmdf, umdf, wdm, driver]
date: 2018-06-14
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) v2.2.1新版本现已支持WDK驱动编译环境，我们可以直接在系统原生cmd终端下，执行xmake进行驱动编译，甚至配合vscode, sublime text, IDEA等编辑器+xmake插件去开发WDK驱动。

下面是xmake支持的一些编辑器插件，用户可以挑选自己喜欢的编辑器配合xmake来使用：

* [xmake-idea](https://github.com/xmake-io/xmake-idea) 
* [xmake-vscode](https://github.com/xmake-io/xmake-vscode)
* [xmake-sublime](https://github.com/xmake-io/xmake-sublime) 

## WDK环境介绍

首先，我们先简单介绍下WDK10的编译环境的安装方式，我们可以看下微软的官方文档：[Download the Windows Driver Kit (WDK)](https://docs.microsoft.com/en-us/windows-hardware/drivers/download-the-wdk)

里面介绍了两种环境：

1. 下载WDK开发包，直接安装到系统并集成到VS的开发环境中
2. 下载EWDK iso镜像（内含完整WDK开发环境），直接挂载后，运行LaunchBuildEnv进入cmd环境

xmake对于这两种环境都是完全支持的，如果用户直接下载安装WDK环境到本地系统，那么不需要任何配置，只需要执行：

```bash
$ xmake
```

xmake会自动检测到WDK的安装环境，然后编译相关驱动项目，如果用户是直接挂载的EWDK iso开发镜像，那么编译前配置下WDK所在路径即可：

```bash
$ xmake f --wdk="G:\Program Files\Windows Kits\10" 
$ xmake
```

更多详情可以参考：[#159](https://github.com/xmake-io/xmake/issues/159)







## WDK驱动实例

xmake支持umdf, kmdf, wdm驱动项目的维护，也是采用一系列扩展的WDK rule规则来实现，类似：[Qt编译环境的支持](http://tboox.org/cn/2018/05/30/support-qt/)。

目前支持的规则有如下这些：

- rule("wdk.driver")
- rule("wdk.binary")
- rule("wdk.static")
- rule("wdk.shared")

- rule("wdk.env.kmdf")
- rule("wdk.env.umdf")
- rule("wdk.env.wdm")

其中，`wdk.env.*`规则描述驱动编译的环境，`wdk.driver`, `wdk.static`描述编译的目标类型，两者可以互相结合使用，我们既可以用来编译驱动程序，也可以用来编译基于wdk环境的静态库、可执行程序。

下面，通过一些例子可以简单看下使用方式，具体例子代码见[wdk-examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/wdk/)，其中的项目代码是从[Windows-driver-samples](https://github.com/Microsoft/Windows-driver-samples)移植过来的。

#### umdf驱动程序

我们通过同时应用`wdk.driver`, `wdk.env.umdf`规则，来描述这个target作为umdf驱动程序来编译：

```lua
target("echo")
    add_rules("wdk.driver", "wdk.env.umdf")
    add_files("driver/*.c") 
    add_files("driver/*.inx")
    add_includedirs("exe")
```

我们也可以通过`wdk.binary`, `wdk.env.umdf`规则，来描述一个基于wdk/umdf编译环境的上层可执行程序：

```lua
target("app")
    add_rules("wdk.binary", "wdk.env.umdf")
    add_files("exe/*.cpp") 
```

#### kmdf驱动程序

kmdf的项目描述跟刚才的umdf类似，只需要把`wdk.env.umdf`换成`wdk.env.kmdf`的环境规则就行了。

```lua
target("nonpnp")
    add_rules("wdk.driver", "wdk.env.kmdf")
    add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)")
    add_values("wdk.tracewpp.flags", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")
    add_files("driver/*.c", {rule = "wdk.tracewpp"}) 
    add_files("driver/*.rc")

target("app")
    add_rules("wdk.binary", "wdk.env.kmdf")
    add_files("exe/*.c") 
    add_files("exe/*.inf")
```

这个项目里面，需要特别注意的是，我们还用到了tracewpp对一些源文件的预处理，对于tracewpp任务的介绍，可以看下官方文档[tracewpp-task](https://docs.microsoft.com/en-us/windows-hardware/drivers/devtest/tracewpp-task)，这里就不多做说明了。

我们直接说下，如何在xmake的项目里应用tracewpp规则吧，由于这个规则并不是对当前target所有源文件都去处理的，因此我们只对需要的源文件进行应用这个规则，例如：

```lua
add_files("driver/*.c", {rule = "wdk.tracewpp"}) 
add_files("driver/dir/test.c", {rule = "wdk.tracewpp"}) 
```

当然tracewpp还会有一些自己的特殊选项，用户有时候需要自己根据需要来设置，例如：

```lua
add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)")
add_values("wdk.tracewpp.flags", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")
```

关于`add_values`的使用说明，可以看下文档：[add_values和set_values的使用说明](https://xmake.io/zh/)，简单来说，就是用来给对应规则传递扩展参数设置的。

#### wdm驱动程序


wdm的项目描述也跟umdf类似，只需要把`wdk.env.umdf`换成`wdk.env.wdm`的环境规则就行了。

```lua
target("kcs")
    add_rules("wdk.driver", "wdk.env.wdm")
    add_values("wdk.man.flags", "-prefix Kcs")
    add_values("wdk.man.resource", "kcsCounters.rc")
    add_values("wdk.man.header", "kcsCounters.h")
    add_values("wdk.man.counter_header", "kcsCounters_counters.h")
    add_files("*.c", "*.rc", "*.man") 
```

上述代码，还添加了一些.man文件用来预处理一些manifest，具体相关的任务藐视，可以参考官方文档说明：[ctrpp-task](https://docs.microsoft.com/en-us/windows-hardware/drivers/devtest/ctrpp-task)。
里面也有相关的一些特殊配置选项，目前xmake支持的配置有：

```lua
add_values("wdk.man.flags", "-prefix Kcs")
add_values("wdk.man.prefix", "Kcs")
add_values("wdk.man.resource", "kcsCounters.rc")
add_values("wdk.man.header", "kcsCounters.h")
add_values("wdk.man.counter_header", "kcsCounters_counters.h")
```

下面再贴个wdm驱动的例子，这个例子中，除了之前讲的tracewpp，我们还加了.mof的文件处理，对于.mof文件，xmake会自动应用内置的`wdk.mof`规则，详细说明见：[mofcomp-task](https://docs.microsoft.com/en-us/windows-hardware/drivers/devtest/mofcomp-task)

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    add_values("wdk.tracewpp.flags", "-func:TracePrint((LEVEL,FLAGS,MSG,...))")
    add_files("*.c", {rule = "wdk.tracewpp"}) 
    add_files("*.rc", "*.inf")
    add_files("*.mof|msdsm.mof")
    add_files("msdsm.mof", {values = {wdk_mof_header = "msdsmwmi.h"}}) 
```

对于.mof的配置选项，有些配置并不是全局应用于target的，对每个文件需要单独配置，这个时候，就不能直接使用`set_values`和`add_values`了，需要在`add_files`中设置相关values。

```lua
add_files("msdsm.mof", {values = {wdk_mof_header = "msdsmwmi.h"}}) 
add_files("msdsm.mof", {values = {["wdk.mof.header"] = "msdsmwmi.h"}}) 
```

上面两种设置方式都是有效的，由于受限于lua的语法，为了考虑可读性，xmake通过_下划线来简化key的设置，这个设置相当于单独对msdsm.mof文件设置了`set_values("wdk.mof.header", "msdsmwmi.h")`。

## 生成驱动包

如果平常开发调试通过后，我们也可以通过以下命令生成.cab驱动包来发布驱动程序：

```console
$ xmake [p|package]
$ xmake [p|package] -o outputdir
```

输出的目录结构如下：

```
  - drivers
    - sampledsm
       - debug/x86/sampledsm.cab
       - release/x64/sampledsm.cab
       - debug/x86/sampledsm.cab
       - release/x64/sampledsm.cab
```

## 驱动签名

默认编译我们是禁用签名的，如果想要在编译的同时，启用签名，可以通过`set_values("wdk.sign.mode", ...)`设置签名模式来启用。
只要启用了签名，那么平常的驱动构建、包括打包生成的.cab文件，都会自动对其进行签名。

#### 测试签名

测试签名一般本机调试时候用，可以使用xmake自带的test证书来进行签名，例如：

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
    add_files("src/*.c")
```

不过这种情况下，需要用户手动在管理员模式下，执行一遍：`$xmake l utils.wdk.testcert install`，来生成和注册test证书到本机环境。
这个只需要执行一次就行了，后续就可以正常编译和签名了。

当然也可以使用本机已有的有效证书去签名，例如直接从sha1来选择合适的证书进行签名：

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
    set_values("wdk.sign.thumbprint", "032122545DCAA6167B1ADBE5F7FDF07AE2234AAA")
    add_files("src/*.c")
```

或者从store/company来选择合适的证书进行签名：

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
    set_values("wdk.sign.store", "PrivateCertStore")
    set_values("wdk.sign.company", "tboox.org(test)")
    add_files("src/*.c")
```

#### 正式签名

对于正式签名，我们可以通过指定对应的正式签名证书文件进行签名：

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "release")
    set_values("wdk.sign.company", "xxxx")
    set_values("wdk.sign.certfile", path.join(os.projectdir(), "xxxx.cer"))
```

## 生成低版本驱动

如果想在wdk10环境编译生成win7, win8等低版本系统支持的驱动，我们可以通过设置`wdk.env.winver`来切换系统版本：

```lua
set_values("wdk.env.winver", "win10")
set_values("wdk.env.winver", "win10_rs3")
set_values("wdk.env.winver", "win81")
set_values("wdk.env.winver", "win8")
set_values("wdk.env.winver", "win7")
set_values("wdk.env.winver", "win7_sp1")
set_values("wdk.env.winver", "win7_sp2")
set_values("wdk.env.winver", "win7_sp3")
```

如果觉得每次修改xmake.lua去切换编译非常繁琐，我们也可以手动指定编译的目标程序支持的windows版本，来快速切换到对应的版本进行编译：

```console
$ xmake f --wdk_winver=[win10_rs3|win8|win7|win7_sp1]
$ xmake
```

目前支持的一些版本有：nt4, win2k, winxp, ws03, win6, vista, ws08, longhorn, win7, win8, win81, winblue, win10 

然后通过_下划线，组合指定子版本：sp1, sp2, sp3, th2, rs1, rs2, rs3

xmake还提供了一些内置的版本值，在切换winver版本是，会自动改变，用于一些更加定制化的配置需求，例如：

```lua
target("test")
    
    on_load(function (target)
        local winnt_version = target:values("wdk.env.winnt_version")
        if winnt_version > "0x0A000000" then
            target:add("defines", "TEST")
        end
    end)
```

上述代码通过判断WIN32_WINNT的版本值，来定制添加一些相关配置，这个版本值会根据`wdk.env.winver`的配置自动适配更新，目前提供的这些内置版本值还有：

```
target:values("wdk.env.winnt_version"): WIN32_WINNT
target:values("wdk.env.ntddi_version"): NTDDI_VERSION
target:values("wdk.env.winver_version"): WINVER
```

关于更多xmake下WDK开发相关介绍，请参考文档：[WDK驱动程序开发](https://xmake.io/zh/)