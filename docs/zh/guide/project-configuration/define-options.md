# 定义选项 {#define-option}

## 自定义命令行选项

我们可以定义一个选项开关，用于控制内部的配置逻辑，例如：

```lua
option("tests", {default = false, description = "Enable Tests"})

target("foo")
    set_kind("binary")
    add_files("src/*.cpp")
    if has_config("tests") then
        add_defines("TESTS")
    end
```

然后，我们可以命令行启用这个自定义的选项，使得 foo 目标编译时候自动加上`-DTEST`的宏定义。

```lua
$ xmake f --tests=y
$ xmake
```

上面的 option 配置由于比较简单，所以我们使用了单行简化写法，我们也可以使用完整的域配置写法。

```lua
option("tests")
    set_default(false)
    set_description("Enable Tests")
```

## 绑定选项到目标

我们也可以不使用 `has_config` 和 `add_defines` 去手动设置，直接使用 `add_options` 将选项绑定到指定的 target。

这样，当选项被启用的时候，tests 选项中所有关联的设置都会自动设置到被绑定的目标中。

```lua
option("tests")
    set_description("Enable Tests")
    set_default(false)
    add_defines("TEST")

target("foo")
    set_kind("binary")
    add_files("src/*.cpp")
    add_options("test")
```

上面的例子，当 tests 启用后，foo 目标会自动添加上 `-DTEST`。

## 其他

关于更多选项的使用，请查看完整文档：[选项 API 手册](/zh/api/description/configuration-option)。
