---
title: How to complie project using the cross-toolchains
tags: [xmake, cross-toolchains, cross-compiling]
date: 2016-07-22
author: Ruki
outline: deep
---

xmake provides a convenient and flexible cross-compiling support, in most cases, we need not to configure complex toolchains prefix, for example: `arm-linux-`

As long as this toolchains meet the following directory structure:

```
/home/toolchains_sdkdir
   - bin
       - arm-linux-gcc
       - arm-linux-ld
       - ...
   - lib
       - libxxx.a
   - include
       - xxx.h
```

Then，we can only configure the sdk directory and build it.

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir
$ xmake
```




xmake will detect the prefix: `arm-linux-` and add the include and library search directory automatically.

```
-I/home/toolchains_sdkdir/include -L/home/toolchains_sdkdir/lib
```

However, we need set it manually if the toolchains `/bin` directory is in other places.

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --toolchains=/usr/opt/bin
$ xmake
```

Or we need configure all options for compiling successfully if this toolchains has completely differen directory structure.

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --toolchains=/usr/opt/bin --cxflags="-I/usr/xxx/include" --ldflags="-L/usr/zzz/lib"
$ xmake
```

We can also set the prefix using the argument `--cross=` manually. 

.e.g

```bash
$ xmake f -p linux --cross=arm-linux- --sdk=/home/toolchains_sdkdir ...
```