
## Create an empty project

```sh
$ xmake create -l swift -t console test
```

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.swift")
```

## Swift Interop with C++/Objective-C

Starting from v3.0.5, xmake supports Swift interop with C++/Objective-C. When the `swift.interop` target value is set, the `swift.interop` rule is automatically enabled, making it easy to mix Swift and C++ code in the same project.

### Configure Swift Interop

You can configure Swift interop using the following target values:

```lua
target("cxx_interop")
    set_kind("binary")
    set_languages("cxx20")
    add_files("lib/**.swift", {public = true})
    add_files("src/**.cpp")
    set_values("swift.modulename", "SwiftFibonacci")           -- Set the Swift module name
    set_values("swift.interop", "cxx")                         -- Enable interop: "objc" or "cxx"
    set_values("swift.interop.headername", "fibonacci-Swift.h") -- Define output header name
    set_values("swift.interop.cxxmain", true)                  -- Force -parse-as-library to avoid duplicate main symbols
```

### Interop Modes

- **`"objc"`**: Objective-C interop mode
- **`"cxx"`**: C++ interop mode

When `swift.interop` is set, xmake automatically generates the C++ header file that allows C++ code to call Swift functions. You can use `swift.modulename` to define the Swift module name, which becomes the namespace in C++. When both Swift and C++ have main functions, use `swift.interop.cxxmain` to avoid duplicate main symbols.

For more examples, see: [Swift Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/swift)
