
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

And add `--backtrace` to get the verbose backtrace info, then you can submit these infos to [issues](https://github.com/xmake-io/xmake/issues).

```bash
$ xmake -v --backtrace
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
