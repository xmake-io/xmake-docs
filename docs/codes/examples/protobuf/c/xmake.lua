add_requires("protobuf-c")

target("console_c")
    set_kind("binary")
    add_packages("protobuf-c")
    add_rules("protobuf.c")
    add_files("src/*.c")
    add_files("src/*.proto")
