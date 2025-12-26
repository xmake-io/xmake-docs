add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/main.c")

    -- set config variables
    set_configvar("FOO_ENABLE", 1)
    set_configvar("FOO_STRING", "hello xmake")

    -- set config directory
    set_configdir("$(builddir)/config")
    
    -- generate config header
    add_configfiles("config.h.in")
    
    -- add include directory
    add_includedirs("$(builddir)/config")
