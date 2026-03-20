
下面我们简单介绍一些 C# 语言常用的工程例子。

关于 C# 目标配置的详细说明，请参阅[配置目标](/zh/guide/project-configuration/configure-targets)和[项目目标 API](/zh/api/description/project-target)。

## 控制台应用 {#console}

<FileExplorer
  rootFilesDir="examples/other-languages/csharp/console"
/>

## 共享库 {#shared-library}

<FileExplorer
  rootFilesDir="examples/other-languages/csharp/shared_library"
/>

通过 `add_deps` 将一个 C# 共享库自动链接到可执行程序。

## NuGet 包集成 {#nuget-package}

<FileExplorer
  rootFilesDir="examples/other-languages/csharp/nuget_package"
/>

通过 `add_requires("nuget::xxx")` 集成 NuGet 包，使用方式与 C/C++ 包一致。

## C# 与 C/C++ 互操作 (P/Invoke) {#pinvoke}

<FileExplorer
  rootFilesDir="examples/other-languages/csharp/pinvoke"
/>

xmake 支持 C# 通过 P/Invoke 调用 C/C++ 原生库，并自动处理原生共享库的搜索路径（`PATH`/`LD_LIBRARY_PATH`/`DYLD_LIBRARY_PATH`），无需手动配置。

## ASP.NET Core Web 项目 {#aspnet-web}

通过 `csharp.sdk` 设置 SDK 类型即可构建 ASP.NET Core Web 项目：

```lua
target("webapp")
    set_kind("binary")
    add_values("csharp.sdk", "Microsoft.NET.Sdk.Web")
    add_files("src/Program.cs")
```

## 配置选项 {#configuration}

C# 规则支持通过 `set_values()` 配置丰富的 .NET 项目属性：

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
