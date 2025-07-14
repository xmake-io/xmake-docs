---
title: xmake v2.0.4 released!
tags: [xmake, version]
date: 2016-08-29
author: Ruki
---

title: xmake v2.0.4 released!
tags: [xmake, version]
date: 2016-08-29
author: Ruki

---
### New features

* Add native shell support for `xmake.lua`. .e.g `add_ldflags("$(shell pkg-config --libs sqlite3)")`
* Enable pdb symbol files for windows
* Add debugger support on windows (vsjitdebugger, ollydbg, windbg ... )
* Add `getenv` interface for the global scope of `xmake.lua`
* Add plugin for generating vstudio project file (vs2002 - vs2015)
* Add `set_default` api for option

### Changes

* Improve builtin-variable format
* Support option for string type

### Bugs fixed

* Fix check ld failed without g++ on linux 
* Fix compile `*.cxx` files failed
