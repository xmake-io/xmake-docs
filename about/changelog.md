
## v2.6.8

### New features

* [#2447](https://github.com/xmake-io/xmake/pull/2447): Add qt.qmlplugin rule and support of qmltypesregistrar
* [#2446](https://github.com/xmake-io/xmake/issues/2446): Support target group for `xmake install`
* [#2469](https://github.com/xmake-io/xmake/issues/2469): Generate vcpkg-configuration.json

### Changes

* Add `preprocessor.linemarkers` policy to disable linemarkers to speed up ccache/distcc
* [#2389](https://github.com/xmake-io/xmake/issues/2389): Improve `xmake run` to parallel running of targets
* [#2417](https://github.com/xmake-io/xmake/issues/2417): Switch the default value of option/showmenu
* [#2440](https://github.com/xmake-io/xmake/pull/2440): Improve package installation error messages
* [#2438](https://github.com/xmake-io/xmake/pull/2438): Make sure the solution and project file unchanged by sorting those tables
* [#2434](https://github.com/xmake-io/xmake/issues/2434): Improve plugins manager, allow to handle multiples plugin repositories
* [#2421](https://github.com/xmake-io/xmake/issues/2421): Improve config option menu
* [#2425](https://github.com/xmake-io/xmake/issues/2425): Add `preprocessor.gcc.directives_only` policy
* [#2455](https://github.com/xmake-io/xmake/issues/2455): Improve optimize options for emcc
* [#2467](https://github.com/xmake-io/xmake/issues/2467): Add compile fallback for msvc/ccache
* [#2452](https://github.com/xmake-io/xmake/issues/2452): Add build.warning policy

### Bugs Fixed

* [#2435](https://github.com/xmake-io/xmake/pull/2435): fix the search bug when the package name has an extension name.
* [#2445](https://github.com/xmake-io/xmake/issues/2445): Fix ccache bug for msvc
* [#2452](https://github.com/xmake-io/xmake/issues/2452): Fix warnings output for ccache

## v2.6.7

### New features

* [#2318](https://github.com/xmake-io/xmake/issues/2318): Add `xmake f --policies=` config argument to modify project policies

### Changes

* fallback to source code build if the precompiled package is error
* [#2387](https://github.com/xmake-io/xmake/issues/2387): Improve pkgconfig and find_package
* Add `build.ccache` policy

### Bugs fixed

* [#2382](https://github.com/xmake-io/xmake/issues/2382): Fix headeronly package configs
* [#2388](https://github.com/xmake-io/xmake/issues/2388): Fix path bug
* [#2385](https://github.com/xmake-io/xmake/issues/2385): Fix cmake/find_package
* [#2395](https://github.com/xmake-io/xmake/issues/2395): Fix c++modules
* Fix find_qt bug

## v2.6.6

### New features

* [#2327](https://github.com/xmake-io/xmake/issues/2327): Support nvc/nvc++/nvfortran in nvidia-hpc-sdk
* Add path instance interfaces
* [#2344](https://github.com/xmake-io/xmake/pull/2344): Add lz4 compress module
* [#2349](https://github.com/xmake-io/xmake/pull/2349): Add keil/c51 project support
* [#274](https://github.com/xmake-io/xmake/issues/274): Distributed compilation support
* Use builtin local cache instead of ccache

### Changes

* [#2309](https://github.com/xmake-io/xmake/issues/2309): Support user authorization for remote compilation
* Improve remote compilation to support lz4 compression

### Bugs fixed

* Fix lua stack when select package versions

## v2.6.5

### New features

* [#2138](https://github.com/xmake-io/xmake/issues/2138): Support template package
* [#2185](https://github.com/xmake-io/xmake/issues/2185): Add `--appledev=simulator` to improve apple simulator support
* [#2227](https://github.com/xmake-io/xmake/issues/2227): Improve cargo package with Cargo.toml file
* Improve `add_requires` to support git commit as version
* [#622](https://github.com/xmake-io/xmake/issues/622): Support remote compilation
* [#2282](https://github.com/xmake-io/xmake/issues/2282): Add `add_filegroups` to support file group for vs/vsxmake/cmake generator

### Changes

* [#2137](https://github.com/xmake-io/xmake/pull/2137): Improve path module
* Reduce 50% xmake binary size on macOS
* Improve tools/autoconf,cmake to support toolchain switching.
* [#2221](https://github.com/xmake-io/xmake/pull/2221): Improve registry api to support unicode
* [#2225](https://github.com/xmake-io/xmake/issues/2225): Support to parse import dependencies for protobuf
* [#2265](https://github.com/xmake-io/xmake/issues/2265): Sort CMakeLists.txt
* Speed up `os.files`

### Bugs fixed

* [#2233](https://github.com/xmake-io/xmake/issues/2233): Fix c++ modules deps

## v2.6.4

### New features

* [#2011](https://github.com/xmake-io/xmake/issues/2011): Support to inherit base package
* Support to build and run xmake on sparc, alpha, powerpc, s390x and sh4
* Add on_download for package()
* [#2021](https://github.com/xmake-io/xmake/issues/2021): Support Swift for linux and windows
* [#2024](https://github.com/xmake-io/xmake/issues/2024): Add asn1c support
* [#2031](https://github.com/xmake-io/xmake/issues/2031): Support linker scripts and version scripts for add_files
* [#2033](https://github.com/xmake-io/xmake/issues/2033): Catch ctrl-c to get current backtrace for debugging stuck
* [#2059](https://github.com/xmake-io/xmake/pull/2059): Add `xmake update --integrate` to integrate for shell
* [#2070](https://github.com/xmake-io/xmake/issues/2070): Add built-in xrepo environments
* [#2117](https://github.com/xmake-io/xmake/pull/2117): Support to pass toolchains to package for other platforms
* [#2121](https://github.com/xmake-io/xmake/issues/2121): Support to export the given symbols list

### Changes

* [#2036](https://github.com/xmake-io/xmake/issues/2036): Improve xrepo to install packages from configuration file, e.g. `xrepo install xxx.lua`
* [#2039](https://github.com/xmake-io/xmake/issues/2039): Improve filter directory for vs generator
* [#2025](https://github.com/xmake-io/xmake/issues/2025): Support phony and headeronly target for vs generator
* Improve to find vstudio and codesign speed
* [#2077](https://github.com/xmake-io/xmake/issues/2077): Improve vs project generator to support cuda

### Bugs fixed

* [#2005](https://github.com/xmake-io/xmake/issues/2005): Fix path.extension
* [#2008](https://github.com/xmake-io/xmake/issues/2008): Fix windows manifest
* [#2016](https://github.com/xmake-io/xmake/issues/2016): Fix object filename confict for vs project generator

## v2.6.3

### New features

* [#1298](https://github.com/xmake-io/xmake/issues/1928): Support vcpkg manifest mode and select version for package/install
* [#1896](https://github.com/xmake-io/xmake/issues/1896): Add `python.library` rule to build pybind modules
* [#1939](https://github.com/xmake-io/xmake/issues/1939): Add `remove_files`, `remove_headerfiles` and mark `del_files` as deprecated
* Made on_config as the official api for rule/target
* Add riscv32/64 support
* [#1970](https://github.com/xmake-io/xmake/issues/1970): Add CMake wrapper for Xrepo C and C++ package manager.
* Add builtin github mirror pac files, `xmake g --proxy_pac=github_mirror.lua`

### Changes

* [#1923](https://github.com/xmake-io/xmake/issues/1923): Improve to build linux driver, support set custom linux-headers path
* [#1962](https://github.com/xmake-io/xmake/issues/1962): Improve armclang toolchain to support to build asm
* [#1959](https://github.com/xmake-io/xmake/pull/1959): Improve vstudio project generator
* [#1969](https://github.com/xmake-io/xmake/issues/1969): Add default option description

### Bugs fixed

* [#1875](https://github.com/xmake-io/xmake/issues/1875): Fix deploy android qt apk issue
* [#1973](https://github.com/xmake-io/xmake/issues/1973): Fix merge static archive

## v2.6.2

### New features

* [#1902](https://github.com/xmake-io/xmake/issues/1902): Support to build linux kernel driver modules
* [#1913](https://github.com/xmake-io/xmake/issues/1913): Build and run targets with given group pattern

### Change

* [#1872](https://github.com/xmake-io/xmake/issues/1872): Escape characters for set_configvar
* [#1888](https://github.com/xmake-io/xmake/issues/1888): Improve windows installer to avoid remove other files
* [#1895](https://github.com/xmake-io/xmake/issues/1895): Improve `plugin.vsxmake.autoupdate` rule
* [#1893](https://github.com/xmake-io/xmake/issues/1893): Improve to detect icc and ifort toolchains
* [#1905](https://github.com/xmake-io/xmake/pull/1905): Add support of external headers without experimental for msvc
* [#1904](https://github.com/xmake-io/xmake/pull/1904): Improve vs201x generator
* Add `XMAKE_THEME` envirnoment variable to switch theme
* [#1907](https://github.com/xmake-io/xmake/issues/1907): Add `-f/--force` to force to create project in a non-empty directory
* [#1917](https://github.com/xmake-io/xmake/pull/1917): Improve to find_package and configurations

### Bugs fixed

* [#1885](https://github.com/xmake-io/xmake/issues/1885): Fix package:fetch_linkdeps
* [#1903](https://github.com/xmake-io/xmake/issues/1903): Fix package link order

## v2.6.1

### New features

* [#1799](https://github.com/xmake-io/xmake/issues/1799): Support mixed rust & c++ target and cargo dependences
* Add `utils.glsl2spv` rules to compile *.vert/*.frag shader files to spirv file and binary c header file

### Changes

* Switch to Lua5.4 runtime by default
* [#1776](https://github.com/xmake-io/xmake/issues/1776): Improve system::find_package, support to find package from envs
* [#1786](https://github.com/xmake-io/xmake/issues/1786): Improve apt:find_package, support to find alias package
* [#1819](https://github.com/xmake-io/xmake/issues/1819): Add precompiled header to cmake generator
* Improve C++20 module to support std libraries for msvc
* [#1792](https://github.com/xmake-io/xmake/issues/1792): Add custom command in vs project generator
* [#1835](https://github.com/xmake-io/xmake/issues/1835): Improve MDK program supports and add `set_runtimes("microlib")`
* [#1858](https://github.com/xmake-io/xmake/issues/1858): Improve to build c++20 modules with libraries
* Add $XMAKE_BINARY_REPO and $XMAKE_MAIN_REPO repositories envs
* [#1865](https://github.com/xmake-io/xmake/issues/1865): Improve openmp projects
* [#1845](https://github.com/xmake-io/xmake/issues/1845): Install pdb files for static library

### Bugs Fixed

* Fix semver to parse build string with zero prefix
* [#50](https://github.com/libbpf/libbpf-bootstrap/issues/50): Fix rule and build bpf program errors
* [#1610](https://github.com/xmake-io/xmake/issues/1610): Fix `xmake f --menu` not responding in vscode and support ConPTY terminal virtkeys

## v2.5.9

### New features

* [#1736](https://github.com/xmake-io/xmake/issues/1736): Support wasi-sdk toolchain
* Support Lua 5.4 runtime
* Add gcc-8, gcc-9, gcc-10, gcc-11 toolchains
* [#1623](https://github.com/xmake-io/xmake/issues/1632): Support find_package from cmake
* [#1747](https://github.com/xmake-io/xmake/issues/1747): Add `set_kind("headeronly")` for target to install files for headeronly library
* [#1019](https://github.com/xmake-io/xmake/issues/1019): Support Unity build
* [#1438](https://github.com/xmake-io/xmake/issues/1438): Support code amalgamation, `xmake l cli.amalgamate`
* [#1765](https://github.com/xmake-io/xmake/issues/1756): Support nim language
* [#1762](https://github.com/xmake-io/xmake/issues/1762): Manage and switch the given package envs for `xrepo env`
* [#1767](https://github.com/xmake-io/xmake/issues/1767): Support Circle compiler
* [#1753](https://github.com/xmake-io/xmake/issues/1753): Support armcc/armclang toolchains for Keil/MDK
* [#1774](https://github.com/xmake-io/xmake/issues/1774): Add table.contains api
* [#1735](https://github.com/xmake-io/xmake/issues/1735): Add custom command in cmake generator

### Changes

* [#1528](https://github.com/xmake-io/xmake/issues/1528): Check c++17/20 features
* [#1729](https://github.com/xmake-io/xmake/issues/1729): Improve C++20 modules for clang/gcc/msvc, support inter-module dependency compilation and parallel optimization
* [#1779](https://github.com/xmake-io/xmake/issues/1779): Remove builtin `-Gd` for ml.exe/x86
* [#1781](https://github.com/xmake-io/xmake/issues/1781): Improve get.sh installation script to support nixos

## v2.5.8

### New features

* [#388](https://github.com/xmake-io/xmake/issues/388): Pascal Language Support
* [#1682](https://github.com/xmake-io/xmake/issues/1682): Add optional lua5.3 backend instead of luajit to provide better compatibility
* [#1622](https://github.com/xmake-io/xmake/issues/1622): Support Swig
* [#1714](https://github.com/xmake-io/xmake/issues/1714): Support build local embed cmake projects
* [#1715](https://github.com/xmake-io/xmake/issues/1715): Support to detect compiler language standards as features and add `check_macros`
* Support Loongarch

### Change

* [#1618](https://github.com/xmake-io/xmake/issues/1618): Improve vala to support to generate libraries and bindings
* Improve Qt rules to support Qt 4.x
* Improve `set_symbols("debug")` to generate pdb file for clang on windows
* [#1638](https://github.com/xmake-io/xmake/issues/1638): Improve to merge static library
* Improve on_load/after_load to support to add target deps dynamically
* [#1675](https://github.com/xmake-io/xmake/pull/1675): Rename dynamic and import library suffix for mingw
* [#1694](https://github.com/xmake-io/xmake/issues/1694): Support to define a variable without quotes for configuration files
* Support Android NDK r23
* Add `c++latest` and `clatest` for `set_languages`
* [#1720](https://github.com/xmake-io/xmake/issues/1720): Add `save_scope` and `restore_scope` to fix `check_xxx` apis
* [#1726](https://github.com/xmake-io/xmake/issues/1726): Improve compile_commands generator to support nvcc

### Bugs fixed

* [#1671](https://github.com/xmake-io/xmake/issues/1671): Fix incorrect absolute path after installing precompiled packages
* [#1689](https://github.com/xmake-io/xmake/issues/1689): Fix unicode chars bug for vsxmake

## v2.5.7

### New features

* [#1534](https://github.com/xmake-io/xmake/issues/1534): Support to compile Vala lanuage project
* [#1544](https://github.com/xmake-io/xmake/issues/1544): Add utils.bin2c rule to generate header from binary file
* [#1547](https://github.com/xmake-io/xmake/issues/1547): Support to run and get output of c/c++ snippets in option
* [#1567](https://github.com/xmake-io/xmake/issues/1567): Package "lock file" support to freeze dependencies
* [#1597](https://github.com/xmake-io/xmake/issues/1597): Support to compile *.metal files to generate *.metalib and improve xcode.application rule

### Change

* [#1540](https://github.com/xmake-io/xmake/issues/1540): Better support for compilation of automatically generated code
* [#1578](https://github.com/xmake-io/xmake/issues/1578): Improve add_repositories to support relative path better
* [#1582](https://github.com/xmake-io/xmake/issues/1582): Improve installation and os.cp to reserve symlink

### Bugs fixed

* [#1531](https://github.com/xmake-io/xmake/issues/1531): Fix error info when loading targets failed

## v2.5.6

### New features

* [#1483](https://github.com/xmake-io/xmake/issues/1483): Add `os.joinenvs()` and improve package tools envirnoments
* [#1523](https://github.com/xmake-io/xmake/issues/1523): Add `set_allowedmodes`, `set_allowedplats` and `set_allowedarchs`
* [#1523](https://github.com/xmake-io/xmake/issues/1523): Add `set_defaultmode`, `set_defaultplat` and `set_defaultarchs`

### Change

* Improve vs/vsxmake project generator to support vs2022
* [#1513](https://github.com/xmake-io/xmake/issues/1513): Improve precompiled binary package compatibility on windows/msvc
* Improve to find vcpkg root directory on windows
* Improve to support Qt6

### Bugs fixed

* [#489](https://github.com/xmake-io/xmake-repo/pull/489): Fix run os.execv with too long envirnoment value on windows

## v2.5.5

### New features

* [#1421](https://github.com/xmake-io/xmake/issues/1421): Add prefix, suffix and extension options for target names
* [#1422](https://github.com/xmake-io/xmake/issues/1422): Support search packages from vcpkg, conan
* [#1424](https://github.com/xmake-io/xmake/issues/1424): Set binary as default target kind
* [#1140](https://github.com/xmake-io/xmake/issues/1140): Add a way to ask xmake to try to download dependencies from a certain package manager
* [#1339](https://github.com/xmake-io/xmake/issues/1339): Improve `xmake package` to generate new local/remote packages
* Add `appletvos` platform support for AppleTV, `xmake f -p appletvos`
* [#1437](https://github.com/xmake-io/xmake/issues/1437): Add headeronly library type for package to ignore `vs_runtime`
* [#1351](https://github.com/xmake-io/xmake/issues/1351): Support export/import current configs
* [#1454](https://github.com/xmake-io/xmake/issues/1454): Support to download and install precompiled image packages from xmake-mirror

### Change

* [#1425](https://github.com/xmake-io/xmake/issues/1425): Improve tools/meson to load msvc envirnoments
* [#1442](https://github.com/xmake-io/xmake/issues/1442): Support to clone package resources from git url
* [#1389](https://github.com/xmake-io/xmake/issues/1389): Support to add toolchain envs to `xrepo env`
* [#1453](https://github.com/xmake-io/xmake/issues/1453): Support to export protobuf includedirs
* Support vs2022

### Bugs fixed

* [#1413](https://github.com/xmake-io/xmake/issues/1413): Fix hangs on fetching packages
* [#1420](https://github.com/xmake-io/xmake/issues/1420): Fix config and packages cache
* [#1445](https://github.com/xmake-io/xmake/issues/1445): Fix WDK driver sign error
* [#1465](https://github.com/xmake-io/xmake/issues/1465): Fix missing link directory

## v2.5.4

### New features

* [#1323](https://github.com/xmake-io/xmake/issues/1323): Support find and install package from `apt`, `add_requires("apt::zlib1g-dev")`
* [#1337](https://github.com/xmake-io/xmake/issues/1337): Add environment vars to change package directories
* [#1338](https://github.com/xmake-io/xmake/issues/1338): Support import and export installed packages
* [#1087](https://github.com/xmake-io/xmake/issues/1087): Add `xrepo env shell` and support load envs from `add_requires/xmake.lua`
* [#1313](https://github.com/xmake-io/xmake/issues/1313): Support private package for `add_requires/add_deps`
* [#1358](https://github.com/xmake-io/xmake/issues/1358): Support to set mirror url to speedup download package
* [#1369](https://github.com/xmake-io/xmake/pull/1369): Support arm/arm64 packages for vcpkg, thanks @fallending
* [#1405](https://github.com/xmake-io/xmake/pull/1405): Add portage package manager support, thanks @Phate6660

### Change

* Improve `find_package` and add `package:find_package` for xmake package
* Remove deprecated `set_config_h` and `set_config_h_prefix` apis
* [#1343](https://github.com/xmake-io/xmake/issues/1343): Improve to search local package files
* [#1347](https://github.com/xmake-io/xmake/issues/1347): Improve to vs_runtime configs for binary package
* [#1353](https://github.com/xmake-io/xmake/issues/1353): Improve del_files() to speedup matching files
* [#1349](https://github.com/xmake-io/xmake/issues/1349): Improve `xrepo env shell` to support powershell

### Bugs fixed

* [#1380](https://github.com/xmake-io/xmake/issues/1380): Fix add packages errors
* [#1381](https://github.com/xmake-io/xmake/issues/1381): Fix add local git source for package
* [#1391](https://github.com/xmake-io/xmake/issues/1391): Fix cuda/nvcc toolchain

## v2.5.3

### New features

* [#1259](https://github.com/xmake-io/xmake/issues/1259): Support `add_files("*.def")` to export symbols for windows/dll
* [#1267](https://github.com/xmake-io/xmake/issues/1267): add `find_package("nvtx")`
* [#1274](https://github.com/xmake-io/xmake/issues/1274): add `platform.linux.bpf` rule to build linux/bpf program
* [#1280](https://github.com/xmake-io/xmake/issues/1280): Support fetchonly package to improve find_package
* Support to fetch remote ndk toolchain package
* [#1268](https://github.com/xmake-io/xmake/issues/1268): Add `utils.install.pkgconfig_importfiles` rule to install `*.pc` import file
* [#1268](https://github.com/xmake-io/xmake/issues/1268): Add `utils.install.cmake_importfiles` rule to install `*.cmake` import files
* [#348](https://github.com/xmake-io/xmake-repo/pull/348): Add `platform.longpaths` policy to support git longpaths
* [#1314](https://github.com/xmake-io/xmake/issues/1314): Support to install and use conda packages
* [#1120](https://github.com/xmake-io/xmake/issues/1120): Add `core.base.cpu` module and improve `os.cpuinfo()`
* [#1325](https://github.com/xmake-io/xmake/issues/1325): Add builtin git variables for `add_configfiles`

### Change

* [#1275](https://github.com/xmake-io/xmake/issues/1275): Support conditionnal targets for vsxmake plugin
* [#1290](https://github.com/xmake-io/xmake/pull/1290): Improve android ndk to support >= r22
* [#1311](https://github.com/xmake-io/xmake/issues/1311): Add packages lib folder to PATH for vsxmake project

### Bugs fixed

* [#1266](https://github.com/xmake-io/xmake/issues/1266): Fix relative repo path in `add_repositories`
* [#1288](https://github.com/xmake-io/xmake/issues/1288): Fix vsxmake generator with option configs

## v2.5.2

### New features

* [#955](https://github.com/xmake-io/xmake/issues/955#issuecomment-766481512): Support `zig cc` and `zig c++` as c/c++ compiler
* [#955](https://github.com/xmake-io/xmake/issues/955#issuecomment-768193083): Support zig cross-compilation
* [#1177](https://github.com/xmake-io/xmake/issues/1177): Improve to detect terminal and color codes
* [#1216](https://github.com/xmake-io/xmake/issues/1216): Pass custom configuration scripts to xrepo
* Add linuxos builtin module to get linux system information
* [#1217](https://github.com/xmake-io/xmake/issues/1217): Support to fetch remote toolchain package when building project
* [#1123](https://github.com/xmake-io/xmake/issues/1123): Add `rule("utils.symbols.export_all")` to export all symbols for windows/dll
* [#1181](https://github.com/xmake-io/xmake/issues/1181): Add `utils.platform.gnu2mslib(mslib, gnulib)` module api to convert mingw/xxx.dll.a to msvc xxx.lib
* [#1246](https://github.com/xmake-io/xmake/issues/1246): Improve rules and generators to support commands list
* [#1239](https://github.com/xmake-io/xmake/issues/1239): Add `add_extsources` to improve find external packages
* [#1241](https://github.com/xmake-io/xmake/issues/1241): Support add .manifest files for windows program
* Support to use `xrepo remove --all` to remove all packages
* [#1254](https://github.com/xmake-io/xmake/issues/1254): Support to export packages to parent target

### Change

* [#1226](https://github.com/xmake-io/xmake/issues/1226): Add missing qt include directories
* [#1183](https://github.com/xmake-io/xmake/issues/1183): Improve c++ lanuages to support Qt6
* [#1237](https://github.com/xmake-io/xmake/issues/1237): Add qt.ui files for vsxmake plugin
* Improve vs/vsxmake plugins to support precompiled header and intellisense
* [#1090](https://github.com/xmake-io/xmake/issues/1090): Simplify integration of custom code generators
* [#1065](https://github.com/xmake-io/xmake/issues/1065): Improve protobuf rule to support compile_commands generators
* [#1249](https://github.com/xmake-io/xmake/issues/1249): Improve vs/vsxmake generator to support startproject
* [#605](https://github.com/xmake-io/xmake/issues/605): Improve to link orders for add_deps/add_packages
* Remove deprecated `add_defines_h_if_ok` and `add_defines_h` apis for option

### Bugs fixed

* [#1219](https://github.com/xmake-io/xmake/issues/1219): Fix version check and update
* [#1235](https://github.com/xmake-io/xmake/issues/1235): Fix include directories with spaces

## v2.5.1

### New features

* [#1035](https://github.com/xmake-io/xmake/issues/1035): The graphics configuration menu fully supports mouse events, and support scroll bar
* [#1098](https://github.com/xmake-io/xmake/issues/1098): Support stdin for os.execv
* [#1079](https://github.com/xmake-io/xmake/issues/1079): Add autoupdate plugin rule for vsxmake, `add_rules("plugin.vsxmake.autoupdate")`
* Add `xmake f --vs_runtime='MT'` and `set_runtimes("MT")` to set vs runtime for targets and packages
* [#1032](https://github.com/xmake-io/xmake/issues/1032): Support to enum registry keys and values
* [#1026](https://github.com/xmake-io/xmake/issues/1026): Support group for vs/vsxmake project
* [#1178](https://github.com/xmake-io/xmake/issues/1178): Add `add_requireconfs()` api to rewrite configs of depend packages
* [#1043](https://github.com/xmake-io/xmake/issues/1043): Add `luarocks.module` rule for luarocks-build-xmake
* [#1190](https://github.com/xmake-io/xmake/issues/1190): Support for Apple Silicon (macOS ARM)
* [#1145](https://github.com/xmake-io/xmake/pull/1145): Support Qt deploy for Windows, thanks @SirLynix

### Change

* [#1072](https://github.com/xmake-io/xmake/issues/1072): Fix and improve to parse cl deps
* Support utf8 for ui modules and `xmake f --menu`
* Improve to support zig on macOS
* [#1135](https://github.com/xmake-io/xmake/issues/1135): Improve multi-toolchain and multi-platforms for targets
* [#1153](https://github.com/xmake-io/xmake/issues/1153): Improve llvm toolchain to support sysroot on macOS
* [#1071](https://github.com/xmake-io/xmake/issues/1071): Improve to generate vs/vsxmake project to support for remote packages
* Improve vs/vsxmake project plugin to support global `set_arch()` setting
* [#1164](https://github.com/xmake-io/xmake/issues/1164): Improve to launch console programs for vsxmake project
* [#1179](https://github.com/xmake-io/xmake/issues/1179): Improve llvm toolchain and add isysroot

### Bugs fixed

* [#1091](https://github.com/xmake-io/xmake/issues/1091): Fix incorrect ordering of inherited library dependencies
* [#1105](https://github.com/xmake-io/xmake/issues/1105): Fix c++ language intellisense for vsxmake
* [#1132](https://github.com/xmake-io/xmake/issues/1132): Fix TrimEnd bug for vsxmake
* [#1142](https://github.com/xmake-io/xmake/issues/1142): Fix git not found when installing packages
* Fix macos.version bug for macOS Big Sur
* [#1084](https://github.com/xmake-io/xmake/issues/1084): Fix `add_defines()` bug (contain spaces)
* [#1195](https://github.com/xmake-io/xmake/pull/1195): Fix unicode problem for vs and improve find_vstudio/os.exec


## v2.3.9

### New features

* Add new [xrepo](https://github.com/xmake-io/xrepo) command to manage C/C++ packages
* Support for installing packages of cross-compilation
* Add musl.cc toolchains
* [#1009](https://github.com/xmake-io/xmake/issues/1009): Support select and install any version package, e.g. `add_requires("libcurl 7.73.0", {verify = false})`
* [#1016](https://github.com/xmake-io/xmake/issues/1016): Add license checking for target/packages
* [#1017](https://github.com/xmake-io/xmake/issues/1017): Support external/system include directories `add_sysincludedirs` for package and toolchains
* [#1020](https://github.com/xmake-io/xmake/issues/1020): Support to find and install pacman package on archlinux and msys2
* Support mouse for `xmake f --menu`

### Change

* [#997](https://github.com/xmake-io/xmake/issues/997): Support to set std lanuages for `xmake project -k cmake`
* [#998](https://github.com/xmake-io/xmake/issues/998): Support to install vcpkg packages with windows-static-md
* [#996](https://github.com/xmake-io/xmake/issues/996): Improve to find vcpkg directory
* [#1008](https://github.com/xmake-io/xmake/issues/1008): Improve cross toolchains
* [#1030](https://github.com/xmake-io/xmake/issues/1030): Improve xcode.framework and xcode.application rules
* [#1051](https://github.com/xmake-io/xmake/issues/1051): Add `edit` and `embed` to `set_symbols()` only for msvc
* [#1062](https://github.com/xmake-io/xmake/issues/1062): Improve `xmake project -k vs` plugin.

## v2.3.8

### New features

* [#955](https://github.com/xmake-io/xmake/issues/955): Add zig project templates
* [#956](https://github.com/xmake-io/xmake/issues/956): Add wasm platform and support Qt/Wasm SDK
* Upgrade luajit vm and support for runing on mips64 device
* [#972](https://github.com/xmake-io/xmake/issues/972): Add `depend.on_changed()` api to simplify adding dependent files
* [#981](https://github.com/xmake-io/xmake/issues/981): Add `set_fpmodels()` for math optimization mode
* [#980](https://github.com/xmake-io/xmake/issues/980): Support Intel C/C++ and Fortran Compiler
* [#986](https://github.com/xmake-io/xmake/issues/986): Support for `c11` and `c17` for MSVC Version 16.8 and Above
* [#979](https://github.com/xmake-io/xmake/issues/979): Add Abstraction for OpenMP. `add_rules("c++.openmp")`

### Change

* [#958](https://github.com/xmake-io/xmake/issues/958): Improve mingw platform to support llvm-mingw toolchain
* Improve `add_requires("zlib~xxx")` to support for installing multi-packages at same time
* [#977](https://github.com/xmake-io/xmake/issues/977): Improve find_mingw for windows
* [#978](https://github.com/xmake-io/xmake/issues/978): Improve toolchain flags order
* Improve Xcode toolchain to support for macOS/arm64

### Bugs fixed

* [#951](https://github.com/xmake-io/xmake/issues/951): Fix emcc support for windows
* [#992](https://github.com/xmake-io/xmake/issues/992): Fix filelock bug

## v2.3.7

### New features

* [#2941](https://github.com/microsoft/winget-pkgs/pull/2941): Add support for winget
* Add xmake-tinyc installer without msvc compiler for windows
* Add tinyc compiler toolchain
* Add emcc compiler toolchain (emscripten) to compiling to asm.js and WebAssembly
* [#947](https://github.com/xmake-io/xmake/issues/947): Add `xmake g --network=private` to enable the private network

### Change

* [#907](https://github.com/xmake-io/xmake/issues/907): Improve to the linker optimization for msvc
* Improve to detect qt sdk environment
* [#918](https://github.com/xmake-io/xmake/pull/918): Improve to support cuda11 toolchains
* Improve Qt support for ubuntu/apt
* Improve CMake project generator
* [#931](https://github.com/xmake-io/xmake/issues/931): Support to export packages with all dependences
* [#930](https://github.com/xmake-io/xmake/issues/930): Support to download package without version list directly 
* [#927](https://github.com/xmake-io/xmake/issues/927): Support to switch arm/thumb mode for android ndk
* Improve trybuild/cmake to support android/mingw/iphoneos/watchos toolchains

### Bugs fixed

* [#903](https://github.com/xmake-io/xmake/issues/903): Fix install vcpkg packages fails
* [#912](https://github.com/xmake-io/xmake/issues/912): Fix the custom toolchain
* [#914](https://github.com/xmake-io/xmake/issues/914): Fix bad light userdata pointer for lua on some aarch64 devices

## v2.3.6

### New features

* Add `xmake project -k xcode` generator (use cmake)
* [#870](https://github.com/xmake-io/xmake/issues/870): Support gfortran compiler
* [#887](https://github.com/xmake-io/xmake/pull/887): Support zig compiler
* [#893](https://github.com/xmake-io/xmake/issues/893): Add json module
* [#898](https://github.com/xmake-io/xmake/issues/898): Support cross-compilation for golang
* [#275](https://github.com/xmake-io/xmake/issues/275): Support go package manager to install go packages
* [#581](https://github.com/xmake-io/xmake/issues/581): Support dub package manager to install dlang packages

### Change

* [#868](https://github.com/xmake-io/xmake/issues/868): Support new cl.exe dependency report files, `/sourceDependencies xxx.json`
* [#902](https://github.com/xmake-io/xmake/issues/902): Improve to detect cross-compilation toolchain

## v2.3.5

### New features

* Add `xmake show -l envs` to show all builtin envirnoment variables
* [#861](https://github.com/xmake-io/xmake/issues/861): Support search local package file to install remote package
* [#854](https://github.com/xmake-io/xmake/issues/854): Support global proxy settings for curl, wget and git

### Change

* [#828](https://github.com/xmake-io/xmake/issues/828): Support to import sub-directory files for protobuf rules
* [#835](https://github.com/xmake-io/xmake/issues/835): Improve mode.minsizerel to add /GL flags for msvc
* [#828](https://github.com/xmake-io/xmake/issues/828): Support multi-level directories for protobuf/import
* [#838](https://github.com/xmake-io/xmake/issues/838#issuecomment-643570920): Support to override builtin-rules for `add_files("src/*.c", {rules = {"xx", override = true}})`
* [#847](https://github.com/xmake-io/xmake/issues/847): Support to parse include deps for rc file
* Improve msvc tool chain, remove the dependence of global environment variables
* [#857](https://github.com/xmake-io/xmake/pull/857): Improved `set_toolchains()` when cross-compilation is supported, specific target can be switched to host toolchain and compiled at the same time

### Bugs fixed

* Fix the progress bug for theme
* [#829](https://github.com/xmake-io/xmake/issues/829): Fix invalid sysroot path for macOS
* [#832](https://github.com/xmake-io/xmake/issues/832): Fix find_packages bug for the debug mode

## v2.3.4

### New features

* [#630](https://github.com/xmake-io/xmake/issues/630): Support *BSD system, e.g. FreeBSD, ..
* Add wprint builtin api to show warnings
* [#784](https://github.com/xmake-io/xmake/issues/784): Add `set_policy()` to set and modify some builtin policies
* [#780](https://github.com/xmake-io/xmake/issues/780): Add set_toolchains/set_toolsets for target and improve to detect cross-compilation toolchains
* [#798](https://github.com/xmake-io/xmake/issues/798): Add `xmake show` plugin to show some builtin configuration values and infos
* [#797](https://github.com/xmake-io/xmake/issues/797): Add ninja theme style, e.g. `xmake g --theme=ninja`
* [#816](https://github.com/xmake-io/xmake/issues/816): Add mode.releasedbg and mode.minsizerel rules
* [#819](https://github.com/xmake-io/xmake/issues/819): Support ansi/vt100 terminal control

### Change

* [#771](https://github.com/xmake-io/xmake/issues/771): Check includedirs, linkdirs and frameworkdirs
* [#774](https://github.com/xmake-io/xmake/issues/774): Support ltui windows resize for `xmake f --menu`
* [#782](https://github.com/xmake-io/xmake/issues/782): Add check flags failed tips for add_cxflags, ..
* [#808](https://github.com/xmake-io/xmake/issues/808): Support add_frameworks for cmakelists
* [#820](https://github.com/xmake-io/xmake/issues/820): Support independent working/build directory

### Bug fixed

* [#786](https://github.com/xmake-io/xmake/issues/786): Fix check header file deps
* [#810](https://github.com/xmake-io/xmake/issues/810): Fix strip debug bug for linux

## v2.3.3

### New features

* [#727](https://github.com/xmake-io/xmake/issues/727): Strip and generate debug symbols file (.so/.dSYM) for android/ios program
* [#687](https://github.com/xmake-io/xmake/issues/687): Support to generate objc/bundle program.
* [#743](https://github.com/xmake-io/xmake/issues/743): Support to generate objc/framework program.
* Support to compile bundle, framework, mac application and ios application, and all some project templates
* Support generate ios *.ipa file and codesign
* Add xmake.cli rule to develop lua program with xmake core engine

### Change

* [#750](https://github.com/xmake-io/xmake/issues/750): Improve qt.widgetapp rule to support private slot

## v2.3.2

### New features

* Add powershell theme for powershell terminal
* Add `xmake --dry-run -v` to dry run building target and only show verbose build command.
* [#712](https://github.com/xmake-io/xmake/issues/712): Add sdcc platform and support sdcc compiler

### Change

* [#589](https://github.com/xmake-io/xmake/issues/589): Improve and optimize build speed, supports parallel compilation and linking across targets
* Improve the ninja/cmake generator
* [#728](https://github.com/xmake-io/xmake/issues/728): Improve os.cp to support reserve source directory structure
* [#732](https://github.com/xmake-io/xmake/issues/732): Improve find_package to support `homebrew/cmake` pacakges
* [#695](https://github.com/xmake-io/xmake/issues/695): Improve android abi

### Bugs fixed

* Fix the link errors output issues for msvc
* [#718](https://github.com/xmake-io/xmake/issues/718): Fix download cache bug for package
* [#722](https://github.com/xmake-io/xmake/issues/722): Fix invalid package deps
* [#719](https://github.com/xmake-io/xmake/issues/719): Fix process exit bug
* [#720](https://github.com/xmake-io/xmake/issues/720): Fix compile_commands generator

## v2.3.1

### New features

* [#675](https://github.com/xmake-io/xmake/issues/675): Support to compile `*.c` as c++, `add_files("*.c", {sourcekind = "cxx"})`.
* [#681](https://github.com/xmake-io/xmake/issues/681): Support compile xmake on msys/cygwin and add msys/cygwin platform
* Add socket/pipe io modules and support to schedule socket/process/pipe in coroutine
* [#192](https://github.com/xmake-io/xmake/issues/192): Try building project with the third-party buildsystem
* Enable color diagnostics output for gcc/clang
* [#588](https://github.com/xmake-io/xmake/issues/588): Improve project generator, `xmake project -k ninja`, support for build.ninja

### Change

* [#665](https://github.com/xmake-io/xmake/issues/665): Support to parse *nix style command options, thanks [@OpportunityLiu](https://github.com/OpportunityLiu)
* [#673](https://github.com/xmake-io/xmake/pull/673): Improve tab complete to support argument values
* [#680](https://github.com/xmake-io/xmake/issues/680): Improve get.sh scripts and add download mirrors
* Improve process scheduler
* [#651](https://github.com/xmake-io/xmake/issues/651): Improve os/io module syserrors tips

### Bugs fixed

* Fix incremental compilation for checking the dependent file 
* Fix log output for parsing xmake-vscode/problem info
* [#684](https://github.com/xmake-io/xmake/issues/684): Fix linker errors for android ndk on windows

## v2.2.9

### New features

* [#569](https://github.com/xmake-io/xmake/pull/569): Add c++ modules build rules
* Add `xmake project -k xmakefile` generator
* [620](https://github.com/xmake-io/xmake/issues/620): Add global `~/.xmakerc.lua` for all projects.
* [593](https://github.com/xmake-io/xmake/pull/593): Add `core.base.socket` module.

### Change

* [#563](https://github.com/xmake-io/xmake/pull/563): Separate build rules for specific language files from action/build 
* [#570](https://github.com/xmake-io/xmake/issues/570): Add `qt.widgetapp` and `qt.quickapp` rules
* [#576](https://github.com/xmake-io/xmake/issues/576): Uses `set_toolchain` instead of `add_tools` and `set_tools`
* Improve `xmake create` action
* [#589](https://github.com/xmake-io/xmake/issues/589): Improve the default build jobs number to optimize build speed
* [#598](https://github.com/xmake-io/xmake/issues/598): Improve find_package to support .tbd libraries on macOS
* [#615](https://github.com/xmake-io/xmake/issues/615): Support to install and use other archs and ios conan packages
* [#629](https://github.com/xmake-io/xmake/issues/629): Improve hash.uuid and implement uuid v4
* [#639](https://github.com/xmake-io/xmake/issues/639): Improve to parse argument options to support -jN

### Bugs fixed

* [#567](https://github.com/xmake-io/xmake/issues/567): Fix out of memory for serialize 
* [#566](https://github.com/xmake-io/xmake/issues/566): Fix link order problem with remote packages 
* [#565](https://github.com/xmake-io/xmake/issues/565): Fix run path for vcpkg packages
* [#597](https://github.com/xmake-io/xmake/issues/597): Fix run `xmake require` command too slowly
* [#634](https://github.com/xmake-io/xmake/issues/634): Fix mode.coverage rule and check flags

## v2.2.8

### New features

* Add protobuf c/c++ rules
* [#468](https://github.com/xmake-io/xmake/pull/468): Add utf-8 support for io module on windows
* [#472](https://github.com/xmake-io/xmake/pull/472): Add `xmake project -k vsxmake` plugin to support call xmake from vs/msbuild
* [#487](https://github.com/xmake-io/xmake/issues/487): Support to build the selected files for the given target
* Add filelock for io
* [#513](https://github.com/xmake-io/xmake/issues/513): Support for android/termux
* [#517](https://github.com/xmake-io/xmake/issues/517): Add `add_cleanfiles` api for target
* [#537](https://github.com/xmake-io/xmake/pull/537): Add `set_runenv` api to override os/envs 

### Changes

* [#257](https://github.com/xmake-io/xmake/issues/257): Lock the whole project to avoid other process to access.
* Attempt to enable /dev/shm for the os.tmpdir
* [#542](https://github.com/xmake-io/xmake/pull/542): Improve vs unicode output for link/cl
* Improve binary bitcode lua scripts in the program directory

### Bugs fixed

* [#549](https://github.com/xmake-io/xmake/issues/549): Fix error caused by the new vsDevCmd.bat of vs2019

## v2.2.7

### New features

* [#455](https://github.com/xmake-io/xmake/pull/455): support clang as cuda compiler, try `xmake f --cu=clang`
* [#440](https://github.com/xmake-io/xmake/issues/440): Add `set_rundir()` and `add_runenvs()` api for target/run
* [#443](https://github.com/xmake-io/xmake/pull/443): Add tab completion support
* Add `on_link`, `before_link` and `after_link` for rule and target
* [#190](https://github.com/xmake-io/xmake/issues/190): Add `add_rules("lex", "yacc")` rules to support lex/yacc projects

### Changes

* [#430](https://github.com/xmake-io/xmake/pull/430): Add `add_cucodegens()` api to improve set codegen for cuda
* [#432](https://github.com/xmake-io/xmake/pull/432): support deps analyze for cu file (for CUDA 10.1+)
* [#437](https://github.com/xmake-io/xmake/issues/437): Support explict git source for xmake update, `xmake update github:xmake-io/xmake#dev`
* [#438](https://github.com/xmake-io/xmake/pull/438): Support to only update scripts, `xmake update --scriptonly dev`
* [#433](https://github.com/xmake-io/xmake/issues/433): Improve cuda to support device-link
* [#442](https://github.com/xmake-io/xmake/issues/442): Improve test library

## v2.2.6

### New features

* [#380](https://github.com/xmake-io/xmake/pull/380): Add support to export compile_flags.txt 
* [#382](https://github.com/xmake-io/xmake/issues/382): Simplify simple scope settings
* [#397](https://github.com/xmake-io/xmake/issues/397): Add clib package manager support
* [#404](https://github.com/xmake-io/xmake/issues/404): Support Qt for android and deploy android apk
* Add some qt empty project templates, e.g. `widgetapp_qt`, `quickapp_qt_static` and `widgetapp_qt_static`
* [#415](https://github.com/xmake-io/xmake/issues/415): Add `--cu-cxx` config arguments to `nvcc/-ccbin`
* Add `--ndk_stdcxx=y` and `--ndk_cxxstl=gnustl_static` argument options for android NDK

### Changes

* Improve remote package manager
* Improve `target:on_xxx` scripts to support to match `android|armv7-a@macosx,linux|x86_64` pattern
* Improve loadfile to optimize startup speed, decrease 98% time

### Bugs fixed

* [#400](https://github.com/xmake-io/xmake/issues/400): fix c++ languages bug for qt rules

## v2.2.5

### New features

* Add `string.serialize` and `string.deserialize` to serialize and deserialize object, function and others.
* Add `xmake g --menu`
* [#283](https://github.com/xmake-io/xmake/issues/283): Add `target:installdir()` and `set_installdir()` api for target
* [#260](https://github.com/xmake-io/xmake/issues/260): Add `add_platformdirs` api, we can define custom platforms
* [#310](https://github.com/xmake-io/xmake/issues/310): Add theme feature
* [#318](https://github.com/xmake-io/xmake/issues/318): Add `add_installfiles` api to target
* [#339](https://github.com/xmake-io/xmake/issues/339): Improve `add_requires` and `find_package` to integrate the 3rd package manager
* [#327](https://github.com/xmake-io/xmake/issues/327): Integrate with Conan package manager 
* Add the builtin api `find_packages("pcre2", "zlib")` to find multiple packages
* [#320](https://github.com/xmake-io/xmake/issues/320): Add template configuration files and replace all variables before building
* [#179](https://github.com/xmake-io/xmake/issues/179): Generate CMakelist.txt file for `xmake project` plugin
* [#361](https://github.com/xmake-io/xmake/issues/361): Support vs2019 preview
* [#368](https://github.com/xmake-io/xmake/issues/368): Support `private, public, interface` to improve dependency inheritance like cmake
* [#284](https://github.com/xmake-io/xmake/issues/284): Add passing user configs description for `package()`
* [#319](https://github.com/xmake-io/xmake/issues/319): Add `add_headerfiles` to improve to set header files and directories
* [#342](https://github.com/xmake-io/xmake/issues/342): Add some builtin help functions for `includes()`, e.g. `check_cfuncs`

### Changes

* Improve to switch version and debug mode for the dependent packages
* [#264](https://github.com/xmake-io/xmake/issues/264): Support `xmake update dev` on windows
* [#293](https://github.com/xmake-io/xmake/issues/293): Add `xmake f/g --mingw=xxx` configuration option and improve to find_mingw
* [#301](https://github.com/xmake-io/xmake/issues/301): Improve precompiled header file
* [#322](https://github.com/xmake-io/xmake/issues/322): Add `option.add_features`, `option.add_cxxsnippets` and `option.add_csnippets`
* Remove some deprecated interfaces of xmake 1.x, e.g. `add_option_xxx`
* [#327](https://github.com/xmake-io/xmake/issues/327): Support conan package manager for `lib.detect.find_package` 
* Improve `lib.detect.find_package` and add builtin `find_packages("zlib 1.x", "openssl", {xxx = ...})` api
* Mark `set_modes()` as deprecated, we use `add_rules("mode.debug", "mode.release")` instead of it
* [#353](https://github.com/xmake-io/xmake/issues/353): Improve `target:set`, `target:add` and add `target:del` to modify target configuration
* [#356](https://github.com/xmake-io/xmake/issues/356): Add `qt_add_static_plugins()` api to support static Qt sdk
* [#351](https://github.com/xmake-io/xmake/issues/351): Support yasm for generating vs201x project
* Improve the remote package manager.

### Bugs fixed

* Fix cannot call `set_optimize()` to set optimization flags when exists `add_rules("mode.release")`
* [#289](https://github.com/xmake-io/xmake/issues/289): Fix unarchive gzip file failed on windows
* [#296](https://github.com/xmake-io/xmake/issues/296): Fix `option.add_includedirs` for cuda
* [#321](https://github.com/xmake-io/xmake/issues/321): Fix find program bug with $PATH envirnoment

## v2.2.3

### New features

* [#233](https://github.com/xmake-io/xmake/issues/233): Support windres for mingw platform
* [#239](https://github.com/xmake-io/xmake/issues/239): Add cparser compiler support
* Add plugin manager `xmake plugin --help`
* Add `add_syslinks` api to add system libraries dependence
* Add `xmake l time xmake [--rebuild]` to record compilation time
* [#250](https://github.com/xmake-io/xmake/issues/250): Add `xmake f --vs_sdkver=10.0.15063.0` to change windows sdk version
* Add `lib.luajit.ffi` and `lib.luajit.jit` extension modules
* [#263](https://github.com/xmake-io/xmake/issues/263): Add new target kind: object to only compile object files

### Changes

* [#229](https://github.com/xmake-io/xmake/issues/229): Improve to select toolset for vcproj plugin
* Improve compilation dependences
* Support *.xz for extractor
* [#249](https://github.com/xmake-io/xmake/pull/249): revise progress formatting to space-leading three digit percentages 
* [#247](https://github.com/xmake-io/xmake/pull/247): Add `-D` and `--diagnosis` instead of `--backtrace`
* [#259](https://github.com/xmake-io/xmake/issues/259): Improve on_build, on_build_file and on_xxx for target and rule
* [#269](https://github.com/xmake-io/xmake/issues/269): Clean up the temporary files at last 30 days
* Improve remote package manager
* Support to add packages with only header file
* Support to modify builtin package links, e.g. `add_packages("xxx", {links = {}})`

### Bugs fixed

* Fix state inconsistency after failed outage of installation dependency package

## v2.2.2

### New features

* Support fasm assembler
* Add `has_config`, `get_config`, and `is_config` apis
* Add `set_config` to set the default configuration
* Add `$xmake --try` to try building project using third-party buildsystem
* Add `set_enabled(false)` to disable target 
* [#69](https://github.com/xmake-io/xmake/issues/69): Add remote package management, `add_requires("tbox ~1.6.1")`
* [#216](https://github.com/xmake-io/xmake/pull/216): Add windows mfc rules

### Changes

* Improve to detect Qt envirnoment and support mingw
* Add debug and release rules to the auto-generated xmake.lua
* [#178](https://github.com/xmake-io/xmake/issues/178): Modify the shared library name for mingw.
* Support case-insensitive path pattern-matching for `add_files()` on windows
* Improve to detect Qt sdk directory for `detect.sdks.find_qt`
* [#184](https://github.com/xmake-io/xmake/issues/184): Improve `lib.detect.find_package` to support vcpkg
* [#208](https://github.com/xmake-io/xmake/issues/208): Improve rpath for shared library
* [#225](https://github.com/xmake-io/xmake/issues/225): Improve to detect vs envirnoment

### Bug fixed

* [#177](https://github.com/xmake-io/xmake/issues/177): Fix the dependent target link bug
* Fix high cpu usage bug and Exit issues for `$ xmake f --menu`
* [#197](https://github.com/xmake-io/xmake/issues/197): Fix Chinese path for generating vs201x project
* Fix wdk rules bug
* [#205](https://github.com/xmake-io/xmake/pull/205): Fix targetdir,objectdir not used in vsproject 

## v2.2.1

### New features

* [#158](https://github.com/xmake-io/xmake/issues/158): Support CUDA Toolkit and Compiler
* Add `set_tools` and `add_tools` apis to change the toolchains for special target
* Add builtin rules: `mode.debug`, `mode.release`, `mode.profile` and `mode.check`
* Add `is_mode`, `is_arch` and `is_plat` builtin apis in the custom scripts
* Add color256 codes
* [#160](https://github.com/xmake-io/xmake/issues/160): Support Qt compilation environment and add `qt.console`, `qt.application` rules
* Add some Qt project templates
* [#169](https://github.com/xmake-io/xmake/issues/169): Support yasm for linux, macosx and windows
* [#159](https://github.com/xmake-io/xmake/issues/159): Support WDK driver compilation environment 

### Changes

* Add FAQ to the auto-generated xmake.lua
* Support android NDK >= r14
* Improve warning flags for swiftc
* [#167](https://github.com/xmake-io/xmake/issues/167): Improve custom rules
* Improve `os.files` and `os.dirs` api
* [#171](https://github.com/xmake-io/xmake/issues/171): Improve build dependence for qt rule
* Implement `make clean` for generating makefile plugin

### Bugs fixed

* Fix force to add flags bug
* [#157](https://github.com/xmake-io/xmake/issues/157): Fix generate pdb file error if it's output directory does not exists
* Fix strip all symbols bug for macho target file
* [#168](https://github.com/xmake-io/xmake/issues/168): Fix generate vs201x project bug with x86/x64 architectures

## v2.1.9

### New features

* Add `del_files()` api to delete files in the files list
* Add `rule()`, `add_rules()` api to implement the custom build rule and improve `add_files("src/*.md", {rule = "markdown"})`
* Add `os.filesize()` api
* Add `core.ui.xxx` cui components
* Add `xmake f --menu` to configure project with a menu configuration interface
* Add `set_values` api to `option()`
* Support to generate a menu configuration interface from user custom project options
* Add source file position to interpreter and search results in menu

### Changes

* Improve to configure cross-toolchains, add tool alias to support unknown tool name, .e.g `xmake f --cc=gcc@ccmips.exe`
* [#151](https://github.com/xmake-io/xmake/issues/151): Improve to build the share library for the mingw platform
* Improve to generate makefile plugin
* Improve the checking errors tips
* Improve `add_cxflags` .., force to set flags without auto checking: `add_cxflags("-DTEST", {force = true})`
* Improve `add_files`, add force block to force to set flags without auto checking: `add_files("src/*.c", {force = {cxflags = "-DTEST"}})`
* Improve to search the root project directory
* Improve to detect vs environment
* Upgrade luajit to 2.1.0-beta3
* Support to run xmake on linux (arm, arm64)
* Improve to generate vs201x project plugin

### Bugs fixed

* Fix complation dependence
* [#151](https://github.com/xmake-io/xmake/issues/151): Fix `os.nuldev()` for gcc on mingw
* [#150](https://github.com/xmake-io/xmake/issues/150): Fix the command line string limitation for `ar.exe`
* Fix `xmake f --cross` error
* Fix `os.cd` to the windows root path bug

## v2.1.8

### New features

* Add `XMAKE_LOGFILE` environment variable to dump the output info to file
* Support tinyc compiler

### Changes

* Improve support for IDE/editor plugins (.e.g vscode, sublime, intellij-idea)
* Add `.gitignore` file when creating new projects
* Improve to create template project
* Improve to detect toolchains on macosx without xcode
* Improve `set_config_header` to support `set_config_header("config", {version = "2.1.8", build = "%Y%m%d%H%M"})`

### Bugs fixed

* [#145](https://github.com/xmake-io/xmake/issues/145): Fix the current directory when running target

## v2.1.7

### New features

* Add `add_imports` to bulk import modules for the target, option and package script
* Add `xmake -y/--yes` to confirm the user input by default
* Add `xmake l package.manager.install xxx` to install software package
* Add xmake plugin for vscode editor, [xmake-vscode](https://marketplace.visualstudio.com/items?itemName=tboox.xmake-vscode#overview)
* Add `xmake macro ..` to run the last command

### Changes

* Support 24bits truecolors for `cprint()`
* Support `@loader_path` and `$ORIGIN` for `add_rpathdirs()`
* Improve `set_version("x.x.x", {build = "%Y%m%d%H%M"})` and add build version
* Move docs directory to xmake-docs repo
* Improve install and uninstall actions and support DESTDIR and PREFIX envirnoment variables
* Optimize to detect flags
* Add `COLORTERM=nocolor` to disable color output
* Remove `and_bindings` and `add_rbindings` api
* Disable to output colors code to file
* Update project templates with tbox
* Improve `lib.detect.find_program` interface
* Enable colors output for windows cmd
* Add `-w|--warning` arguments to enable the warnings output

### Bugs fixed

* Fix `set_pcxxheader` bug
* [#140](https://github.com/xmake-io/xmake/issues/140): Fix `os.tmpdir()` in fakeroot
* [#142](https://github.com/xmake-io/xmake/issues/142): Fix `os.getenv` charset bug on windows
* Fix compile error with spaces path
* Fix setenv empty value bug

## v2.1.6

### Changes

* Improve `add_files` to configure the compile option of the given files
* Inherit links and linkdirs from the dependent targets and options
* Improve `target.add_deps` and add inherit config, .e.g `add_deps("test", {inherit = false})`
* Remove the binary files of `tbox.pkg`
* Use `/Zi` instead of `/ZI` for msvc

### Bugs fixed

* Fix target deps
* Fix `target:add` and `option:add` bug
* Fix compilation and installation bug on archlinux

## v2.1.5

### New features

* [#83](https://github.com/xmake-io/xmake/issues/83): Add `add_csnippet` and `add_cxxsnippet` into `option` for detecting some compiler features.
* [#83](https://github.com/xmake-io/xmake/issues/83): Add user extension modules to detect program, libraries and files.
* Add `find_program`, `find_file`, `find_library`, `find_tool` and `find_package` module interfaces.
* Add `net.*` and `devel.*` extension modules
* Add `val()` api to get the value of builtin-variable, .e.g `val("host")`, `val("env PATH")`, `val("shell echo hello")` and `val("reg HKEY_LOCAL_MACHINE\\XX;Value")`
* Support to compile the microsoft resource file (.rc)
* Add `has_flags`, `features` and `has_features` for detect module interfaces.
* Add `option.on_check`, `option.after_check` and `option.before_check` api
* Add `target.on_load` api
* [#132](https://github.com/xmake-io/xmake/issues/132): Add `add_frameworkdirs` api
* Add `lib.detect.has_xxx` and `lib.detect.find_xxx` apis.
* Add `add_moduledirs` api
* Add `includes` api instead of `add_subdirs` and `add_subfiles`
* [#133](https://github.com/xmake-io/xmake/issues/133): Improve the project plugin to generate `compile_commands.json` by run  `xmake project -k compile_commands`
* Add `set_pcheader` and `set_pcxxheader` to support the precompiled header, support gcc, clang, msvc
* Add `xmake f -p cross` platform and support the custom platform

### Changes

* [#87](https://github.com/xmake-io/xmake/issues/87): Add includes and links from target deps automatically 
* Improve `import` to load user extension and global modules
* [#93](https://github.com/xmake-io/xmake/pull/93): Improve `xmake lua` to run a single line command
* Improve to print gcc error and warning info
* Improve `print` interface to dump table
* [#111](https://github.com/xmake-io/xmake/issues/111): Add `--root` common option to allow run xmake command as root
* [#113](https://github.com/xmake-io/xmake/pull/113): Privilege manage when running as root, store the root privilege and degrade.
* Improve `xxx_script` in `xmake.lua` to support pattern match, .e.g `on_build("iphoneos|arm*", function (target) end)`
* improve builtin-variables to support to get the value envirnoment and registry
* Improve to detect vstudio sdk and cross toolchains envirnoment
* [#71](https://github.com/xmake-io/xmake/issues/71): Improve to detect compiler and linker from env vars
* Improve the option detection (cache and multi-jobs) and increase 70% speed
* [#129](https://github.com/xmake-io/xmake/issues/129): Check link deps and cache the target file
* Support `*.asm` source files for vs201x project plugin
* Mark `add_bindings` and `add_rbindings` as deprecated
* Optimize `xmake rebuild` speed on windows
* Move `core.project.task` to `core.base.task`
* Move `echo` and `app2ipa` plugins to [xmake-plugins](https://github.com/xmake-io/xmake-plugins) repo.
* Add new api `set_config_header("config.h", {prefix = ""})` instead of `set_config_h` and `set_config_h_prefix`

### Bugs fixed

* Fix `try-catch-finally`
* Fix interpreter bug when parsing multi-level subdirs
* [#115](https://github.com/xmake-io/xmake/pull/115): Fix the path problem of the install script `get.sh`
* Fix cache bug for import()

## v2.1.4

### New features

* [#68](https://github.com/xmake-io/xmake/issues/68): Add `$(programdir)` and `$(xmake)` builtin variables
* add `is_host` api to get current host operating system
* [#79](https://github.com/xmake-io/xmake/issues/79): Improve `xmake lua` to run interactive commands, read-eval-print (REPL)

### Changes

* Modify option menu color.
* [#71](https://github.com/xmake-io/xmake/issues/71): Improve to map optimization flags for cl.exe
* [#73](https://github.com/xmake-io/xmake/issues/73): Attempt to get executable path as xmake's program directory
* Improve the scope of `xmake.lua` in `add_subdirs` and use independent sub-scope to avoid dirty scope
* [#78](https://github.com/xmake-io/xmake/pull/78): Get terminal size in runtime and soft-wrap the help printing
* Avoid generate `.xmake` directory if be not in project

### Bugs fixed

* [#67](https://github.com/xmake-io/xmake/issues/67): Fix `sudo make install` permission problem
* [#70](https://github.com/xmake-io/xmake/issues/70): Fix check android compiler error
* Fix temporary file path conflict
* Fix `os.host` and `os.arch` interfaces
* Fix interpreter bug for loading root api
* [#77](https://github.com/xmake-io/xmake/pull/77): fix `cprint` no color reset eol

## v2.1.3

### New features

* [#65](https://github.com/xmake-io/xmake/pull/65): Add `set_default` api for target to modify default build and install behavior
* Allows to run `xmake` command in project subdirectories, it will find the project root directory automatically
* Add `add_rpathdirs` for target and option

### Changes

* [#61](https://github.com/xmake-io/xmake/pull/61): Provide safer `xmake install` and `xmake uninstall` task with administrator permission
* Provide `rpm`, `deb` and `osxpkg` install package
* [#63](https://github.com/xmake-io/xmake/pull/63): More safer build and install xmake
* [#61](https://github.com/xmake-io/xmake/pull/61): Check run command as root
* Improve check toolchains and implement delay checking
* Add user tips when scanning and generating `xmake.lua` automatically

### Bugs fixed

* Fix error tips for checking xmake min version
* [#60](https://github.com/xmake-io/xmake/issues/60): Fix self-build for macosx and windows
* [#64](https://github.com/xmake-io/xmake/issues/64): Fix compile android `armv8-a` error
* [#50](https://github.com/xmake-io/xmake/issues/50): Fix only position independent executables issue for android program

## v2.1.2

### New features

* Add aur package script and support to install xmake from yaourt
* Add [set_basename](#http://xmake.io/#/manual?id=targetset_basename) api for target

### Changes

* Support vs2017
* Support compile rust for android
* Improve vs201x project plugin and support multi-modes compilation.

### Bugs fixed

* Fix cannot find android sdk header files
* Fix checking option bug
* [#57](https://github.com/xmake-io/xmake/issues/57): Fix code files mode to 0644

## v2.1.1

### New features

* Add `--links`, `--linkdirs` and `--includedirs` configure arguments
* Add app2ipa plugin
* Add dictionary syntax style for `xmake.lua`
* Provide smart scanning and building mode without `xmake.lua`
* Add `set_xmakever` api for `xmake.lua`
* Add `add_frameworks` api for `objc` and `swift`
* Support multi-languages extension and add `golang`, `dlang` and `rust` language
* Add optional `target_end`, `option_end`, `task_end` apis for scope
* Add `golang`, `dlang` and `rust` project templates

### Changes

* Support vs2017 for the project plugin
* Improve gcc error and warning tips
* Improve lanuage module
* Improve print interface, support lua print and format output
* Automatically scan project files and generate it for building if xmake.lua not exists
* Modify license to Apache License 2.0
* Remove some binary tools
* Remove install.bat script and provide nsis install package
* Rewrite [documents](http://www.xmake.io/#/home/) using [docute](https://github.com/egoist/docute)
* Improve `os.run`, `os.exec`, `os.cp`, `os.mv` and `os.rm` interfaces and support wildcard pattern
* Optimize the output info and add `-q|--quiet` option
* Improve makefile generator, uses $(XX) variables for tools and flags

### Bugs fixed

* [#41](https://github.com/waruqi/xmake/issues/41): Fix checker bug for windows 
* [#43](https://github.com/waruqi/xmake/issues/43): Avoid to generate unnecessary .xmake directory  
* Add c++ stl search directories for android
* Fix compile error for rhel 5.10
* Fix `os.iorun` bug

## v2.0.5

### New features

* Add some interpreter builtin-modules
* Support ml64 assembler for windows x64

### Changes

* Improve ipairs and pairs interfaces and support filter
* Add filters for generating vs201x project
* Remove `core/tools` (msys toolchains) and uses xmake to compile core sources on windows
* Remove `xmake/packages` for templates

### Bugs fixed

* Fix `-def:xxx.def` flags failed for msvc
* Fix ml.exe assembler script
* Fix options linking order bug

## v2.0.4

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

## v2.0.3

### New features 

* Add check includes dependence automatically
* Add print colors 
* Add debugger support, .e.g `xmake run -d program ...`

### Changes

* Improve the interfaces of run shell
* Upgrade luajit to v2.0.4
* Improve to generate makefile plugin
* Optimizate the multitasking compiling speed

### Bugs fixed

* Fix install directory bug
* Fix the root directory error for `import` interface
* Fix check visual stdio error on windows

## v2.0.2

### Changes

* Change install and uninstall actions
* Update templates
* Improve to check function 

### Bugs fixed

* [#7](https://github.com/waruqi/xmake/issues/7): Fix create project bug with '[targetname]'
* [#9](https://github.com/waruqi/xmake/issues/9): Support clang with c++11
* Fix api scope leaks bug
* Fix path bug for windows
* Fix check function bug
* Fix check toolchains failed
* Fix compile failed for android on windows 

## v2.0.1

### New features

* Add task api for running custom tasks
* Add plugin expansion and provide some builtin plugins
* Add export ide project plugin(.e.g makefile and will support to export other projects for vs, xcode in feature)
* Add demo plugin for printing 'hello xmake'
* Add make doxygen documents plugin
* Add macro script plugin
* Add more modules for developing plugin
* Add exception using try/catch and simplify grammar for plugin script
* Add option bindings
* Show progress when building

### Changes

* Rewrite interpreter for xmake.lua
* More strict syntax detection mechanism
* More strict api scope for xmake.lua 
* Simplify template development
* Extend platforms, tools, templates and actions fastly
* Simplify api and support import modules
* Remove dependence for gnu make/nmake, no longer need makefile
* Optimize speed for building and faster x4 than v1.0.4
* Optimize automatic detection 
* Modify some api name, but be compatible with the old version
* Optimize merging static library
* Simplify cross compilation using argument `--sdk=xxx`
* Simplify boolean option for command line, .e.g `xmake config --xxx=[y|n|yes|no|true|false]`
* Merge iphoneos and iphonesimulator platforms
* Merge watchos and watchsimulator platformss

### Bugs fixed

* [#3](https://github.com/waruqi/xmake/issues/3): ArchLinux compilation failed
* [#4](https://github.com/waruqi/xmake/issues/4): Install failed for windows
* Fix envirnoment variable bug for windows

## v1.0.4

### New features

* Support windows assembler
* Add some project templates
* Support swift codes
* Add -v argument for outputing more verbose info
* Add apple platforms：watchos, watchsimulator
* Add architecture x64, amd64, x86_amd64 for windows
* Support switch static and share library
* Add `-j/--jobs` argument for supporting multi-jobs 

### Changes

* Improve `add_files` api and support to add `*.o/obj/a/lib` files for merging static library and object files
* Optimize installation and remove some binary files

### Bugs fixed

* [#1](https://github.com/waruqi/xmake/issues/4): Install failed for win7
* Fix checking toolchains bug
* Fix install script bug
* Fix install bug for linux x86_64

## v1.0.3

### New features

* Add `set_runscript` api and support custom action
* Add import api and support import modules in xmake.lua, .e.g os, path, utils ...
* Add new architecture: arm64-v8a for android

### Bugs fixed

* Fix api bug for `set_installscript`
* Fix install bug for windows `x86_64`
* Fix relative path bug
