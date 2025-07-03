# package.tools

此模块为 xmake-repo 及自定义包脚本提供常用构建工具集成辅助。每个工具模块（cmake, autoconf, meson, make, ninja, msbuild, xmake）都提供了一系列用于包构建和安装的 API。下文详细列出各工具的 API 参考与用法示例。

## cmake

> 导入：`import("package.tools.cmake")`

### cmake.install

通过 CMake 安装包，适用于大多数 CMake 类包。

#### 基础用法
```lua
on_install(function (package)
    local configs = {}
    table.insert(configs, "-DBUILD_SHARED_LIBS=" .. (package:config("shared") and "ON" or "OFF"))
    table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:is_debug() and "Debug" or "Release"))
    import("package.tools.cmake").install(package, configs)
end)
```
- 用 `package:config("shared")` 控制动态/静态库。
- 用 `package:is_debug()` 控制 Debug/Release。

#### 传递自定义编译参数（cxflags/cflags）
```lua
on_install(function (package)
    local configs = {}
    table.insert(configs, "-DBUILD_SHARED_LIBS=" .. (package:config("shared") and "ON" or "OFF"))
    table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:is_debug() and "Debug" or "Release"))
    local cxflags = "-Wa,-mbig-obj"
    import("package.tools.cmake").install(package, configs, {cxflags = cxflags})
end)
```
- 如需传递自定义 C/C++ 编译参数，直接将 `cflags` 或 `cxflags` 作为变量，通过 opt 表传递给 cmake.install。
- 适用于特殊编译选项或平台相关参数。

### cmake.build

仅用 CMake 构建包（不安装）。

**签名：**
```lua
cmake.build(package, configs, opt)
```

**示例：**
```lua
on_install(function (package)
    import("package.tools.cmake").build(package, {"-DCMAKE_BUILD_TYPE=Release"})
end)
```

### cmake.configure

仅配置 CMake 项目（只运行 cmake，不编译/安装）。

#### 基础用法
```lua
on_install(function (package)
    local configs = {}
    table.insert(configs, "-DBUILD_SHARED_LIBS=" .. (package:config("shared") and "ON" or "OFF"))
    table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:is_debug() and "Debug" or "Release"))
    import("package.tools.cmake").configure(package, configs)
end)
```

## autoconf

> 导入：`import("package.tools.autoconf")`

### autoconf.install

通过 GNU Autotools（configure/make/make install）安装包。

#### 基础用法
```lua
on_install(function (package)
    local configs = {}
    table.insert(configs, "--enable-static=" .. (package:config("shared") and "no" or "yes"))
    table.insert(configs, "--enable-shared=" .. (package:config("shared") and "yes" or "no"))
    import("package.tools.autoconf").install(package, configs)
end)
```
- 用 `--enable-static` 和 `--enable-shared` 控制静态/动态库构建，详见 [libx11 示例](https://raw.githubusercontent.com/xmake-io/xmake-repo/refs/heads/dev/packages/l/libx11/xmake.lua)。

#### 进阶用法
```lua
on_install(function (package)
    local configs = {}
    table.insert(configs, "--enable-static=" .. (package:config("shared") and "no" or "yes"))
    table.insert(configs, "--enable-shared=" .. (package:config("shared") and "yes" or "no"))
    if package:is_debug() then
        table.insert(configs, "--enable-debug")
    end
    local packagedeps = {"zlib"}
    import("package.tools.autoconf").install(package, configs, {packagedeps = packagedeps})
end)
```

### autoconf.build

通过 Autotools 构建包（configure/make）。

**签名：**
```lua
autoconf.build(package, configs, opt)
```

**示例：**
```lua
on_install(function (package)
    import("package.tools.autoconf").build(package, {"--enable-static=yes"})
end)
```

### autoconf.configure

运行 Autotools 项目的 configure 脚本。

**签名：**
```lua
autoconf.configure(package, configs, opt)
```

**示例：**
```lua
on_install(function (package)
    import("package.tools.autoconf").configure(package, {"--prefix=/usr/local"})
end)
```

### autoconf.make

自定义参数调用 make。

**签名：**
```lua
autoconf.make(package, argv, opt)
```

**示例：**
```lua
on_install(function (package)
    import("package.tools.autoconf").make(package, {"install"})
end)
```

## meson

> 导入：`import("package.tools.meson")`

### meson.install

通过 Meson（setup/compile/install）安装包。

**签名：**
```lua
meson.install(package, configs, opt)
```

**典型用法：**
```lua
add_deps("meson", "ninja")
on_install(function (package)
    local configs = {}
    table.insert(configs, "-Ddefault_library=" .. (package:config("shared") and "shared" or "static"))
    if package:is_debug() then
        table.insert(configs, "-Dbuildtype=debug")
    else
        table.insert(configs, "-Dbuildtype=release")
    end
    local packagedeps = {"zlib"}
    if package:config("openssl") then
        table.insert(packagedeps, "openssl")
    end
    import("package.tools.meson").install(package, configs, {packagedeps = packagedeps})
end)
```

### meson.build

通过 Meson 构建包（setup/compile）。

**签名：**
```lua
meson.build(package, configs, opt)
```

**示例：**
```lua
on_install(function (package)
    import("package.tools.meson").build(package, {"-Ddefault_library=static"})
end)
```

### meson.generate

仅生成 Meson 构建文件（setup）。

**签名：**
```lua
meson.generate(package, configs, opt)
```

**示例：**
```lua
on_install(function (package)
    import("package.tools.meson").generate(package, {"-Dbuildtype=release"})
end)
```

## make

> 导入：`import("package.tools.make")`

### make.install

通过 Make 构建并安装包（build + install）。

**签名：**
```lua
make.install(package, configs, opt)
```

**典型用法：**
```lua
add_deps("make")
on_install(function (package)
    local configs = {}
    local packagedeps = {"zlib"}
    if package:config("openssl") then
        table.insert(packagedeps, "openssl")
    end
    import("package.tools.make").install(package, configs, {packagedeps = packagedeps})
end)
```

### make.build

通过 Make 构建包。

**签名：**
```lua
make.build(package, configs, opt)
```

**示例：**
```lua
on_install(function (package)
    import("package.tools.make").build(package, {"CC=gcc"})
end)
```

### make.make

自定义参数调用 make。

**签名：**
```lua
make.make(package, argv, opt)
```

**示例：**
```lua
on_install(function (package)
    import("package.tools.make").make(package, {"install"})
end)
```

## ninja

> 导入：`import("package.tools.ninja")`

### ninja.install

通过 Ninja 构建并安装包（build + install）。

**签名：**
```lua
ninja.install(package, configs, opt)
```

**典型用法：**
```lua
add_deps("ninja")
on_install(function (package)
    local configs = {}
    local packagedeps = {"zlib"}
    if package:config("openssl") then
        table.insert(packagedeps, "openssl")
    end
    import("package.tools.ninja").install(package, configs, {packagedeps = packagedeps})
end)
```

### ninja.build

通过 Ninja 构建包。

**签名：**
```lua
ninja.build(package, configs, opt)
```

**示例：**
```lua
on_install(function (package)
    import("package.tools.ninja").build(package)
end)
```

## msbuild

> 导入：`import("package.tools.msbuild")`

### msbuild.build

通过 MSBuild（Visual Studio 工程）构建包。

**签名：**
```lua
msbuild.build(package, configs, opt)
```

**典型用法：**
```lua
on_install(function (package)
    local configs = {}
    if package:config("configuration") then
        table.insert(configs, "/p:Configuration=" .. package:config("configuration"))
    end
    local packagedeps = {"zlib"}
    if package:config("openssl") then
        table.insert(packagedeps, "openssl")
    end
    import("package.tools.msbuild").build(package, configs, {packagedeps = packagedeps})
    -- 需要手动拷贝生成的二进制文件
end)
```

## xmake

> 导入：`import("package.tools.xmake")`

### xmake.install

通过 xmake 自身构建和安装包，适用于：
- 移植一些三方库（原生编译不过时），可通过自定义 xmake.lua 适配后再用 xmake.install 安装。
- 源码本身就维护有 xmake.lua 的项目包构建，无需额外配置，直接用 xmake.install 即可。

#### 针对已有 xmake.lua 的项目
如果源码目录下已有标准的 xmake.lua，直接：
```lua
on_install(function (package)
    import("package.tools.xmake").install(package)
end)
```
无需额外配置，xmake 会自动处理动态/静态库和调试/发布模式。

#### 针对无构建系统的三方库移植
如果源码没有现成可用的构建系统，可用如下方式生成自定义 xmake.lua：
```lua
on_install(function (package)
    io.writefile("xmake.lua", [[
        add_rules("mode.debug", "mode.release")
        add_requires("libpng")
        target("bpg")
            set_kind("static")
            add_files("libbpg.c")
            add_files("libavcodec/hevc_cabac.c", "libavcodec/hevc_filter.c", "libavcodec/hevc.c", "libavcodec/hevcpred.c", "libavcodec/hevc_refs.c")
            add_files("libavcodec/hevcdsp.c", "libavcodec/hevc_mvs.c", "libavcodec/hevc_ps.c", "libavcodec/hevc_sei.c")
            add_files("libavcodec/utils.c", "libavcodec/cabac.c", "libavcodec/golomb.c", "libavcodec/videodsp.c")
            add_files("libavutil/mem.c", "libavutil/buffer.c", "libavutil/log2_tab.c", "libavutil/frame.c", "libavutil/pixdesc.c", "libavutil/md5.c")
            add_includedirs(".")
            add_headerfiles("libbpg.h")
            add_defines("HAVE_AV_CONFIG_H", "USE_PRED", "USE_VAR_BIT_DEPTH")
            on_load(function (target)
                local version = io.readfile("VERSION")
                target:add("defines", "CONFIG_BPG_VERSION=" .. version)
            end)
    ]])
    import("package.tools.xmake").install(package)
end)
```
- 这种方式适合源码无构建系统时移植。参考真实 [libbpg 包脚本](https://github.com/xmake-io/xmake-repo/blob/23766d5855508e69f4cb1a4375ab3b865295fcb3/packages/l/libbpg/xmake.lua)。

## 参考

- [xmake-repo 包脚本](https://github.com/xmake-io/xmake-repo)
- [官方文档：分发包](/zh/guide/package-management/package-distribution) 
