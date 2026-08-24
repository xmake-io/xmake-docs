---
outline: deep
---

# avr-devel

[avr-devel](https://github.com/xmake-addons/avr-devel) is the 8-bit AVR counterpart of
esp32-devel: the avr cross toolchain, the build rules, the flashing and a blink template.

| Payload | What it provides |
| --- | --- |
| `toolchains/avr` | the avr cross toolchain of the selected board |
| `rules/app` | builds the flashable image, reports the firmware size, flashes on `xmake install` |
| `includes/board` | the board options and the `avr-gcc` / `avrdude` package definitions |
| `templates/c/avr.blink` | `xmake create -t avr.blink` |
| `modules/*` | the board table, the image builder, the flasher and the tool finders |

Supported boards: **uno**, **nano** (ATmega328P) and **mega2560** (ATmega2560).

The toolchain comes from the packages the addon ships, so nothing has to be installed by
hand: `avr-gcc` brings avr-libc, the startup code and the device linker scripts — the entry
point is a plain `int main(void)` — and `avrdude` writes the image over the serial
bootloader of the board, no programmer needed.

## Install

```sh
$ xmake addon --install avr-devel
```

## Create and build a project

```sh
$ xmake create -t avr.blink -l c blink
$ cd blink
$ xmake f --board=uno
$ xmake
```

```
[ 38%]: linking.release blink.elf
[ 56%]: generating.release blink.hex

AVR Memory Usage
----------------
Device: atmega328p

Program:     296 bytes (0.9% Full)
Data:         50 bytes (2.4% Full)
```

## Flash and monitor

```sh
$ xmake install                    # flash it, the serial port is auto-detected
$ xmake run                        # flash it and then watch the serial output
$ xmake f --port=/dev/ttyUSB0 --baud=57600
```

## Use it in your own project

```lua
add_addons("avr-devel")
includes("@addon/avr-devel/board")

target("blink")
    add_rules("@addon/avr-devel/app")
    add_files("src/*.c")
```

| Option | Default | Description |
| --- | --- | --- |
| `--board` | `uno` | `uno`, `nano` or `mega2560` |
| `--f_cpu` | the frequency of the board | the cpu frequency in Hz, e.g. `8000000` |
| `--port` | auto-detected | the serial port |
| `--baud` | the bootloader rate of the board | the flashing baud rate |
| `--monitor_baud` | `9600` | the serial monitor baud rate |

## Known gaps

Only the serial bootloader is supported, an ISP programmer is not. The prebuilt toolchain
has no macOS arm64 build, it runs under Rosetta.
