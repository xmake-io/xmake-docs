# Built-in Policies <Badge type="tip" text="v2.3.4" />

Xmake incorporates many default behaviors, such as automatically detecting and mapping for flags and enabling parallel builds across different targets. Although it provides intelligent processing to some extent, it is difficult to satisfy all users' habits, needs and preferences.

Therefore, xmake provides a way to override its default build policies, giving users a higher degree of control.
This is primarily achieved through the [set_policy](/api/description/project-target#set-policy) API, which can be used to modify the default behavior of targets, packages, or the entire project.

## Usage

::: tip NOTE
If the policy name you provide is invalid, xmake will show a warning.
:::

### 1. Get All the Policies Supported by the Current Version

We can run the following command to get a list of all the policy configurations, including their descriptions, types, and default values:

```sh
$ xmake l core.project.policy.policies
```

### 2. Configuring Policies in `xmake.lua`

::: code-group
```lua [globally]
-- Set this in the root domain to globally disable the automatic detection and ignore mechanism of flags
set_policy("check.auto_ignore_flags", false)
```

```lua [locally]
target ("test")
    -- This applies only to the `test` target.
    set_policy("check.auto_ignore_flags", false)
```
:::

### 3. Configuring Policies via the Command Line

When building projects, we may need to temporarily enable or disable certain policies. In such cases, it's more suitable to use the command line. And when a policy is set from the command line, it is enabled by default:

```sh
$ xmake f --policies=package.fetch_only
```

Also, we can specify other values to disable the policy or achieve other effects:

```sh
$ xmake f --policies=package.precompiled:n
```

Please note that when specifying multiple policies, you should use commas to separate them:

```sh
$ xmake f --policies=package.precompiled:n,package.install_only
```

## check.auto_ignore_flags <Badge type="tip" text="v2.3.4" />

::: danger Potential Risk
Disabling the default policy for auto-detecting and ignoring flags without careful consideration may cause unexpected compiling errors for others, as compilers' support for specific flags varies.
:::

### Default policy

By default, xmake will automatically detect all the compilation and linking flags set by the `add_cxflags` and `add_ldflags` interfaces. If the current compiler or linker does not support a certain flag, xmake will automatically ignore it and show a warning.

This can be extremely useful especially when dealing with optional compilation flags. It can still be compiled normally even if the flag in question is not supported.

### Use Cases

However, in some circumstances, this default policy can result in false positives, especially during cross-compilation. What's more, the resulting warnings can be annoying and create a lot of noise in the build output.

For example:

```
warning: add_ldflags("-static") is ignored, please pass `{force = true}` or call `set_policy("check.auto_ignore_flags", false)` if you want to set it.
```

Based on this warning, we can determine if we need to add this flag. Depending on the number of flags involved, you can choose one of the following two solutions:

#### 1. Add the `force` parameter
```lua
add_ldflags("-static", {force = true})
```

The `{force = true}` parameter can explicitly force the flag(s) to be added, skipping the automatic check. This is an effective and fast way to deal with a few flags. However, when dealing with complex projects like cross-compilation, where a large number of flags might fail the detection, setting this parameter for each one becomes tedious.

#### 2. Set the Policy

To avoid the limitation of the first approach, we can use `set_policy` to directly disable the default automatic detection behavior for a specified target or the entire project. Meanwhile, this will suppress all related warnings.

```lua
set_policy("check.auto_ignore_flags", false)
target("test")
    add_ldflags("-static")
```

## check.auto_map_flags <Badge type="tip" text="v2.3.4" />

::: tip NOTE
The current implementation of auto-mapping is not yet complete and doesn't cover 100% of all gcc flags, so there are still some flags that may not be mapped.
:::

### Default Policy

This policy controls another intelligent feature for flag-handling. Usually, the configurations set by xmake built-in APIs like `add_links`, `add_defines` are cross-platform, which means xmake will automatically translate them into appropriate raw flags for different compilers.

However, in some cases, users still need to set the raw compilation or linking flags by APIs like `add_cxflags` and `add_ldflags`. These APIs takes raw flags as parameters, and therefore are probably compiler-specified and not portable.

Take `-O0`, a compiler optimization flag, for example. Although `set_optimize` can be used to implement cross-platform configuration, some users still prefer to use `add_cxflags("-O0")`. `-O0` can be recognized by gcc and clang, but not by msvc.

To solve this, xmake has a built-in auto-mapping function for flags. Based on the widely-used gcc flags, xmake uses gcc's flags naming convention to automatically map them. For example:

```lua
add_cxflags("-O0")
```

Xmake will pass `-O0` to gcc and clang as it is, but for msvc, it will be automatically mapped to msvc-specified `-Od` flag to disable optimization.

During this transparent process, simply run xmake, and it will handle the necessary flag translations automatically.

### Usage

Some users do not like this auto-mapping behavior, so we can completely disable this default behavior through the following settings:

```lua
set_policy("check.auto_map_flags", false)
```

## check.target_package_licenses <Badge type="tip" text="v2.3.9" />

### Default Policy
Using open-source software as third-party dependencies can avoid "reinventing the wheel" in software development. We should **respect and value** other developers' work by following their licenses. In order to help developers find potential risks, xmake performs a **license compatibility check** on projects and its imported dependencies by default.

### Usage
This policy is intended to help developers identify potential license compliance issues. But in some learning or experimental scenarios, you may want to temporarily silence the conflict warnings generated by this check. To do so, you can configure your project like this:

```lua
set_policy("check.target_package_licenses", false)
```

## build.across_targets_in_parallel <Badge type="tip" text="v2.3.4" />

This strategy is also enabled by default and is mainly used to perform parallel builds between targets. In versions prior to v2.3.3, parallel builds can only target all source files within a single target.
For cross-target compilation, you must wait until the previous target is fully linked before you can execute the compilation of the next target, which will affect the compilation speed to a certain extent.

However, the source files of each target can be completely parallelized, and finally the link process is executed together. Versions after v2.3.3 through this optimization, the construction speed is increased by 30%.

Of course, if the build source files in some special targets depend on previous targets (especially in the case of some custom rules, although rarely encountered), we can also disable this optimization behavior through the following settings:

```sh
set_policy("build.across_targets_in_parallel", false)
```

## build.fence <Badge type="tip" text="v2.9.2" />

Due to the limitation of `set_policy(‘build.across_targets_in_parallel’, false)`, it will limit the parallelism between the parent target and all of its dependent subtargets, which is a bit wide.

When we do codegen, sometimes we just want to limit the parallelism of one of the dependent targets, as a codegen program, and let it finish compiling in advance.

In this case, `build.cross_targets_in_parallel` can't control it finely, and the compilation speed can't be optimised.

Therefore, we have added the `build.fence` policy, which restricts parallel compilation links to only certain sub-targets.

For background, see [#5003](https://github.com/xmake-io/xmake/issues/5003).

Example:

```lua
target(‘autogen’)
    set_default(false)
    set_kind(‘binary’)
    set_plat(os.host())
    set_arch(os.arch())
    add_files(‘src/autogen.cpp’)
    set_languages(‘c++11’)
    set_policy(‘build.fence’, true)

target(‘test’)
    set_kind(‘binary’)
    add_deps(‘autogen’)
    add_rules(‘autogen’)
    add_files(‘src/main.cpp’)
    add_files(‘src/*.in’)
```

The autogen target needs to be compiled and linked before the source code of the test program is compiled, because the test target needs to run the autogen program to dynamically generate some source code to participate in the compilation.

The autogen configuration `set_policy(‘build.fence’, true)` does this.

## build.merge_archive <Badge type="tip" text="v2.5.8" />

If this policy is set, then the target libraries that are dependent on using `add_deps()` no longer exist as links, but are merged directly into the parent target library.

Example.

```lua
add_rules("mode.debug", "mode.release")

target("add")
    set_kind("static")
    add_files("src/add.c")
    add_files("src/subdir/add.c")

target("sub")
    set_kind("static")
    add_files("src/sub.c")
    add_files("src/subdir/sub.c")

target("mul")
    set_kind("static")
    add_deps("add", "sub")
    add_files("src/mul.c")
    set_policy("build.merge_archive", true)

target("test")
    add_deps("mul")
    add_files("src/main.c")
```

The libmul.a static library automatically merges the libadd.a and libsub.a sub-dependent static libraries.


## build.ccache <Badge type="tip" text="v2.6.7" />

Xmake has a built-in build cache enabled by default, which can be explicitly disabled by setting this policy.

```lua
set_policy("build.ccache", false)
```

Of course, we can also disable it on the command line.

```sh
$ xmake f --ccache=n
```

or

```sh
$ xmake f --policies=build.ccache:n
```

## build.warning <Badge type="tip" text="v2.6.8" />

The default compilation usually does not echo the warning output in real time, we usually need to use `xmake -w` to turn it on, or to turn it on globally with `xmake g --build_warning=y`.

Now, we can also enable warning echo output by default in the xmake.lua configuration.

```lua
set_policy("build.warning", true)
set_warnings("all", "extra")
```

At this time, even if we execute the `xmake` command, the warning output can be echoed directly.

## build.optimization.lto <Badge type="tip" text="v2.6.9" />

xmake v2.6.9 has improved support for link-time optimisation (LTO), with adaptations for different platforms such as gcc/clang/msvc, simply by enabling this policy to enable LTO for specific targets.

```lua
set_policy("build.optimization.lto", true)
```

We can also turn it on quickly via the command line option.

```sh
$ xmake f --policies=build.optimization.lto
```

## build.c++.dynamic_debugging <Badge type="tip" text="v3.0.6" />

Enable C++ Dynamic Debugging for MSVC (requires MSVC toolset 14.44+, x64 only, incompatible with LTCG/PGO/OPT-ICF).

```lua
set_policy("build.c++.dynamic_debugging", true)
```

## build.cuda.devlink <Badge type="tip" text="v2.7.7" />

Version 2.7.7 can be configured to show that device links to specific targets are turned on.

This is typically used for Cuda project builds, and for non-Cuda binary/shared dependencies on Cuda static targets, where the Cuda static target needs to show this configuration to turn on device linking.

```lua
target("test")
    set_kind("static")
    set_policy("build.cuda.devlink", true)
```

Whereas by default Cuda binary/shared is devlink enabled, we can also disable it via the policy display.

For a detailed background on this, see: [#1976](https://github.com/xmake-io/xmake/issues/1976)

## run.windows_error_dialog <Badge type="tip" text="v3.0.7" />

By default, when `xmake run` executes a program on Windows, if the program crashes (e.g. segmentation fault), Windows might pop up an error dialog. This can block automated scripts or CI/CD pipelines.

This policy controls whether to enable the Windows error dialog when running targets. It is enabled by default.

### Usage

If you want to disable the error dialog (suppress it), you can set this policy to `false`.

```lua
set_policy("run.windows_error_dialog", false)
```

## build.distcc.remote_only <Badge type="tip" text="v3.0.4" />

This policy is used to configure the behavior of distributed compilation. By default, when distributed compilation is enabled, the local machine acts as both a scheduler and participates in the actual compilation work.

If this policy is enabled, it forces only remote machines to execute distributed compilation tasks, while the local machine does not participate in actual compilation and only serves as a scheduler. This is very useful when local machine resources are limited, or when you want to offload all compilation work to a remote server cluster.

```lua
set_policy("build.distcc.remote_only", true)
```

Or enable it via command line:

```sh
$ xmake f --policies=build.distcc.remote_only
```

For more details about distributed compilation, please refer to: [Distributed Compilation](/guide/extras/distributed-compilation)

## build.sanitizer.address <Badge type="tip" text="v2.8.3" />

Address Sanitizer (ASan) is a fast memory error detection tool that is built-in by the compiler, and usually requires `-fsanitize-address` to be configured in both the build and link flags to enable it correctly.

We can quickly enable it globally by turning on this policy, which will result in compiled programs that directly support ASan detection.

For example, we can enable it from the command line:

```sh
$ xmake f --policies=build.sanitizer.address
```

It can also be enabled globally via the interface configuration:

```lua
set_policy("build.sanitizer.address", true)
```

Of course, we can also enable it for a specific target individually.

Also, if we configure it globally, we can enable it for all dependencies at the same time.

```lua
set_policy("build.sanitizer.address", true)

add_requires("zlib")
add_requires("libpng")
```

It is equivalent to setting the asan configuration for each package in turn.

```lua
add_requires("zlib", {configs = {asan = true}})
add_requires("libpng", {configs = {asan = true}})
```

::: tip NOTE
`add_rules("mode.asan", "mode.tsan", "mode.ubsan", "mode.msan")` will be deprecated, and these new strategies will be used whenever possible, as these build modes cannot take effect on dependent packages simultaneously.
:::

Alternatively, we can validate multiple sanitizer inspections at the same time, e.g.:


```lua
set_policy("build.sanitizer.address", true)
set_policy("build.sanitizer.undefined", true)
```

or

```sh
$ xmake f --policies=build.sanitizer.address,build.sanitizer.undefined
```

## build.sanitizer.thread <Badge type="tip" text="v2.8.3" />

Similar to [build.sanitizer.address](#build-sanitizer-address) for detecting thread safety issues.

## build.sanitizer.memory <Badge type="tip" text="v2.8.3" />

Similar to [build.sanitizer.address](#build-sanitizer-address) for detecting memory issues.

## build.sanitizer.leak <Badge type="tip" text="v2.8.3" />

Similar to [build.sanitizer.address](#build-sanitizer-address) for detecting memory leaks.

## build.sanitizer.undefined <Badge type="tip" text="v2.8.3" />

Similar to [build.sanitizer.address](#build-sanitizer-address) for detecting undefined issues.

## build.always_update_configfiles <Badge type="tip" text="v2.8.7" />

This policy is used for the automatic generation of `add_configfiles` configuration files. By default, xmake only triggers the regeneration of configfiles the first time `xmake config` is done, or if the xmake.lua configuration is changed.

Each subsequent build will not regenerate configfiles as long as the configuration has not changed.

However, if we use a variable such as GIT_COMMIT in our configfiles and want to always regenerate the latest configuration for each build, we can configure it.

For background on how to use it, see: [#4747](https://github.com/xmake-io/xmake/issues/4747)

## build.intermediate_directory <Badge type="tip" text="v2.9.4" />

Configures whether to enable or disable internal subdirectories of the build.

By default, executing `xmake` to compile the project will automatically generate subdirectories in the build directory according to the platform, architecture, and compilation mode to store object files and target files respectively. For example:

```sh
build/
└── macosx
    └── x86_64
        └── release
            └─test
```

If this policy is disabled, the generated product will be directly generated in the build root directory. Become:

```sh
build/
└─ test
```

## build.rpath <Badge type="tip" text="v2.9.4" />

Configures to enable or disable the target rpath setting during build.

By default, if `target(foo)` depends on the dynamic library bar, the generated foo executable file will automatically add bar's rpath, which ensures that users can directly execute the foo program and find bar correctly.

If you want to disable this behavior, you can explicitly configure it.

## install.rpath <Badge type="tip" text="v2.9.4" />

Although the rpath will be set for the built program, the rpath when it is built may not be completely applicable after `xmake install` is installed, so xmake will automatically modify and adjust the rpath so that the installed program can also find its dependent libraries.

However, the premise is that the user must first configure an independent installation rpath through `add_rpathdirs("/xxx", {installonly = true})`.

And we can also use this policy to disable the default installation phase rpath setting behavior.

## run.autobuild <Badge type="tip" text="v2.8.3" />

This policy is used to adjust the behaviour of `xmake run`. By default, running `xmake run` does not build the target program automatically, but prompts the user to build it manually if it has not been compiled yet.

By turning on this policy, we can automatically build the target program before running it.

```sh
$ xmake f --policies=run.autobuild
$ xmake run
```

If you want this policy to take effect globally, you can turn it on globally.

```sh
$ xmake g --policies=run.autobuild
```

## preprocessor.linemarkers <Badge type="tip" text="v2.6.8" />

If this policy is turned off, then the cache will generate preprocessor files without linemarkers, which will greatly reduce the size of the preprocessor files.
This will greatly reduce the size of the preprocessor file and improve the efficiency of the cache, but the downside is that the source line information will be lost and if you encounter a compilation error, you will not be able to see the exact line of code that went wrong.

## preprocessor.gcc.directives_only <Badge type="tip" text="v2.6.8" />

This is also used as a preprocessor policy and is enabled by default. This will improve the efficiency of compile cache preprocessing under gcc, but can lead to cache inconsistencies if the source file contains macros such as `__DATE__`, `__TIME__`, etc.

Therefore, you can turn this policy off as needed to ensure consistent results, depending on your project code.

## package.requires_lock <Badge type="tip" text="v2.5.7" />

Can be used to enable version locking of dependency packages introduced by `add_requires()`.

See [Dependent package lock and upgrade](/guide/package-management/using-official-packages#dependent-package-lock-and-upgrade).

## package.precompiled <Badge type="tip" text="v2.6.4" />

Can be used to disable fetching of precompiled dependency packages under windows.

## package.fetch_only <Badge type="tip" text="v2.6.7" />

If this policy is enabled, then all dependencies will only be fetched from the system and not downloaded and installed from a remote location.

## package.install_only <Badge type="tip" text="v2.6.7" />

If this policy is enabled, then all dependencies will only be downloaded and installed remotely, not fetched from the system.

## package.librarydeps.strict_compatibility <Badge type="tip" text="v2.7.2" />

Disabled by default, if enabled then strict compatibility is maintained between the current package and all its library dependencies, any version update of a dependent package will force a recompile install of the current package.

This ensures that all packages are binary compatible and that no linking and runtime errors occur when linking with other installed packages due to changes to the interface of a dependent package.

```lua
package("foo")
    add_deps("bar", "zoo")
    set_policy("package.librarydeps.strict_compatibility", true)
```

For example, if there is an updated version of bar or zoo, then foo will also be recompiled and installed.

## package.strict_compatibility <Badge type="tip" text="v2.7.2" />

is disabled by default, if it is enabled then strict compatibility is maintained between the current package and all other packages that depend on it, and any version update of this package will force a recompile and install of the other parent packages.

This ensures that all packages are binary compatible and that no linking and runtime errors occur when linking with other installed packages due to changes in the interface of a dependent package.


```lua
package("foo")
    set_policy("package.strict_compatibility", true)

package("bar")
    add_deps("foo")

package("zoo")
    add_deps("foo")
```

For example, if there is an updated version of foo, then both bar and zoo will be forced to be recompiled and installed.

## package.install_always <Badge type="tip" text="v2.7.2" />

This is useful for local integration of third-party source packages,
as the package will always be reinstalled each time `xmake f -c` is run to reconfigure it.

As the user may at any time need to modify the third party source code and recompile it for integration.

Previously it was only possible to trigger a recompile by changing the package version number each time,
but with this strategy it is possible to trigger a recompile each time.

```lua
add_rules("mode.debug", "mode.release")

package("foo")
    add_deps("cmake")
    set_sourcedir(path.join(os.scriptdir(), "foo"))
    set_policy("package.install_always", true)
    on_install(function (package)
        local configs = {}
        table.insert(configs, "-DCMAKE_BUILD_TYPE=" . (package:debug() and "Debug" or "Release"))
        table.insert(configs, "-DBUILD_SHARED_LIBS=" ... (package:config("shared") and "ON" or "OFF"))
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

## package.download.http_headers <Badge type="tip" text="v2.7.7" />

Setting http headers for package downloads

If some packages have url downloads that require specific http headers to be set in order to pass the download, this policy can be specified.

```lua
package("xxx")
    set_policy("package.download.http_headers", "TEST1: foo", "TEST2: bar")
```

We can also set the http headers for the specified urls:

```lua
add_urls("https://github.com/madler/zlib/archive/$(version).tar.gz", {
    http_headers = {"TEST1: foo", "TEST2: bar"}
})
```

## windows.manifest.uac <Badge type="tip" text="v2.8.5" />

This policy allows us to quickly and easily setup and enable Windows UAC.

It supports the following levels:

| Level | Flag |
| --- | --- |
| invoker | asInvoker |
| admin | requireAdministrator |
| highest | highestAvailable |

Example:

```lua
set_policy("windows.manifest.uac", "admin")
```

It is equivalent to setting

```lua
if is_plat("windows") then
    add_ldflags("/manifest:embed", {"/manifestuac:level='requireAdministrator' uiAccess='false'"}, {force = true, expand = false})
end
```

But it's easier and cleaner, and doesn't need to judge the platform, other platforms are automatically ignored.

## windows.manifest.uac.ui <Badge type="tip" text="v2.8.5" />

Sets uiAccess for Windows UAC, defaults to false if it is not set.

```lua
set_policy("windows.manifest.uac.ui", true)
```

## build.progress_style <Badge type="tip" text="v3.0.5" />

Sets the build progress output style. Supports two styles:

- `"single"` (default): Single-row progress output, only updates one line of progress information
- `"multirow"`: Multi-row progress output, displays multiple concurrent build tasks with their individual progress

Multi-row progress output provides a significantly better visual experience during long-running builds, making it easier to monitor parallel compilation.

You can enable multi-row progress output in two ways:

1. **Via theme configuration**: Use the `soong` theme which includes multi-row progress by default:
   ```bash
   $ xmake g --theme=soong
   ```

2. **Via project policy**: Enable it directly in your `xmake.lua`:
   ```lua
   set_policy("build.progress_style", "multirow")
   ```

This provides better visibility into parallel build progress, makes it easier to identify slow compilation units, and improves the overall user experience for large projects with many source files or parallel builds with multiple compilation units.
