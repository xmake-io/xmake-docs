# net.http

此模块提供http的各种操作支持，目前提供的接口如下：

## http.download

- 下载http文件

这个接口比较简单，就是单纯的下载文件。

```lua
import("net.http")

http.download("https://xmake.io", "/tmp/index.html")
```
