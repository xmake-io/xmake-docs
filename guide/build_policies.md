
Xmake has many default behaviors, such as: automatic detection and mapping of flags, cross-target parallel construction, etc. Although it provides a certain amount of intelligent processing, it is difficult to adjust and may not meet all users' habits and needs.

Therefore, starting with v2.3.4, xmake provides modified settings for the default build strategy, which is open to users to a certain degree of configurability.

It is mainly configured through the [set_policy](https://xmake.io/#/manual/project_target?id=targetset_policy) interface.

The usage is as follows:

```lua
set_policy("check.auto_ignore_flags", false)
```

You only need to set this configuration in the project root domain to disable the automatic detection and ignore mechanism of flags. In addition, set_policy can also take effect locally for a specific target.

```lua
target ("test")
    set_policy ("check.auto_ignore_flags", false)
```

!> In addition, if the set policy name is invalid, xmake will also have a warning prompt.

If you want to get a list and description of all the policy configurations supported by the current xmake, you can execute the following command:

```bash
$ xmake l core.project.policy.policies
{
  "check.auto_map_flags" = {
    type = "boolean",
    description = "Enable map gcc flags to the current compiler and linker automatically.",
    default = true
  },
  "build.across_targets_in_parallel" = {
    type = "boolean",
    description = "Enable compile the source files for each target in parallel.",
    default = true
  },
  "check.auto_ignore_flags" = {
    type = "boolean",
    description = "Enable check and ignore unsupported flags automatically.",
    default = true
  }
}
```

We can also set up internal policy changes via the command line:

```bash
$ xmake f --policies=package.fetch_only
```

The policy name is set by default, which is the enabled state, but we can of course specify to set other values to disable it.

```bash
$ xmake f --policies=package.precompiled:n
```

Or configure multiple policy values at the same time, separated by commas.

```bash
$ xmake f --policies=package.precompiled:n,package.install_only
```

### check.auto_ignore_flags

By default, xmake will automatically detect all the original flags set by the `add_cxflags` and` add_ldflags` interfaces. If the current compiler and linker do not support them, they will be automatically ignored.

This is usually very useful. Like some optional compilation flags, it can be compiled normally even if it is not supported, but it is forced to set up. When compiling, other users may have a certain degree of difference due to the different support of the compiler. The compilation failed.

However, because automatic detection does not guarantee 100% reliability, sometimes there will be a certain degree of misjudgment, so some users do not like this setting (especially for cross-compilation tool chains, which are more likely to fail).

At present, if the detection fails in v2.3.4, there will be a warning prompt to prevent users from lying inexplicably, for example:

```bash
warning: add_ldflags("-static") is ignored, please pass `{force = true}` or call `set_policy("check.auto_ignore_flags", false)` if you want to set it.
```

According to the prompt, we can analyze and judge ourselves whether it is necessary to set this flags. One way is to pass:

```lua
add_ldflags("-static", {force = true})
```

To display the mandatory settings, skip automatic detection, which is an effective and fast way to deal with occasional flags failure, but for cross-compilation, if a bunch of flags settings cannot be detected, each set force Too tedious.

At this time, we can use `set_policy` to directly disable the default automatic detection behavior for a target or the entire project:

```lua
set_policy("check.auto_ignore_flags", false)
target("test")
    add_ldflags("-static")
```

Then we can set various original flags at will, xmake will not automatically detect and ignore them.

### check.auto_map_flags

This is another intelligent analysis and processing of flags by xmake. Usually, the configuration set by xmake built-in APIs like `add_links`,` add_defines` is cross-platform, and different compiler platforms will automatically process them into corresponding Original flags.

However, in some cases, users still need to set the original compilation link flags by add_cxflags, add_ldflags, these flags are not good cross compiler

Take `-O0` compiler optimization flags. Although` set_optimize` is used to implement cross-compiler configuration, what if the user directly sets `add_cxflags ("-O0 ")`? It can be processed normally under gcc / clang, but it is not supported under msvc

Maybe we can use `if is_plat () then` to process by platform, but it is very cumbersome, so xmake has built-in automatic mapping function of flags.

Based on the popularity of gcc flags, xmake uses gcc's flags naming convention to automatically map it according to different compilations, for example:

```lua
add_cxflags("-O0")
```

This line setting is still `-O0` under gcc/clang, but if it is currently msvc compiler, it will be automatically mapped to msvc corresponding to` -Od` compilation option to disable optimization.

Throughout the process, users are completely unaware, and can execute xmake directly to compile across compilers.

!> Of course, the current implementation of automatic mapping is not very mature. There is no 100% coverage of all gcc flags, so there are still many flags that are not mapped.

Some users do not like this automatic mapping behavior, so we can completely disable this default behavior through the following settings:

```bash
set_policy("check.auto_map_flags", false)
```

### build.across_targets_in_parallel

This strategy is also enabled by default and is mainly used to perform parallel builds between targets. In versions prior to v2.3.3, parallel builds can only target all source files within a single target.
For cross-target compilation, you must wait until the previous target is fully linked before you can execute the compilation of the next target, which will affect the compilation speed to a certain extent.

However, the source files of each target can be completely parallelized, and finally the link process is executed together. Versions after v2.3.3 through this optimization, the construction speed is increased by 30%.

Of course, if the build source files in some special targets depend on previous targets (especially in the case of some custom rules, although rarely encountered), we can also disable this optimization behavior through the following settings:

```bash
set_policy("build.across_targets_in_parallel", false)
```

### build.merge_archive

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


### build.ccache

Xmake has a built-in build cache enabled by default, which can be explicitly disabled by setting this policy.

```lua
set_policy("build.ccache", false)
```

Of course, we can also disable it on the command line.

```bash
$ xmake f --ccache=n
```

or

```bash
$ xmake f --policies=build.ccache:n
```

### build.warning

The default compilation usually does not echo the warning output in real time, we usually need to use `xmake -w` to turn it on, or to turn it on globally with `xmake g --build_warning=y`.

Now, we can also enable warning echo output by default in the xmake.lua configuration.

```lua
set_policy("build.warning", true)
set_warnings("all", "extra")
```

At this time, even if we execute the `xmake` command, the warning output can be echoed directly.

### build.optimization.lto

xmake v2.6.9 has improved support for link-time optimisation (LTO), with adaptations for different platforms such as gcc/clang/msvc, simply by enabling this policy to enable LTO for specific targets.

```lua
set_policy("build.optimization.lto", true)
```

We can also turn it on quickly via the command line option.

```console
$ xmake f --policies=build.optimization.lto
```

### build.cuda.devlink

Version 2.7.7 can be configured to show that device links to specific targets are turned on.

This is typically used for Cuda project builds, and for non-Cuda binary/shared dependencies on Cuda static targets, where the Cuda static target needs to show this configuration to turn on device linking.

```lua
target("test")
    set_kind("static")
    set_policy("build.cuda.devlink", true)
```

Whereas by default Cuda binary/shared is devlink enabled, we can also disable it via the policy display.

For a detailed background on this, see: [#1976](https://github.com/xmake-io/xmake/issues/1976)

### preprocessor.linemarkers

If this policy is turned off, then the cache will generate preprocessor files without linemarkers, which will greatly reduce the size of the preprocessor files.
This will greatly reduce the size of the preprocessor file and improve the efficiency of the cache, but the downside is that the source line information will be lost and if you encounter a compilation error, you will not be able to see the exact line of code that went wrong.

### preprocessor.gcc.directives_only

This is also used as a preprocessor policy and is enabled by default. This will improve the efficiency of compile cache preprocessing under gcc, but can lead to cache inconsistencies if the source file contains macros such as `__DATE__`, `__TIME__`, etc.

Therefore, you can turn this policy off as needed to ensure consistent results, depending on your project code.

### package.requires_lock

Can be used to enable version locking of dependency packages introduced by `add_requires()`.

### package.precompiled

Can be used to disable fetching of precompiled dependency packages under windows.

### package.fetch_only

If this policy is enabled, then all dependencies will only be fetched from the system and not downloaded and installed from a remote location.

### package.install_only

If this policy is enabled, then all dependencies will only be downloaded and installed remotely, not fetched from the system.

### package.librarydeps.strict_compatibility

Disabled by default, if enabled then strict compatibility is maintained between the current package and all its library dependencies, any version update of a dependent package will force a recompile install of the current package.

This ensures that all packages are binary compatible and that no linking and runtime errors occur when linking with other installed packages due to changes to the interface of a dependent package.

```lua
package("foo")
    add_deps("bar", "zoo")
    set_policy("package.librarydeps.strict_compatibility", true)
```

For example, if there is an updated version of bar or zoo, then foo will also be recompiled and installed.

### package.strict_compatibility

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

### package.install_always

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

### package.download.http_headers

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

