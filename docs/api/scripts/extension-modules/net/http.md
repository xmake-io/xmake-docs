# net.http

This module provides various operational support for http. The currently available interfaces are as follows:

## http.download

- Download http file

#### Function Prototype

::: tip API
```lua
http.download(url: <string>, outputfile: <string>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| url | Required. URL to download |
| outputfile | Required. Output file path |
| opt | Optional. Option parameters, supports the following:<br>- `headers` - HTTP headers<br>- `timeout` - Timeout duration<br>- `useragent` - User agent |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

This interface is relatively simple, is simply download files.

```lua
import("net.http")

http.download("https://xmake.io", "/tmp/index.html")
```
