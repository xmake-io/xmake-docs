# utils.binary

Binary utility modules.

## utils.binary.deplibs

Get dependent libraries.

### Function Prototype

::: tip API
```lua
local deps = deplibs(binaryfile: <string>, opt: <table>)
```
:::

### Parameter Description

| Parameter | Description |
|-----------|-------------|
| binaryfile | Required. Input binary file path |
| opt | Optional. Options: <br>- `plat`: Platform <br>- `arch`: Architecture <br>- `recursive`: Recursively get all sub-dependencies (default: false) <br>- `resolve_path`: Try to resolve the file full path (default: false) <br>- `resolve_hint_paths`: Resolve paths from hints <br>- `resolve_search_paths`: Search library paths (e.g. LD_LIBRARY_PATH) <br>- `check_cycle`: Check for circular dependencies |

### Return Value

| Return Value | Description |
|--------------|-------------|
| `<table>` | Dependent libraries list |

## utils.binary.readsyms

Read symbols from object file.

### Function Prototype

::: tip API
```lua
local syms = readsyms(binaryfile: <string>)
```
:::

### Parameter Description

| Parameter | Description |
|-----------|-------------|
| binaryfile | Required. Input object file path |

### Return Value

| Return Value | Description |
|--------------|-------------|
| `<table>` | Symbols list |

## utils.binary.extractlib

Extract static library to directory.

### Function Prototype

::: tip API
```lua
extractlib(libraryfile: <string>, outputdir: <string>, opt: <table>)
```
:::

### Parameter Description

| Parameter | Description |
|-----------|-------------|
| libraryfile | Required. Input static library file path |
| outputdir | Required. Output directory path |
| opt | Optional. Options |
