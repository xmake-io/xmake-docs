

## Generate IDE Project Files

### Generate Makefile

```bash
$ xmake project -k makefile
```

### Generate CMakelists.txt

```console
$ xmake project -k cmakelists
```

### Generate build.ninja

!> Only supported in versions above 2.3.1

```console
$ xmake project -k ninja
```

### Generate compiler_flags

```console
$ xmake project -k compiler_flags
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

### Generate Xcode project file

At present, we have no time to implement the generation of xcode projects by ourselves, but it does not mean that it is not supported, because xmake supports the generation of cmakelists.txt files, and cmake supports the generation of xcode project files. Before the official implementation,
We can also support it in disguise through cmake, xmake will automatically call cmake internally to transfer the generated results, there is no difference in use for users, just make sure that cmake has been installed:

```console
$ xmake project -k xcode
```

!> After we have time, we will re-implement each more complete xcode output plugin by ourselves, and welcome everyone to contribute.

### Generate VisualStudio Project

#### Compile with xmake integration

v2.2.8 or later, provides a new version of the vs project generation plugin extension, which is very different from the previous plugin processing mode for generating vs. The previously generated vs project is the compilation of all files and then transferred to vs. To handle compilation.

But this mode, there is no way to support the rules of xmake. Because xmake's rules use a lot of custom scripts like `on_build`, they can't be expanded, so projects like qt, wdk can't support exporting to vs. compile.

Therefore, in order to solve this problem, the new version of the vs. build plugin performs the compile operation by directly calling the xmake command under vs, and also supports intellisense and definition jumps, as well as breakpoint debugging.

The specific use is similar to the old version:

```console
$ xmake project -k [vsxmake2010|vsxmake2013|vsxmake2015|..] -m "debug;release"
```

If no version is specified, xmake will automatically detect the current version of vs to generate:

```bash
$ xmake project -k vsxmake -m "debug,release"
```

![](/assets/img/manual/qt_vs.png)

In addition, the vsxmake plugin will additionally generate a custom configuration property page for easy and flexible modification and appending some xmake compilation configuration in the vs., and even switch to other cross toolchains in the configuration to achieve the vs. vs. Cross-compilation of other platforms such as android, linux.

![](/assets/img/manual/property_page_vsxmake.png)

The v2.5.1 version provides a `add_rules("plugin.vsxmake.autoupdate")` rule. If this rule is applied, the production vs project will be checked for changes in xmake.lua and the code file list after the compilation is completed. If there are changes , The vs project will be updated automatically.

```lua
add_rules("plugin.vsxmake.autoupdate")
target("test")
     set_kind("binary")
     add_files("src/*.c")
```

In addition, we can group each target through the `set_group` interface, so that the generated vs project can be grouped according to the specified structure. For more details, please see: [issue 1026](https://github.com/xmake-io/xmake/issues/1026)

#### Using vs built-in compilation mechanism

!> It is recommended to use the new version of the vs. plugin provided after v2.2.8 mentioned above. The support is more complete. The generation method here does not support the rules of xmake, and the generation of projects such as qt.

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

In addition, we can group each target through the `set_group` interface, so that the generated vs project can be grouped according to the specified structure. For more details, please see: [issue 1026](https://github.com/xmake-io/xmake/issues/1026)

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

## Show specified information and list

### Show basic information about xmake itself and the current project

```bash
$ xmake show
The information of xmake:
    version: 2.3.3+202006011009
    host: macosx/x86_64
    programdir: /Users/ruki/.local/share/xmake
    programfile: /Users/ruki/.local/bin/xmake
    globaldir: /Users/ruki/.xmake
    tmpdir: /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/200603
    workingdir: /Users/ruki/projects/personal/tbox
    packagedir: /Users/ruki/.xmake/packages
    packagedir(cache): /Users/ruki/.xmake/cache/packages/2006

The information of project: tbox
    version: 1.6.5
    plat: macosx
    arch: x86_64
    mode: release
    buildir: build
    configdir: /Users/ruki/projects/personal/tbox/.xmake/macosx/x86_64
    projectdir: /Users/ruki/projects/personal/tbox
    projectfile: /Users/ruki/projects/personal/tbox/xmake.lua
```

### Show toolchains list

```bash
$ xmake show -l toolchains
xcode         Xcode IDE
vs            VisualStudio IDE
yasm          The Yasm Modular Assembler
clang         A C language family frontend for LLVM
go            Go Programming Language Compiler
dlang         D Programming Language Compiler
sdcc          Small Device C Compiler
cuda          CUDA Toolkit
ndk           Android NDK
rust          Rust Programming Language Compiler
llvm          A collection of modular and reusable compiler and toolchain technologies
cross         Common cross compilation toolchain
nasm          NASM Assembler
gcc           GNU Compiler Collection
mingw         Minimalist GNU for Windows
gnu-rm        GNU Arm Embedded Toolchain
envs          Environment variables toolchain
fasm          Flat Assembler
```

### Show the information of the given target

```bash
$ xmake show --target=tbox
The information of target(tbox):
    kind: static
    targetfile: build/macosx/x86_64/release/libtbox.a
    rules: mode.release, mode.debug, mode.profile, mode.coverage
    options: info, float, wchar, exception, force-utf8, deprecated, xml, zip, hash, regex, coroutine, object, charset, database
    packages: mbedtls, polarssl, openssl, pcre2, pcre, zlib, mysql, sqlite3
    links: pthread
    syslinks: pthread, dl, m, c
    cxflags: -Wno-error=deprecated-declarations, -fno-strict-aliasing, -Wno-error=expansion-to-defined, -fno-stack-protector
    defines: __tb_small__, __tb_prefix__="tbox"
    mxflags: -Wno-error=deprecated-declarations, -fno-strict-aliasing, -Wno-error=expansion-to-defined
    headerfiles: src/(tbox/**.h)|**/impl/**.h, src/(tbox/prefix/**/prefix.S), src/(tbox/math/impl/*.h), src/(tbox/utils/impl/*.h), build/macosx/x86_64/release/tbox.config.h
    includedirs: src, build/macosx/x86_64/release
    at: /Users/ruki/projects/personal/tbox/src/tbox/xmake.lua
    sourcebatch(cc): with rule(c.build)
      -> src/tbox/string/static_string.c
         -> build/.objs/tbox/macosx/x86_64/release/src/tbox/string/static_string.c.o
         -> build/.deps/tbox/macosx/x86_64/release/src/tbox/string/static_string.c.o.d
      -> src/tbox/platform/sched.c
         -> build/.objs/tbox/macosx/x86_64/release/src/tbox/platform/sched.c.o
         -> build/.deps/tbox/macosx/x86_64/release/src/tbox/platform/sched.c.o.d
      -> src/tbox/stream/stream.c
         -> build/.objs/tbox/macosx/x86_64/release/src/tbox/stream/stream.c.o
         -> build/.deps/tbox/macosx/x86_64/release/src/tbox/stream/stream.c.o.d
      -> src/tbox/utils/base32.c
         -> build/.objs/tbox/macosx/x86_64/release/src/tbox/utils/base32.c.o
         -> build/.deps/tbox/macosx/x86_64/release/src/tbox/utils/base32.c.o.d
```

### Show builtin compilation modes list

```bash
$ xmake show -l buildmodes
```

### Show builtin compilation rules list

```bash
$ xmake show -l rules
```

### Show other information

It is still being perfected, see: https://github.com/xmake-io/xmake/issues/798

Or run

```bash
$ xmake show --help
```

## Macros Recording and Playback 

### Introduction

We can record and playback our xmake commands and save as macro quickly using this plugin.

And we can run this macro to simplify our jobs repeatably.

### Record Commands

```bash
# begin to record commands
$ xmake macro --begin

# run some xmake commands
$ xmake f -p android --ndk=/xxx/ndk -a arm64-v8a
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
    os.exec("xmake f -p android --ndk=/xxx/ndk -a arm64-v8a")
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
        os.exec("xmake f -p %s -a %s %s -c %s", plat, arch, args.config or "", (option.get("verbose") and "-v" or ""))

        -- package it
        if args.outputdir then
            os.exec("xmake p -o %s %s", args.outputdir, (option.get("verbose") and "-v" or ""))
        else
            os.exec("xmake p %s", (option.get("verbose") and "-v" or ""))
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

## Generate Doxygen Document

Please ensure that the doxygen tool has been installed first.

```bash
$ xmake doxygen
```

