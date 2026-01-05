#include <stdio.h>
#include <stdint.h>

extern const uint8_t _binary_test_png_start[];
extern const uint8_t _binary_test_png_end[];

int main() {
    const uint32_t size = (uint32_t)(_binary_test_png_end - _binary_test_png_start);
    
    printf("Data size: %u bytes\n", size);
    for (uint32_t i = 0; i < size; i++) {
        printf("%02x ", _binary_test_png_start[i]);
    }
    return 0;
}
