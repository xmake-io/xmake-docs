
# graph

graph 模块提供了图数据结构，支持有向图和无向图。它包含拓扑排序、环检测和图操作等功能。这是 xmake 的扩展模块。

::: tip 提示
使用此模块需要先导入：`import("core.base.graph")`
:::

## graph.new

- 创建新图

```lua
import("core.base.graph")

local g = graph.new(directed)
```

创建一个新的图对象。`directed` 参数指定图是有向图（true）还是无向图（false）。

```lua
-- 创建有向图（DAG）
local dag = graph.new(true)

-- 创建无向图
local ug = graph.new(false)
```

## graph:clear

- 清空图

```lua
graph:clear()
```

删除图中的所有顶点和边，将其重置为空状态。

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)

print(#g:vertices())  -- 输出: 3

g:clear()
print(#g:vertices())  -- 输出: 0
print(g:empty())      -- 输出: true
```

## graph:empty

- 判断图是否为空

```lua
local is_empty = graph:empty()
```

如果图不包含任何顶点，返回 true。

```lua
local g = graph.new(true)
print(g:empty())  -- 输出: true

g:add_vertex(1)
print(g:empty())  -- 输出: false
```

## graph:is_directed

- 判断是否为有向图

```lua
local directed = graph:is_directed()
```

如果图是有向图返回 true，无向图返回 false。

```lua
local dag = graph.new(true)
print(dag:is_directed())  -- 输出: true

local ug = graph.new(false)
print(ug:is_directed())   -- 输出: false
```

## graph:vertices

- 获取所有顶点

```lua
local vertices = graph:vertices()
```

返回包含图中所有顶点的数组。

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)
g:add_vertex(4)

local vertices = g:vertices()
for _, v in ipairs(vertices) do
    print(v)  -- 输出: 1, 2, 3, 4
end
```

## graph:vertex

- 获取指定索引的顶点

```lua
local v = graph:vertex(idx)
```

返回指定索引（从 1 开始）的顶点。

```lua
local g = graph.new(true)
g:add_edge("a", "b")
g:add_edge("b", "c")

print(g:vertex(1))  -- 输出: a
print(g:vertex(2))  -- 输出: b
print(g:vertex(3))  -- 输出: c
```

## graph:has_vertex

- 判断图中是否存在给定顶点

```lua
local exists = graph:has_vertex(v)
```

如果顶点存在于图中，返回 true。

```lua
local g = graph.new(true)
g:add_vertex(1)
g:add_vertex(2)

print(g:has_vertex(1))  -- 输出: true
print(g:has_vertex(3))  -- 输出: false
```

## graph:add_vertex

- 添加孤立顶点

```lua
graph:add_vertex(v)
```

向图中添加一个没有边的顶点。如果顶点已存在，此操作无效。

```lua
local g = graph.new(true)
g:add_vertex(1)
g:add_vertex(2)
g:add_vertex(3)

print(#g:vertices())  -- 输出: 3
print(#g:edges())     -- 输出: 0
```

## graph:remove_vertex

- 删除给定顶点

```lua
graph:remove_vertex(v)
```

从图中删除顶点及其所有关联的边。

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)
g:add_edge(3, 4)

g:remove_vertex(2)
print(g:has_vertex(2))  -- 输出: false
-- 边 1->2 和 2->3 也被删除
```

## graph:edges

- 获取所有边

```lua
local edges = graph:edges()
```

返回包含图中所有边的数组。每条边都有 `from()` 和 `to()` 方法。

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)

for _, e in ipairs(g:edges()) do
    print(e:from(), "->", e:to())
    -- 输出: 1 -> 2
    --      2 -> 3
end
```

## graph:adjacent_edges

- 获取给定顶点的邻接边

```lua
local edges = graph:adjacent_edges(v)
```

返回与指定顶点相邻的边的数组。

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(1, 3)
g:add_edge(2, 3)

local edges = g:adjacent_edges(1)
for _, e in ipairs(edges) do
    print(e:from(), "->", e:to())
    -- 输出: 1 -> 2
    --      1 -> 3
end
```

## graph:add_edge

- 添加边

```lua
graph:add_edge(from, to)
```

添加一条从 `from` 到 `to` 的有向边。对于无向图，这会创建双向连接。如果顶点不存在，会自动创建。

```lua
-- 有向图
local dag = graph.new(true)
dag:add_edge("a", "b")
dag:add_edge("b", "c")

-- 无向图
local ug = graph.new(false)
ug:add_edge(1, 2)
-- 对于无向图，1->2 和 2->1 都是连通的
```

## graph:has_edge

- 判断图中是否存在给定边

```lua
local exists = graph:has_edge(from, to)
```

如果存在从 `from` 到 `to` 的边，返回 true。

```lua
local g = graph.new(true)
g:add_edge(1, 2)

print(g:has_edge(1, 2))  -- 输出: true
print(g:has_edge(2, 1))  -- 输出: false (有向图)
```

## graph:topo_sort

- 执行拓扑排序

```lua
local order, has_cycle = graph:topo_sort()
```

使用 Kahn 算法对有向图执行拓扑排序。返回按拓扑顺序排列的顶点数组和一个表示是否检测到环的布尔值。仅适用于有向图。

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
        print(v)  -- 输出: 按拓扑顺序排列的顶点
    end
else
    print("图中存在环！")
end
```

::: tip 提示
拓扑排序仅适用于有向无环图（DAG）。如果检测到环，`has_cycle` 标志将为 true。
:::

## graph:partial_topo_sort_reset

- 重置部分拓扑排序状态

```lua
graph:partial_topo_sort_reset()
```

重置部分拓扑排序的内部状态。在开始新的部分拓扑排序之前必须调用此方法。

```lua
local dag = graph.new(true)
dag:add_edge(1, 2)
dag:add_edge(2, 3)

dag:partial_topo_sort_reset()
-- 现在可以进行部分拓扑排序
```

## graph:partial_topo_sort_next

- 获取拓扑顺序中的下一个节点

```lua
local node, has_cycle = graph:partial_topo_sort_next()
```

返回拓扑排序中入度为零的下一个节点。完成或检测到环时返回 nil。`has_cycle` 标志指示是否检测到环。

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
            print("检测到环！")
        end
        break
    end
end

-- order_vertices = {"a", "b", "c"}
```

::: tip 提示
部分拓扑排序允许您增量处理节点，并支持在排序过程中动态修改图。
:::

## graph:partial_topo_sort_remove

- 删除节点并更新入度

```lua
graph:partial_topo_sort_remove(node)
```

从部分拓扑排序中删除指定节点，并更新其依赖节点的入度。应在处理完 `partial_topo_sort_next()` 返回的每个节点后调用此方法。

```lua
local dag = graph.new(true)
dag:add_edge(1, 2)
dag:add_edge(2, 3)

dag:partial_topo_sort_reset()

local node, has_cycle = dag:partial_topo_sort_next()
if node then
    print("处理节点:", node)
    dag:partial_topo_sort_remove(node)
    -- 这会更新依赖此节点的节点的入度
end
```

## graph:find_cycle

- 查找图中的环

```lua
local cycle = graph:find_cycle()
```

使用深度优先搜索在图中查找环。返回构成环的顶点数组，如果不存在环则返回 nil。

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)
g:add_edge(3, 1)  -- 创建一个环

local cycle = g:find_cycle()
if cycle then
    print("找到环:")
    for _, v in ipairs(cycle) do
        print(v)  -- 输出: 1, 2, 3 (形成一个环)
    end
end
```

## graph:clone

- 克隆图

```lua
local new_graph = graph:clone()
```

创建图的完整副本，包含所有顶点和边。新图与原图独立。

```lua
local g1 = graph.new(true)
g1:add_edge(1, 2)
g1:add_edge(2, 3)

local g2 = g1:clone()

-- 修改副本不影响原图
g2:add_edge(3, 4)
print(#g1:edges())  -- 输出: 2 (原图不变)
print(#g2:edges())  -- 输出: 3 (副本已修改)
```

## graph:reverse

- 反转图

```lua
local reversed = graph:reverse()
```

创建一个所有边都反转的新图。对于有向图，这会反转所有边的方向。对于无向图，这等同于 `clone()`。

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)

local rg = g:reverse()

-- 原图: 1 -> 2 -> 3
-- 反转: 1 <- 2 <- 3
print(rg:has_edge(2, 1))  -- 输出: true
print(rg:has_edge(3, 2))  -- 输出: true
```

## graph:dump

- 输出图信息

```lua
graph:dump()
```

打印图的详细信息，包括所有顶点和边。用于调试。

```lua
local g = graph.new(true)
g:add_edge(1, 2)
g:add_edge(2, 3)

g:dump()
-- 输出:
-- graph: directed, vertices: 3, edges: 2
-- vertices:
--   1
--   2
--   3
-- edges:
--   1 -> 2
--   2 -> 3
```

::: tip 提示
graph 模块适用于建模依赖关系、调度任务、分析关系和检测环。它支持有向图和无向图，并为常见的图操作提供了高效的算法。
:::

::: warning 注意
- 拓扑排序仅适用于有向图
- 删除顶点也会删除其所有关联的边
- 对于无向图，`add_edge(a, b)` 会创建双向连接
- 部分拓扑排序支持在排序过程中动态修改图
:::

