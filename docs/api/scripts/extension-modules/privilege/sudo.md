
# privilege.sudo

This interface is used to run commands via `sudo` and provides platform consistency handling, which can be used for scripts that require root privileges to run.

::: tip NOTE
In order to ensure security, unless you must use it, try not to use this interface in other cases.
:::

## sudo.has

- Determine if sudo supports

#### Function Prototype

::: tip API
```lua
sudo.has()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if sudo is supported, false otherwise |

#### Usage

At present, sudo is supported only under `macosx/linux`. The administrator privilege running on Windows is not supported yet. Therefore, it is recommended to use the interface to judge the support situation before use.

```lua
import("privilege.sudo")

if sudo.has() then
    sudo.run("rm /system/file")
end
```

## sudo.run

- Quietly running native shell commands

#### Function Prototype

::: tip API
```lua
sudo.run(cmd: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| cmd | Required. Shell command to execute |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

For specific usage, please refer to: [os.run](/api/scripts/builtin-modules/os#os-run).

```lua
import("privilege.sudo")

sudo.run("rm /system/file")
```

## sudo.runv

- Quietly running native shell commands with parameter list

#### Function Prototype

::: tip API
```lua
sudo.runv(argv: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| argv | Required. Command argument list |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

For specific usage, please refer to: [os.runv](/api/scripts/builtin-modules/os#os-runv).

## sudo.exec

- Echo running native shell commands

#### Function Prototype

::: tip API
```lua
sudo.exec(cmd: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| cmd | Required. Shell command to execute |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

For specific usage, please refer to: [os.exec](/api/scripts/builtin-modules/os#os-exec).

## sudo.execv

- Echo running native shell commands with parameter list

#### Function Prototype

::: tip API
```lua
sudo.execv(argv: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| argv | Required. Command argument list |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

For specific usage, please refer to: [os.execv](/api/scripts/builtin-modules/os#os-execv).

## sudo.iorun

- Quietly running native shell commands and getting output

#### Function Prototype

::: tip API
```lua
sudo.iorun(cmd: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| cmd | Required. Shell command to execute |

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns output content on success, nil on failure |

#### Usage

For specific usage, please refer to: [os.iorun](/api/scripts/builtin-modules/os#os-iorun).

## sudo.iorunv

- Run the native shell command quietly and get the output with a list of parameters

#### Function Prototype

::: tip API
```lua
sudo.iorunv(argv: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| argv | Required. Command argument list |

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns output content on success, nil on failure |

#### Usage

For specific usage, please refer to: [os.iorunv](/api/scripts/builtin-modules/os#os-iorunv).
