# core.base.privilege

此模块提供权限管理功能，用于执行需要提升权限的操作。

::: tip 提示
使用此模块需要先导入：`import("core.base.privilege")`
:::

此模块允许您在需要提升权限的操作（例如写入系统目录）时存储和恢复权限级别。

::: warning 注意
此模块应谨慎使用。权限提升操作如果使用不当可能是危险的。
:::

## privilege.store

- 存储当前权限并降级到原始用户

#### 函数原型

::: tip API
```lua
privilege.store()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 成功存储并降低权限返回 true，否则返回 false |

#### 用法说明

此函数应在进程开始时就调用（当您具有提升权限时，例如以 root 身份运行或通过 sudo）。它存储权限并降级为启动进程的原始用户。

```lua
import("core.base.privilege")

-- 在以提升权限运行时，存储并降低权限
-- 这使得进程默认以普通权限运行
if privilege.store() then
    print("权限已存储，现在以原始用户身份运行")
end

-- ... 稍后，当需要执行特权操作时 ...
if privilege.get() then
    -- 执行需要提升权限的操作，例如安装系统包
    os.vrunv("apt", {"install", "-y", "package-name"})
end
```

::: warning 注意
此函数只有在以 root 身份运行时才能成功。它尝试从以下方式确定原始用户：
1. SUDO_UID 和 SUDO_GID 环境变量（如果通过 sudo 运行）
2. 项目目录的所有者
3. 当前目录的所有者
:::

## privilege.has

- 检查是否已存储权限

#### 函数原型

::: tip API
```lua
privilege.has()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 如果已存储权限则返回 true，否则返回 false |

#### 用法说明

```lua
import("core.base.privilege")

if privilege.has() then
    print("已存储的权限可用")
else
    print("没有已存储的权限")
end
```

## privilege.get

- 恢复提升权限

#### 函数原型

::: tip API
```lua
privilege.get()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 成功恢复权限返回 true，否则返回 false |

#### 用法说明

此函数恢复之前使用 `privilege.store()` 存储的提升权限。

```lua
import("core.base.privilege")

-- 检查是否有已存储的权限
if privilege.has() then
    -- 恢复提升权限
    if privilege.get() then
        print("权限已恢复，现在以提升权限运行")
        
        -- 执行需要提升权限的操作，例如安装系统包
        os.vrunv("apt", {"install", "-y", "package-name"})
        
        -- 或者写入受保护的系统目录
        os.cp("file.txt", "/etc/some/directory/")
    end
end
```

::: warning 注意
此函数只有在之前成功调用 `privilege.store()` 时才能成功。它通过将 UID 和 GID 设置为 0 来恢复 root 权限。
:::

