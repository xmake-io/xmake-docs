# core.base.binutils

二进制文件处理工具模块。

## binutils.bin2c

从二进制文件生成 C/C++ 代码。

### 函数原型

::: tip API
```lua
binutils.bin2c(binaryfile: <string>, outputfile: <string>, opt: <table>)
```
:::

### 参数说明

| 参数 | 描述 |
|------|------|
| binaryfile | 必需。输入二进制文件路径 |
| outputfile | 必需。输出 C/C++ 源文件路径 |
| opt | 可选。选项：<br>- `linewidth`: 行宽 (默认: 32) <br>- `nozeroend`: 不追加空终止符 (默认: false) |

## binutils.bin2obj

从二进制文件生成对象文件。

### 函数原型

::: tip API
```lua
binutils.bin2obj(binaryfile: <string>, outputfile: <string>, opt: <table>)
```
:::

### 参数说明

| 参数 | 描述 |
|------|------|
| binaryfile | 必需。输入二进制文件路径 |
| outputfile | 必需。输出对象文件路径 |
| opt | 可选。选项：<br>- `format`: 对象格式 (coff, elf, macho) <br>- `symbol_prefix`: 符号前缀 (默认: `_binary_`) <br>- `arch`: 架构 (默认: x86_64) <br>- `plat`: 平台 (默认: macosx, 仅限 macho) <br>- `basename`: 符号基名 <br>- `target_minver`: 目标最小版本 (仅限 macho) <br>- `xcode_sdkver`: Xcode SDK 版本 (仅限 macho) <br>- `zeroend`: 追加空终止符 (默认: false) |

::: tip NOTE
尽管自带规则[`util.bin2obj`](https://xmake.io/zh/api/scripts/extension-modules/core/base/binutils.html#binutils-bin2obj)会自动探测目标的架构和平台，`binutils.bin2obj`需要调用者手动获取并传递架构（`arch`）和平台（`plat`）等参数。在绝大多数场景中，可使用`target:arch()`和`target:plat()`轻松获取这些参数。
:::

### 符号名称

与[`util.bin2obj`](https://xmake.io/zh/api/scripts/extension-modules/core/base/binutils.html#binutils-bin2obj)不同，`binutils.bin2obj`生成的目标文件提供`<symbol_prefix><basename>_start`和`<symbol_prefix><basename>_end`符号，分别代表二进制数据的起始地址和终止地址。参考以下用例：（`symbol_prefix = "_foo_"`, `basename = "bar"`, `C++20`）

```cpp
#include <span>

extern "C"
{
    extern const std::byte _foo_bar_start;
    extern const std::byte _foo_bar_end;
}

void example()
{
    std::span<const std::byte> data = {&_foo_bar_start, &_foo_bar_end};
}
```

## binutils.readsyms

读取对象文件符号（自动检测格式：COFF, ELF, 或 Mach-O）。

### 函数原型

::: tip API
```lua
binutils.readsyms(binaryfile: <string>)
```
:::

### 参数说明

| 参数 | 描述 |
|------|------|
| binaryfile | 必需。输入对象文件路径 |

### 返回值说明

| 返回值 | 描述 |
|--------|------|
| `<table>` | 符号列表 |

## binutils.deplibs

获取依赖库列表。

### 函数原型

::: tip API
```lua
binutils.deplibs(binaryfile: <string>)
```
:::

### 参数说明

| 参数 | 描述 |
|------|------|
| binaryfile | 必需。输入二进制文件路径 |

### 返回值说明

| 返回值 | 描述 |
|--------|------|
| `<table>` | 依赖库列表 |

## binutils.rpath_list

从二进制文件获取 rpath 列表（自动检测格式：ELF 或 Mach-O）。

### 函数原型

::: tip API
```lua
binutils.rpath_list(binaryfile: <string>)
```
:::

### 参数说明

| 参数 | 描述 |
|------|------|
| binaryfile | 必需。输入二进制文件路径 |

### 返回值说明

| 返回值 | 描述 |
|--------|------|
| `<table>` | rpath 列表 |

## binutils.extractlib

解压静态库到目录。

### 函数原型

::: tip API
```lua
binutils.extractlib(libraryfile: <string>, outputdir: <string>, opt: <table>)
```
:::

### 参数说明

| 参数 | 描述 |
|------|------|
| libraryfile | 必需。输入静态库文件路径 |
| outputdir | 必需。输出目录路径 |
| opt | 可选。选项（保留） |
