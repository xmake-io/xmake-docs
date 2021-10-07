### 集成 CMake 代码库

2.5.8 版本之后，我们也能够通过 xmake 的包模式直接集成自己项目中带有 CMakeLists.txt 的代码库，而不是通过远程下载安装。

相关 issues: [#1714](https://github.com/xmake-io/xmake/issues/1714)

例如，我们有如下项目结构：

```
├── foo
│   ├── CMakeLists.txt
│   └── src
│       ├── foo.c
│       └── foo.h
├── src
│   └── main.c
├── test.lua
└── xmake.lua
```

foo 目录下是一个使用 cmake 维护的静态库，而根目录下使用了 xmake 来维护，我们可以在 xmake.lua 中通过定义 `package("foo")` 包来描述如何构建 foo 代码库。

```lua
add_rules("mode.debug", "mode.release")

package("foo")
    add_deps("cmake")
    set_sourcedir(path.join(os.scriptdir(), "foo"))
    on_install(function (package)
        local configs = {}
        table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:debug() and "Debug" or "Release"))
        table.insert(configs, "-DBUILD_SHARED_LIBS=" .. (package:config("shared") and "ON" or "OFF"))
        import("package.tools.cmake").install(package, configs)
    end)
    on_test(function (package)
        assert(package:has_cfuncs("add", {includes = "foo.h"}))
    end)
package_end()

add_requires("foo")

target("demo")
    set_kind("binary")
    add_files("src/main.c")
    add_packages("foo")
```

其中，我们通过 `set_sourcedir()` 来设置 foo 包的代码目录位置，然后通过 import 导入 `package.tools.cmake` 辅助模块来调用 cmake 构建代码，xmake 会自动获取生成的 libfoo.a 和对应的头文件。

!> 如果仅仅本地源码集成，我们不需要额外设置 `add_urls` 和 `add_versions`。

关于包的配置描述，详情见：[包描述说明](https://xmake.io/#/zh-cn/package/remote_package?id=%e5%8c%85%e6%8f%8f%e8%bf%b0%e8%af%b4%e6%98%8e)

定义完包后，我们就可以通过 `add_requires("foo")` 和 `add_packages("foo")` 来集成使用它了，就跟集成远程包一样的使用方式。

另外，`on_test` 是可选的，如果想要严格检测包的编译安装是否成功，可以在里面做一些测试。

完整例子见：[Library with CMakeLists](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/library_with_cmakelists)

### 集成 Meson 代码库

xmake 支持集成更多其他构建系统维护的第三方源码库，比如 meson，仅仅只需要导入使用 `package.tools.meson` 辅助构建模块调用 meson 来构建它们。

例如，我们从 xmake-repo 仓库中挑选一个使用 meson 构建的包作为例子：

```lua
package("harfbuzz")
    set_sourcedir(path.join(os.scriptdir(), "3rd/harfbuzz"))

    add_deps("meson")
    if not is_plat("windows") then
        add_deps("freetype")
    end
    on_load("windows", "linux", "macosx", function (package)
        if package:config("icu") then
            package:add("deps", "icu4c")
        end
    end)

    on_install("windows", "linux", "macosx", function (package)
        local configs = {"-Dtests=disabled", "-Ddocs=disabled", "-Dbenchmark=disabled", "-Dcairo=disabled", "-Dfontconfig=disabled", "-Dglib=disabled", "-Dgobject=disabled"}
        table.insert(configs, "-Ddefault_library=" .. (package:config("shared") and "shared" or "static"))
        if package:is_plat("windows") then
            table.insert(configs, "-Dfreetype=disabled")
        end
        import("package.tools.meson").install(package, configs)
    end)

    on_test(function (package)
        assert(package:has_cfuncs("hb_buffer_add_utf8", {includes = "harfbuzz/hb.h"}))
    end)
```

### 集成 autoconf 代码库

我们也可以使用 `package.tools.autoconf` 来本地集成带有 autoconf 维护的第三方代码库。

```lua
package("pcre2")

    set_sourcedir(path.join(os.scriptdir(), "3rd/pcre2"))

    add_configs("jit", {description = "Enable jit.", default = true, type = "boolean"})
    add_configs("bitwidth", {description = "Set the code unit width.", default = "8", values = {"8", "16", "32"}})

    on_load(function (package)
        local bitwidth = package:config("bitwidth") or "8"
        package:add("links", "pcre2-" .. bitwidth)
        package:add("defines", "PCRE2_CODE_UNIT_WIDTH=" .. bitwidth)
        if not package:config("shared") then
            package:add("defines", "PCRE2_STATIC")
        end
    end)

    on_install("macosx", "linux", "mingw", function (package)
        local configs = {}
        table.insert(configs, "--enable-shared=" .. (package:config("shared") and "yes" or "no"))
        table.insert(configs, "--enable-static=" .. (package:config("shared") and "no" or "yes"))
        if package:debug() then
            table.insert(configs, "--enable-debug")
        end
        if package:config("pic") ~= false then
            table.insert(configs, "--with-pic")
        end
        if package:config("jit") then
            table.insert(configs, "--enable-jit")
        end
        local bitwidth = package:config("bitwidth") or "8"
        if bitwidth ~= "8" then
            table.insert(configs, "--disable-pcre2-8")
            table.insert(configs, "--enable-pcre2-" .. bitwidth)
        end
        import("package.tools.autoconf").install(package, configs)
    end)

    on_test(function (package)
        assert(package:has_cfuncs("pcre2_compile", {includes = "pcre2.h"}))
    end)
```

`package.tools.autoconf` 和 `package.tools.cmake` 模块都是可以支持 mingw/cross/iphoneos/android 等交叉编译平台和工具链的，xmake 会自动传递对应的工具链进去，用户不需要做任何其他事情。

### 集成 Scons 代码库

我们也可以使用 `package.tools.scons` 来本地集成带有 Scons 维护的第三方代码库。

```lua
package("godotcpp")

    set_sourcedir(path.join(os.scriptdir(), "3rd/godotcpp"))

    add_deps("scons")

    add_includedirs("include", "include/core", "include/gen")

    on_install("linux", "windows", "macosx", "mingw", "cygwin", "iphoneos", "android", "msys", function (package)
        local configs = {"generate_bindings=yes"}
        table.insert(configs, "bits=" .. ((package:is_arch("x64") or package:is_arch("x86_64")) and "64" or "32"))
        if package:is_plat("windows") then
            io.replace("SConstruct", "/MD", "/" .. package:config("vs_runtime"), {plain = true})
        end

        -- this fixes an error on ios and osx (https://godotengine.org/qa/65616/problems-compiling-gdnative-c-example-on-osx)
        if package:is_plat("macosx", "iphoneos") then
            io.replace("SConstruct", "-std=c++14", "-std=c++17", {plain = true})
        end

        -- fix to use correct ranlib, @see https://github.com/godotengine/godot-cpp/issues/510
        if package:is_plat("android") then
            io.replace("SConstruct",
                [[env['AR'] = toolchain + "/bin/" + arch_info['tool_path'] + "-ar"]],
                [[env['AR'] = toolchain + "/bin/" + arch_info['tool_path'] + "-ar"
    env['RANLIB'] = toolchain + "/bin/" + arch_info['tool_path'] + "-ranlib"]], {plain = true})
        end

        import("package.tools.scons").build(package, configs)
        os.cp("bin/*." .. (package:is_plat("windows") and "lib" or "a"), package:installdir("lib"))
        os.cp("include/core/*.hpp", package:installdir("include/core"))
        os.cp("include/gen/*.hpp",  package:installdir("include/gen"))
        os.cp("godot-headers/android",            package:installdir("include"))
        os.cp("godot-headers/arvr",               package:installdir("include"))
        os.cp("godot-headers/gdnative",           package:installdir("include"))
        os.cp("godot-headers/nativescript",       package:installdir("include"))
        os.cp("godot-headers/net",                package:installdir("include"))
        os.cp("godot-headers/pluginscript",       package:installdir("include"))
        os.cp("godot-headers/videodecoder",       package:installdir("include"))
        os.cp("godot-headers/*.h",                package:installdir("include"))
    end)
```

### 集成 makefile 代码库

#### 使用 Nmake

我们也可以使用 `package.tools.nmake` 来本地集成带有 nmake 维护的第三方代码库。

`nmake.install` 会自动绑定当前用户的 msvc 构建环境，确保用户能够顺利调用到 nmake.exe 以及 msbuild 和 cl.exe 等程序。

```lua
package("libxml2")

    set_sourcedir(path.join(os.scriptdir(), "3rd/libxml2"))

    add_includedirs("include/libxml2")
    if is_plat("windows") then
        add_syslinks("wsock32", "ws2_32")
    end

    on_load("windows", function (package)
        if not package:config("shared") then
            package:add("defines", "LIBXML_STATIC")
        end
    end)

    on_install("windows", function (package)
        os.cd("win32")
        os.vrun("cscript configure.js iso8859x=yes iconv=no compiler=msvc cruntime=/%s debug=%s prefix=\"%s\"", package:config("vs_runtime"), package:debug() and "yes" or "no", package:installdir())
        import("package.tools.nmake").install(package, {"/f", "Makefile.msvc"})
        os.tryrm(path.join(package:installdir("lib"), "libxml2_a_dll.lib"))
        if package:config("shared") then
            os.tryrm(path.join(package:installdir("lib"), "libxml2_a.lib"))
        else
            os.tryrm(path.join(package:installdir("lib"), "libxml2.lib"))
            os.tryrm(path.join(package:installdir("bin"), "libxml2.dll"))
        end
    end)

    on_test(function (package)
        assert(package:has_cfuncs("xmlNewNode", {includes = {"libxml/parser.h", "libxml/tree.h"}}))
    end)
```

#### 使用 GnuMake

我们也可以使用 `package.tools.make` 来本地集成带有 gnumake 维护的第三方代码库。

```lua
package("openssl")

    set_sourcedir(path.join(os.scriptdir(), "3rd/openssl"))

    add_links("ssl", "crypto")
    if is_plat("linux", "cross") then
        add_syslinks("dl")
    end

    on_install("linux", "macosx", function (package)
        -- https://wiki.openssl.org/index.php/Compilation_and_Installation#PREFIX_and_OPENSSLDIR
        os.vrun("./config %s --openssldir=\"%s\" --prefix=\"%s\"", package:debug() and "--debug" or "", package:installdir(), package:installdir())
        import("package.tools.make").install(package)
    end)

    on_test(function (package)
        assert(package:has_cfuncs("SSL_new", {includes = "openssl/ssl.h"}))
    end)
```

!> 我们也可以直接使用 `os.vrunv("make", {})` 来调用 make/gmake 程序来构建库。
