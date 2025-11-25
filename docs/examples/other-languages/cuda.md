
### Create an empty project

```sh
$ xmake create -P test -l cuda
$ cd test
$ xmake
```

```lua
-- define target
target("cuda_console")
    set_kind("binary")
    add_files("src/*.cu")
    -- generate SASS code for SM architecture of current host
    add_cugencodes("native")
    -- generate PTX code for the virtual architecture to guarantee compatibility
    add_cugencodes("compute_30")
```

::: tip NOTE
Starting with v2.2.7, the default build will enable device-link. (see [Separate Compilation and Linking of CUDA C++ Device Code](https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/))
If you want to disable device-link, you can set it with `set_policy("build.cuda.devlink", false)`.
:::

::: tip NOTE
Device functions in cuda source files should be device-linked once and only once. On targets with kind `binary` or `shared` xmake will automatically perform the device-link which takes the static libraries they depend into account, while for `static` targets by default will not be device-linked. However, if the final `binary` or `shared` target do not contain any cuda files, the device-link stage could be missing, resulting in an undefined reference error. In this case the static target should be set `add_values("cuda.build.devlink", true)` manually.
:::

Xmake will detect Cuda SDK automatically and we can also set the SDK directory (or SDK version for default installations) manually.

```sh
$ xmake f --cuda=/usr/local/cuda-9.1/
$ xmake f --cuda=9.1
$ xmake
```

### Specify CUDA SDK Version

Starting from v3.0.5, you can specify the CUDA SDK version for a specific target via the `cuda.sdkver` configuration option, giving you precise control over CUDA compilation:

```lua
target("cuda_app")
    set_kind("binary")
    add_files("src/*.cu")
    add_rules("cuda")
    set_values("cuda.sdkver", "12.0")  -- Specify CUDA SDK version
```

You can also combine it with compute capability settings for specific GPU architectures:

```lua
target("cuda_app")
    set_kind("binary")
    add_files("src/*.cu")
    add_rules("cuda")
    set_values("cuda.sdkver", "12.0")
    set_values("cuda.arch", "sm_75", "sm_80", "sm_86")
```

Different targets can use different CUDA versions:

```lua
-- Target using CUDA 11.8
target("cuda11_app")
    set_kind("binary")
    add_files("src/cuda11/*.cu")
    add_rules("cuda")
    set_values("cuda.sdkver", "11.8")

-- Target using CUDA 12.0
target("cuda12_app")
    set_kind("binary")
    add_files("src/cuda12/*.cu")
    add_rules("cuda")
    set_values("cuda.sdkver", "12.0")
```

If you want to known more information, you can see [#158](https://github.com/xmake-io/xmake/issues/158) and [#6964](https://github.com/xmake-io/xmake/pull/6964).
