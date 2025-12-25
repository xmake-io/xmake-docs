---
outline: deep
---

# 包管理

Xmake 提供了一个强大的包管理系统，允许你轻松安装和使用第三方库。

更多详细文档，请参考 [添加依赖包](/zh/guide/project-configuration/add-packages)。

## 使用 Fmt

<FileExplorer rootFilesDir="examples/cpp/packages/fmt" />

## 使用 Boost

<FileExplorer rootFilesDir="examples/cpp/packages/boost" />

## 使用 OpenSSL

<FileExplorer rootFilesDir="examples/cpp/packages/openssl" />

## 指定版本

我们也可以指定我们想要使用的包的版本。默认情况下，xmake 使用包的最新可用版本。你可以指定语义版本约束来请求特定版本。

<FileExplorer rootFilesDir="examples/cpp/packages/zlib" />

## 使用动态库

我们还可以配置包以使用动态库。一些包支持编译为动态库。你可以通过向 `add_requires` 传递 `{configs = {shared = true}}` 来启用此功能。

<FileExplorer rootFilesDir="examples/cpp/packages/gflags" />
