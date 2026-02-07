# cli.iconv <Badge type="tip" text="v3.0.7" />

- Convert file encoding

This module allows you to convert the encoding of text files. It supports various encodings like UTF-8, GBK, UTF-16, etc.

It can be used in configuration files or directly from the command line.

### convert

Convert a file from one encoding to another.

```lua
import("cli.iconv")

-- Convert file from GBK to UTF-8
iconv.convert("src.txt", "dst.txt", {from = "gbk", to = "utf8"})
```

We can also use it from the command line:

```bash
$ xmake l cli.iconv --from=gbk --to=utf8 src.txt dst.txt
```
