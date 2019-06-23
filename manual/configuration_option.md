
Define and set option switches. Each `option` corresponds to an option that can be used to customize the build configuration options and switch settings.

<p class="tip">
All domain interfaces except `target`, such as `option`, `task`, etc., cannot be placed in the outer global scope by default (unless some interfaces are shared with the target).
If you want to set the value to affect all options such as `option`, `task`, you can set it by anonymous global domain.
</p>

E.g:

```lua
-- Enter the anonymous global domain of the option, the settings inside will affect the test and test2 options.
option()
    add_defines("DEBUG")

option("test")
    -- ...
    -- Try to keep indented, because all settings after this are for the test option.

option("test2")
    -- ...
```

<p class="tip">
The `option` field can be repeatedly entered to implement separate settings. If you want to display the scope settings away from the current option, you can manually call the [option_end](#option_end) interface.
</p>


| Interface                                             | Description                                       | Supported Versions |
| ----------------------------------------------------- | --------------------------------------------      | --------           |
| [option](#option)                                     | Define Options                                    | >= 2.0.1           |
| [option_end](#option_end)                             | End Definition Options                            | >= 2.1.1           |
| [add_deps](#optionadd_deps)                           | Add Options Dependencies                          | >= 2.1.5           |
| [before_check](#optionbefore_check)                   | Execute this script before option detection       | >= 2.1.5           |
| [on_check](#optionon_check)                           | Custom Option Detection Script                    | >= 2.1.5           |
| [after_check](#optionafter_check)                     | Execute this script after option detection        | >= 2.1.5           |
| [set_values](#optionset_values)                       | Setting the list of option values ​​    | >= 2.1.9           |
| [set_default](#optionset_default)                     | Set Defaults                                      | >= 2.0.1           |
| [set_showmenu](#optionset_showmenu)                   | Set whether to enable menu display                | >= 1.0.1           |
| [set_category](#optionset_category)                   | Set option categories, only for menu display      | >= 1.0.1           |
| [set_description](#optionset_description)             | Settings Menu Display Description                 | >= 1.0.1           |
| [add_links](#optionadd_links)                         | Add Linked Library Detection                      | >= 1.0.1           |
| [add_linkdirs](#optionadd_linkdirs)                   | Add a search directory for link library detection | >= 1.0.1           |
| [add_rpathdirs](#optionadd_rpathdirs)                 | Add runtime dynamic link library search directory | >= 2.1.3           |
| [add_cincludes](#optionadd_cincludes)                 | Add c header file detection                       | >= 1.0.1           |
| [add_cxxincludes](#optionadd_cxxincludes)             | Add c++ header file detection                     | >= 1.0.1           |
| [add_ctypes](#optionadd_ctypes)                       | Add c type detection                              | >= 1.0.1           |
| [add_cxxtypes](#optionadd_cxxtypes)                   | Add c++ type detection                            | >= 1.0.1           |
| [add_csnippet](#optionadd_csnippet)                   | Add c-code snippets detection                     | >= 2.1.5           |
| [add_cxxsnippet](#optionadd_cxxsnippet)               | Add c++ code snippet detection                    | >= 2.1.5           |
| [set_warnings](#targetset_warnings)                   | Setting the warning level                         | >= 1.0.1           |
| [set_optimize](#targetset_optimize)                   | Setting the optimization level                    | >= 1.0.1           |
| [set_languages](#targetset_languages)                 | Setting the Code Language Standard                | >= 1.0.1           |
| [add_includedirs](#targetadd_includedirs)             | Add Header Search Directory                       | >= 1.0.1           |
| [add_defines](#targetadd_defines)                     | Add Macro Definition                              | >= 1.0.1           |
| [add_undefines](#targetadd_undefines)                 | Cancel Macro Definition                           | >= 1.0.1           |
| [add_defines_h](#targetadd_defines_h)                 | Add macro definitions to header files             | >= 1.0.1           |
| [add_undefines_h](#targetadd_undefines_h)             | Cancel macro definition to header file            | >= 1.0.1           |
| [add_cflags](#targetadd_cflags)                       | Add c Compile Options                             | >= 1.0.1           |
| [add_cxflags](#targetadd_cxflags)                     | Add c/c++ Compile Options                         | >= 1.0.1           |
| [add_cxxflags](#targetadd_cxxflags)                   | Add c++ Compile Options                           | >= 1.0.1           |
| [add_mflags](#targetadd_mflags)                       | Add objc compile options                          | >= 2.0.1           |
| [add_mxflags](#targetadd_mxflags)                     | Add objc/objc++ Compile Options                   | >= 2.0.1           |
| [add_mxxflags](#targetadd_mxxflags)                   | Add objc++ Compile Options                        | >= 2.0.1           |
| [add_scflags](#targetadd_scflags)                     | Add swift compile options                         | >= 2.1.1           |
| [add_asflags](#targetadd_asflags)                     | Add assembly compile options                      | >= 2.1.1           |
| [add_gcflags](#targetadd_gcflags)                     | Add go compile options                            | >= 2.1.1           |
| [add_dcflags](#targetadd_dcflags)                     | Add dlang compile options                         | >= 2.1.1           |
| [add_rcflags](#targetadd_rcflags)                     | Add rust compile option                           | >= 2.1.1           |
| [add_cuflags](#targetadd_cuflags)                     | Add cuda compile options                          | >= 2.2.1           |
| [add_culdflags](#targetadd_culdflags)                 | Add cuda device-link options                      | >= 2.2.7           |
| [add_ldflags](#targetadd_ldflags)                     | Add Link Options                                  | >= 2.1.1           |
| [add_arflags](#targetadd_arflags)                     | Add Static Library Archive Options                | >= 2.1.1           |
| [add_shflags](#targetadd_shflags)                     | Add Dynamic Library Link Options                  | >= 2.0.1           |
| [add_cfuncs](#targetadd_cfuncs)                       | Add c library function detection                  | >= 1.0.1           |
| [add_cxxfuncs](#targetadd_cxxfuncs)                   | Add C++ Library Function Interface                | >= 1.0.1           |
| [add_languages](#targetadd_languages)                 | Add Language Standards                            | >= 2.0.1           |
| [add_vectorexts](#targetadd_vectorexts)               | Add Vector Extension Instructions                 | >= 2.0.1           |
| [add_frameworks](#targetadd_frameworks)               | Add Linked Framework                              | >= 2.1.1           |
| [add_frameworkdirs](#targetadd_frameworkdirs)         | Add Linked Framework                              | >= 2.1.5           |

### option

#### Defining options

Define and set option switches for custom compilation configuration options, switch settings.

For example, define an option to enable test:

```lua
option("test")
    set_default(false)
    set_showmenu(true)
    add_defines("TEST")
```

Then associate it with the specified target:

```lua
target("demo")
    add_options("test")
```

Thus, if an option is defined, if this option is enabled, the macro definition of `-DTEST` will be automatically added when compiling the target.

```lua
# Manually enable this option
$ xmake f --test=y
$ xmake
```

### option_end

#### End definition option

This is an optional api that shows the departure option scope, similar to [target_end](#target_end).

### option:add_deps

#### Adding options depends

By setting the dependency, you can adjust the detection order of the options, which is generally used when the detection script is called by [on_check](#optionon_check).

```lua
option("small")
    set_default(true)
    on_check(function (option)
        -- ...
    end)

option("test")
    add_deps("small")
    set_default(true)
    on_check(function (option)
        if option:dep("small"):enabled() then
            option:enable(false)
        end
    end)
```

After the detection of the dependent small option is completed, the state of the option of the test is controlled by judging the state of the small option.

### option:before_check

Execute this script before option detection

For example: before testing, find the package by [find_package](#detect-find_package), and add information such as `links`, `includedirs` and `linkdirs` to the option.
Then start the option detection, and then automatically link to the target after passing.

```lua
option("zlib")
    before_check(function (option)
        import("lib.detect.find_package")
        option:add(find_package("zlib"))
    end)
```

### option:on_check

#### Custom Option Detection Script

This script overrides the built-in option detection logic.

```lua
option("test")
    add_deps("small")
    set_default(true)
    on_check(function (option)
        if option:dep("small"):enabled() then
            option:enable(false)
        end
    end)
```

If the option that test depends on passes, disable the test option.

### option:after_check

Execute this script after option detection

After the option detection is complete, execute this script for some post-processing, or you can re-disable the option at this time:

```lua
option("test")
    add_deps("small")
    add_links("pthread")
    after_check(function (option)
        option:enable(false)
    end)
```

### option:set_values

#### Setting the list of option values

For the graphical menu configuration of `xmake f --menu` only, a list of option values ​​is provided for quick selection by the user, for example:

```lua
option("test")
    set_default("b")
    set_showmenu(true)
    set_values("a", "b", "c")
```

The effect chart is as follows:

<img src="/assets/img/manual/option_set_values.png" width="60%" />

### option:set_default

#### Setting options defaults

When the option value is not modified by the command `xmake f --option=[y|n}`, the option itself has a default value, which can be set through this interface:

```lua
option("test")
    -- This option is disabled by default
    set_default(false)
```

The value of the option supports not only the boolean type but also the string type, for example:

```lua
option("test")
    set_default("value")
```

| Value Type | Description                                                     | Configuration                                   |
| ------     | --------------------------------------                          | ----------------------------------------------- |
| boolean    | Typically used as a parameter switch, value range: `true/false` | `xmake f --optionname=[y/n/yes/no/true/false]`  |
| string     | can be any string, generally used for pattern judgment          | `xmake f --optionname=value`                    |

If it is an option of the `boolean` value, it can be judged by [is_option](#is_option), and the option is enabled.

If it is an option of type `string`, it can be used directly in built-in variables, for example:

```lua
-- Define a path configuration option, using the temporary directory by default
option("rootdir")
    set_default("$(tmpdir)")Set_showmenu(true)

target("test")
    -- Add source files in the specified options directory
    add_files("$(rootdir)/*.c")
```

Among them, `$(rootdir)` is a custom option built-in variable, which can be dynamically modified by manual configuration:

```bash
$ xmake f --rootdir=~/projectdir/src
$ xmake
```

Specify a different source directory path for this `rootdir` option and compile it.

Detection behavior of the option:

| default value | detection behavior |
| ----------    | --------------------------------------------------------------------------------------------- |
| No setting    | Priority manual configuration modification, disabled by default, otherwise automatic detection, can automatically switch boolean and string type according to the type of value manually passed in |
| false         | switch option, not automatic detection, disabled by default, can be manually configured to modify |
| true          | switch option, not automatic detection, enabled by default, can be manually configured to modify |
| string type   | no switch state, no automatic detection, can be manually configured and modified, generally used for configuration variable transfer |

### option:set_showmenu

#### Set whether to enable menu display

If set to `true`, then this option will appear in `xmake f --help`, which can also be configured via `xmake f --optionname=xxx`, otherwise it can only be used inside `xmake.lua` , the modification cannot be configured manually.

```lua
option("test")
    set_showmenu(true)
```

After setting the menu to enable, execute `xmake f --help` to see that there is one more item in the help menu:

```
Options:
    ...

    --test=TEST
```

### option:set_category

#### Setting option categories, only for menu display

This is an optional configuration, only used in the help menu, the classification display options, the same category of options, will be displayed in the same group, so the menu looks more beautiful.

E.g:

```lua
option("test1")
    set_showmenu(true)
    set_category("test")

option("test2")
    set_showmenu(true)
    set_category("test")

option("demo1")
    set_showmenu(true)
    set_category("demo")

option("demo2")
    set_showmenu(true)
    set_category("demo")
```

The four options here are grouped into two groups: `test` and `demo`, and the layout shown is similar to this:

```bash
Options:
    ...

    --test1=TEST1
    --test2=TEST2

    --demo1=DEMO1
    --demo2=DEMO2
```

This interface is just to adjust the display layout, more beautiful, no other use.

In version 2.1.9, the hierarchical path name `set_category("root/submenu/submenu2")` can be set via category to configure the graphical menu interface of `xmake f --menu`, for example:

```lua
-- 'boolean' option
option("test1")
    set_default(true)
    set_showmenu(true)
    set_category("root menu/test1")

-- 'choice' option with values: "a", "b", "c"
option("test2")
    set_default("a")
    set_values("a", "b", "c")
    set_showmenu(true)
    set_category("root menu/test2")

-- 'string' option
option("test3")
    set_default("xx")
    set_showmenu(true)
    set_category("root menu/test3/test3")

-- 'number' option
option("test4")
    set_default(6)
    set_showmenu(true)
    set_category("root menu/test4")
```

The menu interface path structure finally displayed in the above configuration:

- root menu
  - test1
  - test2
  - test3
    - test3
  - test4

The effect chart is as follows:

<img src="/assets/img/manual/option_set_category.gif" width="60%" />

### option:set_description

#### Setting menu display description

When the option menu is displayed, the description on the right is used to help the user know more clearly about the purpose of this option, for example:

```lua
option("test")
    set_default(false)
    set_showmenu(true)
    set_description("Enable or disable test")
```

The generated menu contents are as follows:

```
Options:
    ...

    --test=TEST Enable or disable test (default: false)
```

This interface also supports multi-line display and outputs more detailed description information, such as:

```lua
option("mode")
    set_default("debug")
    set_showmenu(true)
    set_description("Set build mode",
                    " - debug",
                    " - release",
                    "-profile")
```

The generated menu contents are as follows:

```
Options:
    ...

    --mode=MODE Set build mode (default: debug)
                                          - debug
                                          - release
                                          - profile
```

When you see this menu, the user can clearly know the specific use of the defined `mode` option and how to use it:

```bash
$ xmake f --mode=release
```

### option:add_bindings

#### Add forward association option, sync enable and disable

<p class="tip">
After the 2.1.5 version has been deprecated, please use [add_deps](#optionadd_deps), [on_check](#optionon_check), [after_check](#optionafter_check) and other interfaces instead.
</p>

Bind association options, for example I want to configure a `smallest` parameter on the command line: `xmake f --smallest=y`

At this time, it is necessary to disable multiple other option switches at the same time to prohibit compiling multiple modules. This is the requirement, which is equivalent to the linkage between one option and other options.

This interface is used to set some association options that need to be forward bound, for example:

```lua
-- Define option switches: --smallest=y|n
option("smallest")

    -- Add forward binding. If smallest is enabled, all of the following option switches will also be enabled synchronously.
    add_bindings("nozip", "noxml", "nojson")
```

### option:add_rbindings

#### Add reverse association option, sync enable and disable

<p class="tip">
After the 2.1.5 version has been deprecated, please use [add_deps](#optionadd_deps), [on_check](#optionon_check), [after_check](#optionafter_check) and other interfaces instead.
</p>

Reverse binding association options, the switch state of the associated option is reversed.

```lua
-- Define option switches: --smallest=y|n
option("smallest")

    -- Add reverse binding, if smallest is enabled, all modules below are disabled
    add_rbindings("xml", "zip", "asio", "regex", "object", "thread", "network", "charset", "database")
    add_rbindings("zlib", "mysql", "sqlite3", "openssl", "polarssl", "pcre2", "pcre", "base")
```

<p class="warn">
It should be noted that the command line configuration is sequential. You can disable all modules by enabling smallest and then add other options to enable them one by one.
</p>

E.g:

```bash
-- disable all modules and then only enable xml and zip modules
$ xmake f --smallest=y --xml=y --zip=y
```

### option:add_links

#### Add Link Library Detection

If the specified link library is passed, this option will be enabled and the associated target will automatically be added to this link, for example:

```lua
option("pthread")
    set_default(false)
    add_links("pthread")
    add_linkdirs("/usr/local/lib")

target("test")
    add_options("pthread")
```

If the test passes, the `test` target will be automatically added when it is compiled: `-L/usr/local/lib -lpthread` compile option


### option:add_linkdirs

#### Adding the search directory needed for link library detection

This is optional. Generally, the system library does not need to add this, and it can also pass the test. If it is not found, you can add the search directory yourself to improve the detection pass rate. For details, see: [add_links](#optionadd_links)

### optiOn:add_rpathdirs

#### Adding a load search directory for a dynamic library at runtime

After the option passes the detection, it will be automatically added to the corresponding target. For details, see: [target.add_rpathdirs](#targetadd_rpathdirs).

### option:add_cincludes

#### Add c header file detection

This option will be enabled if the c header file is passed, for example:

```lua
option("pthread")
    set_default(false)
    add_cincludes("pthread.h")
    add_defines("ENABLE_PTHREAD")

target("test")
    add_options("pthread")
```

This option checks if there is a `pthread.h` header file. If the test passes, then the `test` target program will add the macro definition of `ENABLE_PTHREAD`.

If you want more flexible detection, you can do this in [option.on_check](#optionon_check) via [lib.detect.has_cincludes](#detect-has_cincludes).

### option:add_cxxincludes

#### Add c++ header file detection

Similar to [add_cincludes](#optionadd_cincludes), except that the detected header file type is a c++ header file.

### option:add_ctypes

#### Add c type detection

This option will be enabled if the c type is passed, for example:

```lua
option("wchar")
    set_default(false)
    add_cincludes("wchar_t")
    add_defines("HAVE_WCHAR")

target("test")
    add_options("wchar")
```

This option checks if there is a type of `wchar_t`. If the test passes, then the `test` target program will add the macro definition of `HAVE_WCHAR`.

If you want more flexible detection, you can do this in [option.on_check](#optionon_check) via [lib.detect.has_ctypes](#detect-has_ctypes).

### option:add_cxxtypes

#### Adding c++ type detection

Similar to [add_ctypes](#optionadd_ctypes), except that the type detected is a c++ type.

### option:add_csnippet

#### Add c code fragment detection

If the existing [add_ctypes](#optionadd_ctypes), [add_cfuncs](#optionadd_cfuncs), etc. cannot meet the current detection requirements,
You can use this interface to implement more custom detection of some compiler feature detection, see: [add_cxxsnippet](#optionadd_cxxsnippet).

### option:add_cxxsnippet

#### Adding c++ code snippet detection

This interface can be used to implement more custom detection of some compiler feature detection, especially the detection support of various features of C++, such as:

```lua
option("constexpr")
    add_cxxsnippet("constexpr", "constexpr int f(int x) { int sum=0; for (int i=0; i<=x; ++i) sum += i; return sum; } constexpr int x = f (5); static_assert(x == 15);")
```

The first parameter sets the name of the code snippet as a label, and is displayed when the output information is detected.

The above code implements the detection of the constexpr feature of C++. If the test passes, the constexpr option is enabled. Of course, this is just an example.

For the detection of compiler features, there is a more convenient and efficient detection module, providing more powerful detection support, see: [compiler.has_features](#compiler-has_features) and [detect.check_cxsnippets](#detect-check_cxsnippets)

If you want more flexible detection, you can do this in [option.on_check](#optionon_check) via [lib.detect.check_cxsnippets](#detect-check_cxsnippets).


