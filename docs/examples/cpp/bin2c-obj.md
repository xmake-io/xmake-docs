---
outline: deep
---

# Bin2c/Bin2obj

We can use `utils.bin2c` and `utils.bin2obj` rules to embed binary files into C/C++ code.

## Bin2c

The `utils.bin2c` rule generates a header file containing the binary data as a C array.

<FileExplorer rootFilesDir="examples/utils/bin2c" />

## Bin2obj

The `utils.bin2obj` rule compiles the binary file directly into an object file, and exposes symbols for access.

Compared to `bin2c`, `bin2obj` is faster and more efficient for processing large binary files because it skips the C compiler's parsing step.

<FileExplorer rootFilesDir="examples/utils/bin2obj" />
