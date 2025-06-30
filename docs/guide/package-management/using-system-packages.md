# Using System Packages

## Find using system packages

Xmake unifies the use of remote packages and system packages, and all use the `add_requires("zlib")` interface to describe the integration, and the default configuration method, it will first find the library from the system, if not, it will automatically download and install integrated.

And if we just want to find and use the system library and don't want to download it remotely, we can configure it like this:

```lua
add_requires("zlib", {system = true})

target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib")
```

Remote download can be forcibly disabled by `{system = true}`. At this time, it is equivalent to `find_package` of Xmake/CMake, but it is simpler and easier to use, and it is exactly the same as the use of remote packages.

By default, if the system library is not found, it will prompt failure. If the package is optional, you can additionally configure the `{optional = true}` option.

```lua
add_requires("zlib", {system = true, optional = true})
```

## Test command for finding package

We can use the following command to quickly detect the package information specified on the system:

```sh
$ xmake l find_package x264
{
     links = {
       "x264"
     },
     linkdirs = {
       "/usr/local/Cellar/x264/r2699/lib"
     },
     version = "0.148.2699 a5e06b9",
     includeirs = {
       "/usr/local/Cellar/x264/r2699/include"
     }
}
```

We can also add a third-party package manager prefix to test:

```sh
xmake l find_package conan::OpenSSL/1.0.2g
```

::: tip NOTE
It should be noted that if the find_package command is executed in the project directory with xmake.lua, there will be a cache. If the search fails, the next lookup will also use the cached result. If you want to force a retest every time, Please switch to the non-project directory to execute the above command.
:::
