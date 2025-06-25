
# core.base.global

用于获取xmake全局的配置信息，也就是`xmake g|global --xxx=val` 传入的参数选项值。

## global.get

- 获取指定配置值

类似[config.get](/zh/api/scripts/extension-modules/core/project/config#config-get)，唯一的区别就是这个是从全局配置中获取。

## global.load

- 加载配置

类似[global.get](#global-get)，唯一的区别就是这个是从全局配置中加载。

## global.directory

- 获取全局配置信息目录

默认为`~/.config`目录。

## global.dump

- 打印输出所有全局配置信息

输出结果如下：

```lua
{
    clean = true,
    ccache = "ccache",
    xcode_dir = "/Applications/Xcode.app"
}
```
