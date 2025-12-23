module foo;
import <iostream>;

namespace foo {
    void say(const char *msg) {
        std::cout << "foo: " << msg << std::endl;
    }
}
