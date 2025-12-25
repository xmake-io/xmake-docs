add_rules("mode.debug", "mode.release")

add_requires("ncurses")

target("ncurses_tui")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("ncurses")
