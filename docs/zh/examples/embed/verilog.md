## iVerilog 仿真器 {#iverilog}

通过 `add_requires("iverilog")` 配置，我们能够自动拉取 iverilog 工具链包，然后使用 `set_toolchains("@iverilog")` 自动绑定工具链来编译工程。

<FileExplorer rootFilesDir="examples/embed/verilog/iverilog" />

### 设置抽象配置

```lua
add_requires("iverilog")
target("hello")
    add_rules("iverilog.binary")
    set_toolchains("@iverilog")
    add_files("src/*.v")
    add_defines("TEST")
    add_includedirs("inc")
    set_languages("v1800-2009")
```

我们可以通过 `set_languages("v1800-2009")` 来设置切换 Verilog 的语言标准。

目前支持的一些取值和映射关系如下：

```lua
["v1364-1995"] = "-g1995"
["v1364-2001"] = "-g2001"
["v1364-2005"] = "-g2005"
["v1800-2005"] = "-g2005-sv"
["v1800-2009"] = "-g2009"
["v1800-2012"] = "-g2012"
```

### 设置自定义 flags


```lua
add_requires("iverilog")
target("hello")
    add_rules("iverilog.binary")
    set_toolchains("@iverilog")
    add_files("src/*.v")
    add_values("iverilogs.flags", "-DTEST")
```

### 构建工程

```sh
$ xmake
checking for iverilog ... iverilog
checking for vvp ... vvp
[ 50%]: linking.iverilog hello.vvp
[100%]: build ok!
```

### 运行程序

```sh
$ xmake run
hello world!
LXT2 info: dumpfile hello.vcd opened for output.
src/main.v:6: $finish called at 0 (1s)
```

更多完整例子：[iVerilog Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/embed/iverilog)

## Verilator 仿真器 {#verilator}

通过 `add_requires("verilator")` 配置，我们能够自动拉取 verilator 工具链包，然后使用 `set_toolchains("@verilator")` 自动绑定到工具链来编译工程。

<FileExplorer rootFilesDir="examples/embed/verilog/verilator" />

verilator 工程，我们需要一个额外的 `sim_main.cpp` 文件参与编译，作为程序的入口代码。

```c++
#include "hello.h"
#include "verilated.h"

int main(int argc, char** argv) {
    VerilatedContext* contextp = new VerilatedContext;
    contextp->commandArgs(argc, argv);
    hello* top = new hello{contextp};
    while (!contextp->gotFinish()) { top->eval(); }
    delete top;
    delete contextp;
    return 0;
}
```

### 设置抽象配置

```lua
add_requires("verilator")
target("hello")
    add_rules("verilator.binary")
    set_toolchains("@verilator")
    add_files("src/*.v")
    add_defines("TEST")
    add_includedirs("inc")
    set_languages("v1800-2009")
```

我们可以通过 `set_languages("v1800-2009")` 来设置切换 Verilog 的语言标准。

目前支持的一些取值和映射关系如下：

```lua
-- Verilog
["v1364-1995"] = "+1364-1995ext+v",
["v1364-2001"] = "+1364-2001ext+v",
["v1364-2005"] = "+1364-2005ext+v",
-- SystemVerilog
["v1800-2005"] = "+1800-2005ext+v",
["v1800-2009"] = "+1800-2009ext+v",
["v1800-2012"] = "+1800-2012ext+v",
["v1800-2017"] = "+1800-2017ext+v",
```

### 设置自定义 flags

```lua
add_requires("verilator")
target("hello")
    add_rules("verilator.binary")
    set_toolchains("@verilator")
    add_files("src/*.v")
    add_files("src/*.cpp")
    add_values("verilator.flags", "--trace", "--timing")
```

### 构建工程

```sh
$ xmake
[  0%]: compiling.verilog src/main.v
[ 15%]: cache compiling.release /Users/ruki/.xmake/packages/v/verilator/2023.1.10/cd2268409c1d44799288c7759b3cbd56/share/verilator/include/verilated.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__Slow.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h9053a130__0__Slow.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello.cpp
[ 15%]: cache compiling.release /Users/ruki/.xmake/packages/v/verilator/2023.1.10/cd2268409c1d44799288c7759b3cbd56/share/verilator/include/verilated_threads.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello__Syms.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h07139e86__0.cpp
[ 15%]: cache compiling.release src/sim_main.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h9053a130__0.cpp
[ 84%]: linking.release hello
[100%]: build ok!
```

### 运行程序

```sh
$ xmake run
ruki-2:hello ruki$ xmake run
hello world!
- src/main.v:4: Verilog $finish
```

更多完整例子：[Verilator](https://github.com/xmake-io/xmake/tree/master/tests/projects/embed/verilator)

### 编译静态库

我们也提供了 `verilator.static` 规则来编译生成 verilator 静态库。

```lua
add_requires("verilator")
target("hello")
    add_rules("verilator.static")
    set_toolchains("@verilator")
    add_files("src/*.v")

target("test")
    add_deps("hello")
    add_files("src/*.cpp")
```
