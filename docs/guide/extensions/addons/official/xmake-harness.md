---
outline: deep
---

# xmake-harness (`xmake ai`)

[xmake-harness](https://github.com/xmake-addons/xmake-harness) is an AI agent harness
written entirely in xmake lua, with no third-party dependency. Installed as an addon it
provides `xmake ai`: a terminal coding agent which already sits inside your project and can
build it.

It is two things at once:

1. **A generic agent framework** — the session log, the agent loop, the tool pipeline, the
   permission policy, the sandbox, the skills, the subagents, the slash commands and the
   terminal ui.
2. **An xmake addon** — `xmake ai`, whose interaction follows Claude Code closely, with
   first-class knowledge of the xmake build.

## Installation

```sh
$ xmake addon --install xmake-harness
$ xmake ai --setup
```

`--setup` is an interactive wizard: pick a provider, paste an api key, choose the models.
You can also install it straight from the repository:

```sh
$ xmake addon --install github:xmake-addons/xmake-harness
```

## Configuration

The configuration is merged from five layers, later ones win:

1. the builtin defaults
2. the user config, `~/.xmake/harness/config.json`
3. the project config, `<project>/.xmake-harness/config.json`
4. the environment variables, `XMAKE_HARNESS_*`
5. the command line options of `xmake ai`

Only the user layer is written by the harness, so **an api key never lands in a project
repository**.

```sh
$ xmake ai --config=providers.deepseek.apikey=sk-xxxxxx   # set one value and exit
$ xmake ai --config=ui.theme=light
$ xmake ai --apikey=sk-xxxxxx                             # key of the current provider
$ xmake ai --showconfig                                   # the resolved configuration
$ xmake ai --doctor                                       # check the environment
```

Inside the tui the same thing is reachable with `/config`, `/model` and `/provider`.
`/config` never prints a key in full.

### Providers and models

The builtin providers are `deepseek` (default), `anthropic`, `openai`, `moonshot`,
`dashscope`, `siliconflow`, `openrouter` and `zhipu`. Any OpenAI-compatible endpoint works
by setting a `baseurl`.

```sh
$ xmake ai --provider=deepseek --model=deepseek-chat
$ xmake ai --smallmodel=deepseek-chat     # used by the title/summary/light subagents
```

A *small model* is used for the cheap background work — session titles, summaries, light
subagents — so the main model is spent only on the real task.

## Running it

```sh
$ xmake ai                                   # interactive tui
$ xmake ai "add a unit test for foo"         # start with a prompt
$ xmake ai -c                                # continue the last session of this directory
$ xmake ai -c "and now add the tests"
$ xmake ai -r                                # pick a session to resume
$ xmake ai -r 6a86cfc5-bbda-14ce
$ xmake ai --new                             # force a new session
$ xmake ai --print "what does this build?"   # non-interactive, for scripts and ci
```

Sessions are per directory, so `-c` in another project continues a different thread.

## Permission modes

```sh
$ xmake ai --mode=plan           # read-only, it plans before touching anything
$ xmake ai --mode=acceptedits    # auto-accept file edits, still asks before commands
$ xmake ai --mode=bypass         # no prompts at all
$ xmake ai --sandbox             # confine the commands it runs
$ xmake ai --notools             # chat only, no tools
```

`--mode=plan` is the sane default when you point it at an unfamiliar repository.

## Slash commands

Inside the tui, `/` opens the command list. The built-in ones:

| Command | What it does |
| --- | --- |
| `/xmake` | run xmake here **without spending tokens**, e.g. `/xmake build`, `/xmake run -d` |
| `/xmakedocs` | fetch or update the xmake documentation so the agent can look the apis up |
| `/skills` | list, install, update or remove skill packs |
| `/model` | show or switch the model, e.g. `/model deepseek-reasoner` |
| `/context` | show the context breakdown, `/context full` keeps everything |
| `/session`, `/clear` | manage the conversation, start a new session |
| `/jobs` | the background jobs it started |
| `/mcp` | the MCP servers it talks to |
| `/config` | show or set a configuration value |
| `/loop` | repeat a task on a schedule |

`/xmake` is the one to remember: the build output goes to your terminal, not into the
model's context, so a long compile costs nothing.

Any command also runs without entering the tui:

```sh
$ xmake ai --command=doctor
$ xmake ai --command='model deepseek-reasoner'
$ xmake ai --list=skills     # also: agents, tools, commands, plugins, providers, sessions
```

## Agent skills

The harness loads the same [Agent Skills](https://www.anthropic.com/news/agent-skills) as
Claude Code. Nothing is bundled: packs are fetched only when you ask, and always from
upstream.

```
/skills                              what is loaded, installed and available
/skills install xmake                a registered pack, e.g. xmake-skills
/skills install github:user/repo     a github repository
/skills install /path/to/my-skills   a local directory (linked, for development)
/skills update [pack]                git pull
/skills remove <pack>                delete it
```

Installing [xmake-skills](https://github.com/xmake-io/xmake-skills) teaches it the same
xmake know-how it teaches Claude Code:

```
/skills install xmake
```

A skill is loaded on demand: only its one-line description stays in context, the body is
pulled in when the task matches it.

## Tools, agents and MCP

The agent works through a fixed tool set — reading and writing files, globbing, searching
text, running commands, fetching urls, tracking todos, launching subagents — each of them
gated by the permission mode. Long-running commands become background jobs (`/jobs`).

It can also spawn **subagents** for isolated work, and talk to **MCP servers** for the
capabilities it does not have itself (`/mcp`).

## Where it stores things

```
~/.xmake/harness/config.json         the user config, including the api keys
~/.xmake/harness/skills/<pack>       the installed skill packs
<project>/.xmake-harness/            the project config and its sessions
```

`XMAKE_HARNESS_HOME` moves the harness home somewhere else.

## Gotchas

- It needs an api key and network access — `xmake ai --doctor` tells you what is missing.
- `--print` is the only mode safe to run from a script; the tui expects a real terminal.
- Prefer `/xmake build` over asking the agent to run the build: same result, no tokens.
