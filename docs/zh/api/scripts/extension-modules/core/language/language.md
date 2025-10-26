# core.language.language

用于获取编译语言相关信息，一般用于代码文件的操作。

## language.extensions

- 获取所有语言的代码后缀名列表

#### 函数原型

::: tip API
```lua
language.extensions()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回一个表，键为文件后缀名，值为语言源类型 |

#### 用法说明

获取所有语言的代码后缀名列表。

获取结果如下：

```lua
{
    [".c"]      = cc,
    [".cc"]     = cxx,
    [".cpp"]    = cxx,
    [".m"]      = mm,
    [".mm"]     = mxx,
    [".swift"]  = sc,
    [".go"]     = gc
}
```

## language.targetkinds

- 获取所有语言的目标类型列表

#### 函数原型

::: tip API
```lua
language.targetkinds()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回一个表，键为目标类型，值为该类型支持的链接器列表 |

#### 用法说明

获取所有语言的目标类型列表。

获取结果如下：

```lua
{
    binary = {"ld", "gcld", "dcld"},
    static = {"ar", "gcar", "dcar"},
    shared = {"sh", "dcsh"}
}
```

## language.sourcekinds

- 获取所有语言的源文件类型列表

#### 函数原型

::: tip API
```lua
language.sourcekinds()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回一个表，键为源文件类型，值为文件后缀名或后缀名列表 |

#### 用法说明

获取所有语言的源文件类型列表。

获取结果如下：

```lua
{
    cc  = ".c",
    cxx = {".cc", ".cpp", ".cxx"},
    mm  = ".m",
    mxx = ".mm",
    sc  = ".swift",
    gc  = ".go",
    rc  = ".rs",
    dc  = ".d",
    as  = {".s", ".S", ".asm"}
}
```

## language.sourceflags

- 加载所有语言的源文件编译选项名列表

#### 函数原型

::: tip API
```lua
language.sourceflags()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回一个表，键为源文件类型，值为编译选项名列表 |

#### 用法说明

加载所有语言的源文件编译选项名列表。

获取结果如下：

```lua
{
    cc  = {"cflags", "cxflags"},
    cxx = {"cxxflags", "cxflags"},
    ...
}
```

## language.load

- 加载指定语言

#### 函数原型

::: tip API
```lua
language.load(name: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。语言名称，例如 "c++", "c" |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| language | 返回语言对象，如果不存在则返回 nil |

#### 用法说明

从语言名称加载具体语言对象，例如：

```lua
local lang = language.load("c++")
if lang then
    print(lang:name())
end
```

## language.load_sk

- 从源文件类型加载指定语言

#### 函数原型

::: tip API
```lua
language.load_sk(sourcekind: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| sourcekind | 必需。源文件类型，例如 "cc", "cxx", "mm" |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| language | 返回语言对象，如果不存在则返回 nil |

#### 用法说明

从源文件类型：`cc, cxx, mm, mxx, sc, gc, as ..`加载具体语言对象，例如：

```lua
local lang = language.load_sk("cxx")
if lang then
    print(lang:name())
end
```

## language.load_ex

- 从源文件后缀名加载指定语言

#### 函数原型

::: tip API
```lua
language.load_ex(extension: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| extension | 必需。源文件后缀名，例如 ".cpp", ".c" |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| language | 返回语言对象，如果不存在则返回 nil |

#### 用法说明

从源文件后缀名：`.cc, .c, .cpp, .mm, .swift, .go  ..`加载具体语言对象，例如：

```lua
local lang = language.load_ex(".cpp")
if lang then
    print(lang:name())
end
```

## language.sourcekind_of

- 获取指定源文件的源文件类型

#### 函数原型

::: tip API
```lua
language.sourcekind_of(filepath: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| filepath | 必需。源文件路径 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回源文件类型，例如 "cxx", "cc" |

#### 用法说明

也就是从给定的一个源文件路径，获取它是属于那种源文件类型，例如：

```lua
print(language.sourcekind_of("/xxxx/test.cpp"))
```

显示结果为：`cxx`，也就是`c++`类型，具体对应列表见：[language.sourcekinds](#language-sourcekinds)
