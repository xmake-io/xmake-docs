## Find System Package

If you feel that the above built-in package management method is very inconvenient, you can use the built-in interface `find_packages` provided by xmake.

And through the system and third-party package management tools for the installation of the dependency package, and then integrated with xmake, for example, we look for an openssl package:

```lua
local packages = find_packages("openssl", "zlib")
```

The returned results are as follows:

```lua
{
    {links = {"ssl", "crypto"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}},
    {links = {"z"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}}
}
```

If the search is successful, return a table containing all the package information, if it fails, return nil

The return result here can be directly passed as the parameter of `target:add`, `option:add`, which is used to dynamically increase the configuration of `target/option`:

```lua
option("zlib")
    set_showmenu(true)
    before_check(function (option)
        option:add(find_packages("openssl", "zlib"))
    end)
```

```lua
target("test")
    on_load(function (target)
        target:add(find_packages("openssl", "zlib"))
    end)
```

Currently this interface supports the following package management support:

* conan
* vcpkg
* homebrew
* pkg-config

If third-party tools such as `homebrew`, `pkg-config` are installed on the system, then this interface will try to use them to improve the search results.

For a more complete description of the usage, please refer to the [find_packages](/manual/builtin_modules?id=find_packages) interface documentation.

Of course, if you feel that integrating third-party dependencies by looking for packages is not enough, you can also directly integrate remote dependencies through `add_requires`. 
For details, see the documentation: [Using Remote Dependencies](/package/remote_package)

## Find homebrew package

Alternatively, we can also find the package from the manually specified package manager:

```lua
find_packages("brew::pcre2/libpcre2-8", "brew::x264")
```

We only need to add the `brew::` prefix, you can explicitly specify the package source from homebrew to find the package, if there are multiple pkgconfig files in `brew::pcre2`, for example: libpcre2-8.pc, libpcre2-16. Pc, libpcre2-32.pc

Then we can use `brew::pcre2/libpcre2-16` to select the link library information specified by the corresponding pkgconfig file.

Since homebrew is generally installed directly into the system, users do not need to do any integration work, `find_packages` has been natively seamlessly supported.

## Find vcpkg package

Currently xmake v2.2.2 version has already supported vcpkg, users only need to install vcpkg, execute `$ vcpkg integrate install`, xmake will automatically detect the root path of vcpkg from the system, and then automatically adapt the bread.

Of course, we can also manually specify the root path of vcpkg to support:

```console
$ xmake f --vcpkg=f:\vcpkg
```

Or we can set it to the global configuration to avoid repeating the settings each time the configuration is switched:

```console
$ xmake g --vcpkg=f:\vcpkg
```

Then, we can specify the dependency package in vcpkg by using the `vcpkg::` prefix:

```lua
find_packages("vcpkg::zlib", "vcpkg::openssl")
```

## Find the conan package

Xmake v2.2.6 and later versions also support finding the specified package from the conan:

```lua
find_packages("conan::OpenSSL/1.0.2n@conan/stable")
```

## Test command for finding package

We can use the following command to quickly detect the package information specified on the system:

```console
$ xmake l find_packages x264
{
   {
     Links = {
       "x264"
     },
     Linkdirs = {
       "/usr/local/Cellar/x264/r2699/lib"
     },
     Version = "0.148.2699 a5e06b9",
     Includeirs = {
       "/usr/local/Cellar/x264/r2699/include"
     }
   }
}
```

We can also add a third-party package manager prefix to test:

```console
xmake l find_packages conan::OpenSSL/1.0.2n@conan/stable
```

!> It should be noted that if the find_package command is executed in the project directory with xmake.lua, there will be a cache. If the search fails, the next lookup will also use the cached result. If you want to force a retest every time, Please switch to the non-project directory to execute the above command.
