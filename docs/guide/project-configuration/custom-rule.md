---
outline: deep
---

# Custom Rules {#custom-rule}

Xmake not only natively supports multi-language file building, but also allows users to implement complex unknown file building through custom build rules. Custom rules let you define specialized build logic for specific file types.

## Basic Concepts {#basic-concepts}

Custom build rules are defined using the `rule()` function and associate a set of file extensions to rules through `set_extensions()`. Once these extensions are associated with rules, calls to `add_files()` will automatically use this custom rule.

## Creating Simple Rules {#create-simple-rule}

### Basic Syntax

```lua
rule("rulename")
    set_extensions(".ext1", ".ext2")
    on_build_file(function (target, sourcefile, opt)
        -- build logic
    end)
```

### Example: Markdown to HTML

```lua
-- Define a build rule for markdown files
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        import("core.project.depend")
        
        -- make sure build directory exists
        os.mkdir(target:targetdir())
        
        -- replace .md with .html
        local targetfile = path.join(target:targetdir(), path.basename(sourcefile) .. ".html")
        
        -- only rebuild if file has changed
        depend.on_changed(function ()
            -- call pandoc to convert markdown to html
            os.vrunv('pandoc', {"-s", "-f", "markdown", "-t", "html", "-o", targetfile, sourcefile})
        end, {files = sourcefile})
    end)

target("test")
    set_kind("object")
    add_rules("markdown")
    add_files("src/*.md")
```

## Applying Rules to Targets {#apply-rules-to-target}

### Method 1: Using add_rules()

```lua
target("test")
    set_kind("binary")
    add_rules("markdown")  -- apply markdown rule
    add_files("src/*.md")  -- automatically use markdown rule
```

### Method 2: Specifying in add_files

```lua
target("test")
    set_kind("binary")
    add_files("src/*.md", {rule = "markdown"})  -- specify rule for specific files
```

::: tip Note
Rules specified via `add_files("*.md", {rule = "markdown"})` have higher priority than rules set via `add_rules("markdown")`.
:::

## Rule Lifecycle {#rule-lifecycle}

Custom rules support the complete build lifecycle and can execute custom logic at different stages:

### Main Stages

- **on_load**: Executed when rule is loaded
- **on_config**: Executed after configuration is complete
- **before_build**: Executed before building
- **on_build**: Executed during building (overrides default build behavior)
- **after_build**: Executed after building
- **on_clean**: Executed during cleaning
- **on_package**: Executed during packaging
- **on_install**: Executed during installation

### Example: Complete Lifecycle

```lua
rule("custom")
    set_extensions(".custom")
    
    on_load(function (target)
        -- configuration when rule is loaded
        target:add("defines", "CUSTOM_RULE")
    end)
    
    before_build(function (target)
        -- preparation work before building
        print("Preparing to build custom files...")
    end)
    
    on_build_file(function (target, sourcefile, opt)
        -- process individual source files
        print("Building file:", sourcefile)
    end)
    
    after_build(function (target)
        -- cleanup work after building
        print("Custom build completed")
    end)
```

## File Processing Methods {#file-processing-methods}

### Single File Processing (on_build_file)

```lua
rule("single")
    set_extensions(".single")
    on_build_file(function (target, sourcefile, opt)
        -- process single file
        local targetfile = path.join(target:targetdir(), path.basename(sourcefile) .. ".out")
        os.cp(sourcefile, targetfile)
    end)
```

### Batch File Processing (on_build_files)

```lua
rule("batch")
    set_extensions(".batch")
    on_build_files(function (target, sourcebatch, opt)
        -- batch process multiple files
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            print("Processing file:", sourcefile)
        end
    end)
```

## Batch Command Mode {#batch-command-mode}

Using `on_buildcmd_file` and `on_buildcmd_files` can generate batch commands instead of directly executing builds:

```lua
rule("markdown")
    set_extensions(".md", ".markdown")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        -- ensure build directory exists
        batchcmds:mkdir(target:targetdir())
        
        -- generate target file path
        local targetfile = path.join(target:targetdir(), path.basename(sourcefile) .. ".html")
        
        -- add pandoc command
        batchcmds:vrunv('pandoc', {"-s", "-f", "markdown", "-t", "html", "-o", targetfile, sourcefile})
        
        -- add dependency files
        batchcmds:add_depfiles(sourcefile)
    end)
```

## Rule Dependencies {#rule-dependencies}

### Adding Rule Dependencies

```lua
rule("foo")
    add_deps("bar")  -- foo depends on bar rule

rule("bar")
    set_extensions(".bar")
    on_build_file(function (target, sourcefile, opt)
        -- bar rule build logic
    end)
```

### Controlling Execution Order

```lua
rule("foo")
    add_deps("bar", {order = true})  -- ensure bar executes before foo
    on_build_file(function (target, sourcefile, opt)
        -- foo rule build logic
    end)
```

## Common Interfaces {#common-interfaces}

### Setting File Extensions

```lua
rule("myrule")
    set_extensions(".ext1", ".ext2", ".ext3")
```

### Adding Import Modules

```lua
rule("myrule")
    add_imports("core.project.depend", "utils.progress")
    on_build_file(function (target, sourcefile, opt)
        -- can directly use depend and progress modules
    end)
```

### Getting Build Information

```lua
rule("myrule")
    on_build_file(function (target, sourcefile, opt)
        print("Target name:", target:name())
        print("Source file:", sourcefile)
        print("Build progress:", opt.progress)
        print("Target directory:", target:targetdir())
    end)
```

## Practical Examples {#practical-examples}

### Example 1: Resource File Processing

```lua
rule("resource")
    set_extensions(".rc", ".res")
    on_build_file(function (target, sourcefile, opt)
        import("core.project.depend")
        
        local targetfile = target:objectfile(sourcefile)
        depend.on_changed(function ()
            os.vrunv("windres", {sourcefile, "-o", targetfile})
        end, {files = sourcefile})
    end)
```

### Example 2: Protocol Buffer Compilation

```lua
rule("protobuf")
    set_extensions(".proto")
    on_build_file(function (target, sourcefile, opt)
        import("core.project.depend")
        
        local targetfile = path.join(target:autogendir(), path.basename(sourcefile) .. ".pb.cc")
        depend.on_changed(function ()
            os.vrunv("protoc", {"--cpp_out=" .. target:autogendir(), sourcefile})
        end, {files = sourcefile})
        
        -- add generated file to target
        target:add("files", targetfile)
    end)
```

## Best Practices {#best-practices}

1. **Use Dependency Checking**: Avoid unnecessary rebuilds through `depend.on_changed()`
2. **Error Handling**: Add appropriate error handling logic in rules
3. **Progress Display**: Use `opt.progress` to display build progress
4. **Modularization**: Break complex rules into multiple simple rules
5. **Documentation**: Add clear comments and documentation for custom rules

## More Information {#more-information}

- Complete API documentation: [Custom Rule API](/api/description/custom-rule)
- Built-in rules reference: [Built-in Rules](/api/description/builtin-rules)
- Rule examples: [Rule Examples](/examples/cpp/protobuf) 