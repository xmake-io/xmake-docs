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

## os.isexec

- Test if a file is executable

```lua
if os.isexec("path/to/file.exe") then
    os.run("path/to/file.exe")
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

Used to get a temporary file path, just a path, the file needs to be created by itself.

## os.curdir

- Get the current directory path

Consistent with the result of [$(curdir)](/api/description/builtin-variables#var-curdir), it is just a direct return to return a variable that can be maintained with subsequent strings.

Usage reference: [os.tmpdir](#os-tmpdir).

## os.filesize

- Get file size

```lua
print(os.filesize("/tmp/a"))
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

## os.projectdir

- Get the project home directory

Consistent with the result of [$(projectdir)](/api/description/builtin-variables#var-projectdir), it is just a direct return to return a variable that can be maintained with subsequent strings.

## os.arch

- Get current system architecture

That is the default architecture of the current host system, for example, I execute xmake on `linux x86_64` to build, then the return value is: `x86_64`

## os.host

- Get the operating system of the current host

Consistent with the result of [$(host)](/api/description/builtin-variables#var-host), for example, if I execute xmake on `linux x86_64` to build, the return value is: `linux`

## os.subhost

- Get Subsystem host, e.g. msys, cygwin on windows

## os.subarch

- Get Subsystem host architecture

## os.is_host

- Test if a given host is the current

## os.is_arch

- Test if a given arch is the current

## os.is_subhost

- Test if a given sub host is the current

## os.is_subarch

- Test if a given sub arch is the current

## os.ln

- Create a symlink to a file or directory

```lua
-- creates a symlink file "xxx.txt.ln" which is pointing to "xxx.txt"
os.ln("xxx.txt", "xxx.txt.ln")
```

## os.readlink

- Read the content of a symlink

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
print(os.getenv("PATH"))
```

## os.setenv

- Set system environment variables

```lua
os.setenv("HOME", "/tmp/")
```

## os.addenv

- Add values to one environment variable

```lua
-- Add 'bin' to PATH
os.addenv("PATH", "bin")
```

## os.setenvp

- Setting environment variables with a given separator

## os.addenvp

- Add values to one environment variable with a given separator

## os.workingdir

- Get the working directory

## os.isroot

- Test if xmake is running as root

## os.fscase

- Test if the os has a case sensitive filesystem

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

- Get default paralled jobs
