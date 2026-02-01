# 运行测试 {#run-tests}

Xmake 提供了内置的 `xmake test` 命令用于运行单元测试和测试用例。从 v2.8.5 版本开始，你可以通过 `add_tests` 在需要测试的目标上配置测试用例，然后自动执行所有测试。

这为自动化测试提供了极大的便利，即使目标被设置为 `set_default(false)`，xmake 在执行测试时仍会自动编译它，然后运行所有测试。

## 命令格式

```sh
$ xmake test [options] [target/testname]
```

## 基本用法

### 配置测试用例

首先，我们需要使用 `add_tests` 为目标配置测试用例：

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

:::tip 详细 API
关于 `add_tests` 的完整参数和使用说明，请参考：[add_tests 接口文档](/zh/api/description/project-target#add-tests)
:::

### 运行所有测试

只需执行 `xmake test` 即可运行所有配置的测试用例：

```sh
$ xmake test
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

### 运行指定的测试目标

你可以指定运行特定的测试：

```sh
$ xmake test targetname/testname
```

或者通过模式匹配运行一个目标的所有测试或批量测试：

```sh
$ xmake test targetname/*
$ xmake test targetname/foo*
```

你也可以运行所有目标中同名的测试：

```sh
$ xmake test */testname
```

## 测试配置选项

`add_tests` 支持以下配置参数：

| 参数 | 描述 |
|------|------|
| `runargs` | 测试运行参数字符串或数组 |
| `runenvs` | 测试运行环境变量表 |
| `timeout` | 测试超时时间（秒） |
| `trim_output` | 是否修剪输出空白字符 |
| `pass_outputs` | 测试通过的预期输出模式 |
| `fail_outputs` | 应导致测试失败的输出模式 |
| `build_should_pass` | 测试应该构建成功 |
| `build_should_fail` | 测试应该构建失败 |
| `files` | 额外的测试文件编译 |
| `defines` | 测试编译的额外定义 |
| `realtime_output` | 实时显示测试输出 |

### 配置示例

#### 带参数的测试

```lua
target("mytest")
    set_kind("binary")
    add_files("src/*.cpp")
    add_tests("with_args", {runargs = {"--verbose", "--mode=test"}})
```

:::tip 相关 API
- `set_runargs`: [设置目标运行参数](/zh/api/description/project-target#set-runargs)
- `set_rundir`: [设置运行工作目录](/zh/api/description/project-target#set-rundir)
- `add_runenvs`: [添加运行环境变量](/zh/api/description/project-target#add-runenvs)
:::

#### 带预期输出的测试

```lua
target("mytest")
    set_kind("binary")
    add_files("src/*.cpp")
    add_tests("output_test", {pass_outputs = ".*success.*", trim_output = true})
```

#### 带超时的测试

```lua
target("mytest")
    set_kind("binary")
    add_files("src/*.cpp")
    add_tests("timeout_test", {timeout = 5}) -- 5秒超时
```

#### 带环境变量的测试

```lua
target("mytest")
    set_kind("binary")
    add_files("src/*.cpp")
    add_tests("env_test", {runenvs = {TEST_MODE = "1", DEBUG = "true"}})
```

:::tip 相关 API
- `add_runenvs`: [添加运行环境变量](/zh/api/description/project-target#add-runenvs)
- `set_runenv`: [设置运行环境变量](/zh/api/description/project-target#set-runenv)
:::

#### 构建失败测试

```lua
target("compile_fail_test")
    set_kind("binary")
    add_files("src/invalid.cpp")
    add_tests("should_fail", {build_should_fail = true})
```

:::tip 相关 API
- `set_default`: [设置目标默认构建](/zh/api/description/project-target#set-default)
- `set_kind`: [设置目标类型](/zh/api/description/project-target#set-kind)
:::

#### 添加额外代码文件

`add_tests` 支持通过 `files` 参数添加额外的代码文件进行编译，这对于单元测试非常有用：

```lua
target("mytest")
    set_kind("binary")
    add_files("src/*.cpp")
    add_tests("test_with_stub", {
        files = "tests/stub_*.cpp",  -- 添加额外的测试文件
        defines = "TEST_MODE",
        remove_files = "src/main.cpp"  -- 移除不需要的文件
    })
```

:::tip 使用场景
- **单元测试**：添加测试代码文件而不修改原始源码
- **桩代码**：为测试提供模拟的实现
- **条件编译**：通过 `defines` 添加测试特定的宏定义
- **文件替换**：使用 `remove_files` 移除不需要的文件（如 main.cpp）
:::

以 doctest 为例，可以在不修改任何 main.cpp 的情况下外置单元测试：

```lua
target("doctest")
    set_kind("binary")
    add_files("src/*.cpp")
    for _, testfile in ipairs(os.files("tests/*.cpp")) do
        add_tests(path.basename(testfile), {
            files = testfile,
            remove_files = "src/main.cpp",
            languages = "c++11",
            defines = "DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN"
        })
    end
end
```

## 集成第三方测试框架

`xmake test` 可以很好地集成 doctest、gtest 等第三方测试框架，实现更强大的测试功能。

### doctest 集成示例

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
            packages = "doctest",  -- 集成 doctest 包
            defines = "DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN"
        })
    end
```

测试文件示例 (`tests/test_1.cpp`)：

```cpp
#include "doctest/doctest.h"

static int factorial(int number) {
    return number <= 1 ? number : factorial(number - 1) * number;
}

TEST_CASE("testing the factorial function") {
    CHECK(factorial(1) == 1);
    CHECK(factorial(2) == 2);
    CHECK(factorial(3) == 6);
    CHECK(factorial(10) == 3628800);
}
```

### gtest 集成示例

```lua
add_rules("mode.debug", "mode.release")
add_requires("gtest")

target("mytest")
    set_kind("binary")
    add_files("src/*.cpp")
    for _, testfile in ipairs(os.files("tests/*.cpp")) do
        add_tests(path.basename(testfile), {
            files = testfile,
            remove_files = "src/main.cpp",
            packages = "gtest",  -- 集成 gtest 包
            defines = "TEST_MAIN"
        })
    end
```

:::tip 框架优势
- **doctest**：轻量级，仅头文件，易于集成
- **gtest**：功能丰富，Google 维护，社区活跃
- **Catch2**：现代 C++ 风格，功能强大
:::

### 动态库测试

也可以对动态库进行测试：

```lua
target("mylib")
    set_kind("shared")
    add_files("src/*.cpp")

target("mylib_test")
    set_kind("binary")
    add_deps("mylib")
    add_files("tests/*.cpp")
    add_packages("gtest")
    add_tests("default")

## 详细输出

使用 `-v` 获取详细输出：

```sh
$ xmake test -v
```

使用 `-vD` 查看详细的测试失败错误信息：

```sh
$ xmake test -vD
```

`-vD` 参数会显示更详细的日志输出，包括每个测试的输出文件路径和错误信息：

```sh
report of tests:
[  2%]: test_10/compile_fail .... passed 0.001s
[  4%]: test_11/compile_pass .... failed 0.001s
errors: build/.gens/test_11/macosx/x86_64/release/tests/test_11/compile_pass.errors.log
[  7%]: test_1/args ............. passed 0.045s
stdout: build/.gens/test_1/macosx/x86_64/release/tests/test_1/args.stdout.log
[  9%]: test_1/default .......... passed 0.046s
stdout: build/.gens/test_1/macosx/x86_64/release/tests/test_1/default.stdout.log
[ 11%]: test_1/fail_output ...... passed 0.046s
stdout: build/.gens/test_1/macosx/x86_64/release/tests/test_1/fail_output.stdout.log
[ 14%]: test_1/pass_output ...... passed 0.047s
stdout: build/.gens/test_1/macosx/x86_64/release/tests/test_1/pass_output.stdout.log
...
[100%]: test_timeout/run_timeout  failed 1.007s
errors: build/.gens/test_timeout/macosx/x86_64/release/tests/test_timeout/run_timeout.errors.log

Detailed summary:
Failed tests:
 - test_11/compile_pass
 - test_5/fail_output
 - test_5/pass_output
 - test_7/args
 - test_7/default
 - test_7/fail_output
 - test_7/pass_output
 - test_8/pass_output
 - test_timeout/run_timeout

78% tests passed, 9 test(s) failed out of 42, spent 1.212s
```

### 日志文件说明

使用 `-vD` 时，xmake 会生成以下日志文件：

- **stdout 日志**：`build/.gens/{target}/tests/{testname}.stdout.log` - 测试的标准输出
- **errors 日志**：`build/.gens/{target}/tests/{testname}.errors.log` - 测试的错误输出
- **构建错误日志**：编译失败时的详细错误信息

这些日志文件对于调试测试失败问题非常有用，可以查看具体的输出内容和错误信息。

## 分组测试

你可以使用模式匹配对测试进行分组：

```sh
# 运行所有以 "unit_" 开头的测试
$ xmake test */unit_*

# 运行所有以 "test_" 开头的目标的测试
$ xmake test test_*/*

# 运行所有目标中的特定测试
$ xmake test */default
```

## 持续集成

对于 CI/CD 环境，可以使用以下模式：

```sh
# 运行测试，失败时返回错误码
$ xmake test

# 运行测试并提供详细输出用于 CI 日志
$ xmake test -v

# 运行特定测试组
$ xmake test unit_tests/*
$ xmake test integration_tests/*
```

测试命令在任何测试失败时都会返回非零退出码，这使其适合用于 CI 流水线。
