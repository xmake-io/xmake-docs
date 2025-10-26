
# utils.archive

此模块用于压缩和解压文件。支持大部分常用压缩格式的解压缩，它会自动检测系统提供了哪些压缩工具，然后会使用最合适的压缩工具进行操作。

## archive.archive

- 压缩文件

#### 函数原型

::: tip API
```lua
archive.archive(archivefile: <string>, outputdir: <string>, options: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| archivefile | 必需。压缩文件路径 |
| outputdir | 必需。输出目录路径 |
| options | 可选。配置选项，支持以下选项：<br>- `curdir` - 当前工作目录<br>- `recurse` - 是否递归目录<br>- `compress` - 压缩质量（fastest|faster|default|better|best）<br>- `excludes` - 排除文件列表 |

#### 返回值说明

无返回值

#### 用法说明

```lua
import("utils.archive")

archive.archive("/tmp/a.zip", "/tmp/outputdir")
archive.archive("/tmp/a.7z", "/tmp/outputdir")
archive.archive("/tmp/a.gzip", "/tmp/outputdir")
archive.archive("/tmp/a.tar.bz2", "/tmp/outputdir")
```

还可以添加一些配置选项，如递归目录，压缩质量，排除文件等。

```lua
import("utils.archive")

local options = {}
options.curdir = "/tmp"
options.recurse = true
options.compress = "fastest|faster|default|better|best"
options.excludes = {"*/dir/*", "dir/*"}
archive.archive("/tmp/a.zip", "/tmp/outputdir", options)
```

## archive.extract

- 解压文件

#### 函数原型

::: tip API
```lua
archive.extract(archivefile: <string>, outputdir: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| archivefile | 必需。压缩文件路径 |
| outputdir | 必需。输出目录路径 |

#### 返回值说明

无返回值

#### 用法说明

```lua
import("utils.archive")

archive.extract("/tmp/a.zip", "/tmp/outputdir")
archive.extract("/tmp/a.7z", "/tmp/outputdir")
archive.extract("/tmp/a.gzip", "/tmp/outputdir")
archive.extract("/tmp/a.tar.bz2", "/tmp/outputdir")
```
