# core.project.project

Used to get some description information of the current project, that is, the configuration information defined in the `xmake.lua` project description file,
for example: [target](/api/description/project-target), [option](/api/description/configuration-option), etc.

## project.target

- Get the specified project target object

#### Function Prototype

::: tip API
```lua
project.target(name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Target name |

#### Return Value

| Type | Description |
|------|-------------|
| target | Returns the target object, or nil if it doesn't exist |

#### Usage

Get and access the specified project target configuration, for example:

```lua
local target = project.target("test")
if target then

    -- Get the target name
    print(target:name())

    -- Get the target directory, available after version 2.1.9
    print(target:targetdir())

    -- Get the target file name
    print(target:targetfile())

    -- Get the target type, which is: binary, static, shared
    print(target:targetkind())

    -- Get the target source file
    local sourcefiles = target:sourcefiles()

    -- Get a list of target installation header files
    local srcheaders, dstheaders = target:headerfiles()

    -- Get target dependencies
    print(target:get("deps"))
end
```

## project.targets

- Get a list of project target objects

#### Function Prototype

::: tip API
```lua
project.targets()
```
:::

#### Parameter Description

No parameters required for this function.

#### Return Value

| Type | Description |
|------|-------------|
| table | Returns a table containing all target objects, with target names as keys and target objects as values |

#### Usage

Returns all compilation targets for the current project, for example:

```lua
for targetname, target in pairs(project.targets()) do
    print(target:targetfile())
end
```

## project.option

- Get the specified option object

#### Function Prototype

::: tip API
```lua
project.option(name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Option name |

#### Return Value

| Type | Description |
|------|-------------|
| option | Returns the option object, or nil if it doesn't exist |

#### Usage

Get and access the option objects specified in the project, for example:

```lua
local option = project.option("test")
if option:enabled() then
    option:enable(false)
end
```

## project.options

- Get all project option objects

#### Function Prototype

::: tip API
```lua
project.options()
```
:::

#### Parameter Description

No parameters required for this function.

#### Return Value

| Type | Description |
|------|-------------|
| table | Returns a table containing all option objects, with option names as keys and option objects as values |

#### Usage

Returns all compilation targets for the current project, for example:

```lua
for optionname, option in pairs(project.options()) do
    print(option:enabled())
end
```

## project.name

- Get the current project name

#### Function Prototype

::: tip API
```lua
project.name()
```
:::

#### Parameter Description

No parameters required for this function.

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the project name |

#### Usage

That is, get the project name configuration of [set_project](/api/description/global-interfaces#set-project).

```lua
print(project.name())
```

## project.version

- Get the current project version number

#### Function Prototype

::: tip API
```lua
project.version()
```
:::

#### Parameter Description

No parameters required for this function.

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the project version number |

#### Usage

That is, get [set_version](/api/description/global-interfaces#set-version) project version configuration.

```lua
print(project.version())
```
