
## Create an empty project

```sh
$ xmake create -l swift -t console test
```

<FileExplorer rootFilesDir="examples/other-languages/swift/basic" />

## Swift Interop with C++/Objective-C

Starting from v3.0.5, xmake supports Swift interop with C++/Objective-C. When the `swift.interop` target value is set, the `swift.interop` rule is automatically enabled, making it easy to mix Swift and C++ code in the same project.

### Configure Swift Interop

You can configure Swift interop using the following target values:

<FileExplorer rootFilesDir="examples/other-languages/swift/cxx_interop" />

### Interop Modes

- **`"objc"`**: Objective-C interop mode
- **`"cxx"`**: C++ interop mode

When `swift.interop` is set, xmake automatically generates the C++ header file that allows C++ code to call Swift functions. You can use `swift.modulename` to define the Swift module name, which becomes the namespace in C++. When both Swift and C++ have main functions, use `swift.interop.cxxmain` to avoid duplicate main symbols.

For more examples, see: [Swift Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/swift)
