# Option Instance

This page describes the interface for `option` of functions like `on_load()`, `on_check()` or `after_check()` of the [Configuration option](/api/description/configuration-option)

## option:value

- Get the value of the option

## option:name

- Get the name of the option

## option:get

- Get the values of the option by name

```lua
-- get the links
option:get("links")
-- get the defined macros
option:get("defines")
```

## option:set

- Set the values of the option by name.

If you just want to add values use [option:add](#option-add).

```lua
-- set the links
option:set("links", "sdl2")
-- set the defined macros
option:set("defines", "SDL_MAIN_HANDLED")
-- set configvar
option:set("configvar", option:name(), option:value(), {quote = false})
```

::: tip NOTE
Any script scope configuration using `option:set("xxx", ...)` is completely consistent with the corresponding `set_xxx` interface in the description scope. For specific parameter descriptions, you can directly refer to the corresponding `set_xxx` interface documentation in the description scope.

For example:
- Description scope: `set_default(false)`
- Script scope: `option:set("default", false)`
:::

## option:add

- Add to the values of the option by name

```lua
-- add links
option:add("links", "sdl2")
-- add defined macros
option:add("defines", "SDL_MAIN_HANDLED")
```

::: tip NOTE
Any script scope configuration using `option:add("xxx", ...)` is completely consistent with the corresponding `add_xxx` interface in the description scope. For specific parameter descriptions, you can directly refer to the corresponding `add_xxx` interface documentation in the description scope.

For example:
- Description scope: `add_defines("DEBUG", "VERSION=1")`
- Script scope: `option:add("defines", "DEBUG", "VERSION=1")`
:::

::: tip NOTE
The document here is still in progress, please be patient, you can also speed up the update of the document by sponsoring or submiting pr
:::
