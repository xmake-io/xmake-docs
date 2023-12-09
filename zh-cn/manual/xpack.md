## 打包接口

xpack 作为插件形式提供，它的所有 API 我们需要通过 `includes("@builtin/xpack")` 方式来引入。

```lua
includes("@builtin/xpack")

xpack("test")
    set_version("1.0")
    set_homepage("https://xmake.io")
    add_installfiles("...")
```

### xpack:set_version

#### 设置包版本

这个接口用于设置生成的安装包的版本：

```lua
xpack("test")
    set_version("1.0")
    -- ...
```

如果我们没有设置，但是通过 `set_targets` 绑定了安装的目标程序，那么也会使用 target 中的版本配置。


```lua
target("foo")
    set_version("1.0")

xpack("test")
    set_targets("foo")
    -- ...
```


我们也可以使用全局工程的版本，如果没有绑定任何 targets。


```lua
set_version("1.0")

xpack("xmake")
    -- ...
```


### xpack:set_homepage

#### 设置主页信息

```lua
xpack("xmake")
    set_homepage("https://xmake.io")
```

### xpack:set_title

#### 设置标题信息

通常用于配置安装包的简单描述，相比 `set_description` 更加简短。

```lua
xpack("xmake")
    set_title("Xmake build utility ($(arch))")
```

### xpack:set_description

#### 设置详细描述

这个接口可以设置安装包更加详细的描述信息，可以用一到两句话详细描述下包。

```lua
xpack("xmake")
    set_description("A cross-platform build utility based on Lua.")
```

### xpack:set_author

#### 设置作者信息

我们可以设置邮箱，姓名等来描述这个包的作者。

```lua
xpack("xmake")
    set_author("waruqi@gmail.com")
```

### xpack:set_maintainer

#### 设置维护者信息

我们可以设置邮箱，姓名等来描述这个包的维护者。

维护者跟作者有可能是同一个人，也可能不是一个人。

```lua
xpack("xmake")
    set_maintainer("waruqi@gmail.com")
```

### xpack:set_copyright

#### 设置包的版权信息

```lua
xpack("xmake")
    set_copyright("Copyright (C) 2015-present, TBOOX Open Source Group")
```

### xpack:set_licensefile

#### 设置包的 License 文件

我们可以设置 LICENSE 所在的文件路径，像 NSIS 的安装包，它还会额外将 LICENSE 页面展示给安装用户。

```lua
xpack("xmake")
    set_licensefile("../LICENSE.md")
```

### xpack:set_company

#### 设置包所属的公司

我们可以用这个接口设置包所属的公司和组织名。

```lua
xpack("xmake")
    set_company("tboox.org")
```

### xpack:set_inputkind

#### 设置打包的输入源类型

这是个可选接口，可用于标识当前打包的输入源类型

- binary: 从二进制文件作为输入源打包，通常使用 `add_installfiles`
- source: 从源文件作为输入源开始打包，通常使用 `add_sourcefiles`

这一般用于自定义的打包格式，而对于内置的格式，比如: nsis, zip, srczip 等等，
其实已经能够判断获取到当前打包的输入源是从源码开始打包，还是直接从二进制源开始打包。

因此，除非必要（比如要自定义打包格式），通常我们不需要设置它。

而我们在脚本域中，也可以通过 `package:from_source()` 和 `package:from_binary()` 来判断当前的输入源。

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

如果上面的打包配置，如果是 nsis 包，默认从二进制文件作为输入源，进行打包，会去打包 `add_installfiles` 配置的文件。

而 `srczip`, `srctargz` 和 `runself` 是从源文件开始打包，会去打包 `add_sourcefiles` 中的文件，然后再执行打包脚本。

### xpack:set_formats

#### 设置打包格式

配置当前 XPack 包需要生成的打包格式，可以同时配置多个，`xmake pack` 命令会一次性全部生成。

!> 有些格式如果当前平台不支持生成，会自动忽略。

```lua
xpack("test")
    set_formats("nsis", "zip", "targz", "srczip", "srctargz", "runself")
```

我们也可以通过命令，指定生成其中部分格式，而不是一次性全部生成。

```bash
$ xmake pack -f "nsis,zip"
```

通过逗号分隔，指定生成 NSIS 和 zip 包，暂时忽略其他格式包。

目前支持的格式有：

| 格式     | 说明                              |
| ----     | ----                              |
| nsis     | Windows NSIS 安装包，二进制安装   |
| zip      | 二进制 zip 包，不包含安装脚本     |
| targz    | 二进制 tar.gz 包，不包含安装脚本  |
| srczip   | zip 源码包                        |
| srctargz | tar.gz 源码包                     |
| runself  | 自运行 shell 脚本包，源码编译安装 |
| srpm     | rpm 源码安装包（待支持）          |
| deb      | deb 二进制安装包 （待支持）       |
| 其他     | 可自定义格式和安装脚本            |

### xpack:set_basename

#### 设置包文件名

设置生成包的文件名，但不包含后缀名。

```lua
xpack("xmake")
    set_basename("xmake-v$(version)")
```

我们也可以在其中配置 `$(version)`, `$(plat)`, `$(arch)` 等变量。

另外，想要更灵活的配置，可以再 on_load 脚本中去配置它。

```lua
xpack("xmake")
    on_load(function (package)
        package:set("basename", "xmake-v" .. package:version())
    end)
```

### xpack:set_extension

#### 设置安装包的扩展名

通常我们并不需要修改生成包的扩展名，因为指定了 `nsis`, `zip` 等格式后，都会有一个默认的后缀名，例如：`.exe`, `.zip`。

但是，如果我们正在自定义包格式，需要生成一个自定义的包，那么我们可能需要配置它。

```lua
xpack("mypack")
    set_format("myformat")
    set_extension(".myf")
    on_package(function (package)
        local outputfile = package:outputfile()
        -- TODO
    end)
```

例如，这里我们自定义了一个 myformat 包格式，采用 `.myf` 的自定义后缀名，然后我们就可以在 on_package 中生成它，

`package:outputfile()` 返回的包输出文件名中就会包含这个后缀名。

### xpack:add_targets

#### 关联目标程序

我们可以通过这个接口，配置关联需要被安装的目标 target。

```lua
target("foo")
    set_kind("shared")
    add_files("src/*.cpp")
    add_headerfiles("include/(*.h)")

xpack("test")
    set_formats("nsis")
    add_targets("foo")
```

当生成 test 安装包的时候，被关联的 foo 目标的可执行程序，动态库等待都会被一起打包安装。
另外，target 中通过 `add_headerfiles` 和 `add_installfiles` 配置的自定义安装文件也会被打入安装包，一起被安装。

而且我们还可以在 target 和它的 rules 中通过 `on_installcmd`, `after_installcmd` 等自定义打包安装脚本，也会被一起执行。

### xpack:add_components

#### 添加安装包组件

我们也支持为安装包添加自定义组件，按组件模式进行选择安装。目前仅仅对 NSIS 包会有比较的支持效果。

我们可以通过 `xpack_component()` 定义一个组件域，然后使用 `add_components()` 加指定的组件跟包进行关联绑定。

而在组件中，我们可以通过 `on_installcmd()` 编写一些自定义的安装脚本，只有当这个组件被启用的情况下，才会被执行安装。


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

这里，我们使用 `batchcmds:rawcmd("nsis", "...")` 添加了一个 nsis 特有的安装命令，开启长路径支持。效果如下：

![](/assets/img/manual/nsis_4.png)

只有当我们勾选 LongPath 后，才会启用，当然，我们也可以通过 `set_default()` 配置组件默认是否处于启用状态。

除了 NSIS 包，其他包尽管没有对组件有完善的支持，但是同样会执行组件里面的脚本实现打包，仅仅可能无法显示对应的组件 UI 和勾选框。

### xpack:set_bindir

#### 设置包的二进制安装目录

通常生成的安装包都会有一个安装根目录，而我们可以通过这个配置指定安装目录下的 bin 目录位置。

如果没有指定，默认在 `installdir/bin`。

如果配置了

```lua
xpack("xmake")
    set_bindir("mybin")
```

那么会将可执行文件安装在 `installdir/mybin` 下面，如果是 NSIS 包，安装后，还会自动设置此路径到 `%PATH%`。

### xpack:set_libdir

#### 设置包的库安装目录

通常生成的安装包都会有一个安装根目录，而我们可以通过这个配置指定安装目录下的 lib 目录位置。

如果没有指定，默认在 `installdir/lib`。

如果配置了

```lua
xpack("xmake")
    set_libdir("mylib")
```

那么会将静态库文件安装在 `installdir/mylib` 下面。


### xpack:set_includedir

#### 设置包的头文件安装目录

通常生成的安装包都会有一个安装根目录，而我们可以通过这个配置指定安装目录下的 include 目录位置。

如果没有指定，默认在 `installdir/include`。

如果配置了

```lua
xpack("xmake")
    set_includedir("myinc")
```

那么会将头文件安装在 `installdir/myinc` 下面。

### xpack:set_prefixdir

#### 设置包的安装前缀目录

如果配置了

```lua
xpack("xmake")
    set_prefixdir("prefix")
```

那么会将所有安装文件，安装在 `installdir/prefix` 下面，例如：

```
installdir
  - prefix
    - include
    - lib
    - bin
```

### xpack:set_specfile

#### 设置包 spec 文件路径

有些包格式的生成，需要先生成特定的 spec 文件，然后才能调用第三方打包工具去生成包。

比如 NSIS 包，需要先通过 xmake 根据 xpack 配置，生成 NSIS 特有的 `.nsi` 配置文件，然后 xmake 会再调用 `makensis.exe` 去根据这个 `.nsi` 文件生成 NSIS 包。

而 deb/rpm 等包都有特定的 spec 文件。

xmake 在打包的时候，默认会自动生成一个 spec 文件，但是如果我们想更加深度定制化一些特有包的配置，可以通过这个接口，

配置一个自己的 spec 文件，里面用户自己维护了一些包配置定义，然后可以在里面定义一些 `${PACKAGE_NAME}`, `${VERSION}` 包特有的内置变量，就可以实现包信息替换。

```lua
xpack("xmake")
    set_formats("nsis")
    set_specfile("makensis.nsi")
```

makensis.nsi

```
VIProductVersion                         "${VERSION}.0"
VIFileVersion                            "${VERSION}.0"
VIAddVersionKey /LANG=0 ProductName      "${PACKAGE_NAME}"
VIAddVersionKey /LANG=0 Comments         "${PACKAGE_DESCRIPTION}"
VIAddVersionKey /LANG=0 CompanyName      "${PACKAGE_COMPANY}"
VIAddVersionKey /LANG=0 LegalCopyright   "${PACKAGE_COPYRIGHT}"
VIAddVersionKey /LANG=0 FileDescription  "${PACKAGE_NAME} Installer - v${VERSION}"
VIAddVersionKey /LANG=0 OriginalFilename "${PACKAGE_FILENAME}"
```

下面是一些内置的常用包变量：

| 变量名 | 描述 |
| ------ | ---- |
| PACKAGE_ARCH        | 包二进制文件的架构 |
| PACKAGE_PLAT        | 包二进制文件的平台 |
| PACKAGE_NAME        | 包名 |
| PACKAGE_TITLE       | 包的简单描述 |
| PACKAGE_DESCRIPTION | 包的详细描述 |
| PACKAGE_FILENAME    | 包文件名 |
| PACKAGE_AUTHOR      | 包作者 |
| PACKAGE_MAINTAINER  | 包维护者 |
| PACKAGE_HOMEPAGE    | 包主页地址 |
| PACKAGE_COPYRIGHT   | 包的版权信息 |
| PACKAGE_COMPANY     | 包所属的公司名 |
| PACKAGE_ICONFILE    | 包的图标文件路劲 |
| PACKAGE_LICENSEFILE | 包的 LICENSE 文件路径 |
| PACKAGE_VERSION_MAJOR | 包的 major 版本 |
| PACKAGE_VERSION_MINOR | 包的 minor 版本 |
| PACKAGE_VERSION_ALTER | 包的 alter 版本 |
| PACKAGE_VERSION_BUILD | 包的 build 版本 |

除了内置变量，我们也可以通过 `set_specvar` 接口去配置一些自定义的模版变量。

### xpack:set_specvar

#### 设置包 spec 文件的自定义变量

通常配合 `set_specfile` 接口一起使用，用于在自定义的 spec 模版文件里面，设置一些自定义的包变量。

```lua
xpack("xmake")
    set_formats("nsis")
    set_specfile("makensis.nsi")
    set_specvar("FOO", "hello")
```

makensis.nsi

```
VIAddVersionKey /LANG=0 ProductName      "${FOO}"
```

在生成包之前，xmake 会替换 `${FOO}` 成 hello，然后再调用 `makensis.exe` 命令根据这个文件生成 NSIS 安装包。


### xpack:set_iconfile

#### 设置图标文件路径

我们可以额外配置一个 ico 的图标文件，可以用于设置 NSIS 等一些支持图标自定义的安装包的图标。

```lua
xpack("xmake")
    set_iconfile("xmake.ico")
```

### xpack:add_sourcefiles

#### 添加源文件

这通常用于源码包，也就是 `srczip`, `srctargz` 这种纯源码包，以及 `runself` 格式的源码安装包。

如果是自定义的包格式，我们需要配置 `set_inputkind("source")` 开启源码包。

通过这个接口，可以自定义配置那些源文件需要被打入包中，用于后期的编译安装。

它的详细用法跟 `add_installfiles` 类似，可以参考它的文档描述。

### xpack:add_installfiles

#### 添加二进制文件

这通常用于二进制包，也就是 `nsis`, `deb` 等格式的包，这些包会直接安装二进制文件。

因此，我们可以通过这个接口额外配置一些需要被安装的二进制文件，比如：可执行文件，资源文件等等。

比如我们可以指定安装各种类型的文件到安装目录：

```lua
xpack("test")
    add_installfiles("src/*.h")
    add_installfiles("doc/*.md")
```

我们也可以指定安装到特定子目录：

```lua
xpack("test")
    add_installfiles("src/*.h", {prefixdir = "include"})
    add_installfiles("doc/*.md", {prefixdir = "share/doc"})
```

上面的设置，我们会安装到`installdir/include/*.h`, `installdir/share/doc/*.md`。

注：默认安装不会保留目录结构，会完全展开，当然我们也可以通过`()`去提取源文件中的子目录结构来安装，例如：

```lua
xpack("test")
    add_installfiles("src/(tbox/*.h)", {prefixdir = "include"})
    add_installfiles("doc/(tbox/*.md)", {prefixdir = "share/doc"})
```

### xpack:on_load

#### 自定义加载脚本

如果在描述域中配置无法满足我们的需求，还可以在 on_load 自定义脚本域中，进一步灵活的配置包。

这个接口会在每个 XPack 包初始化加载期间就被调用，可以在里面做一些基础配置。

例如在里面动态地修改包文件名：

```lua
xpack("test")
    on_load(function (package)
        package:set("basename", "test-" .. package:version())
    end)
```

### xpack:before_package

#### 自定义打包之前的脚本

我们可以通过这个接口配置打包之前的自定义脚本。

```lua
xpack("test")
    before_package(function (package)
        -- TODO
    end)
```

### xpack:on_package

#### 自定义打包脚本

我们可以通过这个接口配置打包自定义脚本，这将会重写整个内置的打包逻辑。通常用于自定义包格式。

```lua
xpack("test")
    set_formats("xxx")
    on_package(function (package)
        -- TODO
    end)
```

### xpack:after_package

#### 自定义打包之后的脚本

我们可以通过这个接口配置打包之后的自定义脚本。

```lua
xpack("test")
    after_package(function (package)
        -- TODO
    end)
```

### xpack:before_installcmd
### xpack:before_uninstallcmd
### xpack:on_installcmd
### xpack:on_uninstallcmd
### xpack:after_installcmd
### xpack:after_uninstallcmd
### xpack:set_nsis_displayicon

## 组件接口

### xpack_component:set_title

#### 设置包组件的简单描述

```lua
xpack_component("LongPath")
    set_title("Enable Long Path")
```

### xpack_component:set_description

#### 设置包组件的详细描述

```lua
xpack_component("LongPath")
    set_description("Increases the maximum path length limit, up to 32,767 characters (before 256).")
```

### xpack_component:set_default

#### 设置包组件的默认启用状态

通常包组件都会被默认启用，但是我们也可以使用这个接口，默认禁用这个组件，仅仅当用户安装包时候，选择勾选此组件，才会被启用安装。

```lua
xpack_component("LongPath")
    set_default(false)
    set_title("Enable Long Path")
```

### xpack_component:on_load
### xpack_component:before_installcmd
### xpack_component:before_uninstallcmd
### xpack_component:on_installcmd
### xpack_component:on_uninstallcmd
### xpack_component:after_installcmd
### xpack_component:after_uninstallcmd
### xpack_component:add_sourcefiles
### xpack_component:add_installfiles

