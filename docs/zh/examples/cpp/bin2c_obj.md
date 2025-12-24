---
outline: deep
---

# Bin2c/Bin2obj

我们可以使用 `utils.bin2c` 和 `utils.bin2obj` 规则将二进制文件嵌入到 C/C++ 代码中。

## Bin2c

`utils.bin2c` 规则会生成一个包含二进制数据的 C 数组的头文件。

<FileExplorer rootFilesDir="examples/utils/bin2c" />

## Bin2obj

`utils.bin2obj` 规则直接将二进制文件编译为对象文件，并暴露符号以供访问。

相比 `bin2c`，`bin2obj` 在处理大文件时更加快速高效，因为它跳过了 C 编译器的解析步骤。

<FileExplorer rootFilesDir="examples/utils/bin2obj" />
