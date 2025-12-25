add_rules("mode.debug", "mode.release")

add_requires("fmt")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("fmt")
