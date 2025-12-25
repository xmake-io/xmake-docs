add_rules("mode.debug", "mode.release")

target("linux_framebuffer")
    set_kind("binary")
    add_files("src/*.c")
