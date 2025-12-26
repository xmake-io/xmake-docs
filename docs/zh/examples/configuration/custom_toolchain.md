---
outline: deep
---

# 自定义工具链

我们可以使用 `toolchain()` 定义自定义工具链，以支持特殊的编译器或交叉编译环境。

关于自定义工具链的更多详情，请参考：[自定义工具链 API](/zh/api/description/custom-toolchain)。

## 基础示例

<FileExplorer rootFilesDir="examples/configuration/custom_toolchain/basic" />

### 编译运行

```bash
$ xmake
$ xmake run
```

## 未知工具链

如果我们需要支持一个完全未知的编译器工具链，我们需要实现工具链的探测脚本，以及编译、链接、归档等所有工具集的脚本配置。

<FileExplorer rootFilesDir="examples/configuration/custom_toolchain/unknown_toolchain" />

