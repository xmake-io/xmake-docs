Xmake uses `.mpp` as the default module extension, but also supports `.ixx`, `.cppm`, `.mxx` and other extensions.

At present, xmake has fully supported the C++20 Modules construction support of gcc11/clang/msvc,
and can automatically analyze the dependencies between modules to maximize parallel compilation.

```lua
set_languages("c++20")
target("class")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

For more examples, see: [C++ Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules)

## Cpp-only project

The v2.7.1 release has refactored and upgraded the C++20 module implementation to include support for Headerunits,
which allows us to introduce Stl and user header modules into the module.

The relevant patch is available at: [#2641](https://github.com/xmake-io/xmake/pull/2641).

Note: Normally we need to add at least one `.mpp` file to enable C++20 modules compilation, if we only have a cpp file, module compilation will not be enabled by default.

However, if we just want to use the module's Headerunits feature in the cpp file, e.g. by introducing some stl Headerunits into the cpp, then we can also set `set_policy` to `.mpp`.
then we can also force C++ Modules compilation by setting `set_policy("build.c++.modules", true)`, for example:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    set_languages("c++20")
    set_policy("build.c++.modules", true)
```

## C++ Module distribution

Many thanks to [Arthapz](https://github.com/Arthapz) for continuing to help improve xmake's support for C++ Modules in this new release.

We can now distribute C++ Modules as packages for quick integration and reuse in other projects.

This is a prototype implementation based on the draft design for module distribution in [p2473r1](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2021/p2473r1.pdf).

### Creating a C++ Modules package for distribution

We start by maintaining a build of the modules using xmake.lua and telling xmake which module files to install for external distribution by specifying ``{install = true}`''.

```lua
add_rules("mode.release", "mode.debug")
set_languages("c++20")

target("foo")
    set_kind("static")
    add_files("*.cpp")
    add_files("*.mpp", { install = true })
```

We then make it into a package that we can commit to the [xmake-repo](https://github.com/xmake-io/xmake-repo) repository, or of course directly into a local package, or a private repository package.

Here, for testing purposes, we just make it a local package via ``set_sourcedir``.

```lua
package("foo")
    set_sourcedir(path.join(os.scriptdir(), "src"))
    on_install(function(package)
        import("package.tools.xmake").install(package, {})
    end)
````

### Integrating the C++ Modules package

We then quickly integrate the C++ Modules package for use via the package integration interface with `add_requires("foo")`.

Since the modules packages for foo are defined in a private repository, we introduce our own package repository via `add_repositories("my-repo my-repo")`.

If the package has already been committed to the official xmake-repo repository, there is no need to configure it additionally.

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

Once the packages are integrated, we can run the `xmake` command to download, compile and integrate the C++ Modules package for use with one click.

```sh
$ xmake
checking for platform ... linux
checking for architecture ... x86_64
note: install or modify (m) these packages (pass -y to skip confirm)?
in my-repo:
  -> foo latest
  -> bar latest
please input: y (y/n/m)

  => install bar latest ... ok
  => install foo latest ... ok
[ 0%]: generating.module.deps src/main.cpp
[ 0%]: generating.module.deps /mnt/xmake/tests/projects/c++/modules/packages/build/.packages/b/bar/latest/ 4e0143c97b65425b855ad5fd03038b6a/modules/bar/bar.mpp
[ 0%]: generating.module.deps /mnt/xmake/tests/projects/c++/modules/packages/build/.packages/f/foo/latest/ 4e0143c97b65425b855ad5fd03038b6a/modules/foo/foo.mpp
[ 14%]: compiling.module.release bar
[ 14%]: compiling.module.release foo
[ 57%]: compiling.release src/main.cpp
[ 71%]: linking.release packages
[ 100%]: build ok!
```''

Note: After each package is installed, a meta-info file for the maintenance module is stored in the package path, this is a format specification agreed in ``p2473r1.pdf``, it may not be the final standard, but this does not affect our ability to use the distribution of the module now.

```sh
$ cat . /build/.packages/f/f/foo/latest/4e0143c97b65425b855ad5fd03038b6a/modules/foo/foo.mpp.meta-info
{"_VENDOR_extension":{"xmake":{"name": "foo", "file": "foo.mpp"}}, "definitions":{}, "include_paths":{}}
```

The full example project is available at: [C++ Modules package distribution example project](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules/packages)

## Support for C++23 Std Modules

[Arthapz](https://github.com/Arthapz) has also helped to improve support for C++23 Std Modules.

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
