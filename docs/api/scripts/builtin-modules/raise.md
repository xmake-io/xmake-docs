
# raise

- Throwing an abort exception

#### Function Prototype

```lua
raise(message: <string>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| message | Error message string |

#### Usage

If you want to interrupt xmake running in custom scripts and plug-in tasks, you can use this interface to throw an exception.
If the upper layer does not show the call to [try-catch](/api/scripts/builtin-modules/try-catch-finally), xmake will be executed. An error message is displayed.

Additionally, this will cause the xmake program to terminate and exit.

```lua
if (errors) raise(errors)
```

If an exception is thrown in the try block, the error information is captured in catch and finally. See: [try-catch](/api/scripts/builtin-modules/try-catch-finally)
