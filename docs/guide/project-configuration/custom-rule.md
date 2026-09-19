---
outline: deep
---

# Custom Rules {#custom-rule}

Xmake not only natively supports multi-language file building, but also allows users to implement complex unknown file building through custom build rules. Custom rules let you define specialized build logic for specific file types.

For the complete custom rule description API, see [Custom Rule API](/api/description/custom-rule). For a list of built-in rules, see [Built-in Rules Reference](/api/description/builtin-rules).

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
        end, {dependfile = target:dependfile(targetfile), files = sourcefile})
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
    add_files("src/*.md", {rules = "markdown"})  -- specify rule for specific files
```

::: tip Note
Rules specified via `add_files("*.md", {rules = "markdown"})` have higher priority than rules set via `add_rules("markdown")`.
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

## Generated Files and the Link {#generated-files}

What a rule produces does not join the target on its own, and which step is missing
depends on what it produces:

- **The final artifact.** A rule which turns markdown into html, or packs some assets, is
  done once the file is written. Nothing else has to happen.
- **A source file which has to be compiled.** Generating it is only half of the work, the
  rule also has to compile it and hand the object to the link.
- **An object file.** It has to be added to the objects the target links.

For the last two, the object has to be known **before the build starts**:

```lua
rule("myrule")
    set_extensions(".myext")

    -- a file which is added during the build is never compiled, the build plan has
    -- already been made by then, so we register the object here
    after_load(function (target)
        local sourcebatch = target:sourcebatches()["myrule"]
        for _, sourcefile in ipairs(sourcebatch and sourcebatch.sourcefiles) do
            table.insert(target:objectfiles(), target:objectfile(sourcefile))
        end
    end)
```

::: warning NOTE
`target:add("files", ...)` inside `on_build_file` does not work. The file arrives too late
to be compiled, and the link then fails on a missing object file.
:::

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

### Example 1: Resource Files

`windres` compiles a `.rc` file straight into an object, so the rule only has to run it
and register the object, @see [Generated Files and the Link](#generated-files):

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

### Example 2: Protocol Buffer Compilation

`protoc` generates a `.pb.cc`, so this rule has one more step than the last one: it
compiles that source itself with `batchcmds:compile()`.

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

            -- the other sources of this target include the generated header
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

::: tip NOTE
Protobuf is supported out of the box, `add_rules("protobuf.cpp")` is all a project needs,
@see [Built-in Rules](/api/description/builtin-rules). The rule above is here to show the
shape of a code generator rule, not as a replacement for it.
:::

## Best Practices {#best-practices}

1. **Prefer `on_buildcmd_file`**: the commands it records take part in the dependency
   check and in `xmake project -k compile_commands`, which a plain `on_build_file` cannot do
2. **Always record the dependencies**: `batchcmds:add_depfiles()` and `set_depcache()`, or
   `depend.on_changed({dependfile = target:dependfile(targetfile), ...})`, otherwise the
   rule runs on every build
3. **Register the generated objects in `after_load`**, @see [Generated Files and the Link](#generated-files)
4. **Put the generated files under `target:autogendir()`**: `xmake clean` knows about it,
   and the file names of two targets cannot collide there
5. **Look for a built-in rule first**: protobuf, lex/yacc, qt, wdk and many others are
   already there, @see [Built-in Rules](/api/description/builtin-rules)

## More Information {#more-information}

- Complete API documentation: [Custom Rule API](/api/description/custom-rule)
- Built-in rules reference: [Built-in Rules](/api/description/builtin-rules)
- Rule examples: [Rule Examples](/examples/cpp/protobuf) 