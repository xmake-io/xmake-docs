## 使用 C 库 {#use-c-library}

<FileExplorer rootFilesDir="examples/protobuf/c" />

我们还可以设置 `proto_public = true` 来导出 proto 的头文件搜索目录，开放给其他父 target 继承使用。

```lua
    add_packages("protobuf-c", {public = true})
    add_files("src/**.proto", {proto_public = true})
```

::: tip 注意
由于 protobuf 生成的头文件引用了 protobuf-c 包的头文件，因此，我们也需要将包的头文件标记为 `{public = true}` 对外导出它。
:::

## 使用 C++ 库 {#use-cpp-library}

<FileExplorer rootFilesDir="examples/protobuf/cpp" />

我们还可以设置 `proto_public = true` 来导出 proto 的头文件搜索目录，开放给其他父 target 继承使用。

```lua
    add_packages("protobuf-cpp", {public = true})
    add_files("src/**.proto", {proto_public = true})
```

::: tip 注意
由于 protobuf 生成的头文件引用了 protobuf-cpp 包的头文件，因此，我们也需要将包的头文件标记为 `{public = true}` 对外导出它。
:::

