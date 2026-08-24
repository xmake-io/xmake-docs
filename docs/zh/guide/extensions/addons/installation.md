---
outline: deep
---

# 安装和使用

Addon 的管理全部通过一个命令完成：`xmake addon`。

## 安装

```sh
$ xmake addon --install esp32-devel                      # 从仓库索引安装
$ xmake addon --install github:xmake-addons/esp32-devel  # 从 github 安装
$ xmake addon --install github:xmake-addons/esp32-devel#dev
$ xmake addon --install https://github.com/user/repo.git # 从任意 git url 安装
$ xmake addon --install /path/to/my-addon                # 从本地目录安装
$ xmake addon --install myrepo@serial-tools              # 从指定仓库安装
```

加 `-y` 跳过所有确认，CI 脚本里通常需要。

## 列出、搜索、卸载、升级

```sh
$ xmake addon --list          # 已安装的，以及可用的
$ xmake addon --search esp32  # 搜索仓库
$ xmake addon --remove esp32-devel
$ xmake addon --remove --all
$ xmake addon --upgrade       # 升级当前工程声明的那些 addon
```

`--force` 可以强制卸载，即使有别的 addon 依赖它。

```sh
$ xmake addon --list
the installed addons:
  -> esp32-devel v1.0.5: The ESP32 development addon ... (toolchains, rules, modules, includes, templates)
  -> serial-tools v1.0.3: The serial port toolkit ... (plugins, modules)
the available addons: (run `xmake addon --install <name>` to install)
  -> avr-devel v1.0.0: The AVR development addon ... (in xmake-repo)
```

## 在工程中使用

工程声明自己需要什么，这样别人克隆下来不用手动装 —— 加载工程时 xmake 会自动安装缺失的 addon：

```lua
add_addons("esp32-devel")           -- 任意版本
add_addons("esp32-devel 1.0.x")     -- 版本范围
```

解析出来的版本会写进 `xmake.lua` 旁边的 `xmake-addons.lock`，保证所有人构建时用的是同一批版本。这个文件建议提交到仓库。

然后引用其中的载荷：

```lua
add_addons("esp32-devel")

includes("@addon/esp32-devel/board")             -- addon 提供的 includes 文件

target("blink")
    add_rules("@addon/esp32-devel/app")          -- addon 提供的规则
    add_files("src/*.c")
```

```lua
import("@addon.serial-tools.serial")             -- 模块用点号，不是斜杠
```

| 引用形式 | 指向 |
| --- | --- |
| `@addon/<name>/<payload>` | 规则、工具链或 includes 文件，供工程接口使用 |
| `@addon.<name>.<module>` | lua 模块，供 `import()` 使用 |
| `@self.<module>` | 当前脚本所属 addon 自己的模块 |

## 文件位置

```
~/.xmake/addons/<name>/<version>/    已安装的载荷
~/.xmake/addons/addons.conf          xmake 启动时读取的注册表
<project>/xmake-addons.lock          当前工程解析出的版本
```

## 配置

Addon 的配置就是它的载荷所声明的那些选项。携带 includes 文件的 addon 一般把选项定义在那里：

```sh
$ xmake f --board=esp32c3 --port=/dev/ttyUSB0
$ xmake f --help                  # addon 的选项会出现在菜单里
```

## 常见问题

**addon 的命令找不到。** 先 `xmake addon --list`：如果确实装了但命令跑的不是它，说明有另一个 addon 或内置插件提供了同名命令 —— xmake 会给出冲突告警，并使用第一个。

**工程反复重装 addon。** 通常是 lock 文件丢了，或者声明的版本范围和已安装的对不上，`xmake addon --upgrade` 重新解析即可。

**安装时报冲突。** 两个 addon 不能提供同名的命令、模板 id 或全局模块名。卸载其中一个，或者请作者改名。
