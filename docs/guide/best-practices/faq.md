# FAQ

## How to get command-line arguments information?

Get the help info of the main command:

```sh
$ xmake [-h|--help]
```

Get the help info of the configuration command:

```sh
$ xmake f [-h|--help]
```

Get the help info of the given action or plugin command:

```sh
$ xmake [action|plugin] [-h|--help]
```

For example:

```sh
$ xmake run --help
```

## How to suppress all output info?

```sh
$ xmake [-q|--quiet]
```

## What do do if Xmake fails?

Please attempt to clean configuration and rebuild it first.

```sh
$ xmake f -c
$ xmake
```

If it fails again, please add `-v` or `--verbose` options to get more verbose info.

For example:

```sh
$ xmake [-v|--verbose]
```

And add `-D` to get the verbose backtrace and diagnosis info, then you can submit this to [issues](https://github.com/xmake-io/xmake/issues).

```sh
$ xmake -v -D
```

## How to see verbose compiling warnings?

```sh
$ xmake [-w|--warning]
```

## Why is xmake.lua being executed multiple times?

Xmake.lua is divided into description fields and script fields. In the description field, various configuration fields are parsed multiple times in stages, and it is possible to execute multiple times. Therefore, do not write complex scripts in the description field.

If you want to write a variety of complex scripts, please configure them in the script domain. The script domain of `target/on_load` can also flexibly configure various target related settings and provide more powerful lua script module support.

See: [Description of Syntax Description](/guide/project-configuration/syntax-description) for more details.

## How to debug Xmake source code?

### Downloading source code

Since Xmake uses git submodules to maintain submodules, we can pull the full source code in several ways.

#### Cloning with git

```sh
$ git clone --recursive https://github.com/xmake-io/xmake.git
```

or

```sh
$ git clone https://github.com/xmake-io/xmake.git
$ git submodule update --init
```

#### Downloading source packages from Github Releases

Because github's own downloads attachments do not support archiving submodules, Xmake packages an extra tarball of source code for each release and uploads it to Releases.

Therefore, do not download the wrong link address

- Incomplete source code: https://github.com/xmake-io/xmake/archive/refs/tags/v2.7.2.tar.gz
- Full source package: https://github.com/xmake-io/xmake/releases/download/v2.7.2/xmake-v2.7.2.tar.gz

```sh
$ wget https://github.com/xmake-io/xmake/releases/download/v2.7.2/xmake-v2.7.2.tar.gz
$ tar -xvf xmake-v2.7.2.tar.gz -C xmake
$ cd xmake
```

::: tip NOTE
The Xmake tarball does not have a top-level xmake root directory, so it is best to unpack it with `-C xmake` to specify the output directory.
:::

### Compiling source code

#### Compiling on Windows

If you are compiling Xmake source code on Windows, you will need to bootstrap it with an existing Xmake pre-build.

Therefore we need to first install Xmake by referring to the [Installing Xmake on Windows](/guide/quick-start#windows) documentation.

Then go to the Xmake source directory and compile.

```sh
cd xmake
cd core
xmake
```

! > We need to go into the core subdirectory of Xmake and execute the xmake command.

#### Compiling on Linux/macOS/FreeBSD

To compile Xmake on other unix-like environments, we just need to execute make in the source root.

```sh
$ cd xmake
$ ./configure
$ make
```

::: tip NOTE
On macOS, you may need to run `export SDKROOT=$(xcrun --sdk macosx --show-sdk-path)` before configuration so header files can be found at build time.
:::

### Loading debugging

If the compilation is complete, we can load the Xmake binary core we just compiled and run the local Lua script.

#### Loading the local debugging environment on Windows

Go to the `xmake/scripts` directory and double-click on the srcenv.bat script, which will automatically load the local Xmake program and scripts and open a cmd terminal.

From this terminal, we can then enable debugging.

We can also run:

```sh
$ xmake l os.programdir
```

...to verify that we have actually loaded the local Lua scripting environment.

#### Loading a local debugging environment on other platforms

On Linux/macOS/FreeBSD it's a bit easier! Just run.

```sh
$ cd xmake
$ source scripts/srcenv.profile
```

to get into the local source debugging environment.

### Debugging core binary

Normally, to debug Xmake's Lua scripts, you just need to modify the Lua scripts in the current source directory, which takes effect in real time, and we don't need to recompile the core binary.

However, if there is a problem with Xmake's C-side core program and you need to debug it or add modules to it, you will need to recompile it.

You can use Xmake's internal logging functions like so to aide in debugging:

```c
tb_trace_i("hello %s", "xmake");
```

If there is a problem with the various submodules that Xmake relies on, such as tbox, and you need to debug it, you can also go directly to the submodule source code, modify it and recompile it for execution.

However, if we need to contribute a patch, we need to commit PR to the submodule's repository and the patch will be merged and synced to the Xmake source repository by the author at a later date and time.

### Breakpoint Debugging

In version 2.8.3, we added Lua breakpoint debugging support, with [VSCode-EmmyLua](https://github.com/EmmyLua/VSCode-EmmyLua) plugin, we can easily debug Xmake source code in VSCode breakpoints.

First of all, we need to install VSCode-EmmyLua plugin in VSCode's plugin market, and then run the following command to update the xmake-repo repository to keep it up-to-date.

```sh
xrepo update-repo
```

::: tip NOTE
Xmake also needs to be kept up to date.
:::

Then, execute the following command in your own project directory:

```sh
$ xrepo env -b emmylua_debugger -- xmake build
```

The `xrepo env -b emmylua_debugger` is used to bind the EmmyLua debugger plugin environment, and the arguments after `--` are the actual xmake commands we need to debug.

Usually we just debug the `xmake build` build, but if you want to debug other commands, you can tweak it yourself, for example, if you want to debug the `xmake install -o /tmp` install command, you can change it to:

```sh
$ xrepo env -b emmylua_debugger -- xmake install -o /tmp
```

After executing the above command, it will not exit immediately, it will remain in a waiting debugging state, possibly without any output.

At this point, instead of exiting it, let's go ahead and open VSCode and open Xmake's Lua script source directory in VSCode.

That is, this directory: [Xmake Lua Scripts](https://github.com/xmake-io/xmake/tree/master/xmake), which we can download locally or directly open the lua script directory in the Xmake installation directory.

Then switch to VSCode's debugging tab and click `RunDebug` -> `Emmylua New Debug` to connect to our `xmake build` command debugger and start debugging.

As you can see below, the default start breakpoint will automatically break inside `debugger:_start_emmylua_debugger`, and we can click on the single-step to jump out of the current function, which will take us to the main entry.

![](/assets/img/manual/xmake-debug.png)

Then set your own breakpoint and click Continue to Run to break to the code location you want to debug.

We can also set breakpoints in our project's configuration scripts, which also allows us to quickly debug our own configuration scripts, not just Xmake's own source code.

![](/assets/img/manual/xmake-debug2.png)

### Remote debugging

Version 2.8.3 now supports remote debugging, but this feature is mainly for the author, because the author's development computer is a mac, but sometimes he still needs to be able to debug xmake source scripts on windows.

But debugging in a virtual machine is too laggy, not good experience, and the author's own computer does not have enough disk space, so I usually connect to a separate windows host to debug xmake source code remotely.

Let's start the remote compilation service on the windows machine:

```sh
$ xmake service
```

Then locally, open the project directory where you want to build, make a remote connection, and then run `xmake service --sync --xmakesrc=` to synchronise the local source:

```sh
$ xmake service --connect
$ xmake service --sync --xmakesrc=~/projects/personal/xmake/xmake/
$ xmake build
$ xmake run
```

This way, we can modify the xmake script source locally, sync it to a remote windows machine, and then execute the xmake build command remotely to get the corresponding debug output and analyse the build behaviour.

We can also pull the remote files back to the local machine for analysis with the `xmake service --pull=` command.

Note: See [Remote Build Documentation](/guide/extras/remote-compilation) for a detailed description of remote build features.

![](/assets/img/manual/xmake-remote.png)

## How to debug repository packages?

There are many different ways to debug, here I will focus on the most common debugging method used by the author, which is to pull the xmake-repo repository directly to debug.

```sh
$ git clone https://github.com/xmake-io/xmake-repo.git
$ xmake l scripts/test.lua -vD --shallow zlib
```

Using the `test.lua` script command above to debug packages, we can repeatedly install and test the specified package. `--shallow` tells Xmake not to repeat the full installation of all its dependencies for each test, but only to test the current package.

We can also test specific platforms, architectures, build modes, vs_runtime and dynamic libraries, static libraries etc.

```sh
$ xmake l scripts/test.lua -vD --shallow -p mingw --mingw=/xxx/sdk zlib
$ xmake l scripts/test.lua -vD --shallow -p iphoneos -a arm64 zlib
$ xmake l scripts/test.lua -vD --shallow -k shared --vs_runtime=MD zlib
$ xmake l scripts/test.lua -vD --shallow -m debug zlib
```

### Debugging local package source code

Sometimes, due to problems with the package source and build scripts, we need to modify some code in order to continue testing the installation,
and it would be very tedious to go through the debugging changes in on_install by adding_patches/io.replace.

Therefore, we can specify `-d package_sourcedir` to allow the test script to go directly to
our pre-downloaded package source directory and test the build installation without our code changes being reset each time.

```sh
$ xmake l scripts/test.lua -vD --shallow -d /tmp/zlib-1.2.11 zlib
```

Once the changes have been debugged, we then generate a patch file based on the changes via `git diff > fix.patch`
and configure the patch package to be applied via `add_patches` to fix the package installation.

### Remote debugging package source code

We can also debug the package remotely, by first enabling the remote service:

```sh
$ xmake service
```

Then pass in the `--remote` parameter to compile and test the package remotely.

```sh
$ xmake l scripts/test.lua -vD --shallow --remote /tmp/zlib-1.2.11 zlib
```

## What should I do if the download package failed to get the local issuer certificate?

```sh
curl: (60) SSL certificate problem: unable to get local issuer certificate
More details here: https://curl.se/docs/sslcerts.html

curl failed to verify the legitimacy of the server and therefore could not
To learn more about this situation and
To learn more about this situation and how to fix it, please visit the web page mentioned above.
```

If you encounter the above certificate validation problem when using Xmake to install dependencies, you can try updating the cURL certificate to fix it, or just disable certificate validation in the global configuration to bypass it.

```sh
$ xmake g --insecure-ssl=y
```

Of course, disabling certificate validation poses some security risks, but the good news is that packages in the xmake-repo repository have a strict sha256 checksum. Even if the download is hijacked, it will eventually be detected by xmake's sha256 checksum and treated as an invalid download.
