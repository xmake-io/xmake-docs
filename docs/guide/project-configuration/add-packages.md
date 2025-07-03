# Add Packages {#add-packages}

## Introduction

Xmake has built-in support for package dependency integration. You can declare the required dependency packages through the [add_requires](/api/description/global-interfaces#add-requires) interface.

Then, through the [add_packages](/api/description/project-target#add-packages) interface, bind the declared package to the required compilation target, for example:

```lua [xmake.lua]
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")

target("foo")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libpng")

target("bar")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

Among them, `add_requires` is a global interface, used for package configuration declaration, and Xmake will trigger search and installation based on the declared package.

Since a project may have multiple target programs, each target program may require different dependency packages, so we also need to bind the target through `add_packages`.

In the above configuration example, the foo target binds the tbox and libpng packages, while the bar target binds the zlib package.

## Basic Usage and Common Scenarios {#basic-usage}

- `add_requires("pkgname")` declares dependencies, supports version, optional, alias, etc.
- `add_packages("pkgname")` binds packages to targets, automatically adds links, includedirs, etc.

### Typical Scenarios

- Multiple targets depend on different packages
- One target depends on multiple packages
- Supports C/C++/Fortran/multi-platform

## API Details {#api-details}

### Specify Package Version

```lua
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")
```

### Optional Package

```lua
add_requires("foo", {optional = true})
```

### Disable System Library

```lua
add_requires("foo", {system = false})
```

### Specify Alias

```lua
add_requires("foo", {alias = "myfoo"})
add_packages("myfoo")
```

### Platform/Arch Limitation

```lua
add_requires("foo", {plat = "windows", arch = "x64"})
```

### Pass Package Configs

```lua
add_requires("tbox", {configs = {small = true}})
```

### Pass Configs to Dependencies

```lua
add_requireconfs("spdlog.fmt", {configs = {header_only = true}})
```

## Advanced Features {#advanced-features}

- Semantic version, branch, commit support
- Debug/release package support
- Multi-repo, private repo support
- Local/system/remote package priority
- Extra build arguments

## Package Instance APIs {#package-instance}

Available in custom rules, after_install, etc.:

- `package:name()` get package name
- `package:version_str()` get version
- `package:installdir()` get install dir
- `package:get("links")` get link libraries
- `package:get("includedirs")` get include dirs

## Typical Examples {#examples}

### 1. Optional Dependency

```lua
add_requires("foo", {optional = true})
target("bar")
    add_packages("foo")
```

### 2. Depend on Branch/Commit

```lua
add_requires("tbox master")
add_requires("zlib 1.2.11")
```

### 3. Pass Configs to Package

```lua
add_requires("spdlog", {configs = {header_only = true}})
```

### 4. Depend on Local Package

1. Create a local package repository directory in your project (e.g. `local-repo/packages/foo/xmake.lua`).
2. Add the local repository in `xmake.lua`:

```lua
add_repositories("myrepo local-repo")
add_requires("foo")
```

3. Local package structure example:

```
local-repo/
  packages/
    foo/
      xmake.lua
```

4. Now you can use the local package just like an official one via `add_requires("foo")`.

## Best Practices {#best-practices}

1. Use `add_requires` + `add_packages` for declaration and binding
2. Use `{optional = true}` for optional packages
3. Use `{plat=..., arch=...}` for precise control on multi-platform
4. Use `add_requireconfs` for recursive dependency config
5. Use `xmake require --info pkg` to query package parameters

## More Information {#more-information}

- Official package usage: [Using Official Packages](/guide/package-management/using-official-packages)
- Package dependency API: [Package Dependency API](/api/description/package-dependencies)
- Package instance APIs: [package instance API](/api/scripts/package-instance)
- Package management and search: You can also use the [xrepo CLI tool](/guide/package-management/xrepo-cli) to search, install, and uninstall packages.
