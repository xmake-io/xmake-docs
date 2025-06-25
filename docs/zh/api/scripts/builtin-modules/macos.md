
# macos

macOS 系统操作模块，属于内置模块，无需使用[import](/zh/api/scripts/builtin-modules/import)导入，可直接脚本域调用其接口。

## macos.version

- 获取 macOS 系统版本

返回的版本是 semver 语义版本对象

```lua
if macos.version():ge("10.0") then
    -- ...
end
```
