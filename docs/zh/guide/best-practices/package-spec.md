---
outline: deep
---

# Xmake 软件包描述规范文档 {#package-spec}

本文档定义了 Xmake 官方仓库（[xmake-repo](https://github.com/xmake-io/xmake-repo)）的软件包描述编写规范。

如果你刚开始使用 xmake 的包管理功能，建议先阅读[添加依赖包快速入门](/zh/guide/project-configuration/add-packages)和[使用官方包](/zh/guide/package-management/using-official-packages)了解基本用法。关于包描述的完整 API 参考，请参阅[包依赖描述域 API](/zh/api/description/package-dependencies)，脚本域中的包实例接口请参阅 [package 实例接口](/zh/api/scripts/package-instance)。

## 0. 软件包生命周期概览 {#lifecycle}

Xmake 包描述脚本各钩子的执行顺序如下，理解此顺序是正确编写包的前提：

| 阶段 | 钩子 | 前置条件 | 用途 |
| :--- | :--- | :--- | :--- |
| 预检 | `on_check` | 无（最早校验阶段） | 判断平台/工具链是否受支持；失败时提前终止，便于跳过不支持的 CI 环境 |
| 加载 | `on_load` | 无（元数据阶段） | 动态添加 deps/patches/defines，修改包属性 |
| 探测 | `on_fetch` | 无 | 自定义系统库探测，返回 `nil` 则回退到安装流程 |
| 下载 | `add_urls` + `add_versions` | `on_load` 完成 | 源码下载与完整性校验 |
| 补丁 | `add_patches` | 源码已解压 | 构建前自动应用补丁 |
| 安装 | `on_install` | 源码已解压、所有依赖已安装 | 调用构建系统，将产物安装至 `installdir` |
| 测试 | `on_test` | `on_install` 完成 | 编译小段代码验证安装结果是否可用 |

> 关键区别：`on_load` 在下载之前执行，可以动态决定"需要什么"；`on_install` 执行时源码已解压、依赖已就绪，只负责"如何构建"。

---

## 1. 软件包标识与元数据 {#identification}

### 1.1 命名规范 {#naming}

**1.1.1** 软件包名称应统一使用**小写**，可包含数字、中划线（`-`）和下划线（`_`）；严禁使用大写或驼峰命名法。

**1.1.2** 若上游项目名已带 `-` 或 `_`，建议沿用；若无明确约定，可任选其一，或参考主流包管理器命名保持一致。

#### API

```lua
package("name")
```

### 1.2 set/add 接口语义 {#set-add-semantics}

**1.2.1** 一般语义上，`set_xxx` 表示覆盖（重置）该字段，`add_xxx` 表示追加。

**1.2.2** 维护已有规则时通常优先使用 `add_xxx`，避免误覆盖已有条目；只有确实需要重置全量字段时再使用 `set_xxx`。

### 1.3 描述与属性 {#description-attributes}

**1.3.1** `set_homepage`：必须提供有效的项目官网或 GitHub 主页。

**1.3.2** `set_description`：简短描述软件包功能。

**1.3.3** `set_license`：必须指定许可证类型（如 `MIT`、`Apache-2.0`、`BSD-3-Clause`），如果实在找不到可以不填。

**1.3.4** `set_kind`：默认为 `library`。纯头文件库必须显式声明：

```lua
set_kind("library", {headeronly = true})
```

**1.3.5** 非库类型包可显式声明：

```lua
set_kind("binary")    -- 可执行工具包
set_kind("toolchain") -- 工具链包
```

**1.3.6** 包重命名兼容：若历史包名需平滑迁移到新包名，可通过 `set_base("newpkg")` 复用新包脚本，并在 `on_load` 打印迁移提示。该方式建议仅用于兼容过渡，不宜长期保留多个同义包。

**1.3.7** 需要按包类型分支时，建议使用 `package:is_library()`、`package:is_binary()`、`package:is_toolchain()` 读取当前 `kind`，比手写字符串判断更直观：

```lua
on_load(function(package)
    if package:is_binary() then
        package:config_set("tools", true)
    elseif package:is_library() then
        package:add("defines", "FOO_STATIC")
    end
end)
```

**1.3.8** 工具链包或二进制分发包可通过 `set_installtips(...)` 给出许可证确认、手动下载步骤或环境前置条件提示，减少用户安装阶段误用：

```lua
set_installtips("This package requires manual EULA acceptance before first use.")
```

**1.3.9** 除 `is_binary/is_library/is_toolchain` 外，也可用 `package:kind()` 直接读取当前包类型字符串；新增脚本优先使用语义化布尔接口，`kind()` 适合需要做字符串拼接或透传上游参数的场景。

---

## 2. 源码获取与版本控制 {#source-versioning}

### 2.1 源码 URL 定义 {#source-urls}

**2.1.1** 必须提供至少一个稳定的源码下载地址，优先使用官方 Release 压缩包（`tar.gz`/`tar.xz`/`tar.bz2`/`zip`）。

**2.1.2** 建议提供 Git 仓库作为备选源，以便在压缩包下载失败或需要特定 commit 时自动回退：

```lua
add_urls("https://github.com/user/repo/archive/refs/tags/$(version).tar.gz",
         "https://github.com/user/repo.git")
```

**2.1.3** 默认拉取 Git 子模块，如果不需要，在 URL 配置中关闭：

```lua
add_urls("https://github.com/user/repo.git", {submodules = false})
```

**2.1.4** 当同时提供多个来源（如 release 压缩包、`github:`/`bitbucket:` 简写源、git 仓库）时，建议为需要独立版本映射的来源设置 `alias`，并在 `add_versions` 中用 `<alias>:<version>` 绑定该来源（`alias` 不限于 git 源）：

```lua
add_urls("https://github.com/user/repo/archive/refs/tags/$(version).tar.gz")
add_urls("github:user/repo.git", {alias = "github"})
add_urls("bitbucket:user/repo.git", {alias = "bitbucket"})

add_versions("1.1.9", "sha256...")
add_versions("github:1.1.9", "ver.1.1.9")
add_versions("bitbucket:1.1.9", "ver.1.1.9")
```

**2.1.5** URL 字段中，`set_urls` 为覆盖（重置）整个 URL 列表，`add_urls` 为追加。通常优先使用 `add_urls`，确需重置时再用 `set_urls`：

```lua
set_urls("https://github.com/user/repo.git") -- 覆盖 URL 列表
add_urls("https://mirror.example.com/repo.git") -- 追加镜像
```

**2.1.6** 若需按平台或构建形态动态切换源码来源（如 Windows 使用预编译压缩包、其他平台走源码构建），可在 `on_source` 中动态设置 `urls/versions`。为兼容旧版 Xmake，建议使用 `if on_source then ... else ...` 保护：

```lua
if on_source then
    on_source(function (package)
        if package:is_plat("windows") then
            package:set("urls", "https://example.com/prebuilt-$(version).zip")
        else
            package:set("urls", "https://example.com/source-$(version).tar.xz")
        end
    end)
else
    set_urls("https://example.com/source-$(version).tar.xz")
end
```

**2.1.7** 若源码压缩包包含明显无关的大体积目录（如网页文档、示例站点资源），或包含当前平台不支持/不应解压的文件，可在 `add_urls` 里用 `excludes` 过滤，减少解压体积与 CI I/O 开销并避免无效文件进入源码树：

```lua
add_urls("https://github.com/user/repo/archive/refs/tags/$(version).zip", {
    excludes = {"*/html/*", "*/docs/site/*"}
})
```

**2.1.8** 若同一包存在多种安装方案（如预编译与源码构建），可通过 `add_schemes(...)` 声明方案，并在 `on_source`/`on_install` 中读取 `package:current_scheme()` 切换逻辑；兼容旧版时可回退到 `package:data("scheme")`：

```lua
add_schemes("binary", "source")

on_install(function (package)
    local scheme = package:current_scheme() or package:data("scheme")
    if scheme == "binary" then
        -- install prebuilt artifacts
    else
        -- build from source
    end
end)
```

### 2.2 版本校验与映射 {#versions-hashing}

**2.2.1** 每个压缩包版本必须对应一个 SHA-256 校验码；Git 源版本可绑定完整 40 位 Commit Hash 或 tag 名称（两者都依赖上游仓库可用性）：

```lua
add_versions("v1.0.0", "abc123...sha256-64chars")
add_versions("git:v1.0.0", "full-40-char-commit-hash")
add_versions("git:1.1.9", "ver.1.1.9")
```

**2.2.2** 非标准版本号映射：若上游 tag 格式与语义化版本号不符（如 `jun2023` 对应 `2023.06`），须在 `add_urls` 中传入映射函数：

```lua
local tag = {["2023.06"] = "jun2023"}
add_urls("https://.../$(version).tar.gz", {
    version = function(version) return tag[tostring(version)] end
})
```

**2.2.3** 无 Release 软件包：使用日期作为版本号（如 `2024.01.01`），绑定对应的完整 commit hash：

```lua
add_versions("2024.01.01", "full-40-char-commit-hash")
```

**2.2.4** 若只提供 git 源（没有压缩包源），`add_versions` 可直接写版本号与 commit/tag 绑定，无需使用 `git:` 前缀：

```lua
add_urls("https://github.com/user/repo.git")
add_versions("2025.03.02", "full-40-char-commit-hash")
```

**2.2.5** 若版本列表较长，可拆到独立文件维护（如 `versions.txt`/`versions.lua`），在包脚本中通过 `add_versionfiles(...)` 引入；兼容旧版时可回退到 `add_versions_list()` 等旧接口。

**2.2.6** 如需区分“按 release 版本下载”与“按 git 引用（branch/tag/commit）下载”的逻辑分支，可用 `package:gitref()` 做条件判断（常用于上游目录结构或 CMake 逻辑在 git 版本与 release 包之间不一致的场景）。

**2.2.7** 在 `on_source` 中可通过 `package:requireinfo().version` 读取用户请求版本（必要时可重写），用于处理“复合版本字符串”拆分、来源映射或版本别名归一化。

**2.2.8** `package:get("versions")` / `package:set("versions", ...)` 更偏历史用法；新增脚本通常不建议动态改写整张版本表。读取当前选中版本建议优先使用 `package:version()`（或字符串化的 `package:version_str()`），必要时再配合 2.2.7 的 `requireinfo().version` 做来源映射。

```lua
on_load(function (package)
    local ver = package:version()
    if ver then
        -- branch by selected version
    end
end)
```

### 2.3 本地源码目录 {#local-source}

**2.3.1** 若软件包源码来自本地路径（调试或私有包），使用 `set_sourcedir` 替代 `add_urls`：

```lua
set_sourcedir(path.join(os.scriptdir(), "src"))
```

**2.3.2** 使用 `set_sourcedir` 时无需 `add_versions`，Xmake 不会执行下载流程，如果使用了 `package:version()` 就会报错。

### 2.4 附加资源 {#extra-resources}

**2.4.1** 当上游构建缺少必要辅助文件（如额外 CMake 脚本、`config.guess/config.sub`、第三方子仓库）时，建议使用 `add_resources` 单独拉取附加资源，避免把这类文件混入主源码补丁：

```lua
add_resources(">=1.0.26", "libusb-cmake",
              "https://github.com/libusb/libusb-cmake.git",
              "8f0b4a38fc3eefa2b26a99dff89e1c12bf37afd4")
```

**2.4.2** 在 `on_install` 中通过 `package:resourcefile(name)` 或 `package:resourcedir(name)` 访问附加资源；资源版本表达式可与 `add_patches` 一样使用单版本/范围/通配（如 `*`），也可使用 `2.x` 这类主版本通配写法。

**2.4.3** 附加资源除顶层 `add_resources(...)` 外，也可在 `on_load` 按版本/配置动态追加 `package:add("resources", ...)`，用于延迟决定资源来源。

---

## 3. 依赖管理 {#dependencies}

### 3.1 构建依赖与运行依赖 {#build-runtime-deps}

**3.1.1** `add_deps`：声明构建所需工具（如 `cmake`、`ninja`）或链接所需库（如 `zlib`）。

**3.1.2** 依赖的 `includedirs`、`links` 等属性**默认向下游传递**。若不希望传递（如仅构建期使用的工具库），设置 `private = true`：

```lua
add_deps("zlib")                              -- 传递给下游
add_deps("libcodegen", {private = true})      -- 不传递，仅构建期使用
```

**3.1.3** 依赖可携带版本约束与配置约束（版本表达式常见写法如 `>=`、`<=`、`^`、`x` 通配）：

```lua
add_deps("nasm >=2.13", {kind = "binary"})
add_deps("xtl ^0.8.0")
add_deps("python 3.x", {kind = "binary"})
add_deps("lcms 2.x")
add_deps("zlib", {configs = {shared = false}})
```

**3.1.4** 编译工具隔离：`cmake`、`ninja` 等工具依赖的 `bin` 目录仅在 `on_install` 阶段可见，不会污染用户系统 PATH。

**3.1.5** 依赖版本可与当前包版本联动（如同仓库子包保持同版本下限），可在 `on_load` 中用 `package:version_str()` 组合约束字符串再 `package:add("deps", ...)`。

**3.1.6** 在 `on_load` 动态追加依赖时，也可用参数表传入版本约束；例如：

```lua
on_load(function (package)
    package:add("deps", "zlib", {version = ">1.0.0"})
end)
```

**3.1.7** 可将依赖声明为可选（`optional = true`）用于“有则启用、无则降级”的软依赖场景；常用于大型包对压缩/加速后端的可选接入。

```lua
add_deps("zlib", "zstd", {optional = true})
```

**3.1.8** 需要遍历“库依赖”做 include/link 注入时，可使用 `package:librarydeps()`（支持 `{private = true}`）与 `package:orderdeps()` 分工：前者偏“库依赖集合”，后者偏“有序依赖链”。

**3.1.9** 仅需遍历直接依赖（不展开完整依赖图）时，可使用 `package:plaindeps()`；常用于模板/聚合包在 `on_fetch` 做轻量探测。

### 3.2 外部源联动 {#external-sources}

**3.2.1** 若主流发行版包管理器中已有该包，建议通过 `add_extsources` 关联系统包管理器；若无可用系统包可省略。探测成功时将跳过下载与安装流程。`extsources` 不仅支持 `apt/pacman/brew`，也支持 `pkgconfig::foo` 这类系统探测入口。

```lua
add_extsources("pkgconfig::libxml-2.0", "apt::libfoo-dev", "pacman::foo", "brew::foo")
```

**3.2.2** 当系统包名依赖平台/组件配置时，可在 `on_load` 中动态追加 `extsources`（`package:add("extsources", ...)`），按启用组件精细映射发行版包名。

---

## 4. 构建配置与环境预处理 {#configuration}

### 4.1 用户配置项 {#user-options}

**4.1.1** `add_configs`：提供自定义编译开关。内置保留配置项有 `shared`、`static`、`pic`、`lto`、`vs_runtime`、`debug`。通常不需要重复定义；仅在需要设置 `readonly` 或重写描述时再显式定义。

支持的 `type` 值及示例：

```lua
-- boolean
add_configs("tools",   {description = "Build tools.",           default = false, type = "boolean"})
add_configs("minimal", {description = "Build a minimal version.", default = true, type = "boolean"})

-- string（可选 values 限定枚举）
add_configs("endian", {
    description = [[Byte order: "little" or "big". Leave nil for arch default.]],
    default = nil, type = "string", values = {"little", "big"}
})

-- table（多选列表）
add_configs("modules", {
    description = [[Enable modules, e.g. {configs = {modules = {"zlib", "lzma"}}}]],
    type = "table"
})
```

**4.1.2** 只读选项：若软件包不支持某种模式（如不支持静态编译），必须将该选项标记为 `readonly`：

```lua
add_configs("shared", {description = "Build shared library.", default = true, readonly = true})
```

**4.1.3** MSVC 运行时：Xmake 默认会向 CMake 传递 `CMAKE_MSVC_RUNTIME_LIBRARY`，通常无需手动拼接该参数。若需要按运行时做条件分支，使用 `package:has_runtime("MD", "MT")` 判断即可；若上游 CMake 显式硬编码了运行时选项，建议用 `io.replace` 删除上游强制设置，避免覆盖 Xmake 默认传递值：

```lua
if package:has_runtime("MD", "MT") then
    -- runtime-related branching when needed
end

io.replace("CMakeLists.txt", "set(CMAKE_MSVC_RUNTIME_LIBRARY \"MultiThreaded\")", "", {plain = true})
io.replace("CMakeLists.txt", "set(CMAKE_MSVC_RUNTIME_LIBRARY \"MultiThreadedDLL\")", "", {plain = true})
```

**4.1.4** 动态修改 `kind`：`package:set("kind", ...)` 在 `on_load` 中虽可用，但当前存在已知行为问题（可能导致 headeronly/非 headeronly 形态处理异常）。除非必要不建议使用；如必须使用，请在注释中说明原因并参考：
[https://github.com/xmake-io/xmake/issues/5807#issuecomment-2467654245](https://github.com/xmake-io/xmake/issues/5807#issuecomment-2467654245)

**4.1.5** 配置联动与约束：可在 `on_load` 用 `package:config_set(...)` 推导默认配置或对上游限制做强制收敛（例如某版本仅支持静态库）。若会覆盖用户传入配置，建议同步 `wprint` 给出原因提示。

**4.1.6** 后端选择类配置可使用 `values` 做枚举约束，且可包含 `false` 与字符串混合值；该写法可不显式声明 `type`，用于“关闭/后端 A/后端 B”三态切换：

```lua
add_configs("openssl", {
    description = "Enable PKCS7 signatures support",
    default = "openssl3",
    values = {false, "openssl", "openssl3"}
})
```

**4.1.7** 批量映射配置到上游构建参数时，可遍历 `package:configs()`，并用 `package:extraconf("configs", name, "builtin")` 过滤内置配置（如 `debug`、`shared`）；这是常用语法糖，可避免误把内置项当成业务开关传给上游构建系统：

```lua
for name, enabled in pairs(package:configs()) do
    if not package:extraconf("configs", name, "builtin") then
        table.insert(configs, "-D" .. name:upper() .. "=" .. (enabled and "ON" or "OFF"))
    end
end
```

**4.1.8** 处理 MSVC 运行时时，除 `has_runtime(...)` 外，也可直接读取 `package:runtimes()`（如 `MT`/`MD`）并透传上游参数；新脚本建议保持写法一致，避免同包混用多套 runtime 分支风格。

### 4.2 环境导出 {#environment-export}

**4.2.1** `on_load`：在下载源码之前执行，用于根据配置动态决定包的依赖、补丁和属性。典型用途：

- 条件性 `add_deps`（如按配置决定是否依赖 openssl）
- 导出宏定义供下游 target 引用
- 按平台注入不同的系统链接库

```lua
on_load(function(package)
    if package:config("with_ssl") then
        package:add("defines", "FOO_WITH_SSL=1")
        package:add("deps", "openssl")
    end
end)
```

**4.2.2** `deps` 具有阶段约束：只能通过顶层 `add_deps(...)` 或 `on_load` 阶段的 `package:add("deps", ...)` 添加；不要在 `on_install` 中添加 `deps`。

对 `defines`、`syslinks` 等属性，仍推荐优先放在 `on_load`，以保持元数据与安装逻辑分离、提高可读性。

**4.2.3** 平台差异链接：Linux 下的 `pthread` 或 Windows 下的系统库，必须根据 `is_plat` 动态注入 `syslinks`：

```lua
on_load(function(package)
    if package:is_plat("linux") then
        package:add("syslinks", "pthread", "dl")
    elseif package:is_plat("windows") then
        package:add("syslinks", "ws2_32", "advapi32")
    end
end)
```

**4.2.4** 运行时环境变量扩展：需要导出 `PYTHONPATH` 等路径型变量时，建议配合 `package:mark_as_pathenv("PYTHONPATH")`。`mark_as_pathenv` 仅应在 `on_load` 阶段调用。若安装期计算结果（如最终安装路径）需在后续阶段复用，可用 `package:data_set("k", v)` 与 `package:data("k")` 在包生命周期内传递数据。

**4.2.5** 工具链/二进制包若需固定导出 `*_ROOT` 等环境变量，可在 `on_load` 使用 `package:setenv("KEY", value)`；路径型变量仍建议配合 `mark_as_pathenv`。

---

## 5. 构建与安装生命周期 {#installation}

### 5.1 构建系统抽象 {#build-system}

**5.1.1** 严禁在脚本中硬编码执行编译命令（如 `os.run("make")`）。必须使用 Xmake 提供的[包构建工具模块](/zh/api/scripts/extension-modules/package/tools)：

| 上游构建系统 | 推荐 API |
| :--- | :--- |
| CMake | `import("package.tools.cmake").install(package, configs)` |
| Meson | `import("package.tools.meson").install(package, configs)` |
| Autoconf | `import("package.tools.autoconf").install(package, configs)` |
| Xmake | `import("package.tools.xmake").install(package, configs)` |
| Make | `import("package.tools.make").install(package, configs)` |
| Nmake | `import("package.tools.nmake").install(package, configs)` |

**5.1.2** 现存少量历史包仍直接使用 `os.vrun(v)` 调上游构建命令，属于遗留问题，不作为放宽规范的依据。后续维护触及时应优先迁移到 `package.tools.*`。

**5.1.3** 对暂未迁移完成的遗留脚本（例如手动调用 `configure`/`make`），至少应通过 `package:build_getenv(...)` 透传编译器与 flags，避免硬编码工具链导致交叉编译/宿主环境污染。

**5.1.4** 使用 Port 脚本或安装阶段需要拷贝包内辅助文件（如 `port/xmake.lua`、`.def`、模板文件）时，建议通过 `package:scriptdir()` 定位包脚本目录，避免依赖当前工作目录：

```lua
os.cp(path.join(package:scriptdir(), "port", "xmake.lua"), "xmake.lua")
```

**5.1.5** 若需从临时构建目录拷贝中间产物（如 `.pdb`）到安装目录，建议使用 `package:builddir()` 获取构建目录根路径；历史脚本中的 `package:buildir()` 归为旧接口写法：

```lua
os.trycp(path.join(package:builddir(), "foo/**.pdb"), package:installdir("bin"))
```

**5.1.6** 单文件下载包（如仅下载一个 `.h`/`.exe`）可在安装阶段通过 `package:originfile()` 获取原始下载文件路径，再手动拷贝到目标目录。

**5.1.7** 如需在安装阶段生成或覆盖临时构建文件，建议使用 `package:cachedir()` 定位解包缓存目录，避免污染脚本目录或仓库文件。

**5.1.8** 平台分流转发包（如 macOS 走系统库、其他平台转发到第三方依赖）可保留最小 `on_install` 做分流与安装期适配，不应简单删空安装钩子。

### 5.2 构建参数优化 {#build-params}

**5.2.1** 对需要实际编译产物的包（非纯头文件、非纯预编译搬运），必须显式映射 Debug/Release 模式：

```lua
table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:is_debug() and "Debug" or "Release"))
```

**5.2.2** 对需要实际编译产物的包（非纯头文件、非纯预编译搬运），必须显式映射 shared/static。若上游使用标准开关可直接映射 `BUILD_SHARED_LIBS`；若上游使用自定义变量（如 `BUILD_STATIC`、`ZSTD_BUILD_SHARED`），需按其接口主动适配：

```lua
table.insert(configs, "-DBUILD_SHARED_LIBS=" .. (package:config("shared") and "ON" or "OFF"))
```

**5.2.3** Windows 符号全导出：构建动态库且上游 CMake 未处理 `__declspec(dllexport)`，须注入：

```lua
if package:is_plat("windows") and package:config("shared") then
    table.insert(configs, "-DCMAKE_WINDOWS_EXPORT_ALL_SYMBOLS=ON")
end
```

**5.2.4** 禁用 Test/Examples 编译: 若上游无关闭开关，使用 `io.replace` 注释掉相关 `add_subdirectory`：

```lua
io.replace("CMakeLists.txt", "add_subdirectory(tests)", "", {plain = true})
io.replace("CMakeLists.txt", "add_subdirectory(examples)", "", {plain = true})
```

**5.2.5** 若上游构建系统强制启用 `/WX` 或 `-Werror`（将告警视为错误），必须使用 `io.replace` 删除该强制选项，避免因编译器差异导致构建失败：

```lua
io.replace("CMakeLists.txt", "/WX", "", {plain = true})
io.replace("CMakeLists.txt", "-Werror", "", {plain = true})
```

**5.2.6** Windows 产物一致性：适配上游 shared/static 选项时，应确保产物形态与配置一致——`shared=true` 时生成 `.dll`（通常伴随导入 `.lib`），`shared=false` 时生成静态 `.lib`（或 `.a`）。

**5.2.7** 若上游构建脚本未正确处理依赖的级联链接（常见于部分 autoconf/meson 项目），可遍历 `package:orderdeps()` 并通过 `dep:fetch()` 组装 `cflags/cppflags/ldflags`（或 `c_link_args`）显式注入，避免缺符号/缺头文件。

**5.2.8** 使用 `package.tools.*` 安装/配置时，若需要将依赖包的构建信息显式注入上游构建系统，可通过选项表传入 `packagedeps`（支持字符串或数组）。其本质是通过 `cxflags/shflags` 等参数把依赖信息直接塞入构建过程。

该方式应作为**最后手段**：优先尝试修补上游构建脚本（如 `CMakeLists.txt`、`meson.build`、`configure.ac`）；仅在修补无果或维护成本过高时再使用 `packagedeps`。

```lua
import("package.tools.cmake").install(package, configs, {packagedeps = {"libogg", "xxhash"}})
import("package.tools.autoconf").install(package, configs, {packagedeps = "libiconv"})
```

**5.2.9** `package:debug()` 属历史接口，新增或重构脚本建议统一使用 `package:is_debug()`；维护遗留包时可逐步迁移：

```lua
table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:is_debug() and "Debug" or "Release"))
```

### 5.3 补丁管理 {#patch-management}

**5.3.1** 通过 `add_patches` 在源码解压后、构建前自动应用补丁。版本选择支持单版本、通配（`*`）、单侧范围和区间表达式（可写 `&&`，也可直接空格并列）：

```lua
add_patches("1.0.0", "patches/1.0.0/fix-windows.patch", "sha256-of-patch-file")
add_patches("*", "patches/common/fix-clang.patch", "sha256-of-patch-file")
add_patches(">=3.2.4", "patches/common/fix-cxx17.patch", "sha256-of-patch-file")
add_patches(">=5.3.0 <=5.8.0", "patches/common/fix-cmake.patch", "sha256-of-patch-file")
add_patches(">=2.57.3 <2.57.6", "patches/common/fix-headers.patch", "sha256-of-patch-file")
```

**5.3.2** 补丁文件建议优先存放于包目录的 `patches/<version>/` 子目录并纳入版本控制；若同一补丁需跨多个版本复用，可放在公共路径并由多个 `add_patches` 复用。

**5.3.3** 策略建议：
- **结构性 bug 修复**（改动边界稳定、希望保留可审计 diff）→ 建议使用 `.patch`/`.diff` 文件（便于向上游提 PR）
- **临时侵入性修改**（删除测试、修改安装路径）→ 建议使用 `io.replace`（更直观，无需维护 diff 上下文）

**5.3.4** 若修改逻辑关键且通常可跨多个上游版本复用，可优先采用 `io.replace`（或等价文本修补脚本）。原因是 `add_patches` 依赖版本号范围匹配，在自动更新 CI 场景下维护成本更高。

**5.3.5** `add_patches` 支持本地补丁文件与远程补丁 URL（含较大补丁文件场景）。关键修复建议尽量在仓库内保留本地补丁副本，降低上游链接失效风险。

**5.3.6** 同一版本若声明多个 `add_patches`，应用顺序不作保证；脚本逻辑不得依赖“先打 A 再打 B”。若两个修改存在顺序耦合，建议合并为单个补丁，或改用 `io.replace`/脚本化修补消除顺序依赖。

**5.3.7** 需要按工具链版本条件启用补丁时，建议在 `on_load` 动态追加 `patches`，并将版本约束与平台/工具链条件拆分表达（例如“包版本是 v2.1.0 且 Android NDK 为 r27”）：

```lua
on_load(function (package)
    if package:is_plat("android") then
        local ndk = package:toolchain("ndk")
        local ndkver = ndk and ndk:config("ndkver")
        if ndkver and tonumber(ndkver) == 27 then
            package:add("patches", "v2.1.0", "patches/v2.1.0/fix-r27.diff", "sha256...")
        end
    end
end)
```

**5.3.8** 补丁文件编码与行尾统一要求：`UTF-8`（无 BOM）+ `LF`。修改补丁内容或行尾后必须重新计算并更新 `add_patches(..., sha256)`，避免跨平台哈希漂移。

关于 `io.replace` 接口的详细用法，请参阅 [io.replace](/zh/api/scripts/builtin-modules/io#io-replace)。关于 `io.gsub` 的用法，请参阅 [io.gsub](/zh/api/scripts/builtin-modules/io#io-gsub)。

---

## 6. 系统库探测 {#system-detection}

### 6.1 on_fetch 自定义探测 {#on-fetch}

**6.1.1** 当 `add_extsources` 的自动探测不足以覆盖复杂场景时，使用 `on_fetch` 实现自定义探测逻辑。返回 `nil` 则自动回退到 `on_install` 流程：

```lua
on_fetch(function(package, opt)
    if opt.system then
        local result = {}
        result.includedirs = {"/usr/include/foo"}
        result.libfiles    = {"/usr/lib/libfoo.a"}
        return result
    end
end)
```

**6.1.2** `on_fetch` 返回 table 支持的字段：`includedirs`、`linkdirs`、`links`、`libfiles`、`defines`。

**6.1.3** pkg-config 联动：可使用内置 `find_package` 辅助函数简化探测。Xmake 已预先配置好 `find_package` 和 pkg-config 的搜索路径，通常无需手动传递路径参数：

```lua
on_fetch(function(package, opt)
    if opt.system then
        return package:find_package("pkgconfig::foo", opt)
    end
end)
```

**6.1.4** 版本约束探测：系统库版本不满足要求时返回 `nil` 强制走安装流程：

```lua
on_fetch(function(package, opt)
    if opt.system then
        local result = package:find_package("pkgconfig::foo", opt)
        if result and result.version and semver.satisfies(result.version, ">=1.2.0") then
            return result
        end
    end
end)
```

**6.1.5** 复杂探测逻辑可拆到独立脚本文件复用（例如 `on_fetch("fetch")`）；同样的“脚本拆分”也适用于 `on_install`、`on_test` 等其他钩子，不是 `on_fetch` 专属能力。

**6.1.6** `on_fetch` 除 `find_package(...)` 外，也可用 `package:find_tool(...)` 探测系统工具并返回探测结果。

**6.1.7** `on_fetch` 返回语义建议区分：`nil` 表示继续 fallback 到安装流程，`false` 可用于显式阻止 fallback（例如已知某些探测副作用/卡死场景时提前终止）。

```lua
on_fetch(function (package, opt)
    if opt.system then
        if should_abort_fetch() then
            return false -- stop fallback install
        end
        return nil -- continue fallback install
    end
end)
```

### 6.2 on_check 早期约束校验 {#on-check}

**6.2.1** `on_check` 是最早执行的校验阶段之一，适合做“是否允许继续构建”的前置判断（如 CI 不支持的平台、工具链版本不满足）。校验失败应尽早 `assert` 终止，避免浪费后续下载与构建时间。

```lua
on_check("android", function(package)
    local ndkver = package:toolchain("ndk"):config("ndkver")
    assert(ndkver and tonumber(ndkver) > 22, "need ndk > 22")
end)
```

**6.2.2** 推荐在 `on_check` 中只做环境可用性判定，不做源码修改与安装动作。

**6.2.3** 为兼容旧版 Xmake，可在调用前做存在性判断：

```lua
if on_check then
    on_check("android", function(package)
        -- ...
    end)
end
```

---

## 7. 特殊软件包类型处理 {#special-packages}

### 7.1 Xmake Port 原生重写构建 {#xmake-port}

**7.1.1** 当上游构建系统失效或过于复杂时，推荐使用 Xmake Port。常见方式包括：
- 包目录维护固定 `port/xmake.lua`，在 `on_install` 中拷贝到源码根目录后安装；
- 在 `on_install` 中按版本/平台动态 `io.writefile("xmake.lua", ...)` 生成构建脚本；
- 直接在包脚本中组织最小构建逻辑并调用 Xmake 工具模块安装。

**7.1.2** 动态库的符号导出处理策略：

- 推荐（库源码较小时）: 修改源码添加平台符号修饰（`__declspec(dllexport)` / `__attribute__((visibility("default")))`），行为明确可控。
- 备选（库源码较大，修改成本高）: 使用 `utils.symbols.export_all`，其底层依赖 `objdump`/`dumpbin` 等工具扫描目标文件导出符号，结果不稳定，仅在无更好选择时使用：

```lua
if is_plat("windows") and is_kind("shared") then
    add_rules("utils.symbols.export_all")
end
```

**7.1.3** 若上游依赖 `config.h.in`、`.pc.in` 等模板文件，可在 Port 脚本中用 `set_configvar` + `add_configfiles` 生成配置头/元数据文件；这类生成逻辑应与版本号、平台特性保持同步，避免写死常量。

### 7.2 预编译二进制 {#precompiled}

**7.2.1** `on_install` 阶段必须将产物严格分类移动至 `package:installdir()` 的标准子目录：

```lua
os.cp("include/*", package:installdir("include"))
os.cp("lib/*.a",   package:installdir("lib"))
os.cp("bin/*",     package:installdir("bin"))
```

**7.2.2** 使用 `os.trycp` 处理非跨平台文件（如 `.dll` 仅在 Windows 存在）：

```lua
os.trycp("bin/*.dll", package:installdir("bin"))
```

**7.2.3** 当前预编译包的自动化构建实践多依赖 github action，且可稳定复用的平台主要是 Windows。跨平台预编译覆盖不足时，优先保证源码构建路径可用。

**7.2.4** 若上游仅提供预编译产物（如 `yy-thunks`），可直接打包上游二进制/目标文件，并在包脚本配置 `set_policy("package.precompiled", false)`。

**7.2.5** 同一包同时支持“预编译下载”和“源码构建”时，建议用 `package:is_precompiled()` 区分逻辑，仅在源码构建路径添加必需的构建期依赖（如 `perl`、`gperf`），避免对纯预编译路径引入无效依赖。

**7.2.6** 仅在“源码构建路径”追加逻辑时，也可使用 `package:is_built()` 判断；兼容旧版常见写法为 `if not package.is_built or package:is_built() then ... end`。

### 7.3 组件包 {#components}

**7.3.1** 对于提供多个独立子库的大型包（如 Boost、Qt），使用组件机制让用户按需依赖，避免强制链接全部子库：

```lua
add_components("core", "net", "ssl")

on_component("core", function(package, component)
    component:add("links", "foo_core")
end)

on_component("net", function(package, component)
    component:add("links", "foo_net")
    component:add("deps", "core")  -- 组件间依赖
end)
```

**7.3.2** 组件可在 `on_load` 动态注册（`package:add("components", ...)`），并通过 `{default = true}` 标记默认组件、`{deps = "base"}` 声明组件依赖，适合“按版本/配置启用不同组件集合”的包。

**7.3.3** 个别平台（尤其 MinGW）对链接顺序敏感时，优先使用顶层 `add_linkorders(...)` 固定顺序；若需按条件动态追加，再在 `on_load` 使用 `package:add("linkorders", ...)`。同一链接分组可用 `group::name` 前缀声明顺序。

```lua
add_linkorders("mingw32", "SDL2main")
add_linkorders("group::foo", "group::bar")

on_load(function (package)
    if package:is_plat("mingw") then
        package:add("linkorders", "mingw32", "SDL2main")
    end
end)
```

### 7.4 包规则导出 {#package-rules}

**7.4.1** 包可通过 `rules/*.lua` 导出下游可复用规则；用户侧通过 `add_rules("@<pkg>/<rule>")` 引用。

```lua
-- package side
-- rules/link.lua -> rule("xp")

-- user side
add_requires("yy-thunks")
add_rules("@yy-thunks/xp")
```

---

## 8. 交叉编译支持 {#cross-compilation}

### 8.1 平台与架构检测 {#platform-arch}

**8.1.1** 在 `on_install` 中使用以下 API 进行条件分支：

```lua
package:is_plat("windows", "mingw")  -- 目标平台
package:is_arch("x86_64", "arm64")   -- 目标架构
package:is_cross()                   -- 是否交叉编译（host != target）
```

**8.1.2** 交叉编译时，工具链由 Xmake 自动注入至下游构建系统（CMake toolchain file 等），无需在脚本中手动指定编译器路径。

**8.1.3** 宿主工具构建：若包在构建过程中需要先编译运行在宿主平台的工具（如 `protoc`、`flatc`），须将该工具拆分为独立工具包并通过 `add_deps` 引用，严禁在同一个 `on_install` 中混合编译宿主与目标产物。

**8.1.4** 同名包多配置并存：可通过 `pkg~xxx` 形式引用同名包的变体配置；配合 `{host = true}` 表示该依赖使用 host toolchain 构建，从而确保产物可在当前构建机直接运行（常用于构建期代码生成工具）。

```lua
add_deps("opencc~host", {kind = "binary", host = true})

-- 使用时仍通过包名访问依赖对象
local host_opencc = package:dep("opencc")
```

**8.1.5** `on_load`/`on_install`/`on_check` 等钩子支持目标平台过滤与宿主平台过滤（`@host` 语法），并支持更丰富的条件表达式：`and`/`or`/`!`、`plat|arch`、通配符（如 `arm*`）及 `target@host1,host2` 组合。适合二进制工具包或“按宿主分发预编译产物”的场景：

```lua
on_install("@windows", "@linux", function(package)
    -- 根据宿主系统执行安装逻辑
end)

on_install("windows|x64", "windows|x86", function(package)
    -- 目标平台+架构过滤
end)

on_install("!cross and !wasm and mingw|!i386", function(package)
    -- 复合布尔表达式
end)

on_install("windows|!arm*", function(package)
    -- 通配符与取反
end)

on_install("mingw@windows", function(package)
    -- 目标 mingw，宿主 windows
end)

on_install("android@linux,macosx", function(package)
    -- 指定目标平台 + 多宿主平台
end)

on_install("@linux|x86_64", "@linux|arm64", function(package)
    -- 宿主平台 + 宿主架构过滤
end)

on_load("windows", function(package)
    -- 仅在目标 windows 生效
end)
```

**8.1.6** 若需区分宿主平台的子环境（如 Windows 下区分原生终端与 MSYS），可用 `is_subhost(...)`。该写法常用于选择系统包源（如 `pacman::`）或做 MSYS 专属安装分支。

**8.1.7** 目标信息访问除 `is_arch(...)` / `is_plat(...)` 外，还可使用 `package:is_arch64()`、`package:arch()`、`package:plat()` 作为补充（常用于路径拼接或与 `arch_set/plat_set` 配对保存/恢复）：

```lua
local oldarch = package:arch()
if package:is_arch64() then
    -- ...
end
```

**8.1.8** 编译器差异分支可用 `package:has_tool("cc"/"cxx", ...)` 判断当前工具链实现（如 `cl`、`clang_cl`、`clangxx`），但因工具链缓存原因建议仅在 `on_install` 阶段使用：

```lua
on_install(function (package)
    if package:has_tool("cxx", "cl", "clang_cl") then
        -- msvc-like branch
    end
end)
```

**8.1.9** 宿主子环境检测应使用全局 `is_subhost(...)`；`package:is_subhost(...)` 不是可用 API。

**8.1.10** 针对目标平台字符串拼接或条件分支，可使用 `package:targetarch()` 与 `package:is_targetos(...)`（与 `is_arch/is_plat` 互补）：

```lua
local triplet = package:is_targetos("windows") and ("win-" .. package:targetarch()) or "unix"
```

**8.1.11** 需要读取当前工具链实际工具路径（或工具名）做三元组推断/参数拼装时，可使用 `package:tool("cc"/"cxx"/...)`。

**8.1.12** 个别迁移/兼容场景可在安装阶段临时切换目标三元组（`package:plat_set(...)` / `package:arch_set(...)`）复用构建逻辑，但应在安装后恢复原值，避免污染后续流程。

### 8.2 Android / iOS 注意事项 {#android-ios}

**8.2.1** Android NDK 目标下，`package:is_plat("android")` 为 `true`，C++ STL 类型由 Xmake 统一管理，无需手动向 CMake 传递 `-DANDROID_STL`。

**8.2.2** 若上游 CMake 脚本在检测到 Android 时有特殊逻辑，须验证其与 Xmake 生成的 toolchain file 的兼容性，必要时通过 `add_patches` 修正。

---

## 9. 验证与测试 {#testing}

### 9.1 测试逻辑 {#test-logic}

**9.1.1** 原则上每个包都应包含 `on_test` 段落。以下场景可豁免：
- 仅做系统探测、只有 `on_fetch` 且无安装流程的包；
- 仅做重命名/兼容转发的继承包（如 `set_base(...)`），且父包已覆盖测试；
- 仅做依赖聚合/转发的 `set_kind("template")` 元包；
- 仅做依赖聚合/语法糖转发、无独立产物的工具包（如 `autotools`）；
- 上游拆分子包但由父包统一验证的场景（如 `libc++` 归属 `libllvm` 生态）。

**9.1.2** `on_test` 的核心目标是验证“头文件可见 + 符号可链接”（即最终可用）。优先使用轻量的符号/类型检测；`check_*snippets` 作为补充用于覆盖更完整调用路径。C 接口库常见写法：

```lua
on_test(function(package)
    assert(package:has_cfuncs("foo_init", {includes = "foo/foo.h"}))
end)
```

同类可用接口（按需要选其一，不必全部使用）：
- `package:has_ctypes(...)`
- `package:has_cxxfuncs(...)`
- `package:has_cxxtypes(...)`
- `package:has_cincludes(...)` / `package:has_cxxincludes(...)`
- `package:check_importfiles(...)`（用于导入目标可见性校验）

**9.1.3** C++ 类/模板测试：使用 `check_cxxsnippets` 编写最小实例化代码：

```lua
on_test(function(package)
    assert(package:check_cxxsnippets({test = [[
        #include <foo/bar.hpp>
        void test() { foo::Bar b; b.run(); }
    ]]}, {configs = {languages = "c++17"}}))
end)
```

**9.1.4** C 代码片段测试：对 C 库使用 `check_csnippets` 验证完整调用路径：

```lua
on_test(function(package)
    assert(package:check_csnippets({test = [[
        #include <foo.h>
        void test() { foo_ctx_t* ctx = foo_create(); foo_destroy(ctx); }
    ]]}, {configs = {languages = "c11"}}))
end)
```

**9.1.5** Objective-C / Objective-C++ 场景可使用 `check_msnippets` 做最小可编译/可链接校验，作为 `check_csnippets`/`check_cxxsnippets` 的语言特化补充。

**9.1.6** 语言标准依赖：测试代码若依赖特定标准（如 C++17 结构化绑定、C11 原子操作），必须在 `configs` 中显式声明 `languages`（见 9.1.3、9.1.4），否则低版本编译器会误报构建失败。

**9.1.7** shared/static 产物形态（如 `shared` 有 `.dll`、`static` 有 `.lib/.a`）原则上应由包管理框架统一校验；当前尚无通用自动检查机制，也不适合要求每个包都编写额外检测脚本。

因此这里采用**人工辅助检查**：在新增/修改包时，维护者结合构建日志与安装目录产物进行抽查确认，并保留基础符号/代码片段测试（见 9.1.2~9.1.6）。

---

## 10. 维护与 CI 操作标准 {#maintenance}

### 10.1 本地验证命令 {#local-testing}

**10.1.1** 生成包模板：

```bash
xmake l scripts/new.lua github:<owner>/<repo>
```

**10.1.2** 完整测试（含详细构建日志）：

```bash
xmake l scripts/test.lua -vD --shallow <package>
```

**10.1.3** 测试指定版本：

```bash
xmake l scripts/test.lua -vD --shallow <package> <version>
```

**10.1.4** 交叉测试：必须覆盖至少两个平台（如 `linux` 和 `mingw`）：

```bash
xmake l scripts/test.lua -vD --shallow --plat=mingw <package>
```

### 10.2 PR 提交规范 {#pr-standards}

**10.2.1** 必须提交至 `dev` 分支，禁止直接向 `master` 提交。

**10.2.2** 以下重试方式仅用于少见异常场景（如 GitHub Actions 自身异常、tarball 下载偶发失败等），不应替代正常修复提交流程。若需触发重新检测，可通过以下两种方式（普通贡献者通常无权直接 rerun 具体 CI job）：
- `close` 后 `reopen` PR
- 推送一个空提交：`git commit --allow-empty -m "ci: retrigger"`

**10.2.3** 包描述文件末尾不能以 `package_end()` 结束。

**10.2.4** 单次 PR 原则上只新增或修改一个包，多包变更须拆分为独立 PR。

---

## 11. 包管理边界情况处理总结 {#corner-cases}

| 场景 | 处理策略 | 推荐 API |
| :--- | :--- | :--- |
| **构建系统缺少安装逻辑** | 手动将产物从 build 目录拷贝至 install 目录 | `os.cp(...)`, `package:installdir()` |
| **Port 辅助文件定位** | 拷贝 `port/*` 到源码目录时，用包脚本目录定位源文件，避免相对路径歧义 | `package:scriptdir()` |
| **构建目录产物回收** | 从临时构建目录拷贝 `.pdb` 等中间产物到安装目录；优先用 `builddir`，`buildir` 视为旧写法 | `package:builddir()`, `os.trycp(...)` |
| **运行时环境变量** | 将 `bin` 或 `lib` 路径注入 PATH | `package:addenv("PATH", "bin")` |
| **Git 子模块** | URL 配置禁用 submodules | `add_urls(..., {submodules = false})` |
| **Git-only 源** | 直接用版本号绑定 commit/tag（无需 `git:` 前缀） | `add_versions("2025.03.02", "<hash>")` |
| **动态来源切换** | 按平台/形态在 `on_source` 动态设置 `urls/versions` | `if on_source then on_source(function (package) ... end) end` |
| **版本清单外置** | 大量版本映射拆分到外部文件，减少主脚本噪声 | `add_versionfiles("versions.txt")` |
| **Git 引用分支逻辑** | release 包与 git 引用目录结构不一致时分支处理 | `if package:gitref() then ... end` |
| **URL 覆盖与追加** | 重置用 `set_urls`，增量维护优先 `add_urls` | `set_urls(...)`, `add_urls(...)` |
| **压缩包内容裁剪** | 通过 `excludes` 过滤无关目录或当前平台不支持文件，降低解压开销并避免无效文件干扰 | `add_urls("...zip", {excludes = {"*/html/*"}})` |
| **包重命名兼容** | 用 `set_base` 继承新包脚本，并在 `on_load` 给出迁移提示 | `set_base("libsdl2")`, `package:base():script("load")(package)` |
| **附加资源下载** | 缺失构建辅助文件时单独拉取资源并在安装期读取 | `add_resources(...)`, `package:resourcefile(...)` |
| **CMake 生成器策略** | 按上游兼容性显式启用/关闭 Ninja 生成器策略 | `set_policy("package.cmake_generator.ninja", true/false)` |
| **Windows 长路径** | Git 子模块路径过深时启用 longpaths 策略 | `set_policy("platform.longpaths", true)` |
| **动态修改 kind** | 尽量避免在 `on_load` 动态 `package:set("kind", ...)`（见 issue #5807） | `package:set("kind", "library", {headeronly = true})` |
| **交叉编译宿主工具** | 拆分为独立工具包，通过 deps 引用 | `add_deps("protoc")` |
| **同名包多配置** | 使用 `pkg~xxx` + `{host = true}` 获取宿主可执行工具变体 | `add_deps("foo~host", {host = true})` |
| **配置强制收敛** | 在 `on_load` 用 `config_set` 约束不受支持组合，并提示原因 | `package:config_set("shared", false)` |
| **按包 kind 分支** | 根据当前包类型切换依赖/测试/行为，优先用 kind 访问函数提高可读性 | `package:is_library()`, `package:is_binary()`, `package:is_toolchain()` |
| **可选依赖降级** | 依赖非强制时可标记 `optional = true`，按可用性启用能力 | `add_deps("zstd", {optional = true})` |
| **依赖版本联动** | 依赖版本按当前包版本动态拼接约束 | `package:add("deps", "libselinux >=" .. package:version_str())` |
| **依赖主版本锁定** | 可用 `x` 通配锁定主/次版本线（如 `3.x`、`2.x`） | `add_deps("python 3.x")` |
| **三态后端配置** | `add_configs(..., {values = {false, "a", "b"}})` 表达关闭/多后端二选一 | `add_configs("ssl", {values = {false, "openssl", "mbedtls"}})` |
| **过滤内置配置项** | 批量遍历配置时过滤 `debug/shared` 等内置项，仅向上游传递业务配置 | `package:configs()`, `package:extraconf("configs", name, "builtin")` |
| **Debug 判定** | 新脚本统一使用 `is_debug()`；`debug()` 归为历史接口 | `package:is_debug()` |
| **平台 + 架构过滤** | 用 `plat\|arch` 精确限制钩子生效范围 | `on_install("windows\|x64", fn)` |
| **目标信息 getter** | 除 `is_plat/is_arch` 外，可用 `plat/arch/is_arch64` 获取原始目标信息 | `package:plat()`, `package:arch()`, `package:is_arch64()` |
| **编译器差异分支** | 按当前工具链实现分流（如 `cl`/`clang_cl`/`clangxx`），建议仅在 `on_install` 使用 | `package:has_tool("cc"/"cxx", ...)` |
| **宿主子环境区分** | 需要区分 MSYS/原生终端时使用全局函数 | `is_subhost("msys")` |
| **系统库版本不满足要求** | `on_fetch` 中校验版本后返回 `nil` | `semver.satisfies(ver, ">=x.y")` |
| **非标准版本 tag** | URL 传入 version 映射函数 | `add_urls(..., {version = fn})` |
| **无 Release 软件包** | 使用日期版本号 + 完整 commit hash | `add_versions("2024.01.01", "hash")` |
| **CI/平台预检** | 在最早阶段快速失败，跳过不支持环境 | `on_check(..., function (package) assert(...) end)` |
| **on_check 兼容写法** | 兼容旧版时先判断 `if on_check then` | `if on_check then on_check(...) end` |
| **宿主平台过滤安装** | 用 `@host` 语法限制安装脚本执行环境 | `on_install("@windows", "@linux", fn)` |
| **宿主平台 + 架构过滤** | `@host\|arch` 组合精确限制预编译/安装逻辑 | `on_install("@linux\|x86_64", fn)` |
| **路径型环境变量导出** | 对 `PYTHONPATH` 等变量标记为 pathenv，避免路径拼接异常；`mark_as_pathenv` 仅在 `on_load` 调用 | `package:addenv("PYTHONPATH", "python")`, `package:mark_as_pathenv("PYTHONPATH")` |
| **系统源探测入口** | 除发行版名外也可接入 pkg-config 探测 | `add_extsources("pkgconfig::libxml-2.0")` |
| **组件化系统源映射** | 在 `on_load` 按配置动态追加 `extsources` | `package:add("extsources", "apt::libxcb-foo-dev")` |
| **on_test 豁免场景** | 仅 `on_fetch`、`set_base` 转发包、`template` 元包、依赖聚合语法糖包、父生态统一验证子包可豁免 | `on_fetch(...)`, `set_base("...")`, `set_kind("template")` |
| **平台分流转发包** | 平台间混合“系统库/第三方依赖”时保留 `on_install` 做分流适配 | `on_install(...)`, `is_plat(...)` |
| **构建工具依赖透传** | `packagedeps` 通过 `cxflags/shflags` 直传依赖信息；作为 patch 构建脚本无果后的最后手段 | `import("package.tools.cmake").install(..., {packagedeps = {"libogg"}})` |
| **依赖级联链接缺失** | 遍历 `orderdeps` + `fetch` 手动注入编译/链接参数 | `for _, dep in ipairs(package:orderdeps()) do ... end` |
| **动态组件注册** | 在 `on_load` 动态添加组件并声明默认/依赖关系 | `package:add("components", "base", {default = true})` |
| **链接顺序敏感平台** | 顶层优先用 `add_linkorders` 固定顺序；动态场景在 `on_load` 用 `package:add("linkorders", ...)`；分组可用 `group::` 前缀 | `add_linkorders("mingw32", "SDL2main")` |
| **补丁文件后缀** | 结构性修复可用 `.patch` 或 `.diff` | `add_patches("x", "patches/x/fix.diff", "<sha256>")` |
| **补丁应用顺序** | 同版本多个 `add_patches` 不保证顺序；禁止顺序依赖，必要时合并补丁或改用 `io.replace` | `add_patches(...)`, `io.replace(...)` |
| **工具链版本条件补丁** | 在 `on_load` 读取工具链配置后动态追加补丁，仅对命中环境生效 | `package:toolchain("ndk"):config("ndkver")`, `package:add("patches", ...)` |
| **补丁文件编码规范** | 补丁统一 `UTF-8` 无 BOM + `LF`，变更后需重算 SHA256 | `add_patches(..., "<sha256>")` |
| **上游仅预编译发布** | 显式记录来源与平台架构限制后直接打包上游产物 | `os.cp("objs/x64/*.obj", package:installdir("lib"))` |
| **预编译与源码双路径** | 通过 `is_precompiled` 仅在源码路径添加构建依赖 | `if not package:is_precompiled() then package:add("deps", "perl") end` |
| **包规则导出** | 通过 `rules/*.lua` 向下游导出 `@pkg/rule` | `add_rules("@yy-thunks/xp")` |
| **依赖不向下游传递** | 声明为私有依赖 | `add_deps("lib", {private = true})` |

---

## 12. Xmake 脚本编写边界情况 {#script-corner-cases}

| 场景 | 处理策略 | 常用 API |
| :--- | :--- | :--- |
| **头文件重名冲突** | 使用 `prefixdir` 将头文件安装到子目录 | `add_headerfiles("...", {prefixdir = "foo"})` |
| **模板配置文件生成** | Port 中用 `set_configvar` + `add_configfiles` 生成 `config.h`/`.pc` | `set_configvar("FOO", 1)`, `add_configfiles("config.h.in")` |
