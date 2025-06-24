
# core.project.config

Used to get the configuration information when the project is compiled, that is, the value of the parameter option passed in `xmake f|config --xxx=val`.

## config.get

- Get the specified configuration value

Used to get the configuration value of `xmake f|config --xxx=val`, for example:

```lua
target("test")
    on_run(function (target)

        -- Import configuration module
        import("core.project.config")

        -- Get configuration values
        print(config.get("xxx"))
    end)
```

## config.load

- Load configuration

Generally used in plug-in development, the plug-in task is not like the custom script of the project, the environment needs to be initialized
and loaded by itself, the default project configuration is not loaded, if you want to use [config.get](#config-get) interface to get the project Configuration, then you need to:

```lua

-- Import configuration module
import("core.project.config")

function main(...)

    -- Load project configuration first
    config.load()

    -- Get configuration values
    print(config.get("xxx"))
end
```

## config.arch

- Get the schema configuration of the current project

That is to get the platform configuration of `xmake f|config --arch=armv7`, which is equivalent to `config.get("arch")`.

## config.plat

- Get the platform configuration of the current project

That is to get the platform configuration of `xmake f|config --plat=iphoneos`, which is equivalent to `config.get("plat")`.

## config.mode

- Get the compilation mode configuration of the current project

That is to get the platform configuration of `xmake f|config --mode=debug`, which is equivalent to `config.get("mode")`.

## config.builddir

- Get the output directory configuration of the current project

That is to get the platform configuration of `xmake f|config -o /tmp/output`, which is equivalent to `config.get("builddir")`.

## config.directory

- Get the configuration information directory of the current project

Get the storage directory of the project configuration, the default is: `projectdir/.config`

## config.dump

- Print out all configuration information of the current project

The output is for example:

```lua
{
    sh = "xcrun -sdk macosx clang++",
    xcode_dir = "/Applications/Xcode.app",
    ar = "xcrun -sdk macosx ar",
    small = true,
    object = false,
    arch = "x86_64",
    xcode_sdkver = "10.12",
    ex = "xcrun -sdk macosx ar",
    cc = "xcrun -sdk macosx clang",
    rc = "rustc",
    plat = "macosx",
    micro = false,
    host = "macosx",
    as = "xcrun -sdk macosx clang",
    dc = "dmd",
    gc = "go",
    openssl = false,
    ccache = "ccache",
    cxx = "xcrun -sdk macosx clang",
    sc = "xcrun -sdk macosx swiftc",
    mm = "xcrun -sdk macosx clang",
    builddir = "build",
    mxx = "xcrun -sdk macosx clang++",
    ld = "xcrun -sdk macosx clang++",
    mode = "release",
    kind = "static"
}
```
