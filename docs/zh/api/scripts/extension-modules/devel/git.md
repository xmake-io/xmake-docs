
# devel.git

此接口提供了git各种命令的访问接口，相对于直接调用git命令，此模块提供了更加上层易用的封装接口，并且提供对git的自动检测和跨平台处理。这是 xmake 的扩展模块。

::: tip 提示
使用此模块需要先导入：`import("devel.git")`
:::

## git.clone

- 克隆代码库

#### 函数原型

::: tip API
```lua
git.clone(url: <string>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| url | 必需。git仓库URL |
| opt | 可选。选项参数，支持以下选项：<br>- `depth` - 浅克隆深度<br>- `branch` - 指定分支<br>- `outputdir` - 输出目录<br>- `recursive` - 递归克隆子模块<br>- `longpaths` - 启用长路径支持<br>- `treeless` - 使用树形过滤<br>- `autocrlf` - 自动转换换行符<br>- `fsmonitor` - 启用文件系统监控<br>- `checkout` - 是否执行检出 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 克隆成功返回 true，失败返回 false |

#### 用法说明

此接口对应`git clone`命令，支持深度克隆、分支选择、子模块处理等选项。

```lua
import("devel.git")

-- 基本克隆
git.clone("git@github.com:xmake-io/xmake.git")

-- 带选项的克隆
git.clone("git@github.com:xmake-io/xmake.git", {
    depth = 1,                    -- 浅克隆深度
    branch = "master",            -- 指定分支
    outputdir = "/tmp/xmake",     -- 输出目录
    recursive = true,             -- 递归克隆子模块
    longpaths = true,             -- 启用长路径支持（Windows）
    treeless = true,              -- 使用树形过滤（Git 2.16+）
    autocrlf = true,              -- 自动转换换行符
    fsmonitor = true,             -- 启用文件系统监控
    checkout = false              -- 不执行检出
})
```

## git.init

- 初始化git仓库

#### 函数原型

::: tip API
```lua
git.init(opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| opt | 可选。选项参数，支持以下选项：<br>- `repodir` - 仓库目录 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 初始化成功返回 true，失败返回 false |

#### 用法说明

此接口对应`git init`命令，用于在当前目录或指定目录创建新的git仓库。

```lua
import("devel.git")

-- 在当前目录初始化
git.init()

-- 在指定目录初始化
git.init({repodir = "/tmp/new_project"})
```

## git.pull

- 拉取远程仓库最新提交

#### 函数原型

::: tip API
```lua
git.pull(opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| opt | 可选。选项参数，支持以下选项：<br>- `remote` - 远程仓库名<br>- `branch` - 分支名<br>- `tags` - 是否拉取标签<br>- `force` - 是否强制拉取<br>- `repodir` - 仓库目录<br>- `fsmonitor` - 启用文件系统监控 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 拉取成功返回 true，失败返回 false |

#### 用法说明

此接口对应`git pull`命令，支持指定远程仓库、分支和标签选项。

```lua
import("devel.git")

-- 基本拉取
git.pull()

-- 带选项的拉取
git.pull({
    remote = "origin",            -- 远程仓库名
    branch = "master",            -- 分支名
    tags = true,                  -- 拉取标签
    force = true,                 -- 强制拉取
    repodir = "/tmp/xmake",       -- 仓库目录
    fsmonitor = true              -- 启用文件系统监控
})
```

## git.push

- 推送到远程仓库

#### 函数原型

::: tip API
```lua
git.push(remote: <string>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| remote | 必需。远程仓库URL |
| opt | 可选。选项参数，支持以下选项：<br>- `branch` - 本地分支<br>- `remote_branch` - 远程分支<br>- `force` - 是否强制推送<br>- `repodir` - 仓库目录<br>- `verbose` - 是否详细输出 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 推送成功返回 true，失败返回 false |

#### 用法说明

此接口对应`git push`命令，支持强制推送和指定远程分支。

```lua
import("devel.git")

-- 推送到远程仓库
git.push("https://github.com/user/repo.git", {
    branch = "master",            -- 本地分支
    remote_branch = "main",       -- 远程分支
    force = true,                 -- 强制推送
    repodir = "/tmp/xmake",       -- 仓库目录
    verbose = true                -- 详细输出
})
```

## git.checkout

- 签出指定分支或提交

#### 函数原型

::: tip API
```lua
git.checkout(ref: <string>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| ref | 必需。分支名、标签或提交哈希 |
| opt | 可选。选项参数，支持以下选项：<br>- `repodir` - 仓库目录 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 签出成功返回 true，失败返回 false |

#### 用法说明

此接口对应`git checkout`命令，用于切换分支或检出特定提交。

```lua
import("devel.git")

-- 切换到分支
git.checkout("master", {repodir = "/tmp/xmake"})

-- 检出标签
git.checkout("v1.0.1", {repodir = "/tmp/xmake"})

-- 检出提交
git.checkout("abc1234", {repodir = "/tmp/xmake"})
```

## git.reset

- 重置仓库状态

#### 函数原型

::: tip API
```lua
git.reset(opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| opt | 可选。选项参数，支持以下选项：<br>- `repodir` - 仓库目录<br>- `hard` - 是否硬重置<br>- `soft` - 是否软重置<br>- `commit` - 重置到指定提交 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 重置成功返回 true，失败返回 false |

#### 用法说明

此接口对应`git reset`命令，支持软重置、硬重置等选项。

```lua
import("devel.git")

-- 基本重置
git.reset({repodir = "/tmp/xmake"})

-- 硬重置到指定提交
git.reset({
    repodir = "/tmp/xmake",
    hard = true,                  -- 硬重置
    commit = "HEAD~1"             -- 重置到上一个提交
})

-- 软重置
git.reset({
    repodir = "/tmp/xmake",
    soft = true,                  -- 软重置
    commit = "abc1234"            -- 重置到指定提交
})
```

## git.clean

- 清理工作目录

#### 函数原型

::: tip API
```lua
git.clean(opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| opt | 可选。选项参数，支持以下选项：<br>- `repodir` - 仓库目录<br>- `force` - 是否强制删除<br>- `all` - 是否删除所有未跟踪文件 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 清理成功返回 true，失败返回 false |

#### 用法说明

此接口对应`git clean`命令，用于移除未跟踪的文件和目录。

```lua
import("devel.git")

-- 基本清理
git.clean({repodir = "/tmp/xmake"})

-- 强制清理
git.clean({
    repodir = "/tmp/xmake",
    force = true,                 -- 强制删除
    all = true                    -- 删除所有未跟踪文件
})
```

## git.apply

- 应用补丁文件

#### 函数原型

::: tip API
```lua
git.apply(patch: <string>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| patch | 必需。补丁文件路径 |
| opt | 可选。选项参数，支持以下选项：<br>- `repodir` - 仓库目录<br>- `reverse` - 是否反向应用<br>- `gitdir` - git目录 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 应用成功返回 true，失败返回 false |

#### 用法说明

此接口对应`git apply`命令，用于应用diff格式的补丁文件。

```lua
import("devel.git")

-- 应用补丁
git.apply("fix.patch", {
    repodir = "/tmp/xmake",
    reverse = true,               -- 反向应用补丁
    gitdir = ".git"               -- 指定git目录
})

-- 应用diff文件
git.apply("changes.diff")
```

## git.branch

- 获取当前分支名

#### 函数原型

::: tip API
```lua
git.branch(opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| opt | 可选。选项参数，支持以下选项：<br>- `repodir` - 仓库目录 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回当前分支名 |

#### 用法说明

此接口对应`git branch --show-current`命令，返回当前所在分支的名称。

```lua
import("devel.git")

-- 获取当前分支
local branch = git.branch({repodir = "/tmp/xmake"})
print("Current branch:", branch)
```

## git.lastcommit

- 获取最新提交哈希

#### 函数原型

::: tip API
```lua
git.lastcommit(opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| opt | 可选。选项参数，支持以下选项：<br>- `repodir` - 仓库目录 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回最新提交哈希 |

#### 用法说明

此接口对应`git rev-parse HEAD`命令，返回仓库的最新提交哈希值。

```lua
import("devel.git")

-- 获取最新提交哈希
local commit = git.lastcommit({repodir = "/tmp/xmake"})
print("Last commit:", commit)
```

## git.refs

- 获取所有引用列表

#### 函数原型

::: tip API
```lua
git.refs(url: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| url | 必需。远程仓库URL |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回引用列表数组 |

#### 用法说明

此接口对应`git ls-remote --refs`命令，返回远程仓库的所有引用。

```lua
import("devel.git")

-- 获取所有引用
local refs = git.refs("https://github.com/xmake-io/xmake.git")
for _, ref in ipairs(refs) do
    print("Ref:", ref)
end
```

## git.tags

- 获取所有标签列表

#### 函数原型

::: tip API
```lua
git.tags(url: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| url | 必需。远程仓库URL |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回标签列表数组 |

#### 用法说明

此接口对应`git ls-remote --tags`命令，返回远程仓库的所有标签。

```lua
import("devel.git")

-- 获取所有标签
local tags = git.tags("https://github.com/xmake-io/xmake.git")
for _, tag in ipairs(tags) do
    print("Tag:", tag)
end
```

## git.branches

- 获取所有分支列表

#### 函数原型

::: tip API
```lua
git.branches(url: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| url | 必需。远程仓库URL |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回分支列表数组 |

#### 用法说明

此接口对应`git ls-remote --heads`命令，返回远程仓库的所有分支。

```lua
import("devel.git")

-- 获取所有分支
local branches = git.branches("https://github.com/xmake-io/xmake.git")
for _, branch in ipairs(branches) do
    print("Branch:", branch)
end
```

## git.ls_remote

- 获取远程引用信息

#### 函数原型

::: tip API
```lua
git.ls_remote(refs: <string>, url: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| refs | 必需。引用类型，例如 "tags", "heads", "refs" |
| url | 必需。远程仓库URL |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回引用列表数组 |

#### 用法说明

此接口对应`git ls-remote`命令，支持获取标签、分支或所有引用。

```lua
import("devel.git")

-- 获取标签
local tags = git.ls_remote("tags", "https://github.com/xmake-io/xmake.git")

-- 获取分支
local heads = git.ls_remote("heads", "https://github.com/xmake-io/xmake.git")

-- 获取所有引用
local refs = git.ls_remote("refs")
```

## git.checkurl

- 检查是否为git URL

#### 函数原型

::: tip API
```lua
git.checkurl(url: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| url | 必需。要检查的URL |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 是git URL返回 true，否则返回 false |

#### 用法说明

检查给定的URL是否为有效的git仓库地址。

```lua
import("devel.git")

-- 检查URL
local is_git = git.checkurl("https://github.com/xmake-io/xmake.git")
if is_git then
    print("This is a git URL")
end
```

## git.asgiturl

- 转换URL为git格式

#### 函数原型

::: tip API
```lua
git.asgiturl(url: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| url | 必需。要转换的URL |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回标准git URL格式 |

#### 用法说明

将各种格式的URL转换为标准的git URL格式，支持自定义协议。

```lua
import("devel.git")

-- 转换URL为git格式
local git_url = git.asgiturl("github:xmake-io/xmake")
print("Git URL:", git_url)  -- https://github.com/xmake-io/xmake.git

-- 支持的自定义协议
local protocols = {
    "github:user/repo",      -- https://github.com/user/repo.git
    "gitlab:user/repo",      -- https://gitlab.com/user/repo.git
    "gitee:user/repo",       -- https://gitee.com/user/repo.git
    "bitbucket:user/repo"    -- https://bitbucket.org/user/repo.git
}
```

## submodule.update

- 更新子模块

#### 函数原型

::: tip API
```lua
submodule.update(opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| opt | 可选。选项参数，支持以下选项：<br>- `repodir` - 仓库目录<br>- `init` - 是否初始化子模块<br>- `remote` - 是否更新远程信息<br>- `recursive` - 是否递归更新<br>- `force` - 是否强制更新<br>- `checkout` - 是否检出子模块<br>- `merge` - 是否合并模式<br>- `rebase` - 是否变基模式<br>- `reference` - 引用仓库<br>- `paths` - 指定子模块路径<br>- `longpaths` - 启用长路径支持 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 更新成功返回 true，失败返回 false |

#### 用法说明

此接口对应`git submodule update`命令，用于更新仓库的子模块。

```lua
import("devel.git.submodule")

-- 基本更新
submodule.update({repodir = "/tmp/xmake"})

-- 带选项的更新
submodule.update({
    repodir = "/tmp/xmake",
    init = true,                 -- 初始化子模块
    remote = true,               -- 更新远程信息
    recursive = true,            -- 递归更新
    force = true,                -- 强制更新
    checkout = true,             -- 检出子模块
    merge = true,                -- 合并模式
    rebase = true,               -- 变基模式
    reference = "/path/to/repo", -- 引用仓库
    paths = {"submodule1", "submodule2"}, -- 指定子模块路径
    longpaths = true             -- 启用长路径支持
})
```

## submodule.clean

- 清理子模块

#### 函数原型

::: tip API
```lua
submodule.clean(opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| opt | 可选。选项参数，支持以下选项：<br>- `repodir` - 仓库目录<br>- `force` - 是否强制删除<br>- `all` - 是否删除所有未跟踪文件 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 清理成功返回 true，失败返回 false |

#### 用法说明

此接口对应`git submodule foreach git clean`命令，用于清理所有子模块的未跟踪文件。

```lua
import("devel.git.submodule")

-- 基本清理
submodule.clean({repodir = "/tmp/xmake"})

-- 强制清理
submodule.clean({
    repodir = "/tmp/xmake",
    force = true,                 -- 强制删除
    all = true                    -- 删除所有未跟踪文件
})
```

## submodule.reset

- 重置子模块

#### 函数原型

::: tip API
```lua
submodule.reset(opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| opt | 可选。选项参数，支持以下选项：<br>- `repodir` - 仓库目录<br>- `hard` - 是否硬重置<br>- `soft` - 是否软重置<br>- `commit` - 重置到指定提交<br>- `longpaths` - 启用长路径支持 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 重置成功返回 true，失败返回 false |

#### 用法说明

此接口对应`git submodule foreach git reset`命令，用于重置所有子模块的状态。

```lua
import("devel.git.submodule")

-- 基本重置
submodule.reset({repodir = "/tmp/xmake"})

-- 硬重置
submodule.reset({
    repodir = "/tmp/xmake",
    hard = true,                  -- 硬重置
    commit = "HEAD"               -- 重置到指定提交
})

-- 软重置
submodule.reset({
    repodir = "/tmp/xmake",
    soft = true,                  -- 软重置
    longpaths = true              -- 启用长路径支持
})
```
