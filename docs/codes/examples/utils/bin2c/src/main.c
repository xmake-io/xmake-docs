#include <stdio.h>

static unsigned char g_png_data[] = {
    #include "test.png.h"
};

int main(int argc, char** argv) {
    printf("image size: %d\n", (int)sizeof(g_png_data));
    return 0;
}
