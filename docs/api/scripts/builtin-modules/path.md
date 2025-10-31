
# path

The path operation module implements cross-platform path operations, which is a custom module of xmake.

## path.new

- Create a new path instance

#### Function Prototype

::: tip API
```lua
path.new(p: <string>, transform?: <function>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| p | Required. Path string |
| transform | Optional. Path transformation function |

#### Return Value

| Type | Description |
|------|-------------|
| path | Returns a path instance |

#### Usage

Create a path instance:

```lua
local p = path.new("/tmp/file.txt")
print(p:filename())  -- Output: file.txt
```

Using a transformation function:

```lua
local p = path.new("/tmp/a", function (raw_path)
    return "--key=" .. raw_path
end)
print(p:str())      -- Output: --key=/tmp/a
print(p:rawstr())   -- Output: /tmp/a
```

Or call the constructor directly:

```lua
local p = path("/tmp/file.txt")  -- Automatically creates an instance
print(p:filename())
```

## path.normalize

- Normalize the path

#### Function Prototype

::: tip API
```lua
path.normalize(p: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| p | Required. Path string |

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the normalized path string |

#### Usage

Normalize the path (simplify `.` and `..`):

```lua
print(path.normalize("/tmp/./../file.txt"))  -- Output: /file.txt
print(path.normalize("c:\\tmp\\..\\.."))     -- On Windows: c:\\..
```

## path.join

- Stitching path

#### Function Prototype

::: tip API
```lua
path.join(paths: <string|array>, ...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| paths | Path string or array |
| ... | Variable arguments, can pass multiple path strings |

#### Usage

Adding multiple path items by splicing. Due to the path difference of `windows/unix` style, using api to append paths is more cross-platform, for example:

```lua
print(path.join("$(tmpdir)", "dir1", "dir2", "file.txt"))
```

The above splicing on Unix is equivalent to: `$(tmpdir)/dir1/dir2/file.txt`, and on Windows is equivalent to: `$(tmpdir)\\dir1\\dir2\\file.txt`

If you find this cumbersome and not clear enough, you can use: [path.translate](#path-translate) to format the conversion path string to the format supported by the current platform.

## path.translate

- Convert path to the path style of the current platform

#### Function Prototype

::: tip API
```lua
path.translate(path: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| path | Path string to convert |

#### Usage

Formatting converts the specified path string to the path style supported by the current platform, and supports the path string parameter of the `windows/unix` format to be passed in, even mixed, such as:

```lua
print(path.translate("$(tmpdir)/dir/file.txt"))
print(path.translate("$(tmpdir)\\dir\\file.txt"))
print(path.translate("$(tmpdir)\\dir/dir2//file.txt"))
```

The path strings of the above three different formats, after being standardized by `translate`, will become the format supported by the current platform, and the redundant path separator will be removed.

## path.basename

- Get the file name with no suffix at the end of the path

#### Function Prototype

::: tip API
```lua
path.basename(path: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| path | Path string |

#### Usage

```lua
print(path.basename("$(tmpdir)/dir/file.txt"))
```

The result is: `file`

## path.filename

- Get the file name with the last suffix of the path

#### Function Prototype

::: tip API
```lua
path.filename(path: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| path | Path string |

#### Usage

```lua
print(path.filename("$(tmpdir)/dir/file.txt"))
```

The result is: `file.txt`

## path.extension

- Get the suffix of the path

#### Function Prototype

::: tip API
```lua
path.extension(path: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| path | Path string |

#### Usage

```lua
print(path.extension("$(tmpdir)/dir/file.txt"))
```

The result is: `.txt`

## path.directory

- Get the directory name of the path

#### Function Prototype

::: tip API
```lua
path.directory(path: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| path | Path string |

#### Usage

```lua
print(path.directory("$(tmpdir)/dir/file.txt"))
```

The result is: `$(tmpdir)/dir`

## path.relative

- Convert to relative path

#### Function Prototype

::: tip API
```lua
path.relative(path: <string>, rootdir: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| path | Path string to convert |
| rootdir | Root directory for relative conversion |

#### Usage

```lua
print(path.relative("$(tmpdir)/dir/file.txt", "$(tmpdir)"))
```

The result is: `dir/file.txt`

The second parameter is to specify the relative root directory. If not specified, the default is relative to the current directory:

```lua
os.cd("$(tmpdir)")
print(path.relative("$(tmpdir)/dir/file.txt"))
```

The result is the same.

## path.absolute

- Convert to absolute path

#### Function Prototype

::: tip API
```lua
path.absolute(path: <string>, rootdir: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| path | Path string to convert |
| rootdir | Root directory for absolute conversion |

#### Usage

```lua
print(path.absolute("dir/file.txt", "$(tmpdir)"))
```

The result is: `$(tmpdir)/dir/file.txt`

The second parameter is to specify the relative root directory. If not specified, the default is relative to the current directory:

```lua
os.cd("$(tmpdir)")
print(path.absolute("dir/file.txt"))
```

The result is the same.

## path.is_absolute

- Determine if it is an absolute path

#### Function Prototype

::: tip API
```lua
path.is_absolute(path: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| path | Path string to check |

#### Usage

```lua
if path.is_absolute("/tmp/file.txt") then
    -- if it is an absolute path
end
```

## path.split

- Split the path by the separator

#### Function Prototype

::: tip API
```lua
path.split(path: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| path | Path string to split |

#### Usage

```lua
print(path.split("/tmp/file.txt"))
```
The result is: `{ "tmp", "file.txt" }`

## path.sep

- Return the current separator, usually `/`

#### Function Prototype

::: tip API
```lua
path.sep()
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| None | No parameters |

#### Usage

```lua
print(path.sep())
```

The result is: `/`

## path.islastsep

- Get if the last character is a separator

#### Function Prototype

::: tip API
```lua
path.islastsep(path: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| path | Path string to check |

#### Usage

```lua
if (path.islastsep("/tmp/dir/")) then
    -- if the last character is a separator
end
```

## path.splitenv

- Split a environment variable value of an array of pathes

#### Function Prototype

::: tip API
```lua
path.splitenv(envpath: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| envpath | Environment variable path string |

#### Usage

```lua
local pathes = path.splitenv(vformat("$(env PATH)"))

-- for windows
local pathes = path.splitenv("C:\\Windows;C:\\Windows\\System32")
-- got { "C:\\Windows", "C:\\Windows\\System32" }

-- for *nix
local pathes = path.splitenv("/usr/bin:/usr/local/bin")
-- got { "/usr/bin", "/usr/local/bin" }
```

The result is an array of strings, each item is a path in the input string.

## path.joinenv

- Concat two environment variable by the environment separator

#### Function Prototype

::: tip API
```lua
path.joinenv(paths: <array>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| paths | Array of path strings |

#### Usage

```lua
print(path.joinenv({"/tmp/dir", "/tmp/dir2"}))
```
The result is: `/tmp/dir;/tmp/dir2` (on Windows)

## path.envsep

- Get the environment separator

#### Function Prototype

::: tip API
```lua
path.envsep()
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| None | No parameters |

#### Usage

```lua
print(path.envsep())
```

The result is: `;`

## path.cygwin_path

-  Get the converted MSYS2/Cygwin style path

#### Function Prototype

::: tip API
```lua
path.cygwin_path(path: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| path | Windows path string to convert |

#### Usage

```lua
print(path.cygwin_path("C:\\Windows"))
```
The result is: `/C/Windows`

## path.pattern

- Convert path pattern to lua pattern

#### Function Prototype

::: tip API
```lua
path.pattern(path: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| path | Path string to convert |

#### Usage

```lua
print(path.pattern("/tmp/file.txt"))
```

The result is: `/[tT][mM][pP]/[fF][iI][lL][eE]%.[tT][xX][tT]`
