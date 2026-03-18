---
outline: deep
---

# 命名空间隔离

我们可以使用 `namespace` 来隔离不同子工程的 target、option 和 rule，避免命名冲突。

命名空间隔离的详细教程请参阅[命名空间隔离指南](/zh/guide/project-configuration/namespace-isolation)。

## 基础示例

<FileExplorer rootFilesDir="examples/configuration/namespace_isolation/basic" />

### 编译运行

```bash
$ xmake
$ xmake run
```
