---
outline: deep
---

# avr-devel

[avr-devel](https://github.com/xmake-addons/avr-devel) 是 esp32-devel 在 8 位 AVR 上的对应物：avr 交叉工具链、构建规则、烧写和 blink 模板。

| 载荷 | 提供什么 |
| --- | --- |
| `toolchains/avr` | 所选开发板的 avr 交叉工具链 |
| `rules/app` | 生成可烧写镜像、报告固件大小，`xmake install` 时烧写 |
| `includes/board` | 板级选项，以及 `avr-gcc` / `avrdude` 的包定义 |
| `templates/c/avr.blink` | `xmake create -t avr.blink` |
| `modules/*` | 板级表、镜像生成、烧写器和工具探测模块 |

支持的开发板：**uno**、**nano**（ATmega328P）和 **mega2560**（ATmega2560）。

工具链由这个 addon 自带的包定义提供，不用手动装：`avr-gcc` 自带 avr-libc、启动代码和器件链接脚本 —— 入口就是普通的 `int main(void)`；`avrdude` 通过板载串口 bootloader 烧写，不需要额外的编程器。

## 安装

```sh
$ xmake addon --install avr-devel
```

## 创建并构建工程

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

## 烧写和串口

```sh
$ xmake install                    # 烧写，串口自动探测
$ xmake run                        # 烧写完顺带看串口输出
$ xmake f --port=/dev/ttyUSB0 --baud=57600
```

## 在自己的工程里使用

```lua
add_addons("avr-devel")
includes("@addon/avr-devel/board")

target("blink")
    add_rules("@addon/avr-devel/app")
    add_files("src/*.c")
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `--board` | `uno` | `uno`、`nano` 或 `mega2560` |
| `--f_cpu` | 板子的频率 | cpu 频率（Hz），比如 8MHz 的变种用 `8000000` |
| `--port` | 自动探测 | 串口 |
| `--baud` | 板子 bootloader 的波特率 | 烧写波特率 |
| `--monitor_baud` | `9600` | 串口监视波特率 |

## 已知限制

只支持串口 bootloader 烧写，不支持 ISP 编程器。预编译工具链没有 macOS arm64 版本，在 Rosetta 下运行。
