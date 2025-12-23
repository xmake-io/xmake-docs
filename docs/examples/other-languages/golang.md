
Xmake also supports the construction of go programs, and also provides command support for creating empty projects:

```sh
$ xmake create -l go -t console test
```

<FileExplorer rootFilesDir="examples/other-languages/golang/basic" />

In v2.3.6 version, xmake has made some improvements to its build support, and also supports cross compilation of go. For example, we can compile windows programs on macOS and linux:

```sh
$ xmake f -p windows -a x86
```

In addition, the new version also initially supports the third-party dependency package management of go:

<FileExplorer rootFilesDir="examples/other-languages/golang/modules" />

However, there are still some imperfections. For example, all cascading dependency packages must be manually configured at present, which will be a bit more cumbersome and needs to be improved in the future.

For more examples, see: [Go Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/go)
