

## 可执行程序 {#executable}

```lua
target("hello")
    add_rules("c51.binary")
    set_toolchains("c51")
    add_files("src/main.c")
```
