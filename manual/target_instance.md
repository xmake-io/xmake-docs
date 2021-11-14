
This page describes the interface for `target` of functions like `on_load()`, `before_build()` or `after_install()` of the [Project target](manual/project_target.md)

#### target:name

- Get the name of the target

#### target:get

- Get the values of the target by name

```lua
-- get the links
target:get("links")
-- get the defined macros
target:get("defines")
```

#### target:set

- Set the values of the target by name (If you just want to add values use [target:add](#targetadd))

```lua
-- set the links
target:set("links", "sdl2")
-- set the defined macros
target:set("defines", "SDL_MAIN_HANDLED")
```

#### target:add

- Add to the values of the target by name

```lua
-- add links
target:add("links", "sdl2")
-- add defined macros
target:add("defines", "SDL_MAIN_HANDLED")
```

#### target:kind

- Get the target program type

Corresponding to `set_kind` description domain interface settings. The main target types are: binary, static, shared, phony, object, headeronly.

#### target:targetfile

- Get the target file path

It is mainly used to obtain the output path of static, shared, and binary object program files.

```lua
os.cp(target:targetfile(), "/tmp/")
```

#### target:targetdir

- Get the output directory of the target file

That is, the storage directory corresponding to target:targetfile().

#### target:basename

- Get the base name of the target file

That is, `foo` in libfoo.a, foo.dll, foo.exe.

#### target:filename

- Get the target file name

The full file name of the target file, equivalent to `path.filename(target:targetfile())`.

#### target:installdir

- Get the installation directory of the target file

It is usually used to obtain the corresponding installation directory path in scripts such as after_install of `xmake install/uninstall`, which can be used for user-defined installation scripts.

#### target:autogendir

- Get auto-generated catalog

This is usually used in some custom rule scripts to store some target-specific automatically generated files, and the path is usually under `build/.gens/target`.

For example, when we are processing lex/yacc, some source code files are automatically generated, and they can be stored in this directory so that they can be processed later.

#### target:objectfile

- Get the object file path

Usually used in custom scripts to obtain the target file path corresponding to the source file, for example

```lua
local objectfile = target:objectfile(sourcefile)
```

#### target:sourcebatches

- Get all source files

It can get all the source files added by `add_files` and store them separately according to different source file types.

The approximate structure is as follows:

```lua
{
  "c++.build" = {
    objectfiles = {
      "build/.objs/test/macosx/x86_64/release/src/main.cpp.o"
    },
    rulename = "c++.build",
    sourcekind = "cxx",
    sourcefiles = {
      "src/main.cpp"
    },
    dependfiles = {
      "build/.deps/test/macosx/x86_64/release/src/main.cpp.o.d"
    }
  },
  "asm.build" = {
    objectfiles = {
      "build/.objs/test/macosx/x86_64/release/src/test.S.o"
    },
    rulename = "asm.build",
    sourcekind = "as",
    sourcefiles = {
      "src/test.S"
    },
    dependfiles = {
      "build/.deps/test/macosx/x86_64/release/src/test.S.o.d"
    }
  }
}
```

We can traverse to obtain and process each type of source file.

```lua
for _, sourcebatch in pairs(target:sourcebatches()) do
    local sourcekind = sourcebatch.sourcekind
    if sourcekind == "cc" or sourcekind == "cxx" or sourcekind == "as" then
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            - TODO
        end
    end
end
```

Where sourcekind is the type of each source file, cc is the c file type, cxx is the c++ source file, and as is the asm source file.

sourcebatch corresponds to each type of source file batch, corresponding to a batch of source files of the same type.

sourcebatch.sourcefiles is a list of source files, sourcebatch.objectfiles is a list of object files, and sourcebatch.rulename is the name of the corresponding rule.

#### target:objectfiles

- Get a list of all object files

Although `target:sourcebatches()` can also obtain all object files, they are classified according to the source file type and do not directly participate in the final link.

If we want to dynamically modify the final linked object file list, we can modify `target:objectfiles()`, which is an array list.

#### target:headerfiles

- Get a list of all header files

You can get a list of all header files set by the `add_headerfiles()` interface.

```lua
for _, headerfile in ipairs(target:headerfiles()) do
    - TODO
end
```


!> The document here is still in progress, please be patient, you can also speed up the update of the document by sponsoring or submiting pr
