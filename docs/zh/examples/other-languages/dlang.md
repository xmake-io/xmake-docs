
创建空工程：

```sh
$ xmake create -l dlang -t console test
```

<FileExplorer rootFilesDir="examples/other-languages/dlang/basic" />

v2.3.6 版本开始，Xmake 增加了对dub包管理的支持，可以快速集成dlang的第三方依赖包：

<FileExplorer rootFilesDir="examples/other-languages/dlang/dub" />

不过还有一些不完善的地方，比如目前必须手动配置所有级联依赖包，会稍微繁琐些，后续有待改进。

更多例子见：[Dlang Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/dlang)
