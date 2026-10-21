---
title: "Xmake C++ 实战：构建静态库并链接可执行程序"
description: "通过完整 C++ 示例学习 Xmake 静态库构建、add_deps 目标依赖、公共头文件目录，以及 debug/release 编译与运行，附常见错误排查。"
---

# Xmake C++ 实战：构建静态库并链接可执行程序

这个示例将可复用的 C++ 代码拆分成静态库，再链接到可执行程序，帮助你理解 `add_deps`、公共头文件目录，以及 debug/release 构建。示例不依赖第三方库。

开始前请先[安装 Xmake 和 C++ 编译器](/zh/guide/quick-start#installation)：Windows 可使用 MSVC，macOS 使用 Clang，Linux 使用 GCC 或 Clang。各平台共用配置和命令，但仍需针对目标平台与架构分别编译。

## 创建文件

创建如下目录结构：

```text
hello-library/
├── xmake.lua
├── include/
│   └── calculator.h
└── src/
    ├── calculator.cpp
    └── main.cpp
```

`include/calculator.h`：

```cpp
#pragma once
int add(int a, int b);
```

`src/calculator.cpp`：

```cpp
#include "calculator.h"

int add(int a, int b) {
    return a + b;
}
```

`src/main.cpp`：

```cpp
#include "calculator.h"
#include <iostream>

int main() {
    std::cout << "2 + 3 = " << add(2, 3) << '\n';
    return 0;
}
```

## 配置静态库与可执行程序

在工程根目录创建 `xmake.lua`：

```lua
set_project("hello-library")
set_languages("c++17")
add_rules("mode.debug", "mode.release")

target("calculator")
    set_kind("static")
    add_files("src/calculator.cpp")
    add_includedirs("include", {public = true})

target("hello")
    set_kind("binary")
    add_files("src/main.cpp")
    add_deps("calculator")
```

- `set_kind("static")` 将可复用代码构建成静态库。
- `add_deps("calculator")` 确保先构建静态库，再将其链接到 `hello`。
- `{public = true}` 让依赖此库的目标自动获得头文件搜索目录，无需在 `hello` 中重复配置。

如果依赖的是外部包，而不是本工程里的库目标，请使用 [add_requires 和 add_packages](/zh/guide/project-configuration/add-packages)。

## 构建与运行

在 `hello-library` 目录下执行：

```sh
xmake f -m debug
xmake
xmake run hello
```

预期输出：

```text
2 + 3 = 5
```

切换到 release 模式，仍然使用同一份工程配置：

```sh
xmake f -m release
xmake
xmake run hello
```

`xmake run` 会查找当前配置对应的可执行文件，无需写死各平台的输出路径。工具链与目标架构等选项见[构建配置](/zh/guide/basic-commands/build-configuration)。

## 常见问题

| 现象 | 排查方法 |
| --- | --- |
| 找不到 C++ 编译器 | 安装编译器，并检查[工具链选择](/zh/guide/basic-commands/switch-toolchains)。安装 Xmake 不等于安装了所有平台 SDK。 |
| 找不到 `calculator.h` | 检查目录结构，以及 `calculator` 目标的公共头文件目录配置。 |
| `add` 出现 undefined reference 或无法解析的外部符号 | 确认静态库包含 `calculator.cpp`，并且 `hello` 声明了 `add_deps("calculator")`。 |
| `main` 重复定义 | 只将 `main.cpp` 加入可执行程序目标，不要将全部源码同时加入两个目标。 |

构建失败时可运行 `xmake -vD`，查看实际的编译与链接命令。

## 下一步

- [C++ 工程示例](/zh/examples/cpp/basic)：查看更多静态库与可执行程序配置。
- [使用官方依赖包](/zh/guide/package-management/using-official-packages)：接入外部 C/C++ 依赖。
- [交叉编译](/zh/guide/basic-commands/cross-compilation)：配置其他目标平台与工具链。
- [构建性能优化](/zh/guide/best-practices/performance)：了解缓存与并行编译。
