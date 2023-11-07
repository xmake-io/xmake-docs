
xmake 有很多的默认行为，比如：自动检测和映射flags、跨target并行构建等，虽然提供了一定的智能化处理，但重口难调，不一定满足所有的用户的使用习惯和需求。

因此，从v2.3.4开始，xmake 提供默认构建策略的修改设置，开放给用户一定程度上的可配置性。

它主要通过 [set_policy](https://xmake.io/#/zh-cn/manual/project_target?id=targetset_policy) 接口来配置。

我们通常可以用它来配置修改 target，package 以及工程整体的一些行为策略。

使用方式如下：

```lua
set_policy("check.auto_ignore_flags", false)
```

只需要在项目根域设置这个配置，就可以禁用flags的自动检测和忽略机制，另外`set_policy`也可以针对某个特定的target局部生效。

```lua
target("test")
    set_policy("check.auto_ignore_flags", false)
```

!> 另外，如果设置的策略名是无效的，xmake也会有警告提示。

如果要获取当前xmake支持的所有策略配置列表和描述，可以执行下面的命令：

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

我们也可以通过命令行的方式去设置修改内部的策略:

```bash
$ xmake f --policies=package.fetch_only
```

默认设置策略名，就是启用状态，当然我们也可以指定设置其他值，禁用它。

```bash
$ xmake f --policies=package.precompiled:n
```

或者同时配置多个策略值，用逗号分割。

```bash
$ xmake f --policies=package.precompiled:n,package.install_only
```

### check.auto_ignore_flags

xmake默认会对所有`add_cxflags`, `add_ldflags`接口设置的原始flags进行自动检测，如果检测当前编译器和链接器不支持它们，就会自动忽略。

这通常是很有用的，像一些可选的编译flags，即使不支持也能正常编译，但是强行设置上去，其他用户在编译的时候，有可能会因为编译器的支持力度不同，出现一定程度的编译失败。

但，由于自动检测并不保证100%可靠，有时候会有一定程度的误判，所以某些用户并不喜欢这个设定（尤其是针对交叉编译工具链，更容易出现失败）。

目前，v2.3.4版本如果检测失败，会有警告提示避免用户莫名躺坑，例如：

```bash
warning: add_ldflags("-static") is ignored, please pass `{force = true}` or call `set_policy("check.auto_ignore_flags", false)` if you want to set it.
```

根据提示，我们可以自己分析判断，是否需要强制设置这个flags，一种就是通过：

```lua
add_ldflags("-static", {force = true})
```

来显示的强制设置上它，跳过自动检测，这对于偶尔的flags失败，是很有效快捷的处理方式，但是对于交叉编译时候，一堆的flags设置检测不过的情况下，每个都设置force太过于繁琐。

这个时候，我们就可以通过`set_policy`来对某个target或者整个project直接禁用默认的自动检测行为：

```lua
set_policy("check.auto_ignore_flags", false)
target("test")
    add_ldflags("-static")
```

然后我们就可以随意设置各种原始flags，xmake不会去自动检测和忽略他们了。

### check.auto_map_flags

这是xmake的另外一个对flags的智能分析处理，通常像`add_links`, `add_defines`这种xmake内置的api去设置的配置，是具有跨平台特性的，不同编译器平台会自动处理成对应的原始flags。

但是，有些情况，用户还是需要自己通过add_cxflags, add_ldflags设置原始的编译链接flags，这些flags并不能很好的跨编译器

就拿`-O0`的编译优化flags来说，虽然有`set_optimize`来实现跨编译器配置，但如果用户直接设置`add_cxflags("-O0")`呢？gcc/clang下可以正常处理，但是msvc下就不支持了

也许我们能通过`if is_plat() then`来分平台处理，但很繁琐，因此xmake内置了flags的自动映射功能。

基于gcc flags的普及性，xmake采用gcc的flags命名规范，对其根据不同的编译实现自动映射，例如：

```lua
add_cxflags("-O0")
```

这一行设置，在gcc/clang下还是`-O0`，但如果当前是msvc编译器，那边会自动映射为msvc对应`-Od`编译选项来禁用优化。

整个过程，用户是完全无感知的，直接执行xmake就可以跨编译器完成编译。

!> 当然，目前的自动映射实现还不是很成熟，没有100%覆盖所有gcc的flags，所以还是有不少flags是没去映射的。

也有部分用户并不喜欢这种自动映射行为，那么我们可以通过下面的设置完全禁用这个默认的行为：

```bash
set_policy("check.auto_map_flags", false)
```

### build.across_targets_in_parallel

这个策略也是默认开启的，主要用于跨target间执行并行构建，v2.3.3之前的版本，并行构建只能针对单个target内部的所有源文件，
跨target的编译，必须要要等先前的target完全link成功，才能执行下一个target的编译，这在一定程度上会影响编译速度。

然而每个target的源文件是可以完全并行化处理的，最终在一起执行link过程，v2.3.3之后的版本通过这个优化，构建速度提升了30%。

当然，如果有些特殊的target里面的构建源文件要依赖先前的target（尤其是一些自定义rules的情况，虽然很少遇到），我们也可以通过下面的设置禁用这个优化行为：

```bash
set_policy("build.across_targets_in_parallel", false)
```

### build.merge_archive

如果设置了这个策略，那么使用 `add_deps()` 依赖的目标库不再作为链接存在，而是直接把它们合并到父目标库中去。

例如：

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

libmul.a 静态库会自动合并 libadd.a 和 libsub.a 两个子依赖的静态库。


### build.ccache

Xmake 默认是开启内置的编译缓存的，通过设置这个策略，可以显式禁用缓存。

```lua
set_policy("build.ccache", false)
```

当然，我们也可以命令行去禁用它。

```bash
$ xmake f --ccache=n
```

或者

```bash
$ xmake f --policies=build.ccache:n
```

### build.warning

默认编译通常不会实时回显警告输出，我们通常需要使用 `xmake -w` 开启，或者通过 `xmake g --build_warning=y` 来全局开启它。

现在，我们也可以在 xmake.lua 配置中去默认启用警告回显输出。

```lua
set_policy("build.warning", true)
set_warnings("all", "extra")
```

这个时候，即使我们执行 `xmake` 命令，也能直接回显警告输出。

### build.optimization.lto

2.6.9 版本 xmake 改进了对 LTO 链接时优化的支持，对 gcc/clang/msvc 等不同平台下都进行了适配，只需要启用这个策略，就能对特定 target 开启 LTO。

```lua
set_policy("build.optimization.lto", true)
```

我们也可以通过命令行选项快速开启。

```bash
$ xmake f --policies=build.optimization.lto
```

### build.cuda.devlink

2.7.7 版本可以通过这个配置，显示开启对特定目标的设备链接。

这通常用于 Cuda 项目的构建，以及非 Cuda binary/shared 依赖 Cuda static 目标的情况，这个时候，Cuda static 目标就需要显示配置这个，开启设备链接。

```lua
target("test")
    set_kind("static")
    set_policy("build.cuda.devlink", true)
```

而默认 Cuda binary/shared 是开启 devlink 的，我们也可以通过策略显示禁用它。

关于这个的详细背景说明，见：[#1976](https://github.com/xmake-io/xmake/issues/1976)

### build.sanitizer.address

Address Sanitizer（ASan）是一个快速的内存错误检测工具，由编译器内置支持，通常我们需要在编译和链接的 flags 中同时配置 `-fsanitize-address` 才能正确开启。

而我们可以通过开启这个策略，就可以快速全局启用它，这会使得编译出来的程序，直接支持 ASan 检测。

例如，我们可以通过命令行的方式去启用：

```bash
$ xmake f --policies=build.sanitizer.address
```

也可以通过接口配置去全局启用：

```lua
set_policy("build.sanitizer.address", true)
```

当然，我们也可以单独对某个特定的 target 去配置开启。

另外，如果全局配置它，我们就可以同时对所有依赖包也生效。

```lua
set_policy("build.sanitizer.address", true)

add_requires("zlib")
add_requires("libpng")
```

它等价于，对每个包依次设置 asan 配置。

```lua
add_requires("zlib", {configs = {asan = true}})
add_requires("libpng", {configs = {asan = true}})
```

!> `add_rules("mode.asan", "mode.tsan", "mode.ubsan", "mode.msan")` 将被废弃，尽可能使用这些新的策略，因为这些构建模式无法同步对依赖包生效。

另外，我们也可以同时生效多个 sanitizer 检测，例如：


```lua
set_policy("build.sanitizer.address", true)
set_policy("build.sanitizer.undefined", true)
```

或者

```
$ xmake f --policies=build.sanitizer.address,build.sanitizer.undefined
```

### build.sanitizer.thread

与 [build.sanitizer.address](https://xmake.io/#/zh-cn/guide/build_policies?id=buildsanitizeraddress) 类似，用于检测线程安全问题。

### build.sanitizer.memory

与 [build.sanitizer.address](https://xmake.io/#/zh-cn/guide/build_policies?id=buildsanitizeraddress) 类似，用于检测内存问题。

### build.sanitizer.leak

与 [build.sanitizer.address](https://xmake.io/#/zh-cn/guide/build_policies?id=buildsanitizeraddress) 类似，用于检测内存泄漏问题。

### build.sanitizer.undefined

与 [build.sanitizer.address](https://xmake.io/#/zh-cn/guide/build_policies?id=buildsanitizeraddress) 类似，用于检测 undefined 问题。

### run.autobuild

这个策略用于调整 `xmake run` 的行为，默认情况下，执行 `xmake run` 并不会自动构建目标程序，如果程序还没被编译，就是提示用户手动构建一下。

而开启这个策略，我们就可以在运行程序前，先自动构建对应的目标程序。

```bash
$ xmake f --policies=run.autobuild
$ xmake run
```

如果想要全局生效这个策略，可以全局开启它。

```bash
$ xmake g --policies=run.autobuild
```

### preprocessor.linemarkers

通常用户编译缓存中，预处理器的生成策略，默认开启，如果配置关闭这个策略，那么缓存生成的预处理文件内容将不包含 linemarkers 信息，这会极大减少预处理文件大小。
也会提升缓存的处理效率，但是缺点就是会丢失源码行信息，如果遇到编译错误，将无法看到准确的出错代码行。

### preprocessor.gcc.directives_only

这也是用于预处理器的策略，默认开启，这会提升 gcc 下编译缓存预处理的效率，但是如果源文件中包含 `__DATE__`, `__TIME__` 等宏，就会导致缓存出现不一致。

因此，可以根据自身工程代码，按需关闭此策略，确保生成的结果一致。

### package.requires_lock

可用于开启 `add_requires()` 引入的依赖包的版本锁定。

具体看下：[依赖包的锁定和升级](https://xmake.io/#/zh-cn/package/remote_package?id=%e4%be%9d%e8%b5%96%e5%8c%85%e7%9a%84%e9%94%81%e5%ae%9a%e5%92%8c%e5%8d%87%e7%ba%a7)

### package.precompiled

可用于禁用 windows 下预编译依赖包的获取。

### package.fetch_only

如果开启这个策略，那么所有的依赖包仅仅只会从系统获取，不会从远程下载安装。

### package.install_only

如果开启这个策略，纳闷所有的依赖包仅仅只会走远程下载安装，不会从系统查找获取。

### package.librarydeps.strict_compatibility

默认禁用，如果启用它，那么当前包和它的所有库依赖包之间会保持严格的兼容性，任何依赖包的版本更新，都会强制触发当前包的重新编译安装。

以确保所有的包都是二进制兼容的，不会因为某个依赖包接口改动，导致和其他已被安装的其他包一起链接时候，发生链接和运行错误。

```lua
package("foo")
    add_deps("bar", "zoo")
    set_policy("package.librarydeps.strict_compatibility", true)
```

例如，如果 bar 或者 zoo 的版本有更新，那么 foo 也会重新编译安装。

### package.strict_compatibility

默认禁用，如果启用它，那么当前包和其他所有依赖它的包之间会保持严格的兼容性，这个包的版本更新，都会强制触发其他父包的重新编译安装。

以确保所有的包都是二进制兼容的，不会因为某个依赖包接口改动，导致和其他已被安装的其他包一起链接时候，发生链接和运行错误。


```lua
package("foo")
    set_policy("package.strict_compatibility", true)

package("bar")
    add_deps("foo")

package("zoo")
    add_deps("foo")
```

例如，如果 foo 的版本有更新，那么 bar 和 zoo 都会被强制重新编译安装。

### package.install_always

每次运行 `xmake f -c` 重新配置的时候，总是会重新安装包，这对于本地第三方源码包集成时候比较有用。

因为，用户可能随时需要修改第三方源码，然后重新编译集成它们。

之前只能通过每次修改包版本号，来触发重新编译，但是有了这个策略，就能每次都会触发重编。

```lua
add_rules("mode.debug", "mode.release")

package("foo")
    add_deps("cmake")
    set_sourcedir(path.join(os.scriptdir(), "foo"))
    set_policy("package.install_always", true)
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

### package.download.http_headers

设置包下载的 http headers

如果有些包的 url 下载，需要设置特定 http headers，才能通过下载，可以通过这个策略来指定。

```lua
package("xxx")
    set_policy("package.download.http_headers", "TEST1: foo", "TEST2: bar")
```

我们也可以设置指定的 urls 的 http headers：

```lua
add_urls("https://github.com/madler/zlib/archive/$(version).tar.gz", {
    http_headers = {"TEST1: foo", "TEST2: bar"}
})
```

### windows.manifest.uac

通过这个策略，我们可以快速方便的设置并启用 Windows UAC。

它支持以下几个 Level：

| Level | Flag |
| --- | --- |
| invoker | asInvoker |
| admin | requireAdministrator |
| highest | highestAvailable |

例如：

```lua
set_policy("windows.manifest.uac", "admin")
```

它等价于设置

```lua
if is_plat("windows") then
    add_ldflags("/MANIFEST", {"/MANIFESTUAC:level='requireAdministrator' uiAccess='false'"}, {force = true, expand = false})
end
```

但是更加方便简洁，并且不需要判断平台，其他平台自动忽略。

### windows.manifest.uac.ui

设置 Windows UAC 的 uiAccess，如果没有设置它，默认是 false。

```lua
set_policy("windows.manifest.uac.ui", true)
```
