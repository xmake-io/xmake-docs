## Master

### via curl

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh)
```

### via wget

```bash
bash <(wget https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh -O -)
```

### via powershell

```bash
Invoke-Expression (Invoke-Webrequest 'https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.ps1' -UseBasicParsing).Content
```

## Windows

### via installer

1. Download xmake windows installer from [Releases](https://github.com/xmake-io/xmake/releases)
2. Run xmake-[version].exe

### via scoop

```bash
scoop install xmake
```

## MacOS

```bash
$ brew install xmake
```

## Linux

On Archlinux:

```bash
$ yaourt xmake
```

On Ubuntu:

```bash
$ sudo add-apt-repository ppa:tboox/xmake
$ sudo apt update
$ sudo apt install xmake
```

Or add xmake package source manually:

```
deb http://ppa.launchpad.net/tboox/xmake/ubuntu yakkety main 
deb-src http://ppa.launchpad.net/tboox/xmake/ubuntu yakkety main 
```

Then we run:

```bash
$ sudo apt update
$ sudo apt install xmake
```

Or download deb package to install it:

1. Download xmake `.deb` install package from [Releases](https://github.com/xmake-io/xmake/releases) 
2. Run `dpkg -i xmake-xxxx.deb`

## Compilation

Compile and install:

```bash
$ git clone https://github.com/xmake-io/xmake.git
$ cd ./xmake
$ ./scripts/get.sh __local__
```

Only install and update lua scripts:

```bash
$ ./scripts/get.sh __local__ __install_only__
```

Uninstall:

```bash
$ ./scripts/get.sh __uninstall__
```

Or compile and install via make:

```bash
$ make build; sudo make install
```

Install to other given directory:

```bash
$ sudo make install prefix=/usr/local
```

Uninstall:

```bash
$ sudo make uninstall
```

## Update

We can run `xmake update` to update xmake version after v2.2.3 and we can also update to the given version:

```bash
$ xmake update 2.2.4
```

We can also specify an update to the master/dev branch version:

```bash
$ xmake update master
$ xmake update dev
```

Finally, if we want to uninstall xmake, it is also supported: `xmake update --uninstall`.

