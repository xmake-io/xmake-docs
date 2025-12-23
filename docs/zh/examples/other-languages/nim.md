
v2.5.9 之后，我们新增了对 Nimlang 项目的支持，相关 issues 见：[#1756](https://github.com/xmake-io/xmake/issues/1756)

## 创建空工程 {#create-project}

我们可以使用 `xmake create` 命令创建空工程。

```sh
xmake create -l nim -t console test
xmake create -l nim -t static test
xmake create -l nim -t shared test
```

## 控制台程序 {#console}

<FileExplorer rootFilesDir="examples/other-languages/nim/console" />

```sh
$ xmake -v
[ 33%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache -o:b
uild/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

## 静态库程序 {#static-library}

<FileExplorer rootFilesDir="examples/other-languages/nim/static_library" />

```sh
$ xmake -v
[ 33%]: linking.release libfoo.a
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/foo/macosx/x86_64/release/nimcache --app
:staticlib --noMain --passC:-DNimMain=NimMain_B6D5BD02 --passC:-DNimMainInner=NimMainInner_B6D5B
D02 --passC:-DNimMainModule=NimMainModule_B6D5BD02 --passC:-DPreMain=PreMain_B6D5BD02 --passC:-D
PreMainInner=PreMainInner_B6D5BD02 -o:build/macosx/x86_64/release/libfoo.a src/foo.nim
[ 66%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache --pa
ssL:-Lbuild/macosx/x86_64/release --passL:-lfoo -o:build/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

## 动态库程序 {#shared-library}

<FileExplorer rootFilesDir="examples/other-languages/nim/shared_library" />

```sh
$ xmake -rv
[ 33%]: linking.release libfoo.dylib
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/foo/macosx/x86_64/release/nimcache --app
:lib --noMain -o:build/macosx/x86_64/release/libfoo.dylib src/foo.nim
[ 66%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache --pa
ssL:-Lbuild/macosx/x86_64/release --passL:-lfoo -o:build/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

## C 代码混合编译 {#mix-c}

<FileExplorer rootFilesDir="examples/other-languages/nim/mix_c" />

## Nimble 依赖包集成 {#nimble-package}

完整例子见：[Nimble Package Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/nim/nimble_package)

<FileExplorer rootFilesDir="examples/other-languages/nim/nimble_package" />

## Native 依赖包集成 {#native-package}

完整例子见：[Native Package Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/nim/native_package)

<FileExplorer rootFilesDir="examples/other-languages/nim/native_package" />
