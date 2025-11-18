# AI Q&A Optimization {#ai-qa-optimization}

<ClientOnly>
  <AIAssistant />
</ClientOnly>

When asking questions about xmake to AI assistants (such as ChatGPT, Claude, Cursor, etc.), using some techniques can help AI better understand the context and provide more accurate, higher-quality answers.

## Provide Reference Documentation Links

When asking questions, explicitly providing xmake's LLMs reference documentation link can help AI quickly understand xmake's complete API and features.

Reference documentation link: [https://xmake.io/llms-full.txt](https://xmake.io/llms-full.txt)

```
Please refer to https://xmake.io/llms-full.txt before answering my question: ...
```

Or more specifically:

```
Please read https://xmake.io/llms-full.txt first to understand xmake's API and features, then answer:
How do I configure a target that uses C++20 modules?
```

## Provide Complete Context Information

When asking questions, try to provide complete context information, including:

- **Project Type**: Is it a C/C++ project, Swift project, or other language
- **Target Platform**: Windows, Linux, macOS, Android, iOS, etc.
- **Compiler**: Toolchain used (gcc, clang, msvc, etc.)
- **Specific Requirements**: What functionality you want to implement or what problem you want to solve
- **Error Messages**: If you encounter problems, provide complete error messages

Example:

```
Please refer to https://xmake.io/llms-full.txt to help me solve the following problem:

Project Type: C++ project
Platform: Linux
Compiler: gcc-12
Problem: I want to configure a target in xmake.lua that uses C++20 modules, but I don't know how to set it up.
Current xmake.lua content:
[Paste your xmake.lua content]
```

## Reference Specific API Documentation

If the question involves specific APIs, you can reference relevant documentation links when asking:

```
Please refer to the target-related APIs in https://xmake.io/llms-full.txt to help me configure:
1. How to set the target's compilation mode (debug/release)
2. How to add precompiled header file support
```

## Provide Code Examples

When asking questions, if possible, provide your current code or configuration:

```
Please refer to https://xmake.io/llms-full.txt to help me optimize the following xmake.lua configuration:

target("mytarget")
    set_kind("binary")
    add_files("src/*.cpp")

I want to add the following features:
- Enable C++20 standard
- Add precompiled header files
- Configure different optimization options for debug and release modes
```

## Clarify Question Type

When asking questions, clearly state the question type:

- **Configuration Question**: How to configure a certain feature
- **Compilation Question**: Errors encountered during compilation
- **Performance Question**: Build speed optimization
- **Best Practice**: How to better use a certain feature

Example:

```
Please refer to https://xmake.io/llms-full.txt. This is a configuration question:

I want to configure CUDA project compilation in xmake, and need:
1. Specify CUDA SDK version
2. Set GPU architecture
3. Configure compilation options
```

## Ask Step by Step

For complex questions, you can ask step by step:

```
Please refer to https://xmake.io/llms-full.txt to help me configure step by step:

Step 1: How to create a basic C++ target
Step 2: How to add dependency packages
Step 3: How to configure cross-compilation
```

## Verify Answer Accuracy

AI answers may not be completely accurate. It is recommended to:

1. **Consult Official Documentation**: Verify whether the APIs and usage provided by AI are correct. You can refer to the [API Reference](/api/description/specification) and [Guide](/guide/introduction)
2. **Actually Test**: Actually test the configuration provided by AI in your project
3. **Cross-verify**: If possible, ask questions in different ways to verify answer consistency

## Example: Complete Question Template

```
Please refer to https://xmake.io/llms-full.txt to understand xmake's complete API and features.

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

