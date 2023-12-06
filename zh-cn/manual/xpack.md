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
### xpack:set_formats
### xpack:set_basename
### xpack:set_extension
### xpack:add_targets
### xpack:add_components
### xpack:set_bindir
### xpack:set_libdir
### xpack:set_includedir
### xpack:set_prefixdir
### xpack:set_nsis_displayicon
### xpack:set_specfile
### xpack:set_iconfile
### xpack:add_sourcefiles
### xpack:add_installfiles
### xpack:on_load
### xpack:before_package
### xpack:on_package
### xpack:after_package
### xpack:before_installcmd
### xpack:before_uninstallcmd
### xpack:on_installcmd
### xpack:on_uninstallcmd
### xpack:after_installcmd
### xpack:after_uninstallcmd
### xpack:set_specvar

## 组件接口

### xpack_component:set_title
### xpack_component:set_description
### xpack_component:set_default
### xpack_component:on_load
### xpack_component:before_installcmd
### xpack_component:before_uninstallcmd
### xpack_component:on_installcmd
### xpack_component:on_uninstallcmd
### xpack_component:after_installcmd
### xpack_component:after_uninstallcmd
### xpack_component:add_sourcefiles
### xpack_component:add_installfiles

