add_rules("mode.debug", "mode.release")

add_requires("libsdl2")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libsdl2")
