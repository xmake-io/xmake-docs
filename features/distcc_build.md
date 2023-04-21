# Distributed Building

Xmake provides a built-in distributed compilation service, usually it can cooperate with local compilation cache and remote compilation cache to achieve optimal compilation acceleration. It is fully cross-platform supported, we not only support GCC and Clang, but also Windows and MSVC as well.

For cross-compilation, as long as the cross-toolchain supports it, we do not require the system environment of the server. Even if the server resources of linux, macOS and Windows are mixed, distributed compilation can be realized to its fullest potensial!

### Start the service

We can specify the `--distcc` parameter to enable the distributed compilation service. Of course, if this parameter is not specified, Xmake will enable all server-configured services by default.

Here we assume that there are two machines as a distributed compilation server cluster, with the IP addresses `192.168.22.168` and `192.168.22.169`. On the two servers execute the following command:

```bash
$ xmake service --distcc
<distcc_build_server>: listening 0.0.0.0:9093 ..
```

Or for a more verbose experience with more detailed log messages, run it with the `-vD` flag.

```bash
$ xmake service --distcc -vD
<distcc_build_server>: listening 0.0.0.0:9093 ..
```

### Start the service in Daemon mode

To start the service in daemon mode, and control it, run:

```bash
$ xmake service --distcc --start
$ xmake service --distcc --restart
$ xmake service --distcc --stop
```

### Configure the server

We first, run the `xmake service` command, it will automatically generate a default `server.conf` configuration file, stored in `~/.xmake/service/server.conf`.

```bash
$ xmake service
generating the config file to /Users/ruki/.xmake/service/server.conf ..
an token(590234653af52e91b9e438ed860f1a2b) is generated, we can use this token to connect service.
generating the config file to /Users/ruki/.xmake/service/client.conf ..
<distcc_build_server>: listening 0.0.0.0:9693 ..
```

Then, we edit it, fixing the server's listening port (optional).

```bash
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

### Configure the client

The client configuration file is in `~/.xmake/service/client.conf`, where we can configure the server address that the client needs to connect to. We can configure multiple server addresses and corresponding tokens in the hosts list.

With distributed compilation, it is recommended to use the token authentication mode, because the password mode requires a password to be entered for each server connection, which can become very annoying very fast.

```bash
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
}
```

#### Timeout configuration

By default, clients connect, send and receive data with unlimited waiting without timeout, but if the network to access the server is unstable, then there is a chance that access may get stuck, and this can be solved by configuring a timeout. If a timeout exception occurs, it will automatically degrade to local compilation and will not be stuck forever.

We can configure, `send_timeout`, `recv_timeout` and `connect_timeout` to take effect for all client services if set at the root.

```bash
{
    send_timeout = 5000,
    recv_timeout = 5000,
    connect_timeout = 5000
}
```

We can also configure the timeout just for the current distributed build service, leaving the other services with the default timeout.

```bash
{
    distcc_build = {
        send_timeout = 5000,
        recv_timeout = 5000,
        connect_timeout = 5000,
    }
}
```

The server-side configuration also supports timeout configuration.

### User authorization

For user authorization, please refer to [Remote Compilation/User Authorization](/#/guide/other_features?id=user-authorization).

### Connect to the server

After configuring the authentication and server address, you can enter the following command to connect the current project to the configured server.

We need to enter `--distcc` when connecting to specify that only distributed services are connected.

```bash
$ cd projectdir
$ xmake service --connect --distcc
<client>: connect 127.0.0.1:9693 ..
<client>: 127.0.0.1:9693 connected!
```

We can also connect to multiple services at the same time, such as distributed compilation and remote compilation cache services.

```bash
$ xmake service --connect --distcc --ccache
```

If there is no parameter, the default connection is the remote compilation service.

### Distributed compilation project

After connecting to the server, we can perform distributed compilation transparently (e.g. just like normal local compilation). For example:

```bash
$ xmake
...
[ 93%]: cache compiling.release src/demo/network/unix_echo_client.c ----> local job
[ 93%]: cache compiling.release src/demo/network/ipv6.c
[ 93%]: cache compiling.release src/demo/network/ping.c
[ 93%]: distcc compiling.release src/demo/network/unix_echo_server.c. ----> distcc job
[93%]: distcc compiling.release src/demo/network/http.c
[ 93%]: distcc compiling.release src/demo/network/unixaddr.c
[ 93%]: distcc compiling.release src/demo/network/ipv4.c
[ 94%]: distcc compiling.release src/demo/network/ipaddr.c
[94%]: distcc compiling.release src/demo/math/fixed.c
[94%]: distcc compiling.release src/demo/libm/float.c
[ 95%]: cache compiling.release src/demo/libm/double.c
[ 95%]: cache compiling.release src/demo/other/test.cpp
[ 98%]: archiving.release libtbox.a
[99%]: linking.release demo
[100%]: build ok!
```

Among them, the words with distcc are remote compilation tasks, and the others are local compilation tasks. By default, xmake also enables local compilation caching to cache distributed compilation results to avoid frequent requests to the server.

In addition, we can also open the remote compilation cache and share the compilation cache with others to further accelerate the compilation of multi-person collaborative development.

### Disconnect

You can disconnect from a compilation server with:

```bash
$ xmake service --disconnect --distcc
```

### Specify the number of parallel compilation tasks

Let's briefly introduce the number of parallel tasks currently calculated by default based on the number of host cpu cores:

```lua
-- let n = number of CPUs
-- let deafult_njob = ⌈(3n) / 2⌉
local default_njob = math.ceil(ncpu * 3 / 2)
```

Therefore, if distributed compilation is not enabled, the default maximum number of parallel compilation tasks is `default_njob`. If distributed compilation is enabled, the default number of parallel compilation tasks is:

```lua
-- let n = default number of jobs
-- let c = server count
-- let d = server's default number of jobs
-- let maxjobs = (n + c)d
local maxjobs = default_njob + server_count * server_default_njob
```

#### Modify the number of local parallel tasks

We only need to pass `-jN` to specify the number of local parallel tasks (just like in Make), but it will not affect the number of parallel tasks on the server side.

```bash
$ xmake -jN
```

#### Modify the number of parallel tasks on the server

If you want to modify the number of parallel tasks on the server, you need to modify the configuration file of the client.

```bash
{
    distcc_build = {
        hosts = {
            {
                connect = "127.0.0.1:9693",
                token = "590234653af52e91b9e438ed860f1a2b",
                njob = 8 <------- modify here
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

For each server host, add the `njob = N` parameter configuration to specify the number of parallel jobs that this server can provide.

### Distributed compilation of Android projects

The distributed compilation service provided by Xmake is completely cross-platform and supports Windows, Linux, macOS, Android, iOS. It even supports cross compilation, so you can have a network of servers used for cross compilation that might be running macOS, Linux, or Windows. No lock in!

If you want to compile an Android project, for example, you only need to add the `toolchains` toolchain configuration in the server configuration, and provide the path of the NDK.

```bash
{
    distcc_build = {
        listen = "0.0.0.0:9693",
        toolchains = {
            ndk = {
                ndk = "~/files/android-ndk-r21e" <------------ here
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

Then, we can compile the Android project in a distributed way like normal local compilation, and even configure multiple Windows, macOS, Linux and other different server hosts, as the resources of the distributed compilation service, to compile it.

Just download the NDK for the corresponding platform.

```bash
$ xmake f -p android --ndk=~/files/xxxx
$ xmake
```

### Distributed compilation of iOS projects

Compiling iOS projects is easier, because Xmake can usually automatically detect Xcode, so just switch the platform to iOS like you would normally do for local development.

```bash
$ xmake f -p iphoneos
$ xmake
```

### Distributed cross compilation configuration

If we want to distribute cross-compilation, we need to configure the toolchain SDK path on the server, for example:

```bash
{
    distcc_build = {
        listen = "0.0.0.0:9693",
        toolchains = {
            cross = {
                sdkdir = "~/files/arm-linux-xxx" <------------ here
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

Among them, under toolchains, each item corresponds to a toolchain, here is configured as `cross = {}` cross toolchain, corresponding to `toolchain("cross")`. In the toolchain, we can configure `sdkdir`, `bindir`, `cross`, etc., corresponding to the interface configuration of `set_sdkdir`, `set_bindir` and `set_cross` in `toolchain("cross")`.

If the cross toolchain is more standardized, we usually only need to configure `sdkdir`, and xmake can automatically detect it.

On the client side, \compilation only needs to specify the SDK directory.

```bash
$ xmake f -p cross --sdk=/xxx/arm-linux-xxx
$ xmake
```

### Clean the server cache

The compilation of each project on the server side will generate some cache files, which are stored according to the project granularity. We can use the following command to clear the cache corresponding to each server for the current project.

```bash
$ xmake service --clean --distcc
```

### Some internal optimizations

1. Cache server-side compilation results to avoid repeated compilation
2. Local cache, remote cache optimization, avoid unnecessary server communication
3. Server load balancing scheduling, rational allocation of server resources
4. Small files are compiled directly locally after preprocessing, which is usually faster
5. Real-time compression and transmission of large files, based on lz4 fast compression
6. Internal state maintenance, compared to independent tools such as distcc, avoids frequent independent process loading and time-consuming, and avoids additional communication with the daemon process

