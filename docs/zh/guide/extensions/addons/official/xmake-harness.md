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

![终端里的 xmake ai](/assets/img/harness/xmake-ai-tui.png)

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

## Web 界面

```sh
$ xmake ai --web                 # 起 web 界面，并自动打开默认浏览器
$ xmake ai --web --port=9800     # 换个端口
$ xmake ai --web --nobrowser     # 只打印 url，不开浏览器
$ xmake ai --web --cwd=/path/to/project
```

它在本地回环上起一个小的 http 服务，打印一个带 token 的 url（token 每次运行重新生成），
并用默认浏览器打开：

```
  web ui  http://127.0.0.1:9736/?token=e07091070…
  project /path/to/your/project
```

| 参数 | 说明 |
| --- | --- |
| `--web` | 启动 web 界面，而不是终端界面 |
| `--port=N` | 端口，默认 `9736`（从它开始找第一个空闲端口） |
| `--host=ADDR` | 监听地址，默认回环；`0.0.0.0` 表示所有网卡 |
| `--nobrowser` | 不打开浏览器，只打印 url |
| `--cwd=DIR` | 要打开的工程目录，默认当前目录 |
| `--mode=M` | 启动时的权限模式，默认 `acceptedits` |

打开时进入的是**当前工程的上一次会话**，而不是空会话，因为浏览器窗口会经历刷新、崩溃、合盖唤醒。想要新会话用 `--web --new`。

### 在另一台机器上用 {#web-remote}

它默认只监听回环地址，因为一个能改文件、能执行命令的服务，不该随手挂到网络上。想从另一台
机器访问，有两种做法。

第一种是 ssh 端口转发，服务本身仍然只在回环上，推荐：

```sh
# 远程机器上
$ xmake ai --web --nobrowser

# 本地
$ ssh -L 9736:127.0.0.1:9736 user@remote
```

然后在本地浏览器里打开远程打印的那个 url 即可。

第二种是直接监听对外地址：

```sh
$ xmake ai --web --host=0.0.0.0        # 所有网卡
$ xmake ai --host=192.168.1.7 --web    # 只监听某一个
```

这时它会把别的机器能用的 url 一并打印出来，因为 `127.0.0.1` 那个 url 恰恰是在别的机器上
唯一不能用的：

```
  web ui  http://127.0.0.1:9736/?token=e07091070…
  or      http://192.168.1.7:9736/?token=e07091070…

  it is listening on every interface: anything which can reach this machine
  can reach the harness, and only the token is in the way
```

::: warning 注意
监听对外地址时，挡在别人和 harness 之间的只有 url 里那个 token。**这个 url 等同于这台机器的
文件读写和命令执行权限，不要分享出去。** 在不可信的网络上，请用 ssh 端口转发，不要用
`--host=0.0.0.0`。
:::

这条路子也是一种远程开发方式：代码、构建和 agent 全在远程机器上，本地只有一个浏览器。它和
[远程编译](/zh/guide/extras/remote-compilation)解决的不是同一个问题，可以对照着看。

![web 界面：对话](/assets/img/harness/xmake-ai-web-chat.png)

后面是同一个 harness —— 同样的工具、技能、权限模式和会话文件。

它一开始是一个占满整屏的对话。当你**去看**它改了什么时（点一轮结束时那份文件列表里的某一项，
或者点对话区右上角的按钮），界面展开成工作区：左边是对话，中间是正在读的那个文件，
右边是工程文件树。

![web 界面：工作区](/assets/img/harness/xmake-ai-web-workspace.png)

中间是**文件本身** —— 整份内容、语法高亮，这次对话改过的地方标在上面：新增的行绿条，
被删掉的行红条显示在它原来的位置。它可以直接编辑 —— 打字然后 ⌘S 保存，
页面写文件走的是和 agent 写文件同一道门，会保留被替换内容的副本，
并作为「这次对话的改动」记录下来。

每个改动过的文件在右上角有两个答案，一个勾一个叉：**保留**这个改动，
或者把文件**恢复**成对话动它之前的样子。这是一个待决定列表，而且它会清空：
一个文件被决定之后就离开列表，agent 再动它时又会回来。
树上会标出哪些文件被改过、改了多少、以及决定是什么。

`/goal`、`/loop`、斜杠命令、`@` 附带文件、`!` 执行命令，在这里和终端里一样能用。
**设置**页里有工程目录、主题、服务商、模型、api key，以及技能管理：
当前加载了哪些技能、安装了哪些技能包，还有一个安装新包的输入框。

里面不含任何框架，也没有构建步骤：就是普通的 html、css 和 es module，直接由 addon 提供。
markdown 由 harness 自己渲染，事件走浏览器原生支持的 server-sent events。

服务只绑定 `127.0.0.1` 并校验 token，token 随进程结束而消失。这个 url 不要分享出去 ——
它背后是一个能改文件、能执行命令的服务。api key 不会回传给页面：
页面只显示「有没有配」，并允许替换。

权限确认和终端里一致，判断用的是同一套策略 —— 常规命令直接执行，
难以撤销的才会问一句。问题出现在对话流里面，而不是盖在页面上的弹框，
改文件时带上 diff，并推送到所有打开的标签页。

手机上也能用：导航栏移到底部，工作区一次只显示一样东西。

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
| `/xmake-docs` | 拉取或更新 xmake 文档，让 agent 能查 API |
| `/import` | 把 cmake / visual studio / meson / scons 工程转成 xmake |
| `/skills` | 列出、安装、更新或删除 skill 包 |
| `/agents` | 列出、安装、更新或删除子 agent |
| `/goal` | 朝一个目标反复推进直到达成，如 `/goal 让测试全过` |
| `/trust` | 这个目录能对 agent 说什么 |
| `/reload` | 重新读取配置、skills、子 agent、命令 |
| `/model` | 查看或切换模型，例如 `/model deepseek-reasoner` |
| `/context` | 查看上下文占用分布，`/context full` 保留全部 |
| `/sessions`、`/clear` | 管理会话、开新会话 |
| `/jobs` | 查看它启动的后台任务 |
| `/mcp` | 查看对接的 MCP 服务 |
| `/config` | 查看或设置配置项 |
| `/loop` | 按周期重复一个任务，例如 `/loop 30m 看看 ci` |
| `/rewind` | 把文件恢复到某次请求之前的样子 |

`/xmake` 最值得记住：构建输出直接进你的终端，不进模型上下文，所以一次长编译不花任何 token。

这些命令也可以不进 TUI 直接执行：

```sh
$ xmake ai --command=doctor
$ xmake ai --command='model deepseek-reasoner'
$ xmake ai --list=skills     # 还可以是 agents、tools、commands、plugins、providers、sessions
```

## 会话与上下文

每一轮都会追加到磁盘上的日志里，按工程区分。关掉终端不会丢东西：

```sh
$ xmake ai -c              # 继续当前目录下最近的一次对话
$ xmake ai -r              # 从本工程的会话里挑一个
$ xmake ai -r 6a86cfc5     # 直接恢复指定的那个
$ xmake ai --new           # 即使配了 -c，也强制新开一个
```

对话接近模型上下文窗口时会自动压缩：小模型把较早的轮次写成摘要，日志从摘要继续。
`/context` 看窗口被什么占着，`/compact` 立刻压缩，`/cost` 看 token 消耗和缓存命中率。

## 耗时长的命令

一次二十分钟的构建不该把对话扣为人质。慢的东西可以在旁边跑：

- agent 把它作为**后台任务**启动，自己接着干别的，随时收取新输出
- 它已经在前台跑的命令，你可以在执行期间按 **`ctrl+b`** 自己把它丢到后台 —— 命令继续跑，这一轮继续走
- `/jobs` 列出全部，`/jobs kill <id>` 停掉一个

后台任务属于当前会话，会话结束时全部停止 —— 绝不会给你留下一个你没启动、也看不见的进程。

## 撤销它做过的修改

一个改了十二个文件、第十一个改错了的 agent，会让你除了 git 无路可退 —— 而**会话开始前就躺在工作区里的那些活儿，恰恰是 git 没有的**。

所以每次写入都会留下被覆盖的内容。`/rewind` 列出可以回到的点（每个改动过文件的请求一个），`/rewind <n>` 把那之后动过的每个文件恢复到当时的内容 —— 包括**删掉那些原本不存在的新文件**。执行前会先确认，因为那之后你手工改的东西也会被覆盖。

**它只撤销编辑，别的一概不管。** agent 跑过的命令、通过 shell 删掉的文件、工程之外的任何改动 —— 都没有记录，`/rewind` 也不会假装能收拾。


## 答案的出处

回答落在代码某个具体位置时，agent 会写成 `src/main.cpp:42`，多数终端会把它变成可点击的。

**这个引用在显示前会被校验**：指向不存在的文件，或超出文件实际行数的，会用错误色渲染。
一个引用了自己从没读过的行的模型，比什么都不说的更有说服力，而且一样是错的。

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

它**识别现实中存在的各种布局**，而不是强求自己那一种 —— Claude 的 `SKILL.md` 目录、
Claude 的 plugin 与 marketplace、单文件 skill，或者一个 `.zip` 包。
两个 skill 抢同一个名字时会**明确报告**而不是悄悄丢弃；
指向你已经在用的工具时，目录是**软链接**而不是拷贝：

```
/skills install ~/.claude            你已经有的 claude skills
/skills install ./bundle.zip         打包好的 bundle
```

已安装的包每天在后台检查一次上游，有更新会在下次启动时提示。**不问过你就绝不拉取。**

## 把已有工程导入进来

用 CMake、Visual Studio、Meson 或 SCons 构建的工程，一条命令转过来：

```
/import
```

转换分成两半，而**这个切分本身就是它值得这么做的原因** —— 而不是把 `CMakeLists.txt`
原文丢给模型去读。**事实**（有哪些 target、什么类型、源文件、包含目录、宏定义、依赖）
是确定性读出来的，只有一个正确答案；**判断**（没求值的 `if(WIN32)`、一个属于 CMake
而不属于 xmake-repo 的 `find_package(Foo)` 名字、某个其实是 rule 的 flag）会连同
**它出自哪个文件的哪一行**一起列出来 —— 那才是 agent 真正要做的事。

编译选项是**翻译**而不是照搬，这是转换结果读起来舒服的主要原因：

```cmake
target_compile_options(demo PRIVATE -fvisibility=hidden -Wall -Wextra -O2 -g -std=c++17 -fPIC)
target_link_libraries(demo PRIVATE m pthread z)
```
```lua
target("demo")
    set_kind("binary")
    set_languages("c++17")
    set_warnings("all", "extra")
    set_symbols("hidden")
    add_files("src/main.cpp")
    add_links("z")
    add_syslinks("m", "pthread")
```

`-O2` 和 `-g` 没了，因为 `mode.debug` / `mode.release` 已经设了，而且它们的答案在每个
编译器上都对。`-fPIC` 没了，因为 xmake 对动态库本来就加。`m` 和 `pthread` 是系统库；
`z` 不是，所以留着并附一个问题 —— 按名字链接的库大多应该是 `add_requires`，
而只有 `xrepo search` 能回答是哪个。**没有一处是悄悄丢的。**

最后它会自己验一遍：能不能配置、能不能编译、**target 是不是跟原来一样多**。
能编译不等于没漏 —— 悄悄少一个 target 照样编译得好好的，这一步就是抓它的。

## 工具、子 agent 和 MCP

Agent 通过一组固定的工具干活 —— 读写文件、glob、搜索文本、执行命令、抓取 url、维护 todo、启动子 agent —— 每一个都受权限模式约束。耗时长的命令会转为后台任务（`/jobs`）。

它也可以派生**子 agent** 处理独立的子任务 —— 每个子 agent 有自己的 prompt、工具集、模型和
上下文窗口，只把结论报回来 —— 并通过 **MCP** 服务获得自身没有的能力（`/mcp`）。

多个子 agent 还能**一次接收整个计划**：互不相干的探索并发跑，需要它们结果的节点等齐再启动，
只有最后的节点回报主对话。于是一次全代码库的摸底，主对话只付一段话的代价，而不是四十次文件读取。

子 agent 的安装和编写方式跟 skills 完全一样：

```
/agents                              已加载的、已安装的、可安装的
/agents install github:user/repo     装一个包
/agents install ~/my-agents          本地目录
/agents remove <包名>
/agents disable <名字>
```

一个子 agent 就是一个 markdown 文件：一个名字、一句描述、一段指令。
需要的不止这些时，写成目录：

```
my-porter/
    AGENT.md            提示词，以及它能用哪些工具
    agent.lua           可选：在第一次请求之前它自己先查清楚的东西
    skills/             它要读的技能，跟着一起装
```

`agent.lua` 是给「第一步永远是同一条命令」的 agent 用的。做工程转换的那个就用了它：
探测构建系统、读取工程，每次答案都一样，所以在第一次请求之前就做完 ——
**它一出场就已经知道自己在看什么了**。

## 数据存放位置

```
~/.xmake/harness/config.json         用户配置，含 api key
~/.xmake/harness/skills/<pack>       已安装的 skill 包
~/.xmake/harness/agents/<pack>       已安装的子 agent 包
~/.xmake/harness/projects/<工程>      该工程的会话记录
<project>/.xmake-harness/            工程级配置、skills、agents、命令
```

`XMAKE_HARNESS_HOME` 可以把 harness 的主目录挪到别处。

## 注意事项

- 它需要 api key 和网络，缺什么用 `xmake ai --doctor` 一查便知。
- 脚本里只能用 `--print`，TUI 需要真实终端。
- 让它跑构建时，优先用 `/xmake build` 而不是让 agent 自己执行：结果一样，但不花 token。
