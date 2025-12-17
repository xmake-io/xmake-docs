# utils.binary

二进制工具模块。

## utils.binary.deplibs

获取依赖库列表。

### 函数原型

::: tip API
```lua
local deps = deplibs(binaryfile: <string>, opt: <table>)
```
:::

### 参数说明

| 参数 | 描述 |
|------|------|
| binaryfile | 必需。输入二进制文件路径 |
| opt | 可选。选项：<br>- `plat`: 平台 <br>- `arch`: 架构 <br>- `recursive`: 递归获取所有依赖 (默认: false) <br>- `resolve_path`: 解析完整路径 (默认: false) <br>- `resolve_hint_paths`: 查找提示路径 <br>- `resolve_search_paths`: 搜索库路径 (如 LD_LIBRARY_PATH) <br>- `check_cycle`: 检测循环依赖 |

### 返回值说明

| 返回值 | 描述 |
|--------|------|
| <table> | 依赖库列表 |

## utils.binary.readsyms

读取对象文件符号。

### 函数原型

::: tip API
```lua
local syms = readsyms(binaryfile: <string>)
```
:::

### 参数说明

| 参数 | 描述 |
|------|------|
| binaryfile | 必需。输入对象文件路径 |

### 返回值说明

| 返回值 | 描述 |
|--------|------|
| <table> | 符号列表 |

## utils.binary.extractlib

解压静态库到目录。

### 函数原型

::: tip API
```lua
extractlib(libraryfile: <string>, outputdir: <string>, opt: <table>)
```
:::

### 参数说明

| 参数 | 描述 |
|------|------|
| libraryfile | 必需。输入静态库文件路径 |
| outputdir | 必需。输出目录路径 |
| opt | 可选。选项 |
