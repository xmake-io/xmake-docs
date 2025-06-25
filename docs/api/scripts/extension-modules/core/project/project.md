# core.project.project

Used to get some description information of the current project, that is, the configuration information defined in the `xmake.lua` project description file,
for example: [target](/api/description/project-target), [option](/api/description/configuration-option), etc.

## project.target

- Get the specified project target object

Get and access the specified project target configuration, for example:

```lua
local target = project.target("test")
if target then

    -- Get the target file name
    print(target:targetfile())

    -- Get the target type, which is: binary, static, shared
    print(target:targetkind())

    -- Get the target name
    print(target:name())

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

Returns all compilation targets for the current project, for example:

```lua
for targetname, target in pairs(project.targets()) do
    print(target:targetfile())
end
```

## project.option

- Get the specified option object

Get and access the option objects specified in the project, for example:

```lua
local option = project.option("test")
if option:enabled() then
    option:enable(false)
end
```

## project.options

- Get all project option objects

Returns all compilation targets for the current project, for example:

```lua
for optionname, option in pairs(project.options())
    print(option:enabled())
end
```

## project.name

- Get the current project name

That is, get the project name configuration of [set_project](/api/description/global-interfaces#set-project).

```lua
print(project.name())
```

## project.version

- Get the current project version number

That is, get [set_version](/api/description/global-interfaces.html#set-version) project version configuration.

```lua
print(project.version())
```
