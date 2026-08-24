---
outline: deep
---

# esp32-devel

[esp32-devel](https://github.com/xmake-addons/esp32-devel) turns xmake into an ESP32 SDK:
the cross toolchain, the build rules, the flashing and a blink template, in one install.

| Payload | What it provides |
| --- | --- |
| `toolchains/esp32` | the cross toolchain of the selected board (risc-v) |
| `rules/app` | links against the prebuilt esp-idf libs, builds the bootable image, flashes on `xmake install` |
| `includes/board` | the `board`/`port`/`baud` options and the sdk package binding |
| `templates/c/esp32.blink` | `xmake create -t esp32.blink` |
| `modules/private/*` | the board table, the sdk recipe reader and the flasher |

Supported board: **esp32c3**. The application is linked against the **prebuilt esp-idf
libraries** the same way Arduino and PlatformIO do — there is no esp-idf source build — and
the entry point is the esp-idf native `void app_main(void)`.

## Install

```sh
$ xmake addon --install esp32-devel
```

It depends on [serial-tools](/guide/extensions/addons/official/serial-tools), which is installed with it.

## Create and build a project

```sh
$ xmake create -t esp32.blink -l c blink
$ cd blink
$ xmake f --board=esp32c3
$ xmake
```

The build produces the elf plus the three flashable images: the bootloader, the partition
table and the application.

## Flash and monitor

```sh
$ xmake install                    # flash it, the serial port is auto-detected
$ xmake run                        # flash it and then open the serial monitor
$ xmake f --port=/dev/ttyUSB0 --baud=460800
```

## Use it in your own project

```lua
add_addons("esp32-devel")
includes("@addon/esp32-devel/board")

target("blink")
    add_rules("@addon/esp32-devel/app")
    add_files("src/*.c")
```

| Option | Default | Description |
| --- | --- | --- |
| `--board` | `esp32c3` | the target board |
| `--port` | auto-detected | the serial port |
| `--baud` | `460800` | the flashing baud rate |
| `--monitor_baud` | `115200` | the serial monitor baud rate |

## Known gaps

The xtensa boards (esp32/esp32s3) are not supported yet.
