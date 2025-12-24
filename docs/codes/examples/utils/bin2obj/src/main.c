#include <stdio.h>

extern unsigned char test_png_data[];
extern unsigned int test_png_size;

int main(int argc, char** argv) {
    printf("image size: %d\n", test_png_size);
    return 0;
}
