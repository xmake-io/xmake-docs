# package.tools

This module provides helpers for integrating common build tools in xmake-repo and custom package scripts. Each tool module (cmake, autoconf, meson, make, ninja, msbuild, xmake) provides a set of APIs for building and installing packages. Below are detailed API references and usage examples for each tool.

## cmake

> Import: `import("package.tools.cmake")`

### cmake.install

Install a package using CMake. Most commonly used for CMake-based packages in xmake-repo.

#### Basic usage
```lua
on_install(function (package)
    local configs = {}
    table.insert(configs, "-DBUILD_SHARED_LIBS=" .. (package:config("shared") and "ON" or "OFF"))
    table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:is_debug() and "Debug" or "Release"))
    import("package.tools.cmake").install(package, configs)
end)
```
- Use `package:config("shared")` to control shared/static build.
- Use `package:is_debug()` to control Debug/Release build.

#### Passing custom compile flags (cxflags/cflags)
```lua
on_install(function (package)
    local configs = {}
    table.insert(configs, "-DBUILD_SHARED_LIBS=" .. (package:config("shared") and "ON" or "OFF"))
    table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:is_debug() and "Debug" or "Release"))
    local cxflags = "-Wa,-mbig-obj"
    import("package.tools.cmake").install(package, configs, {cxflags = cxflags})
end)
```
- To pass custom C/C++ compile flags, set `cflags` or `cxflags` as a variable and pass it via the `opt` table to `cmake.install`.
- This is useful for special compiler options or platform-specific flags.

### cmake.build

Build a package using CMake (without install step).

**Signature:**
```lua
cmake.build(package, configs, opt)
```

**Example:**
```lua
on_install(function (package)
    import("package.tools.cmake").build(package, {"-DCMAKE_BUILD_TYPE=Release"})
end)
```

### cmake.configure

Configure a CMake project (run cmake only, no build/install).

#### Basic usage
```lua
on_install(function (package)
    local configs = {}
    table.insert(configs, "-DBUILD_SHARED_LIBS=" .. (package:config("shared") and "ON" or "OFF"))
    table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:is_debug() and "Debug" or "Release"))
    import("package.tools.cmake").configure(package, configs)
end)
```

## autoconf

> Import: `import("package.tools.autoconf")`

### autoconf.install

Install a package using GNU Autotools (configure/make/make install).

#### Basic usage
```lua
on_install(function (package)
    local configs = {}
    table.insert(configs, "--enable-static=" .. (package:config("shared") and "no" or "yes"))
    table.insert(configs, "--enable-shared=" .. (package:config("shared") and "yes" or "no"))
    import("package.tools.autoconf").install(package, configs)
end)
```
- Use `--enable-static` and `--enable-shared` to control static/shared build. See [libx11 example](https://raw.githubusercontent.com/xmake-io/xmake-repo/refs/heads/dev/packages/l/libx11/xmake.lua).

#### Advanced usage
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

Build a package using Autotools (configure/make).

**Signature:**
```lua
autoconf.build(package, configs, opt)
```

**Example:**
```lua
on_install(function (package)
    import("package.tools.autoconf").build(package, {"--enable-static=yes"})
end)
```

### autoconf.configure

Run the configure script for an Autotools project.

**Signature:**
```lua
autoconf.configure(package, configs, opt)
```

**Example:**
```lua
on_install(function (package)
    import("package.tools.autoconf").configure(package, {"--prefix=/usr/local"})
end)
```

### autoconf.make

Run make with custom arguments.

**Signature:**
```lua
autoconf.make(package, argv, opt)
```

**Example:**
```lua
on_install(function (package)
    import("package.tools.autoconf").make(package, {"install"})
end)
```

## meson

> Import: `import("package.tools.meson")`

### meson.install

Install a package using Meson (setup/compile/install).

**Signature:**
```lua
meson.install(package, configs, opt)
```

**Typical usage:**
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

Build a package using Meson (setup/compile).

**Signature:**
```lua
meson.build(package, configs, opt)
```

**Example:**
```lua
on_install(function (package)
    import("package.tools.meson").build(package, {"-Ddefault_library=static"})
end)
```

### meson.generate

Generate build files for Meson (setup only).

**Signature:**
```lua
meson.generate(package, configs, opt)
```

**Example:**
```lua
on_install(function (package)
    import("package.tools.meson").generate(package, {"-Dbuildtype=release"})
end)
```

## make

> Import: `import("package.tools.make")`

### make.install

Install a package using Make (build then install target).

**Signature:**
```lua
make.install(package, configs, opt)
```

**Typical usage:**
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

Build a package using Make.

**Signature:**
```lua
make.build(package, configs, opt)
```

**Example:**
```lua
on_install(function (package)
    import("package.tools.make").build(package, {"CC=gcc"})
end)
```

### make.make

Run make with custom arguments.

**Signature:**
```lua
make.make(package, argv, opt)
```

**Example:**
```lua
on_install(function (package)
    import("package.tools.make").make(package, {"install"})
end)
```

## ninja

> Import: `import("package.tools.ninja")`

### ninja.install

Install a package using Ninja (build then install target).

**Signature:**
```lua
ninja.install(package, configs, opt)
```

**Typical usage:**
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

Build a package using Ninja.

**Signature:**
```lua
ninja.build(package, configs, opt)
```

**Example:**
```lua
on_install(function (package)
    import("package.tools.ninja").build(package)
end)
```

## msbuild

> Import: `import("package.tools.msbuild")`

### msbuild.build

Build a package using MSBuild (Visual Studio projects).

**Signature:**
```lua
msbuild.build(package, configs, opt)
```

**Typical usage:**
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
    -- You may need to manually copy built binaries
end)
```

## xmake

> Import: `import("package.tools.xmake")`

### xmake.install

Install a package using xmake itself. This is suitable for:
- Porting third-party libraries that cannot be built directly, by writing a `xmake.lua` to adapt the build.
- Building and installing projects that already maintain their own `xmake.lua` build script.

#### Usage for projects with their own xmake.lua
If the source already contains a proper `xmake.lua`, you can simply:
```lua
on_install(function (package)
    import("package.tools.xmake").install(package)
end)
```
No extra configuration is needed; xmake will handle shared/static/debug/release modes automatically.

#### Usage for porting a third-party library
If the source does not provide a build system, you can generate a custom `xmake.lua` as shown below:
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
- This approach is useful for adapting third-party sources that lack a proper build system. See the real-world [libbpg package example](https://github.com/xmake-io/xmake-repo/blob/23766d5855508e69f4cb1a4375ab3b865295fcb3/packages/l/libbpg/xmake.lua).

## References

- [xmake-repo package scripts](https://github.com/xmake-io/xmake-repo)
- [Official guide: Package Distribution](/guide/package-management/package-distribution) 
