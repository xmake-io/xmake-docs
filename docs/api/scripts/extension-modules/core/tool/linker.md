# core.tool.linker

Linker related operations, often used for plugin development.

## linker.link

- Execute link

#### Function Prototype

::: tip API
```lua
linker.link(targetkind: <string>, sourcekinds: <string|table>, objectfiles: <table>, targetfile: <string>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| targetkind | Required. Target type, supports "binary", "static", "shared" |
| sourcekinds | Required. Source file type or type list, e.g., "cc", "cxx", {"cc", "mxx", "sc"} |
| objectfiles | Required. Object file path list |
| targetfile | Required. Target file path |
| opt | Optional. Option parameters, supports `target` |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

For the target, link the specified object file list to generate the corresponding target file, for example:

```lua
linker.link("binary", "cc", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

Where [target](/api/description/project-target) is the project target, here is passed in, mainly used to get the target-specific link options.
For the project target object, see: [core.project.project](/api/scripts/extension-modules/core/project/project)

Of course, you can also not specify the target, for example:

```lua
linker.link("binary", "cc", {"a.o", "b.o", "c.o"}, "/tmp/targetfile")
```

The first parameter specifies the link type and currently supports: binary, static, shared
The second parameter tells the linker that it should be linked as the source file object, and what compiler source files are compiled with, for example:

| Second Parameter Value | Description |
| ------------ | ------------ |
| cc | c compiler |
| cxx | c++ compiler |
| mm | objc compiler |
| mxx | objc++ compiler |
| gc | go compiler |
| as | assembler |
| sc | swift compiler |
| rc | rust compiler |
| dc | dlang compiler |

Specifying different compiler types, the linker will adapt the most appropriate linker to handle the link, and if several languages support mixed compilation, you can pass in multiple compiler types at the same time, specifying that the linker chooses to support these hybrid compilations. The linker of the language performs link processing:

```lua
linker.link("binary", {"cc", "mxx", "sc"}, {"a.o", "b.o", "c.o"}, "/tmp/targetfile")
```

The above code tells the linker that the three object files a, b, c may be c, objc++, compiled by swift code. The linker will select the most suitable linker from the current system and toolchain to handle the link process. .

## linker.linkcmd

- Get link command line string

#### Function Prototype

::: tip API
```lua
linker.linkcmd(targetkind: <string>, sourcekinds: <string|table>, objectfiles: <table>, targetfile: <string>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| targetkind | Required. Target type, supports "binary", "static", "shared" |
| sourcekinds | Required. Source file type or type list |
| objectfiles | Required. Object file path list |
| targetfile | Required. Target file path |
| opt | Optional. Option parameters, supports `target` and `configs` |

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns link command string |

#### Usage

Get the command line string executed in [linker.link](#linker-link) directly, which is equivalent to:

```lua
local cmdstr = linker.linkcmd("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

Note: The extension part of ``target = target}` is optional. If the target object is passed, the generated link command will add the link option corresponding to this target configuration.

And you can also pass various configurations yourself, for example:

```lua
local cmdstr = linker.linkcmd("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {configs = {linkdirs = "/usr/lib"}})
```

## linker.linkargv

- Get a list of link command line arguments

#### Function Prototype

::: tip API
```lua
linker.linkargv(targetkind: <string>, sourcekinds: <string|table>, objectfiles: <table>, targetfile: <string>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| targetkind | Required. Target type, supports "binary", "static", "shared" |
| sourcekinds | Required. Source file type or type list |
| objectfiles | Required. Object file path list |
| targetfile | Required. Target file path |
| opt | Optional. Option parameters |

#### Return Values

| Type | Description |
|------|-------------|
| string | Linker program path |
| table | Link arguments list |

#### Usage

A little different from [linker.linkcmd](#linker-linkcmd) is that this interface returns a list of parameters, table representation, more convenient to operate:

```lua
local program, argv = linker.linkargv("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

The first value returned is the main program name, followed by the parameter list, and `os.args(table.join(program, argv))` is equivalent to `linker.linkcmd`.

We can also run it directly by passing the return value to [os.runv](/api/scripts/builtin-modules/os#os-runv): `os.runv(linker.linkargv(..))`

## linker.linkflags

- Get link options

#### Function Prototype

::: tip API
```lua
linker.linkflags(targetkind: <string>, sourcekinds: <string|table>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| targetkind | Required. Target type, supports "binary", "static", "shared" |
| sourcekinds | Required. Source file type or type list |
| opt | Optional. Option parameters, supports `target` |

#### Return Value

| Type | Description |
|------|-------------|
| table | Returns link options list array |

#### Usage

Get the link option string part of [linker.linkcmd](#linker-linkcmd) without shellname and object file list, and return by array, for example:

```lua
local flags = linker.linkflags("shared", "cc", {target = target})
for _, flag in ipairs(flags) do
    print(flag)
end
```

The returned array of flags is an array.

## linker.has_flags

- Determine if the specified link option is supported

#### Function Prototype

::: tip API
```lua
linker.has_flags(targetkind: <string>, sourcekinds: <string|table>, flags: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| targetkind | Required. Target type, e.g., "binary", "static" |
| sourcekinds | Required. Source file type or type list |
| flags | Required. Link option to check |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if supported, false otherwise |

#### Usage

Although it can be judged by [lib.detect.has_flags](/api/scripts/extension-modules/lib/detect#detect-has_flags), but the interface is more low-level, you need to specify the linker name.
This interface only needs to specify the target type of the target, the source file type, which will automatically switch to select the currently supported linker.

```lua
if linker.has_flags(target:targetkind(), target:sourcekinds(), "-L/usr/lib -lpthread") then
    -- ok
end
```
