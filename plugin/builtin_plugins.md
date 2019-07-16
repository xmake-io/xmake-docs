
## Macros Recording and Playback 

### Introduction

We can record and playback our xmake commands and save as macro quickly using this plugin.

And we can run this macro to simplify our jobs repeatly.

### Record Commands

```bash
# begin to record commands
$ xmake macro --begin

# run some xmake commands
$ xmake f -p android --ndk=/xxx/ndk -a armv7-a
$ xmake p
$ xmake f -p mingw --sdk=/mingwsdk
$ xmake p
$ xmake f -p linux --sdk=/toolsdk --toolchains=/xxxx/bin
$ xmake p
$ xmake f -p iphoneos -a armv7
$ xmake p
$ xmake f -p iphoneos -a arm64
$ xmake p
$ xmake f -p iphoneos -a armv7s
$ xmake p
$ xmake f -p iphoneos -a i386
$ xmake p
$ xmake f -p iphoneos -a x86_64
$ xmake p

# stop to record and  save as anonymous macro
xmake macro --end 
```

### Playback Macro

```bash
# playback the previous anonymous macro
$ xmake macro .
```

### Named Macro

```bash
$ xmake macro --begin
$ ...
$ xmake macro --end macroname
$ xmake macro macroname
```

### Import and Export Macro

Import the given macro file or directory.

```bash
$ xmake macro --import=/xxx/macro.lua macroname
$ xmake macro --import=/xxx/macrodir
```

Export the given macro to file or directory.

```bash
$ xmake macro --export=/xxx/macro.lua macroname
$ xmake macro --export=/xxx/macrodir
```

### List and Show Macro

List all builtin macros.

```bash
$ xmake macro --list
```

Show the given macro script content.

```bash
$ xmake macro --show macroname
```

### Custom Macro Script

Create and write a `macro.lua` script first.

```lua
function main()
    os.exec("xmake f -p android --ndk=/xxx/ndk -a armv7-a")
    os.exec("xmake p")
    os.exec("xmake f -p mingw --sdk=/mingwsdk")
    os.exec("xmake p")
    os.exec("xmake f -p linux --sdk=/toolsdk --toolchains=/xxxx/bin")
    os.exec("xmake p")
    os.exec("xmake f -p iphoneos -a armv7")
    os.exec("xmake p")
    os.exec("xmake f -p iphoneos -a arm64")
    os.exec("xmake p")
    os.exec("xmake f -p iphoneos -a armv7s")
    os.exec("xmake p")
    os.exec("xmake f -p iphoneos -a i386")
    os.exec("xmake p")
    os.exec("xmake f -p iphoneos -a x86_64")
    os.exec("xmake p")  
end
```

Import this macro script to xmake.

```bash
$ xmake macro --import=/xxx/macro.lua [macroname]
```

Playback this macro script.

```bash
$ xmake macro [.|macroname]
```

### Builtin Macros

XMake supports some builtins macros to simplify our jobs.

For example, we use `package` macro to package all architectures of the iphoneos platform just for once.

```bash
$ xmake macro package -p iphoneos 
```

### Advance Macro Script

Let's see the `package` macro script:

```lua
-- imports
import("core.base.option")
import("core.project.config")
import("core.project.project")
import("core.platform.platform")

-- the options
local options =
{
    {'p', "plat",       "kv",  os.host(),   "Set the platform."                                    }
,   {'f', "config",     "kv",  nil,         "Pass the config arguments to \"xmake config\" .."     }
,   {'o', "outputdir",  "kv",  nil,         "Set the output directory of the package."             }
}

-- package all
--
-- .e.g
-- xmake m package 
-- xmake m package -f "-m debug"
-- xmake m package -p linux
-- xmake m package -p iphoneos -f "-m debug --xxx ..." -o /tmp/xxx
-- xmake m package -f \"--mode=debug\"
--
function main(argv)

    -- parse arguments
    local args = option.parse(argv, options, "Package all architectures for the given the platform."
                                           , ""
                                           , "Usage: xmake macro package [options]")

    -- package all archs
    local plat = args.plat
    for _, arch in ipairs(platform.archs(plat)) do

        -- config it
        os.exec("xmake f -p %s -a %s %s -c %s", plat, arch, args.config or "", ifelse(option.get("verbose"), "-v", ""))

        -- package it
        if args.outputdir then
            os.exec("xmake p -o %s %s", args.outputdir, ifelse(option.get("verbose"), "-v", ""))
        else
            os.exec("xmake p %s", ifelse(option.get("verbose"), "-v", ""))
        end
    end

    -- package universal for iphoneos, watchos ...
    if plat == "iphoneos" or plat == "watchos" then

        -- load configure
        config.load()

        -- load project
        project.load()

        -- enter the project directory
        os.cd(project.directory())

        -- the outputdir directory
        local outputdir = args.outputdir or config.get("buildir")

        -- package all targets
        for _, target in pairs(project.targets()) do

            -- get all modes
            local modedirs = os.match(format("%s/%s.pkg/lib/*", outputdir, target:name()), true)
            for _, modedir in ipairs(modedirs) do
                
                -- get mode
                local mode = path.basename(modedir)

                -- make lipo arguments
                local lipoargs = nil
                for _, arch in ipairs(platform.archs(plat)) do
                    local archfile = format("%s/%s.pkg/lib/%s/%s/%s/%s", outputdir, target:name(), mode, plat, arch, path.filename(target:targetfile())) 
                    if os.isfile(archfile) then
                        lipoargs = format("%s -arch %s %s", lipoargs or "", arch, archfile) 
                    end
                end
                if lipoargs then

                    -- make full lipo arguments
                    lipoargs = format("-create %s -output %s/%s.pkg/lib/%s/%s/universal/%s", lipoargs, outputdir, target:name(), mode, plat, path.filename(target:targetfile()))

                    -- make universal directory
                    os.mkdir(format("%s/%s.pkg/lib/%s/%s/universal", outputdir, target:name(), mode, plat))

                    -- package all archs
                    os.execv("xmake", {"l", "lipo", lipoargs})
                end
            end
        end
    end
end
```

<p class="tip">
    If you want to known more options, please run: `xmake macro --help`
</p>

## Run the Custom Lua Script

### Run the given script

Write a simple lua script:

```lua
function main()
    print("hello xmake!")
end
```

Run this lua script.

```bash
$ xmake lua /tmp/test.lua
```

<p class="tip">
    You can also use `import` api to write a more advance lua script. 
</p>

### Run the builtin script

You can run `xmake lua -l` to list all builtin script name, for example:

```bash
$ xmake lua -l
scripts:
    cat
    cp
    echo
    versioninfo
    ...
```

And run them:

```bash
$ xmake lua cat ~/file.txt
$ xmake lua echo "hello xmake"
$ xmake lua cp /tmp/file /tmp/file2
$ xmake lua versioninfo
```

### Run interactive commands (REPL) 

Enter interactive mode:

```bash
$ xmake lua
> 1 + 2
3

> a = 1
> a
1

> for _, v in pairs({1, 2, 3}) do
>> print(v)
>> end
1
2
3
```

And we can `import` modules:

```bash
> task = import("core.project.task")
> task.run("hello")
hello xmake!
```

If you want to cancel multiline input, please input character `q`, for example:

```bash
> for _, v in ipairs({1, 2}) do
>> print(v)
>> q             <--  cancel multiline and clear previous input
> 1 + 2
3
```

## Generate IDE Project Files

### Generate Makefile

```bash
$ xmake project -k makefile
```

### Generate compiler_commands

We can export the compilation commands info of all source files and it is JSON compilation database format.

```console
$ xmake project -k compile_commands
```

The the content of the output file:

```
[
  { "directory": "/home/user/llvm/build",
    "command": "/usr/bin/clang++ -Irelative -DSOMEDEF=\"With spaces, quotes and \\-es.\" -c -o file.o file.cc",
    "file": "file.cc" },
  ...
]

```

Please see [JSONCompilationDatabase](#https://clang.llvm.org/docs/JSONCompilationDatabase.html) if need known more info about `compile_commands`.

### Generate VisualStudio Project

#### Compile with xmake integration

v2.2.8 or later, provides a new version of the vs project generation plugin extension, which is very different from the previous plugin processing mode for generating vs. The previously generated vs project is the compilation of all files and then transferred to vs. To handle compilation.

But this mode, there is no way to support the rules of xmake. Because xmake's rules use a lot of custom scripts like `on_build`, they can't be expanded, so projects like qt, wdk can't support exporting to vs. compile.

Therefore, in order to solve this problem, the new version of the vs. build plugin performs the compile operation by directly calling the xmake command under vs, and also supports intellsence and definition jumps, as well as breakpoint debugging.

The specific use is similar to the old version:

```console
$ xmake project -k [vsxmake2010|vsxmake2013|vsxmake2015|..] -m "debug,release"
```

![](/assets/img/manual/qt_vs.png)

#### Using vs built-in compilation mechanism

>! It is recommended to use the new version of the vs. plugin provided after v2.2.8 mentioned above. The support is more complete. The generation method here does not support the rules of xmake, and the generation of projects such as qt.

```bash
$ xmake project -k [vs2008|vs2013|vs2015|..]
```

v2.1.2 or later, it supports multi-mode and multi-architecture generation for vs201x project.

For example:

```bash
$ xmake project -k vs2017 -m "debug,release"
```

It will generate four project configurations: `debug|x86`, `debug|x64`, `release|x86`, `release|x64`.

Or you can set modes to `xmake.lua`:

```lua
set_modes("debug", "release")
```

Then, we run the following command:

```bash
$ xmake project -k vs2017
```

The effect is same.

## Generate Doxygen Document

Please ensure that the doxygen tool has been installed first.

```bash
$ xmake doxygen
```

