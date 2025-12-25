#include <boost/algorithm/string.hpp>
#include <iostream>
#include <string>
#include <vector>

int main() {
    std::string s = "Hello,World";
    std::vector<std::string> strs;
    boost::split(strs, s, boost::is_any_of(","));
    for (const auto& str : strs) {
        std::cout << str << std::endl;
    }
    return 0;
}
