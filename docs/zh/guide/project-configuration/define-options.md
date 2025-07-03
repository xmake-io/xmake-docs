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

```sh
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
    add_options("tests")
```

上面的例子，当 tests 启用后，foo 目标会自动添加上 `-DTEST`。

## 选项类型与常用接口 {#option-types-apis}

### 选项类型

- **布尔型**：开关选项，常用于启用/禁用某特性
- **字符串型**：用于路径、模式等自定义值
- **多值型**：通过 `set_values` 提供可选项（配合菜单）

### 常用接口

- `set_default(value)`：设置默认值（支持 bool 或 string）
- `set_showmenu(true/false)`：是否在 `xmake f --menu` 菜单中显示
- `set_description("desc")`：设置描述
- `set_values("a", "b", "c")`：设置可选值（菜单模式）
- `add_defines("FOO")`：启用时自动添加宏定义
- `add_links("bar")`：启用时自动链接库
- `add_cflags("-O2")`：启用时自动添加编译选项

## 选项依赖与条件控制 {#option-deps}

- `add_deps("otheropt")`：依赖其他选项，常用于 on_check/after_check 控制
- `before_check`/`on_check`/`after_check`：自定义检测逻辑，可动态启用/禁用选项

#### 依赖示例

```lua
option("feature_x")
    set_default(false)
    on_check(function (option)
        if has_config("feature_y") then
            option:enable(false)
        end
    end)
```

## 选项实例接口 {#option-instance}

在 `on_check`、`after_check` 等脚本中，可以通过 option 实例接口获取和设置选项状态：

- `option:name()` 获取选项名
- `option:value()` 获取选项值
- `option:enable(true/false)` 启用/禁用选项
- `option:enabled()` 判断选项是否启用
- `option:get("defines")` 获取配置值
- `option:set("defines", "FOO")` 设置配置值
- `option:add("links", "bar")` 追加配置值

## 选项与 target 的结合 {#option-in-target}

- 通过 `add_options("opt1", "opt2")` 绑定选项到目标
- 选项启用时，相关配置会自动应用到目标
- 也可用 `has_config("opt")` 在 target 域内做条件判断

## 典型示例 {#option-examples}

### 1. 布尔开关选项

```lua
option("enable_lto")
    set_default(false)
    set_showmenu(true)
    set_description("Enable LTO optimization")
    add_cflags("-flto")

target("foo")
    add_options("enable_lto")
```

### 2. 路径/字符串选项

```lua
option("rootdir")
    set_default("$(tmpdir)")
    set_showmenu(true)
    set_description("Set root directory")

target("foo")
    add_files("$(rootdir)/*.c")
```

### 3. 多值菜单选项

```lua
option("arch")
    set_default("x86_64")
    set_showmenu(true)
    set_description("Select architecture")
    set_values("x86_64", "arm64", "mips")
```

## 最佳实践 {#option-best-practices}

1. 使用 `set_showmenu` 让常用选项在菜单中可见
2. 通过 `add_options` 绑定选项，减少手动判断
3. 复杂依赖用 `add_deps` + `on_check/after_check` 控制
4. 选项描述要简明清晰，便于团队协作
5. 善用 `set_values` 提供可选项，提升交互体验

## 更多信息 {#more-information}

- 完整 API 文档：[选项 API](/zh/api/description/configuration-option)
- 选项实例接口：[option 实例 API](/zh/api/scripts/option-instance)
