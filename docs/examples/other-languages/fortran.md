
After v2.3.6, the gfortran compiler is supported to compile fortran projects. We can quickly create an empty project based on fortran by using the following command:

After v2.3.8, xmake also supports Intel Fortran Compiler, you only need to switch the toolchain: `xmake f --toolchain=ifort`

```sh
$ xmake create -l fortran -t console test
```

<FileExplorer rootFilesDir="examples/other-languages/fortran/basic" />

More code examples can be viewed here: [Fortran Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/fortran)
