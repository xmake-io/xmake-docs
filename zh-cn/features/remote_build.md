
2.6.5 版本提供了远程编译支持，我们可以通过它可以远程服务器上编译代码，远程运行和调试。

服务器可以部署在 Linux/MacOS/Windows 上，实现跨平台编译，例如：在 Linux 上编译运行 Windows 程序，在 Windows 上编译运行 macOS/Linux 程序。

相比 ssh 远程登入编译，它更加的稳定，使用更加流畅，不会因为网络不稳定导致 ssh 终端输入卡顿，也可以实现本地快速编辑代码文件。

甚至我们可以在 vs/sublime/vscode/idea 等编辑器和IDE 中无缝实现远程编译，而不需要依赖 IDE 本身对远程编译的支持力度。

### 开启服务

```console
$ xmake service
<remote_build_server>: listening 0.0.0.0:9091 ..
```

我们也可以开启服务的同时，回显详细日志信息。

```console
$ xmake service -vD
<remote_build_server>: listening 0.0.0.0:9091 ..
```

### 以 Daemon 模式开启服务

```console
$ xmake service --start
$ xmake service --restart
$ xmake service --stop
```

### 配置服务端

我们首先，运行 `xmake service` 命令，它会自动生成一个默认的 `server.conf` 配置文件，存储到 `~/.xmake/service/server.conf`。

!> 2.6.5 版本，配置地址在 `~/.xmake/service.conf`，后续版本做了大量改进，分离了配置文件，如果用的是 2.6.6 以上版本，请使用新的配置文件。

然后，我们编辑它，修复服务器的监听端口（可选）。

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

### 配置客户端

客户端配置文件在 `~/.xmake/service/client.conf`，我们可以在里面配置客户端需要连接的服务器地址。

!> 2.6.5 版本，配置地址在 `~/.xmake/service.conf`，后续版本做了大量改进，分离了配置文件，如果用的是 2.6.6 以上版本，请使用新的配置文件。

```console
$ cat ~/.xmake/service/client.conf
{
    remote_build = {
        connect = "127.0.0.1:9691",
        token = "e438d816c95958667747c318f1532c0f"
    }
}
```

### 用户认证和授权

!> 2.6.6 以上版本才支持用户认证，2.6.5 版本只能匿名连接。

在实际连接之前，我们简单介绍下 xmake 提供的服务目前提供的几种认证机制。

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

!> 如果去掉用户名，也没配置 token，那就是匿名模式，如果服务器也没配置 token，就是完全禁用认证，直接连接。

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

### 连接远程的服务器

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

### 远程构建工程

连接成功后，我们就可以像正常本地编译一样，进行远程编译。

```console
$ xmake
<remote_build_client>: run xmake in 192.168.56.110:9091 ..
checking for platform ... macosx
checking for architecture ... x86_64
checking for Xcode directory ... /Applications/Xcode.app
checking for Codesign Identity of Xcode ... Apple Development: waruqi@gmail.com (T3NA4MRVPU)
checking for SDK version of Xcode for macosx (x86_64) ... 11.3
checking for Minimal target version of Xcode for macosx (x86_64) ... 11.4
[ 25%]: ccache compiling.release src/main.cpp
[ 50%]: linking.release test
[100%]: build ok!
<remote_build_client>: run command ok!
```

### 远程运行目标程序

我们也可以像本地运行调试那样，远程运行调试编译的目标程序。

```console
$ xmake run
<remote_build_client>: run xmake run in 192.168.56.110:9091 ..
hello world!
<remote_build_client>: run command ok!
```

### 远程重建工程

```console
$ xmake -rv
<remote_build_client>: run xmake -rv in 192.168.56.110:9091 ..
[ 25%]: ccache compiling.release src/main.cpp
/usr/local/bin/ccache /usr/bin/xcrun -sdk macosx clang -c -Qunused-arguments -arch x86_64 -mmacosx-version-min=11.4 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX11.3.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -DNDEBUG -o build/.objs/test/macosx/x86_64/release/src/main.cpp.o src/main.cpp
[ 50%]: linking.release test
"/usr/bin/xcrun -sdk macosx clang++" -o build/macosx/x86_64/release/test build/.objs/test/macosx/x86_64/release/src/main.cpp.o -arch x86_64 -mmacosx-version-min=11.4 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX11.3.sdk -stdlib=libc++ -Wl,-x -lz
[100%]: build ok!
<remote_build_client>: run command ok!
```

### 远程配置编译参数

```console
$ xmake f --xxx --yy
```

### 手动同步工程文件

连接的时候，会自动同步一次代码，后期代码改动，可以执行此命令来手动同步改动的文件。

```console
$ xmake service --sync
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

### 拉取远程文件

v2.7.1 版本我们新增了一个参数用于拉取远程指定的文件，通常我们可以用来完成构建后目标文件的拉取，将编译后的库文件下载到本地。

例如：

```bash
xmake service --pull 'build/**' outputdir
```

我们可以指定远程路径 `build/**` ，将所有匹配的文件全部拉取到本地 outputdir 目录下。

### 断开远程连接

针对当前工程，断开连接，这仅仅影响当前工程，其他项目还是可以同时连接和编译。

```console
$ xmake service --disconnect
<remote_build_client>: disconnect 192.168.56.110:9091 ..
<remote_build_client>: disconnected!
```

### 查看服务器日志

```console
$ xmake service --logs
```

### 清理远程服务缓存和构建文件

我们也可以手动清理远程的任何缓存和构建生成的文件。

```console
$ cd projectdir
$ xmake service --clean
```
