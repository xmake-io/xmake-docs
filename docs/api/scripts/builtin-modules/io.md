
# io

The io operation module extends lua's built-in io module to provide more easy-to-use interfaces.

## io.open

- Open file for reading and writing

This is a native interface for lua. For detailed usage, see Lua's official documentation: [The Complete I/O Model](https://www.lua.org/pil/21.2.html)

If you want to read all the contents of the file, you can write:

```lua
local file = io.open("$(tmpdir)/file.txt", "r")
if file then
    local data = file:read("*all")
    file:close()
end
```

Or you can read it more quickly using [io.readfile](#io-readfile).

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

It is more convenient to directly read the contents of the entire file without opening the file, for example:

```lua
local data = io.readfile("xxx.txt")
```

## io.writefile

- Write all content to the specified path file

It is more convenient to directly write the contents of the entire file without opening the file, for example:

```lua
io.writefile("xxx.txt", "all data")
```

## io.gsub

- Full text replaces the contents of the specified path file

Similar to the [string.gsub](#stringgsub) interface, the full-text pattern matches the replacement content, but here is the direct operation file, for example:

```lua
-- Remove all whitespace characters from the file
io.gsub("xxx.txt", "%s+", "")
```

## io.tail

- Read and display the tail content of the file

Reads the data of the specified number of lines at the end of the file and displays a command like `cat xxx.txt | tail -n 10`, for example:

```lua
-- Display the last 10 lines of the file
io.tail("xxx.txt", 10)
```

## io.cat

- read and display all contents of the file

Read all the contents of the file and display it, similar to the `cat xxx.txt` command, for example:

```lua
io.cat("xxx.txt")
```

## io.print

- Formatted output content to file with newline

Directly format the passed parameter to output a line of string to the file with a line break, for example:

```lua
io.print("xxx.txt", "hello %s!", "xmake")
```

## io.printf

- Formatted output to file without line breaks

Directly format the passed parameter to output a line of string to the file without a line break, for example:

```lua
io.printf("xxx.txt", "hello %s!\n", "xmake")
```

# io.lines

- Read all lines from file

Returns all lines from a given file name

```lua
local lines = io.lines("xxx.txt")
for line in lines do
    print(line)
end
```

# io.stdfile

- Get a std file

Returns a file for a given std file name

```lua
-- returns stdin
io.stdin
-- returns stdout
io.stdout
-- returns stderr
io.stderr
```

# io.openlock

- Open a lock of a file

Returns a file lock object when successfully locking the file

```lua
local lock = io.openlock("xxx.txt")
lock:lock()
lock:unlock()
lock:close()
```

# io.replace

- Replace text of the given file and return the replaced data

Replaces a given pattern in a file by a replacement string

```lua
-- replace string "Hello" in "xxx.txt" with "World"
io.replace("xxx.txt", "Hello", "World")
-- if you want to replace a string and not a pattern
io.replace("xxx.txt", "1+1=2", "2+2=4", {plain = true})
```
