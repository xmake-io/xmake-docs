---
title: Xmake v2.9.1 发布，新增 native lua 模块和鸿蒙系统支持
tags: [xmake, lua, C/C++]
date: 2024-04-22
author: Ruki
---

## 新特性介绍

新版本中，我们新增了鸿蒙系统的 native 工具链支持，并且实现了一种新的 native 原生 lua 模块的导入支持。另外，我们也对构建速度做了很多的优化，效果非常明显。

### 添加鸿蒙 SDK 工具链支持

我们新增了鸿蒙 OS 平台的 native 工具链编译支持：

```bash
$ xmake f -p harmony
```

xmake 也会自动探测默认的 SDK 路径，当然我们也可以指定 Harmony SDK 路径。

```bash
$ xmake f -p Harmony --sdk=/Users/ruki/Library/Huawei/Sdk/...
```

### 添加 native 模块支持

我们知道，在 xmake 中，可以通过 import 接口去导入一些 lua 模块在脚本域中使用，但是如果一些模块的操作比较耗时，那么 lua 实现并不是理想的选择。
因此，新版本中，我们新增了 native lua 模块的支持，可以通过 native 实现，来达到提速优化的效果，并且模块导入和使用，还是跟 lua 模块一样简单。

使用原生模块时，xmake 会进行两段编译，先会自动编译原生模块，后将模块导入 lua 作为库或二进制，而对于用户，仅仅只需要调用 import 导入即可。

#### 定义动态库模块

动态库模块的好处是，不仅仅通过 native 实现了性能加速，另外避免了每次调用额外的子进程创建，因此更加的轻量，速度进一步得到提升。

我们可以先定义一个动态库模块，里面完全支持 lua 的所有 c API，因此我们也可以将一些第三方的开源 lua native 模块直接引入进来使用。

这里我们也有一个完整的导入 lua-cjson 模块的例子可以参考：[native_module_cjson](https://github.com/xmake-io/xmake/tree/master/tests/projects/other/native_module_cjson)

首先，我们先实现 shared 的 native 代码，所以接口通过 lua API 导出。

./modules/foo/foo.c

```c++
#include <xmi.h>

static int c_add(lua_State* lua) {
    int a = lua_tointeger(lua, 1);
    int b = lua_tointeger(lua, 2);
    lua_pushinteger(lua, a + b);
    return 1;
}

static int c_sub(lua_State* lua) {
    int a = lua_tointeger(lua, 1);
    int b = lua_tointeger(lua, 2);
    lua_pushinteger(lua, a - b);
    return 1;
}

int luaopen(foo, lua_State* lua) {
    // 收集add和sub
    static const luaL_Reg funcs[] = {
        {"add", c_add},
        {"sub", c_sub},
        {NULL, NULL}
    };
    lua_newtable(lua);
    // 传递函数列表
    luaL_setfuncs(lua, funcs, 0);
    return 1;
}
```

注意到这里，我们 include 了一个 `xmi.h` 的接口头文件，其实我们也可以直接引入 `lua.h`，`luaconf.h`，效果是一样的，但是会提供更好的跨平台性，内部会自动处理 lua/luajit还有版本间的差异。

然后，我们配置 `add_rules("modules.shared")` 作为 shared native 模块来编译，不需要引入任何其他依赖。

甚至连 lua 的依赖也不需要引入，因为 xmake 主程序已经对其导出了所有的 lua 接口，可直接使用，所以整个模块是非常轻量的。

./modules/foo/xmake.lua

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    -- 指定目标为库lua模块
    add_rules("module.shared")
    add_files("foo.c")
```







#### 定义二进制模块

出了动态库模块，我们还提供了另外一种二进制模块的导入。它其实就是一个可执行文件，每次调用模块接口，都会去调用一次子进程。

那它有什么好处呢，尽管它没有动态库模块那么高效，但是它的模块实现更加的简单，不需要调用 lua API，仅仅只需要处理参数数据，通过 stdout 去输出返回值即可。

另外，相比二进制分发，它是通过源码分发的，因此也解决了跨平台的问题。

具体是使用动态库模块，还是二进制模块，具体看自己的需求，如果想要实现简单，可以考虑二进制模块，如果想要高效，就用动态库模块。

另外，如果需要通过并行执行来提速，也可以使用二进制模块。

./modules/bar/bar.cpp

```c++
#include <stdio.h>
#include <stdlib.h>
#include <cstdlib>

int main(int argc, char** argv) {
    int a = atoi(argv[1]);
    int b = atoi(argv[2]);
    printf("%d", a + b);
    return 0;
}
```

./modules/bar/xmake.lua

```lua
add_rules("mode.debug", "mode.release")

target("add")
    -- 指定目标为二进制lua模块
    add_rules("module.binary")
    add_files("bar.cpp")
```

#### 导入原生模块

对于模块导入，我们仅仅需要调用 import，跟导入 lua 模块的用法完全一致。

./xmake.lua

```lua
add_rules("mode.debug", "mode.release")
-- 添加./modules目录内原生模块
add_moduledirs("modules")

target("test")
    set_kind("phony")
    on_load(function(target)
        import("foo", {always_build = true})
        import("bar")
        print("foo: 1 + 1 = %s", foo.add(1, 1))
        print("foo: 1 - 1 = %s", foo.sub(1, 1))
        print("bar: 1 + 1 = %s", bar.add(1, 1))
    end)
```

由于插件模块的构建是跟主工程完全独立的，因此，native 模块只会被构建一次，如果想要触发增量的插件编译，需要配置上 `always_build = true`，这样，xmake 就会每次检测插件代码是否有改动，如果有改动，会自动增量构建插件。

首次执行效果如下：

```bash
ruki-2:native_module ruki$ xmake
[ 50%]: cache compiling.release src/foo.c
[ 50%]: cache compiling.release src/bar.c
[ 75%]: linking.release libmodule_foo.dylib
[ 75%]: linking.release module_bar
[100%]: build ok, spent 1.296s
foo: 1 + 1 = 2
foo: 1 - 1 = 0
bar: 1 + 1 = 2
[100%]: build ok, spent 0.447s
```

第二次执行，就不会再构建插件，可以直接使用模块：

```bash
ruki-2:native_module ruki$ xmake
foo: 1 + 1 = 2
foo: 1 - 1 = 0
bar: 1 + 1 = 2
[100%]: build ok, spent 0.447s
```

#### 作为 codegen 来使用

通过新的 native 模块特性，我们也可以用来实现 auto-codegen，然后根据自动生成的代码，继续执行后续编译流程。

这里也有完整的例子可以参考：[autogen_shared_module](https://github.com/xmake-io/xmake/tree/master/tests/projects/other/autogen_shared_module)。

### 添加 signal 模块

新版本中，我们还新增了信号注册接口，我们可以在 lua 层，注册 SIGINT 等信号处理函数，来定制化响应逻辑。

#### signal.register

这个接口用于注册信号处理器，目前仅仅支持 SIGINT 信号的处理，同时它也是支持 windows 等主流平台的。

```lua
import("core.base.signal")

function main()
    signal.register(signal.SIGINT, function (signo)
        print("signal.SIGINT(%d)", signo)
    end)
    io.read()
end
```

这对于当一些子进程内部屏蔽了 SIGINT，导致卡死不退出，即使用户按了 `Ctrl+C` 退出了 xmake 进程，它也没有退出时候，
我们就可以通过这种方式去强制退掉它。

```lua
import("core.base.process")
import("core.base.signal")

function main()
    local proc
    signal.register(signal.SIGINT, function (signo)
        print("sigint")
        if proc then
            proc:kill()
        end
    end)
    proc = process.open("./trap.sh")
    if proc then
        proc:wait()
        proc:close()
    end
end
```

关于这个问题的背景，可以参考：[#4889](https://github.com/xmake-io/xmake/issues/4889)

#### signal.ignore

我们也可以通过 `signal.ignore` 这个接口，去忽略屏蔽某个信号的处理。

```lua
signal.ignore(signal.SIGINT)
```

#### signal.reset

我们也可以清除某个信号的处理函数，回退到默认的处理逻辑。

```lua
signal.reset(signal.SIGINT)
```

### 增加对 cppfront/h2 的支持

我们还改进了对 cppfront 的最新版本支持，而新版本的 cppfront 增加了 .h2 头文件的处理，因此我们也增加了对它的支持。

感谢来自 @shaoxie1986 的贡献。、

```lua
add_rules("mode.debug", "mode.release")

add_requires("cppfront")

target("test")
    add_rules("cppfront")
    set_kind("binary")
    add_files("src/*.cpp2")
    add_files("src/*.h2")
    add_packages("cppfront")
```

### 改进构建速度

新版本中，我们还修复一个并行构建相关的问题，经过对调度器的重构，构建速度得到明显的提升，尤其在 cpp 文件编译耗时非常慢的增量编译场景，效果更为明显。

相关背景见：[#4928](https://github.com/xmake-io/xmake/issues/4928)

## 更新日志

### 新特性

* [#4874](https://github.com/xmake-io/xmake/pull/4874): 添加鸿蒙 SDK 支持
* [#4889](https://github.com/xmake-io/xmake/issues/4889): 添加 signal 模块 去注册信号处理
* [#4925](https://github.com/xmake-io/xmake/issues/4925): 添加 native 模块支持
* [#4938](https://github.com/xmake-io/xmake/issues/4938): 增加对 cppfront/h2 的支持

### 改进

* 改进包管理，支持切换 clang-cl
* [#4893](https://github.com/xmake-io/xmake/issues/4893): 改进 rc 头文件依赖检测
* [#4928](https://github.com/xmake-io/xmake/issues/4928): 改进构建和链接速度，增量编译时候效果更加明显
* [#4931](https://github.com/xmake-io/xmake/pull/4931): 更新 pdcurses
* [#4973](https://github.com/xmake-io/xmake/issues/4973): 改进选择脚本的匹配模式

### Bugs 修复

* [#4882](https://github.com/xmake-io/xmake/issues/4882): 修复安装组依赖问题
* [#4877](https://github.com/xmake-io/xmake/issues/4877): 修复 xpack 打包时，unit build 编译失败问题
* [#4887](https://github.com/xmake-io/xmake/issues/4887): 修复 object 依赖链接
