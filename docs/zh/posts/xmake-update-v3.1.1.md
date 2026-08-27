---
title: Xmake v3.1.1 发布，Addons 扩展 Xmake 自身
tags: [xmake, addon, plugin, toolchain, template, ai]
date: 2026-08-27
author: Ruki
outline: deep
---

在此版本中，我们新增了 addons 扩展支持。上个版本我们重构了 `xmake plugin`，让插件可以像包一样分发，而 addons 把这件事做得更彻底：一个 addon 不仅可以携带插件，还能携带规则、工具链、工程模板、lua 模块和 includes 文件，相当于一整套开发工具包，一条命令就能装好，也可以由工程声明后自动安装。

此外，我们还新增了 `package.host.install_locally` 策略和一批新的交叉编译架构，重构了模板的分发方式，并且新增了 BSD 上的 `pkg` 包管理器支持。

## 新特性介绍

### Addons 扩展支持

我们平时用的包，提供的是程序要链接的库，而 addon 扩展的是 xmake 本身，给构建工具增加新的能力。

```sh
$ xmake addon --install esp32-devel
$ xmake create -t esp32.blink -l c blink
$ cd blink
$ xmake f --board=esp32c3
$ xmake
$ xmake install                       # 烧写到板子
```

整个 ESP32 的开发流程就这几行，交叉工具链、构建规则、烧写逻辑和工程模板，全部由这个 addon 提供，用户不需要再单独去装任何东西。

#### 一个 addon 可以提供什么

下面这几类扩展内容都是可选的，addon 提供哪些就带哪些：

| 目录 | 提供的能力 | 使用方式 |
| --- | --- | --- |
| `plugins/` | 新的 xmake 命令 | `xmake monitor` |
| `rules/` | 构建规则 | `add_rules("@addon/esp32-devel/app")` |
| `toolchains/` | 工具链 | `set_toolchains("@addon/esp32-devel/esp32")` |
| `templates/` | 工程模板 | `xmake create -t esp32.blink` |
| `modules/` | 可导入的 lua 模块 | `import("@addon.serial-tools.serial")` |
| `includes/` | 可包含的配置片段 | `includes("@addon/esp32-devel/board")` |

这些扩展内容都是带命名空间的，统一通过 `@addon/<name>/...` 来引用，所以两个 addon 即使提供了同名的规则也不会冲突。只有插件和模板是例外，因为命令名和模板 id 是全局的，如果安装的 addon 会覆盖掉别的 addon 的命令，xmake 会直接拒绝。

#### addon 的管理

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

工程也可以直接声明自己需要哪些 addon，这样别人克隆下来就不用手动安装了，加载工程的时候，xmake 会自动把缺失的 addon 拉下来：

```lua
add_addons("esp32-devel 1.0.x")

includes("@addon/esp32-devel/board")

target("blink")
    add_rules("@addon/esp32-devel/app")
    add_files("src/*.c")
```

最终解析出来的版本会记录到 `xmake.lua` 同级目录下的 `xmake-addons.lock` 中，保证团队里每个人构建时用的都是同一批版本。

#### 编写 addon

一个 addon 其实就是一个目录，一份 manifest 加上若干扩展目录，不需要编译，也不需要注册：

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
    set_description("这个 addon 的功能描述")
    set_license("Apache-2.0")
    set_sourcedir("src")
    add_deps("serial-tools")
```

addon 的名字是在 manifest 里自己定的，跟仓库名、跟分发它的包名都没有关系。而在 addon 内部，引用自己的东西统一用 `@self`：

```lua
import("@self.private.board")
```

开发的时候，可以直接从本地目录安装来测试，走的是和用户完全一样的安装流程：

```sh
$ xmake addon --install .
$ xmake addon --remove my-addon
```

#### 提交到 xmake-repo

addon 放在 `addons/<首字母>/<name>/xmake.lua` 下，和 C/C++ 包平级，版本管理、sha256 校验、依赖、镜像下载这些包已有的能力，addon 都可以直接复用：

```lua
package("my-addon")
    set_kind("addon")
    set_homepage("https://github.com/me/my-addon")
    set_description("这个 addon 的功能描述")
    set_license("Apache-2.0")

    add_urls("https://github.com/me/my-addon/archive/refs/tags/$(version).tar.gz",
             "https://github.com/me/my-addon.git")
    add_versions("v1.0.0", "<sha256>")

    add_deps("serial-tools", {kind = "addon"})

    on_test(function (package)
        assert(package:has_addon({rules = "app", toolchains = "mycc"}))
    end)
```

#### 相关接口

addon 相关的接口不多，主要就是下面三个地方：

```lua
-- 1. 在 xmake.lua 中，声明工程需要哪些 addon
add_addons("esp32-devel 1.0.x")
```

```lua
-- 2. 在 addon.lua 中，声明这个 addon 自身的信息
addon("my-addon")
    set_description("...")      -- `xmake addon --list` 会显示
    set_homepage("...")
    set_license("Apache-2.0")
    set_sourcedir("src")        -- 仓库内存放扩展目录的根目录
    add_deps("serial-tools")    -- 依赖的其他 addon
    add_globalmodules("detect.tools.find_avrdude")  -- 只有需要被 xmake 按名字查找的模块才用得上
```

```lua
-- 3. 在 xmake-repo 的包配置中，声明它如何分发
package("my-addon")
    set_kind("addon")
    add_versions("v1.0.0", "<sha256>")
    add_deps("serial-tools", {kind = "addon"})
    on_test(function (package)
        assert(package:has_addon({rules = "app", toolchains = "mycc"}))
    end)
```

如果要在脚本里查询运行期的信息，可以用 `core.package.addon` 模块：

```lua
import("core.package.addon")

addon.owner()          -- 当前脚本属于哪个 addon
addon.addons()         -- 已安装的 addon 及其提供的扩展
addon.versions("yaml") -- 某个 addon 已安装的版本
addon.installdir()     -- ~/.xmake/addons
```

#### 为什么要带命名空间

addon 提供的所有东西，都要通过 `@addon/<name>/...` 或者 `@addon.<name>.<module>` 来访问，不存在直接用裸名字引用的情况。这样一来，两个 addon 各自提供一个叫 `app` 的规则也不会有任何问题。真正全局的只有命令名和模板 id，所以我们在安装时也只检查这两类的冲突。

而在 addon 自己的代码里，一律用 `@self` 引用自身，addon 就不用把自己的名字硬编码进去，以后换个仓库、改个名字，内部代码都不用动。

#### addon 可以自带包定义

工具链类的 addon 通常还需要对应的二进制工具，与其让用户自己去装，不如让 addon 把包定义一起带上，再通过 includes 文件暴露给工程：

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

工程里只需要 `includes("@addon/avr-devel/board")` 一行，配置选项、工具链和烧写工具就都齐了。

#### 目前提供的官方 addon

第一批 addon 已经进了 xmake-repo：

| Addon | 说明 |
| --- | --- |
| `esp32-devel` | ESP32 的工具链、构建规则、烧写和 blink 模板 |
| `avr-devel` | 8 位 AVR 板子（uno / nano / mega2560）的工具链、规则和模板 |
| `serial-tools` | `xmake monitor` 命令，以及可供其他 addon 复用的串口模块 |
| `yaml` | 纯 lua 实现的 yaml 解析和生成模块，另外还提供了命令行工具 |
| `xmake-harness` | `xmake ai`，用 xmake lua 写的终端编码助手 |
| `format-plugin` / `doxygen-plugin` / `macro-plugin` | 原来的几个内置命令 |
| `basic-templates` | 依赖外部 SDK 的工程模板（sdl、qt、verilator） |

### xmake ai，用 xmake lua 写的 AI 助手

[xmake-harness](https://github.com/xmake-addons/xmake-harness) 这个 addon 算是把 addon 的能力用到了极致，它是一个完整的 AI Agent 框架，会话记录、agent 主循环、工具管线、权限策略、沙箱、skills、子 agent、斜杠命令和终端 UI，全部用 xmake lua 实现，没有任何第三方依赖。装上之后就多了一个 `xmake ai` 命令：

```sh
$ xmake addon --install xmake-harness
$ xmake ai --setup                     # 选服务商、填 api key、选模型
$ xmake ai                             # 交互式界面
$ xmake ai "给 foo 加个单元测试"
$ xmake ai --print "这个工程构建出什么？"   # 非交互模式，适合脚本和 CI
```

因为它本身就是一个 xmake addon，所以对所在的工程是了解的，而且让它执行构建时，输出会直接打到终端，不会占用模型的上下文：

```
/xmake build                 直接执行 xmake 构建，输出打到终端
/xmakedocs                   拉取 xmake 文档，方便它查接口
/skills install xmake        加载 xmake-skills
/model deepseek-reasoner     切换模型
/context                     查看上下文的占用情况
```

另外还可以用权限模式来控制它的自由度：

```sh
$ xmake ai --mode=plan           # 只读，先规划
$ xmake ai --mode=acceptedits    # 自动接受文件修改，执行命令仍然询问
$ xmake ai --sandbox             # 在沙箱里执行命令
```

![终端里的 xmake ai](/assets/img/harness/xmake-ai-tui.png)

#### web 界面

除了终端，同一个 agent 也可以跑在浏览器里：

```sh
$ xmake ai --web
$ xmake ai --web --port=9800 --cwd=/path/to/project
```

它会在本地回环地址上起一个 http 服务，打印一个带 token 的 url（每次运行都会重新生成），然后打开浏览器。后面跑的是同一个 harness，工具、skills、权限模式和会话文件都是同一套，所以它只是换了个前端，并不是另一个 agent。打开时进入的也是这个工程上一次的会话，而不是空会话。

![web 界面：对话](/assets/img/harness/xmake-ai-web-chat.png)

刚打开时是一个占满整屏的对话界面，当你去看它改了哪些文件时，界面会展开成一个工作区，左边是对话，中间是文件内容，这次对话改过的地方会标注在上面，右边则是工程的文件树。中间的文件可以直接编辑，页面里写文件和 agent 写文件走的是同一套流程：

![web 界面：工作区](/assets/img/harness/xmake-ai-web-workspace.png)

#### 配置

配置是分层合并的，一共五层，依次是内置默认值、`~/.xmake/harness/config.json`、工程配置、`XMAKE_HARNESS_*` 环境变量和命令行参数。写入时只会写用户那一层，所以 api key 不会被误提交到工程仓库里：

```sh
$ xmake ai --config=providers.deepseek.apikey=sk-xxxxxx
$ xmake ai --provider=deepseek --model=deepseek-chat
$ xmake ai --smallmodel=deepseek-chat    # 用于标题、摘要和轻量子 agent
$ xmake ai --showconfig
$ xmake ai --doctor                      # 检查当前配置缺了什么
```

内置支持的服务商有 `deepseek`（默认）、`anthropic`、`openai`、`moonshot`、`dashscope`、`siliconflow`、`openrouter` 和 `zhipu`，其他 OpenAI 接口兼容的服务，配置一下 `baseurl` 也可以直接用。

#### 会话和 skills

```sh
$ xmake ai -c                            # 继续当前目录的上一次会话
$ xmake ai -r                            # 交互式选择要恢复的会话
$ xmake ai --new                         # 强制开新会话
$ xmake ai --list=skills                 # 还可以是 agents、tools、commands、providers、sessions
$ xmake ai --command=doctor              # 不进 TUI 直接执行一条斜杠命令
```

skills 不会自动拉取，只有你主动装了才会加载。其中 [xmake-skills](https://github.com/xmake-io/xmake-skills) 就是专门教它怎么用 xmake 的：

```
/skills install xmake
```

更完整的配置说明、服务商列表和命令列表，可以看 [xmake-harness](/zh/guide/extensions/addons/official/xmake-harness) 文档。

### format / doxygen / macro 插件迁移为 addon

这三个命令原本是内置在 xmake 里的，但大部分用户其实用不到，现在把它们拆成了独立的 addon：

```sh
$ xmake addon --install format-plugin
$ xmake addon --install doxygen-plugin
$ xmake addon --install macro-plugin
```

内置的版本暂时还保留着，只是会打印一个废弃提示。装了对应 addon 之后，命令就由 addon 接管了，因为任务的搜索路径中，addon 目录现在排在内置插件前面。

### package.host.install_locally 策略

`package.install_locally` 可以把工程用到的包装到 `build/.packages` 下，而不是全局的 `~/.xmake/packages`。但之前它对所有包都生效，包括交叉工具链在内，而工具链这类包体积大、可以跨工程复用，又和工程配置无关，装到本地并不合适。

现在这个策略只影响平台侧的包了，主机侧的包（也就是 xmake 判定的 host 包，比如工具链）仍然装在全局，如果确实需要，可以用新加的策略单独控制：

```lua
set_policy("package.install_locally", true)        -- 库包 -> build/.packages
set_policy("package.host.install_locally", true)   -- 如果你确实想让工具链也进本地
```

这样嵌入式开发中最常见的那个需求就能直接表达了：源码包跟着工程走，交叉工具链下载一次到处复用。

### 新增交叉编译架构

为 cross 和 linux 平台新增了一批架构支持，比如 SPARC64。

### 重构模板分发

我们重新组织了模板目录，也重构了模板的分发方式，addon 的 `templates/` 目录正是基于这个改动才能实现，`xmake create -t esp32.blink` 这个模板来自 addon，而不是 xmake 安装包自带的。

### BSD 的 pkg 包管理器

新增了 `pkg` 系统包管理器支持，FreeBSD 及其衍生系统上安装缺失的系统库时会走它。

## 改进

### 包的向量扩展传递给使用者

包里声明的向量扩展（`add_vectorexts`）现在会传递给使用它的目标，通过组件引入的也一样。比如链接了一个用 avx2 构建的包，目标就能自动拿到对应的编译选项。

### hlsl2spv / glsl2spv 提前到模块扫描之前

着色器规则现在会在 C++ 模块扫描之前执行，这样扫描器读取的时候，生成的头文件已经准备好了。

### 核心改进

这个版本对 interpreter 的 includes 解析、工程加载、搜索缓存和 semver 都做了一轮改进。另外还收紧了 addon 导出全局模块时的冲突检查，addon 不能再覆盖 xmake 自身的模块。

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
* [#7726](https://github.com/xmake-io/xmake/pull/7726): 改进 mingw 工具链对 clang 和 libc++ 的支持

### Bug 修复

* [#7737](https://github.com/xmake-io/xmake/pull/7737): 修复本地安装包时，嵌套构建重复安装包的问题
* [#7738](https://github.com/xmake-io/xmake/issues/7738): 修复远程编译下的平台菜单，例如 `xmake f -p windows --wdk=xxx`
* [#7710](https://github.com/xmake-io/xmake/pull/7710): 修复 `.lib` 结尾的库名被错误裁剪的问题
* [#7709](https://github.com/xmake-io/xmake/pull/7709): 修复 clang 的 runtime flags 检测
* [#7703](https://github.com/xmake-io/xmake/pull/7703): 修复 wix 传递 `-arch` 时无法识别 `x86_64` 的问题
* [#7701](https://github.com/xmake-io/xmake/pull/7701): 修复依赖检测无法发现嵌套值追加的问题
* [#7698](https://github.com/xmake-io/xmake/pull/7698): 修复 semver 的版本选择和 build metadata 排序
* 修复 `scheduler.co_resume`，让被恢复协程的错误能够正常抛出
