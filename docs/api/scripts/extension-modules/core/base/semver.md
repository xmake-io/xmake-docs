
# core.base.semver

A module to work with semantic versionning (semver). It allows you to parse version strings and access various components of a version such as major, minor, ...

We can use `import("core.base.semver")` for direct import and use.

## semver.new

- Create a new semver instance from a version string. Raise an error if the parsing failed

#### Function Prototype

::: tip API
```lua
semver.new(version: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| version | Required. Version string |

#### Usage

Creates a new semver instance from a version string. Raises an error if parsing fails.

```lua
local version = semver.new("v2.1.0")
```

## semver.try_parse

- Same as new, but return a nil value if the parsing failed

#### Function Prototype

::: tip API
```lua
semver.try_parse(version: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| version | Required. Version string |

#### Usage

Same as new, but returns nil value if parsing failed.

```lua
local version = semver.try_parse("v2.1.0")
```

## semver.match

- Match a valid version from the string

#### Function Prototype

::: tip API
```lua
semver.match(str: <string>, pos: <number>, pattern: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| str | Required. String to match from |
| pos | Required. Start position |
| pattern | Optional. Pattern to match |

#### Usage

Matches a valid version from the string.

```lua
print(semver.match("v2.1.0", 1)) -- start from position 1
print(semver.match("v2.1.0", 0, "%d+%.%d+"))
```

```
2.1.0
2.1
```

## semver.is_valid

- Get if a given string version is valid, by testing if the version can be parsed

#### Function Prototype

::: tip API
```lua
semver.is_valid(version: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| version | Required. Version string to validate |

#### Usage

Tests if the version can be parsed.

```lua
print(semver.is_valid("536f2bd6a092eba91315b7d1e120dff63392a11d"))
print(semver.is_valid("v2.1.0-pre"))
```

```
false
true
```

## semver.is_valid_range

- Test if the given range is a valid one

#### Function Prototype

::: tip API
```lua
semver.is_valid_range(range: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| range | Required. Range string to validate |

#### Usage

Tests if the given range is a valid one.

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

- Compare two versions, return a number between 1 and -1

#### Function Prototype

::: tip API
```lua
semver.compare(v1: <string>, v2: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| v1 | Required. First version string |
| v2 | Required. Second version string |

#### Usage

Compares two versions and returns a number between -1 and 1.

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

- Check if a version satisfies a range version

#### Function Prototype

::: tip API
```lua
semver.satisfies(version: <string>, range: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| version | Required. Version string |
| range | Required. Range string |

#### Usage

Checks if a version satisfies a range version.

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

- Select required version from versions, tags and branches

#### Function Prototype

::: tip API
```lua
semver.select(range: <string>, versions: <table>, tags: <table>, branches: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| range | Required. Range string |
| versions | Required. Array of versions |
| tags | Required. Array of tags |
| branches | Required. Array of branches |

#### Usage

Selects required version from versions, tags and branches.

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

- Get a value from the informations table

#### Function Prototype

::: tip API
```lua
semver:get(key: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| key | Required. Information key |

#### Usage

Gets a value from the informations table.

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

- Get the major version

#### Function Prototype

::: tip API
```lua
semver:major()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the major version number.

```lua
semver.new("v2.1.0"):major() -- return 2
```

## semver:minor

- Get the minor version

#### Function Prototype

::: tip API
```lua
semver:minor()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the minor version number.

```lua
semver.new("v2.1.0"):minor() -- return 1
```

## semver:patch

- Get the patch version

#### Function Prototype

::: tip API
```lua
semver:patch()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the patch version number.

```lua
semver.new("v2.1.0"):patch() -- return 0
```

## semver:build

- Get the build version

#### Function Prototype

::: tip API
```lua
semver:build()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the build version.

```lua
semver.new("v2.1.0+build"):build() -- return {"build"}
```

## semver:prerelease

- Get the prerelease version

#### Function Prototype

::: tip API
```lua
semver:prerelease()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the prerelease version.

```lua
semver.new("v2.1.0-prerelease"):prerelease() -- return {"prerelease"}
```

## semver:rawstr

- Get the raw string

#### Function Prototype

::: tip API
```lua
semver:rawstr()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the raw version string.

```lua
semver.new("v2.1.0+build"):rawstr() -- return v2.1.0+build
```

## semver:shortstr

- Get the short version string

#### Function Prototype

::: tip API
```lua
semver:shortstr()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the short version string.

```lua
semver.new("v2.1.0+build"):shortstr() -- return 2.1.0
```
