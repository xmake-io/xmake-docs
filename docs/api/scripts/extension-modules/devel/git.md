
# devel.git

This interface provides access to various commands of git. Compared to the direct call to git command, this module provides a more easy-to-use package interface and provides automatic detection and cross-platform processing for git.

## git.clone

- clone codebase

This interface corresponds to the `git clone` command.

```lua
import("devel.git")

git.clone("git@github.com:tboox/xmake.git")
git.clone("git@github.com:tboox/xmake.git", {depth = 1, branch = "master", outputdir = "/tmp/xmake"})
```

## git.pull

- Pull the code base for the latest submission

This interface corresponds to the `git pull` command.

```lua
import("devel.git")

git.pull()
git.pull({remote = "origin", tags = true, branch = "master", repodir = "/tmp/xmake"})
```

## git.clean

- Clean up the code base file

This interface corresponds to the `git clean` command.

```lua
import("devel.git")

git.clean()
git.clean({repodir = "/tmp/xmake", force = true})
```

## git.checkout

- Check out the specified branch version

This interface corresponds to the `git checkout` command

```lua
import("devel.git")

git.checkout("master", {repodir = "/tmp/xmake"})
git.checkout("v1.0.1", {repodir = "/tmp/xmake"})
```

## git.refs

- Get a list of all references

This interface corresponds to the `git ls-remote --refs` command

```lua
import("devel.git")

local refs = git.refs(url)
```

## git.tags

- Get a list of all tags

This interface corresponds to the `git ls-remote --tags` command

```lua
import("devel.git")

local tags = git.tags(url)
```

## git.branches

- Get a list of all branches

This interface corresponds to the `git ls-remote --heads` command

```lua
import("devel.git")

local branches = git.branches(url)
```
