
# heap

The heap module provides priority queue data structures implemented as binary heaps. This is an extension module of xmake.

::: tip TIP
To use this module, you need to import it first: `import("core.base.heap")`
:::

## heap.valueheap

- Create a value heap

```lua
import("core.base.heap")

local h = heap.valueheap(options)
```

Creates a new value heap using a Lua table. The heap is a min-heap by default, but can be customized with a comparison function.

Parameters in `options`:
- `cmp` - Optional comparison function. Should return true if the first argument has higher priority than the second

```lua
-- Create a min-heap (default)
local h = heap.valueheap()

-- Create a max-heap
local h = heap.valueheap{
    cmp = function(a, b)
        return a > b
    end
}

-- Create a priority queue with custom objects
local h = heap.valueheap{
    cmp = function(a, b)
        return a.priority < b.priority
    end
}
```

Initialize with existing values:

```lua
-- Create heap with initial values
local h = heap.valueheap{1, 5, 3, 7, 2}
```

## heap:push

- Push a value onto the heap

```lua
heap:push(value)
```

Adds a value to the heap and maintains the heap property. The value will be placed in the correct position according to the comparison function.

```lua
local h = heap.valueheap()
h:push(10)
h:push(5)
h:push(20)
h:push(3)

print(h:peek())  -- Output: 3 (smallest value)
```

Push custom objects:

```lua
local h = heap.valueheap{
    cmp = function(a, b)
        return a.priority < b.priority
    end
}

h:push{priority = 20, data = 'low'}
h:push{priority = 10, data = 'high'}
h:push{priority = 15, data = 'medium'}

print(h:peek().data)  -- Output: high (priority 10)
```

::: tip TIP
The value cannot be nil.
:::

## heap:pop

- Pop a value from the heap

```lua
local value = heap:pop(index)
```

Removes and returns a value from the heap. If no index is provided, removes the top element (highest priority). After removal, the heap property is maintained.

Parameters:
- `index` - Optional. The position to pop from (1-based). Defaults to 1 (top of heap)

```lua
local h = heap.valueheap()
h:push(10)
h:push(5)
h:push(20)

local v1 = h:pop()  -- Returns 5 (smallest)
local v2 = h:pop()  -- Returns 10
local v3 = h:pop()  -- Returns 20
```

Pop with custom priority:

```lua
local h = heap.valueheap{
    cmp = function(a, b)
        return a.priority < b.priority
    end
}

h:push{priority = 20, data = 'bar'}
h:push{priority = 10, data = 'foo'}

local item = h:pop()
print(item.priority)  -- Output: 10
print(item.data)      -- Output: foo
```

## heap:peek

- Peek at a value without removing it

```lua
local value = heap:peek(index)
```

Returns a value from the heap without removing it. If no index is provided, returns the top element (highest priority).

Parameters:
- `index` - Optional. The position to peek at (1-based). Defaults to 1 (top of heap)

```lua
local h = heap.valueheap()
h:push(10)
h:push(5)
h:push(20)

print(h:peek())  -- Output: 5 (smallest)
print(h:peek())  -- Output: 5 (still there)

local v = h:pop()
print(h:peek())  -- Output: 10 (next smallest)
```

Check next task without processing:

```lua
local h = heap.valueheap{
    cmp = function(a, b)
        return a.priority < b.priority
    end
}

h:push{priority = 10, task = 'urgent'}
h:push{priority = 20, task = 'normal'}

if h:peek().priority < 15 then
    print("Processing urgent task")
    local task = h:pop()
end
```

## heap:replace

- Replace a value at a given index

```lua
heap:replace(index, value)
```

Replaces the value at the specified index with a new value and rebalances the heap to maintain the heap property.

Parameters:
- `index` - Required. The position to replace (1-based)
- `value` - Required. The new value

```lua
local h = heap.valueheap()
h:push(10)
h:push(5)
h:push(20)

-- Replace the top element
h:replace(1, 15)

print(h:pop())  -- Output: 10
print(h:pop())  -- Output: 15
print(h:pop())  -- Output: 20
```

Update priority in a priority queue:

```lua
local h = heap.valueheap{
    cmp = function(a, b)
        return a.priority < b.priority
    end
}

h:push{priority = 10, id = 1}
h:push{priority = 20, id = 2}
h:push{priority = 15, id = 3}

-- Update priority of element at index 2
h:replace(2, {priority = 5, id = 2})

print(h:pop().id)  -- Output: 2 (now has highest priority)
```

::: tip TIP
Use `replace` when you need to update an element's priority without removing and re-adding it, which is more efficient.
:::

## heap.length

- Get the number of elements in the heap

```lua
local count = heap.length()
```

Returns the current number of elements in the heap. This is a function, not a method.

```lua
local h = heap.valueheap()
h:push(10)
h:push(5)
h:push(20)

print(h.length())  -- Output: 3

h:pop()
print(h.length())  -- Output: 2
```

Check if heap is empty:

```lua
local h = heap.valueheap()

if h.length() == 0 then
    print("Heap is empty")
end

h:push(10)

if h.length() > 0 then
    print("Heap has", h.length(), "elements")
end
```

Process all elements:

```lua
local h = heap.valueheap()
h:push(10)
h:push(5)
h:push(20)

while h.length() > 0 do
    local v = h:pop()
    print(v)  -- Output: 5, 10, 20
end
```

::: tip TIP
The heap module implements a binary heap (priority queue) data structure. By default, it's a min-heap where the smallest element has the highest priority. You can customize the comparison function to create max-heaps or heaps based on custom priority criteria. Heap operations (push, pop, peek, replace) all have O(log n) time complexity.
:::

::: warning WARNING
- Pushed values cannot be nil
- Index is 1-based (Lua convention)
- Calling `pop()` on an empty heap will cause an error
- `length()` is a function, not a property, so use `h.length()` not `h.length`
:::

