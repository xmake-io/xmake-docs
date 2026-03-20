add_rules("mode.debug", "mode.release")

target("hello")
    set_kind("binary")
    add_files("src/*.cs")
