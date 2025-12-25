add_rules("mode.debug", "mode.release")

add_requires("imgui", {configs = {glfw_opengl3 = true}})
add_requires("glfw", "opengl")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("imgui", "glfw", "opengl")
    set_languages("c++11")
