# XPack Component Interfaces

## set_title

- Set a brief description of the package components

```lua
xpack_component("LongPath")
     set_title("Enable Long Path")
```

## set_description

- Set detailed description of package components

```lua
xpack_component("LongPath")
     set_description("Increases the maximum path length limit, up to 32,767 characters (before 256).")
```

## set_default

- Set the default enabled state of package components

Usually the package component is enabled by default, but we can also use this interface to disable this component by default. Only when the user chooses to check this component when installing the package will it be enabled for installation.

```lua
xpack_component("LongPath")
     set_default(false)
     set_title("Enable Long Path")
```

## on_load

- Custom loading script

We can further flexibly configure package components in the on_load custom script field.

```lua
xpack_component("test")
     on_load(function (component)
         local package = component:package()
         -- TODO
     end)
```

## before_installcmd

- Add script before component installation

It will not rewrite the entire installation script, but will add some custom installation scripts before the existing installation scripts are executed:

```lua
xpack_component("test")
     before_installcmd(function (component, batchcmds)
         batchcmds:mkdir(package:installdir("resources"))
         batchcmds:cp("src/assets/*.txt", package:installdir("resources"), {rootdir = "src"})
         batchcmds:mkdir(package:installdir("stub"))
     end)
```

It should be noted that the cp, mkdir and other commands added through `batchcmds` will not be executed immediately, but will only generate a command list. When the package is actually generated later, these commands will be translated into packaging commands.

It is exactly the same as xpack's before_installcmd. The only difference is that the installation script here will only be executed when this component is enabled.

## on_installcmd

- Rewrite the installation script of the component

This will rewrite the entire component's installation script, similar to xpack's on_installcmd.

```lua
xpack_component("test")
     on_installcmd(function (component, batchcmds)
         -- TODO
     end)
```

## after_installcmd

- Add script after component installation

After the component is installed, the script here will be executed, similar to xpack's after_installcmd.

```lua
xpack_component("test")
     after_installcmd(function (component, batchcmds)
         -- TODO
     end)
```

## before_uninstallcmd

- Add script before component uninstallation

After the component is installed, the script here will be executed, similar to xpack's before_uninstallcmd.

```lua
xpack_component("test")
     before_uninstallcmd(function (component, batchcmds)
         -- TODO
     end)
```

## on_uninstallcmd

- Rewrite the script for component uninstallation

This will rewrite the entire component's uninstall script, similar to xpack's on_uninstallcmd.

```lua
xpack_component("test")
     on_uninstallcmd(function (component, batchcmds)
         -- TODO
     end)
```

## after_uninstallcmd

- Add script after component uninstallation

After the component is uninstalled, the script here will be executed, similar to xpack's before_uninstallcmd.

```lua
xpack_component("test")
     before_uninstallcmd(function (component, batchcmds)
         -- TODO
     end)
```

## add_sourcefiles

- Add component source file

This is similar to xpack's add_sourcefiles, but here only when the component is enabled, these source files will be added to the installation package.

## add_installfiles

- Add component binary installation file

This is similar to xpack's add_installfiles, but here only the binaries are added to the installation package when the component is enabled.
