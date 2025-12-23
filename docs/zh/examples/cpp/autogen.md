# 自动代码生成 {#autogen}

在许多情况下，我们需要在编译之前对代码进行预处理和自动生成，然后将生成的代码参与到后续的编译流程中。

随着 Xmake 的不断迭代，对代码生成特性的支持也在持续更新和改进。目前主要支持以下几种方式：

## 最简单的方式

这种方式最为简单直接，只需在构建之前生成代码，并通过 `add_files` 强制添加进来。

由于 `add_files` 默认不会添加不存在的文件，所以需要配置 `always_added = true`，即使文件当前还不存在也能强制添加。

<FileExplorer rootFilesDir="examples/cpp/autogen/simple" />

这种方式有很多局限性，实际场景下不常用，但胜在简单易懂。

## 依赖目标生成

有时我们需要通过执行项目中的某个目标程序来生成代码，可以通过如下方式实现：

<FileExplorer rootFilesDir="examples/cpp/autogen/rule" />

首先需要配置一个 autogen 目标程序，它必须能在当前编译平台运行，因此需通过 `set_plat(os.host())` 强制为主机平台编译。

另外，需要配置 `build.fence` 策略，禁用源码间并行编译，确保 autogen 目标源码优先编译，提前生成 autogen 可执行程序。

然后，配置自定义规则，在构建前调用 autogen 目标程序生成源码，并直接将生成的源码编译为对象文件，插入到后续链接流程中。

完整例子见：[autogen_codedep](https://github.com/xmake-io/xmake/blob/dev/tests/projects/other/autogen/autogen_codedep/xmake.lua)

## 通过原生模块生成

Xmake 新增了原生模块开发特性，即使不定义额外的 autogen 目标程序，也可以通过原生模块生成代码。

关于原生模块开发，可参考文档：[Native 模块开发](/zh/api/scripts/native-modules)。

```lua
add_rules("mode.debug", "mode.release")

add_moduledirs("modules")

rule("autogen")
    set_extensions(".in")
    before_build_file(function (target, sourcefile, opt)
        import("utils.progress")
        import("core.project.depend")
        import("core.tool.compiler")
        import("autogen.foo", {always_build = true})

        local sourcefile_cx = path.join(target:autogendir(), "rules", "autogen", path.basename(sourcefile) .. ".cpp")
        local objectfile = target:objectfile(sourcefile_cx)
        table.insert(target:objectfiles(), objectfile)

        depend.on_changed(function ()
            progress.show(opt.progress, "${color.build.object}compiling.autogen %s", sourcefile)
            os.mkdir(path.directory(sourcefile_cx))
            foo.generate(sourcefile, sourcefile_cx)
            compiler.compile(sourcefile_cx, objectfile, {target = target})
        end, {dependfile = target:dependfile(objectfile),
              files = sourcefile,
              changed = target:is_rebuilt()})
    end)

target("test")
    set_kind("binary")
    add_rules("autogen")
    add_files("src/main.cpp")
    add_files("src/*.in")
```

完整例子见：[Native 模块自动生成](https://github.com/xmake-io/xmake/blob/dev/tests/projects/other/autogen/autogen_shared_module/xmake.lua)。

## Prepare 阶段生成

Xmake 3.x 之后，新增了 `on_prepare` 和 `on_prepare_files` 接口，实现两阶段编译。在 Prepare 阶段，可专门处理源码生成和预处理。

它会在所有 `on_build` 和 `on_build_files` 接口之前执行。

相关接口说明见文档：[Prepare 接口手册](/zh/api/description/project-target.html#on-prepare)。
