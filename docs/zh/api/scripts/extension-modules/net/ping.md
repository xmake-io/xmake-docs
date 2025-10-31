# net.ping

此模块用于检测主机网络的连通性和延迟。

::: tip 提示
使用此模块需要先导入：`import("net.ping")`
:::

`net.ping` 模块提供了跨平台的主机 Ping 检测功能。它会自动查找系统可用的工具（优先 curl，然后 wget，最后 ping），并使用合适的参数进行检测。

## ping

- 对主机列表执行 Ping 检测

#### 函数原型

::: tip API
```lua
ping(hosts, opt?)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| hosts | 必需。主机地址字符串或主机地址数组 |
| opt | 可选。选项参数表，支持：<br>- `force` - 是否强制刷新缓存（默认为 false） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回主机地址到延迟时间的映射表，单位为毫秒，失败或无响应时返回 65535 |

#### 用法说明

对单个主机进行 Ping 检测：

```lua
import("net.ping")

local results = ping("github.com")
print("延迟:", results["github.com"], "ms")
```

对多个主机进行 Ping 检测：

```lua
import("net.ping")

local results = ping({"github.com", "gitlab.com", "git.com"})
for host, time in pairs(results) do
    print(host, ":", time, "ms")
end
```

强制刷新缓存重新检测：

```lua
import("net.ping")

-- 不读取缓存，强制重新检测
local results = ping({"github.com", "gitlab.com"}, {force = true})
```

`net.ping` 模块支持多种检测方式：
1. **使用 curl**：如果系统安装了 curl，会使用 `curl` 命令检测（返回值为毫秒）
2. **使用 wget**：如果未安装 curl，会尝试使用 `wget` 命令检测（返回值为毫秒）
3. **使用 ping**：如果前两者都不可用，会使用系统的 `ping` 命令检测（Windows/macOS/Linux 的参数不同）

检测结果会被缓存，后续请求会直接使用缓存结果，除非设置了 `force = true`。支持并发生检测以提高效率。以下是一个完整的示例：

```lua
import("net.ping")

-- 检测多个镜像源的延迟
local mirrors = {
    "github.com",
    "gitee.com", 
    "code.csdn.net"
}

print("正在检测镜像源延迟...")
local results = ping(mirrors)

-- 找出延迟最低的镜像源
local best_mirror = nil
local min_time = math.maxinteger
for host, time in pairs(results) do
    print(string.format("%s: %d ms", host, math.floor(time)))
    if time < min_time then
        min_time = time
        best_mirror = host
    end
end

if best_mirror then
    print(string.format("\n最快镜像源: %s (延迟: %d ms)", best_mirror, math.floor(min_time)))
else
    print("未找到可用镜像源")
end
```

