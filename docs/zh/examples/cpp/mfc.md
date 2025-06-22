
## MFC 静态库 {#mfc-static}

```lua
target("test")
    add_rules("win.sdk.mfc.static")
    add_files("src/*.c")
```

## MFC 动态库 {#mfc-shared}

```lua
target("test")
    add_rules("win.sdk.mfc.shared")
    add_files("src/*.c")
```

## MFC 应用程序（静态链接）{#mfc-app-static}

```lua
target("test")
    add_rules("win.sdk.mfc.static_app")
    add_files("src/*.c")
```

## MFC 应用程序（动态链接）{#mfc-app-shared}

```lua
target("test")
    add_rules("win.sdk.mfc.shared_app")
    add_files("src/*.c")
```

