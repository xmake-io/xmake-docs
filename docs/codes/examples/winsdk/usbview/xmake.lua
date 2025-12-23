target("usbview")
    add_rules("win.sdk.application")
    add_files("src/*.c", "src/*.rc")
    add_files("src/xmlhelper.cpp", {rules = "win.sdk.dotnet"})
