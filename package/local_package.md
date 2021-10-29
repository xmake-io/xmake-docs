
### Default packaging format

After version 2.5.5, we have provided a new local package packaging solution that will seamlessly integrate `add_requires` and `add_packages`.

We can execute the `xmake package` command to generate the default new version of the packaging format.

```console
$ xmake package
package(foo): build/packages/f/foo generated
```

It will generate the file `build/packages/f/foo/xmake.lua` with the following content:

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

In fact, it uses `package()` to define and describe local packages, just like remote packages.

The generated directory structure is as follows:

```console
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

We can also use the `add_requires`/`add_repositories` interface to seamlessly integrate this package.

```lua
add_rules("mode.debug", "mode.release")

add_repositories("local-repo build")
add_requires("foo")

target("bar")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("foo")
```

Among them, add_repositories configuration specifies the warehouse root directory of the local package, and then this package can be referenced through `add_requires`.

In addition, the generated local package has another feature, which is to support `target/add_deps`, which automatically associates the dependencies of multiple packages, and automatically connects all dependency links during integration.

Here is the complete [test example](https://github.com/xmake-io/xmake/blob/dev/tests/actions/package/localpkg/test.lua).

```console
"/usr/bin/xcrun -sdk macosx clang++" -o build/macosx/x86_64/release/bar build/.objs/bar/macosx/x86_64/release/src/main.cpp.o -arch x86_64 -mmacosx-version -min=10.15 -isysroot
/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX11.0.sdk -stdlib=libc++
 -L/Users/ruki/projects/personal/xmake/tests/actions/package/localpkg/bar/build/packages/f/foo/macosx/x86_64/release/lib
 -L/Users/ruki/projects/personal/xmake/tests/actions/package/localpkg/bar/build/packages/s/sub/macosx/x86_64/release/lib
 -L/Users/ruki/projects/personal/xmake/tests/actions/package/localpkg/bar/build/packages/a/add/macosx/x86_64/release/lib
 -Wl,-x -lfoo -lsub -ladd -lz
```

### Generate remote package

Out of the local package format, `xmake package` now also supports generating remote packages, so that users can quickly submit them to remote warehouses.

We only need to modify the package format when packaging.

```console
$ xmake package -f remote
```

He will also generate packages/f/foo/xmake.lua file.

```lua
package("foo")
    set_description("The foo package")
    set_license("Apache-2.0")
    add_deps("add", "sub")

    add_urls("https://github.com/myrepo/foo.git")
    add_versions("1.0", "<shasum256 or gitcommit>")

    on_install(function (package)
        local configs = {}
        if package:config("shared") then
            configs.kind = "shared"
        end
        import("package.tools.xmake").install(package, configs)
    end)

    on_test(function (package)
        - TODO check includes and interfaces
        - assert(package:has_cfuncs("foo", {includes = "foo.h"})
    end)
```

Compared with the local package, the package definition configuration has more actual installation logic, as well as the settings of urls and versions,

We can also modify urls, versions and other configuration values ​​through additional parameters, for example:

```console
$ xmake package -f remote --url=https://xxxx/xxx.tar.gz --shasum=xxxxx --homepage=xxxxx`
```

xmake will also read the relevant configuration information from the target's `set_license` and `set_version` configurations.

### Find packages from CMake

Now cmake is the de facto standard, so the find_package provided by CMake can already find a large number of libraries and modules. We fully reuse this part of cmake's ecology to expand xmake's integration of packages.

We can use `find_package("cmake::xxx")` to find some packages with cmake, xmake will automatically generate a cmake script to call cmake's find_package to find some packages and get the bread information.

E.g:

```console
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

#### Specify version

```lua
find_package("cmake::OpenCV", {required_version = "4.1.1"})
```

#### Specified components

```lua
find_package("cmake::Boost", {components = {"regex", "system"}})
```

#### Default switch

```lua
find_package("cmake::Boost", {components = {"regex", "system"}, presets = {Boost_USE_STATIC_LIB = true}})
set(Boost_USE_STATIC_LIB ON) - will be used in FindBoost.cmake
find_package(Boost REQUIRED COMPONENTS regex system)
```

#### Set environment variables

```lua
find_package("cmake::OpenCV", {envs = {CMAKE_PREFIX_PATH = "xxx"}})
```

#### Specify custom FindFoo.cmake module script directory

mydir/cmake_modules/FindFoo.cmake

```lua
find_package("cmake::Foo", {moduledirs = "mydir/cmake_modules"})
```

#### Package dependency integration

```lua
package("xxx")
    on_fetch(function (package, opt)
         return package:find_package("cmake::xxx", opt)
    end)
package_end()

add_requires("xxx")
```

#### Package dependency integration (optional component)

```lua
package("boost")
    add_configs("regex", {description = "Enable regex.", default = false, type = "boolean"})
    on_fetch(function (package, opt)
         opt.components = {}
         if package:config("regex") then
             table.insert(opt.components, "regex")
         end
         return package:find_package("cmake::Boost", opt)
    end)
package_end()

add_requires("boost", {configs = {regex = true}})
```

Related issues: [#1632](https://github.com/xmake-io/xmake/issues/1632)
