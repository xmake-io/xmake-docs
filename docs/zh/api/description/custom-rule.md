# 自定义规则 {#custom-rule}

2.2.1发布后，Xmake 不仅原生支持多语言文件的构建，还允许用户通过自定义构建规则实现复杂的未知文件构建。

自定义构建规则可以使用 `set_extensions` 将一组文件扩展名关联到它们。

一旦这些扩展与规则相关联，稍后对 `add_files` 的调用将自动使用此自定义规则。

这是一个示例规则，它将使用 Pandoc 将添加到构建目标的 Markdown 文件转换为 HTML 文件：

```lua
-- Define a build rule for a markdown file
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        import("core.project.depend")
        import("utils.progress") -- it only for v2.5.9, we need use print to show progress below v2.5.8

        -- make sure build directory exists
        os.mkdir(target:targetdir())

        -- replace .md with .html
        local targetfile = path.join(target:targetdir(), path.basename(sourcefile) .. ".html")

        -- only rebuild the file if its changed since last run
        depend.on_changed(function ()
            -- call pandoc to make a standalone html file from a markdown file
            os.vrunv('pandoc', {"-s", "-f", "markdown", "-t", "html", "-o", targetfile, sourcefile})
            progress.show(opt.progress, "${color.build.object}markdown %s", sourcefile)
        end, {files = sourcefile})
    end)

target("test")
    set_kind("object")

    -- make the test target support the construction rules of the markdown file
    add_rules("markdown")

    -- adding a markdown file to build
    add_files("src/*.md")
    add_files("src/*.markdown")
```

还有一种以 `on_build_files` 形式代替 `on_build_file` 的方法，它允许您在一个函数调用中处理整个文件集。

第二种称为 `on_buildcmd_file` 和 `on_buildcmd_files` 的形式是声明性的；它不是运行任意 Lua 来构建目标，而是运行 Lua 来了解这些目标是如何构建的。

`buildcmd` 的优点是可以将这些规则导出到根本不需要 xmake 即可运行的 makefile。

我们可以使用 buildcmd 进一步简化它，如下所示：


```lua
-- Define a build rule for a markdown file
rule("markdown")
    set_extensions(".md", ".markdown")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)

        -- make sure build directory exists
        batchcmds:mkdir(target:targetdir())

        -- replace .md with .html
        local targetfile = path.join(target:targetdir(), path.basename(sourcefile) .. ".html")

        -- call pandoc to make a standalone html file from a markdown file
        batchcmds:vrunv('pandoc', {"-s", "-f", "markdown", "-t", "html", "-o", targetfile, sourcefile})
        batchcmds:show_progress(opt.progress, "${color.build.object}markdown %s", sourcefile)

        -- only rebuild the file if its changed since last run
        batchcmds:add_depfiles(sourcefile)
    end)

target("test")
    set_kind("object")

    -- make the test target support the construction rules of the markdown file
    add_rules("markdown")

    -- adding a markdown file to build
    add_files("src/*.md")
    add_files("src/*.markdown")
```

无论文件扩展名如何，文件都可以分配给特定规则。您可以通过在添加文件时设置 `rule` 自定义属性来完成此操作，如下例所示：

```lua
target("test")
    -- ...
    add_files("src/test/*.md.in", {rule = "markdown"})
```

一个target可以叠加应用多个rules去更加定制化实现自己的构建行为，甚至支持不同的构建环境。

::: tip 注意
通过`add_files("*.md", {rule = "markdown"})`方式指定的规则，优先级高于`add_rules("markdown")`设置的规则。
:::

## rule

- 定义规则

#### 函数原型

```lua
rule(name: <string>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 规则名称字符串 |

#### 用法说明

```lua
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)
```

## add_deps

- 添加规则依赖

#### 函数原型

```lua
add_deps(deps: <string|array>, ..., {
    order = <boolean>
})
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| deps | 依赖规则名称字符串或数组 |
| ... | 可变参数，可传递多个依赖名称 |
| order | 是否按顺序执行依赖 |

#### 用法说明

关联依赖可以绑定一批规则，也就是不必对 target 挨个去使用 `add_rules()` 添加规则，只需要应用一个规则，就能生效它和它的所有依赖规则。

例如：

```lua
rule("foo")
    add_deps("bar")

rule("bar")
   ...
```

我们只需要 `add_rules("foo")`，就能同时应用 foo 和 bar 两个规则。

但是，默认情况下，依赖之间是不存在执行的先后顺序的，foo 和 bar 的 `on_build_file` 等脚本是并行执行的，顺序未定义。

如果要严格控制执行顺序，可以配置 `add_deps("bar", {order = true})`，告诉 xmake，我们需要根据依赖顺序来执行同级别的脚本。

例如：

```lua
rule("foo")
    add_deps("bar", {order = true})
    on_build_file(function (target, sourcefile)
    end)

rule("bar")
    on_build_file(function (target, sourcefile)
    end)
```

bar 的 `on_build_file` 将会被先执行。

::: tip 注意
控制依赖顺序，我们需要 xmake 2.7.2 以上版本才支持。
:::

不过，这种控制依赖的方式，只适合 foo 和 bar 两个规则都是自定义规则，如果想要将自己的规则插入到 xmake 的内置规则之前执行，这就不适用了。

这个时候，我们需要使用更加灵活的动态规则创建和注入的方式，去修改内置规则。

例如，我们想在内置的 `c++.build` 规则之前，执行自定义 cppfront 规则的 `on_build_file` 脚本，我们可以通过下面的方式来实现。

```lua
rule("cppfront")
    set_extensions(".cpp2")
    on_load(function (target)
        local rule = target:rule("c++.build"):clone()
        rule:add("deps", "cppfront", {order = true})
        target:rule_add(rule)
    end)
    on_build_file(function (target, sourcefile, opt)
        print("build cppfront file")
    end)

target("test")
    set_kind("binary")
    add_rules("cppfront")
    add_files("src/*.cpp")
    add_files("src/*.cpp2")
```

## add_imports

- 为所有自定义脚本预先导入扩展模块

#### 函数原型

```lua
add_imports(modules: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| modules | 模块名称字符串或数组 |
| ... | 可变参数，可传递多个模块名称 |

#### 用法说明

使用方式和说明请见：[target:add_imports](/zh/api/description/project-target#add-imports)，用法相同。

## set_extensions

- 设置规则支持的文件扩展类型

#### 函数原型

```lua
set_extensions(extensions: <string|array>, ...)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| extensions | 文件扩展名字符串或数组 |
| ... | 可变参数，可传递多个扩展名 |

#### 用法说明

通过设置支持的扩展文件类型，将规则应用于带这些后缀的文件上，例如：

```lua
-- 定义一个markdown文件的构建规则
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)

target("test")
    set_kind("binary")

    -- 使test目标支持markdown文件的构建规则
    add_rules("markdown")

    -- 添加markdown文件的构建
    add_files("src/*.md")
    add_files("src/*.markdown")
```

## on_load

- 自定义加载脚本

#### 函数原型

```lua
on_load(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 加载脚本函数，参数为target |

#### 用法说明

用于实现自定规则的加载脚本，当加载target的时候，会被执行，可在里面自定义设置一些target配置，例如：

```lua
rule("test")
    on_load(function (target)
        target:add("defines", "TEST")
    end)
```

## on_link

- 自定义链接脚本

#### 函数原型

```lua
on_link(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 链接脚本函数，参数为target |

#### 用法说明

用于实现自定规则的链接脚本，会覆盖被应用的target的默认链接行为，例如：

```lua
rule("test")
    on_link(function (target)
    end)
```

## on_config

- 自定义配置脚本

#### 函数原型

```lua
on_config(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 配置脚本函数，参数为target |

#### 用法说明

在 `xmake config` 执行完成后，Build 之前会执行此脚本，通常用于编译前的配置工作。它与 on_load 不同的是，on_load 只要 target 被加载就会执行，执行时机更早。

如果一些配置，无法在 on_load 中过早配置，那么都可以在 on_config 中去配置它。

另外，它的执行时机比 before_build 还要早，大概的执行流程如下：

```
on_load -> after_load -> on_config -> before_build -> on_build -> after_build
```

## on_build

- 自定义编译脚本

#### 函数原型

```lua
on_build(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译脚本函数，参数为target |

#### 用法说明

用于实现自定规则的构建脚本，会覆盖被应用的target的默认构建行为，例如：

```lua
rule("markdown")
    on_build(function (target)
    end)
```

## on_clean

- 自定义清理脚本

#### 函数原型

```lua
on_clean(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 清理脚本函数，参数为target |

#### 用法说明

用于实现自定规则的清理脚本会，覆盖被应用的target的默认清理行为，例如：

```lua
rule("markdown")
    on_clean(function (target)
        -- remove sourcefile.html
    end)
```

## on_package

- 自定义打包脚本

#### 函数原型

```lua
on_package(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 打包脚本函数，参数为target |

#### 用法说明

用于实现自定规则的打包脚本，覆盖被应用的target的默认打包行为, 例如：

```lua
rule("markdown")
    on_package(function (target)
        -- package sourcefile.html
    end)
```

## on_install

- 自定义安装脚本

#### 函数原型

```lua
on_install(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 安装脚本函数，参数为target |

#### 用法说明

用于实现自定规则的安装脚本，覆盖被应用的target的默认安装行为, 例如：

```lua
rule("markdown")
    on_install(function (target)
    end)
```

## on_uninstall

- 自定义卸载脚本

#### 函数原型

```lua
on_uninstall(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 卸载脚本函数，参数为target |

#### 用法说明

用于实现自定规则的卸载脚本，覆盖被应用的target的默认卸载行为, 例如：

```lua
rule("markdown")
    on_uninstall(function (target)
    end)
```

## on_build_file

- 自定义编译脚本，一次处理一个源文件

#### 函数原型

```lua
on_build_file(script: <function (target, sourcefile, opt)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译文件脚本函数，参数为target、sourcefile和opt |

#### 用法说明

```lua
rule("markdown")
    on_build_file(function (target, sourcefile, opt)
        print("%%%d: %s", opt.progress, sourcefile)
    end)
```

其中第三个参数opt是可选参数，用于获取一些编译过程中的信息状态，例如：opt.progress 为当期的编译进度。

## on_buildcmd_file

- 自定义批处理编译脚本，一次处理一个源文件

#### 函数原型

```lua
on_buildcmd_file(script: <function (target, batchcmds, sourcefile, opt)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 批处理编译文件脚本函数，参数为target、batchcmds、sourcefile和opt |

#### 用法说明

这是 2.5.2 版本新加的接口，里面的脚本不会直接构建源文件，但是会通过 batchcmds 对象，构造一个批处理命令行任务，
xmake 在实际执行构建的时候，一次性执行这些命令。

这对于 `xmake project` 此类工程生成器插件非常有用，因为生成器生成的第三方工程文件并不支持 `on_build_files` 此类内置脚本的执行支持。

但是 `on_buildcmd_files` 构造的最终结果，就是一批原始的 cmd 命令行，可以直接给其他工程文件作为 custom commands 来执行。

另外，相比 `on_build_files`，它也简化对扩展文件的编译实现，更加的可读易配置，对用户也更加友好。

```lua
rule("foo")
    set_extensions(".xxx")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile})
        batchcmds:add_depfiles("/xxxxx/dependfile.h",  ...)
        -- batchcmds:add_depvalues(...)
        -- batchcmds:set_depmtime(os.mtime(...))
        -- batchcmds:set_depcache("xxxx.d")
    end)
```

除了 `batchcmds:vrunv`，我们还支持一些其他的批处理命令，例如：

```lua
batchcmds:show("hello %s", "xmake")
batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile}, {envs = {LD_LIBRARY_PATH="/xxx"}})
batchcmds:mkdir("/xxx") -- and cp, mv, rm, ln ..
batchcmds:compile(sourcefile_cx, objectfile, {configs = {includedirs = sourcefile_dir, languages = (sourcekind == "cxx" and "c++11")}})
batchcmds:link(objectfiles, targetfile, {configs = {linkdirs = ""}})
```

同时，我们在里面也简化对依赖执行的配置，下面是一个完整例子：

```lua
rule("lex")
    set_extensions(".l", ".ll")
    on_buildcmd_file(function (target, batchcmds, sourcefile_lex, opt)

        -- imports
        import("lib.detect.find_tool")

        -- get lex
        local lex = assert(find_tool("flex") or find_tool("lex"), "lex not found!")

        -- get c/c++ source file for lex
        local extension = path.extension(sourcefile_lex)
        local sourcefile_cx = path.join(target:autogendir(), "rules", "lex_yacc", path.basename(sourcefile_lex) .. (extension == ".ll" and ".cpp" or ".c"))

        -- add objectfile
        local objectfile = target:objectfile(sourcefile_cx)
        table.insert(target:objectfiles(), objectfile)

        -- add commands
        batchcmds:show_progress(opt.progress, "${color.build.object}compiling.lex %s", sourcefile_lex)
        batchcmds:mkdir(path.directory(sourcefile_cx))
        batchcmds:vrunv(lex.program, {"-o", sourcefile_cx, sourcefile_lex})
        batchcmds:compile(sourcefile_cx, objectfile)

        -- add deps
        batchcmds:add_depfiles(sourcefile_lex)
        local dependfile = target:dependfile(objectfile)
        batchcmds:set_depmtime(os.mtime(dependfile))
        batchcmds:set_depcache(dependfile)
    end)
```

`add_depfiles` 设置这个目标文件依赖的源文件。`set_depmtime` 设置目标文件的修改时间，如果有任意源文件的修改时间大于它，则认为需要重新生成这个目标文件。这里使用 dependfile 而不是 objectfile 的原因见 [issues 748](https://github.com/xmake-io/xmake/issues/748)。`set_depcache` 设置存储依赖信息的文件。

关于这个的详细说明和背景，见：[issue 1246](https://github.com/xmake-io/xmake/issues/1246)

## on_build_files

- 自定义编译脚本，一次处理多个源文件

#### 函数原型

```lua
on_build_files(script: <function (target, sourcebatch, opt)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译文件脚本函数，参数为target、sourcebatch和opt |

#### 用法说明

大部分的自定义构建规则，每次都是处理单独一个文件，输出一个目标文件，例如：a.c => a.o

但是，有些情况下，我们需要同时输入多个源文件一起构建生成一个目标文件，例如：a.c b.c d.c => x.o

对于这种情况，我们可以通过自定义这个脚本来实现：

```lua
rule("markdown")
    on_build_files(function (target, sourcebatch, opt)
        -- build some source files
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            -- ...
        end
    end)
```

## on_buildcmd_files

- 自定义批处理编译脚本，一次处理多个源文件

#### 函数原型

```lua
on_buildcmd_files(script: <function (target, batchcmds, sourcebatch, opt)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 批处理编译文件脚本函数，参数为target、batchcmds、sourcebatch和opt |

#### 用法说明

关于这个的详细说明，见：[on_buildcmd_file](#on_buildcmd_file)

```lua
rule("foo")
    set_extensions(".xxx")
    on_buildcmd_files(function (target, batchcmds, sourcebatch, opt)
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile})
        end
    end)
```

## before_config

- 自定义配置前脚本

#### 函数原型

```lua
before_config(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 配置前脚本函数，参数为target |

#### 用法说明

用于实现自定义 target 配置前的执行脚本，例如：

```lua
rule("test")
    before_config(function (target)
    end)
```

它会在 on_config 之前被执行。

## before_link

- 自定义链接前脚本

#### 函数原型

```lua
before_link(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 链接前脚本函数，参数为target |

#### 用法说明

用于实现自定义target链接前的执行脚本，例如：

```lua
rule("test")
    before_link(function (target)
    end)
```

## before_build

- 自定义编译前脚本

#### 函数原型

```lua
before_build(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译前脚本函数，参数为target |

#### 用法说明

用于实现自定义target构建前的执行脚本，例如：

```lua
rule("markdown")
    before_build(function (target)
    end)
```

## before_clean

- 自定义清理前脚本

#### 函数原型

```lua
before_clean(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 清理前脚本函数，参数为target |

#### 用法说明

用于实现自定义target清理前的执行脚本，例如：

```lua
rule("markdown")
    before_clean(function (target)
    end)
```

## before_package

- 自定义打包前脚本

#### 函数原型

```lua
before_package(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 打包前脚本函数，参数为target |

#### 用法说明

用于实现自定义target打包前的执行脚本, 例如：

```lua
rule("markdown")
    before_package(function (target)
    end)
```

## before_install

- 自定义安装前脚本

#### 函数原型

```lua
before_install(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 安装前脚本函数，参数为target |

#### 用法说明

用于实现自定义target安装前的执行脚本，例如：

```lua
rule("markdown")
    before_install(function (target)
    end)
```

## before_uninstall

- 自定义卸载前脚本

#### 函数原型

```lua
before_uninstall(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 卸载前脚本函数，参数为target |

#### 用法说明

用于实现自定义target卸载前的执行脚本，例如：

```lua
rule("markdown")
    before_uninstall(function (target)
    end)
```

## before_build_file

- 自定义编译前脚本，一次处理一个源文件

#### 函数原型

```lua
before_build_file(script: <function (target, sourcefile, opt)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译前文件脚本函数，参数为target、sourcefile和opt |

#### 用法说明

跟[on_build_file](#on_build_file)用法类似，不过这个接口被调用的时机是在编译某个源文件之前，
一般用于对某些源文件进行编译前的预处理。

## before_buildcmd_file

- 自定义编译前批处理脚本，一次处理一个源文件

#### 函数原型

```lua
before_buildcmd_file(script: <function (target, batchcmds, sourcefile, opt)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译前批处理文件脚本函数，参数为target、batchcmds、sourcefile和opt |

#### 用法说明

跟[on_buildcmd_file](#on_buildcmd_file)用法类似，不过这个接口被调用的时机是在编译某个源文件之前，
一般用于对某些源文件进行编译前的预处理。

## before_build_files

- 自定义编译前脚本，一次处理多个源文件

#### 函数原型

```lua
before_build_files(script: <function (target, sourcebatch, opt)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译前文件脚本函数，参数为target、sourcebatch和opt |

#### 用法说明

跟[on_build_files](#on_build_files)用法类似，不过这个接口被调用的时机是在编译某些源文件之前，
一般用于对某些源文件进行编译前的预处理。

## before_buildcmd_files

- 自定义编译前批处理脚本，一次处理多个源文件

#### 函数原型

```lua
before_buildcmd_files(script: <function (target, batchcmds, sourcebatch, opt)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译前批处理文件脚本函数，参数为target、batchcmds、sourcebatch和opt |

#### 用法说明

跟[on_buildcmd_files](#on_buildcmd_files)用法类似，不过这个接口被调用的时机是在编译某些源文件之前，
一般用于对某些源文件进行编译前的预处理。

## after_config

- 自定义配置后脚本

#### 函数原型

```lua
after_config(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 配置后脚本函数，参数为target |

#### 用法说明

用于实现自定义 target 配置后的执行脚本，例如：

```lua
rule("test")
    after_config(function (target)
    end)
```

它会在 on_config 之后被执行。

## after_link

- 自定义链接后脚本

#### 函数原型

```lua
after_link(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 链接后脚本函数，参数为target |

#### 用法说明

用于实现自定义target链接后的执行脚本，用法跟[before_link](#before_link)类似。

## after_build

- 自定义编译后脚本

#### 函数原型

```lua
after_build(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译后脚本函数，参数为target |

#### 用法说明

用于实现自定义target构建后的执行脚本，用法跟[before_build](#before_build)类似。

## after_clean

- 自定义清理后脚本

#### 函数原型

```lua
after_clean(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 清理后脚本函数，参数为target |

#### 用法说明

用于实现自定义target清理后的执行脚本，用法跟[before_clean](#before_clean)类似。

## after_package

- 自定义打包后脚本

#### 函数原型

```lua
after_package(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 打包后脚本函数，参数为target |

#### 用法说明

用于实现自定义target打包后的执行脚本, 用法跟[before_package](#before_package)类似。

## after_install

- 自定义安装后脚本

#### 函数原型

```lua
after_install(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 安装后脚本函数，参数为target |

#### 用法说明

用于实现自定义target安装后的执行脚本，用法跟[before_install](#before_install)类似。

## after_uninstall

- 自定义卸载后脚本

#### 函数原型

```lua
after_uninstall(script: <function (target)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 卸载后脚本函数，参数为target |

#### 用法说明

用于实现自定义target卸载后的执行脚本，用法跟[before_uninstall](#before_uninstall)类似。

## after_build_file

- 自定义编译后脚本，一次处理一个源文件

#### 函数原型

```lua
after_build_file(script: <function (target, sourcefile, opt)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译后文件脚本函数，参数为target、sourcefile和opt |

#### 用法说明

跟[on_build_file](#on_build_file)用法类似，不过这个接口被调用的时机是在编译某个源文件之后，
一般用于对某些编译后对象文件进行后期处理。

## after_buildcmd_file

- 自定义编译后批处理脚本，一次处理一个源文件

#### 函数原型

```lua
after_buildcmd_file(script: <function (target, batchcmds, sourcefile, opt)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译后批处理文件脚本函数，参数为target、batchcmds、sourcefile和opt |

#### 用法说明

跟[on_buildcmd_file](#on_buildcmd_file)用法类似，不过这个接口被调用的时机是在编译某个源文件之后，
一般用于对某些编译后对象文件进行后期处理。

## after_build_files

- 自定义编译后脚本，一次处理多个源文件

#### 函数原型

```lua
after_build_files(script: <function (target, sourcebatch, opt)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译后文件脚本函数，参数为target、sourcebatch和opt |

#### 用法说明

跟[on_build_files](#on_build_files)用法类似，不过这个接口被调用的时机是在编译某些源文件之后，
一般用于对某些编译后对象文件进行后期处理。

## after_buildcmd_files

- 自定义编译后批处理脚本，一次处理多个源文件

#### 函数原型

```lua
after_buildcmd_files(script: <function (target, batchcmds, sourcebatch, opt)>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| script | 编译后批处理文件脚本函数，参数为target、batchcmds、sourcebatch和opt |

#### 用法说明

跟[on_buildcmd_files](#on_buildcmd_files)用法类似，不过这个接口被调用的时机是在编译某些源文件之后，
一般用于对某些编译后对象文件进行后期处理。

## rule_end

- 结束定义规则

#### 函数原型

```lua
rule_end()
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| - | 无参数 |

#### 用法说明

这个是可选的，如果想要手动结束rule的定义，可以调用它：

```lua
rule("test")
    -- ..
rule_end()
```
