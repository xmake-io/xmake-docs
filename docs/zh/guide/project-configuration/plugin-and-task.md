---
outline: deep
---

# 插件和任务 {#plugin-and-task}

Xmake 支持自定义任务和插件，它们都基于 `task` 任务系统实现。任务可以用于自动化构建流程、代码生成、文件处理等各种项目需求。

## 基础概念 {#basic-concepts}

- **任务 (Task)**: 自定义的构建步骤或工具，可以在项目中调用
- **插件 (Plugin)**: 特殊的任务，通常提供更复杂的功能，通过 `set_category("plugin")` 分类
- **菜单**: 通过 `set_menu()` 设置，让任务可以通过命令行直接调用

## 创建简单任务 {#create-simple-task}

### 基本语法

```lua
task("taskname")
    on_run(function ()
        -- 任务执行逻辑
        print("任务执行中...")
    end)
```

### 示例：Hello 任务

```lua
task("hello")
    on_run(function ()
        print("hello xmake!")
    end)
```

这个任务只能在 `xmake.lua` 中通过 `task.run()` 调用：

```lua
target("test")
    after_build(function (target)
        import("core.project.task")
        task.run("hello")
    end)
```

## 创建命令行任务 {#create-cli-task}

### 设置菜单

通过 `set_menu()` 可以让任务通过命令行直接调用：

```lua
task("echo")
    on_run(function ()
        import("core.base.option")
        
        -- 获取参数内容并显示
        local contents = option.get("contents") or {}
        local color = option.get("color") or "black"
        
        cprint("${%s}%s", color, table.concat(contents, " "))
    end)
    
    set_menu {
        usage = "xmake echo [options]",
        description = "显示指定信息",
        options = {
            {'c', "color", "kv", "black", "设置输出颜色"},
            {nil, "contents", "vs", nil, "要显示的内容"}
        }
    }
```

现在可以通过命令行调用：

```sh
$ xmake echo -c red hello xmake!
```

## 任务分类 {#task-categories}

### 设置任务分类

```lua
task("myplugin")
    set_category("plugin")  -- 分类为插件
    on_run(function ()
        print("这是一个插件")
    end)
```

分类说明：
- **plugin**: 显示在 "Plugins" 分组中
- **action**: 内置任务默认分类
- **自定义**: 可以设置任意分类名称

## 任务参数处理 {#task-parameters}

### 参数类型

```lua
task("example")
    on_run(function ()
        import("core.base.option")
        
        -- 获取不同类型的参数
        local verbose = option.get("verbose")        -- 布尔值
        local color = option.get("color")            -- 键值对
        local files = option.get("files")            -- 多值参数
        local args = {...}                           -- 可变参数
    end)
    
    set_menu {
        options = {
            {'v', "verbose", "k", nil, "启用详细输出"},           -- 布尔选项
            {'c', "color", "kv", "red", "设置颜色"},              -- 键值选项
            {'f', "files", "vs", nil, "文件列表"},                -- 多值选项
            {nil, "args", "vs", nil, "其他参数"}                  -- 可变参数
        }
    }
```

### 参数类型说明

- **k**: key-only，布尔值参数
- **kv**: key-value，键值对参数
- **v**: value，单值参数
- **vs**: values，多值参数

## 在项目中使用任务 {#using-tasks-in-project}

### 构建后执行任务

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    
    after_build(function (target)
        import("core.project.task")
        
        -- 构建完成后运行代码生成任务
        task.run("generate-code")
        
        -- 运行测试任务
        task.run("run-tests")
    end)
```

### 自定义构建任务

```lua
-- 代码生成任务
task("generate-code")
    on_run(function ()
        print("生成代码...")
        -- 执行代码生成逻辑
        os.exec("protoc --cpp_out=src proto/*.proto")
    end)

-- 测试任务
task("run-tests")
    on_run(function ()
        print("运行测试...")
        os.exec("xmake run test")
    end)
```

### 文件处理任务

```lua
task("process-assets")
    on_run(function ()
        import("core.base.option")
        
        local input_dir = option.get("input") or "assets"
        local output_dir = option.get("output") or "build/assets"
        
        -- 处理资源文件
        os.mkdir(output_dir)
        os.cp(path.join(input_dir, "*.png"), output_dir)
        os.cp(path.join(input_dir, "*.json"), output_dir)
        
        print("资源文件处理完成")
    end)
    
    set_menu {
        usage = "xmake process-assets [options]",
        description = "处理项目资源文件",
        options = {
            {'i', "input", "kv", "assets", "输入目录"},
            {'o', "output", "kv", "build/assets", "输出目录"}
        }
    }
```

## 复杂任务示例 {#complex-task-examples}

### 示例 1：代码格式化任务

```lua
task("format")
    on_run(function ()
        import("core.base.option")
        import("lib.detect.find_tool")
        
        local tool = find_tool("clang-format")
        if not tool then
            raise("clang-format not found!")
        end
        
        local files = option.get("files") or {"src/**/*.cpp", "src/**/*.h"}
        for _, pattern in ipairs(files) do
            local filelist = os.files(pattern)
            for _, file in ipairs(filelist) do
                os.execv(tool.program, {"-i", file})
                print("格式化文件:", file)
            end
        end
    end)
    
    set_menu {
        usage = "xmake format [options]",
        description = "格式化代码文件",
        options = {
            {'f', "files", "vs", nil, "要格式化的文件模式"}
        }
    }
```

### 示例 2：项目清理任务

```lua
task("clean-all")
    on_run(function ()
        local patterns = {
            "build/**",
            "*.log",
            "*.tmp",
            "*.o",
            "*.a",
            "*.so",
            "*.dylib",
            "*.exe"
        }
        
        for _, pattern in ipairs(patterns) do
            os.tryrm(pattern)
        end
        
        print("项目清理完成")
    end)
    
    set_menu {
        usage = "xmake clean-all",
        description = "清理所有构建文件和临时文件"
    }
```

## 任务调用方式 {#task-invocation}

### 1. 命令行调用

```sh
$ xmake taskname [options] [args...]
```

### 2. 脚本中调用

```lua
import("core.project.task")

-- 调用任务
task.run("taskname")

-- 传递参数
task.run("taskname", {option1 = "value1"}, "arg1", "arg2")
```

### 3. 在构建流程中调用

```lua
target("test")
    before_build(function (target)
        task.run("prepare")
    end)
    
    after_build(function (target)
        task.run("post-process")
    end)
```

## 最佳实践 {#best-practices}

1. **错误处理**: 使用 `pcall` 包装任务逻辑
2. **进度显示**: 使用 `progress.show()` 显示执行进度
3. **参数验证**: 检查必要参数是否存在
4. **模块化**: 复杂任务使用独立模块文件
5. **文档化**: 为任务添加清晰的描述和用法说明

## 更多信息 {#more-information}

- 完整的 API 文档：[插件任务 API](/zh/api/description/plugin-and-task)
- 内置任务参考：[内置插件](/zh/guide/extensions/builtin-plugins)
- 插件开发指南：[插件开发](/zh/guide/extensions/plugin-development) 