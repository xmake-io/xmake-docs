---
title: Xmake v2.8.5 released, Support for link sorting and unit testing
tags: [xmake, lua, C/C++, package, performance, API, rust]
date: 2023-11-05
author: Ruki
---

[Xmake](https://github.com/xmake-io/xmake) is a lightweight cross-platform build utility based on Lua.

It is very lightweight and has no dependencies because it has a built-in Lua runtime.

It uses xmake.lua to maintain project builds and its configuration syntax is very simple and readable.

We can use it to build project directly like Make/Ninja, or generate project files like CMake/Meson, and it also has a built-in package management system to help users solve the integrated use of C/C++ dependent libraries.

```
Xmake = Build backend + Project Generator + Package Manager + [Remote|Distributed] Build + Cache
```

Although not very precise, we can still understand Xmake in the following way:

```
Xmake ≈ Make/Ninja + CMake/Meson + Vcpkg/Conan + distcc + ccache/sccache
```

* [Github](https://github.com/xmake-io/xmake)
* [Document](https://xmake.io/)

<img src="https://github.com/xmake-io/xmake-docs/raw/master/assets/img/index/package.gif" width="650px" />

## Introduction of new features

Before introducing new features, we have good news to tell you that Xmake has recently entered Debian's official repository: [https://packages.debian.org/sid/xmake](https://packages.debian.org/ sid/xmake),
When Ubuntu 24.04 is released in April next year, we should be able to quickly install Xmake directly through the `apt install xmake` command.

I would also like to thank @Lance Lin for his help. He helped us maintain and upload the Xmake package to the Debian repository throughout the whole process. Thank you very much!

Next, let’s introduce some changes introduced in version 2.8.5. This version brings many new features, especially support for link sorting, link groups, and support for `xmake test` built-in unit tests.
In addition, we have also added build support for the Apple XROS platform, which can be used to build programs on Apple's new VisionOS. We also provide a more flexible and versatile `check_sizeof` detection interface for quickly detecting the size of types.

### Link reordering support

This is a requirement that has existed for more than two years and is mainly used to adjust the link order within the target.

Since xmake provides `add_links`, `add_deps`, `add_packages`, `add_options` interfaces, you can configure links in targets, dependencies, packages and options, although the link order of `add_links` itself can be adjusted according to the order of addition.

However, the link order between links, deps and packages can only be generated in a fixed order and cannot be adjusted flexibly. This is a bit inadequate for some complex projects.

In this version, we have completely solved this problem and added the `add_linkorders` interface, which can be used to configure various link orders introduced by targets, dependencies, packages, options, and link groups.

For more details and background, see: [#1452](https://github.com/xmake-io/xmake/issues/1452)

#### Sort links

In order to more flexibly adjust the various link orders within the target, we can implement it through the new interface `add_linkorders`, for example:

```lua
add_links("a", "b", "c", "d", "e")
-- e -> b -> a
add_linkorders("e", "b", "a")
--e->d
add_linkorders("e", "d")
```

add_links is the configured initial link order, and then we configure two local link dependencies `e -> b -> a` and `e -> d` through add_linkorders.

xmake will internally generate a DAG graph based on these configurations, and use topological sorting to generate the final link sequence and provide it to the linker.

Of course, if there is a circular dependency and a cycle is created, it will also provide warning information.

#### Sorting links and link groups

In addition, we can also solve the problem of circular dependencies by configuring link groups through `add_linkgroups`.

And `add_linkorders` can also sort link groups.

```lua
add_links("a", "b", "c", "d", "e")
add_linkgroups("c", "d", {name = "foo", group = true})
add_linkorders("e", "linkgroup::foo")
```

If we want to sort link groups, we need to give each link group a name, `{name = "foo"}`, and then we can reference the configuration through `linkgroup::foo` in `add_linkorders`.

#### Sort links and frameworks

We can also sort links and frameworks for macOS/iPhoneOS.

```lua
add_links("a", "b", "c", "d", "e")
add_frameworks("Foundation", "CoreFoundation")
add_linkorders("e", "framework::CoreFoundation")
```









#### Complete example

For a complete example, we can look at:

```lua
add_rules("mode.debug", "mode.release")

add_requires("libpng")

target("bar")
     set_kind("shared")
     add_files("src/foo.cpp")
     add_linkgroups("m", "pthread", {whole = true})

target("foo")
     set_kind("static")
     add_files("src/foo.cpp")
     add_packages("libpng", {public = true})

target("demo")
     set_kind("binary")
     add_deps("foo")
     add_files("src/main.cpp")
     if is_plat("linux", "macosx") then
         add_syslinks("pthread", "m", "dl")
     end
     if is_plat("macosx") then
         add_frameworks("Foundation", "CoreFoundation")
     end
     add_linkorders("framework::Foundation", "png16", "foo")
     add_linkorders("dl", "linkgroup::syslib")
     add_linkgroups("m", "pthread", {name = "syslib", group = true})
```

The complete project is at: [linkorders example](https://github.com/xmake-io/xmake/blob/master/tests/projects/c%2B%2B/linkorders/xmake.lua)

### Link group support

In addition, in this version, we have also added native support for the link group, which is currently mainly used for compilation on the Linux platform and only supports the gcc/clang compiler.

It should be noted that the concept of link group in gcc/clang mainly refers to: `-Wl,--start-group`

Xmake is aligned and encapsulated, further abstracted, and not only used to process `-Wl,--start-group`, but also `-Wl,--whole-archive` and `-Wl,-Bstatic` .

Below we will explain them one by one.

For more details, see: [#1452](https://github.com/xmake-io/xmake/issues/1452)

#### --start-group support

`-Wl,--start-group` and `-Wl,--end-group` are linker options for handling complex library dependencies, ensuring that the linker can resolve symbolic dependencies and successfully connect multiple libraries.

In xmake, we can achieve this in the following way:

```lua
add_linkgroups("a", "b", {group = true})
```

It will generate the corresponding `-Wl,--start-group -la -lb -Wl,--end-group` link options.

If there is a symbolic circular dependency between libraries a and b, no link error will be reported and the link can be successful.

For unsupported platforms and compilations, it will fall back to `-la -lb`

#### --whole-archive support

`--whole-archive` is a linker option commonly used when dealing with static libraries.
Its function is to tell the linker to include all object files in the specified static library into the final executable file, not just the object files that satisfy the current symbol dependencies.
This can be used to ensure that all code for certain libraries is linked, even if they are not directly referenced in the current symbol dependencies.

For more information, please refer to the gcc/clang documentation.

In xmake, we can achieve this in the following way:

```lua
add_linkgroups("a", "b", {whole = true})
```

It will generate the corresponding `-Wl,--whole-archive -la -lb -Wl,--no-whole-archive` link options.

For unsupported platforms and compilations, it will fall back to `-la -lb`

Additionally, we can configure group/whole at the same time:

```lua
add_linkgroups("a", "b", {whole = true, group = true})
```

#### -Bstatic support

`-Bstatic` is also an option for compilers (such as gcc) to instruct the compiler to use only static libraries and not shared libraries when linking.

For more information, please refer to the gcc/clang documentation.

In xmake, we can achieve this in the following way:

```lua
add_linkgroups("a", "b", {static = true})
```

It will generate the corresponding `-Wl,-Bstatic -la -lb -Wl,-Bdynamic` linkage options.

### Unit testing support

In the new version, we have also added a built-in test command: `xmake test`. We only need to configure some test cases through add_tests on the target that needs to be tested to automatically execute the test.

Even if the current target is set to `set_default(false)`, when executing tests, xmake will still automatically compile them first, and then automatically run all tests.

We can first look at an overall example to get a rough idea of what it looks like.

```lua
add_rules("mode.debug", "mode.release")

for _, file in ipairs(os.files("src/test_*.cpp")) do
     local name = path.basename(file)
     target(name)
         set_kind("binary")
         set_default(false)
         add_files("src/" .. name .. ".cpp")
         add_tests("default")
         add_tests("args", {runargs = {"foo", "bar"}})
         add_tests("pass_output", {trim_output = true, runargs = "foo", pass_outputs = "hello foo"})
         add_tests("fail_output", {fail_outputs = {"hello2 .*", "hello xmake"}})
end
```

This example automatically scans the `test_*.cpp` source files in the source code directory, and then automatically creates a test target for each file. It is set to `set_default(false)`, which means that under normal circumstances, it will not be compiled by default. they.

However, if you execute `xmake test` for testing, they will be automatically compiled and then tested. The running effect is as follows:

```bash
ruki-2:test ruki$ xmake test
running tests...
[2%]: test_1/args .................................. passed 7.000s
[5%]: test_1/default     .................................... passed 5.000s
[  8%]: test_1/fail_output .................................... passed 5.000s
[ 11%]: test_1/pass_output .................................... passed 6.000s
[ 13%]: test_2/args        .................................... passed 7.000s
[ 16%]: test_2/default     .................................... passed 6.000s
[ 19%]: test_2/fail_output .................................... passed 6.000s
[ 22%]: test_2/pass_output .................................... passed 6.000s
[ 25%]: test_3/args        .................................... passed 7.000s
[ 27%]: test_3/default     .................................... passed 7.000s
[ 30%]: test_3/fail_output .................................... passed 6.000s
[ 33%]: test_3/pass_output .................................... passed 6.000s
[ 36%]: test_4/args        .................................... passed 6.000s
[ 38%]: test_4/default     .................................... passed 6.000s
[ 41%]: test_4/fail_output .................................... passed 5.000s
[ 44%]: test_4/pass_output .................................... passed 6.000s
[ 47%]: test_5/args        .................................... passed 5.000s
[ 50%]: test_5/default     .................................... passed 6.000s
[ 52%]: test_5/fail_output .................................... failed 6.000s
[ 55%]: test_5/pass_output .................................... failed 5.000s
[ 58%]: test_6/args        .................................... passed 7.000s
[ 61%]: test_6/default     .................................... passed 6.000s
[ 63%]: test_6/fail_output .................................... passed 6.000s
[ 66%]: test_6/pass_output .................................... passed 6.000s
[ 69%]: test_7/args        .................................... failed 6.000s
[ 72%]: test_7/default     .................................... failed 7.000s
[ 75%]: test_7/fail_output .................................... failed 6.000s
[ 77%]: test_7/pass_output .................................... failed 5.000s
[ 80%]: test_8/args        .................................... passed 7.000s
[ 83%]: test_8/default     .................................... passed 6.000s
[ 86%]: test_8/fail_output .................................... passed 6.000s
[ 88%]: test_8/pass_output .................................... failed 5.000s
[ 91%]: test_9/args        .................................... passed 6.000s
[ 94%]: test_9/default     .................................... passed 6.000s
[ 97%]: test_9/fail_output .................................... passed 6.000s
[100%]: test_9/pass_output .................................... passed 6.000s

80% tests passed, 7 tests failed out of 36, spent 0.242s
```

![](/assets/img/manual/xmake-test1.png)

我们也可以执行 `xmake test -vD` 查看详细的测试失败的错误信息：

![](/assets/img/manual/xmake-test2.png)

#### 运行指定测试目标

我们也可以指定运行指定 target 的某个测试：

```bash
$ xmake test targetname/testname
```

或者按模式匹配的方式，运行一个 target 的所有测试，或者一批测试：

```bash
$ xmake test targetname/*
$ xmake test targetname/foo*
```

也可以运行所有 target 的同名测试：

```bash
$ xmake test */testname
```

#### 并行化运行测试

其实，默认就是并行化运行的，但是我们可以通过 `-jN` 调整运行的并行度。

```bash
$ xmake test -jN
```

#### 分组运行测试

```bash
$ xmake test -g "foo"
$ xmake test -g "foo*"
```

#### 添加测试到目标（无参数）

如果没有配置任何参数，仅仅配置了测试名到 `add_tests`，那么仅仅测试这个目标程序的是否会运行失败，根据退出代码来判断是否通过测试。

```
target("test")
    add_tests("testname")
```

#### 配置运行参数

我们也可以通过 `{runargs = {"arg1", "arg2"}}` 的方式，给 `add_tests` 配置指定测试需要运行的参数。

另外，一个 target 可以同时配置多个测试用例，每个测试用例可独立运行，互不冲突。

```lua
target("test")
    add_tests("testname", {runargs = "arg1"})
    add_tests("testname", {runargs = {"arg1", "arg2"}})
```

如果我们没有配置 runargs 到 `add_tests`，那么我们也会尝试从被绑定的 target 中，获取 `set_runargs` 设置的运行参数。

```lua
target("test")
    add_tests("testname")
    set_runargs("arg1", "arg2")
```

#### 配置运行目录

我们也可以通过 rundir 设置测试运行的当前工作目录，例如：

```lua
target("test")
    add_tests("testname", {rundir = os.projectdir()})
```

如果我们没有配置 rundir 到 `add_tests`，那么我们也会尝试从被绑定的 target 中，获取 `set_rundir` 设置的运行目录。

```lua
target("test")
    add_tests("testname")
    set_rundir("$(projectdir)")
```

#### 配置运行环境

我们也可以通过 runenvs 设置一些运行时候的环境变量，例如：

```lua
target("test")
    add_tests("testname", {runenvs = {LD_LIBRARY_PATH = "/lib"}})
```

如果我们没有配置 runenvs 到 `add_tests`，那么我们也会尝试从被绑定的 target 中，获取 `add_runenvs` 设置的运行环境。

```lua
target("test")
    add_tests("testname")
    add_runenvs("LD_LIBRARY_PATH", "/lib")
```

#### 匹配输出结果

默认情况下，`xmake test` 会根据测试运行的退出代码是否为 0，来判断是否测试通过。

当然，我们也可以通过配置测试运行的输出结果是否满足我们的指定的匹配模式，来判断是否测试通过。

主要通过这两个参数控制：

| 参数 | 说明 |
| --- | --- |
| pass_outputs | 如果输出匹配，则测试通过 |
| fail_outputs | 如果输出匹配，则测试失败 |

传入 `pass_outputs` 和 `fail_outputs` 的是一个 lua 匹配模式的列表，但模式稍微做了一些简化，比如对 `*` 的处理。

如果要匹配成功，则测试通过，可以这么配置：

```lua
target("test")
    add_tests("testname1", {pass_outputs = "hello"})
    add_tests("testname2", {pass_outputs = "hello *"})
    add_tests("testname3", {pass_outputs = {"hello", "hello *"}})
```If the match is successful, the test fails. You can configure it like this:

```lua
target("test")
     add_tests("testname1", {fail_outputs = "hello"})
     add_tests("testname2", {fail_outputs = "hello *"})
     add_tests("testname3", {fail_outputs = {"hello", "hello *"}})
```

We can also configure them simultaneously:

```lua
target("test")
     add_tests("testname", {pass_outputs = "foo", fail_outputs = "hello"})
```

Since some test output results will have some newline or other blank characters at the end, which interferes with the matching mode, we can configure `trim_output = true` to truncate the blank characters before matching.

```lua
target("test")
     add_tests("testname", {trim_output = true, pass_outputs = "foo", fail_outputs = "hello"})
```

We can also configure `{plain = true}` to disable lua pattern matching and only do the most basic flat text matching.

```lua
target("test")
     add_tests("testname", {plain = true, pass_outputs = "foo", fail_outputs = "hello"})
```

#### Configure test group

We can also configure a test group through `group = "foo"` for group testing:

```lua
target("test")
     add_tests("testname1", {group = "foo"})
     add_tests("testname2", {group = "foo"})
     add_tests("testname3", {group = "bar"})
     add_tests("testname4", {group = "bae"})
```

Where testname1/testname2 is a group foo, and the other two are in another group.

Then, we can use `xmake test -g groupname` to perform group testing.

```bash
$ xmake test -g "foo"
$ xmake test -g "foo*"
```

:::NOTE
Running grouping also supports pattern matching.
:::

In addition, if the `group` parameter is not set to `add_tests`, we can also get the group name bound to the target by default.

```lua
target("test")
     add_tests("testname")
     set_group("foo")
```

#### Custom test script

We have also added `before_test`, `on_test` and `after_test` configuration scripts. Users can customize them in the rule and target fields to implement customized test execution.

```lua
target("test")
      on_test(function (target, opt)
         print(opt.name, opt.runenvs, opt.runargs, opt.pass_outputs)

         -- do test
         --...

         -- passed
         return true

         -- failed
         return false, errors
      end)
```

Among them, all parameters passed into `add_tests` can be obtained in opt. We customize the test logic in on_test, and then return true to indicate that the test passed, return false to indicate that the test failed, and then continue to return the error message of test failure.


#### Automated build

Since the test target usually does not need to be built during the normal development build phase, we will set `set_default(false)`.

```lua
target("test")
     add_tests("testname")
     set_default(false)
```

However, when running `xmake test` for testing, the targets corresponding to these tests will still be automatically built to ensure that they can be run.

```bash
$ xmake test
[25%]: cache compiling.release src/main.cpp
[50%]: linking.release test
running tests...
[100%]: test/testname ............................. passed 6.000s

100% tests passed, 0 tests failed out of 1, spent 0.006s
```

#### Terminate if the first test fails

By default, `xmake test` will wait until all tests have been run, no matter how many of them failed.

Sometimes, we want to interrupt the test directly if the first test fails, then we can enable it through the following configuration:

```lua
set_policy("test.return_zero_on_failure", true)
```

#### If the test fails, return 0

By default, as long as a test fails, it will return a non-zero exit code when `xmake test` is completed. This is very useful for some CI environments and can interrupt other CI scripts to continue running.

Then the trigger signal tells CI that we need to generate test reports and alarms.

Then, if we want to suppress this behavior, we can force the exit code of `xmake test` to always be set to 0.

```lua
set_policy("test.return_zero_on_failure", true)
```

#### Just test compilation

Sometimes, we just want to test whether the code compiles or fails without running them. This can be achieved by configuring `build_should_pass` and `build_should_fail`.

```lua
target("test_10")
     set_kind("binary")
     set_default(false)
     add_files("src/compile.cpp")
     add_tests("compile_fail", {build_should_fail = true})

target("test_11")
     set_kind("binary")
     set_default(false)
     add_files("src/compile.cpp")
     add_tests("compile_pass", {build_should_pass = true})
```

This is usually used in scenarios with `static_assert` in some test code, for example:

```c++
template <typename T>
bool foo(T val) {
   if constexpr (std::is_same_v<T, int>) {
     printf("int!\n");
   } else if constexpr (std::is_same_v<T, float>) {
     printf("float!\n");
   } else {
     static_assert(false, "unsupported type");
   }
}

int main(int, char**) {
   foo("BAD");
   return 0;
}
```

#### Configure additional code compilation

When configuring test cases, we can also configure additional code that needs to be compiled for each test, as well as some macro definitions to implement inline testing.

xmake will compile an independent executable program for each test to run it, but this will not affect the compilation results of the target in the production environment.

```lua
target("test_13")
     set_kind("binary")
     set_default(false)
     add_files("src/test_1.cpp")
     add_tests("stub_1", {files = "tests/stub_1.cpp", defines = "STUB_1"})

target("test_14")
     set_kind("binary")
     set_default(false)
     add_files("src/test_2.cpp")
     add_tests("stub_2", {files = "tests/stub_2.cpp", defines = "STUB_2"})

target("test_15")
     set_kind("binary")
     set_default(false)
     add_files("src/test_1.cpp")
     add_tests("stub_n", {files = "tests/stub_n*.cpp", defines = "STUB_N"})
```

Taking doctest as an example, we can externally unit test without modifying any main.cpp:

```lua
add_rules("mode.debug", "mode.release")

add_requires("doctest")

target("doctest")
     set_kind("binary")
     add_files("src/*.cpp")
     for _, testfile in ipairs(os.files("tests/*.cpp")) do
         add_tests(path.basename(testfile), {
             files = testfile,
             remove_files = "src/main.cpp",
             languages = "c++11",
             packages = "doctest",
             defines = "DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN"})
     end
```

Defining DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN will introduce additional main entry function, so we need to configure remove_files to remove the existing main.cpp file.

The running effect is as follows:

```bash
ruki-2:doctest ruki$ xmake test
running tests...
[50%]: doctest/test_1 ........................ failed 0.009s
[100%]: doctest/test_2 ........................ passed 0.009s

50% tests passed, 1 tests failed out of 2, spent 0.019s
ruki-2:doctest ruki$ xmake test -v
running tests...
[50%]: doctest/test_1....................... failed 0.026s
[doctest] doctest version is "2.4.11"
[doctest] run with "--help" for options
================================================== =============================
tests/test_1.cpp:7:
TEST CASE: testing the factorial function

tests/test_1.cpp:8: ERROR: CHECK( factorial(1) == 10 ) is NOT correct!
   values: CHECK( 1 == 10 )

================================================== =============================
[doctest] test cases: 1 | 0 passed | 1 failed | 0 skipped
[doctest] assertions: 4 | 3 passed | 1 failed |
[doctest] Status: FAILURE!

run failed, exit code: 1
[100%]: doctest/test_2 ........................ passed 0.010s

50% tests passed, 1 tests failed out of 2, spent 0.038s
```

#### Test dynamic library

Usually, `add_tests` is only used to run tests on executable programs. Running dynamic libraries requires an additional main entry, so we need to configure an additional executable program to load it, for example:

```lua

target("doctest_shared")
     set_kind("shared")
     add_files("src/foo.cpp")
     for _, testfile in ipairs(os.files("tests/*.cpp")) do
         add_tests(path.basename(testfile), {
             kind = "binary",
             files = testfile,
             languages = "c++11",
             packages = "doctest",
             defines = "DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN"})
     end
```

Each unit test can be changed to a binary executable program through `kind = "binary"`, and the main entry function can be introduced through `DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN`.

This enables external runnable unit tests in dynamic library targets.

### Added type size detection

In previous versions, we could implement type detection through `check_csnippets` and `output = true`.

```lua
check_csnippets("INT_SIZE", 'printf("%d", sizeof(int)); return 0;', {output = true, number = true})
```

But this way is to extract the type size information by trying to run the test code, and then getting the running output results.

This does not apply to cross-compilation.

In version 2.8.5, we added the `check_sizeof` auxiliary interface, which can extract type size information by directly parsing the binary file of the test program.

Since there is no need to run tests, this method not only supports cross-compilation, but also greatly improves detection efficiency and is simpler to use.

```lua
includes("@builtin/check")

target("test")
     set_kind("static")
     add_files("*.cpp")
     check_sizeof("LONG_SIZE", "long")
     check_sizeof("STRING_SIZE", "std::string", {includes = "string"})
```

```bash
$ xmake f -c
checking for LONG_SIZE ... 8
checking for STRING_SIZE ... 24
```

Alternatively, I can also check in the script domain via `target:check_sizeof`.

### Added Apple XROS platform

Apple has added build support for visionOS devices in Xcode15, so we also support it as soon as possible. You only need to execute:

```bash
$ xmake f -p applexros
$ xmake
```

This will complete the construction of the visionOS/XROS platform.

### Support code merging

Finally, we also provide a small tool module that can be used to quickly merge all c/c++ and header file source codes in a specified target into a single source file.

A single source code file similar to sqlite3.c will be generated. Users can decide whether to use this function according to their actual needs.

When merging, Xmake will expand all internal includes header files and generate DAG, which will be introduced through topological sorting.

By default it will handle the merging of all targets, for example:

```bash
$ xmake l cli.amalgamate
build/tbox.c generated!
build/tbox.h generated!
```

We can also specify the targets required for the merge:

```bash
$ xmake l cli.amalgamate tbox
build/tbox.c generated!
build/tbox.h generated!
```

You can also specify a custom unique ID macro definition when merging each source file to handle symbol conflicts.

```bash
$ xmake l cli.amalgamate -u MY_UNIQUEU_ID
build/tbox.c generated!
build/tbox.h generated!
```

If there are symbols with the same name in multiple source files, you can determine whether the `MY_UNIQUEU_ID` macro is defined. If it is defined, it means it is in a single file, and you can handle the symbols with the same name in the source code yourself.

```c
#ifdef MY_UNIQUEU_ID
     //do something
#endif
```


We can also specify the output location:

```bash
$ xmake l cli.amalgamate -o /xxx
/xxx/tbox.c generated!
/xxx/tbox.h generated!
```


### Added windows.manifest.uac policy

Through this strategy, we can quickly and easily set up and enable Windows UAC.

It supports the following levels:

- invoker: asInvoker
- admin: requireAdministrator
- highest: highestAvailable

For example:

```lua
set_policy("windows.manifest.uac", "admin")
```

It is equivalent to setting

```lua
if is_plat("windows") then
    add_ldflags("/manifest:embed", {"/manifestuac:level='requireAdministrator' uiAccess='false'"}, {force = true, expand = false})
end
```

But it is more convenient and concise, and there is no need to judge the platform, other platforms are automatically ignored.

We can also set the uiAccess of Windows UAC through the `windows.manifest.uac.ui` policy. If it is not set, the default is false.

```lua
set_policy("windows.manifest.uac.ui", true)
```

## Changelog

### New features

* [#1452](https://github.com/xmake-io/xmake/issues/1452): Improve link mechanism and order
* [#1438](https://github.com/xmake-io/xmake/issues/1438): Support code amalgamation
* [#3381](https://github.com/xmake-io/xmake/issues/3381): Add `xmake test` support
* [#4276](https://github.com/xmake-io/xmake/issues/4276): Support custom scope api
* [#4286](https://github.com/xmake-io/xmake/pull/4286): Add Apple XROS support
* [#4345](https://github.com/xmake-io/xmake/issues/4345): Support check sizeof
* [#4369](https://github.com/xmake-io/xmake/pull/4369): Add windows.manifest.uac policy

### Changes

* [#4284](https://github.com/xmake-io/xmake/issues/4284): Improve builtin includes

### Bugs fixed

* [#4256](https://github.com/xmake-io/xmake/issues/4256): Fix intellisense for vsxmake/c++modules