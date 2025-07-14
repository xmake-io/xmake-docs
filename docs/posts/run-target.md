---
title: Run target
tags: [xmake, run]
date: 2016-06-26
author: Ruki
---

You can use xmake to run the given target and need not know where is the target program.

e.g. 

We define a simple target with named 'test'.

```lua
    target("test")
        set_kind("console")
        add_files("*.c")
```

So, we can run it directly.

```bash
    $xmake r test
    or $xmake run test
```

xmake will compile it automaticly if the target has not been built.
