# 选项实例 {#option-instance}

此页面描述了 [配置选项](/zh/api/description/configuration-option) 的 `on_load()`、`on_check()` 或 `after_check()` 等函数的 `option` 接口。

在脚本域中，可以通过 `option` 参数来操作当前选项的各种属性和配置。

## option:name

- 获取选项的名字

```lua
option("test")
    on_check(function (option)
        print(option:name())  -- 输出: test
    end)
```

## option:fullname

- 获取选项的完整名字

```lua
option("mymod::test")
    on_check(function (option)
        print(option:fullname())  -- 输出: mymod::test
    end)
```

## option:namespace

- 获取选项的命名空间

```lua
option("mymod::test")
    on_check(function (option)
        print(option:namespace())  -- 输出: mymod
    end)
```

## option:description

- 获取选项的描述信息

```lua
option("test")
    set_description("This is a test option")
    on_check(function (option)
        print(option:description())  -- 输出: This is a test option
    end)
```

## option:value

- 获取选项的值

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

- 检查选项是否已启用

```lua
option("test")
    after_check(function (option)
        if option:enabled() then
            print("Option is enabled")
        end
    end)
```

## option:enable

- 启用或禁用选项

```lua
option("float")
    after_check(function (option)
        if option:dep("micro"):enabled() then
            -- 如果micro选项启用，则禁用float选项
            option:enable(false)
        end
    end)
```

## option:set_value

- 设置选项的值

```lua
option("test")
    on_check(function (option)
        -- 设置选项值为特定值
        option:set_value("custom_value")
    end)
```

## option:clear

- 清除选项状态，需要重新检查

```lua
option("test")
    after_check(function (option)
        -- 清除状态，下次构建时会重新检查
        option:clear()
    end)
```

## option:get

- 获取选项在描述域的配置值

任何在描述域的 `set_xxx` 和 `add_xxx` 配置值都可以通过这个接口获取到。

```lua
option("test")
    set_default(false)
    set_category("option")
    set_description("Test option")
    add_defines("TEST_MODE")
    add_links("testlib")
    on_check(function (option)
        -- 获取各种配置
        local default = option:get("default")        -- false
        local category = option:get("category")      -- "option"
        local description = option:get("description") -- "Test option"
        local defines = option:get("defines")        -- {"TEST_MODE"}
        local links = option:get("links")            -- {"testlib"}
        
        -- 获取类型检查相关配置
        local ctypes = option:get("ctypes")          -- 获取C类型检查列表
        local cfuncs = option:get("cfuncs")          -- 获取C函数检查列表
        local cincludes = option:get("cincludes")    -- 获取C头文件检查列表
    end)
```

## option:set

- 设置选项的配置值

如果你想添加值可以用 [option:add](#option-add)。

```lua
option("test")
    on_check(function (option)
        -- 设置链接库
        option:set("links", "sdl2")
        
        -- 设置预定义宏
        option:set("defines", "SDL_MAIN_HANDLED")
        
        -- 设置配置变量
        option:set("configvar", option:name(), option:value(), {quote = false})
        
        -- 设置编译标志
        option:set("cxflags", "-O2", "-Wall")
        
        -- 设置头文件搜索路径
        option:set("includedirs", "/usr/include/sdl2")
        
        -- 设置库文件搜索路径
        option:set("linkdirs", "/usr/lib")
    end)
```

::: tip 注意
任何脚本域下对 `option:set("xxx", ...)` 的配置，都是完全跟描述域的 `set_xxx` 接口保持一致的，具体参数说明，可以直接参考描述域下对应的 `set_xxx` 接口说明。

例如：
- 描述域：`set_default(false)`
- 脚本域：`option:set("default", false)`
:::

## option:add

- 按名称添加到选项的值

```lua
option("test")
    on_check(function (option)
        -- 添加链接库
        option:add("links", "sdl2", "pthread")
        
        -- 添加预定义宏
        option:add("defines", "DEBUG", "VERSION=1")
        
        -- 添加编译标志
        option:add("cxflags", "-g", "-O0")
        
        -- 添加头文件搜索路径
        option:add("includedirs", "/usr/local/include")
        
        -- 添加库文件搜索路径
        option:add("linkdirs", "/usr/local/lib")
        
        -- 添加系统链接库
        option:add("syslinks", "dl", "m")
        
        -- 添加C类型检查
        option:add("ctypes", "wchar_t")
        
        -- 添加C函数检查
        option:add("cfuncs", "malloc", "free")
        
        -- 添加C头文件检查
        option:add("cincludes", "stdio.h", "stdlib.h")
    end)
```

::: tip 注意
任何脚本域下对 `option:add("xxx", ...)` 的配置，都是完全跟描述域的 `add_xxx` 接口保持一致的，具体参数说明，可以直接参考描述域下对应的 `add_xxx` 接口说明。

例如：
- 描述域：`add_defines("DEBUG", "VERSION=1")`
- 脚本域：`option:add("defines", "DEBUG", "VERSION=1")`
:::

## option:remove

- 从选项中移除指定的值

```lua
option("test")
    on_check(function (option)
        -- 移除特定的链接库
        option:remove("links", "oldlib")
        
        -- 移除特定的预定义宏
        option:remove("defines", "OLD_MACRO")
        
        -- 移除特定的编译标志
        option:remove("cxflags", "-Wall")
    end)
```

## option:deps

- 获取选项的所有依赖

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

- 获取指定的依赖选项

```lua
option("float")
    add_deps("micro")
    after_check(function (option)
        local micro_dep = option:dep("micro")
        if micro_dep and micro_dep:enabled() then
            -- 如果micro依赖启用，则禁用当前选项
            option:enable(false)
        end
    end)
```

## option:orderdeps

- 获取选项的顺序依赖

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

- 获取额外配置信息

```lua
option("test")
    add_csnippets("test_snippet", "int test() { return 1; }", {output = true})
    on_check(function (option)
        -- 检查snippet是否配置了output
        local has_output = option:extraconf("csnippets", "test_snippet", "output")
        if has_output then
            print("test_snippet has output configuration")
        end
    end)
```


::: tip 提示
- 在 `on_check`、`after_check` 等脚本函数中，`option` 参数代表当前正在处理的选项实例
- 可以通过 `option:get()` 获取描述域中设置的各种配置
- 可以通过 `option:set()` 和 `option:add()` 动态修改选项配置
- 使用 `option:dep()` 可以访问依赖选项，实现复杂的选项逻辑
- 选项的启用/禁用状态可以通过 `option:enabled()` 和 `option:enable()` 来控制
:::

