
# utils.archive

This module is used to compress and decompress files. It supports decompression of most common compression formats. It will automatically detect which compression tools are provided by the system, and then will use the most appropriate compression tool for the operation.

## archive.archive

- zip files

#### Function Prototype

::: tip API
```lua
archive.archive(archivefile: <string>, outputdir: <string>, options: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| archivefile | Required. Archive file path |
| outputdir | Required. Output directory path |
| options | Optional. Configuration options, supports the following:<br>- `curdir` - Current working directory<br>- `recurse` - Whether to recurse directories<br>- `compress` - Compression quality (fastest|faster|default|better|best)<br>- `excludes` - Exclude files list |

#### Return Value

No return value

#### Usage

```lua
import("utils.archive")

archive.archive("/tmp/a.zip", "/tmp/outputdir")
archive.archive("/tmp/a.7z", "/tmp/outputdir")
archive.archive("/tmp/a.gzip", "/tmp/outputdir")
archive.archive("/tmp/a.tar.bz2", "/tmp/outputdir")
```

Some configuration options can also be added, such as recursive directories, compression quality, exclude files, etc.

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

- unzip files

#### Function Prototype

::: tip API
```lua
archive.extract(archivefile: <string>, outputdir: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| archivefile | Required. Archive file path |
| outputdir | Required. Output directory path |

#### Return Value

No return value

#### Usage

```lua
import("utils.archive")

archive.extract("/tmp/a.zip", "/tmp/outputdir")
archive.extract("/tmp/a.7z", "/tmp/outputdir")
archive.extract("/tmp/a.gzip", "/tmp/outputdir")
archive.extract("/tmp/a.tar.bz2", "/tmp/outputdir")
```
