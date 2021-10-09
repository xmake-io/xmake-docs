
This page describes the interface for `target` of functions like `on_load()`, `before_build()` or `after_install()` of the [Project target](manual/project_target.md)

#### target:name

- Get the name of the target

#### target:get

- Get the values of the target by name

```lua
-- get the links
target:get("links")
-- get the defined macros
target:get("defines")
```

#### target:set

- Set the values of the target by name (If you just want to add values use [target:add](#targetadd))

```lua
-- set the links
target:set("links", "sdl2")
-- set the defined macros
target:set("defines", "SDL_MAIN_HANDLED")
```

#### target:add

- Add to the values of the target by name

```lua
-- add links
target:add("links", "sdl2")
-- add defined macros
target:add("defines", "SDL_MAIN_HANDLED")
```

!> The document here is still in progress, please be patient, you can also speed up the update of the document by sponsoring or submiting pr
