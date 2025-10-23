
# macos

macOS 系统操作模块，属于内置模块，无需使用[import](/zh/api/scripts/builtin-modules/import)导入，可直接脚本域调用其接口。

## macos.version

- 获取 macOS 系统版本

#### 函数原型

```lua
macos.version()
```

#### 参数说明

此函数不需要参数。

#### 用法说明

返回的版本是 semver 语义版本对象

```lua
if macos.version():ge("10.0") then
    -- ...
end
```
