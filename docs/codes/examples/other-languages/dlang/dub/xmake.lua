add_rules("mode.debug", "mode.release")

add_requires("dub::log 0.4.3", {alias = "log"})
add_requires("dub::dateparser", {alias = "dateparser"})

target("test")
    set_kind("binary")
    add_files("src/*.d")
    add_packages("log", "dateparser")
