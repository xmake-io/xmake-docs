# core.tool.linker

链接器相关操作，常用于插件开发。

## linker.link

- 执行链接

针对target，链接指定对象文件列表，生成对应的目标文件，例如：

```lua
linker.link("binary", "cc", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

其中[target](/zh/api/description/project-target)，为工程目标，这里传入，主要用于获取target特定的链接选项，
具体如果获取工程目标对象，见：[core.project.project](/zh/api/scripts/extension-modules/core/project/project)。

当然也可以不指定target，例如：

```lua
linker.link("binary", "cc", {"a.o", "b.o", "c.o"}, "/tmp/targetfile")
```

第一个参数指定链接类型，目前支持：binary, static, shared
第二个参数告诉链接器，应该作为那种源文件对象进行链接，这些对象源文件使用什么编译器编译的，例如：

| 第二个参数值 | 描述         |
| ------------ | ------------ |
| cc           | c编译器      |
| cxx          | c++编译器    |
| mm           | objc编译器   |
| mxx          | objc++编译器 |
| gc           | go编译器     |
| as           | 汇编器       |
| sc           | swift编译器  |
| rc           | rust编译器   |
| dc           | dlang编译器  |

指定不同的编译器类型，链接器会适配最合适的链接器来处理链接，并且如果几种支持混合编译的语言，那么可以同时传入多个编译器类型，指定链接器选择支持这些混合编译语言的链接器进行链接处理：

```lua
linker.link("binary", {"cc", "mxx", "sc"}, {"a.o", "b.o", "c.o"}, "/tmp/targetfile")
```

上述代码告诉链接器，a, b, c三个对象文件有可能分别是c, objc++, swift代码编译出来的，链接器会从当前系统和工具链中选择最合适的链接器去处理这个链接过程。

## linker.linkcmd

- 获取链接命令行字符串

直接获取[linker.link](#linker-link)中执行的命令行字符串，相当于：

```lua
local cmdstr = linker.linkcmd("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

注：后面`{target = target}`扩展参数部分是可选的，如果传递了target对象，那么生成的链接命令，会加上这个target配置对应的链接选项。

并且还可以自己传递各种配置，例如：

```lua
local cmdstr = linker.linkcmd("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {configs = {linkdirs = "/usr/lib"}})
```

## linker.linkargv

- 获取链接命令行参数列表

跟[linker.linkcmd](#linker-linkcmd)稍微有点区别的是，此接口返回的是参数列表，table表示，更加方便操作：

```lua
local program, argv = linker.linkargv("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

其中返回的第一个值是主程序名，后面是参数列表，而`os.args(table.join(program, argv))`等价于`linker.linkcmd`。

我们也可以通过传入返回值给[os.runv](/zh/api/scripts/builtin-modules/os#os-runv)来直接运行它：`os.runv(linker.linkargv(..))`

## linker.linkflags

- 获取链接选项

获取[linker.linkcmd](#linker-linkcmd)中的链接选项字符串部分，不带shellname和对象文件列表，并且是按数组返回，例如：

```lua
local flags = linker.linkflags("shared", "cc", {target = target})
for _, flag in ipairs(flags) do
    print(flag)
end
```

返回的是flags的列表数组。

## linker.has_flags

- 判断指定链接选项是否支持

虽然通过[lib.detect.has_flags](/zh/api/scripts/extension-modules/lib/detect/has_flags)也能判断，但是那个接口更加底层，需要指定链接器名称
而此接口只需要指定target的目标类型，源文件类型，它会自动切换选择当前支持的链接器。

```lua
if linker.has_flags(target:targetkind(), target:sourcekinds(), "-L/usr/lib -lpthread") then
    -- ok
end
```
