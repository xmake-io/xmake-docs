---
outline: deep
---

# basic-templates

[basic-templates](https://github.com/xmake-addons/basic-templates) 收纳那些依赖外部 SDK 或第三方库的工程模板 —— 这类模板不适合放进 xmake 内核，因为缺了对应 SDK 就构建不起来。

```sh
$ xmake addon --install basic-templates
$ xmake create --list                        # 它带来的模板会出现在这里
```

```sh
$ xmake create -l c -t sdl sdlapp
$ xmake create -l c++ -t qt.widgetapp qtapp
$ xmake create -l verilog -t verilator.console vlapp
```

模板没有命名空间，模板 id 是全局的 —— 这也是两个 addon 不能提供同名模板的原因。
