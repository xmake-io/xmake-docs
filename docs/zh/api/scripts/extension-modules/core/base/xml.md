# core.base.xml

此模块提供了一个轻量级的 DOM 风格 XML 工具包，可在 Xmake 的沙箱环境中工作。它专注于可预测的数据结构、类似 JSON 的易用性，以及可选的流式解析，使您可以在不构建整个树的情况下解析大型 XML 文档。

::: tip 提示
使用此模块需要先导入：`import("core.base.xml")`
:::

XML 模块特性：
- 使用普通 Lua 表的 DOM 风格节点结构
- 用于大文件的流式解析器（`xml.scan`）
- 类似 XPath 的查询（`xml.find`）
- 便捷的文件 I/O 辅助函数（`xml.loadfile`，`xml.savefile`）
- 支持注释、CDATA、DOCTYPE 和未引用的属性
- 可自定义缩进的格式化输出

XML 节点是具有以下结构的普通 Lua 表：

```lua
{
    name     = "element-name" | nil,  -- 仅用于元素节点
    kind     = "element" | "text" | "comment" | "cdata" | "doctype" | "document",
    attrs    = { key = value, ... } or nil,
    text     = string or nil,
    children = { child1, child2, ... } or nil,
    prolog   = { comment/doctype nodes before root } or nil
}
```

## xml.decode

- 解析 XML 字符串为文档节点

#### 函数原型

::: tip API
```lua
xml.decode(xml_string: <string>, options?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| xml_string | 要解析的 XML 字符串 |
| options | 可选的解析选项表 |

#### 选项

| 选项 | 描述 |
|------|------|
| `trim_text = true` | 去除文本节点中的前导/尾随空格 |
| `keep_whitespace_nodes = true` | 保留仅包含空白字符的文本节点 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 文档节点（XML 树的根） |

#### 用法说明

```lua
import("core.base.xml")

local doc = assert(xml.decode([[
<?xml version="1.0"?>
<root id="1">
  <item id="foo">hello</item>
</root>
]]))
```

## xml.encode

- 将文档节点编码为 XML 字符串

#### 函数原型

::: tip API
```lua
xml.encode(doc: <table>, options?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| doc | 要编码的文档节点 |
| options | 可选的编码选项表 |

#### 选项

| 选项 | 描述 |
|------|------|
| `pretty = true` | 启用格式化输出 |
| `indent` | 缩进的空格数（默认：2） |
| `indentchar` | 用于缩进的字符（默认：" "） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | XML 字符串表示 |

#### 用法说明

```lua
import("core.base.xml")

local doc = xml.decode("<root><item>hello</item></root>")
local pretty = assert(xml.encode(doc, {pretty = true, indent = 2}))
```

## xml.loadfile

- 从文件加载 XML 文档

#### 函数原型

::: tip API
```lua
xml.loadfile(filepath: <string>, options?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| filepath | XML 文件路径 |
| options | 可选的解析选项表（与 `xml.decode` 相同） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 文档节点 |

#### 用法说明

```lua
import("core.base.xml")

local plist = assert(xml.loadfile("Info.plist"))
```

## xml.savefile

- 将 XML 文档保存到文件

#### 函数原型

::: tip API
```lua
xml.savefile(filepath: <string>, doc: <table>, options?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| filepath | 保存 XML 文件的路径 |
| doc | 要保存的文档节点 |
| options | 可选的编码选项表（与 `xml.encode` 相同） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 成功返回 true |

#### 用法说明

```lua
import("core.base.xml")

local doc = xml.loadfile("Info.plist")
-- ... 修改节点 ...
assert(xml.savefile("Info.plist", doc, {pretty = true, indent = 2}))
```

## xml.find

- 使用类似 XPath 的查询查找节点

#### 函数原型

::: tip API
```lua
xml.find(doc: <table>, xpath: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| doc | 文档节点或要搜索的任意节点 |
| xpath | 类似 XPath 的查询字符串 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table\|nil | 找到的节点，如果未找到则返回 nil |

#### 用法说明

```lua
import("core.base.xml")

local doc = assert(xml.loadfile("config.xml"))

-- 通过路径查找
local element = xml.find(doc, "/root/item")

-- 通过属性查找
local item = xml.find(doc, "//item[@id='foo']")

-- 通过文本内容查找
local node = xml.find(doc, "//string[text()='value']")
```

## xml.scan

- 流式解析 XML 并为每个节点调用回调函数

#### 函数原型

::: tip API
```lua
xml.scan(xml_string: <string>, callback: <function>, options?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| xml_string | 要解析的 XML 字符串 |
| callback | 为每个节点调用的函数：`function(node) -> boolean` |
| options | 可选的解析选项表（与 `xml.decode` 相同） |

#### 回调返回值

从回调函数返回 `false` 会立即停止扫描。

#### 用法说明

```lua
import("core.base.xml")

local found
xml.scan(plist_text, function(node)
    if node.name == "key" and xml.text_of(node) == "NSPrincipalClass" then
        found = node
        return false -- 提前终止
    end
end)
```

`xml.scan` 在节点完成时遍历它们；返回 `false` 会立即停止扫描。这对于只需要几个条目的大文件非常理想。

## xml.text_of

- 获取节点的文本内容

#### 函数原型

::: tip API
```lua
xml.text_of(node: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| node | 要提取文本的节点 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 节点的文本内容 |

#### 用法说明

```lua
import("core.base.xml")

local node = xml.find(doc, "//item[@id='foo']")
local text = xml.text_of(node)  -- 返回 "hello"
```

## xml.text

- 创建文本节点

#### 函数原型

::: tip API
```lua
xml.text(text: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| text | 文本内容 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 文本节点 |

#### 用法说明

```lua
import("core.base.xml")

local textnode = xml.text("hello")
```

## xml.empty

- 创建空元素节点

#### 函数原型

::: tip API
```lua
xml.empty(name: <string>, attrs?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 元素名称 |
| attrs | 可选的属性表 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 元素节点 |

#### 用法说明

```lua
import("core.base.xml")

local empty = xml.empty("br", {class = "line"})
```

## xml.comment

- 创建注释节点

#### 函数原型

::: tip API
```lua
xml.comment(text: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| text | 注释文本 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 注释节点 |

#### 用法说明

```lua
import("core.base.xml")

local comment = xml.comment("generated by xmake")
```

## xml.cdata

- 创建 CDATA 节点

#### 函数原型

::: tip API
```lua
xml.cdata(text: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| text | CDATA 文本 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | CDATA 节点 |

#### 用法说明

```lua
import("core.base.xml")

local cdata_node = xml.cdata("if (value < 1) {...}")
```

## xml.doctype

- 创建 DOCTYPE 节点

#### 函数原型

::: tip API
```lua
xml.doctype(declaration: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| declaration | DOCTYPE 声明字符串 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | DOCTYPE 节点 |

#### 用法说明

```lua
import("core.base.xml")

local doctype = xml.doctype('plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"')
```

## 完整示例

```lua
import("core.base.xml")

-- 解析 XML 字符串
local doc = assert(xml.decode([[
<?xml version="1.0"?>
<root id="1">
  <item id="foo">hello</item>
</root>
]]))

-- 查找并修改节点
local item = assert(xml.find(doc, "//item[@id='foo']"))
item.attrs.lang = "en"             -- 直接修改属性
item.children = {xml.text("world")} -- 替换现有文本节点

-- 添加注释
table.insert(doc.children, xml.comment("generated by xmake"))

-- 使用格式化输出编码
local pretty = assert(xml.encode(doc, {pretty = true}))
assert(xml.savefile("out.xml", doc, {pretty = true}))
```
