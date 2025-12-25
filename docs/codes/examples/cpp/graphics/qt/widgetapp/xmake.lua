add_rules("mode.debug", "mode.release")

target("qt_widgetapp")
    add_rules("qt.widgetapp")
    add_headerfiles("src/*.h")
    add_files("src/*.cpp") 
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- add meta header files with Q_OBJECT
