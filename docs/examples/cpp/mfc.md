## MFC Static Library

```lua
target("test")
    add_rules("win.sdk.mfc.static")
    add_files("src/*.c")
```

## MFC Shared Library

```lua
target("test")
    add_rules("win.sdk.mfc.shared")
    add_files("src/*.c")
```

## MFC Application (Static)

```lua
target("test")
    add_rules("win.sdk.mfc.static_app")
    add_files("src/*.c")
```

## MFC Application (Shared)

```lua
target("test")
    add_rules("win.sdk.mfc.shared_app")
    add_files("src/*.c")
```
