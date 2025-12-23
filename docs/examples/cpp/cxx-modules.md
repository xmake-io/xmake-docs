# C++ Modules Usage & Examples

## Introduction

Xmake uses `.mpp` as the default module extension, but also supports `.ixx`, `.cppm`, `.mxx`, etc. It fully supports C++20 Modules with gcc11/clang/msvc, and can automatically analyze module dependencies for maximum parallel compilation.

## Basic Example

<FileExplorer rootFilesDir="examples/cpp/modules/basic" />

## Class Example

Exporting classes in modules:

<FileExplorer rootFilesDir="examples/cpp/modules/class" />

## Module Partitions

Using module partitions:

<FileExplorer rootFilesDir="examples/cpp/modules/partition" />

## Shared Library Modules

Creating a shared library with modules:

<FileExplorer rootFilesDir="examples/cpp/modules/shared_library" />

## Cross-Target Dependency

Modules dependency between targets:

<FileExplorer rootFilesDir="examples/cpp/modules/cross_target" />

## Private Module Fragment

Using private module fragment to hide implementation details:

<FileExplorer rootFilesDir="examples/cpp/modules/private_fragment" />

## Module Implementation Unit

Separating module interface and implementation:

<FileExplorer rootFilesDir="examples/cpp/modules/implementation_unit" />

## Module Aggregation

Using `export import` to aggregate submodules:

<FileExplorer rootFilesDir="examples/cpp/modules/aggregation" />

## Cpp-only Project with Modules

From v2.7.1, Headerunits are supported. Normally, at least one `.mpp` file is needed to enable modules, but you can also force it:

<FileExplorer rootFilesDir="examples/cpp/modules/cpp_only" />

## Headerunits Example

See [headerunits example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules/headerunits) for how to use STL or custom headers as headerunits.

<FileExplorer rootFilesDir="examples/cpp/modules/headerunits" />

## C++23 Standard Library Modules

Support for C++23 stdmodules:

<FileExplorer rootFilesDir="examples/cpp/modules/stdmodules" />

## Module Package Distribution

Define and distribute a C++ Modules package:

<FileExplorer rootFilesDir="examples/cpp/modules/distribution" defaultOpenPath="src/xmake.lua" :highlights="{'src/xmake.lua': '8-9'}" />

## Module Package Integration

Quickly integrate with `add_requires("foo")`:

<FileExplorer rootFilesDir="examples/cpp/modules/integration" />

> More official examples: [C++ Modules Examples](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules)
