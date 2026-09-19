---
outline: deep
---

# 自定义规则 {#custom-rule}

Xmake 不仅原生支持多语言文件的构建，还允许用户通过自定义构建规则实现复杂的未知文件构建。自定义规则可以让你为特定文件类型定义专门的构建逻辑。

关于自定义规则的完整描述域接口，请参阅[自定义规则 API](/zh/api/description/custom-rule)。xmake 内置的规则列表请参阅[内置规则参考](/zh/api/description/builtin-rules)。

## 基础概念 {#basic-concepts}

自定义构建规则使用 `rule()` 函数定义，通过 `set_extensions()` 将一组文件扩展名关联到规则。一旦这些扩展与规则相关联，对 `add_files()` 的调用将自动使用此自定义规则。

## 创建简单规则 {#create-simple-rule}

### 基本语法

```lua
rule("rulename")
    set_extensions(".ext1", ".ext2")
    on_build_file(function (target, sourcefile, opt)
        -- 构建逻辑
    end)
```

### 示例：Markdown 转 HTML

```lua
-- 定义 markdown 文件的构建规则
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        import("core.project.depend")
        
        -- 确保构建目录存在
        os.mkdir(target:targetdir())
        
        -- 将 .md 替换为 .html
        local targetfile = path.join(target:targetdir(), path.basename(sourcefile) .. ".html")
        
        -- 只在文件改变时重新构建
        depend.on_changed(function ()
            -- 调用 pandoc 将 markdown 转换为 html
            os.vrunv('pandoc', {"-s", "-f", "markdown", "-t", "html", "-o", targetfile, sourcefile})
        end, {dependfile = target:dependfile(targetfile), files = sourcefile})
    end)

target("test")
    set_kind("object")
    add_rules("markdown")
    add_files("src/*.md")
```

## 应用规则到目标 {#apply-rules-to-target}

### 方法一：使用 add_rules()

```lua
target("test")
    set_kind("binary")
    add_rules("markdown")  -- 应用 markdown 规则
    add_files("src/*.md")  -- 自动使用 markdown 规则处理
```

### 方法二：在 add_files 中指定

```lua
target("test")
    set_kind("binary")
    add_files("src/*.md", {rule = "markdown"})  -- 为特定文件指定规则
```

::: tip 注意
通过 `add_files("*.md", {rule = "markdown"})` 方式指定的规则，优先级高于 `add_rules("markdown")` 设置的规则。
:::

## 规则生命周期 {#rule-lifecycle}

自定义规则支持完整的构建生命周期，可以在不同阶段执行自定义逻辑：

### 主要阶段

- **on_load**: 规则加载时执行
- **on_config**: 配置完成后执行
- **before_build**: 构建前执行
- **on_build**: 构建时执行（覆盖默认构建行为）
- **after_build**: 构建后执行
- **on_clean**: 清理时执行
- **on_package**: 打包时执行
- **on_install**: 安装时执行

### 示例：完整生命周期

```lua
rule("custom")
    set_extensions(".custom")
    
    on_load(function (target)
        -- 规则加载时的配置
        target:add("defines", "CUSTOM_RULE")
    end)
    
    before_build(function (target)
        -- 构建前的准备工作
        print("准备构建自定义文件...")
    end)
    
    on_build_file(function (target, sourcefile, opt)
        -- 处理单个源文件
        print("构建文件:", sourcefile)
    end)
    
    after_build(function (target)
        -- 构建后的清理工作
        print("自定义构建完成")
    end)
```

## 文件处理方式 {#file-processing-methods}

### 单文件处理 (on_build_file)

```lua
rule("single")
    set_extensions(".single")
    on_build_file(function (target, sourcefile, opt)
        -- 处理单个文件
        local targetfile = path.join(target:targetdir(), path.basename(sourcefile) .. ".out")
        os.cp(sourcefile, targetfile)
    end)
```

### 批量文件处理 (on_build_files)

```lua
rule("batch")
    set_extensions(".batch")
    on_build_files(function (target, sourcebatch, opt)
        -- 批量处理多个文件
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            print("处理文件:", sourcefile)
        end
    end)
```

## 批处理命令模式 {#batch-command-mode}

使用 `on_buildcmd_file` 和 `on_buildcmd_files` 可以生成批处理命令，而不是直接执行构建：

```lua
rule("markdown")
    set_extensions(".md", ".markdown")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        -- 确保构建目录存在
        batchcmds:mkdir(target:targetdir())
        
        -- 生成目标文件路径
        local targetfile = path.join(target:targetdir(), path.basename(sourcefile) .. ".html")
        
        -- 添加 pandoc 命令
        batchcmds:vrunv('pandoc', {"-s", "-f", "markdown", "-t", "html", "-o", targetfile, sourcefile})
        
        -- 添加依赖文件
        batchcmds:add_depfiles(sourcefile)
    end)
```

## 生成的文件如何参与构建 {#generated-files}

规则产出的东西,按下面三种方式之一参与构建:

- **最终产物。** 把 markdown 转成 html、把资源打个包,文件写完就结束了。
- **需要被编译的源文件。** 规则自己用 `batchcmds:compile()` 把它编掉,再把 object 交给链接。
- **object 文件。** 规则把它加进目标参与链接的 object 列表。

后两种情况,在 `after_load` 里登记 object,让它从一开始就在构建计划里:

```lua
rule("myrule")
    set_extensions(".myext")

    after_load(function (target)
        local sourcebatch = target:sourcebatches()["myrule"]
        for _, sourcefile in ipairs(sourcebatch and sourcebatch.sourcefiles) do
            table.insert(target:objectfiles(), target:objectfile(sourcefile))
        end
    end)
```

## 规则依赖 {#rule-dependencies}

### 添加规则依赖

```lua
rule("foo")
    add_deps("bar")  -- foo 依赖 bar 规则

rule("bar")
    set_extensions(".bar")
    on_build_file(function (target, sourcefile, opt)
        -- bar 规则的构建逻辑
    end)
```

### 控制执行顺序

```lua
rule("foo")
    add_deps("bar", {order = true})  -- 确保 bar 在 foo 之前执行
    on_build_file(function (target, sourcefile, opt)
        -- foo 规则的构建逻辑
    end)
```

## 常用接口 {#common-interfaces}

### 设置文件扩展名

```lua
rule("myrule")
    set_extensions(".ext1", ".ext2", ".ext3")
```

### 添加导入模块

```lua
rule("myrule")
    add_imports("core.project.depend", "utils.progress")
    on_build_file(function (target, sourcefile, opt)
        -- 可以直接使用 depend 和 progress 模块
    end)
```

### 获取构建信息

```lua
rule("myrule")
    on_build_file(function (target, sourcefile, opt)
        print("目标名称:", target:name())
        print("源文件:", sourcefile)
        print("构建进度:", opt.progress)
        print("目标目录:", target:targetdir())
    end)
```

## 实际应用示例 {#practical-examples}

### 示例 1：资源文件处理

`windres` 直接把 `.rc` 编成 object,所以规则只要执行它、再把 object 登记上就行,
参考[生成的文件如何参与构建](#generated-files):

```lua
rule("resource")
    set_extensions(".rc")

    after_load(function (target)
        local sourcebatch = target:sourcebatches()["resource"]
        for _, sourcefile in ipairs(sourcebatch and sourcebatch.sourcefiles) do
            table.insert(target:objectfiles(), target:objectfile(sourcefile))
        end
    end)

    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        local objectfile = target:objectfile(sourcefile)
        batchcmds:show_progress(opt.progress, "${color.build.object}compiling.resource %s", sourcefile)
        batchcmds:mkdir(path.directory(objectfile))
        batchcmds:vrunv("windres", {sourcefile, "-o", objectfile})
        batchcmds:add_depfiles(sourcefile)
        batchcmds:set_depcache(target:dependfile(objectfile))
        batchcmds:set_depmtime(os.mtime(objectfile))
    end)
```

### 示例 2：协议缓冲区编译

`protoc` 生成的是 `.pb.cc`,所以这条规则比上一条多一步:它自己用 `batchcmds:compile()`
把生成的源文件编译掉。

```lua
rule("protobuf")
    add_deps("c++")
    set_extensions(".proto")

    after_load(function (target)
        local sourcebatch = target:sourcebatches()["protobuf"]
        for _, sourcefile_proto in ipairs(sourcebatch and sourcebatch.sourcefiles) do
            local sourcefile_cc = target:autogenfile(sourcefile_proto,
                {rootdir = path.join(target:autogendir(), "rules", "protobuf"),
                 filename = path.basename(sourcefile_proto) .. ".pb.cc"})

            -- 目标里的其他源文件要能 include 到生成的头文件
            target:add("includedirs", path.directory(sourcefile_cc))
            table.insert(target:objectfiles(), target:objectfile(sourcefile_cc))
        end
    end)

    on_buildcmd_file(function (target, batchcmds, sourcefile_proto, opt)
        local sourcefile_cc = target:autogenfile(sourcefile_proto,
            {rootdir = path.join(target:autogendir(), "rules", "protobuf"),
             filename = path.basename(sourcefile_proto) .. ".pb.cc"})
        local objectfile = target:objectfile(sourcefile_cc)

        batchcmds:show_progress(opt.progress, "${color.build.object}compiling.proto %s", sourcefile_proto)
        batchcmds:mkdir(path.directory(sourcefile_cc))
        batchcmds:vrunv("protoc", {"--cpp_out=" .. path.directory(sourcefile_cc),
                                   "-I", path.directory(sourcefile_proto), sourcefile_proto})
        batchcmds:compile(sourcefile_cc, objectfile)

        batchcmds:add_depfiles(sourcefile_proto)
        batchcmds:set_depcache(target:dependfile(objectfile))
        batchcmds:set_depmtime(os.mtime(objectfile))
    end)
```

::: tip 注意
protobuf 是内置支持的,工程里 `add_rules("protobuf.cpp")` 就够了,参考[内置规则](/zh/api/description/builtin-rules)。
上面这条规则是用来演示代码生成类规则的写法,不是用来替代它的。
:::

## 最佳实践 {#best-practices}

1. **优先用 `on_buildcmd_file`**: 它记录下来的命令会参与依赖检查,也能进入
   `xmake project -k compile_commands`,这些是 `on_build_file` 做不到的
2. **一定要记录依赖**: `batchcmds:add_depfiles()` 配 `set_depcache()`,或者
   `depend.on_changed({dependfile = target:dependfile(targetfile), ...})`,否则每次构建都会重跑
3. **在 `after_load` 里登记生成的 object**,参考[生成的文件如何参与构建](#generated-files)
4. **生成的文件放到 `target:autogendir()` 下**: `xmake clean` 认得这个目录,
   而且两个目标之间不会撞文件名
5. **先找找有没有内置规则**: protobuf、lex/yacc、qt、wdk 等等都已经有了,
   参考[内置规则](/zh/api/description/builtin-rules)

## 更多信息 {#more-information}

- 完整的 API 文档：[自定义规则 API](/zh/api/description/custom-rule)
- 内置规则参考：[内置规则](/zh/api/description/builtin-rules)
- 规则示例：[规则示例](/zh/examples/cpp/protobuf) 