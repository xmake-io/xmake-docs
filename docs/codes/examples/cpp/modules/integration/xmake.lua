add_rules("mode.release", "mode.debug")
set_languages("c++20")

add_repositories("my-repo repo") 
add_requires("foo")

target("app")
    set_kind("binary")
    add_packages("foo")
    add_files("src/*.cpp")
    set_policy("build.c++.modules", true)
