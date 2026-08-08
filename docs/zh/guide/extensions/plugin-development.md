# 插件开发 {#plugin-development}

## 简介

Xmake 完全支持插件模式，我们可以很方便地扩展实现自己的插件，并且 Xmake 也提供了一些内建的插件可供使用。

我们可以执行下 `xmake -h` 看下当前支持的插件：

```
Plugins:
    l, lua                                 Run the lua script.
    m, macro                               Run the given macro.
       doxygen                             Generate the doxygen document.
       hello                               Hello xmake!
       project                             Create the project file.
```

* lua: 运行lua脚本的插件
* macro: 这个很实用，宏脚本插件，可以手动录制多条 xmake 命令并且回放，也可以通过脚本实现一些复杂的宏脚本，这个我们后续会更加详细地介绍
* doxygen：一键生成 doxygen 文档的插件
* hello: 插件 demo，仅仅显示一句话：'hello xmake!'
* project： 生成工程文件的插件，目前已经支持 make、cmake、ninja、xcode（需要 cmake）和 vs 的工程文件，以及 compile_commands.json 和 compile_flags.txt 文件的生成

## 快速开始

接下来我们介绍下本文的重点，一个简单的 hello xmake 插件的开发，代码如下：

```lua
-- 定义一个名叫hello的插件任务
task("hello")

    -- 设置类型为插件
    set_category("plugin")

    -- 插件运行的入口
    on_run(function ()

        -- 显示hello xmake!
        print("hello xmake!")
    end)

    -- 设置插件的命令行选项，这里没有任何参数选项，仅仅显示插件描述
    set_menu {
                -- usage
                usage = "xmake hello [options]"

                -- description
            ,   description = "Hello xmake!"

                -- options
            ,   options = {}
            }
```

这个插件的文件结构如下：

```
plugins
|-- hello
|  |-- xmake.lua
|...
| plugins目录下无需xmake.lua
```

现在一个最简单的插件写完了，那怎么让它被xmake检测到呢，有三种方式：

1. 把 hello 这个文件夹放置在 xmake 的插件安装目录 `xmake/plugins`，这个里面都是一些内建的插件
2. 把 hello 文件夹放置在 `~/.xmake/plugins` 用户全局目录，这样对当前 xmake 全局生效
3. 把 hello 文件夹放置在当前工程的 `./plugins` 目录下，通过在工程描述文件 xmake.lua 中调用 `add_plugindirs("plugins")` 添加当前工程的插件搜索目录，这样只对当前工程生效

## 运行插件

接下来，我们尝试运行下这个插件：

```sh
xmake hello
```

显示结果：

```
hello xmake!
```

最后我们还可以在 target 自定义的脚本中运行这个插件：

```lua
target("demo")

    -- 构建之后运行插件
    after_build(function (target)

        -- 导入task模块
        import("core.project.task")

        -- 运行插件任务
        task.run("hello")
    end)
```

## 安装插件 <Badge type="tip" text="v3.1.0" />

在 v3.1.0 之后，我们可以通过 `xmake plugin` 直接安装插件，不再需要手动拷贝目录。

```sh
# 按名称从已配置的仓库中安装
$ xmake plugin --install hello

# 从指定仓库安装
$ xmake plugin --install xmake-repo@hello

# 从 git 地址安装，支持 `github:` 简写和 `#分支名`
$ xmake plugin --install https://github.com/myrepo/hello-world
$ xmake plugin --install github:myrepo/hello-world
$ xmake plugin --install github:myrepo/hello-world#dev

# 从本地目录安装，方便插件的本地开发调试
$ xmake plugin --install /tmp/my-plugin
```

安装后的插件位于 `~/.xmake/plugins/<插件名>`，对当前 xmake 全局生效。

`--list` 会把内置插件、已安装插件，以及仓库中可安装但尚未安装的插件分组列出，并带上各自的描述。

```sh
$ xmake plugin --list
```

删除插件：

```sh
# 删除指定插件
$ xmake plugin --remove hello

# 清理所有已安装的插件
$ xmake plugin --clear
```

## 分发插件 <Badge type="tip" text="v3.1.0" />

如果希望自己的插件可以从仓库安装，只需要把它描述成一个 `plugin` 类型的包，并采用和 packages 一致的目录布局，即 `<repodir>/plugins/<首字母>/<插件名>/xmake.lua`。

```lua
-- plugins/h/hello/xmake.lua
package("hello")
    set_kind("plugin")
    set_description("Hello xmake!")
    set_sourcedir(path.join(os.scriptdir(), "src"))
```

其中 `src` 目录里就是插件本身的实现，也就是上面介绍的 `xmake.lua` + `main.lua`。

```
plugins
|-- h
|  |-- hello
|  |  |-- xmake.lua      -- 包描述文件
|  |  |-- src
|  |  |  |-- xmake.lua   -- 插件任务定义
|  |  |  |-- main.lua    -- 插件入口
```

对于这种源码直接内置在仓库里的插件，`on_install` 是可以省略的，xmake 会默认把插件目录整个拷贝到 `~/.xmake/plugins/<插件名>` 下。

由于插件本质上就是一个 `plugin` 类型的包，所以 `add_urls`、`add_versions`、`add_deps`，以及自定义 `on_install` / `on_test` 这些包的能力它同样都有。

关于如何添加自己的仓库，可以参考[仓库管理](../package-management/repository-management.md)。
