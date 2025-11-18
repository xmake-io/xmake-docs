---
title: 插件开发之色彩高亮显示
tags: [xmake, 插件, 终端色彩高亮]
date: 2016-07-14
author: Ruki
outline: deep
---

xmake在开发插件脚本的时候，除了可以使用lua内置的print进行终端输出外，还可以通过另外一个接口：`cprint`实现终端的色彩高亮输出

例如：

```lua
    cprint('${bright}hello xmake')
    cprint('${red}hello xmake')
    cprint('${bright green}hello ${clear}xmake')
    cprint('${blue onyellow underline}hello xmake${clear}')
    cprint('${red}hello ${magenta}xmake')
    cprint('${cyan}hello ${dim yellow}xmake')
```

显示结果如下：

![cprint_colors](/assets/img/posts/xmake/cprint_colors.png)



跟颜色相关的描述，都放置在 `${  }` 里面，可以同时设置多个不同的属性，例如：

```lua
    ${bright red underline onyellow}
```

表示：高亮红色，背景黄色，并且带下滑线

所有这些描述，都会影响后面一整行字符，如果只想显示部分颜色的文字，可以在结束位置，插入`${clear}`清楚前面颜色描述

例如：

```lua
    ${red}hello ${clear}xmake
```

这样的话，仅仅hello是显示红色，其他还是正常默认黑色显示。

其他颜色属于，我这里就不一一介绍，直接贴上xmake代码里面的属性列表吧：

```lua
    colors.keys = 
    {
        -- 属性
        reset       = 0 -- 重置属性
    ,   clear       = 0 -- 清楚属性
    ,   default     = 0 -- 默认属性
    ,   bright      = 1 -- 高亮
    ,   dim         = 2 -- 暗色
    ,   underline   = 4 -- 下划线
    ,   blink       = 5 -- 闪烁
    ,   reverse     = 7 -- 反转颜色
    ,   hidden      = 8 -- 隐藏文字

        -- 前景色 
    ,   black       = 30
    ,   red         = 31
    ,   green       = 32
    ,   yellow      = 33
    ,   blue        = 34
    ,   magenta     = 35 
    ,   cyan        = 36
    ,   white       = 37

        -- 背景色 
    ,   onblack     = 40
    ,   onred       = 41
    ,   ongreen     = 42
    ,   onyellow    = 43
    ,   onblue      = 44
    ,   onmagenta   = 45
    ,   oncyan      = 46
    ,   onwhite     = 47
```

除了可以色彩高亮显示外，如果你的终端是在macosx下，lion以上的系统，xmake还可以支持emoji表情的显示哦，对于不支持系统，会
忽略显示，例如：

```lua
    cprint("hello xmake${beer}")
    cprint("hello${ok_hand} xmake")
```

上面两行代码，我打印了一个homebrew里面经典的啤酒符号，下面那行打印了一个ok的手势符号，是不是很炫哈。。

![cprint_emoji](/assets/img/posts/xmake/cprint_emoji.png)

所有的emoji表情，以及xmake里面对应的key，都可以通过[emoji符号](http://www.emoji-cheat-sheet.com/)里面找到。。

最后再来张，高亮版本的xmake主菜单界面，嘿嘿。。

![mainmenu](/assets/img/posts/xmake/mainmenu.png)
