---
outline: deep
---

# serial-tools

[serial-tools](https://github.com/xmake-addons/serial-tools) is a serial port toolkit: the
`xmake monitor` command, plus a serial module the other addons reuse.

| Payload | What it provides |
| --- | --- |
| `plugins/monitor` | the `xmake monitor` command, it streams a serial port to your terminal |
| `modules/serial` | the serial module, so other addons reuse the port detection and the monitor |

It works like `idf.py monitor` or the Arduino serial monitor, without any extra dependency:
it auto-detects the connected port, and speaks to it through `stty` on macOS/Linux/BSD and
through the .NET `System.IO.Ports` api on Windows.

## Install

```sh
$ xmake addon --install serial-tools
```

The board addons ([esp32-devel](/guide/extensions/addons/official/esp32-devel),
[avr-devel](/guide/extensions/addons/official/avr-devel)) depend on it, so installing them installs
this one too.

## Usage

```sh
$ xmake monitor --list                       # the available serial ports
$ xmake monitor                              # the only connected port, 115200 by default
$ xmake monitor --port=/dev/ttyUSB0 --baud=9600
$ xmake monitor --databits=8 --parity=even --stopbits=1
```

`Ctrl-C` exits.

| Option | Default | Description |
| --- | --- | --- |
| `-p, --port` | auto-detected | the serial port |
| `-b, --baud` | `115200` | the baud rate |
| `-d, --databits` | `8` | `5`, `6`, `7`, `8` |
| `--parity` | `none` | `none`, `even`, `odd` |
| `-s, --stopbits` | `1` | `1`, `2` |
| `-l, --list` | | list the available ports |

## Reuse the serial module

Another addon can depend on it and import the module:

```lua
import("@addon.serial-tools.serial")

local port = serial.resolve_port(get_config("port"))   -- auto-detected when nil
serial.monitor(port, {baud = 115200})
```

| Interface | Description |
| --- | --- |
| `serial.ports()` | the available serial ports of the host |
| `serial.resolve_port(port)` | the given port, or auto-detect it (raises when ambiguous) |
| `serial.monitor(port, opt)` | stream until Ctrl-C, `opt = {baud, databits, parity, stopbits, quiet}` |
