# 性能优化 {#performance}

## 并行编译

我们可以通过 `xmake -j N` 指定同时构建的任务并行度，来加速编译。

不过默认情况下，Xmake 已经开启此特性，会自动根据当前机器的 CPU Core 资源自动评估并分配需要并行的任务数。

## 编译缓存加速

Xmake 默认开启了本地编译缓存，这在 Linux/macOS 上提速效果非常明显。

不过在 Windows 上，由于启动进程太重，并且 msvc 内置的预处理器太慢，因此目前默认对 msvc 禁用了本地缓存。

另外，除了本地缓存，Xmake 还提供远程缓存支持，这在多台机器上共享编译缓存时非常有用。

关于这个特性的详细介绍，可以看下文档：[编译缓存](/zh/guide/extras/build-cache)。

## Unity Build 编译加速

对于 C++ 构建，我们还可以配置开启 Unity Build 编译，将多个 C++ 源码合并到一个源文件中进行编译，以减少头文件的解析时间，效果也比较明显。

详情见：[Unity Build 编译](/zh/guide/extras/unity-build)。

## 分布式编译

对于超大型的工程，我们还可以通过增加多台编译服务器，通过分布式编译特性来加速编译。

详情见：[分布式编译](/zh/guide/extras/distributed-compilation)。
