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

xpack("test")
    -- ...
```


### xpack:set_homepage
### xpack:set_title
### xpack:set_author
### xpack:set_maintainer
### xpack:set_description
### xpack:set_inputkind
### xpack:set_copyright
### xpack:set_company
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
### xpack:set_licensefile
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

