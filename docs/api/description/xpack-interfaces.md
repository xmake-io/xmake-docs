# XPack Interfaces

Xpack is provided as a plug-in, and all its APIs need to be introduced through `includes("@builtin/xpack")`.

```lua
includes("@builtin/xpack")

xpack("test")
     set_version("1.0")
     set_homepage("https://xmake.io")
     add_installfiles("...")
```

## set_version

- Set package version

#### Function Prototype

```lua
set_version(version: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| version | Package version string |

This interface is used to set the version of the generated installation package:

```lua
xpack("test")
     set_version("1.0")
     --...
```

If we do not set it, but bind the installed target program through `set_targets`, the version configuration in target will also be used.


```lua
target("foo")
     set_version("1.0")

xpack("test")
     set_targets("foo")
     --...
```


We can also use the global project version if no targets are bound.


```lua
set_version("1.0")

xpack("xmake")
     --...
```


## set_homepage

- Set homepage information

#### Function Prototype

```lua
set_homepage(homepage: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| homepage | Homepage URL string |

```lua
xpack("xmake")
     set_homepage("https://xmake.io")
```

## set_title

- Set title information

#### Function Prototype

```lua
set_title(title: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| title | Package title string |

A simple description usually used to configure the installation package, shorter than `set_description`.

```lua
xpack("xmake")
     set_title("Xmake build utility ($(arch))")
```

## set_description

- Set detailed description

#### Function Prototype

```lua
set_description(description: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| description | Package description string |

This interface can set more detailed description information of the installation package. You can use one or two sentences to describe the package in detail.

```lua
xpack("xmake")
     set_description("A cross-platform build utility based on Lua.")
```

## set_author

- Set author information

#### Function Prototype

```lua
set_author(author: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| author | Author information string |

We can set the email address, name, etc. to describe the author of this package.

```lua
xpack("xmake")
     set_author("waruqi@gmail.com")
```

## set_maintainer

- Set maintainer information

#### Function Prototype

```lua
set_maintainer(maintainer: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| maintainer | Maintainer information string |

We can set the email address, name, etc. to describe the maintainer of this package.

The maintainer and author may or may not be the same person.

```lua
xpack("xmake")
     set_maintainer("waruqi@gmail.com")
```

## set_copyright

- Set the copyright information of the package

#### Function Prototype

```lua
set_copyright(copyright: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| copyright | Copyright information string |

```lua
xpack("xmake")
     set_copyright("Copyright (C) 2015-present, TBOOX Open Source Group")
```

## set_license

- Set the package licence

#### Function Prototype

```lua
set_license(license: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| license | License name string |

Currently used by packages like srpm/rpm/deb to set the licence name.

```lua
set_license("Apache-2.0")
```

## set_licensefile

- Set the license file of the package

#### Function Prototype

```lua
set_licensefile(licensefile: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| licensefile | License file path string |

We can set the file path where LICENSE is located, like the NSIS installation package, it will also additionally display the LICENSE page to the installation user.

```lua
xpack("xmake")
     set_licensefile("../LICENSE.md")
```

## set_company

- Set the company to which the package belongs

#### Function Prototype

```lua
set_company(company: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| company | Company name string |

We can use this interface to set the company and organization name to which the package belongs.

```lua
xpack("xmake")
     set_company("tboox.org")
```

## set_inputkind

- Set the packaged input source type

#### Function Prototype

```lua
set_inputkind(inputkind: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| inputkind | Input source type: "binary" or "source" |

This is an optional interface that can be used to identify the currently packaged input source type.

- binary: package from binary files as input source, usually using `add_installfiles`
- source: Start packaging from a source file as an input source, usually using `add_sourcefiles`

This is generally used for custom packaging formats, and for built-in formats, such as: nsis, zip, srczip, etc.,
In fact, it can be determined whether the currently packaged input source is packaged from the source code or directly from the binary source.

Therefore, unless necessary (such as customizing the packaging format), we usually do not need to set it.

In the script domain, we can also use `package:from_source()` and `package:from_binary()` to determine the current input source.

```lua
xpack("test")
     set_formats("nsis", "zip", "targz", "srczip", "srctargz", "runself")
     add_installfiles("src/(assets/*.png)", {prefixdir = "images"})
     add_sourcefiles("(src/**)")
     on_load(function (package)
         if package:from_source() then
             package:set("basename", "test-$(plat)-src-v$(version)")
         else
             package:set("basename", "test-$(plat)-$(arch)-v$(version)")
         end
     end)
```

If the above packaging configuration is an nsis package, the binary file will be used as the input source for packaging by default, and the files configured by `add_installfiles` will be packaged.

`srczip`, `srctargz` and `runself` start packaging from the source file, will package the files in `add_sourcefiles`, and then execute the packaging script.

## set_formats

- Set packaging format

#### Function Prototype

```lua
set_formats(formats: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| formats | Package format name string or array |
| ... | Variable parameters, can pass multiple format names |

Configure the packaging format that needs to be generated by the current XPack package. Multiple formats can be configured at the same time. The `xmake pack` command will generate them all at once.

::: tip NOTE
Some formats will be automatically ignored if the current platform does not support generation.
:::

```lua
xpack("test")
     set_formats("nsis", "zip", "targz", "srczip", "srctargz", "runself")
```

We can also specify to generate some of the formats through commands instead of generating them all at once.

```sh
$ xmake pack -f "nsis,zip"
```

Separated by commas, specify to generate NSIS and zip packages, and ignore other format packages for the time being.

Currently supported formats are:

| Format | Description |
| ---- | ---- |
| nsis | Windows NSIS installation package, binary installation |
| zip | Binary zip package, does not contain installation script |
| targz | Binary tar.gz package, does not contain the installation script |
| srczip | zip source package |
| srctargz | tar.gz source package |
| runself | self-running shell script package, source code compilation and installation |
| rpm | rpm binary installation package |
| srpm | rpm source code installation package |
| deb | deb binary installation package (TODO) |
| Others | Customizable formats and installation scripts |

## set_basename

- Set package file name

#### Function Prototype

```lua
set_basename(basename: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| basename | Package base name string |

Set the file name of the generated package, but do not include the suffix.

```lua
xpack("xmake")
     set_basename("xmake-v$(version)")
```

We can also configure variables such as `$(version)`, `$(plat)`, `$(arch)` and so on.

In addition, if you want more flexible configuration, you can configure it in the on_load script.

```lua
xpack("xmake")
     on_load(function (package)
         package:set("basename", "xmake-v" .. package:version())
     end)
```

## set_extension

- Set the extension of the installation package

#### Function Prototype

```lua
set_extension(extension: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| extension | Package file extension string |

Usually we do not need to modify the extension of the generated package, because after specifying `nsis`, `zip` and other formats, there will be a default suffix name, such as: `.exe`, `.zip`.

However, if we are customizing the package format and need to generate a custom package, then we may need to configure it.

```lua
xpack("mypack")
     set_format("myformat")
     set_extension(".myf")
     on_package(function (package)
         local outputfile = package:outputfile()
         -- TODO
     end)
```

For example, here we customize a myformat package format, using the custom suffix name of `.myf`, and then we can generate it in on_package,

The package output file name returned by `package:outputfile()` will contain this suffix.

## add_targets

- Associated target program

#### Function Prototype

```lua
add_targets(targets: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| targets | Target name string or array |
| ... | Variable parameters, can pass multiple target names |

We can use this interface to configure the associated target that needs to be installed.

```lua
target("foo")
     set_kind("shared")
     add_files("src/*.cpp")
     add_headerfiles("include/(*.h)")

xpack("test")
     set_formats("nsis")
     add_targets("foo")
```

When the test installation package is generated, the executable program and dynamic library of the associated foo target will be packaged and installed together.
In addition, the custom installation files configured through `add_headerfiles` and `add_installfiles` in the target will also be included in the installation package and installed together.

And we can also use `on_installcmd`, `after_installcmd` and other custom packaging installation scripts in the target and its rules, which will also be executed together.

## add_components

- Add installation package components

#### Function Prototype

```lua
add_components(components: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| components | Component name string or array |
| ... | Variable parameters, can pass multiple component names |

We also support adding custom components to the installation package and selecting and installing them according to the component mode. Currently, only NSIS packages have comparative support effects.

We can define a component domain through `xpack_component()`, and then use `add_components()` to add the specified component and associate it with the package.

In the component, we can write some custom installation scripts through `on_installcmd()`, and the installation will only be executed when the component is enabled.


```lua
xpack("test")
     add_components("LongPath")

xpack_component("LongPath")
     set_default(false)
     set_title("Enable Long Path")
     set_description("Increases the maximum path length limit, up to 32,767 characters (before 256).")
     on_installcmd(function (component, batchcmds)
         batchcmds:rawcmd("nsis", [[
   ${If} $NoAdmin == "false"
     ; Enable long path
     WriteRegDWORD ${HKLM} "SYSTEM\CurrentControlSet\Control\FileSystem" "LongPathsEnabled" 1
   ${EndIf}]])
     end)
```

Here, we use `batchcmds:rawcmd("nsis", "...")` to add an nsis-specific installation command to enable long path support. The effect is as follows:

![](/assets/img/manual/nsis_4.png)

It will only be enabled when we check LongPath. Of course, we can also configure whether the component is enabled by default through `set_default()`.

Except for the NSIS package, although other packages do not have complete support for components, they will also execute the scripts in the components to implement packaging, but may not be able to display the corresponding component UI and check boxes.

## set_bindir

- Set the binary installation directory of the package

#### Function Prototype

```lua
set_bindir(bindir: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| bindir | Binary directory path string |

Usually the generated installation package will have an installation root directory, and we can specify the bin directory location under the installation directory through this configuration.

If not specified, defaults to `installdir/bin`.

If configured

```lua
xpack("xmake")
     set_bindir("mybin")
```

Then the executable file will be installed under `installdir/mybin`. If it is an NSIS package, this path will be automatically set to `%PATH%` after installation.

## set_libdir

- Set the library installation directory of the package

#### Function Prototype

```lua
set_libdir(libdir: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| libdir | Library directory path string |

Usually the generated installation package will have an installation root directory, and we can specify the lib directory location under the installation directory through this configuration.

If not specified, defaults to `installdir/lib`.

If configured

```lua
xpack("xmake")
     set_libdir("mylib")
```

Then the static library files will be installed under `installdir/mylib`.


## set_includedir

- Set the package header file installation directory

#### Function Prototype

```lua
set_includedir(includedir: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| includedir | Include directory path string |

Usually the generated installation package will have an installation root directory, and we can specify the include directory location under the installation directory through this configuration.

If not specified, defaults to `installdir/include`.

If configured

```lua
xpack("xmake")
     set_includedir("myinc")
```

Then the header files will be installed under `installdir/myinc`.

## set_prefixdir

- Set the installation prefix directory of the package

#### Function Prototype

```lua
set_prefixdir(prefixdir: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| prefixdir | Prefix directory path string |

If configured

```lua
xpack("xmake")
     set_prefixdir("prefix")
```

Then all installation files will be installed under `installdir/prefix`, for example:

```
installdir
   - prefix
     - include
     - lib
     - bin
```

## set_specfile

- Set package spec file path

#### Function Prototype

```lua
set_specfile(specfile: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| specfile | Spec file path string |

The generation of some package formats requires the generation of specific spec files before calling third-party packaging tools to generate packages.

For example, for NSIS packages, you need to first generate an NSIS-specific `.nsi` configuration file through xmake based on the xpack configuration, and then xmake will call `makensis.exe` to generate the NSIS package based on this `.nsi` file.

Packages such as deb/rpm have specific spec files.

xmake will automatically generate a spec file by default when packaging, but if we want to more deeply customize the configuration of some unique packages, we can use this interface,

Configure a spec file of your own, in which the user maintains some package configuration definitions, and then define some `${PACKAGE_NAME}`, `${VERSION}` package-specific built-in variables in it to realize package information replacement.

```lua
xpack("xmake")
     set_formats("nsis")
     set_specfile("makensis.nsi")
```

makensis.nsi

```
VIProductVersion "${VERSION}.0"
VIFileVersion "${VERSION}.0"
VIAddVersionKey /LANG=0 ProductName "${PACKAGE_NAME}"
VIAddVersionKey /LANG=0 Comments "${PACKAGE_DESCRIPTION}"
VIAddVersionKey /LANG=0 CompanyName "${PACKAGE_COMPANY}"
VIAddVersionKey /LANG=0 LegalCopyright "${PACKAGE_COPYRIGHT}"
VIAddVersionKey /LANG=0 FileDescription "${PACKAGE_NAME} Installer - v${VERSION}"
VIAddVersionKey /LANG=0 OriginalFilename "${PACKAGE_FILENAME}"
```

Here are some built-in commonly used package variables:

| Variable name | Description |
| ------ | ---- |
| PACKAGE_ARCH | Architecture of package binaries |
| PACKAGE_PLAT | Platform for package binaries |
| PACKAGE_NAME | Package name |
| PACKAGE_TITLE | Brief description of the package |
| PACKAGE_DESCRIPTION | Detailed description of the package |
| PACKAGE_FILENAME | Package file name |
| PACKAGE_AUTHOR | package author |
| PACKAGE_MAINTAINER | Package maintainer |
| PACKAGE_HOMEPAGE | Package homepage address |
| PACKAGE_COPYRIGHT | Package copyright information |
| PACKAGE_COMPANY | The name of the company to which the package belongs |
| PACKAGE_ICONFILE | Package icon file path |
| PACKAGE_LICENSEFILE | Package LICENSE file path |
| PACKAGE_VERSION_MAJOR | The major version of the package |
| PACKAGE_VERSION_MINOR | The minor version of the package |
| PACKAGE_VERSION_ALTER | Alter version of package |
| PACKAGE_VERSION_BUILD | The build version of the package |

In addition to built-in variables, we can also configure some custom template variables through the `set_specvar` interface.

## set_specvar

- Set custom variables in the package spec file

#### Function Prototype

```lua
set_specvar(name: <string>, value: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Variable name string |
| value | Variable value string |

Usually used together with the `set_specfile` interface to set some custom package variables in a custom spec template file.

```lua
xpack("xmake")
     set_formats("nsis")
     set_specfile("makensis.nsi")
     set_specvar("FOO", "hello")
```

makensis.nsi

```
VIAddVersionKey /LANG=0 ProductName "${FOO}"
```

Before generating the package, xmake will replace `${FOO}` with hello, and then call the `makensis.exe` command to generate the NSIS installation package based on this file.


## set_iconfile

- Set icon file path

#### Function Prototype

```lua
set_iconfile(iconfile: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| iconfile | Icon file path string |

We can additionally configure an ico icon file, which can be used to set the icon of some installation packages such as NSIS that support icon customization.

```lua
xpack("xmake")
     set_iconfile("xmake.ico")
```

## add_sourcefiles

- Add source files

#### Function Prototype

```lua
add_sourcefiles(files: <string|array>, ..., {
    prefixdir = <string>,
    rootdir = <string>,
    filename = <string>
})
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| files | Source file pattern string or array |
| ... | Variable parameters, can pass multiple file patterns |
| prefixdir | Installation prefix directory |
| rootdir | Source root directory |
| filename | Target filename |

This is usually used for source packages, that is, pure source packages such as `srczip`, `srctargz`, and source code installation packages in the `runself` format.

If it is a custom package format, we need to configure `set_inputkind("source")` to open the source package.

Through this interface, you can customize which source files need to be included in the package for later compilation and installation.

Its detailed usage is similar to `add_installfiles`, you can refer to its documentation description.

## add_installfiles

- Add binary files

#### Function Prototype

```lua
add_installfiles(files: <string|array>, ..., {
    prefixdir = <string>,
    rootdir = <string>,
    filename = <string>
})
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| files | Install file pattern string or array |
| ... | Variable parameters, can pass multiple file patterns |
| prefixdir | Installation prefix directory |
| rootdir | Source root directory |
| filename | Target filename |

This is usually used for binary packages, that is, packages in `nsis`, `deb`, etc. formats, which install binary files directly.

Therefore, we can use this interface to configure additional binary files that need to be installed, such as executable files, resource files, etc.

For example, we can specify to install various types of files to the installation directory:

```lua
xpack("test")
     add_installfiles("src/*.h")
     add_installfiles("doc/*.md")
```

We can also specify to install to a specific subdirectory:

```lua
xpack("test")
     add_installfiles("src/*.h", {prefixdir = "include"})
     add_installfiles("doc/*.md", {prefixdir = "share/doc"})
```

For the above settings, we will install them to `installdir/include/*.h`, `installdir/share/doc/*.md`.

Note: The default installation will not retain the directory structure and will be fully expanded. Of course, we can also use `()` to extract the subdirectory structure in the source file for installation, for example:

```lua
xpack("test")
     add_installfiles("src/(tbox/*.h)", {prefixdir = "include"})
     add_installfiles("doc/(tbox/*.md)", {prefixdir = "share/doc"})
```

## add_buildrequires

- Add package build dependencies

#### Function Prototype

```lua
add_buildrequires(requires: <string|array>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| requires | Build requirement name string or array |
| ... | Variable parameters, can pass multiple requirement names |

This is usually used for some source packages, such as srpm. Before installing these source code packages, you need to build the source code first, and building the source code may require the use of some other dependency packages.

We can configure them through this interface.

```lua
xpack("test")
     set_formats("srpm")
     on_load(function (package)
         local format = package:format()
         if format == "srpm" then
             package:add("buildrequires", "make")
             package:add("buildrequires", "gcc")
             package:add("buildrequires", "gcc-c++")
         end
     end)
     on_buildcmd(function (package, batchcmds)
         batchcmds:runv("make")
     end)
```

Since different installation packages have some differences in their dependent package names, we need to configure them for different package formats in the on_load script domain.

## on_load

- Custom loading script

#### Function Prototype

```lua
on_load(script: <function (package)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Load script function with package parameter |

If the configuration in the description field cannot meet our needs, we can further flexibly configure the package in the on_load custom script field.

This interface will be called during the initial loading of each XPack package, and you can make some basic configurations in it.

For example, dynamically modify the package file name in it:

```lua
xpack("test")
     on_load(function (package)package:set("basename", "test-" .. package:version())
     end)
```

## before_package

- Customize the script before packaging

#### Function Prototype

```lua
before_package(script: <function (package)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before package script function with package parameter |

We can configure custom scripts before packaging through this interface.

```lua
xpack("test")
     before_package(function (package)
         -- TODO
     end)
```

## on_package

- Custom packaging script

#### Function Prototype

```lua
on_package(script: <function (package)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Package script function with package parameter |

We can configure packaging custom scripts through this interface, which will rewrite the entire built-in packaging logic. Typically used for custom package formats.

```lua
xpack("test")
     set_formats("xxx")
     on_package(function (package)
         -- TODO
     end)
```

## after_package

- Customize the script after packaging

#### Function Prototype

```lua
after_package(script: <function (package)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After package script function with package parameter |

We can configure the custom script after packaging through this interface.

```lua
xpack("test")
     after_package(function (package)
         -- TODO
     end)
```

## on_buildcmd

- Custom build script

#### Function Prototype

```lua
on_buildcmd(script: <function (package, batchcmds)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Build script function with package and batchcmds parameters |

For some source code build packages, we need to build the source code first before installation, such as srpm packages.

Therefore, we can customize the build script through this interface, for example:

```lua
xpack("test")
     set_formats("srpm")
     add_sourcefiles("src/*.c")
     add_sourcefiles("./configure")
     on_buildcmd(function (package, batchcmds)
         batchcmds:runv("./configure")
         batchcmds:runv("make")
     end)
```

If we associate target programs through add_targets, xpack will execute the `xmake build` command by default to build them even if we do not configure `on_buildcmd`.

```lua
xpack("test")
     set_formats("srpm")
     add_sourcefiles("src/*.c")
     add_sourcefiles("./xmake.lua")
```

In addition, we can also use `add_buildrequires` to configure some build dependencies.

## before_buildcmd

- Customize pre-build scripts

#### Function Prototype

```lua
before_buildcmd(script: <function (package, batchcmds)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before build script function with package and batchcmds parameters |

Through this interface, we can configure pre-build scripts.

```lua
xpack("test")
     set_formats("srpm")
     before_buildcmd(function (package, batchcmds)
         -- TODO
     end)
```

## after_buildcmd

- Customize the script after the build

#### Function Prototype

```lua
after_buildcmd(script: <function (package, batchcmds)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After build script function with package and batchcmds parameters |

Through this interface, we can configure the script after the build.

```lua
xpack("test")
     set_formats("srpm")
     after_buildcmd(function (package, batchcmds)
         -- TODO
     end)
```

## before_installcmd

- Add script before installation

#### Function Prototype

```lua
before_installcmd(script: <function (package, batchcmds)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before install script function with package and batchcmds parameters |

It will not rewrite the entire installation script, but will add some custom installation scripts before the existing installation scripts are executed:

```lua
xpack("test")
     before_installcmd(function (package, batchcmds)
         batchcmds:mkdir(package:installdir("resources"))
         batchcmds:cp("src/assets/*.txt", package:installdir("resources"), {rootdir = "src"})
         batchcmds:mkdir(package:installdir("stub"))
     end)
```

It should be noted that the cp, mkdir and other commands added through `batchcmds` will not be executed immediately, but will only generate a command list. When the package is actually generated later, these commands will be translated into packaging commands.

## on_installcmd

- Custom installation script

#### Function Prototype

```lua
on_installcmd(script: <function (package, batchcmds)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Install script function with package and batchcmds parameters |

This time, the built-in default installation script is completely rewritten, including the internal automatic installation of files configured with `add_installfiles`. Users need to handle all the installation logic by themselves.

## after_installcmd

- Add post-installation scripts

#### Function Prototype

```lua
after_installcmd(script: <function (package, batchcmds)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After install script function with package and batchcmds parameters |

It will not rewrite the entire installation script, but will add some custom installation scripts after the existing installation scripts are executed:

```lua
xpack("test")
     after_installcmd(function (package, batchcmds)
         batchcmds:mkdir(package:installdir("resources"))
         batchcmds:cp("src/assets/*.txt", package:installdir("resources"), {rootdir = "src"})
         batchcmds:mkdir(package:installdir("stub"))
     end)
```

It should be noted that the cp, mkdir and other commands added through `batchcmds` will not be executed immediately, but will only generate a command list. When the package is actually generated later, these commands will be translated into packaging commands.

## before_uninstallcmd

- Add script before uninstallation

#### Function Prototype

```lua
before_uninstallcmd(script: <function (package, batchcmds)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Before uninstall script function with package and batchcmds parameters |

Similar to before_installcmd, please refer to before_installcmd description.

## on_uninstallcmd

- Custom uninstall script

#### Function Prototype

```lua
on_uninstallcmd(script: <function (package, batchcmds)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | Uninstall script function with package and batchcmds parameters |

Similar to on_installcmd, please refer to on_installcmd description.

## after_uninstallcmd

- Add script after uninstallation

#### Function Prototype

```lua
after_uninstallcmd(script: <function (package, batchcmds)>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| script | After uninstall script function with package and batchcmds parameters |

Similar to after_installcmd, please refer to after_installcmd description.

## set_nsis_displayicon

- Set the display icon of NSIS

#### Function Prototype

```lua
set_nsis_displayicon(iconfile: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| iconfile | Icon file path string |

This is an NSIS proprietary API that can be used to configure NSIS display icons:

```lua
xpack("test")
     set_nsis_displayicon("bin/foo.exe")
```

We need to configure the executable file path with an icon so that the icon displayed in the installation package is consistent with it.

This is an optional configuration. Even if we do not configure it, xmake will use the icon in the executable file in the associated target by default.
