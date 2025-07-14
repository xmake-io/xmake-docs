export const posts = [
  {
    "title": "Xmake 3.0 正式发布",
    "url": "/zh/posts/xmake-3-0-release",
    "date": {
      "time": 1705320000000,
      "string": "January 15, 2024"
    },
    "author": "waruqi",
    "tags": [
      "发布",
      "xmake",
      "构建系统"
    ],
    "excerpt": "<p>我们很高兴地宣布 Xmake 3.0 正式发布！这个重大版本在性能、易用性和功能完整性方面都带来了显著改进。</p>\n<p>Xmake 3.0 引入了完全重写的构建引擎，相比之前的版本提供了高达 3 倍的构建速度提升。新引擎具有以下特性：</p>\n<ul>\n<li>优化的依赖解析</li>\n<li>改进的并行编译</li>\n<li>更好的缓存机制</li>\n<li>减少内存使用</li>\n</ul>\n"
  },
  {
    "title": "使用 Xmake 构建跨平台应用",
    "url": "/zh/posts/cross-platform-development",
    "date": {
      "time": 1704888000000,
      "string": "January 10, 2024"
    },
    "author": "waruqi",
    "tags": [
      "跨平台",
      "教程",
      "cpp"
    ],
    "excerpt": "<p>构建能在多个平台上运行的应用程序可能具有挑战性，但 Xmake 让这一切变得简单得多。在本文中，我们将探索如何使用 Xmake 构建跨平台应用程序。</p>\n<p>在当今多样化的计算环境中，用户期望您的应用程序能在他们偏好的平台上运行。无论是 Windows、macOS 还是 Linux，Xmake 都提供了从单一代码库为所有平台构建应用所需的工具。</p>\n<p>以下是如何配置 Xmake 进行跨平台构建的简单示例：</p>\n"
  },
  {
    "title": "Xmake 入门指南",
    "url": "/zh/posts/post-3",
    "date": {
      "time": 1704456000000,
      "string": "January 5, 2024"
    },
    "author": "waruqi",
    "tags": [
      "教程",
      "入门"
    ],
    "excerpt": "<p>Xmake 是一个现代化的构建系统，让 C/C++ 开发变得更加简单和高效。在本指南中，我们将介绍 Xmake 的基本设置和使用方法。</p>\n<p>安装 Xmake 非常简单。您可以使用以下方法之一：</p>\n<p>让我们创建一个简单的 C++ 项目：</p>\n"
  },
  {
    "title": "高级包管理",
    "url": "/zh/posts/post-4",
    "date": {
      "time": 1704283200000,
      "string": "January 3, 2024"
    },
    "author": "waruqi",
    "tags": [
      "包管理",
      "高级"
    ],
    "excerpt": "<p>Xmake 提供了一个强大的包管理系统，简化了 C/C++ 项目中的依赖处理。</p>\n<p>向您的项目添加包很简单：</p>\n<pre><code class=\"language-lua\">target(&quot;myapp&quot;)\n    set_kind(&quot;binary&quot;)\n    add_files(&quot;src/*.cpp&quot;)\n    add_packages(&quot;fmt&quot;, &quot;spdlog&quot;, &quot;nlohmann_json&quot;)\n</code></pre>\n"
  },
  {
    "title": "IDE 集成指南",
    "url": "/zh/posts/post-10",
    "date": {
      "time": 1704110400000,
      "string": "January 1, 2024"
    },
    "author": "waruqi",
    "tags": [
      "ide",
      "集成"
    ],
    "excerpt": "<p>Xmake 为流行的 IDE 和编辑器提供了出色的集成，使开发更加高效。</p>\n<p>为 VS Code 安装 Xmake 扩展：</p>\n<ol>\n<li>打开 VS Code</li>\n<li>转到扩展 (Ctrl+Shift+X)</li>\n<li>搜索 &quot;Xmake&quot;</li>\n<li>安装扩展</li>\n</ol>\n"
  },
  {
    "title": "IDE 集成指南",
    "url": "/zh/posts/post-11",
    "date": {
      "time": 1704110400000,
      "string": "January 1, 2024"
    },
    "author": "waruqi",
    "tags": [
      "ide",
      "集成"
    ],
    "excerpt": "<p>Xmake 为流行的 IDE 和编辑器提供了出色的集成，使开发更加高效。</p>\n<p>为 VS Code 安装 Xmake 扩展：</p>\n<ol>\n<li>打开 VS Code</li>\n<li>转到扩展 (Ctrl+Shift+X)</li>\n<li>搜索 &quot;Xmake&quot;</li>\n<li>安装扩展</li>\n</ol>\n"
  },
  {
    "title": "IDE 集成指南",
    "url": "/zh/posts/post-5",
    "date": {
      "time": 1704110400000,
      "string": "January 1, 2024"
    },
    "author": "waruqi",
    "tags": [
      "ide",
      "集成"
    ],
    "excerpt": "<p>Xmake 为流行的 IDE 和编辑器提供了出色的集成，使开发更加高效。</p>\n<p>为 VS Code 安装 Xmake 扩展：</p>\n<ol>\n<li>打开 VS Code</li>\n<li>转到扩展 (Ctrl+Shift+X)</li>\n<li>搜索 &quot;Xmake&quot;</li>\n<li>安装扩展</li>\n</ol>\n"
  },
  {
    "title": "IDE 集成指南",
    "url": "/zh/posts/post-6",
    "date": {
      "time": 1704110400000,
      "string": "January 1, 2024"
    },
    "author": "waruqi",
    "tags": [
      "ide",
      "集成"
    ],
    "excerpt": "<p>Xmake 为流行的 IDE 和编辑器提供了出色的集成，使开发更加高效。</p>\n<p>为 VS Code 安装 Xmake 扩展：</p>\n<ol>\n<li>打开 VS Code</li>\n<li>转到扩展 (Ctrl+Shift+X)</li>\n<li>搜索 &quot;Xmake&quot;</li>\n<li>安装扩展</li>\n</ol>\n"
  },
  {
    "title": "IDE 集成指南",
    "url": "/zh/posts/post-7",
    "date": {
      "time": 1704110400000,
      "string": "January 1, 2024"
    },
    "author": "waruqi",
    "tags": [
      "ide",
      "集成"
    ],
    "excerpt": "<p>Xmake 为流行的 IDE 和编辑器提供了出色的集成，使开发更加高效。</p>\n<p>为 VS Code 安装 Xmake 扩展：</p>\n<ol>\n<li>打开 VS Code</li>\n<li>转到扩展 (Ctrl+Shift+X)</li>\n<li>搜索 &quot;Xmake&quot;</li>\n<li>安装扩展</li>\n</ol>\n"
  },
  {
    "title": "IDE 集成指南",
    "url": "/zh/posts/post-8",
    "date": {
      "time": 1704110400000,
      "string": "January 1, 2024"
    },
    "author": "waruqi",
    "tags": [
      "ide",
      "集成"
    ],
    "excerpt": "<p>Xmake 为流行的 IDE 和编辑器提供了出色的集成，使开发更加高效。</p>\n<p>为 VS Code 安装 Xmake 扩展：</p>\n<ol>\n<li>打开 VS Code</li>\n<li>转到扩展 (Ctrl+Shift+X)</li>\n<li>搜索 &quot;Xmake&quot;</li>\n<li>安装扩展</li>\n</ol>\n"
  },
  {
    "title": "IDE 集成指南",
    "url": "/zh/posts/post-9",
    "date": {
      "time": 1704110400000,
      "string": "January 1, 2024"
    },
    "author": "waruqi",
    "tags": [
      "ide",
      "集成"
    ],
    "excerpt": "<p>Xmake 为流行的 IDE 和编辑器提供了出色的集成，使开发更加高效。</p>\n<p>为 VS Code 安装 Xmake 扩展：</p>\n<ol>\n<li>打开 VS Code</li>\n<li>转到扩展 (Ctrl+Shift+X)</li>\n<li>搜索 &quot;Xmake&quot;</li>\n<li>安装扩展</li>\n</ol>\n"
  }
]