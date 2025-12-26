add_rules("mode.debug", "mode.release")

namespace("ns1", function ()
    includes("src1")
end)

namespace("ns2", function ()
    includes("src2")
end)

target("app")
    set_kind("binary")
    add_deps("ns1::lib", "ns2::lib")
    add_files("src/main.cpp")
