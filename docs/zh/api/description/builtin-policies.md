# 内置策略 <Badge type="tip" text="v2.3.4" /> {#builtin-policies}

Xmake 有很多的默认行为，比如：自动检测和映射编译、链接标志、跨工程目标并行构建等，虽然提供了一定的智能化处理，但重口难调，不一定能满足所有的用户的使用习惯和需求。
因此， xmake 提供了**针对默认策略的修改设置**，在一定程度上给予了用户**修改策略**的权限。这个功能主要通过 [set_policy](/zh/api/description/project-target#set-policy) 接口来实现，我们通常可以使用这个接口来配置修改 target, package 以及工程整体的一些行为策略。

## 使用方式 {#usage}

::: tip 注意
如果设置的策略名是无效的， xmake 会有警告提示。
:::

### 1. 获取当前版本所支持的所有策略 {#_1-get-all-the-policies-supported-by-the-current-version}

执行下面的命令可以返回所有的配置及其描述、值类型和默认值：

```sh
$ xmake l core.project.policy.policies
```

### 2. 在 `xmake.lua` 中直接调用接口进行策略的配置 {#_2-configuring-policies-in-xmake-lua}

::: code-group
```lua [全局设置]
-- 在项目根域设置这个配置，就可以全局禁用 flags 的自动检测和忽略机制
set_policy("check.auto_ignore_flags", false)
```

```lua [局部设置]
target("test")
    -- 针对特定的 target `test` 生效
    set_policy("check.auto_ignore_flags", false)
```
:::

### 3. 通过命令行进行策略的配置 {#_3-configuring-policies-via-the-command-line}

当我们构建工程时，可能需要暂时性地启用或是禁用一些策略。在这种情况下，使用命令行就更加贴合需求了。使用命令行设置策略时，默认该策略为启用状态：

```sh
$ xmake f --policies=package.fetch_only
```

当然，我们也可以指定其他值以达到禁用等效果：

```sh
$ xmake f --policies=package.precompiled:n
```

值得注意的是，同时配置多个策略需要用逗号进行分割：

```sh
$ xmake f --policies=package.precompiled:n,package.install_only
```

## check.auto_ignore_flags <Badge type="tip" text="v2.3.4" />

::: danger 潜在风险
强行禁用自动检测和忽略标志的默认策略可能会导致其他用户在编译时由于编译器的支持力度不同，从而出现一定程度的编译失败。
:::

### 默认策略 {#default-policy}
xmake 默认会对所有通过 `add_cxflags`, `add_ldflags` 等接口添加的原始编译和链接标志进行自动检测。如果检测出当前编译器和链接器不支持某些标志，就会自动忽略并弹出警告信息。

这种自动忽略的策略通常是很有用的，尤其是在处理一些可选的编译标志时，即使编译器不支持也能正常编译。

### 潜在需求 {#use-cases}

由于自动检测在某些情况下会有一定程度的误判（尤其是针对交叉编译工具链，更容易出现检测失败，导致编译失败），而且自动忽略的同时会产生警告提示，所以某些用户并不喜欢这个设定。

例如，如果标志检测失败，就会有警告提示用户：

```sh
warning: add_ldflags("-static") is ignored, please pass `{force = true}` or call `set_policy("check.auto_ignore_flags", false)` if you want to set it.
```

根据警告提示，我们可以自己分析判断是否需要强制添加这个标志。我们可以根据 flag 的数量来选择以下两种方案：

#### 1. 添加 force 参数 {#_1-add-the-force-parameter}
```lua
add_ldflags("-static", {force = true})
```

`{force = true}` 参数可以显式地强制添加标志并跳过自动检测，这对于**个别**的检测失败是**有效快捷**的处理方式，但是对于交叉编译，**大量**的标志检测不通过的情况下，每个都设置 force 参数过于**繁琐**。

#### 2. 配置策略 {#_2-set-the-policy}
针对方案一中的局限性，我们可以使用 `set_policy` 直接禁用对某个目标或者整个项目默认的标志自动检测和忽略行为，从而达到没有额外警告信息出现的效果：

```lua
set_policy("check.auto_ignore_flags", false)
target("test")
    add_ldflags("-static")
```

## check.auto_map_flags <Badge type="tip" text="v2.3.4" />

::: tip 注意
目前的自动映射实现还不是很完整，没有 100% 覆盖所有 gcc 的标志，所以还是有部分标志是无法去映射的。
:::

### 默认策略 {#default-policy-1}
这是 xmake 的另外一个对标志的智能分析处理。通常情况下，通过 `add_links`, `add_defines` 这种 xmake 内置的 API 去设置的配置是具有跨平台特性的。针对不同的编译器平台， xmake 会自动处理成对应的原始标志。

但是有些情况下，用户还是会通过 `add_cxflags`, `add_ldflags` 等接口设置原始的编译链接标志。这些 API 接收原始标志为参数，但部分标志本身并不是被所有的编译器支持的。

例如 `-O0` 这个编译优化标志。虽然有 `set_optimize` 来实现跨编译器配置，但如果用户可能会直接使用 `add_cxflags("-O0")` 。这种情况下， gcc/clang 下可以正常处理，但是 msvc 下就不支持它了。

因此， xmake 内置了标志的自动映射功能：基于 gcc 编译标志的普及性， xmake 采用 gcc 的标志命名规范，针对不同的编译器对其进行自动映射，例如：

```lua
add_cxflags("-O0")
```

这一行设置，在 gcc/clang 编译器下还是 `-O0` ，但针对 msvc 编译器， xmake 就会自动将其映射为 msvc 中对应的 `-Od` 编译标志来禁用优化。整个过程，用户是完全无感知的，直接执行 xmake 就可以跨编译器完成标志的映射和编译。

### 用法 {#usage-1}

也有部分用户并不喜欢这种自动映射行为，那么我们可以通过下面的设置完全禁用这个默认的行为：

```lua
set_policy("check.auto_map_flags", false)
```

## check.target_package_licenses <Badge type="tip" text="v2.3.9" />

### 默认策略 {#default-policy-2}
在软件开发过程中引入开源软件作为第三方依赖，可以有效避免“重造轮子”。我们应当**尊重并认可**其他开发者的劳动成果，**遵守**相应的开源许可证。为了帮助开发者发现潜在的**许可证冲突等风险**， xmake 默认会对项目和引入依赖的许可证进行**兼容性检查**。

### 用法 {#usage-2}
这个策略主要用于辅助用户发现潜在的许可证合规问题，起一个提醒的作用。在某些学习或特定场景下，如果用户希望暂时屏蔽检测产生的冲突警告，可以通过以下设置禁用许可证兼容性检测并去除警告信息：

```lua
set_policy("check.target_package_licenses", false)
```

## build.across_targets_in_parallel <Badge type="tip" text="v2.3.4" />

这个策略也是默认开启的，主要用于跨target间执行并行构建，v2.3.3之前的版本，并行构建只能针对单个target内部的所有源文件，
跨target的编译，必须要要等先前的target完全link成功，才能执行下一个target的编译，这在一定程度上会影响编译速度。

然而每个target的源文件是可以完全并行化处理的，最终在一起执行link过程，v2.3.3之后的版本通过这个优化，构建速度提升了30%。

当然，如果有些特殊的target里面的构建源文件要依赖先前的target（尤其是一些自定义rules的情况，虽然很少遇到），我们也可以通过下面的设置禁用这个优化行为：

```sh
set_policy("build.across_targets_in_parallel", false)
```

## build.fence <Badge type="tip" text="v2.9.2" />

由于配置 `set_policy("build.across_targets_in_parallel", false)` 存在局限性，它会限制父 target 和它的所有依赖的子 target 之间的并行度，影响的范围有点大。

而我们做 codegen 时候，有时候仅仅只是想对其中某个依赖的 target 限制并行度，作为 codegen 程序，提前让它完成编译。

这个时候，`build.across_targets_in_parallel` 就无法精细控制了，编译速度也无法达到最优。

因此，我们新增了 `build.fence` 策略，它可以仅仅只针对特定的子 target 限制并行编译链接。

相关的背景细节，可以看下：[#5003](https://github.com/xmake-io/xmake/issues/5003)

例如：

```lua
target("autogen")
    set_default(false)
    set_kind("binary")
    set_plat(os.host())
    set_arch(os.arch())
    add_files("src/autogen.cpp")
    set_languages("c++11")
    set_policy("build.fence", true)

target("test")
    set_kind("binary")
    add_deps("autogen")
    add_rules("autogen")
    add_files("src/main.cpp")
    add_files("src/*.in")
```

其中 autogen 目标程序需要在 test 程序的源码被编译前，就要完成编译链接，因为 test 目标需要运行 autogen 程序，去动态生成一些源码参与编译。

而针对 autogen 配置 `set_policy("build.fence", true)` 就可以实现这个目的。

## build.merge_archive <Badge type="tip" text="v2.5.8" />

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


## build.ccache <Badge type="tip" text="v2.6.7" />

Xmake 默认是开启内置的编译缓存的，通过设置这个策略，可以显式禁用缓存。

```lua
set_policy("build.ccache", false)
```

当然，我们也可以命令行去禁用它。

```sh
$ xmake f --ccache=n
```

或者

```sh
$ xmake f --policies=build.ccache:n
```

## build.warning <Badge type="tip" text="v2.6.8" />

默认编译通常不会实时回显警告输出，我们通常需要使用 `xmake -w` 开启，或者通过 `xmake g --build_warning=y` 来全局开启它。

现在，我们也可以在 xmake.lua 配置中去默认启用警告回显输出。

```lua
set_policy("build.warning", true)
set_warnings("all", "extra")
```

这个时候，即使我们执行 `xmake` 命令，也能直接回显警告输出。

## build.optimization.lto <Badge type="tip" text="v2.6.9" />

2.6.9 版本 xmake 改进了对 LTO 链接时优化的支持，对 gcc/clang/msvc 等不同平台下都进行了适配，只需要启用这个策略，就能对特定 target 开启 LTO。

```lua
set_policy("build.optimization.lto", true)
```

我们也可以通过命令行选项快速开启。

```sh
$ xmake f --policies=build.optimization.lto
```

## build.cuda.devlink <Badge type="tip" text="v2.7.7" />

2.7.7 版本可以通过这个配置，显示开启对特定目标的设备链接。

这通常用于 Cuda 项目的构建，以及非 Cuda binary/shared 依赖 Cuda static 目标的情况，这个时候，Cuda static 目标就需要显示配置这个，开启设备链接。

```lua
target("test")
    set_kind("static")
    set_policy("build.cuda.devlink", true)
```

而默认 Cuda binary/shared 是开启 devlink 的，我们也可以通过策略显示禁用它。

关于这个的详细背景说明，见：[#1976](https://github.com/xmake-io/xmake/issues/1976)

## build.sanitizer.address <Badge type="tip" text="v2.8.3" />

Address Sanitizer（ASan）是一个快速的内存错误检测工具，由编译器内置支持，通常我们需要在编译和链接的 flags 中同时配置 `-fsanitize-address` 才能正确开启。

而我们可以通过开启这个策略，就可以快速全局启用它，这会使得编译出来的程序，直接支持 ASan 检测。

例如，我们可以通过命令行的方式去启用：

```sh
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

::: tip 注意
`add_rules("mode.asan", "mode.tsan", "mode.ubsan", "mode.msan")` 将被废弃，尽可能使用这些新的策略，因为这些构建模式无法同步对依赖包生效。
:::

另外，我们也可以同时生效多个 sanitizer 检测，例如：


```lua
set_policy("build.sanitizer.address", true)
set_policy("build.sanitizer.undefined", true)
```

或者

```
$ xmake f --policies=build.sanitizer.address,build.sanitizer.undefined
```

## build.sanitizer.thread <Badge type="tip" text="v2.8.3" />

与 [build.sanitizer.address](#build-sanitizer-address) 类似，用于检测线程安全问题。

## build.sanitizer.memory <Badge type="tip" text="v2.8.3" />

与 [build.sanitizer.address](#build-sanitizer-address) 类似，用于检测内存问题。

## build.sanitizer.leak <Badge type="tip" text="v2.8.3" />

与 [build.sanitizer.address](#build-sanitizer-address) 类似，用于检测内存泄漏问题。

## build.sanitizer.undefined <Badge type="tip" text="v2.8.3" />

与 [build.sanitizer.address](#build-sanitizer-address) 类似，用于检测 undefined 问题。

## build.always_update_configfiles <Badge type="tip" text="v2.8.7" />

这个策略用于对 `add_configfiles` 配置文件的自动生成行为。默认情况下，xmake 仅仅只会在首次 `xmake config` 时候，或者 xmake.lua 配置有改动的是否，才会触发 configfiles 的重新生成。

之后的每次构建，只要配置没有变化，就不会重新生成 configfiles。

但是，如果我们的 configfiles 中有使用 GIT_COMMIT 等变量，想要每次构建时候，总是重新生成最新的配置，那么可以配置它。

具体使用背景，可以看下：[#4747](https://github.com/xmake-io/xmake/issues/4747)

## build.intermediate_directory <Badge type="tip" text="v2.9.4" />

配置启用或禁用构建的内部子目录。

默认情况下，执行 `xmake` 编译项目会自动在 build 目录下根据平台。架构，编译模式生成子目录，分别存储对象文件，目标文件。例如：

```sh
build/
└── macosx
    └── x86_64
        └── release
            └─test
```

如果配置禁用此策略，那么生成的产物将会直接生成到 build 根目录下。变成：

```sh
build/
└─ test
```

## build.rpath <Badge type="tip" text="v2.9.4" />

配置启用或者禁用构建时的 target rpath 设置。

默认情况下，如果 `target(foo)` 依赖动态库 bar，那么生成的 foo 可执行文件会自动加上 bar 的 rpath，这能保证用户直接执行 foo 程序，也能正确找到 bar。

如果你想禁用这个行为，可以显式配置禁用它。

## install.rpath <Badge type="tip" text="v2.9.4" />

尽管构建后的程序，会被设置 rpath，但是当 `xmake install` 安装后，它构建时候的 rpath 就不一定完全适用了，因此 xmake 会自动修改调整 rpath，使得安装后的程序，同样可以找到它的依赖库。

不过前提是，用户自己先得通过 `add_rpathdirs("/xxx", {installonly = true})` 去配置独立的安装 rpath。

而我们也可以通过这个 policy 去禁用默认的安装阶段 rpath 设置行为。

## run.autobuild <Badge type="tip" text="v2.8.3" />

这个策略用于调整 `xmake run` 的行为，默认情况下，执行 `xmake run` 并不会自动构建目标程序，如果程序还没被编译，就是提示用户手动构建一下。

而开启这个策略，我们就可以在运行程序前，先自动构建对应的目标程序。

```sh
$ xmake f --policies=run.autobuild
$ xmake run
```

如果想要全局生效这个策略，可以全局开启它。

```sh
$ xmake g --policies=run.autobuild
```

## preprocessor.linemarkers <Badge type="tip" text="v2.6.8" />

通常用户编译缓存中，预处理器的生成策略，默认开启，如果配置关闭这个策略，那么缓存生成的预处理文件内容将不包含 linemarkers 信息，这会极大减少预处理文件大小。
也会提升缓存的处理效率，但是缺点就是会丢失源码行信息，如果遇到编译错误，将无法看到准确的出错代码行。

## preprocessor.gcc.directives_only <Badge type="tip" text="v2.6.8" />

这也是用于预处理器的策略，默认开启，这会提升 gcc 下编译缓存预处理的效率，但是如果源文件中包含 `__DATE__`, `__TIME__` 等宏，就会导致缓存出现不一致。

因此，可以根据自身工程代码，按需关闭此策略，确保生成的结果一致。

## package.requires_lock <Badge type="tip" text="v2.5.7" />

可用于开启 `add_requires()` 引入的依赖包的版本锁定。

具体看下：[依赖包的锁定和升级](/zh/guide/package-management/using-official-packages#lock-and-upgrade-package)。

## package.precompiled <Badge type="tip" text="v2.6.4" />

可用于禁用 windows 下预编译依赖包的获取。

## package.fetch_only <Badge type="tip" text="v2.6.7" />

如果开启这个策略，那么所有的依赖包仅仅只会从系统获取，不会从远程下载安装。

## package.install_only <Badge type="tip" text="v2.6.7" />

如果开启这个策略，那么所有的依赖包仅仅只会走远程下载安装，不会从系统查找获取。

## package.librarydeps.strict_compatibility <Badge type="tip" text="v2.7.2" />

默认禁用，如果启用它，那么当前包和它的所有库依赖包之间会保持严格的兼容性，任何依赖包的版本更新，都会强制触发当前包的重新编译安装。

以确保所有的包都是二进制兼容的，不会因为某个依赖包接口改动，导致和其他已被安装的其他包一起链接时候，发生链接和运行错误。

```lua
package("foo")
    add_deps("bar", "zoo")
    set_policy("package.librarydeps.strict_compatibility", true)
```

例如，如果 bar 或者 zoo 的版本有更新，那么 foo 也会重新编译安装。

## package.strict_compatibility <Badge type="tip" text="v2.7.2" />

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

## package.install_always <Badge type="tip" text="v2.7.2" />

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

## package.download.http_headers <Badge type="tip" text="v2.7.7" />

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

## windows.manifest.uac <Badge type="tip" text="v2.8.5" />

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
    add_ldflags("/manifest:embed", {"/manifestuac:level='requireAdministrator' uiAccess='false'"}, {force = true, expand = false})
end
```

但是更加方便简洁，并且不需要判断平台，其他平台自动忽略。

## windows.manifest.uac.ui <Badge type="tip" text="v2.8.5" />

设置 Windows UAC 的 uiAccess，如果没有设置它，默认是 false。

```lua
set_policy("windows.manifest.uac.ui", true)
```
