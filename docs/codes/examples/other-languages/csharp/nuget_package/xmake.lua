add_requires("nuget::Humanizer.Core 2.14.1")

add_rules("mode.debug", "mode.release")

target("app")
    set_kind("binary")
    add_files("src/*.cs")
    add_packages("nuget::Humanizer.Core")
