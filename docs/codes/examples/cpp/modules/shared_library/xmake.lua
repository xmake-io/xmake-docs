add_rules("mode.debug", "mode.release")

set_languages("c++20")

target("foo")
    set_kind("shared")
    add_files("src/foo.mpp")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.cpp")
