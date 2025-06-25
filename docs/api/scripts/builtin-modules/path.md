
# path

The path operation module implements cross-platform path operations, which is a custom module of xmake.

## path.new

- Create a new path instance

```lua
local p = path.new("/tmp/file.txt")
print(p:filename())
```

The result is: `file.txt`

## path.join

- Stitching path

Adding multiple path items by splicing. Due to the path difference of `windows/unix` style, using api to append paths is more cross-platform, for example:

```lua
print(path.join("$(tmpdir)", "dir1", "dir2", "file.txt"))
```

The above splicing on Unix is equivalent to: `$(tmpdir)/dir1/dir2/file.txt`, and on Windows is equivalent to: `$(tmpdir)\\dir1\\dir2\\file.txt`

If you find this cumbersome and not clear enough, you can use: [path.translate](#path-translate) to format the conversion path string to the format supported by the current platform.

## path.translate

- Convert path to the path style of the current platform

Formatting converts the specified path string to the path style supported by the current platform, and supports the path string parameter of the `windows/unix` format to be passed in, even mixed, such as:

```lua
print(path.translate("$(tmpdir)/dir/file.txt"))
print(path.translate("$(tmpdir)\\dir\\file.txt"))
print(path.translate("$(tmpdir)\\dir/dir2//file.txt"))
```

The path strings of the above three different formats, after being standardized by `translate`, will become the format supported by the current platform, and the redundant path separator will be removed.

## path.basename

- Get the file name with no suffix at the end of the path

```lua
print(path.basename("$(tmpdir)/dir/file.txt"))
```

The result is: `file`

## path.filename

- Get the file name with the last suffix of the path

```lua
print(path.filename("$(tmpdir)/dir/file.txt"))
```

The result is: `file.txt`

## path.extension

- Get the suffix of the path

```lua
print(path.extensione("$(tmpdir)/dir/file.txt"))
```

The result is: `.txt`

## path.directory

- Get the directory name of the path

```lua
Print(path.directory("$(tmpdir)/dir/file.txt"))
```

The result is: `$(tmpdir)/dir`

## path.relative

- Convert to relative path

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

```lua
if path.is_absolute("/tmp/file.txt") then
    -- if it is an absolute path
end
```

## path.split

- Split the path by the separator

```lua
print(path.split("/tmp/file.txt"))
```
The result is: `{ "tmp", "file.txt" }`

## path.sep

- Return the current separator, usually `/`

```lua
print(path.sep("/tmp/file.txt"))
```

The result is: `/`

## path.islastsep

- Get if the last character is a separator

```lua
if (path.islastsep("/tmp/dir/")) then
    -- if the last character is a separator
end
```

## path.splitenv

- Split a environment variable value of an array of pathes

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

```lua
print(path.joinenv({"/tmp/dir", "/tmp/dir2"}))
```
The result is: `/tmp/dir;/tmp/dir2` (on Windows)

## path.envsep

- Get the environment separator

```lua
print(path.envsep())
```

The result is: `;`

## path.cygwin_path

-  Get the converted MSYS2/Cygwin style path

```lua
print(path.cygwin_path("C:\\Windows"))
```
The result is: `/C/Windows`

## path.pattern


- Convert path pattern to lua pattern

```lua
print(path.pattern("/tmp/file.txt"))
```

The result is: `/[tT][mM][pP]/[fF][iI][lL][eE]%.[tT][xX][tT]`
