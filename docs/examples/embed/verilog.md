
## iVerilog Simulator

Through `add_requires("iverilog")` configuration, we can automatically pull the iverilog toolchain package, and then use `set_toolchains("@iverilog")` to automatically bind the toolchain to compile the project.

```lua
add_requires("iverilog")
target("hello")
     add_rules("iverilog.binary")
     set_toolchains("@iverilog")
     add_files("src/*.v")
```

### Set abstract configuration

```Lua
add_requires("iverilog")
target("hello")
     add_rules("iverilog.binary")
     set_toolchains("@iverilog")
     add_files("src/*.v")
     add_defines("TEST")
     add_includedirs("inc")
     set_languages("v1800-2009")
```

We can use `set_languages("v1800-2009")` to set the language standard for switching Verilog.

Currently supported values and mappings are as follows:

```lua
["v1364-1995"] = "-g1995"
["v1364-2001"] = "-g2001"
["v1364-2005"] = "-g2005"
["v1800-2005"] = "-g2005-sv"
["v1800-2009"] = "-g2009"
["v1800-2012"] = "-g2012"
```

### Set custom flags


```lua
add_requires("iverilog")
target("hello")
     add_rules("iverilog.binary")
     set_toolchains("@iverilog")
     add_files("src/*.v")
     add_values("iverilogs.flags", "-DTEST")
```

### Build the project

```sh
$ xmake
check iverilog... iverilog
check vvp... vvp
[50%]: linking.iverilog hello.vvp
[100%]: build ok!
```

### Run the program

```sh
$ xmake run
hello world!
LXT2 INFO: dumpfile hello.vcd opened, ready for output.
src/main.v:6: $finish called at 0 (1s)
```

More complete examples: [iVerilog Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/embed/iverilog)

## Verilator Simulator

Through `add_requires("verilator")` configuration, we can automatically pull the verilator toolchain package, and then use `set_toolchains("@verilator")` to automatically bind to the toolchain to compile the project.

```lua
add_requires("verilator")
target("Hello")
     add_rules("verilator.binary")
     set_toolchains("@verilator")
     add_files("src/*.v")
     add_files("src/*.cpp")
```

verilator project, we need an additional `sim_main.cpp` file to participate in the compilation, as the entry code of the program.

```c++
#include "hello.h"
#include "verilated.h" (Simplified Chinese)

int main(int argc, char** argv) {
     VerilatedContext* contextp = new VerilatedContext;
     contextp->commandArgs(argc, argv);
     hello* top = new hello{contextp};
     while (!contextp->gotFinish()) { top->eval(); }
     remove top.
     Remove contextp.
     returns 0.
}
```

### Set abstract configuration

```lua
add_requires("verilator")
target("Hello")
     add_rules("verilator.binary")
     set_toolchains("@verilator")
     add_files("src/*.v")
     add_defines("TEST")
     add_includedirs("inc")
     set_languages("v1800-2009")
```

We can use `set_languages("v1800-2009")` to set the language standard for switching Verilog.

Currently supported values and mappings are as follows.

```lua
--Verilog
["v1364-1995"] = "+1364-1995ext+v".
["v1364-2001"] = "+1364-2001ext+v".
["v1364-2005"] = "+1364-2005ext+v".
--system-Verilog
["v1800-2005"] = "+1800-2005ext+v".
["v1800-2009"] = "+1800-2009ext+v".
["v1800-2012"] = "+1800-2012ext+v",
["v1800-2017"] = "+1800-2017ext+v".
```

### Set custom flags

```lua
add_requires("verilator")
target("Hello")
     add_rules("verilator.binary")
     set_toolchains("@verilator")
     add_files("src/*.v")
     add_files("src/*.cpp")
     add_values("verilator.flags", "--trace", "--timing")
```

### Build the project

```sh
$ xmake
[ 0%]: compiling.verilog src/main.v
[ 15%]: cache compiling.release /Users/ruki/.xmake/packages/v/verilator/2023.1.10/cd2268409c1d44799288c7759b3cbd56/share/verilator/include/verilated.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__Slow.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h9053a130__0__Slow.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello.cpp
[ 15%]: cache compiling.release /Users/ruki/.xmake/packages/v/verilator/2023.1.10/cd2268409c1d44799288c7759b3cbd56/share/verilator/include/verilated_threads.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello__Syms.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h07139e86__0.cpp
[15%]: cache compiling.release src/sim_main.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h9053a130__0.cpp
[84%]: linking. release hello
[100%]: build ok!
```

### Run the program

```sh
$ xmake run
ruki-2:hello ruki$ xmake run
hello world!
- src/main.v:4:Verilog $finish
```

A more complete example: [Verilator](https://github.com/xmake-io/xmake/tree/master/tests/projects/embed/verilator)

### Compile static library

We also provide `verilator.static` rules to compile and generate verilator static libraries.

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
