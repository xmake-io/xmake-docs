---
outline: deep
---

# GLSL/HLSL to SPIR-V

We can use `utils.glsl2spv` rules to compile GLSL/HLSL shaders to SPIR-V.

## GLSL to SPIR-V

<FileExplorer rootFilesDir="examples/cpp/graphics/glsl2spv/glsl" />

## HLSL to SPIR-V

We can also use `utils.hlsl2spv` rule to compile HLSL to SPIR-V.

<FileExplorer rootFilesDir="examples/cpp/graphics/glsl2spv/hlsl" />

## Bin2obj Mode

By default, the rule may use `bin2c` to embed the SPV data. We can switch to `bin2obj` mode for better performance with large shaders:

<FileExplorer rootFilesDir="examples/cpp/graphics/glsl2spv/glsl_bin2obj" />
