### Integrate CMake source library

After version 2.5.8, we can also directly integrate the source library with CMakeLists.txt in our project through the package mode of xmake, instead of downloading and installing it remotely.

Related issues: [#1714](https://github.com/xmake-io/xmake/issues/1714)

For example, we have the following project structure:

```
├── foo
│ ├── CMakeLists.txt
│ └── src
│ ├── foo.c
│ └── foo.h
├── src
│ └── main.c
├── test.lua
└── xmake.lua
```

The foo directory is a static library maintained by cmake, and the root directory is maintained by xmake. We can define the `package("foo")` package in xmake.lua to describe how to build the foo code library.

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

Among them, we set the code directory location of the foo package through `set_sourcedir()`, and then import the auxiliary module of `package.tools.cmake` through import to call cmake to build the code, xmake will automatically obtain the generated libfoo.a and the corresponding header document.

!> If only the local source code is integrated, we don't need to set additional `add_urls` and `add_versions`.

For the configuration description of the package, see: [Package description description](https://xmake.io/#/package/remote_package?id=package-description).

After defining the package, we can integrate it with `add_requires("foo")` and `add_packages("foo")`, just like integrating remote packages.

In addition, `on_test` is optional. If you want to strictly check whether the package is compiled and installed successfully, you can do some tests in it.

For a complete example, see: [Library with CMakeLists](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/library_with_cmakelists)

### Integrate Meson source library

xmake supports the integration of more third-party source code libraries maintained by other build systems, such as meson. You only need to import and use the `package.tools.meson` auxiliary building module to call meson to build them.

For example, we select a package built with meson from the xmake-repo repository as an example:

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
        local configs = {"-Dtests=disabled", "-Ddocs=disabled", "-Dbenchmark=disabled", "-Dcairo=disabled", "-Dfontconfig=disabled", "-Dglib=disabled", "-Dgobject= disabled"}
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

### Integrate autoconf source library

We can also use `package.tools.autoconf` to locally integrate third-party code libraries maintained by autoconf.

```lua
package("pcre2")

    set_sourcedir(path.join(os.scriptdir(), "3rd/pcre2"))

    add_configs("jit", {description = "Enable jit.", default = true, type = "boolean"})
    add_configs("bitwidth", {description = "Set the code unit width.", default = "8", values ​​= {"8", "16", "32"}})

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

Both `package.tools.autoconf` and `package.tools.cmake` modules can support cross-compilation platforms and toolchains such as mingw/cross/iphoneos/android, xmake will automatically pass the corresponding toolchain into it, and the user does not need to do Anything else.

### Integrated Scons source library

We can also use `package.tools.scons` to locally integrate third-party code libraries maintained by Scons.

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

        - this fixes an error on ios and osx (https://godotengine.org/qa/65616/problems-compiling-gdnative-c-example-on-osx)
        if package:is_plat("macosx", "iphoneos") then
            io.replace("SConstruct", "-std=c++14", "-std=c++17", {plain = true})
        end

        - fix to use correct ranlib, @see https://github.com/godotengine/godot-cpp/issues/510
        if package:is_plat("android") then
            io.replace("SConstruct",
                [[env['AR'] = toolchain + "/bin/" + arch_info['tool_path'] + "-ar"]],
                [[env['AR'] = toolchain + "/bin/" + arch_info['tool_path'] + "-ar"
    env['RANLIB'] = toolchain + "/bin/" + arch_info['tool_path'] + "-ranlib"]], {plain = true})
        end

        import("package.tools.scons").build(package, configs)
        os.cp("bin/*." .. (package:is_plat("windows") and "lib" or "a"), package:installdir("lib"))
        os.cp("include/core/*.hpp", package:installdir("include/core"))
        os.cp("include/gen/*.hpp", package:installdir("include/gen"))
        os.cp("godot-headers/android", package:installdir("include"))
        os.cp("godot-headers/arvr", package:installdir("include"))
        os.cp("godot-headers/gdnative", package:installdir("include"))
        os.cp("godot-headers/nativescript", package:installdir("include"))
        os.cp("godot-headers/net", package:installdir("include"))
        os.cp("godot-headers/pluginscript", package:installdir("include"))
        os.cp("godot-headers/videodecoder", package:installdir("include"))
        os.cp("godot-headers/*.h", package:installdir("include"))
    end)
```

### Integrated makefile source library

#### Use Nmake

We can also use `package.tools.nmake` to locally integrate third-party code libraries maintained by nmake.

`nmake.install` will automatically bind the msvc build environment of the current user to ensure that the user can successfully call nmake.exe, msbuild and cl.exe and other programs.

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
        os.vrun("cscript configure.js iso8859x=yes iconv=no compiler=msvc cruntime=/%s debug=%s prefix=\"%s\"", package:config("vs_runtime"), package:debug( ) and "yes" or "no", package:installdir())
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

#### Use GnuMake

We can also use `package.tools.make` to locally integrate third-party code libraries maintained by gnumake.

```lua
package("openssl")

    set_sourcedir(path.join(os.scriptdir(), "3rd/openssl"))

    add_links("ssl", "crypto")
    if is_plat("linux", "cross") then
        add_syslinks("dl")
    end

    on_install("linux", "macosx", function (package)
        - https://wiki.openssl.org/index.php/Compilation_and_Installation#PREFIX_and_OPENSSLDIR
        os.vrun("./config %s --openssldir=\"%s\" --prefix=\"%s\"", package:debug() and "--debug" or "", package:installdir (), package:installdir())
        import("package.tools.make").install(package)
    end)

    on_test(function (package)
        assert(package:has_cfuncs("SSL_new", {includes = "openssl/ssl.h"}))
    end)
```

!> We can also directly use `os.vrunv("make", {})` to call the make/gmake program to build the library.
