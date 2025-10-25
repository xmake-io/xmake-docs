
# list

The list module provides a doubly linked list data structure that supports efficient insertion and deletion operations at both ends. This is an extension module of xmake.

::: tip TIP
To use this module, you need to import it first: `import("core.base.list")`
:::

## list.new

- Create an empty linked list

#### Function Prototype

::: tip API
```lua
list.new()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Creates a new empty doubly linked list object.

```lua
local l = list.new()
print(l:size())   -- Output: 0
print(l:empty())  -- Output: true
```

## list:push

- Add element to the end of the list

#### Function Prototype

::: tip API
```lua
list:push(item: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| item | Required. The element to add |

#### Usage

Adds an element to the end of the list. Equivalent to `list:insert_last(item)`.

This is the most common way to add elements:

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

print(l:size())        -- Output: 3
print(l:first().value) -- Output: 1
print(l:last().value)  -- Output: 3
```

::: tip TIP
The list stores references to elements, not copies. You can store values of any type (numbers, strings, tables, etc.).
:::

## list:pop

- Remove element from the end of the list

#### Function Prototype

::: tip API
```lua
list:pop()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Removes an element from the end of the list. Equivalent to `list:remove_last()`.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

l:pop()
print(l:last().value)  -- Output: 2
```

## list:unshift

- Add element to the beginning of the list

#### Function Prototype

::: tip API
```lua
list:unshift(item: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| item | Required. The element to add |

#### Usage

Adds an element to the beginning of the list. Equivalent to `list:insert_first(item)`.

```lua
local l = list.new()
l:push({value = 2})
l:push({value = 3})
l:unshift({value = 1})

for item in l:items() do
    print(item.value)  -- Output: 1, 2, 3
end
```

## list:shift

- Remove element from the beginning of the list

#### Function Prototype

::: tip API
```lua
list:shift()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Removes an element from the beginning of the list. Equivalent to `list:remove_first()`.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

l:shift()
print(l:first().value)  -- Output: 2
```

## list:insert

- Insert an element

#### Function Prototype

::: tip API
```lua
list:insert(item: <any>, after: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| item | Required. The element to insert |
| after | Optional. Insert after this element; if nil, inserts at the end |

#### Usage

Inserts a new element after the specified element. If the `after` parameter is not provided, inserts at the end of the list.

```lua
local l = list.new()
local v3 = {value = 3}
l:insert({value = 1})
l:insert({value = 2})
l:insert(v3)
l:insert({value = 5})
l:insert({value = 4}, v3)  -- Insert {value = 4} after v3

local idx = 1
for item in l:items() do
    print(item.value)  -- Output: 1, 2, 3, 4, 5
    idx = idx + 1
end
```

## list:insert_first

- Insert element at the beginning

#### Function Prototype

::: tip API
```lua
list:insert_first(item: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| item | Required. The element to insert |

#### Usage

Inserts an element at the beginning of the list.

Used for scenarios requiring insertion at the head:

```lua
local l = list.new()
l:push({value = 2})
l:push({value = 3})
l:insert_first({value = 1})

print(l:first().value)  -- Output: 1
```

## list:insert_last

- Insert element at the end

#### Function Prototype

::: tip API
```lua
list:insert_last(item: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| item | Required. The element to insert |

#### Usage

Inserts an element at the end of the list.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:insert_last({value = 3})

print(l:last().value)  -- Output: 3
```

## list:remove

- Remove specified element

#### Function Prototype

::: tip API
```lua
list:remove(item: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| item | Required. The element to remove |

#### Usage

Removes the specified element from the list and returns the removed element.

```lua
local l = list.new()
local v3 = {value = 3}
l:push({value = 1})
l:push({value = 2})
l:push(v3)
l:push({value = 4})
l:push({value = 5})

l:remove(v3)
print(l:size())  -- Output: 4
```

Safe way to remove elements during iteration:

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

-- Iterate and remove all elements
local item = l:first()
while item ~= nil do
    local next = l:next(item)
    l:remove(item)
    item = next
end
print(l:empty())  -- Output: true
```

## list:remove_first

- Remove element from the beginning

#### Function Prototype

::: tip API
```lua
list:remove_first()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Removes an element from the beginning of the list and returns the removed element. Returns nil if the list is empty.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

l:remove_first()
print(l:first().value)  -- Output: 2
```

## list:remove_last

- Remove element from the end

#### Function Prototype

::: tip API
```lua
list:remove_last()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Removes an element from the end of the list and returns the removed element. Returns nil if the list is empty.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

l:remove_last()
print(l:last().value)  -- Output: 2
```

## list:first

- Get the first element

#### Function Prototype

::: tip API
```lua
list:first()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the first element of the list without removing it. Returns nil if the list is empty.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

print(l:first().value)  -- Output: 1
```

## list:last

- Get the last element

#### Function Prototype

::: tip API
```lua
list:last()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the last element of the list without removing it. Returns nil if the list is empty.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

print(l:last().value)  -- Output: 3
```

## list:next

- Get the next element

#### Function Prototype

::: tip API
```lua
list:next(current: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| current | Optional. The current element; if nil, returns the first element |

#### Usage

Gets the next element after the specified element. If `current` is nil, returns the first element.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

local first = l:first()
local second = l:next(first)
print(second.value)  -- Output: 2
```

Used for manual iteration:

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

local item = l:next(nil)  -- Get the first element
while item do
    print(item.value)
    item = l:next(item)
end
```

## list:prev

- Get the previous element

#### Function Prototype

::: tip API
```lua
list:prev(current: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| current | Optional. The current element; if nil, returns the last element |

#### Usage

Gets the previous element before the specified element. If `current` is nil, returns the last element.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

local last = l:last()
local second = l:prev(last)
print(second.value)  -- Output: 2
```

Used for reverse iteration:

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

local item = l:prev(nil)  -- Get the last element
while item do
    print(item.value)  -- Output: 3, 2, 1
    item = l:prev(item)
end
```

## list:size

- Get list size

#### Function Prototype

::: tip API
```lua
list:size()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the number of elements in the list.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

print(l:size())  -- Output: 3
```

## list:empty

- Check if list is empty

#### Function Prototype

::: tip API
```lua
list:empty()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns true if the list is empty (contains no elements).

```lua
local l = list.new()
print(l:empty())  -- Output: true

l:push({value = 1})
print(l:empty())  -- Output: false
```

## list:clear

- Clear the list

#### Function Prototype

::: tip API
```lua
list:clear()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Removes all elements from the list, resetting it to an empty list.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

l:clear()
print(l:empty())  -- Output: true
print(l:size())   -- Output: 0
```

## list:items

- Iterate forward through the list

#### Function Prototype

::: tip API
```lua
list:items()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns an iterator function for traversing all elements in the list from head to tail.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

for item in l:items() do
    print(item.value)  -- Output: 1, 2, 3
end
```

Verify order:

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})
l:push({value = 4})
l:push({value = 5})

local idx = 1
for item in l:items() do
    assert(item.value == idx)
    idx = idx + 1
end
```

## list:ritems

- Iterate backward through the list

#### Function Prototype

::: tip API
```lua
list:ritems()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns an iterator function for traversing all elements in the list from tail to head.

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

for item in l:ritems() do
    print(item.value)  -- Output: 3, 2, 1
end
```

Reverse iteration with deletion:

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})
l:push({value = 4})
l:push({value = 5})

local item = l:last()
while item ~= nil do
    local prev = l:prev(item)
    l:remove(item)
    item = prev
end
print(l:empty())  -- Output: true
```

::: tip TIP
The list module implements a doubly linked list, providing O(1) time complexity for insertion and deletion operations at both ends. Suitable for scenarios requiring frequent operations at both ends, such as queues, stacks, LRU caches, etc.
:::

::: warning WARNING
- The list stores references to elements; modifying elements will affect the content in the list
- When deleting elements during iteration, be careful to first obtain the reference to the next/previous element
- The time complexity of insertion or deletion operations is O(1) (if you have the element reference)
:::

