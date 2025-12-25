add_rules("mode.debug", "mode.release")

add_requires("zlib 1.3.1")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
