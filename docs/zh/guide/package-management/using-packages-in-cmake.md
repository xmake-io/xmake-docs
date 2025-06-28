# 在 CMake 中使用包 {#using-package-in-cmake}

我们新增了一个独立项目 [xrepo-cmake](https://github.com/xmake-io/xrepo-cmake)。

它是一个基于 Xrepo/Xmake 的 C/C++ 包管理器的 CMake 包装器。

这允许使用 CMake 来构建您的项目，同时使用 Xrepo 来管理依赖包。这个项目的部分灵感来自 [cmake-conan](https://github.com/conan-io/cmake-conan)。

此项目的示例用例：

- 想要使用 Xrepo 管理包的现有 CMake 项目。
- 必须使用 CMake，但想使用 Xrepo 管理的新项目包。

## APIs

### xrepo_package

[xrepo.cmake](https://github.com/xmake-io/xrepo-cmake/blob/main/xrepo.cmake) 提供`xrepo_package`函数来管理包。

```cmake
xrepo_package(
    "foo 1.2.3"
    [CONFIGS feature1=true,feature2=false]
    [CONFIGS path/to/script.lua]
    [DEPS]
    [MODE debug|release]
    [ALIAS aliasname]
    [OUTPUT verbose|diagnosis|quiet]
    [DIRECTORY_SCOPE]
)
```

一些函数参数直接对应于 Xrepo 命令选项。

`xrepo_package` 将软件包安装目录添加到 `CMAKE_PREFIX_PATH`。所以`find_package`
可以使用。如果 `CMAKE_MINIMUM_REQUIRED_VERSION` >= 3.1，cmake `pkgConfig` 也会搜索
对于软件包安装目录下的 pkgconfig 文件。

调用 `xrepo_package(foo)` 后，有 `foo` 包的三种使用方式：

1. 如果包提供 cmake 配置文件，则调用 `find_package(foo)`。
    - 有关详细信息，请参阅 CMake [`find_package`](https://cmake.org/cmake/help/latest/command/find_package.html) 文档。
2.如果包没有提供cmake配置文件或者找不到模块
   - 以下变量可用于使用pacakge（cmake后的变量名
     查找模块 [标准变量名称](https://cmake.org/cmake/help/latest/manual/cmake-developer.7.html#standard-variable-names))
     - `foo_INCLUDE_DIRS`
     - `foo_LIBRARY_DIRS`
     - `foo_LIBRARIES`
     - `foo_DEFINITIONS`
   - 如果指定了 `DIRECTORY_SCOPE`，则 `xrepo_package` 将运行以下代码
     ```cmake
     include_directories(${foo_INCLUDE_DIRS})
     link_directories(${foo_LIBRARY_DIRS})
     ```
3. 使用`xrepo_target_packages`。请参阅以下部分。

注意 `CONFIGS path/to/script.lua` 用于对包配置进行精细控制。
例如：
  - 排除系统上的包。
  - 覆盖依赖包的默认配置，例如设置`shared=true`。

如果指定了 `DEPS`，所有依赖库都将添加到 `CMAKE_PREFIX_PATH`，以及 include 和 libraries 那四个变量中。

### xrepo_target_packages

将包 includedirs 和 links/linkdirs 添加到给定的目标。

```cmake
xrepo_target_packages(
    target
    [NO_LINK_LIBRARIES]
    [PRIVATE|PUBLIC|INTERFACE]
    package1 package2 ...
)
```

## 使用来自官方存储库的包

Xrepo 官方仓库：[xmake-repo](https://github.com/xmake-io/xmake-repo)

这是一个使用 `gflags` 包版本 2.2.2 的示例 `CMakeLists.txt` 由 Xrepo 管理。

### 集成 xrepo.cmake

```cmake
cmake_minimum_required(VERSION 3.13.0)

project(foo)

# Download xrepo.cmake if not exists in build directory.
if(NOT EXISTS "${CMAKE_BINARY_DIR}/xrepo.cmake")
    message(STATUS "Downloading xrepo.cmake from https://github.com/xmake-io/xrepo-cmake/")
    # mirror https://cdn.jsdelivr.net/gh/xmake-io/xrepo-cmake@main/xrepo.cmake
    file(DOWNLOAD "https://raw.githubusercontent.com/xmake-io/xrepo-cmake/main/xrepo.cmake"
                  "${CMAKE_BINARY_DIR}/xrepo.cmake"
                  TLS_VERIFY ON)
endif()

# Include xrepo.cmake so we can use xrepo_package function.
include(${CMAKE_BINARY_DIR}/xrepo.cmake)
```

### 添加包

```cmake
xrepo_package("zlib")

add_executable(example-bin "")
target_sources(example-bin PRIVATE
    src/main.cpp
)
xrepo_target_packages(example-bin zlib)
```

### 添加带有配置的包

```cmake
xrepo_package("gflags 2.2.2" CONFIGS "shared=true,mt=true")

add_executable(example-bin "")
target_sources(example-bin PRIVATE
    src/main.cpp
)
xrepo_target_packages(example-bin gflags)
```

### 添加带有 cmake 导入模块的包

```cmake
xrepo_package("gflags 2.2.2" CONFIGS "shared=true,mt=true")

# `xrepo_package` 会将 gflags 安装目录添加到 CMAKE_PREFIX_PATH.
# `find_package(gflags)` 会从 CMAKE_PREFIX_PATH 包含的目录中找到 gflags 提供的
# config-file 文件。
# 参考 https://cmake.org/cmake/help/latest/command/find_package.html#search-modes
find_package(gflags CONFIG COMPONENTS shared)

add_executable(example-bin "")
target_sources(example-bin PRIVATE
    src/main.cpp
)
target_link_libraries(example-bin gflags)
```

### 添加自定义包

```cmake
set(XREPO_XMAKEFILE ${CMAKE_CURRENT_SOURCE_DIR}/packages/xmake.lua)
xrepo_package("myzlib")

add_executable(example-bin "")
target_sources(example-bin PRIVATE
    src/main.cpp
)
xrepo_target_packages(example-bin myzlib)
```

在 packages/xmake.lua 中定义一个包：

```lua
package("myzlib")
    -- ...
```

我们可以自定义一个包，具体定义方式，参考文档：[自定义 Xrepo 包](/zh/guide/package-management/package-distribution#define-package-configuration).


## 使用来自第三个存储库的包

除了从官方维护的存储库安装软件包之外，Xrepo 还可以安装来自第三方包管理器的包，例如 vcpkg/conan/conda/pacman/homebrew/apt/dub/cargo。

关于命令行的使用，我们可以参考文档：[Xrepo命令用法](/zh/guide/package-management/xrepo-cli).

我们也可以直接在 cmake 中使用它来安装来自第三方仓库的包，只需将仓库名称添加为命名空间即可。例如：`vcpkg::zlib`, `conan::pcre2`

### Conan

```cmake
xrepo_package("conan::gflags/2.2.2")
```

### Conda

```cmake
xrepo_package("conda::gflags 2.2.2")
```

### Vcpkg

```cmake
xrepo_package("vcpkg::gflags")
```

### Homebrew

```cmake
xrepo_package("brew::gflags")
```
