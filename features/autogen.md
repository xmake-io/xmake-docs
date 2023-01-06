
we need not write any make-like file (xmake.lua, makefile.am, cmakelist.txt, etc.) and also build it directly.

It will scan all source files and generate xmake.lua automatically for building project.

And xmake will detect 'main' function in source file in order to distinguish between static libraries and executable programs.

(Currently, only projects with single-level directory are supported)

### Used scenes

1. Temporarily quickly compile and run some scattered test code
2. Try porting and compiling other open source libraries
3. Quickly create a new xmake project based on existing code

### How to use it

Execute xmake directly in the directory with the source code (no xmake.lua), and follow the prompts:

```bash
$ xmake
note: xmake.lua not found, try generating it (pass -y or --confirm=y/n/d to skip confirm)?
please input: n (y/n)
y
```

In addition, when there are other build system identification files (such as CMakeLists.txt), the process of automatically generating xmake.lua will not be triggered, but [Automatically detect build system and compile](#Automatically detect build system and compile) will be triggered first. If you want to force trigger the process of automatically generating xmake.lua file, you can run:

```bash
$ xmake f -y
```

### Compile open source libraries

Although this approach has some limitations, but it is sufficient to complie and run some temporary codes for testing. 

For example, we downloaded a zlib-1.2.10 source and want to compile it.

We only need to enter the zlib source directory and run the following command:

```bash
$ cd zlib-1.2.10
$ xmake
note: xmake.lua not found, try generating it (pass -y or --confirm=y/n/d to skip confirm)?
please input: n (y/n)
y
```

It's done, the output results: 

```
target(zlib-1.2): static
    [+]: ./adler32.c
    [+]: ./compress.c
    [+]: ./crc32.c
    [+]: ./deflate.c
    [+]: ./gzclose.c
    [+]: ./gzlib.c
    [+]: ./gzread.c
    [+]: ./gzwrite.c
    [+]: ./infback.c
    [+]: ./inffast.c
    [+]: ./inflate.c
    [+]: ./inftrees.c
    [+]: ./trees.c
    [+]: ./uncompr.c
    [+]: ./zutil.c
xmake.lua generated, scan ok!👌
checking for the architecture ... x86_64
checking for the Xcode SDK version for macosx ... 10.12
checking for the target minimal version ... 10.12
checking for the c compiler (cc) ... xcrun -sdk macosx clang
checking for the c++ compiler (cxx) ... xcrun -sdk macosx clang
checking for the objc compiler (mm) ... xcrun -sdk macosx clang
checking for the objc++ compiler (mxx) ... xcrun -sdk macosx clang++
checking for the swift compiler (sc) ... xcrun -sdk macosx swiftc
checking for the assember (as) ... xcrun -sdk macosx clang
checking for the linker (ld) ... xcrun -sdk macosx clang++
checking for the static library archiver (ar) ... xcrun -sdk macosx ar
checking for the static library extractor (ex) ... xcrun -sdk macosx ar
checking for the shared library linker (sh) ... xcrun -sdk macosx clang++
checking for the debugger (dd) ... xcrun -sdk macosx lldb
checking for the golang compiler (go) ... go
configure
{
    ex = "xcrun -sdk macosx ar"
,   sh = "xcrun -sdk macosx clang++"
,   host = "macosx"
,   ar = "xcrun -sdk macosx ar"
,   buildir = "build"
,   as = "xcrun -sdk macosx clang"
,   plat = "macosx"
,   xcode_dir = "/Applications/Xcode.app"
,   arch = "x86_64"
,   mxx = "xcrun -sdk macosx clang++"
,   go = "go"
,   target_minver = "10.12"
,   ccache = "ccache"
,   mode = "release"
,   clean = true
,   cxx = "xcrun -sdk macosx clang"
,   cc = "xcrun -sdk macosx clang"
,   dd = "xcrun -sdk macosx lldb"
,   kind = "static"
,   ld = "xcrun -sdk macosx clang++"
,   xcode_sdkver = "10.12"
,   sc = "xcrun -sdk macosx swiftc"
,   mm = "xcrun -sdk macosx clang"
}
configure ok!
clean ok!
[00%]: cache compiling.release ./adler32.c
[06%]: cache compiling.release ./compress.c
[13%]: cache compiling.release ./crc32.c
[20%]: cache compiling.release ./deflate.c
[26%]: cache compiling.release ./gzclose.c
[33%]: cache compiling.release ./gzlib.c
[40%]: cache compiling.release ./gzread.c
[46%]: cache compiling.release ./gzwrite.c
[53%]: cache compiling.release ./infback.c
[60%]: cache compiling.release ./inffast.c
[66%]: cache compiling.release ./inflate.c
[73%]: cache compiling.release ./inftrees.c
[80%]: cache compiling.release ./trees.c
[86%]: cache compiling.release ./uncompr.c
[93%]: cache compiling.release ./zutil.c
[100%]: archiving.release libzlib-1.2.a
build ok!👌
```

Xmake will scan the current directory to detect all source codes and it do not found main function.

So it should be static library project and we build it as a static library: libzlib-1.2.a

We did not write any make-like files (xmake.lua, ..) and did not use the makefile of zlib project.

It is compiled directly and a xmake.lua file was generated which we can edit this xmake.lua to build more complicated project. 

The content of the generated xmake.lua:

```lua
-- define target
target("zlib-1.2")

    -- set kind
    set_kind("static")

    -- add files
    add_files("./adler32.c")
    add_files("./compress.c")
    add_files("./crc32.c")
    add_files("./deflate.c")
    add_files("./gzclose.c")
    add_files("./gzlib.c")
    add_files("./gzread.c")
    add_files("./gzwrite.c")
    add_files("./infback.c")
    add_files("./inffast.c")
    add_files("./inflate.c")
    add_files("./inftrees.c")
    add_files("./trees.c")
    add_files("./uncompr.c")
    add_files("./zutil.c")
```

### Fastly compile and run testing code

For example, I want to write a simple program in the main.c only to echo 'hello world!'.

If we use gcc to compile and run it, need run two commands: 

```bash
gcc ./main.c -o demo
./demo
```

If we use xmake to run it, only need run:

```bash
xmake run
```

Or

```bash
xmake r
```

It's done, the output results is:

```
hello world!
```

If we have a lot of code files, need also run only one command:


```bash
xmake run
```

It's so easy and convenient.

### Multi-language support

This feature of code detection and real-time compilation not only supports c/c++, also supports objc/swift 
and it will support golang in future.

For example, we downloaded a ios open source framework code 'fmdb':


```
.
├── FMDB.h
├── FMDatabase.h
├── FMDatabase.m
├── FMDatabaseAdditions.h
├── FMDatabaseAdditions.m
├── FMDatabasePool.h
├── FMDatabasePool.m
├── FMDatabaseQueue.h
├── FMDatabaseQueue.m
├── FMResultSet.h
└── FMResultSet.m
```

There are no any make-like files in it's project directory.

We uses xmake to build it directly as a ios static library:


```bash
$ xmake f -p iphoneos; xmake
```

The output results are:

```
xmake.lua not found, scanning files ..
target(FMDB): static
    [+]: ./FMDatabase.m
    [+]: ./FMDatabaseAdditions.m
    [+]: ./FMDatabasePool.m
    [+]: ./FMDatabaseQueue.m
    [+]: ./FMResultSet.m
xmake.lua generated, scan ok!👌
checking for the architecture ... armv7
checking for the Xcode SDK version for iphoneos ... 10.1
checking for the target minimal version ... 10.1
checking for the c compiler (cc) ... xcrun -sdk iphoneos clang
checking for the c++ compiler (cxx) ... xcrun -sdk iphoneos clang
checking for the objc compiler (mm) ... xcrun -sdk iphoneos clang
checking for the objc++ compiler (mxx) ... xcrun -sdk iphoneos clang++
checking for the assember (as) ... gas-preprocessor.pl xcrun -sdk iphoneos clang
checking for the linker (ld) ... xcrun -sdk iphoneos clang++
checking for the static library archiver (ar) ... xcrun -sdk iphoneos ar
checking for the static library extractor (ex) ... xcrun -sdk iphoneos ar
checking for the shared library linker (sh) ... xcrun -sdk iphoneos clang++
checking for the swift compiler (sc) ... xcrun -sdk iphoneos swiftc
configure
{
    ex = "xcrun -sdk iphoneos ar"
,   ccache = "ccache"
,   host = "macosx"
,   ar = "xcrun -sdk iphoneos ar"
,   buildir = "build"
,   as = "/usr/local/share/xmake/tools/utils/gas-preprocessor.pl xcrun -sdk iphoneos clang"
,   arch = "armv7"
,   mxx = "xcrun -sdk iphoneos clang++"
,   cxx = "xcrun -sdk iphoneos clang"
,   target_minver = "10.1"
,   xcode_dir = "/Applications/Xcode.app"
,   clean = true
,   sh = "xcrun -sdk iphoneos clang++"
,   cc = "xcrun -sdk iphoneos clang"
,   ld = "xcrun -sdk iphoneos clang++"
,   mode = "release"
,   kind = "static"
,   plat = "iphoneos"
,   xcode_sdkver = "10.1"
,   sc = "xcrun -sdk iphoneos swiftc"
,   mm = "xcrun -sdk iphoneos clang"
}
configure ok!
clean ok!
[00%]: cache compiling.release ./FMDatabase.m
[20%]: cache compiling.release ./FMDatabaseAdditions.m
[40%]: cache compiling.release ./FMDatabasePool.m
[60%]: cache compiling.release ./FMDatabaseQueue.m
[80%]: cache compiling.release ./FMResultSet.m
[100%]: archiving.release libFMDB.a
build ok!👌
```

### Compile multiple executables at the same time


```bash
$ cd jpeg-6b
$ xmake
```

The output results are:

```
xmake.lua not found, scanning files ..
target(jpeg-6b): static
    [+]: ./cdjpeg.c
    [+]: ./example.c
    [+]: ./jcapimin.c
    [+]: ./jcapistd.c
    [+]: ./jccoefct.c
    [+]: ./jccolor.c
    [+]: ./jcdctmgr.c
    [+]: ./jchuff.c
    [+]: ./jcinit.c
    [+]: ./jcmainct.c
    [+]: ./jcmarker.c
    [+]: ./jcmaster.c
    [+]: ./jcomapi.c
    [+]: ./jcparam.c
    [+]: ./jcphuff.c
    [+]: ./jcprepct.c
    [+]: ./jcsample.c
    [+]: ./jctrans.c
    [+]: ./jdapimin.c
    [+]: ./jdapistd.c
    [+]: ./jdatadst.c
    [+]: ./jdatasrc.c
    [+]: ./jdcoefct.c
    [+]: ./jdcolor.c
    [+]: ./jddctmgr.c
    [+]: ./jdhuff.c
    [+]: ./jdinput.c
    [+]: ./jdmainct.c
    [+]: ./jdmarker.c
    [+]: ./jdmaster.c
    [+]: ./jdmerge.c
    [+]: ./jdphuff.c
    [+]: ./jdpostct.c
    [+]: ./jdsample.c
    [+]: ./jdtrans.c
    [+]: ./jerror.c
    [+]: ./jfdctflt.c
    [+]: ./jfdctfst.c
    [+]: ./jfdctint.c
    [+]: ./jidctflt.c
    [+]: ./jidctfst.c
    [+]: ./jidctint.c
    [+]: ./jidctred.c
    [+]: ./jmemansi.c
    [+]: ./jmemmgr.c
    [+]: ./jmemname.c
    [+]: ./jmemnobs.c
    [+]: ./jquant1.c
    [+]: ./jquant2.c
    [+]: ./jutils.c
    [+]: ./rdbmp.c
    [+]: ./rdcolmap.c
    [+]: ./rdgif.c
    [+]: ./rdppm.c
    [+]: ./rdrle.c
    [+]: ./rdswitch.c
    [+]: ./rdtarga.c
    [+]: ./transupp.c
    [+]: ./wrbmp.c
    [+]: ./wrgif.c
    [+]: ./wrppm.c
    [+]: ./wrrle.c
    [+]: ./wrtarga.c
target(ansi2knr): binary
    [+]: ./ansi2knr.c
target(cjpeg): binary
    [+]: ./cjpeg.c
target(ckconfig): binary
    [+]: ./ckconfig.c
target(djpeg): binary
    [+]: ./djpeg.c
target(jpegtran): binary
    [+]: ./jpegtran.c
target(rdjpgcom): binary
    [+]: ./rdjpgcom.c
target(wrjpgcom): binary
    [+]: ./wrjpgcom.c
xmake.lua generated, scan ok!👌
checking for the architecture ... x86_64
checking for the Xcode SDK version for macosx ... 10.12
checking for the target minimal version ... 10.12
checking for the c compiler (cc) ... xcrun -sdk macosx clang
checking for the c++ compiler (cxx) ... xcrun -sdk macosx clang
checking for the objc compiler (mm) ... xcrun -sdk macosx clang
checking for the objc++ compiler (mxx) ... xcrun -sdk macosx clang++
checking for the swift compiler (sc) ... xcrun -sdk macosx swiftc
checking for the assember (as) ... xcrun -sdk macosx clang
checking for the linker (ld) ... xcrun -sdk macosx clang++
checking for the static library archiver (ar) ... xcrun -sdk macosx ar
checking for the static library extractor (ex) ... xcrun -sdk macosx ar
checking for the shared library linker (sh) ... xcrun -sdk macosx clang++
checking for the debugger (dd) ... xcrun -sdk macosx lldb
checking for the golang compiler (go) ... go
configure
{
    ex = "xcrun -sdk macosx ar"
,   sh = "xcrun -sdk macosx clang++"
,   host = "macosx"
,   ar = "xcrun -sdk macosx ar"
,   buildir = "build"
,   as = "xcrun -sdk macosx clang"
,   plat = "macosx"
,   xcode_dir = "/Applications/Xcode.app"
,   arch = "x86_64"
,   mxx = "xcrun -sdk macosx clang++"
,   go = "go"
,   target_minver = "10.12"
,   ccache = "ccache"
,   mode = "release"
,   clean = true
,   cxx = "xcrun -sdk macosx clang"
,   cc = "xcrun -sdk macosx clang"
,   dd = "xcrun -sdk macosx lldb"
,   kind = "static"
,   ld = "xcrun -sdk macosx clang++"
,   xcode_sdkver = "10.12"
,   sc = "xcrun -sdk macosx swiftc"
,   mm = "xcrun -sdk macosx clang"
}
configure ok!
clean ok!
[00%]: cache compiling.release ./cdjpeg.c
[00%]: cache compiling.release ./example.c
[00%]: cache compiling.release ./jcapimin.c
[00%]: cache compiling.release ./jcapistd.c
[00%]: cache compiling.release ./jccoefct.c
[00%]: cache compiling.release ./jccolor.c
[01%]: cache compiling.release ./jcdctmgr.c
[01%]: cache compiling.release ./jchuff.c
[01%]: cache compiling.release ./jcinit.c
[01%]: cache compiling.release ./jcmainct.c
[01%]: cache compiling.release ./jcmarker.c
[02%]: cache compiling.release ./jcmaster.c
[02%]: cache compiling.release ./jcomapi.c
[02%]: cache compiling.release ./jcparam.c
[02%]: cache compiling.release ./jcphuff.c
[02%]: cache compiling.release ./jcprepct.c
[03%]: cache compiling.release ./jcsample.c
[03%]: cache compiling.release ./jctrans.c
[03%]: cache compiling.release ./jdapimin.c
[03%]: cache compiling.release ./jdapistd.c
[03%]: cache compiling.release ./jdatadst.c
[04%]: cache compiling.release ./jdatasrc.c
[04%]: cache compiling.release ./jdcoefct.c
[04%]: cache compiling.release ./jdcolor.c
[04%]: cache compiling.release ./jddctmgr.c
[04%]: cache compiling.release ./jdhuff.c
[05%]: cache compiling.release ./jdinput.c
[05%]: cache compiling.release ./jdmainct.c
[05%]: cache compiling.release ./jdmarker.c
[05%]: cache compiling.release ./jdmaster.c
[05%]: cache compiling.release ./jdmerge.c
[06%]: cache compiling.release ./jdphuff.c
[06%]: cache compiling.release ./jdpostct.c
[06%]: cache compiling.release ./jdsample.c
[06%]: cache compiling.release ./jdtrans.c
[06%]: cache compiling.release ./jerror.c
[07%]: cache compiling.release ./jfdctflt.c
[07%]: cache compiling.release ./jfdctfst.c
[07%]: cache compiling.release ./jfdctint.c
[07%]: cache compiling.release ./jidctflt.c
[07%]: cache compiling.release ./jidctfst.c
[08%]: cache compiling.release ./jidctint.c
[08%]: cache compiling.release ./jidctred.c
[08%]: cache compiling.release ./jmemansi.c
[08%]: cache compiling.release ./jmemmgr.c
[08%]: cache compiling.release ./jmemname.c
[09%]: cache compiling.release ./jmemnobs.c
[09%]: cache compiling.release ./jquant1.c
[09%]: cache compiling.release ./jquant2.c
[09%]: cache compiling.release ./jutils.c
[09%]: cache compiling.release ./rdbmp.c
[10%]: cache compiling.release ./rdcolmap.c
[10%]: cache compiling.release ./rdgif.c
[10%]: cache compiling.release ./rdppm.c
[10%]: cache compiling.release ./rdrle.c
[10%]: cache compiling.release ./rdswitch.c
[11%]: cache compiling.release ./rdtarga.c
[11%]: cache compiling.release ./transupp.c
[11%]: cache compiling.release ./wrbmp.c
[11%]: cache compiling.release ./wrgif.c
[11%]: cache compiling.release ./wrppm.c
[12%]: cache compiling.release ./wrrle.c
[12%]: cache compiling.release ./wrtarga.c
[12%]: archiving.release libjpeg-6b.a
[12%]: cache compiling.release ./wrjpgcom.c
[25%]: linking.release wrjpgcom
[25%]: cache compiling.release ./ansi2knr.c
[37%]: linking.release ansi2knr
[37%]: cache compiling.release ./jpegtran.c
[50%]: linking.release jpegtran
[50%]: cache compiling.release ./djpeg.c
[62%]: linking.release djpeg
[62%]: cache compiling.release ./ckconfig.c
[75%]: linking.release ckconfig
[75%]: cache compiling.release ./rdjpgcom.c
[87%]: linking.release rdjpgcom
[87%]: cache compiling.release ./cjpeg.c
[100%]: linking.release cjpeg
build ok!👌
```

In addition to a static library, we also compiled some other executable programs.

```
target(ansi2knr): binary
    [+]: ./ansi2knr.c
target(cjpeg): binary
    [+]: ./cjpeg.c
target(ckconfig): binary
    [+]: ./ckconfig.c
target(djpeg): binary
    [+]: ./djpeg.c
target(jpegtran): binary
    [+]: ./jpegtran.c
target(rdjpgcom): binary
    [+]: ./rdjpgcom.c
target(wrjpgcom): binary
    [+]: ./wrjpgcom.c
```

#### Manual configuration

we need add them before compiling if the source code requires some special compiler options

For example:

```bash
$ xmake f --cxflags="" --ldflags="" --includedirs="" --linkdirs=""; xmake
```

