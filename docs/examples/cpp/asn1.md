
ASN.1 programs need to use [ASN.1 Compiler](https://github.com/vlm/asn1c) to generate relevant .c files to participate in project compilation.

While Xmake provides built-in `add_rules("asn1c")` rules to process `.c` file generation, `add_requires("asn1c")` automatically pulls and integrates ASN.1 compiler tools.

Here is a basic configuration example:

```lua
add_rules("mode.debug", "mode.release")
add_requires("asn1c")

target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_files("src/*.asn1")
     add_rules("asn1c")
     add_packages("asn1c")
```

For details, see [Example Project](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/asn1c).
