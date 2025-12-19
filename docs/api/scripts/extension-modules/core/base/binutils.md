# core.base.binutils

Binary file processing utility module.

## binutils.bin2c

Generate C/C++ code from binary file.

### Function Prototype

::: tip API
```lua
binutils.bin2c(binaryfile: <string>, outputfile: <string>, opt: <table>)
```
:::

### Parameter Description

| Parameter | Description |
|-----------|-------------|
| binaryfile | Required. Input binary file path |
| outputfile | Required. Output C/C++ source file path |
| opt | Optional. Options: <br>- `linewidth`: line width (default: 32) <br>- `nozeroend`: do not append null terminator (default: false) |

## binutils.bin2obj

Generate object file from binary file.

### Function Prototype

::: tip API
```lua
binutils.bin2obj(binaryfile: <string>, outputfile: <string>, opt: <table>)
```
:::

### Parameter Description

| Parameter | Description |
|-----------|-------------|
| binaryfile | Required. Input binary file path |
| outputfile | Required. Output object file path |
| opt | Optional. Options: <br>- `format`: object format (coff, elf, macho) <br>- `symbol_prefix`: symbol prefix (default: `_binary_`) <br>- `arch`: architecture (default: x86_64) <br>- `plat`: platform (default: macosx, only for macho) <br>- `basename`: base name for symbols <br>- `target_minver`: target minimum version (only for macho) <br>- `xcode_sdkver`: Xcode SDK version (only for macho) <br>- `zeroend`: append null terminator (default: false) |

## binutils.readsyms

Read symbols from object file (auto-detect format: COFF, ELF, or Mach-O).

### Function Prototype

::: tip API
```lua
binutils.readsyms(binaryfile: <string>)
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

## binutils.deplibs

Get dependent libraries.

### Function Prototype

::: tip API
```lua
binutils.deplibs(binaryfile: <string>)
```
:::

### Parameter Description

| Parameter | Description |
|-----------|-------------|
| binaryfile | Required. Input binary file path |

### Return Value

| Return Value | Description |
|--------------|-------------|
| `<table>` | Dependent libraries list |

## binutils.rpath_list

Get rpath list from binary file (auto-detect format: ELF or Mach-O).

### Function Prototype

::: tip API
```lua
binutils.rpath_list(binaryfile: <string>)
```
:::

### Parameter Description

| Parameter | Description |
|-----------|-------------|
| binaryfile | Required. Input binary file path |

### Return Value

| Return Value | Description |
|--------------|-------------|
| `<table>` | Rpath list |

## binutils.extractlib

Extract static library to directory.

### Function Prototype

::: tip API
```lua
binutils.extractlib(libraryfile: <string>, outputdir: <string>, opt: <table>)
```
:::

### Parameter Description

| Parameter | Description |
|-----------|-------------|
| libraryfile | Required. Input static library file path |
| outputdir | Required. Output directory path |
| opt | Optional. Options (reserved) |
