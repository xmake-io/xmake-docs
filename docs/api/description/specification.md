## Naming conventions

The interface is named according to some of the predefined specifications, which is more convenient to understand and easy to use.

It's according to the following rules:

| Interfaces            | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `is_`/`has_` + xxx    | Condition interfaces                                             |
| `set_` + xxx          | Set and override the previous settings                           |
| `add_` + xxx          | Set and append settings                                          |
| `…s` + xxx *(plural)* | Support multi-parameters, .e.g：`add_files("*.c", "test.cpp")`   |
| `on_` + xxx           | Set and override builtin script                                  |
| `before_` + xxx       | Set and run this script before running builtin-script            |
| `after_` + xxx        | Set and run this script after running builtin-script             |
| `scope("name")`       | Define a description scope, .e.g `target("xxx")`, `option("xxx")`|
| scope/settings        | Indentation with spaces                                          |

