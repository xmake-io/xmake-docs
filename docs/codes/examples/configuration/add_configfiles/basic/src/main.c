#include <stdio.h>
#include "config.h"

int main(int argc, char** argv)
{
    printf("%s\n", HELLO);
#ifdef FOO_ENABLE
    printf("foo enabled\n");
#endif
    return 0;
}
