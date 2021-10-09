
此页面描述了 [工程目标](zh-cn/manual/project_target.md) 的 `on_load()`、`before_build()` 或 `after_install()` 等函数的 `target` 接口

#### target:name

- 获取目标的名字

#### target:get

- 获取目标在描述域的配置值

任何在描述域的 `set_xxx` 和 `add_xxx` 配置值都可以通过这个接口获取到。

```lua
-- get the links
target:get("links")
-- get the defined macros
target:get("defines")
```

#### target:set

- 设置目标的配置值，（如果你想添加值可以用 [target:add](#targetadd)）。

```lua
-- set the links
target:set("links", "sdl2")
-- set the defined macros
target:set("defines", "SDL_MAIN_HANDLED")
```

#### target:add

- 按名称添加到目标的值

```lua
-- add links
target:add("links", "sdl2")
-- add defined macros
target:add("defines", "SDL_MAIN_HANDLED")
```

!> 此处文档还在进行中，请耐心等待，你也可以通过赞助或者提 pr 来加速文档的更新

