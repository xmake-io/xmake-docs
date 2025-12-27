#include <iostream>

void test_c();
void test_foo();
void test_bar();

int main() {
    test_c();
    test_foo();
    test_bar();
    std::cout << "hello unity build" << std::endl;
    return 0;
}
