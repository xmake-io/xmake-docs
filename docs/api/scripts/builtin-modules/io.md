
# io

The io operation module extends lua's built-in io module to provide more easy-to-use interfaces.

## io.open

- Open file for reading and writing

#### Function Prototype

::: tip API
```lua
io.open(filename: <string>, mode: <string>, options: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |
| mode | Open mode string |
| options | Options table (optional) |

#### Usage

This is a native Lua interface, extended by xmake. For detailed usage, see Lua's official documentation: [The Complete I/O Model](https://www.lua.org/pil/21.2.html)

Supported open modes: `"r"` (read-only), `"w"` (write), `"a"` (append), `"r+"` (read-write), etc.

It also supports specifying encoding format, for example:

```lua
-- Open file with UTF-8 encoding
local file = io.open("xxx.txt", "r", {encoding = "utf8"})
-- Open file with UTF-16LE encoding
local file = io.open("xxx.txt", "r", {encoding = "utf16le"})
-- Open in binary mode
local file = io.open("xxx.txt", "r", {encoding = "binary"})
```

Supported encoding formats: `"utf8"` (default), `"utf16"`, `"utf16le"`, `"utf16be"`, `"binary"`

If you want to read all the contents of the file, you can write:

```lua
local file = io.open("$(tmpdir)/file.txt", "r")
if file then
    local data = file:read("*all")
    file:close()
end
```

Or you can read it more quickly using [io.readfile](#io-readfile).

File objects also support the following extended methods:

```lua
local file = io.open("xxx.txt", "r")
-- Get file size
local size = file:size()
-- Get absolute file path
local path = file:path()
-- Read a line (preserving newline character)
local line = file:read("L")
-- Iterate line by line
for line in file:lines() do
    print(line)
end
file:close()
```

If you want to write a file, you can do this:

```lua
-- Open file: w is write mode, a is append write mode
local file = io.open("xxx.txt", "w")
if file then

    -- Write data to file with native lua interface, does not support formatting, no line breaks, does not support built-in variables
    file:write("hello xmake\n")

    -- Write data to file with xmake extended interface, support formatting, no line breaks, no built-in variables
    file:writef("hello %s\n", "xmake")

    -- Use xmake extended formatted parameters to write to one line, with line breaks, and support for built-in variables
    file:print("hello %s and $(buildir)", "xmake")

    -- Write a line using the xmake extended formatted arguments, no line breaks, and support for built-in variables
    file:printf("hello %s and $(buildir) \n", "xmake")

    -- Close the file
    file:close()
end
```

## io.load

- Load all table contents from the specified path file deserialization

#### Function Prototype

::: tip API
```lua
io.load(filename: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |

#### Usage

You can load serialized table contents from a file, generally used with [io.save](#iosave), for example:

```lua
-- Load the contents of the serialized file to the table
local data = io.load("xxx.txt")
if data then

    -- Dump prints the contents of the entire table in the terminal, formatting the output
    utils.dump(data)
end
```

## io.save

- Serialize all table contents to the specified path file

#### Function Prototype

::: tip API
```lua
io.save(filename: <string>, data: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |
| data | Table data to serialize |

#### Usage

You can serialize the contents of the table to the specified file, generally used in conjunction with [io.load](#ioload), for example:

```lua
io.save("xxx.txt", {a = "a", b = "b", c = "c"})
```

The result of the storage is:

```
{
    ["b"] = "b"
,   ["a"] = "a"
,   ["c"] = "c"
}
```

## io.readfile

- Read everything from the specified path file

#### Function Prototype

::: tip API
```lua
io.readfile(filename: <string>, options: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |
| options | Options table (optional) |

#### Usage

It is more convenient to directly read the contents of the entire file without opening the file, for example:

```lua
local data = io.readfile("xxx.txt")
```

Supports option parameters to control read behavior:

```lua
-- Read in binary mode (no newline conversion)
local data = io.readfile("xxx.txt", {encoding = "binary"})

-- Read UTF-16LE encoded file
local data = io.readfile("xxx.txt", {encoding = "utf16le"})

-- Handle line continuation (lines ending with \ will be merged with the next line)
local data = io.readfile("xxx.txt", {continuation = "\\"})
```

Option parameters:
- `encoding`: File encoding format, supports `"utf8"` (default), `"utf16"`, `"utf16le"`, `"utf16be"`, `"binary"`
- `continuation`: Line continuation character, when specified, lines ending with this character will be merged with the next line (removing newlines)

xmake automatically detects and handles different newline formats (LF, CRLF) and automatically detects UTF-8 BOM.

## io.writefile

- Write all content to the specified path file

#### Function Prototype

::: tip API
```lua
io.writefile(filename: <string>, data: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |
| data | Data string to write |

#### Usage

It is more convenient to directly write the contents of the entire file without opening the file, for example:

```lua
io.writefile("xxx.txt", "all data")
```

## io.gsub

- Full text replaces the contents of the specified path file

#### Function Prototype

::: tip API
```lua
io.gsub(filename: <string>, pattern: <string>, replacement: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |
| pattern | Pattern string |
| replacement | Replacement string |

#### Usage

Similar to the [string.gsub](#stringgsub) interface, the full-text pattern matches the replacement content, but here is the direct operation file, for example:

```lua
-- Remove all whitespace characters from the file
io.gsub("xxx.txt", "%s+", "")
```

## io.tail

- Read and display the tail content of the file

#### Function Prototype

::: tip API
```lua
io.tail(filename: <string>, lines: <number>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |
| lines | Number of lines to read |

#### Usage

Reads the data of the specified number of lines at the end of the file and displays a command like `cat xxx.txt | tail -n 10`, for example:

```lua
-- Display the last 10 lines of the file
io.tail("xxx.txt", 10)
```

## io.cat

- read and display all contents of the file

#### Function Prototype

::: tip API
```lua
io.cat(filename: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |

#### Usage

Read all the contents of the file and display it, similar to the `cat xxx.txt` command, for example:

```lua
io.cat("xxx.txt")
```

## io.print

- Formatted output content to file with newline

#### Function Prototype

::: tip API
```lua
io.print(filename: <string>, formatstring: <string>, ...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |
| formatstring | Format string |
| ... | Variable arguments for formatting |

#### Usage

Directly format the passed parameter to output a line of string to the file with a line break, for example:

```lua
io.print("xxx.txt", "hello %s!", "xmake")
```

## io.printf

- Formatted output to file without line breaks

#### Function Prototype

::: tip API
```lua
io.printf(filename: <string>, formatstring: <string>, ...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |
| formatstring | Format string |
| ... | Variable arguments for formatting |

#### Usage

Directly format the passed parameter to output a line of string to the file without a line break, for example:

```lua
io.printf("xxx.txt", "hello %s!\n", "xmake")
```

## io.lines

- Read all lines from file

#### Function Prototype

::: tip API
```lua
io.lines(filename: <string>, options: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |
| options | Options table (optional) |

#### Usage

Returns an iterator function for all lines from a given file name.

```lua
for line in io.lines("xxx.txt") do
    print(line)
end
```

Can also be converted to an array:

```lua
local lines = table.to_array(io.lines("xxx.txt"))
```

Supports the same option parameters as [io.readfile](#io-readfile):

```lua
-- Read each line in binary mode (preserving CRLF)
for line in io.lines("xxx.txt", {encoding = "binary"}) do
    print(line)
end

-- Handle line continuation
for line in io.lines("xxx.txt", {continuation = "\\"}) do
    print(line)  -- Lines ending with \ will be merged with the next line
end
```

By default, newline characters are removed from each line. If you need to preserve newlines, use `file:read("L")` method.

## io.stdfile

- Get a std file

#### Function Prototype

::: tip API
```lua
io.stdfile(stdname: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| stdname | Standard file name string |

#### Usage

Returns a file for a given std file name

```lua
-- returns stdin
io.stdin
-- returns stdout
io.stdout
-- returns stderr
io.stderr
```

## io.openlock

- Open a lock of a file

#### Function Prototype

::: tip API
```lua
io.openlock(filename: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |

#### Usage

Returns a file lock object when successfully locking the file

```lua
local lock = io.openlock("xxx.txt")
lock:lock()
lock:unlock()
lock:close()
```

## io.replace

- Replace text of the given file and return the replaced data

#### Function Prototype

::: tip API
```lua
io.replace(filename: <string>, pattern: <string>, replacement: <string>, options: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filename | File path string |
| pattern | Pattern string |
| replacement | Replacement string |
| options | Options table (optional) |

#### Usage

Replaces a given pattern in a file by a replacement string

```lua
-- replace string "Hello" in "xxx.txt" with "World"
io.replace("xxx.txt", "Hello", "World")
-- if you want to replace a string and not a pattern
io.replace("xxx.txt", "1+1=2", "2+2=4", {plain = true})
```

Option parameters:
- `plain`: If true, use simple string matching; if false, use pattern matching
- `encoding`: Specify file encoding format
