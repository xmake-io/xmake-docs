# C++ Modules Usage & Examples

## 1. Introduction

Xmake uses `.mpp` as the default module extension, but also supports `.ixx`, `.cppm`, `.mxx`, etc. It fully supports C++20 Modules with gcc11/clang/msvc, and can automatically analyze module dependencies for maximum parallel compilation.

**Basic usage:**

```lua
set_languages("c++20")
target("class")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

> More official examples: [C++ Modules Examples](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules)

---

## 2. Advanced Usage

### 2.1 Cpp-only Project with Modules

From v2.7.1, Headerunits are supported. Normally, at least one `.mpp` file is needed to enable modules, but you can also force it:

```lua
add_rules("mode.debug", "mode.release")
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    set_languages("c++20")
    set_policy("build.c++.modules", true)
```

### 2.2 Headerunits Example

See [headerunits example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules/headerunits) for how to use STL or custom headers as headerunits.

---

## 3. Module Package Distribution & Integration

### 3.1 Distributing C++ Modules as Packages

Specify `{install = true}` for module files to be distributed:

```lua
add_rules("mode.release", "mode.debug")
set_languages("c++20")
target("foo")
    set_kind("static")
    add_files("*.cpp")
    add_files("*.mpp", { install = true })
```

You can make it a package for [xmake-repo](https://github.com/xmake-io/xmake-repo) or local/private repo.

Local package example:

```lua
package("foo")
    set_sourcedir(path.join(os.scriptdir(), "src"))
    on_install(function(package)
        import("package.tools.xmake").install(package, {})
    end)
```

### 3.2 Integrating C++ Modules Packages

Quickly integrate with `add_requires("foo")`:

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

---

## 4. C++23 Standard Library Modules

Support for C++23 stdmodules:

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

```c++
// my_module.mpp
export module my_module;
import std;
export auto my_sum(std::size_t a, std::size_t b) -> std::size_t;
```

---

## 5. More C++ Modules Example Collection

The official [C++ Modules Example Collection](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules) provides a variety of C++20/23 Modules projects, each subdirectory is a standalone example:

- **basic**: Basic module usage
- **class**: Exporting classes in modules
- **headerunits**: Using headerunits
- **import_std**: Standard library modules
- **partition**: Module partitions
- **packages**: Module package distribution & integration
- **stdmodules**: C++23 standard library modules

Each example contains a complete `xmake.lua` and source code for in-depth learning and reference.
