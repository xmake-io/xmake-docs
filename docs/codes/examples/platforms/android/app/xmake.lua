add_rules("mode.debug", "mode.release")

target("android_app")
    set_kind("binary")
    add_files("src/*.cpp")
    add_rules("android.native_app", {
        android_manifest = "src/android/AndroidManifest.xml",
        package_name = "com.xmake.demo",
        android_sdk_version = "35"
    })
