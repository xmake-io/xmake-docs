add_rules("mode.debug", "mode.release")

add_requires("glfw")
add_requires("opengl", {optional = true})

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("glfw", "opengl")
    set_languages("c++11")
