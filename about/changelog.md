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
