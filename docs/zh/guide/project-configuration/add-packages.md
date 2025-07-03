# 添加依赖包 {#add-packages}

## 简介

Xmake 内置支持包依赖集成，可以通过 [add_requires](/zh/api/description/global-interfaces.html#add-requires) 接口声明需要的依赖包。

然后通过 [add_packages](/zh/api/description/project-target.html#add-packages) 接口，将声明的包绑定到需要的编译目标中去，例如：

```lua [xmake.lua]
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")

target("foo")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libpng")

target("bar")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

其中 `add_requires` 是全局接口，用于包的配置声明，Xmake 会根据声明的包来触发查找安装。

由于一个工程，可能存在多个目标程序，每个目标程序可能需要的依赖包是不同的，因此我们还需要通过 `add_packages` 来将绑定目标。

上面的配置示例中，foo 目标绑定了 tbox 和 libpng 两个包，而 bar 目标绑定了 zlib 包。

## 基本用法与常见场景 {#basic-usage}

- `add_requires("pkgname")` 声明依赖包，支持版本、可选、别名等
- `add_packages("pkgname")` 绑定包到目标，自动追加 links、includedirs 等

### 典型场景

- 多目标分别依赖不同包
- 同一目标依赖多个包
- 支持 C/C++/Fortran/多平台

## API 详解 {#api-details}

### 指定包版本

```lua
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")
```

### 可选包

```lua
add_requires("foo", {optional = true})
```

### 禁用系统库

```lua
add_requires("foo", {system = false})
```

### 指定别名

```lua
add_requires("foo", {alias = "myfoo"})
add_packages("myfoo")
```

### 平台/架构限定

```lua
add_requires("foo", {plat = "windows", arch = "x64"})
```

### 传递包配置参数

```lua
add_requires("tbox", {configs = {small = true}})
```

### 传递给依赖包

```lua
add_requireconfs("spdlog.fmt", {configs = {header_only = true}})
```

## 包依赖的高级特性 {#advanced-features}

- 支持语义版本、分支、commit
- 支持 debug/release 依赖包
- 支持多仓库、私有仓库
- 支持包的本地/系统/远程优先级
- 支持包的额外编译参数

## 包实例接口 {#package-instance}

在自定义规则、after_install 等脚本中可用：

- `package:name()` 获取包名
- `package:version_str()` 获取包版本
- `package:installdir()` 获取包安装目录
- `package:get("links")` 获取链接库
- `package:get("includedirs")` 获取头文件目录

## 典型示例 {#examples}

### 1. 依赖可选包

```lua
add_requires("foo", {optional = true})
target("bar")
    add_packages("foo")
```

### 2. 依赖指定分支/commit

```lua
add_requires("tbox master")
add_requires("zlib 1.2.11")
```

### 3. 传递参数给包

```lua
add_requires("spdlog", {configs = {header_only = true}})
```

### 4. 依赖本地包

1. 在工程目录下新建本地包仓库目录（如 `local-repo/packages/foo/xmake.lua`）。
2. 在 `xmake.lua` 中添加本地仓库：

```lua
add_repositories("myrepo local-repo")
add_requires("foo")
```

3. 本地包描述文件结构示例：

```
local-repo/
  packages/
    foo/
      xmake.lua
```

4. 这样即可像官方包一样通过 `add_requires("foo")` 使用本地包。

## 最佳实践 {#best-practices}

1. 推荐用 `add_requires` + `add_packages` 组合声明和绑定
2. 可选包用 `{optional = true}`，提升兼容性
3. 多平台用 `{plat=..., arch=...}` 精准控制
4. 善用 `add_requireconfs` 递归配置依赖包
5. 通过 `xmake require --info pkg` 查询包参数

## 更多信息 {#more-information}

- 官方包用法：[使用官方包](/zh/guide/package-management/using-official-packages)
- 包依赖 API：[包依赖 API](/zh/api/description/package-dependencies)
- 包实例接口：[package 实例 API](/zh/api/scripts/package-instance)
- 包管理与查找：可使用 [xrepo 命令行工具](/zh/guide/package-management/xrepo-cli) 进行包的搜索、安装、卸载等操作。
