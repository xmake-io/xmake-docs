
## 可执行程序 {#executable}

```lua
target("test")
    set_kind("binary")
    add_files("src/*cpp")
```

完整例子请执行下面的命令来创建：

```bash
xmake create test
```

如果我们想创建 C 语言程序，只需要添加 `-l c` 命令行参数，例如：

```bash
xmake create -l c test
```

## 静态库程序 {#static-library}

```lua
target("foo")
    set_kind("static")
    add_files("src/foo/*.cpp")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_deps("foo")
```

通过`add_deps`将一个静态库自动链接到test可执行程序。

完整例子请执行下面的命令来创建：

```bash
xmake create -t static test
```

如果我们想创建 C 语言程序，只需要添加 `-l c` 命令行参数，例如：

```bash
xmake create -l c -t static test
```

## 动态库程序 {#shared-library}

```lua
target("foo")
    set_kind("shared")
    add_files("src/foo/*.cpp")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_deps("foo")
```

通过`add_deps`将一个动态库自动链接到test可执行程序。

完整例子请执行下面的命令来创建：

```bash
xmake create -t shared test
```

如果我们想创建 C 语言程序，只需要添加 `-l c` 命令行参数，例如：

```bash
xmake create -l c -t shared test
```
