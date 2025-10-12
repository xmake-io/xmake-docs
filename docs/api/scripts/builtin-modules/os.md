# os

The system operation module belongs to the built-in module. It can be called directly by the script scope without using [import](/api/scripts/builtin-modules/import) to import.

This module is also a native module of lua, and xmake has been extended to provide more practical interfaces.

::: tip NOTE
Only some readonly interfaces (for example: `os.getenv`, `os.arch`) in the os module can be used in the description scope. Other interfaces can only be used in the script domain, for example: `os.cp`, `os .rm`etc.
:::

## os.cp

- Copy files or directories

The behavior is similar to the `cp` command in the shell, supporting path wildcard matching (using lua pattern matching), support for multi-file copying, and built-in variable support.

e.g:

```lua
os.cp("$(scriptdir)/*.h", "$(builddir)/inc")
os.cp("$(projectdir)/src/test/**.h", "$(builddir)/inc")
```

The above code will copy all the header files in the current `xmake.lua` directory, the header files in the project source test directory to the `$(builddir)` output directory.

Among them `$(scriptdir)`, `$(projectdir)` These variables are built-in variables of xmake.
For details, see the related documentation of [built-in variables](/api/description/builtin-variables).

The matching patterns in `*.h` and `**.h` are similar to those in [add_files](/api/description/project-target#add-files), the former is a single-level directory matching, and the latter is a recursive multi-level directory matching.

This interface also supports `recursive replication' of directories, for example:

```lua
-- Recursively copy the current directory to a temporary directory
os.cp("$(curdir)/test/", "$(tmpdir)/test")
```

The copy at the top will expand and copy all files to the specified directory, and lose the source directory hierarchy. If you want to copy according to the directory structure that maintains it, you can set the rootdir parameter:

```lua
os.cp ("src/**.h", "/tmp/", {rootdir="src"})
```

The above script can press the root directory of `src` to copy all sub-files under src in the same directory structure.

::: tip NOTE
Try to use the `os.cp` interface instead of `os.run("cp ..")`, which will ensure platform consistency and cross-platform build description.
:::

Under 2.5.7, the parameter `{symlink = true}` is added to keep the symbolic link when copying files.

```lua
os.cp("/xxx/foo", "/xxx/bar", {symlink = true})
```

Since v3.0.4, the parameter `{copy_if_different = true}` is added to copy files only when the source and destination file contents differ. If the file contents are the same, the copy operation will be skipped, preserving the destination file's metadata such as mtime. This helps avoid unnecessary incremental builds.

```lua
os.cp("$(scriptdir)/config.h", "$(builddir)/inc/config.h", {copy_if_different = true})
```

## os.mv

- Move to rename a file or directory

Similar to the use of [os.cp](#os-cp), it also supports multi-file move operations and pattern matching, for example:

```lua
-- Move multiple files to a temporary directory
os.mv("$(builddir)/test1", "$(tmpdir)")

-- File movement does not support bulk operations, which is file renaming
os.mv("$(builddir)/libtest.a", "$(builddir)/libdemo.a")
```

## os.rm

- Delete files or directory trees

Support for recursive deletion of directories, bulk delete operations, and pattern matching and built-in variables, such as:

```lua
os.rm("$(builddir)/inc/**.h")
os.rm("$(builddir)/lib/")
```

## os.trycp

- Try copying files or directories

Similar to [os.cp](#os-cp), the only difference is that this interface operation will not throw an exception interrupt xmake, but the return value indicates whether the execution is successful.

```lua
if os.trycp("file", "dest/file") then
end
```

## os.trymv

- Try moving a file or directory

Similar to [os.mv](#os-mv), the only difference is that this interface operation will not throw an exception interrupt xmake, but the return value indicates whether the execution is successful.

```lua
if os.trymv("file", "dest/file") then
end
```

## os.tryrm

- Try deleting files or directories

Similar to [os.rm](#os-rm), the only difference is that this interface operation will not throw an exception interrupt xmake, but the return value indicates whether the execution is successful.

```lua
if os.tryrm("file") then
end
```

## os.cd

- Enter the specified directory

This operation is used for directory switching and also supports built-in variables, but does not support pattern matching and multi-directory processing, for example:

```lua
-- Enter the temporary directory
os.cd("$(tmpdir)")
```

If you want to leave the previous directory, there are several ways:

```lua
-- Enter the parent directory
os.cd("..")

-- Enter the previous directory, equivalent to: cd -
os.cd("-")

-- Save the previous directory before entering the directory, then use it to cut back directly after the level
local oldir = os.cd("./src")
...
os.cd(oldir)
```

## os.rmdir

- delete only the directory

If it is not a directory, it cannot be deleted.

## os.mkdir

- Create a directory

Support for batch creation and built-in variables, such as:

```lua
os.mkdir("$(tmpdir)/test", "$(builddir)/inc")
```

Supports recursive creation of multi-level directories, automatically creating parent directories if they don't exist.

## os.touch

- Create an empty file or update file timestamp

```lua
os.touch("path/to/file.txt")
```

If the file doesn't exist, creates an empty file. If the file already exists, updates the file's modification time to the current time.

Supports batch creation:

```lua
os.touch("file1.txt", "file2.txt", "file3.txt")
```

## os.isdir

- Determine if it is a directory

Return false if the directory does not exist

```lua
if os.isdir("src") then
    -- ...
end
```

## os.isfile

- Determine if it is a file

Return false if the file does not exist

```lua
if os.isfile("$(builddir)/libxxx.a") then
    -- ...
end
```

## os.exists

- Determine if a file or directory exists

Return false if the file or directory does not exist

```lua
-- Judging the existence of the directory
if os.exists("$(builddir)") then
    -- ...
end

-- Judging the existence of the file
if os.exists("$(builddir)/libxxx.a") then
    -- ...
end
```

## os.islink

- Determine if it is a symbolic link

Determines whether the specified path is a symbolic link. Returns false if it is not a symbolic link or doesn't exist.

```lua
if os.islink("path/to/symlink") then
    -- It is a symbolic link
    local target = os.readlink("path/to/symlink")
    print("Link target:", target)
end
```

Used with [os.ln](#os-ln):

```lua
os.ln("source.txt", "link.txt")
assert(os.islink("link.txt"))
```

## os.dirs

- Traverse to get all the directories under the specified directory

Supports pattern matching in [add_files](#targetadd_files), supports recursive and non-recursive mode traversal, and returns a table array. If not, returns an empty array, for example:

```lua
-- Recursive traversal to get all subdirectories
for _, dir in ipairs(os.dirs("$(builddir)/inc/**")) do
    print(dir)
end
```

## os.files

- Traverse to get all the files in the specified directory

Supports pattern matching in [add_files](#targetadd_files), supports recursive and non-recursive mode traversal, and returns a table array. If not, returns an empty array, for example:

```lua
-- Non-recursive traversal to get all child files
for _, filepath in ipairs(os.files("$(builddir)/inc/*.h")) do
    print(filepath)
end
```

## os.filedirs

- Traverse to get all files and directories under the specified directory

Supports pattern matching in [add_files](#targetadd_files), supports recursive and non-recursive mode traversal, and returns a table array. If not, returns an empty array, for example:

```lua
-- Recursive traversal to get all child files and directories
for _, filedir in ipairs(os.filedirs("$(builddir)/**")) do
    print(filedir)
end
```

## os.exit

- Exit the program

```lua
os.exit(code)
```

Exits the current program and returns the specified exit code. If no exit code is specified, defaults to 0 (success).

```lua
-- Normal exit
os.exit(0)

-- Exit with error
if error_occurred then
    os.exit(1)
end
```

## os.isexec

- Test if a file is executable

```lua
if os.isexec("path/to/file.exe") then
    os.run("path/to/file.exe")
end
```

Determines whether the specified file has executable permissions. On Unix systems, it checks the file's execute permission bits; on Windows, it checks the file extension.

Used for dynamically detecting executable files:

```lua
local program = "/usr/bin/gcc"
if os.isexec(program) then
    print("Program is executable")
    os.execv(program, {"--version"})
else
    print("Program is not executable or doesn't exist")
end
```

## os.run

- Quietly running native shell commands

Used to execute third-party shell commands, but will not echo the output, only after the error, highlight the error message.

This interface supports parameter formatting and built-in variables such as:

```lua
-- Formatted parameters passed in
os.run("echo hello %s!", "xmake")

-- List build directory files
os.run("ls -l $(builddir)")
```

::: tip WARN
Using this interface to execute shell commands can easily reduce the cross-platform build. For `os.run("cp ..")`, try to use `os.cp` instead.
If you must use this interface to run the shell program, please use the [config.plat](#config-plat) interface to determine the platform support.
:::

For more advanced process operations and control, see the [process](#process) module interface.

## os.runv

- Quietly running native shell commands with parameter list

Similar to [os.run](#os-run), just the way to pass parameters is passed through the parameter list, not the string command, for example:

```lua
os.runv("echo", {"hello", "xmake!"})
```

## os.exec

- Echo running native shell commands

Similar to the [os.run](#os-run) interface, the only difference is that when this interface executes the shell program, it has the output output, which is used in general debugging.

## os.execv

- Echo running native shell commands with parameter list

Similar to [os.exec](#os-exec), just the way to pass parameters is passed through the parameter list, not the string command, for example:

```lua
os.execv("echo", {"hello", "xmake!"})
```

In addition, this interface also supports an optional parameter for passing settings: redirect output, perform environment variable settings, for example:

```lua
os.execv("echo", {"hello", "xmake!"}, {stdout = outfile, stderr = errfile, envs = {PATH = "xxx;xx", CFLAGS = "xx"}}
```

The stdout and stderr parameters are used to pass redirected output and error output. You can directly pass in the file path or the file object opened by io.open.

After v2.5.1, we also support setting the stdin parameter to support redirecting input files.

::: tip NOTE
stdout/stderr/stdin can simultaneously support three types of values: file path, file object, and pipe object.
:::

### Redirecting to Files

```lua
-- Redirect output to file
os.execv("echo", {"hello"}, {stdout = "output.txt"})

-- Using file object
local outfile = io.open("output.txt", "w")
os.execv("echo", {"hello"}, {stdout = outfile})
outfile:close()
```

### Redirecting to Pipes

Combined with the pipe module, you can capture subprocess output for processing:

```lua
import("core.base.pipe")
import("core.base.bytes")

-- Create pipe
local rpipe, wpipe = pipe.openpair()

-- Redirect subprocess stdout to pipe
os.execv("ls", {"-l"}, {stdout = wpipe})

-- Close write end, read output
wpipe:close()
local buff = bytes(8192)
local read, data = rpipe:read(buff, 8192)
if read > 0 then
    print("Command output:", data:str())
end
rpipe:close()
```

Redirecting both stdout and stderr simultaneously:

```lua
import("core.base.pipe")
import("core.base.bytes")

local rpipe_out, wpipe_out = pipe.openpair()
local rpipe_err, wpipe_err = pipe.openpair()

-- Redirect stdout and stderr separately
os.execv("make", {}, {stdout = wpipe_out, stderr = wpipe_err})

wpipe_out:close()
wpipe_err:close()

-- Read stdout
local buff = bytes(8192)
local read, output = rpipe_out:read(buff, 8192)
print("Stdout:", output and output:str() or "")

-- Read stderr
local read, errors = rpipe_err:read(buff, 8192)
print("Stderr:", errors and errors:str() or "")

rpipe_out:close()
rpipe_err:close()
```

In addition, if you want to temporarily set and rewrite some environment variables during this execution, you can pass the envs parameter. The environment variable settings inside will replace the existing settings, but will not affect the outer execution environment, only the current command.

We can also get all the current environment variables through the `os.getenvs()` interface, and then pass in the envs parameter after rewriting some parts.

## os.iorun

- Quietly running native shell commands and getting output

Similar to the [os.run](#os-run) interface, the only difference is that after executing the shell program, this interface will get the execution result of the shell program, which is equivalent to redirecting the output.

You can get the contents of `stdout`, `stderr` at the same time, for example:

```lua
local outdata, errdata = os.iorun("echo hello xmake!")
```

## os.iorunv

- Run the native shell command quietly and get the output with a list of parameters

Similar to [os.iorun](#os-iorun), just the way to pass arguments is passed through the argument list, not the string command, for example:

```lua
local outdata, errdata = os.iorunv("echo", {"hello", "xmake!"})
local outdata, errdata = os.iorunv("echo", {"hello", "xmake!"}, {envs = {PATH="..."}})
```

## os.tmpdir

- Get temporary directory

Consistent with the result of [$(tmpdir)](/api/description/builtin-variables#var-tmpdir), it is just a direct return to return a variable that can be maintained with subsequent strings.

```lua
print(path.join(os.tmpdir(), "file.txt"))
```

Equivalent to:

```lua
print("$(tmpdir)/file.txt")
```

## os.tmpfile

- Get temporary file path

```lua
local tmpfile = os.tmpfile()
```

Generates a unique temporary file path, returns only the path string, the file itself is not automatically created and needs to be created manually.

Each call generates a different temporary file path, suitable for creating temporary files:

```lua
-- Generate temporary file path
local tmpfile = os.tmpfile()
print("Temp file:", tmpfile)  -- e.g.: /tmp/xmake_XXXXXX

-- Create and use temporary file
io.writefile(tmpfile, "temporary data")
-- Delete after use
os.rm(tmpfile)
```

## os.curdir

- Get the current directory path

Consistent with the result of [$(curdir)](/api/description/builtin-variables#var-curdir), it is just a direct return to return a variable that can be maintained with subsequent strings.

Usage reference: [os.tmpdir](#os-tmpdir).

## os.filesize

- Get file size

```lua
local size = os.filesize("/tmp/a")
```

Returns the size of the file in bytes. Returns 0 if the file doesn't exist or is inaccessible.

Practical examples:

```lua
local size = os.filesize("build/output.bin")
if size > 0 then
    print(string.format("File size: %.2f KB", size / 1024))
end

-- Check if file is empty
if os.filesize("config.txt") == 0 then
    print("Config file is empty")
end
```

## os.scriptdir

- Get the path of the current description script

Consistent with the result of [$(scriptdir)](/api/description/builtin-variables#var-scriptdir), it is just a direct return to return a variable that can be maintained with subsequent strings.

Usage reference: [os.tmpdir](#os-tmpdir).

## os.programdir

- Get the xmake installation main program script directory

Consistent with the result of [$(programdir)](/api/description/builtin-variables#var-programdir), it is just a direct get returned to a variable, which can be maintained with subsequent strings.

## os.programfile

- Get the path of the xmake executable

```lua
local xmake_path = os.programfile()
```

Returns the full path to the xmake executable.

```lua
print("xmake path:", os.programfile())
-- e.g.: /usr/local/bin/xmake
```

## os.projectdir

- Get the project home directory

Consistent with the result of [$(projectdir)](/api/description/builtin-variables#var-projectdir), it is just a direct return to return a variable that can be maintained with subsequent strings.

## os.arch

- Get current system architecture

```lua
local arch = os.arch()
```

Returns the default architecture of the current host system. For example, executing xmake on `linux x86_64` returns: `x86_64`

Common architecture values: `x86_64`, `i386`, `arm64`, `armv7`, `mips`, etc.

```lua
print("Current architecture:", os.arch())

-- Execute different operations based on architecture
if os.arch() == "x86_64" then
    add_defines("ARCH_X64")
end
```

## os.host

- Get the operating system of the current host

```lua
local host = os.host()
```

Consistent with the result of [$(host)](/api/description/builtin-variables#var-host). For example, executing xmake on `linux x86_64` returns: `linux`

Common system values: `linux`, `macosx`, `windows`, `bsd`, etc.

```lua
print("Current system:", os.host())

-- Execute different operations based on system
if os.host() == "windows" then
    add_defines("WINDOWS")
elseif os.host() == "linux" then
    add_defines("LINUX")
end
```

## os.subhost

- Get Subsystem host

```lua
local subhost = os.subhost()
```

Gets the current subsystem environment, such as msys or cygwin on Windows.

If not running in a subsystem environment, returns the same value as [os.host()](#os-host).

```lua
-- In MSYS2 environment
print(os.subhost())  -- Returns: msys

-- Detect if running in subsystem
if os.subhost() ~= os.host() then
    print("Running in subsystem environment")
end
```

## os.subarch

- Get Subsystem host architecture

```lua
local subarch = os.subarch()
```

Gets the architecture of the subsystem. If not running in a subsystem environment, returns the same value as [os.arch()](#os-arch).

## os.is_host

- Test if a given host is the current

```lua
if os.is_host("linux") then
    -- On Linux system
end

if os.is_host("macosx", "linux") then
    -- On macOS or Linux system
end
```

Supports checking multiple systems at once, returns true if any matches.

::: tip TIP
It's recommended to use the more concise built-in interface `is_host()` without the `os.` prefix, with the same usage:

```lua
if is_host("linux") then
    -- On Linux system
end
```
:::

## os.is_arch

- Test if a given arch is the current

```lua
if os.is_arch("x86_64") then
    -- On x86_64 architecture
end

if os.is_arch("x86_64", "arm64") then
    -- On x86_64 or arm64 architecture
end
```

Supports checking multiple architectures at once.

## os.is_subhost

- Test if a given sub host is the current

```lua
if os.is_subhost("msys") then
    -- In MSYS subsystem
end
```

Used to detect if running in a specific subsystem environment, such as msys or cygwin.

::: tip TIP
It's recommended to use the more concise built-in interface `is_subhost()` with the same usage.
:::

## os.is_subarch

- Test if a given sub arch is the current

```lua
if os.is_subarch("x86_64") then
    -- Subsystem architecture is x86_64
end
```

## os.ln

- Create a symlink to a file or directory

```lua
-- creates a symlink file "xxx.txt.ln" which is pointing to "xxx.txt"
os.ln("xxx.txt", "xxx.txt.ln")
```

## os.readlink

- Read the content of a symlink

```lua
local target = os.readlink("path/to/symlink")
```

Reads the target path that the symbolic link points to. Returns nil if the specified path is not a symbolic link.

Used with [os.ln](#os-ln) and [os.islink](#os-islink):

```lua
os.ln("source.txt", "link.txt")
if os.islink("link.txt") then
    local target = os.readlink("link.txt")
    print("Link points to:", target)  -- Output: source.txt
end
```

## os.raise

- Raise an exception and abort the current script

```lua
-- Raise exception with message "an error occurred"
os.raise("an error occurred")
```

::: tip NOTE
Recommanded to use builtin function `raise` instead of `os.raise`
:::

## os.raiselevel

- Similar to [os.raise](#os-raise) but you can specify the level of the error

```lua
-- Raise exception with message "an error occurred"
os.raiselevel(3,"an error occurred")
```

## os.features

- Get features

```lua
local features = os.features()
```

Gets a list of features supported by the current operating system. Returns a table containing various system-supported features.

## os.getenvs

- Get all current environment variables

```lua
local envs = os.getenvs()
--- home directory (on linux)
print(envs["HOME"])
```

## os.setenvs

- Set environment variables. Replace the current envs by a new one and return old envs

## os.addenvs

- Add environment variables to current envs, return the all old envs

```lua
os.setenvs({EXAMPLE = "a/path"}) -- add a custom variable to see addenvs impact on it

local oldenvs = os.addenvs({EXAMPLE = "some/path/"})
print(os.getenvs()["EXAMPLE"]) --got some/path/;a/path
print(oldenvs["EXAMPLE"]) -- got a/path
```

## os.joinenvs

- Join environment variables. Similar to [os.addenvs](#os-addenvs) but with two envs variable

```lua
local envs = {CUSTOM = "a/path"}
local envs2 = {CUSTOM = "some/path/"}
print(os.joinenvs(envs, envs2))
```

The result is: `{ CUSTOM = "a/path;some/path/" }`

## os.getenv

- Get system environment variables

```lua
local value = os.getenv("PATH")
```

Gets the value of the specified environment variable. Returns nil if the environment variable doesn't exist.

```lua
local path = os.getenv("PATH")
if path then
    print("PATH:", path)
end

-- Get environment variable with default value
local home = os.getenv("HOME") or "/tmp"
```

## os.setenv

- Set system environment variables

```lua
os.setenv("HOME", "/tmp/")
```

Sets the value of the specified environment variable. After setting, it affects the current process and its child processes.

```lua
-- Set environment variable
os.setenv("MY_VAR", "my_value")
print(os.getenv("MY_VAR"))  -- Output: my_value

-- Set PATH
os.setenv("PATH", "/new/path:" .. os.getenv("PATH"))
```

## os.addenv

- Add values to one environment variable

```lua
os.addenv("PATH", "/new/path")
```

Appends a new value to the specified environment variable, using the system default separator (`:` on Unix, `;` on Windows).

```lua
-- Add new path to PATH
os.addenv("PATH", "/usr/local/bin")

-- Verify
print(os.getenv("PATH"))  -- New path will be appended to existing PATH
```

## os.setenvp

- Setting environment variables with a given separator

```lua
os.setenvp("VAR", "value", "separator")
```

Sets an environment variable using a specified separator. Similar to [os.setenv](#os-setenv), but allows custom separator.

## os.addenvp

- Add values to one environment variable with a given separator

```lua
os.addenvp("VAR", "value", "separator")
```

Appends a value to an environment variable using a specified separator. Similar to [os.addenv](#os-addenv), but allows custom separator.

## os.workingdir

- Get the working directory

```lua
local workdir = os.workingdir()
```

Gets the absolute path of the current working directory. Similar to `os.curdir()`, but returns the working directory instead of the current script execution directory.

```lua
print("Working directory:", os.workingdir())
```

## os.isroot

- Test if xmake is running as root

```lua
if os.isroot() then
    print("Running as root/administrator")
end
```

On Unix systems, checks if running as root user; on Windows, checks if running with administrator privileges.

Useful when certain operations require administrator privileges:

```lua
if not os.isroot() then
    raise("This operation requires administrator privileges, please use sudo or run as administrator")
end
```

## os.fscase

- Test if the os has a case sensitive filesystem

```lua
if os.fscase() then
    print("Filesystem is case-sensitive")
else
    print("Filesystem is case-insensitive")
end
```

Returns true if the filesystem is case-sensitive (like Linux), false if not (like Windows, macOS default).

Useful for handling cross-platform filename compatibility:

```lua
if not os.fscase() then
    -- On case-insensitive systems, avoid using filenames that differ only in case
    print("Warning: Filesystem is case-insensitive")
end
```

## os.term

- Get current terminal (windows-terminal, vscode, ... )

```lua
print(os.term())
-- got vscode
```

## os.shell

- Get current shell  (pwsh, cmd, ...)

```lua
print(os.shell())
-- got pwsh
```

## os.cpuinfo

- Get cpu information

```lua
print(os.cpuinfo())
-- got {
--   ncpu = 8,
--   usagerate = 0.0,
--   model_name = "Intel(R) Core(TM) i7-7700 CPU @ 3.60GHz",
--   march = "Kaby Lake",
--   vendor = "GenuineIntel",
--   model = 158,
--   family = 6
-- }
print(os.cpuinfo("march")) -- got "Kaby Lake"
```

## os.meminfo

- Get memory information

```lua
print(os.meminfo())
-- got {
--   usagerate = 0.53490080822924,
--   totalsize = 16332,
--   availsize = 7596,
--   pagesize = 4096
-- }
```

## os.default_njob

- Get default parallel jobs

Returns the default number of parallel compilation jobs, typically equal to the number of CPU cores.

```lua
local njob = os.default_njob()
print("Default parallel jobs:", njob)
```

## os.argv

- Parse command line string into argument list

```lua
local args = os.argv("gcc -o test test.c -I/usr/include")
```

Parses a command line string into an argument array, supporting quotes, escape characters, and other complex formats.

Parsing rules:
- Supports double quotes and single quotes for wrapping arguments
- Supports escape characters (`\`)
- Automatically handles space separation
- Handles special characters like parentheses, backslashes, etc.

Examples:

```lua
-- Simple arguments
os.argv("aa bb cc")  -- Returns: {"aa", "bb", "cc"}

-- Arguments with quotes
os.argv('"aa bb cc" dd')  -- Returns: {"aa bb cc", "dd"}

-- Arguments with equals
os.argv("--bb=bbb -c")  -- Returns: {"--bb=bbb", "-c"}

-- Escaped quotes
os.argv('-DTEST=\\"hello\\"')  -- Returns: {'-DTEST="hello"'}

-- Complex arguments
os.argv('-DTEST="hello world"')  -- Returns: {'-DTEST=hello world'}
```

Supports `splitonly` option to only split without processing quotes:

```lua
os.argv('-DTEST="hello world"', {splitonly = true})  -- Returns: {'-DTEST="hello world"'}
```

## os.args

- Convert argument list to command line string

```lua
local cmdline = os.args({"gcc", "-o", "test", "test.c"})
```

Converts an argument array to a command line string, the inverse operation of [os.argv](#os-argv).

Automatically handles special characters:
- Arguments containing spaces are automatically quoted
- Automatically escapes special characters
- Handles backslashes in paths

Examples:

```lua
-- Simple arguments
os.args({"aa", "bb", "cc"})  -- Returns: "aa bb cc"

-- Arguments with spaces
os.args({"aa bb cc", "dd"})  -- Returns: '"aa bb cc" dd'

-- Arguments with quotes
os.args({'-DTEST="hello"'})  -- Returns: '-DTEST=\\"hello\\"'

-- Path arguments
os.args({"aa\\bb/cc dd", "ee"})  -- Returns: '"aa\\\\bb/cc dd" ee'
```

Supports `escape` option to enable additional escaping:

```lua
os.args({"aa\\bb/cc", "dd"}, {escape = true})  -- Returns: "aa\\\\bb/cc dd"
```

Round-trip conversion with `os.argv`:

```lua
local cmdline = "gcc -o test test.c"
local args = os.argv(cmdline)
local cmdline2 = os.args(args)
-- cmdline2 should be equivalent to cmdline
```

## os.mclock

- Get monotonic clock time (milliseconds)

```lua
local start = os.mclock()
-- Perform some operations
local elapsed = os.mclock() - start
print("Elapsed:", elapsed, "ms")
```

Returns a monotonically increasing timestamp (milliseconds), suitable for measuring time intervals.

Unlike `os.clock()`, `os.mclock()` returns a monotonic clock that is not affected by system time adjustments, making it more suitable for performance measurement:

```lua
local function benchmark(func)
    local start = os.mclock()
    func()
    local elapsed = os.mclock() - start
    print(string.format("Execution time: %.2f ms", elapsed))
end

benchmark(function()
    os.sleep(100)
end)
```
