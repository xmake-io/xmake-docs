
创建一个空工程：

```bash
$ xmake create -P test -l cuda
$ cd test
$ xmake
```

```lua
target("cuda_console")
    set_kind("binary")
    add_files("src/*.cu")
    -- generate SASS code for SM architecture of current host
    add_cugencodes("native")
    -- generate PTX code for the virtual architecture to guarantee compatibility
    add_cugencodes("compute_30")
```

::: tip 注意
从v2.2.7版本开始，默认构建会启用device-link。（参见 [Separate Compilation and Linking of CUDA C++ Device Code](https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/)）
如果要显式禁用device-link，可以通过 `set_policy("build.cuda.devlink", false)` 来设置。
:::

::: tip 注意
cuda 源文件中的 device 函数需要被 device-link 且只 device-link 一次。在 `shared` 或 `binary` 的 target 上 xmake 会自动进行 device-link ，这时它们依赖的 `static` target 也会同时被 device-link ，因此默认情况下 `static` target 不会被 device-link。然而，如果最终的 `shared` 或 `binary` 的 target 不包含任何 cuda 源文件，则不会发生 device-link 阶段，导致出现 undefined reference 错误。这种情况下，需要手动为 `static` target 指定 `add_values("cuda.build.devlink", true)`.
:::

默认会自动探测 Cuda 环境，当然也可以指定 Cuda SDK 环境目录，或者指定 Cuda 版本（此时将在默认安装目录进行查找）：

```bash
$ xmake f --cuda=/usr/local/cuda-9.1/
$ xmake f --cuda=9.1
$ xmake
```

更多详情可以参考：[#158](https://github.com/xmake-io/xmake/issues/158)
