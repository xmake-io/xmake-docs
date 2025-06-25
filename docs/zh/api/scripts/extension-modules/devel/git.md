
# devel.git

此接口提供了git各种命令的访问接口，相对于直接调用git命令，此模块提供了更加上层易用的封装接口，并且提供对git的自动检测和跨平台处理。

## git.clone

- clone代码库

此接口对应`git clone`命令

```lua
import("devel.git")

git.clone("git@github.com:tboox/xmake.git")
git.clone("git@github.com:tboox/xmake.git", {depth = 1, branch = "master", outputdir = "/tmp/xmake"})
```

## git.pull

- 拉取代码库最新提交

此接口对应`git pull`命令

```lua
import("devel.git")

git.pull()
git.pull({remote = "origin", tags = true, branch = "master", repodir = "/tmp/xmake"})
```

## git.clean

- 清理代码库文件

此接口对应`git clean`命令

```lua
import("devel.git")

git.clean()
git.clean({repodir = "/tmp/xmake", force = true})
```

## git.checkout

- 签出指定分支版本

此接口对应`git checkout`命令

```lua
import("devel.git")

git.checkout("master", {repodir = "/tmp/xmake"})
git.checkout("v1.0.1", {repodir = "/tmp/xmake"})
```

## git.refs

- 获取所有引用列表

此接口对应`git ls-remote --refs`命令

```lua
import("devel.git")

local refs = git.refs(url)
```

## git.tags

- 获取所有标记列表

此接口对应`git ls-remote --tags`命令

```lua
import("devel.git")

local tags = git.tags(url)
```

## git.branches

- 获取所有分支列表

此接口对应`git ls-remote --heads`命令

```lua
import("devel.git")

local branches = git.branches(url)
```
