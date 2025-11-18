---
title: xmake v2.5.7 released, Use lockfile to freeze package dependencies and Vala/Metal language support
tags: [xmake, lua, C/C++, lock, package, vala]
date: 2021-08-29
author: Ruki
outline: deep
---
### Added Vala language support

In this version, we can already initially support the construction of Vala programs, just apply the `add_rules("vala")` rule.

At the same time, we need to add some dependency packages, among which the glib package is necessary because Vala itself will also use it.

`add_values("vala.packages")` is used to tell valac which packages the project needs, it will introduce the vala api of the relevant package, but the dependency integration of the package still needs to be downloaded and integrated through `add_requires("lua")`.

E.g:

```lua
add_rules("mode.release", "mode.debug")

add_requires("lua", "glib")

target("test")
    set_kind("binary")
    add_rules("vala")
    add_files("src/*.vala")
    add_packages("lua", "glib")
    add_values("vala.packages", "lua")
```

More examples: [Vala examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/vala)

### Added package dependency lock support

This feature is similar to npm's package.lock and cargo's cargo.lock.

For example, if we quote some packages, by default, if the version is not specified, xmake will automatically pull the latest version of the package for integrated use each time, for example:

```lua
add_requires("zlib")
```

However, if the upstream package repository is updated and changed, for example, zlib adds a new version 1.2.11, or the installation script is changed, the user's dependent packages will change.

This can easily lead to some projects that were originally compiled and passed, and there may be some unstable factors due to changes in dependent packages, and the compilation may fail, etc.

In order to ensure that the package used by the user's project is fixed each time, we can enable the package dependency lock through the following configuration.

```lua
set_policy("package.requires_lock", true)
```

This is a global setting and must be set to the global root scope. If enabled, xmake will automatically generate a `xmake-requires.lock` configuration file after executing package pull.

It contains all the packages that the project depends on, as well as the current package version and other information.

```lua
{
    __meta__ = {
        version = "1.0"
    },
    ["macosx|x86_64"] = {
        ["cmake#31fecfc4"] = {
            repo = {
                branch = "master",
                commit = "4498f11267de5112199152ab030ed139c985ad5a",
                url = "https://github.com/xmake-io/xmake-repo.git"
            },
            version = "3.21.0"
        },
        ["glfw#31fecfc4"] = {
            repo = {
                branch = "master",
                commit = "eda7adee81bac151f87c507030cc0dd8ab299462",
                url = "https://github.com/xmake-io/xmake-repo.git"
            },
            version = "3.3.4"
        },
        ["opengl#31fecfc4"] = {
            repo = {
                branch = "master",
                commit = "94d2eee1f466092e04c5cf1e4ecc8c8883c1d0eb",
                url = "https://github.com/xmake-io/xmake-repo.git"
            }
        }
    }
}
```

Of course, we can also execute the following command to force the upgrade package to the latest version.

```console
$ xmake require --upgrade
upgrading packages ..
  zlib: 1.2.10 -> 1.2.11
1 package is upgraded!
```

### option supports runtime detection of code snippets

Option itself provides two interfaces `add_csnippets/add_cxxsnippets`, which are used to quickly detect whether a specific piece of c/c++ code has been compiled, and if the compilation passes, the corresponding option option will be enabled.

But the previous version can only provide compile-time detection, and in the new version, we also added runtime detection support.

We can set the two parameters `{tryrun = true}` and `{output = true}` to try to run detection and capture output.

#### Try to run the test

Set tryrun to try to run to detect

```lua
option("test")
    add_cxxsnippets("HAS_INT_4", "return (sizeof(int) == 4)? 0: -1;", {tryrun = true})
```

If the compile and run pass, the test option will be enabled.

#### Detect and capture output at runtime

Setting output will also try to detect and additionally capture the output content of the run.

```lua
option("test")
    add_cxxsnippets("INT_SIZE",'printf("%d", sizeof(int)); return 0;', {output = true, number = true})
```

If the compile and run pass, the test option will be enabled, and the corresponding output content can be obtained as the value of option.

Note: Set to capture output, the current option cannot set other snippets

We can also get the output bound to the option through `is_config`.

```lua
if is_config("test", "8") tben
    - xxx
end
```

In addition, we have also improved the auxiliary detection interface of `includes("check_csnippets")` to support runtime detection.

```lua
includes("check_csnippets.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")

    check_csnippets("HAS_INT_4", "return (sizeof(int) == 4)? 0: -1;", {tryrun = true})
    check_csnippets("INT_SIZE",'printf("%d", sizeof(int)); return 0;', {output = true, number = true})
    configvar_check_csnippets("HAS_LONG_8", "return (sizeof(long) == 8)? 0: -1;", {tryrun = true})
    configvar_check_csnippets("PTR_SIZE",'printf("%d", sizeof(void*)); return 0;', {output = true, number = true})
```

If capture output is enabled, `${define PTR_SIZE}` in `config.h.in` will automatically generate `#define PTR_SIZE 4`.

Among them, the `number = true` setting can be forced as a number instead of a string value, otherwise it will be defined as `#define PTR_SIZE "4"` by default

### Quickly embed binary resource files into code

We can use the `utils.bin2c` rule to introduce some binary files into the project, and see them as c/c++ header files for developers to use to obtain the data of these files.

For example, we can embed some png/jpg resource files into the code in the project.

```lua
target("console")
    set_kind("binart")
    add_rules("utils.bin2c", {extensions = {".png", ".jpg"}})
    add_files("src/*.c")
    add_files("res/*.png", "res/*.jpg")
```

Note: The setting of extensions is optional, the default suffix is ​​.bin

Then, we can import and use it through `#include "filename.png.h"`, xmake will automatically generate the corresponding header file for you, and add the corresponding search directory.

```c
static unsigned char g_png_data[] = {
    #include "image.png.h"
};

int main(int argc, char** argv)
{
    printf("image.png: %s, size: %d\n", g_png_data, sizeof(g_png_data));
    return 0;
}
```

The content of the generated header file is similar:

```console
cat build/.gens/test/macosx/x86_64/release/rules/c++/bin2c/image.png.h
  0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x78, 0x6D, 0x61, 0x6B, 0x65, 0x21, 0x0A, 0x00
```

### Added iOS/macOS application Metal compilation support

We know that the `xcode.application` rule can compile iOS/macOS applications, generate .app/.ipa packages, and complete the signature operation at the same time.

However, it did not support the compilation of code with .metal before. In the new version, we have added the `xcode.metal` rule, which is associated with the `xcode.application` rule by default to support metal compilation by default.

xmake will automatically compile .metal and then package to generate the default.metallib file, and it will be built into .app/.ipa automatically.

If the user's metal is accessed through `[_device newDefaultLibrary]`, it can be automatically supported, just like compiling with xcode.

Here is a complete one we provide: [Project Example](https://github.com/xmake-io/xmake/blob/master/tests/projects/objc/metal_app/xmake.lua).

```lua
add_rules("mode.debug", "mode.release")

target("HelloTriangle")
    add_rules("xcode.application")
    add_includedirs("Renderer")
    add_frameworks("MetalKit")
    add_mflags("-fmodules")
    add_files("Renderer/*.m", "Renderer/*.metal") ------- add metal files
    if is_plat("macosx") then
        add_files("Application/main.m")
        add_files("Application/AAPLViewController.m")
        add_files("Application/macOS/Info.plist")
        add_files("Application/macOS/Base.lproj/*.storyboard")
        add_defines("TARGET_MACOS")
        add_frameworks("AppKit")
    elseif is_plat("iphoneos") then
        add_files("Application/*.m")
        add_files("Application/iOS/Info.plist")
        add_files("Application/iOS/Base.lproj/*.storyboard")
        add_frameworks("UIKit")
        add_defines("TARGET_IOS")
```

For example, on macOS, after compiling and running, the desired effect will be rendered through metal.

![](/assets/img/posts/xmake/xmake-metal.png)

If our project does not use the default metal library, we can also use the above-mentioned `utils.bin2c` rule as a source file and embed it into the code library, for example:

```lua
add_rules("utils.bin2c", {extensions = ".metal"})
add_files("Renderer/*.metal")
```

Then in the code, we can access:

```c
static unsigned char g_metal_data[] = {
    #include "xxx.metal.h"
};

id<MTLLibrary> library = [_device newLibraryWithSource:[[NSString stringWithUTF8String:g_metal_data]] options:nil error:&error];
```

### Improve add_repositories

If we use the local repository built into the project, we used to introduce it through `add_repositories("myrepo repodir")`.

However, it is not based on the relative directory of the current xmake.lua file directory like `add_files()`, and there is no automatic path conversion, so it is easy to encounter the problem of not being able to find the repo.

Therefore, we have improved it, and you can specify the corresponding root directory location through an additional rootdir parameter, such as the script directory relative to the current xmake.lua.

```lua
add_repositories("myrepo repodir", {rootdir = os.scriptdir()})
```

### os.cp supports symbolic links

In the previous version, the `os.cp` interface could not handle the copying of symbolic links very well. It would automatically expand the link and copy the actual file content, which would only cause the symbolic link to be lost after copying.

If you want to keep the symbolic link as it is after copying, you only need to set the following parameter: `{symlink = true}`

```lua
os.cp("/xxx/symlink", "/xxx/dstlink", {symlink = true})
```

### Compile automatically generated code more easily

Sometimes, we have such a requirement to automatically generate some source files to participate in the later code compilation before compilation. But because the files added by `add_files` are already determined when the compilation is executed, they cannot be added dynamically during the compilation process (because parallel compilation is required).

Therefore, to achieve this requirement, we usually need to customize a rule, and then actively call the compiler module to deal with a series of issues such as compilation of generated code, injection of object files, and dependency updates.

This is not a big problem for the xmake developers themselves, but for users, it is still more cumbersome and difficult to get started.

In the new version, we have improved the support for `add_files` and added the `{always_added = true}` configuration to tell xmake that we always need to add the specified source file, even if it does not exist yet.

In this way, we can rely on the default compilation process of xmake to compile the automatically generated code, like this:

```lua
add_rules("mode.debug", "mode.release")

target("autogen_code")
    set_kind("binary")
    add_files("$(buildir)/autogen.cpp", {always_added = true})
    before_build(function (target)
        io.writefile("$(buildir)/autogen.cpp", [[
#include <iostream>

using namespace std;

int main(int argc, char** argv)
{
    cout << "hello world!" << endl;
    return 0;
}
        ]])
    end)
```

There is no need for additional rule definitions, only the compilation order needs to be guaranteed, and the code files are generated at the correct stage.

However, we also need to pay attention that since the currently automatically generated source files may not yet exist, we cannot use pattern matching in `add_files`, and can only explicitly add each source file path.

## Changelog

### New features

* [#1534](https://github.com/xmake-io/xmake/issues/1534): Support to compile Vala lanuage project
* [#1544](https://github.com/xmake-io/xmake/issues/1544): Add utils.bin2c rule to generate header from binary file
* [#1547](https://github.com/xmake-io/xmake/issues/1547): Support to run and get output of c/c++ snippets in option
* [#1567](https://github.com/xmake-io/xmake/issues/1567): Package "lock file" support to freeze dependencies
* [#1597](https://github.com/xmake-io/xmake/issues/1597): Support to compile *.metal files to generate *.metalib and improve xcode.application rule

### Change

* [#1540](https://github.com/xmake-io/xmake/issues/1540): Better support for compilation of automatically generated code
* [#1578](https://github.com/xmake-io/xmake/issues/1578): Improve add_repositories to support relative path better
* [#1582](https://github.com/xmake-io/xmake/issues/1582): Improve installation and os.cp to reserve symlink

### Bugs fixed

* [#1531](https://github.com/xmake-io/xmake/issues/1531): Fix error info when loading targets failed
