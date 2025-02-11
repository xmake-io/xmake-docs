
我们知道，C++ 代码编译速度通常很慢，因为每个代码文件都需要解析引入的头文件。

而通过 Unity Build，我们通过将多个 cpp 文件组合成一个来加速项目的编译，其主要好处是减少了解析和编译包含在多个源文件中的头文件内容的重复工作，头文件的内容通常占预处理后源文件中的大部分代码。

Unity 构建还通过减少编译链创建和处理的目标文件的数量来减轻由于拥有大量小源文件而导致的开销，并允许跨形成统一构建任务的文件进行过程间分析和优化（类似于效果链接时优化）。

它可以极大提升 C/C++ 代码的编译速度，通常会有 30% 的速度提升，不过根据项目的复杂程度不同，其带来的效益还是要根据自身项目情况而定。

xmake 在 v2.5.9 版本中，也已经支持了这种构建模式。相关 issues 见 [#1019](https://github.com/xmake-io/xmake/issues/1019)。

### 如何启用？

我们提供了两个内置规则，分别处理对 C 和 C++ 代码的 Unity Build。

```lua
add_rules("c.unity_build")
add_rules("c++.unity_build")
```

### Batch 模式

默认情况下，只要设置上述规则，就会启用 Batch 模式的 Unity Build，也就是 xmake 自动根据项目代码文件，自动组织合并。

```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2})
    add_files("src/*.c", "src/*.cpp")
```

我们可以额外通过设置 `{batchsize = 2}` 参数到规则，来指定每个合并 Batch 的大小数量，这里也就是每两个 C++ 文件自动合并编译。

编译效果大概如下：

```console
$ xmake -r
[ 11%]: cache compiling.release build/.gens/test/unity_build/unity_642A245F.cpp
[ 11%]: cache compiling.release build/.gens/test/unity_build/unity_bar.cpp
[ 11%]: cache compiling.release build/.gens/test/unity_build/unity_73161A20.cpp
[ 11%]: cache compiling.release build/.gens/test/unity_build/unity_F905F036.cpp
[ 11%]: cache compiling.release build/.gens/test/unity_build/unity_foo.cpp
[ 11%]: cache compiling.release build/.gens/test/unity_build/main.c
[ 77%]: linking.release test
[100%]: build ok
```

由于我们仅仅启用了 C++ 的 Unity Build，所以 C 代码还是正常挨个编译。另外在 Unity Build 模式下，我们还是可以做到尽可能的并行编译加速，互不冲突。

如果没有设置 `batchsize` 参数，那么默认会把所有文件合并到一个文件中进行编译。

### Group 模式

如果上面的 Batch 模式自动合并效果不理想，我们也可以使用自定义分组，来手动配置哪些文件合并到一起参与编译，这使得用户更加地灵活可控。

```lua
target("test")
    set_kind("binary")
    add_rules("c++.unity_build", {batchsize = 0}) -- disable batch mode
    add_files("src/*.c", "src/*.cpp")
    add_files("src/foo/*.c", {unity_group = "foo"})
    add_files("src/bar/*.c", {unity_group = "bar"})
```

我们使用 `{unity_group = "foo"}` 来指定每个分组的名字，以及包含了哪些文件，每个分组的文件都会单独被合并到一个代码文件中去。

另外，`batchsize = 0` 也强行禁用了 Batch 模式，也就是说，没有设置 unity_group 分组的代码文件，我们还是会单独编译它们，也不会自动开启自动合并。

### Batch 和 Group 混合模式

我们只要把上面的 `batchsize = 0` 改成非 0 值，就可以让分组模式下，剩余的代码文件继续开启 Batch 模式自动合并编译。

```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2})
    add_files("src/*.c", "src/*.cpp")
    add_files("src/foo/*.c", {unity_group = "foo"})
    add_files("src/bar/*.c", {unity_group = "bar"})
```

### 忽略指定文件

如果是 Batch 模式下，由于是自动合并操作，所以默认会对所有文件执行合并，但如果有些代码文件我们不想让它参与合并，那么我们也可以通过 `{unity_ignored = true}` 去忽略它们。

```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2})
    add_files("src/*.c", "src/*.cpp")
    add_files("src/test/*.c", {unity_ignored = true}) -- ignore these files
```

### Unique ID

尽管 Unity Build 带啦的收益不错，但是我们还是会遇到一些意外的情况，比如我们的两个代码文件里面，全局命名空间下，都存在相同名字的全局变量和函数。

那么，合并编译就会带来编译冲突问题，编译器通常会报全局变量重定义错误。

为了解决这个问题，我们需要用户代码上做一些修改，然后配合构建工具来解决。

比如，我们的 foo.cpp 和 bar.cpp 都有全局变量 i。

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

那么，我们合并编译就会冲突，我们可以引入一个 Unique ID 来隔离全局的匿名空间。


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

接下来，我们还需要保证代码合并后， `MY_UNITY_ID` 在 foo 和 bar 中的定义完全不同，可以按文件名算一个唯一 ID 值出来，互不冲突，也就是实现下面的合并效果：

```c
#define MY_UNITY_ID <hash(foo.cpp)>
#include "foo.c"
#undef MY_UNITY_ID
#define MY_UNITY_ID <hash(bar.cpp)>
#include "bar.c"
#undef MY_UNITY_ID
```

这看上去似乎很麻烦，但是用户不需要关心这些，xmake 会在合并时候自动处理它们，用户只需要指定这个 Unique ID 的名字就行了，例如下面这样：


```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2, uniqueid = "MY_UNITY_ID"})
    add_files("src/*.c", "src/*.cpp")
```

处理全局变量，还有全局的重名宏定义，函数什么的，都可以采用这种方式来避免冲突。

