---
outline: deep
---

# Addon 示例

下面八组独立工程演示 addon 的配置、描述域 API/函数、规则、模块、插件命令、工程模板和工具链分发。
**每组都包含用户工程、addon 定义和本地仓库配方**，不需要先手动安装 addon。
点击文件浏览器的 **Download Zip** 下载整组文件，解压后进入最外层 `xmake.lua` 所在目录执行命令。

::: tip 环境要求
请使用支持 addon 的最新 **Xmake dev 版本**，并准备 Git 和本机编译器（Clang、GCC 或 MSVC）。模块和插件引导工程不编译应用源文件。
示例不依赖额外 SDK 或第三方库。
:::

## 自动安装流程

每组示例都有如下结构；不同 addon 提供的 payload 目录有所不同：

```text
example/
├── xmake.lua                         # 用户工程
├── src/main.c                       # C 程序（如需）
├── addon/
│   ├── addon.lua                    # addon manifest
│   └── ...                          # includes、rules、modules、plugins、templates、toolchains
└── repo/addons/e/<addon-name>/
    └── xmake.lua                    # addon 包配方
```

工程先声明仓库，再声明 addon，最后引用它提供的扩展：

```lua
add_repositories("example-includes-repo ./repo", {rootdir = os.scriptdir()})
add_addons("example-includes")
includes("@addon/example-includes/options")
```

配方使用 `set_kind("addon")`，通过 `set_sourcedir` 指向随示例提供的 `addon/`。
因此第一次构建会**从本地源码自动安装** addon，不涉及网络压缩包下载，也不需要预先运行安装命令。
路径相对于声明它的脚本解析，复制或移动整组目录后仍可以使用。

```sh
xmake -y
```

随后按各节给出的命令使用对应扩展。

Xmake 会在完整加载工程的 includes 和 API 前安装 addon，并生成 `xmake-addons.lock`。
之后的构建复用已安装的版本和锁文件。这些本地源码配方的版本是 `latest`；正式发布时，在配方中用
`add_urls` 和 `add_versions` 声明下载地址、版本及压缩包校验值，参见[发布到 xmake-repo](/zh/guide/extensions/addons/development#提交到-xmake-repo)。

::: tip 离线运行和环境隔离
示例自身的源码全部在本地。全新环境如果不希望初始化 Xmake 的默认远程仓库，可先执行
`xmake global --network=private`。Addon 默认安装在用户级目录中；希望隔离体验时，先将
`XMAKE_GLOBALDIR` 设置为一个空的临时目录，并让所有命令使用相同的环境变量，再配置 private 网络模式。
请在执行任何示例命令前设置该变量。
:::

## 通过 includes 共享配置

<FileExplorer rootFilesDir="examples/addons/includes" />

Addon 的 `includes/options/xmake.lua` 定义 `example_verbose` 选项，用户工程通过
`includes("@addon/example-includes/options")` 引入。在 `on_config` 中读取已确定的选项值并设置编译宏，
由 `src/main.c` 验证配置是否生效。

```sh
xmake -y
xmake run hello
# includes: verbose

xmake f -y --example_verbose=n
xmake -y
xmake run hello
# includes: quiet
```

这里的 `includes()` 加载的是 **Xmake 配置脚本**，与 C 头文件的搜索目录不是一回事。
被引入的文件使用 `option_end()` 结束选项作用域，避免影响调用方后续配置。

## 扩展描述域 API 和自定义配置域

<FileExplorer rootFilesDir="examples/addons/description_api" />

Addon 的 `includes/apis/xmake.lua` 注册新的配置域和 target setter：

```lua
interp_add_scopeapis("example_profile.set_message", "example_profile.add_tags", {kind = "values"})
interp_add_scopeapis("target.set_example_profile", {kind = "values"})
```

用户工程引入扩展后，直接调用这些 API：

```lua
includes("@addon/example-description-api/apis")

if example_profile then
    example_profile("demo")
        set_message("hello from a custom scope")
        add_tags("portable", "reusable")

    target("hello")
        set_kind("binary")
        add_files("src/main.c")
        set_example_profile("demo")
        add_rules("@addon/example-description-api/message")
end
```

这个条件用于支持尚未安装 addon 时的首次构建。Xmake 会先预读工程以发现 `add_addons`，
此时缺失 addon 的 includes 被暂时跳过，`example_profile` 还是 nil，因此依赖它的声明也暂时跳过。
收集到 addon 声明后，Xmake 自动安装并重新加载工程；这次 includes 完成 API 注册，条件成立，配置正常执行。
**`add_repositories`、`add_addons` 和 `includes` 必须放在条件外**，否则无法触发安装。
Addon 只注册 API，不反向调用用户定义的配置函数。

```sh
xmake -y
xmake run hello
# hello from a custom scope (2 tags)
```

API 注册负责保存配置。Addon 的 `message` rule 在 `on_config` 中读取
`project.scope("example_profile")` 和 `target:get("example_profile")`，再转换为程序使用的编译宏。
修改用户工程的 `set_message` 后重新构建，即可验证输出变化和必要的重编译。

请为自定义配置域和属性选择有辨识度的前缀。Includes 注册的 API 进入用户工程解释器，
不会因为 payload 有命名空间就自动为 API 加上命名空间。条件判断用于首次安装引导，不能替代 API 名称拼写检查。

## 封装可复用的描述域函数

<FileExplorer rootFilesDir="examples/addons/functions" />

Addon 的 includes 文件定义 `example_console`，将标准描述域 API 组合为一个辅助函数。
用户工程直接调用，并在首次预读时检查函数是否已经存在：

```lua
includes("@addon/example-functions/targets")

if example_console then
    example_console("hello", "src/main.c")

    target("hello")
        add_defines("EXAMPLE_NUMBER=42")
end
```

与上一组相同，仓库声明、addon 声明和 includes 放在条件外。
首次构建时暂时跳过尚未定义的函数；自动安装并重新加载工程后，这段配置就会执行。
无需手动安装，也不需要 addon 反向调用用户工程的配置函数。

`example_console` 创建 binary target，添加源文件并设置警告级别。
它保存并恢复解释器作用域，避免影响此前选中的 target。用户仍可重新进入生成的 target 继续自定义配置。

```sh
xmake -y
xmake run hello
# description function: 42
```

这个辅助函数调用 `target`、`set_kind`、`add_files`，属于**描述域**，应在声明工程时使用。
不要在 `on_build` 或沙盒模块中调用；脚本回调执行阶段的复用逻辑应放入沙盒模块。

## 组合 rule 和沙盒模块

<FileExplorer rootFilesDir="examples/addons/rules_modules" />

Rule 用 `import("@self.greeting")` 引用同一个 addon 的模块，并为 target 添加编译宏。
用户工程的 `on_run` 回调使用 `import("@addon.example-rules-modules.greeting")` 引入该模块，
先打印问候语，再执行编译好的程序。

```sh
xmake -y
xmake run hello
# addon module: hello hello
# addon rule: 42
```

不同 payload 的引用形式如下：

| Payload | 引用方式 |
| --- | --- |
| Includes | `includes("@addon/example-includes/options")` |
| Rule | `add_rules("@addon/example-rules-modules/message")` |
| 用户工程回调中的模块 | `import("@addon.example-rules-modules.greeting")` |
| Addon 内部模块 | `import("@self.greeting")` |
| 插件命令 | `xmake example_greet --name=xmake` |
| 模板 | `xmake create -l c -t @addon/example-templates/example-addon.console -P generated` |
| 辅助工具链 | `add_toolchains("@addon/example-toolchains/settings")` |

沙盒模块直接定义顶层导出函数，无需 `return` 模块表，也无需 `add_globalmodules`。
`@self` 让 addon 内部的 rule 不必硬编码自身安装名称。

## 独立分发模块

<FileExplorer rootFilesDir="examples/addons/modules" />

这个 addon 只提供 `modules/greeting.lua`。模块定义 `main`，因此导入后可以直接调用。
用户工程在 `on_run` 中使用带 addon 命名空间的模块引用：

```lua
import("@addon.example-modules.greeting")
print(greeting("xmake"))
```

```sh
xmake -y
xmake run hello
# addon module: hello xmake
```

Target 使用 `phony`，不编译 C 源文件。模块导入发生在脚本回调执行阶段，此时 addon 已自动安装。
显式使用命名空间导入模块，不需要额外声明 `add_globalmodules`。

## 分发命令插件

<FileExplorer rootFilesDir="examples/addons/plugins" />

Addon 提供 `plugins/example_greet/xmake.lua` 和 `main.lua`。
Task 定义注册命令及 `--name` 选项，命令实现通过 `core.base.option` 读取参数。

```sh
xmake -y
xmake example_greet --name=xmake
# addon plugin: hello xmake
```

首次使用时必须**先构建引导工程，再运行插件命令**。
构建会发现 `add_addons` 并安装插件，尚未注册的未知命令不能自行触发安装。
引导 target 为 `phony`，不编译源文件。插件命令名是全局的，分发时仍应选择不易冲突的名称。

## 分发工程模板

<FileExplorer rootFilesDir="examples/addons/templates" />

Addon 提供 `templates/c/example-addon/console/`，内含 `xmake.lua` 和 `src/main.c`。
创建工程时，Xmake 将 `${TARGET_NAME}` 替换为新工程的目标名称。

```sh
xmake -y
xmake create -l c -t @addon/example-templates/example-addon.console -P generated
xmake -y -P generated
xmake run -P generated
# hello from the addon template
```

第一次构建通过 `phony` 引导 target 安装 addon，随后 create 命令显式选择该 addon 的模板，
并将独立工程写入 `generated/`。每次创建请使用新的目标目录。
生成的是普通 C 工程，创建后不再依赖 addon 即可构建。模板 ID 同样需要避免全局命名冲突。

## 分发辅助工具链

<FileExplorer rootFilesDir="examples/addons/toolchains" />

Addon 提供 `toolchains/settings/xmake.lua`，使用 `binary` 类型作为辅助工具链。
用户工程通过下面的声明使用它：

```lua
add_toolchains("@addon/example-toolchains/settings")
```

辅助工具链添加 `EXAMPLE_TOOLCHAIN=42`，平台原有的编译器和链接器工具链继续负责实际构建。
程序中的编译期检查可以确保配置确实传到了编译命令。

```sh
xmake -y
xmake run hello
# addon toolchain: 42
```

此例分发的是工具链定义，不包含编译器程序或交叉 SDK。
完整独立工具链应使用 `set_kind("standalone")`，通过 `set_toolset` 选择工具，
并实现所需的探测和加载逻辑，参见[自定义工具链](/zh/api/description/custom-toolchain)。

## 修改、清理与运行验证

修改用户工程配置后，重新执行 `xmake` 即可。修改示例中的 addon payload 后，需重新安装：
Xmake 使用的是已安装副本，并非直接运行工程里的 `addon/` 目录。
在相应示例目录执行：

```sh
# 将名称替换为当前示例使用的 addon 名称。
xmake addon --install -y --force example-includes
xmake -y
xmake addon --remove example-includes
```

不要依赖“修改锁定 addon 的源码目录后自动更新安装内容”。八个 addon 使用不同名称，可以共存。

[Xmake 源码仓库](https://github.com/xmake-io/xmake/tree/dev/tests/projects/addons)中也有这八组独立工程。
在源码根目录加载源码开发环境后，进入任意示例目录直接执行：

```sh
cd tests/projects/addons/includes
xmake -y
xmake run hello
```

其他工程按各节给出的命令执行。重复执行 `xmake` 可以检查无改动构建，修改工程选项或配置后再次构建则可观察输出变化。
示例使用现有扩展 API 扩展工程 DSL，没有添加新的 Xmake 内置 API。
