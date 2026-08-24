---
outline: deep
---

# esp32-devel

[esp32-devel](https://github.com/xmake-addons/esp32-devel) 把 xmake 变成一套 ESP32 SDK：交叉工具链、构建规则、烧写和 blink 模板，装一次全都有。

| 载荷 | 提供什么 |
| --- | --- |
| `toolchains/esp32` | 所选开发板的交叉工具链（risc-v） |
| `rules/app` | 链接预编译的 esp-idf 库、生成可启动镜像，`xmake install` 时烧写 |
| `includes/board` | `board`/`port`/`baud` 等选项，以及 sdk 包的绑定 |
| `templates/c/esp32.blink` | `xmake create -t esp32.blink` |
| `modules/private/*` | 板级表、sdk 配方读取和烧写器 |

支持的开发板：**esp32c3**。应用是链接 **预编译的 esp-idf 库**，方式和 Arduino、PlatformIO 一致 —— 不需要编译 esp-idf 源码 —— 入口就是 esp-idf 原生的 `void app_main(void)`。

## 安装

```sh
$ xmake addon --install esp32-devel
```

它依赖 [serial-tools](/zh/guide/extensions/addons/official/serial-tools)，会被一并装上。

## 创建并构建工程

```sh
$ xmake create -t esp32.blink -l c blink
$ cd blink
$ xmake f --board=esp32c3
$ xmake
```

构建会生成 elf，以及三个可烧写镜像：bootloader、分区表和应用。

## 烧写和串口

```sh
$ xmake install                    # 烧写，串口自动探测
$ xmake run                        # 烧写完顺带打开串口监视
$ xmake f --port=/dev/ttyUSB0 --baud=460800
```

## 在自己的工程里使用

```lua
add_addons("esp32-devel")
includes("@addon/esp32-devel/board")

target("blink")
    add_rules("@addon/esp32-devel/app")
    add_files("src/*.c")
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `--board` | `esp32c3` | 目标开发板 |
| `--port` | 自动探测 | 串口 |
| `--baud` | `460800` | 烧写波特率 |
| `--monitor_baud` | `115200` | 串口监视波特率 |

## 已知限制

xtensa 系列（esp32/esp32s3）暂不支持。
