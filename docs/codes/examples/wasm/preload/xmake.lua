add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_values("wasm.preloadfiles", "src/assets/file1.txt")
    add_values("wasm.preloadfiles", "src/assets/file2.txt")
