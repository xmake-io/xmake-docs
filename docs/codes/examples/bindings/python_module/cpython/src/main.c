#include <Python.h>

static PyObject* example_hello(PyObject* self, PyObject* args) {
    return Py_BuildValue("s", "Hello world!");
}

static PyMethodDef example_methods[] = {
    {"hello", (PyCFunction)example_hello, METH_VARARGS, "Get hello string."},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef example_module = {
    PyModuleDef_HEAD_INIT,
    "example",
    NULL,
    -1,
    example_methods
};

PyMODINIT_FUNC PyInit_example(void) {
    return PyModule_Create(&example_module);
}
