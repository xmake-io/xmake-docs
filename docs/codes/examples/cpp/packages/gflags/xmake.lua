add_rules("mode.debug", "mode.release")

add_requires("gflags", {configs = {shared = true}})

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("gflags")
