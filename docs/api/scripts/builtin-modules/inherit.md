
# inherit

- Import and inherit base class modules

This is equivalent to the `inherit` mode of the [import](/api/scripts/builtin-modules/import) interface, which is:

```lua
import("xxx.xxx", {inherit = true})
```

With the `inherit` interface, it will be more concise:

```lu
Inherit("xxx.xxx")
```

For an example, see the script in the xmake tools directory: [clang.lua](https://github.com/xmake-io/xmake/blob/master/xmake/tools/clang.lua)

This is part of the clang tool module that inherits gcc.
