add_rules("mode.debug", "mode.release")

includes("@builtin/xpack")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")

xpack("test_pack")
    set_formats("nsis", "zip", "targz")
    set_title("Hello Xmake")
    set_author("ruki")
    add_targets("test")
