add_rules("mode.debug", "mode.release")

add_requires("ftxui")

target("ftxui_tui")
    set_kind("binary")
    set_languages("c++17")
    add_files("src/*.cpp")
    add_packages("ftxui")
