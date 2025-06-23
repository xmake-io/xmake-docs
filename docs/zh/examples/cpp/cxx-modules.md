Xmake 采用 `.mpp` 作为默认的模块扩展名，但是也同时支持 `.ixx`, `.cppm`, `.mxx` 等扩展名。

目前 xmake 已经完整支持 gcc11/clang/msvc 的 C++20 Modules 构建支持，并且能够自动分析模块间的依赖关系，实现最大化并行编译。

```lua
set_languages("c++20")
target("class")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

更多例子见：[C++ Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules)

## Cpp-Only 工程 {#cpp-only}

v2.7.1 版本对 C++20 模块的实现进行了重构和升级，新增了对 Headerunits 的支持，我们可以在模块中引入 Stl 和 用户头文件模块。

相关的补丁见：[#2641](https://github.com/xmake-io/xmake/pull/2641)。

注：通常我们至少需要添加一个 `.mpp` 文件，才能开启 C++20 modules 编译，如果只有 cpp 文件，默认是不会开启模块编译的。

但是，如果我们仅仅只是想在 cpp 文件中使用模块的 Headerunits 特性，比如引入一些 stl Headerunits 在 cpp 中使用，
那么我们也可以通过设置 `set_policy("build.c++.modules", true)` 来强行开启 C++ Modules 编译，例如：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    set_languages("c++20")
    set_policy("build.c++.modules", true)
```

## 模块的分发和集成 {#distribution}

### 分发 C++ Modules 包

我们先使用 xmake.lua 维护模块的构建，并通过指定 `{install = true}`，来告诉 xmake 哪些模块文件需要安装对外分发。

```lua
add_rules("mode.release", "mode.debug")
set_languages("c++20")

target("foo")
    set_kind("static")
    add_files("*.cpp")
    add_files("*.mpp", { install = true })
```

然后，我们把它做成包，可以提交到 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库，当然也可以直接做成本地包，或者私有仓库包。

这里，为了方便测试验证，我们仅仅通过 `set_sourcedir` 将它做成本地包。

```lua
package("foo")
    set_sourcedir(path.join(os.scriptdir(), "src"))
    on_install(function(package)
        import("package.tools.xmake").install(package, {})
    end)
```

### 集成 C++ Modules 包

然后，我们通过 `add_requires("foo")` 的包集成接口，对 C++ Modules 包进行快速集成使用。

由于 foo 的模块包，我们放在私有仓库中定义，所以我们通过 `add_repositories("my-repo my-repo")` 引入自己的包仓库。

如果，包已经提交到 xmake-repo 官方仓库，就不需要额外配置它。

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

集成好包后，我们就可以执行 `xmake` 命令，一键下载、编译、集成 C++ Modules 包来使用。

```bash
$ xmake
checking for platform ... linux
checking for architecture ... x86_64
note: install or modify (m) these packages (pass -y to skip confirm)?
in my-repo:
  -> foo latest
  -> bar latest
please input: y (y/n/m)

  => install bar latest .. ok
  => install foo latest .. ok
[  0%]: generating.module.deps src/main.cpp
[  0%]: generating.module.deps /mnt/xmake/tests/projects/c++/modules/packages/build/.packages/b/bar/latest/4e0143c97b65425b855ad5fd03038b6a/modules/bar/bar.mpp
[  0%]: generating.module.deps /mnt/xmake/tests/projects/c++/modules/packages/build/.packages/f/foo/latest/4e0143c97b65425b855ad5fd03038b6a/modules/foo/foo.mpp
[ 14%]: compiling.module.release bar
[ 14%]: compiling.module.release foo
[ 57%]: compiling.release src/main.cpp
[ 71%]: linking.release packages
[100%]: build ok!
```

注：每个包安装后，会在包路径下，存储维护模块的 meta-info 文件，这是 `p2473r1.pdf` 中约定的一种格式规范，也许它不是最终的标准，但这并不影响我们现在去使用模块的分发。

```bash
$ cat ./build/.packages/f/foo/latest/4e0143c97b65425b855ad5fd03038b6a/modules/foo/foo.mpp.meta-info
{"_VENDOR_extension":{"xmake":{"name":"foo","file":"foo.mpp"}},"definitions":{},"include_paths":{}}
```

完整的例子工程见：[C++ Modules 包分发例子工程](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules/packages)

## 支持 C++23 Std Modules {#std-modules}

[Arthapz](https://github.com/Arthapz) 也帮忙改进了对 C++23 Std Modules 的支持。

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

```c++ [my_module.mpp]
export module my_module;

import std;

export auto my_sum(std::size_t a, std::size_t b) -> std::size_t;
```

```c++ [my_module.cpp]
module my_module;

import std;

auto my_sum(std::size_t a, std::size_t b) -> std::size_t { return a + b; }
```
