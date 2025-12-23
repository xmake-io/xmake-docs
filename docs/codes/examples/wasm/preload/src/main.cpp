#include <iostream>
#include <fstream>
#include <string>

int main() {
    std::ifstream file1("src/assets/file1.txt");
    if (file1.is_open()) {
        std::string line;
        while (getline(file1, line)) {
            std::cout << line << '\n';
        }
        file1.close();
    } else {
        std::cout << "Unable to open file1.txt\n";
    }

    std::ifstream file2("src/assets/file2.txt");
    if (file2.is_open()) {
        std::string line;
        while (getline(file2, line)) {
            std::cout << line << '\n';
        }
        file2.close();
    } else {
        std::cout << "Unable to open file2.txt\n";
    }

    return 0;
}
