# 包实例 {#package-instance}

此页面描述了 [包依赖管理](/zh/api/description/package-dependencies) 的 `on_load()`、`on_install()` 或 `on_test()` 等函数的 `package` 接口

## package:name

- 获取包的名字

#### 函数原型

::: tip API
```lua
package:name()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:get

- 获取包在描述域的配置值

#### 函数原型

::: tip API
```lua
package:get(key: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| key | 配置键名 |

#### 用法说明


任何在描述域的 `set_xxx` 和 `add_xxx` 配置值都可以通过这个接口获取到。

```lua
-- get the dependencies
package:get("deps")
-- get the links
package:get("links")
-- get the defined macros
package:get("defines")
```

## package:set

- 设置包的配置值

#### 函数原型

::: tip API
```lua
package:set(key: <string>, value: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| key | 配置键名 |
| value | 配置值 |

#### 用法说明


如果你想添加值可以用 [package:add](#package-add)。

```lua
-- set the dependencies
package:set("deps", "python")
-- set the links
package:set("links", "sdl2")
-- set the defined macros
package:set("defines", "SDL_MAIN_HANDLED")
```

::: tip 注意
任何脚本域下对 `package:set("xxx", ...)` 的配置，都是完全跟描述域的 `set_xxx` 接口保持一致的，具体参数说明，可以直接参考描述域下对应的 `set_xxx` 接口说明。

例如：
- 描述域：`set_urls("https://github.com/madler/zlib/archive/$(version).tar.gz")`
- 脚本域：`package:set("urls", "https://github.com/madler/zlib/archive/$(version).tar.gz")`
:::

## package:add

- 按名称添加到包的值

#### 函数原型

::: tip API
```lua
package:add(key: <string>, value: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| key | 配置键名 |
| value | 要添加的值 |

#### 用法说明


```lua
-- add dependencies
package:add("deps", "python")
-- add links
package:add("links", "sdl2")
-- add defined macros
package:add("defines", "SDL_MAIN_HANDLED")
```

::: tip 注意
任何脚本域下对 `package:add("xxx", ...)` 的配置，都是完全跟描述域的 `add_xxx` 接口保持一致的，具体参数说明，可以直接参考描述域下对应的 `add_xxx` 接口说明。

例如：
- 描述域：`add_deps("zlib", {configs = {shared = true}})`
- 脚本域：`package:add("deps", "zlib", {configs = {shared = true}})`
:::

## package:license

- 获取包的许可证（同`package:get("license")`）

#### 函数原型

::: tip API
```lua
package:license()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:description

- 获取包的描述（同`package:get("description")`）

#### 函数原型

::: tip API
```lua
package:description()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:plat

- 获取包的平台。 可以是以下任何一种：

#### 函数原型

::: tip API
```lua
package:plat()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

  + windows
  + linux
  + macosx
  + android
  + iphoneos
  + watchos
  + mingw
  + cygwin
  + bsd

如果包是二进制的，则会返回 [`os.host`](/zh/api/scripts/builtin-modules/os#os-host) 的值

## package:arch

- 获取包的架构（例如 x86、x64、x86_64）

#### 函数原型

::: tip API
```lua
package:arch()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


如果包是二进制的，则返回 [`os.arch`](/zh/api/scripts/builtin-modules/os#os-arch)

## package:targetos

- 获取包的目标操作系统。

#### 函数原型

::: tip API
```lua
package:targetos()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


可以具有与 [package:plat](#package-plat) 相同的值

## package:targetarch

- 获取包的目标架构。

#### 函数原型

::: tip API
```lua
package:targetarch()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


可以具有与 [package:arch](#package-arch) 相同的值

## package:is_plat

- 当前平台是否是给定平台之一

#### 函数原型

::: tip API
```lua
package:is_plat(plat: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| plat | 平台名称 |

#### 用法说明


```lua
-- Is the current platform android?
package:is_plat("android")
-- Is the current platform windows, linux or macosx?
package:is_plat("windows", "linux", "macosx")
```

## package:is_arch

- 当前架构是否是给定架构之一

#### 函数原型

::: tip API
```lua
package:is_arch(arch: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| arch | 架构名称 |

#### 用法说明


```lua
-- Is the current architecture x86
package:is_arch("x86")
-- Is the current architecture x64 or x86_64
package:is_arch("x64", "x86_64")
```

## package:is_targetos

- 当前目标操作系统是否是给定操作系统之一

#### 函数原型

::: tip API
```lua
package:is_targetos()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


```lua
-- Is the currently targeted OS windows?
package:is_targetos("windows")
-- Is the currently targeted OS android or iphoneos?
package:is_targetos("android", "iphoneos")
```

## package:is_targetarch

- 当前目标架构是否是给定架构之一

#### 函数原型

::: tip API
```lua
package:is_targetarch()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


```lua
-- Is the currently targeted architecture x86
package:is_targetarch("x86")
-- Is the currently targeted architecture x64 or x86_64
package:is_targetarch("x64", "x86_64")
```

## package:alias

- 获取包的别名

#### 函数原型

::: tip API
```lua
package:alias()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


如果用户像这样设置别名：

```lua
add_requires("libsdl", {alias = "sdl"})
```

那么这个别名可以通过这个接口获取到：

```lua
-- returns "sdl"
package:alias()
```

## package:urls

- 获取包的 urls 列表

#### 函数原型

::: tip API
```lua
package:urls()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


如果我们设置了如下 URLs

```lua
add_urls("https://example.com/library-$(version).zip")
-- or so
set_urls("https://example.com/library-$(version).zip")
```

那么我们可以通过下面的接口来获取

```lua
-- returns the table {"https://example.com/library-$(version).zip"}
package:urls()
```

## package:dep

- 通过名称获取包的依赖项。 该名称需要是包的依赖项。

#### 函数原型

::: tip API
```lua
package:dep(name: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 依赖名称 |

#### 用法说明


```lua
local python = package:dep("python")
-- returns "python"
python:name()
```

## package:deps

- 获取包的所有依赖项

#### 函数原型

::: tip API
```lua
package:deps()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


```lua
-- prints the names of all dependencies
for _,dep in pairs(package:deps()) do
    print(dep:name())
end
```

## package:sourcehash

- 获取 URL 别名的 sha256 校验和

#### 函数原型

::: tip API
```lua
package:sourcehash()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


如果校验和是这样提供的：

```lua
add_urls("https://example.com/library-$(version).zip", {alias = "example"})
add_versions("example:2.4.1", "29f9983cc7196e882c4bc3d23d7492f9c47574c7cf658afafe7d00c185429941")
```

您可以像这样获取它：

```lua
-- returns "29f9983cc7196e882c4bc3d23d7492f9c47574c7cf658afafe7d00c185429941"
package:sourcehash("example")
-- or so
package:sourcehash(package:url_alias(package:urls()[1]))
```

## package:kind

- 获取包的类型。 可以是以下任何一种：

#### 函数原型

::: tip API
```lua
package:kind()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

  + binary
  + toolchain (is also binary)
  + library (default)
  + template [#2138](https://github.com/xmake-io/xmake/issues/2138)
  + headeronly

## package:is_binary

- 包是否为二进制类型

#### 函数原型

::: tip API
```lua
package:is_binary()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:is_toolchain

- 报是否为工具链类型

#### 函数原型

::: tip API
```lua
package:is_toolchain()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:is_library

- 包是否为库类型

#### 函数原型

::: tip API
```lua
package:is_library()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:is_toplevel

-- 包是否在用户 xmake.lua 里面通过 add_requires 直接引用

## package:is_thirdparty

- 包是否由第三方包管理器提供（例如 brew、conan、vcpkg）

#### 函数原型

::: tip API
```lua
package:is_thirdparty()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:is_debug

- 包是否以调试模式构建

#### 函数原型

::: tip API
```lua
package:is_debug()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


同`package:config("debug")`

## package:is_supported

- 当前平台和架构是否支持该包

#### 函数原型

::: tip API
```lua
package:is_supported()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:debug

- 包是否使用调试模式构建

#### 函数原型

::: tip API
```lua
package:debug()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


不推荐使用：使用 [`package:is_debug`](#package-is_debug) 代替。

## package:is_cross

- 包是否正在交叉编译

#### 函数原型

::: tip API
```lua
package:is_cross()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:cachedir

- 获取包的缓存目录

#### 函数原型

::: tip API
```lua
package:cachedir()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:installdir

- 获取包的安装目录。 也可用于获取子目录。 如果给定的目录树不存在，它将被创建。

#### 函数原型

::: tip API
```lua
package:installdir()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


```lua
-- returns the installation directory
package:installdir()
-- returns the subdirectory include inside the installation directory
package:installdir("include")
-- returns the subdirectory include/files
package:installdir("include", "files")
```

## package:scriptdir

- 获取包的xmake.lua所在目录

#### 函数原型

::: tip API
```lua
package:scriptdir()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:envs

- 获取包导出的环境变量

#### 函数原型

::: tip API
```lua
package:envs()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:getenv

- 获取给定的环境变量

#### 函数原型

::: tip API
```lua
package:getenv()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


```lua
-- returns a table
package:getenv("PATH")
```

## package:setenv

- 设置给定的环境变量。 覆盖变量

#### 函数原型

::: tip API
```lua
package:setenv()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


```lua
-- sets PATH to {"bin", "lib"}
package:setenv("PATH", "bin", "lib")
```

## package:addenv

- 将给定的值添加到环境变量

#### 函数原型

::: tip API
```lua
package:addenv()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


```lua
-- adds "bin" and "lib" to PATH
package:addenv("PATH", "bin", "lib")
```


## package:scheme

- 根据名称获取方案实例

#### 函数原型

::: tip API
```lua
package:scheme(name: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 方案名称 |

#### 用法说明

根据名称获取方案实例。用于配置特定方案的设置（URL、版本、哈希等），通常在 `on_source` 或 `on_load` 中使用。

```lua
on_source(function (package)
    -- 配置 'binary' 方案
    local binary = package:scheme("binary")
    binary:add("urls", "https://example.com/mypkg-v$(version)-bin.zip")
    binary:add("versions", "1.0.0", "<sha256_of_binary>")
end)
```

## package:current_scheme

- 获取当前选中的方案

#### 函数原型

::: tip API
```lua
package:current_scheme()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

获取当前选中的方案。这在 `on_install` 中用于确定要执行的构建逻辑非常有用。

```lua
on_install(function (package)
    local scheme = package:current_scheme()
    if scheme and scheme:name() == "binary" then
        -- 预编译二进制文件的安装逻辑
    else
        -- 源码构建逻辑
    end
end)
```

## package:versions


- 获取包的所有版本列表。

#### 函数原型

::: tip API
```lua
package:versions()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:version

- 获取包的版本

#### 函数原型

::: tip API
```lua
package:version()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


它会返回一个语义版本对象，便于做版本之间的判断。

```lua
local version = package:version()
-- get the major version
version:major()
-- get the minor version
version:minor()
-- get the patch version
version:patch()
```

## package:version_str

- 以字符串形式获取包的版本

#### 函数原型

::: tip API
```lua
package:version_str()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


## package:config

- 获取包的给定配置值

#### 函数原型

::: tip API
```lua
package:config()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


```lua
-- if configurations are set like so
add_require("example", {configs = {enable_x = true, value_y = 6}})
-- these values can be retrieved like so
-- returns true
package:config("enable_x")
-- returns 6
package:config("value_y")
```

## package:config_set

- 设置包的给定配置值

#### 函数原型

::: tip API
```lua
package:config_set()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


```lua
package:config_set("enable_x", true)
package:config_set("value_y", 6)
```

## package:configs

- 获取包的所有配置

#### 函数原型

::: tip API
```lua
package:configs()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


```lua
-- returns a table with the configuration names as keys and their values as values
local configs = package:configs()
local enable_x = configs["enable_x"]
local value_y = configs["value_y"]
```

## package:buildhash

- 获取包的构建哈希

#### 函数原型

::: tip API
```lua
package:buildhash()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


它确保每个包，不同的配置安装到唯一的路径下，相互之间不冲突。

## package:patches

- 获取当前版本的所有补丁

#### 函数原型

::: tip API
```lua
package:patches()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


```lua
-- returns a table with all patches
local patches = package:patches()
-- each element contains the keys "url" and "sha256"
local url = patches[1]["url"]
local sha256 = patches[1]["sha256"]
```

## package:has_cfuncs

- 检测包是否具有给定的 C 函数

#### 函数原型

::: tip API
```lua
package:has_cfuncs()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


这应该在 `on_test` 中使用，如下所示：

```lua
on_test(function (package)
  assert(package:has_cfuncs("foo"))
  -- you can also add configs
  assert(package:has_cfuncs("bar", {includes = "foo_bar.h"}))
  assert(package:has_cfuncs("blob", {includes = "blob.h", configs = {defines = "USE_BLOB"}}))
  -- you can even set the language
  assert(package:has_cfuncs("bla", {configs = {languages = "c99"}}))
end)
```

## package:has_cxxfuncs

- 检测包是否具有给定的 C++ 函数

#### 函数原型

::: tip API
```lua
package:has_cxxfuncs(funcs: <string|table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| funcs | 函数名或函数名列表 |

#### 用法说明


这应该在 `on_test` 中使用，如下所示：

```lua
on_test(function (package)
  assert(package:has_cxxfuncs("foo"))
  -- you can also add configs
  assert(package:has_cxxfuncs("bar", {includes = "foo_bar.hpp"}))
  assert(package:has_cxxfuncs("blob", {includes = "blob.hpp", configs = {defines = "USE_BLOB"}}))
  -- you can even set the language
  assert(package:has_cxxfuncs("bla", {configs = {languages = "cxx17"}}))
end)
```

## package:has_ctypes

- 检测包是否具有给定的 C 类型

#### 函数原型

::: tip API
```lua
package:has_ctypes(types: <string|table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| types | 类型名或类型名列表 |

#### 用法说明


这应该在 `on_test` 中使用，如下所示：

```lua
on_test(function (package)
  assert(package:has_ctypes("foo"))
  -- you can also add configs
  assert(package:has_ctypes("bar", {includes = "foo_bar.h"}))
  assert(package:has_ctypes("blob", {includes = "blob.h", configs = {defines = "USE_BLOB"}}))
  -- you can even set the language
  assert(package:has_ctypes("bla", {configs = {languages = "c99"}}))
end)
```

## package:has_cxxtypes

- 检测包是否具有给定的 C++ 类型

#### 函数原型

::: tip API
```lua
package:has_cxxtypes(types: <string|table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| types | 类型名或类型名列表 |

#### 用法说明


这应该在 `on_test` 中使用，如下所示：

```lua
on_test(function (package)
  assert(package:has_cxxtypes("foo"))
  -- you can also add configs
  assert(package:has_cxxtypes("bar", {includes = "foo_bar.hpp"}))
  assert(package:has_cxxtypes("blob", {includes = "blob.hpp", configs = {defines = "USE_BLOB"}}))
  -- you can even set the language
  assert(package:has_cxxtypes("bla", {configs = {languages = "cxx17"}}))
end)
```

## package:has_cincludes

- 检测包是否具有给定的 C 头文件

#### 函数原型

::: tip API
```lua
package:has_cincludes(includes: <string|table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| includes | 头文件或头文件列表 |

#### 用法说明


这应该在 `on_test` 中使用，如下所示：

```lua
on_test(function (package)
  assert(package:has_cincludes("foo.h"))
end)
```

## package:has_cxxincludes

- 检测包是否具有给定的 C++ 头文件

#### 函数原型

::: tip API
```lua
package:has_cxxincludes(includes: <string|table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| includes | 头文件或头文件列表 |

#### 用法说明


这应该在 `on_test` 中使用，如下所示：

```lua
on_test(function (package)
  assert(package:has_cxxincludes("foo.hpp"))
end)
```

## package:check_csnippets

- 检测是否可以编译和链接给定的 C 代码片段

#### 函数原型

::: tip API
```lua
package:check_csnippets(snippets: <string|table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| snippets | 代码片段或代码片段列表 |

#### 用法说明


这应该在 `on_test` 中使用，如下所示：

```lua
on_test(function (package)
  assert(package:check_csnippets({test = [[
    #define USE_BLOB
    #include <blob.h>
    void test(int argc, char** argv) {
      foo bar;
      printf("%s", bar.blob);
    }
  ]]}, {configs = {languages = "c99"}, includes = "foo.h"}))
end)
```

## package:check_cxxsnippets

- 检测是否可以编译和链接给定的 C++ 代码片段

#### 函数原型

::: tip API
```lua
package:check_cxxsnippets(snippets: <string|table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| snippets | 代码片段或代码片段列表 |

#### 用法说明


这应该在 `on_test` 中使用，如下所示：

```lua
on_test(function (package)
  assert(package:check_cxxsnippets({test = [[
    #define USE_BLOB
    #include <blob.hpp>
    void test(int argc, char** argv) {
      foo bar();
      std::cout << bar.blob;
    }
  ]]}, {configs = {languages = "cxx11"}, includes = "foo.hpp"}))
end)
```

## package:check_fcsnippets

- 检测是否可以编译和链接给定的 Fortran 代码片段

#### 函数原型

::: tip API
```lua
package:check_fcsnippets()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明


用法如上
