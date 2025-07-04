# Define options {#define-option}

## Customize command line options

We can define an option switch to control the internal configuration logic, for example:

```lua
option("tests", {default = false, description = "Enable Tests"})

target("foo")
    set_kind("binary")
    add_files("src/*.cpp")
    if has_config("tests") then
        add_defines("TESTS")
    end
```

Then, we can enable this custom option in the command line, so that the macro definition of `-DTESTS` is automatically added when the foo target is compiled.

```sh
$ xmake f --tests=y
$ xmake
```

The above option configuration is relatively simple, so we use a single-line simplified writing method, and we can also use the complete domain configuration writing method.

```lua
option("tests")
    set_default(false)
    set_description("Enable Tests")
```

## Bind options to targets

We can also use `add_options` to bind options to a specified target directly without using `has_config` and `add_defines` to set them manually.

In this way, when the option is enabled, all associated settings in the tests option will be automatically set to the bound target.

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

In the above example, when tests is enabled, the foo target will automatically be added with `-DTEST`.

## Option Types and Common APIs {#option-types-apis}

### Option Types

- **Boolean**: Switch option, usually for enabling/disabling features
- **String**: For paths, patterns, or custom values
- **Multi-value**: Use `set_values` to provide choices (menu)

### Common APIs

- `set_default(value)`: Set default value (bool or string)
- `set_showmenu(true/false)`: Show in `xmake f --menu`
- `set_description("desc")`: Set description
- `set_values("a", "b", "c")`: Set selectable values (menu)
- `add_defines("FOO")`: Add macro when enabled
- `add_links("bar")`: Add link library when enabled
- `add_cflags("-O2")`: Add compile flag when enabled

## Option Dependency and Conditional Control {#option-deps}

- `add_deps("otheropt")`: Depend on other options, often used with on_check/after_check
- `before_check`/`on_check`/`after_check`: Custom check logic, can enable/disable options dynamically

#### Dependency Example

```lua
option("feature_x")
    set_default(false)
    on_check(function (option)
        if has_config("feature_y") then
            option:enable(false)
        end
    end)
```

## Option Instance APIs {#option-instance}

In `on_check`, `after_check`, etc., you can use the option instance APIs:

- `option:name()` get option name
- `option:value()` get option value
- `option:enable(true/false)` enable/disable option
- `option:enabled()` check if enabled
- `option:get("defines")` get config value
- `option:set("defines", "FOO")` set config value
- `option:add("links", "bar")` append config value

## Option and Target Integration {#option-in-target}

- Use `add_options("opt1", "opt2")` to bind options to targets
- When enabled, related configs are automatically applied to the target
- You can also use `has_config("opt")` for conditional logic in target scope

## Typical Examples {#option-examples}

### 1. Boolean Switch Option

```lua
option("enable_lto")
    set_default(false)
    set_showmenu(true)
    set_description("Enable LTO optimization")
    add_cflags("-flto")

target("foo")
    add_options("enable_lto")
```

### 2. Path/String Option

```lua
option("rootdir")
    set_default("/tmp/")
    set_showmenu(true)
    set_description("Set root directory")

target("foo")
    add_files("$(rootdir)/*.c")
```

### 3. Multi-value Menu Option

```lua
option("arch")
    set_default("x86_64")
    set_showmenu(true)
    set_description("Select architecture")
    set_values("x86_64", "arm64", "mips")
```

## More Information {#more-information}

- Complete API documentation: [Option API](/api/description/configuration-option)
- Option instance APIs: [option instance API](/api/scripts/option-instance)
