add_rules("mode.debug", "mode.release")

target("qt_quickapp")
    add_rules("qt.quickapp")
    add_headerfiles("src/*.h")
    add_files("src/*.cpp") 
    add_files("src/qml.qrc")
