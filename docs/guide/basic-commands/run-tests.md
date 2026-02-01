# Run tests {#run-tests}

Xmake provides a built-in `xmake test` command for running unit tests and test cases. Starting from version 2.8.5, you can configure test cases through `add_tests` on targets that need testing, and then automatically execute all tests.

This provides great convenience for automated testing, and even if a target is set to `set_default(false)`, xmake will still automatically compile it when executing tests and then run all tests.

## Command format

```sh
$ xmake test [options] [target/testname]
```

## Basic usage

### Configure test cases

First, we need to configure test cases for the target using `add_tests`:

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

:::tip Detailed API
For complete parameters and usage of `add_tests`, please refer to: [add_tests API documentation](/api/description/project-target#add-tests)
:::

### Run all tests

Simply execute `xmake test` to run all configured test cases:

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

### Run specific test targets

You can specify to run a specific test:

```sh
$ xmake test targetname/testname
```

Or run all tests of a target or batch tests by pattern matching:

```sh
$ xmake test targetname/*
$ xmake test targetname/foo*
```

You can also run tests with the same name for all targets:

```sh
$ xmake test */testname
```

## Test configuration options

`add_tests` supports the following configuration parameters:

| Parameter | Description |
|-----------|-------------|
| `runargs` | Test run argument string or array |
| `runenvs` | Test run environment variable table |
| `timeout` | Test timeout in seconds |
| `trim_output` | Whether to trim output whitespace |
| `pass_outputs` | Expected output patterns for test to pass |
| `fail_outputs` | Output patterns that should cause test to fail |
| `build_should_pass` | Test should build successfully |
| `build_should_fail` | Test should fail to build |
| `files` | Additional test files to compile |
| `defines` | Additional defines for test compilation |
| `realtime_output` | Show test output in real-time |

### Example configurations

#### Test with arguments

```lua
target("mytest")
    set_kind("binary")
    add_files("src/*.cpp")
    add_tests("with_args", {runargs = {"--verbose", "--mode=test"}})
```

:::tip Related APIs
- `set_runargs`: [Set target run arguments](/api/description/project-target#set-runargs)
- `set_rundir`: [Set run working directory](/api/description/project-target#set-rundir)
- `add_runenvs`: [Add run environment variables](/api/description/project-target#add-runenvs)
:::

#### Test with expected output

```lua
target("mytest")
    set_kind("binary")
    add_files("src/*.cpp")
    add_tests("output_test", {pass_outputs = ".*success.*", trim_output = true})
```

#### Test with timeout

```lua
target("mytest")
    set_kind("binary")
    add_files("src/*.cpp")
    add_tests("timeout_test", {timeout = 5}) -- 5 seconds timeout
```

#### Test with environment variables

```lua
target("mytest")
    set_kind("binary")
    add_files("src/*.cpp")
    add_tests("env_test", {runenvs = {TEST_MODE = "1", DEBUG = "true"}})
```

:::tip Related APIs
- `add_runenvs`: [Add run environment variables](/api/description/project-target#add-runenvs)
- `set_runenv`: [Set run environment variable](/api/description/project-target#set-runenv)
:::

#### Test build failure

```lua
target("compile_fail_test")
    set_kind("binary")
    add_files("src/invalid.cpp")
    add_tests("should_fail", {build_should_fail = true})
```

:::tip Related APIs
- `set_default`: [Set target default build](/api/description/project-target#set-default)
- `set_kind`: [Set target type](/api/description/project-target#set-kind)
:::

#### Add extra code files

`add_tests` supports adding extra code files for compilation through the `files` parameter, which is very useful for unit testing:

```lua
target("mytest")
    set_kind("binary")
    add_files("src/*.cpp")
    add_tests("test_with_stub", {
        files = "tests/stub_*.cpp",  -- Add extra test files
        defines = "TEST_MODE",
        remove_files = "src/main.cpp"  -- Remove unwanted files
    })
```

:::tip Use cases
- **Unit testing**: Add test code files without modifying original source code
- **Stub code**: Provide mock implementations for testing
- **Conditional compilation**: Add test-specific macro definitions via `defines`
- **File replacement**: Remove unwanted files using `remove_files` (e.g., main.cpp)
:::

Taking doctest as an example, you can externally unit test without modifying any main.cpp:

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

## Integrating Third-party Testing Frameworks

`xmake test` can integrate well with third-party testing frameworks like doctest, gtest, etc., to achieve more powerful testing capabilities.

### doctest Integration Example

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
            packages = "doctest",  -- Integrate doctest package
            defines = "DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN"
        })
    end
```

Test file example (`tests/test_1.cpp`):

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

### gtest Integration Example

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
            packages = "gtest",  -- Integrate gtest package
            defines = "TEST_MAIN"
        })
    end
```

:::tip Framework Advantages
- **doctest**: Lightweight, header-only, easy to integrate
- **gtest**: Feature-rich, maintained by Google, active community
- **Catch2**: Modern C++ style, powerful features
:::

### Dynamic Library Testing

You can also test dynamic libraries:

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

## Verbose output

Use `-v` to get verbose output:

```sh
$ xmake test -v
```

Use `-vD` to view detailed test failure error messages:

```sh
$ xmake test -vD
```

The `-vD` parameter displays more detailed log output, including output file paths and error information for each test:

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

### Log file description

When using `-vD`, xmake generates the following log files:

- **stdout logs**: `build/.gens/{target}/tests/{testname}.stdout.log` - Standard output of tests
- **errors logs**: `build/.gens/{target}/tests/{testname}.errors.log` - Error output of tests
- **build error logs**: Detailed error information when compilation fails

These log files are very useful for debugging test failure issues, allowing you to view specific output content and error information.

## Group testing

You can group tests using pattern matching:

```sh
# Run all tests starting with "unit_"
$ xmake test */unit_*

# Run all tests for targets starting with "test_"
$ xmake test test_*/*

# Run specific test across all targets
$ xmake test */default
```

## Continuous integration

For CI/CD environments, you can use the following patterns:

```sh
# Run tests and exit with error code on failure
$ xmake test

# Run tests with detailed output for CI logs
$ xmake test -v

# Run specific test groups
$ xmake test unit_tests/*
$ xmake test integration_tests/*
```

The test command will return a non-zero exit code if any tests fail, making it suitable for CI pipelines.
