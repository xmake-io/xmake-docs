
Since 2.5.3, it supports bpf program construction, supports both linux and android platforms, and can automatically pull llvm and android ndk toolchains.

For more details, please see: [#1274](https://github.com/xmake-io/xmake/issues/1274)

```lua
add_rules("mode.release", "mode.debug")
add_rules("platform.linux.bpf")

add_requires("linux-tools", {configs = {bpftool = true}})
add_requires("libbpf")
if is_plat("android") then
     add_requires("ndk >=22.x")
     set_toolchains("@ndk", {sdkver = "23"})
else
     add_requires("llvm >=10.x")
     set_toolchains("@llvm")
     add_requires("linux-headers")
end

target("minimal")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("linux-tools", "linux-headers", "libbpf")
     set_license("GPL-2.0")
```
