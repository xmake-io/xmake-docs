# 包实例 {#package-instance}

此页面描述了 [包依赖管理](/zh/api/description/package-dependencies) 的 `on_load()`、`on_install()` 或 `on_test()` 等函数的 `package` 接口

## package:name

- 获取包的名字

## package:get

- 获取包在描述域的配置值

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

## package:description

- 获取包的描述（同`package:get("description")`）

## package:plat

- 获取包的平台。 可以是以下任何一种：
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

如果包是二进制的，则返回 [`os.arch`](/zh/api/scripts/builtin-modules/os#os-arch)

## package:targetos

- 获取包的目标操作系统。

可以具有与 [package:plat](#package-plat) 相同的值

## package:targetarch

- 获取包的目标架构。

可以具有与 [package:arch](#package-arch) 相同的值

## package:is_plat

- 当前平台是否是给定平台之一

```lua
-- Is the current platform android?
package:is_plat("android")
-- Is the current platform windows, linux or macosx?
package:is_plat("windows", "linux", "macosx")
```

## package:is_arch

- 当前架构是否是给定架构之一

```lua
-- Is the current architecture x86
package:is_arch("x86")
-- Is the current architecture x64 or x86_64
package:is_arch("x64", "x86_64")
```

## package:is_targetos

- 当前目标操作系统是否是给定操作系统之一

```lua
-- Is the currently targeted OS windows?
package:is_targetos("windows")
-- Is the currently targeted OS android or iphoneos?
package:is_targetos("android", "iphoneos")
```

## package:is_targetarch

- 当前目标架构是否是给定架构之一

```lua
-- Is the currently targeted architecture x86
package:is_targetarch("x86")
-- Is the currently targeted architecture x64 or x86_64
package:is_targetarch("x64", "x86_64")
```

## package:alias

- 获取包的别名

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

```lua
local python = package:dep("python")
-- returns "python"
python:name()
```

## package:deps

- 获取包的所有依赖项

```lua
-- prints the names of all dependencies
for _,dep in pairs(package:deps()) do
    print(dep:name())
end
```

## package:sourcehash

- 获取 URL 别名的 sha256 校验和

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
  + binary
  + toolchain (is also binary)
  + library (default)
  + template [#2138](https://github.com/xmake-io/xmake/issues/2138)
  + headeronly

## package:is_binary

- 包是否为二进制类型

## package:is_toolchain

- 报是否为工具链类型

## package:is_library

- 包是否为库类型

## package:is_toplevel

-- 包是否在用户 xmake.lua 里面通过 add_requires 直接引用

## package:is_thirdparty

- 包是否由第三方包管理器提供（例如 brew、conan、vcpkg）

## package:is_debug

- 包是否以调试模式构建

同`package:config("debug")`

## package:is_supported

- 当前平台和架构是否支持该包

## package:debug

- 包是否使用调试模式构建

不推荐使用：使用 [`package:is_debug`](#package-is_debug) 代替。

## package:is_cross

- 包是否正在交叉编译

## package:cachedir

- 获取包的缓存目录

## package:installdir

- 获取包的安装目录。 也可用于获取子目录。 如果给定的目录树不存在，它将被创建。

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

## package:envs

- 获取包导出的环境变量

## package:getenv

- 获取给定的环境变量

```lua
-- returns a table
package:getenv("PATH")
```

## package:setenv

- 设置给定的环境变量。 覆盖变量

```lua
-- sets PATH to {"bin", "lib"}
package:setenv("PATH", "bin", "lib")
```

## package:addenv

- 将给定的值添加到环境变量

```lua
-- adds "bin" and "lib" to PATH
package:addenv("PATH", "bin", "lib")
```

## package:versions

- 获取包的所有版本列表。

## package:version

- 获取包的版本

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

## package:config

- 获取包的给定配置值

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

```lua
package:config_set("enable_x", true)
package:config_set("value_y", 6)
```

## package:configs

- 获取包的所有配置

```lua
-- returns a table with the configuration names as keys and their values as values
local configs = package:configs()
local enable_x = configs["enable_x"]
local value_y = configs["value_y"]
```

## package:buildhash

- 获取包的构建哈希

它确保每个包，不同的配置安装到唯一的路径下，相互之间不冲突。

## package:patches

- 获取当前版本的所有补丁

```lua
-- returns a table with all patches
local patches = package:patches()
-- each element contains the keys "url" and "sha256"
local url = patches[1]["url"]
local sha256 = patches[1]["sha256"]
```

## package:has_cfuncs

- 检测包是否具有给定的 C 函数

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

这应该在 `on_test` 中使用，如下所示：

```lua
on_test(function (package)
  assert(package:has_cincludes("foo.h"))
end)
```

## package:has_cxxincludes

- 检测包是否具有给定的 C++ 头文件

这应该在 `on_test` 中使用，如下所示：

```lua
on_test(function (package)
  assert(package:has_cxxincludes("foo.hpp"))
end)
```

## package:check_csnippets

- 检测是否可以编译和链接给定的 C 代码片段

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

用法如上
