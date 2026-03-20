
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

The C# rule supports a wide range of .NET project properties via `set_values()`. These values are directly mapped to the corresponding properties in the `.csproj` file.

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

### Full Configuration Reference

#### Project

| Config Name | .csproj Property | Description |
|-------------|-----------------|-------------|
| `csharp.sdk` | Project Sdk | Project SDK type, default `Microsoft.NET.Sdk`, set to `Microsoft.NET.Sdk.Web` for web projects |

#### General

| Config Name | .csproj Property | Description |
|-------------|-----------------|-------------|
| `csharp.target_framework` | TargetFramework | Target framework, e.g. `net8.0`, auto-detected from dotnet sdk if not set |
| `csharp.target_frameworks` | TargetFrameworks | Multi-target frameworks, e.g. `{"net8.0", "net9.0"}`, semicolon-joined |
| `csharp.implicit_usings` | ImplicitUsings | Implicit usings, default `enable` |
| `csharp.nullable` | Nullable | Nullable reference types, default `enable` |
| `csharp.lang_version` | LangVersion | Language version, e.g. `12.0`, `latest` |
| `csharp.root_namespace` | RootNamespace | Root namespace |
| `csharp.enable_default_compile_items` | EnableDefaultCompileItems | Enable default compile items, default `false` |
| `csharp.enable_default_embedded_resource_items` | EnableDefaultEmbeddedResourceItems | Enable default embedded resource items |
| `csharp.enable_default_none_items` | EnableDefaultNoneItems | Enable default None items |

#### Build

| Config Name | .csproj Property | Description |
|-------------|-----------------|-------------|
| `csharp.generate_assembly_info` | GenerateAssemblyInfo | Generate assembly info |
| `csharp.deterministic` | Deterministic | Deterministic build |
| `csharp.prefer_32bit` | Prefer32Bit | Prefer 32-bit |
| `csharp.allow_unsafe_blocks` | AllowUnsafeBlocks | Allow unsafe code blocks |
| `csharp.check_for_overflow_underflow` | CheckForOverflowUnderflow | Check for arithmetic overflow |

#### Code Analysis

| Config Name | .csproj Property | Description |
|-------------|-----------------|-------------|
| `csharp.analysis_level` | AnalysisLevel | Analysis level |
| `csharp.enable_net_analyzers` | EnableNETAnalyzers | Enable .NET analyzers |
| `csharp.enforce_code_style_in_build` | EnforceCodeStyleInBuild | Enforce code style in build |
| `csharp.warnings_as_errors` | WarningsAsErrors | Treat specified warnings as errors (list) |
| `csharp.warnings_not_as_errors` | WarningsNotAsErrors | Exclude warnings from errors (list) |
| `csharp.error_log` | ErrorLog | Error log |
| `csharp.generate_documentation_file` | GenerateDocumentationFile | Generate documentation file |
| `csharp.documentation_file` | DocumentationFile | Documentation file path |

#### Publish & Runtime

| Config Name | .csproj Property | Description |
|-------------|-----------------|-------------|
| `csharp.runtime_identifier` | RuntimeIdentifier | Runtime identifier, e.g. `win-x64`, `linux-arm64` |
| `csharp.runtime_identifiers` | RuntimeIdentifiers | Multiple runtime identifiers (list) |
| `csharp.self_contained` | SelfContained | Self-contained deployment |
| `csharp.use_app_host` | UseAppHost | Use app host |
| `csharp.roll_forward` | RollForward | Runtime roll-forward policy |
| `csharp.publish_single_file` | PublishSingleFile | Publish as single file |
| `csharp.publish_trimmed` | PublishTrimmed | Trim on publish |
| `csharp.trim_mode` | TrimMode | Trim mode |
| `csharp.publish_ready_to_run` | PublishReadyToRun | ReadyToRun pre-compilation |
| `csharp.invariant_globalization` | InvariantGlobalization | Invariant globalization |
| `csharp.include_native_libraries_for_self_extract` | IncludeNativeLibrariesForSelfExtract | Include native libraries for self-extract |
| `csharp.enable_compression_in_single_file` | EnableCompressionInSingleFile | Enable compression in single file |
| `csharp.publish_aot` | PublishAot | AOT publish |
| `csharp.strip_symbols` | StripSymbols | Strip symbols |
| `csharp.enable_trim_analyzer` | EnableTrimAnalyzer | Enable trim analyzer |
| `csharp.json_serializer_is_reflection_enabled_by_default` | JsonSerializerIsReflectionEnabledByDefault | JSON serializer reflection enabled by default |
| `csharp.satellite_resource_languages` | SatelliteResourceLanguages | Satellite resource languages (list) |

#### Package Info

| Config Name | .csproj Property | Description |
|-------------|-----------------|-------------|
| `csharp.version` | Version | Package version |
| `csharp.assembly_version` | AssemblyVersion | Assembly version |
| `csharp.file_version` | FileVersion | File version |
| `csharp.informational_version` | InformationalVersion | Informational version |
| `csharp.package_id` | PackageId | Package ID |
| `csharp.authors` | Authors | Authors |
| `csharp.company` | Company | Company |
| `csharp.product` | Product | Product name |
| `csharp.description` | Description | Description |
| `csharp.copyright` | Copyright | Copyright |
| `csharp.repository_url` | RepositoryUrl | Repository URL |
| `csharp.repository_type` | RepositoryType | Repository type |
| `csharp.package_license_expression` | PackageLicenseExpression | Package license expression |
| `csharp.package_project_url` | PackageProjectUrl | Package project URL |
| `csharp.neutral_language` | NeutralLanguage | Neutral language |
| `csharp.enable_preview_features` | EnablePreviewFeatures | Enable preview features |

#### Output

| Config Name | .csproj Property | Description |
|-------------|-----------------|-------------|
| `csharp.generate_runtime_configuration_files` | GenerateRuntimeConfigurationFiles | Generate runtime configuration files |
| `csharp.copy_local_lock_file_assemblies` | CopyLocalLockFileAssemblies | Copy local lock file assemblies |
| `csharp.append_target_framework_to_output_path` | AppendTargetFrameworkToOutputPath | Append target framework to output path, default `false` |
| `csharp.append_runtime_identifier_to_output_path` | AppendRuntimeIdentifierToOutputPath | Append runtime identifier to output path, default `false` |
| `csharp.produce_reference_assembly` | ProduceReferenceAssembly | Produce reference assembly |
| `csharp.disable_implicit_framework_references` | DisableImplicitFrameworkReferences | Disable implicit framework references |
| `csharp.generate_target_framework_attribute` | GenerateTargetFrameworkAttribute | Generate target framework attribute |

#### Custom Properties

| Config Name | Description |
|-------------|-------------|
| `csharp.properties` | Add custom `<PropertyGroup>` entries, format: `"Name=Value"` |

```lua
set_values("csharp.properties", "MyCustomProp=value", "AnotherProp=value2")
```
