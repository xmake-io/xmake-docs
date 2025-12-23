add_rules("mode.debug", "mode.release")
add_requires("python 3.x")

target("example")
    add_rules("python.cython")
    add_files("src/*.pyx")
    add_packages("python")
