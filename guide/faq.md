
## How to get verbose command-line arguments info?

Get the help info of the main command.

```bash
$ xmake [-h|--help]
```

Get the help info of the configuration command.

```bash
$ xmake f [-h|--help]
```

Get the help info of the given action or plugin command.

```bash
$ xmake [action|plugin] [-h|--help]
```

For example:

```bash
$ xmake run --help
```

## How to suppress all output info?

```bash
$ xmake [-q|--quiet]
```

## How to do if xmake fails?

Please attempt to clean configuration and rebuild it first.

```bash
$ xmake f -c
$ xmake
```

If it fails again, please add `-v` or `--verbose` options to get more verbose info.

For example:

```hash
$ xmake [-v|--verbose]
```

And add `-D` to get the verbose backtrace and diagnosis info, then you can submit these infos to [issues](https://github.com/xmake-io/xmake/issues).

```bash
$ xmake -v -D
```

## How to see verbose compiling warnings?

```bash
$ xmake [-w|--warning]
```

## How to scan source code and generate xmake.lua automatically?

You only need run the following command:

```bash
$ xmake
```

xmake will scan all source code in current directory and build it automatically.

And we can run it directly.

```bash
$ xmake run
```

If we only want to generate xmake.lua file, we can run:

```bash
$ xmake f -y
```

If you want to known more information please see [Scan source codes and build project without makefile](https://tboox.org/2017/01/07/build-without-makefile/)

## Why is xmake.lua being executed multiple times?

Xmake.lua is divided into description fields and script fields. In the description field, various configuration fields are parsed multiple times in stages, and it is possible to execute multiple times. Therefore, do not write complex scripts in the description field.

If you want to write a variety of complex scripts, please configure them in the script domain. The script domain of `target/on_load` can also flexibly configure various target related settings and provide more powerful lua script module support.

See: [Description of Syntax Description](/guide/syntax_description) for more details.

## How to debug Xmake source code?

### Downloading source code

Since Xmake uses git submodules to maintain submodules, we can pull the full source code in several ways.

#### pulling with git

```bash
$ git clone --recursive https://github.com/xmake-io/xmake.git
```

or

```bash
$ git clone https://github.com/xmake-io/xmake.git
$ git submodule update --init
```

#### Downloading source packages from Github Releases

Because github's own downloads attachments do not support archiving submodules, Xmake packages an extra tarball of source code for each release and uploads it to Releases.

Therefore, do not download the wrong link address

- Incomplete source code: https://github.com/xmake-io/xmake/archive/refs/tags/v2.7.2.tar.gz
- Full source package: https://github.com/xmake-io/xmake/releases/download/v2.7.2/xmake-v2.7.2.tar.gz

```bash
wget https://github.com/xmake-io/xmake/releases/download/v2.7.2/xmake-v2.7.2.tar.gz
tar -xvf xmake-v2.7.2.tar.gz -C xmake
cd xmake
```

! > The Xmake tarball does not have a top-level xmake root directory, so it is best to unpack it with `-C xmake` to specify the output directory.

### Compiling source code

#### Compiling on Windows

If you are compiling Xmake source code on Windows, you will need to bootstrap it with an existing Xmake pre-build.

Therefore we need to first install Xmake by referring to the [Installing Xmake on Windows](https://xmake.io/#/zh-cn/guide/installation?id=windows) documentation.

Then go to the Xmake source directory and compile.

```bash
cd xmake
cd core
xmake
```

! > We need to go into the core subdirectory of Xmake and execute the xmake command.

#### Compiling on Linux/macOS/FreeBSD

To compile Xmake on other unix-like environments, we just need to execute make in the source root.

```bash
$ cd xmake
$ make
```

### Loading debugging

If the compilation is complete, we can load the Xmake binary core we just compiled and run the local Lua script.

#### Loading the local debugging environment on Windows

Go to the `xmake/scripts` directory and double-click on the srcenv.bat script, which will automatically load the local Xmake program and scripts and open a cmd terminal.

From this terminal, we can then enable debugging.

We can also run

```bash
$ xmake l os.programdir
```

to verify that we have actually loaded the local Lua scripting environment.

#### Loading a local debugging environment on other platforms

On Linux/macOS/FreeBSD it's a bit easier to just run.

```bash
$ cd xmake
$ source scripts/srcenv.profile
```

to get into the local source debugging environment.

### Debugging core binary

Normally, to debug Xmake's Lua scripts, you just need to modify the Lua scripts in the current source directory, which takes effect in real time, and we don't need to recompile the core binary.

However, if there is a problem with Xmake's C-side core program and you need to debug it or add modules to it, you will need to recompile it.

The compilation is done, also in real time, and can be done in the C code with

```c
tb_trace_i("hello %s", "xmake");
```

to format the various outputs for printing.

If there is a problem with the various submodules that Xmake relies on, such as tbox, and you need to debug it.

We can also go directly to the submodule source code, modify it and recompile it for execution.

However, if we need to contribute a patch, we need to commit pr to the submodule's repository and the patch will be merged and synced to the Xmake source repository by the author at a specific time.

## How to debug repository packages?

There are many different ways to debug, here I will focus on the most common debugging method used by the author, which is to pull the xmake-repo repository directly to debug.

```bash
$ git clone https://github.com/xmake-io/xmake-repo.git
$ xmake l scripts/test.lua -vD --shallow zlib
```

Using the test.lua script command above to debug packages, we can repeatedly install and test the specified package. `` --shallow` tells Xmake not to repeat the full installation of all its dependencies for each test, but only to test the current package.

We can also test specific platforms, architectures, build modes, vs_runtime and dynamic libraries, static libraries etc.

```bash
$ xmake l scripts/test.lua -vD --shallow -p mingw --mingw=/xxx/sdk zlib
$ xmake l scripts/test.lua -vD --shallow -p iphoneos -a arm64 zlib
$ xmake l scripts/test.lua -vD --shallow -k shared --vs_runtime=MD zlib
$ xmake l scripts/test.lua -vD --shallow -m debug zlib
```

### Debugging local package source code

Sometimes, due to problems with the package source and build scripts, we need to modify some code in order to continue testing the installation, and it would be very tedious to go through the debugging changes in on_install by adding_patches/io.replace.

Therefore, we can specify `-d package_sourcedir` to allow the test script to go directly to our pre-downloaded package source directory and test the build installation without our code changes being reset each time.

``bash
$ xmake l scripts/test.lua -vD --shallow -d /tmp/zlib-1.2.11 zlib
```

Once the changes have been debugged, we then generate a patch file based on the changes via ``git diff > fix.patch`` and configure the patch package to be applied via ``add_patches`` to fix the package installation.
