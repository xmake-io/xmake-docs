---
outline: deep
---

# yaml

[yaml](https://github.com/xmake-addons/yaml) 提供纯 lua 实现的 yaml 解析器和生成器，外加一个命令行工具。零外部依赖，xmake 能跑的地方它都能跑。

| 目录 | 提供什么 |
| --- | --- |
| `modules/yaml` | 公开模块，`import("@addon.yaml.yaml")` |
| `modules/private/yaml/*` | 扫描、解析、生成和命令行的内部实现 |

支持实际项目里会遇到的语法：块映射和块序列（含 `- name: foo` 紧凑写法）、流式集合、带转义的引号标量、块标量（`|`、`>-`、`|2+`）、锚点/别名/合并键、标准 tag 和多文档。

## 安装

```sh
$ xmake addon --install yaml
```

## 命令行

```sh
$ xmake l @addon.yaml.yaml --help
$ xmake l @addon.yaml.yaml config.yaml            # 格式化
$ xmake l @addon.yaml.yaml -f json config.yaml    # 转成 json（还支持 lua）
$ xmake l @addon.yaml.yaml -g jobs.build.name ci.yaml   # 取某个路径的值
$ xmake l @addon.yaml.yaml -c config.yaml         # 只做语法检查
$ cat config.yaml | xmake l @addon.yaml.yaml -f json
```

## 在脚本里使用

```lua
import("@addon.yaml.yaml")

local value = yaml.decode("name: xmake\ntags: [build, lua]")
print(value.tags[1])                       -- build

local text = yaml.encode({name = "xmake", tags = yaml.mark_as_array({"build"})})
local conf = yaml.loadfile("config.yaml")
yaml.savefile("config.yaml", conf)
```

| 接口 | 说明 |
| --- | --- |
| `yaml.decode(text)` | 解析第一个文档 |
| `yaml.decode_all(text)` | 解析所有文档 |
| `yaml.encode(value, opt)` | `opt = {indent = 2, sortkeys = true, blockstyle = true}` |
| `yaml.loadfile(path, opt)` / `yaml.savefile(path, value, opt)` | 文件读写 |
| `yaml.null()` / `yaml.is_null(v)` | null 值 |
| `yaml.mark_as_array(t)` | 让空表输出成 `[]` |

null 值和数组标记直接复用 `core.base.json` 的，所以解析结果可以原样交给 `json.encode`。
