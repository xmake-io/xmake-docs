---
outline: deep
---

# Terminal TUI Programs

We can use various TUI libraries to develop terminal graphical interface programs, such as ncurses, ftxui, etc.

## Ncurses

[Ncurses](https://invisible-island.net/ncurses/announce.html) is a classic terminal graphics library. We can use `add_requires("ncurses")` to integrate it.

<FileExplorer rootFilesDir="examples/cpp/graphics/tui/ncurses" />

## FTXUI

[FTXUI](https://github.com/ArthurSonzogni/FTXUI) is a modern C++ functional terminal user interface library.

<FileExplorer rootFilesDir="examples/cpp/graphics/tui/ftxui" />

### Build and Run

```bash
$ xmake
$ xmake run
```
