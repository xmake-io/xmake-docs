#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT __attribute__((visibility("default")))
#endif

EXPORT int add(int a, int b) {
    return a + b;
}

EXPORT int multiply(int a, int b) {
    return a * b;
}
