
# core.base.global

用于获取xmake全局的配置信息，也就是`xmake g|global --xxx=val` 传入的参数选项值。

## global.get

- 获取指定配置值

#### 函数原型

::: tip API
```lua
global.get(key: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| key | 配置键名 |

#### 用法说明

类似[config.get](/zh/api/scripts/extension-modules/core/project/config#config-get)，唯一的区别就是这个是从全局配置中获取。

## global.load

- 加载配置

#### 函数原型

::: tip API
```lua
global.load()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

类似[global.get](#global-get)，唯一的区别就是这个是从全局配置中加载。

## global.directory

- 获取全局配置信息目录

#### 函数原型

::: tip API
```lua
global.directory()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

默认为`~/.config`目录。

## global.dump

- 打印输出所有全局配置信息

#### 函数原型

::: tip API
```lua
global.dump()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

输出结果如下：

```lua
{
    clean = true,
    ccache = "ccache",
    xcode_dir = "/Applications/Xcode.app"
}
```
