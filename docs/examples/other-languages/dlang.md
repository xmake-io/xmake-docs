
Create an empty project:

```sh
$ xmake create -l dlang -t console test
```

<FileExplorer rootFilesDir="examples/other-languages/dlang/basic" />

Starting from the v2.3.6 version, xmake adds support for dub package management, which can quickly integrate third-party dependency packages of dlang:

<FileExplorer rootFilesDir="examples/other-languages/dlang/dub" />

However, there are still some imperfections. For example, all cascading dependency packages must be manually configured at present, which will be a bit more cumbersome and needs to be improved in the future.

For more examples, see: [Dlang Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/dlang)
