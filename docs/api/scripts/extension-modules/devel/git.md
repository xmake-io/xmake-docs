# devel.git

This interface provides access to various git commands. Compared to directly calling git commands, this module provides more high-level and easy-to-use encapsulated interfaces, and provides automatic git detection and cross-platform processing. This is an extension module of xmake.

::: tip Tip
To use this module, you need to import it first: `import("devel.git")`
:::

## git.clone

- Clone repository

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

This interface corresponds to the `git branch --show-current` command, returns the name of the current branch.

```lua
import("devel.git")

-- Get current branch
local branch = git.branch({repodir = "/tmp/xmake"})
print("Current branch:", branch)
```

## git.lastcommit

- Get latest commit hash

This interface corresponds to the `git rev-parse HEAD` command, returns the latest commit hash of the repository.

```lua
import("devel.git")

-- Get latest commit hash
local commit = git.lastcommit({repodir = "/tmp/xmake"})
print("Last commit:", commit)
```

## git.refs

- Get all reference list

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