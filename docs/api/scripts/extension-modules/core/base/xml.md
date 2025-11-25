# core.base.xml

This module provides a lightweight DOM-style XML toolkit that works inside Xmake's sandbox environment. It focuses on predictable data structures, JSON-like usability, and optional streaming so you can parse large XML documents without building the entire tree.

::: tip TIP
To use this module, you need to import it first: `import("core.base.xml")`
:::

The XML module features:
- DOM-style node structure using plain Lua tables
- Streaming parser for large files (`xml.scan`)
- XPath-like queries (`xml.find`)
- Convenient file I/O helpers (`xml.loadfile`, `xml.savefile`)
- Support for comments, CDATA, DOCTYPE, and unquoted attributes
- Pretty printing with customizable indentation


XML nodes are plain Lua tables with the following structure:

```lua
{
    name     = "element-name" | nil,  -- only for element nodes
    kind     = "element" | "text" | "comment" | "cdata" | "doctype" | "document",
    attrs    = { key = value, ... } or nil,
    text     = string or nil,
    children = { child1, child2, ... } or nil,
    prolog   = { comment/doctype nodes before root } or nil
}
```

## xml.decode

- Parse XML string into a document node

#### Function Prototype

::: tip API
```lua
xml.decode(xml_string: <string>, options?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| xml_string | XML string to parse |
| options | Optional table with parsing options |

#### Options

| Option | Description |
|--------|-------------|
| `trim_text = true` | Trim leading/trailing whitespace from text nodes |
| `keep_whitespace_nodes = true` | Keep text nodes that contain only whitespace |

#### Return Value

| Type | Description |
|------|-------------|
| table | Document node (root of the XML tree) |

#### Usage

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

- Encode document node to XML string

#### Function Prototype

::: tip API
```lua
xml.encode(doc: <table>, options?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| doc | Document node to encode |
| options | Optional table with encoding options |

#### Options

| Option | Description |
|--------|-------------|
| `pretty = true` | Enable pretty printing |
| `indent` | Number of spaces for indentation (default: 2) |
| `indentchar` | Character to use for indentation (default: " ") |

#### Return Value

| Type | Description |
|------|-------------|
| string | XML string representation |

#### Usage

```lua
import("core.base.xml")

local doc = xml.decode("<root><item>hello</item></root>")
local pretty = assert(xml.encode(doc, {pretty = true, indent = 2}))
```

## xml.loadfile

- Load XML document from file

#### Function Prototype

::: tip API
```lua
xml.loadfile(filepath: <string>, options?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filepath | Path to XML file |
| options | Optional table with parsing options (same as `xml.decode`) |

#### Return Value

| Type | Description |
|------|-------------|
| table | Document node |

#### Usage

```lua
import("core.base.xml")

local plist = assert(xml.loadfile("Info.plist"))
```

## xml.savefile

- Save XML document to file

#### Function Prototype

::: tip API
```lua
xml.savefile(filepath: <string>, doc: <table>, options?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| filepath | Path to save XML file |
| doc | Document node to save |
| options | Optional table with encoding options (same as `xml.encode`) |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success |

#### Usage

```lua
import("core.base.xml")

local doc = xml.loadfile("Info.plist")
-- ... modify nodes ...
assert(xml.savefile("Info.plist", doc, {pretty = true, indent = 2}))
```

## xml.find

- Find node using XPath-like query

#### Function Prototype

::: tip API
```lua
xml.find(doc: <table>, xpath: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| doc | Document node or any node to search from |
| xpath | XPath-like query string |

#### Return Value

| Type | Description |
|------|-------------|
| table\|nil | Found node or nil if not found |

#### Usage

```lua
import("core.base.xml")

local doc = assert(xml.loadfile("config.xml"))

-- Find by path
local element = xml.find(doc, "/root/item")

-- Find by attribute
local item = xml.find(doc, "//item[@id='foo']")

-- Find by text content
local node = xml.find(doc, "//string[text()='value']")
```

## xml.scan

- Stream parse XML and call callback for each node

#### Function Prototype

::: tip API
```lua
xml.scan(xml_string: <string>, callback: <function>, options?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| xml_string | XML string to parse |
| callback | Function called for each node: `function(node) -> boolean` |
| options | Optional table with parsing options (same as `xml.decode`) |

#### Callback Return Value

Return `false` from the callback to stop scanning immediately.

#### Usage

```lua
import("core.base.xml")

local found
xml.scan(plist_text, function(node)
    if node.name == "key" and xml.text_of(node) == "NSPrincipalClass" then
        found = node
        return false -- early terminate
    end
end)
```

`xml.scan` walks nodes as they are completed; returning `false` stops the scan immediately. This is ideal for large files when you only need a few entries.

## xml.text_of

- Get text content of a node

#### Function Prototype

::: tip API
```lua
xml.text_of(node: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| node | Node to extract text from |

#### Return Value

| Type | Description |
|------|-------------|
| string | Text content of the node |

#### Usage

```lua
import("core.base.xml")

local node = xml.find(doc, "//item[@id='foo']")
local text = xml.text_of(node)  -- Returns "hello"
```

## xml.text

- Create a text node

#### Function Prototype

::: tip API
```lua
xml.text(text: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| text | Text content |

#### Return Value

| Type | Description |
|------|-------------|
| table | Text node |

#### Usage

```lua
import("core.base.xml")

local textnode = xml.text("hello")
```

## xml.empty

- Create an empty element node

#### Function Prototype

::: tip API
```lua
xml.empty(name: <string>, attrs?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Element name |
| attrs | Optional attributes table |

#### Return Value

| Type | Description |
|------|-------------|
| table | Element node |

#### Usage

```lua
import("core.base.xml")

local empty = xml.empty("br", {class = "line"})
```

## xml.comment

- Create a comment node

#### Function Prototype

::: tip API
```lua
xml.comment(text: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| text | Comment text |

#### Return Value

| Type | Description |
|------|-------------|
| table | Comment node |

#### Usage

```lua
import("core.base.xml")

local comment = xml.comment("generated by xmake")
```

## xml.cdata

- Create a CDATA node

#### Function Prototype

::: tip API
```lua
xml.cdata(text: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| text | CDATA text |

#### Return Value

| Type | Description |
|------|-------------|
| table | CDATA node |

#### Usage

```lua
import("core.base.xml")

local cdata_node = xml.cdata("if (value < 1) {...}")
```

## xml.doctype

- Create a DOCTYPE node

#### Function Prototype

::: tip API
```lua
xml.doctype(declaration: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| declaration | DOCTYPE declaration string |

#### Return Value

| Type | Description |
|------|-------------|
| table | DOCTYPE node |

#### Usage

```lua
import("core.base.xml")

local doctype = xml.doctype('plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"')
```

## Complete Example

```lua
import("core.base.xml")

-- Parse XML string
local doc = assert(xml.decode([[
<?xml version="1.0"?>
<root id="1">
  <item id="foo">hello</item>
</root>
]]))

-- Find and modify nodes
local item = assert(xml.find(doc, "//item[@id='foo']"))
item.attrs.lang = "en"             -- mutate attrs directly
item.children = {xml.text("world")} -- replace existing text node

-- Add comment
table.insert(doc.children, xml.comment("generated by xmake"))

-- Encode with pretty printing
local pretty = assert(xml.encode(doc, {pretty = true}))
assert(xml.savefile("out.xml", doc, {pretty = true}))
```
