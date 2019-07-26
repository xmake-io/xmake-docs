
By including a dependency package directory and some binary library files in the project, it is convenient to integrate some third-party dependency libraries. This method is relatively simple and straightforward, but the disadvantages are also obvious and inconvenient to manage.

Take the tbox project as an example. The dependency package is as follows:

```
- base.pkg
- zlib.pkg
- polarssl.pkg
- openssl.pkg
- mysql.pkg
- pcre.pkg
- ...
```

If you want the current project to recognize loading these packages, you first need to specify the package directory path, for example:

```lua
add_packagedirs("packages")
```

Once specified, you can add integration package dependencies in the target scope via the [add_packages](/manual/project_target?id=targetadd_packages) interface, for example:

```lua
target("tbox")
    add_packages("zlib", "polarssl", "pcre", "mysql")
```

So how to generate a *.pkg package, if it is based on xmake project, the generation method is very simple, only need:

```console
$ cd tbox
$ xmake package
```

You can generate a tbox.pkg cross-platform package in the build directory for use by third-party projects. I can also directly set the output directory and compile and generate it into the other project, for example:

```console
$ cd tbox
$ xmake package -o ../test/packages
```

In this way, the test project can pass [add_packages](/manual/project_target?id=targetadd_packages) and [add_packagedirs](/manual/global_interfaces?id=add_packagedirs) to configure and use the tbox.pkg package.

For a detailed description of the built-in package, you can also refer to the following related article, which is described in detail: [Dependency package addition and automatic detection mechanism](https://tboox.org/cn/2016/08/06/add-package-and-autocheck/)

