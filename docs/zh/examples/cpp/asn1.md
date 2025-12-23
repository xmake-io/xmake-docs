
ASN.1 程序，需要借助 [ASN.1 Compiler](https://github.com/vlm/asn1c) 去生成相关的 .c 文件参与项目编译。

而 Xmake 内置提供了 `add_rules("asn1c")` 规则去处理 `.c` 文件生成，`add_requires("asn1c")` 自动拉取集成 ASN.1 编译器工具。

下面是一个基础的配置例子：

<FileExplorer rootFilesDir="examples/c/asn1/basic" />

具体见 [完整例子工程](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/asn1c)。
