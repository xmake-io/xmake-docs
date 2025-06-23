
Xmake also supports the construction of go programs, and also provides command support for creating empty projects:

```bash
$ xmake create -l go -t console test
```

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.go")
```

In v2.3.6 version, xmake has made some improvements to its build support, and also supports cross compilation of go. For example, we can compile windows programs on macOS and linux:

```bash
$ xmake f -p windows -a x86
```

In addition, the new version also initially supports the third-party dependency package management of go:

```lua
add_rules("mode.debug", "mode.release")

add_requires("go::github.com/sirupsen/logrus", {alias = "logrus"})
add_requires("go::golang.org/x/sys/internal/unsafeheader", {alias = "unsafeheader"})
if is_plat("windows") then
    add_requires("go::golang.org/x/sys/windows", {alias = "syshost"})
else
    add_requires("go::golang.org/x/sys/unix", {alias = "syshost"})
end

target("test")
    set_kind("binary")
    add_files("src/*.go")
    add_packages("logrus", "syshost", "unsafeheader")
```

However, there are still some imperfections. For example, all cascading dependency packages must be manually configured at present, which will be a bit more cumbersome and needs to be improved in the future.

For more examples, see: [Go Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/go)
