
# raise

- 抛出异常

#### 函数原型

```lua
raise(message: <string>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| message | 错误信息字符串 |

#### 用法说明

如果想在自定义脚本、插件任务中中断xmake运行，可以使用这个接口抛出异常，如果上层没有显示调用[try-catch](/zh/api/scripts/builtin-modules/try-catch-finally)捕获的话，xmake就会中断执行，并且显示出错信息。

另外，这会导致 xmake 程序终止退出。

```lua
if (errors) raise(errors)
```

如果在 try 块中抛出异常，就会在 catch 和 finally 中进行错误信息捕获，具体见：[try-catch](/zh/api/scripts/builtin-modules/try-catch-finally)
