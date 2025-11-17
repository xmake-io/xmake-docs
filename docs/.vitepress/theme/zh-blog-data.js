export const posts = [
  {
    "title": "Xmake v3.0.5 预览，多行进度输出、XML 模块、异步 OS API 和 Swift 互操作",
    "url": "/zh/posts/xmake-update-v3.0.5",
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
    "excerpt": "<p>新版本中，我们引入了多个重要特性，显著提升了开发体验。重点包括<strong>多行进度输出</strong>（支持主题配置，提供更好的构建可见性）、全面的<strong>XML 模块</strong>（用于解析和编码 XML 数据）、<strong>异步 OS API</strong>（提升 I/O 性能）以及<strong>Swift 互操作支持</strong>（实现 Swift 与 C++/Objective-C 代码的无缝集成）。同时，我们也对工具链配置、TTY 处理进行了重大改进，并进行了各种性能优化。</p>\n<p>我们改进了进度输出，支持多行刷新，在长时间运行的构建过程中提供显著更好的视觉体验。构建输出现在不再只更新单行进度，而是显示多个并发构建任务及其各自的进度，使得监控并行编译变得更加容易。</p>\n<p>输出现在显示并行构建的多行进度，每个编译任务都有实时状态更新：</p>\n"
  },
  {
    "title": "Xmake v2.9.1 发布，新增 native lua 模块和鸿蒙系统支持",
    "url": "/zh/posts/xmake-update-v2.9.1",
    "date": {
      "time": 1713787200000,
      "string": "April 22, 2024"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++"
    ],
    "excerpt": "<p>新版本中，我们新增了鸿蒙系统的 native 工具链支持，并且实现了一种新的 native 原生 lua 模块的导入支持。另外，我们也对构建速度做了很多的优化，效果非常明显。</p>\n<p>我们新增了鸿蒙 OS 平台的 native 工具链编译支持：</p>\n<pre><code class=\"language-bash\">$ xmake f -p harmony\n</code></pre>\n"
  },
  {
    "title": "Xmake v2.8.7 发布，新增 cosmocc 工具链支持，一次编译到处运行",
    "url": "/zh/posts/xmake-update-v2.8.7",
    "date": {
      "time": 1708862400000,
      "string": "February 25, 2024"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++"
    ],
    "excerpt": "<p>新版本中，我们新增了 cosmocc 工具链支持，使用它，我们可以实现一次编译，到处运行。另外，我们还重构了 C++ Modules 的实现，解决了很多 C++ Modules 相关的问题。</p>\n<p>cosmocc 工具链是 <a href=\"https://github.com/jart/cosmopolitan\">cosmopolitan</a> 项目提供的编译工具链，使用这个工具链编译的程序可以实现一次编译，到处运行。</p>\n<p>而新版本中，我们对这个工具链也做了支持，可以实现在 macosx/linux/windows 下编译程序，并且还能够支持自动下载 cosmocc 工具链。</p>\n"
  },
  {
    "title": "Xmake v2.8.6 发布，新的打包插件：XPack",
    "url": "/zh/posts/xmake-update-v2.8.6",
    "date": {
      "time": 1702641600000,
      "string": "December 15, 2023"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++"
    ],
    "excerpt": "<p>在介绍新特性之前，还有个好消息告诉大家，上个版本 Xmake 被收入到了 debian 仓库，而最近 Xmake 又进入了 Fedora 官方仓库，大家可以在 Fedora 39 上，直接通过下面的命令安装 Xmake。</p>\n<pre><code class=\"language-bash\">$ sudo dnf install xmake\n</code></pre>\n<p>非常感谢 @topazus @mochaaP 对 Xmake 的贡献，相关信息见：<a href=\"https://github.com/xmake-io/xmake/issues/941\">#941</a>。</p>\n"
  },
  {
    "title": "Xmake v2.8.5 发布，支持链接排序和单元测试",
    "url": "/zh/posts/xmake-update-v2.8.5",
    "date": {
      "time": 1699185600000,
      "string": "November 5, 2023"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++"
    ],
    "excerpt": "<p>在介绍新特性之前，我们有一个好消息要告诉大家，Xmake 最近进入了 Debian 的官方仓库：<a href=\"https://packages.debian.org/sid/xmake\">https://packages.debian.org/sid/xmake</a>，\n等到明年4月份 Ubuntu 24.04 发布，我们应该就能直接通过 <code>apt install xmake</code> 命令去快速安装 Xmake 了。</p>\n<p>同时也感谢 @Lance Lin 的帮助，他全程帮助我们维护并上传 Xmake 包到 Debian 仓库，真的非常感谢！</p>\n<p>接下来，我们来介绍下 2.8.5 版本引入的一些改动，这个版本带来了很多的新特性，尤其是对链接排序，链接组的支持，还有对 <code>xmake test</code> 内置单元测试的支持。\n另外，我们还新增了 Apple XROS 平台的构建支持，可以用于构建苹果新的 VisionOS 上的程序，还有我们还提供了更加灵活通用的 <code>check_sizeof</code> 检测接口，用于快速检测类型的大小。</p>\n"
  },
  {
    "title": "Xmake v2.8.3 发布，改进 Wasm 并支持 Xmake 源码调试",
    "url": "/zh/posts/xmake-update-v2.8.3",
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
      "API",
      "rust"
    ],
    "excerpt": "<p>新版本中，我们新增了 Xmake 自身源码的断点调试支持，这可以帮助贡献者更加快速的熟悉 xmake 源码，也可以帮助用户去快速调试分析自身项目的配置脚本。</p>\n<p>另外，我们 <a href=\"https://github.com/xmake-io/xmake-repo\">xmake-repo</a> 官方仓库包的数量也即将突破 1100，短短一个月的时间，就新增了 100 多个包，非常感谢 @star-hengxing 的贡献。</p>\n<p>同时，我们重点改进了 Wasm 的构建支持，以及 Qt6 for wasm 的支持。</p>\n"
  },
  {
    "title": "Xmake v2.8.2 发布，官方包仓库数量突破 1k",
    "url": "/zh/posts/xmake-update-v2.8.2",
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
      "API",
      "rust"
    ],
    "excerpt": "<p>这个版本，我们新增了不少实用的 API，并且移除了一些几年前就被标记为废弃的接口，另外改进了动态库对 soname 的支持。</p>\n<p>同时，在这期间，我们迎来了一些喜人的数据，我们的 <a href=\"https://github.com/xmake-io/xmake-repo\">xmake-repo</a> 官方仓库包的数量也突破了 1k，非常感谢 Xmake 的每位贡献者，我们的包仓库基本上都是社区贡献者贡献进来的。</p>\n<p>尤其是 @xq114, @star-hengxing, @SirLynix 帮忙贡献了大量的包，非常感谢~</p>\n"
  },
  {
    "title": "Xmake v2.8.1 发布，大量细节特性改进",
    "url": "/zh/posts/xmake-update-v2.8.1",
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
    "excerpt": "<p>windows 的长路径限制一直是一个大问题，嵌套层级太深的工程，在读写文件的时候，都有可能失败，这会影响 xmake 的可用性和体验。</p>\n<p>尽管，xmake 已经提供各种措施也避免这个问题，但是偶尔还是会受到一些限制。而在这个版本中，我们改进了安装器，提供一个安装选项，让用户选择性开启长路径支持。</p>\n<p>这需要管理员权限，因为它需要写注册表。</p>\n"
  },
  {
    "title": "Xmake v2.7.8 发布，改进包虚拟环境和构建速度",
    "url": "/zh/posts/xmake-update-v2.7.8",
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
    "excerpt": "<p>Xmake 很早就支持了包的虚拟环境管理，可以通过配置文件的方式，实现不同包环境之间的切换。</p>\n<p>我们可以通过在当前目录下，添加 xmake.lua 文件，定制化一些包配置，然后进入特定的包虚拟环境。</p>\n<pre><code class=\"language-lua\">add_requires(&quot;zlib 1.2.11&quot;)\nadd_requires(&quot;python 3.x&quot;, &quot;luajit&quot;)\n</code></pre>\n"
  },
  {
    "title": "Xmake v2.7.7 发布，支持 Haiku 平台，改进 API 检测和 C++ Modules 支持",
    "url": "/zh/posts/xmake-update-v2.7.7",
    "date": {
      "time": 1677153600000,
      "string": "February 23, 2023"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "package",
      "modules",
      "haiku",
      "c++modules"
    ],
    "excerpt": "<p>Xmake 现在已经完全可以在 <a href=\"https://www.haiku-os.org/\">Haiku 系统</a> 上运行，并且我们对 Xmake 新增了一个 haiku 编译平台，用于在 Haiku 系统上进行代码编译。</p>\n<p>效果如下:</p>\n<p>&lt;img src=&quot;https://tboox.org/static/img/xmake/haiku.jpeg&quot; width=&quot;650px&quot; /&gt;</p>\n"
  },
  {
    "title": "Xmake v2.7.6 发布，新增 Verilog 和 C++ Modules 分发支持",
    "url": "/zh/posts/xmake-update-v2.7.6",
    "date": {
      "time": 1674388800000,
      "string": "January 22, 2023"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "package",
      "modules",
      "verilog"
    ],
    "excerpt": "<p>通过 <code>add_requires(&quot;iverilog&quot;)</code> 配置，我们能够自动拉取 iverilog 工具链包，然后使用 <code>set_toolchains(&quot;@iverilog&quot;)</code> 自动绑定工具链来编译工程。</p>\n<pre><code class=\"language-lua\">add_requires(&quot;iverilog&quot;)\ntarget(&quot;hello&quot;)\n    add_rules(&quot;iverilog.binary&quot;)\n    set_toolchains(&quot;@iverilog&quot;)\n    add_files(&quot;src/*.v&quot;)\n</code></pre>\n<pre><code class=\"language-lua\">add_requires(&quot;iverilog&quot;)\ntarget(&quot;hello&quot;)\n    add_rules(&quot;iverilog.binary&quot;)\n    set_toolchains(&quot;@iverilog&quot;)\n    add_files(&quot;src/*.v&quot;)\n    add_defines(&quot;TEST&quot;)\n    add_includedirs(&quot;inc&quot;)\n    set_languages(&quot;v1800-2009&quot;)\n</code></pre>\n"
  },
  {
    "title": "Xmake v2.7.3 发布，包组件和 C++ 模块增量构建支持",
    "url": "/zh/posts/xmake-update-v2.7.3",
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
    "excerpt": "<p>这个新特性主要用于实现从一个 C/C++ 包中集成特定的子库，一般用于一些比较大的包中的库组件集成。</p>\n<p>因为这种包里面提供了很多的子库，但不是每个子库用户都需要，全部链接反而有可能会出问题。</p>\n<p>尽管，之前的版本也能够支持子库选择的特性，例如：</p>\n"
  },
  {
    "title": "Xmake v2.7.2 发布，更加智能化构建第三方库",
    "url": "/zh/posts/xmake-update-v2.7.2",
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
    "excerpt": "<p>在先前的版本中，Xmake 提供了一种 TryBuild 模式，可以在没有 xmake.lua 的情况下，使用 Xmake 尝试对 autoconf/cmake/meson 等维护的第三方项目进行直接构建。</p>\n<p>其实，也就是让 Xmake 检测到对应的构建系统后，调用 cmake 等命令来实现，但是会帮助用户简化配置操作，另外还能对接 xmake 的交叉编译工具链配置。</p>\n<p>但是，这种模式有一定的失败率，比如以下一些情况，都会可能导致构建失败：</p>\n"
  },
  {
    "title": "Xmake v2.7.1 发布，更好的 C++ Modules 支持",
    "url": "/zh/posts/xmake-update-v2.7.1",
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
    "excerpt": "<p>这个版本我们对 C++20 Modules 的实现进行了重构和改进，改进了模块文件的依赖图解析，新增了对 STL 和 User HeaderUnits 的支持，同时让 CMakelists/compile_commands 生成器也支持了 C++ Modules。</p>\n<p>另外，我们新增了一个 <code>xmake watch</code> 插件，可以实时监控当前工程文件更新，自动触发增量构建，或者运行一些自定义的命令。</p>\n<p>&lt;img src=&quot;/assets/img/posts/xmake/xmake-watch.gif&quot;&gt;</p>\n"
  },
  {
    "title": "Xmake v2.6.6 发布，分布式编译和缓存支持",
    "url": "/zh/posts/xmake-update-v2.6.6",
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
    "excerpt": "<p>这个版本，我们增加了大量的重量级新特性：</p>\n<ul>\n<li>分布式编译支持</li>\n<li>内置本地编译缓存</li>\n<li>远程编译缓存支持</li>\n</ul>\n<p>通过这些特性，我们可以更加快速地编译大型 C/C++ 项目。另外，它们完全是跨平台的，不仅支持 gcc/clang 也支持 msvc，而且除了编译器无任何第三方依赖，使用也非常方便。</p>\n"
  },
  {
    "title": "Summer2022：暑期来 Xmake 社区做项目吧，还有奖金领取哦",
    "url": "/zh/posts/xmake-summer-2022",
    "date": {
      "time": 1651406400000,
      "string": "May 1, 2022"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "summer",
      "开源之夏"
    ],
    "excerpt": "<p>开源之夏是开源软件供应链点亮计划下的暑期活动，由中国科学院软件研究所与openEuler社区联合主办，旨在鼓励在校学生积极参与开源软件的开发维护，促进优秀开源软件社区的蓬勃发展。作为每年暑期最火热的开源活动，开源之夏如今已进入第三届。</p>\n<p>2022年，开源之夏联合124家开源社区，针对开源项目的开发与维护提供mini任务，学生可自主选择感兴趣的项目进行申请，并在中选后获得社区资深开发者亲自指导的机会。项目成功结项并贡献给社区后，参与者将获得开源之夏活动奖金和结项证书。</p>\n<p>开源之夏网站：<a href=\"https://summer.iscas.ac.cn/\">https://summer.iscas.ac.cn/</a></p>\n"
  },
  {
    "title": "xmake v2.6.5 发布，远程编译支持",
    "url": "/zh/posts/xmake-update-v2.6.5",
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
    "excerpt": "<p>新版本提供了远程编译支持，我们可以通过它可以远程服务器上编译代码，远程运行和调试。</p>\n<p>服务器可以部署在 Linux/MacOS/Windows 上，实现跨平台编译，例如：在 Linux 上编译运行 Windows 程序，在 Windows 上编译运行 macOS/Linux 程序。</p>\n<p>相比 ssh 远程登入编译，它更加的稳定，使用更加流畅，不会因为网络不稳定导致 ssh 终端输入卡顿，也可以实现本地快速编辑代码文件。</p>\n"
  },
  {
    "title": "xmake v2.6.4 发布，大量包管理特性改进",
    "url": "/zh/posts/xmake-update-v2.6.4",
    "date": {
      "time": 1646654400000,
      "string": "March 7, 2022"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "Package",
      "Manager"
    ],
    "excerpt": "<p>现在，我们可以通过 <code>set_base</code> 接口去继承一个已有的包的全部配置，然后在此基础上重写部分配置。</p>\n<p>这通常在用户自己的项目中，修改 <a href=\"https://github.com/xmake-io/xmake-repo\">xmake-repo</a> 官方仓库的内置包比较有用，比如：修复改 urls，修改版本列表，安装逻辑等等。</p>\n<p>例如，修改内置 zlib 包的 url，切到自己的 zlib 源码地址。</p>\n"
  },
  {
    "title": "xmake v2.6.3 发布，支持 vcpkg 清单模式",
    "url": "/zh/posts/xmake-update-v2.6.3",
    "date": {
      "time": 1642852800000,
      "string": "January 22, 2022"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "Linux",
      "Vcpkg"
    ],
    "excerpt": "<p>这个版本主要新增下面几个特性：</p>\n<ol>\n<li>通过 vcpkg 的清单模式实现 vcpkg 包的版本选择</li>\n<li>python 模块构建支持</li>\n<li>支持在 CMakeLists.txt 中集成 Xrepo/Xmake 包管理</li>\n</ol>\n<p>剩下的主要是一些零散的功能改进和 Bugs 修复，可以看下文末的更新内容明细，一些比较大的改动，下面也会逐一说明。</p>\n"
  },
  {
    "title": "xmake v2.6.2 发布，新增 Linux 内核驱动模块构建支持",
    "url": "/zh/posts/xmake-update-v2.6.2",
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
    "excerpt": "<p>这个版本主要新增两大特性：</p>\n<ol>\n<li>Linux 内核驱动模块的构建支持</li>\n<li>分组构建和批量运行支持，可用于实现 <code>Run all tests</code> 功能</li>\n</ol>\n<p>剩下的主要是一些零散的功能改进和 Bugs 修复，可以看下文末的更新内容明细，一些比较大的改动，下面也会逐一说明。</p>\n"
  },
  {
    "title": "xmake v2.6.1 发布，使用 Lua5.4 运行时，Rust 和 C++ 混合编译支持",
    "url": "/zh/posts/xmake-update-v2.6.1",
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
    "excerpt": "<p>历经几个版本的迭代测试，我们在 2.6.1 版本，正式切换到 Lua5.4 运行时。</p>\n<p>不过，这对于用户来说是完全无感知的，基本上没有任何兼容性问题，因为 xmake 对大部分接口都是封装过的，完全消除了 Lua 版本间的兼容性问题。</p>\n<p>对于构建性能方面，由于构建的性能瓶颈主要来自编译器，Lua 自身的性能损耗完全可以忽略，而且 xmake 用 c 重写了 lua 原生的所有 io 接口，并且对耗时的接口都用 c 实现了优化。</p>\n"
  },
  {
    "title": "xmake v2.5.9 发布，改进 C++20 模块，并支持 Nim, Keil MDK 和 Unity Build",
    "url": "/zh/posts/xmake-update-v2.5.9",
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
    "excerpt": "<p>最近，我们新增了对 Nimlang 项目的构建支持，相关 issues 见：<a href=\"https://github.com/xmake-io/xmake/issues/1756\">#1756</a></p>\n<p>我们可以使用 <code>xmake create</code> 命令创建空工程。</p>\n<pre><code class=\"language-console\">xmake create -l nim -t console test\nxmake create -l nim -t static test\nxmake create -l nim -t shared test\n</code></pre>\n"
  },
  {
    "title": "xmake v2.5.8 发布，新增 Pascal/Swig 程序和 Lua53 运行时支持",
    "url": "/zh/posts/xmake-update-v2.5.8",
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
    "excerpt": "<p>目前，我们可以使用跨平台的 Free pascal 工具链 fpc 去编译构建 Pascal 程序，例如：</p>\n<pre><code class=\"language-lua\">add_rules(&quot;mode.debug&quot;, &quot;mode.release&quot;)\ntarget(&quot;test&quot;)\n    set_kind(&quot;binary&quot;)\n    add_files(&quot;src/*.pas&quot;)\n</code></pre>\n<pre><code class=\"language-lua\">add_rules(&quot;mode.debug&quot;, &quot;mode.release&quot;)\ntarget(&quot;foo&quot;)\n    set_kind(&quot;shared&quot;)\n    add_files(&quot;src/foo.pas&quot;)</code></pre>\n"
  },
  {
    "title": "xmake v2.5.7 发布，包依赖锁定和 Vala/Metal 语言编译支持",
    "url": "/zh/posts/xmake-update-v2.5.7",
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
    "excerpt": "<p>这个版本，我们已经可以初步支持构建 Vala 程序，只需要应用 <code>add_rules(&quot;vala&quot;)</code> 规则。</p>\n<p>同时，我们需要添加一些依赖包，其中 glib 包是必须的，因为 vala 自身也会用到它。</p>\n<p><code>add_values(&quot;vala.packages&quot;)</code> 用于告诉 valac，项目需要哪些包，它会引入相关包的 vala api，但是包的依赖集成，还是需要通过 <code>add_requires(&quot;lua&quot;)</code> 下载集成。</p>\n"
  },
  {
    "title": "xmake v2.5.6 发布，改进预编译二进制镜像包兼容性",
    "url": "/zh/posts/xmake-update-v2.5.6",
    "date": {
      "time": 1627300800000,
      "string": "July 26, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "precompiled",
      "package"
    ],
    "excerpt": "<p>这是一个稳定性修复版本，主要修复和改进了一些跟预编译二进制包相关的兼容性问题。另外新增了一些实用的接口来设置默认的编译平台、架构和模式，以及允许的编译平台、架构列表等等。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n<li><a href=\"https://xmake.io/zh/\">入门课程</a></li>\n</ul>\n<p>上个版本对 Windows 下的 预编译包安装做了初步的支持，但是由于没有考虑 toolset 版本的兼容性问题，因此如果用户的 vs 版本过低，就会在集成包时候出现链接问题。</p>\n"
  },
  {
    "title": "xmake v2.5.5 发布，支持下载集成二进制镜像包",
    "url": "/zh/posts/xmake-update-v2.5.5",
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
    "excerpt": "<p>2.5.5 版本中，我们继续改进远程包集成的体验，实现在云端预编译包，然后直接下载集成预编译的二进制包。这对于一些编译非常慢的包，可以极大的减少包的安装时间。</p>\n<p>另外，新版本中，我们还重新实现了新版的本地包生成方案，完全无缝支持 <code>add_requires</code> 和 <code>add_packages</code>，从此远程包和本地包可以使用统一的集成方式来维护。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n<li><a href=\"https://xmake.io/zh/\">入门课程</a></li>\n</ul>\n"
  },
  {
    "title": "xmake v2.5.4 发布，支持 apt/portage 包管理器，改进 xrepo shell 环境",
    "url": "/zh/posts/xmake-update-v2.5.4",
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
    "excerpt": "<p>在 2.5.4 版本中，我们新增了对 Apt、Portage 这两个包管理器的支持，在 Ubuntu/Gentoo 上我们也可以使用 <code>add_requires</code> 可以快速集成它们提供的包。</p>\n<p>并且我们也改进支持了 Vcpkg 包管理器的支持，新增对 arm/arm64 架构包的安装支持。</p>\n<p>另外，我们还增强了 <code>xrepo env shell</code> 环境，可以通过在 <code>xmake.lua</code> 中配置一系列 <code>add_requires</code> 包配置，加载带有特定包配置的 shell 环境。</p>\n"
  },
  {
    "title": "Summer2021：暑期来 Xmake 社区做项目吧，还有奖金领取哦",
    "url": "/zh/posts/xmake-summer-ospp",
    "date": {
      "time": 1619697600000,
      "string": "April 29, 2021"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "summer",
      "开源之夏"
    ],
    "excerpt": "<p>中科院软件所与华为 openEuler 社区去年共同举办了 “开源软件供应链点亮计划——暑期2020” 活动，今年为第二届。该活动旨在鼓励大家关注开源软件和开源社区，致力于培养和发掘更多优秀的开发者。</p>\n<p>开源之夏网站：<a href=\"https://summer.iscas.ac.cn/\">https://summer.iscas.ac.cn/</a></p>\n<p>今年 Xmake 社区也报名参加了此活动，并且提供了三个活动项目，难易程度中等，欢迎大家一起参与进来，还有奖金可以领取哦。</p>\n"
  },
  {
    "title": "xmake v2.5.3 发布，支持构建 linux bpf 程序和 Conda 包集成",
    "url": "/zh/posts/xmake-update-v2.5.3",
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
    "excerpt": "<p>在 2.5.3 版本，我们新增了对 linux bpf 程序的构建支持，并且同时支持 android bpf 程序的构建。</p>\n<p>尽管 bpf 对 编译工具链有一定的要求，比如需要较新的 llvm/clang 和 android ndk 工具链，但是 xmake 能够自动拉取特定版本的 llvm/ndk 来用于编译，并且还能自动拉取 libbpf 等依赖库，完全省去了用户折腾编译环境和 libbpf 库集成的问题。</p>\n<p>另外，在新版本中我们还新增了对 Conda 包仓库的集成支持，现在除了能够从 Conan/Vcpkg/brew/pacman/clib/dub 等包仓库集成使用包，还能从 Conda 包仓库中集成各种二进制 C/C++ 包。</p>\n"
  },
  {
    "title": "xmake v2.5.2 发布, 支持自动拉取交叉工具链和依赖包集成",
    "url": "/zh/posts/xmake-update-v2.5.2",
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
    "excerpt": "<p>在 2.5.2 版本中，我们增加了一个重量级的新特性：<code>自动拉取远程交叉编译工具链</code>。</p>\n<p>这是用来干什么的呢，做过交叉编译以及有 C/C++ 项目移植经验的同学应该知道，折腾各种交叉编译工具链，移植编译项目是非常麻烦的一件事，需要自己下载对应工具链，并且配置工具链和编译环境很容易出错导致编译失败。</p>\n<p>现在，xmake 已经可以支持自动下载项目所需的工具链，然后使用对应工具链直接编译项目，用户不需要关心如何配置工具链，任何情况下只需要执行 <code>xmake</code> 命令即可完成编译。</p>\n"
  },
  {
    "title": "xmake v2.5.1 发布, 支持 Apple Silicon 并改进 C/C++ 包依赖管理",
    "url": "/zh/posts/xmake-update-v2.5.1",
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
    "excerpt": "<p>这是 xmake 在今年的首个版本，也是完全适配支持 Apple Silicon (macOS ARM) 设备的首个版本。</p>\n<p>这个版本，我们主要改进了对 C/C++ 依赖包的集成支持，更加的稳定，并且能够更加灵活的实现定制化配置编译。</p>\n<p>另外，我们还重点改进 vs/vsxmake 两个vs工程生成器插件，修复了很多细节问题，并且对子工程<code>分组</code>也做了支持，现在可以生成类似下图的工程结构。</p>\n"
  },
  {
    "title": "Xmake 2020 年终总结",
    "url": "/zh/posts/xmake-in-2020",
    "date": {
      "time": 1609329600000,
      "string": "December 30, 2020"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++"
    ],
    "excerpt": "<p>title: Xmake 2020 年终总结\ntags: [xmake, lua, C/C++]\ndate: 2020-12-30\nauthor: Ruki</p>\n<hr>\n<p>2020 年，<a href=\"https://github.com/xmake-io/xmake\">xmake</a> 总共迭代发布了9个版本，新增了 1871 commits，1k+ stars，新增处理了 500+ 的 issues/pr。</p>\n<p><img src=\"/assets/img/posts/xmake/star-history-2020.png\" alt=\"\"></p>\n"
  },
  {
    "title": "Xmake Discord 社区频道上线",
    "url": "/zh/posts/xmake-community",
    "date": {
      "time": 1607601600000,
      "string": "December 10, 2020"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "discord",
      "社区",
      "技术交流"
    ],
    "excerpt": "<p><a href=\"https://github.com/xmake-io/xmake\">xmake</a> 是一个基于 Lua 的轻量级跨平台构建工具，使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。</p>\n<p>我们可以用 xmake 很方便的开发构建 C/C++ 项目，同时也支持和其他 native 语言的混合编译。</p>\n<p><img src=\"/assets/img/index/xmake-basic-render.gif\" alt=\"\"></p>\n"
  },
  {
    "title": "xmake 官方入门课程上线, Xmake 带你轻松构建 C/C++ 项目",
    "url": "/zh/posts/xmake-course-build-c-projects",
    "date": {
      "time": 1602244800000,
      "string": "October 9, 2020"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "C/C++",
      "course",
      "qt",
      "实验楼",
      "入门课程"
    ],
    "excerpt": "<p><a href=\"https://www.lanqiao.cn/courses/2764\">Xmake 带你轻松构建 C/C++ 项目</a> 是我们在实验楼上推出的一门 xmake 入门和进阶课程（收费），以边学边做实验的方式快速学习 xmake 的使用。</p>\n<p>通过此处优惠码购买可享 9 折优惠：<code>NYFbmf3X</code></p>\n<p><a href=\"https://xmake.io\">Xmake</a> 是一个基于 Lua 的轻量级跨平台 C/C++ 构建工具，使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt 而言，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门 C/C++ 项目的编译开发，提供一站式跨平台编译、运行、调试、打包、安装等操作，能够让大家把更多的精力集中在实际的项目开发上。</p>\n"
  },
  {
    "title": "xmake从入门到精通12：通过自定义脚本实现更灵活地配置",
    "url": "/zh/posts/quickstart-12-custom-scripts",
    "date": {
      "time": 1595073600000,
      "string": "July 18, 2020"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "子工程",
      "子模块",
      "自定义脚本"
    ],
    "excerpt": "<p>xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。</p>\n<p>本文主要详细讲解下，如何通过添加自定义的脚本，在脚本域实现更加复杂灵活的定制。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n</ul>\n"
  },
  {
    "title": "xmake从入门到精通11：如何组织构建大型工程",
    "url": "/zh/posts/quickstart-11-subprojects",
    "date": {
      "time": 1586606400000,
      "string": "April 11, 2020"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "子工程",
      "子模块"
    ],
    "excerpt": "<p>xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。</p>\n<p>本文主要详细讲解下，如何通过配置子工程模块，来组织构建一个大规模的工程项目。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n</ul>\n"
  },
  {
    "title": "xmake从入门到精通10：多个子工程目标的依赖配置",
    "url": "/zh/posts/quickstart-10-target-deps",
    "date": {
      "time": 1576238400000,
      "string": "December 13, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "交叉编译"
    ],
    "excerpt": "<p>xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。</p>\n<p>本文主要详细讲解下，如果在一个项目中维护和生成多个目标文件的生成，以及它们之间的依赖关系设置。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n</ul>\n"
  },
  {
    "title": "xmake从入门到精通8：切换编译模式",
    "url": "/zh/posts/quickstart-8-switch-build-mode",
    "date": {
      "time": 1575547200000,
      "string": "December 5, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "编译模式"
    ],
    "excerpt": "<p>xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。</p>\n<p>本文我们会详细介绍下如何在项目构建过程中切换debug/release等常用构建模式，以及自定义其他编译模式。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n</ul>\n"
  },
  {
    "title": "xmake从入门到精通9：交叉编译详解",
    "url": "/zh/posts/quickstart-9-cross-compile",
    "date": {
      "time": 1575547200000,
      "string": "December 5, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "交叉编译"
    ],
    "excerpt": "<p>xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。</p>\n<p>除了win, linux, macOS平台，以及android, ios等移动端平台的内建构建支持，xmake也支持对各种其他工具链的交叉编译支持，本文我们将会详细介绍下如何使用xmake进行交叉编译。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n</ul>\n"
  },
  {
    "title": "xmake从入门到精通7：开发和构建Cuda程序",
    "url": "/zh/posts/quickstart-7-build-cuda-project",
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
    "excerpt": "<p>xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。</p>\n<p>本文我们会详细介绍下如何通过xmake来构建cuda程序以及与c/c++程序混合编译。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n</ul>\n"
  },
  {
    "title": "xmake从入门到精通6：开发和构建Qt程序",
    "url": "/zh/posts/quickstart-6-build-qt-project",
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
    "excerpt": "<p>xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。</p>\n<p>xmake完全支持对Qt5项目的维护和构建，通过本文将会带你了解如何通过xmake来维护各种类型的Qt项目。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n</ul>\n"
  },
  {
    "title": "xmake从入门到精通5：Android平台编译详解",
    "url": "/zh/posts/quickstart-5-build-android",
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
    "excerpt": "<p>xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。</p>\n<p>本文主要详细讲解如何通过xmake编译可在android下运行的库和可执行程序。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n</ul>\n"
  },
  {
    "title": "xmake从入门到精通4：常用C/C++项目描述设置详解",
    "url": "/zh/posts/quickstart-4-basic-project-settings",
    "date": {
      "time": 1573387200000,
      "string": "November 10, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "c/c++",
      "xmake配置描述"
    ],
    "excerpt": "<p>xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。</p>\n<p>本文主要详细讲解如何编写一些常用的基础xmake.lua描述配置，来实现一些简单的C/C++项目构建管理。\n对于大部分小项目，这些配置已经完全足够使用，本系列后期进阶教程中，我会深入详细讲解如果使用一些高级特性来更加灵活定制化地配置项目。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n</ul>\n"
  },
  {
    "title": "xmake从入门到精通1：安装和更新",
    "url": "/zh/posts/quickstart-1-installation",
    "date": {
      "time": 1573300800000,
      "string": "November 9, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "安装",
      "更新"
    ],
    "excerpt": "<p>xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。</p>\n<p>本文主要详细讲解xmake在各个平台下的安装过程。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n</ul>\n"
  },
  {
    "title": "xmake从入门到精通2：创建和编译工程",
    "url": "/zh/posts/quickstart-2-create-and-build-project",
    "date": {
      "time": 1573300800000,
      "string": "November 9, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "c/c++",
      "创建工程"
    ],
    "excerpt": "<p>xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。</p>\n<p>本文主要详细讲解如何创建一个基于xmake的工程以及编译操作。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n</ul>\n"
  },
  {
    "title": "xmake从入门到精通3：运行和调试目标程序",
    "url": "/zh/posts/quickstart-3-run-and-debug",
    "date": {
      "time": 1573300800000,
      "string": "November 9, 2019"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "c/c++",
      "运行",
      "调试"
    ],
    "excerpt": "<p>xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。</p>\n<p>本文主要详细讲解如何加载运行编译好的目标程序，以及如何去调试。</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake\">项目源码</a></li>\n<li><a href=\"https://xmake.io/zh/\">官方文档</a></li>\n</ul>\n"
  },
  {
    "title": "xmake新增对WDK驱动编译环境支持",
    "url": "/zh/posts/support-wdk",
    "date": {
      "time": 1528977600000,
      "string": "June 14, 2018"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "WDK",
      "kmdf",
      "umdf",
      "wdm",
      "driver"
    ],
    "excerpt": "<p><a href=\"https://github.com/xmake-io/xmake\">xmake</a> v2.2.1新版本现已支持WDK驱动编译环境，我们可以直接在系统原生cmd终端下，执行xmake进行驱动编译，甚至配合vscode, sublime text, IDEA等编辑器+xmake插件去开发WDK驱动。</p>\n<p>下面是xmake支持的一些编辑器插件，用户可以挑选自己喜欢的编辑器配合xmake来使用：</p>\n<ul>\n<li><a href=\"https://github.com/xmake-io/xmake-idea\">xmake-idea</a></li>\n<li><a href=\"https://github.com/xmake-io/xmake-vscode\">xmake-vscode</a></li>\n<li><a href=\"https://github.com/xmake-io/xmake-sublime\">xmake-sublime</a></li>\n</ul>\n"
  },
  {
    "title": "xmake进阶之简化你的构建描述",
    "url": "/zh/posts/simplify-xmake-description",
    "date": {
      "time": 1528459200000,
      "string": "June 8, 2018"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "工程描述",
      "xmake.lua",
      "简化"
    ],
    "excerpt": "<p><a href=\"https://github.com/xmake-io/xmake\">xmake</a>的初衷就是为了让用户能够用最简单直接的方式去描述工程，提供跨平台项目构建，因此，<code>简洁，灵活</code> 是xmake.lua的核心设计思想。</p>\n<p>通过之前的那篇文章:<a href=\"http://tboox.org/cn/2018/03/26/build-project-so-simply/\">xmake入门，构建项目原来可以如此简单</a>，我们对如何使用xmake去构建项目有了大概的了解，并且能够编写一些简单的xmake.lua去描述项目，例如:</p>\n<pre><code class=\"language-lua\">target(&quot;test&quot;)\n    set_kind(&quot;binary&quot;)\n    add_files(&quot;src/*.c&quot;)\n</code></pre>\n"
  },
  {
    "title": "xmake入门，构建项目原来可以如此简单",
    "url": "/zh/posts/build-project-so-simply",
    "date": {
      "time": 1522065600000,
      "string": "March 26, 2018"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "build",
      "project"
    ],
    "excerpt": "<p>在开发<a href=\"https://github.com/xmake-io/xmake\">xmake</a>之前，我一直在使用gnumake/makefile来维护个人C/C++项目，一开始还好，然而等项目越来越庞大后，维护起来就非常吃力了，后续也用过一阵子automake系列工具，并不是很好用。</p>\n<p>由于C/C++程序的构建过程比较繁琐，如果不借助IDE工具，很难快速构建一个新的C/C++程序，想要跨平台构建就更加麻烦了。</p>\n<p>虽然IDE很好用，也很强大，但是还是有很多不足的地方，例如:</p>\n"
  },
  {
    "title": "xmake新增对Cuda代码编译支持",
    "url": "/zh/posts/support-cuda",
    "date": {
      "time": 1520596800000,
      "string": "March 9, 2018"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "cuda",
      "NVIDIA",
      "GPU"
    ],
    "excerpt": "<p>最近研究了下NVIDIA Cuda Toolkit的编译环境，并且在xmake 2.1.10开发版中，新增了对cuda编译环境的支持，可以直接编译<code>*.cu</code>代码。</p>\n<p>关于Cuda Toolkit相关说明以及安装文档，可参考官方文档：<a href=\"http://docs.nvidia.com/cuda/index.html\">CUDA Toolkit Documentation</a>。</p>\n<p>下载安装好Cuda SDK后，在macosx上回默认安装到<code>/Developer/NVIDIA/CUDA-x.x</code>目录下，Windows上可以通过<code>CUDA_PATH</code>的环境变量找到对应的SDK目录，而\nLinux下默认会安装到<code>/usr/local/cuda</code>目录下。</p>\n"
  },
  {
    "title": "xmake 自定义构建规则的使用",
    "url": "/zh/posts/custom-rule",
    "date": {
      "time": 1510574400000,
      "string": "November 13, 2017"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "自定义规则"
    ],
    "excerpt": "<p>在2.1.9版本之后，xmake不仅原生内置支持多种语言文件的构建，而且还可以通过自定义构建规则，让用户自己来实现复杂的未知文件构建。</p>\n<p>具体使用介绍，可参考相关文档：<a href=\"https://xmake.io/zh/\">rule规则使用手册</a></p>\n<p>我们可以通过预先设置规则支持的文件后缀，来扩展其他文件的构建支持：</p>\n"
  },
  {
    "title": "xmake-vscode插件开发过程记录",
    "url": "/zh/posts/xmake-vscode",
    "date": {
      "time": 1507723200000,
      "string": "October 11, 2017"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "vscode",
      "插件开发"
    ],
    "excerpt": "<p>title: xmake-vscode插件开发过程记录\ntags: [xmake, vscode, 插件开发]\ndate: 2017-10-11\nauthor: Ruki</p>\n<hr>\n<p>最近打算给<a href=\"https://github.com/xmake-io/xmake\">xmake</a>写一些IDE和编辑器的集成插件，发现vscode的编辑器插件比较容易上手的，就先研究了下vscode的插件开发流程，并且完成了<a href=\"https://github.com/xmake-io/xmake-vscode\">xmake-vscode</a>插件的开发。</p>\n<p>我们先来看几张最后的效果图：</p>\n"
  },
  {
    "title": "xmake 源码架构剖析",
    "url": "/zh/posts/xmake-sourcecode-arch",
    "date": {
      "time": 1506600000000,
      "string": "September 28, 2017"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "源码",
      "架构设计"
    ],
    "excerpt": "<p>title: xmake 源码架构剖析\ntags: [xmake, lua, 源码, 架构设计]\ndate: 2017-09-28\nauthor: Ruki</p>\n<hr>\n<p>本文主要介绍下<a href=\"https://github.com/xmake-io/xmake\">xmake</a>的整体架构设计，以及源码结构的布局和模块划分。\n如果你想深度使用xmake，开发xmake插件、工程自定义脚本或者想为xmake贡献一些代码和特性，可以通过此本的介绍，对xmake项目整体有个大概的了解。，</p>\n<p>源码地址：<a href=\"https://github.com/xmake-io/xmake\">Github</a></p>\n"
  },
  {
    "title": "更细粒度的文件编译选项控制",
    "url": "/zh/posts/config-files-options",
    "date": {
      "time": 1502366400000,
      "string": "August 10, 2017"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "编译选项"
    ],
    "excerpt": "<p>之前的版本对编译控制粒度，只能到target这一级：</p>\n<pre><code class=\"language-lua\">-- 全局根配置，所有target都会被影响\nadd_defines(&quot;ROOT&quot;)\n\ntarget(&quot;test&quot;)</code></pre>\n"
  },
  {
    "title": "使用xmake检测编译器特性支持",
    "url": "/zh/posts/compiler-features",
    "date": {
      "time": 1502193600000,
      "string": "August 8, 2017"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "cmake",
      "编译器特性检测"
    ],
    "excerpt": "<p>如果我们要写跨平台的c/c++代码，很多时候需要处理由于不同编译器对c/c++各个标准支持力度不同导致的兼容性问题，一般通常的解决办法是：自己在代码中通过宏去判断各个编译器的版本、内置宏、标准库宏、<code>__has_feature</code>等来检测处理。</p>\n<p>自己如果在代码中按上述的方式检测，会很繁琐，尤其是像c++这种存在大量语法特性，如果一一检测过来，工作量是非常大的。</p>\n<p>另外比较省事的方式，就是依赖构建工具提前做好检测，然后把检测结果作为宏添加到编译中去，这样代码只需要判断对应的特性宏是否存在，就可以进行处理了。</p>\n"
  },
  {
    "title": "不同编译器对预编译头文件的处理",
    "url": "/zh/posts/precompiled-header",
    "date": {
      "time": 1501502400000,
      "string": "July 31, 2017"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "预编译头文件",
      "c++编译加速",
      "优化编译",
      "跨平台"
    ],
    "excerpt": "<p>最近为了给<a href=\"https://xmake.io\">xmake</a>实现预编译头文件的支持，研究了下各大主流编译器处理预编译头的机制以及之间的一些差异。</p>\n<p>现在的大部分c/c++编译器都是支持预编译头的，例如：gcc，clang，msvc等，用于优化c++代码的编译速度，毕竟c++的头文件如果包含了模板定义的话，编译速度是很慢的，\n如果能够吧大部分通用的头文件放置在一个<code>header.h</code>中，在其他源码编译之前预先对其进行编译，之后的代码都能重用这部分预编译头，就可以极大程度上减少频繁的头文件冗余编译。</p>\n<p>但是不同编译器对它的支持力度和处理方式，还是有很大差异的，并不是非常通用，在xmake中封装成统一的接口和使用方式，还是费了很大的功夫才搞定。</p>\n"
  },
  {
    "title": "使用xmake优雅地描述工程",
    "url": "/zh/posts/project-desciption-examples",
    "date": {
      "time": 1491393600000,
      "string": "April 5, 2017"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "工程描述"
    ],
    "excerpt": "<p>xmake的描述语法基于lua实现，因此描述语法继承了lua的灵活性和简洁性，并且通过28原则，将描述作用域（简单描述）、脚本作用域（复杂描述）进行分离，使得工程更加的简洁直观，可读性非常好。</p>\n<p>因为80%的工程，并不需要很复杂的脚本控制逻辑，只需要简单的几行配置描述，就可满足构建需求，基于这个假设，xmake分离作用域，使得80%的<code>xmake.lua</code>文件，只需要这样描述：</p>\n<pre><code class=\"language-lua\">target(&quot;demo&quot;)\n    set_kind(&quot;binary&quot;)\n    add_files(&quot;src/*.c&quot;)\n</code></pre>\n"
  },
  {
    "title": "xmake改进权限问题，提升操作安全性",
    "url": "/zh/posts/safer-install-and-uninstall",
    "date": {
      "time": 1490875200000,
      "string": "March 30, 2017"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "root权限",
      "安装",
      "卸载"
    ],
    "excerpt": "<p>最近对xmake的操作权限进行了升级，提供更加安全的命令操作，例如：</p>\n<ol>\n<li>改进<code>xmake install</code>和<code>xmake uninstall</code>命令，提供更加安全地安装和卸载支持</li>\n<li>参考homebrew，禁止在root下运行xmake命令</li>\n<li>改进xmake自身的编译安装脚本，不在root下进行build</li>\n</ol>\n<p>之前的<code>xmake install</code>和<code>xmake uninstall</code>行为，是自动<code>build</code>后进行安装，而大部分情况下安装目录是在<code>/usr/local</code>目录下。</p>\n"
  },
  {
    "title": "利用debug库实现对lua的性能分析",
    "url": "/zh/posts/lua-profiler",
    "date": {
      "time": 1484222400000,
      "string": "January 12, 2017"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "性能分析"
    ],
    "excerpt": "<p>之前在给<a href=\"https://xmake.io/zh/\">xmake</a>做构建的效率优化的时候，需要对lua脚本的api调用性能进行分析，分析出最耗时一些lua调用api，\n找出性能瓶颈，来针对性地进行优化，那么问题来了，如果对lua脚本像c程序那样进行profile呢？</p>\n<p>我们现在看下最后实现完的最终效果：</p>\n<pre><code> 4.681,  98.84%,       1, anonymous                     : actions/build/main.lua: 36\n 3.314,  69.98%,       1, anonymous                     : actions/build/main.lua: 66\n 3.314,  69.98%,       1, build                         : actions/build/builder.lua: 127\n 3.298,  69.65%,       2, _build_targ...</code></pre>\n"
  },
  {
    "title": "使用lua实现try-catch异常捕获",
    "url": "/zh/posts/try-catch",
    "date": {
      "time": 1481716800000,
      "string": "December 14, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "lua",
      "try-catch",
      "异常捕获"
    ],
    "excerpt": "<p>lua原生并没有提供try-catch的语法来捕获异常处理，但是提供了<code>pcall/xpcall</code>等接口，可在保护模式下执行lua函数。</p>\n<p>因此，可以通过封装这两个接口，来实现try-catch块的捕获机制。</p>\n<p>我们可以先来看下，封装后的try-catch使用方式：</p>\n"
  },
  {
    "title": "xmake 新增ios app2ipa插件",
    "url": "/zh/posts/app-to-ipa",
    "date": {
      "time": 1478692800000,
      "string": "November 9, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "插件",
      "ios"
    ],
    "excerpt": "<p>最近在做ios app的企业测试包，需要频繁打包分发给测试，因此将编译完的.app打包成ipa单独分发出去，这里调研下几种打包方案：</p>\n<ol>\n<li>直接通过iTunes来打包</li>\n<li>调用zip写个打包脚本</li>\n<li>使用第三方脚本和工具</li>\n</ol>\n<p>为了方便日常ios app打包程ipa，觉得可以把这个脚本放到xmake中去，作为一个小插件提供，也是个不错的方式。</p>\n"
  },
  {
    "title": "xmake 描述语法和作用域详解",
    "url": "/zh/posts/api-scope",
    "date": {
      "time": 1477483200000,
      "string": "October 26, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "api",
      "工程描述",
      "作用域"
    ],
    "excerpt": "<p>xmake的工程描述文件xmake.lua虽然基于lua语法，但是为了使得更加方便简洁得编写项目构建逻辑，xmake对其进行了一层封装，使得编写xmake.lua不会像些makefile那样繁琐</p>\n<p>基本上写个简单的工程构建描述，只需三行就能搞定，例如：</p>\n<pre><code class=\"language-lua\">target(&quot;test&quot;)\n    set_kind(&quot;binary&quot;)\n    add_files(&quot;src/*.c&quot;)\n</code></pre>\n"
  },
  {
    "title": "xmake支持vs2008生成",
    "url": "/zh/posts/generate-vs2008-project",
    "date": {
      "time": 1471003200000,
      "string": "August 12, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "VisualStudio",
      "vs2008"
    ],
    "excerpt": "<p>xmake master上最新版本已经支持vs2008工程文件的生成，通过<code>project</code>插件的方式提供，例如：</p>\n<p>创建vs2008工程文件：</p>\n<pre><code class=\"language-bash\">$ xmake project -k vs2008\n</code></pre>\n"
  },
  {
    "title": "xmake内建变量和外置变量的使用",
    "url": "/zh/posts/variables-usage",
    "date": {
      "time": 1470657600000,
      "string": "August 8, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "内建变量",
      "外置变量"
    ],
    "excerpt": "<p>title: xmake内建变量和外置变量的使用\ntags: [xmake, 内建变量, 外置变量]\ndate: 2016-08-08\nauthor: Ruki</p>\n<hr>\n<h2>内建变量</h2>\n<p>内置在字符串中，例如：</p>\n"
  },
  {
    "title": "xmake高级特性之自定义选项",
    "url": "/zh/posts/custom-option",
    "date": {
      "time": 1470571200000,
      "string": "August 7, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "自定义选项"
    ],
    "excerpt": "<p>xmake还可以支持一些自定义选项开关，使得工程支持可选编译，方便工程的模块化管理。</p>\n<p>我们拿一个实际的例子来说：</p>\n<p>我们想在自己的工程中增加一个新开关选项：hello， 如果这个开关被启用，会在target中添加特定的一些源码文件，但是这个开挂默认是不被启用的，需要通过配置<code>xmake f --hello=true</code>才会被链接和使用</p>\n"
  },
  {
    "title": "依赖包的添加和自动检测机制",
    "url": "/zh/posts/add-package-and-autocheck",
    "date": {
      "time": 1470484800000,
      "string": "August 6, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "依赖包",
      "自动检测"
    ],
    "excerpt": "<p>xmake将依赖库、依赖头文件、依赖类型、依赖接口统一用 option 选项机制进行了封装，更在上一层引入package包的机制，使得添加和检测依赖更加的模块化，简单化。。。</p>\n<p>下面通过一个具体实例，来看下xmake的包机制怎么使用。。</p>\n<p>假如你现在的工程已经有了两个包：zlib.pkg，polarssl.pkg（如何构建包，后续会详细说明，现在可以参考<a href=\"https://github.com/waruqi/tbox/tree/master/pkg\">TBOX依赖包</a>下已有包的例子），你的工程目录结构如下：</p>\n"
  },
  {
    "title": "xmake高级特性之批量检测库函数",
    "url": "/zh/posts/batch-check-library-interfaces",
    "date": {
      "time": 1470484800000,
      "string": "August 6, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "批量检测"
    ],
    "excerpt": "<p>有时候可能用到某个库的某些函数接口，但是这个库有可能在某个平台上被裁减过了，接口支持不全，如果你想跨平台使用，就会出问题</p>\n<p>因此在使用之前进行检测是否存在这个函数，还是很有必要的，xmake提供了方便的api，可以批量检测某个库的一些函数：</p>\n<p>例如：</p>\n"
  },
  {
    "title": "使用xmake编译swift代码",
    "url": "/zh/posts/compile-swift",
    "date": {
      "time": 1470484800000,
      "string": "August 6, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "swift"
    ],
    "excerpt": "<p>xmake不仅可以支持 c/c++文件，同时也支持 objc/c++，甚至swift代码的编译。</p>\n<p>我们先看一下如何创建Swift工程，首先执行--help，看下帮助文档：</p>\n<pre><code class=\"language-bash\">xmake create --help \n</code></pre>\n"
  },
  {
    "title": "静态库和动态库的编译切换",
    "url": "/zh/posts/switch-library-kind",
    "date": {
      "time": 1470225600000,
      "string": "August 3, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "静态库",
      "动态库"
    ],
    "excerpt": "<p>如果你想在同一个target上既编译静态库，又能编译动态库，那么稍微修改下 xmale.lua就行了：</p>\n<pre><code class=\"language-lua\">add_target(&quot;test&quot;)\n\n-- 设置编译target的类型，之前是：static/shared，现在改成动态的\n    set_kind(&quot;$(kind)&quot;)</code></pre>\n"
  },
  {
    "title": "xmake高级特性之选项绑定",
    "url": "/zh/posts/binding-option",
    "date": {
      "time": 1470139200000,
      "string": "August 2, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "选项绑定"
    ],
    "excerpt": "<p>什么是选项的绑定呢？</p>\n<p>例如我想在命令行中配置一个smallest的参数：<code>xmake f --smallest=y</code></p>\n<p>这个时候，需要同时禁用多个其他的选项开关，来禁止编译多个模块，就是这个需求，相当于一个选项 与其他 多个选项之间 是有联动效应的。。</p>\n"
  },
  {
    "title": "xmake插件使用之doxygen文档生成",
    "url": "/zh/posts/plugin-doxygen",
    "date": {
      "time": 1470139200000,
      "string": "August 2, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "doxygen",
      "插件",
      "文档生成"
    ],
    "excerpt": "<p>这个doxygen插件比较简单，说白了就是一键生成工程文档，只需要执行下面这行命令就行了</p>\n<pre><code class=\"language-bash\">xmake doxygen\n</code></pre>\n<p>当然你也可以指定输出目录，可以工程源码目录：</p>\n"
  },
  {
    "title": "关于xmake下一步的开发计划",
    "url": "/zh/posts/next-plan",
    "date": {
      "time": 1469793600000,
      "string": "July 29, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "插件",
      "后续计划"
    ],
    "excerpt": "<p>最近有很多用户反馈xmake在windows上编译体验不是很好，不方便进行调试和开发。。</p>\n<p>其实xmake的定位主要还是以直接编译为主，提供跨平台的编译和部署，不依赖第三方IDE工程，不过目前确实在windows的体验还不是很好</p>\n<p>尽管我已经优化了在windows下的编译速度，并且提供了<code>xmake run -d xxxx</code>方式，直接加载调试器进行源码调试</p>\n"
  },
  {
    "title": "xmake默认启用pdb符号文件",
    "url": "/zh/posts/enable-pdb-on-windows",
    "date": {
      "time": 1469361600000,
      "string": "July 24, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "编译",
      "符号文件",
      "调试符号"
    ],
    "excerpt": "<p>之前xmake默认编译windows目标，debug模式下采用的是<code>-Z7</code>编译选项，内置的调试符号信息到obj文件里面</p>\n<p>但是这种方式按msdn的文档上说，是属于旧式的调试符号文件格式，所以为了考虑后续的兼容性，xmake修改了默认的调试符号生成规则，</p>\n<p>改为默认启用pdb符号文件，并且pdb的方式更为常用。。</p>\n"
  },
  {
    "title": "xmake工程描述编写之选择性编译",
    "url": "/zh/posts/condition-and-select-compile",
    "date": {
      "time": 1469275200000,
      "string": "July 23, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "编译",
      "工程描述",
      "xmake.lua",
      "条件判断"
    ],
    "excerpt": "<p>xmake 提供了一些内置的条件判断api，用于在选择性编译时，获取到一些工程状态的相关信息，来调整编译逻辑。。</p>\n<p>例如：<code>is_os</code>, <code>is_plat</code>, <code>is_arch</code>, <code>is_kind</code>, <code>is_mode</code>, <code>is_option</code></p>\n<p>我们先拿最常用的<code>is_mode</code>来讲讲如何使用，这个api主要用来判断当前的编译模式，例如平常编译配置的时候，会执行：</p>\n"
  },
  {
    "title": "如何通过xmake进行交叉编译",
    "url": "/zh/posts/how-to-compile-on-cross-toolchains",
    "date": {
      "time": 1469188800000,
      "string": "July 22, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "交叉编译"
    ],
    "excerpt": "<p>xmake 提供了方便灵活的交叉编译支持，大部分情况下，都不需要配置很复杂的toolchains前缀，例如：<code>arm-linux-</code> 什么的</p>\n<p>只要这个toolchains目录满足如下结构（大部分的交叉工具链都是这个结构）：</p>\n<pre><code>/home/toolchains_sdkdir\n   - bin\n       - arm-linux-gcc\n       - arm-linux-ld\n       - ...\n   - lib\n       - libxxx.a\n   - include\n       - xxx.h\n</code></pre>\n"
  },
  {
    "title": "如何为windows编译启用pdb支持",
    "url": "/zh/posts/enable-pdb-for-windows",
    "date": {
      "time": 1468843200000,
      "string": "July 18, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "pdb",
      "调试符号",
      "windows"
    ],
    "excerpt": "<p>xmake默认情况下是不会去生成pdb文件，就算是debug编译，启用了调试符号：</p>\n<pre><code class=\"language-lua\">set_symbols(&quot;debug&quot;)\n</code></pre>\n<p>也是不会生成额外的pdb文件，它会把所有调试符号内置到程序里面，如果要独立生成pdb文件，可以对<code>xmake.lua</code>进行如下修改：</p>\n"
  },
  {
    "title": "如何快速构建一个简单的程序",
    "url": "/zh/posts/how-to-build-a-simple-project",
    "date": {
      "time": 1468670400000,
      "string": "July 16, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "编译",
      "交叉编译"
    ],
    "excerpt": "<p>首先我们通过内置的工程模板创建一个空工程:</p>\n<pre><code class=\"language-bash\">$ xmake create -P ./hello\n\ncreate hello ...\ncreate ok!👌\n</code></pre>\n"
  },
  {
    "title": "利用xmake运行和调试程序",
    "url": "/zh/posts/run-debug",
    "date": {
      "time": 1468670400000,
      "string": "July 16, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "调试",
      "运行"
    ],
    "excerpt": "<p>xmake默认在编译完程序后，可以通过以下命令运行指定目标程序：</p>\n<pre><code class=\"language-bash\">    $xmake run [target] [arguments] ...\n</code></pre>\n<p>并且在linux/macosx下面，目前已经支持关联调试器，去直接调试指定目标了，只需要加上<code>-d/--debug</code>参数选项：</p>\n"
  },
  {
    "title": "插件开发之色彩高亮显示",
    "url": "/zh/posts/plugin-print-colors",
    "date": {
      "time": 1468497600000,
      "string": "July 14, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "插件",
      "终端色彩高亮"
    ],
    "excerpt": "<p>xmake在开发插件脚本的时候，除了可以使用lua内置的print进行终端输出外，还可以通过另外一个接口：<code>cprint</code>实现终端的色彩高亮输出</p>\n<p>例如：</p>\n<pre><code class=\"language-lua\">    cprint('${bright}hello xmake')\n    cprint('${red}hello xmake')\n    cprint('${bright green}hello ${clear}xmake')\n    cprint('${blue onyellow underline}hello xmake${clear}')\n    cprint('${red}hello ${magenta}xmake')\n    cprint('${cyan}hello ${dim yellow}xmake')\n</code></pre>\n"
  },
  {
    "title": "头文件自动依赖检测和构建",
    "url": "/zh/posts/includes-check",
    "date": {
      "time": 1468324800000,
      "string": "July 12, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "头文件依赖",
      "增量编译"
    ],
    "excerpt": "<p>为了进一步提升构建效率，减少没必要的重建，xmake新增了对头文件的依赖检测，以及自动构建仅仅需要重新编译的源文件，提升编译速度，并且完全支持windows、linux、macosx等大部分平台。。</p>\n<p>由于检测过程本身也会有一些性能损耗，因此xmake对此进行了深度优化，实现极速依赖检测：</p>\n<ul>\n<li>对依赖头文件进行过滤，如果是系统头文件，非自身项目的第三方头文件，自动忽略，这些头文件基本上不会再开发项目的时候，经常变动，所以没必要去每次检测他们，如果真有变动，手动重建下就行了</li>\n</ul>\n"
  },
  {
    "title": "插件使用之加载自定义lua脚本",
    "url": "/zh/posts/plugin-lua",
    "date": {
      "time": 1467892800000,
      "string": "July 7, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "plugin",
      "scripts"
    ],
    "excerpt": "<p>xmake里面的lua脚本加载插件，可以让你方便调试和编写一些自定义的lua脚本，这个时候xmake就是一个纯lua的加载引擎。。</p>\n<p>例如，我想写个简单的<code>hello xmake!</code>的lua脚本，可以自己建个 <code>hello.lua</code> 文件，编写如下脚本：</p>\n<pre><code class=\"language-lua\">    function main()\n        print(&quot;hello xmake!&quot;)\n    end\n</code></pre>\n"
  },
  {
    "title": "xmake插件开发之类库使用",
    "url": "/zh/posts/plugin-modules",
    "date": {
      "time": 1467892800000,
      "string": "July 7, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "插件",
      "类库"
    ],
    "excerpt": "<p>xmake通过import接口，可以在自定义脚本中导入各种内置类库和扩展类库模块，使得xmake的插件开发具有更多的灵活性，提供更丰富的功能。</p>\n<p>我们先看下，目前xmake提供的一些类库：</p>\n<pre><code>    .\n    ├── _g.lua\n    ├── assert.lua\n    ├── catch.lua\n    ├── coroutine.lua\n    ├── debug.lua\n    ├── finally.lua\n    ├── format.lua\n    ├── ifelse.lua\n    ├── import\n    │   └── core\n    │       ├── base\n    │       │   └── option.lua\n    │       ├── platform\n    │       │   ├── environment...</code></pre>\n"
  },
  {
    "title": "xmake后期发展随想",
    "url": "/zh/posts/v2.1.1-goal",
    "date": {
      "time": 1466856000000,
      "string": "June 25, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "包管理",
      "插件",
      "代码移植编译"
    ],
    "excerpt": "<p>title: xmake后期发展随想\ntags: [xmake, 包管理, 插件, 代码移植编译]\ndate: 2016-06-25\nauthor: Ruki</p>\n<hr>\n<p>随着xmake v2.0.1 版本的发布，这大半年的辛苦总算告一段落，这个版本我基本上重构整个项目的90%的代码，几乎算是重写了，但结果还算挺满意的。。</p>\n<p>因为上个版本的架构设计的不是很好，不能很好进行扩展，也不支持插件模式，语法设计上也不严谨，容易出现各种隐患，这对于后期维护和发展来说，已经出现了不可逾越的瓶颈。。</p>\n"
  },
  {
    "title": "插件开发之import类库",
    "url": "/zh/posts/api-import",
    "date": {
      "time": 1465473600000,
      "string": "June 9, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "插件",
      "import",
      "类库",
      "自定义脚本"
    ],
    "excerpt": "<p>import的主要用于导入xmake的扩展类库以及一些自定义的类库模块，一般用于 自定义脚本(on_build, on_run ..)、插件开发、模板开发、平台扩展、自定义任务task等地方。</p>\n<p>导入机制如下：</p>\n<ol>\n<li>优先从当前脚本目录下导入</li>\n<li>再从扩展类库中导入</li>\n</ol>\n"
  },
  {
    "title": "高级特性之自定义脚本使用",
    "url": "/zh/posts/custom-action",
    "date": {
      "time": 1465473600000,
      "string": "June 9, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "自定义脚本",
      "安装",
      "打包",
      "android",
      "apk",
      "jni"
    ],
    "excerpt": "<p>xmake提供了自定义打包、安装、运行脚本，可以更加灵活的针对个人实际需求来操作xmake</p>\n<p>这里用一个例子详细说明下，比如有个需求，我需要自动编译、安装、运行android app工程，并且能够支持jni\n可以进行如下操作</p>\n<p>首先创建个基于ant的android app工程，目录结构如下：</p>\n"
  },
  {
    "title": "高级特性之自定义task任务",
    "url": "/zh/posts/custom-task",
    "date": {
      "time": 1465473600000,
      "string": "June 9, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "task",
      "自定义脚本",
      "插件"
    ],
    "excerpt": "<p>task是xmake 2.0开始新增的特性，也是插件开发的核心，在 <a href=\"https://xmake.io/zh/\">插件开发之hello xmake</a> 中我们简单介绍了下task的定义和使用</p>\n<p>当然task不仅可以用来写插件，而且还可以写一些简单的自定义任务。。</p>\n<p>我们先看下一个简单task实现：</p>\n"
  },
  {
    "title": "插件开发之参数配置",
    "url": "/zh/posts/plugin-arguments",
    "date": {
      "time": 1465473600000,
      "string": "June 9, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "插件",
      "菜单选项"
    ],
    "excerpt": "<p>我们继续以之前讲解的hello插件为基础，现在为其增加参数配置选项，并且指定一个独立的脚本文件中进行开发，这样我们就可以写一些更复杂的插件</p>\n<pre><code class=\"language-lua\">    -- 定义一个名叫hello的插件任务\n    task(&quot;hello&quot;)\n\n-- 设置类型为插件\n        set_category(&quot;plugin&quot;)</code></pre>\n"
  },
  {
    "title": "插件使用之批量打包",
    "url": "/zh/posts/plugin-macro-package",
    "date": {
      "time": 1465473600000,
      "string": "June 9, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "插件",
      "宏脚本",
      "打包"
    ],
    "excerpt": "<p>xmake提供了一些比较实用的内置宏脚本，比如 批量打包宏脚本 <code>xmake macro package</code></p>\n<p>这个宏脚本可以批量打包指定平台的所有架构，例如：</p>\n<pre><code class=\"language-bash\">    # 批量打包当前平台的所有架构\n    xmake macro package</code></pre>\n"
  },
  {
    "title": "插件使用之宏脚本记录",
    "url": "/zh/posts/plugin-macro",
    "date": {
      "time": 1465473600000,
      "string": "June 9, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "插件",
      "宏脚本"
    ],
    "excerpt": "<p>xmake 提供了一些内置的比较实用的插件，其中宏脚本插件是最具有代表性和实用性的，也是xmake比较推荐的一款插件，那它有哪些使用功能呢？</p>\n<p>我们先来看下：<code>xmake macro --help</code></p>\n<pre><code>    Usage: xmake macro|m [options] [name] [arguments]</code></pre>\n"
  },
  {
    "title": "xmake高级特性之合并静态库",
    "url": "/zh/posts/merge-static-library",
    "date": {
      "time": 1454587200000,
      "string": "February 4, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "静态库"
    ],
    "excerpt": "<p>xmake的add_files接口不仅可以添加源代码文件进行编译，还可以直接添加*.o/obj对象文件、以及*.a/lib的库文件到编译目标中，这个跟add_links是有区别的</p>\n<ul>\n<li>add_links：只能添加链接，例如： -lxxxx 这种，链接的目标也只能是可执行程序、动态库，而且只会链接需要的代码进去</li>\n<li>add_files：是直接将静态库中的所有对象文件，解包、重新打包到新的target中，这个target可以是新的静态库，也可以是可执行程序、或者动态库</li>\n</ul>\n<p>例如：</p>\n"
  },
  {
    "title": "xmake中add_files的使用",
    "url": "/zh/posts/project-add-files",
    "date": {
      "time": 1454587200000,
      "string": "February 4, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "模式匹配"
    ],
    "excerpt": "<p>如果你看了<a href=\"https://xmake.io/zh/\">工程描述入门</a>，那么是否觉得通过 add_files 添加源文件相当的方便？</p>\n<p>目前它可以支持<code>.c/.cpp/.s/.S/.m/.mm/.o/.obj/.a/.lib</code>这些后缀的源代码和库文件，其中通配符*表示匹配当前目录下文件，而**则匹配多级目录下的文件。</p>\n<p>例如：</p>\n"
  },
  {
    "title": "使用xmake编译工程",
    "url": "/zh/posts/project-compile",
    "date": {
      "time": 1454587200000,
      "string": "February 4, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "编译",
      "跨平台"
    ],
    "excerpt": "<p>如果你只想编译当前主机环境的平台，例如在windows上编译windows版本，在macosx上编译macosx版本，那么你只需要敲以下命令即可：</p>\n<pre><code class=\"language-bash\">    xmake\n</code></pre>\n<p>因为xmake默认会去检测当前的环境，默认编译当前主机的平台版本，不需要做额外的配置，并且默认编译的是release版本。</p>\n"
  },
  {
    "title": "xmake工程描述入门",
    "url": "/zh/posts/project-description",
    "date": {
      "time": 1454500800000,
      "string": "February 3, 2016"
    },
    "author": "Ruki",
    "tags": [
      "xmake",
      "premake"
    ],
    "excerpt": "<p>xmake的工程描述文件，摈弃了makefile的繁琐复杂，借鉴了premake的简洁明了，原生支持lua脚本，使得更加的灵活、方便扩展。</p>\n<p>工程默认描述文件名为xmake.lua，支持多级目录嵌套，也可以通过以下命令，指定其他文件作为工程描述文件：</p>\n<pre><code class=\"language-bash\">    xmake -f /tmp/xxx.lua\n    xmake --file=xxx.lua\n</code></pre>\n"
  }
]