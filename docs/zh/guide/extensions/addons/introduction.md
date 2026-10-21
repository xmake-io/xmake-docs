---
outline: deep
---

# Addons 简介

Addon 扩展的是 **xmake 本身**。包（package）为你的程序提供库，而 addon 为构建工具本身提供新能力：命令、构建规则、工具链、工程模板和 lua 模块。

::: tip 注意
Addon 自 v3.1.1 起支持。建议使用 v3.1.2 或更新版本，其中修复了本地仓库路径和已安装版本选择等问题。
:::

## Addon 能携带什么

一个 addon 可以提供下面这几类*扩展内容*，每一类都是可选的：

| 目录 | 提供的能力 | 使用方式 |
| --- | --- | --- |
| `plugins/` | 一个新的 xmake 命令 | `xmake monitor` |
| `rules/` | 构建规则 | `add_rules("@addon/esp32-devel/app")` |
| `toolchains/` | 工具链 | `set_toolchains("@addon/esp32-devel/esp32")` |
| `templates/` | 工程模板 | `xmake create -t esp32.blink` |
| `modules/` | 可导入的 lua 模块 | `import("@addon.serial-tools.serial")` |
| `includes/` | 可包含的配置片段 | `includes("@addon/esp32-devel/board")` |

所以一个 addon 可以是一整套开发工具包：esp32-devel 携带了交叉工具链、构建规则、烧写逻辑和 blink 模板 —— 装上它，xmake 就变成了 ESP32 的 SDK。

## 同名资源简写

开发版本支持省略与 addon 同名的资源名，完整写法继续兼容：

| 资源 | 简写 | 完整写法 |
| --- | --- | --- |
| 工具链 | `@addon/xclang` | `@addon/xclang/xclang` |
| 规则 | `@addon/demo` | `@addon/demo/demo` |
| 配置片段 | `@addon/demo` | `@addon/demo/demo` |
| 模块 | `@addon.demo` | `@addon.demo.demo` |

例如，使用 xclang addon 的同名工具链并绑定 SDK 包：

```lua
add_addons("xclang")
add_requires("xclang")

target("hello")
    set_kind("binary")
    set_toolchains("@addon/xclang", {packages = "xclang"})
    add_files("src/main.cpp")
```

工具链配置（如 `@addon/xclang[sdkdir=/path/to/sdk]`）和包后缀（如 `@addon/xclang@xclang`）仍可使用。
省略的资源名固定展开为 addon 名；引用其他名称的资源时，继续使用完整路径。

## 整体架构

```
                       xmake-repo                     github / 本地目录
                     addons/e/esp32-devel/xmake.lua   github:user/my-addon
                                    │
                     xmake addon --install <name>
                                    ↓
     ~/.xmake/addons/<name>/<version>/{plugins,rules,toolchains,templates,modules,includes}
     ~/.xmake/addons/addons.conf     ← 启动时读取的注册表
                                    ↓
                        工程按需引用其中的扩展内容
             add_addons("esp32-devel")  +  @addon/esp32-devel/app
```

这个结构带来三个特性：

**按用户安装一次。** Addon 装在 `~/.xmake/addons`，不在工程里。多个工程共享同一份安装，而注册表文件让 xmake 不必每次运行都去扫描目录。

**扩展内容是带命名空间的。** 规则、工具链、includes 和模块统一通过 `@addon/<name>/...` 引用，所以两个 addon 永远不会撞车。插件和模板是例外 —— 命令名是全局的，因此 xmake 会拒绝那些会覆盖别的 addon 命令的安装。

**Addon 自己定义自己的名字。** 名字写在 addon 仓库的 `addon.lua` 里，所以它不依赖仓库名，也不依赖分发它的那个包名。

```lua
-- addon.lua
addon("esp32-devel")
    set_homepage("https://github.com/xmake-addons/esp32-devel")
    set_description("The ESP32 development addon.")
    set_license("Apache-2.0")
    set_sourcedir("src")
    add_deps("serial-tools")
```

## Addon、插件和包的区别

| | 安装方式 | 安装位置 | 扩展的是 |
| --- | --- | --- | --- |
| 包 | `add_requires` / `xrepo install` | `~/.xmake/packages` | 你的**程序**（库、头文件、工具） |
| 插件（旧） | `xmake plugin --install` | `~/.xmake/plugins` | xmake，仅命令 |
| Addon | `xmake addon --install` / `add_addons` | `~/.xmake/addons` | xmake，所有扩展类型 |

Addon 以 `set_kind("addon")` 的包形式分发，所以完整复用了包的基础设施：仓库、版本、sha256 校验、依赖关系和 `xrepo` 的下载逻辑。

## 下一步

- [安装和使用](/zh/guide/extensions/addons/installation) —— `xmake addon` 的各个子命令和 `add_addons`
- [编写 Addon](/zh/guide/extensions/addons/development) —— manifest、扩展目录和提交到 xmake-repo
- [xmake-harness](/zh/guide/extensions/addons/official/xmake-harness) —— AI Agent 扩展包 `xmake ai`
