#include <openssl/ssl.h>
#include <stdio.h>

int main() {
    printf("OpenSSL Version: %s\n", SSLeay_version(SSLEAY_VERSION));
    return 0;
}
