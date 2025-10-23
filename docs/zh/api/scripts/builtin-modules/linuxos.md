
# linuxos

Linux 系统操作模块，属于内置模块，无需使用[import](/zh/api/scripts/builtin-modules/import)导入，可直接脚本域调用其接口。

## linuxos.name

- 获取 linux 系统发行版名称

#### 函数原型

```lua
linuxos.name()
```

#### 参数说明

此函数不需要参数。

#### 用法说明

我们也可以通过下面的命令，快速获取查看

```sh
xmake l linuxos.name
```

目前支持的一些名称有：

- ubuntu
- debian
- archlinux
- manjaro
- linuxmint
- centos
- fedora
- opensuse

## linuxos.version

- 获取 linux 系统版本

#### 函数原型

```lua
linuxos.version()
```

#### 参数说明

此函数不需要参数。

#### 用法说明

返回的版本是 semver 语义版本对象

```lua
if linux.version():ge("10.0") then
    -- ...
end
```

## linuxos.kernelver

- 获取 linux 系统内核版本

#### 函数原型

```lua
linuxos.kernelver()
```

#### 参数说明

此函数不需要参数。

#### 用法说明

返回的也是语义版本对象，也可以执行 `xmake l linuxos.kernelver` 快速查看
