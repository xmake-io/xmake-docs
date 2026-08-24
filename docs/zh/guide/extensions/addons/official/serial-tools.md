---
outline: deep
---

# serial-tools

[serial-tools](https://github.com/xmake-addons/serial-tools) 是串口工具包：提供 `xmake monitor` 命令，以及一个供其它 addon 复用的串口模块。

| 载荷 | 提供什么 |
| --- | --- |
| `plugins/monitor` | `xmake monitor` 命令，把串口输出实时打到终端 |
| `modules/serial` | 串口模块，其它 addon 可复用端口探测和监视能力 |

用起来类似 `idf.py monitor` 和 Arduino 的串口监视器，但不需要任何额外依赖：自动探测已连接的串口，macOS/Linux/BSD 走 `stty`，Windows 走 .NET 的 `System.IO.Ports` 接口。

## 安装

```sh
$ xmake addon --install serial-tools
```

板级 addon（[esp32-devel](/zh/guide/extensions/addons/official/esp32-devel)、[avr-devel](/zh/guide/extensions/addons/official/avr-devel)）依赖它，装它们时会自动带上。

## 使用

```sh
$ xmake monitor --list                       # 列出可用串口
$ xmake monitor                              # 监视唯一连接的串口，默认 115200
$ xmake monitor --port=/dev/ttyUSB0 --baud=9600
$ xmake monitor --databits=8 --parity=even --stopbits=1
```

`Ctrl-C` 退出。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `-p, --port` | 自动探测 | 串口设备 |
| `-b, --baud` | `115200` | 波特率 |
| `-d, --databits` | `8` | `5`、`6`、`7`、`8` |
| `--parity` | `none` | `none`、`even`、`odd` |
| `-s, --stopbits` | `1` | `1`、`2` |
| `-l, --list` | | 列出可用串口 |

## 复用串口模块

其它 addon 可以依赖它并导入模块：

```lua
import("@addon.serial-tools.serial")

local port = serial.resolve_port(get_config("port"))   -- 传 nil 则自动探测
serial.monitor(port, {baud = 115200})
```

| 接口 | 说明 |
| --- | --- |
| `serial.ports()` | 主机上可用的串口 |
| `serial.resolve_port(port)` | 返回给定串口，为 nil 时自动探测（有多个时报错） |
| `serial.monitor(port, opt)` | 监视到 Ctrl-C，`opt = {baud, databits, parity, stopbits, quiet}` |
