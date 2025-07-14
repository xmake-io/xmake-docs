---
title: 依赖包的添加和自动检测机制
tags: [xmake, 依赖包, 自动检测]
date: 2016-08-06
author: Ruki
---

xmake将依赖库、依赖头文件、依赖类型、依赖接口统一用 option 选项机制进行了封装，更在上一层引入package包的机制，使得添加和检测依赖更加的模块化，简单化。。。

下面通过一个具体实例，来看下xmake的包机制怎么使用。。

假如你现在的工程已经有了两个包：zlib.pkg，polarssl.pkg（如何构建包，后续会详细说明，现在可以参考[TBOX依赖包](https://github.com/waruqi/tbox/tree/master/pkg)下已有包的例子），你的工程目录结构如下：

```
demo
 - xmake.lua
 - src
   main.c
 - pkg
   zlib.pkg
   polarssl.pkg
```

那么你可以修改xmake.lua来使用上述的两个依赖包：





```lua
-- 添加依赖包目录，之后添加需要的包，都会从这个目录里面查找
add_packagedirs("pkg")

-- 添加目标
target("demo")

    -- 设置程序类型为二进制可执行程序
    set_kind("binary")

    -- 添加源代码文件
    add_files("src/*.c") 

    -- 通过option机制添加polarssl、zlib包，如果检测通过，会去自动链接它
    -- 第一次执行xmake config或者xmake编译的时候会去自动检测它，然后缓存配置
    -- 如果要重新检测，则可以执行 xmake config -c清除原有配置，重新配置所有。。。
    add_options("polarssl", "zlib")

    -- 设置自动生成的配置头文件，如果mysql检测通过，会生成CONFIG_PACKAGE_HAVE_MYSQL开关
    set_config_h("$(buildir)/config.h")

    -- 设置config.h宏开关的前缀: CONFIG_xxxx
    set_config_h_prefix("CONFIG")

    -- 添加头文件搜索目录，这里为了搜索到config.h
    add_includedirs("$(buildir)")
```

接下来是代码里面怎么去使用它：

```c
#include <stdio.h>

// 包含自动生成的config.h头文件
// 搜索路径设置在./build下面
#include "config.h"

// 如果当前平台存在zlib，那么使用它
#ifdef CONFIG_PACKAGE_HAVE_ZLIB
#   include "zlib/zlib.h"
#endif

// 如果当前平台存在polarssl，那么使用它
#ifdef CONFIG_PACKAGE_HAVE_POLARSSL
#   include "polarssl/polarssl.h"
#endif

int main(int argc, char** argv)
{
    printf("hello world!\n");
    return 0;
}

```

上面就是一个包使用的最简单的例子，下面我们来看下具体这个zlib.pkg是怎么生成的：

如果这个包是你自己的项目xxx开发的，那么你只需要执行xmake p进行打包，自动会在./build目录下生成一个xxx.pkg的包，你直接在其他项目中使用就行了。。。

如果是第三方的库，那么你需要自己去构建它，但是也很方便，实在不行你可以参考已有的[TBOX依赖包](https://github.com/waruqi/tbox/tree/master/pkg)中一些包，做修改就行了。。。

一个pkg包的目录结构：

```
zlib.pkg
    - inc（头文件目录，可选）
       - zlib/zlib.h
    - lib（链接库目录，可选）
       - linux/i386/libz.a
       - windows/i386/zlib.lib
    - xmake.lua（包描述文件）
```

其中 inc、lib是可选的，具体逻辑还是在xmake.lua进行描述，xmake默认生成的包逻辑，是会优先去检测zlib.pkg目录有没有当前可用的库和头文件，如果检测不通过，才会去检测系统平台的。。。

当然你也可以自己修改检测逻辑，不一定非得这么来，你只需要根据自己的需求描述xxx.pkg/xmake.lua文件就行了。。。

下面看下我这里提供的zlib.pkg/xmake.lua描述逻辑：

```lua
-- 添加一个zlib包自动配置选项
option("zlib")

    -- 设置是否在xmake f -h配置菜单中显示
    -- 如果你想让你的包在工程项目中，可以提示用户手动禁用，那么就启用他吧
    set_showmenu(true)

    -- 在xmake f -h中显示相关描述信息
    set_description("The mysql package")

    -- 如果检测通过，定义宏开关到config.h
    add_defines_h_if_ok("$(prefix)_PACKAGE_HAVE_ZLIB")

    -- 检测链接
    add_links("z")

    -- 添加检测的链接库目录，这里设置优先检测zlib.pkg/lib/下相关平台是否存在链接库，然后再去检测系统的
    -- 如果这个不去设置，xmake只能检测一些系统目录下的链接库，例如：/usr/lib, /usr/local/lib
    -- 如果常用系统目录下检测不到，但是你又装了这个库，你可以自己设定检测的搜索目录
    add_linkdirs("lib/$(plat)/$(arch)")

    -- 检测 #include "zlib/zlib.h" 是否能编译通过
    add_cincludes("zlib/zlib.h")

    -- 添加一些检测的头文件目录，默认会在zlib.pkg/inc进行搜索，当然你也可以指定其他目录
    add_includedirs("inc/$(plat)", "inc")
```

只要描述好xxx.pkg/xmake.lua， 一个包就能被xmake使用，并进行自动检测，其中利用的就是xmake的option机制，当然在包里面不仅仅可以检测依赖库和头文件，你也可以检测是否存在某些需要的接口、类型定义等等。。

而且检测机制完全采用lua语法，支持if条件逻辑，你可以针对一些特定的平台，做一些特别处理，使得你的包更加的通用。

例如下面这个基础包base.pkg的描述：

```lua
-- 基础包base.pkg
option("base")
    
    -- 如果当前为windows平台，检测ws2_32链接库依赖
    if os("windows") then add_links("ws2_32") 
    -- 如果是其他平台，检测-lm，-ldl，-lpthread依赖（由于都是些系统库，这里就没有设置搜索目录）
    else add_links("m", "dl", "pthread") end
```

如果你的包只是通过xmake.lua来描述，没有其他文件目录，那么你也可以把你的包xmake.lua的描述内容，直接嵌入到工程描述文件xmake.lua中， 这两者原本都是通用的，说白了 `add_packagedirs("pkg")` 的机制，就是调用工程描述api：`add_subdirs("pkg/*")`进行添加子工程的过程。。而xxx.pkg说白了就是一个子工程描述文件而已。。。

如果你想在你的包检测中增加对接口的检测，那么只需要用:

* `add_cfuncs`
* `add_cxxfuncs`
* `add_ctypes`
* `add_cxxtypes`

就行了

所以利用包的机制，可以让你的不同项目最大化重用你的依赖环境。。是个非常有用的功能。。

```
