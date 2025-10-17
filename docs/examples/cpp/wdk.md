Xmake will detect WDK automatically and we can also set the WDK directory manually.

```sh
$ xmake f --wdk="G:\Program Files\Windows Kits\10" -c
$ xmake
```

If you want to known more information, you can see [#159](https://github.com/xmake-io/xmake/issues/159).

And see [WDK examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/windows/driver)

## UMDF Driver Program

```lua
target("echo")
    add_rules("wdk.driver", "wdk.env.umdf")
    add_files("driver/*.c")
    add_files("driver/*.inx")
    add_includedirs("exe")

target("app")
    add_rules("wdk.binary", "wdk.env.umdf")
    add_files("exe/*.cpp")
```

## KMDF Driver Program

```lua
target("nonpnp")
    add_rules("wdk.driver", "wdk.env.kmdf")
    add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")
    add_files("driver/*.c", {rules = "wdk.tracewpp"})
    add_files("driver/*.rc")

target("app")
    add_rules("wdk.binary", "wdk.env.kmdf")
    add_files("exe/*.c")
    add_files("exe/*.inf")
```

## WDM Driver Program

```lua
target("kcs")
    add_rules("wdk.driver", "wdk.env.wdm")
    add_values("wdk.man.flags", "-prefix Kcs")
    add_values("wdk.man.resource", "kcsCounters.rc")
    add_values("wdk.man.header", "kcsCounters.h")
    add_values("wdk.man.counter_header", "kcsCounters_counters.h")
    add_files("*.c", "*.rc", "*.man")
```

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    add_values("wdk.tracewpp.flags", "-func:TracePrint((LEVEL,FLAGS,MSG,...))")
    add_files("*.c", {rules = "wdk.tracewpp"})
    add_files("*.rc", "*.inf")
    add_files("*.mof|msdsm.mof")
    add_files("msdsm.mof", {values = {wdk_mof_header = "msdsmwmi.h"}})
```

## Package Driver

We can run the following command to generate a .cab driver package.

```sh
$ xmake [p|package]
$ xmake [p|package] -o outputdir
```

The output files like:

```
  - drivers
    - sampledsm
       - debug/x86/sampledsm.cab
       - release/x64/sampledsm.cab
       - debug/x86/sampledsm.cab
       - release/x64/sampledsm.cab
```

## Driver Signing

The driver signing is disabled when we compile driver in default case,
but we can add `set_values("wdk.sign.mode")` to enable test/release sign.

### TestSign

We can use test certificate of xmake to do testsign, but please run `$xmake l utils.wdk.testcert` install as admin to install a test certificate first (only once)!

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
    set_values("wdk.sign.digest_algorithm", "sha256")
```

Or we set a valid certificate thumbprint to do it in local machine.

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
    set_values("wdk.sign.thumbprint", "032122545DCAA6167B1ADBE5F7FDF07AE2234AAA")
    set_values("wdk.sign.digest_algorithm", "sha256")
```

We can also do testsign via setting store/company info.

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
    set_values("wdk.sign.store", "PrivateCertStore")
    set_values("wdk.sign.company", "tboox.org(test)")
    set_values("wdk.sign.digest_algorithm", "sha256")
```

### ReleaseSign

We can set a certificate file for release signing.

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "release")
    set_values("wdk.sign.company", "xxxx")
    set_values("wdk.sign.certfile", path.join(os.projectdir(), "xxxx.cer"))
    set_values("wdk.sign.digest_algorithm", "sha256")
```

## Support Low-version System

We can set `wdk.env.winver` to generate a driver package that is compatible with a low version system.

```lua
set_values("wdk.env.winver", "win10")
set_values("wdk.env.winver", "win10_rs3")
set_values("wdk.env.winver", "win81")
set_values("wdk.env.winver", "win8")
set_values("wdk.env.winver", "win7")
set_values("wdk.env.winver", "win7_sp1")
set_values("wdk.env.winver", "win7_sp2")
set_values("wdk.env.winver", "win7_sp3")
```

We can also set windows version for WDK driver program:

```sh
$ xmake f --wdk_winver=[win10_rs3|win8|win7|win7_sp1]
$ xmake
```
