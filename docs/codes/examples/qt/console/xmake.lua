add_rules("mode.debug", "mode.release")

target("qt_console")
    add_rules("qt.console")
    add_files("src/*.cpp")
