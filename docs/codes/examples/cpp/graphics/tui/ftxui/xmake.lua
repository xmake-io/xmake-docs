add_rules("mode.debug", "mode.release")

add_requires("ftxui")

target("ftxui_tui")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("ftxui")
