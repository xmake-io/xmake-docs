
### Local compilation cache

By default, Xmake will enable the local cache. The version before 2.6.5 uses the external ccache by default, and after 2.6.6, Xmake provides a built-in cross-platform local cache solution.

Compared with third-party independent processes such as ccache, xmake's internal state maintenance is easier to optimize, and it also avoids frequent independent process loading and time-consuming, and avoids additional communication with the daemon process.

In addition, the built-in cache can better support cross-platform, and msvc on Windows can also support well, while ccache only supports gcc/clang.

Of course, we can also disable the cache with the following command.

```bash
$ xmake f --ccache=n
```

Note: Regardless of whether the built-in local cache is used, the configuration name is `--ccache=`, which means the c/c++ build cache, not just the name of the ccache tool.

If we want to continue to use other external caching tools, we can also configure it in the following way.

```bash
$ xmake f --ccache=n --cxx="ccache gcc" --cc="ccache gcc"
$ xmake
```

### Remote compilation cache

In addition to local caching, we also provide remote caching services, similar to mozilla's sscache, which is usually not used if it is only for personal development.

However, if a large-scale project is developed collaboratively by multiple people within the company, distributed compilation and local caching alone are not enough. We also need to cache the compiled object files to a separate server for sharing.

In this way, even if other people compile it for the first time, they do not need to compile it distributedly every time, and directly pull the cache from the remote to speed up the compilation.

In addition, the remote cache service provided by Xmake is also supported by all platforms, not only gcc/clang but also msvc.

#### Start the service

We can specify the `--ccache` parameter to enable the remote compilation cache service. Of course, if this parameter is not specified, xmake will enable all server-configured services by default.

```console
$ xmake service --ccache
<remote_cache_server>: listening 0.0.0.0:9092 ..
```

We can also start the service and echo detailed log information.

```console
$ xmake service --ccache -vD
<remote_cache_server>: listening 0.0.0.0:9092 ..
```

#### Start the service in Daemon mode

```console
$ xmake service --ccache --start
$ xmake service --ccache --restart
$ xmake service --ccache --stop
```

#### Configure the server

We first, run the `xmake service` command, it will automatically generate a default `server.conf` configuration file, stored in `~/.xmake/service/server.conf`.

```bash
$ xmake service
generating the config file to /Users/ruki/.xmake/service/server.conf ..
an token(590234653af52e91b9e438ed860f1a2b) is generated, we can use this token to connect service.
generating the config file to /Users/ruki/.xmake/service/client.conf ..
<remote_cache_server>: listening 0.0.0.0:9692 ..
```

Then, we edit it, fixing the server's listening port (optional).

```bash
$ cat ~/.xmake/service/server.conf
{
    distcc_build = {
        listen = "0.0.0.0:9692",
        workdir = "/Users/ruki/.xmake/service/server/remote_cache"
    },
    known_hosts = { },
    logfile = "/Users/ruki/.xmake/service/server/logs.txt",
    tokens = {
        "590234653af52e91b9e438ed860f1a2b"
    }
}
```

#### Configure the client

The client configuration file is in `~/.xmake/service/client.conf`, where we can configure the server address that the client needs to connect to.

We can configure multiple server addresses and corresponding tokens in the hosts list.

```console
$cat ~/.xmake/service/client.conf
{
    remote_cache = {
            connect = "127.0.0.1:9692,
            token = "590234653af52e91b9e438ed860f1a2b"
        }
    }
}
```

##### Timeout configuration

By default, clients connect, send and receive data with unlimited waiting without timeout, but if the network to access the server is unstable, then there is a chance that access may get stuck, and this can be solved by configuring a timeout.

If a timeout exception occurs, it will automatically degrade to local cache and will not be stuck forever.

We can configure, `send_timeout`, `recv_timeout` and `connect_timeout` to take effect for all client services if set at the root.

```console
$ cat ~/.xmake/service/client.conf
{
    send_timeout = 5000,
    recv_timeout = 5000,
    connect_timeout = 5000
}
```

We can also configure the timeout just for the current remote cache service, leaving the other services with the default timeout.

```console
$ cat ~/.xmake/service/client.conf
{
    distcc_build = {
        send_timeout = 5000,
        recv_timeout = 5000,
        connect_timeout = 5000,
    }
}
```

!> The server-side configuration also supports timeout configuration.


#### User authorization

For user authorization, please refer to [Remote Compilation/User Authorization](/#/guide/other_features?id=user-authorization)

#### Connect to the server

After configuring the authentication and server address, you can enter the following command to connect the current project to the configured server.

We need to enter `--ccache` when connecting to specify that only the remote compilation cache service is connected.

```bash
$ cd projectdir
$ xmake service --connect --ccache
<client>: connect 127.0.0.1:9692 ..
<client>: 127.0.0.1:9692 connected!
```

We can also connect to multiple services at the same time, such as distributed compilation and remote compilation cache services.

```hash
$ xmake service --connect --distcc --ccache
```

!> If there is no parameter, the default connection is the remote compilation service.

#### Disconnect

```bash
$ xmake service --disconnect --ccache
```

#### Clean the server cache

We can also use the following command to clear the cache on the remote server corresponding to the current project.

```bash
$ xmake service --clean --ccache
```

And if we execute `xmake clean --all`, when the remote service is connected, all caches will be automatically cleaned up.

#### Some internal optimizations

1. Pull the snapshot of the remote cache and send it back to the local through bloom filter + lz4, which is used to quickly determine whether the cache exists and avoid frequently querying the server cache information
2. With the local cache, you can avoid frequent requests to the remote server and pull the cache.
3. Internal state maintenance, compared with independent tools such as sscache, avoids frequent independent process loading and time-consuming, and avoids additional communication with the daemon process

