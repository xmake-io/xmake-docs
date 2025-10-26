# core.base.semver

一个用于语义版本控制 (semver) 的模块。它允许您解析版本字符串并访问版本的各个组成部分，例如主版本号、次版本号等。

我们可以使用 `import("core.base.semver")` 直接导入和使用。

## semver.new

- 根据版本字符串创建一个新的 semver 实例

#### 函数原型

::: tip API
```lua
semver.new(version: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| version | 必需。版本字符串 |

#### 用法说明

如果解析失败，则抛出错误

```lua
local version = semver.new("v2.1.0")
```

## semver.try_parse

- 与 new 相同，但如果解析失败则返回 nil 值

#### 函数原型

::: tip API
```lua
semver.try_parse(version: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| version | 必需。版本字符串 |

#### 用法说明

与 new 相同，但如果解析失败则返回 nil 值

```lua
local version = semver.try_parse("v2.1.0")
```

## semver.match

- 从字符串中匹配有效版本

#### 函数原型

::: tip API
```lua
semver.match(str: <string>, start: <number>, pattern: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| str | 必需。要匹配的字符串 |
| start | 必需。开始位置 |
| pattern | 可选。匹配模式 |

#### 用法说明

从字符串中匹配有效版本

```lua
print(semver.match("v2.1.0", 1)) -- start from position 1
print(semver.match("v2.1.0", 0, "%d+%.%d+"))
```

```
2.1.0
2.1
```

## semver.is_valid

- 通过测试版本是否可以解析来获取给定字符串版本是否有效

#### 函数原型

::: tip API
```lua
semver.is_valid(version: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| version | 必需。要验证的版本字符串 |

#### 用法说明

通过测试版本是否可以解析来获取给定字符串版本是否有效

```lua
print(semver.is_valid("536f2bd6a092eba91315b7d1e120dff63392a11d"))
print(semver.is_valid("v2.1.0-pre"))
```

```
false
true
```

## semver.is_valid_range

- 测试给定的范围是否有效

#### 函数原型

::: tip API
```lua
semver.is_valid_range(range: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| range | 必需。要验证的范围字符串 |

#### 用法说明

测试给定的范围是否有效

```lua
print(semver.is_valid_range(">2.1.0"))
print(semver.is_valid_range(">v2.1.0"))
print(semver.is_valid_range("2.0.0 - <2.1.0"))
print(semver.is_valid_range("1.0 || 2.1"))
```

```
true
false
false
true
```

## semver.compare

- 比较两个版本，返回 1 到 -1 之间的数字

#### 函数原型

::: tip API
```lua
semver.compare(version1: <string>, version2: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| version1 | 必需。第一个版本字符串 |
| version2 | 必需。第二个版本字符串 |

#### 用法说明

比较两个版本，返回 1 到 -1 之间的数字

```lua
print(semver.compare("v2.2", "v2.2.0"))
print(semver.compare("v2.2.0", "v2.1.0"))
print(semver.compare("v2.1.1", "v2.1.0"))
print(semver.compare("v2.1.0", "v2.2.0"))
```

```
0
1
1
-1
```

## semver.satisfies

- 检查版本是否满足范围版本

#### 函数原型

::: tip API
```lua
semver.satisfies(version: <string>, range: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| version | 必需。要检查的版本字符串 |
| range | 必需。范围字符串 |

#### 用法说明

检查版本是否满足范围版本

```lua
print(semver.satisfies("v2.1.0", ">= 2.1"))
print(semver.satisfies("v2.1.0", ">1.0 <2.1"))
print(semver.satisfies("v2.1.0", ">1.0 || <2.1"))
print(semver.satisfies("v2.1.0", ">=2.x || 3.x - 4.x"))
```

```
true
false
true
true
```

## semver.select

- 从版本、标签和分支中选择所需的版本

#### 函数原型

::: tip API
```lua
semver.select(range: <string>, versions: <table>, tags: <table>, branches: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| range | 必需。版本范围字符串 |
| versions | 必需。版本数组 |
| tags | 必需。标签数组 |
| branches | 必需。分支数组 |

#### 用法说明

从版本、标签和分支中选择所需的版本

```lua
local version, source = semver.select(">=1.5.0 <1.6", {"1.5.0", "1.5.1"}, {"v1.5.0"}, {"master", "dev"})
print(semver.select(">=1.5.0 <1.6", {"1.5.0", "1.5.1"}, {"v1.5.0"}, {"master", "dev"}))
print(semver.select("v1.5.0", {"1.5.0", "1.5.1"}, {"v1.5.0"}, {"master", "dev"}))
print(semver.select("master", {"1.5.0", "1.5.1"}, {"v1.5.0"}, {"master", "dev"}))
```

```
1.5.1 version
v1.5.0 tag
master branch
```

## semver:get

- 从信息表中获取一个值

#### 函数原型

::: tip API
```lua
semver:get(key: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| key | 必需。要获取的键名 |

#### 用法说明

从信息表中获取一个值

```lua
local version = semver.new("v2.1.0+build")
print(version["_INFO"])
print(version:get("major"))
```

```
{
  prerelease = { },
  build = {
    "build"
  },
  version = "v2.1.0+build",
  raw = "v2.1.0+build",
  patch = 0,
  minor = 1,
  major = 2
}

2
```

## semver:major

- 获取主要版本

#### 函数原型

::: tip API
```lua
semver:major()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

获取主要版本

```lua
semver.new("v2.1.0"):major() -- return 2
```

## semver:minor

- 获取次要版本

#### 函数原型

::: tip API
```lua
semver:minor()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

获取次要版本

```lua
semver.new("v2.1.0"):minor() -- return 1
```

## semver:patch

- 获取补丁版本

#### 函数原型

::: tip API
```lua
semver:patch()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

获取补丁版本

```lua
semver.new("v2.1.0"):patch() -- return 0
```

## semver:build

- 获取构建版本

#### 函数原型

::: tip API
```lua
semver:build()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

获取构建版本

```lua
semver.new("v2.1.0+build"):build() -- return {"build"}
```

## semver:prerelease

- 获取预发布版本

#### 函数原型

::: tip API
```lua
semver:prerelease()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

获取预发布版本

```lua
semver.new("v2.1.0-prerelease"):prerelease() -- return {"prerelease"}
```

## semver:rawstr

- 获取原始字符串

#### 函数原型

::: tip API
```lua
semver:rawstr()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

获取原始字符串

```lua
semver.new("v2.1.0+build"):rawstr() -- return v2.1.0+build
```

## semver:shortstr

- 获取短版本字符串

#### 函数原型

::: tip API
```lua
semver:shortstr()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

获取短版本字符串

```lua
semver.new("v2.1.0+build"):shortstr() -- return 2.1.0
```
