---
title: 利用debug库实现对lua的性能分析
tags: [xmake, lua, 性能分析]
date: 2017-01-12
author: Ruki
---

之前在给[xmake](/cn/project)做构建的效率优化的时候，需要对lua脚本的api调用性能进行分析，分析出最耗时一些lua调用api，
找出性能瓶颈，来针对性地进行优化，那么问题来了，如果对lua脚本像c程序那样进行profile呢？

我们现在看下最后实现完的最终效果：

```
 4.681,  98.84%,       1, anonymous                     : actions/build/main.lua: 36
 3.314,  69.98%,       1, anonymous                     : actions/build/main.lua: 66
 3.314,  69.98%,       1, build                         : actions/build/builder.lua: 127
 3.298,  69.65%,       2, _build_target                 : actions/build/builder.lua: 41
 3.298,  69.65%,       2, script                        : actions/build/builder.lua: 30
 2.590,  54.70%,       2, buildall                      : actions/build/kinds/object.lua: 174
 2.239,  47.27%,     468, resume                        : core/sandbox/modules/coroutine.lua: 40
 2.226,  47.00%,     468, anonymous                     : actions/build/kinds/object.lua: 242
 2.073,  43.77%,       3, _build_target_and_deps        : actions/build/builder.lua: 64
 2.047,  43.22%,     468, _build                        : actions/build/kinds/object.lua: 79
 2.034,  42.96%,       1, build                         : actions/build/kinds/static.lua: 31
 1.190,  25.13%,       1, build                         : actions/build/kinds/binary.lua: 31
 0.806,  17.03%,       8, load                          : core/base/interpreter.lua: 527
 0.766,  16.18%,       2, run                           : core/project/task.lua: 393
 0.711,  15.01%,       1, anonymous                     : actions/config/main.lua: 132
 0.615,  12.99%,    2117, vformat                       : core/sandbox/modules/string.lua: 40
 0.593,  12.53%,      16, defaults                      : core/base/option.lua: 803
 0.593,  12.52%,       1, save                          : core/base/option.lua: 131
 0.475,  10.03%,       2, anonymous                     : /Users/ruki/projects/personal/tbox/xmake.lua: 0
```

其中第一列为当前调用的耗时（单位：cpu时钟数），第二列为耗时占比，第三列为调用次数，然后是函数名和源代码位置。

#### debug.sethook简介

其实lua自带的debug就可以做到：

```
debug库提供了一种hook的方式，可以通过注册一个handler函数，在lua脚本运行到某个调用时，会触发这个handler，
获取到相应的执行信息，并且给你一个记录和数据维护的机会。
```

它主要有四种事件会触发这个handler的调用：

1. 当调用一个lua函数的时候，会触发call事件
2. 当函数返回的时候，会触发一个return事件
3. 当执行下一行代码的时候，会触发一个line事件
4. 当运行指定数目的指令后，会触发count事件

我们可以通过`debug.sethook`这个函数来注册一个hook的handler，他有三个参数：

1. handler的处理函数，hook事件触发后被调用
2. 描述需要hook的事件类型，call、return和line事件分别对应：'c', 'r', 'l'，可以互相组合成一个字符串
3. 获取count事件的频率（可选）






如果需要

要想关掉hooks，只需要不带参数地调用sethook即可。

例如：

最简单的trace，仅仅打印每条执行语句的行号：

```lua
debug.sethook(print, "l")
```

显示结果如下：

```
line	136
line	113
line	76
line	77
line	113
line	118
```

我们也可以自定义一个handler，传入第一个参数，通过debug库的getinfo获取正在执行的代码文件路径：

```lua
debug.sethook(function (event, line)
    print(debug.getinfo(2).short_src .. ":" .. line)
end, "l")
```

显示结果如下：

```
/usr/local/share/xmake/core/base/path.lua:46
/usr/local/share/xmake/core/base/path.lua:47
/usr/local/share/xmake/core/base/path.lua:56
/usr/local/share/xmake/core/base/string.lua:32
/usr/local/share/xmake/core/base/string.lua:33
/usr/local/share/xmake/core/base/string.lua:34
/usr/local/share/xmake/core/base/string.lua:35
/usr/local/share/xmake/core/base/string.lua:36
/usr/local/share/xmake/core/base/string.lua:38
/usr/local/share/xmake/core/base/string.lua:33
```

如果需要禁用之前的hook，只需要调用：

```lua
debug.sethook()
```

#### profiler性能分析器的实现

实现一个profiler类，通过下面的方式进行记录：

```lua

-- 开始记录
profiler.start()

-- TODO
-- ...

-- 结束记录
profiler.stop()
```

相关实现代码如下：

```lua
-- start profiling
function profiler:start(mode)

    -- 初始化报告
    self._REPORTS           = {}
    self._REPORTS_BY_TITLE  = {}

    -- 记录开始时间
    self._STARTIME = os.clock()

    -- 开始hook，注册handler，记录call和return事件
    debug.sethook(profiler._profiling_handler, 'cr', 0)
end

-- stop profiling
function profiler:stop(mode)

    -- 记录结束时间
    self._STOPTIME = os.clock()

    -- 停止hook
    debug.sethook()

    -- 记录总耗时
    local totaltime = self._STOPTIME - self._STARTIME

    -- 排序报告
    table.sort(self._REPORTS, function(a, b)
        return a.totaltime > b.totaltime
    end)

    -- 格式化报告输出
    for _, report in ipairs(self._REPORTS) do
        
        -- calculate percent
        local percent = (report.totaltime / totaltime) * 100
        if percent < 1 then
            break
        end

        -- trace
        utils.print("%6.3f, %6.2f%%, %7d, %s", report.totaltime, percent, report.callcount, report.title)
    end
end
```

实现很简单，主要就是记录开始和结束时间，然后排序下最终的报表，进行格式化打印输出。

其中，计时函数使用了`os.clock`接口，返回一个程序使用CPU时间的一个近似值，不是毫秒哦，我们这边仅仅是为了分析性能瓶颈。

就算不获取精确毫秒数，也是可以的（其实用毫秒也没什么意义，这种debug.sethook的方式原本就不是很精确），只要通过耗时占比就可以分析。

接下来，就是handler函数中，对call和return事件，进行分别处理，累计每个函数的调用总时间，调用总次数。

```lua
-- profiling call
function profiler:_profiling_call(funcinfo)

    -- 获取当前函数对应的报告，如果不存在则初始化下
    local report = self:_func_report(funcinfo)
    assert(report)

    -- 记录这个函数的起始调用事件
    report.calltime    = os.clock()

    -- 累加这个函数的调用次数
    report.callcount   = report.callcount + 1

end

-- profiling return
function profiler:_profiling_return(funcinfo)

    -- 记录这个函数的返回时间
    local stoptime = os.clock()

    -- 获取当前函数的报告
    local report = self:_func_report(funcinfo)
    assert(report)

    -- 计算和累加当前函数的调用总时间
    if report.calltime and report.calltime > 0 then
		report.totaltime = report.totaltime + (stoptime - report.calltime)
        report.calltime = 0
	end
end

-- the profiling handler
function profiler._profiling_handler(hooktype)

    -- 获取当前函数信息
    local funcinfo = debug.getinfo(2, 'nS')

    -- 根据事件类型，分别处理 
    if hooktype == "call" then
        profiler:_profiling_call(funcinfo)
    elseif hooktype == "return" then
        profiler:_profiling_return(funcinfo)
    end
end
```

简单吧，最后就是通过函数，获取指定的报告了，这个就不多说了，简单贴下代码吧：

```lua

-- get the function title
function profiler:_func_title(funcinfo)

    -- check
    assert(funcinfo)

    -- the function name
    local name = funcinfo.name or 'anonymous'

    -- the function line
    local line = string.format("%d", funcinfo.linedefined or 0)

    -- the function source
    local source = funcinfo.short_src or 'C_FUNC'
    if os.isfile(source) then
        source = path.relative(source, xmake._PROGRAM_DIR)
    end

    -- make title
    return string.format("%-30s: %s: %s", name, source, line)
end

-- get the function report
function profiler:_func_report(funcinfo)

    -- get the function title
    local title = self:_func_title(funcinfo)

    -- get the function report
    local report = self._REPORTS_BY_TITLE[title]
    if not report then
        
        -- init report
        report = 
        {
            title       = self:_func_title(funcinfo)
        ,   callcount   = 0
        ,   totaltime   = 0
        }

        -- save it
        self._REPORTS_BY_TITLE[title] = report
        table.insert(self._REPORTS, report)
    end

    -- ok?
    return report
end
```

需要注意的是，通过debug.sethook的方式，进行hook计时本身也是有性能损耗的，因此不可能完全精确，如果改用c实现也许会好些。

不过，对于平常的性能瓶颈分析，应该够用了。。

#### 结语

这里只是一个简单的例子，稍微扩展下，还是可以实现lua脚本的api实时调用追踪（也就是trace）。

完整代码，可以到xmake的源码中翻看：[profiler代码](https://github.com/xmake-io/xmake/blob/master/xmake/core/base/profiler.lua)

里面除了性能分析，trace调用也有实现。

最后，如果大家想快速体验下这个profiler的效果，可以直接运行xmake：

```
xmake --profile
```

这个`--profile`是给xmake调试分析的时候使用，一般也就我自己用用，发现某些xmake操作很慢，想要查找问题原因的时候，不需要改代码，只需要快速的加上这个参数，重跑下就行了。。

顺带的提下，xmake另外两个调试相关的参数：

1. `-v/--verbose`：显示详细输出信息，编译时还会显示详细警告信息。
2. `--backtrace`：出错的时候，显示详细栈信息，用于快速issues反馈，辅助定位问题。

lua的debug库还是非常强大的，有兴趣的同学可以进一步去挖掘debug的各种特性哦。