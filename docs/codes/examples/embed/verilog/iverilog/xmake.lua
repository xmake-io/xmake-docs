add_requires("iverilog")

target("hello")
    add_rules("iverilog.binary")
    set_toolchains("@iverilog")
    add_files("src/*.v")
    add_defines("TEST")
    set_languages("v1800-2009")
