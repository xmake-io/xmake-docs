
Xmake 也支持 GO 程序的构建，也提供了空工程的创建命令支持:

```sh
$ xmake create -l go -t console test
```

<FileExplorer rootFilesDir="examples/other-languages/golang/basic" />

v2.3.6版本，xmake对其的构建支持做了一些改进，对go的交叉编译也进行了支持，例如我们可以在macOS和linux上编译windows程序：

```sh
$ xmake f -p windows -a x86
```

另外，新版本对go的第三方依赖包管理也进行了初步支持：

<FileExplorer rootFilesDir="examples/other-languages/golang/modules" />

不过还有一些不完善的地方，比如目前必须手动配置所有级联依赖包，会稍微繁琐些，后续有待改进。

更多例子见：[Go Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/go)
