
## 自动合并 target 库 {#auto-merge-target-libs}

2.5.8 之后，我们可以通过设置 `build.merge_archive` 策略，启用自动合并依赖的所有静态库，例如：

<FileExplorer rootFilesDir="examples/c/merge_archive/basic" />

mul 静态库自动合并了 add 和 sub 静态库，生成一个包含 add/sub 代码的完整 libmul.a 库。

这个合并相对比较稳定完善，支持 ar 和 msvc/lib.exe，也支持交叉编译工具链生成的静态库合并，也支持带有重名 obj 文件的静态库。

## 合并指定的静态库文件 {#merge-specific-static-libs}

如果自动合并不满足需求，我们也可以主动调用 `utils.archive.merge_archive` 模块在 `after_link` 阶段合并指定的静态库列表。

```lua
target("test")
    after_link(function (target)
        import("utils.archive.merge_staticlib")
        merge_staticlib(target, "libout.a", {"libfoo.a", "libbar.a"})
    end)
```

## 使用 add_files 合并静态库 {#using-add_files}

其实，我们之前的版本已经支持通过 `add_files("*.a")` 来合并静态库。

```lua
target("test")
    set_kind("binary")
    add_files("*.a")
    add_files("*.c")
```

相关 issues: [#1638](https://github.com/xmake-io/xmake/issues/1638)

