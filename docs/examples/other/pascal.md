
After 2.5.8, we can support the construction of Pascal programs. For related issues, see: [#388](https://github.com/xmake-io/xmake/issues/388)

## Console Program

```lua
add_rules("mode.debug", "mode.release")
target("test")
     set_kind("binary")
     add_files("src/*.pas")
```

## Dynamic library program

```lua
add_rules("mode.debug", "mode.release")
target("foo")
     set_kind("shared")
     add_files("src/foo.pas")

target("test")
     set_kind("binary")
     add_deps("foo")
     add_files("src/main.pas")
```

More examples: [Pascal examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/pascal)

