
Here are some common project examples for C# language.

For detailed C# target configuration, see [Configure Targets](/guide/project-configuration/configure-targets) and [Project Target API](/api/description/project-target).

## Console Application {#console}

<FileExplorer
  rootFilesDir="examples/other-languages/csharp/console"
/>

## Shared Library {#shared-library}

<FileExplorer
  rootFilesDir="examples/other-languages/csharp/shared_library"
/>

Use `add_deps` to automatically link a C# shared library to the executable.

## NuGet Package Integration {#nuget-package}

<FileExplorer
  rootFilesDir="examples/other-languages/csharp/nuget_package"
/>

Integrate NuGet packages via `add_requires("nuget::xxx")`, using the same approach as C/C++ packages.

## C# and C/C++ Interop (P/Invoke) {#pinvoke}

<FileExplorer
  rootFilesDir="examples/other-languages/csharp/pinvoke"
/>

Xmake supports C# calling C/C++ native libraries via P/Invoke, and automatically handles native shared library search paths (`PATH`/`LD_LIBRARY_PATH`/`DYLD_LIBRARY_PATH`) without manual configuration.

## ASP.NET Core Web Project {#aspnet-web}

Set the SDK type via `csharp.sdk` to build ASP.NET Core web projects:

```lua
target("webapp")
    set_kind("binary")
    add_values("csharp.sdk", "Microsoft.NET.Sdk.Web")
    add_files("src/Program.cs")
```

## Configuration Options {#configuration}

The C# rule supports a wide range of .NET project properties via `set_values()`:

```lua
target("app")
    set_kind("binary")
    add_files("src/*.cs")
    set_values("csharp.target_framework", "net8.0")
    set_values("csharp.lang_version", "12")
    set_values("csharp.nullable", "enable")
    set_values("csharp.allow_unsafe_blocks", true)
    set_values("csharp.publish_single_file", true)
    set_values("csharp.publish_trimmed", true)
```
