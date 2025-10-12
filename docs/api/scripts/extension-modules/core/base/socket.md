
# socket

The socket module provides cross-platform network socket functionality, supporting TCP, UDP, and Unix domain sockets. This is an extension module of xmake.

::: tip TIP
To use this module, you need to import it first: `import("core.base.socket")`
:::

## socket.tcp

- Create a TCP socket

```lua
import("core.base.socket")

local sock = socket.tcp()
```

Creates a TCP socket object (`socket.TCP`), using IPv4 by default.

TCP is a connection-oriented, reliable stream protocol that guarantees data arrives in order, suitable for most network communication scenarios.

Parameters:
- `opt` (optional): Option parameters
  - `family`: Address family, options:
    - `socket.IPV4` (1) - IPv4 address family (default)
    - `socket.IPV6` (2) - IPv6 address family

```lua
-- Create IPv4 TCP socket
local sock = socket.tcp()

-- Create IPv6 TCP socket
local sock = socket.tcp({family = socket.IPV6})
```

## socket.udp

- Create a UDP socket

```lua
import("core.base.socket")

local sock = socket.udp()
```

Creates a UDP socket object (`socket.UDP`) for connectionless datagram communication.

UDP is a connectionless, unreliable datagram protocol that doesn't guarantee data arrival or order, but has low latency, suitable for real-time communication, broadcasting, etc.

Parameters:
- `opt` (optional): Option parameters
  - `family`: Address family, can be `socket.IPV4` (default) or `socket.IPV6`

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

```lua
import("core.base.socket")

local sock = socket.unix()
```

Creates a Unix domain socket (address family `socket.UNIX`) for inter-process communication on the same machine.

Unix domain sockets use filesystem paths instead of IP addresses and ports, offering better performance than TCP because they don't require network protocol stack processing.

Only available on Unix/Linux/macOS systems. Suitable for high-performance local inter-process communication.

## socket.bind

- Create and bind a TCP socket

```lua
import("core.base.socket")

local sock = socket.bind(addr, port, opt)
```

Creates a TCP socket and binds it to the specified address and port, typically used for servers.

Parameters:
- `addr`: IP address, such as `"127.0.0.1"` or `"0.0.0.0"`
- `port`: Port number
- `opt` (optional): Option parameters, same as [socket.tcp](#socket-tcp)

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

```lua
import("core.base.socket")

local sock = socket.bind_unix(addr, opt)
```

Creates a Unix domain socket and binds it to the specified path.

Parameters:
- `addr`: Unix domain socket path
- `opt` (optional): Option parameters
  - `is_abstract`: Whether to use abstract namespace (Linux only)

```lua
import("core.base.socket")

-- Bind to file path
local server = socket.bind_unix("/tmp/my.sock")
server:listen(10)
```

## socket.connect

- Create and connect a TCP socket

```lua
import("core.base.socket")

local sock = socket.connect(addr, port, opt)
```

Creates a TCP socket and connects to the specified address and port, used for clients.

Parameters:
- `addr`: Server IP address
- `port`: Server port number
- `opt` (optional): Option parameters
  - `family`: Address family
  - `timeout`: Connection timeout (milliseconds)

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

```lua
import("core.base.socket")

local sock = socket.connect_unix(addr, opt)
```

Creates a Unix domain socket and connects to the specified path.

Parameters:
- `addr`: Unix domain socket path
- `opt` (optional): Option parameters
  - `is_abstract`: Whether to use abstract namespace (Linux only)
  - `timeout`: Connection timeout

## sock:bind

- Bind socket to address

```lua
local ok = sock:bind(addr, port)
```

Binds the socket to the specified IP address and port.

Return value: Returns a positive number on success, -1 and error message on failure.

## sock:listen

- Start listening for connections

```lua
local ok = sock:listen(backlog)
```

Makes the socket start listening for client connections, used for servers.

Parameters:
- `backlog`: Maximum length of the pending connection queue, default 10

Must be called after `bind` and before `accept`.

## sock:accept

- Accept client connection

```lua
local client_sock = sock:accept(opt)
```

Accepts a client connection, returns a new socket object for communicating with the client.

Parameters:
- `opt` (optional): Option parameters
  - `timeout`: Timeout (milliseconds), default -1 (infinite wait)

Return value: Returns client socket object on success, nil and error message on failure.

Non-blocking by default, returns immediately if no client is connecting. Can be used with [sock:wait](#sock-wait) for event-driven approach:

```lua
-- Wait for client connection
local events = server:wait(socket.EV_ACPT, 5000)
if events == socket.EV_ACPT then
    local client = server:accept()
end
```

## sock:connect

- Connect to remote address

```lua
local ok = sock:connect(addr, port, opt)
```

Connects to the specified remote address and port.

Parameters:
- `addr`: Target IP address
- `port`: Target port number
- `opt` (optional): Option parameters
  - `timeout`: Connection timeout (milliseconds)

Return value: Returns a positive number on success, -1 and error message on failure.

## sock:send

- Send data

```lua
local sent = sock:send(data, opt)
```

Sends data through the socket.

Parameters:
- `data`: Data to send, can be string or bytes object
- `opt` (optional): Option parameters
  - `block`: Whether to block sending, default false
  - `start`: Data start position, default 1
  - `last`: Data end position, default is data size

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

## sock:recv

- Receive data

```lua
local recv, data = sock:recv(buff, size, opt)
```

Receives data from the socket.

Parameters:
- `buff`: bytes buffer object
- `size`: Number of bytes to receive
- `opt` (optional): Option parameters
  - `block`: Whether to block receiving, default false
  - `timeout`: Timeout (milliseconds)

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

## sock:sendto

- Send datagram (UDP)

```lua
local sent = sock:sendto(data, addr, port, opt)
```

Sends a datagram to the specified address via UDP socket.

Parameters:
- `data`: Data to send, can be string or bytes object
- `addr`: Target IP address
- `port`: Target port number
- `opt` (optional): Option parameters

Return value: Actual number of bytes sent, returns -1 on failure.

```lua
import("core.base.socket")

local sock = socket.udp()
sock:sendto("hello", "127.0.0.1", 9091)
sock:close()
```

## sock:recvfrom

- Receive datagram (UDP)

```lua
local recv, data, peer_addr, peer_port = sock:recvfrom(buff, size, opt)
```

Receives a datagram from the UDP socket and gets the sender's address information.

Parameters:
- `buff`: bytes buffer object
- `size`: Number of bytes to receive
- `opt` (optional): Option parameters
  - `block`: Whether to block receiving

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

## sock:wait

- Wait for socket events

```lua
local events = sock:wait(events, timeout)
```

Waits for specified socket events to occur.

Parameters:
- `events`: Events to wait for, supports the following event constants:
  - `socket.EV_RECV` (1): Receivable event
  - `socket.EV_SEND` (2): Sendable event
  - `socket.EV_CONN` (2): Connection event (equivalent to EV_SEND)
  - `socket.EV_ACPT` (1): Accept connection event (equivalent to EV_RECV)
- `timeout`: Timeout (milliseconds), -1 means infinite wait

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

## sock:close

- Close socket

```lua
sock:close()
```

Closes the socket and releases resources. Sockets should be closed promptly after use.

## sock:ctrl

- Control socket options

```lua
local ok = sock:ctrl(code, value)
```

Sets socket control options to adjust socket parameters such as buffer sizes.

Supported control code constants:
- `socket.CTRL_SET_RECVBUFF` (2): Set receive buffer size (bytes)
- `socket.CTRL_SET_SENDBUFF` (4): Set send buffer size (bytes)

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

