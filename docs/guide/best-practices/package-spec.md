---
outline: deep
---

# Xmake Package Description Specification {#package-spec}

This document defines the package description specification for the Xmake official repository ([xmake-repo](https://github.com/xmake-io/xmake-repo)).

If you are new to xmake's package management, it is recommended to first read [Adding Packages Quick Start](/guide/project-configuration/add-packages) and [Using Official Packages](/guide/package-management/using-official-packages). For the complete package description API reference, see [Package Dependencies API](/api/description/package-dependencies). For script domain package instance interfaces, see [Package Instance API](/api/scripts/package-instance).

## 0. Package Lifecycle Overview

The execution order of hooks in an Xmake package description script is as follows. Understanding this order is a prerequisite for writing packages correctly:

| Stage | Hook | Preconditions | Purpose |
| :--- | :--- | :--- | :--- |
| Pre-check | `on_check` | None (earliest validation stage) | Determine whether the platform/toolchain is supported; terminate early on failure so unsupported CI environments can be skipped |
| Load | `on_load` | None (metadata stage) | Dynamically add deps/patches/defines and modify package attributes |
| Detect | `on_fetch` | None | Custom system library detection; return `nil` to fall back to the install flow |
| Download | `add_urls` + `add_versions` | `on_load` completed | Source download and integrity verification |
| Patch | `add_patches` | Sources already extracted | Automatically apply patches before build |
| Install | `on_install` | Sources already extracted, all dependencies installed | Invoke the build system and install artifacts into `installdir` |
| Test | `on_test` | `on_install` completed | Compile a small code snippet to verify the installation is usable |

> Key difference: `on_load` runs before download and can dynamically decide "what is needed"; when `on_install` runs, the sources have already been extracted and dependencies are ready, so it is only responsible for "how to build".

---

## 1. Package Identification and Metadata

### 1.1 Naming Conventions

**1.1.1** Package names must uniformly use **lowercase**. They may contain digits, hyphens (`-`), and underscores (`_`); uppercase letters and camelCase are strictly forbidden.

**1.1.2** If the upstream project name already contains `-` or `_`, it is recommended to keep it. If there is no clear convention, either may be used, or follow the naming used by mainstream package managers.

**1.1.3** API:

```lua
package("name")
```

### 1.2 `set`/`add` Semantics

**1.2.1** In general semantics, `set_xxx` means overwriting (resetting) the field, while `add_xxx` means appending.

**1.2.2** When maintaining existing rules, prefer `add_xxx` in most cases to avoid unintentionally overwriting existing entries; use `set_xxx` only when the entire field truly needs to be reset.

### 1.3 Description and Attributes

**1.3.1** `set_homepage`: You must provide a valid project homepage or GitHub homepage.

**1.3.2** `set_description`: A brief description of the package functionality.

**1.3.3** `set_license`: You must specify the license type (such as `MIT`, `Apache-2.0`, `BSD-3-Clause`); if it truly cannot be found, it may be left empty.

**1.3.4** `set_kind`: The default is `library`. Header-only libraries must explicitly declare:

```lua
set_kind("library", {headeronly = true})
```

**1.3.5** Non-library packages may be explicitly declared as:

```lua
set_kind("binary")    -- executable tool package
set_kind("toolchain") -- toolchain package
```

**1.3.6** Package rename compatibility: if a historical package name needs to be smoothly migrated to a new package name, you can reuse the new package script via `set_base("newpkg")` and print a migration hint in `on_load`. This approach is recommended only for compatibility transitions and should not be used to keep multiple synonymous packages long-term.

**1.3.7** When branching by package type, it is recommended to use `package:is_library()`, `package:is_binary()`, and `package:is_toolchain()` to read the current `kind`; this is more intuitive than handwritten string comparisons:

```lua
on_load(function(package)
    if package:is_binary() then
        package:config_set("tools", true)
    elseif package:is_library() then
        package:add("defines", "FOO_STATIC")
    end
end)
```

**1.3.8** Toolchain packages or binary distribution packages can use `set_installtips(...)` to provide prompts for license confirmation, manual download steps, or environment prerequisites, reducing misuse during installation:

```lua
set_installtips("This package requires manual EULA acceptance before first use.")
```

**1.3.9** In addition to `is_binary/is_library/is_toolchain`, you can also read the current package type string directly with `package:kind()`. New scripts should prefer the semantic boolean interfaces; `kind()` is suitable when string concatenation or forwarding upstream parameters is needed.

---

## 2. Source Acquisition and Versioning

### 2.1 Source URL Definitions

**2.1.1** You must provide at least one stable source download URL, preferably an official Release archive (`tar.gz`/`tar.xz`/`tar.bz2`/`zip`).

**2.1.2** It is recommended to provide a Git repository as a fallback source so Xmake can automatically fall back when archive downloads fail or a specific commit is needed:

```lua
add_urls("https://github.com/user/repo/archive/refs/tags/$(version).tar.gz",
         "https://github.com/user/repo.git")
```

**2.1.3** Git submodules are fetched by default. If they are not needed, disable them in the URL configuration:

```lua
add_urls("https://github.com/user/repo.git", {submodules = false})
```

**2.1.4** When providing multiple sources at the same time (such as a release archive, `github:`/`bitbucket:` shorthand source, and a git repository), it is recommended to set an `alias` for any source that needs independent version mapping, and bind that source in `add_versions` with `<alias>:<version>` (`alias` is not limited to git sources):

```lua
add_urls("https://github.com/user/repo/archive/refs/tags/$(version).tar.gz")
add_urls("github:user/repo.git", {alias = "github"})
add_urls("bitbucket:user/repo.git", {alias = "bitbucket"})

add_versions("1.1.9", "sha256...")
add_versions("github:1.1.9", "ver.1.1.9")
add_versions("bitbucket:1.1.9", "ver.1.1.9")
```

**2.1.5** In URL fields, `set_urls` overwrites (resets) the entire URL list, while `add_urls` appends. Prefer `add_urls` in most cases, and use `set_urls` only when a reset is truly needed:

```lua
set_urls("https://github.com/user/repo.git") -- overwrite URL list
add_urls("https://mirror.example.com/repo.git") -- append mirror
```

**2.1.6** If source locations need to switch dynamically by platform or build form (for example, using a prebuilt archive on Windows and building from source elsewhere), you can dynamically set `urls/versions` in `on_source`. To support older Xmake versions, it is recommended to guard this with `if on_source then ... else ...`:

```lua
if on_source then
    on_source(function (package)
        if package:is_plat("windows") then
            package:set("urls", "https://example.com/prebuilt-$(version).zip")
        else
            package:set("urls", "https://example.com/source-$(version).tar.xz")
        end
    end)
else
    set_urls("https://example.com/source-$(version).tar.xz")
end
```

**2.1.7** If a source archive contains obviously irrelevant large directories (such as web docs or example site assets), or contains files that are unsupported or should not be extracted on the current platform, you can filter them with `excludes` in `add_urls` to reduce extraction size and CI I/O overhead and to avoid irrelevant files entering the source tree:

```lua
add_urls("https://github.com/user/repo/archive/refs/tags/$(version).zip", {
    excludes = {"*/html/*", "*/docs/site/*"}
})
```

**2.1.8** If the same package has multiple installation schemes (such as prebuilt and source build), you can declare schemes via `add_schemes(...)` and switch logic in `on_source`/`on_install` by reading `package:current_scheme()`; for older versions, you can fall back to `package:data("scheme")`:

```lua
add_schemes("binary", "source")

on_install(function (package)
    local scheme = package:current_scheme() or package:data("scheme")
    if scheme == "binary" then
        -- install prebuilt artifacts
    else
        -- build from source
    end
end)
```

### 2.2 Version Verification and Mapping

**2.2.1** Every archive version must correspond to a SHA-256 checksum; Git source versions can be bound to either a full 40-character commit hash or a tag name (both depend on upstream repository availability):

```lua
add_versions("v1.0.0", "abc123...sha256-64chars")
add_versions("git:v1.0.0", "full-40-char-commit-hash")
add_versions("git:1.1.9", "ver.1.1.9")
```

**2.2.2** Non-standard version mapping: if the upstream tag format does not match semantic version numbers (for example, `jun2023` corresponds to `2023.06`), you must pass a mapping function in `add_urls`:

```lua
local tag = {["2023.06"] = "jun2023"}
add_urls("https://.../$(version).tar.gz", {
    version = function(version) return tag[tostring(version)] end
})
```

**2.2.3** Packages without Releases: use the date as the version number (such as `2024.01.01`) and bind it to the corresponding full commit hash:

```lua
add_versions("2024.01.01", "full-40-char-commit-hash")
```

**2.2.4** If only a git source is provided (with no archive source), `add_versions` can directly bind the version number to a commit/tag without using the `git:` prefix:

```lua
add_urls("https://github.com/user/repo.git")
add_versions("2025.03.02", "full-40-char-commit-hash")
```

**2.2.5** If the version list is long, it can be split into separate files for maintenance (such as `versions.txt`/`versions.lua`) and included in the package script with `add_versionfiles(...)`; for older versions, you can fall back to older interfaces such as `add_versions_list()`.

**2.2.6** If you need to distinguish the branch that downloads "by release version" from the branch that downloads "by git reference (branch/tag/commit)", you can use `package:gitref()` for conditional checks (commonly used when the upstream directory structure or CMake logic differs between git versions and release packages).

**2.2.7** In `on_source`, you can read the user-requested version through `package:requireinfo().version` (and rewrite it if necessary), which is useful for splitting "composite version strings", source mapping, or normalizing version aliases.

**2.2.8** `package:get("versions")` / `package:set("versions", ...)` are more historical usages; new scripts generally should not dynamically rewrite the entire version table. To read the currently selected version, prefer `package:version()` (or stringified `package:version_str()`), and only combine it with `requireinfo().version` from 2.2.7 when source mapping is necessary.

```lua
on_load(function (package)
    local ver = package:version()
    if ver then
        -- branch by selected version
    end
end)
```

### 2.3 Local Source Directory

**2.3.1** If package sources come from a local path (for debugging or private packages), use `set_sourcedir` instead of `add_urls`:

```lua
set_sourcedir(path.join(os.scriptdir(), "src"))
```

**2.3.2** When using `set_sourcedir`, `add_versions` is not needed. Xmake will not perform the download flow, and using `package:version()` will raise an error.

### 2.4 Extra Resources

**2.4.1** When the upstream build is missing necessary auxiliary files (such as extra CMake scripts, `config.guess/config.sub`, or third-party subrepositories), it is recommended to fetch extra resources separately with `add_resources` rather than mixing such files into the main source patch set:

```lua
add_resources(">=1.0.26", "libusb-cmake",
              "https://github.com/libusb/libusb-cmake.git",
              "8f0b4a38fc3eefa2b26a99dff89e1c12bf37afd4")
```

**2.4.2** In `on_install`, use `package:resourcefile(name)` or `package:resourcedir(name)` to access extra resources. Resource version expressions can use the same single-version/range/wildcard forms as `add_patches` (such as `*`), and can also use major-version wildcards such as `2.x`.

**2.4.3** In addition to top-level `add_resources(...)`, extra resources can also be appended dynamically in `on_load` via `package:add("resources", ...)`, which is useful when the resource source should be decided lazily based on version or configuration.

---

## 3. Dependency Management

### 3.1 Build and Runtime Dependencies

**3.1.1** `add_deps`: declare required build tools (such as `cmake`, `ninja`) or libraries required for linking (such as `zlib`).

**3.1.2** Dependency attributes such as `includedirs` and `links` are **propagated downstream by default**. If they should not be propagated (for example, a tool library used only during the build), set `private = true`:

```lua
add_deps("zlib")                              -- propagated downstream
add_deps("libcodegen", {private = true})      -- not propagated, build-time only
```

**3.1.3** Dependencies can carry version constraints and configuration constraints (common version expression forms include `>=`, `<=`, `^`, and `x` wildcards):

```lua
add_deps("nasm >=2.13", {kind = "binary"})
add_deps("xtl ^0.8.0")
add_deps("python 3.x", {kind = "binary"})
add_deps("lcms 2.x")
add_deps("zlib", {configs = {shared = false}})
```

**3.1.4** Build tool isolation: the `bin` directories of tool dependencies such as `cmake` and `ninja` are visible only during the `on_install` stage and will not pollute the user's system `PATH`.

**3.1.5** Dependency versions can be linked to the current package version (for example, keeping subpackages in the same repository on the same minimum version). In `on_load`, you can build the constraint string with `package:version_str()` and then call `package:add("deps", ...)`.

**3.1.6** When dynamically appending dependencies in `on_load`, you can also pass version constraints in the parameter table. For example:

```lua
on_load(function (package)
    package:add("deps", "zlib", {version = ">1.0.0"})
end)
```

**3.1.7** Dependencies can be declared optional (`optional = true`) for soft dependency scenarios where features are enabled when available and degraded otherwise. This is commonly used for large packages with optional compression or acceleration backends.

```lua
add_deps("zlib", "zstd", {optional = true})
```

**3.1.8** When you need to iterate over "library dependencies" to inject include/link settings, use `package:librarydeps()` (supports `{private = true}`) and `package:orderdeps()` for different purposes: the former is oriented toward a "set of library dependencies", while the latter is oriented toward an "ordered dependency chain".

**3.1.9** If you only need to iterate over direct dependencies (without expanding the full dependency graph), use `package:plaindeps()`; this is commonly used by template/aggregate packages for lightweight detection in `on_fetch`.

### 3.2 External Sources

**3.2.1** If the package already exists in mainstream distribution package managers, it is recommended to connect it through `add_extsources`; if no usable system package exists, this may be omitted. When detection succeeds, the download and installation flow will be skipped. `extsources` supports not only `apt/pacman/brew`, but also system detection entries such as `pkgconfig::foo`.

```lua
add_extsources("pkgconfig::libxml-2.0", "apt::libfoo-dev", "pacman::foo", "brew::foo")
```

**3.2.2** When the system package name depends on platform or component configuration, you can dynamically append `extsources` in `on_load` (`package:add("extsources", ...)`) to map distribution package names precisely by enabled component.

---

## 4. Build Configuration and Environment Preprocessing

### 4.1 User Options

**4.1.1** `add_configs`: provides custom build switches. Built-in reserved config options are `shared`, `static`, `pic`, `lto`, `vs_runtime`, and `debug`. These usually do not need to be redefined; define them explicitly only when you need to set `readonly` or override the description.

Supported `type` values and examples:

```lua
-- boolean
add_configs("tools",   {description = "Build tools.",           default = false, type = "boolean"})
add_configs("minimal", {description = "Build a minimal version.", default = true, type = "boolean"})

-- string (optional `values` to restrict the enum)
add_configs("endian", {
    description = [[Byte order: "little" or "big". Leave nil for arch default.]],
    default = nil, type = "string", values = {"little", "big"}
})

-- table (multi-select list)
add_configs("modules", {
    description = [[Enable modules, e.g. {configs = {modules = {"zlib", "lzma"}}}]],
    type = "table"
})
```

**4.1.2** Read-only options: if a package does not support a certain mode (for example, it does not support static builds), that option must be marked as `readonly`:

```lua
add_configs("shared", {description = "Build shared library.", default = true, readonly = true})
```

**4.1.3** MSVC runtime: Xmake passes `CMAKE_MSVC_RUNTIME_LIBRARY` to CMake by default, so you usually do not need to manually compose this parameter. If you need runtime-based conditional branches, use `package:has_runtime("MD", "MT")`; if upstream CMake explicitly hardcodes runtime options, it is recommended to remove the upstream forced setting with `io.replace` to avoid overriding the value Xmake passes by default:

```lua
if package:has_runtime("MD", "MT") then
    -- runtime-related branching when needed
end

io.replace("CMakeLists.txt", "set(CMAKE_MSVC_RUNTIME_LIBRARY \"MultiThreaded\")", "", {plain = true})
io.replace("CMakeLists.txt", "set(CMAKE_MSVC_RUNTIME_LIBRARY \"MultiThreadedDLL\")", "", {plain = true})
```

**4.1.4** Dynamically modifying `kind`: `package:set("kind", ...)` can be used in `on_load`, but there are currently known behavior issues (it may cause incorrect handling of header-only vs non-header-only forms). Avoid it unless necessary; if it must be used, explain the reason in a comment and refer to:
[https://github.com/xmake-io/xmake/issues/5807#issuecomment-2467654245](https://github.com/xmake-io/xmake/issues/5807#issuecomment-2467654245)

**4.1.5** Configuration linkage and constraints: in `on_load`, you can use `package:config_set(...)` to derive default configs or forcibly narrow upstream limitations (for example, a certain version supports only static libraries). If this overrides a user-provided config, it is recommended to also emit a `wprint` explaining why.

**4.1.6** Backend-selection configs can use `values` for enum constraints and can mix `false` with string values. This form does not require explicitly declaring `type`, and is suitable for tri-state switching such as "off/backend A/backend B":

```lua
add_configs("openssl", {
    description = "Enable PKCS7 signatures support",
    default = "openssl3",
    values = {false, "openssl", "openssl3"}
})
```

**4.1.7** When mapping configs to upstream build parameters in bulk, you can iterate over `package:configs()` and use `package:extraconf("configs", name, "builtin")` to filter built-in configs (such as `debug` and `shared`). This is common syntax sugar that helps avoid accidentally passing built-in options to the upstream build system as business switches:

```lua
for name, enabled in pairs(package:configs()) do
    if not package:extraconf("configs", name, "builtin") then
        table.insert(configs, "-D" .. name:upper() .. "=" .. (enabled and "ON" or "OFF"))
    end
end
```

**4.1.8** When handling the MSVC runtime, in addition to `has_runtime(...)`, you can also read `package:runtimes()` directly (such as `MT`/`MD`) and forward it to upstream parameters. New scripts should keep the style consistent and avoid mixing multiple runtime-branching styles within the same package.

### 4.2 Environment Export

**4.2.1** `on_load`: runs before source download and is used to dynamically decide package dependencies, patches, and attributes based on configuration. Typical uses:

- Conditional `add_deps` (for example, deciding whether to depend on `openssl` by config)
- Exporting macro definitions for downstream targets
- Injecting different system link libraries by platform

```lua
on_load(function(package)
    if package:config("with_ssl") then
        package:add("defines", "FOO_WITH_SSL=1")
        package:add("deps", "openssl")
    end
end)
```

**4.2.2** `deps` has stage constraints: they can only be added via top-level `add_deps(...)` or `package:add("deps", ...)` during the `on_load` stage; do not add `deps` in `on_install`.

For attributes such as `defines` and `syslinks`, it is still recommended to place them in `on_load` first, to keep metadata separate from installation logic and improve readability.

**4.2.3** Platform-specific linking: system libraries such as `pthread` on Linux or Windows system libraries must be injected into `syslinks` dynamically according to `is_plat`:

```lua
on_load(function(package)
    if package:is_plat("linux") then
        package:add("syslinks", "pthread", "dl")
    elseif package:is_plat("windows") then
        package:add("syslinks", "ws2_32", "advapi32")
    end
end)
```

**4.2.4** Runtime environment variable extension: when exporting path-type variables such as `PYTHONPATH`, it is recommended to pair them with `package:mark_as_pathenv("PYTHONPATH")`. `mark_as_pathenv` should only be called during `on_load`. If installation-time computed results (such as the final install path) need to be reused in later stages, use `package:data_set("k", v)` and `package:data("k")` to pass data through the package lifecycle.

**4.2.5** If a toolchain/binary package needs to export fixed environment variables such as `*_ROOT`, use `package:setenv("KEY", value)` in `on_load`; path-type variables should still be paired with `mark_as_pathenv`.

---

## 5. Build and Installation Lifecycle

### 5.1 Build System Abstraction

**5.1.1** Hardcoding build commands in scripts (such as `os.run("make")`) is strictly forbidden. You must use the [package build tool modules](/api/scripts/extension-modules/package/tools) provided by Xmake:

| Upstream Build System | Recommended API |
| :--- | :--- |
| CMake | `import("package.tools.cmake").install(package, configs)` |
| Meson | `import("package.tools.meson").install(package, configs)` |
| Autoconf | `import("package.tools.autoconf").install(package, configs)` |
| Xmake | `import("package.tools.xmake").install(package, configs)` |
| Make | `import("package.tools.make").install(package, configs)` |
| Nmake | `import("package.tools.nmake").install(package, configs)` |

**5.1.2** A few historical packages still directly invoke upstream build commands via `os.vrun(v)`, but this is a legacy issue and is not a basis for relaxing the specification. Whenever such packages are touched in future maintenance, they should be migrated to `package.tools.*` first.

**5.1.3** For legacy scripts that have not yet been fully migrated (for example, manually calling `configure`/`make`), you should at least forward compilers and flags via `package:build_getenv(...)` to avoid hardcoded toolchains causing cross-compilation or host-environment contamination.

**5.1.4** When using a Port script or copying auxiliary files from the package into the source tree during installation (such as `port/xmake.lua`, `.def`, or template files), it is recommended to use `package:scriptdir()` to locate the package script directory rather than relying on the current working directory:

```lua
os.cp(path.join(package:scriptdir(), "port", "xmake.lua"), "xmake.lua")
```

**5.1.5** If you need to copy intermediate artifacts (such as `.pdb`) from a temporary build directory into the install directory, it is recommended to use `package:builddir()` to get the build directory root path; `package:buildir()` in historical scripts is considered an old-style interface:

```lua
os.trycp(path.join(package:builddir(), "foo/**.pdb"), package:installdir("bin"))
```

**5.1.6** For single-file download packages (for example, only downloading a `.h` or `.exe`), you can get the original downloaded file path during installation through `package:originfile()` and then copy it manually into the target directory.

**5.1.7** If temporary build files need to be generated or overwritten during installation, it is recommended to use `package:cachedir()` to locate the extraction cache directory and avoid polluting the script directory or repository files.

**5.1.8** Platform-dispatch forwarding packages (for example, using a system library on macOS and forwarding to a third-party dependency on other platforms) may keep a minimal `on_install` for dispatching and installation-stage adaptation, and the install hook should not simply be removed.

### 5.2 Build Parameter Optimization

**5.2.1** For packages that actually need compiled artifacts (not header-only and not pure prebuilt relocation), Debug/Release mode must be mapped explicitly:

```lua
table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:is_debug() and "Debug" or "Release"))
```

**5.2.2** For packages that actually need compiled artifacts (not header-only and not pure prebuilt relocation), shared/static must be mapped explicitly. If the upstream uses the standard switch, `BUILD_SHARED_LIBS` can be mapped directly; if the upstream uses custom variables (such as `BUILD_STATIC` or `ZSTD_BUILD_SHARED`), you must adapt to its interface explicitly:

```lua
table.insert(configs, "-DBUILD_SHARED_LIBS=" .. (package:config("shared") and "ON" or "OFF"))
```

**5.2.3** Windows full symbol export: when building a shared library and the upstream CMake does not handle `__declspec(dllexport)`, you must inject:

```lua
if package:is_plat("windows") and package:config("shared") then
    table.insert(configs, "-DCMAKE_WINDOWS_EXPORT_ALL_SYMBOLS=ON")
end
```

**5.2.4** Disabling tests/examples to build: if the upstream has no switch to disable them, use `io.replace` to comment out the relevant `add_subdirectory` calls:

```lua
io.replace("CMakeLists.txt", "add_subdirectory(tests)", "", {plain = true})
io.replace("CMakeLists.txt", "add_subdirectory(examples)", "", {plain = true})
```

**5.2.5** If the upstream build system forcibly enables `/WX` or `-Werror` (treat warnings as errors), you must remove that forced option with `io.replace` to avoid build failures caused by compiler differences:

```lua
io.replace("CMakeLists.txt", "/WX", "", {plain = true})
io.replace("CMakeLists.txt", "-Werror", "", {plain = true})
```

**5.2.6** Windows artifact consistency: when adapting upstream shared/static options, ensure the artifact form matches the configuration - generate `.dll` (usually with an import `.lib`) when `shared=true`, and static `.lib` (or `.a`) when `shared=false`.

**5.2.7** If the upstream build scripts do not correctly handle transitive dependency linking (common in some autoconf/meson projects), you can iterate over `package:orderdeps()` and assemble `cflags/cppflags/ldflags` (or `c_link_args`) through `dep:fetch()` for explicit injection, avoiding missing symbols or headers.

**5.2.8** When using `package.tools.*` for install/configure and needing to explicitly inject build information from dependent packages into the upstream build system, you can pass `packagedeps` in the options table (supports a string or an array). In essence, this directly injects dependency information into the build process through parameters such as `cxflags/shflags`.

This should be used only as a **last resort**: prefer patching upstream build scripts first (such as `CMakeLists.txt`, `meson.build`, or `configure.ac`); use `packagedeps` only when patching fails or is too costly to maintain.

```lua
import("package.tools.cmake").install(package, configs, {packagedeps = {"libogg", "xxhash"}})
import("package.tools.autoconf").install(package, configs, {packagedeps = "libiconv"})
```

**5.2.9** `package:debug()` is a historical interface. New or refactored scripts should consistently use `package:is_debug()`; legacy packages can be migrated gradually during maintenance:

```lua
table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:is_debug() and "Debug" or "Release"))
```

### 5.3 Patch Management

**5.3.1** Use `add_patches` to apply patches automatically after source extraction and before the build. Version selection supports single versions, wildcards (`*`), one-sided ranges, and interval expressions (you can write `&&`, or simply separate them with spaces):

```lua
add_patches("1.0.0", "patches/1.0.0/fix-windows.patch", "sha256-of-patch-file")
add_patches("*", "patches/common/fix-clang.patch", "sha256-of-patch-file")
add_patches(">=3.2.4", "patches/common/fix-cxx17.patch", "sha256-of-patch-file")
add_patches(">=5.3.0 <=5.8.0", "patches/common/fix-cmake.patch", "sha256-of-patch-file")
add_patches(">=2.57.3 <2.57.6", "patches/common/fix-headers.patch", "sha256-of-patch-file")
```

**5.3.2** Patch files should preferably be stored under `patches/<version>/` within the package directory and kept under version control. If the same patch needs to be reused across multiple versions, it can be placed in a common path and reused by multiple `add_patches` entries.

**5.3.3** Strategy recommendations:
- **Structural bug fixes** (stable change boundaries, auditable diff preferred) -> use `.patch`/`.diff` files where possible (also easier for sending PRs upstream)
- **Temporary invasive changes** (removing tests, changing install paths) -> prefer `io.replace` (more direct and no need to maintain patch context)

**5.3.4** If the modified logic is critical and can usually be reused across multiple upstream versions, prefer `io.replace` (or an equivalent scripted text patch) when possible. The reason is that `add_patches` depends on version-range matching and has a higher maintenance cost in automatic update CI scenarios.

**5.3.5** `add_patches` supports both local patch files and remote patch URLs (including large patch file scenarios). For important fixes, it is recommended to keep a local patch copy in the repository whenever possible to reduce the risk of broken upstream links.

**5.3.6** If multiple `add_patches` entries are declared for the same version, the application order is not guaranteed; script logic must not rely on "apply A first, then B". If two modifications have order coupling, merge them into a single patch, or switch to `io.replace`/scripted patching to eliminate order dependency.

**5.3.7** When patches need to be enabled conditionally by toolchain version, it is recommended to append `patches` dynamically in `on_load`, and express the version constraint and platform/toolchain condition separately (for example, "package version is v2.1.0 and Android NDK is r27"):

```lua
on_load(function (package)
    if package:is_plat("android") then
        local ndk = package:toolchain("ndk")
        local ndkver = ndk and ndk:config("ndkver")
        if ndkver and tonumber(ndkver) == 27 then
            package:add("patches", "v2.1.0", "patches/v2.1.0/fix-r27.diff", "sha256...")
        end
    end
end)
```

**5.3.8** Uniform requirements for patch file encoding and line endings: `UTF-8` (without BOM) + `LF`. After modifying patch content or line endings, you must recalculate and update `add_patches(..., sha256)` to avoid cross-platform hash drift.

For detailed usage of the `io.replace` interface, see [io.replace](/api/scripts/builtin-modules/io#io-replace). For `io.gsub` usage, see [io.gsub](/api/scripts/builtin-modules/io#io-gsub).

---

## 6. System Library Detection

### 6.1 Custom Detection in `on_fetch`

**6.1.1** When the automatic detection provided by `add_extsources` is insufficient for complex scenarios, use `on_fetch` to implement custom detection logic. Returning `nil` automatically falls back to the `on_install` flow:

```lua
on_fetch(function(package, opt)
    if opt.system then
        local result = {}
        result.includedirs = {"/usr/include/foo"}
        result.libfiles    = {"/usr/lib/libfoo.a"}
        return result
    end
end)
```

**6.1.2** The fields supported by the table returned from `on_fetch` are: `includedirs`, `linkdirs`, `links`, `libfiles`, `defines`.

**6.1.3** pkg-config integration: you can use the built-in `find_package` helper to simplify detection. Xmake has already preconfigured the search paths for `find_package` and pkg-config, so you usually do not need to pass path parameters manually:

```lua
on_fetch(function(package, opt)
    if opt.system then
        return package:find_package("pkgconfig::foo", opt)
    end
end)
```

**6.1.4** Version-constrained detection: if the system library version does not meet the requirement, return `nil` to force the installation flow:

```lua
on_fetch(function(package, opt)
    if opt.system then
        local result = package:find_package("pkgconfig::foo", opt)
        if result and result.version and semver.satisfies(result.version, ">=1.2.0") then
            return result
        end
    end
end)
```

**6.1.5** Complex detection logic can be split into separate script files for reuse (for example, `on_fetch("fetch")`); the same "script splitting" also applies to other hooks such as `on_install` and `on_test`, and is not unique to `on_fetch`.

**6.1.6** In addition to `find_package(...)`, `on_fetch` can also use `package:find_tool(...)` to detect system tools and return the detection result.

**6.1.7** It is recommended to distinguish `on_fetch` return semantics: `nil` means continue falling back to the install flow, while `false` can be used to explicitly prevent fallback (for example, to terminate early in cases with known detection side effects or hangs).

```lua
on_fetch(function (package, opt)
    if opt.system then
        if should_abort_fetch() then
            return false -- stop fallback install
        end
        return nil -- continue fallback install
    end
end)
```

### 6.2 Early Constraint Checks in `on_check`

**6.2.1** `on_check` is one of the earliest validation stages and is suitable for prerequisite checks on "whether building is allowed to continue" (for example, unsupported CI platforms or insufficient toolchain versions). On validation failure, `assert` should terminate as early as possible to avoid wasting time on later download and build steps.

```lua
on_check("android", function(package)
    local ndkver = package:toolchain("ndk"):config("ndkver")
    assert(ndkver and tonumber(ndkver) > 22, "need ndk > 22")
end)
```

**6.2.2** It is recommended that `on_check` only performs environment availability checks, not source modifications or installation actions.

**6.2.3** To support older Xmake versions, you can check for existence before calling it:

```lua
if on_check then
    on_check("android", function(package)
        -- ...
    end)
end
```

---

## 7. Special Package Type Handling

### 7.1 Xmake Port (Native Build Rewrite)

**7.1.1** When the upstream build system is broken or overly complex, using an Xmake Port is recommended. Common approaches include:
- Maintaining a fixed `port/xmake.lua` in the package directory, copying it to the source root in `on_install`, and then installing;
- Dynamically generating the build script with `io.writefile("xmake.lua", ...)` in `on_install` based on version/platform;
- Organizing minimal build logic directly in the package script and invoking the Xmake tool module to install.

**7.1.2** Symbol export strategy for shared libraries:

- Recommended (when the library source is small): modify the source and add platform symbol annotations (`__declspec(dllexport)` / `__attribute__((visibility("default")))`), which is explicit and controllable.
- Alternative (when the library source is large and costly to modify): use `utils.symbols.export_all`, which relies internally on tools such as `objdump`/`dumpbin` to scan object files and export symbols. The result is not stable, so use it only when there is no better option:

```lua
if is_plat("windows") and is_kind("shared") then
    add_rules("utils.symbols.export_all")
end
```

**7.1.3** If the upstream depends on template files such as `config.h.in` or `.pc.in`, you can generate configuration headers/metadata files in the Port script using `set_configvar` + `add_configfiles`; this generation logic should stay in sync with version numbers and platform features and should avoid hardcoded constants.

### 7.2 Precompiled Binaries

**7.2.1** During `on_install`, artifacts must be moved into the standard subdirectories under `package:installdir()` with strict categorization:

```lua
os.cp("include/*", package:installdir("include"))
os.cp("lib/*.a",   package:installdir("lib"))
os.cp("bin/*",     package:installdir("bin"))
```

**7.2.2** Use `os.trycp` to handle non-cross-platform files (for example, `.dll` exists only on Windows):

```lua
os.trycp("bin/*.dll", package:installdir("bin"))
```

**7.2.3** Current automated build practice for precompiled packages mostly relies on GitHub Actions, and the main platform that can be reused stably is Windows. When cross-platform precompiled coverage is insufficient, prioritize keeping the source-build path usable.

**7.2.4** If the upstream provides only precompiled artifacts (such as `yy-thunks`), you can directly package the upstream binaries/object files and configure `set_policy("package.precompiled", false)` in the package script.

**7.2.5** When the same package supports both "precompiled download" and "source build", it is recommended to distinguish logic with `package:is_precompiled()`, and add required build-time dependencies (such as `perl` or `gperf`) only on the source-build path to avoid introducing useless dependencies on the pure precompiled path.

**7.2.6** When adding logic only to the "source build path", you can also use `package:is_built()`; a common compatibility pattern for older versions is `if not package.is_built or package:is_built() then ... end`.

### 7.3 Component Packages

**7.3.1** For large packages that provide multiple independent sublibraries (such as Boost or Qt), use the component mechanism so users can depend on them on demand instead of being forced to link all sublibraries:

```lua
add_components("core", "net", "ssl")

on_component("core", function(package, component)
    component:add("links", "foo_core")
end)

on_component("net", function(package, component)
    component:add("links", "foo_net")
    component:add("deps", "core")  -- inter-component dependency
end)
```

**7.3.2** Components can be registered dynamically in `on_load` (`package:add("components", ...)`), and can use `{default = true}` to mark default components or `{deps = "base"}` to declare component dependencies. This is suitable for packages that enable different component sets by version/configuration.

**7.3.3** On some platforms (especially MinGW), link order is sensitive. Prefer top-level `add_linkorders(...)` to fix the order; if it must be appended conditionally, then use `package:add("linkorders", ...)` in `on_load`. The same link group can declare order with the `group::name` prefix.

```lua
add_linkorders("mingw32", "SDL2main")
add_linkorders("group::foo", "group::bar")

on_load(function (package)
    if package:is_plat("mingw") then
        package:add("linkorders", "mingw32", "SDL2main")
    end
end)
```

### 7.4 Exporting Package Rules

**7.4.1** Packages can export reusable downstream rules via `rules/*.lua`; on the user side, reference them with `add_rules("@<pkg>/<rule>")`.

```lua
-- package side
-- rules/link.lua -> rule("xp")

-- user side
add_requires("yy-thunks")
add_rules("@yy-thunks/xp")
```

---

## 8. Cross-Compilation Support

### 8.1 Platform and Architecture Detection

**8.1.1** Use the following APIs in `on_install` for conditional branching:

```lua
package:is_plat("windows", "mingw")  -- target platform
package:is_arch("x86_64", "arm64")   -- target architecture
package:is_cross()                   -- whether cross-compiling (host != target)
```

**8.1.2** During cross-compilation, the toolchain is automatically injected by Xmake into the upstream build system (such as a CMake toolchain file), so there is no need to manually specify compiler paths in the script.

**8.1.3** Host tool builds: if the package needs to compile a tool that runs on the host platform during the build process (such as `protoc` or `flatc`), that tool must be split into a separate tool package and referenced via `add_deps`; mixing host and target artifact builds in the same `on_install` is strictly forbidden.

**8.1.4** Multiple configurations of the same package name can coexist: you can reference a variant configuration of a package with the form `pkg~xxx`; combined with `{host = true}`, this means the dependency is built with the host toolchain, ensuring the artifact can run directly on the current build machine (commonly used for build-time code generation tools).

```lua
add_deps("opencc~host", {kind = "binary", host = true})

-- still access the dependency object by package name when using it
local host_opencc = package:dep("opencc")
```

**8.1.5** Hooks such as `on_load`/`on_install`/`on_check` support both target-platform filtering and host-platform filtering (`@host` syntax), and also support richer conditional expressions: `and`/`or`/`!`, `plat|arch`, wildcards (such as `arm*`), and `target@host1,host2` combinations. This is suitable for binary tool packages or scenarios that distribute precompiled artifacts by host platform:

```lua
on_install("@windows", "@linux", function(package)
    -- execute installation logic according to the host system
end)

on_install("windows|x64", "windows|x86", function(package)
    -- target platform + architecture filtering
end)

on_install("!cross and !wasm and mingw|!i386", function(package)
    -- composite boolean expression
end)

on_install("windows|!arm*", function(package)
    -- wildcard and negation
end)

on_install("mingw@windows", function(package)
    -- target mingw, host windows
end)

on_install("android@linux,macosx", function(package)
    -- specific target platform + multiple host platforms
end)

on_install("@linux|x86_64", "@linux|arm64", function(package)
    -- host platform + host architecture filtering
end)

on_load("windows", function(package)
    -- effective only for target windows
end)
```

**8.1.6** If you need to distinguish sub-environments of the host platform (for example, native terminal vs MSYS on Windows), use `is_subhost(...)`. This is commonly used to select system package sources (such as `pacman::`) or create MSYS-specific installation branches.

**8.1.7** In addition to `is_arch(...)` / `is_plat(...)`, target information can also be accessed with `package:is_arch64()`, `package:arch()`, and `package:plat()` as complements (commonly used for path composition or paired with `arch_set/plat_set` for save/restore):

```lua
local oldarch = package:arch()
if package:is_arch64() then
    -- ...
end
```

**8.1.8** Compiler-difference branches can use `package:has_tool("cc"/"cxx", ...)` to determine the current toolchain implementation (such as `cl`, `clang_cl`, or `clangxx`), but due to toolchain caching, it is recommended to use this only during `on_install`:

```lua
on_install(function (package)
    if package:has_tool("cxx", "cl", "clang_cl") then
        -- msvc-like branch
    end
end)
```

**8.1.9** Host sub-environment detection should use the global `is_subhost(...)`; `package:is_subhost(...)` is not a valid API.

**8.1.10** For target-platform string composition or conditional branching, you can use `package:targetarch()` and `package:is_targetos(...)` (complementary to `is_arch/is_plat`):

```lua
local triplet = package:is_targetos("windows") and ("win-" .. package:targetarch()) or "unix"
```

**8.1.11** When you need to read the actual tool path (or tool name) of the current toolchain for triplet inference or parameter composition, use `package:tool("cc"/"cxx"/...)`.

**8.1.12** In some migration/compatibility scenarios, you can temporarily switch the target triplet during installation (`package:plat_set(...)` / `package:arch_set(...)`) to reuse build logic, but the original values should be restored afterward to avoid polluting later steps.

### 8.2 Android / iOS Notes

**8.2.1** Under the Android NDK target, `package:is_plat("android")` is `true`, and the C++ STL type is managed uniformly by Xmake, so there is no need to manually pass `-DANDROID_STL` to CMake.

**8.2.2** If the upstream CMake script has special logic when Android is detected, its compatibility with the toolchain file generated by Xmake must be verified, and fixed with `add_patches` if necessary.

---

## 9. Validation and Testing

### 9.1 Test Logic

**9.1.1** In principle, every package should include an `on_test` section. The following scenarios may be exempt:
- packages that only perform system detection, have only `on_fetch`, and have no install flow;
- inheritance packages that only perform renaming/compatibility forwarding (such as `set_base(...)`), when the parent package already covers the test;
- meta-packages with `set_kind("template")` that only aggregate/forward dependencies;
- tool packages that only aggregate dependencies or provide syntax-sugar forwarding and have no independent artifacts (such as `autotools`);
- cases where the upstream splits subpackages but the parent package validates them uniformly (such as `libc++` belonging to the `libllvm` ecosystem).

**9.1.2** The core goal of `on_test` is to verify "headers are visible + symbols can be linked" (that is, the final result is usable). Prefer lightweight symbol/type detection first; `check_*snippets` can be used as a supplement to cover more complete call paths. A common pattern for C interface libraries is:

```lua
on_test(function(package)
    assert(package:has_cfuncs("foo_init", {includes = "foo/foo.h"}))
end)
```

Other available interfaces of the same kind (choose as needed; no need to use them all):
- `package:has_ctypes(...)`
- `package:has_cxxfuncs(...)`
- `package:has_cxxtypes(...)`
- `package:has_cincludes(...)` / `package:has_cxxincludes(...)`
- `package:check_importfiles(...)` (for imported-target visibility validation)

**9.1.3** C++ class/template testing: use `check_cxxsnippets` to write minimal instantiation code:

```lua
on_test(function(package)
    assert(package:check_cxxsnippets({test = [[
        #include <foo/bar.hpp>
        void test() { foo::Bar b; b.run(); }
    ]]}, {configs = {languages = "c++17"}}))
end)
```

**9.1.4** C code snippet testing: for C libraries, use `check_csnippets` to verify the complete call path:

```lua
on_test(function(package)
    assert(package:check_csnippets({test = [[
        #include <foo.h>
        void test() { foo_ctx_t* ctx = foo_create(); foo_destroy(ctx); }
    ]]}, {configs = {languages = "c11"}}))
end)
```

**9.1.5** Objective-C / Objective-C++ scenarios can use `check_msnippets` for minimal compile/link validation, as a language-specific complement to `check_csnippets`/`check_cxxsnippets`.

**9.1.6** Language standard dependencies: if the test code depends on a specific standard (such as C++17 structured bindings or C11 atomics), you must explicitly declare `languages` in `configs` (see 9.1.3 and 9.1.4); otherwise, older compilers may incorrectly report build failure.

**9.1.7** Artifact forms such as shared/static (`shared` produces `.dll`, `static` produces `.lib/.a`) should in principle be validated uniformly by the package management framework. There is currently no general automatic checking mechanism, and it is not suitable to require every package to write extra check scripts.

Therefore, **manual assisted checks** are used here: when adding or modifying a package, maintainers should spot-check build logs and artifacts in the installation directory, while still retaining basic symbol/snippet tests (see 9.1.2~9.1.6).

---

## 10. Maintenance and CI Standards

### 10.1 Local Validation Commands

**10.1.1** Generate a package template:

```bash
xmake l scripts/new.lua github:<owner>/<repo>
```

**10.1.2** Full test (including detailed build logs):

```bash
xmake l scripts/test.lua -vD --shallow <package>
```

**10.1.3** Test a specific version:

```bash
xmake l scripts/test.lua -vD --shallow <package> <version>
```

**10.1.4** Cross test: you must cover at least two platforms (such as `linux` and `mingw`):

```bash
xmake l scripts/test.lua -vD --shallow --plat=mingw <package>
```

### 10.2 PR Submission Rules

**10.2.1** PRs must be submitted to the `dev` branch; direct submissions to `master` are forbidden.

**10.2.2** The following retry methods are only for rare exceptional cases (such as GitHub Actions issues, occasional tarball download failures, etc.) and should not replace the normal fix-and-commit workflow. If you need to trigger re-checking, you can use one of the following two methods (ordinary contributors usually cannot rerun specific CI jobs directly):
- `close` then `reopen` the PR
- push an empty commit: `git commit --allow-empty -m "ci: retrigger"`

**10.2.3** The package description file must not end with `package_end()`.

**10.2.4** In principle, a single PR should add or modify only one package. Changes to multiple packages must be split into separate PRs.

---

## 11. Package-Management Corner Cases

| Scenario | Handling Strategy | Recommended API |
| :--- | :--- | :--- |
| **Build system lacks install logic** | Manually copy artifacts from the build directory to the install directory | `os.cp(...)`, `package:installdir()` |
| **Port auxiliary file location** | When copying `port/*` into the source directory, locate source files using the package script directory to avoid ambiguity from relative paths | `package:scriptdir()` |
| **Build-directory artifact recovery** | Copy intermediate artifacts such as `.pdb` from the temporary build directory into the install directory; prefer `builddir`, treat `buildir` as old-style syntax | `package:builddir()`, `os.trycp(...)` |
| **Runtime environment variables** | Inject `bin` or `lib` paths into PATH | `package:addenv("PATH", "bin")` |
| **Git submodules** | Disable submodules in URL configuration | `add_urls(..., {submodules = false})` |
| **Git-only source** | Bind version numbers directly to commit/tag (no `git:` prefix needed) | `add_versions("2025.03.02", "<hash>")` |
| **Dynamic source switching** | Dynamically set `urls/versions` in `on_source` by platform/form | `if on_source then on_source(function (package) ... end) end` |
| **Externalized version manifest** | Split large version mappings into external files to reduce noise in the main script | `add_versionfiles("versions.txt")` |
| **Git-reference branch logic** | Branch when release packages and git-reference directories have inconsistent structures | `if package:gitref() then ... end` |
| **URL overwrite vs append** | Use `set_urls` to reset, prefer `add_urls` for incremental maintenance | `set_urls(...)`, `add_urls(...)` |
| **Archive content trimming** | Filter irrelevant directories or files unsupported on the current platform via `excludes` to reduce extraction overhead and avoid interference from irrelevant files | `add_urls("...zip", {excludes = {"*/html/*"}})` |
| **Package rename compatibility** | Use `set_base` to inherit the new package script and provide a migration hint in `on_load` | `set_base("libsdl2")`, `package:base():script("load")(package)` |
| **Extra resource download** | Fetch missing build helper files separately and read them during installation | `add_resources(...)`, `package:resourcefile(...)` |
| **CMake generator policy** | Explicitly enable/disable the Ninja generator policy based on upstream compatibility | `set_policy("package.cmake_generator.ninja", true/false)` |
| **Windows long paths** | Enable the longpaths policy when Git submodule paths are too deep | `set_policy("platform.longpaths", true)` |
| **Dynamic `kind` modification** | Avoid dynamically calling `package:set("kind", ...)` in `on_load` whenever possible (see issue #5807) | `package:set("kind", "library", {headeronly = true})` |
| **Cross-compiled host tools** | Split into a separate tool package and reference via deps | `add_deps("protoc")` |
| **Same-name package with multiple configs** | Use `pkg~xxx` + `{host = true}` to obtain a host-executable tool variant | `add_deps("foo~host", {host = true})` |
| **Forced config narrowing** | Use `config_set` in `on_load` to constrain unsupported combinations and explain why | `package:config_set("shared", false)` |
| **Branching by package `kind`** | Switch dependencies/tests/behavior according to the current package type; prefer `kind` accessor functions for readability | `package:is_library()`, `package:is_binary()`, `package:is_toolchain()` |
| **Optional dependency degradation** | Mark dependencies as `optional = true` when not mandatory, and enable features based on availability | `add_deps("zstd", {optional = true})` |
| **Dependency version linkage** | Dynamically compose dependency constraints according to the current package version | `package:add("deps", "libselinux >=" .. package:version_str())` |
| **Dependency major-version pinning** | Use `x` wildcards to pin major/minor version lines (such as `3.x`, `2.x`) | `add_deps("python 3.x")` |
| **Tri-state backend config** | Use `add_configs(..., {values = {false, "a", "b"}})` to express off/two-backend selection | `add_configs("ssl", {values = {false, "openssl", "mbedtls"}})` |
| **Filtering built-in config items** | Filter built-in items such as `debug/shared` when iterating configs in bulk, and pass only business configs to upstream | `package:configs()`, `package:extraconf("configs", name, "builtin")` |
| **Debug detection** | Use `is_debug()` consistently in new scripts; `debug()` is a historical interface | `package:is_debug()` |
| **Platform + architecture filtering** | Use `plat\|arch` to precisely limit the scope of a hook | `on_install("windows\|x64", fn)` |
| **Target info getters** | In addition to `is_plat/is_arch`, use `plat/arch/is_arch64` to obtain raw target information | `package:plat()`, `package:arch()`, `package:is_arch64()` |
| **Compiler-difference branching** | Branch by the current toolchain implementation (such as `cl`/`clang_cl`/`clangxx`); recommended only in `on_install` | `package:has_tool("cc"/"cxx", ...)` |
| **Host sub-environment distinction** | Use the global function when you need to distinguish MSYS from a native terminal | `is_subhost("msys")` |
| **System library version does not satisfy requirements** | Validate the version in `on_fetch` and return `nil` | `semver.satisfies(ver, ">=x.y")` |
| **Non-standard version tag** | Pass a version mapping function to the URL | `add_urls(..., {version = fn})` |
| **Package without Releases** | Use a date version number + full commit hash | `add_versions("2024.01.01", "hash")` |
| **CI/platform pre-check** | Fail fast in the earliest stage and skip unsupported environments | `on_check(..., function (package) assert(...) end)` |
| **Compatible `on_check` syntax** | Check `if on_check then` first for older versions | `if on_check then on_check(...) end` |
| **Host-platform-filtered install** | Use `@host` syntax to restrict the execution environment of installation scripts | `on_install("@windows", "@linux", fn)` |
| **Host platform + architecture filtering** | Use `@host\|arch` combinations to precisely restrict precompiled/install logic | `on_install("@linux\|x86_64", fn)` |
| **Path-type environment variable export** | Mark variables such as `PYTHONPATH` as pathenv to avoid path-composition issues; `mark_as_pathenv` may only be called in `on_load` | `package:addenv("PYTHONPATH", "python")`, `package:mark_as_pathenv("PYTHONPATH")` |
| **System source detection entry** | In addition to distribution names, pkg-config detection can also be integrated | `add_extsources("pkgconfig::libxml-2.0")` |
| **Componentized system source mapping** | Dynamically append `extsources` in `on_load` by config | `package:add("extsources", "apt::libxcb-foo-dev")` |
| **`on_test` exemption scenarios** | Packages with only `on_fetch`, `set_base` forwarding packages, `template` meta-packages, dependency-aggregation syntax-sugar packages, or subpackages validated uniformly by a parent ecosystem may be exempt | `on_fetch(...)`, `set_base("...")`, `set_kind("template")` |
| **Platform-dispatch forwarding package** | Keep `on_install` for dispatch adaptation when mixing "system library/third-party dependency" between platforms | `on_install(...)`, `is_plat(...)` |
| **Passing through build-tool dependencies** | `packagedeps` directly passes dependency information through `cxflags/shflags`; use only as a last resort after patching build scripts fails | `import("package.tools.cmake").install(..., {packagedeps = {"libogg"}})` |
| **Missing transitive dependency linking** | Iterate `orderdeps` + `fetch` to inject compile/link flags manually | `for _, dep in ipairs(package:orderdeps()) do ... end` |
| **Dynamic component registration** | Dynamically add components in `on_load` and declare defaults/dependencies | `package:add("components", "base", {default = true})` |
| **Link-order-sensitive platforms** | Prefer top-level `add_linkorders` to fix order; for dynamic cases use `package:add("linkorders", ...)` in `on_load`; groups can use the `group::` prefix | `add_linkorders("mingw32", "SDL2main")` |
| **Patch file suffix** | Structural fixes can use `.patch` or `.diff` | `add_patches("x", "patches/x/fix.diff", "<sha256>")` |
| **Patch application order** | Multiple `add_patches` for the same version do not guarantee order; order dependence is forbidden, so merge patches or switch to `io.replace` if needed | `add_patches(...)`, `io.replace(...)` |
| **Toolchain-version-conditional patch** | Read toolchain config in `on_load` and append patches dynamically so they apply only to matching environments | `package:toolchain("ndk"):config("ndkver")`, `package:add("patches", ...)` |
| **Patch file encoding specification** | Use `UTF-8` without BOM + `LF` for all patches, and recalculate SHA256 after changes | `add_patches(..., "<sha256>")` |
| **Upstream publishes precompiled artifacts only** | Explicitly record source and platform/architecture restrictions, then package upstream artifacts directly | `os.cp("objs/x64/*.obj", package:installdir("lib"))` |
| **Dual path for precompiled and source builds** | Use `is_precompiled` and add build dependencies only on the source path | `if not package:is_precompiled() then package:add("deps", "perl") end` |
| **Exporting package rules** | Export `@pkg/rule` to downstream via `rules/*.lua` | `add_rules("@yy-thunks/xp")` |
| **Dependencies not propagated downstream** | Declare as private dependency | `add_deps("lib", {private = true})` |

---

## 12. Xmake Script Corner Cases

| Scenario | Handling Strategy | Common API |
| :--- | :--- | :--- |
| **Header filename conflict** | Use `prefixdir` to install headers into a subdirectory | `add_headerfiles("...", {prefixdir = "foo"})` |
| **Template config file generation** | In a Port, use `set_configvar` + `add_configfiles` to generate `config.h`/`.pc` | `set_configvar("FOO", 1)`, `add_configfiles("config.h.in")` |
