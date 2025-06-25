
# print

- 换行打印终端日志

此接口也是lua的原生接口，xmake在原有行为不变的基础上也进行了扩展，同时支持：格式化输出、多变量输出。

先看下原生支持的方式：

```lua
print("hello xmake!")
print("hello", "xmake!", 123)
```

并且同时还支持扩展的格式化写法：

```lua
print("hello %s!", "xmake")
print("hello xmake! %d", 123)
```

xmake会同时支持这两种写法，内部会去自动智能检测，选择输出行为。
