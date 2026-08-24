---
outline: deep
---

# 编写 Addon

一个 addon 就是一个目录：一份 manifest，加上若干载荷目录。除此之外不需要任何东西 —— 没有构建步骤，也不用注册。

## 目录结构

```
my-addon/
├── addon.lua              # manifest，唯一必需的文件
├── README.md
├── tests/test.lua         # 不会被安装
└── src/                   # 载荷根目录，@see set_sourcedir
    ├── plugins/hello/     # xmake hello           （新命令）
    ├── rules/app/         # add_rules("@addon/my-addon/app")
    ├── toolchains/mycc/   # set_toolchains("@addon/my-addon/mycc")
    ├── modules/           # import("@addon.my-addon.foo")
    ├── includes/board/    # includes("@addon/my-addon/board")
    └── templates/c/foo/   # xmake create -t foo
```

只有载荷目录会被安装，所以 tests、CI 脚本和 README 不会进到用户的 `~/.xmake/addons/<name>/<version>/`。

## Manifest

```lua
-- addon.lua
addon("my-addon")
    set_homepage("https://github.com/me/my-addon")
    set_description("这个 addon 提供什么，一句话说清。")
    set_license("Apache-2.0")
    set_sourcedir("src")            -- 载荷直接放仓库根目录时可省略
    add_deps("serial-tools")        -- 依赖的其它 addon
```

| 接口 | 说明 |
| --- | --- |
| `addon("name")` | addon 名字，不依赖仓库名 |
| `set_description` / `set_homepage` / `set_license` | 元信息，`xmake addon --list` 会显示 |
| `set_sourcedir` | 仓库内的载荷根目录 |
| `add_deps` | 依赖的其它 addon |
| `add_globalmodules` | 把模块暴露成全局名字，见下文 |

## 用 `@self` 引用自己

Addon 绝不该硬编码自己的名字 —— 它随时可以问出来：

```lua
-- 在这个 addon 的 rule、toolchain 或 plugin 里
import("@self.private.board")
```

```lua
-- 确实需要名字时，比如把自己的工具链绑到 target 上
import("core.package.addon")
local addonname = assert(addon.owner(), "not in an addon!")
target:set("toolchains", "@addon/" .. addonname .. "/mycc")
```

## 自带 package 定义

工具链类 addon 通常需要二进制。把 package 定义放在 includes 文件里，让工程一行引入：

```lua
-- src/includes/packages/xmake.lua
package("my-toolchain")
    set_kind("toolchain")
    add_urls("https://.../$(version).tar.gz")
    add_versions("1.0.0", "<sha256>")
    on_install(function (package)
        os.cp("*", package:installdir())
    end)
package_end()
```

```lua
-- src/includes/board/xmake.lua
includes("../packages")
option("board", {default = "uno", description = "Set the target board."})
add_requires("my-toolchain")
```

工程侧只需要写一行 `includes("@addon/my-addon/board")`。

## 全局模块

`add_globalmodules(...)` 把模块暴露成不带命名空间的名字。**只有** xmake 自己按名字去查的那些地方才需要它：

```lua
addon("avr-devel")
    add_globalmodules("detect.tools.find_avrdude",  -- find_tool("avrdude")
                      "core.tools.avr_gcc")         -- 编译器对应的 tool 模块
```

```lua
-- src/modules/core/tools/avr_gcc.lua
inherit("core.tools.gcc")   -- avr-gcc 就是 gcc 的交叉版本
```

其余模块一律保持命名空间引用。和 xmake 自身模块、或和别的 addon 重名的全局模块，在安装时就会被拒绝。

## 本地测试

```sh
$ xmake addon --install .           # 从工作副本安装
$ xmake addon --list
$ xmake hello                       # 实际跑一下载荷
$ xmake addon --remove my-addon
```

写一个 `tests/test.lua`，装 → 跑 → 卸载，这是标准做法 —— 它走的正是用户的路径，同一份脚本在 CI 里也能直接跑。

## 提交到 xmake-repo

Addon 放在 `addons/<首字母>/<name>/xmake.lua`，和 C/C++ 包并列：

```lua
package("my-addon")
    set_kind("addon")
    set_homepage("https://github.com/me/my-addon")
    set_description("这个 addon 提供什么，一句话说清。")
    set_license("Apache-2.0")

    add_urls("https://github.com/me/my-addon/archive/refs/tags/$(version).tar.gz",
             "https://github.com/me/my-addon.git")
    add_versions("v1.0.0", "<sha256>")

    add_deps("serial-tools", {kind = "addon"})

    on_test(function (package)
        assert(package:has_addon({rules = "app", toolchains = "mycc",
                                  plugins = "hello", templates = "c/foo"}))
    end)
```

1. 在你的 addon 仓库里打一个 tag。
2. 算出归档的 sha256：`xmake l hash.sha256 <file>`。
3. 加上 recipe，然后用仓库 CI 同样的方式测一遍：

```sh
$ xmake l scripts/test_addons.lua --addon my-addon
```

它会从你本地的 xmake-repo 检出安装、执行 `on_test`、再卸载掉。

4. 给 [xmake-repo](https://github.com/xmake-io/xmake-repo) 提 PR。

`add_deps` 在两个文件里各写一遍是有意为之：recipe 是 xmake 在**下载源码之前**就要读的，manifest 是本地目录安装时读的。仓库的测试脚本会检查两者是否一致。

## 注意事项

- 命令名和模板 id 是全局的，取名尽量避开容易撞车的词。
- 版本来自 package recipe，所以升级时改 tag，不用改 `addon.lua`。
- `set_sourcedir` 是把 `tests/` 挡在安装之外的关键。
