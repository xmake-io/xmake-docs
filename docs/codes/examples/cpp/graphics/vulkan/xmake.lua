add_rules("mode.debug", "mode.release")

add_requires("vulkan-headers", "vulkan-loader")
add_requires("glfw")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("vulkan-headers", "vulkan-loader", "glfw")
    set_languages("c++17")
