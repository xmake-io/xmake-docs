# C++ Modules 使用与示例 {#cxx-modules}

## 基础介绍 {#introduction}

Xmake 采用 `.mpp` 作为默认的模块扩展名，同时也支持 `.ixx`、`.cppm`、`.mxx` 等。已完整支持 gcc11/clang/msvc 的 C++20 Modules 构建，并能自动分析模块间依赖，实现最大化并行编译。

**最基础用法：**

```lua
set_languages("c++20")
target("class")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

> 更多官方示例见：[C++ Modules 示例集](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules)

---

## 进阶用法 {#advanced-usage}

### 仅 Cpp 工程启用 Modules

v2.7.1 起支持 Headerunits，可在模块中引入 STL 和用户头文件模块。通常需至少有一个 `.mpp` 文件才会启用 modules 编译，但也可通过：

```lua
add_rules("mode.debug", "mode.release")
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    set_languages("c++20")
    set_policy("build.c++.modules", true)
```

### Headerunits 示例

- 如何将 STL 或自定义头文件作为 headerunit 引入模块，见 [headerunits 示例](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules/headerunits)。

---

## 模块包分发与集成 {#distribution}

### 分发 C++ Modules 包

通过 `{install = true}` 指定需要安装分发的模块文件：

```lua
add_rules("mode.release", "mode.debug")
set_languages("c++20")
target("foo")
    set_kind("static")
    add_files("*.cpp")
    add_files("*.mpp", { install = true })
```

可将其做成包，提交到 [xmake-repo](https://github.com/xmake-io/xmake-repo) 或本地/私有仓库。

本地包示例：

```lua
package("foo")
    set_sourcedir(path.join(os.scriptdir(), "src"))
    on_install(function(package)
        import("package.tools.xmake").install(package, {})
    end)
```

### 集成 C++ Modules 包

通过 `add_requires("foo")` 快速集成：

```lua
add_rules("mode.release", "mode.debug")
set_languages("c++20")
add_repositories("my-repo my-repo")
add_requires("foo", "bar")
target("packages")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("foo", "bar")
    set_policy("build.c++.modules", true)
```

---

## C++23 标准库模块 {#stdmodules}

支持 C++23 标准库模块（stdmodules）：

```lua
add_rules("mode.debug", "mode.release")
set_languages("c++latest")
target("mod")
    set_kind("static")
    add_files("src/*.cpp")
    add_files("src/*.mpp", {public = true})
target("stdmodules")
    set_kind("binary")
    add_files("test/*.cpp")
    add_deps("mod")
```

```c++
// my_module.mpp
export module my_module;
import std;
export auto my_sum(std::size_t a, std::size_t b) -> std::size_t;
```

---

## 更多 C++ Modules 示例集锦 {#examples}

Xmake 官方仓库 [C++ Modules 示例集](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules) 提供了丰富的 C++20/23 Modules 工程，每个子目录为一个独立示例：

- **basic**：基础模块用法
- **class**：模块中导出类
- **headerunits**：Headerunits 用法
- **import_std**：标准库模块
- **partition**：模块分区
- **packages**：模块包分发与集成
- **stdmodules**：C++23 标准库模块

每个示例目录下均有完整的 `xmake.lua` 和源码，适合深入学习和参考。
