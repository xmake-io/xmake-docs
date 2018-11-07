# FAQ

## How to get verbose command-line arguments info?

Get the help info of the main command.

```bash
$ xmake [-h|--help]
``` 

Get the help info of the configuration command.

```bash
$ xmake f [-h|--help]
``` 

Get the help info of the givent action or plugin command.

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

For exmaple: 

```hash
$ xmake [-v|--verbose] 
```

And add `--backtrace` to get the verbose backtrace info, then you can submit these infos to [issues](https://github.com/tboox/xmake/issues).

```bash
$ xmake -v --backtrace
```

## How to see verbose compiling warnings?

```bash
$ xmake [-w|--warning] 
```

## How to scan source code and generate xmake.lua automaticlly

You only need run the following command:

```bash
$ xmake
```

xmake will scan all source code in current directory and build it automaticlly. 

And we can run it directly.

```bash
$ xmake run
```

If we only want to generate xmake.lua file, we can run:

```bash
$ xmake f -y
```

If you want to known more information please see [Scan source codes and build project without makefile](http://tboox.org/2017/01/07/build-without-makefile/)
