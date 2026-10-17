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

## Select a downloader <Badge type="tip" text="v3.1.2" />

```lua
import("net.http")
http.download("https://xmake.io", "index.html", {downloader = "curl"})
```

Supported values are `aria2`, `curl`, `wget`, `powershell`, and `pwsh`.
Selection precedence is call options, an available command-line `downloader` option,
global configuration, then the `XMAKE_DOWNLOADER` environment variable.
Use `xmake g --downloader=curl` to set the global default.
An explicitly selected tool fails if unavailable or unable to download; it does not
silently switch backends. Without a selection, the normal available-tool order applies.
