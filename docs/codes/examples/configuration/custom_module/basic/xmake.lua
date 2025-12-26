add_rules("mode.debug", "mode.release")

add_moduledirs("xmake")

target("test")
    set_kind("binary")
    add_files("src/main.cpp")
    on_load(function (target)
        import("modules.hello").say("xmake")
    end)
