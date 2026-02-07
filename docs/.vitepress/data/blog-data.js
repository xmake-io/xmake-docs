export const posts = [
  {
    "title": "Xmake v3.0.7 Preview, Package Schemes, Wasm in Browser and UTF-8 Module",
    "url": "/posts/xmake-update-v3.0.7",
    "date": {
      "time": 1770465600000,
      "string": "February 7, 2026"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "verilator",
      "alpine",
      "nix",
      "qt",
      "nim",
      "zig",
      "wasm",
      "utf8"
    ],
    "excerpt": "<p>In this release, we have added support for Package Schemes, providing more flexible package installation and fallback mechanisms. We also improved Nix package manager support, optimized Verilator builds, and added support for Qt SDK dynamic mkspec selection.</p>\n<p>Additionally, we now support running Wasm programs in the browser, reading scripts from standard input (stdin), and introduced several new modules and functions, such as <code>cli.iconv</code>, <code>utf8</code>, and <code>os.access</code>.</p>\n<p>The <code>scheme</code> feature is mainly used to provide multiple installation schemes, where each scheme may use different urls, versions, and install logic. Whenever one scheme fails to install, Xmake will automatically try the next installation scheme, thereby improving the installation success rate. This...</p>\n"
  },
  {
    "title": "Xmake GSoC 2026 Ideas List",
    "url": "/posts/xmake-gsoc-2026-ideas",
    "date": {
      "time": 1769169600000,
      "string": "January 23, 2026"
    },
    "author": "Xmake Team",
    "tags": [
      "xmake",
      "gsoc",
      "open-source",
      "community"
    ],
    "excerpt": "<p>Welcome! This is the curated Ideas List for the <a href=\"https://xmake.io\">Xmake Project</a> and related repositories for Google Summer of Code 2026. Each idea below outlines a meaningful project for contributors. For any questions or clarifications, please join our [Discord Community](https://discord.gg/xmake...</p>\n<p><strong>Goal:</strong><br>\nResearch, create, and contribute new packages (libraries, tools, or headers) to the community-oriented <a href=\"https://github.com/xmake-io/xmake-repo\">xmake-repo</a> package repository. Tasks include **writing package scripts, testing/fixing build scripts on various platforms, and documenting usag...</p>\n<p><strong>Skills Required:</strong> Basic cross-platform C/C++ development, build systems, Lua scripting.</p>\n"
  },
  {
    "title": "Xmake v3.0.6 Released, Android Native Apps, Flang, AppImage/dmg Support",
    "url": "/posts/xmake-update-v3.0.6",
    "date": {
      "time": 1765972800000,
      "string": "December 17, 2025"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "android",
      "flang",
      "cuda",
      "qt",
      "packaging",
      "msvc",
      "binutils"
    ],
    "excerpt": "<p>The new version further improves the build support for Android native applications. We can now configure more parameters in the <code>android.native_app</code> rule, including <code>android_sdk_version</code>, <code>android_manifest</code>, <code>android_res</code>, <code>keystore</code>, etc.</p>\n<p>In addition, for scenarios that require custom entry and event loops (such as game engine integration), we support disabling the default <code>android_native_app_glue</code> library by setting <code>native_app_glue = false</code>.</p>\n<pre><code class=\"language-lua\">add_rules(&quot;mode.debug&quot;, &quot;mode.release&quot;)</code></pre>\n"
  },
  {
    "title": "Xmake v3.0.5 released, Multi-row progress, XML module and Swift interop",
    "url": "/posts/xmake-update-v3.0.5",
    "date": {
      "time": 1763380800000,
      "string": "November 17, 2025"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "swift",
      "xml",
      "async",
      "progress",
      "toolchain",
      "cuda"
    ],
    "excerpt": "<p>In the new version, we have introduced several major features that significantly enhance the development experience. The highlights include <strong>multi-row progress output</strong> with theme support for better build visibility, a comprehensive <strong>XML module</strong> for parsing and encoding XML data, **asynchronous O...</p>\n<p><strong>Download:</strong> <a href=\"https://github.com/xmake-io/xmake/releases/tag/v3.0.5\">GitHub Releases</a> | <a href=\"https://github.com/xmake-io/xmake\">Source Repository</a></p>\n<p>We have improved the progress output to support multi-row refresh, providing a significantly better visual experience during long-running builds. Instead of updating a single progress line, the build output now displays multiple concurrent build tasks with their individual progress, making it easier...</p>\n"
  },
  {
    "title": "Xmake v2.9.1 released, Add native lua modules support",
    "url": "/posts/xmake-update-v2.9.1",
    "date": {
      "time": 1713787200000,
      "string": "April 22, 2024"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "package",
      "cosmocc"
    ],
    "excerpt": "<p>In the new version, we have added native tool chain support for Hongmeng system and implemented a new native Lua module import support. In addition, we have also made a lot of optimizations to the build speed, and the effect is very obvious.</p>\n<p>We have added native toolchain compilation support for the Hongmeng OS platform:</p>\n<pre><code class=\"language-bash\">$ xmake f -p harmony\n</code></pre>\n"
  },
  {
    "title": "Xmake v2.8.7 released, Add cosmocc toolchain support, build-once run-anywhere",
    "url": "/posts/xmake-update-v2.8.7",
    "date": {
      "time": 1708862400000,
      "string": "February 25, 2024"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "package",
      "cosmocc"
    ],
    "excerpt": "<p>In the new version, we have added cosmocc tool chain support. Using it, we can compile once and run everywhere. In addition, we also refactored the implementation of C++ Modules and solved many C++ Modules-related problems.</p>\n<p>The cosmocc tool chain is the compilation tool chain provided by the <a href=\"https://github.com/jart/cosmopolitan\">cosmopolitan</a> project. Programs compiled using this tool chain can be compiled once and run anywhere.</p>\n<p>In the new version, we also support this tool chain, which can compile programs under macosx/linux/windows, and can also support automatic downloading of the cosmocc tool chain.</p>\n"
  },
  {
    "title": "New Feature, Enhanced Package Management",
    "url": "/posts/new-feature-announcement",
    "date": {
      "time": 1705752000000,
      "string": "January 20, 2024"
    },
    "author": "Ruki",
    "tags": [
      "feature",
      "package-management",
      "xmake"
    ],
    "excerpt": "<p>We're excited to announce a major enhancement to Xmake's package management system that will make dependency handling even more powerful and user-friendly.</p>\n<p>The new package management system features:</p>\n<ul>\n<li><strong>Smart dependency resolution</strong>: Automatically resolves complex dependency chains</li>\n<li><strong>Version conflict detection</strong>: Identifies and helps resolve version conflicts</li>\n<li><strong>Parallel downloads</strong>: Faster package installation with parallel downloading</li>\n<li><strong>Better caching</strong>: Improved caching system for faste...</li>\n</ul>\n"
  },
  {
    "title": "Xmake v2.8.6 released, New Packaging Plugin, XPack",
    "url": "/posts/xmake-update-v2.8.6",
    "date": {
      "time": 1702641600000,
      "string": "December 15, 2023"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "package",
      "performance",
      "API",
      "rust"
    ],
    "excerpt": "<p>Before introducing new features, there is good news to tell you that the previous version of Xmake was included in the debian repository, and recently Xmake has entered the Fedora official repository. You can install Xmake directly on Fedora 39 through the following command.</p>\n<pre><code class=\"language-bash\">$ sudo dnf install xmake\n</code></pre>\n<p>Many thanks to @topazus @mochaaP for their contribution to Xmake. For related information, see: <a href=\"https://github.com/xmake-io/xmake/issues/941\">#941</a>.</p>\n"
  },
  {
    "title": "Xmake v2.8.5 released, Support for link sorting and unit testing",
    "url": "/posts/xmake-update-v2.8.5",
    "date": {
      "time": 1699185600000,
      "string": "November 5, 2023"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "package",
      "performance",
      "API",
      "rust"
    ],
    "excerpt": "<p>Before introducing new features, we have good news to tell you that Xmake has recently entered Debian's official repository: [https://packages.debian.org/sid/xmake](https://packages.debian.org/ sid/xmake),\nWhen Ubuntu 24.04 is released in April next year, we should be able to quickly install Xmake d...</p>\n<p>I would also like to thank @Lance Lin for his help. He helped us maintain and upload the Xmake package to the Debian repository throughout the whole process. Thank you very much!</p>\n<p>Next, let’s introduce some changes introduced in version 2.8.5. This version brings many new features, especially support for link sorting, link groups, and support for <code>xmake test</code> built-in unit tests.\nIn addition, we have also added build support for the Apple XROS platform, which can be used to b...</p>\n"
  },
  {
    "title": "Xmake v2.8.3 Released, Improve Wasm and Support Xmake Source Debugging",
    "url": "/posts/xmake-update-v2.8.3",
    "date": {
      "time": 1695729600000,
      "string": "September 26, 2023"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "package",
      "performance",
      "API",
      "rust"
    ],
    "excerpt": "<p>In the new version, we have added breakpoint debugging support for Xmake's own source code, which can help contributors to get familiar with xmake's source code more quickly, and also help users to debug and analyse their own project's configure scripts.</p>\n<p>In addition, the number of packages in our <a href=\"https://github.com/xmake-io/xmake-repo\">xmake-repo</a> repository is about to exceed 1100, with more than 100 packages added in just one month, thanks to @star-hengxing's contribution.</p>\n<p>At the same time, we focused on improving build support for Wasm and Qt6 for wasm.</p>\n"
  },
  {
    "title": "Xmake v2.8.2 Released, Official package repository count over 1k",
    "url": "/posts/xmake-update-v2.8.2",
    "date": {
      "time": 1692705600000,
      "string": "August 22, 2023"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "package",
      "performance",
      "API",
      "rust"
    ],
    "excerpt": "<p>In this release, we've added a number of useful APIs, removed some interfaces that were marked as deprecated a few years ago, and improved soname support for dynamic libraries.</p>\n<p>Meanwhile, we've had some good news in the meantime: our <a href=\"https://github.com/xmake-io/xmake-repo\">xmake-repo</a> official repository has surpassed 1k packages, thanks to every contributor to Xmake, which is basically a repository of packages contributed by the community.</p>\n<p>Especially @xq114, @star-hengxing, @SirLynix contributed a lot of packages, thank you very much~.</p>\n"
  },
  {
    "title": "Xmake v2.8.1 Released, Lots of Detailed Feature Improvements",
    "url": "/posts/xmake-update-v2.8.1",
    "date": {
      "time": 1689076800000,
      "string": "July 11, 2023"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "package",
      "performance",
      "mingw64",
      "wasm"
    ],
    "excerpt": "<p>Windows' long path limitation has always been a big problem. Projects that are nested too deeply may fail when reading or writing files, which affects xmake's usability and experience.</p>\n<p>Although xmake has provided various measures to avoid this problem, it still suffers from some limitations occasionally. In this release, we have improved the installer by providing an installation option that lets you selectively enable long path support.</p>\n<p>This requires administrator privileges, as it requires a registry write.</p>\n"
  },
  {
    "title": "Xmake v2.7.8 released, Improve package virtual environment and build speed",
    "url": "/posts/xmake-update-v2.7.8",
    "date": {
      "time": 1680609600000,
      "string": "April 4, 2023"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "package",
      "performance",
      "mingw64",
      "wasm"
    ],
    "excerpt": "<p>Xmake has long supported the virtual environment management of packages, and can switch between different package environments through configuration files.</p>\n<p>We can customize some package configurations by adding the xmake.lua file in the current directory, and then enter a specific package virtual environment.</p>\n<pre><code class=\"language-lua\">add_requires(&quot;zlib 1.2.11&quot;)\nadd_requires(&quot;python 3.x&quot;, &quot;luajit&quot;)\n</code></pre>\n"
  },
  {
    "title": "Xmake v2.7.7 released, Support Haiku, Improve API check and C++ Modules",
    "url": "/posts/xmake-update-v2.7.7",
    "date": {
      "time": 1677153600000,
      "string": "February 23, 2023"
    },
    "author": "Ruki",
    "excerpt": "<p>We have improved the presentation of target information in the <code>xmake show -t target</code> command by adding a new configuration source analysis and streamlining some of the relatively redundant information.</p>\n<p>We can use it to better troubleshoot where some of the flags we configure actually come from.</p>\n<p>The display looks like this.</p>\n"
  },
  {
    "title": "Xmake v2.7.6 Released, Add Verilog and C++ Module Distribution Support",
    "url": "/posts/xmake-update-v2.7.6",
    "date": {
      "time": 1674388800000,
      "string": "January 22, 2023"
    },
    "author": "Ruki",
    "excerpt": "<p>Through <code>add_requires(&quot;iverilog&quot;)</code> configuration, we can automatically pull the iverilog toolchain package, and then use <code>set_toolchains(&quot;@iverilog&quot;)</code> to automatically bind the toolchain to compile the project.</p>\n<pre><code class=\"language-lua\">add_requires(&quot;iverilog&quot;)\ntarget(&quot;hello&quot;)\n     add_rules(&quot;iverilog. binary&quot;)\n     set_toolchains(&quot;@iverilog&quot;)\n     add_files(&quot;src/*.v&quot;)\n</code></pre>\n<pre><code class=\"language-Lua\">add_requires(&quot;iverilog&quot;)\ntarget(&quot;hello&quot;)\n     add_rules(&quot;iverilog. binary&quot;)\n     set_toolchains(&quot;@iverilog&quot;)\n     add_files(&quot;src/*.v&quot;)\n     add_defines(&quot;TEST&quot;)\n     add_includedirs(&quot;inc&quot;)\n     set_languages(&quot;v1800-2009&quot;)\n</code></pre>\n"
  },
  {
    "title": "Xmake v2.7.3 Released, Package Components and C++ Modules Incremental Build Support",
    "url": "/posts/xmake-update-v2.7.3",
    "date": {
      "time": 1667908800000,
      "string": "November 8, 2022"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "package",
      "components"
    ],
    "excerpt": "<p>This new feature is intended to enable the integration of specific sub-libraries from a C/C++ package, and is generally used for library component integration in larger packages.</p>\n<p>This is because such packages provide a number of sub-libraries, not all of which are required by the user, and linking them all may be problematic.</p>\n<p>Although, previous versions were able to support the feature of sublibrary selection, e.g.</p>\n"
  },
  {
    "title": "Xmake v2.7.2 released, build third-party libraries more intelligently",
    "url": "/posts/xmake-update-v2.7.2",
    "date": {
      "time": 1665316800000,
      "string": "October 9, 2022"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "trybuild",
      "rule",
      "cmake",
      "autoconf"
    ],
    "excerpt": "<p>In previous versions, Xmake provided a TryBuild mode that allowed you to use Xmake to try to build third-party projects maintained by autoconf/cmake/meson etc. directly without xmake.lua.</p>\n<p>In effect, this means that Xmake detects the corresponding build system and invokes commands such as cmake to do so, but it will help the user to simplify the configuration operation, plus it will interface with xmake's cross-compilation toolchain configuration.</p>\n<p>However, this mode has a certain failure rate, which can lead to build failure if, for example</p>\n"
  },
  {
    "title": "Xmake v2.7.1 Released, Better C++ Modules Support",
    "url": "/posts/xmake-update-v2.7.1",
    "date": {
      "time": 1661428800000,
      "string": "August 25, 2022"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "remote",
      "ccache",
      "C++20",
      "Modules",
      "headerunits",
      "fs-watcher"
    ],
    "excerpt": "<p>In this release, we have refactored and improved the C++20 Modules implementation, improved the dependency graph parsing of module files, added support for STL and User HeaderUnits, and made the CMakelists/compile_commands generator support C++ Modules.</p>\n<p>In addition, we've added an <code>xmake watch</code> plugin that can monitor current project file updates in real time, automatically trigger incremental builds, or run some custom commands.</p>\n<p>&lt;img src=&quot;/assets/img/posts/xmake/xmake-watch.gif&quot;&gt;</p>\n"
  },
  {
    "title": "Xmake v2.6.6 Released, Support Distributed Compilation and Build Cache",
    "url": "/posts/xmake-update-v2.6.6",
    "date": {
      "time": 1653393600000,
      "string": "May 24, 2022"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "remote",
      "ccache",
      "distributed-compilation"
    ],
    "excerpt": "<p>In this version, we have added a lot of heavyweight new features:</p>\n<ul>\n<li>Distributed compilation</li>\n<li>Local compilation cache</li>\n<li>Remote compilation cache</li>\n</ul>\n<p>With these features, we can compile large C/C++ projects faster.</p>\n"
  },
  {
    "title": "Xmake v2.6.5 released, Support remote compilation",
    "url": "/posts/xmake-update-v2.6.5",
    "date": {
      "time": 1650801600000,
      "string": "April 24, 2022"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "cargo",
      "rust",
      "remote-compilation"
    ],
    "excerpt": "<p>The new version provides remote compilation support, which allows us to compile code on a remote server, run and debug remotely.</p>\n<p>The server can be deployed on Linux/MacOS/Windows to enable cross-platform compilation, e.g. compile and run Windows programs on Linux and macOS/Linux programs on Windows.</p>\n<p>It is more stable and smoother to use than ssh remote login compilation, no lagging of ssh terminal input due to network instability, and allows for quick local editing of code files.</p>\n"
  },
  {
    "title": "Xmake v2.6.4 released, Improve a lot of package management features",
    "url": "/posts/xmake-update-v2.6.4",
    "date": {
      "time": 1646654400000,
      "string": "March 7, 2022"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "Vcpkg"
    ],
    "excerpt": "<p>Now, we can inherit all the configuration of an existing package through the <code>set_base</code> interface, and then rewrite part of the configuration on this basis.</p>\n<p>This is usually in the user's own project, it is more useful to modify the built-in package of the official repository of <a href=\"https://github.com/xmake-io/xmake-repo\">xmake-repo</a>, such as: repairing and changing urls, modifying the version list, Install logic and more.</p>\n<p>For example, modify the url of the built-in zlib package to switch to your own zlib source address.</p>\n"
  },
  {
    "title": "Xmake v2.6.3 released, Support Vcpkg manifest mode",
    "url": "/posts/xmake-update-v2.6.3",
    "date": {
      "time": 1642852800000,
      "string": "January 22, 2022"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "Vcpkg"
    ],
    "excerpt": "<p>This version mainly adds the following features:</p>\n<ol>\n<li>Implement version selection of vcpkg package through vcpkg's manifest mode</li>\n<li>Python module build support</li>\n<li>Support integration of Xrepo/Xmake package management in CMakeLists.txt</li>\n</ol>\n<p>The rest are mainly some scattered functional improvements and Bugs fixes. You can see the details of the update at the end of the following. Some major changes will be explained one by one below.</p>\n"
  },
  {
    "title": "Xmake v2.6.2 released, Support building Linux kernel driver module",
    "url": "/posts/xmake-update-v2.6.2",
    "date": {
      "time": 1639742400000,
      "string": "December 17, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "Linux",
      "Driver"
    ],
    "excerpt": "<p>Xmake may be the first third-party build tool that provides built-in support for Linux kernel driver development.</p>\n<p>Although there are also instructions on how CMake configures and builds Linux drivers on the Internet, most of them use <code>add_custom_command</code> to customize various commands, and then execute <code>echo</code> to splice and generate Linux Makefile files by themselves.</p>\n<p>In other words, it is actually a build that relies on the Makefile of the Linux kernel source code to execute, so if you want to add some compilation configuration and macro definitions yourself, it will be very troublesome.</p>\n"
  },
  {
    "title": "xmake v2.6.1 released, Switch to Lua5.4 runtime, Support Rust and C++ mixed compilation",
    "url": "/posts/xmake-update-v2.6.1",
    "date": {
      "time": 1638532800000,
      "string": "December 3, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "Rust",
      "Lua5.4",
      "C++20",
      "Modules"
    ],
    "excerpt": "<p>After several versions of iterative testing, we officially switched to the Lua5.4 runtime in version 2.6.1.</p>\n<p>However, this is completely unaware to users, and basically there is no compatibility problem, because xmake encapsulates most of the interfaces, which completely eliminates the compatibility problem between Lua versions.</p>\n<p>In terms of build performance, because the performance bottleneck of the build mainly comes from the compiler, the performance loss of Lua itself is completely negligible, and xmake rewrites all lua native io interfaces with c, and optimizes the time-consuming interfaces with c .</p>\n"
  },
  {
    "title": "xmake v2.5.9 released, Improve C++20 Modules and support Nim, Keil MDK and Unity Build",
    "url": "/posts/xmake-update-v2.5.9",
    "date": {
      "time": 1635595200000,
      "string": "October 30, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "Nim",
      "Keil",
      "MDK",
      "circle",
      "Unity",
      "Build",
      "C++20",
      "Modules",
      "lua5.4"
    ],
    "excerpt": "<p>Recently, we have added build support for the Nimlang project. For related issues, see: <a href=\"https://github.com/xmake-io/xmake/issues/1756\">#1756</a></p>\n<p>We can use the <code>xmake create</code> command to create an empty project.</p>\n<pre><code class=\"language-console\">xmake create -l nim -t console test\nxmake create -l nim -t static test\nxmake create -l nim -t shared test\n</code></pre>\n"
  },
  {
    "title": "xmake v2.5.8 is released, Support Pascal/Swig program and Lua53 runtime",
    "url": "/posts/xmake-update-v2.5.8",
    "date": {
      "time": 1633694400000,
      "string": "October 8, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "pascal",
      "swig",
      "lua5.3"
    ],
    "excerpt": "<p>Currently, we can use the cross-platform Free Pascal toolchain fpc to compile and build Pascal programs, for example:</p>\n<pre><code class=\"language-lua\">add_rules(&quot;mode.debug&quot;, &quot;mode.release&quot;)\ntarget(&quot;test&quot;)\n    set_kind(&quot;binary&quot;)\n    add_files(&quot;src/*.pas&quot;)\n</code></pre>\n<pre><code class=\"language-lua\">add_rules(&quot;mode.debug&quot;, &quot;mode.release&quot;)\ntarget(&quot;foo&quot;)\n    set_kind(&quot;shared&quot;)\n    add_files(&quot;src/foo.pas&quot;)</code></pre>\n"
  },
  {
    "title": "xmake v2.5.7 released, Use lockfile to freeze package dependencies and Vala/Metal language support",
    "url": "/posts/xmake-update-v2.5.7",
    "date": {
      "time": 1630238400000,
      "string": "August 29, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "lock",
      "package",
      "vala"
    ],
    "excerpt": "<p>In this version, we can already initially support the construction of Vala programs, just apply the <code>add_rules(&quot;vala&quot;)</code> rule.</p>\n<p>At the same time, we need to add some dependency packages, among which the glib package is necessary because Vala itself will also use it.</p>\n<p><code>add_values(&quot;vala.packages&quot;)</code> is used to tell valac which packages the project needs, it will introduce the vala api of the relevant package, but the dependency integration of the package still needs to be downloaded and integrated through <code>add_requires(&quot;lua&quot;)</code>.</p>\n"
  },
  {
    "title": "xmake v2.5.6 released, Improve compatibility of pre-compiled binary package",
    "url": "/posts/xmake-update-v2.5.6",
    "date": {
      "time": 1627300800000,
      "string": "July 26, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "mirror",
      "package"
    ],
    "excerpt": "<p>The previous version provided preliminary support for the installation of pre-compiled packages under Windows, but because the compatibility of the toolset version was not considered, if the user's VS version is too low, link problems will occur when the package is integrated.</p>\n<p>According to the official description of ms, the binary library of msvc is backward compatible with the version of toolset. <a href=\"https://xmake.io\">https://docs.microsoft.com/en-us/cpp/porting/binary-compat-2015-2017?view=msvc-160</a></p>\n<blockquote>\n<p>You can mix binaries built by different versions of the v140, v141, and v142 toolsets. However, you must link by using a toolset at least as recent as the most recent binary in your app. Here's an example: you can link an app compiled using any 2017 toolset (v141, versions 15.0 through 15.9) to a...</p>\n</blockquote>\n"
  },
  {
    "title": "xmake v2.5.5 released, Support to download and install precompiled image packages",
    "url": "/posts/xmake-update-v2.5.5",
    "date": {
      "time": 1625054400000,
      "string": "June 30, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "mirror",
      "package"
    ],
    "excerpt": "<p>Each time you install a package by the built-in package manager of xmake, you must download the corresponding package source code, and then perform local compilation and installation integration. This is for some large packages that compile very slowly, and some packages that rely on a lot of compil...</p>\n<p>Especially on windows, not only the dependence of the third party package on the compilation environment is more complicated, but also many packages and compilation are very slow, such as boost, openssl and so on.</p>\n<p>To this end, we implement cloud pre-compilation of packages based on github action, and pre-compile all commonly used packages, and then store them in [build-artifacts](https://github.com/xmake-mirror/build- artifacts) under Releases of the repository.</p>\n"
  },
  {
    "title": "xmake v2.5.4 Released, Support apt/portage package manager and improve xrepo shell",
    "url": "/posts/xmake-update-v2.5.4",
    "date": {
      "time": 1621080000000,
      "string": "May 15, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "apt",
      "portage",
      "shell",
      "package"
    ],
    "excerpt": "<p>Now we support the use of apt to integrate dependent packages, and will also automatically find packages that have been installed on the ubuntu system.</p>\n<pre><code class=\"language-lua\">add_requires(&quot;apt::zlib1g-dev&quot;, {alias = &quot;zlib&quot;})\n\ntarget(&quot;test&quot;)\n    set_kind(&quot;binary&quot;)\n    add_files(&quot;src/*.c&quot;)\n    add_packages(&quot;zlib&quot;)\n</code></pre>\n"
  },
  {
    "title": "xmake v2.5.3 Released, Support to build Linux bpf program and integrate Conda packages",
    "url": "/posts/xmake-update-v2.5.3",
    "date": {
      "time": 1617883200000,
      "string": "April 8, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "toolchains",
      "bpf",
      "conda",
      "linux"
    ],
    "excerpt": "<p>In the new version, we started to support the compilation of bpf programs, as well as linux and android platforms, and can automatically pull the llvm and android ndk toolchains.</p>\n<p>For more details, please see: <a href=\"https://github.com/xmake-io/xmake/issues/1274\">#1274</a></p>\n<p>The build configuration is as follows, it's very simple.</p>\n"
  },
  {
    "title": "xmake v2.5.2 released, Support pull remote cross-toolchain and package integration",
    "url": "/posts/xmake-update-v2.5.2",
    "date": {
      "time": 1614427200000,
      "string": "February 27, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "toolchains",
      "xrepo",
      "packages",
      "cross-toolchains"
    ],
    "excerpt": "<p>Starting from version 2.5.2, we can pull the specified toolchain to integrate the compilation project, and we also support switching the dependent package to the corresponding remote toolchain to participate in the compilation and integration.</p>\n<p>For related example codes, see: <a href=\"https://github.com/xmake-io/xmake/tree/master/tests/projects/package\">Toolchain/Packages Examples</a></p>\n<p>Related issue <a href=\"https://github.com/xmake-io/xmake/issues/1217\">#1217</a></p>\n"
  },
  {
    "title": "xmake v2.5.1 released, Support for Apple Silicon and more powerful C/C++ package management",
    "url": "/posts/xmake-update-v2.5.1",
    "date": {
      "time": 1610798400000,
      "string": "January 16, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "toolchains",
      "xrepo",
      "packages",
      "vcpkg",
      "conan",
      "Apple",
      "Silicon"
    ],
    "excerpt": "<p>Despite the previous version, we can define and configure dependent packages by <code>add_requires(&quot;libpng&quot;, {configs = {shared = true}})</code>.</p>\n<p>However, if the user project has a huge project and many dependent packages, and each package requires different compilation configuration parameters, the configuration will still be very cumbersome and has limitations, such as the inability to rewrite the internal sub-dependent package configuratio...</p>\n<p>Therefore, we have added <code>add_requireconfs</code> to configure the configuration of each package and its sub-dependencies more flexibly and conveniently. Below we focus on several usages:</p>\n"
  },
  {
    "title": "Xmake Getting Started Tutorial 12, More Flexible Configuration Through Custom Scripts",
    "url": "/posts/quickstart-12-custom-scripts",
    "date": {
      "time": 1595073600000,
      "string": "July 18, 2020"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "subproject",
      "submodule",
      "custom script"
    ],
    "excerpt": "<p>xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance,\nand a consistent build experience across platforms.</p>\n<p>This article mainly explains in detail how to achieve more complex and flexible customization in the script domain by adding custom scripts.</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">Project Source</a></li>\n<li><a href=\"https://xmake.io\">Official Document</a></li>\n</ul>\n"
  },
  {
    "title": "Xmake Getting Started Tutorial 11, How to Organize and Build Large Projects",
    "url": "/posts/quickstart-11-subprojects",
    "date": {
      "time": 1586606400000,
      "string": "April 11, 2020"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "subproject",
      "submodule"
    ],
    "excerpt": "<p>xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance,\nand a consistent build experience across platforms.</p>\n<p>This article mainly explains in detail how to organize and build a large-scale project by configuring sub-project modules.</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">Project Source</a></li>\n<li><a href=\"https://xmake.io\">Official Document</a></li>\n</ul>\n"
  },
  {
    "title": "Xmake Getting Started Tutorial 10, Multiple Sub-project Target Dependency Configuration",
    "url": "/posts/quickstart-10-target-deps",
    "date": {
      "time": 1576238400000,
      "string": "December 13, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "cross compilation"
    ],
    "excerpt": "<p>xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance,\nand a consistent build experience across platforms.</p>\n<p>This article mainly explains in detail how to maintain and generate multiple target files in a project, and how to set dependencies between them.</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">Project Source</a></li>\n<li><a href=\"https://xmake.io\">Official Document</a></li>\n</ul>\n"
  },
  {
    "title": "Xmake Getting Started Tutorial 8, Switching Build Modes",
    "url": "/posts/quickstart-8-switch-build-mode",
    "date": {
      "time": 1575547200000,
      "string": "December 5, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "build mode"
    ],
    "excerpt": "<p>xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance,\nand a consistent build experience across platforms.</p>\n<p>In this article, we will explain in detail how to switch common build modes such as debug/release during the project build process, and how to customize other build modes.</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">Project Source</a></li>\n<li><a href=\"https://xmake.io\">Official Document</a></li>\n</ul>\n"
  },
  {
    "title": "Xmake Getting Started Tutorial 9, Cross Compilation Explained",
    "url": "/posts/quickstart-9-cross-compile",
    "date": {
      "time": 1575547200000,
      "string": "December 5, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "cross compilation"
    ],
    "excerpt": "<p>xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance,\nand a consistent build experience across platforms.</p>\n<p>In addition to built-in build support for win, linux, macOS platforms, and android, ios and other mobile platforms, xmake also supports cross-compilation support for various other toolchains. In this article, we will explain in detail how to use xmake for cross-compilation.</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">Project Source</a></li>\n<li><a href=\"https://xmake.io\">Official Document</a></li>\n</ul>\n"
  },
  {
    "title": "Xmake Getting Started Tutorial 7, Developing and Building CUDA Programs",
    "url": "/posts/quickstart-7-build-cuda-project",
    "date": {
      "time": 1575115200000,
      "string": "November 30, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "cuda"
    ],
    "excerpt": "<p>xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance,\nand a consistent build experience across platforms.</p>\n<p>In this article, we will explain in detail how to build CUDA programs and mixed compilation with c/c++ programs through xmake.</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">Project Source</a></li>\n<li><a href=\"https://xmake.io\">Official Document</a></li>\n</ul>\n"
  },
  {
    "title": "Xmake Getting Started Tutorial 6, Developing and Building Qt Programs",
    "url": "/posts/quickstart-6-build-qt-project",
    "date": {
      "time": 1574337600000,
      "string": "November 21, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "qt"
    ],
    "excerpt": "<p>xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance,\nand a consistent build experience across platforms.</p>\n<p>xmake fully supports the maintenance and building of Qt5 projects. This article will guide you through how to maintain various types of Qt projects with xmake.</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">Project Source</a></li>\n<li><a href=\"https://xmake.io\">Official Document</a></li>\n</ul>\n"
  },
  {
    "title": "Xmake Getting Started Tutorial 5, Introduction to Android platform compilation",
    "url": "/posts/quickstart-5-build-android",
    "date": {
      "time": 1573819200000,
      "string": "November 15, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "android",
      "jni"
    ],
    "excerpt": "<p>xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance,\nand a consistent build experience across platforms.</p>\n<p>This article mainly explains in detail how to compile libraries and executable programs that can run under android through xmake.</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">Project Source</a></li>\n<li><a href=\"https://xmake.io\">Official Document</a></li>\n</ul>\n"
  },
  {
    "title": "Xmake Getting Started Tutorial 4, C/C++ project description settings",
    "url": "/posts/quickstart-4-basic-project-settings",
    "date": {
      "time": 1573387200000,
      "string": "November 10, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "c/c++",
      "run",
      "debug"
    ],
    "excerpt": "<p>Xmake is a lightweight and modern C/C++ project build tool based on Lua. Its main features are: easy to use syntax, easy to use project maintenance, and a consistent build experience across platforms.</p>\n<p>This article mainly explains in detail how to write some commonly used basic xmake.lua description configurations to achieve some simple C/C++ project build management.\nFor most small projects, these configurations are completely sufficient. In the later advanced tutorials in this series, I will exp...</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">Project Source</a></li>\n<li><a href=\"https://xmake.io/\">Official Documents</a></li>\n</ul>\n"
  },
  {
    "title": "Xmake Getting Started Tutorial 1, Installation and Updates",
    "url": "/posts/quickstart-1-installation",
    "date": {
      "time": 1573300800000,
      "string": "November 9, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "installation",
      "update"
    ],
    "excerpt": "<p>Xmake is a lightweight modern C/C++ project build tool based on Lua. Its main features are: easy to use syntax, more readable project maintenance, and a consistent build experience across platforms.</p>\n<p>This article mainly explains the installation process of xmake under various platforms.</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">Project Source</a></li>\n<li><a href=\"https://xmake.io\">Official Document</a></li>\n</ul>\n"
  },
  {
    "title": "Xmake Getting Started Tutorial 2, Create and build project",
    "url": "/posts/quickstart-2-create-and-build-project",
    "date": {
      "time": 1573300800000,
      "string": "November 9, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "c/c++"
    ],
    "excerpt": "<p>Xmake is a lightweight modern C/C++ project build tool based on Lua. Its main features are: easy to use syntax, more readable project maintenance, and a consistent build experience across platforms.</p>\n<p>This article focuses on how to create a xmake-based project and compilation operations.</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">Project Source</a></li>\n<li><a href=\"https://xmake.io/\">Official Document</a></li>\n</ul>\n"
  },
  {
    "title": "Xmake Getting Started Tutorial 3, Run and Debug Program",
    "url": "/posts/quickstart-3-run-and-debug",
    "date": {
      "time": 1573300800000,
      "string": "November 9, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "c/c++",
      "run",
      "debug"
    ],
    "excerpt": "<p>Xmake is a lightweight modern C/C++ project build tool based on Lua. Its main features are: easy to use syntax, more readable project maintenance, and a consistent build experience across platforms.</p>\n<p>This article mainly explains in detail how to load and run the compiled target program, and how to debug.</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">Project Source</a></li>\n<li><a href=\"https://xmake.io/\">Official Documents</a></li>\n</ul>\n"
  },
  {
    "title": "Using Custom Build Rules in xmake",
    "url": "/posts/custom-rule",
    "date": {
      "time": 1510574400000,
      "string": "November 13, 2017"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "custom rules"
    ],
    "excerpt": "<p>After version 2.1.9, xmake not only natively supports building multiple language files, but also allows users to implement complex unknown file builds through custom build rules.</p>\n<p>For specific usage instructions, please refer to the relevant documentation: <a href=\"https://xmake.io/\">Rule Usage Manual</a></p>\n<p>We can extend build support for other files by pre-setting the file extensions supported by rules:</p>\n"
  },
  {
    "title": "Precompiled Header File Handling by Different Compilers",
    "url": "/posts/precompiled-header",
    "date": {
      "time": 1501502400000,
      "string": "July 31, 2017"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "precompiled headers",
      "c++ compilation acceleration",
      "optimization compilation",
      "cross-platform"
    ],
    "excerpt": "<p>Recently, in order to implement precompiled header file support for <a href=\"https://xmake.io\">xmake</a>, I studied the mechanisms and differences of how major mainstream compilers handle precompiled headers.</p>\n<p>Most c/c++ compilers now support precompiled headers, such as: gcc, clang, msvc, etc., to optimize c++ code compilation speed. After all, if c++ header files contain template definitions, compilation speed is very slow. If most common header files can be placed in a <code>header.h</code> and precompiled before...</p>\n<p>However, different compilers have different levels of support and handling methods for it, and it's not very universal. It took a lot of effort to encapsulate it into a unified interface and usage method in xmake.</p>\n"
  },
  {
    "title": "xmake Description Syntax and Scope Explained",
    "url": "/posts/api-scope",
    "date": {
      "time": 1477483200000,
      "string": "October 26, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "api",
      "project description",
      "scope"
    ],
    "excerpt": "<p>Although xmake's project description file <code>xmake.lua</code> is based on lua syntax, xmake has wrapped it with an additional layer to make writing project build logic more convenient and concise, so that writing <code>xmake.lua</code> won't be as tedious as writing makefiles.</p>\n<p>Basically, writing a simple project build description only takes three lines, for example:</p>\n<pre><code class=\"language-lua\">target(&quot;test&quot;)\n    set_kind(&quot;binary&quot;)\n    add_files(&quot;src/*.c&quot;)\n</code></pre>\n"
  },
  {
    "title": "Using Built-in Variables and External Variables in xmake",
    "url": "/posts/variables-usage",
    "date": {
      "time": 1470657600000,
      "string": "August 8, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "built-in variables",
      "external variables"
    ],
    "excerpt": "<p>Embedded in strings, for example:</p>\n<pre><code class=\"language-lua\">    set_objectdir(&quot;$(buildir)/.objs&quot;)\n</code></pre>\n<p>Among them, <code>$(buildir)</code> is a built-in variable. These automatically change as the configuration changes with each <code>xmake config</code>.</p>\n"
  },
  {
    "title": "Advanced Feature: Custom Options",
    "url": "/posts/custom-option",
    "date": {
      "time": 1470571200000,
      "string": "August 7, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "custom options"
    ],
    "excerpt": "<p>xmake can also support some custom option switches, making projects support optional compilation and facilitating modular project management.</p>\n<p>Let's take a practical example:</p>\n<p>We want to add a new switch option called <code>hello</code> to our project. If this switch is enabled, it will add some specific source files to the target, but this switch is disabled by default and needs to be linked and used by configuring <code>xmake f --hello=true</code>.</p>\n"
  },
  {
    "title": "Adding Dependencies and Auto-detection Mechanism",
    "url": "/posts/add-package-and-autocheck",
    "date": {
      "time": 1470484800000,
      "string": "August 6, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "dependencies",
      "auto-detection"
    ],
    "excerpt": "<p>xmake encapsulates dependency libraries, dependency headers, dependency types, and dependency interfaces uniformly using the option mechanism, and further introduces a package mechanism at a higher level, making adding and detecting dependencies more modular and simpler.</p>\n<p>Let's look at how xmake's package mechanism works through a specific example.</p>\n<p>Suppose your project already has two packages: <code>zlib.pkg</code> and <code>polarssl.pkg</code> (how to build packages will be explained in detail later; for now, you can refer to the examples of existing packages in <a href=\"https://github.com/waruqi/tbox/tree/master/pkg\">TBOX dependencies</a>). Your project directory structure...</p>\n"
  },
  {
    "title": "Selective Compilation in xmake Project Description",
    "url": "/posts/condition-and-select-compile",
    "date": {
      "time": 1469275200000,
      "string": "July 23, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "compilation",
      "project description",
      "xmake.lua",
      "conditional judgment"
    ],
    "excerpt": "<p>xmake provides some built-in conditional judgment APIs for obtaining relevant information about project status during selective compilation to adjust compilation logic.</p>\n<p>For example: <code>is_os</code>, <code>is_plat</code>, <code>is_arch</code>, <code>is_kind</code>, <code>is_mode</code>, <code>is_option</code></p>\n<p>Let's first talk about how to use the most commonly used <code>is_mode</code>. This API is mainly used to judge the current compilation mode. For example, when configuring compilation normally, you will execute:</p>\n"
  },
  {
    "title": "How to complie project using the cross-toolchains",
    "url": "/posts/how-to-compile-on-cross-toolchains",
    "date": {
      "time": 1469188800000,
      "string": "July 22, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "cross-toolchains",
      "cross-compiling"
    ],
    "excerpt": "<p>xmake provides a convenient and flexible cross-compiling support, in most cases, we need not to configure complex toolchains prefix, for example: <code>arm-linux-</code></p>\n<p>As long as this toolchains meet the following directory structure:</p>\n<pre><code>/home/toolchains_sdkdir\n   - bin\n       - arm-linux-gcc\n       - arm-linux-ld\n       - ...\n   - lib\n       - libxxx.a\n   - include\n       - xxx.h\n</code></pre>\n"
  },
  {
    "title": "How to install xmake",
    "url": "/posts/how-to-install-xmake",
    "date": {
      "time": 1468929600000,
      "string": "July 19, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "install",
      "linux",
      "windows",
      "macosx",
      "homebrew"
    ],
    "excerpt": "<ol>\n<li>Download xmake source codes</li>\n<li>Enter the source code directory</li>\n<li>Run <code>install.bat</code></li>\n<li>Select the installed directory and enter into this directory</li>\n<li>Please wait some mintues</li>\n</ol>\n<pre><code class=\"language-bash\">$ git clone git@github.com:waruqi/xmake.git\n$ cd ./xmake\n$ sudo ./install\n</code></pre>\n<pre><code class=\"language-bash\">$ ruby -e &quot;$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)&quot;\n$ sudo brew install xmake\n</code></pre>\n"
  },
  {
    "title": "How to build a simple project quickly",
    "url": "/posts/how-to-build-a-simple-project",
    "date": {
      "time": 1468670400000,
      "string": "July 16, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "build",
      "project",
      "hello"
    ],
    "excerpt": "<p>We create an empty console project first:</p>\n<pre><code class=\"language-bash\">$ xmake create -P ./hello\n\ncreate hello ...\ncreate ok!👌\n</code></pre>\n"
  },
  {
    "title": "Package target",
    "url": "/posts/package-target",
    "date": {
      "time": 1466942400000,
      "string": "June 26, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "package"
    ],
    "excerpt": "<p>Packages all targets for the current platform:</p>\n<pre><code class=\"language-bash\">    $xmake p\n    $xmake package\n</code></pre>\n<p>Packages the target test to the output directory: /tmp</p>\n"
  },
  {
    "title": "Plugin Development: Import Libraries",
    "url": "/posts/api-import",
    "date": {
      "time": 1465473600000,
      "string": "June 9, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "plugin",
      "import",
      "library",
      "custom script"
    ],
    "excerpt": "<p><code>import</code> is mainly used to import xmake's extension libraries and some custom library modules. It is generally used in custom scripts (<code>on_build</code>, <code>on_run</code> ..), plugin development, template development, platform extensions, custom tasks, etc.</p>\n<p>The import mechanism is as follows:</p>\n<ol>\n<li>First import from the current script directory</li>\n<li>Then import from extension libraries</li>\n</ol>\n"
  },
  {
    "title": "Advanced Feature: Custom Task",
    "url": "/posts/custom-task",
    "date": {
      "time": 1465473600000,
      "string": "June 9, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "task",
      "custom script",
      "plugin"
    ],
    "excerpt": "<p><code>task</code> is a new feature starting from xmake 2.0 and is also the core of plugin development. In <a href=\"https://xmake.io/\">Plugin Development: Hello xmake</a> we briefly introduced the definition and usage of tasks.</p>\n<p>Of course, tasks can not only be used to write plugins, but also to write some simple custom tasks.</p>\n<p>Let's first look at a simple task implementation:</p>\n"
  },
  {
    "title": "Introduction to xmake Project Description",
    "url": "/posts/project-description",
    "date": {
      "time": 1454500800000,
      "string": "February 3, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "premake"
    ],
    "excerpt": "<p>xmake's project description file abandons the tedious complexity of makefiles, learns from premake's simplicity and clarity, and natively supports lua scripts, making it more flexible and convenient to extend.</p>\n<p>The default project description file name is <code>xmake.lua</code>, which supports multi-level directory nesting. You can also specify other files as project description files through the following commands:</p>\n<pre><code class=\"language-bash\">    xmake -f /tmp/xxx.lua\n    xmake --file=xxx.lua\n</code></pre>\n"
  }
]