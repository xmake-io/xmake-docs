# Basic Examples

We briefly introduce some commonly used project examples. More and more complete examples projects can be viewed in [project examples](https://github.com/xmake-io/xmake/tree/master/tests/projects).

We can also use the `xmake create` command to create various commonly used empty projects to quickly start. For the introduction of this command and the supported project templates, you can type the following command to view:

```sh
xmake create --help
```

## Executable Program

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
```

For a complete example, execute the following command to create:

```sh
xmake create test
```

<FileExplorer 
  rootFilesDir="examples/cpp/basic_console" 
  title="Executable Program"
  :highlights="{ 'src/main.cpp': '5-7' }"
/>

If we want to create c language program. We can add `-l c` argument. for example:

```sh
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

```sh
xmake create -t static test
```

If we want to create c language program. We can add `-l c` argument. for example:

```sh
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

```sh
xmake create -t shared test
```

If we want to create c language program. We can add `-l c` argument. for example:

```sh
xmake create -l c shared test
```
