
If you feel that the above built-in package management method is very inconvenient, you can use the extension interface [lib.detect.find_package](/manual/extension_modules?id=detectfind_package) to find the system. Existing dependencies.

Currently this interface supports the following package management support:

* vcpkg
* homebrew
* pkg-config

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

If third-party tools such as `homebrew`, `pkg-config` are installed on the system, then this interface will try to use them to improve the search results.

Another, we can also find packages from the given package manager. For example:

```lua
find_packages("brew::pcre2/libpcre2-8", "vcpkg::zlib")
```

For a more complete description of the usage, please refer to the [find_packages](/manual/builtin_modules?id=find_packages) interface documentation.

## Homebrew Integration Support

Since homebrew is generally installed directly into the system, users do not need to do any integration work, `lib.detect.find_package` has been natively seamlessly supported.

## Vcpkg Integration Support

Currently xmake v2.2.2 version already supports vcpkg, users only need to install vcpkg, execute `$ vcpkg integrate install`, xmake will automatically detect the root path of vcpkg from the system, and then automatically adapt the bread.

Of course, we can also manually specify the root path of vcpkg to support:

```console
$ xmake f --vcpkg=f:\vcpkg
```

Or we can set it to the global configuration to avoid repeating the settings each time we switch configurations:

```console
$ xmake g --vcpkg=f:\vcpkg
```

