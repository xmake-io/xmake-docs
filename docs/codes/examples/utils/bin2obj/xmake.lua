add_rules("mode.debug", "mode.release")
set_xmakever("3.0.6")

target("test")
    set_kind("binary")
    add_rules("utils.bin2obj", {extensions = ".png"})
    add_files("src/*.c")
    add_files("res/*.png")
