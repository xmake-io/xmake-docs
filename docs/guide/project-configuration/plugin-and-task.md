---
outline: deep
---

# Plugins and Tasks {#plugin-and-task}

Xmake supports custom tasks and plugins, both implemented using the `task` system. Tasks can be used for automating build processes, code generation, file processing, and various other project requirements.

## Basic Concepts {#basic-concepts}

- **Task**: Custom build steps or tools that can be called within projects
- **Plugin**: Special tasks that typically provide more complex functionality, categorized with `set_category("plugin")`
- **Menu**: Set via `set_menu()` to allow tasks to be called directly from the command line

## Creating Simple Tasks {#create-simple-task}

### Basic Syntax

```lua
task("taskname")
    on_run(function ()
        -- task execution logic
        print("Task executing...")
    end)
```

### Example: Hello Task

```lua
task("hello")
    on_run(function ()
        print("hello xmake!")
    end)
```

This task can only be called via `task.run()` in `xmake.lua`:

```lua
target("test")
    after_build(function (target)
        import("core.project.task")
        task.run("hello")
    end)
```

## Creating Command Line Tasks {#create-cli-task}

### Setting Menu

Use `set_menu()` to allow tasks to be called directly from the command line:

```lua
task("echo")
    on_run(function ()
        import("core.base.option")
        
        -- get parameter content and display
        local contents = option.get("contents") or {}
        local color = option.get("color") or "black"
        
        cprint("${%s}%s", color, table.concat(contents, " "))
    end)
    
    set_menu {
        usage = "xmake echo [options]",
        description = "Display specified information",
        options = {
            {'c', "color", "kv", "black", "Set output color"},
            {nil, "contents", "vs", nil, "Content to display"}
        }
    }
```

Now you can call it from the command line:

```sh
$ xmake echo -c red hello xmake!
```

## Task Categories {#task-categories}

### Setting Task Categories

```lua
task("myplugin")
    set_category("plugin")  -- categorize as plugin
    on_run(function ()
        print("This is a plugin")
    end)
```

Category descriptions:
- **plugin**: Displayed in "Plugins" group
- **action**: Default category for built-in tasks
- **custom**: Can set any custom category name

## Task Parameter Handling {#task-parameters}

### Parameter Types

```lua
task("example")
    on_run(function ()
        import("core.base.option")
        
        -- get different types of parameters
        local verbose = option.get("verbose")        -- boolean
        local color = option.get("color")            -- key-value
        local files = option.get("files")            -- multiple values
        local args = {...}                           -- variable arguments
    end)
    
    set_menu {
        options = {
            {'v', "verbose", "k", nil, "Enable verbose output"},           -- boolean option
            {'c', "color", "kv", "red", "Set color"},                      -- key-value option
            {'f', "files", "vs", nil, "File list"},                        -- multiple values option
            {nil, "args", "vs", nil, "Other arguments"}                    -- variable arguments
        }
    }
```

### Parameter Type Descriptions

- **k**: key-only, boolean parameter
- **kv**: key-value, key-value pair parameter
- **v**: value, single value parameter
- **vs**: values, multiple values parameter

## Using Tasks in Projects {#using-tasks-in-project}

### Execute Tasks After Build

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    
    after_build(function (target)
        import("core.project.task")
        
        -- run code generation task after build
        task.run("generate-code")
        
        -- run test task
        task.run("run-tests")
    end)
```

### Custom Build Tasks

```lua
-- code generation task
task("generate-code")
    on_run(function ()
        print("Generating code...")
        -- execute code generation logic
        os.exec("protoc --cpp_out=src proto/*.proto")
    end)

-- test task
task("run-tests")
    on_run(function ()
        print("Running tests...")
        os.exec("xmake run test")
    end)
```

### File Processing Tasks

```lua
task("process-assets")
    on_run(function ()
        import("core.base.option")
        
        local input_dir = option.get("input") or "assets"
        local output_dir = option.get("output") or "build/assets"
        
        -- process resource files
        os.mkdir(output_dir)
        os.cp(path.join(input_dir, "*.png"), output_dir)
        os.cp(path.join(input_dir, "*.json"), output_dir)
        
        print("Resource file processing completed")
    end)
    
    set_menu {
        usage = "xmake process-assets [options]",
        description = "Process project resource files",
        options = {
            {'i', "input", "kv", "assets", "Input directory"},
            {'o', "output", "kv", "build/assets", "Output directory"}
        }
    }
```

## Complex Task Examples {#complex-task-examples}

### Example 1: Code Formatting Task

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
                print("Formatting file:", file)
            end
        end
    end)
    
    set_menu {
        usage = "xmake format [options]",
        description = "Format code files",
        options = {
            {'f', "files", "vs", nil, "File patterns to format"}
        }
    }
```

### Example 2: Project Cleanup Task

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
        
        print("Project cleanup completed")
    end)
    
    set_menu {
        usage = "xmake clean-all",
        description = "Clean all build files and temporary files"
    }
```

## Task Invocation Methods {#task-invocation}

### 1. Command Line Invocation

```sh
$ xmake taskname [options] [args...]
```

### 2. Script Invocation

```lua
import("core.project.task")

-- call task
task.run("taskname")

-- pass parameters
task.run("taskname", {option1 = "value1"}, "arg1", "arg2")
```

### 3. Invocation in Build Process

```lua
target("test")
    before_build(function (target)
        task.run("prepare")
    end)
    
    after_build(function (target)
        task.run("post-process")
    end)
```

## Best Practices {#best-practices}

1. **Error Handling**: Use `pcall` to wrap task logic
2. **Progress Display**: Use `progress.show()` to display execution progress
3. **Parameter Validation**: Check if required parameters exist
4. **Modularization**: Use separate module files for complex tasks
5. **Documentation**: Add clear descriptions and usage instructions for tasks

## More Information {#more-information}

- Complete API documentation: [Plugin and Task API](/api/description/plugin-and-task)
- Built-in task reference: [Built-in Plugins](/guide/extensions/builtin-plugins)
- Plugin development guide: [Plugin Development](/guide/extensions/plugin-development) 