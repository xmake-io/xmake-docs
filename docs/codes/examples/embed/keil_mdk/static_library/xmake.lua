add_rules("mode.debug", "mode.release")

target("foo")
    add_rules("mdk.static")
    add_files("src/foo/*.c")
    set_runtimes("microlib")

target("hello")
    add_rules("mdk.console")
    add_deps("foo")
    add_files("src/*.c")
    add_includedirs("src/foo")
    set_runtimes("microlib")
