# 分布式编译 {#distributed-compilation}

Xmake 提供了内置的分布式编译服务，通常它可以与本地编译缓存、远程编译缓存相互配合，实现最优的编译加速。

另外，它是完全跨平台支持的，我们不仅支持 gcc/clang，也能够很好地支持 Windows 和 msvc。

对于交叉编译，只要交叉工具链支持，我们不要求服务器的系统环境，即使混用 linux、macOS 和 Windows 的服务器资源，也可以很好地实现分布式编译。

## 开启服务 {#start-service}

我们可以指定 `--distcc` 参数来开启分布式编译服务，当然如果不指定这个参数，xmake 会默认开启所有服务端配置的服务。
这里我们假设有 2 台机器作为分布式的编译服务器集群,ip 地址分别是 192.168.22.168,192.168.22.169,两台服务器分别执行下面的脚本

```sh
$ xmake service --distcc
<distcc_build_server>: listening 0.0.0.0:9093 ..
```

我们也可以在开启服务的同时，回显详细日志信息。

```sh
$ xmake service --distcc -vD
<distcc_build_server>: listening 0.0.0.0:9093 ..
```

## 以 Daemon 模式开启服务

```sh
$ xmake service --distcc --start
$ xmake service --distcc --restart
$ xmake service --distcc --stop
```

## 配置服务端 {#configure-server}

我们首先运行 `xmake service` 命令，它会自动生成一个默认的 `server.conf` 配置文件，存储到 `~/.xmake/service/server.conf`。

```sh
$ xmake service
generating the config file to /Users/ruki/.xmake/service/server.conf ..
an token(590234653af52e91b9e438ed860f1a2b) is generated, we can use this token to connect service.
generating the config file to /Users/ruki/.xmake/service/client.conf ..
<distcc_build_server>: listening 0.0.0.0:9693 ..
```

然后，我们编辑它，修正每台服务器的监听端口（可选）。

```sh
$ cat ~/.xmake/service/server.conf
{
    distcc_build = {
        listen = "0.0.0.0:9693",
        workdir = "/Users/ruki/.xmake/service/server/distcc_build"
    },
    known_hosts = { },
    logfile = "/Users/ruki/.xmake/service/server/logs.txt",
    tokens = {
        "590234653af52e91b9e438ed860f1a2b"
    }
}
```

## 配置客户端 {#configure-client}

客户端配置文件在 `~/.xmake/service/client.conf`，我们可以在里面配置客户端需要连接的服务器地址。

我们可以在 hosts 列表中配置多个服务器地址，以及对应的 token。

::: tip 注意
分布式编译，推荐使用 token 认证模式，因为密码模式下每台服务器连接时都要输入一次密码，很繁琐。
:::

```sh
$cat ~/.xmake/service/client.conf
{
    distcc_build = {
        hosts = {
            {
                connect = "192.168.22.168:9693",
                token = "590234653af52e91b9e438ed860f1a2b"
            },
            {
                connect = "192.168.22.169:9693",
                token = "590234653af52e91b9e438ed860f1a2b"
            }
        }
    }
}
```

### 配置超时 {#configure-timeout}

默认情况下，客户端连接、收发数据都是无限等待不超时的，但是如果访问服务端的网络不稳定，有可能会导致访问卡死，这时可以配置超时来解决。

如果发生超时异常，就会自动退化到本地编译，不会永远卡死。

我们可以配置 `send_timeout`、`recv_timeout` 和 `connect_timeout` 三种超时，如果在根节点设置，那么所有客户端服务都会生效。

```sh
$ cat ~/.xmake/service/client.conf
{
    send_timeout = 5000,
    recv_timeout = 5000,
    connect_timeout = 5000
}
```

我们也可以仅针对当前分布式构建服务配置超时，其他服务还是默认超时。

```sh
$ cat ~/.xmake/service/client.conf
{
    distcc_build = {
        send_timeout = 5000,
        recv_timeout = 5000,
        connect_timeout = 5000,
    }
}
```

::: tip 注意
服务端配置同样支持超时配置。
:::

## 用户认证和授权 {#user-authorization}

关于用户认证和授权，可以参考 [远程编译/用户认证和授权](/zh/guide/extras/remote-compilation#user-authorization) 里面的详细说明，用法是完全一致的。

## 连接服务器 {#connect-server}

配置完认证和服务器地址后，就可以输入下面的命令，将当前工程连接到配置的服务器上。

我们需要在连接时，输入 `--distcc`，指定仅连接分布式服务。

```sh
$ cd projectdir
$ xmake service --connect --distcc
<client>: connect 127.0.0.1:9693 ..
<client>: 127.0.0.1:9693 connected!
```

我们也可以同时连接多个服务，比如分布式编译和远程编译缓存服务。

```sh
$ xmake service --connect --distcc --ccache
```

::: tip 注意
如果不带任何参数，默认连接的是远程编译服务。
:::

## 分布式编译项目 {#build-project}

连接上服务器后，我们就可以像正常本地编译那样，进行分布式编译了，例如：

```sh
$ xmake
...
[ 93%]: cache compiling.release src/demo/network/unix_echo_client.c         ----> local job
[ 93%]: cache compiling.release src/demo/network/ipv6.c
[ 93%]: cache compiling.release src/demo/network/ping.c
[ 93%]: distcc compiling.release src/demo/network/unix_echo_server.c.         ----> distcc job
[ 93%]: distcc compiling.release src/demo/network/http.c
[ 93%]: distcc compiling.release src/demo/network/unixaddr.c
[ 93%]: distcc compiling.release src/demo/network/ipv4.c
[ 94%]: distcc compiling.release src/demo/network/ipaddr.c
[ 94%]: distcc compiling.release src/demo/math/fixed.c
[ 94%]: distcc compiling.release src/demo/libm/float.c
[ 95%]: cache compiling.release src/demo/libm/double.c
[ 95%]: cache compiling.release src/demo/other/test.cpp
[ 98%]: archiving.release libtbox.a
[ 99%]: linking.release demo
[100%]: build ok!
```

其中，带有 distcc 字样的是远程编译任务，其他的都是本地编译任务。默认 xmake 还开启了本地编译缓存，对分布式编译结果进行缓存，避免频繁请求服务器。

另外，我们也可以开启远程编译缓存，与其他人共享编译缓存，进一步加速多人协同开发的编译。

## 断开连接 {#disconnect}

```sh
$ xmake service --disconnect --distcc
```

## 指定并行编译任务数 {#configure-njobs}

我们先简单介绍下，目前根据主机 cpu core 数量默认计算的并行任务数：

```lua
local default_njob = math.ceil(ncpu * 3 / 2)
```

因此，如果不开启分布式编译，默认的最大并行编译任务数就是这个 default_njob。

如果开启分布式编译后，默认的并行编译任务数就是：

```lua
local maxjobs = default_njob + server_count * server_default_njob
```

### 修改本地并行任务数

我们只需要通过 `-jN` 就能指定本地并行任务数，但是它不会影响服务端的并行任务数。

```sh
$ xmake -jN
```

### 修改服务端并行任务数

如果要修改服务端的并行任务数，需要修改客户端的配置文件。

```sh
$cat ~/.xmake/service/client.conf
{
    distcc_build = {
        hosts = {
            {
                connect = "127.0.0.1:9693",
                token = "590234653af52e91b9e438ed860f1a2b",
                njob = 8   <------- modify here
            },
            {
                connect = "192.168.01:9693",
                token = "590234653af52e91b9e438ed860f1a2b",
                njob = 4
            }
        }
    }
}
```

可以对每个服务器主机，添加 `njob = N` 参数配置，指定这台服务器可以提供的并行任务数。

## 分布式编译 Android 项目 {#build-android-project}

xmake 提供的分布式编译服务是完全跨平台的，并且支持 Windows, Linux, macOS, Android, iOS 甚至交叉编译。

如果要进行 Android 项目编译，只需要在服务端配置中，增加 `toolchains` 工具链配置，提供 NDK 的跟路径即可。

```sh
$ cat ~/.xmake/service/server.conf
{
    distcc_build = {
        listen = "0.0.0.0:9693",
        toolchains = {
            ndk = {
                ndk = "~/files/android-ndk-r21e"   <------------ here
            }
        },
        workdir = "/Users/ruki/.xmake/service/server/distcc_build"
    },
    known_hosts = { },
    logfile = "/Users/ruki/.xmake/service/server/logs.txt",
    tokens = {
        "590234653af52e91b9e438ed860f1a2b"
    }
}
```

然后，我们就可以像正常本地编译那样，分布式编译 Android 项目，甚至可以配置多台 Windows, macOS, Linux 等不同的服务器主机，做为分布式编译服务的资源，来编译它。

只需要下载对应平台的 NDK 就行了。

```sh
$ xmake f -p android --ndk=~/files/xxxx
$ xmake
```

## 分布式编译 iOS 项目 {#build-ios-project}

编译 iOS 项目更加简单，因为 Xmake 通常能自动检测到 Xcode，所以只需要像正常本地一样，切一下平台到 ios 即可。

```sh
$ xmake f -p iphoneos
$ xmake
```

## 分布式交叉编译配置 {#cross-compilation}

如果要分布式交叉编译，我们需要在服务端配置工具链 sdk 路径，例如：

```sh
$ cat ~/.xmake/service/server.conf
{
    distcc_build = {
        listen = "0.0.0.0:9693",
        toolchains = {
            cross = {
                sdkdir = "~/files/arm-linux-xxx"   <------------ here
            }
        },
        workdir = "/Users/ruki/.xmake/service/server/distcc_build"
    },
    known_hosts = { },
    logfile = "/Users/ruki/.xmake/service/server/logs.txt",
    tokens = {
        "590234653af52e91b9e438ed860f1a2b"
    }
}
```

其中，toolchains 下，每一项对应一个工具链，这里配置为 `cross = {}` 交叉工具链，对应 `toolchain("cross")`。

工具链里面我们可以配置 `sdkdir`, `bindir`, `cross` 等等，对应 `toolchain("cross")` 里面的 `set_sdkdir`, `set_bindir` 和 `set_cross` 等接口配置。

如果交叉工具链比较规范，我们通常只需要配置 `sdkdir`，xmake 就能自动检测到。

而客户端编译也只需要指定 sdk 目录。

```sh
$ xmake f -p cross --sdk=/xxx/arm-linux-xxx
$ xmake
```

## 清理服务器缓存 {#clean-cache}

每个项目在服务端的编译，都会产生一些缓存文件，他们都是按工程粒度分别存储的，我们可以通过下面的命令，对当前工程清理每个服务器对应的缓存。

```sh
$ xmake service --clean --distcc
```

## 一些内部优化 #{optimizations}

1. 缓存服务器端编译结果，避免重复编译
2. 本地缓存，远程缓存优化，避免不必要的服务端通信
3. 服务器负载均衡调度，合理分配服务器资源
4. 预处理后小文件直接本地编译，通常会更快
5. 大文件实时压缩传输，基于 lz4 快速压缩
6. 内部状态维护，相比 distcc 等独立工具，避免了频繁的独立进程加载耗时，也避免了与守护进程额外的通信
