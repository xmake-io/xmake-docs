---
outline: deep
---

# xmake-harness (`xmake ai`)

[xmake-harness](https://github.com/xmake-addons/xmake-harness) 是一个完全用 xmake lua 编写的 AI Agent 框架，没有任何第三方依赖。以 addon 形式安装后，它提供 `xmake ai`：一个就在你工程里、并且会构建这个工程的终端编码助手。

它同时是两样东西：

1. **一个通用的 Agent 框架** —— 会话记录、agent 主循环、工具管线、权限策略、沙箱、skills、子 agent、斜杠命令和终端 UI。
2. **一个 xmake addon** —— 也就是 `xmake ai`，交互方式贴近 Claude Code，并且天生了解 xmake 构建。

## 安装

```sh
$ xmake addon --install xmake-harness
$ xmake ai --setup
```

`--setup` 是交互式向导：选服务商、填 api key、选模型。也可以直接从仓库装：

```sh
$ xmake addon --install github:xmake-addons/xmake-harness
```

## 配置

配置由五层合并而成，后面的覆盖前面的：

1. 内置默认值
2. 用户配置，`~/.xmake/harness/config.json`
3. 工程配置，`<project>/.xmake-harness/config.json`
4. 环境变量，`XMAKE_HARNESS_*`
5. `xmake ai` 的命令行参数

只有用户这一层是 harness 自己写入的，所以 **api key 永远不会落进工程仓库**。

```sh
$ xmake ai --config=providers.deepseek.apikey=sk-xxxxxx   # 设置一项后退出
$ xmake ai --config=ui.theme=light
$ xmake ai --apikey=sk-xxxxxx                             # 当前服务商的 key
$ xmake ai --showconfig                                   # 查看合并后的配置
$ xmake ai --doctor                                       # 检查运行环境
```

在 TUI 里同样可以用 `/config`、`/model`、`/provider` 做这些事，`/config` 不会完整打印 key。

### 服务商和模型

内置服务商有 `deepseek`（默认）、`anthropic`、`openai`、`moonshot`、`dashscope`、`siliconflow`、`openrouter` 和 `zhipu`。任何 OpenAI 兼容的接口，配上 `baseurl` 即可使用。

```sh
$ xmake ai --provider=deepseek --model=deepseek-chat
$ xmake ai --smallmodel=deepseek-chat     # 供标题/摘要/轻量子 agent 使用
```

*小模型* 用来干那些便宜的后台活儿 —— 生成会话标题、做摘要、跑轻量子 agent —— 好把主模型省给真正的任务。

## 运行

```sh
$ xmake ai                                   # 交互式界面
$ xmake ai "给 foo 加个单元测试"               # 带提示词直接开始
$ xmake ai -c                                # 继续当前目录的上一次会话
$ xmake ai -c "再把测试补上"
$ xmake ai -r                                # 交互式选择要恢复的会话
$ xmake ai -r 6a86cfc5-bbda-14ce
$ xmake ai --new                             # 强制开新会话
$ xmake ai --print "这个工程构建出什么？"       # 非交互，适合脚本和 CI
```

会话是按目录区分的，所以在另一个工程里 `-c` continue 的是另一条线程。

## 权限模式

```sh
$ xmake ai --mode=plan           # 只读，先规划再动手
$ xmake ai --mode=acceptedits    # 自动接受文件修改，执行命令仍然询问
$ xmake ai --mode=bypass         # 完全不询问
$ xmake ai --sandbox             # 在沙箱里执行命令
$ xmake ai --notools             # 纯聊天，不启用任何工具
```

面对不熟悉的仓库，`--mode=plan` 是比较稳妥的默认选择。

## 斜杠命令

在 TUI 里输入 `/` 会列出所有命令，内置的有：

| 命令 | 作用 |
| --- | --- |
| `/xmake` | 直接在这里执行 xmake，**不消耗 token**，例如 `/xmake build`、`/xmake run -d` |
| `/xmakedocs` | 拉取或更新 xmake 文档，让 agent 能查 API |
| `/skills` | 列出、安装、更新或删除 skill 包 |
| `/model` | 查看或切换模型，例如 `/model deepseek-reasoner` |
| `/context` | 查看上下文占用分布，`/context full` 保留全部 |
| `/session`、`/clear` | 管理会话、开新会话 |
| `/jobs` | 查看它启动的后台任务 |
| `/mcp` | 查看对接的 MCP 服务 |
| `/config` | 查看或设置配置项 |
| `/loop` | 按计划重复执行某个任务 |

`/xmake` 最值得记住：构建输出直接进你的终端，不进模型上下文，所以一次长编译不花任何 token。

这些命令也可以不进 TUI 直接执行：

```sh
$ xmake ai --command=doctor
$ xmake ai --command='model deepseek-reasoner'
$ xmake ai --list=skills     # 还可以是 agents、tools、commands、plugins、providers、sessions
```

## Agent Skills

Harness 加载的是和 Claude Code 相同的 [Agent Skills](https://www.anthropic.com/news/agent-skills)。它不预置任何 skill 包：只有你主动要求时才去拉取，并且总是从上游最新版本拉。

```
/skills                              查看已加载、已安装和可用的
/skills install xmake                安装已登记的包，例如 xmake-skills
/skills install github:user/repo     从 github 仓库安装
/skills install /path/to/my-skills   从本地目录安装（软链方式，方便开发）
/skills update [pack]                git pull 更新
/skills remove <pack>                删除
```

装上 [xmake-skills](https://github.com/xmake-io/xmake-skills)，它就掌握了和 Claude Code 一样的那套 xmake 知识：

```
/skills install xmake
```

Skill 是按需加载的：常驻上下文的只有一行描述，任务匹配时才会拉进完整内容。

## 工具、子 agent 和 MCP

Agent 通过一组固定的工具干活 —— 读写文件、glob、搜索文本、执行命令、抓取 url、维护 todo、启动子 agent —— 每一个都受权限模式约束。耗时长的命令会转为后台任务（`/jobs`）。

它也可以派生**子 agent** 处理独立的子任务，并通过 **MCP** 服务获得自身没有的能力（`/mcp`）。

## 数据存放位置

```
~/.xmake/harness/config.json         用户配置，含 api key
~/.xmake/harness/skills/<pack>       已安装的 skill 包
<project>/.xmake-harness/            工程配置和会话记录
```

`XMAKE_HARNESS_HOME` 可以把 harness 的主目录挪到别处。

## 注意事项

- 它需要 api key 和网络，缺什么用 `xmake ai --doctor` 一查便知。
- 脚本里只能用 `--print`，TUI 需要真实终端。
- 让它跑构建时，优先用 `/xmake build` 而不是让 agent 自己执行：结果一样，但不花 token。
