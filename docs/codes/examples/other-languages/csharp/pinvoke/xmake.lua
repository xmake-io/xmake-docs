add_rules("mode.debug", "mode.release")

target("mathlib")
    set_kind("shared")
    add_files("src/native/*.c")

target("app")
    set_kind("binary")
    add_deps("mathlib")
    add_files("src/app/*.cs")
