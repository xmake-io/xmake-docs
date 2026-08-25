---
title: Xmake v3.1.1 预览，Addons 扩展 Xmake 自身
tags: [xmake, addon, plugin, toolchain, template, ai]
date: 2026-08-24
author: Ruki
outline: deep
---

这是 dev 分支上的改动预览，尚未正式发布。

这个周期的主角是 **addons**。v3.1.0 重构了 `xmake plugin`，让插件能像包一样分发；addons 把这件事做到底：一个 addon 不只能携带插件，还能携带规则、工具链、工程模板、lua 模块和 includes 文件 —— 一整套开发工具包，一条命令装好，或者由工程声明后自动安装。

除此之外，还新增了 `package.host.install_locally` 策略、新的交叉编译架构、重构后的模板分发，以及 BSD 的 `pkg` 包管理器支持。

## 新特性

### Addons 扩展包

Addon 扩展的是 **xmake 自身**。包为你的程序提供库，而 addon 为构建工具本身提供新能力。

```sh
$ xmake addon --install esp32-devel
$ xmake create -t esp32.blink -l c blink
$ cd blink
$ xmake f --board=esp32c3
$ xmake
$ xmake install                       # 烧写到板子
```

这五行就是完整的 ESP32 开发流程：交叉工具链、构建规则、烧写逻辑和工程模板，全都来自这个 addon。

#### Addon 能携带什么

每种载荷都是可选的，addon 只携带它真正提供的那些：

| 载荷 | 变成什么 | 怎么用 |
| --- | --- | --- |
| `plugins/` | 新的 xmake 命令 | `xmake monitor` |
| `rules/` | 构建规则 | `add_rules("@addon/esp32-devel/app")` |
| `toolchains/` | 工具链 | `set_toolchains("@addon/esp32-devel/esp32")` |
| `templates/` | 工程模板 | `xmake create -t esp32.blink` |
| `modules/` | 可导入的 lua 模块 | `import("@addon.serial-tools.serial")` |
| `includes/` | 可包含的配置片段 | `includes("@addon/esp32-devel/board")` |

载荷统一通过 `@addon/<name>/...` 引用，带命名空间，所以两个 addon 不会撞车。插件和模板是例外 —— 命令名是全局的 —— 会覆盖别的 addon 命令的安装会被直接拒绝。

#### 管理 addon

```sh
$ xmake addon --install esp32-devel                      # 从仓库索引安装
$ xmake addon --install github:xmake-addons/esp32-devel  # 从 github 安装，支持 `#branch`
$ xmake addon --install https://github.com/user/repo.git # 从任意 git url 安装
$ xmake addon --install /path/to/my-addon                # 从本地目录安装

$ xmake addon --list
$ xmake addon --search esp32
$ xmake addon --remove esp32-devel
$ xmake addon --upgrade
```

#### 在工程里声明

工程可以声明自己需要什么，这样别人克隆下来不用手动装任何东西 —— 加载工程时 xmake 会自动拉取缺失的 addon：

```lua
add_addons("esp32-devel 1.0.x")

includes("@addon/esp32-devel/board")

target("blink")
    add_rules("@addon/esp32-devel/app")
    add_files("src/*.c")
```

解析出来的版本会写进 `xmake.lua` 旁边的 `xmake-addons.lock`，保证所有人构建时用的是同一批版本。

#### 编写 addon

一个 addon 就是一个目录：一份 manifest 加若干载荷目录 —— 没有构建步骤，也不用注册：

```
my-addon/
├── addon.lua
└── src/
    ├── plugins/hello/
    ├── rules/app/
    ├── toolchains/mycc/
    ├── modules/
    ├── includes/board/
    └── templates/c/foo/
```

```lua
-- addon.lua
addon("my-addon")
    set_homepage("https://github.com/me/my-addon")
    set_description("这个 addon 提供什么，一句话说清。")
    set_license("Apache-2.0")
    set_sourcedir("src")
    add_deps("serial-tools")
```

Addon 在 manifest 里给自己命名，所以名字不依赖仓库名，也不依赖分发它的包名。在 addon 内部，一律用 `@self` 引用自己：

```lua
import("@self.private.board")
```

测试方式和用户的安装路径完全一致：

```sh
$ xmake addon --install .
$ xmake addon --remove my-addon
```

#### 提交到 xmake-repo

Addon 放在 `addons/<首字母>/<name>/xmake.lua`，和 C/C++ 包并列，完整复用包的基础设施 —— 版本、sha256 校验、依赖、镜像：

```lua
package("my-addon")
    set_kind("addon")
    set_homepage("https://github.com/me/my-addon")
    set_description("这个 addon 提供什么，一句话说清。")
    set_license("Apache-2.0")

    add_urls("https://github.com/me/my-addon/archive/refs/tags/$(version).tar.gz",
             "https://github.com/me/my-addon.git")
    add_versions("v1.0.0", "<sha256>")

    add_deps("serial-tools", {kind = "addon"})

    on_test(function (package)
        assert(package:has_addon({rules = "app", toolchains = "mycc"}))
    end)
```

#### Addon 接口速览

三个地方，几个接口而已：

```lua
-- 1. xmake.lua 里，声明工程需要什么
add_addons("esp32-devel 1.0.x")
```

```lua
-- 2. addon.lua 里，声明这个 addon 是什么
addon("my-addon")
    set_description("...")      -- `xmake addon --list` 会显示
    set_homepage("...")
    set_license("Apache-2.0")
    set_sourcedir("src")        -- 仓库内的载荷根目录
    add_deps("serial-tools")    -- 依赖的其它 addon
    add_globalmodules("detect.tools.find_avrdude")  -- 仅用于 xmake 按名字查找的那些地方
```

```lua
-- 3. xmake-repo 的 recipe 里，声明它怎么分发
package("my-addon")
    set_kind("addon")
    add_versions("v1.0.0", "<sha256>")
    add_deps("serial-tools", {kind = "addon"})
    on_test(function (package)
        assert(package:has_addon({rules = "app", toolchains = "mycc"}))
    end)
```

脚本里则通过 `core.package.addon` 查询运行期信息：

```lua
import("core.package.addon")

addon.owner()          -- 当前脚本属于哪个 addon
addon.addons()         -- 已安装的 addon 及其载荷
addon.versions("yaml") -- 某个 addon 已安装的版本
addon.installdir()     -- ~/.xmake/addons
```

#### 为什么载荷要带命名空间

Addon 提供的一切都通过 `@addon/<name>/...` 或 `@addon.<name>.<module>` 访问，不存在裸名字。两个 addon 各自带一个叫 `app` 的规则也不会出问题。真正全局的只有命令名和模板 id，所以安装时也只检查这两类的冲突。

在 addon 内部，代码用 `@self` 引用自己，因此 addon 永远不需要硬编码自己的名字 —— 把 addon 挪到另一个仓库也不用改任何东西。

#### Addon 可以自带 package 定义

工具链类 addon 需要二进制。与其让用户自己去装，不如由 addon 携带 package 定义，再通过 includes 文件暴露出来：

```lua
-- src/includes/packages/xmake.lua
package("avr-gcc")
    set_kind("toolchain")
    add_urls("https://.../avr-gcc-$(version).tar.bz2")
    add_versions("7.3.0", "<sha256>")
    on_install(function (package)
        os.cp("*", package:installdir())
    end)
package_end()
```

```lua
-- src/includes/board/xmake.lua
includes("../packages")
option("board", {default = "uno", description = "Set the target board."})
add_requires("avr-gcc", "avrdude")
```

工程侧只写一行 `includes("@addon/avr-devel/board")`，选项、工具链和烧写工具就都有了。

#### 已有的官方 addon

第一批已经进了 xmake-repo：

| Addon | 提供什么 |
| --- | --- |
| `esp32-devel` | ESP32 的工具链、构建规则、烧写和 blink 模板 |
| `avr-devel` | 8 位 AVR 板子（uno / nano / mega2560）的同一套东西 |
| `serial-tools` | `xmake monitor` 命令，以及供其它 addon 复用的串口模块 |
| `yaml` | 纯 lua 实现的 yaml 解析器和生成器，外加命令行工具 |
| `xmake-harness` | `xmake ai`，用 xmake lua 写的终端编码助手 |
| `format-plugin` / `doxygen-plugin` / `macro-plugin` | 原来的内置命令 |
| `basic-templates` | 依赖外部 SDK 的模板（sdl、qt、verilator） |

### xmake ai：用 xmake lua 写的 Agent

[xmake-harness](https://github.com/xmake-addons/xmake-harness) 这个 addon 展示了这套机制能走多远：一个完整的 AI Agent 框架 —— 会话记录、agent 主循环、工具管线、权限策略、沙箱、skills、子 agent、斜杠命令和终端 UI —— 全部用 xmake lua 编写，没有任何第三方依赖。装上它就有了 `xmake ai`：

```sh
$ xmake addon --install xmake-harness
$ xmake ai --setup                     # 选服务商、填 api key、选模型
$ xmake ai                             # 交互式界面
$ xmake ai "给 foo 加个单元测试"
$ xmake ai --print "这个工程构建出什么？"   # 非交互，适合脚本和 CI
```

它本身就是 xmake addon，所以天然了解所在的工程 —— 而且执行构建时不会把输出塞进模型上下文：

```
/xmake build                 直接在这里执行 xmake，输出进你的终端
/xmakedocs                   拉取 xmake 文档，方便它查 API
/skills install xmake        加载 xmake-skills
/model deepseek-reasoner     切换模型
/context                     看看上下文都被什么占了
```

权限模式决定它能自作主张到什么程度：

```sh
$ xmake ai --mode=plan           # 只读，先规划
$ xmake ai --mode=acceptedits    # 自动接受文件修改，执行命令仍然询问
$ xmake ai --sandbox             # 在沙箱里执行命令
```

![终端里的 xmake ai](/assets/img/harness/xmake-ai-tui.png)

#### 浏览器里

同一个 agent 也能以 web 界面运行：

```sh
$ xmake ai --web
$ xmake ai --web --port=9800 --cwd=/path/to/project
```

它在回环地址上起一个小 http 服务，打印带 token 的 url（每次运行重新生成）并打开浏览器。背后是同一个 harness —— 同样的工具、skills、权限模式和会话文件 —— 所以它是第二个前端，不是第二个 agent；打开时进入的也是这个工程的上一次会话，而不是空会话。

![web 界面：对话](/assets/img/harness/xmake-ai-web-chat.png)

改动那一屏列的是*这次对话*改过的文件（不是工作区），右边是 diff，每个文件上有勾和叉决定保留还是打回：

![web 界面：改动](/assets/img/harness/xmake-ai-web-changes.png)

#### 配置

配置由五层合并而成 —— 内置默认值、`~/.xmake/harness/config.json`、工程配置、`XMAKE_HARNESS_*` 环境变量、命令行参数。只有用户这一层会被写入，所以 **api key 永远不会落进工程仓库**：

```sh
$ xmake ai --config=providers.deepseek.apikey=sk-xxxxxx
$ xmake ai --provider=deepseek --model=deepseek-chat
$ xmake ai --smallmodel=deepseek-chat    # 用于标题、摘要和轻量子 agent
$ xmake ai --showconfig
$ xmake ai --doctor                      # 缺什么一看便知
```

内置服务商有 `deepseek`（默认）、`anthropic`、`openai`、`moonshot`、`dashscope`、`siliconflow`、`openrouter` 和 `zhipu`；任何 OpenAI 兼容接口配上 `baseurl` 也能用。

#### 会话和 skills

```sh
$ xmake ai -c                            # 继续当前目录的上一次会话
$ xmake ai -r                            # 交互式选择要恢复的会话
$ xmake ai --new                         # 强制开新会话
$ xmake ai --list=skills                 # 还可以是 agents、tools、commands、providers、sessions
$ xmake ai --command=doctor              # 不进 TUI 直接执行一条斜杠命令
```

Skills 只在你主动要求时才拉取，[xmake-skills](https://github.com/xmake-io/xmake-skills) 就是教它 xmake 的那个包：

```
/skills install xmake
```

配置分层、支持的服务商和完整命令列表见 [xmake-harness](/zh/guide/extensions/addons/official/xmake-harness)。

### format / doxygen / macro 插件迁移为 addon

这三个命令原本内置在 xmake 里，但大多数用户从来不用。现在它们是 addon 了：

```sh
$ xmake addon --install format-plugin
$ xmake addon --install doxygen-plugin
$ xmake addon --install macro-plugin
```

内置版本仍然可用，但会打印废弃提示；装了 addon 之后由 addon 接管命令 —— 任务搜索路径里 addon 目录现在排在前面。

### package.host.install_locally

`package.install_locally` 会把工程的包装在 `build/.packages` 而不是 `~/.xmake/packages`。但它对**所有**包生效，包括交叉工具链 —— 那些体积大、跨工程复用、而且和工程配置无关的东西。

现在它只影响平台侧的包。主机工具 —— 也就是 xmake 认定的 host 包，比如工具链 —— 仍然装在全局，并且有了自己的策略：

```lua
set_policy("package.install_locally", true)        -- 库包 -> build/.packages
set_policy("package.host.install_locally", true)   -- 如果你确实想让工具链也进本地
```

这样嵌入式常见的诉求终于能直接表达：源码包留在工程里，交叉工具链下载一次、反复复用。

### 新的交叉编译架构

为 cross 和 linux 平台新增了一批架构，例如 SPARC64。

### 重构模板分发

模板目录做了重新组织，分发方式也重构了 —— 这正是 addon 的 `templates/` 载荷得以成立的基础：`xmake create -t esp32.blink` 来自 addon，而不是 xmake 安装包本身。

### BSD 的 pkg 包管理器

`pkg` 成为受支持的系统包管理器，FreeBSD 及其衍生系统上的 `find_package` 和包回退查找不用再绕路了。

## 改进

### 包的向量扩展传递给使用者

包声明的向量扩展（`add_vectorexts`）现在会传递给使用它的目标，包括通过组件传递 —— 链接了 avx2 构建的包，目标就能拿到 avx2 的编译选项。

### hlsl2spv / glsl2spv 提前到模块扫描之前

着色器规则现在在 C++ 模块扫描之前执行，扫描器读到的时候生成的头文件已经就位。

### Core

interpreter 的 includes 解析、工程加载、搜索缓存和 semver 都做了一轮改进，同时收紧了 addon 导出全局模块的冲突检查 —— addon 不能再覆盖 xmake 自身的模块。

## 更新日志

### 新特性

* [#7696](https://github.com/xmake-io/xmake/pull/7696): 添加 addons 支持，可以用插件、规则、工具链、模板、模块和 includes 文件扩展 xmake
* [#7702](https://github.com/xmake-io/xmake/pull/7702): 自动安装工程声明的 addon，并用 `xmake-addons.lock` 锁定版本
* [#7714](https://github.com/xmake-io/xmake/pull/7714): 支持在 `xmake.lua` 中使用 `add_addons(...)`
* [#7706](https://github.com/xmake-io/xmake/pull/7706): 添加 addon 测试
* [#7707](https://github.com/xmake-io/xmake/pull/7707): 添加 addon 分发 package 定义的测试
* [#7717](https://github.com/xmake-io/xmake/pull/7717): 将 `format` / `doxygen` / `macro` 插件迁移为 addon
* [#7723](https://github.com/xmake-io/xmake/pull/7723): 添加新的交叉编译架构，例如 SPARC64
* [#7721](https://github.com/xmake-io/xmake/pull/7721): 添加 `package.host.install_locally` 策略
* [#7699](https://github.com/xmake-io/xmake/pull/7699): 重构模板目录和模板分发
* 添加 BSD 的 `pkg` 包管理器支持

### 改进

* [#7719](https://github.com/xmake-io/xmake/pull/7719): 将包的向量扩展配置传递给使用它的目标
* [#7713](https://github.com/xmake-io/xmake/pull/7713): 让 `hlsl2spv` / `glsl2spv` 在 C++ 模块扫描之前执行
* [#7722](https://github.com/xmake-io/xmake/pull/7722): 改进 interpreter、工程加载、搜索缓存和 semver
* [#7733](https://github.com/xmake-io/xmake/pull/7733): 检查 addon 全局模块的命名冲突

### Bug 修复

* [#7710](https://github.com/xmake-io/xmake/pull/7710): 修复 `.lib` 结尾的库名被错误裁剪的问题
* [#7709](https://github.com/xmake-io/xmake/pull/7709): 修复 clang 的 runtime flags 检测
* [#7703](https://github.com/xmake-io/xmake/pull/7703): 修复 wix 传递 `-arch` 时无法识别 `x86_64` 的问题
* [#7701](https://github.com/xmake-io/xmake/pull/7701): 修复依赖检测无法发现嵌套值追加的问题
* [#7698](https://github.com/xmake-io/xmake/pull/7698): 修复 semver 的版本选择和 build metadata 排序
