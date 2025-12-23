add_rules("mode.debug", "mode.release")
add_requires("python 3.x")

target("example")
    add_rules("python.module")
    add_files("src/*.c")
    add_packages("python")
