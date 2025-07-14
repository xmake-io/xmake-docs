---
title: How to configure for compiling
tags: [xmake, configure, android, auto-detection]
date: 2016-07-19
author: Ruki
---

xmake will automatically detect the system environment and create the most appropriate configuration to compile project when building a program

Usually we only need to run:

```bash
$ xmake
```

And it will not re-generate configuration if the project description has not changed.

But we can also modify configuration manually.

e.g

We want to build android program on macosx:

```bash
$ xmake f -p android --ndk=~/file/android-ndk
```




Or 

```bash
$ xmake config --plat=android --ndk=~/file/android-ndk
```

Next we build it.

```bash
$ xmake
```

We need add argument `-c` to clear the cached configuration and recheck it when some caching problem occurs

```bash
$ xmake f -c
```

The project configuration was storaged in the following directory: 

```
projectdir/.xmake
```

We can also use the global configuration to simplify our works.

.e.g

```bash
$ xmake global --ndk=~/file/android-ndk
```

Or


```bash
$ xmake g --ndk=~/file/android-ndk
```

Now we only run the following command to build project without the ndk argument each time. : )

```bash
$ xmake f -p android
$ xmake
```

Lastly，we can run xmake with `--help` to know more argument usages.

```bash
$ xmake f -h
$ xmake g -h
```