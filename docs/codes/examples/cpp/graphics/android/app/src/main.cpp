#include <android_native_app_glue.h>
#include <android/log.h>

#define LOGI(...) ((void)__android_log_print(ANDROID_LOG_INFO, "xmake-demo", __VA_ARGS__))

void android_main(struct android_app* state) {
    app_dummy();
    LOGI("Hello Xmake on Android!");
    while (1) {
        int ident;
        int events;
        struct android_poll_source* source;
        while ((ident = ALooper_pollAll(-1, NULL, &events, (void**)&source)) >= 0) {
            if (source != NULL) {
                source->process(state, source);
            }
            if (state->destroyRequested != 0) {
                return;
            }
        }
    }
}
