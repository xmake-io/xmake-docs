---
outline: deep
---

# Package Management

Xmake provides a powerful package management system that allows you to easily install and use third-party libraries.

For more detailed documentation, please refer to [Add Packages](/guide/project-configuration/add-packages).

## Use Fmt

<FileExplorer rootFilesDir="examples/cpp/packages/fmt" />

## Use Boost

<FileExplorer rootFilesDir="examples/cpp/packages/boost" />

## Use OpenSSL

<FileExplorer rootFilesDir="examples/cpp/packages/openssl" />

## Specify Version

We can also specify the version of the package we want to use. By default, xmake uses the latest available version of a package. You can specify a semantic version constraint to require a specific version.

<FileExplorer rootFilesDir="examples/cpp/packages/zlib" />

## Use Shared Library

We can also configure the package to use shared libraries. Some packages support building as shared libraries. You can enable this by passing `{configs = {shared = true}}` to `add_requires`.

<FileExplorer rootFilesDir="examples/cpp/packages/gflags" />
