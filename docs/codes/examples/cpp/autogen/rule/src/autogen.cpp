#include <iostream>
#include <fstream>
#include <string>

int main(int argc, char** argv) {
    if (argc < 3) return 1;
    std::ifstream in(argv[1]);
    std::ofstream out(argv[2]);
    std::string line;
    if (in && out) {
        out << "#include <iostream>\n";
        out << "void generated_func() {\n";
        while (std::getline(in, line)) {
            out << "    std::cout << \"" << line << "\" << std::endl;\n";
        }
        out << "}\n";
    }
    return 0;
}
