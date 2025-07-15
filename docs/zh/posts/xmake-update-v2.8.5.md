---
title: Xmake v2.8.5 发布，支持链接排序和单元测试
tags: [xmake, lua, C/C++]
date: 2023-11-05
author: Ruki
---

## 新特性介绍

在介绍新特性之前，我们有一个好消息要告诉大家，Xmake 最近进入了 Debian 的官方仓库：[https://packages.debian.org/sid/xmake](https://packages.debian.org/sid/xmake)，
等到明年4月份 Ubuntu 24.04 发布，我们应该就能直接通过 `apt install xmake` 命令去快速安装 Xmake 了。

同时也感谢 @Lance Lin 的帮助，他全程帮助我们维护并上传 Xmake 包到 Debian 仓库，真的非常感谢！

接下来，我们来介绍下 2.8.5 版本引入的一些改动，这个版本带来了很多的新特性，尤其是对链接排序，链接组的支持，还有对 `xmake test` 内置单元测试的支持。
另外，我们还新增了 Apple XROS 平台的构建支持，可以用于构建苹果新的 VisionOS 上的程序，还有我们还提供了更加灵活通用的 `check_sizeof` 检测接口，用于快速检测类型的大小。

### 链接重排序支持

这是一个存在了两年多的需求，主要用于调整 target 内部的链接顺序。

由于 xmake 提供了 `add_links`, `add_deps`, `add_packages`, `add_options` 接口，可以配置目标、依赖，包和选项中的链接，尽管 `add_links` 本身的链接顺序可以根据添加顺序来调整。

但是 links，deps 和 packages 之间的链接顺序，只能按固定顺序生成，无法灵活调整，这对于一些复杂的项目，就有点显得力不从心了。

而我们在这个版本，彻底解决了这个问题，新增了 `add_linkorders` 接口，可用于配置目标、依赖、包、选项、链接组引入的各种链接顺序。

更多详情和背景，请见：[#1452](https://github.com/xmake-io/xmake/issues/1452)

#### 排序链接

为了更加灵活的调整 target 内部的各种链接顺序，我们可以通过 `add_linkorders` 这个新接口来实现，例如：

```lua
add_links("a", "b", "c", "d", "e")
-- e -> b -> a
add_linkorders("e", "b", "a")
-- e -> d
add_linkorders("e", "d")
```

add_links 是配置的初始链接顺序，然后我们通过 add_linkorders 配置了两个局部链接依赖 `e -> b -> a` 和 `e -> d` 后。

xmake 内部就会根据这些配置，生成 DAG 图，通过拓扑排序的方式，生成最终的链接顺序，提供给链接器。

当然，如果存在循环依赖，产生了环，它也会提供警告信息。

#### 排序链接和链接组

另外，对于循环依赖，我们也可以通过 `add_linkgroups` 配置链接组的方式也解决。

并且 `add_linkorders` 也能够对链接组进行排序。

```lua
add_links("a", "b", "c", "d", "e")
add_linkgroups("c", "d", {name = "foo", group = true})
add_linkorders("e", "linkgroup::foo")
```

如果要排序链接组，我们需要对每个链接组取个名，`{name = "foo"}` ，然后就能在 `add_linkorders` 里面通过 `linkgroup::foo` 去引用配置了。

#### 排序链接和frameworks

我们也可以排序链接和 macOS/iPhoneOS 的 frameworks。

```lua
add_links("a", "b", "c", "d", "e")
add_frameworks("Foundation", "CoreFoundation")
add_linkorders("e", "framework::CoreFoundation")
```









#### 完整例子

相关的完整例子，我们可以看下：

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

完整工程在：[linkorders example](https://github.com/xmake-io/xmake/blob/master/tests/projects/c%2B%2B/linkorders/xmake.lua)

### 链接组支持

另外，这个版本，我们还新增了链接组的原生支持，它目前主要用于 linux 平台的编译，仅支持 gcc/clang 编译器。

需要注意的是 gcc/clang 里面的链接组概念主要特指：`-Wl,--start-group`

而 Xmake 对齐进行了封装，做了进一步抽象，并且不仅仅用于处理 `-Wl,--start-group`，还可以处理 `-Wl,--whole-archive` 和 `-Wl,-Bstatic`。

下面我们会一一对其进行讲解。

更多详情见：[#1452](https://github.com/xmake-io/xmake/issues/1452)

#### --start-group 支持

`-Wl,--start-group` 和 `-Wl,--end-group` 是用于处理复杂库依赖关系的链接器选项，确保链接器可以解决符号依赖并成功连接多个库。

在 xmake 中，我们可以通过下面的方式实现：

```lua
add_linkgroups("a", "b", {group = true})
```

它会对应生成 `-Wl,--start-group -la -lb -Wl,--end-group` 链接选项。

如果 a 和 b 库之间有符号的循环依赖，也不会报链接错误，能够正常链接成功。

对于不支持的平台和编译，会退化成 `-la -lb`

#### --whole-archive 支持

`--whole-archive` 是一个链接器选项，通常用于处理静态库。
它的作用是告诉链接器将指定的静态库中的所有目标文件都包含到最终可执行文件中，而不仅仅是满足当前符号依赖的目标文件。
这可以用于确保某些库的所有代码都被链接，即使它们在当前的符号依赖关系中没有直接引用。

更多信息，可以参考 gcc/clang 的文档。

在 xmake 中，我们可以通过下面的方式实现：

```lua
add_linkgroups("a", "b", {whole = true})
```

它会对应生成 `-Wl,--whole-archive -la -lb -Wl,--no-whole-archive` 链接选项。

对于不支持的平台和编译，会退化成 `-la -lb`

另外，我们可以同时配置 group/whole：

```lua
add_linkgroups("a", "b", {whole = true, group = true})
```

#### -Bstatic 支持

`-Bstatic` 也是用于编译器（如gcc）的选项，用于指示编译器在链接时只使用静态库而不使用共享库。

更多信息，可以参考 gcc/clang 的文档。

在 xmake 中，我们可以通过下面的方式实现：

```lua
add_linkgroups("a", "b", {static = true})
```

它会对应生成 `-Wl,-Bstatic -la -lb -Wl,-Bdynamic` 链接选项。

### 单元测试支持

新版本中，我们还增加了一个内置的测试命令：`xmake test`，我们只需要在需要测试的 target 上通过 add_tests 配置一些测试用例，就可以自动执行测试。

即使当前 target 被设置成了 `set_default(false)`，在执行测试的时候，xmake 也还是会先自动编译它们，然后自动运行所有的测试。

我们可以先看个整体的例子，大概知道下它是怎么样子的。

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

这个例子，自动扫描源码目录下的 `test_*.cpp` 源文件，然后每个文件自动创建一个测试目标，它被设置成了 `set_default(false)`，也就是正常情况下，默认不会编译它们。

但是，如果执行 `xmake test` 进行测试，它们就会被自动编译，然后测试运行，运行效果如下：

```bash
ruki-2:test ruki$ xmake test
running tests ...
[  2%]: test_1/args        .................................... passed 7.000s
[  5%]: test_1/default     .................................... passed 5.000s
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
```

如果要匹配成功，则测试失败，可以这么配置：

```lua
target("test")
    add_tests("testname1", {fail_outputs = "hello"})
    add_tests("testname2", {fail_outputs = "hello *"})
    add_tests("testname3", {fail_outputs = {"hello", "hello *"}})
```

我们也可以同时配置它们：

```lua
target("test")
    add_tests("testname", {pass_outputs = "foo", fail_outputs = "hello"})
```

由于一些测试输出的结果，尾部会有一些换行什么的空白字符，干扰匹配模式，我们可以再配置 `trim_output = true`，先截断空白字符后，再做匹配。

```lua
target("test")
    add_tests("testname", {trim_output = true, pass_outputs = "foo", fail_outputs = "hello"})
```

我们还可以配置 `{plain = true}` 是禁用 lua 模式匹配，仅仅做最基础的平坦文本匹配。

```lua
target("test")
    add_tests("testname", {plain = true, pass_outputs = "foo", fail_outputs = "hello"})
```

#### 配置测试组

我们也可以通过 `group = "foo"` 来配置一个测试组，进行分组测试：

```lua
target("test")
    add_tests("testname1", {group = "foo"})
    add_tests("testname2", {group = "foo"})
    add_tests("testname3", {group = "bar"})
    add_tests("testname4", {group = "bae"})
```

其中 testname1/testname2 是一个组 foo，另外两个是在另外一个组。

然后，我们就可以使用 `xmake test -g groupname` 来进行分组测试了。

```bash
$ xmake test -g "foo"
$ xmake test -g "foo*"
```

:::注意
运行分组，也是支持模式匹配的。
:::

另外，如果没有设置 `group` 参数给 `add_tests`，我们也可以默认获取绑定到 target 的组名。

```lua
target("test")
    add_tests("testname")
    set_group("foo")
```

#### 自定义测试脚本

我们还新增了 `before_test`, `on_test` 和 `after_test` 配置脚本，用户可以在 rule 和 target 域，自定义配置它们实现定制化的测试执行。

```lua
target("test")
     on_test(function (target, opt)
        print(opt.name, opt.runenvs, opt.runargs, opt.pass_outputs)

        -- do test
        -- ...

        -- passed
        return true

        -- failied
        return false, errors
     end)
```

其中，opt 里面可以获取到所有传入 `add_tests` 的参数，我们在 on_test 里面自定义测试逻辑，然后返回 true 就是测试通过，返回 false 就是测试失败，然后继续返回测试失败的错误信息。


#### 自动化构建

由于测试目标在正常开发构建阶段，通常是不需要被构建的，因此我们会设置 `set_default(false)`。

```lua
target("test")
    add_tests("testname")
    set_default(false)
```

但是运行 `xmake test` 进行测试时候，这些测试对应的 target 还是会被自动构建，确保能够被运行。

```bash
$ xmake test
[ 25%]: cache compiling.release src/main.cpp
[ 50%]: linking.release test
running tests ...
[100%]: test/testname .................................... passed 6.000s

100% tests passed, 0 tests failed out of 1, spent 0.006s
```

#### 首次测试失败就终止

默认情况下，`xmake test` 会等到所有测试都运行完，不管里面有多少是没通过的。

而有时候，我们想在第一个测试没通过，就直接中断测试，那么我们可以通过下面的配置启用：

```lua
set_policy("test.return_zero_on_failure", true)
```

#### 测试失败返回0

默认情况下，只要有一个测试没通过，等到 `xmake test` 运行完成，它都会返回非0退出代码，这对于一些 CI 环境非常有用，可以中断 CI 的其他脚本继续运行。

然后触发信号告诉 CI，我们需要生成测试报告和告警了。

然后，如果我们想要压制这种行为，可以强制将 `xmake test` 的退出代码总是设置成 0。

```lua
set_policy("test.return_zero_on_failure", true)
```

#### 仅仅测试编译

有时候，我们仅仅想要测试代码是否通过编译，或者没有通过编译，不需要运行它们，那么可以通过配置 `build_should_pass` 和 `build_should_fail` 来实现。

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

这通常用于一些测试代码中带有 `static_assert` 的场景，例如：

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

#### 配置额外的代码编译

我们还可以在配置测试用例的时候，对每个测试配置额外需要编译的代码，以及一些宏定义，实现内联测试。

xmake 会为每个测试单独编译一个独立的可执行程序去运行它，但这并不会影响到 target 在生产环境的编译结果。

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

以 doctest 为例，我们可以在不修改任何 main.cpp 的情况下，外置单元测试：

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

定义 DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN 会引入额外的 main 入口函数，因此我们需要配置 remove_files 去移除已有的 main.cpp 文件。

运行效果如下：

```bash
ruki-2:doctest ruki$ xmake test
running tests ...
[ 50%]: doctest/test_1 .................................... failed 0.009s
[100%]: doctest/test_2 .................................... passed 0.009s

50% tests passed, 1 tests failed out of 2, spent 0.019s
ruki-2:doctest ruki$ xmake test -v
running tests ...
[ 50%]: doctest/test_1 .................................... failed 0.026s
[doctest] doctest version is "2.4.11"
[doctest] run with "--help" for options
===============================================================================
tests/test_1.cpp:7:
TEST CASE:  testing the factorial function

tests/test_1.cpp:8: ERROR: CHECK( factorial(1) == 10 ) is NOT correct!
  values: CHECK( 1 == 10 )

===============================================================================
[doctest] test cases: 1 | 0 passed | 1 failed | 0 skipped
[doctest] assertions: 4 | 3 passed | 1 failed |
[doctest] Status: FAILURE!

run failed, exit code: 1
[100%]: doctest/test_2 .................................... passed 0.010s

50% tests passed, 1 tests failed out of 2, spent 0.038s
```

#### 测试动态库

通常，`add_tests` 仅用于对可执行程序进行运行测试，运行动态库需要有一个额外的 main 主入口，因此我们需要额外配置一个可执行程序去加载它，例如：

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

通过 `kind = "binary"` 可以将每个单元测试改为 binary 可执行程序，并通过 `DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN` 引入 main 入口函数。

这样就能实现动态库目标中外置可运行的单元测试。

### 新增类型大小检测

在先前的版本中，我们可以通过 `check_csnippets` 和 `output = true` 的方式，来实现类型检测。

```lua
check_csnippets("INT_SIZE", 'printf("%d", sizeof(int)); return 0;', {output = true, number = true})
```

但是这种方式，是通过尝试运行测试代码，然后获取运行输出结果，提取类型大小信息。

这对于交叉编译，就不适用了。

在 2.8.5 版本中，我们新增了 `check_sizeof` 辅助接口，可以通过直接解析测试程序的二进制文件，提取类型大小信息。

由于不需要运行测试，这种方式不仅可以支持交叉编译，而且对检测效率也有极大的提升，使用也更加的简单。

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

另外，我也可以通过 `target:check_sizeof` 在脚本域进行检测。

### 新增 Apple XROS 平台

苹果在 Xcode15 中新增了 visionOS 设备的构建支持，因此我们也在第一时间对其进行了支持，只需要执行：

```bash
$ xmake f -p applexros
$ xmake
```

就可以完成 visionOS/XROS 平台的构建。

### 支持代码合并

最后，我们还提供了一个小工具模块，它可以用于快速合并指定 target 里面的所有 c/c++ 和 头文件源码到单个源文件。

会生成类似 sqlite3.c 的这种单源码文件，用户可以根据自己的实际需求来决定是否使用这个功能。

而在做合并的时候，Xmake 会将内部 includes 头文件全部展开，并生成 DAG，通过拓扑排序引入。

默认它会处理所有 target 的合并，例如：

```bash
$ xmake l cli.amalgamate
build/tbox.c generated!
build/tbox.h generated!
```

我们也可以指定合并需要的目标：

```bash
$ xmake l cli.amalgamate tbox
build/tbox.c generated!
build/tbox.h generated!
```

也可以在合并每个源文件时候，指定一个自定义的 unique ID 的宏定义，来处理符号冲突问题。

```bash
$ xmake l cli.amalgamate -u MY_UNIQUEU_ID
build/tbox.c generated!
build/tbox.h generated!
```

如果多个源文件内部有重名符号，就可以判断这个 `MY_UNIQUEU_ID` 宏是否被定义，如果定义了，说明是在单文件中，就自己在源码中处理下重名符号。

```c
#ifdef MY_UNIQUEU_ID
    // do some thing
#endif
```


我们也可以指定输出位置：

```bash
$ xmake l cli.amalgamate -o /xxx
/xxx/tbox.c generated!
/xxx/tbox.h generated!
```


### 新增 windows.manifest.uac 策略

通过这个策略，我们可以快速方便的设置并启用 Windows UAC。

它支持以下几个 Level：

- invoker: asInvoker
- admin: requireAdministrator
- highest: highestAvailable

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

我们也可以通过 `windows.manifest.uac.ui` 策略，设置 Windows UAC 的 uiAccess，如果没有设置它，默认是 false。

```lua
set_policy("windows.manifest.uac.ui", true)
```

## 更新日志

### 新特性

* [#1452](https://github.com/xmake-io/xmake/issues/1452): 支持链接顺序调整，链接组
* [#1438](https://github.com/xmake-io/xmake/issues/1438): 支持代码 amalgamation
* [#3381](https://github.com/xmake-io/xmake/issues/3381): 添加 `xmake test` 支持
* [#4276](https://github.com/xmake-io/xmake/issues/4276): 支持自定义域 API
* [#4286](https://github.com/xmake-io/xmake/pull/4286): 添加 Apple XROS 支持
* [#4345](https://github.com/xmake-io/xmake/issues/4345): 支持检测类型大小 sizeof
* [#4369](https://github.com/xmake-io/xmake/pull/4369): 添加 windows.manifest.uac 策略

### 改进

* [#4284](https://github.com/xmake-io/xmake/issues/4284): 改进内置 includes 模块

### Bugs 修复

* [#4256](https://github.com/xmake-io/xmake/issues/4256): 为 vsxmake 生成器修复 c++ modules intellisense
