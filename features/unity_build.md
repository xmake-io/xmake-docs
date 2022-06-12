
We know that C++ code compilation speed is usually very slow, because each code file needs to parse the imported header file.

With Unity Build, we accelerate the compilation of the project by combining multiple cpp files into one. The main benefit is to reduce the repetitive work of parsing and compiling the contents of the header files contained in multiple source files. The contents of the header files are usually It accounts for most of the code in the source file after preprocessing.

Unity build also reduces the overhead caused by having a large number of small source files by reducing the number of object files created and processed by the compilation chain, and allows inter-procedural analysis and optimization across files that form a unified build task (similar to optimization during effect linking ).

It can greatly improve the compilation speed of C/C++ code, usually by 30%. However, depending on the complexity of the project, the benefits it brings depend on the situation of the project.

xmake has also supported this build mode in v2.5.9. For related issues, see [#1019](https://github.com/xmake-io/xmake/issues/1019).

### How to enable it?

We provide two built-in rules to handle Unity Build for C and C++ code respectively.

```lua
add_rules("c.unity_build")
add_rules("c++.unity_build")
```

### Batch mode

By default, as long as the above rules are set, Unity Build in Batch mode will be enabled, that is, xmake will automatically organize and merge according to the project code files.

```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2})
    add_files("src/*.c", "src/*.cpp")
```

We can additionally specify the size of each merged Batch by setting the `{batchsize = 2}` parameter to the rule, which means that every two C++ files are automatically merged and compiled.

The compilation effect is roughly as follows:

```console
$ xmake -r
[11%]: ccache compiling.release build/.gens/test/unity_build/unity_642A245F.cpp
[11%]: ccache compiling.release build/.gens/test/unity_build/unity_bar.cpp
[11%]: ccache compiling.release build/.gens/test/unity_build/unity_73161A20.cpp
[11%]: ccache compiling.release build/.gens/test/unity_build/unity_F905F036.cpp
[11%]: ccache compiling.release build/.gens/test/unity_build/unity_foo.cpp
[11%]: ccache compiling.release build/.gens/test/unity_build/main.c
[77%]: linking.release test
[100%]: build ok
```

Since we only enabled the Unity Build of C++, the C code is still compiled one by one normally. In addition, in the Unity Build mode, we can still speed up the parallel compilation as much as possible without conflicting each other.

If the `batchsize` parameter is not set, all files will be merged into one file for compilation by default.

### Group Mode

If the automatic merging effect of the above Batch mode is not satisfactory, we can also use custom grouping to manually configure which files are merged together to participate in the compilation, which makes users more flexible and controllable.

```lua
target("test")
    set_kind("binary")
    add_rules("c++.unity_build", {batchsize = 0}) - disable batch mode
    add_files("src/*.c", "src/*.cpp")
    add_files("src/foo/*.c", {unity_group = "foo"})
    add_files("src/bar/*.c", {unity_group = "bar"})
```

We use `{unity_group = "foo"}` to specify the name of each group and which files are included. The files in each group will be merged into one code file separately.

In addition, `batchsize = 0` also forcibly disables the Batch mode, that is, if there is no unity_group grouped code files, we will still compile them separately, and will not automatically turn on automatic merging.

### Batch and Group mixed mode

As long as we change the above `batchsize = 0` to a value other than 0, we can let the remaining code files continue to open the Batch mode in the grouping mode to automatically merge and compile.

```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2})
    add_files("src/*.c", "src/*.cpp")
    add_files("src/foo/*.c", {unity_group = "foo"})
    add_files("src/bar/*.c", {unity_group = "bar"})
```

### Ignore the specified file

If it is in Batch mode, because it is an automatic merge operation, all files will be merged by default, but if some code files do not want to participate in the merge, then we can also ignore them through `{unity_ignored = true}`.

```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2})
    add_files("src/*.c", "src/*.cpp")
    add_files("src/test/*.c", {unity_ignored = true}) - ignore these files
```

### Unique ID

Although the benefits of Unity Build are good, we still encounter some unexpected situations. For example, in our two code files, under the global namespace, there are global variables and functions with the same name.

Then, merge compilation will bring about compilation conflicts, and the compiler usually reports global variable redefinition errors.

In order to solve this problem, we need to make some modifications to the user code, and then cooperate with the build tool to solve it.

For example, our foo.cpp and bar.cpp both have global variable i.

foo.cpp

```c
namespace {
    int i = 42;
}

int foo()
{
    return i;
}
```

bar.cpp

```c
namespace {
    int i = 42;
}

int bar()
{
    return i;
}
```

Then, our merge compilation will conflict, and we can introduce a Unique ID to isolate the global anonymous space.


foo.cpp

```c
namespace MY_UNITY_ID {
    int i = 42;
}

int foo()
{
    return MY_UNITY_ID::i;
}
```

bar.cpp

```c
namespace MY_UNITY_ID {
    int i = 42;
}

int bar()
{
    return MY_UNITY_ID::i;
}
```

Next, we also need to ensure that after the code is merged, the definitions of `MY_UNITY_ID` in foo and bar are completely different, and a unique ID value can be calculated according to the file name, which does not conflict with each other, which is to achieve the following merge effect:

```c
#define MY_UNITY_ID <hash(foo.cpp)>
#include "foo.c"
#undef MY_UNITY_ID
#define MY_UNITY_ID <hash(bar.cpp)>
#include "bar.c"
#undef MY_UNITY_ID
```

This may seem troublesome, but the user does not need to care about these, xmake will automatically process them when merging, the user only needs to specify the name of the Unique ID, for example, the following:


```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2, uniqueid = "MY_UNITY_ID"})
    add_files("src/*.c", "src/*.cpp")
```

Dealing with global variables, as well as global macro definitions with the same name, functions, etc., can be used in this way to avoid conflicts.

