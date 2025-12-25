---
outline: deep
---

# Android Application

我们可以使用 `android.native_app` 规则来构建 Android 原生应用程序。

## Native App

<FileExplorer rootFilesDir="examples/cpp/graphics/android/app" />

### Build and Run

```bash
$ xmake f -p android --ndk=/path/to/ndk
$ xmake
$ xmake install
$ xmake run
```

## 自定义 Glue

如果你想使用自定义 glue 代码（或标准的 `android_native_app_glue`），你可以通过创建包含相应 `AndroidManifest.xml` 和原生代码的项目来实现。

<FileExplorer rootFilesDir="examples/cpp/graphics/android/custom_glue" />
