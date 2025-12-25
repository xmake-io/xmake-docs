---
outline: deep
---

# 终端 TUI 程序

我们可以使用各种 TUI 库来开发终端图形界面程序，例如 ncurses, ftxui 等。

## Ncurses

[Ncurses](https://invisible-island.net/ncurses/announce.html) 是一个经典的终端图形库，我们可以通过 `add_requires("ncurses")` 来集成使用。

<FileExplorer rootFilesDir="examples/cpp/graphics/tui/ncurses" />

## FTXUI

[FTXUI](https://github.com/ArthurSonzogni/FTXUI) 是一个现代的 C++ 函数式终端用户界面库。

<FileExplorer rootFilesDir="examples/cpp/graphics/tui/ftxui" />

### 编译运行

```bash
$ xmake
$ xmake run
```
