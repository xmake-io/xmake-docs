---
title: Xmake v2.6.6 发布，分布式编译和缓存支持
tags: [xmake, lua, C/C++, remote, ccache, distributed-compilation]
date: 2022-05-24
author: Ruki
---

[Xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具。

它非常的轻量，没有任何依赖，因为它内置了 Lua 运行时。

它使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

我们能够使用它像 Make/Ninja 那样可以直接编译项目，也可以像 CMake/Meson 那样生成工程文件，另外它还有内置的包管理系统来帮助用户解决 C/C++ 依赖库的集成使用问题。

目前，Xmake 主要用于 C/C++ 项目的构建，但是同时也支持其他 native 语言的构建，可以实现跟 C/C++ 进行混合编译，同时编译速度也是非常的快，可以跟 Ninja 持平。

```
Xmake = Build backend + Project Generator + Package Manager + [Remote|Distributed] Build + Cache
```

尽管不是很准确，但我们还是可以把 Xmake 按下面的方式来理解：

```
Xmake ~= Make/Ninja + CMake/Meson + Vcpkg/Conan + distcc + ccache/sccache
```

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](https://xmake.io/zh/)

## 新特性介绍

这个版本，我们增加了大量的重量级新特性：

- 分布式编译支持
- 内置本地编译缓存
- 远程编译缓存支持

通过这些特性，我们可以更加快速地编译大型 C/C++ 项目。另外，它们完全是跨平台的，不仅支持 gcc/clang 也支持 msvc，而且除了编译器无任何第三方依赖，使用也非常方便。

因此，使用了 Xmake，就等于同时使用了 `distcc/ccache/sccache`。

相比这些第三方的工具，Xmake 完全支持 Windows 和 msvc，在消除了平台差异性的同事，也省去了独立进程调用，以及额外的守护进程带来的开销。

除了这些特性之外，新版本 Xmake 还新增 Keil/c51 项目的编译支持，以及对 nvidia-hpc-sdk 工具链中的 nvc/nvc++/nvfortran 编译器的支持。

### 远程编译支持用户认证

上个版本我们已经初步支持了远程编译，但是没有提供用户认证支持，这会带来一些安全性问题，因此这个版本，我们新增了用户认证支持。

目前，Xmake 主要提供以下几种认证机制，另外，它对分布式编译和远程缓存也同样生效。

1. Token 认证
2. 密码认证
3. 可信主机验证

#### Token 认证

这也是我们默认推荐的方式，更加安全，配置和连接也更加方便，每次连接也不用输入密码。

我们在执行 `xmake service` 命令时候，默认就会生成一个服务端和客户端的配置文件，并且自动生成一个默认的 token，因此本地直连是不需要任何配置的。









##### 服务端认证配置

服务端可以配置多个 token 用于对不同用户主机进行授权连接，当然也可以共用一个 token。

```bash
$ cat ~/.xmake/service/server.conf
{
    known_hosts = { },
    logfile = "/Users/ruki/.xmake/service/server/logs.txt",
    remote_build = {
        listen = "0.0.0.0:9691",
        workdir = "/Users/ruki/.xmake/service/server/remote_build"
    },
    tokens = {
        "e438d816c95958667747c318f1532c0f"
    }
}
```

##### 客户端认证配置

客户端只需要添加服务器上的 token 到对应的客户端配置中即可。

```bash
$ cat ~/.xmake/service/client.conf
{
    remote_build = {
        connect = "127.0.0.1:9691",
        token = "e438d816c95958667747c318f1532c0f"
    }
}
```

##### 手动生成新 token

我们也可以执行下面的命令，手动生成一个新的 token，自己添加到服务器配置中。

```bash
$ xmake service --gen-token
New token a7b9fc2d3bfca1472aabc38bb5f5d612 is generated!
```

#### 密码认证

我们也提供密码认证的授权模式，相比 token 认证，它需要用户每次连接的时候，输入密码，验证通过后，才能连接上。

##### 服务端认证配置

密码认证，我们不需要手动配置 token，只需要执行下面的命令，添加用户就行了，添加过程中，会提示用户输入密码。

```bash
$ xmake service --add-user=ruki
Please input user ruki password:
123456
Add user ruki ok!
```

然后，xmake 就会通过用户名，密码生成一个新的 token 添加到服务器配置的 token 列表中去。

```bash
$ cat ~/.xmake/service/server.conf
{
    known_hosts = { },
    logfile = "/Users/ruki/.xmake/service/server/logs.txt",
    remote_build = {
        listen = "0.0.0.0:9691",
        workdir = "/Users/ruki/.xmake/service/server/remote_build"
    },
    tokens = {
        "e438d816c95958667747c318f1532c0f",
        "7889e25402413e93fd37395a636bf942"
    }
}
```

当然，我们也可以删除指定的用户和密码。

```bash
$xmake service --rm-user=ruki
Please input user ruki password:
123456
Remove user ruki ok!
```

##### 客户端认证配置

对于客户端，我们不再需要设置服务器的 token 了，只需要在连接配置中，追加需要连接的用户名即可开启密码认证，格式：`user@address:port`

```bash
$ cat ~/.xmake/service/client.conf
{
    remote_build = {
        connect = "root@127.0.0.1:9691"
  }
}
```

:::注意
如果去掉用户名，也没配置 token，那就是匿名模式，如果服务器也没配置 token，就是完全禁用认证，直接连接。
:::

#### 可信主机验证

另外，为了更进一步提高安全性，我们还提供了服务端可信主机验证，如果在服务器配置的 known_hosts 列表中，配置了可以连接的客户端主机 ip 地址，
那么只有这些主机可以成功连接上这台服务器，其他主机对它的连接都会被提示为不可信而拒绝连接，即使 token 和密码认证都没问题也不行。

```bash
$ cat ~/.xmake/service/server.conf
{
    logfile = "/Users/ruki/.xmake/service/logs.txt",
    server = {
        tokens = {
            "4b928c7563a0cba10ff4c3f5ca0c8e24"
        },
        known_hosts = { "127.0.0.1", "xx.xx.xx.xx"}
    }
}
```

#### 连接远程的服务器

接下来，我们只需要进入需要远程编译的工程根目录，执行 `xmake service --connect` 命令，进行连接。

如果是 token 认证模式，那么不需要的额外的密码输入，直接连接。

```console
$ xmake create test
$ cd test
$ xmake service --connect
<remote_build_client>: connect 192.168.56.110:9091 ..
<remote_build_client>: connected!
<remote_build_client>: sync files in 192.168.56.110:9091 ..
Scanning files ..
Comparing 3 files ..
    [+]: src/main.cpp
    [+]: .gitignore
    [+]: xmake.lua
3 files has been changed!
Archiving files ..
Uploading files with 1372 bytes ..
<remote_build_client>: sync files ok!
```

如果是密码认证，那么会提示用户输入密码，才能继续连接。

```bash
$ xmake service --connect
Please input user root password:
000000
<remote_build_client>: connect 127.0.0.1:9691 ..
<remote_build_client>: connected!
<remote_build_client>: sync files in 127.0.0.1:9691 ..
Scanning files ..
Comparing 3 files ..
    [+]: xmake.lua
    [+]: .gitignore
    [+]: src/main.cpp
3 files has been changed!
Archiving files ..
Uploading files with 1591 bytes ..
<remote_build_client>: sync files ok!
```

如果密码不对，就会提示错误。

```bash
$ xmake service --connect
Please input user root password:
123
<remote_build_client>: connect 127.0.0.1:9691 ..
<remote_build_client>: connect 127.0.0.1:9691 failed, user and password are incorrect!
```

### 分布式编译支持

Xmake 提供了内置的分布式编译服务，通常它可以跟 本地编译缓存，远程编译缓存 相互配合，实现最优的编译的加速。

另外，它是完全跨平台支持，我们不仅支持 gcc/clang，也能够很好地支持 Windows 和 msvc。

对于交叉编译，只要交叉工具链支持，我们不要求服务器的系统环境，即使混用 linux, macOS 和 Windows 的服务器资源，也可以很好的实现分布式编译。

#### 开启服务

我们可以指定 `--distcc` 参数来开启分布式编译服务，当然如果不指定这个参数，xmake 会默认开启所有服务端配置的服务。

```console
$ xmake service --distcc
<distcc_build_server>: listening 0.0.0.0:9093 ..
```

我们也可以开启服务的同时，回显详细日志信息。

```console
$ xmake service --distcc -vD
<distcc_build_server>: listening 0.0.0.0:9093 ..
```

#### 以 Daemon 模式开启服务

```console
$ xmake service --distcc --start
$ xmake service --distcc --restart
$ xmake service --distcc --stop
```

#### 配置服务端

我们首先，运行 `xmake service` 命令，它会自动生成一个默认的 `server.conf` 配置文件，存储到 `~/.xmake/service/server.conf`。

```bash
$ xmake service
generating the config file to /Users/ruki/.xmake/service/server.conf ..
an token(590234653af52e91b9e438ed860f1a2b) is generated, we can use this token to connect service.
generating the config file to /Users/ruki/.xmake/service/client.conf ..
<distcc_build_server>: listening 0.0.0.0:9693 ..
```

然后，我们编辑它，修复服务器的监听端口（可选）。

```bash
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

#### 配置客户端

客户端配置文件在 `~/.xmake/service/client.conf`，我们可以在里面配置客户端需要连接的服务器地址。

我们可以在 hosts 列表里面配置多个服务器地址，以及对应的 token。

:::注意
分布式编译，推荐使用 token 认证模式，因为密码模式，每台服务器连接时候都要输入一次密码，很繁琐。
:::

```console
$cat ~/.xmake/service/client.conf
{
    distcc_build = {
        hosts = {
            {
                connect = "127.0.0.1:9693",
                token = "590234653af52e91b9e438ed860f1a2b"
            }
        }
    }
}
```

#### 连接服务器

配置完认证和服务器地址后，就可以输入下面的命令，将当前工程连接到配置的服务器上了。

我们需要在连接时候，输入 `--distcc`，指定仅仅连接分布式服务。

```bash
$ cd projectdir
$ xmake service --connect --distcc
<client>: connect 127.0.0.1:9693 ..
<client>: 127.0.0.1:9693 connected!
```

我们也可以同时连接多个服务，比如分布式编译和远程编译缓存服务。

```sh
$ xmake service --connect --distcc --ccache
```

:::注意
如果不带任何参数，默认连接的是远程编译服务。
:::

#### 分布式编译项目

连接上服务器后，我们就可以像正常本地编译那样，进行分布式编译了，例如：

```bash
$ xmake
...
[ 93%]: ccache compiling.release src/demo/network/unix_echo_client.c         ----> local job
[ 93%]: ccache compiling.release src/demo/network/ipv6.c
[ 93%]: ccache compiling.release src/demo/network/ping.c
[ 93%]: distcc compiling.release src/demo/network/unix_echo_server.c.         ----> distcc job
[ 93%]: distcc compiling.release src/demo/network/http.c
[ 93%]: distcc compiling.release src/demo/network/unixaddr.c
[ 93%]: distcc compiling.release src/demo/network/ipv4.c
[ 94%]: distcc compiling.release src/demo/network/ipaddr.c
[ 94%]: distcc compiling.release src/demo/math/fixed.c
[ 94%]: distcc compiling.release src/demo/libm/float.c
[ 95%]: ccache compiling.release src/demo/libm/double.c
[ 95%]: ccache compiling.release src/demo/other/test.cpp
[ 98%]: archiving.release libtbox.a
[ 99%]: linking.release demo
[100%]: build ok!
```

其中，带有 distcc 字样的是远程编译任务，其他的都是本地编译任务，默认 xmake 还开启了本地编译缓存，对分布式编译结果进行缓存，避免频繁请求服务器。

另外，我们也可以开启远程编译缓存，跟其他人共享编译缓存，进一步加速多人协同开发的编译。

#### 断开连接

```bash
$ xmake service --disconnect --distcc
```

#### 指定并行编译任务数

我们先简单介绍下，目前根据主机 cpu core 数量默认计算的并行任务数：

```lua
local default_njob = math.ceil(ncpu * 3 / 2)
```

因此，如果不开启分布式编译，默认的最大并行编译任务数就是这个 default_njob。

如果开启分布式编译后，默认的并行编译任务数就是：

```lua
local maxjobs = default_njob + server_count * server_default_njob
```

##### 修改本地并行任务数

我们只需要通过 `-jN` 就能指定本地并行任务数，但是它不会影响服务端的并行任务数。

```bash
$ xmake -jN
```

##### 修改服务端并行任务数

如果要修改服务端的并行任务数，需要修改客户端的配置文件。

```bash
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

#### 分布式编译 Android 项目

xmake 提供的分布式编译服务是完全跨平台的，并且支持 Windows, Linux, macOS, Android, iOS 甚至交叉编译。

如果要进行 Android 项目编译，只需要在服务端配置中，增加 `toolchains` 工具链配置，提供 NDK 的跟路径即可。

```bash
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

```bash
$ xmake f -p android --ndk=~/files/xxxx
$ xmake
```

#### 分布式编译 iOS 项目

编译 iOS 项目更加简单，因为 Xmake 通常能自动检测到 Xcode，所以只需要像正常本地一样，切一下平台到 ios 即可。

```bash
$ xmake f -p iphoneos
$ xmake
```

#### 分布式交叉编译配置

如果要分布式交叉编译，我们需要在服务端配置工具链 sdk 路径，例如：

```bash
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

```bash
$ xmake f -p cross --sdk=/xxx/arm-linux-xxx
$ xmake
```

#### 清理服务器缓存

每个项目在服务端的编译，都会产生一些缓存文件，他们都是按工程粒度分别存储的，我们可以通过下面的命令，对当前工程清理每个服务器对应的缓存。

```bash
$ xmake service --clean --distcc
```

#### 一些内部优化

1. 缓存服务器端编译结果，避免重复编译
2. 本地缓存，远程缓存优化，避免不必要的服务端通信
3. 服务器负载均衡调度，合理分配服务器资源
4. 预处理后小文件直接本地编译，通常会更快
5. 大文件实时压缩传输，基于 lz4 快速压缩
6. 内部状态维护，相比 distcc 等独立工具，避免了频繁的独立进程加载耗时，也避免了与守护进程额外的通信

### 本地编译缓存支持

默认，Xmake 就会开启本地缓存，2.6.5 之前的版本默认使用外置的 ccache，而 2.6.6 之后版本，Xmake 提供了内置的跨平台本地缓存方案。

相比 ccache 等第三方独立进程，xmake 内部状态维护，更加便于优化，也避免了频繁的独立进程加载耗时，也避免了与守护进程额外的通信。

另外，内置的缓存能够更好的支持跨平台，Windows 上 msvc 也能够很好的支持，而 ccache 仅仅支持 gcc/clang。

当然，我们也可以通过下面的命令禁用缓存。

```bash
$ xmake f --ccache=n
```

注：不管是否使用内置本地缓存，配置名都是 `--ccache=`，意思是 c/c++ 构建缓存，而不仅仅是指 ccache 工具的名字。

我们如果想继续使用外置的其他缓存工具，我们也是可以通过下面的方式来配置。

```bash
$ xmake f --ccache=n --cxx="ccache gcc" --cc="ccache gcc"
$ xmake
```

### 远程编译缓存支持

除了本地缓存，我们也提供了远程缓存服务，类似 mozilla 的 sscache，如果只是个人开发，平常不会用到它。

但是，如果是公司内部多人协同开发一个大型项目，仅仅靠分布式编译和本地缓存，是不够的。我们还需要对编译的对象文件缓存到独立的服务器上进行共享。

这样，其他人即使首次编译，也不需要每次都去分布式编译它，直接从远程拉取缓存来加速编译。

另外，Xmake 提供的远程缓存服务，也是全平台支持的，不仅支持 gcc/clang 还支持 msvc。

#### 开启服务

我们可以指定 `--ccache` 参数来开启远程编译缓存服务，当然如果不指定这个参数，xmake 会默认开启所有服务端配置的服务。

```console
$ xmake service --ccache
<remote_cache_server>: listening 0.0.0.0:9092 ..
```

我们也可以开启服务的同时，回显详细日志信息。

```console
$ xmake service --ccache -vD
<remote_cache_server>: listening 0.0.0.0:9092 ..
```

#### 以 Daemon 模式开启服务

```console
$ xmake service --ccache --start
$ xmake service --ccache --restart
$ xmake service --ccache --stop
```

#### 配置服务端

我们首先，运行 `xmake service` 命令，它会自动生成一个默认的 `server.conf` 配置文件，存储到 `~/.xmake/service/server.conf`。

```bash
$ xmake service
generating the config file to /Users/ruki/.xmake/service/server.conf ..
an token(590234653af52e91b9e438ed860f1a2b) is generated, we can use this token to connect service.
generating the config file to /Users/ruki/.xmake/service/client.conf ..
<remote_cache_server>: listening 0.0.0.0:9692 ..
```

然后，我们编辑它，修复服务器的监听端口（可选）。

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

#### 配置客户端

客户端配置文件在 `~/.xmake/service/client.conf`，我们可以在里面配置客户端需要连接的服务器地址。

我们可以在 hosts 列表里面配置多个服务器地址，以及对应的 token。

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

#### 连接服务器

配置完认证和服务器地址后，就可以输入下面的命令，将当前工程连接到配置的服务器上了。

我们需要在连接时候，输入 `--ccache`，指定仅仅连接远程编译缓存服务。

```bash
$ cd projectdir
$ xmake service --connect --ccache
<client>: connect 127.0.0.1:9692 ..
<client>: 127.0.0.1:9692 connected!
```

我们也可以同时连接多个服务，比如分布式编译和远程编译缓存服务。

```sh
$ xmake service --connect --distcc --ccache
```

:::注意
如果不带任何参数，默认连接的是远程编译服务。
:::

#### 断开连接

```bash
$ xmake service --disconnect --ccache
```

#### 清理服务器缓存

我们也可以通过下面的命令，清理当前工程对应的远程服务器上的缓存。

```bash
$ xmake service --clean --ccache
```

而如果我们执行 `xmake clean --all`，在连接了远程服务的状态下，也会去自动清理所有的缓存。

#### 一些内部优化

1. 拉取远程缓存的快照，通过 bloom filter + lz4 回传本地后，用于快速判断缓存是否存在，避免频繁的查询服务端缓存信息
2. 配合本地缓存，可以避免频繁地请求远程服务器，拉取缓存。
3. 内部状态维护，相比 sscache 等独立工具，避免了频繁的独立进程加载耗时，也避免了与守护进程额外的通信

### Keil/C51 工程支持

我们只需要绑定到 c51 工具链，Xmake 就能自动检测到系统安装的 Keil/C51 SDK 工具链环境，然后使用它进行编译。

```lua
target("hello")
    add_rules("c51.binary")
    set_toolchains("c51")
    add_files("src/main.c")
```

当然，如果不通过 `set_toolchains("c51")` 设置工具链，我们也可以通过 `xmake f --toolchain=c51` 手动切换到 c51 工具链上去。

## 更新内容

### 新特性

* [#2327](https://github.com/xmake-io/xmake/issues/2327): 支持 nvidia-hpc-sdk 工具链中的 nvc/nvc++/nvfortran 编译器
* 添加 path 实例接口
* [#2334](https://github.com/xmake-io/xmake/pull/2334): 添加 lz4 压缩模块
* [#2349](https://github.com/xmake-io/xmake/pull/2349): 添加 keil/c51 工程支持
* [#274](https://github.com/xmake-io/xmake/issues/274): 跨平台分布式编译支持
* 使用内置的本地缓存替代 ccache

### 改进

* [#2309](https://github.com/xmake-io/xmake/issues/2309): 远程编译支持用户授权验证
* 改进远程编译，增加对 lz4 压缩支持

### Bugs 修复

* 修复选择包版本时候 lua 栈不平衡导致的崩溃问题
