---
outline: deep
---

# basic-templates

[basic-templates](https://github.com/xmake-addons/basic-templates) carries the project
templates which depend on an external sdk or a third-party library — the ones that do not
belong in the xmake core because they would fail to build without that sdk.

```sh
$ xmake addon --install basic-templates
$ xmake create --list                        # the templates it added show up here
```

```sh
$ xmake create -l c -t sdl sdlapp
$ xmake create -l c++ -t qt.widgetapp qtapp
$ xmake create -l verilog -t verilator.console vlapp
```

Templates are not namespaced, so a template id is global — that is also why two addons
cannot provide the same one.
