## Swig

We can use Swig to develop Python modules. For a detailed introduction, please see: [Python Modules with Swig](/zh/examples/cpp/swig.html#python-c-module)

## Cython

We can also use Cython to build Python modules.

```lua
add_rules("mode.debug", "mode.release")
add_requires("python 3.x")

target("example")
    add_rules("python.cython")
    add_files("src/*.py")
    add_packages("python")
```

```python [example.py]
print("Hello, world!")
```

## PyBind

We can also use pybind11 to build python modules.

```lua
add_rules("mode.release", "mode.debug")
add_requires("pybind11")

target("example")
    add_rules("python.module")
    add_files("src/*.cpp")
    add_packages("pybind11")
    set_languages("c++11")
```

```c++ [example.cpp]
#include <pybind11/pybind11.h>

#define STRINGIFY(x) #x
#define MACRO_STRINGIFY(x) STRINGIFY(x)

int add(int i, int j) {
    return i + j;
}

namespace py = pybind11;

PYBIND11_MODULE(example, m) {
    m.doc() = R"pbdoc(
        Pybind11 example plugin
        -----------------------
        .. currentmodule:: example
        .. autosummary::
           :toctree: _generate
           add
           subtract
    )pbdoc";

    m.def("add", &add, R"pbdoc(
        Add two numbers
        Some other explanation about the add function.
    )pbdoc");

    m.def("subtract", [](int i, int j) { return i - j; }, R"pbdoc(
        Subtract two numbers
        Some other explanation about the subtract function.
    )pbdoc");

#ifdef VERSION_INFO
    m.attr("__version__") = MACRO_STRINGIFY(VERSION_INFO);
#else
    m.attr("__version__") = "dev";
#endif
}
```
