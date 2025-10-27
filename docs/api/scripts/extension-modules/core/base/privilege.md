# core.base.privilege

This module provides privilege management for elevated permission operations.

::: tip TIP
To use this module, you need to import it first: `import("core.base.privilege")`
:::

This module allows you to store and restore privilege levels when working with operations that require elevated permissions, such as writing to system directories.

::: warning WARNING
This module should be used with extreme caution. Privilege escalation operations can be dangerous if misused.
:::

## privilege.store

- Store current privilege by dropping to original user

#### Function Prototype

::: tip API
```lua
privilege.store()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if privilege was successfully stored and dropped, false otherwise |

#### Usage

This function should be called early in the process when you have elevated privileges (e.g., running as root or via sudo). It stores the privilege and drops to the original user that started the process.

```lua
import("core.base.privilege")

-- When running with elevated privileges, store and drop them
-- This allows the process to run with normal permissions by default
if privilege.store() then
    print("Privilege stored, now running as original user")
end

-- ... later, when privileged operations are needed ...
if privilege.get() then
    -- Perform privileged operations like installing system packages
    os.vrunv("apt", {"install", "-y", "package-name"})
end
```

::: warning NOTE
This function can only succeed if running as root. It attempts to determine the original user from:
1. SUDO_UID and SUDO_GID environment variables (if running via sudo)
2. The owner of the project directory
3. The owner of the current directory
:::

## privilege.has

- Check if stored privilege is available

#### Function Prototype

::: tip API
```lua
privilege.has()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if stored privilege is available, false otherwise |

#### Usage

```lua
import("core.base.privilege")

if privilege.has() then
    print("Stored privilege is available")
else
    print("No stored privilege")
end
```

## privilege.get

- Restore elevated privilege

#### Function Prototype

::: tip API
```lua
privilege.get()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if privilege was successfully restored, false otherwise |

#### Usage

This function restores the elevated privileges that were previously stored with `privilege.store()`.

```lua
import("core.base.privilege")

-- Check if we have stored privilege
if privilege.has() then
    -- Restore privileged access
    if privilege.get() then
        print("Privilege restored, now running with elevated permissions")
        
        -- Perform privileged operations like installing system packages
        os.vrunv("apt", {"install", "-y", "package-name"})
        
        -- Or write to protected system directories
        os.cp("file.txt", "/etc/some/directory/")
    end
end
```

::: warning NOTE
This function can only succeed if `privilege.store()` was previously called successfully. It restores root privileges by setting UID and GID to 0.
:::

