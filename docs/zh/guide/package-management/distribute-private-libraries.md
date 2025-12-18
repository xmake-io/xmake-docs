---
outline: deep
---

# 分发私有库 {#distribute-private-libraries}

Xmake 不仅支持从官方仓库安装包，也支持用户创建和分发私有库。这对于公司内部的私有代码库复用非常有用。

我们可以将编译好的静态库/动态库打包成[本地包](#distribute-as-local-package)或者[远程包](#distribute-as-remote-package)进行分发，也可以直接[安装到系统目录](#install-to-system)。

## 创建库工程 {#prepare-library-project}

首先，我们可以使用 [`xmake create`](/zh/guide/basic-commands/create-project.html) 命令快速创建一个空的静态库或者动态库工程。

```bash
$ xmake create -t static test
create test ...
  [+]: xmake.lua
  [+]: src/foo.cpp
  [+]: src/foo.h
  [+]: src/main.cpp
  [+]: .gitignore
create ok!
```

默认生成的 `xmake.lua` 比较简单，我们需要稍微修改下，加上 [`add_headerfiles`](/zh/api/description/project-target.html#add_headerfiles) 导出头文件，以便安装的时候，能把库的头文件也安装过去。

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("static")
    add_files("src/foo.cpp")
    add_headerfiles("src/foo.h")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.cpp")
```

默认情况下，`add_headerfiles` 会将头文件直接安装到 `include` 目录下。

如果想让头文件安装到子目录（例如 `include/foo/foo.h`），以避免文件名冲突，我们可以设置 `prefixdir`：

```lua
add_headerfiles("src/foo.h", {prefixdir = "foo"})
```

更多详细用法，请参考：[add_headerfiles 接口文档](/zh/api/description/project-target.html#add_headerfiles)。

除了头文件，我们还可以使用 [`add_installfiles`](/zh/api/description/project-target.html#add_installfiles) 安装其他任意文件，比如文档、脚本、资源文件等。

```lua
-- 安装 readme.md 到 share/doc/foo 目录
add_installfiles("readme.md", {prefixdir = "share/doc/foo"})

-- 安装 assets 下的所有文件
add_installfiles("assets/**", {prefixdir = "share/foo/assets"})
```

## 分发本地包 (Local Package) {#distribute-as-local-package}

如果我们的库仅仅在本地局域网，或者通过网盘共享给其他人使用，不需要部署到远程 git 仓库，可以使用本地包分发。

本地包的优势在于：
- 不需要搭建 Git 仓库
- 编译好的二进制直接分发，集成速度快
- 支持多平台、多架构、多编译模式（Debug/Release）的二进制包

### 打包生成 {#local-package-packaging}

在库工程根目录下，执行 [`xmake package`](/zh/guide/basic-commands/pack-programs.html) 命令（或者完整命令 `xmake package -f local`）即可打包。

```bash
$ xmake package
checking for platform ... macosx 
checking for architecture ... x86_64 
checking for Xcode directory ... /Applications/Xcode.app 
checking for SDK version of Xcode for macosx (x86_64) ... 15.2 
checking for Minimal target version of Xcode for macosx (x86_64) ... 15.2 
[ 23%]: cache compiling.release src/main.cpp 
[ 23%]: cache compiling.release src/foo.cpp 
[ 35%]: archiving.release libfoo.a 
[ 71%]: linking.release test 
[100%]: build ok, spent 3.31s 
installing foo to build/packages/f/foo/macosx/x86_64/release .. 
package(foo): build/packages/f/foo generated 
installing test to build/packages/t/test/macosx/x86_64/release .. 
package(test): build/packages/t/test generated 
```

默认情况下，它会生成在 `build/packages` 目录下。

```
build/packages/
├── f 
│   └── foo 
│       ├── macosx 
│       │   └── x86_64 
│       │       └── release 
│       │           ├── include 
│       │           │   └── foo.h 
│       │           └── lib 
│       │               └── libfoo.a 
│       └── xmake.lua 
└── t 
    └── test 
        ├── macosx 
        │   └── x86_64 
        │       └── release 
        │           └── bin 
        │               └── test 
        └── xmake.lua 
```

每个包目录下都包含了生成的二进制库文件 (`.a`/`.lib`/`.so`/`.dll`) 和头文件。

### 使用本地包 {#local-package-integration}

我们将生成的 `build/packages` 目录复制到任意位置，或者直接使用它。然后在消费端的工程 `xmake.lua` 中配置：

```lua
add_rules("mode.debug", "mode.release")

-- 添加本地包仓库目录，指向 packages 目录
add_repositories("local-repo /path/to/test/build/packages")

-- 引入 foo 包
add_requires("foo")

target("bar")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("foo")
```

这里我们使用了几个接口：
* [`add_repositories`](/zh/api/description/global-interfaces.html#add_repositories): 添加自定义的包仓库。第一个参数 `local-repo` 是仓库名称，第二个参数是仓库地址（这里是本地路径）。
* [`add_requires`](/zh/api/description/global-interfaces.html#add_requires): 声明项目依赖的包。
* [`add_packages`](/zh/api/description/project-target.html#add_packages): 将指定的包链接到当前目标（target）。

::: tip 仓库与包的区别
这里需要区分 **仓库 (Repository)** 和 **包 (Package)** 的概念：

* **仓库**：是一个包描述文件的集合，它可以维护和管理多个包。
* **包**：具体的某个库或工具（比如 `foo`, `zlib`）。

一个仓库可以包含多个包，它们的组织结构通常如下（首字母分类）：

```
repository/
└── packages/
    ├── f/
    │   ├── foo/
    │   │   └── xmake.lua
    │   └── bar/
    │       └── xmake.lua
    └── z/
        └── zlib/
            └── xmake.lua
```

上文中 `xmake package` 生成的 `build/packages` 目录，实际上就是一个符合 Xmake 仓库规范的目录结构。因此，我们可以通过 `add_repositories` 将其作为仓库导入，Xmake 会自动在里面查找我们需要的 `foo` 包。
:::

执行 `xmake` 编译时，Xmake 会直接从本地仓库中链接对应的二进制库。

## 分发远程包 (Remote Package) {#distribute-as-remote-package}

如果我们需要通过 git 仓库进行版本管理和分发，可以使用远程包模式。它既支持分发源码包，也支持分发二进制包。

远程包的优势在于：
- 基于 Git 进行版本控制
- 支持源码分发（自动编译）和二进制分发（直接安装）
- 支持多版本切换

### 配置远程包 {#generate-package-configuration}

我们运行 [`xmake package -f remote`](/zh/guide/basic-commands/pack-programs.html#remote-package) 来生成远程包的配置模板。

```bash
$ xmake package -f remote
```

它会生成 `packages/f/foo/xmake.lua` 文件。我们可以根据需要修改它，支持源码分发或二进制分发。

#### 源码分发

这是最常用的方式，我们只需要配置 git 仓库地址，Xmake 会自动下载源码并编译安装。

```lua
package("foo")
    set_description("The foo package")
    set_license("Apache-2.0")

    -- 设置私有 git 仓库地址
    add_urls("git@github.com:mycompany/foo.git")
    add_versions("1.0", "<commit-sha>")

    on_install(function (package)
        local configs = {}
        if package:config("shared") then
            configs.kind = "shared"
        end
        import("package.tools.xmake").install(package, configs)
    end)
```

#### 二进制分发

如果我们不想泄露源码，或者想加速安装，可以预先编译好二进制包（例如 `.tar.gz`），上传到服务器，然后配置下载地址。

```lua
package("foo")
    set_description("The foo package")

    -- 设置预编译的二进制包地址
    add_urls("https://example.com/releases/foo-$(version).tar.gz")
    add_versions("1.0", "<shasum>")

    on_install(function (package)
        -- 直接解压安装二进制文件
        os.cp("include", package:installdir())
        os.cp("lib", package:installdir())
    end)
```

关于包配置的更多详细参数说明，请参考：[包配置说明](/zh/guide/package-management/package-distribution.html#define-package-configuration) 和 [包依赖 API](/zh/api/description/package-dependencies.html)。

另外，我们也可以参考官方仓库 [xmake-repo](https://github.com/xmake-io/xmake-repo) 中现有包的配置进行参考。

我们需要建立一个私有的 git 仓库（例如 `my-repo`），用来存储所有的包配置。将生成的 `packages` 目录推送到这个仓库中。

目录结构类似：
```
my-repo/
└── packages/
    └── f/
        └── foo/
            └── xmake.lua
```

### 使用远程包 {#remote-package-integration}

在消费端的工程中，我们需要添加这个私有仓库。

```lua
add_rules("mode.debug", "mode.release")

-- 添加私有 Git 仓库
add_repositories("my-repo git@github.com:mycompany/my-repo.git")

add_requires("foo")

target("bar")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("foo")
```

Xmake 会自动拉取 `my-repo` 仓库中的包描述，然后根据 `add_urls` 下载 `foo` 的源码进行编译安装。

## 分发 C++ Modules {#distribute-cxx-modules}

Xmake 也支持分发 C++ Modules 库。

### 准备模块库 {#prepare-module-library}

如果是纯模块库，我们建议在工程 `xmake.lua` 中配置 `set_kind("moduleonly")`，并导出 `.mpp` 等模块文件。

```lua
target("foo")
    set_kind("moduleonly")
    add_files("src/*.mpp")
```

### 定义模块包 {#define-module-package}

在包的描述域中，我们需要设置 `set_kind("library", {moduleonly = true})`，这样 Xmake 会将其作为纯模块包处理，不需要进行常规的库链接操作，也能更好地处理模块依赖。

```lua
package("foo")
    set_kind("library", {moduleonly = true})
    set_sourcedir(path.join(os.scriptdir(), "src"))

    on_install(function(package)
        import("package.tools.xmake").install(package, {})
    end)
```

### 使用模块包 {#consume-module-package}

使用模块包时，我们需要开启 C++20 模块构建支持。

```lua
add_repositories("my-repo git@github.com:mycompany/my-repo.git")
add_requires("foo")

target("bar")
    set_kind("binary")
    set_languages("c++20")
    add_packages("foo")
    -- 开启 C++ 模块构建策略
    set_policy("build.c++.modules", true)
```

更多完整示例，可以参考：[C++ Modules 包分发例子](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules/packages)。

## 管理包仓库 {#repository-management}

不管是远程包还是本地包，我们都可以灵活选择包仓库的管理方式。

### 项目内部维护 {#project-internal-maintenance}

如果是项目内部私有的包，不需要跨项目共享，我们可以直接将包仓库放置在项目目录下。

例如，我们在项目根目录下创建一个 `packages` 目录作为仓库：

```
projectdir/
├── packages/
│   └── f/
│       └── foo/
│           └── xmake.lua
├── src/
│   └── main.cpp
└── xmake.lua
```

然后在 `xmake.lua` 中通过 `add_repositories` 添加这个仓库（支持相对路径）：

```lua
add_repositories("my-repo packages")
add_requires("foo")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("foo")
```

这样，Xmake 就会自动在当前项目下的 `packages` 目录中查找 `foo` 包的配置。

### 私有 Git 仓库 {#private-git-repository}

如果需要在公司内部多个项目之间共享包，建立独立的 Git 仓库（如 GitHub 私有库、GitLab、Gitee 或公司内网 Git）来维护包配置是更好的选择。

我们可以通过 `add_repositories` 直接引入 git 仓库地址：

```lua
add_repositories("my-repo git@github.com:mycompany/my-repo.git")
```

如果仓库是私有的，请确保本地环境配置了 SSH Key 或者有访问权限。

另外，我们也可以通过 `xrepo add-repo` 或者 `xmake repo --add` 命令来添加仓库地址。

`xrepo` 是全局的独立命令，而 `xmake repo` 可以仅仅在本地项目中添加包仓库，不影响其他项目。

```bash
# 全局添加
$ xrepo add-repo my-repo git@github.com:mycompany/my-repo.git

# 仅当前项目添加
$ xmake repo --add my-repo git@github.com:mycompany/my-repo.git
```

### 官方仓库 {#official-repository}

如果你的包是开源的，并且希望分享给所有 Xmake 用户，可以提交到官方的 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库。具体贡献指南请参考：[提交包到官方仓库](/zh/guide/package-management/package-distribution.html#submit-packages-to-the-official-repository)。

## 安装到系统 {#install-to-system}

除了打包分发，我们在开发调试阶段，或者想直接将库安装到系统目录，供其他项目使用，可以直接运行 [`xmake install`](/zh/guide/basic-commands/install-and-uninstall.html)。

```bash
$ xmake install
```

默认它会安装到系统目录，如果想安装到指定目录，可以指定输出目录：

```bash
$ xmake install -o /tmp/output
```

安装完成后，目录结构大概是这样的：

```
/tmp/output
├── include
│   └── foo.h
├── lib
│   ├── libfoo.a
│   └── pkgconfig
│       └── foo.pc
└── share
    └── cmake
        └── modules
            └── foo-config.cmake
```

由于我们配置了 `utils.install.pkgconfig_importfiles` 和 `utils.install.cmake_importfiles` 规则（详见 [在其他构建系统中使用](#use-in-other-build-systems)），所以安装的时候会自动生成 `foo.pc` 和 `foo-config.cmake` 文件。

这样，其他非 xmake 的第三方项目（例如 CMake 项目）也可以通过 `find_package(foo)` 找到并集成它。

## 集成到第三方构建系统 {#use-in-other-build-systems}

如果我们开发的是一个库，最终需要给其他非 xmake 项目使用，我们可以通过以下几种方式进行集成。

### 使用 CMake (Xrepo) {#use-in-cmake-via-xrepo}

如果是 CMake 项目，我们可以使用 [xrepo-cmake](https://github.com/xmake-io/xrepo-cmake) 来直接集成 Xmake 管理的包。

```cmake
# 下载 xrepo.cmake
if(NOT EXISTS "${CMAKE_BINARY_DIR}/xrepo.cmake")
    file(DOWNLOAD "https://raw.githubusercontent.com/xmake-io/xrepo-cmake/main/xrepo.cmake"
                  "${CMAKE_BINARY_DIR}/xrepo.cmake" TLS_VERIFY ON)
endif()
include(${CMAKE_BINARY_DIR}/xrepo.cmake)

# 引入包
xrepo_package("foo")

# 链接包
target_link_libraries(demo PRIVATE foo)
```

对于私有仓库的包，我们需要确保本地已经添加了对应的仓库（`xrepo add-repo myrepo ...`）。

更详细的使用说明，请参考：[在 CMake 中使用 Xmake 包](/zh/guide/package-management/using-packages-in-cmake.html)。

### 使用 CMake/Pkg-config {#use-in-cmake-pkgconfig}

我们也可以通过配置 `utils.install.pkgconfig_importfiles` 和 `utils.install.cmake_importfiles` 规则，在安装库的同时生成导入文件。

```lua
target("foo")
    set_kind("static")
    add_files("src/foo.cpp")
    add_headerfiles("src/foo.h")
    
    -- 导出 pkgconfig/cmake 导入文件
    add_rules("utils.install.pkgconfig_importfiles")
    add_rules("utils.install.cmake_importfiles")
```

这样，用户执行 `xmake install` 将库安装到系统后，就可以直接使用标准的方式来查找和使用库。

**CMake**

```cmake
find_package(foo REQUIRED)
target_link_libraries(demo PRIVATE foo::foo)
```

**Pkg-config**

```bash
pkg-config --cflags --libs foo
```

## 生成安装包 (XPack) {#generate-installation-package}

Xmake 还支持使用 [XPack](/zh/guide/basic-commands/pack-programs.html#xpack) 插件生成各种格式的安装包，例如 NSIS, Deb, RPM, Zip 等。

这对于分发二进制 SDK 或者部署到生产环境非常有用。

### 支持格式

* **Windows**: `nsis`, `wix`, `zip`, `targz`
* **Linux**: `deb`, `rpm`, `srpm`, `runself` (shell 自解压脚本), `targz`, `srczip`, `appimage`
* **MacOS**: `dmg`, `zip`, `targz`, `runself`

### 配置示例

我们可以在 `xmake.lua` 中添加 `xpack` 配置域来定义打包规则。

例如，配置生成一个 NSIS 安装包：

```lua
-- 引入 xpack 插件
includes("@builtin/xpack")

target("foo")
    set_kind("shared")
    add_files("src/*.cpp")
    add_headerfiles("src/*.h")

xpack("foo")
    set_formats("nsis")
    set_title("Foo Library")
    set_description("The foo library package")
    set_author("ruki")
    set_version("1.0.0")
    
    -- 添加需要打包的目标
    add_targets("foo")
    
    -- 添加其他文件
    add_installfiles("doc/*.md", {prefixdir = "share/doc/foo"})
```

然后执行打包命令：

```bash
$ xmake pack
```

它会自动下载 NSIS 工具并生成安装包。生成的安装包可以双击安装，自动配置 PATH 等环境变量，方便用户使用。

更多详情，请查看文档：[XPack 打包](/zh/guide/extensions/builtin-plugins.html#xpack)。
