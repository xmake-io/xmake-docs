
# hashset

The hashset module provides a hash set data structure (a collection with no duplicate elements) for efficiently storing and querying unique values. This is an extension module of xmake.

::: tip TIP
To use this module, you need to import it first: `import("core.base.hashset")`
:::

## hashset.new

- Create an empty hash set

```lua
import("core.base.hashset")

local set = hashset.new()
```

Creates an empty hash set object.

```lua
local set = hashset.new()
print(set:size())   -- Output: 0
print(set:empty())  -- Output: true
```

## hashset.of

- Create hash set from parameter list

```lua
import("core.base.hashset")

local set = hashset.of(1, 2, 3, 5, 5, 7, 1, 9)
```

Creates a hash set from a parameter list, automatically removing duplicate elements.

This is a convenient way to create and initialize a set:

```lua
local set = hashset.of(1, 2, 3, 5, 5, 7, 1, 9, 4, 6, 8, 0)
print(set:size())  -- Output: 10 (duplicates 1 and 5 removed)

-- Verify elements
assert(set:has(1))
assert(set:has(5))
assert(not set:has(10))
```

## hashset.from

- Create hash set from array

```lua
import("core.base.hashset")

local set = hashset.from(array)
```

Creates a hash set from an array, automatically removing duplicate elements.

Used for deduplicating arrays:

```lua
local array = {1, 2, 3, 2, 4, 3, 5}
local set = hashset.from(array)
print(set:size())  -- Output: 5

-- Convert back to array (deduplicated)
local unique_array = set:to_array()
```

## hashset:insert

- Insert an element

```lua
local inserted = set:insert(value)
```

Inserts an element into the hash set. If the element already exists, it will not be inserted.

Return value:
- `true`: Element doesn't exist, insertion successful
- `false`: Element already exists, not inserted

```lua
local set = hashset.new()

local result = set:insert(1)
print(result)  -- Output: true (insertion successful)

local result = set:insert(1)
print(result)  -- Output: false (element already exists)

print(set:size())  -- Output: 1
```

Supports inserting various types of values, including strings, numbers, tables, nil, etc.:

```lua
local set = hashset.new()
set:insert("hello")
set:insert(123)
set:insert({key = "value"})
set:insert(nil)  -- Can also insert nil value
```

## hashset:remove

- Remove an element

```lua
local removed = set:remove(value)
```

Removes an element from the hash set.

Return value:
- `true`: Element exists, removal successful
- `false`: Element doesn't exist, not removed

```lua
local set = hashset.of(1, 2, 3)

local result = set:remove(2)
print(result)  -- Output: true (removal successful)
print(set:size())  -- Output: 2

local result = set:remove(10)
print(result)  -- Output: false (element doesn't exist)
```

## hashset:has

- Check if element exists

```lua
local exists = set:has(value)
```

Checks if the specified element is in the hash set.

Return value:
- `true`: Element exists
- `false`: Element doesn't exist

Used for fast element lookup (O(1) time complexity):

```lua
local set = hashset.of(1, 2, 3, 4, 5)

if set:has(3) then
    print("Set contains 3")
end

if not set:has(10) then
    print("Set doesn't contain 10")
end
```

## hashset:size

- Get set size

```lua
local count = set:size()
```

Returns the number of elements in the hash set.

```lua
local set = hashset.of(1, 2, 3, 4, 5)
print(set:size())  -- Output: 5

set:insert(6)
print(set:size())  -- Output: 6

set:remove(1)
print(set:size())  -- Output: 5
```

## hashset:empty

- Check if set is empty

```lua
local is_empty = set:empty()
```

Returns true if the set is empty (contains no elements).

```lua
local set = hashset.new()
print(set:empty())  -- Output: true

set:insert(1)
print(set:empty())  -- Output: false
```

## hashset:clear

- Clear the set

```lua
set:clear()
```

Removes all elements from the set, resetting it to an empty set.

```lua
local set = hashset.of(1, 2, 3, 4, 5)
print(set:size())  -- Output: 5

set:clear()
print(set:size())  -- Output: 0
print(set:empty()) -- Output: true
```

## hashset:clone

- Clone the set

```lua
local new_set = set:clone()
```

Creates a complete copy of the hash set, with the new set being independent of the original.

Used for saving snapshots of the set or creating copies:

```lua
local set1 = hashset.of(1, 2, 3)
local set2 = set1:clone()

-- Modifying the copy doesn't affect the original
set2:insert(4)
print(set1:size())  -- Output: 3
print(set2:size())  -- Output: 4

-- Compare sets for equality
set2:remove(4)
assert(set1 == set2)  -- Equal
```

## hashset:to_array

- Convert to array

```lua
local array = set:to_array()
```

Converts the hash set to an array, returning a table containing all elements. nil values are ignored.

Commonly used for array deduplication:

```lua
local array = {1, 2, 3, 2, 4, 3, 5, 1}
local set = hashset.from(array)
local unique_array = set:to_array()
-- unique_array contains: {1, 2, 3, 4, 5} (order may vary)

print("Original array size:", #array)         -- 8
print("Deduplicated size:", #unique_array)    -- 5
```

## hashset:items

- Iterate over set elements

```lua
for item in set:items() do
    -- Process item
end
```

Returns an iterator function for traversing all elements in the set (unordered).

```lua
local set = hashset.of("apple", "banana", "orange")

for item in set:items() do
    print(item)
end
-- Output order is indeterminate: might be apple, orange, banana
```

Used for checking all elements in the set:

```lua
local set = hashset.of(1, 2, 3, 4, 5)

-- Check all elements
for item in set:items() do
    assert(set:has(item))
end

-- Calculate sum
local sum = 0
for item in set:items() do
    sum = sum + item
end
print("Sum:", sum)  -- Output: 15
```

## hashset:orderitems

- Iterate over set elements in order

```lua
for item in set:orderitems() do
    -- Process item
end
```

Returns an iterator function for traversing all elements in the set in ascending order.

Suitable for scenarios requiring ordered output:

```lua
local set = hashset.of(5, 2, 8, 1, 9, 3)

print("Unordered iteration:")
for item in set:items() do
    print(item)  -- Order is indeterminate
end

print("Ordered iteration:")
for item in set:orderitems() do
    print(item)  -- Output: 1, 2, 3, 5, 8, 9
end
```

Verify ordering:

```lua
local set = hashset.of(9, 1, 5, 3, 7, 2, 8, 4, 6, 0)

local prev = -1
for item in set:orderitems() do
    assert(item > prev)  -- Each element is greater than the previous
    prev = item
end
```

hashset also supports comparing two sets for equality using the `==` operator (containing the same elements):

```lua
local set1 = hashset.of(1, 2, 3)
local set2 = hashset.of(3, 2, 1)
local set3 = hashset.of(1, 2, 4)

assert(set1 == set2)        -- true (same elements, order irrelevant)
assert(not (set1 == set3))  -- false (different elements)
```

::: tip TIP
hashset provides O(1) time complexity for insert, delete, and lookup operations, much more efficient than linear search using arrays. Suitable for scenarios requiring frequent element existence checks or deduplication.
:::

::: warning WARNING
- Elements in hashset are unordered; order is indeterminate when iterating with `items()`
- Use `orderitems()` for ordered iteration
- hashset automatically removes duplicate elements
- nil values can be stored in hashset
:::

