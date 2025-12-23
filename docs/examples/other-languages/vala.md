After 2.5.7 to support the construction of Vala programs, we need to apply the `add_rules("vala")` rule, and the glib package is necessary.

related issues: [#1618](https://github.com/xmake-io/xmake/issues/1618)

`add_values("vala.packages")` is used to tell valac which packages the project needs, it will introduce the vala api of the relevant package, but the dependency integration of the package still needs to be downloaded and integrated through `add_requires("lua")`.

## Console program

<FileExplorer rootFilesDir="examples/other-languages/vala/console" />

## Static library program

After v2.5.8, we continue to support the construction of library programs. The exported interface header file name can be set through `add_values("vala.header", "mymath.h")`, and through `add_values("vala.vapi", "mymath -1.0.vapi")` Set the name of the exported vapi file.

<FileExplorer rootFilesDir="examples/other-languages/vala/static_library" />

## Dynamic library program

<FileExplorer rootFilesDir="examples/other-languages/vala/shared_library" />

More examples: [Vala examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/vala)
