
# core.language.language

Used to obtain information about the compiled language, generally used for the operation of code files.

## language.extensions

- Get a list of code suffixes for all languages

The results are as follows:

```lua
{
     [".c"] = cc
,    [".cc"] = cxx
,    [".cpp"] = cxx
,    [".m"] = mm
,    [".mm"] = mxx
,    [".swift"] = sc
,    [".go"] = gc
}
```

## language.targetkinds

- Get a list of target types in all languages

The results are as follows:

```lua
{
     binary = {"ld", "gcld", "dcld"}
,    static = {"ar", "gcar", "dcar"}
,    shared = {"sh", "dcsh"}
}
```

## language.sourcekinds

- Get a list of source file types in all languages

The results are as follows:

```lua
{
     cc = ".c"
,    cxx = {".cc", ".cpp", ".cxx"}
,    mm = ".m"
,    mxx = ".mm"
,    sc = ".swift"
,    gc = ".go"
,    rc = ".rs"
,    dc = ".d"
,    as = {".s", ".S", ".asm"}
}
```

## language.sourceflags

- Load a list of source file compilation option names for all languages

The results are as follows:

```lua
{
     cc = {"cflags", "cxflags"}
,    cxx = {"cxxflags", "cxflags"}
,    ...
}
```

## language.load

- Load the specified language

Load a specific language object from the language name, for example:

```lua
local lang = language.load("c++")
if lang then
    print(lang:name())
end
```

## language.load_sk

- Load the specified language from the source file type

Load specific language objects from the source file type: `cc, cxx, mm, mxx, sc, gc, as ..`, for example:

```lua
local lang = language.load_sk("cxx")
if lang then
    print(lang:name())
end
```

## language.load_ex

- Load the specified language from the source file suffix name

Load specific language objects from the source file extension: `.cc, .c, .cpp, .mm, .swift, .go ..`, for example:

```lua
local lang = language.load_ex(".cpp")
if lang then
    print(lang:name())
end
```

## language.sourcekind_of

- Get the source file type of the specified source file

That is, from a given source file path, get the type of source file it belongs to, for example:

```lua
print(language.sourcekind_of("/xxxx/test.cpp"))
```

The result is: `cxx`, which is the `c++` type. For the corresponding list, see: [language.sourcekinds](#language-sourcekinds)
