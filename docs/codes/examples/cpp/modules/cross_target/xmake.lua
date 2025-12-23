add_rules("mode.debug", "mode.release")

set_languages("c++20")

target("bar")
    set_kind("static")
    add_files("src/bar.mpp")

target("app")
    set_kind("binary")
    add_deps("bar")
    add_files("src/main.cpp")
