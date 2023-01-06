
[VSCode](https://code.visualstudio.com/)是常用的文本编辑器，xmake提供了插件支持。

## 插件安装

由于VSCode本身只提供了文本编辑的功能，我们需要安装插件以支持配置，编译，调试，语法提示等功能: 

* XMake
* C/C++
* CodeLLDB

在完成插件的安装后，重启VSCode可以看到下方的状态栏: 

![](/assets/img/guide/vscode_status_bar.png)

可以在状态栏设置平台，架构，编译模式，工具链等选项，随后点击Build开始构建。

## 自定义选项

如果这些选项不够，可以创建.vscode/settings.json并编写xmake需要的设置，如

```
{
...
  "xmake.additionalConfigArguments": [
    "--my_option=true"
  ],
...
}
```

其他xmake的选项也同样可以在settings.json中完成设置。修改后可通过 >XMake: Configure 命令刷新配置。

## 使用LSP提高开发体验

为了更好的C++语法提示体验，xmake提供了对[Language Server Protocol(https://microsoft.github.io/language-server-protocol/)（简称LSP）的支持，在vscode中，可以使用 >XMake: UpdateIntellisense 命令生成.vscode/compile_commands.json（通常在修改xmake.lua时该文件会自动生成）。与此同时，我们可以选择安装支持LSP的语法提示插件，如LLVM推出的[clangd](https://clangd.llvm.org/)，其功能稳定且提示流畅，并通过LSP标准完成对不同编译工具链的支持。

使用clangd时，可能与上述的C/C++插件的提示功能有冲突，可以在.vscode/settings.json中添加设置将C/C++的语法提示功能关闭: 

```
{
  "C_Cpp.codeAnalysis.runAutomatically": false,
  "C_Cpp.intelliSenseEngine": "Disabled",
  "C_Cpp.formatting": "Disabled",
  "C_Cpp.autoAddFileAssociations": false,
  "C_Cpp.autocompleteAddParentheses": false,
  "C_Cpp.autocomplete": "Disabled",
  "C_Cpp.errorSquiggles": "Disabled",
...
}
```

同时由于XMake生成的compile_commands.json在.vscode目录，还需要设置clangd传参使其在正确位置寻找: 

```
{
  "clangd.arguments": [
    "--compile-commands-dir=.vscode",
...
  ]
...
}
```

