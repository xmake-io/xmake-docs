
# linuxos

The linux system operation module is a built-in module, no need to use [import](/api/scripts/builtin-modules/import) to import,
and its interface can be called directly in the script scope.

## linuxos.name

- Get linux system name

#### Function Prototype

```lua
linuxos.name()
```

#### Parameter Description

No parameters required for this function.

#### Usage

We can also quickly get the view through the following command

```sh
xmake l linuxos.name
```

Some names currently supported are:

- ubuntu
- debian
- archlinux
- manjaro
- linuxmint
- centos
- fedora
- opensuse

## linuxos.version

- Get linux system version

#### Function Prototype

```lua
linuxos.version()
```

#### Parameter Description

No parameters required for this function.

#### Usage

The version returned is the semver semantic version object

```lua
if linux.version():ge("10.0") then
    -- ...
end
```

## linuxos.kernelver

- Get linux system kernel version

#### Function Prototype

```lua
linuxos.kernelver()
```

#### Parameter Description

No parameters required for this function.

#### Usage

What is returned is also a semantic version object, you can also execute `xmake l linuxos.kernelver` to quickly view.
