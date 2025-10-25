
# socket

The socket module provides cross-platform network socket functionality, supporting TCP, UDP, and Unix domain sockets. This is an extension module of xmake.

::: tip TIP
To use this module, you need to import it first: `import("core.base.socket")`
:::

## socket.tcp

- Create a TCP socket

#### Function Prototype

::: tip API
```lua
socket.tcp(opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Option parameters |

Options:
- `family`: Address family, options:
  - `socket.IPV4` (1) - IPv4 address family (default)
  - `socket.IPV6` (2) - IPv6 address family

#### Usage

Creates a TCP socket object (`socket.TCP`), using IPv4 by default.

TCP is a connection-oriented, reliable stream protocol that guarantees data arrives in order, suitable for most network communication scenarios.

```lua
-- Create IPv4 TCP socket
local sock = socket.tcp()

-- Create IPv6 TCP socket
local sock = socket.tcp({family = socket.IPV6})
```

## socket.udp

- Create a UDP socket

#### Function Prototype

::: tip API
```lua
socket.udp(opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Option parameters |

Options:
- `family`: Address family, can be `socket.IPV4` (default) or `socket.IPV6`

#### Usage

Creates a UDP socket object (`socket.UDP`) for connectionless datagram communication.

UDP is a connectionless, unreliable datagram protocol that doesn't guarantee data arrival or order, but has low latency, suitable for real-time communication, broadcasting, etc.

UDP is suitable for scenarios requiring low latency and can tolerate some packet loss:

```lua
import("core.base.socket")
import("core.base.bytes")

local sock = socket.udp()
sock:bind("127.0.0.1", 9091)

local buff = bytes(8192)
-- Receive datagram
local recv, data, peer_addr, peer_port = sock:recvfrom(buff, 8192)
if recv > 0 then
    print("Received", recv, "bytes from", peer_addr, peer_port)
end
sock:close()
```

## socket.unix

- Create a Unix domain socket

#### Function Prototype

::: tip API
```lua
socket.unix()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Creates a Unix domain socket (address family `socket.UNIX`) for inter-process communication on the same machine.

Unix domain sockets use filesystem paths instead of IP addresses and ports, offering better performance than TCP because they don't require network protocol stack processing.

Only available on Unix/Linux/macOS systems. Suitable for high-performance local inter-process communication.

## socket.bind

- Create and bind a TCP socket

#### Function Prototype

::: tip API
```lua
socket.bind(addr: <string>, port: <number>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| addr | Required. IP address, such as "127.0.0.1" or "0.0.0.0" |
| port | Required. Port number |
| opt | Optional. Option parameters, same as socket.tcp |

#### Usage

Creates a TCP socket and binds it to the specified address and port, typically used for servers.

Complete TCP echo server example:

```lua
import("core.base.socket")
import("core.base.bytes")

function main()
    -- Bind address and listen
    local server = socket.bind("127.0.0.1", 9091)
    server:listen(20)
    print("Server listening on 127.0.0.1:9091")
    
    while true do
        -- Accept client connection
        local client = server:accept()
        if client then
            print("Client connected")
            local buff = bytes(8192)
            
            -- Continuously receive and echo data
            while true do
                local recv, data = client:recv(buff, 8192, {block = true})
                if recv > 0 then
                    print("Received:", data:str())
                    -- Echo data back
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

- Create and bind a Unix domain socket

#### Function Prototype

::: tip API
```lua
socket.bind_unix(addr: <string>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| addr | Required. Unix domain socket path |
| opt | Optional. Option parameters |

Options:
- `is_abstract`: Whether to use abstract namespace (Linux only)

#### Usage

Creates a Unix domain socket and binds it to the specified path.

```lua
import("core.base.socket")

-- Bind to file path
local server = socket.bind_unix("/tmp/my.sock")
server:listen(10)
```

## socket.connect

- Create and connect a TCP socket

#### Function Prototype

::: tip API
```lua
socket.connect(addr: <string>, port: <number>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| addr | Required. Server IP address |
| port | Required. Server port number |
| opt | Optional. Option parameters |

Options:
- `family`: Address family
- `timeout`: Connection timeout (milliseconds)

#### Usage

Creates a TCP socket and connects to the specified address and port, used for clients.

Complete TCP client example:

```lua
import("core.base.socket")
import("core.base.bytes")

function main()
    -- Connect to server
    local sock = socket.connect("127.0.0.1", 9091)
    if sock then
        print("Connected to server")
        local buff = bytes(8192)
        
        -- Send multiple messages
        local count = 0
        while count < 1000 do
            local send = sock:send("hello world..", {block = true})
            if send > 0 then
                -- Receive echo
                sock:recv(buff, 13, {block = true})
                count = count + 1
            else
                break
            end
        end
        print("Sent successfully, count:", count)
        sock:close()
    end
end
```

## socket.connect_unix

- Create and connect a Unix domain socket

#### Function Prototype

::: tip API
```lua
socket.connect_unix(addr: <string>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| addr | Required. Unix domain socket path |
| opt | Optional. Option parameters |

Options:
- `is_abstract`: Whether to use abstract namespace (Linux only)
- `timeout`: Connection timeout

#### Usage

Creates a Unix domain socket and connects to the specified path.

## socket:bind

- Bind socket to address

#### Function Prototype

::: tip API
```lua
socket:bind(addr: <string>, port: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| addr | Required. IP address |
| port | Required. Port number |

#### Usage

Binds the socket to the specified IP address and port.

Return value: Returns a positive number on success, -1 and error message on failure.

## socket:listen

- Start listening for connections

#### Function Prototype

::: tip API
```lua
socket:listen(backlog: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| backlog | Optional. Maximum length of the pending connection queue, default 10 |

#### Usage

Makes the socket start listening for client connections, used for servers.

Must be called after `bind` and before `accept`.

## socket:accept

- Accept client connection

#### Function Prototype

::: tip API
```lua
socket:accept(opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Option parameters |

Options:
- `timeout`: Timeout (milliseconds), default -1 (infinite wait)

#### Usage

Accepts a client connection, returns a new socket object for communicating with the client.

Return value: Returns client socket object on success, nil and error message on failure.

Non-blocking by default, returns immediately if no client is connecting. Can be used with [sock:wait](#sock-wait) for event-driven approach:

```lua
-- Wait for client connection
local events = server:wait(socket.EV_ACPT, 5000)
if events == socket.EV_ACPT then
    local client = server:accept()
end
```

## socket:connect

- Connect to remote address

#### Function Prototype

::: tip API
```lua
socket:connect(addr: <string>, port: <number>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| addr | Required. Target IP address |
| port | Required. Target port number |
| opt | Optional. Option parameters |

Options:
- `timeout`: Connection timeout (milliseconds)

#### Usage

Connects to the specified remote address and port.

Return value: Returns a positive number on success, -1 and error message on failure.

## socket:send

- Send data

#### Function Prototype

::: tip API
```lua
socket:send(data: <string|bytes>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| data | Required. Data to send, can be string or bytes object |
| opt | Optional. Option parameters |

Options:
- `block`: Whether to block sending, default false
- `start`: Data start position, default 1
- `last`: Data end position, default is data size

#### Usage

Sends data through the socket.

Return value: Actual number of bytes sent, returns -1 on failure.

Non-blocking mode may only send partial data, blocking mode waits until all data is sent:

```lua
-- Non-blocking send
local sent = sock:send("hello")

-- Blocking send, ensure all sent
local sent = sock:send("hello world", {block = true})
if sent > 0 then
    print("Sent", sent, "bytes")
end
```

## socket:recv

- Receive data

#### Function Prototype

::: tip API
```lua
socket:recv(buff: <bytes>, size: <number>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| buff | Required. bytes buffer object |
| size | Required. Number of bytes to receive |
| opt | Optional. Option parameters |

Options:
- `block`: Whether to block receiving, default false
- `timeout`: Timeout (milliseconds)

#### Usage

Receives data from the socket.

Return values:
- `recv`: Actual number of bytes received, returns -1 on failure
- `data`: Received data (bytes object)

```lua
import("core.base.bytes")

local buff = bytes(8192)

-- Non-blocking receive
local recv, data = sock:recv(buff, 1024)

-- Blocking receive, timeout 5 seconds
local recv, data = sock:recv(buff, 1024, {block = true, timeout = 5000})
if recv > 0 then
    print("Received:", data:str())
end
```

## socket:sendto

- Send datagram (UDP)

#### Function Prototype

::: tip API
```lua
socket:sendto(data: <string|bytes>, addr: <string>, port: <number>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| data | Required. Data to send, can be string or bytes object |
| addr | Required. Target IP address |
| port | Required. Target port number |
| opt | Optional. Option parameters |

#### Usage

Sends a datagram to the specified address via UDP socket.

Return value: Actual number of bytes sent, returns -1 on failure.

```lua
import("core.base.socket")

local sock = socket.udp()
sock:sendto("hello", "127.0.0.1", 9091)
sock:close()
```

## socket:recvfrom

- Receive datagram (UDP)

#### Function Prototype

::: tip API
```lua
socket:recvfrom(buff: <bytes>, size: <number>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| buff | Required. bytes buffer object |
| size | Required. Number of bytes to receive |
| opt | Optional. Option parameters |

Options:
- `block`: Whether to block receiving

#### Usage

Receives a datagram from the UDP socket and gets the sender's address information.

Return values:
- `recv`: Actual number of bytes received
- `data`: Received data (bytes object)
- `peer_addr`: Sender's IP address
- `peer_port`: Sender's port number

Complete UDP echo server example:

```lua
import("core.base.socket")
import("core.base.bytes")

function main()
    local sock = socket.udp()
    sock:bind("127.0.0.1", 9091)
    print("UDP server listening on 127.0.0.1:9091")
    
    local buff = bytes(8192)
    while true do
        print("Waiting to receive data...")
        local recv, data, peer_addr, peer_port = sock:recvfrom(buff, 8192, {block = true})
        if recv > 0 then
            print("Received", recv, "bytes from", peer_addr .. ":" .. peer_port .. ":", data:str())
            -- Echo data back
            sock:sendto(data, peer_addr, peer_port)
        end
    end
    sock:close()
end
```

## socket:wait

- Wait for socket events

#### Function Prototype

::: tip API
```lua
socket:wait(events: <number>, timeout: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| events | Required. Events to wait for, supports the following event constants |
| timeout | Required. Timeout (milliseconds), -1 means infinite wait |

Supported event constants:
- `socket.EV_RECV` (1): Receivable event
- `socket.EV_SEND` (2): Sendable event
- `socket.EV_CONN` (2): Connection event (equivalent to EV_SEND)
- `socket.EV_ACPT` (1): Accept connection event (equivalent to EV_RECV)

#### Usage

Waits for specified socket events to occur.

Return value: Returns the actual event constant value that occurred.

Implementing event-driven in non-blocking mode:

```lua
-- Wait for socket to be readable
local events = sock:wait(socket.EV_RECV, 1000)
if events == socket.EV_RECV then
    local recv, data = sock:recv(buff, 1024)
end

-- Wait for socket to be writable
local events = sock:wait(socket.EV_SEND, 1000)
if events == socket.EV_SEND then
    sock:send("data")
end
```

## socket:close

- Close socket

#### Function Prototype

::: tip API
```lua
socket:close()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Closes the socket and releases resources. Sockets should be closed promptly after use.

## socket:ctrl

- Control socket options

#### Function Prototype

::: tip API
```lua
socket:ctrl(code: <number>, value: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| code | Required. Control code constant |
| value | Required. Control value |

Supported control code constants:
- `socket.CTRL_SET_RECVBUFF` (2): Set receive buffer size (bytes)
- `socket.CTRL_SET_SENDBUFF` (4): Set send buffer size (bytes)

#### Usage

Sets socket control options to adjust socket parameters such as buffer sizes.

Increasing buffer sizes can improve performance in high-throughput scenarios:

```lua
-- Set receive buffer to 64KB
sock:ctrl(socket.CTRL_SET_RECVBUFF, 65536)

-- Set send buffer to 64KB
sock:ctrl(socket.CTRL_SET_SENDBUFF, 65536)
```

::: tip TIP
Sockets are non-blocking by default. Use the `{block = true}` option to enable blocking mode for simpler programming. In a coroutine environment, sockets automatically integrate with the scheduler for asynchronous I/O.
:::

::: warning WARNING
Remember to call `close()` after using the socket to release resources. A bytes buffer must be created using `bytes()` before receiving data.
:::

