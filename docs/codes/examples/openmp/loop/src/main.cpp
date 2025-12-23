#include <iostream>
#include <omp.h>

int main(int argc, char** argv) {
#pragma omp parallel for
    for (int i = 0; i < 10; ++i) {
#pragma omp critical
        std::cout << "Thread " << omp_get_thread_num() << " processing iteration " << i << std::endl;
    }
    return 0;
}
