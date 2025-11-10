# 使用本地包 {#using-local-packages}

## 生成本地包 {#local-package-generate}

2.5.5 版本之后，我们提供了一种新的本地包打包方案，将会更加无缝地对接 `add_requires` 和 `add_packages`。

我们执行 `xmake package` 命令就能够生成默认的新版打包格式。

```sh
$ xmake package
package(foo): build/packages/f/foo generated
```

它会生成 `build/packages/f/foo/xmake.lua` 文件，内容如下：

```lua
package("foo")
    set_description("The foo package")
    set_license("Apache-2.0")
    add_deps("add", "sub")

    on_load(function (package)
        package:set("installdir", path.join(os.scriptdir(), package:plat(), package:arch(), package:mode()))
    end)

    on_fetch(function (package)
        local result = {}
        result.links = "foo"
        result.linkdirs = package:installdir("lib")
        result.includedirs = package:installdir("include")
        return result
    end)
```

其实就是采用 `package()` 来定义描述本地包，和远程包一样。

而生成的目录结构如下：

```sh
$ tree build/packages/f/foo/
build/packages/f/foo/
├── macosx
│   └── x86_64
│       └── release
│           ├── include
│           │   └── foo.h
│           └── lib
│               └── libfoo.a
└── xmake.lua
```

## 使用本地包 {#local-package-use}

我们也能够使用 `add_requires`/`add_repositories` 接口来无缝集成这个包。

```lua
add_rules("mode.debug", "mode.release")

add_repositories("local-repo build")
add_requires("foo")

target("bar")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("foo")
```

其中，add_repositories 配置指定本地包的仓库根目录，然后就可以通过 `add_requires` 来引用这个包了。

另外，生成的本地包还有一个特性，就是支持 `target/add_deps`，会自动关联多个包的依赖关系，集成时也会自动对接所有依赖链。

这里有完整的[测试例子](https://github.com/xmake-io/xmake/blob/dev/tests/actions/package/localpkg/test.lua)。

```sh
"/usr/bin/xcrun -sdk macosx clang++" -o build/macosx/x86_64/release/bar build/.objs/bar/macosx/x86_64/release/src/main.cpp.o -arch x86_64 -mmacosx-version-min=10.15 -isysroot
/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX11.0.sdk -stdlib=libc++
 -L/Users/ruki/projects/personal/xmake/tests/actions/package/localpkg/bar/build/packages/f/foo/macosx/x86_64/release/lib
 -L/Users/ruki/projects/personal/xmake/tests/actions/package/localpkg/bar/build/packages/s/sub/macosx/x86_64/release/lib
 -L/Users/ruki/projects/personal/xmake/tests/actions/package/localpkg/bar/build/packages/a/add/macosx/x86_64/release/lib
 -Wl,-x -lfoo -lsub -ladd -lz
```

## 使用通过 CMake 查找到的包 {#local-package-cmake}

现在 cmake 已经是事实上的标准，所以 CMake 提供的 find_package 已经可以查找大量的库和模块，我们完全复用 cmake 的这部分生态来扩充 xmake 对包的集成。

我们可以通过 `find_package("cmake::xxx")` 去借助 cmake 来找一些包，xmake 会自动生成一个 cmake 脚本来调用 cmake 的 find_package 去查找一些包，获取里面包信息。

例如：

```sh
$ xmake l find_package cmake::ZLIB
{
  links = {
    "z"
  },
  includedirs = {
    "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.
15.sdk/usr/include"
  },
  linkdirs = {
    "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.
15.sdk/usr/lib"
  }
}
$ xmake l find_package cmake::LibXml2
{
  links = {
    "xml2"
  },
  includedirs = {
    "/Library/Developer/CommandLineTools/SDKs/MacOSX10.15.sdk/usr/include/libxml2"
  },
  linkdirs = {
    "/usr/lib"
  }
}
```

### 在项目中集成包 {#local-package-cmake-integrate}

如果我们在 xmake.lua 项目配置中集成查找 cmake 的依赖包，通常不需要直接使用 find_package，可以用更加通用、简单的包集成方式。

```lua
add_requires("cmake::ZLIB", {alias = "zlib", system = true})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

我们指定 `system = true` 告诉 xmake 强制从系统中调用 cmake 查找包，如果找不到，不再走安装逻辑，因为 cmake 没有提供类似 vcpkg/conan 等包管理器的安装功能，只提供了包查找特性。

### 指定版本 {#local-package-cmake-version}

```lua
add_requires("cmake::OpenCV 4.1.1", {system = true})
```

### 指定组件 {#local-package-cmake-components}

```lua
add_requires("cmake::Boost", {system = true, configs = {components = {"regex", "system"}})}
```

### 预设开关 {#local-package-cmake-presets}

```lua
add_requires("cmake::Boost", {system = true, configs = {components = {"regex", "system"},
                                             presets = {Boost_USE_STATIC_LIB = true}}})
```

相当于内部调用 find_package 查找包之前，在 CMakeLists.txt 中预定义一些配置，控制 find_package 的查找策略和状态。

```cmake
set(Boost_USE_STATIC_LIB ON) -- will be used in FindBoost.cmake
find_package(Boost REQUIRED COMPONENTS regex system)
```

### 设置环境变量 {#local-package-cmake-envs}

```lua
add_requires("cmake::OpenCV", {system = true, configs = {envs = {CMAKE_PREFIX_PATH = "xxx"}}})
```

### 指定自定义 FindFoo.cmake 模块脚本目录 {#local-package-cmake-moduledirs}

mydir/cmake_modules/FindFoo.cmake

```lua
add_requires("cmake::Foo", {system = true, configs = {moduledirs = "mydir/cmake_modules"}})
```

相关 issues: [#1632](https://github.com/xmake-io/xmake/issues/1632)

### 指定链接项 {#local-package-cmake-link-libraries}

对于 cmake 包，我们新增了 `link_libraries` 配置选项，让用户在查找使用 cmake 包的时候，可以自定义配置包依赖的链接库，甚至对 target 链接的支持。

```lua
add_requires("cmake::xxx", {configs = {link_libraries = {"abc::lib1", "abc::lib2"}}})
```

xmake 在查找 cmake 包的时候，会自动追加下面的配置，改进对 links 库的提取。

```cmake
target_link_libraries(test PRIVATE ABC::lib1 ABC::lib2)
```

### 指定搜索模式 {#local-package-cmake-search-mode}

另外，我们增加的搜索模式配置：

```lua
add_requires("cmake::xxx", {configs = {search_mode = "config"}})
add_requires("cmake::xxx", {configs = {search_mode = "module"}})
add_requires("cmake::xxx") -- both
```

比如指定 config 搜索模式，告诉 cmake 从 `XXXConfig.cmake` 中查找包。

xmake 在查找 cmake 包的时候，内部会自动追加下面的配置。

```cmake
find_package(ABC CONFIG REQUIRED)
```

这样会同时查找到 pcre、pcre2 等包。
