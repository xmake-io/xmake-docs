add_rules("mode.debug", "mode.release")
add_requires("llvm")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("@llvm")
