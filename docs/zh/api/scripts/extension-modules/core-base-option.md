
# core.base.option

一般用于获取xmake命令参数选项的值，常用于插件开发。

## option.get

- 获取参数选项值

在插件开发中用于获取参数选项值，例如：

```lua
-- 导入选项模块
import("core.base.option")

-- 插件入口函数
function main(...)
    print(option.get("info"))
end
```

上面的代码获取hello插件，执行：`xmake hello --info=xxxx` 命令时候传入的`--info=`选项的值，并显示：`xxxx`

对于非main入口的task任务或插件，可以这么使用：

```lua
task("hello")
    on_run(function ())
        import("core.base.option")
        print(option.get("info"))
    end)
```
