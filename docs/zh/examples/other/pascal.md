
2.5.8 之后，我们能够支持构建 Pascal 程序，相关 issues 见：[#388](https://github.com/xmake-io/xmake/issues/388)

## 控制台程序 {#console}

```lua
add_rules("mode.debug", "mode.release")
target("test")
    set_kind("binary")
    add_files("src/*.pas")
```

## 动态库程序 {#shared-library}

```lua
add_rules("mode.debug", "mode.release")
target("foo")
    set_kind("shared")
    add_files("src/foo.pas")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.pas")
```

更多例子：[Pascal examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/pascal)

