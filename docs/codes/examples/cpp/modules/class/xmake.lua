add_rules("mode.debug", "mode.release")

set_languages("c++20")

target("class_test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_files("src/*.mpp")
