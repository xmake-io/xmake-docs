# cli.iconv <Badge type="tip" text="v3.0.7" />

- 转换文件编码

这个模块允许你转换文本文件的编码。它支持各种编码，如 UTF-8, GBK, UTF-16 等。

它可以在配置文件中使用，也可以直接从命令行使用。

### convert

将文件从一种编码转换为另一种编码。

```lua
import("cli.iconv")

-- 将文件从 GBK 转换为 UTF-8
iconv.convert("src.txt", "dst.txt", {from = "gbk", to = "utf8"})
```

我们也可以从命令行使用它：

```bash
$ xmake l cli.iconv --from=gbk --to=utf8 src.txt dst.txt
```
