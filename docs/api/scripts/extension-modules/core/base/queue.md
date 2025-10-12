
# queue

The queue module provides a First-In-First-Out (FIFO) queue data structure that supports efficient enqueue and dequeue operations. This is an extension module of xmake.

::: tip TIP
To use this module, you need to import it first: `import("core.base.queue")`
:::

## queue.new

- Create an empty queue

```lua
import("core.base.queue")

local q = queue.new()
```

Creates a new empty queue object.

```lua
local q = queue.new()
print(q:size())   -- Output: 0
print(q:empty())  -- Output: true
```

## queue:push

- Enqueue (add element to the end)

```lua
queue:push(item)
```

Adds an element to the end of the queue. This is a fundamental queue operation.

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)

print(q:size())   -- Output: 3
print(q:first())  -- Output: 1 (front element)
print(q:last())   -- Output: 3 (rear element)
```

The queue supports storing various types of values:

```lua
local q = queue.new()
q:push("hello")
q:push(123)
q:push({key = "value"})
q:push(true)
```

## queue:pop

- Dequeue (remove and return element from the front)

```lua
local item = queue:pop()
```

Removes and returns an element from the front of the queue. Returns nil if the queue is empty. This is a fundamental queue operation.

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)

local first = q:pop()
print(first)      -- Output: 1
print(q:first())  -- Output: 2 (new front element)
print(q:size())   -- Output: 2
```

Process the queue until empty:

```lua
local q = queue.new()
q:push(10)
q:push(20)
q:push(30)

while not q:empty() do
    local item = q:pop()
    print(item)  -- Output: 10, 20, 30
end
```

## queue:first

- Peek at the front element

```lua
local item = queue:first()
```

Returns the first element (front) of the queue without removing it. Returns nil if the queue is empty.

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)

print(q:first())  -- Output: 1
print(q:size())   -- Output: 3 (element not removed)
```

Used to check the next element to be processed:

```lua
local q = queue.new()
q:push("task1")
q:push("task2")

-- Peek without processing
if q:first() == "task1" then
    print("Next task is task1")
end
```

## queue:last

- Peek at the rear element

```lua
local item = queue:last()
```

Returns the last element (rear) of the queue without removing it. Returns nil if the queue is empty.

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)

print(q:last())   -- Output: 3
print(q:size())   -- Output: 3 (element not removed)
```

## queue:size

- Get queue size

```lua
local count = queue:size()
```

Returns the number of elements in the queue.

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)

print(q:size())  -- Output: 3

q:pop()
print(q:size())  -- Output: 2
```

## queue:empty

- Check if queue is empty

```lua
local is_empty = queue:empty()
```

Returns true if the queue is empty (contains no elements).

```lua
local q = queue.new()
print(q:empty())  -- Output: true

q:push(1)
print(q:empty())  -- Output: false
```

Used for processing queue in a loop:

```lua
local q = queue.new()
q:push("item1")
q:push("item2")
q:push("item3")

while not q:empty() do
    local item = q:pop()
    print("Processing:", item)
end
```

## queue:clear

- Clear the queue

```lua
queue:clear()
```

Removes all elements from the queue, resetting it to an empty queue.

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)

print(q:size())  -- Output: 3

q:clear()
print(q:size())  -- Output: 0
print(q:empty()) -- Output: true
```

## queue:clone

- Clone the queue

```lua
local new_queue = queue:clone()
```

Creates a complete copy of the queue, with the new queue being independent of the original.

Used for saving queue snapshots:

```lua
local q1 = queue.new()
q1:push(1)
q1:push(2)
q1:push(3)

local q2 = q1:clone()

-- Modifying the copy doesn't affect the original
q2:pop()
print(q1:size())  -- Output: 3 (original unchanged)
print(q2:size())  -- Output: 2 (copy modified)
```

## queue:items

- Iterate forward through the queue

```lua
for item in queue:items() do
    -- Process item
end
```

Returns an iterator function for traversing all elements in the queue from front to rear.

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)
q:push(4)
q:push(5)

for item in q:items() do
    print(item)  -- Output: 1, 2, 3, 4, 5
end
```

Verify queue order:

```lua
local q = queue.new()
q:push(10)
q:push(20)
q:push(30)

local idx = 1
local expected = {10, 20, 30}
for item in q:items() do
    assert(item == expected[idx])
    idx = idx + 1
end
```

::: tip TIP
Iteration does not modify the queue content; elements remain in the queue after iteration.
:::

## queue:ritems

- Iterate backward through the queue

```lua
for item in queue:ritems() do
    -- Process item
end
```

Returns an iterator function for traversing all elements in the queue from rear to front.

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)
q:push(4)
q:push(5)

for item in q:ritems() do
    print(item)  -- Output: 5, 4, 3, 2, 1
end
```

::: tip TIP
The queue module implements a standard FIFO (First-In-First-Out) queue, suitable for task scheduling, message queues, breadth-first search, and other scenarios. Both enqueue (push) and dequeue (pop) operations have O(1) time complexity.
:::

::: warning WARNING
- Queue is a FIFO structure; elements that are enqueued first are dequeued first
- `pop()` operation removes the element, `first()` only peeks without removing
- Calling `pop()` on an empty queue returns nil
- Iteration (`items()`, `ritems()`) does not modify queue content
:::

