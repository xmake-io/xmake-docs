# C++ Modules 使用与示例 {#cxx-modules}

## 基础介绍 {#introduction}

Xmake 采用 `.mpp` 作为默认的模块扩展名，同时也支持 `.ixx`、`.cppm`、`.mxx` 等。已完整支持 gcc11/clang/msvc 的 C++20 Modules 构建，并能自动分析模块间依赖，实现最大化并行编译。

## 基础示例 {#basic-example}

<FileExplorer rootFilesDir="examples/cpp/modules/basic" />

## 模块类导出示例 {#class-example}

在模块中导出类：

<FileExplorer rootFilesDir="examples/cpp/modules/class" />

## 模块分区示例 {#partition-example}

使用模块分区（Module Partitions）：

<FileExplorer rootFilesDir="examples/cpp/modules/partition" />

## 动态库模块示例 {#shared-library-example}

创建带有模块的动态库：

<FileExplorer rootFilesDir="examples/cpp/modules/shared_library" />

## 跨目标依赖示例 {#cross-target-example}

Target 之间的模块依赖：

<FileExplorer rootFilesDir="examples/cpp/modules/cross_target" />

## 模块私有片段示例 {#private-fragment-example}

使用模块私有片段（Private Module Fragment）隐藏实现细节：

<FileExplorer rootFilesDir="examples/cpp/modules/private_fragment" />

## 模块实现单元示例 {#implementation-unit-example}

分离模块接口和实现（Module Implementation Unit）：

<FileExplorer rootFilesDir="examples/cpp/modules/implementation_unit" />

## 模块聚合示例 {#aggregation-example}

使用 `export import` 聚合子模块：

<FileExplorer rootFilesDir="examples/cpp/modules/aggregation" />

## 仅 Cpp 工程启用 Modules {#cpp-only-example}

v2.7.1 起支持 Headerunits，可在模块中引入 STL 和用户头文件模块。通常需至少有一个 `.mpp` 文件才会启用 modules 编译，但也可通过配置强制启用：

<FileExplorer rootFilesDir="examples/cpp/modules/cpp_only" />

## Headerunits 示例 {#headerunits-example}

如何将 STL 或自定义头文件作为 headerunit 引入模块，见下面的示例：

<FileExplorer rootFilesDir="examples/cpp/modules/headerunits" />

## C++23 标准库模块 {#stdmodules-example}

支持 C++23 标准库模块（stdmodules）：

<FileExplorer rootFilesDir="examples/cpp/modules/stdmodules" />

## 模块包分发 {#distribution-example}

定义和分发 C++ Modules 包：

<FileExplorer rootFilesDir="examples/cpp/modules/distribution" defaultOpenPath="src/xmake.lua" :highlights="{'src/xmake.lua': '8-9'}" />

## 模块包集成 {#integration-example}

通过 `add_requires("foo")` 快速集成：

<FileExplorer rootFilesDir="examples/cpp/modules/integration" />

> 更多官方示例见：[C++ Modules 示例集](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules)
