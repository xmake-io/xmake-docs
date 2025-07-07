# 自动代码生成 {#autogen}

很多时候，我们需要在编译之前对代码做一些预处理和自动生成，然后将生成的代码参与到后续的编译中去。

而随着 Xmake 的不断迭代，对代码生成特性的支持也在不断更新和改进。目前支持以下几种方式。

## 最简单的方式

这种方式最为简单直接，只需要在构建之前生成代码后，强制通过 `add_files` 添加进来。

由于 add_files 默认不会添加不存在的文件，所以需要配置 `always_added = true` 去强制添加，即使文件当前还不存在。

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("$(builddir)/autogen.cpp", {always_added = true})
    before_build(function (target)
        io.writefile("$(builddir)/autogen.cpp", [[
#include <iostream>
using namespace std;
int main(int argc, char** argv) {
    cout << "hello world!" << endl;
    return 0;
}
        ]])
    end)
```

这种方式有很多的局限，很多场景下不太使用，但胜在比较简单。

## 依赖目标生成

有时候，我们生成代码，需要通过执行项目中某个目标程序来完成，这个时候我们需要通过下面的方式来实现。

```lua
add_rules("mode.debug", "mode.release")

rule("autogen")
    set_extensions(".in")
    before_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        local sourcefile_cx = path.join(target:autogendir(), "rules", "autogen", path.basename(sourcefile) .. ".cpp")
        local objectfile = target:objectfile(sourcefile_cx)
        table.insert(target:objectfiles(), objectfile)

        batchcmds:show_progress(opt.progress, "${color.build.object}compiling.autogen %s", sourcefile)
        batchcmds:mkdir(path.directory(sourcefile_cx))
        batchcmds:vrunv(target:dep("autogen"):targetfile(), {sourcefile, sourcefile_cx})
        batchcmds:compile(sourcefile_cx, objectfile)

        batchcmds:add_depfiles(sourcefile, target:dep("autogen"):targetfile())
        batchcmds:set_depmtime(os.mtime(objectfile))
        batchcmds:set_depcache(target:dependfile(objectfile))
    end)

target("autogen")
    set_default(false)
    set_kind("binary")
    set_plat(os.host()) ----- 生成当前主机平台程序
    set_arch(os.arch())
    add_files("src/autogen.cpp")
    set_languages("c++11")
    set_policy("build.fence", true) ----- 禁用源码间并行编译

target("test")
    set_kind("binary")
    add_deps("autogen")
    add_rules("autogen")
    add_files("src/main.cpp")
    add_files("src/*.in")
```

我们需要先配置一个 autogen 的目标程序，它是一个可以在当前编译平台能够运行的程序，因此需要配置 `set_plat(os.host())` 强制作为主机平台来编译。

另外，我们需要配置 `build.fence` 策略，禁用源码间并行编译，让 autogen 目标的源码总是优先编译完成，提前完成 autogen 可执行程序的生成。

然后，我们配置一个自定义规则，在构建之前，去调用 autogen 目标程序去生成源码，并直接将生成的源码编译出对象文件，插入到后续的链接中去。

完整例子见：[autogen_codedep](https://github.com/xmake-io/xmake/blob/dev/tests/projects/other/autogen/autogen_codedep/xmake.lua)

## 通过原生模块来生成

我们新增了原生模块开发的特性，通过这个特性，即使不通过定义额外的 autogen 目标程序，也可以通过原生模块来生成代码。

关于原生模块的开发，可以参考文档：[Native 模块开发](/zh/api/scripts/native-modules)。

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

Xmake 3.x 之后，我们新增了 `on_prepare` 和 `on_prepare_files` 接口，实现两阶段编译，在 Prepare 阶段，我们可以专门用于处理源码生成和预处理。

它会在所有的 `on_build` 和 `on_build_files` 接口之前被执行。

关于 Prepare 的相关接口说明，见文档：[Prepare 接口手册](/zh/api/description/project-target.html#on-prepare)。
