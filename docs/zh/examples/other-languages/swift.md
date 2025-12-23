
## 创建空工程

```sh
$ xmake create -l swift -t console test
```

<FileExplorer rootFilesDir="examples/other-languages/swift/basic" />

## Swift 与 C++/Objective-C 互操作

从 v3.0.5 开始，xmake 支持 Swift 与 C++/Objective-C 的互操作。当设置了 `swift.interop` 目标值时，`swift.interop` 规则会自动启用，使得在同一个项目中混合使用 Swift 和 C++ 代码变得非常容易。

### 配置 Swift 互操作

您可以使用以下目标值来配置 Swift 互操作：

<FileExplorer rootFilesDir="examples/other-languages/swift/cxx_interop" />

### 互操作模式

- **`"objc"`**: Objective-C 互操作模式
- **`"cxx"`**: C++ 互操作模式

当设置 `swift.interop` 时，xmake 会自动生成 C++ 头文件，使 C++ 代码能够调用 Swift 函数。您可以使用 `swift.modulename` 定义 Swift 模块名，该名称将成为 C++ 中的命名空间。当 Swift 和 C++ 都有 main 函数时，使用 `swift.interop.cxxmain` 来避免重复的 main 符号。

更多例子见：[Swift Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/swift)
