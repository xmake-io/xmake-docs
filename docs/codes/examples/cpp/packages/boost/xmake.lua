add_rules("mode.debug", "mode.release")

add_requires("boost")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("boost")
