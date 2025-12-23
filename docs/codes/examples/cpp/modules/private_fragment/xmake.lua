add_rules("mode.debug", "mode.release")

set_languages("c++20")

target("box")
    set_kind("binary")
    add_files("src/*.cpp")
    add_files("src/*.mpp")
