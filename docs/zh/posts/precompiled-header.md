---
title: 不同编译器对预编译头文件的处理
tags: [xmake, lua, 预编译头文件, c++编译加速, 优化编译, 跨平台]
date: 2017-07-31
author: Ruki
outline: deep
---

最近为了给[xmake](https://xmake.io)实现预编译头文件的支持，研究了下各大主流编译器处理预编译头的机制以及之间的一些差异。

现在的大部分c/c++编译器都是支持预编译头的，例如：gcc，clang，msvc等，用于优化c++代码的编译速度，毕竟c++的头文件如果包含了模板定义的话，编译速度是很慢的，
如果能够吧大部分通用的头文件放置在一个`header.h`中，在其他源码编译之前预先对其进行编译，之后的代码都能重用这部分预编译头，就可以极大程度上减少频繁的头文件冗余编译。

但是不同编译器对它的支持力度和处理方式，还是有很大差异的，并不是非常通用，在xmake中封装成统一的接口和使用方式，还是费了很大的功夫才搞定。

#### msvc的预编译头处理

预编译头在msvc的项目中很常见，经常会看到类似`stdafx.cpp`, `stdafx.h`的文件，就是用于此目的，而msvc编译器是通过编译`stdafx.cpp`来生成预编译头文件`stdafx.pch`的。

创建预编译头的命令行如下：

```bash
$ cl.exe -c -Yc -Fpstdafx.pch -Fostdafx.obj stdafx.cpp
```

其中，`-Yc`就是创建预编译头`stdafx.pch`的意思，通过`-Fp`来指定`*.pch`的输出文件路径，用`-Fo`指定编译`stdafx.cpp`生成对象文件。

其他源码是如何使用这个`stdafx.pch`的呢，通过将`stdafx.h`传入`-Yu`来告诉编译器，编译当前代码，忽略`#include "stdafx.h"`，直接使用已经编译好的`stdafx.pch`文件。

```bash
$ cl.exe -c -Yustdafx.h -Fpstdafx.pch -Fotest.obj test.cpp
```

最后链接的时候，需要把：`stdafx.obj`, `test.obj`都连接上才行，这个也是和gcc, clang编译器不同的地方。

```bash
$ link.exe -out:test test.obj stdafx.obj
```

注：一定要吧`stdafx.obj`也链接上哦，虽然`stdafx.cpp`仅用于生成`stdafx.pch`，但是对象文件也是需要。

还有个跟gcc, clang有区别的地方是，msvc的`-Yu`指定`stdafx.h`必须是`#include "stdafx.h"`中的头文件名字，不是文件路径哦。






#### clang的预编译头文件处理

个人感觉clang的预编译头文件支持方式最为友好，也最为简单。

相比于msvc，不需要`stdafx.cpp`，只需要一个头文件`stdafx.h`就可以生成pch文件。
相比于gcc，可以灵活控制pch文件的路径，更加灵活。

编译头文件生成pch文件：

```bash
$ clang -c -o stdafx.pch stdafx.h
```

使用预编译头文件：

```bash
$ clang -c -include stdafx.h -include-pch stdafx.pch -o test.o test.cpp
```

其中`-include stdafx.h`用于忽略编译`test.cpp`中的`#include "stdafx.h"`，通过`-include-pch`使用预先编译好的`stdafx.pch`。

并且这里指定的`stdafx.h`和`stdafx.pch`不仅可以是在includedir搜索路径下的文件，也可以指定全路径文件名，非常灵活，例如：

```bash
$ clang -c -include inc/stdafx.h -include-pch out/stdafx.pch -o test.o test.cpp
```

#### gcc的预编译头文件处理

gcc的预编译头处理方式基本上跟clang的类似，唯一的区别就是：它不支持`-include-pch`参数，因此不能所以指定使用的`stdafx.pch`文件路径。

它有自己的搜索规则：

1. 从`stdafx.h`所在目录中，查找`stdafx.h.pch`文件是否存在
2. 从`-I`的头文件搜索路径找查找`stdafx.h.pch`

编译头文件生成pch文件：

```bash
$ gcc -c -o stdafx.pch stdafx.h
```

使用预编译头文件：

```bash
$ gcc -c -include stdafx.h -o test.o test.cpp
```

为了让上述代码正常编译，`stdafx.h.pch`必须放置在`stdafx.h`的相同目录下，这样编译才能找到，目前我还没有找到可以所以指定输出目录的方法。

#### 其他注意点

gcc、clang对于`*.h`的头文件编译，默认是作为c预编译头来使用的，这跟c++的pch是不一样的，无法给c++的代码使用，如果要生成c++可用的pch文件，必须要告诉编译器，如何去编译`stdafx.h`。

这个可以通过`-x c++-header`参数来解决：

```bash
$ gcc -c -x c++-header -o stdafx.pch stdafx.h
```

当然也可以通过修改后缀名来解决：

```bash
$ gcc -c -o stdafx.pch stdafx.hpp
```

#### xmake对预编译头文件的支持

xmake支持通过预编译头文件去加速`c/c++`程序编译，目前支持的编译器有：gcc, clang和msvc。

对于c预编译头文件的使用方式如下：

```lua
target("test")
    set_pcheader("header.h")
```

如果是对c++头文件的预编译，改成：

```lua
target("test")
    set_pcxxheader("header.h")
```

更多使用说明见：[target.set_pcheader](https://xmake.io/zh/)

#### 参考资料

[Speed up C++ compilation, part 1: precompiled headers](https://xmake.io/zh/)