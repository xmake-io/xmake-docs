
# privilege.sudo

此接口用于通过`sudo`来运行命令，并且提供了平台一致性处理，对于一些需要root权限运行的脚本，可以使用此接口。

::: tip 注意
为了保证安全性，除非必须使用的场合，其他情况下尽量不要使用此接口。
:::

## sudo.has

-  判断sudo是否支持

目前仅在`macosx/linux`下支持sudo，windows上的管理员权限运行暂时还不支持，因此建议使用前可以通过此接口判断支持情况后，针对性处理。

```lua
import("privilege.sudo")

if sudo.has() then
    sudo.run("rm /system/file")
end
```

## sudo.run

- 安静运行原生shell命令

具体用法可参考：[os.run](/zh/api/scripts/builtin-modules/os#os-run)。

```lua
import("privilege.sudo")

sudo.run("rm /system/file")
```

## sudo.runv

- 安静运行原生shell命令，带参数列表

具体用法可参考：[os.runv](/zh/api/scripts/builtin-modules/os#os-runv)。

## sudo.exec

- 回显运行原生shell命令

具体用法可参考：[os.exec](/zh/api/scripts/builtin-modules/os#os-exec)。

## sudo.execv

- 回显运行原生shell命令，带参数列表

具体用法可参考：[os.execv](/zh/api/scripts/builtin-modules/os#os-execv)。

## sudo.iorun

- 安静运行原生shell命令并获取输出内容

具体用法可参考：[os.iorun](/zh/api/scripts/builtin-modules/os#os-iorun)。

## sudo.iorunv

- 安静运行原生shell命令并获取输出内容，带参数列表

具体用法可参考：[os.iorunv](/zh/api/scripts/builtin-modules/os#os-iorunv)。
