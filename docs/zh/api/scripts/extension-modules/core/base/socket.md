
# socket

socket 模块提供了跨平台的网络套接字功能，支持 TCP、UDP 和 Unix 域套接字。这是 xmake 的扩展模块。

::: tip 提示
使用此模块需要先导入：`import("core.base.socket")`
:::

## socket.tcp

- 创建 TCP 套接字

```lua
import("core.base.socket")

local sock = socket.tcp()
```

创建一个 TCP 套接字对象（`socket.TCP`），默认使用 IPv4。

TCP 是面向连接的、可靠的流式协议，保证数据按序到达，适合大多数网络通信场景。

参数：
- `opt`（可选）：选项参数
  - `family`：地址族，可选值：
    - `socket.IPV4` (1) - IPv4 地址族（默认）
    - `socket.IPV6` (2) - IPv6 地址族

```lua
-- 创建 IPv4 TCP 套接字
local sock = socket.tcp()

-- 创建 IPv6 TCP 套接字
local sock = socket.tcp({family = socket.IPV6})
```

## socket.udp

- 创建 UDP 套接字

```lua
import("core.base.socket")

local sock = socket.udp()
```

创建一个 UDP 套接字对象（`socket.UDP`），用于无连接的数据报通信。

UDP 是无连接的、不可靠的数据报协议，不保证数据到达和顺序，但延迟低，适合实时通信、广播等场景。

参数：
- `opt`（可选）：选项参数
  - `family`：地址族，可选值为 `socket.IPV4`（默认）或 `socket.IPV6`

UDP 适合需要低延迟、可以容忍少量丢包的场景：

```lua
import("core.base.socket")
import("core.base.bytes")

local sock = socket.udp()
sock:bind("127.0.0.1", 9091)

local buff = bytes(8192)
-- 接收数据报
local recv, data, peer_addr, peer_port = sock:recvfrom(buff, 8192)
if recv > 0 then
    print("从", peer_addr, peer_port, "收到", recv, "字节")
end
sock:close()
```

## socket.unix

- 创建 Unix 域套接字

```lua
import("core.base.socket")

local sock = socket.unix()
```

创建一个 Unix 域套接字（地址族为 `socket.UNIX`），用于同一台机器上的进程间通信。

Unix 域套接字使用文件系统路径而不是 IP 地址和端口，性能优于 TCP，因为不需要网络协议栈处理。

仅在 Unix/Linux/macOS 系统上可用。适合本地进程间的高性能通信。

## socket.bind

- 创建并绑定 TCP 套接字

```lua
import("core.base.socket")

local sock = socket.bind(addr, port, opt)
```

创建 TCP 套接字并绑定到指定地址和端口，通常用于服务端。

参数：
- `addr`：IP 地址，如 `"127.0.0.1"` 或 `"0.0.0.0"`
- `port`：端口号
- `opt`（可选）：选项参数，同 [socket.tcp](#socket-tcp)

完整的 TCP 回显服务器示例：

```lua
import("core.base.socket")
import("core.base.bytes")

function main()
    -- 绑定地址并监听
    local server = socket.bind("127.0.0.1", 9091)
    server:listen(20)
    print("服务器监听在 127.0.0.1:9091")
    
    while true do
        -- 接受客户端连接
        local client = server:accept()
        if client then
            print("客户端已连接")
            local buff = bytes(8192)
            
            -- 持续接收和回显数据
            while true do
                local recv, data = client:recv(buff, 8192, {block = true})
                if recv > 0 then
                    print("收到:", data:str())
                    -- 回显数据
                    client:send(data, {block = true})
                else
                    break
                end
            end
            client:close()
        end
    end
    server:close()
end
```

## socket.bind_unix

- 创建并绑定 Unix 域套接字

```lua
import("core.base.socket")

local sock = socket.bind_unix(addr, opt)
```

创建 Unix 域套接字并绑定到指定路径。

参数：
- `addr`：Unix 域套接字路径
- `opt`（可选）：选项参数
  - `is_abstract`：是否使用抽象命名空间（仅 Linux）

```lua
import("core.base.socket")

-- 绑定到文件路径
local server = socket.bind_unix("/tmp/my.sock")
server:listen(10)
```

## socket.connect

- 创建并连接 TCP 套接字

```lua
import("core.base.socket")

local sock = socket.connect(addr, port, opt)
```

创建 TCP 套接字并连接到指定地址和端口，用于客户端。

参数：
- `addr`：服务器 IP 地址
- `port`：服务器端口号
- `opt`（可选）：选项参数
  - `family`：地址族
  - `timeout`：连接超时时间（毫秒）

完整的 TCP 客户端示例：

```lua
import("core.base.socket")
import("core.base.bytes")

function main()
    -- 连接到服务器
    local sock = socket.connect("127.0.0.1", 9091)
    if sock then
        print("已连接到服务器")
        local buff = bytes(8192)
        
        -- 发送多条消息
        local count = 0
        while count < 1000 do
            local send = sock:send("hello world..", {block = true})
            if send > 0 then
                -- 接收回显
                sock:recv(buff, 13, {block = true})
                count = count + 1
            else
                break
            end
        end
        print("发送成功，count:", count)
        sock:close()
    end
end
```

## socket.connect_unix

- 创建并连接 Unix 域套接字

```lua
import("core.base.socket")

local sock = socket.connect_unix(addr, opt)
```

创建 Unix 域套接字并连接到指定路径。

参数：
- `addr`：Unix 域套接字路径
- `opt`（可选）：选项参数
  - `is_abstract`：是否使用抽象命名空间（仅 Linux）
  - `timeout`：连接超时时间

## socket:bind

- 绑定套接字到地址

```lua
local ok = sock:bind(addr, port)
```

将套接字绑定到指定的 IP 地址和端口。

返回值：成功返回正数，失败返回 -1 和错误信息。

## socket:listen

- 开始监听连接

```lua
local ok = sock:listen(backlog)
```

使套接字开始监听客户端连接，用于服务端。

参数：
- `backlog`：等待连接队列的最大长度，默认 10

必须在 `bind` 之后、`accept` 之前调用。

## socket:accept

- 接受客户端连接

```lua
local client_sock = sock:accept(opt)
```

接受一个客户端连接，返回新的套接字对象用于与客户端通信。

参数：
- `opt`（可选）：选项参数
  - `timeout`：超时时间（毫秒），默认 -1（无限等待）

返回值：成功返回客户端套接字对象，失败返回 nil 和错误信息。

默认是非阻塞的，如果没有客户端连接会立即返回。可配合 [sock:wait](#sock-wait) 实现事件驱动：

```lua
-- 等待客户端连接
local events = server:wait(socket.EV_ACPT, 5000)
if events == socket.EV_ACPT then
    local client = server:accept()
end
```

## socket:connect

- 连接到远程地址

```lua
local ok = sock:connect(addr, port, opt)
```

连接到指定的远程地址和端口。

参数：
- `addr`：目标 IP 地址
- `port`：目标端口号
- `opt`（可选）：选项参数
  - `timeout`：连接超时时间（毫秒）

返回值：成功返回正数，失败返回 -1 和错误信息。

## socket:send

- 发送数据

```lua
local sent = sock:send(data, opt)
```

通过套接字发送数据。

参数：
- `data`：要发送的数据，可以是字符串或 bytes 对象
- `opt`（可选）：选项参数
  - `block`：是否阻塞发送，默认 false
  - `start`：数据起始位置，默认 1
  - `last`：数据结束位置，默认为数据大小

返回值：实际发送的字节数，失败返回 -1。

非阻塞模式可能只发送部分数据，阻塞模式会等待直到所有数据发送完成：

```lua
-- 非阻塞发送
local sent = sock:send("hello")

-- 阻塞发送，确保全部发送
local sent = sock:send("hello world", {block = true})
if sent > 0 then
    print("发送了", sent, "字节")
end
```

## socket:recv

- 接收数据

```lua
local recv, data = sock:recv(buff, size, opt)
```

从套接字接收数据。

参数：
- `buff`：bytes 缓冲区对象
- `size`：要接收的字节数
- `opt`（可选）：选项参数
  - `block`：是否阻塞接收，默认 false
  - `timeout`：超时时间（毫秒）

返回值：
- `recv`：实际接收的字节数，失败返回 -1
- `data`：接收的数据（bytes 对象）

```lua
import("core.base.bytes")

local buff = bytes(8192)

-- 非阻塞接收
local recv, data = sock:recv(buff, 1024)

-- 阻塞接收，超时 5 秒
local recv, data = sock:recv(buff, 1024, {block = true, timeout = 5000})
if recv > 0 then
    print("接收到:", data:str())
end
```

## socket:sendto

- 发送数据报（UDP）

```lua
local sent = sock:sendto(data, addr, port, opt)
```

通过 UDP 套接字发送数据报到指定地址。

参数：
- `data`：要发送的数据，可以是字符串或 bytes 对象
- `addr`：目标 IP 地址
- `port`：目标端口号
- `opt`（可选）：选项参数

返回值：实际发送的字节数，失败返回 -1。

```lua
import("core.base.socket")

local sock = socket.udp()
sock:sendto("hello", "127.0.0.1", 9091)
sock:close()
```

## socket:recvfrom

- 接收数据报（UDP）

```lua
local recv, data, peer_addr, peer_port = sock:recvfrom(buff, size, opt)
```

从 UDP 套接字接收数据报，同时获取发送方的地址信息。

参数：
- `buff`：bytes 缓冲区对象
- `size`：要接收的字节数
- `opt`（可选）：选项参数
  - `block`：是否阻塞接收

返回值：
- `recv`：实际接收的字节数
- `data`：接收的数据（bytes 对象）
- `peer_addr`：发送方 IP 地址
- `peer_port`：发送方端口号

完整的 UDP 回显服务器示例：

```lua
import("core.base.socket")
import("core.base.bytes")

function main()
    local sock = socket.udp()
    sock:bind("127.0.0.1", 9091)
    print("UDP 服务器监听在 127.0.0.1:9091")
    
    local buff = bytes(8192)
    while true do
        print("等待接收数据...")
        local recv, data, peer_addr, peer_port = sock:recvfrom(buff, 8192, {block = true})
        if recv > 0 then
            print("从", peer_addr .. ":" .. peer_port, "收到", recv, "字节:", data:str())
            -- 回显数据
            sock:sendto(data, peer_addr, peer_port)
        end
    end
    sock:close()
end
```

## socket:wait

- 等待套接字事件

```lua
local events = sock:wait(events, timeout)
```

等待指定的套接字事件发生。

参数：
- `events`：要等待的事件，支持以下事件常量：
  - `socket.EV_RECV` (1)：可接收事件
  - `socket.EV_SEND` (2)：可发送事件
  - `socket.EV_CONN` (2)：连接事件（等同于 EV_SEND）
  - `socket.EV_ACPT` (1)：接受连接事件（等同于 EV_RECV）
- `timeout`：超时时间（毫秒），-1 表示无限等待

返回值：返回实际发生的事件常量值。

在非阻塞模式下实现事件驱动：

```lua
-- 等待套接字可读
local events = sock:wait(socket.EV_RECV, 1000)
if events == socket.EV_RECV then
    local recv, data = sock:recv(buff, 1024)
end

-- 等待套接字可写
local events = sock:wait(socket.EV_SEND, 1000)
if events == socket.EV_SEND then
    sock:send("data")
end
```

## socket:close

- 关闭套接字

```lua
sock:close()
```

关闭套接字并释放资源。使用完套接字后应及时关闭。

## socket:ctrl

- 控制套接字选项

```lua
local ok = sock:ctrl(code, value)
```

设置套接字的控制选项，用于调整套接字的缓冲区等参数。

支持的控制码常量：
- `socket.CTRL_SET_RECVBUFF` (2)：设置接收缓冲区大小（字节）
- `socket.CTRL_SET_SENDBUFF` (4)：设置发送缓冲区大小（字节）

增大缓冲区可以提高高吞吐量场景下的性能：

```lua
-- 设置接收缓冲区为 64KB
sock:ctrl(socket.CTRL_SET_RECVBUFF, 65536)

-- 设置发送缓冲区为 64KB
sock:ctrl(socket.CTRL_SET_SENDBUFF, 65536)
```

::: tip 提示
套接字默认是非阻塞的。使用 `{block = true}` 选项可以启用阻塞模式，简化编程。在协程环境中，套接字会自动与调度器集成，实现异步 I/O。
:::

::: warning 注意
使用完套接字后记得调用 `close()` 释放资源。接收数据时需要预先使用 `bytes()` 创建缓冲区。
:::

