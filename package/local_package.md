### Generate local package

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

#### Step by Step Local Packaging Tutorial

In this tutorial we will package a static library called foo, upload it to a GitHub repository and consume it similar to a manner of CMake FetchContent

- Create an xmake project

```bash
$ xmake create -P package_origin
```

- Imitate this filetree to prepare files for your package

```bash
│   .gitignore
│   xmake.lua
└───src
  │   main.cpp
  ├───inc
  │   └───foo
  │           foo.hpp
  └───lib
      └───foo
              foo.cpp
```

- Create static library target in xmake

```lua
target("foo")
  set_kind("static")
  add_files("src/lib/foo/*.cpp")
  add_headerfiles("src/inc/foo/*.hpp")
  add_includedirs("src/inc/foo", {public = true})
```

- Implement the functionality of your target

foo.hpp

```cpp
void foo();
```

foo.cpp

```cpp
#include <iostream>
#include "foo.hpp"

void foo() {
    std::cout << "foo";
}
```

- Build your project and create the package

```bash
$ xmake build
$ xmake package foo
```

- Move packages artifacts to a custom package repository.

```bash
$ mkdir my_custom_binary_package_repo
$ cp -r build/packages my_custom_binary_package_repo/packages
$ cd my_custom_binary_package_repo
$ git init
$ git add .
$ git commit -a -m "init"
```

Then push this new package repository to your custom repository, e.g. `https://github.com/xxx/my_custom_binary_package_repo.git`

- Create a project where you intend on consuming the package

```bash
$ xmake create package_consumption
```

- Consume the package by adding the repository, finding the package and then linking the package to target of your choosing

```lua
add_repositories("foo https://github.com/xxx/my_custom_binary_package_repo.git")
add_requires("foo")

target("package_consumption")
  set_kind("binary")
  add_files("src/*.cpp")
  add_packages("foo")
```

you can also use local repository.

```lua
add_repositories("foo /localpath/my_custom_binary_package_repo")
```

```cpp
#include "foo.hpp"
int main() {
    foo();
    return 0;
}
```

Congratulations, you have packaged a library and consumed it xmake!

```bash
$ xmake build
$ xmake run
foo
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

#### Step by Step Remote Packaging Tutorial

##### Introduction

A remote package is a package that is compiled from source. If you're developing cross-platform libraries, remote packages allow you to avoid manually compiling for every library and platform.

To create remote packages:
1. Upload your source code to a repository.
2. In a **separate repository**, create a remote package manifest that points to your source repository.

To consume remote packages, you need to add the repository that contains the remote package manifest to your project, find the package, and then add it to your desired target. 

##### Example

In this example, we’ll create a remote package for a static library named `foo`, built using **Windows with MSVC**, and then **consume it on MSYS2 using Clang**.

- Create an xmake project

```bash
xmake create package_remote_origin
```

- Imitate this filetree to prepare files for your package

```bash
│
├── .gitignore
├── xmake.lua
└── src
    ├── main.cpp
    ├── inc
    │   └── foo
    │       └── foo.hpp
    └── lib
        └── foo
            └── foo.cpp
```

- Create static library target in xmake

```lua
target("foo")
    set_kind("static")
    add_files("src/lib/foo/*.cpp")
    add_headerfiles("src/inc/foo/*.hpp")
    add_includedirs("src/inc/foo", {public = true})
```

- Implement the functionality of your target

foo.hpp

```cpp
void foo();
```

foo.cpp

```cpp
#include <iostream>
#include "foo.hpp"

void foo() {
    std::cout << "foo";
}
```

- Create a package and point to your source repository in the config file

```bash
xmake package -f remote foo
```

- Create a source repository for your package with a version tag

For example, you can pust to `https://github.com/xxx/foo_remote_package_source.git` with tag v1.0.0

Then edit package configuration to add the given version.

```lua
package("foo")
    add_urls("https://github.com/xxx/foo_remote_package_source.git")
    add_versions("1.0.0", "v1.0.0")
```

Or you can use .tar.gz as git url and add it's sha256 sum to versions.

- Create a package config repository for your package

```bash
$ mkdir mycustom_remote_package_repo
$ mv build/packages mycustom_remote_package_repo
$ cd mycustom_remote_package_repo
$ git init
$ git add .
$ git commit -a -m "init repository"
```

You can push this repository to https://github.com/xxx/mycustom_remote_package_repo.git

- Create a project where you intend on consuming the package

```bash
$ xmake create package_consumption
```

- Consume the package by adding the repository, finding the package and then linking the package to target of your choosing

```lua
add_repositories("foo https://github.com/xxx/mycustom_remote_package_repo.git")
add_requires("foo")

target("package_consumption")
  set_kind("binary")
  add_files("src/*.cpp")
  add_packages("foo")
```

you can also use local repository.

```lua
add_repositories("foo /localpath/mycustom_remote_package_repo")
```

```cpp
#include "foo.hpp"
int main() {
    foo();
    return 0;
}
```

Congratulations, you have packaged a library and consumed it xmake!

```bash
$ xmake build
$ xmake run
foo
```

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

#### Integrate the package in the project

If we integrate and find cmake dependent packages in the xmake.lua project configuration, we usually don't need to use find_package directly, and we can use a more general and simple package integration method.

```lua
add_requires("cmake::ZLIB", {alias = "zlib", system = true})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

We specify `system = true` to tell xmake to force cmake to find the package from the system. If it cannot be found, the installation logic will not be followed, because cmake does not provide the installation function of package managers such as vcpkg/conan.
Only the package search feature is provided.

#### Specify version

```lua
add_requires("cmake::OpenCV 4.1.1", {system = true})
```

#### Specified components

```lua
add_requires("cmake::Boost", {system = true, configs = {components = {"regex", "system"}}))
```

#### Default switch

```lua
add_requires("cmake::Boost", {system = true, configs = {components = {"regex", "system"},
                                             presets = {Boost_USE_STATIC_LIB = true}}})
```

It is equivalent to predefine some configurations in CMakeLists.txt before calling find_package internally to find the package to control the find_package search strategy and status.

```
set(Boost_USE_STATIC_LIB ON) - will be used in FindBoost.cmake
find_package(Boost REQUIRED COMPONENTS regex system)
```

#### Set environment variables

```lua
add_requires("cmake::OpenCV", {system = true, configs = {envs = {CMAKE_PREFIX_PATH = "xxx"}}})
```

#### Specify custom FindFoo.cmake module script directory

mydir/cmake_modules/FindFoo.cmake

```lua
add_requires("cmake::Foo", {system = true, configs = {moduledirs = "mydir/cmake_modules"}})
```

Related issues: [#1632](https://github.com/xmake-io/xmake/issues/1632)

#### Specifying links

For cmake packages, we have added the ``link_libraries`` configuration option to allow users to customize the configuration of package dependencies and even support for target links when looking to use cmake packages.

```lua
add_requires("cmake::xxx", {configs = {link_libraries = {"abc::lib1", "abc::lib2"}}})
```

xmake automatically appends the following configuration to improve the extraction of links libraries when looking for cmake packages.

```cmake
target_link_libraries(test PRIVATE ABC::lib1 ABC::lib2)
```

#### Specify the search mode

In addition, we add the following search mode configuration.

```lua
add_requires("cmake::xxx", {configs = {search_mode = "config"}})
add_requires("cmake::xxx", {configs = {search_mode = "module"}})
add_requires("cmake::xxx") -- both
```

Specify config search mode, for example, to tell cmake to look for packages from `XXXConfig.cmake`.

xmake will automatically append the following configuration internally when it looks for cmake packages.

```cmake
find_package(ABC CONFIG REQUIRED)
```
