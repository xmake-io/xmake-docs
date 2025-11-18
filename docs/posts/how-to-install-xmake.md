---
title: How to install xmake
tags: [xmake, install, linux, windows, macosx, homebrew]
date: 2016-07-19
author: Ruki
outline: deep
---

### Install on windows

1. Download xmake source codes
2. Enter the source code directory
3. Run `install.bat`
4. Select the installed directory and enter into this directory
5. Please wait some mintues

### Install from source codes on linux and macosx

```bash
$ git clone git@github.com:waruqi/xmake.git
$ cd ./xmake
$ sudo ./install
```

### Install using homebrew on macosx

```bash
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ sudo brew install xmake
```

### Install using homebrew on linux

```bash
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
$ sudo brew install xmake
```