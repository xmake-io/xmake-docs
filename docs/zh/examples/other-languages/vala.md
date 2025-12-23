
2.5.7 之后开始支持构建 Vala 程序，我们需要应用 `add_rules("vala")` 规则，并且 glib 包是必须的。

相关 issues: [#1618](https://github.com/xmake-io/xmake/issues/1618)

`add_values("vala.packages")` 用于告诉 valac，项目需要哪些包，它会引入相关包的 vala api，但是包的依赖集成，还是需要通过 `add_requires("lua")` 下载集成。

## 控制台程序 {#console}

<FileExplorer rootFilesDir="examples/other-languages/vala/console" />

## 静态库程序 {#static-library}

v2.5.8 之后，我们继续支持构建库程序，能够通过 `add_values("vala.header", "mymath.h")` 设置导出的接口头文件名，通过 `add_values("vala.vapi", "mymath-1.0.vapi")` 设置导出的 vapi 文件名。

<FileExplorer rootFilesDir="examples/other-languages/vala/static_library" />

## 动态库程序 {#shared-library}

<FileExplorer rootFilesDir="examples/other-languages/vala/shared_library" />

更多例子：[Vala examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/vala)
