
# core.base.semver

A module to work with semantic versionning (semver). It allows you to parse version strings and access various components of a version such as major, minor, ...

We can use `import("core.base.semver")` for direct import and use.

## semver.new

- Create a new semver instance from a version string. Raise an error if the parsing failed

```lua
local version = semver.new("v2.1.0")
```

## semver.try_parse

- Same as new, but return a nil value if the parsing failed

```lua
local version = semver.try_parse("v2.1.0")
```

## semver.match

- Match a valid version from the string

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

```lua
semver.new("v2.1.0"):major() -- return 2
```

## semver:minor

- Get the minor version

```lua
semver.new("v2.1.0"):minor() -- return 1
```

## semver:patch

- Get the patch version

```lua
semver.new("v2.1.0"):patch() -- return 0
```

## semver:build

- Get the build version

```lua
semver.new("v2.1.0+build"):build() -- return {"build"}
```

## semver:prerelease

- Get the prerelease version

```lua
semver.new("v2.1.0-prerelease"):prerelease() -- return {"prerelease"}
```

## semver:rawstr

- Get the raw string

```lua
semver.new("v2.1.0+build"):rawstr() -- return v2.1.0+build
```

## semver:shortstr

- Get the short version string

```lua
semver.new("v2.1.0+build"):shortstr() -- return 2.1.0
```
