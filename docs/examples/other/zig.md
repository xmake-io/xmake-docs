
Create an empty project:

```bash
$ xmake create -l zig -t console test
```

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

target("test")
     set_kind("binary")
     add_files("src/*.zig")
```

For more examples, see: [Zig Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/zig)
