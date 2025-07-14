---
title: xmake高级特性之合并静态库
tags: [xmake, 静态库]
date: 2016-02-04
author: Ruki
---

title: xmake高级特性之合并静态库
tags: [xmake, 静态库]
date: 2016-02-04
author: Ruki

---
xmake的add_files接口不仅可以添加源代码文件进行编译，还可以直接添加*.o/obj对象文件、以及*.a/lib的库文件到编译目标中，这个跟add_links是有区别的

* add_links：只能添加链接，例如： -lxxxx 这种，链接的目标也只能是可执行程序、动态库，而且只会链接需要的代码进去
* add_files：是直接将静态库中的所有对象文件，解包、重新打包到新的target中，这个target可以是新的静态库，也可以是可执行程序、或者动态库

例如：

```lua
    target("test")
        
         -- 生成静态库：libtest.a
         set_kind("static")

         -- 添加对象文件
         add_files("obj/*.o")

         -- 添加静态库，将里面的对象文件重新打包到libtest.a中，生成新的静态库
         add_files("lib/*.a")
```

这个target模块，可以没有任何源码，单纯的将所有静态库、对象文件重新打包到一个新的静态库中，当然再加一些源文件也是可以的



target的类型也没有限定，你也可以指定输出为动态库：shared，可执行程序：binary

例如：

```lua
    target("test2")
        
         -- 生成动态库：libtest2.so
         set_kind("shared")

         -- 添加对象文件
         add_files("obj/*.o")

         -- 添加静态库libtest.a中的所有对象文件
         add_files("lib/libtest.a")

         -- 添加一些源文件
         add_files("src/*.c")
```