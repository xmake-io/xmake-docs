
# graph

The graph module provides graph data structure with support for both directed and undirected graphs. It includes functionality for topological sorting, cycle detection, and graph manipulation. This is an extension module of xmake.

::: tip TIP
To use this module, you need to import it first: `import("core.base.graph")`
:::

## graph.new

- Create a new graph

#### Function Prototype

::: tip API
```lua
graph.new(directed: <boolean>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| directed | Whether the graph is directed (true) or undirected (false) |

#### Usage

Creates a new graph object. The `directed` parameter specifies whether the graph is directed (true) or undirected (false).

```lua
-- Create a directed graph (DAG)
local dag = graph.new(true)

-- Create an undirected graph
local ug = graph.new(false)
```

## graph:clear

- Clear the graph

#### Function Prototype

::: tip API
```lua
graph:clear()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Removes all vertices and edges from the graph, resetting it to an empty state.

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)

print(#g:vertices())  -- Output: 3

g:clear()
print(#g:vertices())  -- Output: 0
print(g:empty())      -- Output: true
```

## graph:empty

- Check if the graph is empty

#### Function Prototype

::: tip API
```lua
graph:empty()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns true if the graph contains no vertices.

```lua
local g = graph.new(true)
print(g:empty())  -- Output: true

g:add_vertex(1)
print(g:empty())  -- Output: false
```

## graph:is_directed

- Check if the graph is directed

#### Function Prototype

::: tip API
```lua
graph:is_directed()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns true if the graph is directed, false if it's undirected.

```lua
local dag = graph.new(true)
print(dag:is_directed())  -- Output: true

local ug = graph.new(false)
print(ug:is_directed())   -- Output: false
```

## graph:vertices

- Get all vertices

#### Function Prototype

::: tip API
```lua
graph:vertices()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns an array containing all vertices in the graph.

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)
g:add_vertex(4)

local vertices = g:vertices()
for _, v in ipairs(vertices) do
    print(v)  -- Output: 1, 2, 3, 4
end
```

## graph:vertex

- Get vertex at the given index

#### Function Prototype

::: tip API
```lua
graph:vertex(idx: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| idx | Vertex index (1-based) |

#### Usage

Returns the vertex at the specified index (1-based).

```lua
local g = graph.new(true)
g:add_edge("a", "b")
g:add_edge("b", "c")

print(g:vertex(1))  -- Output: a
print(g:vertex(2))  -- Output: b
print(g:vertex(3))  -- Output: c
```

## graph:has_vertex

- Check if the graph has the given vertex

#### Function Prototype

::: tip API
```lua
graph:has_vertex(v: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| v | Vertex value to check |

#### Usage

Returns true if the vertex exists in the graph.

```lua
local g = graph.new(true)
g:add_vertex(1)
g:add_vertex(2)

print(g:has_vertex(1))  -- Output: true
print(g:has_vertex(3))  -- Output: false
```

## graph:add_vertex

- Add an isolated vertex

#### Function Prototype

::: tip API
```lua
graph:add_vertex(v: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| v | Vertex value to add |

#### Usage

Adds a vertex to the graph without any edges. If the vertex already exists, this operation has no effect.

```lua
local g = graph.new(true)
g:add_vertex(1)
g:add_vertex(2)
g:add_vertex(3)

print(#g:vertices())  -- Output: 3
print(#g:edges())     -- Output: 0
```

## graph:remove_vertex

- Remove the given vertex

#### Function Prototype

::: tip API
```lua
graph:remove_vertex(v: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| v | Vertex value to remove |

#### Usage

Removes a vertex and all its associated edges from the graph.

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)
g:add_edge(3, 4)

g:remove_vertex(2)
print(g:has_vertex(2))  -- Output: false
-- Edges 1->2 and 2->3 are also removed
```

## graph:edges

- Get all edges

#### Function Prototype

::: tip API
```lua
graph:edges()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns an array containing all edges in the graph. Each edge has `from()` and `to()` methods.

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)

for _, e in ipairs(g:edges()) do
    print(e:from(), "->", e:to())
    -- Output: 1 -> 2
    --         2 -> 3
end
```

## graph:adjacent_edges

- Get adjacent edges of the given vertex

#### Function Prototype

::: tip API
```lua
graph:adjacent_edges(v: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| v | Vertex value |

#### Usage

Returns an array of edges that are adjacent to the specified vertex.

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(1, 3)
g:add_edge(2, 3)

local edges = g:adjacent_edges(1)
for _, e in ipairs(edges) do
    print(e:from(), "->", e:to())
    -- Output: 1 -> 2
    --         1 -> 3
end
```

## graph:add_edge

- Add an edge

#### Function Prototype

::: tip API
```lua
graph:add_edge(from: <any>, to: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| from | Source vertex |
| to | Target vertex |

#### Usage

Adds a directed edge from `from` to `to`. For undirected graphs, this creates a bidirectional connection. Automatically creates vertices if they don't exist.

```lua
-- Directed graph
local dag = graph.new(true)
dag:add_edge("a", "b")
dag:add_edge("b", "c")

-- Undirected graph
local ug = graph.new(false)
ug:add_edge(1, 2)
-- For undirected graphs, both 1->2 and 2->1 are connected
```

## graph:has_edge

- Check if the graph has the given edge

#### Function Prototype

::: tip API
```lua
graph:has_edge(from: <any>, to: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| from | Source vertex |
| to | Target vertex |

#### Usage

Returns true if an edge exists from `from` to `to`.

```lua
local g = graph.new(true)
g:add_edge(1, 2)

print(g:has_edge(1, 2))  -- Output: true
print(g:has_edge(2, 1))  -- Output: false (directed graph)
```

## graph:topo_sort

- Perform topological sort

#### Function Prototype

::: tip API
```lua
graph:topo_sort()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Performs a topological sort on a directed graph using Kahn's algorithm. Returns an array of vertices in topological order and a boolean indicating if a cycle was detected. Only works on directed graphs.

```lua
local dag = graph.new(true)
dag:add_edge(0, 5)
dag:add_edge(0, 2)
dag:add_edge(0, 1)
dag:add_edge(3, 6)
dag:add_edge(3, 5)
dag:add_edge(3, 4)
dag:add_edge(5, 4)
dag:add_edge(6, 4)
dag:add_edge(6, 0)
dag:add_edge(3, 2)
dag:add_edge(1, 4)

local order, has_cycle = dag:topo_sort()
if not has_cycle then
    for _, v in ipairs(order) do
        print(v)  -- Output: vertices in topological order
    end
else
    print("Graph has cycle!")
end
```

::: tip TIP
Topological sort is only applicable to directed acyclic graphs (DAGs). If a cycle is detected, the `has_cycle` flag will be true.
:::

## graph:partial_topo_sort_reset

- Reset partial topological sort state

#### Function Prototype

::: tip API
```lua
graph:partial_topo_sort_reset()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Resets the internal state for partial topological sorting. This must be called before starting a new partial topological sort.

```lua
local dag = graph.new(true)
dag:add_edge(1, 2)
dag:add_edge(2, 3)

dag:partial_topo_sort_reset()
-- Now ready for partial topological sorting
```

## graph:partial_topo_sort_next

- Get next node in topological order

#### Function Prototype

::: tip API
```lua
graph:partial_topo_sort_next()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the next node with zero in-degree in the topological sort. Returns nil when complete or if a cycle is detected. The `has_cycle` flag indicates if a cycle was detected.

```lua
local dag = graph.new(true)
dag:add_edge("a", "b")
dag:add_edge("b", "c")

dag:partial_topo_sort_reset()

local order_vertices = {}
while true do
    local node, has_cycle = dag:partial_topo_sort_next()
    if node then
        table.insert(order_vertices, node)
        dag:partial_topo_sort_remove(node)
    else
        if has_cycle then
            print("Cycle detected!")
        end
        break
    end
end

-- order_vertices = {"a", "b", "c"}
```

::: tip TIP
Partial topological sort allows you to process nodes incrementally and supports dynamic graph modifications during the sort.
:::

## graph:partial_topo_sort_remove

- Remove node and update in-degrees

#### Function Prototype

::: tip API
```lua
graph:partial_topo_sort_remove(node: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| node | Node to remove from the sort |

#### Usage

Removes the specified node from the partial topological sort and updates the in-degrees of its dependent nodes. This should be called after processing each node from `partial_topo_sort_next()`.

```lua
local dag = graph.new(true)
dag:add_edge(1, 2)
dag:add_edge(2, 3)

dag:partial_topo_sort_reset()

local node, has_cycle = dag:partial_topo_sort_next()
if node then
    print("Processing node:", node)
    dag:partial_topo_sort_remove(node)
    -- This updates in-degrees for nodes dependent on this node
end
```

## graph:find_cycle

- Find cycle in the graph

#### Function Prototype

::: tip API
```lua
graph:find_cycle()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Searches for a cycle in the graph using depth-first search. Returns an array of vertices that form a cycle, or nil if no cycle exists.

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)
g:add_edge(3, 1)  -- Creates a cycle

local cycle = g:find_cycle()
if cycle then
    print("Found cycle:")
    for _, v in ipairs(cycle) do
        print(v)  -- Output: 1, 2, 3 (forming a cycle)
    end
end
```

## graph:clone

- Clone the graph

#### Function Prototype

::: tip API
```lua
graph:clone()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Creates a complete copy of the graph with all vertices and edges. The new graph is independent of the original.

```lua
local g1 = graph.new(true)
g1:add_edge(1, 2)
g1:add_edge(2, 3)

local g2 = g1:clone()

-- Modifying the copy doesn't affect the original
g2:add_edge(3, 4)
print(#g1:edges())  -- Output: 2 (original unchanged)
print(#g2:edges())  -- Output: 3 (copy modified)
```

## graph:reverse

- Reverse the graph

#### Function Prototype

::: tip API
```lua
graph:reverse()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Creates a new graph with all edges reversed. For directed graphs, this reverses the direction of all edges. For undirected graphs, this is equivalent to `clone()`.

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)

local rg = g:reverse()

-- Original: 1 -> 2 -> 3
-- Reversed: 1 <- 2 <- 3
print(rg:has_edge(2, 1))  -- Output: true
print(rg:has_edge(3, 2))  -- Output: true
```

## graph:dump

- Dump graph information

#### Function Prototype

::: tip API
```lua
graph:dump()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Prints detailed information about the graph including all vertices and edges. Useful for debugging.

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)

g:dump()
-- Output:
-- graph: directed, vertices: 3, edges: 2
-- vertices:
--   1
--   2
--   3
-- edges:
--   1 -> 2
--   2 -> 3
```

::: tip TIP
The graph module is useful for modeling dependencies, scheduling tasks, analyzing relationships, and detecting cycles. It supports both directed and undirected graphs and provides efficient algorithms for common graph operations.
:::

::: warning WARNING
- Topological sort only works on directed graphs
- Removing a vertex also removes all its associated edges
- For undirected graphs, `add_edge(a, b)` creates a bidirectional connection
- Partial topological sort supports dynamic graph modifications during the sort
:::

