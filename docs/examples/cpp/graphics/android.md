---
outline: deep
---

# Android Application

We can use the `android.native_app` rule to build Android native applications.

## Native App

<FileExplorer rootFilesDir="examples/cpp/graphics/android/app" />

### Build and Run

```bash
$ xmake f -p android --ndk=/path/to/ndk
$ xmake
$ xmake install
$ xmake run
```

## Custom Glue

If you want to use custom glue code (or standard `android_native_app_glue`), you can do so by creating a project with the appropriate `AndroidManifest.xml` and native code.

<FileExplorer rootFilesDir="examples/cpp/graphics/android/custom_glue" />
