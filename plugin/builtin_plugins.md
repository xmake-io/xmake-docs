

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

We can use it to quickly trace the location of some specific configurations.

```bash
$ xmake show -t tbox
The information of target(tbox):
    at: /Users/ruki/projects/personal/tbox/src/tbox/xmake.lua
    kind: static
    targetfile: build/macosx/x86_64/release/libtbox.a
    rules:
      -> mode.release -> ./xmake.lua:26
      -> mode.debug -> ./xmake.lua:26
      -> mode.profile -> ./xmake.lua:26
      -> mode.coverage -> ./xmake.lua:26
      -> utils.install.cmake_importfiles -> ./src/tbox/xmake.lua:15
      -> utils.install.pkgconfig_importfiles -> ./src/tbox/xmake.lua:16
    options:
      -> info -> ./src/tbox/xmake.lua:50
      -> float -> ./src/tbox/xmake.lua:50
      -> wchar -> ./src/tbox/xmake.lua:50
      -> exception -> ./src/tbox/xmake.lua:50
      -> force-utf8 -> ./src/tbox/xmake.lua:50
      -> deprecated -> ./src/tbox/xmake.lua:50
      -> xml -> ./src/tbox/xmake.lua:53
      -> zip -> ./src/tbox/xmake.lua:53
      -> hash -> ./src/tbox/xmake.lua:53
      -> regex -> ./src/tbox/xmake.lua:53
      -> coroutine -> ./src/tbox/xmake.lua:53
      -> object -> ./src/tbox/xmake.lua:53
      -> charset -> ./src/tbox/xmake.lua:53
      -> database -> ./src/tbox/xmake.lua:53
    packages:
      -> mbedtls -> ./src/tbox/xmake.lua:43
      -> polarssl -> ./src/tbox/xmake.lua:43
      -> openssl -> ./src/tbox/xmake.lua:43
      -> pcre2 -> ./src/tbox/xmake.lua:43
      -> pcre -> ./src/tbox/xmake.lua:43
      -> zlib -> ./src/tbox/xmake.lua:43
      -> mysql -> ./src/tbox/xmake.lua:43
      -> sqlite3 -> ./src/tbox/xmake.lua:43
    links:
      -> pthread -> option(__keyword_thread_local) -> @programdir/includes/check_csnippets.lua:100
    syslinks:
      -> pthread -> ./xmake.lua:71
      -> dl -> ./xmake.lua:71
      -> m -> ./xmake.lua:71
      -> c -> ./xmake.lua:71
    defines:
      -> __tb_small__ -> ./xmake.lua:42
      -> __tb_prefix__="tbox" -> ./src/tbox/xmake.lua:19
      -> _GNU_SOURCE=1 -> option(__systemv_semget) -> @programdir/includes/check_cfuncs.lua:104
    cxflags:
      -> -Wno-error=deprecated-declarations -> ./xmake.lua:22
      -> -fno-strict-aliasing -> ./xmake.lua:22
      -> -Wno-error=expansion-to-defined -> ./xmake.lua:22
      -> -fno-stack-protector -> ./xmake.lua:51
    frameworks:
      -> CoreFoundation -> ./src/tbox/xmake.lua:38
      -> CoreServices -> ./src/tbox/xmake.lua:38
    mxflags:
      -> -Wno-error=deprecated-declarations -> ./xmake.lua:23
      -> -fno-strict-aliasing -> ./xmake.lua:23
      -> -Wno-error=expansion-to-defined -> ./xmake.lua:23
    includedirs:
      -> src -> ./src/tbox/xmake.lua:26
      -> build/macosx/x86_64/release -> ./src/tbox/xmake.lua:27
    headerfiles:
      -> src/(tbox/**.h)|**/impl/**.h -> ./src/tbox/xmake.lua:30
      -> src/(tbox/prefix/**/prefix.S) -> ./src/tbox/xmake.lua:31
      -> src/(tbox/math/impl/*.h) -> ./src/tbox/xmake.lua:32
      -> src/(tbox/utils/impl/*.h) -> ./src/tbox/xmake.lua:33
      -> build/macosx/x86_64/release/tbox.config.h -> ./src/tbox/xmake.lua:34
    files:
      -> src/tbox/*.c -> ./src/tbox/xmake.lua:56
      -> src/tbox/hash/bkdr.c -> ./src/tbox/xmake.lua:57
      -> src/tbox/hash/fnv32.c -> ./src/tbox/xmake.lua:57
      -> src/tbox/hash/adler32.c -> ./src/tbox/xmake.lua:57
      -> src/tbox/math/**.c -> ./src/tbox/xmake.lua:58
      -> src/tbox/libc/**.c|string/impl/**.c -> ./src/tbox/xmake.lua:59
      -> src/tbox/utils/*.c|option.c -> ./src/tbox/xmake.lua:60
      -> src/tbox/prefix/**.c -> ./src/tbox/xmake.lua:61
      -> src/tbox/memory/**.c -> ./src/tbox/xmake.lua:62
      -> src/tbox/string/**.c -> ./src/tbox/xmake.lua:63
      -> src/tbox/stream/**.c|**/charset.c|**/zip.c -> ./src/tbox/xmake.lua:64
      -> src/tbox/network/**.c|impl/ssl/*.c -> ./src/tbox/xmake.lua:65
      -> src/tbox/algorithm/**.c -> ./src/tbox/xmake.lua:66
      -> src/tbox/container/**.c|element/obj.c -> ./src/tbox/xmake.lua:67
      -> src/tbox/libm/impl/libm.c -> ./src/tbox/xmake.lua:68
      -> src/tbox/libm/idivi8.c -> ./src/tbox/xmake.lua:73
      -> src/tbox/libm/ilog2i.c -> ./src/tbox/xmake.lua:70
      -> src/tbox/libm/isqrti.c -> ./src/tbox/xmake.lua:71
      -> src/tbox/libm/isqrti64.c -> ./src/tbox/xmake.lua:72
      -> src/tbox/platform/*.c|context.c|exception.c -> ./src/tbox/xmake.lua:74
      -> src/tbox/platform/impl/*.c|charset.c|poller_fwatcher.c -> ./src/tbox/xmake.lua:74
      -> src/tbox/libm/*.c -> ./src/tbox/xmake.lua:77
    compiler (cc): /usr/bin/xcrun -sdk macosx clang
      -> -Qunused-arguments -target x86_64-apple-macos12.6 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX13.0.sdk
    linker (ar): /usr/bin/xcrun -sdk macosx ar
      -> -cr
    compflags (cc):
      -> -Qunused-arguments -target x86_64-apple-macos12.6 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX13.0.sdk -Wall -Werror -Oz -std=c99 -Isrc -Ibuild/macosx/x86_64/release -D__tb_small__ -D__tb_prefix__=\"tbox\" -D_GNU_SOURCE=1 -framework CoreFoundation -framework CoreServices -Wno-error=deprecated-declarations -fno-strict-aliasing -Wno-error=expansion-to-defined -fno-stack-protector
    linkflags (ar):
      -> -cr
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

## Watching for file updates

New in v2.7.1 is the `xmake watch` plugin command, which can automatically monitor project files for updates and then trigger an automatic build or run some custom commands.

This is often used for personal development to enable fast, real-time incremental builds without the need to manually execute the build command each time, improving development efficiency.

### Build automatically after a project update

The default behaviour is to monitor the entire project root directory and any file changes will trigger an incremental build of the project.

```bash
$ xmake watch
watching /private/tmp/test/src/** .
watching /private/tmp/test/* ...
/private/tmp/test/src/main.cpp modified
[ 25%]: cache compiling.release src/main.cpp
[ 50%]: linking.release test
[ 100%]: build ok!
```''

### Monitoring a specific directory

We can also monitor specific code directories to narrow down the scope of monitoring and improve performance.

```bash
$ xmake watch -d src
$ xmake watch -d "src;tests/*"
```

The above command will recursively watch all subdirectories. If you want to keep a tight watch on the files in the current directory and not do recursive monitoring, you can use the following command.

```bash
$ xmake watch -p src
$ xmake watch -p "src;tests/*"
```

### Watch and run the specified command

If you want to run the build automatically even after the automatic build, we can use a custom command set.

```bash
$ xmake watch -c "xmake; xmake run"
```

The above list of commands is passed as a string, which is not flexible enough for complex command arguments that need to be escaped rather tediously, so we can use the following for arbitrary commands.

```bash
$ xmake watch -- echo hello xmake!
$ xmake watch -- xmake run --help
```

### Watching and running the target program

Although we can automate the running of the target program with custom commands, we also provide more convenient arguments to achieve this behaviour.

```bash
$ xmake watch -r
$ xmake watch --run
[100%]: build ok!
hello world!
```

### Watching and running lua scripts

We can also watch for file updates and then run the specified lua script for more flexible and complex command customisation.

```bash
$ xmake watch -s /tmp/test.lua
```

We can also get a list of all updated file paths and events in the script again.

```lua
function main(events)
    -- TODO handle events
end
```

## Check project configurations and codes

### Check project configuration

#### Check all api values in xmake.lua by default

```lua
set_lanuages("c91") -- typo
```

```console
$ xmake check
./xmake.lua:15: warning: unknown language value 'c91', it may be 'c90'
0 notes, 1 warnings, 0 errors
```

we can also run a given group

```console
$ xmake check api
$ xmake check api.target
```

#### Verbose output

```console
$ xmake check -v
./xmake.lua:15: warning: unknown language value 'cxx91', it may be 'cxx98'
./src/tbox/xmake.lua:43: note: unknown package value 'mbedtls'
./src/tbox/xmake.lua:43: note: unknown package value 'polarssl'
./src/tbox/xmake.lua:43: note: unknown package value 'openssl'
./src/tbox/xmake.lua:43: note: unknown package value 'pcre2'
./src/tbox/xmake.lua:43: note: unknown package value 'pcre'
./src/tbox/xmake.lua:43: note: unknown package value 'zlib'
./src/tbox/xmake.lua:43: note: unknown package value 'mysql'
./src/tbox/xmake.lua:43: note: unknown package value 'sqlite3'
8 notes, 1 warnings, 0 errors
```

#### Check the given api

```console
$ xmake check api.target.languages
./xmake.lua:15: warning: unknown language value 'cxx91', it may be 'cxx98'
0 notes, 1 warnings, 0 errors
```

#### Check compiler flags

```console
$ xmake check
./xmake.lua:10: warning: clang: unknown c compiler flag '-Ox'
0 notes, 1 warnings, 0 errors
```

#### Check includedirs


```console
$ xmake check
./xmake.lua:11: warning: includedir 'xxx' not found
0 notes, 1 warnings, 0 errors
```

### Check project code (clang-tidy)

#### List clang-tidy checks

```console
$ xmake check clang.tidy --list
Enabled checks:
    clang-analyzer-apiModeling.StdCLibraryFunctions
    clang-analyzer-apiModeling.TrustNonnull
    clang-analyzer-apiModeling.google.GTest
    clang-analyzer-apiModeling.llvm.CastValue
    clang-analyzer-apiModeling.llvm.ReturnValue
    ...
```

#### Check source code in targets

```console
$ xmake check clang.tidy
1 error generated.
Error while processing /private/tmp/test2/src/main.cpp.
/tmp/test2/src/main.cpp:1:10: error: 'iostr' file not found [clang-diagnostic-error]
#include <iostr>
         ^~~~~~~
Found compiler error(s).
error: execv(/usr/local/opt/llvm/bin/clang-tidy -p compile_commands.json /private/tmp/test2/src
/main.cpp) failed(1)
```

#### Check code with the given checks

```console
$ xmake check clang.tidy --checks="*"
6 warnings and 1 error generated.
Error while processing /private/tmp/test2/src/main.cpp.
/tmp/test2/src/main.cpp:1:10: error: 'iostr' file not found [clang-diagnostic-error]
#include <iostr>
         ^~~~~~~
/tmp/test2/src/main.cpp:3:1: warning: do not use namespace using-directives; use using-declarat
ions instead [google-build-using-namespace]
using namespace std;
^
/tmp/test2/src/main.cpp:3:17: warning: declaration must be declared within the '__llvm_libc' na
mespace [llvmlibc-implementation-in-namespace]
using namespace std;
                ^
/tmp/test2/src/main.cpp:5:5: warning: declaration must be declared within the '__llvm_libc' nam
espace [llvmlibc-implementation-in-namespace]
int main(int argc, char **argv) {
    ^
/tmp/test2/src/main.cpp:5:5: warning: use a trailing return type for this function [modernize-u
se-trailing-return-type]
int main(int argc, char **argv) {
~~~ ^
auto                            -> int
/tmp/test2/src/main.cpp:5:14: warning: parameter 'argc' is unused [misc-unused-parameters]
int main(int argc, char **argv) {
             ^~~~
              /*argc*/
/tmp/test2/src/main.cpp:5:27: warning: parameter 'argv' is unused [misc-unused-parameters]
int main(int argc, char **argv) {
                          ^~~~
                           /*argv*/
Found compiler error(s).
error: execv(/usr/local/opt/llvm/bin/clang-tidy --checks=* -p compile_commands.json /private/tm
p/test2/src/main.cpp) failed(1)
```

#### Check code with the given target name

```console
$ xmake check clang.tidy [targetname]
```

#### Check code with the given source files

```console
$ xmake check clang.tidy -f src/main.c
$ xmake check clang.tidy -f 'src/*.c:src/**.cpp'
```

#### Set the given .clang-tidy config file

```console
$ xmake check clang.tidy --configfile=/tmp/.clang-tidy
```

#### Create a new .clang-tidy config file

```console
$ xmake check clang.tidy --checks="*" --create
$ cat .clang-tidy
---
Checks:          'clang-diagnostic-*,clang-analyzer-*,*'
WarningsAsErrors: ''
HeaderFilterRegex: ''
AnalyzeTemporaryDtors: false
FormatStyle:     none
User:            ruki
CheckOptions:
  - key:             readability-suspicious-call-argument.PrefixSimilarAbove
    value:           '30'
  - key:             cppcoreguidelines-no-malloc.Reallocations
    value:           '::realloc'

```

#### Automatically fixing error codes

We can use the following command parameters to automatically fix problematic code detected by clang tidy.

``` console
$ xmake check clang.tidy --fix
$ xmake check clang.tidy --fix_errors
$ xmake check clang.tidy --fix_notes
```

## Generate installation package

### Introduction

This plug-in can help users quickly generate installation packages and source code packages for different platforms. It will generate the following installation package formats:

- Windows NSIS binary installation package
- runself (shell) self-compile installation package
- zip/tar.gz binary package
- zip/tar.gz source package
- RPM binary installation package (to be supported)
- SRPM source code installation package (to be supported)
- DEB binary installation package (to be supported)

Here is a complete example, we can take a brief look at it first:

```lua
set_version("1.0.0")
add_rules("mode.debug", "mode.release")

includes("@builtin/xpack")

target("test")
     set_kind("binary")
     add_files("src/*.cpp")

xpack("test")
     set_formats("nsis", "zip", "targz", "runself")
     set_title("hello")
     set_author("ruki")
     set_description("A test installer.")
     set_homepage("https://xmake.io")
     set_licensefile("LICENSE.md")
     add_targets("test")
     add_installfiles("src/(assets/*.png)", {prefixdir = "images"})
     add_sourcefiles("(src/**)")
     set_iconfile("src/assets/xmake.ico")

     after_installcmd(function (package, batchcmds)
         batchcmds:mkdir(package:installdir("resources"))
         batchcmds:cp("src/assets/*.txt", package:installdir("resources"), {rootdir = "src"})
         batchcmds:mkdir(package:installdir("stub"))
     end)

     after_uninstallcmd(function (package, batchcmds)
         batchcmds:rmdir(package:installdir("resources"))
         batchcmds:rmdir(package:installdir("stub"))
     end)
```

We introduce all configuration interfaces of xpack through `includes("@builtin/xpack")`, including the xpack configuration domain and all its domain interfaces.

Then we execute:

```bash
$xmakepack
```

All installation packages will be generated.

### Generate NSIS installation package

As long as you configure the `set_formats("nsis")` format and then execute the `xmake pack` command, you can generate an installation package in NSIS format.

In addition, xmake will also automatically install the tools required to generate NSIS packages to achieve true one-click packaging.

```bash
$xmakepack
note: install or modify (m) these packages (pass -y to skip confirm)?
in xmake-repo:
   -> nsis 3.09
please input: y (y/n/m)

   => install nsis 3.09 .. ok

[25%]: compiling.release src\main.cpp
[37%]: compiling.release src\main.cpp
[50%]: linking.release foo.dll
[62%]: linking.release test.exe
packing build\xpack\test\test-windows-x64-v1.0.0.exe
pack ok
```

`test-windows-x64-v1.0.0.exe` is the installation package we generated. Double-click to run it to install our binary files to the specified directory.

![](/assets/img/manual/nsis_1.png)
![](/assets/img/manual/nsis_2.png)
![](/assets/img/manual/nsis_3.png)

#### Add component installation

We can also add component installation commands to NSIS. Only when the user selects the specified component, its installation command will be executed.

```lua
xpack("test")
     add_components("LongPath")

xpack_component("LongPath")
     set_default(false)
     set_title("Enable Long Path")
     set_description("Increases the maximum path length limit, up to 32,767 characters (before 256).")
     on_installcmd(function (component, batchcmds)
         batchcmds:rawcmd("nsis", [[
   ${If} $NoAdmin == "false"
     ; Enable long path
     WriteRegDWORD ${HKLM} "SYSTEM\CurrentControlSet\Control\FileSystem" "LongPathsEnabled" 1
   ${EndIf}]])
     end)
```

In this example, we added an NSIS-specific custom command to support long paths.

![](/assets/img/manual/nsis_4.png)

### Generate self-installation package

We can also generate self-compiled installation packages based on shell scripts. We need to configure the runself packaging format, and then add the source files that need to participate in compilation and installation through `add_sourcefiles`.

Next, we need to customize the on_installcmd installation script to configure if we compile the source code package, we can simply call a built-in compilation and installation script file, or directly configure compilation and installation commands such as `make install`.

For example:

```lua
xpack("test")
     set_formats("runself")
     add_sourcefiles("(src/**)")
     on_installcmd(function (package, batchcmds)
         batchcmds:runv("make", {"install"})
     end)
```

Then, we execute the `xmake pack` command to generate a self-installed xxx.gz.run package, which uses gzip compression by default.

```bash
$xmakepack
packing build/xpack/test/test-macosx-src-v1.0.0.gz.run
pack ok
```

We can use sh to load and run it to install our program.

```bash
$ sh ./build/xpack/test/test-macosx-src-v1.0.0.gz.run
```

We can also look at a more complete example:

```lua
xpack("xmakesrc")
     set_formats("runself")
     set_basename("xmake-v$(version)")
     set_prefixdir("xmake-$(version)")
     before_package(function (package)
         import("devel.git")

         local rootdir = path.join(os.tmpfile(package:basename()) .. ".dir", "repo")
         if not os.isdir(rootdir) then
             os.tryrm(rootdir)
             os.cp(path.directory(os.projectdir()), rootdir)

             git.clean({repodir = rootdir, force = true, all = true})
             git.reset({repodir = rootdir, hard = true})
             if os.isfile(path.join(rootdir, ".gitmodules")) then
                 git.submodule.clean({repodir = rootdir, force = true, all = true})
                 git.submodule.reset({repodir = rootdir, hard = true})
             end
         end

         local extraconf = {rootdir = rootdir}
         package:add("sourcefiles", path.join(rootdir, "core/**|src/pdcurses/**|src/luajit/**|src/tbox/tbox/src/demo/**"), extraconf )
         package:add("sourcefiles", path.join(rootdir, "xmake/**"), extraconf)
         package:add("sourcefiles", path.join(rootdir, "*.md"), extraconf)
         package:add("sourcefiles", path.join(rootdir, "configure"), extraconf)
         package:add("sourcefiles", path.join(rootdir, "scripts/*.sh"), extraconf)
         package:add("sourcefiles", path.join(rootdir, "scripts/man/**"), extraconf)
         package:add("sourcefiles", path.join(rootdir, "scripts/debian/**"), extraconf)
         package:add("sourcefiles", path.join(rootdir, "scripts/msys/**"), extraconf)
     end)

     on_installcmd(function (package, batchcmds)
         batchcmds:runv("./scripts/get.sh", {"__local__"})
     end)
```

It is the installation package configuration script of xmake's own source code, which is more complete.

For configuration, please refer to: [xpack.lua](https://github.com/xmake-io/xmake/blob/master/core/xpack.lua)

Here, it performs compilation and installation by calling the `./scripts/get.sh` installation script built into the source package.

### Generate source code archive package

In addition, we can also configure the `srczip` and `srctargz` formats to generate source code compression packages. It is not a complete installation package and has no installation commands. It is only used for source code package distribution.

```lua
xpack("test")
     set_formats("srczip", "srctargz")
     add_sourcefiles("(src/**)")
```

```bash
$xmakepack
packing build/xpack/test/test-macosx-src-v1.0.0.zip ..
packing build/xpack/test/test-macosx-src-v1.0.0.tar.gz ..
pack ok
```

### Generate binary archive package

We can also configure `zip` and `targz` to generate binary compressed packages. It will automatically compile all bound target target programs and package all required binary programs and library files into zip/tar.gz format.

This is usually used to create a green version of the installation package. There is no automatic installation script inside. Users need to set environment variables such as PATH themselves.

```lua
xpack("test")
     set_formats("zip", "targz")
     add_installfiles("(src/**)")
```

```bash
$xmakepack
packing build/xpack/test/test-macosx-v1.0.0.zip ..
packing build/xpack/test/test-macosx-v1.0.0.tar.gz ..
pack ok
```

!> It should be noted that to add binary files to the package, use `add_installfiles` instead of `add_sourcefiles`.

We can also use `add_targets` to bind the target target programs and libraries that need to be installed. See the interface description for `add_targets` below for more details.

### Packaging command

#### Specify packaging format

If we have configured multiple packaging formats using `set_formats` in the configuration file, then `xmake pack` will automatically generate packages for all these formats by default.

Of course, we can also use `xmake pack --formats=nsis,targz` to selectively specify which formats of packages currently need to be packaged.

#### Modify the package file name

We can modify the package name through `set_basename()` in the configuration file, or we can modify it through the command line.

```bash
$ xmake pack --basename="foo"
packing build/xpack/test/foo.zip ..
pack ok
```

#### Specify output directory

The default output directory is in the build directory, but we can also modify the output path.

```bash
$ xmake pack -o /tmp/output
```

#### Disable automatic build

If you are building a binary package such as NSIS, `xmake pack` will automatically compile all bound target files first, and then execute the packaging logic.

But if we have already compiled it and don't want to compile it every time, but package it directly, we can disable automatic building through the following parameters.

```bash
$ xmake pack --autobuild=n
```

### Interface description

For more descriptions of the XPack packaging interface, see: [XPack Packaging Interface Document](https://xmake.io/#/zh-cn/manual/xpack).

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

