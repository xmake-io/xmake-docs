# 远程工具链

我们可以使用 [add_requires](/zh/api/description/global-interfaces#add_requires) 来拉取远程工具链包，然后通过 [set_toolchains](/zh/api/description/project-target#set_toolchains) 切换到它们。

关于工具链定义的更多详情，请参考：[自定义工具链 API](/zh/api/description/custom-toolchain)。

## LLVM 工具链

<FileExplorer rootFilesDir="examples/configuration/remote_toolchain/llvm" />

## Zig 工具链

<FileExplorer rootFilesDir="examples/configuration/remote_toolchain/zig" />

## GNU-RM 工具链

<FileExplorer rootFilesDir="examples/configuration/remote_toolchain/gnu_rm" />
