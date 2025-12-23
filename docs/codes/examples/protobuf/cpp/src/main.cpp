#include <iostream>
#include <string>
#include "test.pb.h"

int main() {
    test::Request req;
    req.set_query("hello world");

    std::string output;
    if (req.SerializeToString(&output)) {
        std::cout << "Serialized data: " << output << std::endl;
    }

    return 0;
}
