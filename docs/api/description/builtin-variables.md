# Builtin Variables

Xmake provides the syntax of `$(varname)` to support the acquisition of built-in variables, for example:

```lua
add_cxflags("-I$(builddir)")
```

It will convert the built-in `builddir` variable to the actual build output directory when compiling: `-I./build`

General built-in variables can be used to quickly get and splicing variable strings when passing arguments, for example:

```lua
target("test")

    -- Add source files in the project source directory
    add_files("$(projectdir)/src/*.c")

    -- Add a header file search path under the build directory
    add_includedirs("$(builddir)/inc")
```

It can also be used in the module interface of a custom script, for example:

```lua
target("test")
    on_run(function (target)
        -- Copy the header file in the current script directory to the output directory
        os.cp("$(scriptdir)/xxx.h", "$(builddir)/inc")
    end)
```

This way of using built-in variables makes the description writing more concise and easy to read.

Of course, this variable mode can also be extended. By default, the `xmake f --var=val` command can be used to directly obtain the parameters. For example:

```lua
target("test")
    add_defines("-DTEST=$(var)")
```

::: tip NOTE
All the parameter values of the `xmake f --xxx=...` configuration can be obtained through built-in variables, for example: `xmake f --arch=x86` corresponds to `$(arch)`, others have ` $(plat)`, `$(mode)` and so on.
What are the specific parameters, you can check it out by `xmake f -h`.
:::

Since the support is directly obtained from the configuration options, it is of course convenient to extend the custom options to get the custom variables.
For details on how to customize the options, see: [option](/api/description/configuration-option)

## var.$(os)

- Get the operating system of the current build platform

If iphoneos is currently compiled, then this value is: `ios`, and so on.

## var.$(host)

- Get the native operating system

Refers to the host system of the current native environment, if you compile on macOS, then the system is: `macosx`

## var.$(tmpdir)

- Getting a temporary directory

Generally used to temporarily store some non-permanent files.

## var.$(curdir)

- Get the current directory

The default is the project root directory when the `xmake` command is executed. Of course, if the directory is changed by [os.cd](/api/scripts/builtin-modules/os#os-cd), this value will also change.

## var.$(builddir)

- Get the current build output directory

The default is usually the `./build` directory in the current project root directory. You can also modify the default output directory by executing the `xmake f -o /tmp/build` command.

## var.$(scriptdir)

- Get the directory of the current project description script

That is, the directory path corresponding to `xmake.lua`.

## var.$(globaldir)

- Global Configuration Directory

Xmake's `xmake g|global` global configuration command, directory path for data storage, where you can place some of your own plugins and platform scripts.

The default is: `~/.config`

## var.$(configdir)

- Current project configuration directory

The current project configuration storage directory, which is the storage directory of the `xmake f|config` configuration command, defaults to: `projectdir/.config`

## var.$(programdir)

- xmake installation script directory

That is, the directory where the `XMAKE_PROGRAM_DIR` environment variable is located. We can also modify the xmake load script by setting this environment amount to implement version switching.

## var.$(projectdir)

- Project root directory

That is, the directory path specified in the `xmake -P xxx` command, the default is not specified is the current directory when the `xmake` command is executed, which is generally used to locate the project file.

## var.$(shell)

- Executing external shell commands

In addition to the built-in variable handling, xmake also supports the native shell to handle some of the features that xmake does not support.

For example, there is a need now, I want to use the `pkg-config` to get the actual third-party link library name when compiling the Linux program, you can do this:

```lua
target("test")
    set_kind("binary")
    if is_plat("linux") then
        add_ldflags("$(shell pkg-config --libs sqlite3)")
    end
```

Of course, xmake has its own automated third library detection mechanism, which generally does not need such trouble, and lua's own scripting is very good. .

But this example shows that xmake can be used with some third-party tools through the native shell. .

## var.$(env)

- Get external environment variables

For example, you can get the path in the environment variable:

```lua
target("test")
    add_includedirs("$(env PROGRAMFILES)/OpenSSL/inc")
```

## var.$(reg)

- Get the value of the windows registry configuration item

Get the value of an item in the registry by `regpath; name`:

```lua
print("$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name)")
```
