# AI Q&A Optimization {#ai-qa-optimization}

<ClientOnly>
  <AIAssistant />
</ClientOnly>

When asking questions about xmake to AI assistants (such as Claude Code, ChatGPT, Cursor, etc.), using some techniques can help AI better understand the context and provide more accurate, higher-quality answers.

## Use Xmake Agent Skills (Recommended) {#agent-skills}

For AI coding assistants that support [Agent Skills](https://www.anthropic.com/news/agent-skills) (such as Claude Code), the easiest option is to install [**xmake-skills**](https://github.com/xmake-io/xmake-skills).

It provides a curated collection of task-focused skills covering project configuration, toolchains, cross-compilation, packages, testing, packaging, scripting, performance tuning, troubleshooting, and per-language support (Rust, Go, Swift, CUDA, Objective-C, D, Fortran, etc.).

### Installation {#install-skills}

Install directly from GitHub in Claude Code:

```bash
claude plugins install xmake-io/xmake-skills
```

Or add it as a marketplace first, then install:

```bash
# In a Claude Code interactive session
/plugin marketplace add xmake-io/xmake-skills
/plugin install xmake-skills
```

For other agent platforms, clone the repository manually and install the skills under `skills/` following your platform's documentation:

```bash
git clone https://github.com/xmake-io/xmake-skills.git
```

### Why This Is Recommended {#why-skills}

- **Loaded on demand, token-efficient**: The trigger descriptions of all skills add up to only about 4k tokens, which stay in context, while the full body of a skill is loaded only when the task matches it. By contrast, the whole `llms-full.txt` documentation is close to 1.5M tokens — it does not even fit in most conversations, and it crowds out the context that actually matters.
- **Grounded in real xmake behavior**: Each skill describes *when* the agent should load it, so the assistant pulls in only the documentation relevant to the task at hand — avoiding hallucinated APIs and outdated flags.
- **No prompt pasting**: Install once and just ask your question; the assistant decides which documentation to load.

## Use `xmake ai` in the Terminal {#xmake-harness}

[**xmake-harness**](https://github.com/xmake-addons/xmake-harness) is an agent harness
written entirely in xmake lua. Installed as an addon it gives you `xmake ai` — a terminal
coding agent that already sits inside your project and can build it.

```bash
xmake addon --install xmake-harness
xmake ai --setup                     # provider, api key, model
xmake ai                             # interactive tui
xmake ai --print "what does this build?"   # non-interactive, for scripts and ci
```

Because it is an xmake addon it runs the build itself, reads the project configuration, and
loads the same [xmake-skills](https://github.com/xmake-io/xmake-skills) as Claude Code:

```
/skills install xmake
```

::: tip
The configuration layers, the providers, the permission modes, the slash commands
(`/xmake`, `/skills`, `/context` …) and the skill management are covered in detail in
[xmake-harness](/guide/extensions/addons/official/xmake-harness).
:::

## Let AI Look Up the Docs On Demand {#reference-docs}

If you use a regular chat-style AI assistant (without Agent Skills support) that can browse the web, have it **look up documentation on demand** instead of reading the entire documentation at once:

1. Documentation index: [https://xmake.io/llms.txt](https://xmake.io/llms.txt) — titles and links of all documentation pages
2. Every documentation page has a Markdown source: just append `.md` to the page path, e.g. [https://xmake.io/guide/basic-commands/build-targets.md](https://xmake.io/guide/basic-commands/build-targets.md)

The corresponding prompt:

```
Answer based on the official xmake documentation, do not guess APIs from memory:
1. First fetch the documentation index https://xmake.io/llms.txt
2. Pick the 1-3 most relevant pages and fetch their Markdown source
3. Answer only from the documentation content, and say so if the docs do not cover it

My question: How do I configure a target that uses C++20 modules?
```

::: tip About llms-full.txt
[https://xmake.io/llms-full.txt](https://xmake.io/llms-full.txt) contains the full content of the entire documentation — nearly 5 MB, about 1.5M tokens. It is better suited to offline indexing or building a RAG pipeline. Having an AI read it directly in a conversation is not recommended: it consumes a huge amount of tokens and makes it harder for the model to focus on what matters.
:::

## Provide Complete Context Information {#provide-context}

When asking questions, try to provide complete context information, including:

- **Project Type**: Is it a C/C++ project, Swift project, or other language
- **Target Platform**: Windows, Linux, macOS, Android, iOS, etc.
- **Compiler**: Toolchain used (gcc, clang, msvc, etc.)
- **Specific Requirements**: What functionality you want to implement or what problem you want to solve
- **Error Messages**: If you encounter problems, provide complete error messages

Example:

```
Project Type: C++ project
Platform: Linux
Compiler: gcc-12
Problem: I want to configure a target in xmake.lua that uses C++20 modules, but I don't know how to set it up.
Current xmake.lua content:
[Paste your xmake.lua content]
```

## Reference Specific API Documentation {#reference-api}

If the question involves specific APIs, link the corresponding documentation page directly — this is more precise than letting the AI search for it:

```
Please refer to https://xmake.io/api/description/project-target.md to help me configure:
1. How to set the target's compilation mode (debug/release)
2. How to add precompiled header file support
```

## Provide Code Examples {#provide-code}

When asking questions, if possible, provide your current code or configuration:

```
Help me optimize the following xmake.lua configuration:

target("mytarget")
    set_kind("binary")
    add_files("src/*.cpp")

I want to add the following features:
- Enable C++20 standard
- Add precompiled header files
- Configure different optimization options for debug and release modes
```

## Clarify Question Type {#clarify-question}

When asking questions, clearly state the question type:

- **Configuration Question**: How to configure a certain feature
- **Compilation Question**: Errors encountered during compilation
- **Performance Question**: Build speed optimization
- **Best Practice**: How to better use a certain feature

Example:

```
This is a configuration question:

I want to configure CUDA project compilation in xmake, and need:
1. Specify CUDA SDK version
2. Set GPU architecture
3. Configure compilation options
```

## Ask Step by Step {#step-by-step}

For complex questions, you can ask step by step:

```
Help me configure step by step:

Step 1: How to create a basic C++ target
Step 2: How to add dependency packages
Step 3: How to configure cross-compilation
```

## Verify Answer Accuracy {#verify}

AI answers may not be completely accurate. It is recommended to:

1. **Consult Official Documentation**: Verify whether the APIs and usage provided by AI are correct. You can refer to the [API Reference](/api/description/specification) and [Guide](/guide/introduction)
2. **Actually Test**: Actually test the configuration provided by AI in your project
3. **Cross-verify**: If possible, ask questions in different ways to verify answer consistency

## Example: Complete Question Template {#template}

```
Answer based on the official xmake documentation, do not guess APIs from memory:
First fetch the documentation index https://xmake.io/llms.txt, then fetch the Markdown source of the most relevant pages before answering.

Project Information:
- Type: C++ project
- Platform: Linux
- Compiler: clang-15
- Standard: C++20

Current Problem:
I want to configure a target that uses C++20 modules, but encountered a compilation error.

Current Configuration:
target("mymodule")
    set_kind("binary")
    set_languages("c++20")
    add_files("src/*.cpp")

Error Message:
[Paste error message]

Please help me:
1. Analyze the cause of the problem
2. Provide the correct configuration method
3. Give a complete example code
```

Through the above methods, you can help AI better understand your needs and provide more accurate and useful answers.
