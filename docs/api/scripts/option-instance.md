# Option Instance {#option-instance}

This page describes the `option` interface for functions like `on_load()`, `on_check()` or `after_check()` of the [Configuration option](/api/description/configuration-option).

In the script scope, you can operate various properties and configurations of the current option through the `option` parameter.

## option:name

- Get the name of the option (without namespace)

#### Function Prototype

::: tip API
```lua
option:name()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
option("test")
    on_check(function (option)
        print(option:name())  -- output: test
    end)
```

## option:fullname

- Get the full name of the option (with namespace)

#### Function Prototype

::: tip API
```lua
option:fullname()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
option("mymod::test")
    on_check(function (option)
        print(option:fullname())  -- output: mymod::test
    end)
```

## option:namespace

- Get the namespace of the option

#### Function Prototype

::: tip API
```lua
option:namespace()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
option("mymod::test")
    on_check(function (option)
        print(option:namespace())  -- output: mymod
    end)
```

## option:description

- Get the description of the option

#### Function Prototype

::: tip API
```lua
option:description()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
option("test")
    set_description("This is a test option")
    on_check(function (option)
        print(option:description())  -- output: This is a test option
    end)
```

## option:value

- Get the current value of the option

#### Function Prototype

::: tip API
```lua
option:value()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
option("demo")
    set_default(true)
    after_check(function (option)
        local value = option:value()
        if value then
            print("demo option is enabled")
        else
            print("demo option is disabled")
        end
    end)
```

## option:enabled

- Check if the option is enabled

#### Function Prototype

::: tip API
```lua
option:enabled()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
option("test")
    after_check(function (option)
        if option:enabled() then
            print("Option is enabled")
        end
    end)
```

## option:enable

- Enable or disable the option

#### Function Prototype

::: tip API
```lua
option:enable(enable: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| enable | Whether to enable |

#### Usage


```lua
option("float")
    after_check(function (option)
        if option:dep("micro"):enabled() then
            -- If micro option is enabled, disable float option
            option:enable(false)
        end
    end)
```

## option:set_value

- Set the value of the option

#### Function Prototype

::: tip API
```lua
option:set_value(value: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| value | Option value |

#### Usage


```lua
option("test")
    on_check(function (option)
        -- Set option value to a specific value
        option:set_value("custom_value")
    end)
```

## option:clear

- Clear the option status, need to recheck

#### Function Prototype

::: tip API
```lua
option:clear()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
option("test")
    after_check(function (option)
        -- Clear status, will recheck on next build
        option:clear()
    end)
```

## option:get

- Get the configuration values of the option in the description scope

#### Function Prototype

::: tip API
```lua
option:get(key: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key | Configuration key name |

#### Usage


Any configuration values set by `set_xxx` and `add_xxx` in the description scope can be obtained through this interface.

```lua
option("test")
    set_default(false)
    set_category("option")
    set_description("Test option")
    add_defines("TEST_MODE")
    add_links("testlib")
    on_check(function (option)
        -- Get various configurations
        local default = option:get("default")        -- false
        local category = option:get("category")      -- "option"
        local description = option:get("description") -- "Test option"
        local defines = option:get("defines")        -- {"TEST_MODE"}
        local links = option:get("links")            -- {"testlib"}
        
        -- Get type checking related configurations
        local ctypes = option:get("ctypes")          -- Get C type check list
        local cfuncs = option:get("cfuncs")          -- Get C function check list
        local cincludes = option:get("cincludes")    -- Get C header file check list
    end)
```

## option:set

- Set the configuration values of the option

#### Function Prototype

::: tip API
```lua
option:set(key: <string>, value: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key | Configuration key name |
| value | Configuration value |

#### Usage


If you want to add values, you can use [option:add](#option-add).

```lua
option("test")
    on_check(function (option)
        -- Set link libraries
        option:set("links", "sdl2")
        
        -- Set predefined macros
        option:set("defines", "SDL_MAIN_HANDLED")
        
        -- Set configuration variables
        option:set("configvar", option:name(), option:value(), {quote = false})
        
        -- Set compilation flags
        option:set("cxflags", "-O2", "-Wall")
        
        -- Set header file search paths
        option:set("includedirs", "/usr/include/sdl2")
        
        -- Set library file search paths
        option:set("linkdirs", "/usr/lib")
    end)
```

::: tip NOTE
Any script scope configuration using `option:set("xxx", ...)` is completely consistent with the corresponding `set_xxx` interface in the description scope. For specific parameter descriptions, you can directly refer to the corresponding `set_xxx` interface documentation in the description scope.

For example:
- Description scope: `set_default(false)`
- Script scope: `option:set("default", false)`
:::

## option:add

- Add values to the option by name

#### Function Prototype

::: tip API
```lua
option:add(key: <string>, value: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key | Configuration key name |
| value | Value to add |

#### Usage


```lua
option("test")
    on_check(function (option)
        -- Add link libraries
        option:add("links", "sdl2", "pthread")
        
        -- Add predefined macros
        option:add("defines", "DEBUG", "VERSION=1")
        
        -- Add compilation flags
        option:add("cxflags", "-g", "-O0")
        
        -- Add header file search paths
        option:add("includedirs", "/usr/local/include")
        
        -- Add library file search paths
        option:add("linkdirs", "/usr/local/lib")
        
        -- Add system link libraries
        option:add("syslinks", "dl", "m")
        
        -- Add C type checks
        option:add("ctypes", "wchar_t")
        
        -- Add C function checks
        option:add("cfuncs", "malloc", "free")
        
        -- Add C header file checks
        option:add("cincludes", "stdio.h", "stdlib.h")
    end)
```

::: tip NOTE
Any script scope configuration using `option:add("xxx", ...)` is completely consistent with the corresponding `add_xxx` interface in the description scope. For specific parameter descriptions, you can directly refer to the corresponding `add_xxx` interface documentation in the description scope.

For example:
- Description scope: `add_defines("DEBUG", "VERSION=1")`
- Script scope: `option:add("defines", "DEBUG", "VERSION=1")`
:::

## option:remove

- Remove specified values from the option

#### Function Prototype

::: tip API
```lua
option:remove(key: <string>, value: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key | Configuration key name |
| value | Value to remove |

#### Usage


```lua
option("test")
    on_check(function (option)
        -- Remove specific link libraries
        option:remove("links", "oldlib")
        
        -- Remove specific predefined macros
        option:remove("defines", "OLD_MACRO")
        
        -- Remove specific compilation flags
        option:remove("cxflags", "-Wall")
    end)
```

## option:deps

- Get all dependencies of the option

#### Function Prototype

::: tip API
```lua
option:deps()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
option("info")
    add_deps("small", "micro")
    after_check(function (option)
        local deps = option:deps()
        if deps then
            for name, dep in pairs(deps) do
                print("Dependency:", name, "enabled:", dep:enabled())
            end
        end
    end)
```

## option:dep

- Get the specified dependent option

#### Function Prototype

::: tip API
```lua
option:dep(name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Dependency name |

#### Usage


```lua
option("float")
    add_deps("micro")
    after_check(function (option)
        local micro_dep = option:dep("micro")
        if micro_dep and micro_dep:enabled() then
            -- If micro dependency is enabled, disable current option
            option:enable(false)
        end
    end)
```

## option:orderdeps

- Get the ordered dependencies of the option

#### Function Prototype

::: tip API
```lua
option:orderdeps()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage


```lua
option("test")
    add_deps("dep1", "dep2")
    after_check(function (option)
        local orderdeps = option:orderdeps()
        if orderdeps then
            for i, dep in ipairs(orderdeps) do
                print("Order dependency", i, ":", dep:name())
            end
        end
    end)
```

## option:extraconf

- Get extra configuration information

#### Function Prototype

::: tip API
```lua
option:extraconf(name: <string>, key: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Configuration name |
| key | Configuration key |

#### Usage


```lua
option("test")
    add_csnippets("test_snippet", "int test() { return 1; }", {output = true})
    on_check(function (option)
        -- Check if snippet has output configuration
        local has_output = option:extraconf("csnippets", "test_snippet", "output")
        if has_output then
            print("test_snippet has output configuration")
        end
    end)
```

::: tip TIP
- In script functions like `on_check`, `after_check`, the `option` parameter represents the current option instance being processed
- You can get various configurations set in the description scope through `option:get()`
- You can dynamically modify option configurations through `option:set()` and `option:add()`
- Use `option:dep()` to access dependent options and implement complex option logic
- The enable/disable status of options can be controlled through `option:enabled()` and `option:enable()`
:::
