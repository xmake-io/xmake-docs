# net.http

This module provides various operational support for http. The currently available interfaces are as follows:

## http.download

- Download http file

This interface is relatively simple, is simply download files.

```lua
import("net.http")

http.download("https://xmake.io", "/tmp/index.html")
```
