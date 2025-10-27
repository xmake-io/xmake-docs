# core.base.cpu

This module provides CPU information and detection capabilities for the current system.

::: tip TIP
To use this module, you need to import it first: `import("core.base.cpu")`
:::

This module allows you to query CPU vendor, model, architecture, features, and performance metrics across different platforms (macOS, Linux, Windows, BSD).

## cpu.vendor

- Get CPU vendor ID

#### Function Prototype

::: tip API
```lua
cpu.vendor()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the CPU vendor ID (e.g., "GenuineIntel", "AuthenticAMD") |

#### Usage

```lua
import("core.base.cpu")

local vendor = cpu.vendor()
print("CPU Vendor:", vendor)  -- Output: "GenuineIntel" or "AuthenticAMD"
```

## cpu.model

- Get CPU model number

#### Function Prototype

::: tip API
```lua
cpu.model()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the CPU model number |

#### Usage

```lua
import("core.base.cpu")

local model = cpu.model()
print("CPU Model:", model)
```

## cpu.family

- Get CPU family

#### Function Prototype

::: tip API
```lua
cpu.family()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the CPU family number |

#### Usage

```lua
import("core.base.cpu")

local family = cpu.family()
print("CPU Family:", family)
```

## cpu.model_name

- Get CPU model name

#### Function Prototype

::: tip API
```lua
cpu.model_name()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the full CPU model name (e.g., "Intel(R) Core(TM) i7-8750H CPU @ 2.20GHz") |

#### Usage

```lua
import("core.base.cpu")

local name = cpu.model_name()
print("CPU Name:", name)
```

## cpu.features

- Get CPU features

#### Function Prototype

::: tip API
```lua
cpu.features()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns a string containing all CPU features/flags separated by spaces |

#### Usage

```lua
import("core.base.cpu")

local features = cpu.features()
print("CPU Features:", features)
```

## cpu.has_feature

- Check if CPU has a specific feature

#### Function Prototype

::: tip API
```lua
cpu.has_feature(name: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Feature name to check (e.g., "sse", "avx", "avx2") |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if the CPU has the feature, false otherwise |

#### Usage

```lua
import("core.base.cpu")

if cpu.has_feature("avx2") then
    print("AVX2 supported")
end

if cpu.has_feature("sse") then
    print("SSE supported")
end
```

## cpu.march

- Get CPU micro-architecture

#### Function Prototype

::: tip API
```lua
cpu.march()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the CPU micro-architecture name (e.g., "Skylake", "Zen 2", "Alder Lake") |

#### Usage

```lua
import("core.base.cpu")

local march = cpu.march()
print("CPU Architecture:", march)  -- Output: "Skylake", "Zen 2", etc.
```

## cpu.number

- Get number of CPU cores

#### Function Prototype

::: tip API
```lua
cpu.number()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the number of CPU cores |

#### Usage

```lua
import("core.base.cpu")

local cores = cpu.number()
print("CPU Cores:", cores)
```

## cpu.usagerate

- Get CPU usage rate

#### Function Prototype

::: tip API
```lua
cpu.usagerate()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the CPU usage rate as a decimal (0.0 to 1.0, where 1.0 = 100%) |

#### Usage

```lua
import("core.base.cpu")

local usage = cpu.usagerate()
print("CPU Usage:", math.floor(usage * 100) .. "%")
```

## cpu.info

- Get all CPU information

#### Function Prototype

::: tip API
```lua
cpu.info(name?: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Optional. Specific field name to retrieve |

#### Return Value

| Type | Description |
|------|-------------|
| table | Returns a table containing all CPU information if name is not provided |
| any | Returns the specific field value if name is provided |

#### Usage

```lua
import("core.base.cpu")

-- Get all CPU information
local info = cpu.info()
print("Vendor:", info.vendor)
print("Model:", info.model)
print("Family:", info.family)
print("Architecture:", info.march)
print("Cores:", info.ncpu)
print("Features:", info.features)
print("Usage Rate:", info.usagerate)
print("Model Name:", info.model_name)

-- Get specific field
local vendor = cpu.info("vendor")
local cores = cpu.info("ncpu")
```

