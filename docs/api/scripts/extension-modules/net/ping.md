# net.ping

This module provides host connectivity and latency testing capabilities.

::: tip TIP
To use this module, you need to import it first: `import("net.ping")`
:::

The `net.ping` module provides cross-platform host ping detection functionality. It automatically finds available tools on the system (prioritizing curl, then wget, finally ping) and uses appropriate parameters for detection.

## ping

- Execute ping detection on a list of hosts

#### Function Prototype

::: tip API
```lua
ping(hosts, opt?)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| hosts | Required. Host address string or array of host addresses |
| opt | Optional. Option parameter table, supports:<br>- `force` - Whether to force refresh cache (default: false) |

#### Return Value

| Type | Description |
|------|-------------|
| table | Returns a mapping table from host addresses to latency times in milliseconds, returns 65535 on failure or timeout |

#### Usage

Ping a single host:

```lua
import("net.ping")

local results = ping("github.com")
print("Latency:", results["github.com"], "ms")
```

Ping multiple hosts:

```lua
import("net.ping")

local results = ping({"github.com", "gitlab.com", "git.com"})
for host, time in pairs(results) do
    print(host, ":", time, "ms")
end
```

Force refresh cache and re-detect:

```lua
import("net.ping")

-- Don't use cache, force re-detection
local results = ping({"github.com", "gitlab.com"}, {force = true})
```

The `net.ping` module supports multiple detection methods:
1. **Using curl**: If curl is installed on the system, it uses `curl` command for detection (returns milliseconds)
2. **Using wget**: If curl is not available, it tries to use `wget` command for detection (returns milliseconds)
3. **Using ping**: If both are unavailable, it uses the system's `ping` command for detection (different parameters for Windows/macOS/Linux)

Detection results are cached, and subsequent requests use cached results directly unless `force = true` is set. Concurrent detection is supported for improved efficiency. Here is a complete example:

```lua
import("net.ping")

-- Test latency for multiple mirror sources
local mirrors = {
    "github.com",
    "gitee.com", 
    "code.csdn.net"
}

print("Testing mirror source latency...")
local results = ping(mirrors)

-- Find the mirror source with lowest latency
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
    print(string.format("\nFastest mirror source: %s (latency: %d ms)", best_mirror, math.floor(min_time)))
else
    print("No available mirror source found")
end
```

