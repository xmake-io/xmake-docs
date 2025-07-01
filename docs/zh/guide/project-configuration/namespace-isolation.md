# 命名空间隔离 {#namespace-isolation}

如果用户维护了两个独立的子工程，它们内部存在一些同名的 目标，选项，以及规则名，那么通过 includes 整合到一个工程中时，可能会存在命名冲突问题导致编译出错。

为了规避这么问题，Xmake 提供了命名空间的特性，来隔离不同的工程到到独立的命名空间中去，使其既可以独立构建，也可以合并且保证不冲突，例如：

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

add_defines("ROOT")

namespace("ns1", function ()
    includes("foo")
end)

target("foo")
    set_kind("binary")
    add_deps("ns1::foo")
    add_files("src/main.cpp")
    add_defines("TEST")
```

```lua [foo/xmake.lua]
add_defines("NS1_ROOT")
target("foo")
    set_kind("static")
    add_files("src/foo.cpp")
    add_defines("FOO")
```

上述配置，foo 是一个独立的工程目录，可以单独构建，它是一个库工程。

但是我们又可以通过 `includes("foo")` 引入到另外一个工程中使用，那个工程也有一个同名的 foo 目标。

由于命名空间的隔离，它们之间并不会导致冲突，我们可以通过 `ns1::foo` 去访问 foo 子工程中的目标。另外命名空间中的根作用域配置也不会互相影响。

更多关于命名空间的使用说明，请查看完整文档：[命名空间 API 手册](/zh/api/description/global-interfaces#namespace)。
