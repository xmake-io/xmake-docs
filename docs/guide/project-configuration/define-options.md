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

```lua
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
    add_options("test")
```

In the above example, when tests is enabled, the foo target will automatically be added with `-DTEST`.

## Others

For more options, please refer to the full documentation: [Option API Manual](/api/description/configuration-option).
