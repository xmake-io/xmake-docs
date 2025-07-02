# Performance Optimization {#performance}

## Parallel Compilation

We can speed up compilation by specifying the parallelism of tasks to be built simultaneously with `xmake -j N`.

However, by default, Xmake has enabled this feature, and will automatically evaluate and allocate the number of tasks that need to be parallelized based on the CPU core resources of the current machine.

## Compilation Cache Acceleration

Xmake enables local compilation cache by default, which has a very obvious speed-up effect on Linux/macOS.

However, on Windows, the startup process is too heavy and the built-in preprocessor of MSVC is too slow, so the local cache is currently disabled for MSVC by default.

In addition to local cache, Xmake also provides support for remote cache, which is very useful when sharing compilation cache on multiple machines.

For a detailed introduction to this feature, see the document: [Compilation Cache](/guide/extras/build-cache).

## Unity Build compilation acceleration

For C++ builds, we can also configure Unity Build compilation to merge multiple C++ source files into one source file for compilation to reduce the parsing time of header files, and the effect is also obvious.

For details, see: [Unity Build compilation](/guide/extras/unity-build)

## Distributed compilation

For super large projects, we can also speed up compilation by adding multiple compilation servers and using the distributed compilation feature.

For details, see: [Distributed compilation](/guide/extras/distributed-compilation)
