# signal

2.9.1 adds a new signal registration interface. We can register signal processing functions such as SIGINT in the Lua layer to customize the response logic.

## signal.register

- Register signal handler

Currently, it only supports SIGINT signal processing, and it also supports mainstream platforms such as windows.

```lua
import("core.base.signal")

function main()
     signal.register(signal.SIGINT, function (signo)
         print("signal.SIGINT(%d)", signo)
     end)
     io.read()
end
```

This is useful when some sub-processes internally shield SIGINT, causing them to freeze and not exit. Even if the user presses `Ctrl+C` to exit the xmake process, it does not exit.
We can force it out in this way.

```lua
import("core.base.process")
import("core.base.signal")

function main()
     local proc
     signal.register(signal.SIGINT, function (signo)
         print("sigint")
         if proc then
             proc:kill()
         end
     end)
     proc = process.open("./trap.sh")
     if proc then
         proc:wait()
         proc:close()
     end
end
```

For the background of this issue, please refer to: [#4889](https://github.com/xmake-io/xmake/issues/4889)

## signal.ignore

- Ignore a signal

We can also ignore the processing of blocking a certain signal through the `signal.ignore` interface.

```lua
signal.ignore(signal.SIGINT)
```

## signal.reset

- Reset a signal

We can also clear the processing function of a certain signal and fall back to the default processing logic.

```lua
signal.reset(signal.SIGINT)
```
