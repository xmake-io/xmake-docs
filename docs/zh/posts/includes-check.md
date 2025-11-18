---
title: 头文件自动依赖检测和构建
tags: [xmake, 头文件依赖, 增量编译]
date: 2016-07-12
author: Ruki
outline: deep
---

为了进一步提升构建效率，减少没必要的重建，xmake新增了对头文件的依赖检测，以及自动构建仅仅需要重新编译的源文件，提升编译速度，并且完全支持windows、linux、macosx等大部分平台。。

由于检测过程本身也会有一些性能损耗，因此xmake对此进行了深度优化，实现极速依赖检测：

- 对依赖头文件进行过滤，如果是系统头文件，非自身项目的第三方头文件，自动忽略，这些头文件基本上不会再开发项目的时候，经常变动，所以没必要去每次检测他们，如果真有变动，手动重建下就行了

- 针对每个头文件的检测结果进行缓存，直接应用到下一个源文件上，减少重复检测的次数

- 其他一些细节优化



验证效果：

就拿tbox为例，我手动修改了下 tbox 中的正则头文件：`regex.h`

然后编译（注：不是执行重建哦，那个是 `xmake -r`）

```bash
    $xmake
```

编译结果：

```
    [00%]: ccache compiling.release src/tbox/tbox.c
    [15%]: ccache compiling.release src/tbox/memory/impl/prefix.c
    [36%]: ccache compiling.release src/tbox/regex/regex.c
    [50%]: archiving.release libtbox.a
    ...
```

仅仅只编译了其中三个include了用到regex.h的源文件。

当然如果你修改了依赖的第三方库的头文件，最好还是手动重建下：

```bash
       $xmake -r
    or $xmake --rebuild
```
