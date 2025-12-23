
ASN.1 programs need to use [ASN.1 Compiler](https://github.com/vlm/asn1c) to generate relevant .c files to participate in project compilation.

While Xmake provides built-in `add_rules("asn1c")` rules to process `.c` file generation, `add_requires("asn1c")` automatically pulls and integrates ASN.1 compiler tools.

Here is a basic configuration example:

<FileExplorer rootFilesDir="examples/c/asn1/basic" />

For details, see [Example Project](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/asn1c).
