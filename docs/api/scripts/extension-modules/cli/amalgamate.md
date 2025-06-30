# cli.amalgamate

- Merge into single source file

This is a small utility module for quickly merging all c/c++ and header sources inside a given target into a single source file.

The merge expands all the internal includes headers and generates a DAG, which is introduced by topological sorting.

By default it will handle the merge of all targets, for example:

```sh
$ xmake l cli.amalgamate
build/tbox.c generated!
build/tbox.h generated!
```

We can also specify the targets we need for the merge:

```sh
$ xmake l cli.amalgamate tbox
build/tbox.c generated!
build/tbox.h generated!
```

You can also handle symbol conflicts by specifying a custom unique ID macro definition for each source file you merge.

```sh
$ xmake l cli.amalgamate -u MY_UNIQUEU_ID
build/tbox.c generated!
build/tbox.h generated!
```

If there are renamed symbols in multiple source files, you can determine if the `MY_UNIQUEU_ID` macro is defined, and if it is, then it is in a single file, so you can handle the renamed symbols yourself in the source code.

```c
#ifdef MY_UNIQUEU_ID
    // do some thing
#endif
```

We can also specify the output location:

```sh
$ xmake l cli.amalgamate -o /xxx
/xxx/tbox.c generated!
/xxx/tbox.h generated!
```
