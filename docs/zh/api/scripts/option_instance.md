# 选项实例 {#option-instance}

此页面描述了 [配置选项](https://xmake.io/#/zh-cn/manual/configuration_option.md) 的 `on_load()`、`on_check()` 或 `after_check()` 等函数的 `option` 接口


## option:value

- 获取选项的值

## option:name

- 获取选项的名字

## option:get

- 获取选项在描述域的配置值

任何在描述域的 `set_xxx` 和 `add_xxx` 配置值都可以通过这个接口获取到。

```lua
-- get the links
option:get("links")
-- get the defined macros
option:get("defines")
```

## option:set

- 设置选项的配置值

如果你想添加值可以用 [option:add](#option-add)。

```lua
-- set the links
option:set("links", "sdl2")
-- set the defined macros
option:set("defines", "SDL_MAIN_HANDLED")
-- set configvar
option:set("configvar", option:name(), option:value(), {quote = false})
```

## option:add

- 按名称添加到选项的值

```lua
-- add links
option:add("links", "sdl2")
-- add defined macros
option:add("defines", "SDL_MAIN_HANDLED")
```

::: tip 注意
此处文档还在进行中，请耐心等待，你也可以通过赞助或者提 pr 来加速文档的更新
:::

