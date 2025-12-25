add_rules("mode.debug", "mode.release")

add_requires("openal-soft")

target("openal_test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("openal-soft")
