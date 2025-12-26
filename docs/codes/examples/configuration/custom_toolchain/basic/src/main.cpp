#include <iostream>

int main(int argc, char** argv) {
#ifdef TEST_MACRO
    std::cout << "hello from myclang toolchain!" << std::endl;
#else
    std::cout << "hello world!" << std::endl;
#endif
    return 0;
}
