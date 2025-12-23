#include <stdio.h>
#include <stdlib.h>
#include "test.pb-c.h"

int main(int argc, char** argv) {
    Test__Request msg = TEST__REQUEST__INIT;
    void *buf;
    unsigned len;

    msg.query = "hello world";
    len = test__request__get_packed_size(&msg);

    buf = malloc(len);
    test__request__pack(&msg, buf);

    fprintf(stderr,"Writing %d serialized bytes\n",len); // See the length of message
    fwrite(buf,len,1,stdout); // Write to stdout to allow direct command line piping

    free(buf);
    return 0;
}
