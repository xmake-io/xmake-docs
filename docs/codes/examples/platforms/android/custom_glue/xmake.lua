add_rules("mode.debug", "mode.release")

target("app")
    set_kind("binary")
    add_files("src/*.c")
    add_rules("android.native_app", {
        android_manifest = "src/android/AndroidManifest.xml",
        package_name = "com.xmake.custom_glue",
        android_sdk_version = "35"
    })
