#include <stdio.h>

__global__ void hello(void) {
    printf("Hello World from GPU!\n");
}

int main() {
    hello<<<1, 10>>>();
    cudaDeviceReset();
    return 0;
}
