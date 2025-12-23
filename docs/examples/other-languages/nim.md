After v2.5.9, we have added support for the Nimlang project. For related issues, see: [#1756](https://github.com/xmake-io/xmake/issues/1756)

## Create an empty project

We can use the `xmake create` command to create an empty project.

```sh
xmake create -l nim -t console test
xmake create -l nim -t static test
xmake create -l nim -t shared test
```

## Console Program

<FileExplorer rootFilesDir="examples/other-languages/nim/console" />

```sh
$ xmake -v
[33%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache -o:b
uild/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

## Static library program

<FileExplorer rootFilesDir="examples/other-languages/nim/static_library" />

```sh
$ xmake -v
[33%]: linking.release libfoo.a
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/foo/macosx/x86_64/release/nimcache --app
:staticlib --noMain --passC:-DNimMain=NimMain_B6D5BD02 --passC:-DNimMainInner=NimMainInner_B6D5B
D02 --passC:-DNimMainModule=NimMainModule_B6D5BD02 --passC:-DPreMain=PreMain_B6D5BD02 --passC:-D
PreMainInner=PreMainInner_B6D5BD02 -o:build/macosx/x86_64/release/libfoo.a src/foo.nim
[66%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache --pa
ssL:-Lbuild/macosx/x86_64/release --passL:-lfoo -o:build/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

## Dynamic library program

<FileExplorer rootFilesDir="examples/other-languages/nim/shared_library" />

```sh
$ xmake -rv
[33%]: linking.release libfoo.dylib
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/foo/macosx/x86_64/release/nimcache --app
:lib --noMain -o:build/macosx/x86_64/release/libfoo.dylib src/foo.nim
[66%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache --pa
ssL:-Lbuild/macosx/x86_64/release --passL:-lfoo -o:build/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

## C code mixed compilation

<FileExplorer rootFilesDir="examples/other-languages/nim/mix_c" />

## Nimble dependency package integration

For a complete example, see: [Nimble Package Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/nim/nimble_package)

<FileExplorer rootFilesDir="examples/other-languages/nim/nimble_package" />

## Native dependency package integration

For a complete example, see: [Native Package Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/nim/native_package)

<FileExplorer rootFilesDir="examples/other-languages/nim/native_package" />
