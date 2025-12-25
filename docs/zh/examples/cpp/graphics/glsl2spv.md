---
outline: deep
---

# GLSL/HLSL 转 SPIR-V

我们可以使用 `utils.glsl2spv` 规则将 GLSL/HLSL 着色器编译为 SPIR-V。

## GLSL 转 SPIR-V

<FileExplorer rootFilesDir="examples/cpp/graphics/glsl2spv/glsl" />

## HLSL 转 SPIR-V

我们也可以使用 `utils.hlsl2spv` 规则来编译 HLSL 到 SPIR-V。

<FileExplorer rootFilesDir="examples/cpp/graphics/glsl2spv/hlsl" />

## Bin2obj 模式

默认情况下，该规则可能使用 `bin2c` 来嵌入 SPV 数据。我们可以切换到 `bin2obj` 模式以在处理大型着色器时获得更好的性能：

<FileExplorer rootFilesDir="examples/cpp/graphics/glsl2spv/glsl_bin2obj" />
