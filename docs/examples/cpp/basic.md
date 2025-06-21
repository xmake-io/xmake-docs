## Executable Program

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
```

For a complete example, execute the following command to create:

```bash
xmake create test
```

If we want to create c language program. We can add `-l c` argument. for example:

```bash
xmake create -l c test
```

## Static Library Program

```lua
target("foo")
    set_kind("static")
    add_files("src/foo/*.cpp")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_deps("foo")
```

We use `add_deps` to link a static library to test target.

For a complete example, execute the following command to create:

```bash
xmake create -t static test
```

If we want to create c language program. We can add `-l c` argument. for example:

```bash
xmake create -l c static test
```

## Shared Library Program

```lua
target("foo")
    set_kind("shared")
    add_files("src/foo/*.cpp")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_deps("foo")
```

We use `add_deps` to link a shared library to test target.

For a complete example, execute the following command to create:

```bash
xmake create -t shared test
```

If we want to create c language program. We can add `-l c` argument. for example:

```bash
xmake create -l c shared test
```
