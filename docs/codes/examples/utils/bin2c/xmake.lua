add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_rules("utils.bin2c", {extensions = ".png"})
    add_files("src/*.c")
    add_files("res/*.png")
