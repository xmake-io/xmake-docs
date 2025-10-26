# devel.git

This interface provides access to various git commands. Compared to directly calling git commands, this module provides more high-level and easy-to-use encapsulated interfaces, and provides automatic git detection and cross-platform processing. This is an extension module of xmake.

::: tip Tip
To use this module, you need to import it first: `import("devel.git")`
:::

## git.clone

- Clone repository

#### Function Prototype

::: tip API
```lua
git.clone(url: <string>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| url | Required. Git repository URL |
| opt | Optional. Option parameters, supports the following:<br>- `depth` - Shallow clone depth<br>- `branch` - Specify branch<br>- `outputdir` - Output directory<br>- `recursive` - Recursively clone submodules<br>- `longpaths` - Enable long path support<br>- `treeless` - Use tree filter<br>- `autocrlf` - Auto convert line endings<br>- `fsmonitor` - Enable filesystem monitoring<br>- `checkout` - Whether to perform checkout |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

This interface corresponds to the `git clone` command, supporting options like shallow cloning, branch selection, and submodule handling.

```lua
import("devel.git")

-- Basic clone
git.clone("git@github.com:xmake-io/xmake.git")

-- Clone with options
git.clone("git@github.com:xmake-io/xmake.git", {
    depth = 1,                    -- Shallow clone depth
    branch = "master",            -- Specify branch
    outputdir = "/tmp/xmake",     -- Output directory
    recursive = true,             -- Recursively clone submodules
    longpaths = true,             -- Enable long path support (Windows)
    treeless = true,              -- Use tree filter (Git 2.16+)
    autocrlf = true,              -- Auto convert line endings
    fsmonitor = true,             -- Enable filesystem monitoring
    checkout = false              -- Don't perform checkout
})
```

## git.init

- Initialize git repository

#### Function Prototype

::: tip API
```lua
git.init(opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Option parameters, supports the following:<br>- `repodir` - Repository directory |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

This interface corresponds to the `git init` command, used to create a new git repository in the current directory or specified directory.

```lua
import("devel.git")

-- Initialize in current directory
git.init()

-- Initialize in specified directory
git.init({repodir = "/tmp/new_project"})
```

## git.pull

- Pull latest commits from remote repository

#### Function Prototype

::: tip API
```lua
git.pull(opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Option parameters, supports the following:<br>- `remote` - Remote repository name<br>- `branch` - Branch name<br>- `tags` - Whether to pull tags<br>- `force` - Whether to force pull<br>- `repodir` - Repository directory<br>- `fsmonitor` - Enable filesystem monitoring |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

This interface corresponds to the `git pull` command, supporting options for specifying remote repository, branch, and tags.

```lua
import("devel.git")

-- Basic pull
git.pull()

-- Pull with options
git.pull({
    remote = "origin",            -- Remote repository name
    branch = "master",            -- Branch name
    tags = true,                  -- Pull tags
    force = true,                 -- Force pull
    repodir = "/tmp/xmake",       -- Repository directory
    fsmonitor = true              -- Enable filesystem monitoring
})
```

## git.push

- Push to remote repository

#### Function Prototype

::: tip API
```lua
git.push(remote: <string>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| remote | Required. Remote repository URL |
| opt | Optional. Option parameters, supports the following:<br>- `branch` - Local branch<br>- `remote_branch` - Remote branch<br>- `force` - Whether to force push<br>- `repodir` - Repository directory<br>- `verbose` - Whether to output verbosely |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

This interface corresponds to the `git push` command, supporting force push and specifying remote branches.

```lua
import("devel.git")

-- Push to remote repository
git.push("https://github.com/user/repo.git", {
    branch = "master",            -- Local branch
    remote_branch = "main",       -- Remote branch
    force = true,                 -- Force push
    repodir = "/tmp/xmake",       -- Repository directory
    verbose = true                -- Verbose output
})
```

## git.checkout

- Checkout specified branch or commit

#### Function Prototype

::: tip API
```lua
git.checkout(ref: <string>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| ref | Required. Branch name, tag or commit hash |
| opt | Optional. Option parameters, supports the following:<br>- `repodir` - Repository directory |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

This interface corresponds to the `git checkout` command, used to switch branches or checkout specific commits.

```lua
import("devel.git")

-- Switch to branch
git.checkout("master", {repodir = "/tmp/xmake"})

-- Checkout tag
git.checkout("v1.0.1", {repodir = "/tmp/xmake"})

-- Checkout commit
git.checkout("abc1234", {repodir = "/tmp/xmake"})
```

## git.reset

- Reset repository state

#### Function Prototype

::: tip API
```lua
git.reset(opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Option parameters, supports the following:<br>- `repodir` - Repository directory<br>- `hard` - Whether to hard reset<br>- `soft` - Whether to soft reset<br>- `commit` - Reset to specified commit |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

This interface corresponds to the `git reset` command, supporting soft reset, hard reset and other options.

```lua
import("devel.git")

-- Basic reset
git.reset({repodir = "/tmp/xmake"})

-- Hard reset to specified commit
git.reset({
    repodir = "/tmp/xmake",
    hard = true,                  -- Hard reset
    commit = "HEAD~1"             -- Reset to previous commit
})

-- Soft reset
git.reset({
    repodir = "/tmp/xmake",
    soft = true,                  -- Soft reset
    commit = "abc1234"            -- Reset to specified commit
})
```

## git.clean

- Clean working directory

#### Function Prototype

::: tip API
```lua
git.clean(opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Option parameters, supports the following:<br>- `repodir` - Repository directory<br>- `force` - Whether to force delete<br>- `all` - Whether to delete all untracked files |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

This interface corresponds to the `git clean` command, used to remove untracked files and directories.

```lua
import("devel.git")

-- Basic clean
git.clean({repodir = "/tmp/xmake"})

-- Force clean
git.clean({
    repodir = "/tmp/xmake",
    force = true,                 -- Force delete
    all = true                    -- Delete all untracked files
})
```

## git.apply

- Apply patch file

#### Function Prototype

::: tip API
```lua
git.apply(patch: <string>, opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| patch | Required. Patch file path |
| opt | Optional. Option parameters, supports the following:<br>- `repodir` - Repository directory<br>- `reverse` - Whether to apply in reverse<br>- `gitdir` - Git directory |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

This interface corresponds to the `git apply` command, used to apply diff format patch files.

```lua
import("devel.git")

-- Apply patch
git.apply("fix.patch", {
    repodir = "/tmp/xmake",
    reverse = true,               -- Apply patch in reverse
    gitdir = ".git"               -- Specify git directory
})

-- Apply diff file
git.apply("changes.diff")
```

## git.branch

- Get current branch name

#### Function Prototype

::: tip API
```lua
git.branch(opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Option parameters, supports the following:<br>- `repodir` - Repository directory |

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns current branch name |

#### Usage

This interface corresponds to the `git branch --show-current` command, returns the name of the current branch.

```lua
import("devel.git")

-- Get current branch
local branch = git.branch({repodir = "/tmp/xmake"})
print("Current branch:", branch)
```

## git.lastcommit

- Get latest commit hash

#### Function Prototype

::: tip API
```lua
git.lastcommit(opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Option parameters, supports the following:<br>- `repodir` - Repository directory |

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns latest commit hash |

#### Usage

This interface corresponds to the `git rev-parse HEAD` command, returns the latest commit hash of the repository.

```lua
import("devel.git")

-- Get latest commit hash
local commit = git.lastcommit({repodir = "/tmp/xmake"})
print("Last commit:", commit)
```

## git.refs

- Get all reference list

#### Function Prototype

::: tip API
```lua
git.refs(url: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| url | Required. Remote repository URL |

#### Return Value

| Type | Description |
|------|-------------|
| table | Returns reference list array |

#### Usage

This interface corresponds to the `git ls-remote --refs` command, returns all references of the remote repository.

```lua
import("devel.git")

-- Get all references
local refs = git.refs("https://github.com/xmake-io/xmake.git")
for _, ref in ipairs(refs) do
    print("Ref:", ref)
end
```

## git.tags

- Get all tag list

#### Function Prototype

::: tip API
```lua
git.tags(url: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| url | Required. Remote repository URL |

#### Return Value

| Type | Description |
|------|-------------|
| table | Returns tag list array |

#### Usage

This interface corresponds to the `git ls-remote --tags` command, returns all tags of the remote repository.

```lua
import("devel.git")

-- Get all tags
local tags = git.tags("https://github.com/xmake-io/xmake.git")
for _, tag in ipairs(tags) do
    print("Tag:", tag)
end
```

## git.branches

- Get all branch list

#### Function Prototype

::: tip API
```lua
git.branches(url: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| url | Required. Remote repository URL |

#### Return Value

| Type | Description |
|------|-------------|
| table | Returns branch list array |

#### Usage

This interface corresponds to the `git ls-remote --heads` command, returns all branches of the remote repository.

```lua
import("devel.git")

-- Get all branches
local branches = git.branches("https://github.com/xmake-io/xmake.git")
for _, branch in ipairs(branches) do
    print("Branch:", branch)
end
```

## git.ls_remote

- Get remote reference information

#### Function Prototype

::: tip API
```lua
git.ls_remote(refs: <string>, url: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| refs | Required. Reference type, e.g., "tags", "heads", "refs" |
| url | Required. Remote repository URL |

#### Return Value

| Type | Description |
|------|-------------|
| table | Returns reference list array |

#### Usage

This interface corresponds to the `git ls-remote` command, supports getting tags, branches or all references.

```lua
import("devel.git")

-- Get tags
local tags = git.ls_remote("tags", "https://github.com/xmake-io/xmake.git")

-- Get branches
local heads = git.ls_remote("heads", "https://github.com/xmake-io/xmake.git")

-- Get all references
local refs = git.ls_remote("refs")
```

## git.checkurl

- Check if it's a git URL

#### Function Prototype

::: tip API
```lua
git.checkurl(url: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| url | Required. URL to check |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if it's a git URL, false otherwise |

#### Usage

Check if the given URL is a valid git repository address.

```lua
import("devel.git")

-- Check URL
local is_git = git.checkurl("https://github.com/xmake-io/xmake.git")
if is_git then
    print("This is a git URL")
end
```

## git.asgiturl

- Convert URL to git format

#### Function Prototype

::: tip API
```lua
git.asgiturl(url: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| url | Required. URL to convert |

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns standard git URL format |

#### Usage

Convert various formats of URLs to standard git URL format, supporting custom protocols.

```lua
import("devel.git")

-- Convert URL to git format
local git_url = git.asgiturl("github:xmake-io/xmake")
print("Git URL:", git_url)  -- https://github.com/xmake-io/xmake.git

-- Supported custom protocols
local protocols = {
    "github:user/repo",      -- https://github.com/user/repo.git
    "gitlab:user/repo",      -- https://gitlab.com/user/repo.git
    "gitee:user/repo",       -- https://gitee.com/user/repo.git
    "bitbucket:user/repo"    -- https://bitbucket.org/user/repo.git
}
```

## submodule.update

- Update submodules

#### Function Prototype

::: tip API
```lua
submodule.update(opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Option parameters, supports the following:<br>- `repodir` - Repository directory<br>- `init` - Whether to initialize submodules<br>- `remote` - Whether to update remote information<br>- `recursive` - Whether to recursively update<br>- `force` - Whether to force update<br>- `checkout` - Whether to checkout submodules<br>- `merge` - Whether to merge mode<br>- `rebase` - Whether to rebase mode<br>- `reference` - Reference repository<br>- `paths` - Specify submodule paths<br>- `longpaths` - Enable long path support |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

This interface corresponds to the `git submodule update` command, used to update repository submodules.

```lua
import("devel.git.submodule")

-- Basic update
submodule.update({repodir = "/tmp/xmake"})

-- Update with options
submodule.update({
    repodir = "/tmp/xmake",
    init = true,                 -- Initialize submodules
    remote = true,               -- Update remote information
    recursive = true,            -- Recursive update
    force = true,                -- Force update
    checkout = true,             -- Checkout submodules
    merge = true,                -- Merge mode
    rebase = true,               -- Rebase mode
    reference = "/path/to/repo", -- Reference repository
    paths = {"submodule1", "submodule2"}, -- Specify submodule paths
    longpaths = true             -- Enable long path support
})
```

## submodule.clean

- Clean submodules

#### Function Prototype

::: tip API
```lua
submodule.clean(opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Option parameters, supports the following:<br>- `repodir` - Repository directory<br>- `force` - Whether to force delete<br>- `all` - Whether to delete all untracked files |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

This interface corresponds to the `git submodule foreach git clean` command, used to clean untracked files in all submodules.

```lua
import("devel.git.submodule")

-- Basic clean
submodule.clean({repodir = "/tmp/xmake"})

-- Force clean
submodule.clean({
    repodir = "/tmp/xmake",
    force = true,                 -- Force delete
    all = true                    -- Delete all untracked files
})
```

## submodule.reset

- Reset submodules

#### Function Prototype

::: tip API
```lua
submodule.reset(opt: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Option parameters, supports the following:<br>- `repodir` - Repository directory<br>- `hard` - Whether to hard reset<br>- `soft` - Whether to soft reset<br>- `commit` - Reset to specified commit<br>- `longpaths` - Enable long path support |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

This interface corresponds to the `git submodule foreach git reset` command, used to reset the state of all submodules.

```lua
import("devel.git.submodule")

-- Basic reset
submodule.reset({repodir = "/tmp/xmake"})

-- Hard reset
submodule.reset({
    repodir = "/tmp/xmake",
    hard = true,                  -- Hard reset
    commit = "HEAD"               -- Reset to specified commit
})

-- Soft reset
submodule.reset({
    repodir = "/tmp/xmake",
    soft = true,                  -- Soft reset
    longpaths = true              -- Enable long path support
})
```