# net.http

此模块提供http的各种操作支持，目前提供的接口如下：

## http.download

- 下载http文件

#### 函数原型

::: tip API
```lua
http.download(url: <string>, outputfile: <string>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| url | 必需。要下载的URL地址 |
| outputfile | 必需。输出文件路径 |
| opt | 可选。选项参数，支持以下选项：<br>- `headers` - HTTP头信息<br>- `timeout` - 超时时间<br>- `useragent` - 用户代理 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 下载成功返回 true，失败返回 false |

#### 用法说明

这个接口比较简单，就是单纯的下载文件。

```lua
import("net.http")

http.download("https://xmake.io", "/tmp/index.html")
```
