
# privilege.sudo

This interface is used to run commands via `sudo` and provides platform consistency handling, which can be used for scripts that require root privileges to run.

::: tip NOTE
In order to ensure security, unless you must use it, try not to use this interface in other cases.
:::

## sudo.has

- Determine if sudo supports

At present, sudo is supported only under `macosx/linux`. The administrator privilege running on Windows is not supported yet. Therefore, it is recommended to use the interface to judge the support situation before use.

```lua
import("privilege.sudo")

if sudo.has() then
    sudo.run("rm /system/file")
end
```

## sudo.run

- Quietly running native shell commands

For specific usage, please refer to: [os.run](/api/scripts/builtin-modules/os#os-run).

```lua
import("privilege.sudo")

sudo.run("rm /system/file")
```

## sudo.runv

- Quietly running native shell commands with parameter list

For specific usage, please refer to: [os.runv](/api/scripts/builtin-modules/os#os-runv).

## sudo.exec

- Echo running native shell commands

For specific usage, please refer to: [os.exec](/api/scripts/builtin-modules/os#os-exec).

## sudo.execv

- Echo running native shell commands with parameter list

For specific usage, please refer to: [os.execv](/api/scripts/builtin-modules/os#os-execv).

## sudo.iorun

- Quietly running native shell commands and getting output

For specific usage, please refer to: [os.iorun](/api/scripts/builtin-modules/os#os-iorun).

## sudo.iorunv

- Run the native shell command quietly and get the output with a list of parameters

For specific usage, please refer to: [os.iorunv](/api/scripts/builtin-modules/os#os-iorunv).
