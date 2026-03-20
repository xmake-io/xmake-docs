
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

C# 规则支持通过 `set_values()` 配置丰富的 .NET 项目属性，这些值会直接映射到 `.csproj` 文件中的对应属性。

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

### 完整配置列表

#### 项目

| 配置名 | .csproj 属性 | 说明 |
|--------|-------------|------|
| `csharp.sdk` | Project Sdk | 项目 SDK 类型，默认 `Microsoft.NET.Sdk`，Web 项目设为 `Microsoft.NET.Sdk.Web` |

#### 常规

| 配置名 | .csproj 属性 | 说明 |
|--------|-------------|------|
| `csharp.target_framework` | TargetFramework | 目标框架，如 `net8.0`，未设置时从 dotnet sdk 自动检测 |
| `csharp.target_frameworks` | TargetFrameworks | 多目标框架，如 `{"net8.0", "net9.0"}`，分号拼接 |
| `csharp.implicit_usings` | ImplicitUsings | 隐式 using，默认 `enable` |
| `csharp.nullable` | Nullable | 可空引用类型，默认 `enable` |
| `csharp.lang_version` | LangVersion | 语言版本，如 `12.0`、`latest` |
| `csharp.root_namespace` | RootNamespace | 根命名空间 |
| `csharp.enable_default_compile_items` | EnableDefaultCompileItems | 启用默认编译项，默认 `false` |
| `csharp.enable_default_embedded_resource_items` | EnableDefaultEmbeddedResourceItems | 启用默认嵌入资源项 |
| `csharp.enable_default_none_items` | EnableDefaultNoneItems | 启用默认 None 项 |

#### 构建

| 配置名 | .csproj 属性 | 说明 |
|--------|-------------|------|
| `csharp.generate_assembly_info` | GenerateAssemblyInfo | 生成程序集信息 |
| `csharp.deterministic` | Deterministic | 确定性构建 |
| `csharp.prefer_32bit` | Prefer32Bit | 优先 32 位 |
| `csharp.allow_unsafe_blocks` | AllowUnsafeBlocks | 允许不安全代码块 |
| `csharp.check_for_overflow_underflow` | CheckForOverflowUnderflow | 检查算术溢出 |

#### 代码分析

| 配置名 | .csproj 属性 | 说明 |
|--------|-------------|------|
| `csharp.analysis_level` | AnalysisLevel | 分析级别 |
| `csharp.enable_net_analyzers` | EnableNETAnalyzers | 启用 .NET 分析器 |
| `csharp.enforce_code_style_in_build` | EnforceCodeStyleInBuild | 构建时强制代码风格 |
| `csharp.warnings_as_errors` | WarningsAsErrors | 将指定警告视为错误（列表） |
| `csharp.warnings_not_as_errors` | WarningsNotAsErrors | 排除的警告错误（列表） |
| `csharp.error_log` | ErrorLog | 错误日志 |
| `csharp.generate_documentation_file` | GenerateDocumentationFile | 生成文档文件 |
| `csharp.documentation_file` | DocumentationFile | 文档文件路径 |

#### 发布与运行时

| 配置名 | .csproj 属性 | 说明 |
|--------|-------------|------|
| `csharp.runtime_identifier` | RuntimeIdentifier | 运行时标识符，如 `win-x64`、`linux-arm64` |
| `csharp.runtime_identifiers` | RuntimeIdentifiers | 多运行时标识符（列表） |
| `csharp.self_contained` | SelfContained | 自包含部署 |
| `csharp.use_app_host` | UseAppHost | 使用应用宿主 |
| `csharp.roll_forward` | RollForward | 运行时前滚策略 |
| `csharp.publish_single_file` | PublishSingleFile | 发布为单文件 |
| `csharp.publish_trimmed` | PublishTrimmed | 发布时裁剪 |
| `csharp.trim_mode` | TrimMode | 裁剪模式 |
| `csharp.publish_ready_to_run` | PublishReadyToRun | ReadyToRun 预编译 |
| `csharp.invariant_globalization` | InvariantGlobalization | 不变全球化 |
| `csharp.include_native_libraries_for_self_extract` | IncludeNativeLibrariesForSelfExtract | 自解压包含原生库 |
| `csharp.enable_compression_in_single_file` | EnableCompressionInSingleFile | 单文件启用压缩 |
| `csharp.publish_aot` | PublishAot | AOT 发布 |
| `csharp.strip_symbols` | StripSymbols | 裁剪符号 |
| `csharp.enable_trim_analyzer` | EnableTrimAnalyzer | 启用裁剪分析器 |
| `csharp.json_serializer_is_reflection_enabled_by_default` | JsonSerializerIsReflectionEnabledByDefault | JSON 序列化反射默认启用 |
| `csharp.satellite_resource_languages` | SatelliteResourceLanguages | 附属资源语言（列表） |

#### 包信息

| 配置名 | .csproj 属性 | 说明 |
|--------|-------------|------|
| `csharp.version` | Version | 包版本 |
| `csharp.assembly_version` | AssemblyVersion | 程序集版本 |
| `csharp.file_version` | FileVersion | 文件版本 |
| `csharp.informational_version` | InformationalVersion | 信息版本 |
| `csharp.package_id` | PackageId | 包 ID |
| `csharp.authors` | Authors | 作者 |
| `csharp.company` | Company | 公司 |
| `csharp.product` | Product | 产品名 |
| `csharp.description` | Description | 描述 |
| `csharp.copyright` | Copyright | 版权 |
| `csharp.repository_url` | RepositoryUrl | 仓库 URL |
| `csharp.repository_type` | RepositoryType | 仓库类型 |
| `csharp.package_license_expression` | PackageLicenseExpression | 包许可证表达式 |
| `csharp.package_project_url` | PackageProjectUrl | 包项目 URL |
| `csharp.neutral_language` | NeutralLanguage | 中性语言 |
| `csharp.enable_preview_features` | EnablePreviewFeatures | 启用预览特性 |

#### 输出

| 配置名 | .csproj 属性 | 说明 |
|--------|-------------|------|
| `csharp.generate_runtime_configuration_files` | GenerateRuntimeConfigurationFiles | 生成运行时配置文件 |
| `csharp.copy_local_lock_file_assemblies` | CopyLocalLockFileAssemblies | 复制本地锁定文件程序集 |
| `csharp.append_target_framework_to_output_path` | AppendTargetFrameworkToOutputPath | 输出路径追加目标框架，默认 `false` |
| `csharp.append_runtime_identifier_to_output_path` | AppendRuntimeIdentifierToOutputPath | 输出路径追加运行时标识符，默认 `false` |
| `csharp.produce_reference_assembly` | ProduceReferenceAssembly | 生成引用程序集 |
| `csharp.disable_implicit_framework_references` | DisableImplicitFrameworkReferences | 禁用隐式框架引用 |
| `csharp.generate_target_framework_attribute` | GenerateTargetFrameworkAttribute | 生成目标框架属性 |

#### 自定义属性

| 配置名 | 说明 |
|--------|------|
| `csharp.properties` | 添加自定义 `<PropertyGroup>` 属性，格式为 `"Name=Value"` |

```lua
set_values("csharp.properties", "MyCustomProp=value", "AnotherProp=value2")
```
