add_rules("mode.debug", "mode.release")

target("ios_app")
    add_rules("xcode.application")
    add_files("src/*.m")
    add_files("src/Info.plist")
    add_frameworks("UIKit", "Foundation")
