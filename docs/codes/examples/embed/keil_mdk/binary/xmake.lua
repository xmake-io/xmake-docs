target("hello")
    add_rules("mdk.console")
    add_files("src/*.c")
    set_runtimes("microlib")
